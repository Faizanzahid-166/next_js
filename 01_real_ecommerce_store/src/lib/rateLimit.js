const RATE_LIMIT_STORE = new Map();

function getClientIp(req) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "unknown";
}

export function rateLimit(req, identifier, limit = 10, windowMs = 60_000) {
  const now = Date.now();
  const key = `${getClientIp(req)}:${identifier}`;
  const existing = RATE_LIMIT_STORE.get(key) || { count: 0, reset: now + windowMs };

  if (now > existing.reset) {
    existing.count = 0;
    existing.reset = now + windowMs;
  }

  existing.count += 1;
  RATE_LIMIT_STORE.set(key, existing);

  return {
    limited: existing.count > limit,
    limit,
    remaining: Math.max(0, limit - existing.count),
    reset: existing.reset,
    retryAfter: Math.ceil((existing.reset - now) / 1000),
  };
}

export function rateLimitResponse({ limit, remaining, reset, retryAfter }) {
  return new Response(
    JSON.stringify({ status: "error", message: "Too many requests. Please try again later." }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": String(remaining),
        "X-RateLimit-Reset": String(Math.ceil(reset / 1000)),
      },
    }
  );
}
