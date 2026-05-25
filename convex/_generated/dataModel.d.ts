import { Document, Id } from "convex/values";

export type DataModel = {
  users: {
    document: {
      _id: Id<"users">;
      _creationTime: number;
      userId: string;
      email: string;
      name: string;
      avatarUrl?: string;
      theme?: string;
      createdAt: number;
    };
    fieldPaths: "userId" | "email" | "name" | "avatarUrl" | "theme" | "createdAt";
    indexes: {
      by_userId: ["userId"];
    };
  };
  generations: {
    document: {
      _id: Id<"generations">;
      _creationTime: number;
      userId: string;
      prompt: string;
      language: string;
      tone: string;
      outputCode: string;
      createdAt: number;
      isFavorited: boolean;
    };
    fieldPaths: "userId" | "prompt" | "language" | "tone" | "outputCode" | "createdAt" | "isFavorited";
    indexes: {
      by_user: ["userId"];
      by_user_created: ["userId", "createdAt"];
    };
  };
  usageStats: {
    document: {
      _id: Id<"usageStats">;
      _creationTime: number;
      userId: string;
      totalGenerations: number;
      tokensUsed: number;
      lastGeneratedAt: number;
    };
    fieldPaths: "userId" | "totalGenerations" | "tokensUsed" | "lastGeneratedAt";
    indexes: {
      by_user: ["userId"];
    };
  };
};
