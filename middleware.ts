
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default async function middleware(req: Request){
  const url = new URL(req.url)
  if (url.pathname.startsWith("/dashboard")){
    const session = await auth()
    if (!session) return NextResponse.redirect(new URL("/", url.origin))
  }
  return NextResponse.next()
}
export const config = { matcher: ["/dashboard/:path*"] }
