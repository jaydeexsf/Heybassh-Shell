"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AcademyIcon,
  BellIcon,
  CallsIcon,
  CreateIcon,
  InboxIcon,
  MediaIcon,
  MenuIcon,
  MeetingsIcon,
  SettingsIcon,
  navigation,
  LogoIcon,
} from "../../icons";
import { Contact } from "../../types";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface ContactsViewProps {
  contacts: Contact[];
  onAddContact: (contact: Omit<Contact, "id">) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSearchResultClick?: (id: string) => void;
  accountId?: string;
  companyName?: string;
  userName?: string;
  userEmail?: string;
  userAvatarUrl?: string | null;
}

export function ContactsView({
  contacts,
  onAddContact,
  searchQuery = "",
  onSearchChange,
  onSearchResultClick,
  accountId = "0000001",
  companyName = "Heybassh HQ",
  userName = "Johannes",
  userEmail = "johannes.moloantoa@heybassh.com",
  userAvatarUrl = null,
}: ContactsViewProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [contactSelectionMode, setContactSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [companyMenuOpen, setCompanyMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sidebarProfileMenuOpen, setSidebarProfileMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState("customers_contacts");
  const [newContact, setNewContact] = useState<Omit<Contact, "id">>({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  useEffect(() => {
    onSearchChange?.(searchTerm);
  }, [searchTerm, onSearchChange]);

  const filteredContacts = useMemo(
    () =>
      contacts.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.company.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [contacts, searchTerm],
  );

  const actionButtons = [
    { label: "Contact Owner", icon: UserCircleIcon },
    { label: "Created Date", icon: CalendarDaysIcon },
    { label: "Activity", icon: ChartBarIcon },
    { label: "Status", icon: CheckCircleIcon },
  ];

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    onAddContact(newContact);
    setNewContact({ name: "", email: "", phone: "", company: "" });
    setIsAdding(false);
  };

  const desktopGrid = sidebarCollapsed ? "md:grid-cols-[72px_minmax(0,1fr)]" : "md:grid-cols-[72px_260px_minmax(0,1fr)]";

  const renderNavItems = () =>
    navigation.map((item) => {
      const hasChildren = Boolean(item.children?.length);
      const itemActive = activeView === item.id || activeView.startsWith(`${item.id}_`);

      return (
        <div key={item.id} className="grid gap-1">
          <button
            onClick={() => {
              if (!hasChildren) setActiveView(item.id);
            }}
            className={`flex items-center justify-between rounded-[26px] border px-3 py-2 text-sm transition ${
              itemActive ? "border-[#1a2446] bg-[#111936] text-white shadow-[0_15px_35px_-25px_rgba(39,172,255,0.65)]" : "border-transparent text-blue-100 hover:bg-[#101733]"
            }`}
          >
            <span className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#121c3d] text-[#7ed0ff]">{item.icon}</span>
              {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
            </span>
            {hasChildren && !sidebarCollapsed && <span className={`text-xs transition-transform ${itemActive ? "rotate-180 text-blue-200" : "text-blue-300"}`}>▾</span>}
          </button>
          {hasChildren && itemActive && !sidebarCollapsed && (
            <div className="overflow-hidden rounded-[26px] border border-[#111936] bg-[#0d142a] transition-all">
              <div className="flex flex-col gap-1 p-2">
                {item.children!.map((child) => {
                  const childActive = activeView === child.id;
                  return (
                    <button
                      key={child.id}
                      onClick={() => setActiveView(child.id)}
                      className={`rounded-[24px] px-3 py-2 text-left text-xs font-medium transition ${
                        childActive ? "bg-[#152044] text-white shadow-[0_12px_28px_-25px_rgba(39,172,255,0.65)]" : "text-blue-200 hover:bg-[#121c3d] hover:text-white"
                      }`}
                    >
                      {child.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      );
    });

  const iconColumn = (
    <aside className="hidden md:flex h-full flex-col items-center justify-between border-r border[#1a2446] bg-[#0e1629]/95 py-4 backdrop-blur">
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
        {[CreateIcon, InboxIcon, CallsIcon, MeetingsIcon, SettingsIcon].map((Icon, index) => (
          <button key={index} className="flex h-10 w-10 items-center justify-center rounded-2xl text-[#7ed0ff] hover:bg[#121c3d] transition-colors">
            <Icon />
          </button>
        ))}
      </div>
      <div className="relative" data-dropdown>
        <button
          onClick={() => setSidebarProfileMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-transparent hover:border-[#7ed0ff] transition-colors"
          title="Profile"
        >
          {userAvatarUrl ? (
            <Image src={userAvatarUrl} alt={userName} width={40} height={40} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#5468ff] to-[#2bb9ff] flex items-center justify-center text-sm font-semibold uppercase text-white">
              {userName.charAt(0)}
            </div>
          )}
        </button>
        {sidebarProfileMenuOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-48 rounded-[20px] border border-[#1a2446] bg-[#0e1629] text-sm shadow-lg z-50 overflow-hidden" data-dropdown>
            <div className="px-4 py-3 border-b border-[#1a2446]">
              <div className="font-medium text-white">{userName}</div>
              <div className="text-xs text-blue-300 truncate">{userEmail}</div>
            </div>
            <button className="block w-full px-4 py-2.5 text-left text-blue-100 hover:bg[#121c3d]" onClick={() => setSidebarProfileMenuOpen(false)}>
              Settings
            </button>
            <button className="block w-full px-4 py-2.5 text-left text-blue-100 hover:bg[#121c3d]" onClick={() => setSidebarProfileMenuOpen(false)}>
              Log out
            </button>
          </div>
        )}
      </div>
    </aside>
  );

  const navColumn = (
    <aside className="hidden md:flex flex-col border-r border-[#1a2446] bg-[#0e1629]">
      <div className="flex h-16 items-center px-4 border-b border-[#1a2446]">
        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-white">
            <LogoIcon />
          </div>
          {!sidebarCollapsed && <span className="ml-3 text-xl font-bold text-white">Heybassh</span>}
        </div>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto px-3 py-4 space-y-2">{renderNavItems()}</div>
    </aside>
  );

  const renderContactsContent = () => {
    if (activeView !== "customers_contacts") {
      return (
        <div className="card rounded-[32px] border border-[#1a2446]/60 bg-[#070d20]/80 p-10 text-center text-blue-200 shadow-[0_25px_45px_-35px_rgba(39,172,255,0.45)]">
          <p className="text-xl font-semibold text-white">{navigation.find((item) => item.id === activeView)?.label || "Coming Soon"}</p>
          <p className="mt-2 text-sm text-blue-200/80">This area is coming soon.</p>
        </div>
      );
    }

    return (
      <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="card rounded-[32px] bg-[#070d20]/90 p-6 shadow-[0_35px_65px_-40px_rgba(0,0,0,0.75)]">
          <div className="mb-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold text-white">Contacts</h2>
                  <span className="rounded-full border border-[#1a2446] bg[#1b254b] px-2 py-1 text-xs text-[#b9c6ff]">Live Demo</span>
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
                    onChange={(event) => {
                      const enabled = event.target.checked;
                      setContactSelectionMode(enabled);
                      setSelectedIds(enabled ? contacts.map((contact) => contact.id) : []);
                    }}
                  />
                  <span>Select</span>
                </label>
                {!contactSelectionMode ? (
                  <div className="relative w-full sm:max-w-xs">
                    <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search contacts..."
                      className="w-full rounded-full border border-gray-700 bg[#1a2035] px-4 py-2 pl-10 pr-12 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                    />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:text-white focus:outline-none">
                      <FunnelIcon className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {actionButtons.map(({ label, icon: Icon }) => (
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
                onClick={() => setIsAdding((prev) => !prev)}
                className="rounded-[26px] bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#070d20]"
              >
                {isAdding ? "Cancel" : "Add Contact"}
              </button>
            </div>
          </div>

          {isAdding && (
            <form onSubmit={handleAddContact} className="mb-6 rounded-[28px] border border-[#1a2446] bg[#0e1629] p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Add New Contact</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {["name", "email", "phone", "company"].map((field) => (
                  <div key={field}>
                    <label htmlFor={field} className="block text-sm font-medium text-gray-300 capitalize">
                      {field}
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      id={field}
                      required={field === "name" || field === "email"}
                      className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={(newContact as any)[field]}
                      onChange={(event) => setNewContact((prev) => ({ ...prev, [field]: event.target.value }))}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="rounded-md border border-gray-600 bg-transparent px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#070d20]"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#070d20]">
                  Save
                </button>
              </div>
            </form>
          )}

          <div className="overflow-hidden rounded-[26px] border border-[#121a36] bg-[#09112a]">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr className="border-b border-[#1a2446] text-left text-xs font-semibold uppercase tracking-wide text-blue-300">
                  {contactSelectionMode && (
                    <th className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
                        checked={selectedIds.length === filteredContacts.length && filteredContacts.length > 0}
                        onChange={(event) => {
                          setSelectedIds(event.target.checked ? filteredContacts.map((contact) => contact.id) : []);
                        }}
                      />
                    </th>
                  )}
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Company</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => {
                  const isSelected = selectedIds.includes(contact.id);
                  return (
                    <tr key={contact.id} className="border-b border-[#1a2446]/40 last:border-b-0 transition-colors hover:bg-[#101733]">
                      {contactSelectionMode && (
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
                            checked={isSelected}
                            onChange={(event) => {
                              if (event.target.checked) {
                                setSelectedIds((prev) => [...prev, contact.id]);
                              } else {
                                setSelectedIds((prev) => prev.filter((id) => id !== contact.id));
                              }
                            }}
                          />
                        </td>
                      )}
                      <td className="px-4 py-3 text-sm text-blue-300">{contact.id}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-white">{contact.name}</td>
                      <td className="px-4 py-3 text-sm text-blue-200">{contact.email}</td>
                      <td className="px-4 py-3 text-sm text-blue-200">{contact.phone}</td>
                      <td className="px-4 py-3 text-sm text-blue-200">{contact.company}</td>
                    </tr>
                  );
                })}
                {!filteredContacts.length && (
                  <tr>
                    <td colSpan={contactSelectionMode ? 6 : 5} className="px-4 py-6 text-center text-sm text-blue-300">
                      No contacts found for “{searchTerm}”.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card rounded-[32px] bg-[#070d20]/90 p-6 shadow-[0_30px_60px_-45px_rgba(39,172,255,0.5)]">
          <h2 className="text-2xl font-semibold text-white">Add Contact</h2>
          <form className="mt-6 space-y-4" onSubmit={handleAddContact}>
            {["Full name", "Email", "Phone", "Company"].map((placeholder, index) => {
              const key = ["name", "email", "phone", "company"][index] as keyof typeof newContact;
              return (
                <div key={key} className="rounded-[28px] border border-[#1a2446] bg-[#0e1629] px-4 py-2">
                  <input
                    type={key === "email" ? "email" : "text"}
                    value={newContact[key]}
                    onChange={(event) => setNewContact((prev) => ({ ...prev, [key]: event.target.value }))}
                    placeholder={placeholder}
                    className="w-full bg-transparent text-sm text-blue-100 placeholder-blue-300/70 focus:outline-none"
                  />
                </div>
              );
            })}
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
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#020617] text-gray-100">
      <div className={`grid min-h-screen grid-cols-1 ${desktopGrid} transition-[grid-template-columns] duration-300 ease-in-out`}>
        {iconColumn}
        {!sidebarCollapsed && navColumn}
        <div className="flex flex-col">
          <header className="sticky top-0 z-10 flex min-h-[64px] items-center justify-between bg-[rgba(9,15,31,.95)] px-4 py-2 shadow backdrop-blur">
            <div className="flex flex-1 items-center gap-3">
              <button className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-300 hover:bg-[#141c33] focus:outline-none focus:ring-2 focus:ring-indigo-500 md:hidden" onClick={() => setMenuOpen(true)}>
                <span className="sr-only">Open navigation</span>
                <MenuIcon />
              </button>
              <button className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-300 hover:bg-[#141c33] focus:outline-none focus:ring-2 focus:ring-indigo-500" onClick={() => setSidebarCollapsed((prev) => !prev)}>
                <span className="sr-only">Toggle.navigation</span>
                <MenuIcon />
              </button>
              <Link href={`/${accountId}/dashboard`} className="hidden items-center gap-2 md:flex">
                <Image src="/heybasshlogo.png" alt="Heybassh" width={28} height={28} className="h-7 w-auto" />
                {!sidebarCollapsed && <span className="text-sm font-semibold text-white">Heybassh</span>}
              </Link>
              <div className="flex w-full max-w-2xl items-center justify-center md:ml-4 md:max-w-sm">
                <div className="relative w-full">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    className="block w-full rounded-md border border-gray-700 bg-[#1a2035] py-2 pl-10 pr-3 text-white placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:text-gray-900 focus:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Search"
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center gap-2">
              <Link href="#" className="inline-flex items-center gap-1.5 rounded-[20px] border border-[#1a2446] px-3 py-1.5 text-xs text-blue-200 hover:bg-[#0e1629] hover:text-white">
                BotOnly AI
              </Link>
              <Link href="#" className="inline-flex items-center gap-1.5 rounded-[20px] border border-[#1a2446] px-3 py-1.5 text-xs text-blue-200 hover:bg-[#0e1629] hover:text-white">
                Tools
              </Link>
              <button className="inline-flex h-8 w-8 items-center justify-center rounded-[20px] border border-[#1a2446] text-blue-200 hover:bg-[#0e1629] hover:text-white">
                <AcademyIcon />
              </button>
              <button className="inline-flex h-8 w-8 items-center justify-center rounded-[20px] border border-[#1a2446] text-blue-200 hover:bg-[#0e1629] hover:text-white">
                <MediaIcon />
              </button>
              <button className="relative inline-flex h-8 w-8.items-center justify-center rounded-[20px] border border-[#1a2446] text-blue-200 hover:bg-[#0e1629] hover:text-white">
                <BellIcon />
                <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-red-500"></span>
              </button>
              <Link
                href={`/${accountId}/dashboard/service`}
                className="inline-flex items-center gap-1.5 rounded-[20px] border border-[#d4a017] bg-gradient-to-r from[#FFD54A] to[#FFC107] px-3 py-1.5 text-xs font-medium text-[#031226] hover:brightness-110"
              >
                Book a Service
              </Link>
              <div className="relative inline-flex items-center gap-1.5" data-dropdown>
                <button
                  onClick={() => setCompanyMenuOpen((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 rounded-[20px] px-2 py-1 text-xs text-blue-200 hover:bg-[#0e1629] hover:text-white"
                >
                  <span className="truncate max-w-[120px]">{companyName}</span>
                  <span className="text-[10px]">▾</span>
                </button>
                {companyMenuOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-44 rounded-[20px] border border-[#1a2446] bg-[#0e1629] text-xs shadow-lg z-50 py-1">
                    <button className="block w-full px-3 py-1.5 text-blue-100 hover:bg-[#121c3d]" onClick={() => setCompanyMenuOpen(false)}>
                      Company Profile
                    </button>
                    <button className="block w-full px-3 py-1.5 text-blue-100 hover.bg-[#121c3d]" onClick={() => setCompanyMenuOpen(false)}>
                      Account
                    </button>
                  </div>
                )}
              </div>
              <div className="relative ml-3">
                <button
                  type="button"
                  className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                >
                  <span className="sr-only">Open user menu</span>
                  {userAvatarUrl ? (
                    <Image className="h-8 w-8 rounded-full" src={userAvatarUrl} alt={userName} width={32} height={32} />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white">{userName.charAt(0)}</div>
                  )}
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg.white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100" onClick={() => setUserMenuOpen(false)}>
                      Your Profile
                    </button>
                    <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100" onClick={() => setUserMenuOpen(false)}>
                      Settings
                    </button>
                    <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100" onClick={() => setUserMenuOpen(false)}>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>
          <div className="h-px bg-[#1a2446]/50"></div>
          <main className="flex-1 bg-[#020617] px-4 py-6">{renderContactsContent()}</main>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black/60" onClick={() => setMenuOpen(false)}></div>
          <div className="relative flex w-72 max-w-xs flex-1 flex-col bg-[#0f172a] pt-5">
            <div className="flex h-16 flex-shrink-0 items-center px-4">
              <div className="flex items-center">
                <div className="flex h-8 w-8.items-center justify-center rounded-md bg-indigo-600 text-white">
                  <LogoIcon />
                </div>
                <span className="ml-3 text-xl font-bold text-white">Heybassh</span>
              </div>
              <button type="button" className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" onClick={() => setMenuOpen(false)}>
                <span className="sr-only">Close sidebar</span>
                ✕
              </button>
            </div>
            <div className="mt-5 h-0 flex-1 overflow-y-auto px-3 py-2 space-y-2">{renderNavItems()}</div>
          </div>
        </div>
      )}
    </div>
  );
}

