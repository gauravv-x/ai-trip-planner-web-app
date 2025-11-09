import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";

// Helper function to check if user is admin
async function isAdmin(): Promise<{ isAdmin: boolean; email?: string }> {
  try {
    const { userId, sessionClaims } = await auth();
    
    if (!userId) {
      return { isAdmin: false };
    }

    // Try multiple ways to get email
    let email: string | undefined = 
      sessionClaims?.email_address as string | undefined ||
      sessionClaims?.email as string | undefined;
    
    // If not in sessionClaims, try getting from currentUser
    if (!email) {
      try {
        const user = await currentUser();
        email = user?.primaryEmailAddress?.emailAddress || 
                user?.emailAddresses?.[0]?.emailAddress;
      } catch (userError) {
        console.warn("Could not get user email:", userError);
      }
    }

    if (!email) {
      console.warn("No email found for user:", userId);
      return { isAdmin: false };
    }

    // Check against environment variable first
    const adminEmailsEnv = process.env.ADMIN_EMAILS;
    if (adminEmailsEnv) {
      const adminEmailsList = adminEmailsEnv.split(',').map(e => e.trim().toLowerCase());
      if (adminEmailsList.includes(email.toLowerCase())) {
        return { isAdmin: true, email };
      }
    }

    // Check against stored admin emails in database
    try {
      const config = await fetchQuery((api as any).adminConfig.getConfig, {});
      if (config?.adminEmails && Array.isArray(config.adminEmails)) {
        const adminEmailsList = config.adminEmails.map((e: string) => e.toLowerCase());
        if (adminEmailsList.includes(email.toLowerCase())) {
          return { isAdmin: true, email };
        }
      }
    } catch (dbError) {
      console.warn("Error checking admin emails from database:", dbError);
    }

    // Check Clerk metadata as fallback
    try {
      const user = await currentUser();
      if (user?.publicMetadata?.role === 'admin') {
        return { isAdmin: true, email };
      }
    } catch (metaError) {
      console.warn("Error checking metadata:", metaError);
    }

    return { isAdmin: false, email };
  } catch (error) {
    console.error("Error checking admin access:", error);
    return { isAdmin: false };
  }
}

export async function GET() {
  try {
    // Check admin access
    const adminCheck = await isAdmin();
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { 
          error: "Unauthorized",
          message: adminCheck.email 
            ? `Email ${adminCheck.email} is not authorized. Please add it to ADMIN_EMAILS environment variable or contact an administrator.`
            : "You must be signed in to access the admin panel."
        },
        { status: 403 }
      );
    }

    const config = await fetchQuery((api as any).adminConfig.getConfig, {});
    // Return the entire config object, falling back to environment variables if empty
    return NextResponse.json(config || {
      openrouterModel: process.env.OPENROUTER_MODEL,
      openrouterApiKey: "", // Don't expose key
      adminEmails: process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || [],
    });
  } catch (error: any) {
    console.error("Error fetching admin config:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin config", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Check admin access
    const adminCheck = await isAdmin();
    if (!adminCheck.isAdmin || !adminCheck.email) {
      return NextResponse.json({ 
        error: "Unauthorized",
        message: adminCheck.email 
          ? `Email ${adminCheck.email} is not authorized. Please add it to ADMIN_EMAILS environment variable.`
          : "You must be signed in to access the admin panel."
      }, { status: 403 });
    }

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const body = await req.json();
    const { adminEmails, openrouterApiKey, openrouterModel } = body;

    // ✅ Manual validation: Ensure body is a non-null object
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid configuration data provided" },
        { status: 400 }
      );
    }

    // ✅ Use validated body as generic configData
    const updatedConfig = await fetchMutation(
      (api as any).adminConfig.updateConfig,
      {
        adminEmails: adminEmails,
        openrouterApiKey: openrouterApiKey,
        openrouterModel: openrouterModel,
        updatedBy: adminCheck.email,
      }
    );

    return NextResponse.json(updatedConfig);
  } catch (error: any) {
    console.error("Error updating admin config:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update admin config" },
      { status: 500 }
    );
  }
}
