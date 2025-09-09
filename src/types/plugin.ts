export type PropertyMode = "off" | "auto" | "custom";

export interface PropertyColors {
	background: string;
	text: string;
	border: string;
}

export interface PropertyAppearance {
	borderRadius: number;
	borderWidth: number;
	paddingVertical: number;
	paddingHorizontal: number;
	fontWeight: "normal" | "medium" | "bold";
}

export interface GlobalStyles {
	appearance: PropertyAppearance;
}

export interface PropertyConfig {
	mode: PropertyMode;
	customColors?: PropertyColors;
	customAppearance?: Partial<PropertyAppearance>;
}

export interface PluginSettings {
	globalStyles: GlobalStyles;
	properties: Record<string, PropertyConfig>;
	detectedProperties: string[];
	enabledInCardView: boolean;
	enabledInTableView: boolean;
}
