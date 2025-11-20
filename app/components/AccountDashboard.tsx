"use client"

import Link from "next/link"
import { ReactNode, useMemo, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"

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

// Icon-only sidebar icons
const LogoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M12 2L2 7l10 5 10-5-10-5Z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
)

const CreateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M12 5v14m-7-7h14" />
  </svg>
)

const InboxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z" />
  </svg>
)

const CallsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
  </svg>
)

const MeetingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2Z" />
  </svg>
)

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
)

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <circle cx="11" cy="11" r="8" strokeWidth="1.6" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="m21 21-4.35-4.35" />
  </svg>
)

const AcademyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
  </svg>
)

const MediaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2Z" />
  </svg>
)

const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
  </svg>
)

const FrontOfficeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
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
      { id: "products_manufacturing", label: "Manufacturing" },
    ],
  },
  {
    id: "billing",
    label: "Billing",
    icon: <CardIcon />,
    children: [
      { id: "billing_clients", label: "Clients" },
      { id: "billing_invoices", label: "Invoices" },
      { id: "billing_payments", label: "Payments" },
      { id: "billing_quotes", label: "Quotes" },
      { id: "billing_credits", label: "Credits" },
      { id: "billing_projects", label: "Projects" },
      { id: "billing_vendors", label: "Vendors" },
      { id: "billing_purchase_orders", label: "Purchase Orders" },
      { id: "billing_expenses", label: "Expenses" },
      { id: "billing_transactions", label: "Transactions" },
    ],
  },
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

function viewToPath(view: string): string {
  if (view === "overview") return "dashboard"
  if (view === "customers_contacts") return "contacts"
  if (view === "customers_companies") return "companies"
  if (view === "products_listing") return "products"
  return view
}

