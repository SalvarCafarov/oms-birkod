import { extractRGB } from 'utils/extract-rgb'; // extractRGB fonksiyonunu ekle
import { hexToRGBA } from 'utils/hex-to-rgba';

import { OwnerStateThemeType } from './';

const Chip = () => {
	return {
		MuiChip: {
			styleOverrides: {
				root: ({ theme, ownerState }: OwnerStateThemeType) => ({
					fontWeight: 500,
					fontSize: theme.typography.body2.fontSize,
					...(ownerState.size === 'medium' && {
						height: 30,
					}),
					'&.MuiChip-rounded': {
						borderRadius: 4,
					},
				}),
				outlined: ({ theme }: OwnerStateThemeType) => ({
					// extractRGB yalnızca gerektiği yerde uygular
					'&.MuiChip-colorDefault': {
						borderColor: `rgba(${extractRGB(theme.palette.customColors.main)}, 0.99)`,
					},
				}),
				labelSmall: ({ theme }: OwnerStateThemeType) => ({
					paddingLeft: theme.spacing(2.5),
					paddingRight: theme.spacing(2.5),
				}),
				deleteIcon: {
					width: 18,
					height: 18,
				},
				avatar: ({ theme }: OwnerStateThemeType) => ({
					color: theme.palette.text.primary,
				}),
				deletableColorPrimary: ({ theme }: OwnerStateThemeType) => ({
					'&.MuiChip-light .MuiChip-deleteIcon': {
						color: hexToRGBA(extractRGB(theme.palette.primary.main), 0.7),
						'&:hover': {
							color: theme.palette.primary.main,
						},
					},
				}),
				deletableColorSecondary: ({ theme }: OwnerStateThemeType) => ({
					'&.MuiChip-light .MuiChip-deleteIcon': {
						color: hexToRGBA(extractRGB(theme.palette.secondary.main), 0.7),
						'&:hover': {
							color: theme.palette.secondary.main,
						},
					},
				}),
				deletableColorSuccess: ({ theme }: OwnerStateThemeType) => ({
					'&.MuiChip-light .MuiChip-deleteIcon': {
						color: hexToRGBA(extractRGB(theme.palette.success.main), 0.7),
						'&:hover': {
							color: theme.palette.success.main,
						},
					},
				}),
				deletableColorError: ({ theme }: OwnerStateThemeType) => ({
					'&.MuiChip-light .MuiChip-deleteIcon': {
						color: hexToRGBA(extractRGB(theme.palette.error.main), 0.7),
						'&:hover': {
							color: theme.palette.error.main,
						},
					},
				}),
				deletableColorWarning: ({ theme }: OwnerStateThemeType) => ({
					'&.MuiChip-light .MuiChip-deleteIcon': {
						color: hexToRGBA(extractRGB(theme.palette.warning.main), 0.7),
						'&:hover': {
							color: theme.palette.warning.main,
						},
					},
				}),
				deletableColorInfo: ({ theme }: OwnerStateThemeType) => ({
					'&.MuiChip-light .MuiChip-deleteIcon': {
						color: hexToRGBA(extractRGB(theme.palette.info.main), 0.7),
						'&:hover': {
							color: theme.palette.info.main,
						},
					},
				}),
			},
		},
	};
};

export default Chip;
