import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { createEmailVerificationToken, sendVerificationCodeEmail } from "@/lib/email-verification"

export const runtime = "nodejs"

const schema = z.object({
  email: z.string().email(),
  company_name: z.string().min(2),
  company_domain: z.string().min(2),
})

function padAccountId(n: number) {
  return n.toString().padStart(7, "0")
}

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, company_name, company_domain } = schema.parse(body)
    const normalizedEmail = email.trim().toLowerCase()

    let account = await prisma.account.findFirst({
      where: { owner_email: normalizedEmail },
      select: { accountSeq: true, account_id: true, company_name: true, company_domain: true, owner_email: true },
    })

    if (!account) {
      const created = await prisma.account.create({
        data: {
          company_name,
          company_domain,
          owner_email: normalizedEmail,
        },
      })
      const accountId = padAccountId(created.accountSeq)
      account = await prisma.account.update({
        where: { accountSeq: created.accountSeq },
        data: { account_id: accountId },
        select: { accountSeq: true, account_id: true, company_name: true, company_domain: true, owner_email: true },
      })
    } else if (!account.account_id) {
      const accountId = padAccountId(account.accountSeq)
      account = await prisma.account.update({
        where: { accountSeq: account.accountSeq },
        data: { account_id: accountId },
        select: { accountSeq: true, account_id: true, company_name: true, company_domain: true, owner_email: true },
      })
    }

    if (!account?.account_id) {
      return NextResponse.json({ error: "ACCOUNT_CREATION_FAILED" }, { status: 500 })
    }

    const code = generateCode()
    await createEmailVerificationToken(normalizedEmail, code, 1000 * 60 * 10) // 10 minutes
    await sendVerificationCodeEmail(normalizedEmail, code, account.company_name)

    return NextResponse.json({
      account_id: account.account_id,
      company_name: account.company_name,
      email: normalizedEmail,
      message: "Verification code sent. Enter it below to continue.",
      expiresInMinutes: 10,
    })
  } catch (error) {
    console.error("[CreateAccount][RequestOTP] error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "VALIDATION_ERROR", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 })
  }
}


