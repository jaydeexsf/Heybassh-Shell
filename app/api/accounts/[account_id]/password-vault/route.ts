import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

type PersistedVault = {
  cipher: string
  iv: string
  salt: string
  lastUpdated: number
  entryCount: number
}

async function getAccountSeq(account_id: string) {
  const account = await prisma.account.findUnique({
    where: { account_id },
    select: { accountSeq: true },
  })
  return account?.accountSeq ?? null
}

export async function GET(
  _req: Request,
  { params }: { params: { account_id: string } }
) {
  try {
    const accountSeq = await getAccountSeq(params.account_id)
    if (!accountSeq) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })
    }

    const vault = await prisma.passwordVault.findFirst({
      where: { accountSeq },
      orderBy: { updatedAt: "desc" },
    })

    if (!vault) {
      return NextResponse.json({ vault: null })
    }

    const payload: PersistedVault = {
      cipher: vault.cipher,
      iv: vault.iv,
      salt: vault.salt,
      lastUpdated: Number(vault.lastUpdated),
      entryCount: vault.entryCount,
    }

    return NextResponse.json({ vault: payload })
  } catch (err) {
    console.error("Fetch password vault error", err)
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { account_id: string } }
) {
  try {
    const accountSeq = await getAccountSeq(params.account_id)
    if (!accountSeq) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })
    }

    const body = (await req.json().catch(() => ({}))) as {
      vault?: PersistedVault | null
    }

    if (!body || typeof body !== "object" || !("vault" in body)) {
      return NextResponse.json({ error: "BAD_REQUEST" }, { status: 400 })
    }

    const { vault } = body

    if (!vault) {
      await prisma.passwordVault.deleteMany({ where: { accountSeq } })
      return NextResponse.json({ ok: true })
    }

    if (
      !vault.cipher ||
      !vault.iv ||
      !vault.salt ||
      typeof vault.lastUpdated !== "number" ||
      typeof vault.entryCount !== "number"
    ) {
      return NextResponse.json({ error: "INVALID_VAULT" }, { status: 400 })
    }

    await prisma.passwordVault.upsert({
      where: { accountSeq },
      create: {
        accountSeq,
        cipher: vault.cipher,
        iv: vault.iv,
        salt: vault.salt,
        lastUpdated: BigInt(vault.lastUpdated),
        entryCount: vault.entryCount,
      },
      update: {
        cipher: vault.cipher,
        iv: vault.iv,
        salt: vault.salt,
        lastUpdated: BigInt(vault.lastUpdated),
        entryCount: vault.entryCount,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Persist password vault error", err)
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 })
  }
}



