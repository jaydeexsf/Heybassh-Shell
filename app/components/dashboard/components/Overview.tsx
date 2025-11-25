import { Pill } from "./Pill";

interface OverviewProps {
  companyName: string;
  onNavigate: (view: string) => void;
  onRequestSupport: () => void;
}

const overviewModules = [
  {
    id: "overview_customers",
    title: "Customer Module",
    description: "Contacts, companies, deals, products & more.",
    view: "customers_contacts",
  },
  {
    id: "overview_billing",
    title: "Billing Lite Module",
    description: "Quotes, invoices, Stripe/Woo sync.",
    view: "billing",
  },
  {
    id: "overview_service",
    title: "Book a Service Module",
    description: "Log a support request or feature task.",
    view: "service",
  },
  {
    id: "overview_tasks",
    title: "Tasks Module",
    description: "Teamwork-style lists and boards.",
    view: "tasks",
  },
  {
    id: "overview_hr",
    title: "HR / People Module",
    description: "Directory, leave, onboarding.",
    view: "hr",
  },
  {
    id: "overview_admin",
    title: "IT / Admin Module",
    description: "Assets, approvals, access requests.",
    view: "admin",
  },
];

const overviewStats = [
  { id: "leads", label: "Leads this week", value: "128" },
  { id: "closed", label: "Closed Won", value: "$12.4k" },
  { id: "incidents", label: "Incidents", value: "0" },
];

export function Overview({ companyName, onNavigate, onRequestSupport }: OverviewProps) {
  return (
    <div className="grid gap-5">
      <div className="card rounded-[32px] border-[#1f2c56] bg-gradient-to-r from-[#101b38] via-[#0c142a] to-[#060b1a] p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-semibold text-white">Welcome, {companyName}</h3>
              <Pill>Module</Pill>
            </div>
            <p className="mt-2 max-w-2xl text-sm text-blue-200">
              Unified navigation, shared auth, and curated module slots so every workflow is a click away.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onRequestSupport}
              className="btn btn-gold rounded-[26px] px-4 py-2 text-xs font-semibold"
            >
              Request Support
            </button>
            <button
              onClick={() => onNavigate("customers_contacts")}
              className="btn rounded-[26px] px-4 py-2 text-xs font-semibold"
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
              onClick={() =>
                module.view === "service" ? onRequestSupport() : onNavigate(module.view)
              }
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
  );
}
