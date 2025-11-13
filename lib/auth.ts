
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"

// This is a lightweight auth config that defers to API routes for heavy operations
export const { handlers, auth, signIn, signOut } = NextAuth({
  // Use JWT strategy for better performance and compatibility
  session: { 
    strategy: 'jwt',
  },
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
          
          // Call our API route for authentication
          const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/callback/credentials`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });
          
          if (!response.ok) return null;
          
          const user = await response.json();
          return user;
          
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as any;
      }
      return session;
    }
  },
  secret: process.env.AUTH_SECRET,
  // Disable Edge Runtime for auth routes
  experimental: {
    enableWebAuthn: false
  },
  // Use secure cookies in production
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
});
