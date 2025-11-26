import { useMemo, useState, useRef, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  CheckCircleIcon,
  FunnelIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { PrimaryButton } from "../../PrimaryButton";
import { Contact, contactStatusOptions } from "../types";

type ActivityFilterValue = "all" | "7" | "30" | "stale30";

type ContactFilters = {
  owner: string;
  status: string;
  createdFrom: string;
  createdTo: string;
  activity: ActivityFilterValue;
};

type NewContactFormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  owner: string;
  createdAt: string;
  lastActivity: string;
  status: Contact["status"];
};

const activityFilters: { label: string; value: ActivityFilterValue }[] = [
  { label: "Any activity", value: "all" },
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "No activity 30+ days", value: "stale30" },
];

const statusColors: Record<Contact["status"], string> = {
  New: "border-blue-500/40 bg-blue-500/10 text-blue-200",
  "In Progress": "border-amber-500/40 bg-amber-500/10 text-amber-200",
  Customer: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
  Churned: "border-rose-500/40 bg-rose-500/10 text-rose-200",
};

const SortIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15M8.25 9L12 5.25 15.75 9" />
  </svg>
);

interface ContactsProps {
  contacts: Contact[];
  onAddContact: (contact: Omit<Contact, "id">) => void;
}

const getTodayInputValue = () => new Date().toISOString().split("T")[0];

const createInitialContact = (): NewContactFormState => ({
  name: "",
  email: "",
  phone: "",
  company: "",
  owner: "",
  createdAt: getTodayInputValue(),
  lastActivity: getTodayInputValue(),
  status: contactStatusOptions[0] ?? "New",
});

