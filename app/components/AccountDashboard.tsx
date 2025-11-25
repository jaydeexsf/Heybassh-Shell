"use client"

import Link from "next/link"
import Image from "next/image"
import { ReactNode, useMemo, useState, useEffect, ChangeEvent, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline"
import logo from "../../Images/heybasshlogo.png"

type NavChild = { id: string; label: string }
type NavItem = {
  id: string
  label: string
  icon: ReactNode
  children?: NavChild[]
}

type Contact = {
  id: string
  name: string
  email: string
  phone: string
  company: string
}

type Product = {
  sku: string
  name: string
  category: string
  price: number
  stock: number
}

type Task = {
  id: string
  title: string
  assignee: string
  dueDate: string
  priority: "Low" | "Normal" | "High"
  status: "Todo" | "In Progress" | "Done"
  description?: string
  tags: string[]
}

type Employee = {
  id: string
  name: string
  email: string
  role: string
}

type LeaveRequest = {
  id: string
  employeeId: string
  employeeName: string
  type: string
  startDate: string
  endDate: string
  status: "Pending" | "Approved" | "Rejected"
}

const iconClass = "h-5 w-5"

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

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
    id: "front_office",
    label: "Front Office Apps",
    icon: <FrontOfficeIcon />,
    children: [
      { id: "front_office_website", label: "Website" },
      { id: "front_office_portal", label: "Portal" },
      { id: "front_office_mobile", label: "Mobile App" },
      { id: "front_office_live_chat", label: "Live Chat" },
      { id: "front_office_help_desk", label: "Help Desk" },
      { id: "front_office_survey", label: "Survey" },
    ],
  },
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
    label: "Billing Lite",
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

const defaultContacts: Contact[] = [
  { id: "C-1001", name: "Jane Cooper", email: "jane@acme.com", phone: "+1 202-555-0101", company: "Acme Inc" },
  { id: "C-1002", name: "Wade Warren", email: "wade@globex.com", phone: "+1 202-555-0199", company: "Globex" },
  { id: "C-1003", name: "Cody Fisher", email: "cody@umbrella.com", phone: "+1 202-555-0144", company: "Umbrella" },
]

const defaultProducts: Product[] = [
  { sku: "P-1001", name: "Heybassh T-Shirt", category: "Merch", price: 25, stock: 120 },
  { sku: "P-2001", name: "Onboarding Kit", category: "Bundle", price: 199, stock: 15 },
  { sku: "P-3001", name: "Consulting Hour", category: "Service", price: 99, stock: 9999 },
]

const defaultEmployees: Employee[] = [
  { id: "E-1001", name: "Jane Cooper", email: "jane@heybassh.com", role: "Success Lead" },
  { id: "E-1002", name: "Wade Warren", email: "wade@heybassh.com", role: "Engineer" },
]

const defaultLeaveRequests: LeaveRequest[] = []
const SEARCH_SELECTION_KEY = "heybassh_search_selection"

const priorityOptions: Task["priority"][] = ["Low", "Normal", "High"]
const statusOptions: Task["status"][] = ["Todo", "In Progress", "Done"]

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

function viewToPath(view: string): string | null {
  // Only route to actual pages that exist, otherwise return null to keep in place
  if (view === "overview") return "dashboard"
  if (view === "customers_contacts") return "contacts"
  if (view === "customers_companies") return "companies"
  if (view === "products_listing") return "products"
  // For all other views, return null to just update state without routing
  return null
}

// Helper: match query tokens against a full name so that first/last names can be searched independently
function nameMatchesTokens(name: string, query: string) {
  const toTokens = (s: string) => s.toLowerCase().split(/[\s\-]+/).filter(Boolean)
  const nameTokens = toTokens(name)
  const queryTokens = toTokens(query)
  if (!queryTokens.length) return true
  return queryTokens.every((qt) => nameTokens.some((nt) => nt.includes(qt)))
}

