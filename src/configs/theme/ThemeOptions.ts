import { PaletteMode, ThemeOptions } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import { Settings } from 'configs/context/types';

import breakpoints from './breakpoints';
import overrides from './overrides';
import DefaultPalette from './palette';
import shadows from './shadows';
import spacing from './spacing';
import typography from './typography';

const themeOptions = (settings: Settings, overrideMode: PaletteMode): ThemeOptions => {
	const { skin, mode, themeColor } = settings;

	const paletteMode = mode === 'semi-dark' ? overrideMode : mode;

	const defaultPalette = DefaultPalette(paletteMode, skin);
	if (!defaultPalette || !defaultPalette.palette) {
		throw new Error('DefaultPalette did not return a valid palette');
	}

	const themeConfig: ThemeOptions = createTheme({
		breakpoints: breakpoints(),
		components: overrides(settings),
		palette: defaultPalette.palette,
		...spacing,
		shape: {
			borderRadius: 6,
		},
		mixins: {
			toolbar: {
				minHeight: 64,
			},
		},
		shadows: shadows(paletteMode),
		typography,
	});

	return deepmerge(themeConfig, {
		palette: {
			primary: {
				...(themeConfig.palette?.[themeColor] || defaultPalette.palette.primary),
			},
		},
	});
};

export default themeOptions;
