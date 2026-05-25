import { useState } from "react";
import { toast } from "sonner";

export function useStreaming() {
  const [outputCode, setOutputCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startStream = async (
    prompt: string,
    language: string,
    tone: string,
    userId: string
  ) => {
    setIsLoading(true);
    setError(null);
    setOutputCode("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, language, tone, userId }),
      });

      if (!response.ok) {
        const errText = await response.text();
        let errMsg = "Failed to generate code";
        try {
          const parsed = JSON.parse(errText);
          errMsg = parsed.error || parsed.message || errMsg;
        } catch {
          errMsg = errText || errMsg;
        }
        throw new Error(errMsg);
      }

      if (!response.body) {
        throw new Error("No response stream available");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedCode = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          accumulatedCode += chunk;
          setOutputCode(accumulatedCode);
        }
      }

      toast.success("Code generated successfully!");
      return accumulatedCode;
    } catch (err: any) {
      console.error("Stream generation error:", err);
      const errMsg = err.message || "An unexpected error occurred";
      setError(errMsg);
      toast.error(errMsg);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    outputCode,
    setOutputCode,
    isLoading,
    error,
    startStream,
  };
}
