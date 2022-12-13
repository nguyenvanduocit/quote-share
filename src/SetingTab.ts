import { App, PluginSettingTab, Setting } from 'obsidian'
import OpenGatePlugin from './main'

export class SettingTab extends PluginSettingTab {
    plugin: OpenGatePlugin
    shouldNotify: boolean

    constructor(app: App, plugin: OpenGatePlugin) {
        super(app, plugin)
        this.plugin = plugin
    }

    display(): void {
        this.shouldNotify = false
        const { containerEl } = this
        containerEl.empty()

        const settingContainerEl = containerEl.createDiv('setting-container')

        containerEl.createEl('h3', { text: 'Help' })

        containerEl.createEl('small', {
            attr: {
                style: 'display: block; margin-bottom: 10px'
            },
            text: 'This product is free, because I am passionate about it and use it every day. I also do many other plugins. So follow me for more updates.'
        })

        new Setting(containerEl)
            .setName('Follow me on Twitter')
            .setDesc('@duocdev')
            .addButton((button) => {
                button.setCta()
                button.setButtonText('Follow for update').onClick(() => {
                    window.open('https://twitter.com/duocdev')
                })
            })
            .addButton((button) => {
                button.buttonEl.outerHTML =
                    "<a href='https://paypal.me/duocnguyen' target='_blank'><img style='border:0px;height:35px;' src='https://cdn.ko-fi.com/cdn/kofi3.png?v=3' /></a>"
            })
    }
}
