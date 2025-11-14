
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  trustHost: true,
  pages: {
    signIn: "/",
    error: "/",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (creds) => {
        try {
          if (!creds?.email) {
            return null
          }

          const email = creds.email as string
          const normalizedEmail = email.trim().toLowerCase()

          // Bypass for test account - no database or password check needed
          if (normalizedEmail === "test@allahuakbar.com") {
            console.log("Test account detected, bypassing auth checks")
            return { 
              id: "test-user-id", 
              email: normalizedEmail, 
              name: "Test User" 
            }
          }

          // Validate schema for other accounts
          const parsed = z.object({
            email: z.string().email(),
            password: z.string().min(1)
          }).safeParse(creds)
          
          if (!parsed.success) {
            return null
          }
          
          const { password } = parsed.data

          // Check if user exists
          const user = await prisma.user.findUnique({ 
            where: { email: normalizedEmail } 
          })
          
          if (!user) {
            return null
          }

          // Verify password
          const passwordMatch = await bcrypt.compare(password, user.passwordHash)
          
          if (!passwordMatch) {
            return null
          }

          // Credentials are valid
          return { id: user.id, email: user.email, name: user.name ?? user.email }
        } catch (err) {
          console.error("Credentials authorize error:", err)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.id,
          email: user.email,
          name: user.name
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = {
          id: (token.user as any).id,
          email: (token.user as any).email,
          name: (token.user as any).name,
          emailVerified: null
        } as any
      }
      return session
    }
  },
  secret: process.env.AUTH_SECRET
})
