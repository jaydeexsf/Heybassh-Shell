"use client"

import { signIn } from "next-auth/react"
import { FormEvent, useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import logo from "../Images/heybasshlogo.png"

type AuthMode = "login" | "register"
type Feedback = { type: "success" | "error" | "info"; message: string }

export default function Page() {
  return (
    <Suspense>
      <HomeInner />
    </Suspense>
  )
}
type FormErrors = Partial<Record<"email" | "password" | "name" | "companyName", string>>

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const blockedEmailDomains = new Set([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "yahoo.com",
  "ymail.com",
  "rocketmail.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "protonmail.com",
  "pm.me",
  "gmx.com",
  "mail.com",
  "zoho.com",
])

function HomeInner() {
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<AuthMode>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [forgotStatus, setForgotStatus] = useState<"idle" | "sending" | "sent">("idle")
  const [showPassword, setShowPassword] = useState(false)
  const [accountId, setAccountId] = useState<string | null>(null)

  useEffect(() => {
    const aid = searchParams.get("account_id")
    if (aid) {
      setAccountId(aid)
    }
  }, [searchParams])

  function resetUi() {
    setFormErrors({})
    setFeedback(null)
    setForgotStatus("idle")
  }

  function handleModeChange(nextMode: AuthMode) {
    resetUi()
    setMode(nextMode)
  }

  function isBusinessEmail(emailValue: string) {
    const domain = emailValue.split("@")[1]?.toLowerCase()
    if (!domain) return false
    return !blockedEmailDomains.has(domain)
  }

  function validateForm(currentMode: AuthMode) {
    const errors: FormErrors = {}
    const trimmedEmail = email.trim().toLowerCase()
    const trimmedPassword = password.trim()
    const trimmedName = name.trim()
    const trimmedCompany = companyName.trim()

    if (!trimmedEmail) errors.email = "Email is required."
    else if (!emailPattern.test(trimmedEmail)) errors.email = "Enter a valid email address."
    else if (currentMode === "register" && !isBusinessEmail(trimmedEmail))
      errors.email = "Please use your business email address (free email providers are not allowed)."

    if (!trimmedPassword) errors.password = "Password is required."
    else if (currentMode === "register" && trimmedPassword.length < 6)
      errors.password = "Use at least 6 characters."

    if (currentMode === "register") {
      if (!trimmedName) errors.name = "Full name is required."
      else if (trimmedName.length < 2) errors.name = "Name should be at least 2 characters."
      if (!trimmedCompany) errors.companyName = "Company name is required."
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function onRegister() {
    if (!validateForm("register")) return
    setLoading(true)
    setFeedback(null)
    try {
      // If no account_id yet, create a company account automatically from email domain
      let acctId = accountId
      const trimmedEmail = email.trim().toLowerCase()
      const trimmedCompany = companyName.trim()
      if (!acctId) {
        try {
          const accountsRes = await fetch("/api/accounts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              company_name: trimmedCompany,
              company_domain: trimmedEmail.split("@")[1] || "company.com",
              owner_email: trimmedEmail,
            }),
          })
          if (accountsRes.ok) {
            const acc = await accountsRes.json()
            acctId = acc.account_id || null
            setAccountId(acctId)
          }
        } catch {}
      }
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email.trim(), 
          password: password.trim(), 
          name: name.trim(),
          companyName: trimmedCompany,
          account_id: acctId || undefined,
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        let errorMessage = data.error || "We couldn't complete your registration."
        if (data.error === "BUSINESS_EMAIL_REQUIRED") {
          errorMessage = "Please use your business email address (free providers are not allowed)."
        }
        setFeedback({ type: "error", message: errorMessage })
        return
      }
      setFeedback({
        type: "success",
        message: "Account created. Please verify your email before signing in.",
      })
      setFormErrors({})
      setMode("login")
      setPassword("")
      setCompanyName("")
    } catch {
      setFeedback({ type: "error", message: "Something went wrong. Please try again in a moment." })
    } finally {
      setLoading(false)
    }
  }

  async function onLogin() {
    if (!validateForm("login")) return
    setLoading(true)
    setFeedback(null)
    setForgotStatus("idle")
    try {
      const trimmedEmail = email.trim().toLowerCase()
      // For other accounts, validate with our custom endpoint for specific error messages
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        // Show specific error message based on error type
        let errorMessage = "Unable to sign in. Please try again."
        
        if (data.error === "EMAIL_NOT_FOUND") {
          errorMessage = "No account found with this email address. Please check your email or create a new account."
        } else if (data.error === "INVALID_PASSWORD") {
          errorMessage = "The password you entered is incorrect. Please try again or use 'Forgot password?' to reset it."
        } else if (data.error === "VALIDATION_ERROR") {
          errorMessage = "Please enter a valid email address and password."
        } else if (data.error === "EMAIL_NOT_VERIFIED") {
          errorMessage = "Please verify your email address before signing in. Check your inbox for the confirmation link."
        } else if (data.message) {
          errorMessage = data.message
        }
        
        setFeedback({ type: "error", message: errorMessage })
        return
      }

      // If validation passed, create the session with NextAuth
      const result = await signIn("credentials", { 
        email: email.trim(), 
        password: password.trim(), 
        redirect: false 
      })
      
      if (result?.ok) {
        setFeedback({ type: "success", message: "Signed in successfully. Redirecting..." })
        setTimeout(() => {
          window.location.href = "/dashboard"
        }, 500)
        return
      }
      
      setFeedback({
        type: "error",
        message: "Authentication failed. Please try again.",
      })
    } catch (error) {
      console.error("Login error:", error)
      setFeedback({ 
        type: "error", 
        message: "Unable to sign in right now. Please try again shortly." 
      })
    } finally {
      setLoading(false)
    }
  }

  async function onForgotPassword() {
    if (forgotStatus === "sending") return
    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setFeedback({ type: "error", message: "Enter your email so we know where to send the reset link." })
      return
    }
    if (!emailPattern.test(trimmedEmail)) {
      setFeedback({ type: "error", message: "Enter a valid email address before requesting a reset." })
      return
    }
    setForgotStatus("sending")
    setFeedback(null)
    console.log("📧 [CLIENT] Sending password reset request for:", trimmedEmail)
    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      })

      const data = await response.json()
      console.log("📧 [CLIENT] Response received:", data)

      if (!response.ok || !data.success) {
        console.error("❌ [CLIENT] Email sending failed:", data)
        
        // Special handling for SMTP not configured - show reset URL
        if (data.smtpConfigured === false && data.resetUrl) {
          setFeedback({
            type: "error",
            message: `⚠️ Email service is not configured. Click here to reset your password: ${data.resetUrl}`
          })
          setForgotStatus("idle")
          return
        }
        
        setFeedback({
          type: "error",
          message: data.message || "❌ Failed to send reset email. Please try again."
        })
        setForgotStatus("idle")
        return
      }

      if (data.emailSent) {
        console.log("✅ [CLIENT] Email sent successfully!")
        setForgotStatus("sent")
        setFeedback({
          type: "success",
          message: data.message || `Password reset email has been sent successfully to ${trimmedEmail}. Please check your inbox (and spam folder).`
        })
      } else {
        console.log("⚠️ [CLIENT] User not found or email not sent")
        setForgotStatus("sent")
        setFeedback({
          type: "info",
          message: data.message || "If an account exists with this email, a password reset link has been sent. Please check your inbox."
        })
      }
    } catch (error) {
      console.error("❌ [CLIENT] Forgot password error:", error)
      setFeedback({
        type: "error",
        message: "❌ Unable to send reset email. Please check your connection and try again."
      })
      setForgotStatus("idle")
    } finally {
      setTimeout(() => setForgotStatus("idle"), 10000)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading) return
    if (mode === "login") {
      onLogin()
    } else {
      onRegister()
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#050915] via-[#060f24] to-[#030614] text-[#eef3ff]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#3ab0ff]/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 translate-x-1/4 translate-y-1/4 rounded-full bg-[#5dd4ff]/20 blur-3xl" />
      </div>

      <section className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-5xl space-y-4">
          <div className="grid w-full gap-10 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-2xl lg:grid-cols-[1.05fr_0.95fr] lg:p-12">
          <div className="flex flex-col justify-between gap-10">
            <div>
              <h1 className="text-3xl font-semibold leading-snug text-white md:text-4xl">
                Heybassh Shell Cloud
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-blue-100/90 md:text-xl">
                Secure access to your developer workspace, from anywhere.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-blue-100/80 md:text-base">
                Sign in to continue to your cloud shell environment or create a new account in just a few clicks. Enterprise-grade security, tailored for modern teams.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-8 rounded-2xl border border-white/10 bg-black/40 p-6 shadow-[0_20px_45px_-25px_rgba(16,167,255,0.45)] sm:p-8 min-h-[560px] md:min-h-[600px]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white md:text-2xl">
                {mode === "login" ? "Welcome back" : "Create your free account"}
              </h2>
              <div className="inline-flex items-center rounded-lg border border-white/10 bg-white/10 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => handleModeChange("login")}
                  className={`radius-6 px-3 py-1 transition whitespace-nowrap ${
                    mode === "login" ? "bg-white text-[#061332] shadow-sm" : "text-blue-100"
                  }`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange("register")}
                  className={`radius-6 px-3 py-1 transition whitespace-nowrap ${
                    mode === "register" ? "bg-white text-[#061332] shadow-sm" : "text-blue-100"
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            <form className="grid gap-5" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-blue-100" htmlFor="email">
                  Email address
                </label>
                <div className="flex gap-2">
                  <input
                    id="email"
                    className={`radius-6 input placeholder:text-blue-200/50 flex-1 ${formErrors.email ? "ring-2 ring-rose-400/70" : "focus:ring-2 focus:ring-[#3ab0ff]/60"}`}
                    placeholder="name@company.com"
                    type="email"
                    value={email}
                    autoComplete="email"
                    onChange={(event) => setEmail(event.target.value)}
                    aria-invalid={Boolean(formErrors.email)}
                  />
                </div>
                {formErrors.email && <p className="text-xs font-medium text-rose-300">{formErrors.email}</p>}
              </div>

              {mode === "register" && (
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-blue-100" htmlFor="name">
                    Full name
                  </label>
                  <input
                    id="name"
                    className={`radius-6 input placeholder:text-blue-300/50 ${formErrors.name ? "ring-2 ring-rose-400/70" : "focus:ring-2 focus:ring-[#3ab0ff]/60"}`}
                    placeholder="Jane Developer"
                    type="text"
                    value={name}
                    autoComplete="name"
                    onChange={(event) => setName(event.target.value)}
                    aria-invalid={Boolean(formErrors.name)}
                  />
                  {formErrors.name && <p className="text-xs font-medium text-rose-300">{formErrors.name}</p>}
                </div>
              )}
              {mode === "register" && (
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-blue-100" htmlFor="company">
                    Company name
                  </label>
                  <input
                    id="company"
                    className={`radius-6 input placeholder:text-blue-300/50 ${formErrors.companyName ? "ring-2 ring-rose-400/70" : "focus:ring-2 focus:ring-[#3ab0ff]/60"}`}
                    placeholder="Acme Inc."
                    type="text"
                    value={companyName}
                    onChange={(event) => setCompanyName(event.target.value)}
                    aria-invalid={Boolean(formErrors.companyName)}
                  />
                  {formErrors.companyName && <p className="text-xs font-medium text-rose-300">{formErrors.companyName}</p>}
                </div>
              )}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-blue-100" htmlFor="password">
                    Password
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      className="radius-6 px-2 py-1 text-xs font-medium text-[#5dd4ff] transition hover:text-white"
                      onClick={onForgotPassword}
                      disabled={forgotStatus === "sending"}
                    >
                      {forgotStatus === "sent" ? "Reset link sent" : "Forgot password?"}
                    </button>
                  )}
                </div>
                <div className="relative w-full">
                  <input
                    id="password"
                    className={`radius-6 input w-full placeholder:text-blue-200/50 pr-12 ${formErrors.password ? "ring-2 ring-rose-400/70" : "focus:ring-2 focus:ring-[#3ab0ff]/60"}`}
                    placeholder={mode === "login" ? "Your password" : "At least 6 characters"}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    onChange={(event) => setPassword(event.target.value)}
                    aria-invalid={Boolean(formErrors.password)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="radius-6 absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center text-blue-300 transition-colors hover:text-white focus:outline-none z-10"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0A9.97 9.97 0 015 12c0 1.657.338 3.23.94 4.66M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {formErrors.password && <p className="text-xs font-medium text-rose-300">{formErrors.password}</p>}
              </div>

              {feedback && (
                <div
                  className={`rounded-lg border px-4 py-3 text-sm ${
                    feedback.type === "success"
                      ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                      : feedback.type === "error"
                      ? "border-rose-500/40 bg-rose-500/10 text-rose-200"
                      : "border-yellow-400/40 bg-yellow-400/10 text-yellow-200"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {feedback.type === "success" && (
                      <span className="text-emerald-300">✅</span>
                    )}
                    {feedback.type === "error" && (
                      <span className="text-rose-300">❌</span>
                    )}
                    {feedback.type === "info" && (
                      <span className="text-yellow-300">⚠️</span>
                    )}
                    <span className="flex-1">
                      {feedback.message.includes('https://') ? (
                        <span>
                          {feedback.message.split('https://')[0]}
                          <a 
                            href={feedback.message.match(/https:\/\/[^\s]+/)?.[0]} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline break-all"
                          >
                            {feedback.message.match(/https:\/\/[^\s]+/)?.[0]}
                          </a>
                        </span>
                      ) : (
                        feedback.message
                      )}
                    </span>
                  </div>
                </div>
              )}

              {mode === "login" ? (
                <button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  className="radius-6 btn btn-primary flex w-full items-center justify-center gap-2 text-sm font-semibold transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap"
                >
                  {loading ? <span className="spinner" role="status" aria-label="Processing request" /> : <span>Sign in</span>}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  className="radius-6 btn btn-primary flex w-full items-center justify-center gap-2 text-sm font-semibold transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap"
                >
                  {loading ? <span className="spinner" role="status" aria-label="Processing request" /> : <span>Create account</span>}
                </button>
              )}
            </form>

            <p className="text-xs text-blue-200/70 text-center">
              Need a full company workspace?{" "}
              <Link href="/create-account" className="text-[#5dd4ff] underline-offset-4 hover:underline">
                Create your free account →
              </Link>
            </p>

            {/* <p className="text-xs text-blue-200/60">
              By continuing, you agree to the Heybassh Shell Terms and acknowledge the Privacy Policy. Need assistance?{" "}
              <a
                className="font-medium text-[#5dd4ff] underline-offset-4 hover:underline"
                href="mailto:support@heybassh.com?subject=Heybassh%20Shell%20Support"
              >
                Contact support
              </a>
              .
            </p> */}

            <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
              <button
                type="button"
                className="radius-6 inline-flex items-center gap-2 bg-black/60 px-2 py-1 text-xs text-blue-100 transition hover:bg-black/70"
                aria-label="Heybassh"
              >
                <span className="inline-flex items-center rounded bg-black p-1">
                  <Image src={logo} alt="Heybassh" height={18} className="w-auto h-[18px]" />
                </span>
                <span>Heybassh</span>
              </button>
              <a href="/" className="text-xs text-blue-200 hover:text-blue-100">Privacy policy</a>
            </div>
          </div>
          </div>
        </div>
      </section>
    </main>
  )
}
