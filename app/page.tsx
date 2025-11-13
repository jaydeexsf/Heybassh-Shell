
"use client"
import { signIn } from "next-auth/react"
import { useState } from "react"

export default function Home(){
  const [mode,setMode] = useState<"login"|"register">("login")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [name,setName] = useState("")
  const [msg,setMsg] = useState<string|null>(null)
  const [loading,setLoading] = useState(false)

  async function onRegister(){
    setLoading(true); setMsg(null)
    try{
      const r = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, name }) })
      const j = await r.json()
      if(!r.ok){ setMsg(j.error || "Registration failed"); return }
      setMsg("Registered. You can sign in now."); setMode("login")
    }finally{ setLoading(false) }
  }

  async function onLogin(){
    setLoading(true); setMsg(null)
    const res = await signIn("credentials", { email, password, redirect: false })
    if (res?.ok) window.location.href = "/dashboard"
    else setMsg("Invalid credentials")
    setLoading(false)
  }

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-md card">
        <h1 className="text-xl font-bold mb-2">Heybassh Shell / Cloud</h1>
        <p className="text-sm text-blue-200 mb-4">Sign in or create an account.</p>
        <div className="grid gap-2 mb-3">
          {mode==="register" && (<input className="input" placeholder="Name (optional)" value={name} onChange={e=>setName(e.target.value)} />)}
          <input className="input" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="input" placeholder="Password (min 6 chars)" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        {msg && <div className="text-sm text-yellow-300">{msg}</div>}
        <div className="flex gap-2 mt-3">
          {mode==="login" ? (
            <>
              <button className="btn btn-primary" onClick={onLogin} disabled={loading}>Sign in</button>
              <button className="btn" onClick={()=>setMode("register")}>Create account</button>
            </>
          ) : (
            <>
              <button className="btn btn-primary" onClick={onRegister} disabled={loading}>Register</button>
              <button className="btn" onClick={()=>setMode("login")}>Back to sign in</button>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
