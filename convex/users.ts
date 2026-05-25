import { mutation, query } from "./_generated/server.js";
import type { MutationCtx, QueryCtx } from "./_generated/server.js";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx: MutationCtx, args: any) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
      .unique();

    if (!existingUser) {
      await ctx.db.insert("users", {
        userId: args.userId,
        email: args.email,
        name: args.name,
        avatarUrl: args.avatarUrl,
        theme: "dark",
        createdAt: Date.now(),
      });
    }
  },
});

export const updateThemePreference = mutation({
  args: {
    userId: v.string(),
    theme: v.string(),
  },
  handler: async (ctx: MutationCtx, args: any) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
      .unique();

    if (user) {
      await ctx.db.patch(user._id, { theme: args.theme });
    }
  },
});

export const getUser = query({
  args: { userId: v.string() },
  handler: async (ctx: QueryCtx, args: any) => {
    return await ctx.db
      .query("users")
      .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
      .unique();
  },
});
