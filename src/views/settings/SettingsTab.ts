import { App, PluginSettingTab, Setting } from "obsidian";
import PropertyStylerPlugin from "../../main";

export class SettingsTab extends PluginSettingTab {
	plugin: PropertyStylerPlugin;

	constructor(app: App, plugin: PropertyStylerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Detected Properties")
			.setDesc(
				`Found ${this.plugin.settings.detectedProperties.length} properties in your vault`
			);

		this.plugin.settings.detectedProperties.forEach((propertyName) => {
			const config = this.plugin.settings.properties[propertyName];
			new Setting(containerEl)
				.setName(propertyName)
				.setDesc(`Current mode: ${config?.mode || "off"}`)
				.addDropdown((dropdown) => {
					dropdown
						.addOption("off", "Off")
						.addOption("auto", "Auto")
						.addOption("custom", "Custom")
						.setValue(config?.mode || "off")
						.onChange(async (value) => {
							this.plugin.settings.properties[propertyName].mode = value as any;
							await this.plugin.saveSettings();
						});
				});
		});
	}
}
