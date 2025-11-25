
import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl
  const path = url.pathname

  const token = await getToken({ req, secret: process.env.AUTH_SECRET })
  const sessionUser = (token as any)?.user

  // 1) Normalize global /dashboard to account-scoped /{account_id}/dashboard
  if (path === "/dashboard" || path.startsWith("/dashboard/")) {
    if (!token) return NextResponse.redirect(new URL("/", url.origin))
    const accId = sessionUser?.account_id
    if (accId) {
      const tail = path.length > 10 ? path.slice("/dashboard".length) : ""
      return NextResponse.redirect(new URL(`/${accId}/dashboard${tail}`, url.origin))
    }
    return NextResponse.redirect(new URL("/", url.origin))
  }

  // 2) Protect account-scoped dashboard routes and enforce correct tenant in URL
  const isAccountScoped = /^\/[^/]+\/dashboard(\/.*)?$/.test(path)
  if (isAccountScoped) {
    if (!token) return NextResponse.redirect(new URL("/", url.origin))
    const accId = sessionUser?.account_id
    const pathAccId = path.split("/")[1]
    if (accId && pathAccId !== accId) {
      return NextResponse.redirect(new URL(`/${accId}/dashboard`, url.origin))
    }
  }

  return NextResponse.next()
}

export const config = { matcher: ["/dashboard/:path*", "/:account_id/dashboard/:path*"] }
