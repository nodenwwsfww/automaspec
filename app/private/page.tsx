"use client"

import { authClient } from "@/lib/auth-client"
import { useQuery } from "@tanstack/react-query"
import { orpc } from "@/lib/orpc"
import { redirect } from "next/navigation"

export default function PrivatePage() {
  const { data: session, isPending } = authClient.useSession()
  const privateData = useQuery(orpc.planet.list.queryOptions({ input: { limit: 10 } }))
  const publicData = useQuery(orpc.planet.find.queryOptions({ input: { id: 1 } }))

  if (isPending) {
    return <div>Loading...</div>
  }

  if (!session) {
    redirect("/login")
  }

  return (
    <div>
      <h1>Private Page</h1>
      <p>Welcome {session.user.name}</p>
      <p>privateData: {privateData.data?.length}</p>
      <p>PublicData: {publicData.data?.name}</p>
    </div>
  )
}
