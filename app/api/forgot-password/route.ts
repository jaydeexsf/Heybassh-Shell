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
// For Gmail: Use App Password (not regular password)
// Set these environment variables: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM
// Production credentials are set via environment variables in Vercel
const getTransporter = () => {
  // Use environment variables first (production), fallback to defaults if not set
  const smtpUser = process.env.SMTP_USER || 'jaydeexsf0@gmail.com'
  const smtpPassword = process.env.SMTP_PASSWORD || 'bgoz akel fvqb muqt'
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com'
  const smtpPort = parseInt(process.env.SMTP_PORT || '587')
  const smtpFrom = process.env.SMTP_FROM || smtpUser

  // Warn if using fallback credentials (not from env vars)
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.warn(`⚠️  [SMTP] Using fallback credentials - Set SMTP_USER and SMTP_PASSWORD in Vercel for production!`)
  }

  const secure = smtpPort === 465 // Port 465 uses SSL/TLS, port 587 uses STARTTLS

  console.log(`🔧 [SMTP] Creating transporter with:`)
  console.log(`   Host: ${smtpHost}`)
  console.log(`   Port: ${smtpPort}`)
  console.log(`   Secure: ${secure}`)
  console.log(`   User: ${smtpUser}`)
  console.log(`   From: ${smtpFrom}`)
  console.log(`   Using env vars: ${!!process.env.SMTP_USER && !!process.env.SMTP_PASSWORD}`)

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: secure, // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
    // Add connection timeout and retry options
    connectionTimeout: 15000, // 15 seconds
    greetingTimeout: 15000,
    socketTimeout: 15000,
    // Enable debug for troubleshooting (set to true if needed)
    debug: false,
    logger: false,
  })

  return transporter
}

// Verify SMTP connection
const verifyTransporter = async (transporter: ReturnType<typeof nodemailer.createTransport>): Promise<boolean> => {
  try {
    console.log(`🔍 [SMTP] Verifying SMTP connection...`)
    await transporter.verify()
    console.log(`✅ [SMTP] SMTP connection verified successfully`)
    return true
  } catch (error) {
    console.error(`❌ [SMTP] SMTP connection verification failed:`)
    if (error instanceof Error) {
      console.error(`   Error: ${error.message}`)
    } else {
      console.error(`   Error:`, error)
    }
    return false
  }
}

