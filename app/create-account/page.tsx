"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const exampleAccount = {
  name: "Tesla",
  domain: "teslatest.com",
  email: "dev@teslatest.com",
}

export default function CreateAccountPage() {
  const router = useRouter()
  const [companyName, setCompanyName] = useState("")
  const [companyDomain, setCompanyDomain] = useState("")
  const [ownerEmail, setOwnerEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      setError("Unexpected error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function loadExample() {
    setCompanyName(exampleAccount.name)
    setCompanyDomain(exampleAccount.domain)
    setOwnerEmail(exampleAccount.email)
  }

  const upcomingUrlHint = `/${companyName ? "XXXXXXX" : "0000001"}/dashboard`

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#040814] via-[#07122c] to-[#02040b] px-6 py-12 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#3ab0ff]/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 translate-x-1/4 translate-y-1/4 rounded-full bg-[#5dd4ff]/20 blur-3xl" />
      </div>

      <section className="relative z-10 mx-auto grid w-full max-w-5xl gap-10 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-2xl lg:grid-cols-[1.05fr_0.95fr] lg:p-12">
        <div className="flex flex-col justify-between gap-10">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-blue-100/70">Account = Company</p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-white lg:text-4xl">
              Create a company workspace with its own 7-digit account ID.
            </h1>
            <p className="mt-4 text-base text-blue-100/90">
              Each account gets a dedicated URL namespace: <span className="font-semibold text-blue-50">/{`0000001`}/dashboard</span>,
              <span className="ml-1 font-semibold text-blue-50">/{`0000002`}/contacts</span>, etc. Switch between modules without a full page reload.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-blue-100/80">
              <li>• 7-digit, zero-padded ID (e.g. 0000007) is generated automatically.</li>
              <li>• Owner email becomes the first admin; invite additional users later.</li>
              <li>• Perfect for spinning up QA/test tenants or live customer portals.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-blue-100/80">
            <div className="text-xs uppercase tracking-[0.3em] text-blue-300">Test example</div>
            <p className="mt-2 font-semibold text-white">Tesla / teslatest.com</p>
            <p className="text-xs text-blue-200/80">Owner email: dev@teslatest.com</p>
            <p className="mt-3 text-xs text-blue-200">
              URL preview once created: <span className="font-mono text-blue-50">/{`000000X`}/dashboard</span>
            </p>
            <button
              type="button"
              onClick={loadExample}
              className="mt-4 inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-1 text-xs font-semibold text-blue-50 hover:bg-white/10"
            >
              Fill form with Tesla sample
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-black/50 p-6 shadow-[0_20px_45px_-25px_rgba(16,167,255,0.45)] sm:p-8">
          <div>
            <label className="block text-sm font-medium text-blue-100">Company name</label>
            <input
              className="mt-2 w-full rounded-lg border border-white/10 bg-[#0b132c] p-3 text-sm text-white focus:border-[#3ab0ff]/70 focus:outline-none"
              placeholder="Tesla"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-100">Company domain</label>
            <input
              className="mt-2 w-full rounded-lg border border-white/10 bg-[#0b132c] p-3 text-sm text-white focus:border-[#3ab0ff]/70 focus:outline-none"
              placeholder="teslatest.com"
              value={companyDomain}
              onChange={(e) => setCompanyDomain(e.target.value)}
              required
            />
            <p className="mt-1 text-xs text-blue-200/70">We use this to pre-fill modules and automations.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-100">Owner email</label>
            <input
              type="email"
              className="mt-2 w-full rounded-lg border border-white/10 bg-[#0b132c] p-3 text-sm text-white focus:border-[#3ab0ff]/70 focus:outline-none"
              placeholder="name@company.com"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              required
            />
            <p className="mt-1 text-xs text-blue-200/70">Use any dev/test inbox—no verification required for this flow.</p>
          </div>
          <div className="rounded-lg border border-dashed border-white/15 bg-white/5 px-4 py-3 text-xs text-blue-100/80">
            After creation you'll land at <span className="font-mono text-blue-50">{upcomingUrlHint}</span>. Switch modules via SPA routing – no full reloads.
          </div>
          {error && <div className="rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary flex items-center justify-center rounded-lg text-sm font-semibold uppercase tracking-[0.2em] transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create free account"}
          </button>
          <p className="text-center text-xs text-blue-200/80">
            Already registered a workspace?{" "}
            <Link href="/" className="text-[#5dd4ff] underline-offset-4 hover:underline">
              Return to sign in
            </Link>
          </p>
        </form>
      </section>
    </main>
  )
}
