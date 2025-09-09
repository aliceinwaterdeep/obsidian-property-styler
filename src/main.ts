import { Notice, Plugin } from "obsidian";
import { PluginSettings } from "./types/plugin";
import { DEFAULT_SETTINGS } from "./config/defaultSettings";

export default class PropertyStylerPlugin extends Plugin {
	settings: PluginSettings;

	async onload() {
		console.log("Loading Property Styler plugin");

		await this.loadSettings();
	}

	onunload() {
		console.log("Property Styler unloaded");
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
