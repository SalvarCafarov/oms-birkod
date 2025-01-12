import { extractRGB } from 'utils/extract-rgb';

import { OwnerStateThemeType } from './';

const input = () => {
	return {
		MuiInputLabel: {
			styleOverrides: {
				root: ({ theme }: OwnerStateThemeType) => ({
					transform: 'none',
					lineHeight: 1.154,
					marginBottom: theme.spacing(1),
					fontSize: theme.typography.body1.fontSize,
					color: `${theme.palette.text.primary} !important`,
				}),
				outlined: {
					'&.MuiInputLabel-shrink': {
						transform: 'translate(14px, -8px) scale(0.75)',
					},
				},
			},
		},
		MuiInput: {
			styleOverrides: {
				root: ({ theme }: OwnerStateThemeType) => ({
					'&:before': {
						borderBottom: `1px solid rgba(${extractRGB(theme.palette.customColors.main)}, 0.2)`,
					},
					'&:hover:not(.Mui-disabled):before': {
						borderBottom: `1px solid rgba(${extractRGB(theme.palette.customColors.main)}, 0.28)`,
					},
					'&.Mui-disabled:before': {
						borderBottomStyle: 'solid',
					},
				}),
			},
		},
		MuiFilledInput: {
			styleOverrides: {
				root: ({ theme }: OwnerStateThemeType) => ({
					'&:not(.MuiInputBase-sizeSmall)': {
						borderTopLeftRadius: 8,
						borderTopRightRadius: 8,
					},
					backgroundColor: `rgba(${extractRGB(theme.palette.customColors.main)}, 0.04)`,
					'&:hover:not(.Mui-disabled)': {
						backgroundColor: `rgba(${extractRGB(theme.palette.customColors.main)}, 0.08)`,
					},
					'&:before': {
						borderBottom: `1px solid rgba(${extractRGB(theme.palette.customColors.main)}, 0.2)`,
					},
					'&:hover:not(.Mui-disabled):before': {
						borderBottom: `1px solid rgba(${extractRGB(theme.palette.customColors.main)}, 0.28)`,
					},
				}),
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: ({ theme }: OwnerStateThemeType) => ({
					'&:not(.MuiInputBase-sizeSmall)': {
						borderRadius: 8,
					},
					'&:hover:not(.Mui-focused):not(.Mui-disabled):not(.Mui-error) .MuiOutlinedInput-notchedOutline': {
						borderColor: `rgba(${extractRGB(theme.palette.customColors.main)}, 0.28)`,
					},
					'&:hover.Mui-error .MuiOutlinedInput-notchedOutline': {
						borderColor: theme.palette.error.main,
					},
					'& .MuiOutlinedInput-notchedOutline': {
						borderColor: `rgba(${extractRGB(theme.palette.customColors.main)}, 0.2)`,
					},
					'&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
						borderColor: theme.palette.text.disabled,
					},
					'&.Mui-focused': {
						boxShadow: theme.shadows[2],
					},
				}),
			},
		},

		// Radio, Checkbox & Switch
		MuiFormControlLabel: {
			styleOverrides: {
				label: ({ theme }: OwnerStateThemeType) => ({
					color: theme.palette.text.secondary,
				}),
			},
		},

		MuiTextField: {
			defaultProps: {
				fullWidth: true,
			},
		},
	};
};

export default input;
