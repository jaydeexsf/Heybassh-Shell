"use client"

import Link from "next/link"
import { ReactNode, useMemo, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { getPathForView } from "./accountRouteMap"

type NavChild = { id: string; label: string }
type NavItem = {
  id: string
  label: string
  icon: ReactNode
  children?: NavChild[]
}

const iconClass = "h-5 w-5"

const OverviewIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="m14.121 9.879-1.02 3.058a1 1 0 0 1-.642.643l-3.059 1.02 1.02-3.059a1 1 0 0 1 .643-.642l3.058-1.02Z" />
  </svg>
)

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
      d="M9 13a4 4 0 1 1 0-8 4 4 0 0 1 0 8ZM15 12.9a4 4 0 1 0-1.89-7.55M4 19a5 5 0 0 1 10 0M14 19a5 5 0 0 1 6-4.9"
    />
  </svg>
)

const BoxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M21 7L12 3 3 7l9 4 9-4Z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M3 7v10l9 4 9-4V7" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="m3 17 9-4 9 4" />
  </svg>
)

const CardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect width="18" height="12" x="3" y="6" rx="2" ry="2" strokeWidth="1.6" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M3 10h18M7 14h3" />
  </svg>
)

const TasksIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M9 11.5 11 13l4-4" />
    <rect width="18" height="14" x="3" y="5" rx="3" ry="3" strokeWidth="1.6" />
  </svg>
)

const ReportsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M8 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2h-1" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M14 3v4a1 1 0 0 0 1 1h4M10 17v-4m4 4v-7" />
  </svg>
)

const AutomateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M6.75 4.5 4.5 7.5l2.25 3" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M17.25 4.5 19.5 7.5l-2.25 3" />
    <rect width="6" height="6" x="9" y="9" strokeWidth="1.6" rx="1" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M4.5 7.5H9m6 0h4.5M4.5 16.5h15" />
  </svg>
)

const PeopleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M16 13a4 4 0 1 0-8 0" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M12 17a6 6 0 0 0-6 6M12 17a6 6 0 0 1 6 6" />
    <circle cx="12" cy="7" r="3.5" strokeWidth="1.6" />
  </svg>
)

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
      d="M12 3 4.5 6v6c0 6.075 4.5 9 7.5 9s7.5-2.925 7.5-9V6L12 3Z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="m9 12 2 2 4-4" />
  </svg>
)

const BriefcaseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M5 7h14a2 2 0 0 1 2 2v9H3V9a2 2 0 0 1 2-2Z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M3 13h18" />
  </svg>
)

const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M4 21h16M5 21V5.5a1.5 1.5 0 0 1 1.5-1.5H17A1.5 1.5 0 0 1 18.5 5.5V21" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M9 21v-6h6v6M8.75 8h.5M8.75 11h.5M8.75 14h.5M14.75 8h.5M14.75 11h.5M14.75 14h.5" />
  </svg>
)

