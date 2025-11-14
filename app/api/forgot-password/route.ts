import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import crypto from "crypto"
import nodemailer from "nodemailer"

export const runtime = 'nodejs'

const schema = z.object({
  email: z.string().email()
})

// Email transporter - configure with your SMTP settings
// For Gmail: Enable "Less secure app access" or use App Password
// Set these environment variables: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM
const getTransporter = () => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    return null
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = schema.parse(body)
    const normalizedEmail = email.trim().toLowerCase()

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })

    // Don't reveal if user exists or not for security
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, a password reset link has been sent."
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date()
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1) // Token expires in 1 hour

    // Save token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL || process.env.VERCEL_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`

    // Send email
    const transporter = getTransporter()
    if (transporter) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: normalizedEmail,
          subject: "Password Reset Request",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #3ab0ff;">Password Reset Request</h2>
              <p>You requested to reset your password. Click the link below to reset it:</p>
              <p><a href="${resetUrl}" style="background-color: #3ab0ff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #666;">${resetUrl}</p>
              <p>This link will expire in 1 hour.</p>
              <p>If you didn't request this, please ignore this email.</p>
            </div>
          `,
          text: `Password Reset Request\n\nClick this link to reset your password: ${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, please ignore this email.`
        })
      } catch (emailError) {
        console.error("Email sending error:", emailError)
        // Still return success to not reveal if email exists
        return NextResponse.json({
          success: true,
          message: "If an account exists with this email, a password reset link has been sent."
        })
      }
    } else {
      // Development mode - log the reset link
      console.log("=".repeat(60))
      console.log("PASSWORD RESET LINK (SMTP not configured):")
      console.log(resetUrl)
      console.log("=".repeat(60))
    }

    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, a password reset link has been sent."
    })

  } catch (error) {
    console.error("Forgot password error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "VALIDATION_ERROR", message: "Invalid email format." },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "SERVER_ERROR", message: "An error occurred. Please try again." },
      { status: 500 }
    )
  }
}

