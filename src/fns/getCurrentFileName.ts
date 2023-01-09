import { App, MarkdownView } from 'obsidian'

export const getCurrentFileName = (app: App): string => {
    const activeFile = app.workspace.getActiveFile()
    return activeFile?.name.replace(".md", "") || ''
}
