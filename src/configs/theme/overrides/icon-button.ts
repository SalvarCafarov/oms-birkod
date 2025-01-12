import { extractRGB } from 'utils/extract-rgb'; // extractRGB fonksiyonu eklendi
import { hexToRGBA } from 'utils/hex-to-rgba';

import { OwnerStateThemeType } from './';

const IconButton = {
	MuiIconButton: {
		variants: [
			{
				props: { color: 'primary' },
				style: ({ theme }: OwnerStateThemeType) => ({
					'&:hover': {
						backgroundColor: hexToRGBA(extractRGB(theme.palette.primary.main), 0.08),
					},
				}),
			},
			{
				props: { color: 'secondary' },
				style: ({ theme }: OwnerStateThemeType) => ({
					'&:hover': {
						backgroundColor: hexToRGBA(extractRGB(theme.palette.secondary.main), 0.08),
					},
				}),
			},
			{
				props: { color: 'success' },
				style: ({ theme }: OwnerStateThemeType) => ({
					'&:hover': {
						backgroundColor: hexToRGBA(extractRGB(theme.palette.success.main), 0.08),
					},
				}),
			},
			{
				props: { color: 'error' },
				style: ({ theme }: OwnerStateThemeType) => ({
					'&:hover': {
						backgroundColor: hexToRGBA(extractRGB(theme.palette.error.main), 0.08),
					},
				}),
			},
			{
				props: { color: 'warning' },
				style: ({ theme }: OwnerStateThemeType) => ({
					'&:hover': {
						backgroundColor: hexToRGBA(extractRGB(theme.palette.warning.main), 0.08),
					},
				}),
			},
			{
				props: { color: 'info' },
				style: ({ theme }: OwnerStateThemeType) => ({
					'&:hover': {
						backgroundColor: hexToRGBA(extractRGB(theme.palette.info.main), 0.08),
					},
				}),
			},
		],
		styleOverrides: {
			root: ({ theme }: OwnerStateThemeType) => ({
				'&:hover': {
					// extractRGB burada kullanıldı
					backgroundColor: `rgba(${extractRGB(theme.palette.customColors.main)}, 0.08)`,
				},
			}),
		},
	},
};

export default IconButton;
