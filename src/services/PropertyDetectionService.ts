export class PropertyDetectionService {
	detectAndLogProperties(): void {
		const cardProperties = Array.from(
			document.querySelectorAll(".bases-cards-property[data-property]")
		);
		const tableProperties = Array.from(
			document.querySelectorAll(".bases-td[data-property]")
		);

		const totalElements = cardProperties.length + tableProperties.length;

		if (totalElements === 0) {
			console.log("No Bases properties found in current view");
			return;
		}

		console.log(
			`Found ${totalElements} property elements (${cardProperties.length} cards, ${tableProperties.length} table)`
		);

		const propertiesMap = new Map<string, Set<string>>();

		const allPropertyElements = [...cardProperties, ...tableProperties];

		allPropertyElements.forEach((element) => {
			const propertyName = element.getAttribute("data-property");
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

		// look for list elements
		const listElements = propertyElement.querySelectorAll(
			".value-list-element"
		);
		listElements.forEach((element) => {
			const text = element.textContent;
			if (text) values.push(text);
		});

		// look for rendered values
		const renderedValues = propertyElement.querySelectorAll(
			".bases-rendered-value"
		);
		renderedValues.forEach((element) => {
			const text = element.textContent;
			if (text) values.push(text);
		});

		return values;
	}

	getDetectedPropertyNames(): string[] {
		const cardProperties = Array.from(
			document.querySelectorAll(".bases-cards-property[data-property]")
		);
		const tableProperties = Array.from(
			document.querySelectorAll(".bases-td[data-property]")
		);
		const allPropertyElements = [...cardProperties, ...tableProperties];
		const propertyNames = new Set<string>();

		allPropertyElements.forEach((element) => {
			const propertyName = element.getAttribute("data-property");
			if (propertyName) {
				propertyNames.add(propertyName);
			}
		});

		return Array.from(propertyNames).sort();
	}
}
