import { useEditor } from "@/hooks/use-editor"
import { Id } from "../../../convex/_generated/dataModel"
import { TopNavigation } from "./top-navigation"
import { FileBreadcrumbs } from "./file-breadcrumbs"
import { useFile } from "@/hooks/use-files"
import Image from "next/image"
import { CodeEditor } from "./code-editor"
import { useUpdateFile } from "@/hooks/use-files"
import { useRef } from "react"

export const EditorView = ({ projectId }: { projectId: Id<"projects"> }) => {
  const { activeTabId } = useEditor(projectId)
  const activeFile = useFile(activeTabId)
  const updateFile = useUpdateFile()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const isActiveFileBinary = activeFile && activeFile.storageId
  const isActiveFileText = activeFile && !activeFile.storageId

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center">
        <TopNavigation projectId={projectId} />
      </div>
      {activeTabId && <FileBreadcrumbs projectId={projectId} />}
      <div className="flex-1 min-h-0 bg-background">
        {!activeTabId && (
          <div className="size-full flex items-center justify-center">
            <Image
              src={"/logo-alt.svg"}
              alt="Vibe"
              width={50}
              height={50}
              className="opacity-25"
            />
          </div>
        )}
        {activeFile && (
          <CodeEditor
            key={activeFile._id}
            fileName={activeFile.name}
            intialValue={activeFile.content ?? ""}
            onChange={(content: string) => {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
              }
              timeoutRef.current = setTimeout(() => {
                updateFile({ id: activeFile._id, content })
              }, 1500)
            }}
          />
        )}
        {isActiveFileBinary && <p>TODO: Implement binary file preview</p>}
        {isActiveFileText && <p>TODO: Implement text file preview</p>}
      </div>
    </div>
  )
}
