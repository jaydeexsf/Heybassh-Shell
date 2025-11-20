"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function deriveCompany(email: string) {
  const domainPart = email.split("@")[1]?.toLowerCase() || "example.com"
  const root = domainPart.split(".")[0] || "company"
  const company_name = root
    .replace(/[-_]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ") || "Company"
  return {
    company_name,
    company_domain: domainPart,
  }
}

export default function CreateAccountPage() {
  const router = useRouter()
  const [ownerEmail, setOwnerEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  async function onVerify(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setStatus(null)
    const trimmedEmail = ownerEmail.trim().toLowerCase()
    if (!trimmedEmail || !emailPattern.test(trimmedEmail)) {
      setError("Enter a valid email address")
      return
    }
    setLoading(true)
    setStatus("Verifying email…")
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200))
      const { company_name, company_domain } = deriveCompany(trimmedEmail)
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name,
          company_domain,
          owner_email: trimmedEmail,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || "Failed to create account")
        setStatus(null)
        return
      }
      setStatus(`✔️ Created ${company_name}. Next: secure your workspace…`)
      const query = new URLSearchParams({
        email: trimmedEmail,
        company: company_name,
      }).toString()
      setTimeout(
        () => router.push(`/create-account/${data.account_id}/set-password?${query}`),
        900,
      )
    } catch (err: any) {
      setError("Unexpected error. Please try again.")
      setStatus(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0b1124]">
      <form onSubmit={onVerify} className="w-full max-w-md space-y-4 bg-[#0d142a] border border-[#111936] p-6 rounded-2xl">
        <h1 className="text-white text-xl font-semibold">Create your free account</h1>
        <p className="text-sm text-blue-200/80">
          Drop in any work email. We’ll auto-detect the company name and domain and send a verification message to the workspace owner.
        </p>
        <div>
          <label className="block text-sm text-blue-200 mb-1">Work email</label>
          <div className="flex gap-2">
            <input
              type="email"
              className="flex-1 rounded-lg border border-[#1a2446] bg-[#0b132c] p-2 text-white"
              placeholder="you@company.com"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex items-center justify-center gap-2 rounded-lg text-sm font-semibold whitespace-nowrap disabled:opacity-60"
            >
              {loading ? "Verifying…" : "Verify email"}
            </button>
          </div>
        </div>
        {status && <div className="text-green-300 text-sm">{status}</div>}
        {error && <div className="text-red-400 text-sm">{error}</div>}
      </form>
    </div>
  )
}
