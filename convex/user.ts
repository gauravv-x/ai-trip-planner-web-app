import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateNewUser = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        imageUrl: v.string()
     },
        handler: async (ctx, args) => {
                //if user already exists
                const user = await ctx.db.query('UserTable')
                .filter((q)=>q.eq(q.field('email'), args.email))
                .collect();
            
                if(user?.length==0){
                    const userData={
                        name: args.name,
                         email: args.email,
                        imageUrl: args.imageUrl
                       
                    }
                    //if not create a new user
                    const result =await ctx.db.insert('UserTable', userData);
                    return userData;
                }
            
                return user[0];
            }
    });

export const getTotalUsers = query({
    handler: async (ctx) => {
        const users = await ctx.db.query('UserTable').collect();
        return users.length;
    },
});

export const getUsers = query({
    args: {
        cursor: v.optional(v.string()), // Change to string for paginate compatibility
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const paginationOptions = {
            cursor: args.cursor || null, // Ensure null if undefined
            numItems: args.limit || 10, // Provide a default limit
            order: 'asc',
        };
        return await ctx.db.query('UserTable')
            .order('asc')
            .paginate(paginationOptions);
   },
});

export const deleteUser = mutation({
   args: {
       userId: v.id('UserTable'),
   },
   handler: async (ctx, args) => {
       await ctx.db.delete(args.userId);
   },
});