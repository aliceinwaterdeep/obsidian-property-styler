import { PluginSettings } from "src/types";
import { ColorGenerationService } from "./ColorGenerationService";
import { SELECTORS } from "src/config/constants";

export class PropertyProcessor {
	private colorGenerator: ColorGenerationService;
	private detectedProperties: Set<string> = new Set();

	constructor() {
		this.colorGenerator = new ColorGenerationService();
	}

	processProperties(settings: PluginSettings): string[] {
		this.detectedProperties.clear();

		const propertyElements = document.querySelectorAll(
			`${SELECTORS.CARD_PROPERTY}, ${SELECTORS.TABLE_PROPERTY}`
		);

		propertyElements.forEach((element) => {
			this.processPropertyElement(element, settings);
		});

		return Array.from(this.detectedProperties);
	}

	private processPropertyElement(
		element: Element,
		settings: PluginSettings
	): void {
		const propertyName = element.getAttribute(SELECTORS.PROPERTY_ATTR);
		if (!propertyName) return;

		this.detectedProperties.add(propertyName);

		const config = settings.properties[propertyName];
		if (!config || config.mode === "off") {
			this.removeStyles(element);
		} else if (config.mode === "auto") {
			this.applyAutoStyles(element);
		}
	}

	private applyAutoStyles(element: Element): void {
		const valueElements = element.querySelectorAll(
			`${SELECTORS.MULTI_SELECT_PILL}, ${SELECTORS.LIST_ELEMENT}, ${SELECTORS.RENDERED_ELEMENT}`
		);

		valueElements.forEach((valueEl) => {
			const text = valueEl.textContent?.trim();
			if (!text) return;

			const color = this.colorGenerator.generateColorFromText(text);
			const htmlElement = valueEl as HTMLElement;

			htmlElement.style.backgroundColor = color;
			htmlElement.style.color = "white";
			htmlElement.style.borderRadius = "6px";
			htmlElement.style.padding = "2px 6px";
		});
	}

	private removeStyles(element: Element): void {
		const valueElements = element.querySelectorAll(
			`${SELECTORS.MULTI_SELECT_PILL}, ${SELECTORS.LIST_ELEMENT}, ${SELECTORS.RENDERED_ELEMENT}`
		);

		valueElements.forEach((valueEl) => {
			const htmlElement = valueEl as HTMLElement;
			htmlElement.style.backgroundColor = "";
			htmlElement.style.color = "";
			htmlElement.style.borderRadius = "";
			htmlElement.style.padding = "";
		});
	}
}
