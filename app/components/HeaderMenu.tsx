"use client"

import { useEffect, useMemo, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import Image from "next/image"
import logo from "../../Images/heybasshlogo.png"

export default function HeaderMenu() {
  const { data } = useSession()
  const user = data?.user as any | undefined
  const [open, setOpen] = useState(false)
  const [companyName, setCompanyName] = useState<string>("")

  const initials = useMemo(() => {
    const n = (user?.name as string | undefined) || (user?.email as string | undefined) || "User"
    return n.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
  }, [user])

  useEffect(() => {
    let active = true
    async function loadAccount() {
      const aid = user?.account_id as string | undefined
      if (!aid) return
      try {
        const res = await fetch(`/api/accounts/${aid}`)
        if (!res.ok) return
        const acc = await res.json()
        if (active) setCompanyName(acc.company_name || "")
      } catch {}
    }
    loadAccount()
    return () => {
      active = false
    }
  }, [user?.account_id])

  // Show only logo on login page (when user is not logged in)
  if (!user) {
    return (
      <div className="fixed right-4 top-4 z-50">
        <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 shadow">
          <Image src={logo} alt="Heybassh" height={24} className="h-6 w-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="fixed right-4 top-4 z-50">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 text-sm text-blue-100 shadow hover:bg-black/70"
      >
        <span className="hidden sm:inline text-blue-50 font-medium">{companyName || "Heybassh"}</span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#121c3d] text-[#7ed0ff] text-xs">
          {initials}
        </span>
      </button>

      {open && (
        <div className="mt-2 w-72 rounded-xl border border-white/10 bg-[#0b132c] p-3 shadow-2xl">
          <div className="flex items-center gap-3 p-2">
            <Image src={logo} alt="Heybassh" height={28} className="h-7 w-auto" />
            <div className="grid leading-tight">
              <span className="text-white text-sm font-medium">{user?.name || user?.email || "User"}</span>
              <span className="text-blue-300 text-xs truncate">{user?.email}</span>
            </div>
          </div>
          <div className="my-2 h-px bg-white/10" />
          <div className="grid gap-1 p-1 text-sm">
            <div className="flex items-center justify-between text-blue-100">
              <span>Account</span>
              <span className="text-blue-300">{companyName || "Heybassh"}</span>
            </div>
          </div>
          <div className="my-2 h-px bg-white/10" />
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-left text-sm text-blue-100 hover:bg-white/15"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
