import { auth, currentUser } from "@clerk/nextjs/server";
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { aj } from "@/utils/arcjet";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Function to get dynamic configuration
async function getOpenRouterConfig() {
  try {
    // Try to get config from admin panel (Convex)
    // @ts-ignore adminConfig may not be declared yet in api
    const config = await convex.query((api as any).adminConfig?.getFullConfig);

    if (config && config.openrouterApiKey && config.openrouterModel) {
      return {
        apiKey: config.openrouterApiKey,
        model: config.openrouterModel,
      };
    }
  } catch (error) {
    console.error('Error fetching admin config, falling back to env vars:', error);
  }
  
  // Fall back to environment variables
  return {
    apiKey: process.env.OPENROUTER_API_KEY || '',
    model: process.env.OPENROUTER_MODEL,
  };
}

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

If you have gathered enough information (e.g., destination, duration, budget) but are not yet in the final state, you MUST include a 'partial_trip_plan' object in the response, containing the current known trip details (destination, duration, budget, group_size, origin). This allows the user to see the plan forming in real-time.

Once all required information is collected, generate and return a strict JSON response only (no explanations or extra text) with following strictly JSON only schema:
{
  "resp": "Text Response",
  "ui": "budget|groupSize|tripDuration|final|none",
  "partial_trip_plan": {
    "destination": "string",
    "duration": "string",
    "origin": "string",
    "budget": "string",
    "group_size": "string"
  } // Optional, but required if enough info is gathered before final state.
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

    // Get dynamic configuration
    const config = await getOpenRouterConfig();
    
    // Validate API key
    if (!config.apiKey) {
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

    // Create OpenAI client with dynamic config
    const openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: config.apiKey,
    });

    // Authentication and authorization - handle missing user gracefully
    let user = null;
    let hasPremiumAccess = false;
    let userEmail = '';
    
    try {
      user = await currentUser();
      const { has } = await auth();
      hasPremiumAccess = has({ plan: 'monthly' });
      userEmail = user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress ?? '';
    } catch (authError) {
      // If auth fails, continue with anonymous user
      console.warn('Auth check failed, continuing with anonymous user:', authError);
    }
    
    console.log('User Info', { 
      userId: user?.id ?? 'anonymous', 
      email: userEmail || 'no-email',
      hasPremiumAccess 
    });

    // Rate limiting - use email or fallback to IP-based identification
    let decision = null;
    try {
      decision = await aj.protect(req, { 
        userId: userEmail || req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous', 
        requested: isFinal ? 5 : 0 
      });
    } catch (rateLimitError) {
      // If rate limiting fails, log but continue
      console.warn('Rate limiting check failed, continuing:', rateLimitError);
    }
 
    // Check rate limit - handle gracefully if decision is null
    //@ts-ignore
    if (decision && decision?.reason?.remaining === 0 && !hasPremiumAccess) {
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

    // Call OpenAI API with dynamic model
    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: config.model,
        response_format: { type: 'json_object' },
        messages: [systemMessage, ...validMessages],
        temperature: isFinal ? 0.7 : 0.8, // Slightly lower temperature for final plan for consistency
        max_tokens: isFinal ? 4000 : 1000, // Increased tokens for partial plan data
      });
    } catch (apiError: any) {
      console.error("OpenAI API call failed:", {
        message: apiError?.message,
        status: apiError?.status,
        code: apiError?.code,
        response: apiError?.response?.data,
      });
      
      // Re-throw to be caught by outer catch block
      throw apiError;
    }

    const message = completion.choices[0]?.message;
    
    if (!message || !message.content) {
      console.error("No message or content in completion:", {
        hasMessage: !!message,
        hasContent: !!message?.content,
        completion: completion
      });
      return NextResponse.json(
        { 
          resp: 'No response from AI service. Please try again.',
          ui: 'none',
          error: 'EMPTY_RESPONSE'
        },
        { status: 500 }
      );
    }

    // Parse and validate JSON response (safe fallback for malformed output)
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(message.content);
    } catch (parseError) {
      console.error("❌ JSON parse failed:", parseError);
      console.error("🔹 Raw content snippet:", message.content?.slice(0, 400));
      console.error("🔹 Full content length:", message.content?.length);

      // Try cleaning up common JSON issues from OpenRouter
      const cleaned = message.content
        ?.replace(/```json|```/gi, "") // remove Markdown fences
        ?.replace(/[\u0000-\u001F]+/g, " ") // remove control chars
        ?.replace(/,(\s*[}\]])/g, "$1") // remove trailing commas
        ?.replace(/[\r\n\t]+/g, " ") // remove newlines/tabs
        ?.trim();

      try {
        parsedResponse = JSON.parse(cleaned || '{}');
      } catch (parseError2) {
        console.error("❌ Still invalid JSON after cleanup:", parseError2);
        console.error("🔹 Cleaned snippet:", cleaned?.slice(0, 400));
        return NextResponse.json(
          {
            resp: "Invalid response format from AI service. Please try again.",
            ui: "none",
            error: "PARSE_ERROR",
          },
          { status: 500 }
        );
      }
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
    }
    
    // For all responses (final or not), ensure resp and ui exist, and handle partial_trip_plan
    // If isFinal is true and trip_plan exists, we can assume success and inject default resp/ui if missing.
    if (isFinal && parsedResponse.trip_plan) {
      // Inject default values if missing, as the FINAL_PROMPT doesn't require them
      parsedResponse.resp = parsedResponse.resp || 'Trip plan generated successfully.';
      parsedResponse.ui = parsedResponse.ui || 'final';
    } else if (!parsedResponse.resp || !parsedResponse.ui) {
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

    console.log('Successfully processed request:', {
      isFinal, 
      hasResponse: !!parsedResponse,
      hasTripPlan: !!parsedResponse.trip_plan 
    });

    return NextResponse.json(parsedResponse);

  } catch (error: any) {
    // Log error details for debugging
    console.error('API route error:', {
      message: error?.message,
      status: error?.status,
      code: error?.code,
      statusCode: error?.statusCode,
      response: error?.response?.data,
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
    });
    
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
                       error?.response?.status === 401 ||
                       error?.message?.toLowerCase().includes('authentication') ||
                       error?.message?.toLowerCase().includes('api key');
    
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

    // Check for OpenAI API errors
    if (error?.error?.message || error?.response?.data?.error) {
      const openaiError = error?.error || error?.response?.data?.error;
      return NextResponse.json(
        { 
          resp: openaiError?.message || 'AI service error. Please try again.',
          ui: 'none',
          error: 'AI_SERVICE_ERROR',
          details: process.env.NODE_ENV === 'development' ? openaiError : undefined
        },
        { status: 500 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { 
        resp: error?.message || 'An error occurred while processing your request. Please try again.',
        ui: 'none',
        error: 'SERVER_ERROR',
        details: process.env.NODE_ENV === 'development' ? {
          message: error?.message,
          type: error?.constructor?.name,
        } : undefined
      },
      { status: 500 }
    );
  }
}
