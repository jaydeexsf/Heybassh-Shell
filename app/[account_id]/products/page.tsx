import AccountDashboard from "../../components/AccountDashboard"

export default function ProductsPage({ params }: { params: { account_id: string } }) {
  return <AccountDashboard accountId={params.account_id} initialViewKey="products_listing" />
}
