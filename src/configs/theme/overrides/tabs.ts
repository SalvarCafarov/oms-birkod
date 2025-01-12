import { extractRGB } from 'utils/extract-rgb';

import { OwnerStateThemeType } from './';

const Tabs = () => {
	return {
		MuiTabs: {
			styleOverrides: {
				root: ({ theme }: OwnerStateThemeType) => ({
					minHeight: 38,
					'&:not(.MuiTabs-vertical)': {
						// extractRGB ile borderBottom düzenlendi
						borderBottom: `1px solid rgba(${extractRGB(theme.palette.divider)}, 0.99)`,
					},
				}),
				vertical: ({ theme }: OwnerStateThemeType) => ({
					minWidth: 130,
					marginRight: theme.spacing(4),
					// extractRGB ile borderRight düzenlendi
					borderRight: `1px solid rgba(${extractRGB(theme.palette.divider)}, 0.99)`,
					'& .MuiTab-root': {
						minWidth: 130,
					},
				}),
			},
		},
		MuiTab: {
			styleOverrides: {
				root: ({ theme }: OwnerStateThemeType) => ({
					minHeight: 38,
					textTransform: 'none',
					padding: theme.spacing(1.75, 5),
				}),
				textColorSecondary: ({ theme }: OwnerStateThemeType) => ({
					'&.Mui-selected': {
						color: theme.palette.text.secondary,
					},
				}),
			},
		},
		MuiTabPanel: {
			styleOverrides: {
				root: ({ theme }: OwnerStateThemeType) => ({
					padding: theme.spacing(6),
				}),
			},
		},
	};
};

export default Tabs;
