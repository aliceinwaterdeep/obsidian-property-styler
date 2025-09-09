import { Plugin } from "obsidian";
import { PluginSettings } from "./types/plugin";
import { DEFAULT_SETTINGS } from "./config/defaultSettings";
import { PropertyDetectionService } from "./services/PropertyDetectionService";

export default class PropertyStylerPlugin extends Plugin {
	settings: PluginSettings;
	private propertyDetector: PropertyDetectionService;
	private observer: MutationObserver | null = null;
	private debounceTimer: NodeJS.Timeout | null = null;

	async onload() {
		console.log("Loading Property Styler plugin");

		await this.loadSettings();

		// initialize services
		this.propertyDetector = new PropertyDetectionService();

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
			this.propertyDetector.detectAndLogProperties();
		}
	}
}
