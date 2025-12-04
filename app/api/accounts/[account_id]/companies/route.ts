import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

const COMPANY_STATUSES = new Set(["New", "In Progress", "Customer", "Churned"])

const companySelect = {
  id: true,
  name: true,
  domain: true,
  industry: true,
  size: true,
  owner: true,
  status: true,
  createdAt: true,
  lastActivity: true,
} satisfies Record<string, boolean>

type CompanyRow = {
  id: string
  name: string
  domain: string | null
  industry: string | null
  size: string | null
  owner: string | null
  status: string
  createdAt: Date
  lastActivity: Date
}

function normalizeCompany(company: CompanyRow) {
  return {
    ...company,
    domain: company.domain ?? "",
    industry: company.industry ?? "",
    size: company.size ?? "",
    owner: company.owner ?? "Unassigned",
  }
}

type CompanyPayload = {
  name: string
  domain?: string
  industry?: string
  size?: string
  owner?: string
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
    const companyClient = (prisma as typeof prisma & { company: any }).company
    const companies = (await companyClient.findMany({
      where: { account: { account_id: params.account_id } },
      orderBy: { createdAt: "desc" },
      select: companySelect,
    })) as CompanyRow[]

    return NextResponse.json(companies.map((company) => normalizeCompany(company)))
  } catch (error) {
    console.error("[companies][GET]", error)
    return NextResponse.json({ error: "Failed to load companies" }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: { account_id: string } }) {
  try {
    const body = (await req.json()) as CompanyPayload
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
    const companyClient = (prisma as typeof prisma & { company: any }).company

    const company = (await companyClient.create({
      data: {
        accountSeq: account.accountSeq,
        name: body.name.trim(),
        domain: body.domain?.trim() || null,
        industry: body.industry?.trim() || null,
        size: body.size?.trim() || null,
        owner: body.owner?.trim() || "Unassigned",
        status: COMPANY_STATUSES.has(body.status ?? "") ? (body.status as string) : "New",
        ...(createdAt ? { createdAt } : {}),
        ...(lastActivity ? { lastActivity } : {}),
      },
      select: companySelect,
    })) as CompanyRow

    return NextResponse.json(normalizeCompany(company), { status: 201 })
  } catch (error) {
    console.error("[companies][POST]", error)
    return NextResponse.json({ error: "Failed to create company" }, { status: 500 })
  }
}




