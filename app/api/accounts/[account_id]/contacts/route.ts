import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export const runtime = "nodejs"

const CONTACT_STATUSES = new Set(["New", "In Progress", "Customer", "Churned"])

const contactSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  company: true,
  owner: true,
  status: true,
  createdAt: true,
  lastActivity: true,
} satisfies Record<string, boolean>

type ContactRow = {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  owner: string | null
  status: string
  createdAt: Date
  lastActivity: Date
}

function normalizeContact(contact: ContactRow) {
  return {
    ...contact,
    phone: contact.phone ?? "",
    company: contact.company ?? "",
    owner: contact.owner ?? "Unassigned",
  }
}

type ContactPayload = {
  name: string
  email: string
  phone?: string
  company?: string
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
    const contactClient = (prisma as typeof prisma & { contact: any }).contact
    const contacts = (await contactClient.findMany({
      where: { account: { account_id: params.account_id } },
      orderBy: { createdAt: "desc" },
      select: contactSelect,
    })) as ContactRow[]
    return NextResponse.json(contacts.map((contact) => normalizeContact(contact)))
  } catch (error) {
    console.error("[contacts][GET]", error)
    return NextResponse.json({ error: "Failed to load contacts" }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: { account_id: string } }) {
  try {
    const body = (await req.json()) as ContactPayload
    if (!body?.name?.trim() || !body?.email?.trim()) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
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
    const contactClient = (prisma as typeof prisma & { contact: any }).contact

    const contact = (await contactClient.create({
      data: {
        accountSeq: account.accountSeq,
        name: body.name.trim(),
        email: body.email.trim(),
        phone: body.phone?.trim() || null,
        company: body.company?.trim() || null,
        owner: body.owner?.trim() || "Unassigned",
        status: CONTACT_STATUSES.has(body.status ?? "") ? body.status! : "New",
        ...(createdAt ? { createdAt } : {}),
        ...(lastActivity ? { lastActivity } : {}),
      },
      select: contactSelect,
    })) as ContactRow

    return NextResponse.json(normalizeContact(contact), { status: 201 })
  } catch (error) {
    console.error("[contacts][POST]", error)
    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { account_id: string } }) {
  try {
    const body = (await req.json()) as ContactPayload & { id: string }
    if (!body?.id) {
      return NextResponse.json({ error: "Contact ID is required" }, { status: 400 })
    }
    if (!body?.name?.trim() || !body?.email?.trim()) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    const account = await prisma.account.findUnique({
      where: { account_id: params.account_id },
      select: { accountSeq: true },
    })
    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    const contactClient = (prisma as typeof prisma & { contact: any }).contact

    // Check if contact exists and belongs to this account
    const existingContact = await contactClient.findFirst({
      where: {
        id: body.id,
        accountSeq: account.accountSeq,
      },
    })

    if (!existingContact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 })
    }

    const lastActivity = parseDate(body.lastActivity) ?? existingContact.lastActivity ?? new Date()

    const contact = (await contactClient.update({
      where: { id: body.id },
      data: {
        name: body.name.trim(),
        email: body.email.trim(),
        phone: body.phone?.trim() || null,
        company: body.company?.trim() || null,
        owner: body.owner?.trim() || "Unassigned",
        status: CONTACT_STATUSES.has(body.status ?? "") ? body.status! : existingContact.status,
        lastActivity,
      },
      select: contactSelect,
    })) as ContactRow

    return NextResponse.json(normalizeContact(contact))
  } catch (error) {
    console.error("[contacts][PUT]", error)
    return NextResponse.json({ error: "Failed to update contact" }, { status: 500 })
  }
}

