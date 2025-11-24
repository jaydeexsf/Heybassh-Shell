import { useState } from "react";
import { Invoice, Client, Payment, Quote, Credit, Project, Vendor, PurchaseOrder, Expense, Transaction } from "../types";

interface BillingProps {
  invoices: Invoice[];
  clients: Client[];
  payments: Payment[];
  quotes: Quote[];
  credits: Credit[];
  projects: Project[];
  vendors: Vendor[];
  purchaseOrders: PurchaseOrder[];
  expenses: Expense[];
  transactions: Transaction[];
  onAddInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  onAddClient: (client: Omit<Client, 'id'>) => void;
  onAddPayment: (payment: Omit<Payment, 'id'>) => void;
  onAddQuote: (quote: Omit<Quote, 'id'>) => void;
  onAddCredit: (credit: Omit<Credit, 'id'>) => void;
  onAddProject: (project: Omit<Project, 'id'>) => void;
  onAddVendor: (vendor: Omit<Vendor, 'id'>) => void;
  onAddPurchaseOrder: (po: Omit<PurchaseOrder, 'id'>) => void;
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export function Billing({
  invoices,
  clients,
  payments,
  quotes,
  credits,
  projects,
  vendors,
  purchaseOrders,
  expenses,
  transactions,
  onAddInvoice,
  onAddClient,
  onAddPayment,
  onAddQuote,
  onAddCredit,
  onAddProject,
  onAddVendor,
  onAddPurchaseOrder,
  onAddExpense,
  onAddTransaction,
}: BillingProps) {
  const [activeTab, setActiveTab] = useState<string>('invoices');
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Placeholder data for demonstration
  const stats = [
    { name: 'Total Revenue', value: '$124,567', change: '+12%', changeType: 'increase' },
    { name: 'Outstanding', value: '$34,567', change: '-2%', changeType: 'decrease' },
    { name: 'Overdue', value: '$8,543', change: '+5%', changeType: 'increase' },
    { name: 'Paid This Month', value: '$45,678', change: '+18%', changeType: 'increase' },
  ];

  const tabs = [
    { id: 'invoices', name: 'Invoices', count: invoices.length },
    { id: 'clients', name: 'Clients', count: clients.length },
    { id: 'payments', name: 'Payments', count: payments.length },
    { id: 'quotes', name: 'Quotes', count: quotes.length },
    { id: 'credits', name: 'Credits', count: credits.length },
    { id: 'projects', name: 'Projects', count: projects.length },
    { id: 'vendors', name: 'Vendors', count: vendors.length },
    { id: 'purchase-orders', name: 'Purchase Orders', count: purchaseOrders.length },
    { id: 'expenses', name: 'Expenses', count: expenses.length },
    { id: 'transactions', name: 'Transactions', count: transactions.length },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'invoices':
        return (
          <div className="overflow-hidden rounded-lg border border-gray-700 bg-[#1a2035] shadow">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">Invoices</h3>
                <button
                  onClick={() => setIsAdding(true)}
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  New Invoice
                </button>
              </div>
              
              {invoices.length === 0 ? (
                <div className="mt-12 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-white">No invoices</h3>
                  <p className="mt-1 text-sm text-gray-400">
                    Get started by creating a new invoice.
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => setIsAdding(true)}
                      className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <svg
                        className="-ml-1 mr-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      New Invoice
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300"
                        >
                          Invoice
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300"
                        >
                          Client
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300"
                        >
                          Due Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-300"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-300"
                        >
                          Status
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700 bg-[#1a2035]">
                      {invoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-gray-800">
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
                            {invoice.invoiceNumber}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                            {invoice.clientName}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                            {new Date(invoice.date).toLocaleDateString()}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                            {new Date(invoice.dueDate).toLocaleDateString()}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-white">
                            ${invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                invoice.status === 'paid'
                                  ? 'bg-green-100 text-green-800'
                                  : invoice.status === 'sent'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <button className="text-indigo-400 hover:text-indigo-300">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
      
      // Add cases for other tabs (clients, payments, quotes, etc.)
      default:
        return (
          <div className="rounded-lg border border-gray-700 bg-[#1a2035] p-8 text-center">
            <h3 className="text-lg font-medium text-white">{tabs.find(t => t.id === activeTab)?.name} Management</h3>
            <p className="mt-2 text-sm text-gray-400">This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Billing</h2>
        <p className="mt-1 text-sm text-gray-400">
          Manage your invoices, clients, payments, and more.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="overflow-hidden rounded-lg bg-[#1a2035] px-4 py-5 shadow sm:p-6"
          >
            <dt className="truncate text-sm font-medium text-gray-400">
              {stat.name}
            </dt>
            <dd className="mt-1 flex items-baseline">
              <p className="text-2xl font-semibold text-white">{stat.value}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-300'
              }`}
            >
              {tab.name}
              {tab.count > 0 && (
                <span
                  className={`ml-2 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    activeTab === tab.id
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full rounded-md border border-gray-700 bg-[#1a2035] py-2 pl-10 pr-3 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            placeholder={`Search ${tabs.find(t => t.id === activeTab)?.name.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-3">
          <select
            className="block w-full rounded-md border border-gray-700 bg-[#1a2035] py-2 pl-3 pr-10 text-base text-white focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            defaultValue="all"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => setIsAdding(true)}
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            New {tabs.find(t => t.id === activeTab)?.name.slice(0, -1)}
          </button>
        </div>
      </div>

      {/* Main content */}
      {renderContent()}

      {/* Add/Edit Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsAdding(false)}></div>
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
            <div className="inline-block transform overflow-hidden rounded-lg bg-[#1a2035] px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 sm:align-middle">
              <div>
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg font-medium leading-6 text-white" id="modal-title">
                    New {tabs.find(t => t.id === activeTab)?.name.slice(0, -1)}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-300">
                      Add a new {tabs.find(t => t.id === activeTab)?.name.slice(0, -1).toLowerCase()} to your account.
                    </p>
                  </div>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter name"
                      />
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                        Description
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter description"
                        defaultValue={''}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsAdding(false)}
                >
                  Create
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-700 bg-[#1a2035] px-4 py-2 text-base font-medium text-gray-300 shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
