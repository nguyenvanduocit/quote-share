import { App, MarkdownView } from 'obsidian'

export const getCurrentFileName = (app: App): string => {
    const activeLeaf = app.workspace.getActiveViewOfType(MarkdownView)
    return activeLeaf?.file.name?.replace('.md', '') || app.vault.getName()
}
