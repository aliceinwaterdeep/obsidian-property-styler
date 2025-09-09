import { SELECTORS } from "src/config/constants";

export class PropertyDetectionService {
	detectAndLogProperties(): void {
		const properties = Array.from(
			document.querySelectorAll(
				`${SELECTORS.CARD_PROPERTY}, ${SELECTORS.TABLE_PROPERTY}`
			)
		);

		if (properties.length === 0) {
			console.log("No Bases properties found in current view");
			return;
		}

		console.log(`Found ${properties.length} property elements`);

		const propertiesMap = new Map<string, Set<string>>();

		properties.forEach((element) => {
			const propertyName = element.getAttribute(SELECTORS.PROPERTY_ATTR);
			if (!propertyName) return;

			if (!propertiesMap.has(propertyName)) {
				propertiesMap.set(propertyName, new Set<string>());
			}

			const values = this.extractValuesFromProperty(element);
			values.forEach((value) => {
				if (value.trim()) {
					propertiesMap.get(propertyName)!.add(value.trim());
				}
			});
		});

		propertiesMap.forEach((values, propertyName) => {
			const valueArray = Array.from(values);
			console.log(`${propertyName}: [${valueArray.join(", ")}]`);
		});

		const totalProperties = propertiesMap.size;
		const totalUniqueValues = Array.from(propertiesMap.values()).reduce(
			(sum, valueSet) => sum + valueSet.size,
			0
		);

		console.log(
			`Summary: ${totalProperties} properties, ${totalUniqueValues} unique values`
		);
	}

	private extractValuesFromProperty(propertyElement: Element): string[] {
		const values: string[] = [];

		const valueElements = propertyElement.querySelectorAll(
			`${SELECTORS.MULTI_SELECT_PILL}, ${SELECTORS.LIST_ELEMENT}, ${SELECTORS.RENDERED_ELEMENT}, ${SELECTORS.LONGTEXT}`
		);

		valueElements.forEach((element) => {
			const text = element.textContent?.trim();
			if (text) values.push(text);
		});

		return values;
	}

	getDetectedPropertyNames(): string[] {
		const properties = Array.from(
			document.querySelectorAll(
				`${SELECTORS.CARD_PROPERTY}, ${SELECTORS.TABLE_PROPERTY}`
			)
		);
		const propertyNames = new Set<string>();

		properties.forEach((element) => {
			const propertyName = element.getAttribute(SELECTORS.PROPERTY_ATTR);
			if (propertyName) {
				propertyNames.add(propertyName);
			}
		});

		return Array.from(propertyNames).sort();
	}
}
