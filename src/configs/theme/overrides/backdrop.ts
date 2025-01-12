import { extractRGB } from 'utils/extract-rgb'; // RBG/rgba temizleyici fonksiyon
import { hexToRGBA } from 'utils/hex-to-rgba'; // Hex to RGBA dönüştürmek için mevcut fonksiyon

import { OwnerStateThemeType } from './';

const Backdrop = () => {
	return {
		MuiBackdrop: {
			styleOverrides: {
				root: ({ theme }: OwnerStateThemeType) => ({
					backgroundColor:
						theme.palette.mode === 'light'
							? `rgba(${extractRGB(theme.palette.customColors.main)}, 0.7)` // Burada extractRGB kullanılıyor
							: hexToRGBA(theme.palette.background.default, 0.7), // Bu zaten doğru
				}),
				invisible: {
					backgroundColor: 'transparent', // Invisible durumunda transparan arka plan kullanımı
				},
			},
		},
	};
};

export default Backdrop;
