"use client"

import Image from "next/image"
import { Button } from "../ui/button"
import { SparkleIcon } from "lucide-react"
import { Kbd } from "../ui/kbd"
import { FaGithub } from "react-icons/fa"
import ProjectsList from "./projects-list"
import { useCreateProject } from "@/hooks/use-projects"
import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  colors
} from "unique-names-generator"
import { useEffect, useState } from "react"
import ProjectsCommandDialog from "./projects-command-dialog"

const customConfig: Config = {
  dictionaries: [adjectives, colors],
  separator: "-",
  length: 2
}

const ProjectsView = () => {
  const [commandDialogOpen, setCommandDialogOpen] = useState<boolean>(false)

  const createProject = useCreateProject()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === "k") {
          e.preventDefault()
          setCommandDialogOpen(true)
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleCreateProject = () => {
    const name = uniqueNamesGenerator(customConfig)
    createProject({ name })
  }

  return (
    <>
      <ProjectsCommandDialog
        open={commandDialogOpen}
        onOpenChange={setCommandDialogOpen}
      />
      <div className="min-h-screen bg-sidebar flex flex-col items-center justify-center p-6 md:p-16">
        <div className="w-full max-w-sm mx-auto flex flex-col gap-4">
          <div className="flex justify-between gap-4 w-full items-center">
            <div className="flex items-center gap-2 w-full group/logo">
              <Image
                src={"/logo.svg"}
                alt="Vibe"
                width={32}
                height={32}
                className="size-8 md:size-12"
              />
              <h1 className="text-4xl md:text-5xl font-semibold">Vibe</h1>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={"outline"}
                onClick={handleCreateProject}
                className="h-full items-start justify-start p-4 bg-background border flex flex-col gap-6 rounded-none"
              >
                <div className="flex items-center justify-between w-full">
                  <SparkleIcon className="size-4" />
                  <Kbd className="border">Ctrl + J</Kbd>
                </div>
                <span className="text-sm">New</span>
              </Button>
              <Button
                variant={"outline"}
                onClick={() => {}}
                className="h-full items-start justify-start p-4 bg-background border flex flex-col gap-6 rounded-none"
              >
                <div className="flex items-center justify-between w-full">
                  <FaGithub className="size-4" />
                  <Kbd className="border">Ctrl + I</Kbd>
                </div>
                <span className="text-sm">Import</span>
              </Button>
            </div>

            <ProjectsList onViewAll={() => setCommandDialogOpen(true)} />
          </div>
        </div>
      </div>
    </>
  )
}
export default ProjectsView
