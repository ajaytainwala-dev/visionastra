import { NextRequest, NextResponse } from 'next/server'

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
  keyGenerator?: (req: NextRequest) => string // Custom key generator
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
  keyGenerator: (req: NextRequest) => {
    // Use IP address or user ID as key
    return req.headers.get('x-forwarded-for') || 'unknown'
  },
}

// In-memory store for rate limit tracking
const rateLimitStore = new Map<
  string,
  { count: number; resetTime: number }
>()

export function createRateLimiter(config: Partial<RateLimitConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }

  return async (req: NextRequest) => {
    const key = finalConfig.keyGenerator!(req)
    const now = Date.now()

    let record = rateLimitStore.get(key)

    // Create new record if doesn't exist or window has expired
    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + finalConfig.windowMs,
      }
      rateLimitStore.set(key, record)
      return null // Allow request
    }

    // Increment counter
    record.count++

    // Check if limit exceeded
    if (record.count > finalConfig.maxRequests) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000)
      return NextResponse.json(
        {
          error: 'too_many_requests',
          message: 'Rate limit exceeded',
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
          },
        }
      )
    }

    return null // Allow request
  }
}

export function getRateLimitInfo(key: string) {
  const record = rateLimitStore.get(key)
  if (!record) return null

  return {
    remaining: Math.max(0, 100 - record.count),
    resetTime: record.resetTime,
    resetSeconds: Math.ceil((record.resetTime - Date.now()) / 1000),
  }
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 60 * 1000) // Run every minute
