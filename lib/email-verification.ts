import { v4 as uuidv4 } from "uuid"
import nodemailer from "nodemailer"
import { prisma } from "./prisma"

const VERIFICATION_TOKEN_EXPIRY = 1000 * 60 * 60 * 24 // 24 hours

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER || "jaydeexsf0@gmail.com",
    pass: process.env.SMTP_PASSWORD || "bgoz akel fvqb muqt",
  },
})

export async function createEmailVerificationToken(email: string) {
  await prisma.emailVerificationToken.deleteMany({ where: { email } })
  const token = uuidv4()
  const expires = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY)
  return prisma.emailVerificationToken.create({
    data: { email, token, expires },
  })
}

export async function sendVerificationEmail(email: string, token: string, companyName?: string) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
  const verifyUrl = `${baseUrl.replace(/\/$/, "")}/verify-email?token=${encodeURIComponent(token)}`

  const mailOptions = {
    from: process.env.SMTP_FROM || "jaydeexsf0@gmail.com",
    to: email,
    subject: "Verify your Heybassh Shell account",
    html: `
      <div style="font-family: Arial, sans-serif; color: #0b1124;">
        <h2>Welcome${companyName ? ` to ${companyName}` : ""}!</h2>
        <p>Thanks for creating a Heybassh Shell workspace. Please confirm your email address to activate your account.</p>
        <p>
          <a href="${verifyUrl}" style="background:#3ab0ff;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block;">Verify email</a>
        </p>
        <p>This link will expire in 24 hours. If you didn't request this, feel free to ignore this email.</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
  return verifyUrl
}

export async function validateVerificationToken(token: string) {
  const record = await prisma.emailVerificationToken.findUnique({ where: { token } })
  if (!record || record.expires < new Date()) {
    return null
  }
  return record
}

