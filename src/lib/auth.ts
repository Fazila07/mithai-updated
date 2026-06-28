import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

// ─── Admin emails ─────────────────────────────────────────────
// These emails automatically get ADMIN role on sign-in
const ADMIN_EMAILS = [
  process.env.ADMIN_EMAIL?.toLowerCase(),
  'fazilashariff786@gmail.com',
].filter(Boolean) as string[]

// ─── Auth Options ─────────────────────────────────────────────

export const authOptions: NextAuthOptions = {
  // No adapter — we handle user creation manually in signIn callback.
  // This avoids conflicts between MongoDBAdapter and JWT strategy.
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        try {
          await connectDB()

          // Find or create user in our DB
          const existingUser = await User.findOne({ email: user.email.toLowerCase() })
          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email.toLowerCase(),
              image: user.image,
              provider: 'google',
              role: ADMIN_EMAILS.includes(user.email.toLowerCase()) ? 'ADMIN' : 'CUSTOMER',
            })
          } else {
            // Update profile from Google on every login
            const updates: Record<string, string> = { provider: 'google' }
            if (user.name && user.name !== existingUser.name) {
              updates.name = user.name
            }
            if (user.image && user.image !== existingUser.image) {
              updates.image = user.image
            }
            if (ADMIN_EMAILS.includes(user.email.toLowerCase())) {
              updates.role = 'ADMIN'
            }
            await User.updateOne(
              { email: user.email.toLowerCase() },
              { $set: updates }
            )
          }
        } catch (err) {
          console.error('SignIn callback error:', err)
          // Still allow sign in even if DB sync fails
        }
      }
      return true
    },
    async jwt({ token, user, trigger, session }) {
      // First sign-in: populate token with DB data
      if (user && user.email) {
        try {
          await connectDB()
          const dbUser = await User.findOne({ email: user.email.toLowerCase() }).lean()
          if (dbUser) {
            token.id = dbUser._id.toString()
            token.role = dbUser.role
            token.phone = dbUser.phone
          } else {
            // Fallback if DB user not found yet
            token.role = ADMIN_EMAILS.includes(user.email.toLowerCase()) ? 'ADMIN' : 'CUSTOMER'
          }
        } catch {
          token.role = ADMIN_EMAILS.includes((user.email || '').toLowerCase()) ? 'ADMIN' : 'CUSTOMER'
        }
      }

      // On every token refresh, fetch the latest role from DB
      // (handles role changes without requiring re-login)
      if (!user && token.email) {
        try {
          await connectDB()
          const dbUser = await User.findOne({ email: (token.email as string).toLowerCase() }).select('_id role phone').lean()
          if (dbUser) {
            token.id = dbUser._id.toString()
            token.role = dbUser.role
            token.phone = dbUser.phone
          }
        } catch {
          // Keep existing token values on error
        }
      }

      // Handle session update (e.g., after profile edit)
      if (trigger === 'update' && session) {
        token.name = session.name ?? token.name
        token.phone = session.phone ?? token.phone
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.phone = token.phone
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
}

