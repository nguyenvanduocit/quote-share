import { ItemView, WorkspaceLeaf, Menu, Notice } from 'obsidian'
import { fabric } from 'fabric'
import { backgrounds, createBackground } from './fns/addBackground'
import { dataURItoBlob } from './fns/dataUrlToBlob'
import { getCurrentFileName } from './fns/getCurrentFileName'
import SharePlugin from './main'
import { dequeue, onQueueAdded } from './queue'

export const ViewType = 'obsidian-share-view'

export class CanvasView extends ItemView {
    private canvas: fabric.Canvas
    private paddingPercent = 0.08
    private canvasWidth = 1920
    private canvasHeight = 1400
    private plugin: SharePlugin

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
        controllerContainer.createEl('button', {
            text: 'Copy',
            attr: {
                id: 'copy-to-clipboard'
            }
        })
        this.contentEl.on('click', '#copy-to-clipboard', async (e) => {
            const blob = dataURItoBlob(this.canvas.toDataURL())
            const item = new ClipboardItem({ 'image/png': blob })
            await navigator.clipboard.write([item])
            new Notice('Copied to clipboard')
        })

        /*controllerContainer.createEl('button', {
      text: 'Drag to share',
      attr: {
        id: 'drag-to-share',
        draggable: 'true'
      }
    })
    this.contentEl.on('dragstart', '#drag-to-share', async (e) => {
      const img = document.createElement('img')
      img.src = this.canvas.toDataURL()
      e.dataTransfer?.setDragImage(img, 0, 0)
    })*/

        const canvasEl = this.contentEl.createEl('canvas', {
            attr: { id: 'canvas' }
        })

        this.contentEl.on('drop', 'canvas', (e) => {
            this.drawText(e.dataTransfer?.getData('Text').trim() || '')
            this.canvas.renderAll()
        })

        this.canvas = new fabric.Canvas(canvasEl, {
            width: this.canvasWidth,
            height: this.canvasHeight,
            backgroundColor: '#000',
            selection: false
        })

        const background = createBackground(
            this.plugin.settings.backgroundIndex
        )
        this.canvas.add(background)

        // the card
        const widthPadding = this.canvasWidth * this.paddingPercent
        const rectWidth = this.canvasWidth - widthPadding * 2
        const rectHeight = this.canvasHeight - widthPadding * 2
        const card = new fabric.Rect({
            width: rectWidth,
            height: rectHeight,
            fill: 'rgba(0,0,0,0.45)',
            selectable: false,
            rx: this.canvasWidth * 0.02,
            ry: this.canvasWidth * 0.02,
            shadow: new fabric.Shadow({
                color: 'rgba(0,0,0,0.9)',
                blur: 30
            }),
            strokeWidth: 2,
            stroke: 'rgba(0,0,0,0.5)'
        })
        this.canvas.centerObject(card)
        this.canvas.add(card)

        this.drawText('Drag text here')

        // gradient

        const gradients = controllerContainer.createDiv({ cls: 'gradients' })

        backgrounds.forEach((background, index) => {
            gradients.createEl('button', {
                text: index.toString(),
                cls: 'change-background',
                attr: {
                    'data-index': index,
                    style: background.css
                }
            })
        })

        this.contentEl.on('click', '.change-background', async (e) => {
            this.canvas
                .getObjects()
                .filter((o) => o.name === 'background')
                .forEach((o) => {
                    this.canvas.remove(o)
                })

            const target = e.target as HTMLElement
            const backgroundIndex = parseInt(target.dataset.index || '0')
            const background = createBackground(backgroundIndex)
            this.canvas.add(background)
            this.canvas.sendToBack(background)

            this.plugin.settings.backgroundIndex = backgroundIndex
            await this.plugin.saveSettings()
        })

        const queuedText = dequeue()
        if (queuedText) {
            this.drawText(queuedText)
        }

        onQueueAdded(() => {
            const queuedText = dequeue()
            if (queuedText) {
                this.drawText(queuedText)
            }
        })
    }

    private createTextNode(
        rectWidth: number,
        textContent: string,
        subText?: string
    ) {
        // the text
        const textWidth = rectWidth * 0.8
        const text = new fabric.Textbox(textContent, {
            width: textWidth,
            fill: 'white',
            textAlign: 'center',
            fontSize: 80
        })

        const vaultName = new fabric.Textbox(`// ${subText}`, {
            width: textWidth,
            left: text.left,
            top: text.height! + text.top! + 50,
            fill: 'white',
            textAlign: 'center',
            fontSize: 50
        })

        return new fabric.Group([text, vaultName], {
            selectable: false,
            name: 'mainText'
        })
    }

    drawText(text: string) {
        this.canvas
            .getObjects()
            .filter((o) => o.name === 'mainText')
            .forEach((o) => {
                this.canvas.remove(o)
            })

        const textWidth =
            this.canvasWidth - this.canvasWidth * this.paddingPercent

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
        return 'obsidian-share'
    }
}
