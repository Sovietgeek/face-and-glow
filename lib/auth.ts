import { betterAuth } from 'better-auth'
import { pool } from '@/lib/db'

export const auth = betterAuth({
  database: pool,
  baseURL:
    process.env.BETTER_AUTH_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.V0_RUNTIME_URL),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'user',
        input: false,
      },
      phone: {
        type: 'string',
        required: false,
      },
    },
  },
  // Trust the v0 preview iframe, Vercel deployments, localhost, and the
  // request's own origin. Using a function lets us reflect the exact origin
  // the browser is on, which is unpredictable across preview/deploy domains.
  trustedOrigins: async (request) => {
    const origins = new Set<string>([
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'https://*.vusercontent.net',
      'https://*.vercel.app',
    ])
    if (process.env.V0_RUNTIME_URL) origins.add(process.env.V0_RUNTIME_URL)
    if (process.env.VERCEL_URL) origins.add(`https://${process.env.VERCEL_URL}`)
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      origins.add(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
    }
    // Reflect the current request origin so custom domains work out of the box.
    const origin = request?.headers?.get('origin')
    if (origin) origins.add(origin)
    return Array.from(origins)
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  ...(process.env.NODE_ENV === 'development'
    ? {
        advanced: {
          // In dev (v0 preview iframe), force cross-site cookies so the
          // session cookie is stored by the browser.
          defaultCookieAttributes: {
            sameSite: 'none' as const,
            secure: true,
          },
        },
      }
    : {}),
})
