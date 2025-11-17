import { redirect } from "next/navigation"

export default function AccountRoot({ params }: { params: { account_id: string } }) {
  redirect(`/${params.account_id}/dashboard`)
}
