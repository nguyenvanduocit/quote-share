import { App, Modal } from 'obsidian'

export class ModalOnBoarding extends Modal {
    onOpen() {
        const { contentEl } = this
        contentEl.createEl('h3', { text: 'Welcome to Share' })
        contentEl.createEl('p', {
            text: 'With this plugin, you can easily generate beautiful gradient images from text,'
        })
        contentEl.createEl('p', {
            text: 'To create a new image, click on the "Share" button in the sidebar. Drag text into the editor to create a new image.'
        })
    }

    onClose() {
        const { contentEl } = this
        contentEl.empty()
    }
}
