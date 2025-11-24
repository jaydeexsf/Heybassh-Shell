"use client";

import { useState } from "react";
import { Contact } from "../../types";

interface ContactsViewProps {
  contacts: Contact[];
  onAddContact: (contact: Omit<Contact, 'id'>) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchResultClick?: (id: string) => void;
}

export function ContactsView({
  contacts,
  onAddContact,
  searchQuery,
  onSearchChange,
  onSearchResultClick
}: ContactsViewProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newContact, setNewContact] = useState<Omit<Contact, 'id'>>({ 
    name: "", 
    email: "", 
    phone: "", 
    company: "" 
  });

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    onAddContact(newContact);
    setNewContact({ name: "", email: "", phone: "", company: "" });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h2 className="text-2xl font-bold text-white">Contacts</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search contacts..."
              className="rounded-lg border border-gray-700 bg-[#1a2035] px-4 py-2 pl-10 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            {isAdding ? 'Cancel' : 'Add Contact'}
          </button>
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleAddContact} className="mb-6 rounded-lg bg-[#1a2035] p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold text-white">Add New Contact</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Name
              </label>
              <input
                type="text"
                id="name"
                required
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={newContact.name}
                onChange={(e) => setNewContact({...newContact, name: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={newContact.email}
                onChange={(e) => setNewContact({...newContact, email: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={newContact.phone}
                onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-300">
                Company
              </label>
              <input
                type="text"
                id="company"
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={newContact.company}
                onChange={(e) => setNewContact({...newContact, company: e.target.value})}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="rounded-md border border-gray-600 bg-transparent px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Add Contact
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-700 shadow">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-[#1a2035]">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                Phone
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                Company
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-[#1a2035]">
            {filteredContacts.map((contact) => (
              <tr 
                key={contact.id} 
                className="hover:bg-gray-800 cursor-pointer"
                onClick={() => onSearchResultClick?.(contact.id)}
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-medium text-white">
                        {contact.name.charAt(0)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">{contact.name}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-300">{contact.email}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-300">{contact.phone}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-300">{contact.company}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <button 
                    className="text-indigo-400 hover:text-indigo-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle edit
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
