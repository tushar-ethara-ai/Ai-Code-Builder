import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Check if Upstash Redis variables exist
const hasUpstash =
  typeof window === "undefined" &&
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN;

let upstashLimiter: Ratelimit | null = null;

if (hasUpstash) {
  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

    upstashLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, "1 h"), // 20 requests per hour
      analytics: true,
      prefix: "ai-code-builder-ratelimit",
    });
  } catch (error) {
    console.warn("Failed to initialize Upstash Redis. Falling back to local rate limiting.", error);
  }
}

// In-Memory Rate Limiter Fallback
type LocalRateLimitInfo = {
  timestamp: number;
};

const localRateLimitMap = new Map<string, LocalRateLimitInfo[]>();

function localRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const requests = localRateLimitMap.get(key) || [];
  
  // Filter out requests older than the window
  const activeRequests = requests.filter((r) => now - r.timestamp < windowMs);
  
  if (activeRequests.length >= limit) {
    const oldestRequest = activeRequests[0];
    const resetTime = oldestRequest.timestamp + windowMs;
    return {
      success: false,
      limit,
      remaining: 0,
      reset: resetTime,
    };
  }
  
  activeRequests.push({ timestamp: now });
  localRateLimitMap.set(key, activeRequests);
  
  return {
    success: true,
    limit,
    remaining: limit - activeRequests.length,
    reset: now + windowMs,
  };
}

/**
 * Checks the API request rate limit for a user.
 * Falls back to a local in-memory rolling window if Upstash Redis credentials are not configured.
 */
export async function checkRateLimit(userId: string) {
  if (upstashLimiter) {
    try {
      const result = await upstashLimiter.limit(userId);
      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
      };
    } catch (error) {
      console.error("Upstash rate limit request failed, falling back to local limit.", error);
    }
  }

  // Local fallback: 20 requests per hour (3,600,000 milliseconds)
  return localRateLimit(userId, 20, 3600000);
}
