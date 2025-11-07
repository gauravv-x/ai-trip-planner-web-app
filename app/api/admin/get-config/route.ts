import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Internal route to get full config (used by aimodel route)
export async function GET(req: NextRequest) {
  try {
    // This is an internal route, so we don't check admin here
    // The aimodel route will use this to get the config
    
    const config = await convex.query(api.adminConfig.getFullConfig);
    
    // If no config in DB, fall back to env vars
    if (!config) {
      return NextResponse.json({
        openrouterModel: process.env.OPENROUTER_MODEL || "openrouter/polaris-alpha",
        openrouterApiKey: process.env.OPENROUTER_API_KEY || "",
      });
    }

    return NextResponse.json({
      openrouterModel: config.openrouterModel,
      openrouterApiKey: config.openrouterApiKey,
    });
  } catch (error: any) {
    console.error("Error fetching config:", error);
    // Fall back to env vars on error
    return NextResponse.json({
      openrouterModel: process.env.OPENROUTER_MODEL || "openrouter/polaris-alpha",
      openrouterApiKey: process.env.OPENROUTER_API_KEY || "",
    });
  }
}

