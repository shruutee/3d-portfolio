import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Only initialise Upstash when both env vars are present (safe for local dev)
const hasUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN &&
  !process.env.UPSTASH_REDIS_REST_TOKEN.startsWith("********");

const redis = hasUpstash ? Redis.fromEnv() : null;

const makeLimiter = (tokens: number, window: string) =>
  hasUpstash && redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(tokens, window as `${number} ${"ms" | "s" | "m" | "h" | "d"}`),
        analytics: true,
      })
    : null;

const _chatLimit = makeLimiter(20, "1 h");
const _ttsLimit = makeLimiter(10, "1 h");
const _contactLimit = makeLimiter(5, "1 h");

const allow = { success: true, limit: 999, remaining: 999, reset: 0, pending: Promise.resolve() };

export const chatRateLimit = {
  limit: async (ip: string) => (_chatLimit ? _chatLimit.limit(ip) : allow),
};

export const ttsRateLimit = {
  limit: async (ip: string) => (_ttsLimit ? _ttsLimit.limit(ip) : allow),
};

export const contactRateLimit = {
  limit: async (ip: string) => (_contactLimit ? _contactLimit.limit(ip) : allow),
};

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "127.0.0.1";
}
