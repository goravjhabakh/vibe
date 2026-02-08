"use client"

import { Button } from "@/components/ui/button"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"

const Page = () => {
  const projects = useQuery(api.projects.get)
  const createProject = useMutation(api.projects.create)

  return (
    <div className="flex flex-col gap-2 p-4 max-w-lg">
      <Button onClick={() => createProject({ name: "New Project" })}>
        Add new
      </Button>
      {projects?.map((project) => (
        <div key={project._id} className="border rounded p-2 flex flex-col">
          <h2 className="text-lg font-semibold">{project.name}</h2>
          <p className="text-muted-foreground text-sm">
            Owner Id: {project.ownerId}
          </p>
        </div>
      ))}
    </div>
  )
}
export default Page
