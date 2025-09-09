export const SELECTORS = {
	PROPERTY_VALUE: "[data-property-value]",
	PROPERTY_NAME: "[data-property-name]",
	PROPERTY_ATTR: "data-property",
	LIST_ELEMENT: ".value-list-element",
	RENDERED_ELEMENT: ".bases-rendered-element",
	MULTI_SELECT_PILL: ".multi-select-pill-content",
	LONGTEXT: ".metadata-input-longtext",
	// card view selectors
	CARD_CONTAINER: ".bases-cards-view",
	CARD_PROPERTY: ".bases-cards-property[data-property]",
	CARD_PROPERTY_LABEL: ".bases-cards-label",
	// table view selectors
	TABLE_CONTAINER: ".bases-table-view",
	TABLE_PROPERTY: ".bases-td[data-property]",
} as const;
