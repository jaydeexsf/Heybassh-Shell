"use client"

import Link from "next/link"
import { ReactNode, useMemo, useState, useEffect } from "react"

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

const modules = [
  {
    label: "Customers Module",
    description: "Contacts, companies, deals, products & more.",
    target: "customers",
  },
  {
    label: "Billing Lite Module",
    description: "Quotes, invoices, Stripe/Woo sync.",
    target: "billing",
  },
  {
    label: "Book a Service Module",
    description: "Log a support request or feature task.",
    target: "service",
  },
  {
    label: "Tasks Module",
    description: "Teamwork-style lists and boards.",
    target: "tasks",
  },
  {
    label: "HR / People Module",
    description: "Directory, leave, onboarding.",
    target: "hr",
  },
  {
    label: "IT / Admin Module",
    description: "Assets, approvals, access requests.",
    target: "admin",
  },
]

type Contact = {
  id: string
  name: string
  email: string
  phone: string
  company: string
}

function ContactsView() {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: "C-1001", name: "Jane Cooper", email: "jane@acme.com", phone: "+1 202-555-0101", company: "Acme Inc" },
    { id: "C-1002", name: "Wade Warren", email: "wade@globex.com", phone: "+1 202-555-0199", company: "Globex" },
    { id: "C-1003", name: "Cody Fisher", email: "cody@umbrella.com", phone: "+1 202-555-0144", company: "Umbrella" },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", company: "" })

  useEffect(() => {
    const saved = localStorage.getItem("contacts")
    if (saved) {
      try {
        setContacts(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load contacts from localStorage")
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(contacts))
  }, [contacts])

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase())
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.name || !formData.email) return

    const newContact: Contact = {
      id: `C-${1000 + contacts.length + 1}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
    }

    setContacts([...contacts, newContact])
    setFormData({ name: "", email: "", phone: "", company: "" })
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_400px]">
      <div className="card">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white">Contacts</h2>
          <p className="mt-1 text-sm text-blue-200">Lightweight contacts view for demo</p>
        </div>
        <div className="mb-4">
          <input
            type="text"
            className="input w-full"
            placeholder="Search name, email, phone, company"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a2446]">
                <th className="th text-left">ID</th>
                <th className="th text-left">NAME</th>
                <th className="th text-left">EMAIL</th>
                <th className="th text-left">PHONE</th>
                <th className="th text-left">COMPANY</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="border-b border-[#1a2446]/50">
                  <td className="td text-sm text-blue-200">{contact.id}</td>
                  <td className="td text-sm text-white font-medium">{contact.name}</td>
                  <td className="td text-sm text-blue-200">{contact.email}</td>
                  <td className="td text-sm text-blue-200">{contact.phone}</td>
                  <td className="td text-sm text-blue-200">{contact.company}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card">
        <h2 className="mb-4 text-xl font-semibold text-white">Add Contact</h2>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            type="text"
            className="input"
            placeholder="Full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="email"
            className="input"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="tel"
            className="input"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <input
            type="text"
            className="input"
            placeholder="Company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          />
          <button type="submit" className="btn btn-primary w-full">
            Save
          </button>
          <p className="text-xs text-blue-200/60">dummy data only. Data is stored locally in the  browser.</p>
        </form>
      </div>
    </div>
  )
}

function CustomerServiceView() {
  return (
    <div className="grid gap-4">
      <div className="card">
        <h2 className="text-2xl font-semibold text-white">Customer Service</h2>
        <p className="mt-1 text-sm text-blue-200">Tickets, SLAs, satisfaction</p>
      </div>
      <div className="card">
        <p className="text-sm text-blue-200">Link this to your Tickets module or external helpdesk.</p>
      </div>
    </div>
  )
}

type Product = {
  sku: string
  name: string
  category: string
  price: number
  stock: number
}

function ProductListingView() {
  const [products, setProducts] = useState<Product[]>([
    { sku: "P-1001", name: "Heybassh T-Shirt", category: "Merch", price: 25, stock: 120 },
    { sku: "P-2001", name: "Onboarding Kit", category: "Bundle", price: 199, stock: 15 },
    { sku: "P-3001", name: "Consulting Hour", category: "Service", price: 99, stock: 9999 },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [formData, setFormData] = useState({ sku: "", name: "", category: "General", price: "", stock: "" })

  useEffect(() => {
    const saved = localStorage.getItem("products")
    if (saved) {
      try {
        setProducts(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load products from localStorage")
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products))
  }, [products])

  const categories = Array.from(new Set(products.map((p) => p.category))).sort()

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "All" || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.sku || !formData.name) return

    const newProduct: Product = {
      sku: formData.sku,
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock) || 0,
    }

    setProducts([...products, newProduct])
    setFormData({ sku: "", name: "", category: "General", price: "", stock: "" })
  }

  function handleClear() {
    setSearchQuery("")
    setCategoryFilter("All")
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_400px]">
      <div className="card">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white">Product Listing</h2>
          <p className="mt-1 text-sm text-blue-200">Catalog of sellable items</p>
        </div>
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            className="input flex-1"
            placeholder="Search name, SKU"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="input"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option>All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button type="button" onClick={handleClear} className="btn">
            Clear
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a2446]">
                <th className="th text-left">SKU</th>
                <th className="th text-left">NAME</th>
                <th className="th text-left">CATEGORY</th>
                <th className="th text-left">PRICE</th>
                <th className="th text-left">STOCK</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.sku} className="border-b border-[#1a2446]/50">
                  <td className="td text-sm text-blue-200">{product.sku}</td>
                  <td className="td text-sm text-white font-medium">{product.name}</td>
                  <td className="td text-sm text-blue-200">{product.category}</td>
                  <td className="td text-sm text-blue-200">{product.price}</td>
                  <td className="td text-sm text-blue-200">{product.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card">
        <h2 className="mb-4 text-xl font-semibold text-white">Add Product</h2>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            type="text"
            className="input"
            placeholder="SKU"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            required
          />
          <input
            type="text"
            className="input"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="text"
            className="input"
            placeholder="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
          <input
            type="number"
            className="input"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
          <input
            type="number"
            className="input"
            placeholder="Stock"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          />
          <button type="submit" className="btn btn-primary w-full">
            Save
          </button>
          <p className="text-xs text-blue-200/60">demo only. Data is stored locally in your browser.</p>
        </form>
      </div>
    </div>
  )
}

type Task = {
  id: string
  title: string
  assignee: string
  due: string
  priority: string
  status: string
}

function TasksView() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [viewMode, setViewMode] = useState<"list" | "board">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterAssignee, setFilterAssignee] = useState("All")
  const [filterPriority, setFilterPriority] = useState("All")
  const [filterStatus, setFilterStatus] = useState("All")
  const [formData, setFormData] = useState({
    title: "",
    assignee: "Jane",
    due: "",
    priority: "Normal",
    description: "",
    tags: "",
  })

  useEffect(() => {
    const saved = localStorage.getItem("tasks")
    if (saved) {
      try {
        setTasks(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load tasks from localStorage")
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  const assignees = Array.from(new Set(tasks.map((t) => t.assignee))).sort()
  const priorities = Array.from(new Set(tasks.map((t) => t.priority))).sort()
  const statuses = Array.from(new Set(tasks.map((t) => t.status))).sort()

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAssignee = filterAssignee === "All" || task.assignee === filterAssignee
    const matchesPriority = filterPriority === "All" || task.priority === filterPriority
    const matchesStatus = filterStatus === "All" || task.status === filterStatus
    return matchesSearch && matchesAssignee && matchesPriority && matchesStatus
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.title) return

    const newTask: Task = {
      id: `T-${1000 + tasks.length + 1}`,
      title: formData.title,
      assignee: formData.assignee,
      due: formData.due || "Not set",
      priority: formData.priority,
      status: "Pending",
    }

    setTasks([...tasks, newTask])
    setFormData({
      title: "",
      assignee: "Jane",
      due: "",
      priority: "Normal",
      description: "",
      tags: "",
    })
  }

  function handleReset() {
    setFormData({
      title: "",
      assignee: "Jane",
      due: "",
      priority: "Normal",
      description: "",
      tags: "",
    })
  }

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_400px]">
        <div className="card">
          <h2 className="mb-4 text-xl font-semibold text-white">New Task</h2>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <input
              type="text"
              className="input"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <select
              className="input"
              value={formData.assignee}
              onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
            >
              <option value="Jane">Jane</option>
              {assignees.map((assignee) => (
                <option key={assignee} value={assignee}>
                  {assignee}
                </option>
              ))}
            </select>
            <input
              type="date"
              className="input"
              placeholder="yyyy/mm/dd"
              value={formData.due}
              onChange={(e) => setFormData({ ...formData, due: e.target.value })}
            />
            <select
              className="input"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
            <textarea
              className="input min-h-[100px] resize-none"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <input
              type="text"
              className="input"
              placeholder="Tags (comma separated)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary flex-1">
                Add Task
              </button>
              <button type="button" onClick={handleReset} className="btn">
                Reset
              </button>
            </div>
          </form>
        </div>
        <div className="card">
          <h2 className="mb-4 text-xl font-semibold text-white">Filters</h2>
          <div className="grid gap-4">
            <input
              type="text"
              className="input"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="input"
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
            >
              <option>All</option>
              {assignees.map((assignee) => (
                <option key={assignee} value={assignee}>
                  {assignee}
                </option>
              ))}
            </select>
            <select
              className="input"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option>All</option>
              {priorities.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
            <select
              className="input"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option>All</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`btn flex-1 ${viewMode === "list" ? "btn-primary" : ""}`}
              >
                List
              </button>
              <button
                type="button"
                onClick={() => setViewMode("board")}
                className={`btn flex-1 ${viewMode === "board" ? "btn-primary" : ""}`}
              >
                Board
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a2446]">
                <th className="th text-left">ID</th>
                <th className="th text-left">TITLE</th>
                <th className="th text-left">ASSIGNEE</th>
                <th className="th text-left">DUE</th>
                <th className="th text-left">PRIORITY</th>
                <th className="th text-left">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="td text-center text-sm text-blue-200">
                    No tasks found.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task.id} className="border-b border-[#1a2446]/50">
                    <td className="td text-sm text-blue-200">{task.id}</td>
                    <td className="td text-sm text-white font-medium">{task.title}</td>
                    <td className="td text-sm text-blue-200">{task.assignee}</td>
                    <td className="td text-sm text-blue-200">{task.due}</td>
                    <td className="td text-sm text-blue-200">{task.priority}</td>
                    <td className="td text-sm text-blue-200">{task.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

type Employee = {
  id: string
  name: string
  email: string
  role: string
}

type LeaveRequest = {
  id: string
  employee: string
  type: string
  start: string
  end: string
  status: string
}

function HRPeopleView() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [leaveFilter, setLeaveFilter] = useState("All")
  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    email: "",
    role: "",
  })
  const [leaveForm, setLeaveForm] = useState({
    employee: "",
    type: "Annual",
    start: "",
    end: "",
  })

  useEffect(() => {
    const savedEmployees = localStorage.getItem("employees")
    const savedLeaves = localStorage.getItem("leaveRequests")
    if (savedEmployees) {
      try {
        setEmployees(JSON.parse(savedEmployees))
      } catch (e) {
        console.error("Failed to load employees from localStorage")
      }
    }
    if (savedLeaves) {
      try {
        setLeaveRequests(JSON.parse(savedLeaves))
      } catch (e) {
        console.error("Failed to load leave requests from localStorage")
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees))
  }, [employees])

  useEffect(() => {
    localStorage.setItem("leaveRequests", JSON.stringify(leaveRequests))
  }, [leaveRequests])

  const filteredLeaves = leaveRequests.filter((leave) => {
    return leaveFilter === "All" || leave.status === leaveFilter
  })

  function handleAddEmployee(e: React.FormEvent) {
    e.preventDefault()
    if (!employeeForm.name || !employeeForm.email || !employeeForm.role) return

    const newEmployee: Employee = {
      id: `E-${1000 + employees.length + 1}`,
      name: employeeForm.name,
      email: employeeForm.email,
      role: employeeForm.role,
    }

    setEmployees([...employees, newEmployee])
    setEmployeeForm({ name: "", email: "", role: "" })
  }

  function handleRequestLeave(e: React.FormEvent) {
    e.preventDefault()
    if (!leaveForm.employee || !leaveForm.start || !leaveForm.end) return

    const newLeave: LeaveRequest = {
      id: `L-${1000 + leaveRequests.length + 1}`,
      employee: leaveForm.employee,
      type: leaveForm.type,
      start: leaveForm.start,
      end: leaveForm.end,
      status: "Pending",
    }

    setLeaveRequests([...leaveRequests, newLeave])
    setLeaveForm({ employee: "", type: "Annual", start: "", end: "" })
  }

  const leaveTypes = ["Annual", "Sick", "Personal", "Unpaid"]
  const leaveStatuses = Array.from(new Set(leaveRequests.map((l) => l.status))).sort()

  return (
    <div className="grid gap-4">
      <div className="card">
        <h2 className="text-2xl font-semibold text-white">Directory, leave requests, onboarding</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card">
          <h2 className="mb-4 text-xl font-semibold text-white">Add Employee</h2>
          <form onSubmit={handleAddEmployee} className="grid gap-4">
            <input
              type="text"
              className="input"
              placeholder="Full name"
              value={employeeForm.name}
              onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
              required
            />
            <input
              type="email"
              className="input"
              placeholder="Email"
              value={employeeForm.email}
              onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
              required
            />
            <input
              type="text"
              className="input"
              placeholder="Role"
              value={employeeForm.role}
              onChange={(e) => setEmployeeForm({ ...employeeForm, role: e.target.value })}
              required
            />
            <button type="submit" className="btn btn-primary w-full">
              Save
            </button>
            <p className="text-xs text-blue-200/60">Demo only. Persisted in localStorage.</p>
          </form>
        </div>
        <div className="card">
          <h2 className="mb-4 text-xl font-semibold text-white">Request Leave</h2>
          <form onSubmit={handleRequestLeave} className="grid gap-4">
            <select
              className="input"
              value={leaveForm.employee}
              onChange={(e) => setLeaveForm({ ...leaveForm, employee: e.target.value })}
              required
            >
              <option value="">Select employee...</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.name}>
                  {emp.name}
                </option>
              ))}
            </select>
            <select
              className="input"
              value={leaveForm.type}
              onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
            >
              {leaveTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <input
              type="date"
              className="input"
              placeholder="yyyy/m"
              value={leaveForm.start}
              onChange={(e) => setLeaveForm({ ...leaveForm, start: e.target.value })}
              required
            />
            <input
              type="date"
              className="input"
              placeholder="yyyy/m"
              value={leaveForm.end}
              onChange={(e) => setLeaveForm({ ...leaveForm, end: e.target.value })}
              required
            />
            <button type="submit" className="btn btn-primary w-full">
              Submit
            </button>
          </form>
        </div>
        <div className="card">
          <h2 className="mb-4 text-xl font-semibold text-white">Leave Filter</h2>
          <select
            className="input"
            value={leaveFilter}
            onChange={(e) => setLeaveFilter(e.target.value)}
          >
            <option>All</option>
            {leaveStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a2446]">
                <th className="th text-left">ID</th>
                <th className="th text-left">EMPLOYEE</th>
                <th className="th text-left">TYPE</th>
                <th className="th text-left">START</th>
                <th className="th text-left">END</th>
                <th className="th text-left">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan={6} className="td text-center text-sm text-blue-200">
                    No leave requests.
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((leave) => (
                  <tr key={leave.id} className="border-b border-[#1a2446]/50">
                    <td className="td text-sm text-blue-200">{leave.id}</td>
                    <td className="td text-sm text-white font-medium">{leave.employee}</td>
                    <td className="td text-sm text-blue-200">{leave.type}</td>
                    <td className="td text-sm text-blue-200">{leave.start}</td>
                    <td className="td text-sm text-blue-200">{leave.end}</td>
                    <td className="td text-sm text-blue-200">{leave.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

type Ticket = {
  id: string
  created: string
  service: string
  subject: string
  priority: string
  status: string
}

function BookServiceView() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [statusFilter, setStatusFilter] = useState("All")
  const [formData, setFormData] = useState({
    service: "",
    subject: "",
    priority: "Normal",
    details: "",
  })

  useEffect(() => {
    const saved = localStorage.getItem("tickets")
    if (saved) {
      try {
        setTickets(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load tickets from localStorage")
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("tickets", JSON.stringify(tickets))
  }, [tickets])

  const filteredTickets = tickets.filter((ticket) => {
    return statusFilter === "All" || ticket.status === statusFilter
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.service || !formData.subject) return

    const newTicket: Ticket = {
      id: `TKT-${1000 + tickets.length + 1}`,
      created: new Date().toLocaleDateString(),
      service: formData.service,
      subject: formData.subject,
      priority: formData.priority,
      status: "Open",
    }

    setTickets([...tickets, newTicket])
    setFormData({ service: "", subject: "", priority: "Normal", details: "" })
  }

  function handleReset() {
    setFormData({ service: "", subject: "", priority: "Normal", details: "" })
  }

  const services = [
    "Website Support",
    "Bug fix",
    "Page build",
    "Theme tweak",
    "Performance/SEO",
    "Security patch",
    "HubSpot",
    "Workflow",
    "Custom Coded Action",
    "CRM Card/UI Extension",
    "Report/Dashboard",
    "Migration/Import",
    "API Integration",
    "Stripe/Woo sync",
  ]

  const priorities = ["Low", "Normal", "High", "Urgent"]
  const statuses = ["All", "Open", "In Progress", "Resolved", "Closed"]

  return (
    <div className="grid gap-4">
      <div className="card">
        <h2 className="text-2xl font-semibold text-white">Book a Service</h2>
        <p className="mt-1 text-sm text-blue-200">Log a request for predefined use-cases or describe a custom one</p>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_400px]">
        <div className="card">
          <h2 className="mb-4 text-xl font-semibold text-white">BOOK A SERVICE</h2>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-blue-200">Service</label>
              <select
                className="input w-full"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                required
              >
                <option value="">Select...</option>
                <optgroup label="Website">
                  <option value="Website Support">Website Support</option>
                  <option value="Bug fix">Bug fix</option>
                  <option value="Page build">Page build</option>
                  <option value="Theme tweak">Theme tweak</option>
                  <option value="Performance/SEO">Performance/SEO</option>
                  <option value="Security patch">Security patch</option>
                </optgroup>
                <optgroup label="HubSpot">
                  <option value="HubSpot">HubSpot</option>
                  <option value="Workflow">Workflow</option>
                  <option value="Custom Coded Action">Custom Coded Action</option>
                  <option value="CRM Card/UI Extension">CRM Card/UI Extension</option>
                  <option value="Report/Dashboard">Report/Dashboard</option>
                  <option value="Migration/Import">Migration/Import</option>
                </optgroup>
                <optgroup label="Integrations">
                  <option value="API Integration">API Integration</option>
                  <option value="Stripe/Woo sync">Stripe/Woo sync</option>
                </optgroup>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-blue-200">Subject</label>
              <input
                type="text"
                className="input w-full"
                placeholder="Short summary"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-blue-200">Priority</label>
              <select
                className="input w-full"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-blue-200">Details</label>
              <textarea
                className="input w-full min-h-[120px] resize-none"
                placeholder="Include URLs, steps to reproduce, expected vs actual, etc."
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary flex-1">
                Submit Ticket
              </button>
              <button type="button" onClick={handleReset} className="btn">
                Reset
              </button>
            </div>
          </form>
        </div>
        <div className="card">
          <h2 className="mb-4 text-xl font-semibold text-white">Filter</h2>
          <div className="grid gap-4">
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`btn ${statusFilter === status ? "btn-primary" : ""}`}
                >
                  {status}
                </button>
              ))}
            </div>
            <p className="text-xs text-blue-200/60">Tickets persist in your browser for demo purposes.</p>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a2446]">
                <th className="th text-left">ID</th>
                <th className="th text-left">CREATED</th>
                <th className="th text-left">SERVICE</th>
                <th className="th text-left">SUBJECT</th>
                <th className="th text-left">PRIORITY</th>
                <th className="th text-left">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="td text-center text-sm text-blue-200">
                    No tickets found.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-[#1a2446]/50">
                    <td className="td text-sm text-blue-200">{ticket.id}</td>
                    <td className="td text-sm text-blue-200">{ticket.created}</td>
                    <td className="td text-sm text-white font-medium">{ticket.service}</td>
                    <td className="td text-sm text-blue-200">{ticket.subject}</td>
                    <td className="td text-sm text-blue-200">{ticket.priority}</td>
                    <td className="td text-sm text-blue-200">{ticket.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

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
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#3ab0ff]/80 text-lg font-bold text-[#061332] shadow-[0_10px_25px_-20px_rgba(16,167,255,0.75)]">
              H
            </div>
            <span className="text-lg font-semibold text-white">Heybassh</span>
            <div className="text-sm text-blue-200">Shell / Cloud • Unified workspace</div>
          </div>
          <div className="flex items-center gap-2 px-4">
            <Link href="#" className="btn">
              BotOnly AI
            </Link>
            <Link href="#" className="btn">
              Tools
            </Link>
            <Link href="https://docs.heybassh.com" className="btn">
              Docs
            </Link>
            <button
              onClick={() => handleNavigate("service")}
              className="btn btn-gold"
            >
              Book a Service
            </button>
            <Link href="/api/auth/signout" className="btn">
              Sign out
            </Link>
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
                <p className="mt-1 text-sm text-blue-200">
                  Unified navigation, shared auth, and module slots
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {modules.map((module) => (
                  <div key={module.target} className="card relative">
                    <div className="absolute right-4 top-4">
                      <Pill>Module</Pill>
                    </div>
                    <h4 className="mb-2 pr-20 font-semibold text-white">{module.label}</h4>
                    <p className="mb-4 text-sm text-blue-200">{module.description}</p>
                    <button
                      className="btn btn-primary w-full justify-center text-xs uppercase tracking-wider"
                      onClick={() => {
                        if (module.target === "service") {
                          window.location.href = "/dashboard/service"
                        } else {
                          handleNavigate(module.target)
                        }
                      }}
                    >
                      Open
                    </button>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="card">
                  <div className="text-sm text-blue-200">Leads this week</div>
                  <div className="mt-2 text-2xl font-semibold text-white">128</div>
                </div>
                <div className="card">
                  <div className="text-sm text-blue-200">Closed Won</div>
                  <div className="mt-2 text-2xl font-semibold text-white">$12.4k</div>
                </div>
                <div className="card">
                  <div className="text-sm text-blue-200">Incidents</div>
                  <div className="mt-2 text-2xl font-semibold text-white">0</div>
                </div>
              </div>
            </div>
          ) : view === "customers_contacts" ? (
            <ContactsView />
          ) : view === "customers_support" ? (
            <CustomerServiceView />
          ) : view === "products_listing" ? (
            <ProductListingView />
          ) : view === "tasks" ? (
            <TasksView />
          ) : view === "hr" ? (
            <HRPeopleView />
          ) : view === "service" ? (
            <BookServiceView />
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
