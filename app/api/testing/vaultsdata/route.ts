import { NextResponse } from "next/server"

type VaultData = {
  id?: string | null
  label?: string
  username?: string
  password?: string
  url?: string
  notes?: string
  tags?: string[]
  favorite?: boolean
}

export const runtime = "nodejs"

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Partial<VaultData>

  // Normalize optional fields
  const payload: VaultData = {
    id: body.id ?? null,
    label: body.label,
    username: body.username,
    password: body.password,
    url: body.url,
    notes: body.notes,
    tags: Array.isArray(body.tags) ? body.tags.map(String) : undefined,
    favorite: typeof body.favorite === "boolean" ? body.favorite : undefined,
  }

  return NextResponse.json({ ok: true, data: payload })
}



