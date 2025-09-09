import { PluginSettings, GlobalStyles } from "../types/plugin";

export const DEFAULT_GLOBAL_STYLES: GlobalStyles = {
	appearance: {
		borderRadius: 6,
		borderWidth: 1,
		paddingVertical: 2,
		paddingHorizontal: 6,
		fontWeight: "medium",
	},
};

export const DEFAULT_SETTINGS: PluginSettings = {
	globalStyles: DEFAULT_GLOBAL_STYLES,
	properties: {},
	detectedProperties: [],
	enabledInCardView: true,
	enabledInTableView: true,
};
