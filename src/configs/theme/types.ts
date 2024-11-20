import { PaletteMode } from '@mui/material';

export type Skin = 'default' | 'bordered';

export type Mode = PaletteMode | 'semi-dark';

export type ThemeColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';

declare module '@mui/material/styles' {
	interface Palette {
		customColors: {
			dark: string;
			main: string;
			light: string;
			bodyBg: string;
			trackBg: string;
			avatarBg: string;
			darkPaperBg: string;
			lightPaperBg: string;
			tableHeaderBg: string;
		};
	}

	interface PaletteOptions {
		customColors?: {
			dark?: string;
			main?: string;
			light?: string;
			bodyBg?: string;
			trackBg?: string;
			avatarBg?: string;
			darkPaperBg?: string;
			lightPaperBg?: string;
			tableHeaderBg?: string;
		};
	}
}

declare module '@mui/material/Button' {
	interface ButtonPropsVariantOverrides {
		tonal: true;
	}
}

declare module '@mui/material/ButtonGroup' {
	interface ButtonGroupPropsVariantOverrides {
		tonal: true;
	}
}
