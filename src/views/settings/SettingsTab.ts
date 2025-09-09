import { App, PluginSettingTab, Setting } from "obsidian";
import PropertyStylerPlugin from "../../main";
import { PropertyMode } from "src/types/plugin";

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
							if (!this.plugin.settings.properties[propertyName]) {
								this.plugin.settings.properties[propertyName] = { mode: "off" };
							}
							const propertyConfig =
								this.plugin.settings.properties[propertyName];

							propertyConfig.mode = value as PropertyMode;
							await this.plugin.saveSettings();
						});
				});
		});
	}
}
