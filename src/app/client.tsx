'use client'

import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"

export default function Client () {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.hello.queryOptions({ text: 'Gorav' }))

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold">
        {data?.greeting}
      </h1>
    </div>
  )
}