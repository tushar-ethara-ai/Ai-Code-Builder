/**
 * Robust prompt sanitization to safeguard the AI generation route against jailbreak,
 * XSS injection, and system command prompt leakages.
 */
export function sanitizePrompt(input: string): string {
  if (!input) return "";

  // 1. Remove common AI jailbreak and system-override patterns (case insensitive)
  let clean = input
    .replace(/ignore\s+previous\s+instructions/gi, "")
    .replace(/system\s+prompt/gi, "")
    .replace(/forget\s+all\s+previous/gi, "")
    .replace(/you\s+are\s+now\s+an\s+ai/gi, "")
    .replace(/bypass\s+safety/gi, "")
    .replace(/override\s+system/gi, "")
    .replace(/developer\s+mode/gi, "");

  // 2. Remove HTML script tags & javascript protocols to block cross-site scripting (XSS)
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  clean = clean.replace(/on\w+\s*=\s*(["'])(.*?)\1/gi, ""); // strip inline handlers like onload, onclick
  clean = clean.replace(/javascript:/gi, "");

  // 3. Trim outer whitespaces
  return clean.trim();
}
