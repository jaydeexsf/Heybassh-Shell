
"use client"
import Link from "next/link"
import { useState } from "react"

function Pill({children}:{children:React.ReactNode}){
  return <span className="text-xs rounded-full px-2 py-1 border border-[#1a2446] bg-[#1b254b] text-[#b9c6ff]">{children}</span>
}

export default function Dashboard(){
  const [view,setView] = useState("overview")
  const items = [
    { id: "overview", label: "Overview" },
    { id: "customers", label: "Customers" },
    { id: "products", label: "Products" },
    { id: "billing", label: "Billing Lite" },
    { id: "tasks", label: "Tasks" },
    { id: "hr", label: "HR / People" },
    { id: "admin", label: "IT / Admin" }
  ]
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[240px_1fr]">
      <aside className="border-b md:border-b-0 md:border-r border-[#1a2446] p-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-xl bg-[#3ab0ff]" />
          <div className="text-lg font-bold">Heybassh</div>
        </div>
        <nav className="flex md:flex-col gap-2">
          {items.map(x=> (
            <button key={x.id} className={`px-3 py-2 rounded-lg text-left hover:bg-[#111936] border ${view===x.id?'bg-[#111936] border-[#1a2446]':'border-transparent'}`} onClick={()=>setView(x.id)}>
              <span className="text-sm">{x.label}</span>
            </button>
          ))}
        </nav>
      </aside>
      <div>
        <header className="flex items-center justify-between border-b border-[#1a2446] p-4 sticky top-0 bg-[rgba(9,15,31,.85)] backdrop-blur z-10">
          <div className="text-sm text-blue-200">Shell / Cloud · Unified workspace</div>
          <div className="flex items-center gap-2">
            <Link href="/api/auth/signout" className="btn">Sign out</Link>
            <Link href="https://docs.heybassh.com" className="btn">Docs</Link>
            <Link href="/dashboard/service" className="btn btn-gold">Book a Service</Link>
          </div>
        </header>
        <div className="max-w-[1140px] mx-auto p-4 grid gap-4">
          {view==="overview" && (
            <div className="grid gap-4">
              <div className="card">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Welcome</h3>
                  <Pill>Module</Pill>
                </div>
                <p className="text-blue-200 text-sm mt-1">Unified navigation, shared auth, and module slots</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["Customers","Billing Lite","Tasks"].map(t => (
                  <div key={t} className="card"><h4 className="font-semibold mb-2">{t}</h4><button className="btn btn-primary" onClick={()=>setView(t.toLowerCase().replace(' ','_'))}>Open</button></div>
                ))}
              </div>
            </div>
          )}
          {view!=="overview" && (
            <div className="card">
              <h3 className="font-semibold capitalize">{view.replace('_',' ')}</h3>
              <p className="text-blue-200 text-sm">Stub view. Replace with the full module UI.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