const navigation: NavItem[] = [
  { id: "overview", label: "Overview", icon: <OverviewIcon /> },
  {
    id: "customers",
    label: "Customers",
    icon: <UsersIcon />,
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
    icon: <BoxIcon />,
    children: [
      { id: "products_listing", label: "Product Listing" },
      { id: "products_inventory", label: "Inventory" },
      { id: "products_supply", label: "Supply" },
    ],
  },
  { id: "billing", label: "Billing Lite", icon: <CardIcon /> },
  { id: "tasks", label: "Tasks", icon: <TasksIcon /> },
  { id: "reports", label: "Reports & Data", icon: <ReportsIcon /> },
  { id: "automate", label: "Automate", icon: <AutomateIcon /> },
  { id: "hr", label: "HR / People", icon: <PeopleIcon /> },
  { id: "admin", label: "IT / Admin", icon: <ShieldIcon /> },
  { id: "finance", label: "Finance", icon: <BriefcaseIcon /> },
  { id: "executive", label: "Executive", icon: <BuildingIcon /> },
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

export default function AccountDashboard({ accountId, initialViewKey = "overview" }: { accountId: string; initialViewKey?: string }) {
  const router = useRouter()
  const [view, setView] = useState(initialViewKey)
  const [companyName, setCompanyName] = useState<string>(accountId)
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    let ignore = false
    fetch(`/api/accounts/${accountId}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!ignore && data?.company_name) setCompanyName(data.company_name)
      })
      .catch(() => {})
    return () => { ignore = true }
  }, [accountId])

  const activeLabel = useMemo(() => findNavLabel(navigation, view), [view])

  useEffect(() => {
    setView(initialViewKey)
  }, [initialViewKey])

  function navigate(viewKey: string) {
    setView(viewKey)
    const seg = getPathForView(viewKey)
    router.push(`/${accountId}/${seg}`)
  }

  function toggleSectionState(curr: Record<string, boolean>, id: string) {
    return { ...curr, [id]: !curr[id] }
  }

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ customers: true, products: true })

  function isParentActive(item: NavItem) {
    if (item.id === view) return true
    return Boolean(item.children?.some((child) => child.id === view))
  }

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[260px_1fr]">
      <aside className="border-b border-[#1a2446] p-4 md:border-b-0 md:border-r">
        <div className="mb-6 flex items-center gap-2">
          <div className="">
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
                  onClick={() => (hasChildren ? setOpenSections((c) => toggleSectionState(c, item.id)) : navigate(item.id))}
                  className={`flex items-center justify-between rounded-lg border px-3 py-1 text-sm transition ${
                    active
                      ? "border-[#1a2446] bg-[#111936] text-white shadow-[0_15px_35px_-25px_rgba(39,172,255,0.65)]"
                      : "border-transparent text-blue-100 hover:bg-[#101733]"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#121c3d] text-[#7ed0ff]">
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </span>
                  {hasChildren && (
                    <span className={`text-xs transition-transform ${open ? "rotate-180 text-blue-200" : "text-blue-300"}`}>
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
                            onClick={() => navigate(child.id)}
                            className={`rounded-lg px-3 py-2 text-left text-xs font-medium transition ${
                              childActive
                                ? "bg-[#152044] text-white shadow-[0_12px_28px_-25px_rgba(39,172,255,0.65)]"
                                : "text-blue-200 hover:bg-[#121c3d] hover:text-white"
                            }`}
                          >
                            {child.label}
                          </button>
                        )}
                      )}
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
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#3ab0ff]/80 text-lg font-bold text-[#061332] shadow-[0_10px_25px_-20px_rgba(16,167,255,0.75)]">
              H
            </div>
            <span className="text-lg font-semibold text-white">Heybassh</span>
            <div className="text-sm text-blue-200">Shell / Cloud • Unified workspace</div>
          </div>
          <div className="relative flex items-center gap-2 px-4">
            <Link href="#" className="btn">BotOnly AI</Link>
            <Link href="#" className="btn">Tools</Link>
            <Link href="https://docs.heybassh.com" className="btn">Docs</Link>
            <button
              type="button"
              onClick={() => navigate("service")}
              className="btn btn-gold"
            >
              Book a Service
            </button>
            <div className="relative">
              <button onClick={() => setMenuOpen((o) => !o)} className="btn btn-gold">
                {companyName}
                <span className="ml-2">▾</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[#111936] bg-[#0d142a] text-sm">
                  {session?.user?.role === 'admin' && (
                    <Link
                      className="block px-3 py-2 text-blue-100 hover:bg-[#121c3d]"
                      href={`/${accountId}/users/new`}
                      onClick={() => setMenuOpen(false)}
                    >
                      Create user
                    </Link>
                  )}
                  <Link
                    className="block px-3 py-2 text-blue-100 hover:bg-[#121c3d]"
                    href={`/${accountId}/settings`}
                    onClick={() => setMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <Link className="block px-3 py-2 text-blue-100 hover:bg-[#121c3d]" href="/api/auth/signout">
                    Sign out
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="mx-auto grid max-w-[1140px] gap-4 p-4">
          {view === "overview" ? (
            <div className="grid gap-4">
              <div className="card">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">Welcome</h3>
                  <Pill>Module</Pill>
                </div>
                <p className="mt-1 text-sm text-blue-200">Unified navigation, shared auth, and module slots</p>
              </div>
            </div>
          ) : view === "customers_contacts" ? (
            <div className="card"><h3 className="font-semibold text-white">Contacts</h3></div>
          ) : view === "customers_companies" ? (
            <div className="card"><h3 className="font-semibold text-white">Companies</h3></div>
          ) : view === "products_listing" ? (
            <div className="card"><h3 className="font-semibold text-white">Products</h3></div>
          ) : (
            <div className="card">
              <h3 className="font-semibold text-white">{activeLabel}</h3>
              <p className="text-sm text-blue-200">This is a preview area for <span className="font-medium text-blue-100">{activeLabel}</span>.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
