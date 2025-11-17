export default function SettingsPage({ params }: { params: { account_id: string } }) {
  return (
    <div className="min-h-screen p-6 text-white">
      <h1 className="text-2xl font-semibold">Settings for {params.account_id}</h1>
      <p className="text-blue-200 mt-2">Placeholder settings page.</p>
    </div>
  )
}
