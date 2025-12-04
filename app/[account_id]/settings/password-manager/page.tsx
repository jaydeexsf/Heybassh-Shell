import PasswordManagerApp from "@/app/components/password-manager/PasswordManagerApp"

export default function PasswordManagerSettingsPage({ params }: { params: { account_id: string } }) {
  const _accountId = params.account_id

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="border-b bg-white px-8 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex gap-3">
            <div className="flex flex-col text-xs text-slate-600">
              <span className="mb-1 font-semibold uppercase tracking-wide text-slate-500">Vault</span>
              <select className="w-40 rounded-md border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 shadow-sm focus:border-sky-500 focus:outline-none">
                <option>All Vaults</option>
              </select>
            </div>
            <div className="flex flex-col text-xs text-slate-600">
              <span className="mb-1 font-semibold uppercase tracking-wide text-slate-500">Date Range</span>
              <select className="w-40 rounded-md border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 shadow-sm focus:border-sky-500 focus:outline-none">
                <option>Last Month</option>
              </select>
            </div>
          </div>
          <button
            type="button"
            className="rounded-md border border-slate-300 bg-white px-4 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Print
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-8 py-8 space-y-8">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500" />
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">Heybassh Password Manager</h1>
                <p className="text-sm text-sky-600">
                  Usage Report
                  <span className="text-slate-500">: All vault usage for the last month</span>
                </p>
              </div>
            </div>
            <div className="text-xs text-slate-500">
              <p>
                <span className="font-semibold text-slate-700">Report by</span> Heybassh Security
              </p>
              <p className="mt-1">
                <span className="font-semibold text-slate-700">Last Sign In</span> —
              </p>
              <p className="mt-1">
                <span className="font-semibold text-slate-700">Member Since</span> —
              </p>
              <p className="mt-1">
                <span className="font-semibold text-slate-700">Status</span>{" "}
                <span className="font-semibold text-emerald-600">Active</span>
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-10 border-t border-slate-200 pt-6 md:grid-cols-2">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Usage</p>
              <div className="flex items-center gap-5">
                <div className="h-24 w-24 rounded-full border-[11px] border-sky-500 border-r-slate-200 border-b-slate-200" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">Used 25% of their items</p>
                  <p className="mt-1 text-xs text-slate-500">
                    <span className="font-semibold text-sky-600">33 used</span>
                    <span className="mx-1 text-slate-400">•</span>
                    <span className="text-slate-500">133 total</span>
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Current access</p>
              <div className="flex gap-8 text-center">
                <div>
                  <p className="text-3xl font-semibold text-slate-900">1</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">Vaults</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-slate-900">1</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">Groups</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-slate-900">—</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">Items</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Learn more about what&apos;s included in reports</p>
            <p className="mt-1 text-xs text-slate-500">
              This report uses your encrypted vault metadata from Heybassh to summarize activity across the account.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg bg-white p-4 shadow-sm text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Connect Chrome extension</p>
              <p className="mt-1">
                Install the Heybassh Password Manager Chrome extension and sign in with this account to keep
                your encrypted vault in sync between the browser and app.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Vault items</h2>
            <p className="text-xs text-slate-500">
              Manage items below – changes sync with the Chrome extension.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200">
            <PasswordManagerApp
              embedded
              headline="Heybassh Password Manager"
              description="Shared encrypted vault for this account. The Chrome extension and web app both read and write here."
            />
          </div>
        </div>
      </div>
    </div>
  )
}


