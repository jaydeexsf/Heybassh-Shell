"use client"

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

// Types and constants
import {
  NavItem,
  Contact,
  Product,
  Task,
  Employee,
  LeaveRequest,
  Invoice,
  Client,
  Payment,
  Quote,
  Credit,
  Project,
  Vendor,
  PurchaseOrder,
  Expense,
  Transaction,
  FrontOfficeApp,
  defaultContacts,
  defaultProducts,
  defaultEmployees,
  defaultLeaveRequests,
  priorityOptions,
  statusOptions,
  SEARCH_SELECTION_KEY,
} from "./types";

// Icons
import { 
  navigation,
  MenuIcon,
  OverviewIcon,
  UsersIcon,
  BoxIcon,
  CardIcon,
  TasksIcon,
  ReportsIcon,
  AutomateIcon,
  PeopleIcon,
  ShieldIcon,
  BriefcaseIcon,
  BuildingIcon,
  LogoIcon,
  CreateIcon,
  InboxIcon,
  CallsIcon,
  MeetingsIcon,
  SettingsIcon,
  SearchIcon,
  AcademyIcon,
  MediaIcon,
  BellIcon,
  FrontOfficeIcon
} from "./icons";

// Components
import { Overview } from "./components/Overview";
import { Contacts } from "./components/Contacts";
import { Products } from "./components/Products";
import { Tasks } from "./components/Tasks";
import { HRPeople } from "./components/HRPeople";
import { Billing } from "./components/Billing";
import { Reports } from "./components/Reports";
import { Automate } from "./components/Automate";
import { FrontOfficeApps } from "./components/FrontOfficeApps";
import { Pill } from "./components/Pill";

const PlaceholderTab = ({ name }: { name: string }) => (
  <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed border-gray-700">
    <div className="text-center">
      <h3 className="text-lg font-medium text-white">{name} Dashboard</h3>
      <p className="mt-1 text-sm text-gray-400">This section is under development.</p>
    </div>
  </div>
);

// Helper functions
const findNavLabel = (items: NavItem[], id: string): string => {
  for (const item of items) {
    if (item.id === id) return item.label;
    if (item.children) {
      const child = item.children.find((child) => child.id === id);
      if (child) return child.label;
    }
  }
  return id.replace(/_/g, " ");
};

const viewToPath = (view: string): string | null => {
  if (view === "overview") return "dashboard";
  if (view === "customers_contacts") return "contacts";
  if (view === "customers_companies") return "companies";
  if (view === "products_listing") return "products";
  return null;
};

const nameMatchesTokens = (name: string, query: string) => {
  const toTokens = (s: string) => s.toLowerCase().split(/[\s\-]+/).filter(Boolean);
  const nameTokens = toTokens(name);
  const queryTokens = toTokens(query);
  if (!queryTokens.length) return true;
  return queryTokens.every((qt) => nameTokens.some((nt) => nt.includes(qt)));
};

