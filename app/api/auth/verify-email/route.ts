import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

const schema = z.object({
  token: z.string().min(10),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { token } = schema.parse(body)

    const record = await prisma.emailVerificationToken.findUnique({ where: { token } })
    if (!record || record.expires < new Date()) {
      return NextResponse.json({ success: false, error: "INVALID_OR_EXPIRED" }, { status: 400 })
    }

    await prisma.$transaction([
      prisma.user.updateMany({
        where: { email: record.email },
        data: { emailVerified: new Date() },
      }),
      prisma.emailVerificationToken.deleteMany({ where: { email: record.email } }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "INVALID_REQUEST" }, { status: 400 })
    }
    console.error("Verify email error:", error)
    return NextResponse.json({ success: false, error: "SERVER_ERROR" }, { status: 500 })
  }
}

