import {
    ItemView,
    WorkspaceLeaf,
    Menu,
    debounce,
    Notice,
    MarkdownView
} from 'obsidian'
import { fabric } from 'fabric'
import SharePlugin from './main'
import { createBackground } from './fns/addBackground'
import { dataURItoBlob } from './fns/dataUrlToBlob'
import { getSelectedText } from './fns/getSelectedText'

export const ViewType = 'obsidian-share-view'

export class CanvasView extends ItemView {
    private plugin: SharePlugin
    private canvas: fabric.Canvas

    constructor(leaf: WorkspaceLeaf, plugin: SharePlugin) {
        super(leaf)
        this.plugin = plugin
    }

    onload(): void {
        this.contentEl.empty()
        this.contentEl.addClass('obsidian-share-view')

        const controllerContainer = this.contentEl.createDiv({
            cls: 'controller-container'
        })
        const saveButton = controllerContainer.createEl('button', {
            text: 'Copy to clipboard'
        })
        saveButton.addEventListener('click', async () => {
            open(this.canvas.toDataURL())
            const blob = dataURItoBlob(this.canvas.toDataURL())
            const item = new ClipboardItem({ 'image/png': blob })
            await navigator.clipboard.write([item])
            new Notice('Copied to clipboard')
        })

        const canvasWidth = 1920/2
        const canvasHeight = 1400/2
        const canvasEl = this.contentEl.createEl('canvas', {
            attr: { id: 'canvas' }
        })

        this.canvas = new fabric.Canvas(canvasEl, {
            width: canvasWidth,
            height: canvasHeight,
            selection: false
        })

        const background = createBackground(canvasWidth, canvasHeight)
        this.canvas.add(background)

        // the card
        const paddingPercent = 0.05
        const widthPadding = canvasWidth * paddingPercent
        const heightPadding = canvasHeight * paddingPercent
        const rectWidth = canvasWidth - widthPadding * 2
        const rectHeight = canvasHeight - heightPadding * 2
        const rect = new fabric.Rect({
            width: rectWidth,
            height: rectHeight,
            left: widthPadding,
            top: heightPadding,
            fill: 'rgba(0,0,0,0.3)',
            selectable: false,
            rx: canvasWidth * 0.02,
            ry: canvasWidth * 0.02,
            shadow: new fabric.Shadow({
                color: 'black',
                blur: 20
            })
        })

        // the text
        const textContent = getSelectedText(this.app.workspace).trim()
        const textWidth = rectWidth * 0.8
        const text = new fabric.Textbox(textContent, {
            width: textWidth,
            left: canvasWidth / 2 - textWidth / 2,
            fill: 'white',
            textAlign: 'center',
            fontSize: 80
        })

        const height = text.calcTextHeight()
        text.set({
            top: canvasHeight / 2 - height / 2
        })

        // add vault name
        // get active leaf
        const activeLeaf = this.app.workspace.getActiveViewOfType(MarkdownView)
        let fileName = activeLeaf?.file.name || this.plugin.app.vault.getName()
        fileName = fileName.replace('.md', '')

        const vaultName = new fabric.Textbox(`// ${fileName}`, {
            width: textWidth,
            left: canvasWidth / 2 - textWidth / 2,
            top: text.height! + text.top! + 60,
            fill: 'white',
            textAlign: 'center',
            fontSize: 50
        })

        const textGroup = new fabric.Group([text, vaultName], {})

        // the group
        const groupWidthPadding = rectWidth * 0.1
        const groupHeightPadding = rectHeight * 0.1
        const groupWidth = rectWidth + groupWidthPadding
        const groupHeight = rectHeight + groupHeightPadding
        const group = new fabric.Group([rect, textGroup], {
            width: groupWidth,
            height: groupHeight,
            left: canvasWidth / 2 - groupWidth / 2,
            top: canvasHeight / 2 - groupHeight / 2,
            selectable: false
        })

        this.canvas.add(group)
    }

    onunload() {
        this.canvas.dispose()
        super.onunload()
    }

    onPaneMenu(menu: Menu, source: string): void {
        super.onPaneMenu(menu, source)
        menu.addItem((item) => {
            item.setTitle('support author')
            item.setIcon('globe')
            item.onClick(() => {
                open('https://twitter.com/duocdev')
            })
        })
    }

    getViewType(): string {
        return ViewType
    }

    getDisplayText(): string {
        return 'Obsidian Share'
    }

    getIcon(): string {
        return 'globe'
    }
}
