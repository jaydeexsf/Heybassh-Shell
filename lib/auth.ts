
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

// Use a dynamic import for Prisma to avoid Edge Runtime issues
const prismaClient = prisma

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        try {
          const parsed = z.object({
            email: z.string().email(),
            password: z.string().min(6)
          }).safeParse(credentials)
          
          if (!parsed.success) return null
          
          const { email, password } = parsed.data
          const user = await prismaClient.user.findUnique({ 
            where: { email } 
          })
          
          if (!user) return null
          
          const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
          if (!isPasswordValid) return null
          
          return { 
            id: user.id, 
            email: user.email, 
            name: user.name ?? user.email 
          }
        } catch (error) {
          console.error('Authorization error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user
      }
      return token
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as any
      }
      return session
    }
  },
  secret: process.env.AUTH_SECRET,
  // Disable Edge Runtime for auth routes
  experimental: {
    enableWebAuthn: false
  }
})