export default function AccountDashboard({ 
  accountId, 
  initialViewKey = "overview" 
}: { 
  accountId: string; 
  initialViewKey?: string 
}) {
  const router = useRouter();
  const [view, setView] = useState(initialViewKey);
  const [companyName, setCompanyName] = useState<string>(accountId);
  const [menuOpen, setMenuOpen] = useState(false);
  const [companyMenuOpen, setCompanyMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sidebarProfileMenuOpen, setSidebarProfileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // State for different modules
  const [contacts, setContacts] = useState<Contact[]>(defaultContacts);
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>(defaultEmployees);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(defaultLeaveRequests);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [credits, setCredits] = useState<Credit[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [frontOfficeApps, setFrontOfficeApps] = useState<FrontOfficeApp[]>([]);
  
  // Search and navigation state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPreviewOpen, setSearchPreviewOpen] = useState(false);
  const [searchPreviewSelection, setSearchPreviewSelection] = useState<string | null>(null);
  const [searchTransitioning, setSearchTransitioning] = useState(false);
  const searchLoaderTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const { data: session } = useSession();
  const userName = session?.user?.name || session?.user?.email || "User";
  const userEmail = session?.user?.email || "";
  const userImage = typeof session?.user?.image === "string" ? session.user.image : null;
  const userInitial = userName.trim().charAt(0).toUpperCase() || "U";

  // Handle view changes
  const handleViewChange = (newView: string) => {
    setView(newView);
    const path = viewToPath(newView);
    if (path) {
      router.push(`/${accountId}/${path}`);
    }
    setMenuOpen(false);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSearchPreviewOpen(!!query);
    
    if (searchLoaderTimeout.current) {
      clearTimeout(searchLoaderTimeout.current);
    }
    
    if (query) {
      setSearchTransitioning(true);
      searchLoaderTimeout.current = setTimeout(() => {
        setSearchTransitioning(false);
      }, 300);
    }
  };

  // Handle search selection
  const handleSearchSelect = (item: string) => {
    setSearchQuery(item);
    setSearchPreviewOpen(false);
    // Here you would typically navigate to the selected item
    console.log("Selected:", item);
  };

  // Handle sign out
  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  // Handle adding a new contact
  const handleAddContact = (contact: Omit<Contact, 'id'>) => {
    const newContact: Contact = {
      ...contact,
      id: `C-${Date.now()}`,
    };
    setContacts([...contacts, newContact]);
  };

  // Handle adding a new product
  const handleAddProduct = (product: Omit<Product, 'sku'>) => {
    const newProduct: Product = {
      ...product,
      sku: `P-${Date.now().toString().slice(-6)}`,
    };
    setProducts([...products, newProduct]);
  };

  // Handle adding a new task
  const handleAddTask = (task: Omit<Task, 'id' | 'tags'>) => {
    const newTask: Task = {
      ...task,
      id: `T-${Date.now()}`,
      tags: [],
    };
    setTasks([...tasks, newTask]);
  };

  // Handle adding a new employee
  const handleAddEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      ...employee,
      id: `E-${Date.now()}`,
    };
    setEmployees([...employees, newEmployee]);
  };

  // Handle adding a new leave request
  const handleAddLeaveRequest = (request: Omit<LeaveRequest, 'id' | 'status' | 'employeeName'>) => {
    const employee = employees.find(e => e.id === request.employeeId);
    const newLeaveRequest: LeaveRequest = {
      ...request,
      id: `L-${Date.now()}`,
      status: 'Pending',
      employeeName: employee?.name || 'Unknown',
    };
    setLeaveRequests([...leaveRequests, newLeaveRequest]);
  };

  const handleAddInvoice = (invoice: Omit<Invoice, 'id'>) => {
    setInvoices((prev) => [...prev, { ...invoice, id: `INV-${Date.now()}` }]);
  };

  const handleAddClient = (client: Omit<Client, 'id'>) => {
    setClients((prev) => [...prev, { ...client, id: `CL-${Date.now()}` }]);
  };

  const handleAddPayment = (payment: Omit<Payment, 'id'>) => {
    setPayments((prev) => [...prev, { ...payment, id: `PAY-${Date.now()}` }]);
  };

  const handleAddQuote = (quote: Omit<Quote, 'id'>) => {
    setQuotes((prev) => [...prev, { ...quote, id: `QUO-${Date.now()}` }]);
  };

  const handleAddCredit = (credit: Omit<Credit, 'id'>) => {
    setCredits((prev) => [...prev, { ...credit, id: `CR-${Date.now()}` }]);
  };

  const handleAddProject = (project: Omit<Project, 'id'>) => {
    setProjects((prev) => [...prev, { ...project, id: `PRJ-${Date.now()}` }]);
  };

  const handleAddVendor = (vendor: Omit<Vendor, 'id'>) => {
    setVendors((prev) => [...prev, { ...vendor, id: `VEN-${Date.now()}` }]);
  };

  const handleAddPurchaseOrder = (po: Omit<PurchaseOrder, 'id'>) => {
    setPurchaseOrders((prev) => [...prev, { ...po, id: `PO-${Date.now()}` }]);
  };

  const handleAddExpense = (expense: Omit<Expense, 'id'>) => {
    setExpenses((prev) => [...prev, { ...expense, id: `EXP-${Date.now()}` }]);
  };

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    setTransactions((prev) => [...prev, { ...transaction, id: `TRX-${Date.now()}` }]);
  };

  const handleAddFrontOfficeApp = (app: Omit<FrontOfficeApp, 'id'>) => {
    setFrontOfficeApps((prev) => [...prev, { ...app, id: `APP-${Date.now()}` }]);
  };

  // Handle updating leave request status
  const handleUpdateLeaveStatus = (id: string, status: LeaveRequest['status']) => {
    setLeaveRequests(leaveRequests.map(request => 
      request.id === id ? { ...request, status } : request
    ));
  };

  // Render the appropriate view based on the current view state
  const renderView = () => {
    switch (view) {
      case "overview":
        return <Overview companyName={companyName} />
      case "customers_contacts":
        return <Contacts contacts={contacts} onAddContact={handleAddContact} />
      case "products_listing":
        return <Products products={products} onAddProduct={handleAddProduct} />
      case "tasks":
        return <Tasks tasks={tasks} onAddTask={handleAddTask} employees={employees} />
      case "hr":
        return (
          <HRPeople
            employees={employees}
            leaveRequests={leaveRequests}
            onAddEmployee={handleAddEmployee}
            onAddLeaveRequest={handleAddLeaveRequest}
            onUpdateLeaveStatus={handleUpdateLeaveStatus}
          />
        )
      case "billing":
        return (
          <Billing
            invoices={invoices}
            clients={clients}
            payments={payments}
            quotes={quotes}
            credits={credits}
            projects={projects}
            vendors={vendors}
            purchaseOrders={purchaseOrders}
            expenses={expenses}
            transactions={transactions}
            onAddInvoice={handleAddInvoice}
            onAddClient={handleAddClient}
            onAddPayment={handleAddPayment}
            onAddQuote={handleAddQuote}
            onAddCredit={handleAddCredit}
            onAddProject={handleAddProject}
            onAddVendor={handleAddVendor}
            onAddPurchaseOrder={handleAddPurchaseOrder}
            onAddExpense={handleAddExpense}
            onAddTransaction={handleAddTransaction}
          />
        )
      case "reports":
        return <Reports />
      case "automate":
        return <Automate />
      case "front_office":
      case "front_office_website":
      case "front_office_portal":
      case "front_office_mobile":
      case "front_office_live_chat":
      case "front_office_help_desk":
      case "front_office_survey":
        return <FrontOfficeApps apps={frontOfficeApps} onAddApp={handleAddFrontOfficeApp} />
      case "admin":
        return <PlaceholderTab name="Admin" />
      case "finance":
        return <PlaceholderTab name="Finance" />
      case "executive":
        return <PlaceholderTab name="Executive" />
      default:
        return <PlaceholderTab name={findNavLabel(navigation, view)} />
    }
  }

  // Render navigation items
  const renderNavItems = (items: NavItem[], level = 0) => {
    return items.map((item) => (
      <div key={item.id}>
        <button
          onClick={() => handleViewChange(item.id)}
          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
            view === item.id
              ? 'bg-indigo-600 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          } ${level > 0 ? 'pl-8' : ''}`}
        >
          <div className="flex items-center">
            <span className="mr-3">{item.icon}</span>
            {!sidebarCollapsed && <span>{item.label}</span>}
          </div>
          {item.children && !sidebarCollapsed && (
            <svg
              className={`h-4 w-4 transform transition-transform ${
                view.startsWith(item.id) ? 'rotate-90' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
        {item.children && view.startsWith(item.id) && !sidebarCollapsed && (
          <div className="mt-1 space-y-1">
            {renderNavItems(
              item.children.map((child) => ({
                ...child,
                icon: <span className="h-5 w-5" />,
              })),
              level + 1
            )}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 flex md:hidden ${
          menuOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMenuOpen(false)}></div>
        <div className="relative flex w-72 max-w-xs flex-1 flex-col bg-[#0f172a] pt-5">
          <div className="flex h-16 flex-shrink-0 items-center px-4">
            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-white">
                <LogoIcon />
              </div>
              <span className="ml-3 text-xl font-bold text-white">Heybassh</span>
            </div>
            <button
              type="button"
              className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setMenuOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-5 h-0 flex-1 overflow-y-auto">
            <nav className="space-y-1 px-2">
              {renderNavItems(navigation)}
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t border-gray-700 p-4">
            <div className="relative w-full" data-dropdown>
              <button
                className="flex w-full items-center justify-between rounded-2xl border border-transparent px-2 py-1 text-left text-sm text-white hover:border-[#1a2446]"
                onClick={() => setSidebarProfileMenuOpen((prev) => !prev)}
              >
                <div className="flex items-center gap-3">
                  {userImage ? (
                    <Image
                      className="inline-block h-9 w-9 rounded-full"
                      src={userImage}
                      alt="User profile"
                      width={36}
                      height={36}
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white">
                      {userInitial}
                    </div>
                  )}
                  <span className="text-sm font-semibold text-white">Account</span>
                </div>
                <span className="text-xs text-blue-200">▾</span>
              </button>
              {sidebarProfileMenuOpen && (
                <div className="absolute bottom-full left-0 mb-3 w-56 rounded-2xl border border-[#1a2446] bg-[#0e1629] p-3 shadow-xl">
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-white">{userName}</p>
                    <p className="text-xs text-blue-200">{userEmail}</p>
                  </div>
                  <div className="flex flex-col gap-2 text-sm text-blue-100">
                    <Link
                      href="/settings"
                      className="rounded-lg px-3 py-2 hover:bg-[#131d3a]"
                      onClick={() => setSidebarProfileMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      className="rounded-lg px-3 py-2 text-left hover:bg-[#131d3a]"
                      onClick={() => {
                        setSidebarProfileMenuOpen(false);
                        handleSignOut();
                      }}
                    >
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-[#0f172a]">
          <div className="flex h-16 flex-shrink-0 items-center px-4">
            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-white">
                <LogoIcon />
              </div>
              {!sidebarCollapsed && (
                <span className="ml-3 text-xl font-bold text-white">Heybassh</span>
              )}
            </div>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto pt-5">
            <nav className="flex-1 space-y-1 px-2">
              {renderNavItems(navigation)}
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t border-gray-700 p-4">
            <div className="relative w-full" data-dropdown>
              <button
                className="flex w-full items-center justify-between rounded-2xl border border-transparent px-2 py-1 text-left text-sm text-white hover:border-[#1a2446]"
                onClick={() => setSidebarProfileMenuOpen((prev) => !prev)}
              >
                <div className="flex items-center gap-3">
                  {userImage ? (
                    <Image
                      className="inline-block h-9 w-9 rounded-full"
                      src={userImage}
                      alt="User profile"
                      width={36}
                      height={36}
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white">
                      {userInitial}
                    </div>
                  )}
                  {!sidebarCollapsed && <span className="text-sm font-semibold text-white">Account</span>}
                </div>
                <span className="text-xs text-blue-200">▾</span>
              </button>
              {sidebarProfileMenuOpen && (
                <div className="absolute right-0 top-auto mt-3 w-56 rounded-2xl border border-[#1a2446] bg-[#0e1629] p-3 shadow-xl">
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-white">{userName}</p>
                    <p className="text-xs text-blue-200">{userEmail}</p>
                  </div>
                  <div className="flex flex-col gap-2 text-sm text-blue-100">
                    <Link
                      href="/settings"
                      className="rounded-lg px-3 py-2 hover:bg-[#131d3a]"
                      onClick={() => setSidebarProfileMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      className="rounded-lg px-3 py-2 text-left hover:bg-[#131d3a]"
                      onClick={() => {
                        setSidebarProfileMenuOpen(false);
                        handleSignOut();
                      }}
                    >
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col md:pl-64">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-[#0f172a] shadow">
          <div className="flex flex-1 items-center justify-between px-4">
            <div className="flex flex-1 items-center gap-3">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-300 hover:bg-[#141c33] focus:outline-none focus:ring-2 focus:ring-indigo-500 md:hidden"
                onClick={() => setMenuOpen(true)}
              >
                <span className="sr-only">Open navigation</span>
                <MenuIcon />
              </button>
              <button
                type="button"
                className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-300 hover:bg-[#141c33] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={() => setSidebarCollapsed((prev) => !prev)}
                aria-pressed={sidebarCollapsed}
              >
                <span className="sr-only">Toggle navigation</span>
                <MenuIcon />
              </button>
              <Link href={`/${accountId}/dashboard`} className="hidden items-center gap-2 md:flex">
                <Image src="/heybasshlogo.png" alt="Heybassh" width={28} height={28} className="h-7 w-auto" />
                {!sidebarCollapsed && <span className="text-sm font-semibold text-white">Heybassh</span>}
              </Link>
              <div className="flex w-full max-w-2xl items-center justify-center md:ml-4 md:max-w-xs">
                <div className="relative w-full">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <SearchIcon />
                  </div>
                  <input
                    id="search"
                    name="search"
                    className="block w-full rounded-md border border-gray-700 bg-[#1a2035] py-2 pl-10 pr-3 text-white placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:text-gray-900 focus:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => searchQuery && setSearchPreviewOpen(true)}
                    onBlur={() => {
                      // Small delay to allow clicking on search results
                      setTimeout(() => setSearchPreviewOpen(false), 200);
                    }}
                  />
                  {searchPreviewOpen && (
                    <div className="absolute left-0 right-0 z-10 mt-1 max-h-96 overflow-auto rounded-md bg-white py-1 shadow-lg">
                      {searchTransitioning ? (
                        <div className="py-2 px-4 text-sm text-gray-500">Searching...</div>
                      ) : searchQuery ? (
                        <div>
                          {[
                            { id: '1', name: 'Search result 1' },
                            { id: '2', name: 'Search result 2' },
                            { id: '3', name: 'Search result 3' },
                          ]
                            .filter((item) =>
                              item.name.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((item) => (
                              <div
                                key={item.id}
                                className={`cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100 ${
                                  searchPreviewSelection === item.id ? 'bg-indigo-50' : ''
                                }`}
                                onClick={() => handleSearchSelect(item.name)}
                              >
                                {item.name}
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="py-2 px-4 text-sm text-gray-500">
                          Type to search...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button
                type="button"
                className="rounded-full bg-[#1a2035] p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon />
              </button>

              {/* Profile dropdown */}
              <div className="relative ml-3">
                <div>
                  <button
                    type="button"
                    className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    id="user-menu"
                    aria-expanded="false"
                    aria-haspopup="true"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    {userImage ? (
                      <Image
                        className="h-8 w-8 rounded-full"
                        src={userImage}
                        alt="User profile"
                        width={32}
                        height={32}
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white">
                        {userInitial}
                      </div>
                    )}
                  </button>
                </div>
                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                  >
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleSignOut();
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-white">
              {findNavLabel(navigation, view)}
            </h1>
          </div>
          <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}

