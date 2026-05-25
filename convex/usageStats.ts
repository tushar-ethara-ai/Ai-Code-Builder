import { mutation, query } from "./_generated/server.js";
import type { MutationCtx, QueryCtx } from "./_generated/server.js";
import { v } from "convex/values";

export const updateUsageStats = mutation({
  args: {
    userId: v.string(),
    tokensUsed: v.number(),
  },
  handler: async (ctx: MutationCtx, args: any) => {
    const existingStats = await ctx.db
      .query("usageStats")
      .withIndex("by_user", (q: any) => q.eq("userId", args.userId))
      .unique();

    if (existingStats) {
      await ctx.db.patch(existingStats._id, {
        totalGenerations: existingStats.totalGenerations + 1,
        tokensUsed: existingStats.tokensUsed + args.tokensUsed,
        lastGeneratedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("usageStats", {
        userId: args.userId,
        totalGenerations: 1,
        tokensUsed: args.tokensUsed,
        lastGeneratedAt: Date.now(),
      });
    }
  },
});

export const getUsageStats = query({
  args: { userId: v.string() },
  handler: async (ctx: QueryCtx, args: any) => {
    const stats = await ctx.db
      .query("usageStats")
      .withIndex("by_user", (q: any) => q.eq("userId", args.userId))
      .unique();

    if (!stats) {
      return {
        userId: args.userId,
        totalGenerations: 0,
        tokensUsed: 0,
        lastGeneratedAt: 0,
      };
    }
    return stats;
  },
});
