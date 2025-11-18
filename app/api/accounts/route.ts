import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createWorkspaceWithAutoId } from "@/lib/workspaces"
import { z } from "zod"

export const runtime = "nodejs"

const schema = z.object({
  company_name: z.string().min(1),
  company_domain: z.string().min(1),
  owner_email: z.string().email(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { company_name, company_domain, owner_email } = schema.parse(body)

    const account = await createWorkspaceWithAutoId(prisma, {
      company_name,
      company_domain,
      owner_email: owner_email.trim().toLowerCase(),
    })

    return NextResponse.json(account)
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "VALIDATION_ERROR", details: err.errors }, { status: 400 })
    }
    console.error("Create account error", err)
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 })
  }
}
