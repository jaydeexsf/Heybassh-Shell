import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export const runtime = "nodejs"

const schema = z.object({
  company_name: z.string().min(1),
  company_domain: z.string().min(1),
  owner_email: z.string().email(),
})

function pad7(n: number) {
  return n.toString().padStart(7, "0")
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { company_name, company_domain, owner_email } = schema.parse(body)

    // Step 1: create with autoincrement sequence
    const created = await prisma.account.create({
      data: {
        company_name,
        company_domain,
        owner_email: owner_email.trim().toLowerCase(),
      },
    })

    // Step 2: compute 7-digit account_id and update
    const computedId = pad7(created.accountSeq)
    const updated = await prisma.account.update({
      where: { accountSeq: created.accountSeq },
      data: { account_id: computedId },
      select: {
        account_id: true,
        company_name: true,
        company_domain: true,
        owner_email: true,
        created_at: true,
      },
    })

    return NextResponse.json(updated)
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "VALIDATION_ERROR", details: err.errors }, { status: 400 })
    }
    console.error("Create account error", err)
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 })
  }
}
