import { MarkdownView, Workspace } from 'obsidian'

export const getSelectedText = (workspace: Workspace): string => {
    let view = workspace.getActiveViewOfType(MarkdownView)
    if (!view) {
        return ''
    }

    let view_mode = view.getMode()
    switch (view_mode) {
        case 'source':
            if ('editor' in view) {
                return view.editor.getSelection().trim()
            }
            break
        case 'preview':
        default:
            return ''
    }

    return ''
}
