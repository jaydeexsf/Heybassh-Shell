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
  const [otpCode, setOtpCode] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [accountId, setAccountId] = useState<string | null>(null)
  const [companyName, setCompanyName] = useState<string | null>(null)
  const [normalizedEmail, setNormalizedEmail] = useState<string | null>(null)

  async function onRequestCode(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setStatus(null)
    const trimmedEmail = ownerEmail.trim().toLowerCase()
    if (!trimmedEmail || !emailPattern.test(trimmedEmail)) {
      setError("Enter a valid email address")
      return
    }
    setLoading(true)
    const { company_name, company_domain } = deriveCompany(trimmedEmail)
    try {
      const res = await fetch("/api/create-account/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          company_name,
          company_domain,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || "Failed to send verification code")
        setStatus(null)
        return
      }
      setOtpSent(true)
      setOtpCode("")
      setAccountId(data.account_id)
      setCompanyName(data.company_name ?? company_name)
      setNormalizedEmail(trimmedEmail)
      setStatus(data.message || `Verification code sent to ${trimmedEmail}.`)
    } catch (err: any) {
      console.error("Request OTP error:", err)
      setError("Unexpected error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function onVerifyCode(e: React.FormEvent) {
    e.preventDefault()
    if (!otpSent || !accountId || !normalizedEmail) {
      setError("Request a verification code first.")
      return
    }
    if (otpCode.trim().length < 4) {
      setError("Enter the 6-digit verification code.")
      return
    }
    setError(null)
    setStatus(null)
    setVerifyingOtp(true)
    try {
      const res = await fetch("/api/create-account/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          code: otpCode.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok || !data?.success) {
        setError(data?.error === "INVALID_CODE" ? "Incorrect or expired code. Try again." : data?.error || "Unable to verify code.")
        return
      }
      const query = new URLSearchParams({
        email: normalizedEmail,
        company: companyName ?? "Workspace",
      }).toString()
      if (!data?.setupToken) {
        setError("Verification succeeded but we could not start the setup session. Please request a new code.")
        return
      }
      router.push(`/create-account/${accountId}/set-password?${query}&verification=${encodeURIComponent(data.setupToken)}`)
    } catch (err: any) {
      console.error("Verify OTP error:", err)
      setError("Unexpected error. Please try again.")
    } finally {
      setVerifyingOtp(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0b1124]">
      <div className="w-full max-w-md space-y-4 bg-[#0d142a] border border-[#111936] p-6 rounded-2xl">
        <h1 className="text-white text-xl font-semibold">Create your free account</h1>
        <p className="text-sm text-blue-200/80">
          Drop in any work email. We’ll send a verification code to confirm ownership before you can secure the workspace.
        </p>
        <form onSubmit={onRequestCode} className="space-y-3">
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
                {loading ? "Sending…" : otpSent ? "Resend code" : "Send code"}
              </button>
            </div>
          </div>
        </form>

        {otpSent && (
          <form onSubmit={onVerifyCode} className="space-y-3 border-t border-[#111936] pt-4">
            <label className="block text-sm text-blue-200">Enter the 6-digit verification code</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              className="w-full rounded-lg border border-[#1a2446] bg-[#0b132c] p-2 text-white tracking-[0.4em] text-center text-lg"
              placeholder="______"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
              disabled={verifyingOtp}
              required
            />
            <button
              type="submit"
              disabled={verifyingOtp || otpCode.length < 4}
              className="btn btn-primary w-full rounded-lg text-sm font-semibold disabled:opacity-60"
            >
              {verifyingOtp ? "Verifying…" : "Confirm code"}
            </button>
          </form>
        )}

        {status && <div className="text-green-300 text-sm">{status}</div>}
        {error && <div className="text-red-400 text-sm">{error}</div>}
      </div>
    </div>
  )
}
