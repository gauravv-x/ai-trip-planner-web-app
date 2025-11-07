import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get admin configuration
export const getConfig = query({
  handler: async (ctx) => {
    const config = await ctx.db
      .query("AdminConfigTable")
      .order("desc")
      .first();

    if (!config) {
      // Return defaults if no config exists
      const defaultAdminEmails = process.env.ADMIN_EMAILS?.split(",").map(e => e.trim()).filter(e => e) || [];
      return {
        openrouterModel: process.env.OPENROUTER_MODEL || "openrouter/polaris-alpha",
        openrouterApiKey: "", // Don't expose the actual key
        adminEmails: defaultAdminEmails,
        updatedAt: Date.now(),
        updatedBy: "system",
      };
    }

    // Don't expose the actual API key in queries for security
    return {
      openrouterModel: config.openrouterModel,
      openrouterApiKey: "", // Masked for security
      adminEmails: config.adminEmails || [],
      updatedAt: config.updatedAt,
      updatedBy: config.updatedBy,
    };
  },
});

// Get full config including API key (for server-side use only)
export const getFullConfig = query({
  handler: async (ctx) => {
    const config = await ctx.db
      .query("AdminConfigTable")
      .order("desc")
      .first();

    if (!config) {
      return null;
    }

    return config;
  },
});

// Update admin configuration
export const updateConfig = mutation({
  args: {
    openrouterModel: v.string(),
    openrouterApiKey: v.optional(v.string()),
    adminEmails: v.optional(v.array(v.string())),
    updatedBy: v.string(),
  },
  handler: async (ctx, args) => {
    // Get existing config to preserve API key and admin emails if not provided
    const existingConfig = await ctx.db
      .query("AdminConfigTable")
      .order("desc")
      .first();

    // Delete old configs (keep only the latest)
    const oldConfigs = await ctx.db
      .query("AdminConfigTable")
      .collect();

    for (const oldConfig of oldConfigs) {
      await ctx.db.delete(oldConfig._id);
    }

    // Use existing API key if new one is not provided
    const apiKeyToUse = args.openrouterApiKey && args.openrouterApiKey.trim() !== ""
      ? args.openrouterApiKey
      : (existingConfig?.openrouterApiKey || "");

    // Use provided admin emails or keep existing ones, or fallback to env
    const adminEmailsToUse = args.adminEmails && args.adminEmails.length > 0
      ? args.adminEmails
      : (existingConfig?.adminEmails || process.env.ADMIN_EMAILS?.split(",").map(e => e.trim()).filter(e => e) || []);

    // Create new config
    const newConfig = await ctx.db.insert("AdminConfigTable", {
      openrouterModel: args.openrouterModel,
      openrouterApiKey: apiKeyToUse,
      adminEmails: adminEmailsToUse,
      updatedAt: Date.now(),
      updatedBy: args.updatedBy,
    });

    return newConfig;
  },
});

