import AccountDashboard from "../../components/AccountDashboard"

export default function TasksPage({ params }: { params: { account_id: string } }) {
  return <AccountDashboard accountId={params.account_id} initialViewKey="tasks" />
}

