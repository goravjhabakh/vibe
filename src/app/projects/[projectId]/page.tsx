import ProjectIdView from "@/components/projects/project-id-view"
import { Id } from "../../../../convex/_generated/dataModel"

const Page = async ({
  params
}: {
  params: Promise<{ projectId: Id<"projects"> }>
}) => {
  const { projectId } = await params

  return <ProjectIdView projectId={projectId} />
}
export default Page
