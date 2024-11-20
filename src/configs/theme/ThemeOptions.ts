import { PaletteMode, ThemeOptions } from '@mui/material';
import { deepmerge } from '@mui/utils';
import { Settings } from 'configs/context/types';

import breakpoints from './breakpoints';
import overrides from './overrides';
import palette from './palette';
import shadows from './shadows';
import spacing from './spacing';
import typography from './typography';

const themeOptions = (settings: Settings, overrideMode: PaletteMode): ThemeOptions => {
	const { skin, mode, themeColor } = settings;

	const themeConfig: ThemeOptions = {
		breakpoints: breakpoints(),
		components: overrides(settings),
		palette: palette(mode === 'semi-dark' ? overrideMode : mode, skin),
		...spacing,
		shape: {
			borderRadius: 6,
		},
		mixins: {
			toolbar: {
				minHeight: 64,
			},
		},
		shadows: shadows(mode === 'semi-dark' ? overrideMode : mode),
		typography,
	};

	return deepmerge(themeConfig, {
		palette: {
			primary: {
				...(themeConfig.palette
					? themeConfig.palette[themeColor]
					: palette(mode === 'semi-dark' ? overrideMode : mode, skin).primary),
			},
		},
	});
};

export default themeOptions;
