import { MarkdownView, Workspace } from 'obsidian'

export const getSelectedText = (workspace: Workspace): string => {
    let view = workspace.getActiveViewOfType(MarkdownView)
    if (!view) {
        return ''
    }

    let view_mode = view.getMode() // "preview" or "source" (can also be "live" but I don't know when that happens)
    switch (view_mode) {
        case 'source':
            if ('editor' in view) {
                return view.editor.getSelection() // THIS IS THE SELECTED TEXT, use it as you wish.
            }
            break
        case 'preview':
        default:
            return ''
    }

    return ''
}
