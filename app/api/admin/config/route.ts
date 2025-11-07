import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Check if user is admin (you can customize this logic)
async function isAdmin(): Promise<boolean> {
  const user = await currentUser();
  if (!user) return false;

  const userEmail = user.primaryEmailAddress?.emailAddress;
  if (!userEmail) return false;

  try {
    // First, try to get admin emails from database
    const config = await convex.query(api.adminConfig.getConfig);
    const adminEmails = config?.adminEmails || [];
    
    // If database has admin emails configured, use them as the source of truth
    if (adminEmails.length > 0) {
      return adminEmails.includes(userEmail);
    }
  } catch (error) {
    console.error("Error checking admin from database:", error);
  }

  // Fallback to environment variable if database has no admin emails or check fails
  const envAdminEmails = process.env.ADMIN_EMAILS?.split(",").map(e => e.trim()).filter(e => e) || [];
  if (envAdminEmails.includes(userEmail)) {
    return true;
  }

  return false;
}

// GET - Get current configuration
export async function GET(req: NextRequest) {
  try {
    // Check admin access
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    const config = await convex.query(api.adminConfig.getConfig);
    
    return NextResponse.json(config);
  } catch (error: any) {
    console.error("Error fetching admin config:", error);
    return NextResponse.json(
      { error: "Failed to fetch configuration", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Update configuration
export async function POST(req: NextRequest) {
  try {
    // Check admin access
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { openrouterModel, openrouterApiKey, adminEmails } = body;

    // Validation
    if (!openrouterModel || typeof openrouterModel !== "string") {
      return NextResponse.json(
        { error: "openrouterModel is required and must be a string" },
        { status: 400 }
      );
    }

    // Validate adminEmails if provided
    if (adminEmails !== undefined) {
      if (!Array.isArray(adminEmails)) {
        return NextResponse.json(
          { error: "adminEmails must be an array" },
          { status: 400 }
        );
      }
      // Validate each email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      for (const email of adminEmails) {
        if (typeof email !== "string" || !emailRegex.test(email.trim())) {
          return NextResponse.json(
            { error: `Invalid email format: ${email}` },
            { status: 400 }
          );
        }
      }
    }

    // API key is optional - if empty, we'll keep the existing one
    const apiKeyToUpdate = openrouterApiKey && typeof openrouterApiKey === "string" && openrouterApiKey.trim() !== ""
      ? openrouterApiKey
      : undefined;

    const user = await currentUser();
    const updatedBy = user?.primaryEmailAddress?.emailAddress || user?.id || "unknown";

    // Update configuration
    await convex.mutation(api.adminConfig.updateConfig, {
      openrouterModel,
      openrouterApiKey: apiKeyToUpdate,
      adminEmails: adminEmails !== undefined ? adminEmails.map((e: string) => e.trim()) : undefined,
      updatedBy,
    });

    return NextResponse.json({ 
      success: true, 
      message: "Configuration updated successfully" 
    });
  } catch (error: any) {
    console.error("Error updating admin config:", error);
    return NextResponse.json(
      { error: "Failed to update configuration", details: error.message },
      { status: 500 }
    );
  }
}

