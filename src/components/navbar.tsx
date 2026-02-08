"use client"

import Link from "next/link"
import { Id } from "../../convex/_generated/dataModel"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "./ui/breadcrumb"
import { Button } from "./ui/button"
import Image from "next/image"
import { UserButton } from "@clerk/nextjs"
import { useProject, useRenameProject } from "@/hooks/use-projects"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { CloudCheckIcon, Loader2Icon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

const Navbar = ({ projectId }: { projectId: Id<"projects"> }) => {
  const project = useProject(projectId)
  const renameProject = useRenameProject()

  const [isRenaming, setIsRenaming] = useState<boolean>(false)
  const [name, setName] = useState<string>("")

  const handleStartRename = () => {
    if (!project) return
    setName(project.name)
    setIsRenaming(true)
  }

  const handleSubmit = () => {
    setIsRenaming(false)

    const trimmedName = name.trim()
    if (!trimmedName) return
    if (trimmedName === project?.name) return

    renameProject({ id: projectId, name: trimmedName })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit()
    } else if (e.key === "Escape") {
      setIsRenaming(false)
    }
  }

  return (
    <nav className="flex justify-between items-center p-2 gap-x-2 bg-sidebar border-b">
      <div className="flex items-center gap-x-2">
        <Breadcrumb>
          <BreadcrumbList className="gap-0!">
            <BreadcrumbItem>
              <BreadcrumbLink
                className="flex items-center gap-1.5 group/logo"
                asChild
              >
                <Button variant={"ghost"} className="w-fit! p-1.5! h-7!">
                  <Link href={`/`} className="flex items-center gap-2">
                    <Image src="/logo.svg" alt="Logo" width={20} height={20} />
                    <span className="text-sm font-medium">Vibe</span>
                  </Link>
                </Button>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="ml-0! mr-1!" />
            <BreadcrumbItem>
              {isRenaming ?
                <input
                  autoFocus
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={(e) => e.currentTarget.select()}
                  onBlur={handleSubmit}
                  onKeyDown={handleKeyDown}
                  className="text-sm bg-transparent text-foreground outline-none focus:ring-1 focus:ring-inset focus:ring-ring font-medium max-w-40 truncate"
                />
              : <BreadcrumbPage
                  className="text-sm cursor-pointer font-medium hover:text-primary max-w-40 truncate"
                  onClick={handleStartRename}
                >
                  {project?.name || "Loading..."}
                </BreadcrumbPage>
              }
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {project?.importStatus === "importing" ?
          <Tooltip>
            <TooltipTrigger asChild>
              <Loader2Icon className="size-4 text-muted-foreground animate-spin" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Importing...</p>
            </TooltipContent>
          </Tooltip>
        : project?.updatedAt && (
            <Tooltip>
              <TooltipTrigger asChild>
                <CloudCheckIcon className="size-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Last updated{" "}
                  {formatDistanceToNow(new Date(project.updatedAt), {
                    addSuffix: true
                  })}
                </p>
              </TooltipContent>
            </Tooltip>
          )
        }
      </div>
      <div className="flex items-center gap-2">
        <UserButton />
      </div>
    </nav>
  )
}
export default Navbar
