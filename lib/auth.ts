
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

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
      authorize: async (creds) => {
        try {
          const parsed = z.object({
            email: z.string().email(),
            password: z.string().min(1)
          }).safeParse(creds)
          
          if (!parsed.success) {
            throw new Error("INVALID_FORMAT")
          }
          
          const { email, password } = parsed.data
          const normalizedEmail = email.trim().toLowerCase()

          // Check if user exists
          const user = await prisma.user.findUnique({ 
            where: { email: normalizedEmail } 
          })
          
          if (!user) {
            throw new Error("EMAIL_NOT_FOUND")
          }

          // Verify password
          const passwordMatch = await bcrypt.compare(password, user.passwordHash)
          
          if (!passwordMatch) {
            throw new Error("INVALID_PASSWORD")
          }

          // Credentials are valid
          return { id: user.id, email: user.email, name: user.name ?? user.email }
        } catch (err) {
          // Re-throw our custom errors
          if (err instanceof Error && ["EMAIL_NOT_FOUND", "INVALID_PASSWORD", "INVALID_FORMAT"].includes(err.message)) {
            throw err
          }
          console.error("Credentials authorize error:", err)
          throw new Error("AUTH_ERROR")
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user
      return token
    },
    async session({ session, token }) {
      if (token.user) session.user = token.user as any
      return session
    }
  },
  secret: process.env.AUTH_SECRET
})
