import { useProjects } from "@/hooks/use-projects"
import { useRouter } from "next/navigation"
import { Doc } from "../../../convex/_generated/dataModel"
import { FaGithub } from "react-icons/fa"
import { AlertCircleIcon, GlobeIcon, Loader2Icon } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList
} from "../ui/command"
import { CommandItem } from "cmdk"

interface ProjectsCommandDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const getProjectIcon = (project: Doc<"projects">) => {
  if (project.importStatus === "completed") {
    return <FaGithub className="size-3.5 text-muted-foreground" />
  }

  if (project.importStatus === "failed") {
    return <AlertCircleIcon className="size-3.5 text-muted-foreground" />
  }

  if (project.importStatus === "importing") {
    return (
      <Loader2Icon className="size-3.5 text-muted-foreground animate-spin" />
    )
  }

  return <GlobeIcon className="size-3.5 text-muted-foreground" />
}

const ProjectsCommandDialog = ({
  open,
  onOpenChange
}: ProjectsCommandDialogProps) => {
  const router = useRouter()
  const projects = useProjects()

  const handleSelect = (projectId: string) => {
    router.push(`/projects/${projectId}`)
    onOpenChange(false)
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search Projects"
      description="Search and navigate to your projects"
    >
      <CommandInput placeholder="Search projects..." />
      <CommandList>
        <CommandEmpty>No projects found.</CommandEmpty>
        <CommandGroup heading="Projects">
          {projects?.map((project) => (
            <CommandItem
              key={project._id}
              value={`${project.name}-${project._id}`}
              onSelect={() => handleSelect(project._id)}
            >
              <div className="flex items-center gap-2">
                {getProjectIcon(project)}
                <span className="truncate">{project.name}</span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
export default ProjectsCommandDialog
