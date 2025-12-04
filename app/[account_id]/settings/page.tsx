export default function SettingsPage({ params }: { params: { account_id: string } }) {
  return (
    <div className="min-h-screen bg-slate-100 px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-500">Configure account-wide IT and admin options.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase text-slate-500">IT / Admin</p>
          <div className="flex flex-col rounded-lg border border-slate-200 bg-white text-sm text-slate-700">
            <span className="border-b border-slate-200 px-4 py-2 font-medium">Admin</span>
            <span className="border-b border-slate-200 px-4 py-2">IT</span>
            <a
              href={`/${params.account_id}/settings/password-manager`}
              className="px-4 py-2 text-sky-700 hover:bg-sky-50 hover:text-sky-800"
            >
              Password Manager
            </a>
          </div>
        </div>

        <div className="md:col-span-2 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Password Manager</h2>
          <p className="mt-1 text-sm text-slate-500">
            Use the Password Manager item on the left to open the full vault usage report and manage settings
            linked to the Heybassh Chrome extension.
          </p>
        </div>
      </div>
    </div>
  )
}