export default function AccountDashboard({ accountId, initialViewKey = "overview" }: { accountId: string; initialViewKey?: string }) {
  const router = useRouter()
  const [view, setView] = useState(initialViewKey)
  const [companyName, setCompanyName] = useState<string>(accountId)
  const [menuOpen, setMenuOpen] = useState(false)
  const [companyMenuOpen, setCompanyMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [sidebarProfileMenuOpen, setSidebarProfileMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>(defaultContacts)
  const [contactSearchTerm, setContactSearchTerm] = useState("")
  const [contactSelectionMode, setContactSelectionMode] = useState(false)
  const [showAddContactForm, setShowAddContactForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchPreviewOpen, setSearchPreviewOpen] = useState(false)
  const [searchPreviewSelection, setSearchPreviewSelection] = useState<string | null>(null)
  const [searchTransitioning, setSearchTransitioning] = useState(false)
  const searchLoaderTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [newContact, setNewContact] = useState({ name: "", email: "", phone: "", company: "" })
  const [products, setProducts] = useState<Product[]>(defaultProducts)
  const [productCategory, setProductCategory] = useState("All")
  const [productSearch, setProductSearch] = useState("")
  const [newProduct, setNewProduct] = useState({ sku: "", name: "", category: "General", price: "", stock: "" })
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState({
    title: "",
    assignee: "",
    dueDate: "",
    priority: "Normal" as Task["priority"],
    description: "",
    tags: "",
  })
  const [taskFilters, setTaskFilters] = useState({
    search: "",
    priority: "All",
    status: "All",
    assignee: "All",
  })
  const [taskViewMode, setTaskViewMode] = useState<"list" | "board">("list")
  const [employees, setEmployees] = useState<Employee[]>(defaultEmployees)
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(defaultLeaveRequests)
  const [newEmployee, setNewEmployee] = useState({ name: "", email: "", role: "" })
  const [leaveForm, setLeaveForm] = useState({ employeeId: "", type: "Annual", startDate: "", endDate: "" })
  const [leaveFilter, setLeaveFilter] = useState("All")
  const { data: session } = useSession()

  const userName = session?.user?.name || session?.user?.email || "User"
  const userImage = typeof session?.user?.image === "string" ? session.user.image : null
  const userInitial = userName.trim().charAt(0).toUpperCase() || "U"

  const contactActionButtons = [
    { label: "Contact Owner", icon: UserCircleIcon },
    { label: "Created Date", icon: CalendarDaysIcon },
    { label: "Activity", icon: ChartBarIcon },
    { label: "Status", icon: CheckCircleIcon },
  ]

  // Sync view when initialViewKey changes
  useEffect(() => {
    if (initialViewKey && initialViewKey !== view) {
      setView(initialViewKey)
    }
  }, [initialViewKey])

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement
      if (!target.closest('[data-dropdown]')) {
        setCompanyMenuOpen(false)
        setUserMenuOpen(false)
        setSidebarProfileMenuOpen(false)
        setSearchPreviewOpen(false)
      }
    }
    if (companyMenuOpen || userMenuOpen || sidebarProfileMenuOpen || searchPreviewOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [companyMenuOpen, userMenuOpen, sidebarProfileMenuOpen, searchPreviewOpen])

  useEffect(() => {
    return () => {
      if (searchLoaderTimeout.current) {
        clearTimeout(searchLoaderTimeout.current)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const storedSelection = sessionStorage.getItem(SEARCH_SELECTION_KEY)
    if (!storedSelection) return
    setSearchPreviewSelection(storedSelection)
    const clearTimer = setTimeout(() => {
      setSearchPreviewSelection(null)
      sessionStorage.removeItem(SEARCH_SELECTION_KEY)
    }, 4000)
    return () => clearTimeout(clearTimer)
  }, [view])

  // Fetch company name
  useEffect(() => {
    let ignore = false
    fetch(`/api/accounts/${accountId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!ignore && data?.company_name) setCompanyName(data.company_name)
      })
      .catch(() => {})
    return () => {
      ignore = true
    }
  }, [accountId])

  const activeLabel = useMemo(() => findNavLabel(navigation, view), [view])
  const filteredContacts = useMemo(() => {
    const rawQuery = (contactSearchTerm || searchQuery).trim()
    if (!rawQuery) return contacts
    const q = rawQuery.toLowerCase()
    return contacts.filter((contact) => {
      const matchesNameTokens = nameMatchesTokens(contact.name, q)
      const matchesOtherFields = [contact.id, contact.email, contact.phone, contact.company].some((field) =>
        field.toLowerCase().includes(q),
      )
      return matchesNameTokens || matchesOtherFields
    })
  }, [contacts, contactSearchTerm, searchQuery])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = productCategory === "All" || product.category === productCategory
      const q = productSearch.trim().toLowerCase()
      const matchesQuery = !q || [product.sku, product.name].some((field) => field.toLowerCase().includes(q))
      return matchesCategory && matchesQuery
    })
  }, [products, productCategory, productSearch])

  function navigate(viewKey: string) {
    setView(viewKey)
    const seg = viewToPath(viewKey)
    // Only navigate if there's an actual route, otherwise just update the view state
    if (seg) {
      router.push(`/${accountId}/${seg}`)
    }
  }

  function handleTopSearchChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.target.value
    setSearchQuery(nextValue)
    setSearchPreviewOpen(Boolean(nextValue.trim()))
    if (!nextValue.trim()) {
      setSearchPreviewSelection(null)
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(SEARCH_SELECTION_KEY)
      }
    }
  }

  function scheduleSearchLoader() {
    setSearchTransitioning(true)
    if (searchLoaderTimeout.current) {
      clearTimeout(searchLoaderTimeout.current)
    }
    searchLoaderTimeout.current = setTimeout(() => {
      setSearchTransitioning(false)
    }, 500)
  }

  function handleSearchResultNavigate(contactId?: string) {
    if (contactId) {
      setSearchPreviewSelection(contactId)
      if (typeof window !== "undefined") {
        sessionStorage.setItem(SEARCH_SELECTION_KEY, contactId)
      }
    }
    setSearchPreviewOpen(false)
    scheduleSearchLoader()
    navigate("customers_contacts")
  }

  function toggleSectionState(curr: Record<string, boolean>, id: string) {
    return { ...curr, [id]: !curr[id] }
  }

  // ... (rest of the code remains the same)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ customers: true, products: true, front_office: false })

  function handleAddContact(event: React.FormEvent<HTMLFormElement>) {
    // ... (rest of the code remains the same)
    event.preventDefault()
    if (!newContact.name || !newContact.email) return
    const numericPart = contacts.length ? parseInt(contacts[contacts.length - 1].id.split("-")[1] ?? "1000", 10) : 1000
    const nextId = `C-${String(numericPart + 1).padStart(4, "0")}`
    setContacts([...contacts, { id: nextId, ...newContact }])
    setNewContact({ name: "", email: "", phone: "", company: "" })
    setShowAddContactForm(false)
  }

  function handleAddProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!newProduct.sku || !newProduct.name) return
    setProducts([
      ...products,
      {
        sku: newProduct.sku,
        name: newProduct.name,
        category: newProduct.category,
        price: Number(newProduct.price) || 0,
        stock: Number(newProduct.stock) || 0,
      },
    ])
    setNewProduct({ sku: "", name: "", category: "General", price: "", stock: "" })
  }

  function handleAddTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!newTask.title.trim()) return
    const nextId = `T-${String(tasks.length + 1).padStart(3, "0")}`
    const tags = newTask.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
    setTasks([
      ...tasks,
      {
        id: nextId,
        title: newTask.title.trim(),
        assignee: newTask.assignee || "Unassigned",
        dueDate: newTask.dueDate,
        priority: newTask.priority,
        description: newTask.description,
        status: "Todo",
        tags,
      },
    ])
    setNewTask({ title: "", assignee: "", dueDate: "", priority: "Normal", description: "", tags: "" })
  }

  function handleResetTaskForm() {
    setNewTask({ title: "", assignee: "", dueDate: "", priority: "Normal", description: "", tags: "" })
  }

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        !taskFilters.search.trim() ||
        [task.title, task.assignee, task.description ?? "", task.tags.join(",")].some((field) =>
          field.toLowerCase().includes(taskFilters.search.trim().toLowerCase()),
        )
      const matchesPriority = taskFilters.priority === "All" || task.priority === taskFilters.priority
      const matchesStatus = taskFilters.status === "All" || task.status === taskFilters.status
      const matchesAssignee = taskFilters.assignee === "All" || task.assignee === taskFilters.assignee
      return matchesSearch && matchesPriority && matchesStatus && matchesAssignee
    })
  }, [tasks, taskFilters])

  const filteredLeaveRequests = useMemo(() => {
    return leaveRequests.filter((request) => leaveFilter === "All" || request.status === leaveFilter)
  }, [leaveRequests, leaveFilter])

  function handleAddEmployee(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!newEmployee.name || !newEmployee.email || !newEmployee.role) return
    const nextId = `E-${String(employees.length + 1).padStart(4, "0")}`
    setEmployees([...employees, { id: nextId, ...newEmployee }])
    setNewEmployee({ name: "", email: "", role: "" })
  }

  function handleSubmitLeave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!leaveForm.employeeId || !leaveForm.startDate || !leaveForm.endDate) return
    const employee = employees.find((emp) => emp.id === leaveForm.employeeId)
    if (!employee) return
    const nextId = `L-${String(leaveRequests.length + 1).padStart(4, "0")}`
    setLeaveRequests([
      ...leaveRequests,
      {
        id: nextId,
        employeeId: employee.id,
        employeeName: employee.name,
        type: leaveForm.type,
        startDate: leaveForm.startDate,
        endDate: leaveForm.endDate,
        status: "Pending",
      },
    ])
    setLeaveForm({ employeeId: "", type: "Annual", startDate: "", endDate: "" })
  }

  function isParentActive(item: NavItem) {
    if (item.id === view) return true
    return Boolean(item.children?.some((child) => child.id === view))
  }

  const navSeparators = new Set(["billing", "automate"])

  const overviewModules = [
    {
      id: "overview_customers",
      title: "Customer Module",
      description: "Contacts, companies, deals, products & more.",
      action: () => navigate("customers_contacts"),
    },
    {
      id: "overview_billing",
      title: "Billing Lite Module",
      description: "Quotes, invoices, Stripe/Woo sync.",
      action: () => navigate("billing"),
    },
    {
      id: "overview_service",
      title: "Book a Service Module",
      description: "Log a support request or feature task.",
      action: () => router.push(`/${accountId}/dashboard/service`),
    },
    {
      id: "overview_tasks",
      title: "Tasks Module",
      description: "Teamwork-style lists and boards.",
      action: () => navigate("tasks"),
    },
    {
      id: "overview_hr",
      title: "HR / People Module",
      description: "Directory, leave, onboarding.",
      action: () => navigate("hr"),
    },
    {
      id: "overview_admin",
      title: "IT / Admin Module",
      description: "Assets, approvals, access requests.",
      action: () => navigate("admin"),
    },
  ]

  const overviewStats = [
    { id: "leads", label: "Leads this week", value: "128" },
    { id: "closed", label: "Closed Won", value: "$12.4k" },
    { id: "incidents", label: "Incidents", value: "0" },
  ]

  const desktopGrid = "md:grid-cols-[64px_minmax(0,1fr)]"
  const contentGrid = sidebarCollapsed ? "md:grid-cols-[minmax(0,1fr)]" : "md:grid-cols-[260px_minmax(0,1fr)]"

  return (
    <div className="min-h-screen bg-[#020617]">
      <div className={`grid min-h-screen grid-cols-1 ${desktopGrid} transition-[grid-template-columns] duration-300 ease-in-out`}>
      {/* Left sidebar with profile */}
        <aside className="hidden md:flex md:sticky md:top-0 md:h-screen flex-col items-center justify-between border-r border-[#1a2446] bg-[#0e1629]/95 py-4 backdrop-blur">
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            aria-pressed={sidebarCollapsed}
            className={`flex h-10 w-10 items-center justify-center rounded-2xl border border-[#1a2446] transition-all ${
              sidebarCollapsed ? "bg-[#101733] text-[#7ed0ff]" : "bg-[rgba(20,26,52,0.85)] text-white/80"
            }`}
            title="Toggle navigation"
          >
            <MenuIcon />
          </button>
          <div className="flex flex-col items-center gap-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-2xl text-[#7ed0ff] hover:bg-[#121c3d] transition-colors" title="Create">
              <CreateIcon />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-2xl text-[#7ed0ff] hover:bg-[#121c3d] transition-colors" title="Inbox">
              <InboxIcon />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-2xl text-[#7ed0ff] hover:bg-[#121c3d] transition-colors" title="Calls">
              <CallsIcon />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-2xl text-[#7ed0ff] hover:bg-[#121c3d] transition-colors" title="Meetings">
              <MeetingsIcon />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-2xl text-[#7ed0ff] hover:bg-[#121c3d] transition-colors" title="Settings">
              <SettingsIcon />
            </button>
          </div>
        </div>
        
        {/* Profile button */}
        <div className="relative" data-dropdown>
          <button
            onClick={() => setSidebarProfileMenuOpen(!sidebarProfileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full overflow-hidden border-2 border-transparent hover:border-[#7ed0ff] transition-colors"
            title="Profile"
          >
            {userImage ? (
              <Image 
                src={userImage} 
                alt={userName} 
                width={40} 
                height={40} 
                className="h-full w-full object-cover" 
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-[#5468ff] to-[#2bb9ff] flex items-center justify-center text-sm font-semibold uppercase text-white">
                {userInitial}
              </div>
            )}
          </button>
          
          {sidebarProfileMenuOpen && (
            <div className="absolute bottom-full left-0 translate-x-0 mb-2 w-48 rounded-[20px] border border-[#1a2446] bg-[#0e1629] text-sm shadow-lg z-50 overflow-hidden" data-dropdown>
              <div className="px-4 py-3 border-b border-[#1a2446]">
                <div className="font-medium text-white">{userName}</div>
                <div className="text-xs text-blue-300 truncate">{session?.user?.email ?? ""}</div>
              </div>
              <Link
                href={`/${accountId}/settings`}
                className="block px-4 py-2.5 hover:bg-[#121c3d] text-blue-100 text-sm"
                onClick={() => setSidebarProfileMenuOpen(false)}
              >
                My Profile
              </Link>
              <Link
                href={`/${accountId}/settings`}
                className="block px-4 py-2.5 hover:bg-[#121c3d] text-blue-100 text-sm"
                onClick={() => setSidebarProfileMenuOpen(false)}
              >
                Settings
              </Link>
              <button
                className="block w-full text-left px-4 py-2.5 hover:bg-[#121c3d] text-blue-100 text-sm"
                onClick={() => {
                  setSidebarProfileMenuOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </aside>
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-10 flex items-center justify-between bg-[rgba(9,15,31,.95)] px-4 py-2 backdrop-blur">
          <div className="flex items-center gap-3">
            <Link href={`/${accountId}/dashboard`} className="flex items-center">
              <Image src={logo} alt="Heybassh" height={28} className="h-7 w-auto" />
            </Link>
            <div className="relative" data-dropdown>
              <div className="flex items-center gap-2 border border-[#1a2446] rounded-[24px] px-3 py-1.5 bg-[#0e1629]">
                <SearchIcon />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleTopSearchChange}
                  onFocus={() => setSearchPreviewOpen(Boolean(searchQuery.trim()))}
                  onBlur={() => {
                    if (!searchQuery.trim()) setSearchPreviewOpen(false)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      setSearchPreviewOpen(false)
                      ;(event.target as HTMLInputElement).blur()
                    } else if (event.key === "Enter") {
                      setSearchPreviewOpen(false)
                      handleSearchResultNavigate()
                    }
                  }}
                  placeholder="Search name, email, phone, company"
                  className="bg-transparent border-0 outline-0 text-sm text-blue-200 placeholder-blue-300/60 w-40"
                />
              </div>
              {searchTransitioning && (
                <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2 text-[11px] text-blue-300">
                  <span className="h-3 w-3 animate-spin rounded-full border border-blue-300 border-r-transparent"></span>
                  Loading…
                </div>
              )}
              {searchPreviewOpen && (
                <div className="absolute left-0 top-full mt-2 w-[320px] rounded-[20px] border border-[#1a2446] bg-[#050a1b] shadow-2xl">
                  <div className="flex items-center justify-between border-b border-[#111936] px-4 py-2 text-xs uppercase tracking-wide text-blue-300">
                    <span>Contacts</span>
                    <button
                      className="text-[11px] font-semibold text-[#7ed0ff] hover:text-white transition-colors"
                      onClick={() => handleSearchResultNavigate()}
                    >
                      View all
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {searchQuery.trim() ? (
                      filteredContacts.length ? (
                        filteredContacts.slice(0, 5).map((contact) => (
                          <button
                            key={contact.id}
                            onClick={() => handleSearchResultNavigate(contact.id)}
                            className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left hover:bg-[#0c142a] transition-colors"
                          >
                            <div>
                              <p className="text-sm font-semibold text-white">{contact.name}</p>
                              <p className="text-xs text-blue-300">{contact.email}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-blue-200">{contact.company}</p>
                              <p className="text-xs text-blue-400/80">{contact.phone}</p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-6 text-center text-xs text-blue-300">No contacts found.</div>
                      )
                    ) : (
                      <div className="px-4 py-6 text-center text-xs text-blue-300">Start typing to search contacts.</div>
                    )}
                  </div>
                  {filteredContacts.length > 5 && (
                    <div className="border-t border-[#111936] px-4 py-2 text-[11px] text-blue-300">Showing top 5 results</div>
                  )}
                </div>
              )}
            </div>
            <button className="flex h-8 w-8 items-center justify-center rounded-[24px] border border-[#1a2446] bg-[#0e1629] text-[#7ed0ff] hover:bg-[#121c3d] transition-colors">
              <SettingsIcon />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Link href="#" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-blue-200 hover:text-white hover:bg-[#0e1629] rounded-[20px] transition-colors border border-[#1a2446]">
              BotOnly AI
            </Link>
            <Link href="#" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-blue-200 hover:text-white hover:bg-[#0e1629] rounded-[20px] transition-colors border border-[#1a2446]">
              Tools
            </Link>
            <button className="inline-flex items-center justify-center h-8 w-8 text-blue-200 hover:text-white hover:bg-[#0e1629] rounded-[20px] transition-colors border border-[#1a2446]">
              <AcademyIcon />
            </button>
            <button className="inline-flex items-center justify-center h-8 w-8 text-blue-200 hover:text-white hover:bg-[#0e1629] rounded-[20px] transition-colors border border-[#1a2446]">
              <MediaIcon />
            </button>
            <button className="inline-flex items-center justify-center h-8 w-8 text-blue-200 hover:text-white hover:bg-[#0e1629] rounded-[20px] transition-colors border border-[#1a2446] relative">
              <BellIcon />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-red-500 rounded-full"></span>
            </button>
            <Link
              href={`/${accountId}/dashboard/service`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#031226] bg-gradient-to-r from-[#FFD54A] to-[#FFC107] hover:brightness-110 rounded-[20px] transition-all border border-[#d4a017]"
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
          </div>
        </header>
        <div className="h-px bg-[#1a2446]/50"></div>
        <div className={`grid flex-1 grid-cols-1 ${contentGrid}`}>
        {/* Main sidebar */}
          {!sidebarCollapsed && (
            <aside className="border-b border-[#1a2446] p-3 md:border-b-0 md:border-r bg-[#0e1629] md:sticky md:top-0 md:h-screen transition-[transform,opacity] duration-300 ease-in-out md:translate-x-0 md:opacity-100">
            <div className="flex h-full flex-col">
            <nav className="flex-1 overflow-y-auto pr-1 flex flex-col gap-1 pt-2 pb-24">
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
                    {navSeparators.has(item.id) && (
                      <div className="mx-1 mt-2 h-px bg-[#1a2446]/60" aria-hidden="true"></div>
                    )}
                  </div>
                )
              })}
            </nav>
            </div>
          </aside>
          )}

          <div className="bg-[#020617]">
        <div className="mx-auto grid max-w-[1140px] gap-4 p-4">
          {view === "overview" ? (
            <div className="grid gap-5">
              <div className="card rounded-[32px] border-[#1f2c56] bg-gradient-to-r from-[#101b38] via-[#0c142a] to-[#060b1a] p-6 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
          <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-semibold text-white">Welcome</h3>
                  <Pill>Module</Pill>
              </div>
                    <p className="mt-2 max-w-2xl text-sm text-blue-200">
                      Unified navigation, shared auth, and curated module slots so every workflow is a click away.
                    </p>
          </div>
          <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/${accountId}/dashboard/service`)}
                      className="btn btn-gold text-xs font-semibold px-4 py-2 rounded-[26px]"
                    >
                      Request Support
                    </button>
              <button
                      onClick={() => navigate("customers_contacts")}
                      className="btn text-xs font-semibold rounded-[26px]"
              >
                      Explore Modules
              </button>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {overviewModules.map((module) => (
                  <div
                    key={module.id}
                    className="card rounded-[28px] border-[#1a2446]/80 bg-[#0c142a] p-5 shadow-[0_25px_45px_-35px_rgba(39,172,255,0.65)]"
                  >
                    <div className="flex items-center justify-between text-xs text-blue-200">
                      <span className="font-semibold text-white/80">{module.title.split(" ")[0]}</span>
                      <Pill>Module</Pill>
                    </div>
                    <h4 className="mt-2 text-lg font-semibold text-white">{module.title}</h4>
                    <p className="mt-1 text-sm text-blue-200">{module.description}</p>
                    <button
                      onClick={module.action}
                      className="mt-4 inline-flex w-full items-center justify-center rounded-[26px] bg-[#2b9bff] px-4 py-2 text-sm font-semibold text-[#041226] transition hover:brightness-110"
                    >
                      Open
                    </button>
                </div>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {overviewStats.map((stat) => (
                  <div key={stat.id} className="card rounded-[28px] border-[#132044] bg-[#050b1c]">
                    <p className="text-xs uppercase tracking-wide text-blue-300">{stat.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : view === "customers_contacts" ? (
            <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <div className="card rounded-[32px] bg-[#070d20] p-6">
                <div className="mb-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-semibold text-white">Contacts</h2>
                        <Pill>Live Demo</Pill>
                      </div>
                      <p className="mt-1 text-sm text-blue-200">Lightweight contacts view for demo</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:space-x-4">
                      <label className="flex items-center space-x-2 text-sm text-blue-200">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
                          checked={contactSelectionMode}
                          onChange={(event) => setContactSelectionMode(event.target.checked)}
                        />
                        <span>Select</span>
                      </label>
                      {!contactSelectionMode ? (
                        <div className="relative w-full sm:max-w-xs">
                          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search contacts..."
                            className="w-full rounded-full border border-gray-700 bg-[#1a2035] px-4 py-2 pl-10 pr-12 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            value={contactSearchTerm}
                            onChange={(event) => setContactSearchTerm(event.target.value)}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:text-white focus:outline-none"
                          >
                            <FunnelIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {contactActionButtons.map(({ label, icon: Icon }) => (
                            <button
                              key={label}
                              type="button"
                              className="inline-flex items-center rounded-full border border-gray-700 bg-gray-800/80 px-3 py-1 text-xs font-medium text-gray-200 hover:border-indigo-500 hover:text-white"
                            >
                              <Icon className="mr-1 h-4 w-4" />
                              {label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setShowAddContactForm((prev) => !prev)}
                      className="rounded-[26px] bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#070d20]"
                    >
                      {showAddContactForm ? "Cancel" : "Add Contact"}
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full rounded-[26px] border border-[#121a36] bg-[#09112a]">
                    <thead>
                      <tr className="border-b border-[#1a2446] text-left text-xs font-semibold uppercase tracking-wide text-blue-300">
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Phone</th>
                        <th className="px-4 py-3">Company</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContacts.map((contact) => {
                        const highlighted = contact.id === searchPreviewSelection
                        return (
                          <tr
                            key={contact.id}
                            className={`border-b border-[#1a2446]/40 last:border-b-0 transition-colors ${
                              highlighted ? "bg-[#132045] shadow-[0_0_0_1px_rgba(126,208,255,0.4)]" : ""
                            }`}
                          >
                            <td className="px-4 py-3 text-sm text-blue-300">{contact.id}</td>
                            <td className="px-4 py-3 text-sm font-semibold text-white">{contact.name}</td>
                            <td className="px-4 py-3 text-sm text-blue-200">{contact.email}</td>
                            <td className="px-4 py-3 text-sm text-blue-200">{contact.phone}</td>
                            <td className="px-4 py-3 text-sm text-blue-200">{contact.company}</td>
                          </tr>
                        )
                      })}
                      {!filteredContacts.length && (
                        <tr>
                          <td colSpan={5} className="px-4 py-6 text-center text-sm text-blue-300">
                            {(contactSearchTerm || searchQuery).trim()
                              ? `No contacts found for “${(contactSearchTerm || searchQuery).trim()}”.`
                              : "No contacts available."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              {showAddContactForm && (
                <div className="card rounded-[32px] bg-[#070d20] p-6">
                  <h2 className="text-2xl font-semibold text-white">Add Contact</h2>
                  <form className="mt-6 space-y-4" onSubmit={handleAddContact}>
                    <div className="rounded-[28px] border border-[#1a2446] bg-[#0e1629] px-4 py-2">
                      <input
                        type="text"
                        value={newContact.name}
                        onChange={(event) => setNewContact((prev) => ({ ...prev, name: event.target.value }))}
                        placeholder="Full name"
                        className="w-full bg-transparent text-sm text-blue-100 placeholder-blue-300/70 focus:outline-none"
                      />
                    </div>
                    <div className="rounded-[28px] border border-[#1a2446] bg-[#0e1629] px-4 py-2">
                      <input
                        type="email"
                        value={newContact.email}
                        onChange={(event) => setNewContact((prev) => ({ ...prev, email: event.target.value }))}
                        placeholder="Email"
                        className="w-full bg-transparent text-sm text-blue-100 placeholder-blue-300/70 focus:outline-none"
                      />
                    </div>
                    <div className="rounded-[28px] border border-[#1a2446] bg-[#0e1629] px-4 py-2">
                      <input
                        type="text"
                        value={newContact.phone}
                        onChange={(event) => setNewContact((prev) => ({ ...prev, phone: event.target.value }))}
                        placeholder="Phone"
                        className="w-full bg-transparent text-sm text-blue-100 placeholder-blue-300/70 focus:outline-none"
                      />
                    </div>
                    <div className="rounded-[28px] border border-[#1a2446] bg-[#0e1629] px-4 py-2">
                      <input
                        type="text"
                        value={newContact.company}
                        onChange={(event) => setNewContact((prev) => ({ ...prev, company: event.target.value }))}
                        placeholder="Company"
                        className="w-full bg-transparent text-sm text-blue-100 placeholder-blue-300/70 focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full rounded-[28px] bg-gradient-to-r from-[#31b0ff] to-[#66d6ff] py-2 text-sm font-semibold text-[#041226] transition hover:brightness-110 disabled:opacity-50"
                      disabled={!newContact.name || !newContact.email}
                    >
                      Save
                    </button>
                  </form>
                  <p className="mt-4 text-xs text-blue-300">Dummy data only. Data is stored locally in the browser.</p>
                </div>
              )}
            </div>
          ) : view === "customers_companies" ? (
            <div className="card rounded-[32px] bg-[#0e1629]">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-white">Companies</h2>
                <p className="mt-1 text-sm text-blue-200">Manage your company database.</p>
              </div>
            </div>
          ) : view === "products_listing" ? (
            <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <div className="card rounded-[32px] bg-[#070d20] p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-white">Product Listing</h2>
                      <p className="mt-1 text-sm text-blue-200">Catalog of sellable items</p>
                    </div>
                    <Pill>Catalog</Pill>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <div className="flex-1 rounded-[32px] border border-[#1a2446] bg-[#0e1629] px-4 py-2">
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(event) => setProductSearch(event.target.value)}
                        placeholder="Search name, SKU"
                        className="w-full bg-transparent text-sm text-blue-100 placeholder-blue-300/70 focus:outline-none"
                      />
                    </div>
                    <select
                      value={productCategory}
                      onChange={(event) => setProductCategory(event.target.value)}
                      className="rounded-[24px] border border-[#1a2446] bg-[#0e1629] px-4 py-2 text-sm text-blue-100"
                    >
                      {["All", "Merch", "Bundle", "Service", "General"].map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  <button
                    onClick={() => {
                        setProductSearch("")
                        setProductCategory("All")
                    }}
                      className="rounded-[24px] border border-[#1a2446] px-4 py-2 text-sm text-blue-100 hover:bg-[#121c3d]"
                  >
                      Clear
                  </button>
                </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full rounded-[26px] border border-[#121a36] bg-[#09112a]">
                    <thead>
                      <tr className="border-b border-[#1a2446] text-left text-xs font-semibold uppercase tracking-wide text-blue-300">
                        <th className="px-4 py-3">SKU</th>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr key={product.sku} className="border-b border-[#1a2446]/40 last:border-b-0">
                          <td className="px-4 py-3 text-sm text-blue-300">{product.sku}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-white">{product.name}</td>
                          <td className="px-4 py-3 text-sm text-blue-200">{product.category}</td>
                          <td className="px-4 py-3 text-sm text-blue-200">${product.price}</td>
                          <td className="px-4 py-3 text-sm text-blue-200">{product.stock}</td>
                        </tr>
                      ))}
                      {!filteredProducts.length && (
                        <tr>
                          <td colSpan={5} className="px-4 py-6 text-center text-sm text-blue-300">
                            No products available for this filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
            </div>
          </div>
              <div className="card rounded-[32px] bg-[#070d20] p-6">
                <h2 className="text-2xl font-semibold text-white">Add Product</h2>
                <form className="mt-6 space-y-4" onSubmit={handleAddProduct}>
                  <div className="rounded-[28px] border border-[#1a2446] bg-[#0e1629] px-4 py-2">
                    <input
                      type="text"
                      value={newProduct.sku}
                      onChange={(event) => setNewProduct((prev) => ({ ...prev, sku: event.target.value }))}
                      placeholder="SKU"
                      className="w-full bg-transparent text-sm text-blue-100 placeholder-blue-300/70 focus:outline-none"
                    />
                </div>
                  <div className="rounded-[28px] border border-[#1a2446] bg-[#0e1629] px-4 py-2">
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(event) => setNewProduct((prev) => ({ ...prev, name: event.target.value }))}
                      placeholder="Name"
                      className="w-full bg-transparent text-sm text-blue-100 placeholder-blue-300/70 focus:outline-none"
                    />
              </div>
                  <div className="rounded-[28px] border border-[#1a2446] bg-[#0e1629] px-4 py-2">
                    <input
                      type="text"
                      value={newProduct.category}
                      onChange={(event) => setNewProduct((prev) => ({ ...prev, category: event.target.value }))}
                      placeholder="Category"
                      className="w-full bg-transparent text-sm text-blue-100 placeholder-blue-300/70 focus:outline-none"
                    />
            </div>
                  <div className="rounded-[28px] border border-[#1a2446] bg-[#0e1629] px-4 py-2">
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(event) => setNewProduct((prev) => ({ ...prev, price: event.target.value }))}
                      placeholder="Price"
                      className="w-full bg-transparent text-sm text-blue-100 placeholder-blue-300/70 focus:outline-none"
                    />
              </div>
                  <div className="rounded-[28px] border border-[#1a2446] bg-[#0e1629] px-4 py-2">
                    <input
                      type="number"
                      value={newProduct.stock}
                      onChange={(event) => setNewProduct((prev) => ({ ...prev, stock: event.target.value }))}
                      placeholder="Stock"
                      className="w-full bg-transparent text-sm text-blue-100 placeholder-blue-300/70 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-[28px] bg-gradient-to-r from-[#31b0ff] to-[#66d6ff] py-2 text-sm font-semibold text-[#041226] transition hover:brightness-110 disabled:opacity-50"
                    disabled={!newProduct.sku || !newProduct.name}
                  >
                    Save
                  </button>
                </form>
                <p className="mt-4 text-xs text-blue-300">Demo only. Data is stored locally in your browser.</p>
              </div>
            </div>
          ) : view === "tasks" ? (
            <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <div className="card rounded-[32px] bg-[#070d20] p-6">
                <h2 className="text-2xl font-semibold text-white">New Task</h2>
                <form className="mt-6 space-y-4" onSubmit={handleAddTask}>
                  <div className="rounded-[28px] border border-[#1a2446] bg-[#0e1629] px-4 py-2">
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(event) => setNewTask((prev) => ({ ...prev, title: event.target.value }))}
                      placeholder="Title"
                      className="w-full bg-transparent text-sm text-blue-100 placeholder-blue-300/70 focus:outline-none"
                    />
                  </div>
                  <div className="rounded-[28px] border border-[#1a2446] bg-[#0e1629] px-4 py-2">
                    <input
                      type="text"
                      value={newTask.assignee}
                      onChange={(event) => setNewTask((prev) => ({ ...prev, assignee: event.target.value }))}
                      placeholder="Assignee"
                      className="w-full bg-transparent text-sm text-blue-100 placeholder-blue-300/70 focus:outline-none"
                    />
                  </div>
                  <div className="rounded-[28px] border border-[#1a2446] bg-[#0e1629] px-4 py-2">
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(event) => setNewTask((prev) => ({ ...prev, dueDate: event.target.value }))}
                      placeholder="yyyy/mm/dd"
                      className="w-full bg-transparent text-sm text-blue-100 placeholder-blue-300/70 focus:outline-none"
                    />
                  </div>
                  <div className="rounded-[28px] border border-[#1a2446] bg-[#0e1629] px-4 py-2">
                    <select
                      value={newTask.priority}
                      onChange={(event) => setNewTask((prev) => ({ ...prev, priority: event.target.value as Task["priority"] }))}
                      className="w-full bg-transparent text-sm text-blue-100 focus:outline-none"
                    >
                      {priorityOptions.map((priority) => (
                        <option key={priority} value={priority} className="bg-[#0e1629]">
                          {priority}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="rounded-[28px] border border-[#1a2446] bg-[#0e1629] px-4 py-2">
                    <textarea
                      value={newTask.description}
                      onChange={(event) => setNewTask((prev) => ({ ...prev, description: event.target.value }))}
                      placeholder="Description"
                      className="h-32 w-full resize-none bg-transparent text-sm text-blue-100 placeholder-blue-300/70 focus:outline-none"
                    />
                  </div>
                  <div className="rounded-[28px] border border-[#1a2446] bg-[#0e1629] px-4 py-2">
                    <input
                      type="text"
                      value={newTask.tags}
                      onChange={(event) => setNewTask((prev) => ({ ...prev, tags: event.target.value }))}
                      placeholder="Tags (comma separated)"
                      className="w-full bg-transparent text-sm text-blue-100 placeholder-blue-300/70 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      className="flex-1 rounded-[28px] bg-gradient-to-r from-[#31b0ff] to-[#66d6ff] py-2 text-sm font-semibold text-[#041226] transition hover:brightness-110 disabled:opacity-50"
                      disabled={!newTask.title.trim()}
                    >
                      Add Task
                    </button>
                    <button
                      type="button"
                      onClick={handleResetTaskForm}
                      className="rounded-[28px] border border-[#1a2446] px-6 py-2 text-sm text-blue-100 hover:bg-[#121c3d]"
                    >
                      Reset
                    </button>
                  </div>
                </form>
                <div className="mt-6 rounded-[28px] border border-[#1a2446] bg-[#09112a]">
                  <div className="overflow-x-auto rounded-[28px]">
                    <table className="w-full">
                  <thead>
                        <tr className="border-b border-[#1a2446] text-left text-xs font-semibold uppercase tracking-wide text-blue-300">
                          <th className="px-4 py-3">ID</th>
                          <th className="px-4 py-3">Title</th>
                          <th className="px-4 py-3">Assignee</th>
                          <th className="px-4 py-3">Due</th>
                          <th className="px-4 py-3">Priority</th>
                          <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                        {filteredTasks.map((task) => (
                          <tr key={task.id} className="border-b border-[#1a2446]/40 last:border-b-0">
                            <td className="px-4 py-3 text-sm text-blue-300">{task.id}</td>
                            <td className="px-4 py-3 text-sm font-semibold text-white">{task.title}</td>
                            <td className="px-4 py-3 text-sm text-blue-200">{task.assignee}</td>
                            <td className="px-4 py-3 text-sm text-blue-200">{task.dueDate || "—"}</td>
                            <td className="px-4 py-3 text-sm text-blue-200">{task.priority}</td>
                            <td className="px-4 py-3 text-sm text-blue-200">{task.status}</td>
                    </tr>
                        ))}
                        {!filteredTasks.length && (
                          <tr>
                            <td colSpan={6} className="px-4 py-6 text-center text-sm text-blue-300">
                              No tasks found.
                            </td>
                    </tr>
                        )}
                  </tbody>
                </table>
              </div>
            </div>
              </div>
              <div className="card rounded-[32px] bg-[#070d20] p-6">
                <h2 className="text-2xl font-semibold text-white">Filters</h2>
                <div className="mt-6 space-y-4">
                  <div className="rounded-[28px] border border-[#1a2446] bg-[#0e1629] px-4 py-2">
                    <input
                      type="text"
                      value={taskFilters.search}
                      onChange={(event) => setTaskFilters((prev) => ({ ...prev, search: event.target.value }))}
                      placeholder="Search"
                      className="w-full bg-transparent text-sm text-blue-100 placeholder-blue-300/70 focus:outline-none"
                    />
            </div>
                  {(["status", "priority", "assignee"] as const).map((filterKey) => (
                    <div key={filterKey} className="rounded-[28px] border border-[#1a2446] bg-[#0e1629] px-4 py-2">
                      <select
                        value={taskFilters[filterKey]}
                        onChange={(event) => setTaskFilters((prev) => ({ ...prev, [filterKey]: event.target.value }))}
                        className="w-full bg-transparent text-sm text-blue-100 focus:outline-none"
                      >
                        <option className="bg-[#0e1629]" value="All">
                          All
                        </option>
                        {filterKey === "priority" &&
                          priorityOptions.map((priority) => (
                            <option key={priority} className="bg-[#0e1629]" value={priority}>
                              {priority}
                            </option>
                          ))}
                        {filterKey === "status" &&
                          statusOptions.map((status) => (
                            <option key={status} className="bg-[#0e1629]" value={status}>
                              {status}
                            </option>
                          ))}
                        {filterKey === "assignee" &&
                          Array.from(new Set(tasks.map((task) => task.assignee))).map((assignee) => (
                            <option key={assignee} className="bg-[#0e1629]" value={assignee}>
                              {assignee}
                            </option>
                          ))}
                      </select>
                    </div>
                  ))}
                  <div className="flex items-center gap-3 rounded-[28px] border border-[#1a2446] bg-[#0e1629] p-1">
                    <button
                      onClick={() => setTaskViewMode("list")}
                      className={`flex-1 rounded-[24px] px-4 py-2 text-sm font-semibold transition ${
                        taskViewMode === "list" ? "bg-[#31b0ff] text-[#041226]" : "text-blue-100"
                      }`}
                    >
                      List
                    </button>
                    <button
                      onClick={() => setTaskViewMode("board")}
                      className={`flex-1 rounded-[24px] px-4 py-2 text-sm font-semibold transition ${
                        taskViewMode === "board" ? "bg-[#31b0ff] text-[#041226]" : "text-blue-100"
                      }`}
                    >
                      Board
                    </button>
                  </div>
                  {taskViewMode === "board" && (
                    <div className="rounded-[28px] border border-dashed border-[#1a2446] bg-[#0e1629] p-6 text-center text-sm text-blue-200">
                      Board preview coming soon. Tasks stay in list view for now.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : view === "hr" ? (
            <div className="grid gap-5">
              <div className="card rounded-[32px] bg-[#070d20] p-6">
                <h2 className="text-2xl font-semibold text-white">Directory, leave requests, onboarding</h2>
                <p className="mt-2 text-sm text-blue-200">Manage your people data, leave approvals, and onboarding workflows.</p>
              </div>
              <div className="grid gap-5 lg:grid-cols-3">
                <div className="card rounded-[32px] bg-[#070d20] p-6">
                  <h3 className="text-xl font-semibold text-white">Add Employee</h3>
                  <form className="mt-5 space-y-4" onSubmit={handleAddEmployee}>
                    <div className="rounded-[28px] border border-[#1a2446] bg-[#0e1629] px-4 py-2">
                      <input
                        type="text"
                        value={newEmployee.name}
                        onChange={(event) => setNewEmployee((prev) => ({ ...prev, name: event.target.value }))}
                        placeholder="Full name"
                        className="w-full bg-transparent text-sm text-blue-100 placeholder-blue-300/70 focus:outline-none"
                      />
                    </div>
                    <div className="rounded-[28px] border border-[#1a2446] bg-[#0e1629] px-4 py-2">
                      <input
                        type="email"
                        value={newEmployee.email}
                        onChange={(event) => setNewEmployee((prev) => ({ ...prev, email: event.target.value }))}
                        placeholder="Email"
                        className="w-full bg-transparent text-sm text-blue-100 placeholder-blue-300/70 focus:outline-none"
                      />
                    </div>
                    <div className="rounded-[28px] border border-[#1a2446] bg-[#0e1629] px-4 py-2">
                      <input
                        type="text"
                        value={newEmployee.role}
                        onChange={(event) => setNewEmployee((prev) => ({ ...prev, role: event.target.value }))}
                        placeholder="Role"
                        className="w-full bg-transparent text-sm text-blue-100 placeholder-blue-300/70 focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full rounded-[28px] bg-gradient-to-r from-[#31b0ff] to-[#66d6ff] py-2 text-sm font-semibold text-[#041226] transition hover:brightness-110 disabled:opacity-50"
                      disabled={!newEmployee.name || !newEmployee.email || !newEmployee.role}
                    >
                      Save
                    </button>
                    <p className="text-xs text-blue-300">Demo only. Persisted in localStorage.</p>
                  </form>
                </div>
                <div className="card rounded-[32px] bg-[#070d20] p-6">
                  <h3 className="text-xl font-semibold text-white">Request Leave</h3>
                  <form className="mt-5 space-y-4" onSubmit={handleSubmitLeave}>
                    <div className="rounded-[28px] border border-[#1a2446] bg-[#0e1629] px-4 py-2">
                      <select
                        value={leaveForm.employeeId}
                        onChange={(event) => setLeaveForm((prev) => ({ ...prev, employeeId: event.target.value }))}
                        className="w-full bg-transparent text-sm text-blue-100 focus:outline-none"
                      >
                        <option value="" className="bg-[#0e1629] text-blue-100">
                          Select employee...
                        </option>
                        {employees.map((employee) => (
                          <option key={employee.id} value={employee.id} className="bg-[#0e1629] text-blue-100">
                            {employee.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="rounded-[28px] border border-[#1a2446] bg-[#0e1629] px-4 py-2">
                      <select
                        value={leaveForm.type}
                        onChange={(event) => setLeaveForm((prev) => ({ ...prev, type: event.target.value }))}
                        className="w-full bg-transparent text-sm text-blue-100 focus:outline-none"
                      >
                        {["Annual", "Sick", "Family", "Remote"].map((type) => (
                          <option key={type} value={type} className="bg-[#0e1629] text-blue-100">
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="rounded-[28px] border border-[#1a2446] bg-[#0e1629] px-4 py-2">
                      <input
                        type="date"
                        value={leaveForm.startDate}
                        onChange={(event) => setLeaveForm((prev) => ({ ...prev, startDate: event.target.value }))}
                        placeholder="yyyy/mm/dd"
                        className="w-full bg-transparent text-sm text-blue-100 placeholder-blue-300/70 focus:outline-none"
                      />
                    </div>
                    <div className="rounded-[28px] border border-[#1a2446] bg-[#0e1629] px-4 py-2">
                      <input
                        type="date"
                        value={leaveForm.endDate}
                        onChange={(event) => setLeaveForm((prev) => ({ ...prev, endDate: event.target.value }))}
                        placeholder="yyyy/mm/dd"
                        className="w-full bg-transparent text-sm text-blue-100 placeholder-blue-300/70 focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full rounded-[28px] bg-gradient-to-r from-[#31b0ff] to-[#66d6ff] py-2 text-sm font-semibold text-[#041226] transition hover:brightness-110 disabled:opacity-50"
                      disabled={!leaveForm.employeeId || !leaveForm.startDate || !leaveForm.endDate}
                    >
                      Submit
                    </button>
                  </form>
                </div>
                <div className="card rounded-[32px] bg-[#070d20] p-6">
                  <h3 className="text-xl.font-semibold text-white">Leave Filter</h3>
                  <div className="mt-5 space-y-4">
                    <div className="rounded-[28px] border border-[#1a2446] bg-[#0e1629] px-4 py-2">
                      <select
                        value={leaveFilter}
                        onChange={(event) => setLeaveFilter(event.target.value)}
                        className="w-full bg-transparent text-sm text-blue-100 focus:outline-none"
                      >
                        {["All", "Pending", "Approved", "Rejected"].map((option) => (
                          <option key={option} value={option} className="bg-[#0e1629] text-blue-100">
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="rounded-[28px] border border-[#1a2446] bg-[#0e1629] p-4 text-sm text-blue-100">
                      <p className="text-blue-300">Employees</p>
                      <p className="text-2xl font-semibold text-white">{employees.length}</p>
                      <p className="mt-3 text-blue-300">Pending leave requests</p>
                      <p className="text-2xl font-semibold text-white">
                        {leaveRequests.filter((request) => request.status === "Pending").length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card rounded-[32px] bg-[#070d20] p-0">
                <div className="overflow-x-auto rounded-[32px]">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#1a2446] text-left text-xs font-semibold uppercase tracking-wide text-blue-300">
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Employee</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Start</th>
                        <th className="px-4 py-3">End</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeaveRequests.map((request) => (
                        <tr key={request.id} className="border-b border-[#1a2446]/40 last:border-b-0">
                          <td className="px-4 py-3 text-sm text-blue-300">{request.id}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-white">{request.employeeName}</td>
                          <td className="px-4 py-3 text-sm text-blue-200">{request.type}</td>
                          <td className="px-4 py-3 text-sm text-blue-200">{request.startDate}</td>
                          <td className="px-4 py-3 text-sm text-blue-200">{request.endDate}</td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                request.status === "Approved"
                                  ? "bg-[#183b2e] text-[#7fffb4]"
                                  : request.status === "Rejected"
                                    ? "bg-[#3b1822] text-[#ff7fa1]"
                                    : "bg-[#152038] text-[#7ed0ff]"
                              }`}
                            >
                              {request.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {!filteredLeaveRequests.length && (
                        <tr>
                          <td colSpan={6} className="px-4 py-6 text-center text-sm text-blue-300">
                            No leave requests.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : view.startsWith("front_office_") ? (
            <div className="card rounded-[32px] bg-[#0e1629]">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-white">{activeLabel}</h2>
                <p className="mt-1 text-sm text-blue-200">Front Office application module.</p>
              </div>
            </div>
          ) : (
            <div className="card rounded-[32px] bg-[#0e1629]">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-white">{activeLabel}</h2>
                <p className="mt-1 text-sm text-blue-200">This is a preview area for <span className="font-medium text-blue-100">{activeLabel}</span>.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  </div>
  </div>
  )
}