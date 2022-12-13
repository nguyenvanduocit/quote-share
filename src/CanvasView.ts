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
import { getCurrentFileName } from './fns/getCurrentFileName'

export const ViewType = 'obsidian-share-view'

export class CanvasView extends ItemView {
    private canvas: fabric.Canvas
    private paddingPercent = 0.05
    private canvasWidth = 1920*0.8
    private canvasHeight = 1400*0.8
    constructor(leaf: WorkspaceLeaf) {
        super(leaf)
    }

    onload(): void {
        this.contentEl.empty()
        this.contentEl.addClass('obsidian-share-view')

        const controllerContainer = this.contentEl.createDiv({
            cls: 'controller-container'
        })
        controllerContainer.createEl('button', {
            text: 'Copy to clipboard',
            attr:{
                id: 'copy-to-clipboard'
            }
        })
        this.contentEl.on('click', "#copy-to-clipboard", async (e) => {
            const blob = dataURItoBlob(this.canvas.toDataURL())
            const item = new ClipboardItem({ 'image/png': blob })
            await navigator.clipboard.write([item])
            new Notice('Copied to clipboard')
        })

        controllerContainer.createEl('button', {
            text: 'Change background',
            attr:{
                id: 'change-background'
            }
        })
        this.contentEl.on('click', "#change-background", async (e) => {
            this.canvas.getObjects().filter((o) => o.name === 'background').forEach((o) => {
                this.canvas.remove(o)
            })

            const background = createBackground(this.canvasWidth, this.canvasHeight)
            this.canvas.add(background)
        })

        controllerContainer.createEl('button', {
            text: 'Drag to share',
            attr:{
                id: 'drag-to-share',
                draggable: 'true'
            }
        })
        this.contentEl.on('dragstart', "#drag-to-share", async (e) => {
            const img = document.createElement('img')
            img.src = this.canvas.toDataURL()
            e.dataTransfer?.setDragImage(img, 0, 0)
        })

        const canvasEl = this.contentEl.createEl('canvas', {
            attr: { id: 'canvas'}
        })

        this.contentEl.on('drop', "canvas", (e) => {
            this.drawText(e.dataTransfer?.getData("Text").trim() || "")
            this.canvas.renderAll()
        })

        this.canvas = new fabric.Canvas(canvasEl, {
            width: this.canvasWidth,
            height: this.canvasHeight,
            backgroundColor: '#000',
            selection: false,
        })

        const background = createBackground(this.canvasWidth, this.canvasHeight)
        this.canvas.add(background)

        // the card
        const widthPadding = this.canvasWidth * this.paddingPercent
        const heightPadding = this.canvasHeight * this.paddingPercent
        const rectWidth = this.canvasWidth - widthPadding * 2
        const rectHeight = this.canvasHeight - heightPadding * 2
        const card = new fabric.Rect({
            width: rectWidth,
            height: rectHeight,
            fill: 'rgba(0,0,0,0.3)',
            selectable: false,
            rx: this.canvasWidth * 0.02,
            ry: this.canvasWidth * 0.02,
            shadow: new fabric.Shadow({
                color: 'black',
                blur: 20
            })
        })
        this.canvas.centerObject(card)
        this.canvas.add(card)

        this.drawText("Drag text here")
    }

    private createTextNode(rectWidth: number, textContent: string, subText?: string) {
        // the text
        const textWidth = rectWidth * 0.85
        const text = new fabric.Textbox(textContent, {
            width: textWidth,
            fill: 'white',
            textAlign: 'center',
            fontSize: 70,
        })

        const vaultName = new fabric.Textbox(`// ${subText}`, {
            width: textWidth,
            left: text.left,
            top: text.height! + text.top! + 50,
            fill: 'white',
            textAlign: 'center',
            fontSize: 50,
        })

        return new fabric.Group([text, vaultName], {selectable: false, name: 'mainText'})
    }

    drawText(text: string) {
        this.canvas.getObjects().filter((o) => o.name === 'mainText').forEach((o) => {
            this.canvas.remove(o)
        })


        const textWidth = this.canvasWidth - this.canvasWidth * this.paddingPercent

        const subText = getCurrentFileName(this.app)

        const textGroup = this.createTextNode(textWidth, text, subText)
        this.canvas.centerObject(textGroup)
        this.canvas.add(textGroup)
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
