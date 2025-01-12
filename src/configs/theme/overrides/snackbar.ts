import { extractRGB } from 'utils/extract-rgb'; // extractRGB dahil edildi

import { Skin } from '../types';
import { OwnerStateThemeType } from './';

const Snackbar = (skin: Skin) => {
	return {
		MuiSnackbarContent: {
			styleOverrides: {
				root: ({ theme }: OwnerStateThemeType) => ({
					...(skin === 'bordered' && { boxShadow: 'none' }),
					// extractRGB ile olası rgba/rgb problemini çözüyoruz
					backgroundColor: `rgb(${extractRGB(theme.palette.customColors.main)})`,
					color: theme.palette.common[theme.palette.mode === 'light' ? 'white' : 'black'],
				}),
			},
		},
	};
};

export default Snackbar;
