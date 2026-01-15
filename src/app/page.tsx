'use client'

import { Button } from "@/components/ui/button"
import { useTRPC } from "@/trpc/client"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export default function Home() {
  const trpc = useTRPC()
  const invoke = useMutation(trpc.invoke.mutationOptions({
    onSuccess: () => {
      toast.success("Background job invoked successfully")
    },
    onError: () => {
      toast.error("Background job failed")
    }
  }))

  return (
    <div className="h-screen flex flex-col items-center justify-center space-y-4">
      <h1 className="text-3xl font-bold">Home</h1>
      <Button disabled={invoke.isPending} onClick={() => { invoke.mutate({ text: "Gorav" }) }}>
        Invoke Background Job
      </Button>
    </div>
  )
}
