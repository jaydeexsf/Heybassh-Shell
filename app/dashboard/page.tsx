"use client"

import Link from "next/link"
import { ReactNode, useMemo, useState } from "react"

type NavChild = { id: string; label: string }
type NavItem = {
  id: string
  label: string
  icon: string
  children?: NavChild[]
}

const navigation: NavItem[] = [
  { id: "overview", label: "Overview", icon: "🧭" },
  {
    id: "customers",
    label: "Customers",
    icon: "👥",
    children: [
      { id: "customers_contacts", label: "Contacts" },
      { id: "customers_companies", label: "Companies" },
      { id: "customers_deals", label: "Deals" },
      { id: "customers_sales", label: "Sales" },
      { id: "customers_marketing", label: "Marketing" },
      { id: "customers_support", label: "Customer Service" },
    ],
  },
  {
    id: "products",
    label: "Products",
    icon: "📦",
    children: [
      { id: "products_listing", label: "Product Listing" },
      { id: "products_inventory", label: "Inventory" },
      { id: "products_supply", label: "Supply" },
    ],
  },
  { id: "billing", label: "Billing Lite", icon: "💳" },
  { id: "tasks", label: "Tasks", icon: "✅" },
  { id: "reports", label: "Reports & Data", icon: "📊" },
  { id: "automate", label: "Automate", icon: "⚙️" },
  { id: "hr", label: "HR / People", icon: "🧑‍🤝‍🧑" },
  { id: "admin", label: "IT / Admin", icon: "🛡️" },
  { id: "finance", label: "Finance", icon: "💼" },
  { id: "executive", label: "Executive", icon: "🏛️" },
]

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-[#1a2446] bg-[#1b254b] px-2 py-1 text-xs text-[#b9c6ff]">
      {children}
    </span>
  )
}

function findNavLabel(items: NavItem[], id: string): string {
  for (const item of items) {
    if (item.id === id) return item.label
    if (item.children) {
      const child = item.children.find((child) => child.id === id)
      if (child) return child.label
    }
  }
  return id.replace(/_/g, " ")
}

const quickLinks = [
  { label: "Customers", target: "customers" },
  { label: "Billing Lite", target: "billing" },
  { label: "Tasks", target: "tasks" },
]

export default function Dashboard() {
  const [view, setView] = useState("overview")
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    customers: true,
    products: true,
  })

  const activeLabel = useMemo(() => findNavLabel(navigation, view), [view])

  function toggleSection(id: string) {
    setOpenSections((curr) => ({ ...curr, [id]: !curr[id] }))
  }

  function handleNavigate(id: string) {
    setView(id)
  }

  function isParentActive(item: NavItem) {
    if (item.id === view) return true
    return Boolean(item.children?.some((child) => child.id === view))
  }

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[260px_1fr]">
      <aside className="border-b border-[#1a2446] p-4 md:border-b-0 md:border-r">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#3ab0ff]/80 text-lg font-bold text-[#061332] shadow-[0_10px_25px_-20px_rgba(16,167,255,0.75)]">
            H
          </div>
          <div>
            <div className="text-lg font-semibold text-white">Heybassh</div>
            <div className="text-xs uppercase tracking-wider text-blue-200/80">Shell Cloud</div>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {navigation.map((item) => {
            const hasChildren = Boolean(item.children?.length)
            const open = openSections[item.id] ?? false
            const active = isParentActive(item)

            return (
              <div key={item.id} className="grid gap-1">
                <button
                  onClick={() => (hasChildren ? toggleSection(item.id) : handleNavigate(item.id))}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition ${
                    active
                      ? "border-[#1a2446] bg-[#111936] text-white shadow-[0_15px_35px_-25px_rgba(39,172,255,0.65)]"
                      : "border-transparent text-blue-100 hover:bg-[#101733]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                  {hasChildren && (
                    <span
                      className={`text-xs transition-transform ${open ? "rotate-180 text-blue-200" : "text-blue-300"}`}
                    >
                      ▾
                    </span>
                  )}
                </button>
                {hasChildren && (
                  <div
                    className={`overflow-hidden rounded-xl border border-[#111936] bg-[#0d142a] transition-all ${
                      open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="flex flex-col gap-1 p-2">
                      {item.children?.map((child) => {
                        const childActive = child.id === view
                        return (
                          <button
                            key={child.id}
                            onClick={() => handleNavigate(child.id)}
                            className={`rounded-lg px-3 py-2 text-left text-xs font-medium transition ${
                              childActive
                                ? "bg-[#152044] text-white shadow-[0_12px_28px_-25px_rgba(39,172,255,0.65)]"
                                : "text-blue-200 hover:bg-[#121c3d] hover:text-white"
                            }`}
                          >
                            {child.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="mt-8 rounded-2xl border border-[#111936] bg-[#0d142a] p-4 text-xs text-blue-200/80">
          <div className="text-[10px] uppercase tracking-wider text-blue-300/70">Environment</div>
          <div className="mt-2 flex items-center justify-between rounded-xl bg-[#121c3d] px-3 py-2 text-blue-100">
            <span>EU-West</span>
            <span className="text-[11px] text-blue-200/80">v0.1.0</span>
          </div>
        </div>
      </aside>

      <div>
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#1a2446] bg-[rgba(9,15,31,.85)] p-4 backdrop-blur">
          <div className="text-sm text-blue-200">Shell / Cloud · Unified workspace</div>
          <div className="flex items-center gap-2">
            <Link href="/api/auth/signout" className="btn">
              Sign out
            </Link>
            <Link href="https://docs.heybassh.com" className="btn">
              Docs
            </Link>
            <Link href="/dashboard/service" className="btn btn-gold">
              Book a Service
            </Link>
          </div>
        </header>
        <div className="mx-auto grid max-w-[1140px] gap-4 p-4">
          {view === "overview" ? (
            <div className="grid gap-4">
              <div className="card">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">Welcome back</h3>
                  <Pill>Module</Pill>
                </div>
                <p className="mt-1 text-sm text-blue-200">
                  Unified navigation, shared authentication, and workspace modules ready for deployment.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {quickLinks.map((link) => (
                  <div key={link.target} className="card">
                    <h4 className="mb-2 font-semibold text-white">{link.label}</h4>
                    <button
                      className="btn btn-primary w-full justify-center rounded-lg text-xs uppercase tracking-wider"
                      onClick={() => handleNavigate(link.target)}
                    >
                      Open
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card">
              <h3 className="font-semibold text-white">{activeLabel}</h3>
              <p className="text-sm text-blue-200">
                This is a preview area for <span className="font-medium text-blue-100">{activeLabel}</span>. Replace and
                extend this layout with production data when ready.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
