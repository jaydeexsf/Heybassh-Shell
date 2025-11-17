import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET(
  _req: Request,
  { params }: { params: { account_id: string } }
) {
  try {
    const account = await prisma.account.findUnique({
      where: { account_id: params.account_id },
      select: {
        account_id: true,
        company_name: true,
        company_domain: true,
        owner_email: true,
        created_at: true,
      },
    })
    if (!account) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })
    return NextResponse.json(account)
  } catch (err) {
    console.error("Fetch account error", err)
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 })
  }
}
