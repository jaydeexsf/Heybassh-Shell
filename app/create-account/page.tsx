"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateAccountPage() {
  const router = useRouter()
  const [companyName, setCompanyName] = useState("")
  const [companyDomain, setCompanyDomain] = useState("")
  const [ownerEmail, setOwnerEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [verifying, setVerifying] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: companyName.trim(),
          company_domain: companyDomain.trim(),
          owner_email: ownerEmail.trim().toLowerCase(),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || "Failed to create account")
        setLoading(false)
        return
      }
      router.push(`/${data.account_id}/dashboard`)
    } catch (err: any) {
      setError("Unexpected error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0b1124]">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 bg-[#0d142a] border border-[#111936] p-6 rounded-2xl">
        <h1 className="text-white text-xl font-semibold">Create your free account</h1>
        <div>
          <label className="block text-sm text-blue-200 mb-1">Company name</label>
          <input
            className="w-full rounded-lg border border-[#1a2446] bg-[#0b132c] p-2 text-white"
            placeholder="Tesla"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-1">Company domain</label>
          <input
            className="w-full rounded-lg border border-[#1a2446] bg-[#0b132c] p-2 text-white"
            placeholder="teslatest.com"
            value={companyDomain}
            onChange={(e) => setCompanyDomain(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-1">Owner email</label>
          <div className="flex gap-2">
            <input
              type="email"
              className="flex-1 rounded-lg border border-[#1a2446] bg-[#0b132c] p-2 text-white"
              placeholder="name@company.com"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={async () => {
                if (verifying) return
                setVerifying(true)
                await new Promise((r) => setTimeout(r, 1200))
                setVerifying(false)
              }}
              disabled={verifying}
              className="btn btn-primary flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap"
            >
              {verifying ? "Verifying..." : "Verify email"}
            </button>
          </div>
        </div>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn btn-primary justify-center"
        >
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
    </div>
  )
}
