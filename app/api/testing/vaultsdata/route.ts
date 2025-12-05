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

type VaultDataWithoutPassword = Omit<VaultData, "password">

export const runtime = "nodejs"

// In-memory storage for testing (replace with actual database in production)
const vaultStorage: VaultData[] = []

export async function GET() {
  try {
    // Return all vault data except passwords
    const dataWithoutPasswords: VaultDataWithoutPassword[] = vaultStorage.map(({ password, ...rest }) => rest)
    
    return NextResponse.json({ ok: true, data: dataWithoutPasswords })
  } catch (error) {
    console.error("GET vaultsdata error", error)
    return NextResponse.json({ error: "Failed to fetch vault data" }, { status: 500 })
  }
}

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

  // Store in memory (replace with actual database save in production)
  if (payload.id) {
    const index = vaultStorage.findIndex((item) => item.id === payload.id)
    if (index >= 0) {
      vaultStorage[index] = payload
    } else {
      vaultStorage.push(payload)
    }
  } else {
    // Generate ID for new entries
    payload.id = `vault-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    vaultStorage.push(payload)
  }

  return NextResponse.json({ ok: true, data: payload })
}

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Partial<VaultData>

  if (!body.id) {
    return NextResponse.json({ error: "ID is required for update" }, { status: 400 })
  }

  // Normalize optional fields
  const payload: VaultData = {
    id: body.id,
    label: body.label,
    username: body.username,
    password: body.password,
    url: body.url,
    notes: body.notes,
    tags: Array.isArray(body.tags) ? body.tags.map(String) : undefined,
    favorite: typeof body.favorite === "boolean" ? body.favorite : undefined,
  }

  // Update in memory (replace with actual database update in production)
  const index = vaultStorage.findIndex((item) => item.id === payload.id)
  if (index >= 0) {
    vaultStorage[index] = payload
    return NextResponse.json({ ok: true, data: payload })
  } else {
    return NextResponse.json({ error: "Vault entry not found" }, { status: 404 })
  }
}



