import { Plugin } from "obsidian";
import { PluginSettings } from "./types/plugin";
import { DEFAULT_SETTINGS } from "./config/defaultSettings";
import { PropertyProcessor } from "./services/PropertyProcessor";
import { SettingsTab } from "./views/settings/SettingsTab";

export default class PropertyStylerPlugin extends Plugin {
	settings: PluginSettings;
	private propertyProcessor: PropertyProcessor;
	private observer: MutationObserver | null = null;
	private debounceTimer: NodeJS.Timeout | null = null;

	async onload() {
		console.log("Loading Property Styler plugin");

		await this.loadSettings();

		// initialize services
		this.propertyProcessor = new PropertyProcessor();

		//  observers to detect when Bases views are loaded
		this.app.workspace.onLayoutReady(() => this.runDetection());

		this.registerEvent(
			this.app.workspace.on("layout-change", () => this.runDetection())
		);

		this.registerEvent(
			this.app.workspace.on("active-leaf-change", () => {
				setTimeout(() => this.runDetection(), 100);
			})
		);

		this.setupMutationObserver();

		this.addSettingTab(new SettingsTab(this.app, this));
	}

	onunload() {
		console.log("Property Styler unloaded");
		this.observer?.disconnect();
		if (this.debounceTimer) clearTimeout(this.debounceTimer);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	setupMutationObserver() {
		this.observer = new MutationObserver(
			this.debounce(() => {
				this.runDetection();
			}, 150)
		);

		this.observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}

	debounce(func: Function, wait: number) {
		return (...args: any[]) => {
			if (this.debounceTimer) clearTimeout(this.debounceTimer);
			this.debounceTimer = setTimeout(() => func.apply(this, args), wait);
		};
	}

	runDetection() {
		// only run detection if in a Bases view
		if (document.querySelector("[data-type='bases']")) {
			const detectedNames = this.propertyProcessor.processProperties(
				this.settings
			);
			this.updateDetectedProperties(detectedNames);
		}
	}

	private updateDetectedProperties(detectedNames: string[]) {
		const currentDetected = new Set(this.settings.detectedProperties);

		// Check if there are any new properties
		const hasNewProperties = detectedNames.some(
			(name) => !currentDetected.has(name)
		);

		if (hasNewProperties) {
			// Merge new properties with existing ones
			this.settings.detectedProperties = Array.from(
				new Set([...this.settings.detectedProperties, ...detectedNames])
			).sort();

			// Create default PropertyConfig for new properties
			detectedNames.forEach((propertyName) => {
				if (!this.settings.properties[propertyName]) {
					this.settings.properties[propertyName] = { mode: "off" };
				}
			});

			this.saveSettings();
			console.log(
				"Updated detected properties:",
				this.settings.detectedProperties
			);
			console.log("Property configs:", Object.keys(this.settings.properties));
		}
	}
}
