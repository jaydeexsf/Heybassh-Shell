import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { validateVerificationToken } from "@/lib/email-verification"

export const runtime = "nodejs"

const schema = z.object({
  email: z.string().email(),
  code: z.string().min(4).max(10),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, code } = schema.parse(body)
    const normalizedEmail = email.trim().toLowerCase()

    const record = await validateVerificationToken(code.trim())
    if (!record || record.email !== normalizedEmail) {
      return NextResponse.json({ success: false, error: "INVALID_CODE" }, { status: 400 })
    }

    await prisma.emailVerificationToken.deleteMany({ where: { email: normalizedEmail } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[CreateAccount][VerifyOTP] error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "INVALID_REQUEST" }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: "SERVER_ERROR" }, { status: 500 })
  }
}


