import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

const DEAL_STATUSES = new Set(["Open", "Won", "Lost"])
const DEAL_STAGES = new Set(["New", "Qualified", "Proposal", "Negotiation", "Won", "Lost"])

const dealSelect = {
  id: true,
  name: true,
  company: true,
  amount: true,
  owner: true,
  stage: true,
  status: true,
  createdAt: true,
  lastActivity: true,
} satisfies Record<string, boolean>

type DealRow = {
  id: string
  name: string
  company: string | null
  amount: number
  owner: string | null
  stage: string
  status: string
  createdAt: Date
  lastActivity: Date
}

function normalizeDeal(deal: DealRow) {
  return {
    ...deal,
    company: deal.company ?? "",
    owner: deal.owner ?? "Unassigned",
  }
}

type DealPayload = {
  name: string
  company?: string
  amount?: number
  owner?: string
  stage?: string
  status?: string
  createdAt?: string
  lastActivity?: string
}

function parseDate(value?: string) {
  if (!value) return undefined
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

export async function GET(_req: Request, { params }: { params: { account_id: string } }) {
  try {
    const dealClient = (prisma as typeof prisma & { deal: any }).deal
    const deals = (await dealClient.findMany({
      where: { account: { account_id: params.account_id } },
      orderBy: { createdAt: "desc" },
      select: dealSelect,
    })) as DealRow[]

    return NextResponse.json(deals.map((deal) => normalizeDeal(deal)))
  } catch (error) {
    console.error("[deals][GET]", error)
    return NextResponse.json({ error: "Failed to load deals" }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: { account_id: string } }) {
  try {
    const body = (await req.json()) as DealPayload
    if (!body?.name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const account = await prisma.account.findUnique({
      where: { account_id: params.account_id },
      select: { accountSeq: true },
    })
    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    const createdAt = parseDate(body.createdAt)
    const lastActivity = parseDate(body.lastActivity) ?? createdAt
    const dealClient = (prisma as typeof prisma & { deal: any }).deal

    const deal = (await dealClient.create({
      data: {
        accountSeq: account.accountSeq,
        name: body.name.trim(),
        company: body.company?.trim() || null,
        amount: Number.isFinite(body.amount ?? NaN) ? (body.amount as number) : 0,
        owner: body.owner?.trim() || "Unassigned",
        stage: DEAL_STAGES.has(body.stage ?? "") ? (body.stage as string) : "New",
        status: DEAL_STATUSES.has(body.status ?? "") ? (body.status as string) : "Open",
        ...(createdAt ? { createdAt } : {}),
        ...(lastActivity ? { lastActivity } : {}),
      },
      select: dealSelect,
    })) as DealRow

    return NextResponse.json(normalizeDeal(deal), { status: 201 })
  } catch (error) {
    console.error("[deals][POST]", error)
    return NextResponse.json({ error: "Failed to create deal" }, { status: 500 })
  }
}


