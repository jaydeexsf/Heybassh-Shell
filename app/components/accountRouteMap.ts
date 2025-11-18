const routeEntries = [
  { view: "overview", path: "dashboard" },
  { view: "customers_contacts", path: "contacts" },
  { view: "customers_companies", path: "companies" },
  { view: "customers_deals", path: "deals" },
  { view: "customers_sales", path: "sales" },
  { view: "customers_marketing", path: "marketing" },
  { view: "customers_support", path: "customer-service" },
  { view: "products_listing", path: "products" },
  { view: "products_inventory", path: "inventory" },
  { view: "products_supply", path: "supply" },
  { view: "billing", path: "billing" },
  { view: "tasks", path: "tasks" },
  { view: "reports", path: "reports" },
  { view: "automate", path: "automate" },
  { view: "hr", path: "people" },
  { view: "admin", path: "admin" },
  { view: "finance", path: "finance" },
  { view: "executive", path: "executive" },
  { view: "service", path: "service" },
]

const viewToPathMap = routeEntries.reduce<Record<string, string>>(
  (acc, entry) => ({ ...acc, [entry.view]: entry.path }),
  {}
)

const pathToViewMap = routeEntries.reduce<Record<string, string>>(
  (acc, entry) => ({ ...acc, [entry.path]: entry.view }),
  {}
)

export function getPathForView(viewKey: string) {
  return viewToPathMap[viewKey] ?? viewKey
}

export function getViewForPath(path: string | undefined) {
  if (!path) return "overview"
  return pathToViewMap[path] ?? path
}

