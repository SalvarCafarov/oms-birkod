import { extractRGB } from 'utils/extract-rgb';

import { OwnerStateThemeType } from './';

const Switch = () => {
	return {
		MuiSwitch: {
			styleOverrides: {
				root: ({ theme }: OwnerStateThemeType) => ({
					width: 54,
					height: 42,
					'& .MuiSwitch-track': {
						width: 30,
						height: 18,
						opacity: 1,
						borderRadius: 30,
						backgroundColor: theme.palette.background.paper,
						border: `1px solid ${
							theme.palette.mode === 'dark' ? theme.palette.divider : theme.palette.grey[300]
						}`,
						transition:
							'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out, background-color 0.15s ease-in-out',
					},
				}),
				switchBase: ({ theme }: OwnerStateThemeType) => ({
					top: 5,
					left: 6,
					padding: `${theme.spacing(2.5)} !important`,
					transition: 'left 0.15s ease-in-out, transform 0.15s ease-in-out, color 0.15s ease-in-out',
					color: `${theme.palette.text.disabled}`,
					'&:hover': {
						backgroundColor: 'transparent !important',
					},
					'&.Mui-disabled': {
						color: theme.palette.action.disabled,
						'& + .MuiSwitch-track': {
							borderColor: 'transparent !important',
							backgroundColor: theme.palette.action.disabledBackground,
						},
						'&, & + .MuiSwitch-track': {
							opacity: 0.5,
						},
						'&.Mui-checked': {
							opacity: theme.palette.mode === 'dark' ? 0.5 : 0.9,
							'& + .MuiSwitch-track': {
								opacity: 0.3,
								boxShadow: 'none',
							},
						},
					},
					'&.Mui-checked': {
						transform: 'translateX(11px)',
						color: `${theme.palette.common.white} !important`,
						'& + .MuiSwitch-track': {
							opacity: 1,
							boxShadow: theme.shadows[2],
							borderColor: theme.palette.primary.main,
							backgroundColor: `rgba(${extractRGB(theme.palette.primary.main)}, 0.99)`,
						},
						'&.MuiSwitch-colorSecondary + .MuiSwitch-track': {
							borderColor: theme.palette.secondary.main,
							backgroundColor: `rgba(${extractRGB(theme.palette.secondary.main)}, 0.99)`,
						},
						'&.MuiSwitch-colorSuccess + .MuiSwitch-track': {
							borderColor: theme.palette.success.main,
							backgroundColor: `rgba(${extractRGB(theme.palette.success.main)}, 0.99)`,
						},
						'&.MuiSwitch-colorError + .MuiSwitch-track': {
							borderColor: theme.palette.error.main,
							backgroundColor: `rgba(${extractRGB(theme.palette.error.main)}, 0.99)`,
						},
						'&.MuiSwitch-colorWarning + .MuiSwitch-track': {
							borderColor: theme.palette.warning.main,
							backgroundColor: `rgba(${extractRGB(theme.palette.warning.main)}, 0.99)`,
						},
						'&.MuiSwitch-colorInfo + .MuiSwitch-track': {
							borderColor: theme.palette.info.main,
							backgroundColor: `rgba(${extractRGB(theme.palette.info.main)}, 0.99)`,
						},
					},
					'&.Mui-checked + .MuiSwitch-track': {
						opacity: 1,
					},
					'&:not(.Mui-checked) + .MuiSwitch-track': {
						opacity: 1,
					},
				}),
				thumb: {
					width: 12,
					height: 12,
					boxShadow: 'none',
				},
				sizeSmall: ({ theme }: OwnerStateThemeType) => ({
					width: 38,
					height: 30,
					'& .MuiSwitch-track': {
						width: 24,
						height: 16,
					},
					'& .MuiSwitch-thumb': {
						width: 10,
						height: 10,
					},
					'& .MuiSwitch-switchBase': {
						top: 4,
						left: 5,
						padding: `${theme.spacing(1.5)} !important`,
						'&.Mui-checked': {
							transform: 'translateX(7px)',
						},
					},
				}),
			},
		},
	};
};

export default Switch;
