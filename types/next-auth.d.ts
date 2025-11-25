import NextAuth, { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string
      role?: string | null
      account_id?: string | null
      companyName?: string | null
    }
  }

  interface User extends DefaultUser {
    role?: string | null
    account_id?: string | null
    companyName?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      id: string
      email: string
      name?: string | null
      role?: string | null
      account_id?: string | null
      companyName?: string | null
    }
  }
}
