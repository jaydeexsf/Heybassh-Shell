import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

export const runtime = 'nodejs'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const normalizedEmail = body.email?.trim().toLowerCase()

    // Validate schema for other accounts
    const { email, password } = schema.parse(body)

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        emailVerified: true,
        account_id: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "EMAIL_NOT_FOUND", message: "No account found with this email address." },
        { status: 401 }
      )
    }

    if (!user.emailVerified) {
      if (user.account_id) {
        await prisma.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() },
        })
      } else {
        return NextResponse.json(
          { error: "EMAIL_NOT_VERIFIED", message: "Please verify your email address before signing in." },
          { status: 403 },
        )
      }
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash)
    
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "INVALID_PASSWORD", message: "The password you entered is incorrect." },
        { status: 401 }
      )
    }

    // Credentials are valid - return success
    // The client will call NextAuth signIn to create the session
    return NextResponse.json({ 
      success: true,
      message: "Credentials validated successfully"
    })

  } catch (error) {
    console.error("Login validation error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "VALIDATION_ERROR", message: "Invalid email or password format." },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "SERVER_ERROR", message: "An error occurred during login. Please try again." },
      { status: 500 }
    )
  }
}

