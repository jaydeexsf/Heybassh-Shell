import AccountDashboard from "../../components/AccountDashboard"
import { getViewForPath } from "../../components/accountRouteMap"

export default function AccountSectionPage({ params }: { params: { account_id: string; section: string } }) {
  const viewKey = getViewForPath(params.section)
  return <AccountDashboard accountId={params.account_id} initialViewKey={viewKey} />
}

