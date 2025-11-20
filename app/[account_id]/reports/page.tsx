import AccountDashboard from "../../components/AccountDashboard"

export default function ReportsPage({ params }: { params: { account_id: string } }) {
  return <AccountDashboard accountId={params.account_id} initialViewKey="reports" />
}

