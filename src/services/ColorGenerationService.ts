export class ColorGenerationService {
	generateColorFromText(text: string): string {
		let hash = 0;
		for (let i = 0; i < text.length; i++) {
			hash = (hash << 5) - hash + text.charCodeAt(i);
			hash = hash & hash;
		}

		const hue = Math.abs(hash) % 360;
		const saturation = 65 + (Math.abs(hash >> 8) % 20);
		const lightness = 45 + (Math.abs(hash >> 16) % 15);

		return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
	}
}
