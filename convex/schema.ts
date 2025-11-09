import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    UserTable:defineTable({
                name: v.string(),
                imageUrl: v.string(),
                email: v.string(),
                subscription: v.optional(v.string()),


    }),
    
    TripDetailTable:defineTable({
                tripId: v.string(),
                tripDetail: v.any(),
                uid : v.id('UserTable')
    }),

    AdminConfigTable:defineTable({
                 configData: v.optional(v.any()), // Generic configuration object
                 adminEmails: v.optional(v.array(v.string())),
                 openrouterApiKey: v.optional(v.string()),
                 openrouterModel: v.optional(v.string()),
                 updatedAt: v.number(),
                 updatedBy: v.string(),
    })

})
