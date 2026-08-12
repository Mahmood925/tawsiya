const buckets = new Map<string, { count: number; resetAt: number }>();

// In-memory only — resets per server instance. Good enough as a basic
// brute-force throttle on a single long-running process; on serverless
// hosts each cold instance gets its own counter.
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0].trim() || "unknown";
}
