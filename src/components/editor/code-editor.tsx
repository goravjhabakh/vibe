import { useEffect, useMemo, useRef } from "react"
import { EditorView, keymap } from "@codemirror/view"
import { oneDark } from "@codemirror/theme-one-dark"
import { customTheme } from "@/lib/extensions/editor-theme"
import { getLanguageExtension } from "@/lib/extensions/language-extension"
import { indentWithTab } from "@codemirror/commands"
import { minimap } from "@/lib/extensions/minimap"
import { indentationMarkers } from "@replit/codemirror-indentation-markers"
import { customSetup } from "@/lib/extensions/custom-setup"

interface Props {
  fileName: string
  intialValue: string
  onChange?: (value: string) => void
}

export const CodeEditor = ({ fileName, intialValue, onChange }: Props) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)

  const languageExtension = useMemo(
    () => getLanguageExtension(fileName),
    [fileName]
  )

  useEffect(() => {
    if (!editorRef.current) return

    const view = new EditorView({
      doc: intialValue,
      parent: editorRef.current,
      extensions: [
        customSetup,
        languageExtension,
        oneDark,
        customTheme,
        keymap.of([indentWithTab]),
        minimap(),
        indentationMarkers(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged && onChange) {
            onChange(view.state.doc.toString())
          }
        })
      ]
    })

    viewRef.current = view

    return () => {
      view.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorRef, languageExtension])

  return <div ref={editorRef} className="size-full pl-4 bg-background" />
}
