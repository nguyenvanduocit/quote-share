import { MarkdownView, Notice, Plugin } from 'obsidian'
import { SettingTab } from './SetingTab'
import { ModalOnBoarding } from './ModalOnboarding'
import { CanvasView, ViewType } from './CanvasView'
import { openView } from './fns/openView'

interface PluginSetting {
    isFirstRun: boolean
    backgroundIndex: number
}

const DEFAULT_SETTINGS: PluginSetting = {
    isFirstRun: true,
    backgroundIndex: 0
}

export default class SharePlugin extends Plugin {
    settings: PluginSetting

    async onload() {
        await this.loadSettings()
        this.addSettingTab(new SettingTab(this.app, this))

        this.registerView(ViewType, (leaf) => {
            return new CanvasView(leaf, this)
        })

        // add editor commands
        this.addCommand({
            id: 'share-selected-text',
            name: 'Share selected text',
            callback: async () => {
                const editor =
                    this.app.workspace.getActiveViewOfType(MarkdownView)?.editor
                const selection = editor?.getSelection()
                if (!selection) {
                    new Notice('Please select text to share.')
                    return
                }
                await openView(this.app.workspace, ViewType)
            }
        })

        this.addRibbonIcon('share', 'Share', async () => {
            await openView(this.app.workspace, ViewType)
        })

        if (this.settings.isFirstRun) {
            this.settings.isFirstRun = false

            const modal = new ModalOnBoarding(this.app)
            modal.open()

            await openView(this.app.workspace, ViewType)

            await this.saveSettings()
        }

        this.app.workspace.on("editor-menu", (menu, editor, view) => {
            const onClick = async (isEmbed: boolean) => {
                const view = await openView(this.app.workspace, ViewType)
                view?.view.drawText(editor.getSelection())
            }

            menu.addItem((item) => {
                item
                  .setTitle("Share as gradient")
                  .setIcon("links-coming-in")
                  .onClick(() => onClick(false));
            });
        })
    }

    onunload() {
        this.app.workspace.detachLeavesOfType(ViewType)
    }

    async loadSettings() {
        this.settings = await this.loadData()

        if (!this.settings) {
            this.settings = DEFAULT_SETTINGS
        }

        if (this.settings.backgroundIndex === undefined) {
            this.settings.backgroundIndex = DEFAULT_SETTINGS.backgroundIndex
        }

        await this.saveSettings()
    }

    async saveSettings() {
        await this.saveData(this.settings)
    }
}
