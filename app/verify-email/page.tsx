"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

type Status = "checking" | "success" | "error" | "missing"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")
  const [status, setStatus] = useState<Status>("checking")
  const [message, setMessage] = useState("Verifying your email…")

  useEffect(() => {
    if (!token) {
      setStatus("missing")
      setMessage("Missing verification token. Please use the link from your email.")
      return
    }

    let cancelled = false
    async function verify() {
      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })
        const data = await response.json()
        if (cancelled) return
        if (response.ok && data.success) {
          setStatus("success")
          setMessage("Email verified. You can now sign in.")
          setTimeout(() => router.push("/"), 2000)
        } else {
          setStatus("error")
          setMessage("This verification link is invalid or has expired. Request a new one from the sign-up form.")
        }
      } catch (error) {
        console.error("Email verification failed", error)
        if (cancelled) return
        setStatus("error")
        setMessage("Something went wrong while verifying your email. Please try again.")
      }
    }
    verify()
    return () => {
      cancelled = true
    }
  }, [token, router])

  return (
    <main className="min-h-screen bg-[#050915] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0b132c] p-8 shadow-2xl text-center space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-blue-200/70">Email verification</p>
        <h1 className="text-2xl font-semibold">
          {status === "success" ? "You're in ✨" : status === "error" ? "Link invalid" : "One moment…"}
        </h1>
        <p className="text-sm text-blue-100">{message}</p>
        <div className="pt-2">
          {status === "checking" && <span className="spinner inline-block h-5 w-5" aria-label="Verifying" />}
          {status === "success" && (
            <Link href="/" className="btn btn-primary mt-2 inline-flex justify-center">
              Go to sign in
            </Link>
          )}
          {(status === "error" || status === "missing") && (
            <Link href="/" className="btn mt-2 inline-flex justify-center">
              Back to sign in
            </Link>
          )}
        </div>
      </div>
    </main>
  )
}

