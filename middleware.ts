
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export default async function middleware(req: NextRequest) {
  const url = new URL(req.url)
  const path = url.pathname

  const session = await getToken({ req, secret: process.env.AUTH_SECRET })

  // 1) Normalize global /dashboard to account-scoped /{account_id}/dashboard
  if (path === "/dashboard" || path.startsWith("/dashboard/")) {
    if (!session) return NextResponse.redirect(new URL("/", url.origin))
    const accId = (session as any)?.user?.account_id
    if (accId) {
      const tail = path.length > 10 ? path.slice("/dashboard".length) : ""
      return NextResponse.redirect(new URL(`/${accId}/dashboard${tail}`, url.origin))
    }
    return NextResponse.redirect(new URL("/", url.origin))
  }

  // 2) Protect account-scoped dashboard routes and enforce correct tenant in URL
  const isAccountScoped = /^\/[^/]+\/dashboard(\/.*)?$/.test(path)
  if (isAccountScoped) {
    if (!session) return NextResponse.redirect(new URL("/", url.origin))
    const accId = (session as any)?.user?.account_id
    const pathAccId = path.split("/")[1]
    if (accId && pathAccId !== accId) {
      return NextResponse.redirect(new URL(`/${accId}/dashboard`, url.origin))
    }
  }

  return NextResponse.next()
}

export const config = { matcher: ["/dashboard/:path*", "/:account_id/dashboard/:path*"] }
