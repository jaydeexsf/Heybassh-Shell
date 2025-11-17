import AccountDashboard from "../../components/AccountDashboard"

export default function CompaniesPage({ params }: { params: { account_id: string } }) {
  return <AccountDashboard accountId={params.account_id} initialViewKey="customers_companies" />
}
