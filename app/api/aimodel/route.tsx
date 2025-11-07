import { auth, currentUser } from "@clerk/nextjs/server";
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { aj } from "@/utils/arcjet";
  
// Validate API key on initialization
if (!process.env.OPENROUTER_API_KEY) {
  console.error('OPENROUTER_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

const PROMPT = `You are an AI Trip Planner Agent. Your goal is to help the user plan a trip by asking one relevant trip-related question at a time.
Only ask questions about the following details in order, and wait for the user's answer before asking the next:
1. Starting location (source)
2. Destination city or country
3. Group size (Solo, Couple, Family, Friends)
4. Budget (Low, Medium, High)
5. Trip duration (number of days)
6. Travel interests (e.g., adventure, sightseeing, cultural, food, nightlife, relaxation)
7. Special requirements or preferences (if any)

Do not ask multiple questions at once, and never ask irrelevant questions.
If any answer is missing or unclear, politely ask the user to clarify before proceeding.
Always maintain a conversational, interactive style while asking questions.

Along with response also send which UI component to display for generative UI. For example: 'budget', 'groupSize', 'tripDuration', 'final', or 'none'. 
Where 'final' means AI is generating complete final output.

Once all required information is collected, generate and return a strict JSON response only (no explanations or extra text) with following strictly JSON only schema:
{
  "resp": "Text Response",
  "ui": "budget|groupSize|tripDuration|final|none"
}

Rules:
- Use one UI for one specific information only.
- Use only "source", "groupSize", "budget", "tripDuration", or "final" when UI is needed.
- Never return explanations, only valid JSON. 
- Summarize user inputs concisely in the final output.`;

const FINAL_PROMPT = `You are an expert travel planner. Based on the conversation history, extract all the trip details the user has provided:
- Origin/Starting location
- Destination
- Group size
- Budget
- Trip duration (number of days)
- Travel interests
- Any special requirements

Then generate a comprehensive travel plan with the following requirements:

1. Hotels: Provide 3-5 hotel options with:
   - Real hotel names (use actual hotels from the destination)
   - Complete addresses
   - Realistic prices per night based on the budget level
   - Hotel image URLs (use placeholder URLs like https://images.unsplash.com/photo-[id] or similar)
   - Accurate geo coordinates (latitude and longitude)
   - Ratings (between 3.5 and 5.0)
   - Detailed descriptions

2. Itinerary: Create a day-by-day plan with:
   - Day number (1, 2, 3, etc.)
   - Day plan summary
   - Best time to visit for that day
   - Activities for each day (2-4 activities per day) with:
     * Real place names (use actual attractions/places from the destination)
     * Detailed place descriptions
     * Place image URLs (use placeholder URLs)
     * Accurate geo coordinates
     * Complete addresses
     * Ticket pricing information
     * Time to travel between locations
     * Best time to visit each place

IMPORTANT:
- Use realistic and accurate data. Research actual places and hotels for the destination.
- Ensure geo coordinates are accurate for the destination.
- Make prices realistic based on the budget level (Low/Medium/High).
- Ensure the itinerary makes logical sense (places should be close to each other on the same day).
- All image URLs should be valid placeholder URLs.
- Return ONLY valid JSON, no explanations or additional text.

Output Schema (return this exact structure):
{
  "trip_plan": {
    "destination": "string",
    "duration": "string",
    "origin": "string",
    "budget": "string",
    "group_size": "string",
    "hotels": [
      {
        "hotel_name": "string",
        "hotel_address": "string",
        "price_per_night": "string",
        "hotel_image_url": "string",
        "geo_coordinates": {
          "latitude": 0.0,
          "longitude": 0.0
        },
        "rating": 0.0,
        "description": "string"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "day_plan": "string",
        "best_time_to_visit_day": "string",
        "activities": [
          {
            "place_name": "string",
            "place_details": "string",
            "place_image_url": "string",
            "geo_coordinates": {
              "latitude": 0.0,
              "longitude": 0.0
            },
            "place_address": "string",
            "ticket_pricing": "string",
            "time_travel_each_location": "string",
            "best_time_to_visit": "string"
          }
        ]
      }
    ]
  }
}`;

export async function POST(req: NextRequest) {
  try {
    // Validate request body
    const body = await req.json();
    const { messages, isFinal } = body;

    // Input validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { 
          resp: 'Invalid request: messages array is required and must not be empty',
          ui: 'none',
          error: 'INVALID_INPUT'
        },
        { status: 400 }
      );
    }

    if (typeof isFinal !== 'boolean') {
      return NextResponse.json(
        { 
          resp: 'Invalid request: isFinal must be a boolean',
          ui: 'none',
          error: 'INVALID_INPUT'
        },
        { status: 400 }
      );
    }

    // Validate API key
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY is missing');
      return NextResponse.json(
        { 
          resp: 'Server configuration error. Please contact support.',
          ui: 'none',
          error: 'SERVER_ERROR'
        },
        { status: 500 }
      );
    }

    // Authentication and authorization
    const user = await currentUser(); 
    const { has } = await auth(); 
    const hasPremiumAccess = has({ plan: 'monthly' });
    
    console.log('User Info', { 
      userId: user?.id, 
      email: user?.primaryEmailAddress?.emailAddress,
      hasPremiumAccess 
    });

    // Rate limiting
    const decision = await aj.protect(req, { 
      userId: user?.primaryEmailAddress?.emailAddress ?? '', 
      requested: isFinal ? 5 : 0 
    });
 
    // Check rate limit
    //@ts-ignore
    if (decision?.reason?.remaining === 0 && !hasPremiumAccess) {
      return NextResponse.json({
        resp: 'No Free Credits Left, Please upgrade your plan',
        ui: 'limit'
      }, { status: 429 });
    }

    // Prepare messages for API call
    const systemMessage = {
      role: 'system' as const,
      content: isFinal ? FINAL_PROMPT : PROMPT,
    };

    // Validate message format
    const validMessages = messages.filter((msg: any) => 
      msg && 
      typeof msg === 'object' && 
      (msg.role === 'user' || msg.role === 'assistant') &&
      typeof msg.content === 'string'
    );

    if (validMessages.length === 0) {
      return NextResponse.json(
        { 
          resp: 'Invalid message format. All messages must have role and content.',
          ui: 'none',
          error: 'INVALID_MESSAGE_FORMAT'
        },
        { status: 400 }
      );
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'openrouter/polaris-alpha', 
      response_format: { type: 'json_object' },
      messages: [systemMessage, ...validMessages],
      temperature: isFinal ? 0.7 : 0.8, // Slightly lower temperature for final plan for consistency
      max_tokens: isFinal ? 4000 : 500, // More tokens for final plan
    });

    const message = completion.choices[0]?.message;
    
    if (!message || !message.content) {
      return NextResponse.json(
        { 
          resp: 'No response from AI service. Please try again.',
          ui: 'none',
          error: 'EMPTY_RESPONSE'
        },
        { status: 500 }
      );
    }

    // Parse and validate JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(message.content);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw response:', message.content);
      return NextResponse.json(
        { 
          resp: 'Invalid response format from AI service. Please try again.',
          ui: 'none',
          error: 'PARSE_ERROR'
        },
        { status: 500 }
      );
    }

    // Validate response structure
    if (isFinal) {
      // For final response, ensure trip_plan exists
      if (!parsedResponse.trip_plan) {
        console.error('Missing trip_plan in final response:', parsedResponse);
        return NextResponse.json(
          { 
            resp: 'Incomplete trip plan received. Please try again.',
            ui: 'none',
            error: 'INCOMPLETE_RESPONSE',
            trip_plan: null
          },
          { status: 500 }
        );
      }

      // Validate trip_plan structure
      const tripPlan = parsedResponse.trip_plan;
      if (!tripPlan.destination || !tripPlan.origin || !tripPlan.duration) {
        console.error('Missing required fields in trip_plan:', tripPlan);
        return NextResponse.json(
          { 
            resp: 'Trip plan missing required information. Please try again.',
            ui: 'none',
            error: 'INCOMPLETE_TRIP_PLAN',
            trip_plan: null
          },
          { status: 500 }
        );
      }
    } else {
      // For regular responses, ensure resp and ui exist
      if (!parsedResponse.resp || !parsedResponse.ui) {
        console.error('Missing resp or ui in response:', parsedResponse);
        return NextResponse.json(
          { 
            resp: parsedResponse.resp || 'Invalid response format.',
            ui: parsedResponse.ui || 'none',
            error: 'INCOMPLETE_RESPONSE'
          },
          { status: 500 }
        );
      }
    }

    console.log('Successfully processed request:', { 
      isFinal, 
      hasResponse: !!parsedResponse,
      hasTripPlan: !!parsedResponse.trip_plan 
    });

    return NextResponse.json(parsedResponse);

  } catch (error: any) {
    // Log error details for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.error('API route error:', {
        message: error?.message,
        status: error?.status,
        code: error?.code,
        statusCode: error?.statusCode,
      });
    }
    
    // Handle specific error types
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { 
          resp: 'Invalid request format. Please check your input.',
          ui: 'none',
          error: 'INVALID_REQUEST'
        },
        { status: 400 }
      );
    }

    // Check for rate limit errors (429) - check multiple possible properties
    const isRateLimit = error?.status === 429 || 
                       error?.statusCode === 429 || 
                       error?.code === 429 ||
                       error?.response?.status === 429;
    
    if (isRateLimit) {
      // Extract rate limit message - handle different error message formats
      let rateLimitMessage = 'Rate limit exceeded. Please try again later or add credits to unlock more requests.';
      
      if (error?.message) {
        // Remove the status code prefix if present (e.g., "429 Rate limit...")
        const cleanMessage = error.message.replace(/^\d+\s*/, '').trim();
        if (cleanMessage.toLowerCase().includes('rate limit')) {
          rateLimitMessage = cleanMessage;
        }
      }
      
      // Optional: Try to extract reset time from error headers
      try {
        const resetHeader = error?.headers?.get?.('x-ratelimit-reset');
        if (resetHeader) {
          const resetTime = parseInt(resetHeader);
          const now = Date.now();
          const minutesUntilReset = Math.ceil((resetTime - now) / 60000);
          if (minutesUntilReset > 0) {
            rateLimitMessage += ` Rate limit resets in approximately ${minutesUntilReset} minutes.`;
          }
        }
      } catch (e) {
        // Ignore header parsing errors
      }
      
      return NextResponse.json(
        { 
          resp: rateLimitMessage,
          ui: 'limit',
          error: 'RATE_LIMIT'
        },
        { status: 429 }
      );
    }

    // Check for authentication errors (401)
    const isAuthError = error?.status === 401 || 
                       error?.statusCode === 401 || 
                       error?.code === 401 ||
                       error?.response?.status === 401;
    
    if (isAuthError) {
      return NextResponse.json(
        { 
          resp: 'Authentication failed. Please check your API key configuration.',
          ui: 'none',
          error: 'AUTH_ERROR'
        },
        { status: 401 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { 
        resp: 'An error occurred while processing your request. Please try again.',
        ui: 'none',
        error: 'SERVER_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