export function Contacts({ contacts, onAddContact }: ContactsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [newContact, setNewContact] = useState<NewContactFormState>(createInitialContact);
  const [filters, setFilters] = useState<ContactFilters>({
    owner: "all",
    status: "all",
    createdFrom: "",
    createdTo: "",
    activity: "all",
  });
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);
  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const filtersDropdownRef = useRef<HTMLDivElement>(null);

  const ownerOptions = useMemo(() => {
    const owners = new Set<string>();
    contacts.forEach((contact) => {
      if (contact.owner?.trim()) {
        owners.add(contact.owner.trim());
      }
    });
    return Array.from(owners).sort((a, b) => a.localeCompare(b));
  }, [contacts]);

  const normalizeDate = (value: string) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const filteredContacts = useMemo(() => {
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    return contacts.filter((contact) => {
      const matchesSearch =
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.owner.toLowerCase().includes(searchTerm.toLowerCase());

      const ownerValue = contact.owner?.trim() || "Unassigned";
      const matchesOwner =
        filters.owner === "all" ||
        (filters.owner === "unassigned" ? ownerValue === "Unassigned" : ownerValue === filters.owner);

      const matchesStatus = filters.status === "all" || contact.status === filters.status;

      const createdAtDate = normalizeDate(contact.createdAt);
      const createdFromDate = normalizeDate(filters.createdFrom);
      const createdToDate = normalizeDate(filters.createdTo);

      const matchesCreatedFrom = !createdFromDate || (createdAtDate && createdAtDate >= createdFromDate);
      const matchesCreatedTo = !createdToDate || (createdAtDate && createdAtDate <= createdToDate);

      const lastActivityDate = normalizeDate(contact.lastActivity);
      const lastActivityTime = lastActivityDate?.getTime() ?? 0;

      const matchesActivity =
        filters.activity === "all" ||
        (filters.activity === "7" && lastActivityDate && lastActivityTime >= sevenDaysAgo) ||
        (filters.activity === "30" && lastActivityDate && lastActivityTime >= thirtyDaysAgo) ||
        (filters.activity === "stale30" && (!lastActivityDate || lastActivityTime < thirtyDaysAgo));

      return (
        matchesSearch && matchesOwner && matchesStatus && matchesCreatedFrom && matchesCreatedTo && matchesActivity
      );
    });
  }, [contacts, filters, searchTerm]);

  const hasSelectedContacts = selectedContacts.size > 0;
  const allSelected = filteredContacts.length > 0 && selectedContacts.size === filteredContacts.length;
  const someSelected = selectedContacts.size > 0 && selectedContacts.size < filteredContacts.length;

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  useEffect(() => {
    setSelectedContacts((prev) => {
      const next = new Set<string>();
      contacts.forEach((contact) => {
        if (prev.has(contact.id)) {
          next.add(contact.id);
        }
      });
      return next;
    });
  }, [contacts]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
      if (filtersDropdownRef.current && !filtersDropdownRef.current.contains(event.target as Node)) {
        setFiltersOpen(false);
      }
    }

    if (moreDropdownOpen || filtersOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [moreDropdownOpen, filtersOpen]);

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedContacts(new Set());
    } else {
      setSelectedContacts(new Set(filteredContacts.map((c) => c.id)));
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

  const handleAddContact = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newContact.name.trim() || !newContact.email.trim()) return;

    const payload: Omit<Contact, "id"> = {
      name: newContact.name.trim(),
      email: newContact.email.trim(),
      phone: newContact.phone.trim(),
      company: newContact.company.trim(),
      owner: newContact.owner.trim() || "Unassigned",
      createdAt: new Date(newContact.createdAt || getTodayInputValue()).toISOString(),
      lastActivity: new Date(newContact.lastActivity || newContact.createdAt || getTodayInputValue()).toISOString(),
      status: newContact.status,
    };

    onAddContact(payload);
    setNewContact(createInitialContact());
    setIsModalOpen(false);
  };

  const handleDeleteSelected = () => {
    console.log("Delete contacts:", Array.from(selectedContacts));
    setSelectedContacts(new Set());
    setMoreDropdownOpen(false);
  };

  const handleEditSelected = () => {
    console.log("Edit contacts:", Array.from(selectedContacts));
    setMoreDropdownOpen(false);
  };

  const handleFilterChange = (key: keyof ContactFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      owner: "all",
      status: "all",
      createdFrom: "",
      createdTo: "",
      activity: "all",
    });
  };

  const formatDate = (value?: string) => {
    if (!value) return "--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "--";
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h2 className="text-2xl font-bold text-white">Contacts</h2>
        <PrimaryButton
          onClick={() => setIsModalOpen(true)}
          icon={<PlusIcon className="h-4 w-4" />}
          className="rounded-2xl px-5 py-2 text-xs font-semibold uppercase tracking-wide"
        >
          Add Contact
        </PrimaryButton>
      </div>

      {hasSelectedContacts && (
        <div className="flex flex-col gap-3 rounded-[28px] border border-[#1a2446] bg-[#0c142a] px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm text-blue-200">
              {selectedContacts.size} contact{selectedContacts.size !== 1 ? "s" : ""} selected
            </span>
            {selectedContacts.size < filteredContacts.length && (
              <button onClick={handleSelectAll} className="text-sm text-[#7ed0ff] transition-colors hover:text-white">
                Select all {filteredContacts.length} contacts
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-[20px] border border-[#1a2446] bg-[#0e1629] px-3 py-1.5 text-xs text-blue-200 transition-colors hover:bg-[#121c3d] hover:text-white">
              <UserCircleIcon className="h-4 w-4" />
              Contact Owner
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-[20px] border border-[#1a2446] bg-[#0e1629] px-3 py-1.5 text-xs text-blue-200 transition-colors hover:bg-[#121c3d] hover:text-white">
              <CalendarDaysIcon className="h-4 w-4" />
              Created Date
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-[20px] border border-[#1a2446] bg-[#0e1629] px-3 py-1.5 text-xs text-blue-200 transition-colors hover:bg-[#121c3d] hover:text-white">
              <ChartBarIcon className="h-4 w-4" />
              Activity
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-[20px] border border-[#1a2446] bg-[#0e1629] px-3 py-1.5 text-xs text-blue-200 transition-colors hover:bg-[#121c3d] hover:text-white">
              <CheckCircleIcon className="h-4 w-4" />
              Status
            </button>
            <div className="relative" ref={moreDropdownRef}>
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className="inline-flex items-center gap-1.5 rounded-[20px] border border-[#1a2446] bg-[#0e1629] px-3 py-1.5 text-xs text-blue-200 transition-colors hover:bg-[#121c3d] hover:text-white"
              >
                More
                <svg
                  className={`h-3 w-3 transition-transform ${moreDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {moreDropdownOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-[20px] border border-[#1a2446] bg-[#0e1629] shadow-lg">
                  <button
                    onClick={handleEditSelected}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-blue-200 transition-colors hover:bg-[#121c3d]"
                  >
                    <PencilIcon className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-rose-400 transition-colors hover:bg-[#121c3d]"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!hasSelectedContacts && (
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-xl" ref={filtersDropdownRef}>
            <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-300/60" />
            <input
              type="text"
              placeholder="Search contacts, owners, or companies"
              className="w-full rounded-[28px] border border-[#1a2446] bg-[#0e1629] px-4 py-2 pl-12 pr-12 text-sm text-blue-200 placeholder-blue-300/60 focus:border-[#2b9bff] focus:outline-none focus:ring-1 focus:ring-[#2b9bff]"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <button
              type="button"
              onClick={() => setFiltersOpen((prev) => !prev)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-blue-300/70 transition-colors hover:text-blue-100 ${
                filtersOpen ? "bg-[#142044]" : ""
              }`}
            >
              <FunnelIcon className="h-5 w-5" />
            </button>
            {filtersOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-full max-w-xl rounded-[28px] border border-[#1a2446] bg-[#050a1b] p-5 text-sm text-blue-100 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-xs uppercase tracking-wide text-blue-300/80">Filter contacts</p>
                  <button
                    type="button"
                    className="rounded-full p-1 text-blue-300/70 transition hover:text-white"
                    onClick={() => setFiltersOpen(false)}
                    aria-label="Close filters"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-300/70">Contact Owner</p>
                    <select
                      className="mt-2 w-full rounded-[18px] border border-[#1a2446] bg-[#0e1629] px-3 py-2 text-xs text-blue-100 focus:border-[#2b9bff] focus:outline-none"
                      value={filters.owner}
                      onChange={(event) => handleFilterChange("owner", event.target.value)}
                    >
                      <option value="all">All owners</option>
                      <option value="unassigned">Unassigned</option>
                      {ownerOptions.map((owner) => (
                        <option key={owner} value={owner}>
                          {owner}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-300/70">Created From</p>
                      <input
                        type="date"
                        className="mt-2 w-full rounded-[18px] border border-[#1a2446] bg-[#0e1629] px-3 py-2 text-xs text-blue-100 focus:border-[#2b9bff] focus:outline-none"
                        value={filters.createdFrom}
                        onChange={(event) => handleFilterChange("createdFrom", event.target.value)}
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-300/70">Created To</p>
                      <input
                        type="date"
                        className="mt-2 w-full rounded-[18px] border border-[#1a2446] bg-[#0e1629] px-3 py-2 text-xs text-blue-100 focus:border-[#2b9bff] focus:outline-none"
                        value={filters.createdTo}
                        onChange={(event) => handleFilterChange("createdTo", event.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-300/70">Activity</p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {activityFilters.map((activity) => (
                        <label
                          key={activity.value}
                          className={`cursor-pointer rounded-[18px] border px-3 py-2 text-xs font-medium transition ${
                            filters.activity === activity.value
                              ? "border-[#2b9bff] bg-[#142044] text-white"
                              : "border-[#1a2446] bg-[#0e1629] text-blue-100"
                          }`}
                        >
                          <input
                            type="radio"
                            name="activity-filter"
                            value={activity.value}
                            className="sr-only"
                            checked={filters.activity === activity.value}
                            onChange={(event) => handleFilterChange("activity", event.target.value)}
                          />
                          {activity.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-300/70">Status</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleFilterChange("status", "all")}
                        className={`rounded-[18px] border px-3 py-1.5 text-xs font-medium transition ${
                          filters.status === "all"
                            ? "border-[#2b9bff] bg-[#142044] text-white"
                            : "border-[#1a2446] bg-[#0e1629] text-blue-100"
                        }`}
                      >
                        All
                      </button>
                      {contactStatusOptions.map((status) => (
                        <button
                          type="button"
                          key={status}
                          onClick={() => handleFilterChange("status", status)}
                          className={`rounded-[18px] border px-3 py-1.5 text-xs font-medium transition ${
                            filters.status === status
                              ? "border-[#2b9bff] bg-[#142044] text-white"
                              : "border-[#1a2446] bg-[#0e1629] text-blue-100"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-blue-300">
                  <button
                    type="button"
                    className="text-[#7ed0ff] transition-colors hover:text-white"
                    onClick={handleResetFilters}
                  >
                    Reset filters
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded-[16px] border border-[#1a2446] px-4 py-1 text-blue-100 transition hover:bg-[#121c3d]"
                      onClick={() => setFiltersOpen(false)}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="rounded-[16px] bg-[#2b9bff] px-4 py-1 text-sm font-semibold text-[#041226]"
                      onClick={() => setFiltersOpen(false)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
                  className="h-4 w-4 rounded border-[#1a2446] bg-[#0e1629] text-[#2b9bff] focus:ring-[#2b9bff] min1370:-ml-5"
                />
              </th>
              <th scope="col" className="px-6 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-blue-300">Name</span>
                  <SortIcon className="h-4 w-4 text-blue-300/60" />
                  <button className="text-blue-300/60 transition hover:text-blue-300">
                    <EllipsisVerticalIcon className="h-4 w-4" />
                  </button>
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-blue-300">Email</span>
                  <SortIcon className="h-4 w-4 text-blue-300/60" />
                  <button className="text-blue-300/60 transition hover:text-blue-300">
                    <EllipsisVerticalIcon className="h-4 w-4" />
                  </button>
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-blue-300">Phone</span>
                  <SortIcon className="h-4 w-4 text-blue-300/60" />
                  <button className="text-blue-300/60 transition hover:text-blue-300">
                    <EllipsisVerticalIcon className="h-4 w-4" />
                  </button>
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-blue-300">Owner</span>
                  <SortIcon className="h-4 w-4 text-blue-300/60" />
                  <button className="text-blue-300/60 transition hover:text-blue-300">
                    <EllipsisVerticalIcon className="h-4 w-4" />
                  </button>
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-blue-300">Created</span>
                  <SortIcon className="h-4 w-4 text-blue-300/60" />
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-blue-300">Activity</span>
                  <SortIcon className="h-4 w-4 text-blue-300/60" />
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-blue-300">Status</span>
                  <SortIcon className="h-4 w-4 text-blue-300/60" />
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
                  className={`transition-colors hover:bg-[#121c3d] ${isSelected ? "bg-[#121c3d]/50" : ""}`}
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
                          {contact.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{contact.name || "--"}</div>
                        <div className="text-xs text-blue-300">{contact.company || "No company"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-blue-200">{contact.email || "--"}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-blue-200">{contact.phone || "--"}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-blue-200">{contact.owner || "Unassigned"}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-blue-200">{formatDate(contact.createdAt)}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-blue-200">{formatDate(contact.lastActivity)}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                        statusColors[contact.status] ?? "border-[#1a2446] text-blue-100"
                      }`}
                    >
                      {contact.status}
                    </span>
                  </td>
                </tr>
              );
            })}
            {!filteredContacts.length && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-sm text-blue-300">
                  {searchTerm ? `No contacts found for "${searchTerm}".` : "No contacts yet. Add one to get started."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/80 px-4 py-10 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-[32px] border border-[#1a2446] bg-[#050a1b] p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">Add Contact</h3>
                <p className="text-sm text-blue-300">Capture the basics, ownership, and lifecycle metadata.</p>
              </div>
              <button
                type="button"
                className="rounded-full p-2 text-blue-200 transition hover:bg-white/5 hover:text-white"
                onClick={() => {
                  setIsModalOpen(false);
                  setNewContact(createInitialContact());
                }}
                aria-label="Close add contact modal"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddContact} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-blue-200">
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    className="mt-2 w-full rounded-[20px] border border-[#1a2446] bg-[#0e1629] px-4 py-2 text-sm text-blue-100 placeholder-blue-300/70 focus:border-[#2b9bff] focus:outline-none"
                    value={newContact.name}
                    onChange={(event) => setNewContact((prev) => ({ ...prev, name: event.target.value }))}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-blue-200">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    className="mt-2 w-full rounded-[20px] border border-[#1a2446] bg-[#0e1629] px-4 py-2 text-sm text-blue-100 placeholder-blue-300/70 focus:border-[#2b9bff] focus:outline-none"
                    value={newContact.email}
                    onChange={(event) => setNewContact((prev) => ({ ...prev, email: event.target.value }))}
                  />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="block text-sm font-medium text-blue-200">
                    Phone
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    className="mt-2 w-full rounded-[20px] border border-[#1a2446] bg-[#0e1629] px-4 py-2 text-sm text-blue-100 placeholder-blue-300/70 focus:border-[#2b9bff] focus:outline-none"
                    value={newContact.phone}
                    onChange={(event) => setNewContact((prev) => ({ ...prev, phone: event.target.value }))}
                  />
                </div>
                <div>
                  <label htmlFor="contact-company" className="block text-sm font-medium text-blue-200">
                    Company
                  </label>
                  <input
                    id="contact-company"
                    type="text"
                    className="mt-2 w-full rounded-[20px] border border-[#1a2446] bg-[#0e1629] px-4 py-2 text-sm text-blue-100 placeholder-blue-300/70 focus:border-[#2b9bff] focus:outline-none"
                    value={newContact.company}
                    onChange={(event) => setNewContact((prev) => ({ ...prev, company: event.target.value }))}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-owner" className="block text-sm font-medium text-blue-200">
                    Contact Owner
                  </label>
                  <input
                    id="contact-owner"
                    type="text"
                    placeholder="Unassigned"
                    className="mt-2 w-full rounded-[20px] border border-[#1a2446] bg-[#0e1629] px-4 py-2 text-sm text-blue-100 placeholder-blue-300/70 focus:border-[#2b9bff] focus:outline-none"
                    value={newContact.owner}
                    onChange={(event) => setNewContact((prev) => ({ ...prev, owner: event.target.value }))}
                  />
                </div>
                <div>
                  <label htmlFor="contact-status" className="block text-sm font-medium text-blue-200">
                    Status
                  </label>
                  <select
                    id="contact-status"
                    className="mt-2 w-full rounded-[20px] border border-[#1a2446] bg-[#0e1629] px-4 py-2 text-sm text-blue-100 focus:border-[#2b9bff] focus:outline-none"
                    value={newContact.status}
                    onChange={(event) =>
                      setNewContact((prev) => ({ ...prev, status: event.target.value as Contact["status"] }))
                    }
                  >
                    {contactStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="contact-created" className="block text-sm font-medium text-blue-200">
                    Created Date
                  </label>
                  <input
                    id="contact-created"
                    type="date"
                    required
                    className="mt-2 w-full rounded-[20px] border border-[#1a2446] bg-[#0e1629] px-4 py-2 text-sm text-blue-100 focus:border-[#2b9bff] focus:outline-none"
                    value={newContact.createdAt}
                    onChange={(event) => setNewContact((prev) => ({ ...prev, createdAt: event.target.value }))}
                  />
                </div>
                <div>
                  <label htmlFor="contact-activity" className="block text-sm font-medium text-blue-200">
                    Last Activity
                  </label>
                  <input
                    id="contact-activity"
                    type="date"
                    className="mt-2 w-full rounded-[20px] border border-[#1a2446] bg-[#0e1629] px-4 py-2 text-sm text-blue-100 focus:border-[#2b9bff] focus:outline-none"
                    value={newContact.lastActivity}
                    onChange={(event) => setNewContact((prev) => ({ ...prev, lastActivity: event.target.value }))}
                  />
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setNewContact(createInitialContact());
                  }}
                  className="rounded-[20px] border border-[#1a2446] px-5 py-2 text-sm font-medium text-blue-200 transition hover:bg-[#121c3d]"
                >
                  Cancel
                </button>
                <PrimaryButton type="submit" className="rounded-2xl px-6 py-2">
                  Save Contact
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
 
 
