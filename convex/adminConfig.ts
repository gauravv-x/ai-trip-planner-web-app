import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getConfig = query({
  handler: async (ctx) => {
    const config = await ctx.db.query("AdminConfigTable").order("desc").first();
    return config?.configData || null;
  },
});

export const getFullConfig = query({
  handler: async (ctx) => {
    const config = await ctx.db.query("AdminConfigTable").order("desc").first();
    return config?.configData || null;
  },
});

export const updateConfig = mutation({
  args: {
    adminEmails: v.optional(v.array(v.string())),
    openrouterApiKey: v.optional(v.string()),
    openrouterModel: v.string(), // Required field based on error message
    updatedBy: v.string(),
  },
  handler: async (ctx, args) => {
    const configData = {
      adminEmails: args.adminEmails,
      openrouterApiKey: args.openrouterApiKey,
      openrouterModel: args.openrouterModel,
    };
    await ctx.db.insert("AdminConfigTable", {
      configData: configData,
      updatedAt: Date.now(),
      updatedBy: args.updatedBy,
    });
  },
});
