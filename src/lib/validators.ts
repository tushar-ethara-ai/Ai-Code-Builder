import { z } from "zod";

export const GenerateSchema = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty").max(2000, "Prompt must be less than 2000 characters"),
  language: z.string().min(1, "Language is required"),
  tone: z.string().min(1, "Tone is required"),
  userId: z.string().min(1, "User ID is required"),
});

export type GenerateInput = z.infer<typeof GenerateSchema>;
