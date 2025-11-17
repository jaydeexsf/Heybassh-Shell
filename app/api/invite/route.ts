import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { createPasswordResetToken } from "@/lib/reset-tokens"

export const runtime = "nodejs"

const schema = z.object({
  account_id: z.string().length(7),
  email: z.string().email(),
  name: z.string().optional(),
  role: z.enum(["user", "admin"]).optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { account_id, email, name, role } = schema.parse(body)

    const normalizedEmail = email.trim().toLowerCase()

    // Ensure account exists
    const account = await prisma.account.findUnique({ where: { account_id } })
    if (!account) {
      return NextResponse.json(
        { error: "ACCOUNT_NOT_FOUND", message: "Account does not exist." },
        { status: 404 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (existingUser) {
      return NextResponse.json(
        { error: "USER_EXISTS", message: "A user with this email already exists." },
        { status: 409 }
      )
    }

    // Create user with a random temporary password
    const tempPassword = Math.random().toString(36).slice(-10)
    const passwordHash = await bcrypt.hash(tempPassword, 10)

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name,
        passwordHash,
        role: role ?? "user",
        account_id,
      },
      select: { id: true, email: true, name: true, role: true, account_id: true },
    })

    // Create a password reset token for the invited user so they can set their own password
    const resetToken = await createPasswordResetToken(normalizedEmail)
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken.token}`

    // For testing: return the reset URL in response instead of sending real email
    return NextResponse.json({
      success: true,
      user,
      resetUrl,
      message: "User invited successfully. Share the resetUrl with the user to set their password.",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "VALIDATION_ERROR", details: error.errors },
        { status: 400 }
      )
    }
    console.error("Invite user error:", error)
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 })
  }
}
