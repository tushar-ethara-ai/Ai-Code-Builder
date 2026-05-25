import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    avatarUrl: v.optional(v.string()),
    theme: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  generations: defineTable({
    userId: v.string(),
    prompt: v.string(),
    language: v.string(),
    tone: v.string(),
    outputCode: v.string(),
    createdAt: v.number(),
    isFavorited: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_user_created", ["userId", "createdAt"]),

  usageStats: defineTable({
    userId: v.string(),
    totalGenerations: v.number(),
    tokensUsed: v.number(),
    lastGeneratedAt: v.number(),
  }).index("by_user", ["userId"]),
});
