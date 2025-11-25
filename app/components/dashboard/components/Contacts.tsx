import { useMemo, useState, useRef, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  LockClosedIcon,
  ArrowRightIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { Contact } from "../types";

// Simple sorting icon (up/down arrows)
const SortIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15M8.25 9L12 5.25 15.75 9" />
  </svg>
);

interface ContactsProps {
  contacts: Contact[];
  onAddContact: (contact: Omit<Contact, 'id'>) => void;
}

export function Contacts({ contacts, onAddContact }: ContactsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [newContact, setNewContact] = useState<Omit<Contact, 'id'>>({ 
    name: "", 
    email: "", 
    phone: "", 
    company: "" 
  });
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

  const filteredContacts = useMemo(() => (
    contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ), [contacts, searchTerm]);

  const hasSelectedContacts = selectedContacts.size > 0;
  const allSelected = filteredContacts.length > 0 && selectedContacts.size === filteredContacts.length;
  const someSelected = selectedContacts.size > 0 && selectedContacts.size < filteredContacts.length;

  // Set indeterminate state for select all checkbox
  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedContacts(new Set());
    } else {
      setSelectedContacts(new Set(filteredContacts.map(c => c.id)));
    }
  };

  const handleSelectContact = (contactId: string) => {
    const newSelected = new Set(selectedContacts);
    if (newSelected.has(contactId)) {
      newSelected.delete(contactId);
    } else {
      newSelected.add(contactId);
    }
    setSelectedContacts(newSelected);
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    onAddContact(newContact);
    setNewContact({ name: "", email: "", phone: "", company: "" });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h2 className="text-2xl font-bold text-white">Contacts</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-[26px] bg-[#2b9bff] px-4 py-2 text-sm font-semibold text-[#041226] transition hover:brightness-110"
        >
          {isAdding ? 'Cancel' : 'Add Contact'}
        </button>
      </div>

      {/* Selection Bar - Shows when contacts are selected */}
      {hasSelectedContacts && (
        <div className="flex items-center justify-between rounded-[28px] border border-[#1a2446] bg-[#0c142a] px-4 py-3">
          <div className="flex items-center gap-4">
            <span className="text-sm text-blue-200">
              {selectedContacts.size} contact{selectedContacts.size !== 1 ? 's' : ''} selected
            </span>
            {selectedContacts.size < filteredContacts.length && (
              <button
                onClick={handleSelectAll}
                className="text-sm text-[#7ed0ff] hover:text-white transition-colors"
              >
                Select all {filteredContacts.length} contacts
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-[20px] border border-[#1a2446] bg-[#0e1629] px-3 py-1.5 text-xs text-blue-200 hover:text-white hover:bg-[#121c3d] transition-colors">
              <LockClosedIcon className="h-4 w-4" />
              Enrich records
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-[20px] border border-[#1a2446] bg-[#0e1629] px-3 py-1.5 text-xs text-blue-200 hover:text-white hover:bg-[#121c3d] transition-colors">
              <LockClosedIcon className="h-4 w-4" />
              Fill smart properties
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-[20px] border border-[#1a2446] bg-[#0e1629] px-3 py-1.5 text-xs text-blue-200 hover:text-white hover:bg-[#121c3d] transition-colors">
              <ArrowRightIcon className="h-4 w-4" />
              Assign
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-[20px] border border-[#1a2446] bg-[#0e1629] px-3 py-1.5 text-xs text-blue-200 hover:text-white hover:bg-[#121c3d] transition-colors">
              More
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Search and Controls - Only shows when no contacts selected */}
      {!hasSelectedContacts && (
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-300/60" />
            <input
              type="text"
              placeholder="Search"
              className="w-full rounded-[28px] border border-[#1a2446] bg-[#0e1629] px-4 py-2 pl-10 pr-4 text-sm text-blue-200 placeholder-blue-300/60 focus:border-[#2b9bff] focus:outline-none focus:ring-1 focus:ring-[#2b9bff]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Add Contact Form */}
      {isAdding && (
        <form onSubmit={handleAddContact} className="rounded-[32px] border border-[#1a2446] bg-[#070d20] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Add New Contact</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-blue-200">
                Name
              </label>
              <input
                type="text"
                id="name"
                required
                className="mt-1 block w-full rounded-[28px] border border-[#1a2446] bg-[#0e1629] px-4 py-2 text-sm text-blue-100 placeholder-blue-300/70 focus:border-[#2b9bff] focus:outline-none"
                value={newContact.name}
                onChange={(e) => setNewContact({...newContact, name: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blue-200">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                className="mt-1 block w-full rounded-[28px] border border-[#1a2446] bg-[#0e1629] px-4 py-2 text-sm text-blue-100 placeholder-blue-300/70 focus:border-[#2b9bff] focus:outline-none"
                value={newContact.email}
                onChange={(e) => setNewContact({...newContact, email: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-blue-200">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                className="mt-1 block w-full rounded-[28px] border border-[#1a2446] bg-[#0e1629] px-4 py-2 text-sm text-blue-100 placeholder-blue-300/70 focus:border-[#2b9bff] focus:outline-none"
                value={newContact.phone}
                onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-blue-200">
                Company
              </label>
              <input
                type="text"
                id="company"
                className="mt-1 block w-full rounded-[28px] border border-[#1a2446] bg-[#0e1629] px-4 py-2 text-sm text-blue-100 placeholder-blue-300/70 focus:border-[#2b9bff] focus:outline-none"
                value={newContact.company}
                onChange={(e) => setNewContact({...newContact, company: e.target.value})}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="rounded-[28px] border border-[#1a2446] bg-transparent px-4 py-2 text-sm font-medium text-blue-200 hover:bg-[#121c3d] focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-[28px] bg-gradient-to-r from-[#31b0ff] to-[#66d6ff] px-4 py-2 text-sm font-semibold text-[#041226] transition hover:brightness-110"
            >
              Add Contact
            </button>
          </div>
        </form>
      )}

      {/* Contacts Table */}
      <div className="overflow-hidden rounded-[28px] border border-[#1a2446] bg-[#0c142a]">
        <table className="min-w-full divide-y divide-[#1a2446]">
          <thead className="bg-[#0e1629]">
            <tr>
              <th scope="col" className="px-6 py-3">
                <input
                  type="checkbox"
                  ref={selectAllCheckboxRef}
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-[#1a2446] bg-[#0e1629] text-[#2b9bff] focus:ring-[#2b9bff]"
                />
              </th>
              <th scope="col" className="px-6 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-blue-300">NAME</span>
                  <SortIcon className="h-4 w-4 text-blue-300/60" />
                  <button className="text-blue-300/60 hover:text-blue-300">
                    <EllipsisVerticalIcon className="h-4 w-4" />
                  </button>
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-blue-300">EMAIL</span>
                  <SortIcon className="h-4 w-4 text-blue-300/60" />
                  <button className="text-blue-300/60 hover:text-blue-300">
                    <EllipsisVerticalIcon className="h-4 w-4" />
                  </button>
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-blue-300">PHONE NUMBER</span>
                  <SortIcon className="h-4 w-4 text-blue-300/60" />
                  <button className="text-blue-300/60 hover:text-blue-300">
                    <EllipsisVerticalIcon className="h-4 w-4" />
                  </button>
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-blue-300">CONTACT OWNER</span>
                  <SortIcon className="h-4 w-4 text-blue-300/60" />
                  <button className="text-blue-300/60 hover:text-blue-300">
                    <EllipsisVerticalIcon className="h-4 w-4" />
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a2446] bg-[#0c142a]">
            {filteredContacts.map((contact) => {
              const isSelected = selectedContacts.has(contact.id);
              return (
                <tr 
                  key={contact.id} 
                  className={`hover:bg-[#121c3d] transition-colors ${isSelected ? 'bg-[#121c3d]/50' : ''}`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectContact(contact.id)}
                      className="h-4 w-4 rounded border-[#1a2446] bg-[#0e1629] text-[#2b9bff] focus:ring-[#2b9bff]"
                    />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 flex-shrink-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#5468ff] to-[#2bb9ff] text-xs font-semibold text-white">
                          {contact.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="text-sm font-medium text-white">{contact.name || '--'}</div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-blue-200">{contact.email || '--'}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-blue-200">{contact.phone || '--'}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-blue-200">No owner</div>
                  </td>
                </tr>
              );
            })}
            {!filteredContacts.length && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-blue-300">
                  {searchTerm ? `No contacts found for "${searchTerm}".` : "No contacts available."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
