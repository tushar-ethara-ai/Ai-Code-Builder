import { auth } from "@/lib/auth";
import { GenerateSchema } from "@/lib/validators";
import { sanitizePrompt } from "@/lib/sanitize";
import { checkRateLimit } from "@/lib/rate-limit";
import { api } from "../../../../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

export async function POST(req: Request) {
  // 1. Verify Auth Session
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json(
      { success: false, error: "Unauthorized access", code: 401 },
      { status: 401 }
    );
  }

  // 2. Parse Request Body
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { success: false, error: "Invalid JSON body", code: 400 },
      { status: 400 }
    );
  }

  // 3. Validate Inputs using Zod
  const validation = GenerateSchema.safeParse({ ...body, userId: session.user.id });
  if (!validation.success) {
    return Response.json(
      {
        success: false,
        error: "Validation failed",
        errors: validation.error.issues,
        code: 400,
      },
      { status: 400 }
    );
  }

  const { prompt, language, tone, userId } = validation.data;

  // 4. Sanitize Inputs
  const sanitizedPrompt = sanitizePrompt(prompt);
  if (!sanitizedPrompt) {
    return Response.json(
      { success: false, error: "Prompt cannot be empty after sanitization", code: 400 },
      { status: 400 }
    );
  }

  // 5. Rate Limiting Check
  const rateLimit = await checkRateLimit(userId);
  if (!rateLimit.success) {
    return Response.json(
      {
        success: false,
        error: "Rate limit exceeded. Try again in an hour.",
        reset: rateLimit.reset,
        code: 429,
      },
      { status: 429 }
    );
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://mock-deployment-12345.convex.cloud";
  const convex = new ConvexHttpClient(convexUrl);

  // 6. Check if OpenAI Key is configured
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "") {
    // Elegant fallback streaming if API key is not configured yet
    const mockOutput = `// Setup Instructions:
// Please add your OPENAI_API_KEY in .env.local to run live generations.
// Currently running in dynamic mock stream mode!

// Language: ${language}
// Tone: ${tone}
// Prompt: ${sanitizedPrompt}

export function generatedModule() {
  console.log("Welcome to AI Code Builder!");
  const promptText = "${sanitizedPrompt.replace(/"/g, '\\"')}";
  
  // Simulated output matching your selection
  const taskDetails = {
    processed: true,
    engine: "GPT-4o (Simulation)",
    language: "${language}",
    tone: "${tone}",
    timestamp: Date.now()
  };
  
  return taskDetails;
}`;

    // Create a streaming response using a ReadableStream
    const encoder = new TextEncoder();
    const customStream = new ReadableStream({
      async start(controller) {
        const words = mockOutput.split(" ");
        for (let i = 0; i < words.length; i++) {
          const chunk = words[i] + (i < words.length - 1 ? " " : "");
          controller.enqueue(encoder.encode(chunk));
          await new Promise((r) => setTimeout(r, 30));
        }

        // Save generated mock items to Convex DB
        try {
          await convex.mutation(api.generations.saveGeneration, {
            userId,
            prompt: sanitizedPrompt,
            language,
            tone,
            outputCode: mockOutput,
          });

          await convex.mutation(api.usageStats.updateUsageStats, {
            userId,
            tokensUsed: Math.ceil(mockOutput.length / 4),
          });
        } catch (convexErr) {
          console.warn("Failed to persist mock generation in Convex:", convexErr);
        }

        controller.close();
      },
    });

    return new Response(customStream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // 7. Stream Response using Vercel AI SDK
  try {
    const openaiProvider = createOpenAI({ apiKey });
    const result = await streamText({
      model: openaiProvider("gpt-4o"),
      system: `
        You are a senior production-grade software engineer.
        Return only clean, runnable code for ${language}.
        No markdown fences, backticks, or wrapping.
        Return raw code files only.
        Apply a ${tone} writing tone for any comments or docs.
        Write readable, high-quality logic.
      `,
      prompt: sanitizedPrompt,
      onFinish: async (finishResult) => {
        const fullOutputText = finishResult.text;
        const totalTokens = finishResult.usage.totalTokens || Math.ceil(fullOutputText.length / 4);

        try {
          await convex.mutation(api.generations.saveGeneration, {
            userId,
            prompt: sanitizedPrompt,
            language,
            tone,
            outputCode: fullOutputText,
          });

          await convex.mutation(api.usageStats.updateUsageStats, {
            userId,
            tokensUsed: totalTokens,
          });
        } catch (convexErr) {
          console.error("Convex persistence failed in finish callback:", convexErr);
        }
      },
    });

    return result.toTextStreamResponse();
  } catch (openaiError: any) {
    console.error("OpenAI stream request failed:", openaiError);
    return Response.json(
      { success: false, error: openaiError.message || "AI stream generation failed", code: 500 },
      { status: 500 }
    );
  }
}
