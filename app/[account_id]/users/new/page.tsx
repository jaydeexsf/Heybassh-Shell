"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewUserPage({ params }: { params: { account_id: string } }) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("user")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setOk(null)
    setLoading(true)
    try {
      const res = await fetch(`/api/accounts/${params.account_id}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name || undefined, password, role })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || "Failed to create user")
        return
      }
      setOk("User created")
      setEmail("")
      setName("")
      setPassword("")
      setRole("user")
    } catch (err) {
      setError("Unexpected error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto w-full max-w-lg rounded-2xl border border-[#111936] bg-[#0d142a] p-6 text-white">
        <h1 className="text-xl font-semibold">Create user</h1>
        <p className="text-blue-300 text-sm">Account {params.account_id}</p>
        <form className="mt-4 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm text-blue-200 mb-1">Email</label>
            <input className="w-full rounded-lg border border-[#1a2446] bg-[#0b132c] p-2" type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-blue-200 mb-1">Full name</label>
            <input className="w-full rounded-lg border border-[#1a2446] bg-[#0b132c] p-2" value={name} onChange={(e)=>setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-blue-200 mb-1">Password</label>
            <input className="w-full rounded-lg border border-[#1a2446] bg-[#0b132c] p-2" type="password" required value={password} onChange={(e)=>setPassword(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-blue-200 mb-1">Role</label>
            <select className="w-full rounded-lg border border-[#1a2446] bg-[#0b132c] p-2" value={role} onChange={(e)=>setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {error && <div className="text-sm text-rose-300">{error}</div>}
          {ok && <div className="text-sm text-emerald-300">{ok}</div>}
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="btn btn-primary">{loading?"Creating...":"Create user"}</button>
            <button type="button" className="btn" onClick={()=>router.push(`/${params.account_id}/dashboard`)}>Back</button>
          </div>
        </form>
      </div>
    </div>
  )
}
