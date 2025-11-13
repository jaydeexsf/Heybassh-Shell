
"use client"

import { signIn } from "next-auth/react"
import { FormEvent, useState } from "react"

type AuthMode = "login" | "register"
type Feedback = { type: "success" | "error"; message: string }
type FormErrors = Partial<Record<"email" | "password" | "name", string>>

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Home() {
  const [mode, setMode] = useState<AuthMode>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [forgotStatus, setForgotStatus] = useState<"idle" | "sending" | "sent">("idle")

  function resetUi() {
    setFormErrors({})
    setFeedback(null)
    setForgotStatus("idle")
  }

  function handleModeChange(nextMode: AuthMode) {
    resetUi()
    setMode(nextMode)
  }

  function validateForm(currentMode: AuthMode) {
    const errors: FormErrors = {}
    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()
    const trimmedName = name.trim()

    if (!trimmedEmail) errors.email = "Email is required."
    else if (!emailPattern.test(trimmedEmail)) errors.email = "Enter a valid email address."

    if (!trimmedPassword) errors.password = "Password is required."
    else if (currentMode === "register" && trimmedPassword.length < 6)
      errors.password = "Use at least 6 characters."

    if (currentMode === "register" && trimmedName && trimmedName.length < 2)
      errors.name = "Name should be at least 2 characters."

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function onRegister() {
    if (!validateForm("register")) return
    setLoading(true)
    setFeedback(null)
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: password.trim(), name: name.trim() || undefined }),
      })
      const data = await response.json()
      if (!response.ok) {
        setFeedback({ type: "error", message: data.error || "We couldn't complete your registration." })
        return
      }
      setFeedback({ type: "success", message: "Account created successfully. You can sign in now." })
      setFormErrors({})
      setMode("login")
      setPassword("")
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
      const result = await signIn("credentials", { email: email.trim(), password: password.trim(), redirect: false })
      if (result?.ok) {
        setFeedback({ type: "success", message: "Signed in successfully. Redirecting..." })
        window.location.href = "/dashboard"
        return
      }
      setFeedback({
        type: "error",
        message: "We couldn't match that email and password. Please double-check your credentials.",
      })
    } catch {
      setFeedback({ type: "error", message: "Unable to sign in right now. Please try again shortly." })
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
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200))
      setForgotStatus("sent")
      setFeedback({
        type: "success",
        message: "Feature Coming Soon ",
      })
    } finally {
      setTimeout(() => setForgotStatus("idle"), 6000)
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
        <div className="grid w-full max-w-5xl gap-10 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-2xl lg:grid-cols-[1.05fr_0.95fr] lg:p-12">
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

          <div className="flex flex-col gap-8 rounded-2xl border border-white/10 bg-black/40 p-6 shadow-[0_20px_45px_-25px_rgba(16,167,255,0.45)] sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white md:text-2xl">
                {mode === "login" ? "Welcome back" : "Create your account"}
              </h2>
              <div className="inline-flex items-center rounded-lg border border-white/10 bg-white/10 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => handleModeChange("login")}
                  className={`rounded-md px-3 py-1 transition whitespace-nowrap ${
                    mode === "login" ? "bg-white text-[#061332] shadow-sm" : "text-blue-100"
                  }`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange("register")}
                  className={`rounded-md px-3 py-1 transition whitespace-nowrap ${
                    mode === "register" ? "bg-white text-[#061332] shadow-sm" : "text-blue-100"
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            <form className="grid gap-5" onSubmit={handleSubmit}>
              {mode === "register" && (
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-blue-100" htmlFor="name">
                    Full name <span className="text-blue-200/70">(optional)</span>
                  </label>
                  <input
                    id="name"
                    className={`input placeholder:text-blue-200/50 rounded-lg ${formErrors.name ? "ring-2 ring-rose-400/70" : "focus:ring-2 focus:ring-[#3ab0ff]/60"}`}
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

              <div className="grid gap-2">
                <label className="text-sm font-medium text-blue-100" htmlFor="email">
                  Work email
                </label>
                <input
                  id="email"
                  className={`input placeholder:text-blue-200/50 rounded-lg ${formErrors.email ? "ring-2 ring-rose-400/70" : "focus:ring-2 focus:ring-[#3ab0ff]/60"}`}
                  placeholder="you@company.com"
                  type="email"
                  value={email}
                  autoComplete="email"
                  onChange={(event) => setEmail(event.target.value)}
                  aria-invalid={Boolean(formErrors.email)}
                />
                {formErrors.email && <p className="text-xs font-medium text-rose-300">{formErrors.email}</p>}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-blue-100" htmlFor="password">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs font-medium text-[#5dd4ff] transition hover:text-white"
                    onClick={onForgotPassword}
                    disabled={forgotStatus === "sending"}
                  >
                    {forgotStatus === "sent" ? "Reset link sent" : "Forgot password?"}
                  </button>
                </div>
                <input
                  id="password"
                  className={`input placeholder:text-blue-200/50 rounded-lg ${formErrors.password ? "ring-2 ring-rose-400/70" : "focus:ring-2 focus:ring-[#3ab0ff]/60"}`}
                  placeholder={mode === "login" ? "Your password" : "At least 6 characters"}
                  type="password"
                  value={password}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  onChange={(event) => setPassword(event.target.value)}
                  aria-invalid={Boolean(formErrors.password)}
                />
                {formErrors.password && <p className="text-xs font-medium text-rose-300">{formErrors.password}</p>}
              </div>

              {feedback && (
                <div
                  className={`rounded-lg border px-4 py-3 text-sm ${
                    feedback.type === "success"
                      ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                      : "border-rose-500/40 bg-rose-500/10 text-rose-200"
                  }`}
                >
                  {feedback.message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary flex w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap"
              >
                <span>{loading ? "Working..." : mode === "login" ? "Sign in securely" : "Create account"}</span>
              </button>
            </form>

            <p className="text-xs text-blue-200/60">
              By continuing, you agree to the Heybassh Shell Terms and acknowledge the Privacy Policy. Need assistance?{" "}
              <a
                className="font-medium text-[#5dd4ff] underline-offset-4 hover:underline"
                href="mailto:support@heybassh.com?subject=Heybassh%20Shell%20Support"
              >
                Contact support
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
