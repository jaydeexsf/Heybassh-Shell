import AccountDashboard from "../../../../../components/AccountDashboard"

export default function PasswordManagerPage({ params }: { params: { account_id: string } }) {
  return <AccountDashboard accountId={params.account_id} initialViewKey="admin_password_manager" />
}