export default function AccountDashboard({ accountId, initialViewKey = "overview" }: { accountId: string; initialViewKey?: string }) {
  const router = useRouter()
  const [view, setView] = useState(initialViewKey)
  const [companyName, setCompanyName] = useState<string>(accountId)
  const [menuOpen, setMenuOpen] = useState(false)
  const [companyMenuOpen, setCompanyMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [frontOfficeMenuOpen, setFrontOfficeMenuOpen] = useState(false)
  const { data: session } = useSession()
  
  const userName = session?.user?.name || session?.user?.email || "User"

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement
      if (!target.closest('[data-dropdown]')) {
        setCompanyMenuOpen(false)
        setUserMenuOpen(false)
        setFrontOfficeMenuOpen(false)
      }
    }
    if (companyMenuOpen || userMenuOpen || frontOfficeMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [companyMenuOpen, userMenuOpen, frontOfficeMenuOpen])

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

  function navigate(viewKey: string) {
    setView(viewKey)
    const seg = viewToPath(viewKey)
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
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[64px_260px_1fr] bg-[#020617]">
      {/* Icon-only sidebar */}
      <aside className="hidden md:flex flex-col items-center gap-4 border-r border-[#1a2446] bg-[#0e1629] py-4">
        <button className="flex h-10 w-10 items-center justify-center rounded-lg text-[#7ed0ff] hover:bg-[#121c3d] transition-colors">
          <LogoIcon />
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-lg text-[#7ed0ff] hover:bg-[#121c3d] transition-colors">
          <CreateIcon />
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-lg text-[#7ed0ff] hover:bg-[#121c3d] transition-colors">
          <InboxIcon />
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-lg text-[#7ed0ff] hover:bg-[#121c3d] transition-colors">
          <CallsIcon />
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-lg text-[#7ed0ff] hover:bg-[#121c3d] transition-colors">
          <MeetingsIcon />
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-lg text-[#7ed0ff] hover:bg-[#121c3d] transition-colors mt-auto">
          <SettingsIcon />
        </button>
      </aside>

      {/* Main sidebar */}
      <aside className="border-b border-[#1a2446] p-3 md:border-b-0 md:border-r bg-[#0e1629]">
        <div className="mb-4 flex items-center gap-2" style={{ paddingTop: "calc(0.5rem - 2px)", paddingBottom: "calc(0.5rem - 2px)" }}>
          <div>
            <div className="text-lg font-semibold text-white">Heybassh Business</div>
            <div className="text-xs uppercase tracking-wider text-blue-200/80">Website</div>
            <div className="text-xs text-blue-200/70">Publicity · Privacy · Productivity</div>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {navigation.map((item) => {
            const hasChildren = Boolean(item.children?.length)
            const open = openSections[item.id] ?? false
            const active = isParentActive(item)

            return (
              <div key={item.id} className="grid gap-1">
                <button
                  onClick={() => (hasChildren ? setOpenSections((c) => toggleSectionState(c, item.id)) : navigate(item.id))}
                  className={`flex items-center justify-between rounded-[26px] border px-3 text-sm transition ${
                    active
                      ? "border-[#1a2446] bg-[#111936] text-white shadow-[0_15px_35px_-25px_rgba(39,172,255,0.65)]"
                      : "border-transparent text-blue-100 hover:bg-[#101733]"
                  }`}
                  style={{ paddingTop: "calc(0.25rem - 2px)", paddingBottom: "calc(0.25rem - 2px)" }}
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
                    className={`overflow-hidden rounded-[26px] border border-[#111936] bg-[#0d142a] transition-all ${
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
                            className={`rounded-[24px] px-3 py-2 text-left text-xs font-medium transition ${
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

        <div className="mt-6 rounded-[26px] border border-[#111936] bg-[#0d142a] p-4 text-xs text-blue-200/80">
          <div className="text-[10px] uppercase tracking-wider text-blue-300/70">Dubai UAE</div>
        </div>
      </aside>

      <div className="bg-[#020617]">
        <header className="sticky top-0 z-10 flex items-center justify-between bg-[rgba(9,15,31,.85)] px-4 py-2 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex items-center gap-2 border border-[#1a2446] rounded-[24px] px-3 py-1.5 bg-[#0e1629]">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search Heybassh"
                  className="bg-transparent border-0 outline-0 text-sm text-blue-200 placeholder-blue-300/60 w-40"
                />
              </div>
            </div>
            <button className="flex h-8 w-8 items-center justify-center rounded-[24px] border border-[#1a2446] bg-[#0e1629] text-[#7ed0ff] hover:bg-[#121c3d] transition-colors">
              <SettingsIcon />
            </button>
            <div className="h-4 w-px bg-[#1a2446] mx-2"></div>
            <div className="relative" data-dropdown>
              <button
                onClick={() => setFrontOfficeMenuOpen((o) => !o)}
                className="text-sm text-blue-200 hover:text-white transition-colors px-2 py-1 rounded-[24px] hover:bg-[#0e1629]"
              >
                Front Office
              </button>
              {frontOfficeMenuOpen && (
                <div className="absolute left-0 top-full mt-2 w-48 rounded-[26px] border border-[#111936] bg-[#0e1629] text-sm shadow-lg z-50" data-dropdown>
                  <button className="block w-full text-left px-3 py-2 text-blue-100 hover:bg-[#121c3d] rounded-t-[26px]" onClick={() => setFrontOfficeMenuOpen(false)}>Website</button>
                  <button className="block w-full text-left px-3 py-2 text-blue-100 hover:bg-[#121c3d]" onClick={() => setFrontOfficeMenuOpen(false)}>Portal</button>
                  <button className="block w-full text-left px-3 py-2 text-blue-100 hover:bg-[#121c3d]" onClick={() => setFrontOfficeMenuOpen(false)}>Mobile App</button>
                  <button className="block w-full text-left px-3 py-2 text-blue-100 hover:bg-[#121c3d]" onClick={() => setFrontOfficeMenuOpen(false)}>Live Chat</button>
                  <button className="block w-full text-left px-3 py-2 text-blue-100 hover:bg-[#121c3d]" onClick={() => setFrontOfficeMenuOpen(false)}>Help Desk</button>
                  <button className="block w-full text-left px-3 py-2 text-blue-100 hover:bg-[#121c3d] rounded-b-[26px]" onClick={() => setFrontOfficeMenuOpen(false)}>Survey</button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="#" className="btn text-sm">BotOnly AI</Link>
            <Link href="#" className="btn text-sm">Tools</Link>
            <button className="btn text-sm flex items-center gap-1">
              <AcademyIcon />
            </button>
            <button className="btn text-sm flex items-center gap-1">
              <MediaIcon />
            </button>
            <button className="btn text-sm flex items-center gap-1 relative">
              <BellIcon />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <Link
              href={`/${accountId}/dashboard/service`}
              className="btn btn-gold text-sm"
            >
              Book a Service
            </Link>
            <div className="relative inline-flex items-center gap-1.5" data-dropdown>
              <button
                onClick={() => setCompanyMenuOpen((o) => !o)}
                className="inline-flex items-center gap-1.5 px-2 py-1 text-xs text-blue-200 hover:text-white hover:bg-[#0e1629] rounded-[20px] transition-colors"
              >
                <span className="truncate max-w-[120px]">{companyName}</span>
                <span className="text-[10px]">▾</span>
              </button>
              {companyMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-44 rounded-[20px] border border-[#1a2446] bg-[#0e1629] text-xs shadow-lg z-50 py-1" data-dropdown>
                  <Link
                    className="block px-3 py-1.5 text-blue-100 hover:bg-[#121c3d] text-xs"
                    href={`/${accountId}/settings`}
                    onClick={() => setCompanyMenuOpen(false)}
                  >
                    Company Profile
                  </Link>
                  <Link
                    className="block px-3 py-1.5 text-blue-100 hover:bg-[#121c3d] text-xs rounded-b-[20px]"
                    href={`/${accountId}/settings`}
                    onClick={() => setCompanyMenuOpen(false)}
                  >
                    Account
                  </Link>
                </div>
              )}
            </div>
            <div className="relative inline-flex items-center" data-dropdown>
              <button
                onClick={() => setUserMenuOpen((o) => !o)}
                className="inline-flex items-center gap-1.5 px-2 py-1 text-xs text-blue-200 hover:text-white hover:bg-[#0e1629] rounded-[20px] transition-colors"
              >
                <span className="truncate max-w-[100px]">{userName}</span>
                <span className="text-[10px]">▾</span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-44 rounded-[20px] border border-[#1a2446] bg-[#0e1629] text-xs shadow-lg z-50 py-1" data-dropdown>
                  <Link
                    className="block px-3 py-1.5 text-blue-100 hover:bg-[#121c3d] text-xs"
                    href={`/${accountId}/settings`}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    className="block w-full text-left px-3 py-1.5 text-blue-100 hover:bg-[#121c3d] text-xs rounded-b-[20px]"
                    onClick={() => {
                      setUserMenuOpen(false)
                      signOut({ callbackUrl: "/" })
                    }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="h-px bg-[#1a2446]/50"></div>
        <div className="h-px bg-[#1a2446]/30 my-4"></div>
        <div className="mx-auto grid max-w-[1140px] gap-4 p-4">
          {view === "overview" ? (
            <div className="grid gap-4">
              <div className="card rounded-[32px]">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">Welcome</h3>
                  <Pill>Module</Pill>
                </div>
                <p className="mt-1 text-sm text-blue-200">Unified navigation, shared auth, and module slots</p>
              </div>
            </div>
          ) : view === "customers_contacts" ? (
            <div className="card rounded-[32px] bg-[#0e1629]">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-white">Customers</h2>
                <p className="mt-1 text-sm text-blue-200">Contacts, companies and relationships.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full bg-[#0e1629] rounded-[26px]">
                  <thead>
                    <tr className="border-b border-[#1a2446]">
                      <th className="th text-left">ID</th>
                      <th className="th text-left">NAME</th>
                      <th className="th text-left">EMAIL</th>
                      <th className="th text-left">COMPANY</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#1a2446]/50">
                      <td className="td text-sm text-blue-200"></td>
                      <td className="td text-sm text-white font-medium">Jane Cooper</td>
                      <td className="td text-sm text-blue-200">jane@acme.com</td>
                      <td className="td text-sm text-blue-200">Acme Inc</td>
                    </tr>
                    <tr className="border-b border-[#1a2446]/50">
                      <td className="td text-sm text-blue-200">C-1020</td>
                      <td className="td text-sm text-white font-medium">Wade Warren</td>
                      <td className="td text-sm text-blue-200">wade@globex.com</td>
                      <td className="td text-sm text-blue-200">Globex</td>
                    </tr>
                    <tr className="border-b border-[#1a2446]/50">
                      <td className="td text-sm text-blue-200">C-1019</td>
                      <td className="td text-sm text-white font-medium">Cody Fisher</td>
                      <td className="td text-sm text-blue-200">cody@umbrella.com</td>
                      <td className="td text-sm text-blue-200">Umbrella</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : view === "customers_companies" ? (
            <div className="card rounded-[32px] bg-[#0e1629]">
              <h3 className="font-semibold text-white">Companies</h3>
            </div>
          ) : view === "products_listing" ? (
            <div className="card rounded-[32px] bg-[#0e1629]">
              <h3 className="font-semibold text-white">Products</h3>
            </div>
          ) : (
            <div className="card rounded-[32px] bg-[#0e1629]">
              <h3 className="font-semibold text-white">{activeLabel}</h3>
              <p className="text-sm text-blue-200">This is a preview area for <span className="font-medium text-blue-100">{activeLabel}</span>.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
