import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export const runtime = "nodejs"

const schema = z.object({ email: z.string().email() })

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = schema.parse(body)
    const normalizedEmail = email.trim().toLowerCase()

    // Optional: check if already registered
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } })

    return NextResponse.json({ ok: true, available: !existing })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: "INVALID_EMAIL" }, { status: 400 })
    }
    return NextResponse.json({ ok: false, error: "SERVER_ERROR" }, { status: 500 })
  }
}
