import AccountDashboard from "../../components/AccountDashboard"

export default function DashboardPage({ params }: { params: { account_id: string } }) {
  return <AccountDashboard accountId={params.account_id} initialViewKey="overview" />
}