export async function POST(req: Request) {
  try {
    console.log("=".repeat(60))
    console.log("🔐 [FORGOT PASSWORD] Request received")
    console.log("=".repeat(60))
    
    const body = await req.json()
    const { email } = schema.parse(body)
    const normalizedEmail = email.trim().toLowerCase()

    console.log(`📧 [FORGOT PASSWORD] Processing request for email: ${normalizedEmail}`)

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })

    // Don't reveal if user exists or not for security
    if (!user) {
      console.log(`❌ [FORGOT PASSWORD] User not found for email: ${normalizedEmail}`)
      console.log("=".repeat(60))
      return NextResponse.json({
        success: true,
        emailSent: false,
        message: "If an account exists with this email, a password reset link has been sent. Please check your inbox."
      })
    }

    console.log(`✅ [FORGOT PASSWORD] User found: ${user.id}`)

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date()
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1) // Token expires in 1 hour

    console.log(`🔑 [FORGOT PASSWORD] Generated reset token (expires in 1 hour)`)

    // Save token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })

    console.log(`💾 [FORGOT PASSWORD] Reset token saved to database`)

    // Create reset URL - handle Vercel deployment URLs properly
    const baseUrl = process.env.NEXTAUTH_URL 
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
      || process.env.NEXT_PUBLIC_APP_URL
      || "https://heybassh-shell.vercel.app"
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`

    console.log(`🔗 [FORGOT PASSWORD] Reset URL created: ${resetUrl}`)

    // Send email
    const transporter = getTransporter()
    // Always try to send email (transporter is now always available with fallback)
    if (transporter) {
      // Verify connection first (optional but helpful for debugging)
      const isVerified = await verifyTransporter(transporter)
      if (!isVerified) {
        console.warn(`⚠️  [FORGOT PASSWORD] SMTP verification failed, but attempting to send anyway...`)
      }

      console.log(`📤 [FORGOT PASSWORD] Attempting to send password reset email...`)
      console.log(`   To: ${normalizedEmail}`)
      console.log(`   From: ${process.env.SMTP_FROM || process.env.SMTP_USER}`)
      console.log(`   Subject: Password Reset Request`)
      console.log(`   Reset URL: ${resetUrl}`)
      
      try {
        const emailInfo = await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: normalizedEmail,
          subject: "Password Reset Request",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #3ab0ff;">Password Reset Request</h2>
              <p>You requested to reset your password. Click the link below to reset it:</p>
              <p style="margin: 20px 0;">
                <a href="${resetUrl}" style="background-color: #3ab0ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Reset Password</a>
              </p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #666; background-color: #f5f5f5; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px;">${resetUrl}</p>
              <p style="color: #999; font-size: 14px; margin-top: 20px;">This link will expire in 1 hour.</p>
              <p style="color: #999; font-size: 14px;">If you didn't request this, please ignore this email.</p>
            </div>
          `,
          text: `Password Reset Request\n\nClick this link to reset your password:\n${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, please ignore this email.`
        })
        
        console.log(`✅ [FORGOT PASSWORD] Email sent successfully!`)
        console.log(`   Message ID: ${emailInfo.messageId}`)
        console.log(`   Response: ${emailInfo.response || 'No response'}`)
        console.log(`   Accepted: ${emailInfo.accepted?.join(', ') || 'N/A'}`)
        console.log(`   Rejected: ${emailInfo.rejected?.join(', ') || 'None'}`)
        console.log(`📧 [FORGOT PASSWORD] Password reset email has been sent to ${normalizedEmail}`)
        console.log("=".repeat(60))
        
        // Return success with email sent confirmation
        return NextResponse.json({
          success: true,
          emailSent: true,
          message: `✅ Password reset email has been sent successfully to ${normalizedEmail}. Please check your inbox (and spam folder) for the reset link.`,
          details: {
            to: normalizedEmail,
            messageId: emailInfo.messageId,
            accepted: emailInfo.accepted || [],
            rejected: emailInfo.rejected || []
          }
        })
      } catch (emailError) {
        console.error(`❌ [FORGOT PASSWORD] Email sending failed!`)
        console.error(`   Error:`, emailError)
        const errorMessage = emailError instanceof Error ? emailError.message : 'Unknown error'
        const errorCode = (emailError as any)?.code || 'UNKNOWN'
        
        if (emailError instanceof Error) {
          console.error(`   Error message: ${errorMessage}`)
          console.error(`   Error code: ${errorCode}`)
          console.error(`   Error command: ${(emailError as any).command || 'N/A'}`)
          if (emailError.stack) {
            console.error(`   Error stack: ${emailError.stack}`)
          }
        }
        console.log("=".repeat(60))
        
        // Return error response so user knows email wasn't sent
        return NextResponse.json({
          success: false,
          emailSent: false,
          message: `❌ Failed to send password reset email. Error: ${errorMessage}. Please check your email settings or try again later.`,
          error: errorMessage,
          errorCode: errorCode
        }, { status: 500 })
      }
    } else {
      // Development mode - log the reset link
      console.log(`⚠️  [FORGOT PASSWORD] SMTP not configured - email will not be sent`)
      console.log(`   SMTP_HOST: ${process.env.SMTP_HOST || 'Not set (defaults to smtp.gmail.com)'}`)
      console.log(`   SMTP_PORT: ${process.env.SMTP_PORT || 'Not set (defaults to 587)'}`)
      console.log(`   SMTP_USER: ${process.env.SMTP_USER ? 'Set' : 'NOT SET'}`)
      console.log(`   SMTP_PASSWORD: ${process.env.SMTP_PASSWORD ? 'Set' : 'NOT SET'}`)
      console.log(`   SMTP_FROM: ${process.env.SMTP_FROM || 'Not set (uses SMTP_USER)'}`)
      console.log("=".repeat(60))
      console.log("🔗 PASSWORD RESET LINK (SMTP not configured):")
      console.log(resetUrl)
      console.log("=".repeat(60))
        
        // This should not happen anymore since we have fallback credentials
        // But keep it as a safety check
        return NextResponse.json({
          success: false,
          emailSent: false,
          message: `⚠️ Email service is not configured. Password reset link: ${resetUrl}`,
          resetUrl: resetUrl,
          smtpConfigured: false
        }, { status: 500 })
    }

  } catch (error) {
    console.error("=".repeat(60))
    console.error("❌ [FORGOT PASSWORD] Error occurred:")
    console.error(error)
    if (error instanceof Error) {
      console.error(`   Error message: ${error.message}`)
      console.error(`   Error stack: ${error.stack}`)
    }
    console.error("=".repeat(60))
    
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

