import { mutation, query } from "./_generated/server.js";
import type { MutationCtx, QueryCtx } from "./_generated/server.js";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

export const saveGeneration = mutation({
  args: {
    userId: v.string(),
    prompt: v.string(),
    language: v.string(),
    tone: v.string(),
    outputCode: v.string(),
  },
  handler: async (ctx: MutationCtx, args: any) => {
    const id = await ctx.db.insert("generations", {
      userId: args.userId,
      prompt: args.prompt,
      language: args.language,
      tone: args.tone,
      outputCode: args.outputCode,
      createdAt: Date.now(),
      isFavorited: false,
    });
    return id;
  },
});

export const toggleFavorite = mutation({
  args: {
    id: v.id("generations"),
    userId: v.string(),
  },
  handler: async (ctx: MutationCtx, args: any) => {
    const gen = (await ctx.db.get(args.id)) as any;
    if (!gen || gen.userId !== args.userId) {
      throw new Error("Unauthorized or not found");
    }
    const nextState = !gen.isFavorited;
    await ctx.db.patch(args.id, { isFavorited: nextState });
    return nextState;
  },
});

export const deleteGeneration = mutation({
  args: {
    id: v.id("generations"),
    userId: v.string(),
  },
  handler: async (ctx: MutationCtx, args: any) => {
    const gen = (await ctx.db.get(args.id)) as any;
    if (!gen || gen.userId !== args.userId) {
      throw new Error("Unauthorized or not found");
    }
    await ctx.db.delete(args.id);
    return true;
  },
});

// A query to list recent generations for the sidebar
export const getRecentGenerations = query({
  args: {
    userId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx: QueryCtx, args: any) => {
    const limit = args.limit ?? 10;
    return await ctx.db
      .query("generations")
      .withIndex("by_user_created", (q: any) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit);
  },
});

// A query for the History page, with search, language filtering, tone filtering
export const getGenerations = query({
  args: {
    userId: v.string(),
    searchTerm: v.optional(v.string()),
    language: v.optional(v.string()),
    tone: v.optional(v.string()),
    favoritesOnly: v.optional(v.boolean()),
  },
  handler: async (ctx: QueryCtx, args: any) => {
    let results = await ctx.db
      .query("generations")
      .withIndex("by_user_created", (q: any) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    if (args.language && args.language !== "all") {
      results = results.filter((g: any) => g.language.toLowerCase() === args.language!.toLowerCase());
    }

    if (args.tone && args.tone !== "all") {
      results = results.filter((g: any) => g.tone.toLowerCase() === args.tone!.toLowerCase());
    }

    if (args.favoritesOnly) {
      results = results.filter((g: any) => g.isFavorited);
    }

    if (args.searchTerm) {
      const search = args.searchTerm.toLowerCase();
      results = results.filter(
        (g: any) => g.prompt.toLowerCase().includes(search) || g.outputCode.toLowerCase().includes(search)
      );
    }

    return results;
  },
});

// Paginated query using standard Convex cursor pagination
export const getGenerationsPaginated = query({
  args: {
    userId: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx: QueryCtx, args: any) => {
    return await ctx.db
      .query("generations")
      .withIndex("by_user_created", (q: any) => q.eq("userId", args.userId))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});
