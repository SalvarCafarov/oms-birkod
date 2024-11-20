import { hexToRGBA } from 'utils/hex-to-rgba';

import { OwnerStateThemeType } from './';

const Backdrop = () => {
	return {
		MuiBackdrop: {
			styleOverrides: {
				root: ({ theme }: OwnerStateThemeType) => ({
					backgroundColor:
						theme.palette.mode === 'light'
							? `rgba(${theme.palette.customColors.main}, 0.7)`
							: hexToRGBA(theme.palette.background.default, 0.7),
				}),
				invisible: {
					backgroundColor: 'transparent',
				},
			},
		},
	};
};

export default Backdrop;
