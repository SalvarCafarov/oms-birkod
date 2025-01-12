import { extractRGB } from 'utils/extract-rgb';

import { OwnerStateThemeType } from './';

const Table = () => {
	return {
		MuiTableContainer: {
			styleOverrides: {
				root: ({ theme }: OwnerStateThemeType) => ({
					boxShadow: theme.shadows[0],
					borderTopColor: theme.palette.divider,
				}),
			},
		},
		MuiTableHead: {
			styleOverrides: {
				root: ({ theme }: OwnerStateThemeType) => ({
					textTransform: 'uppercase',
					'& .MuiTableCell-head': {
						fontWeight: 500,
						letterSpacing: '1px',
						fontSize: theme.typography.body2.fontSize,
					},
				}),
			},
		},
		MuiTableBody: {
			styleOverrides: {
				root: ({ theme }: OwnerStateThemeType) => ({
					'& .MuiTableCell-body': {
						letterSpacing: '0.25px',
						color: theme.palette.text.secondary,
						'&:not(.MuiTableCell-sizeSmall):not(.MuiTableCell-paddingCheckbox):not(.MuiTableCell-paddingNone)':
							{
								paddingTop: theme.spacing(3.5),
								paddingBottom: theme.spacing(3.5),
							},
					},
				}),
			},
		},
		MuiTableRow: {
			styleOverrides: {
				root: ({ theme }: OwnerStateThemeType) => ({
					'& .MuiTableCell-head:not(.MuiTableCell-paddingCheckbox):first-of-type, & .MuiTableCell-root:not(.MuiTableCell-paddingCheckbox):first-of-type ':
						{
							paddingLeft: theme.spacing(6),
						},
					'& .MuiTableCell-head:last-child, & .MuiTableCell-root:last-child': {
						paddingRight: theme.spacing(6),
					},
				}),
			},
		},
		MuiTableCell: {
			styleOverrides: {
				root: ({ theme }: OwnerStateThemeType) => ({
					// extractRGB kullanılarak rgba formatı düzeltiliyor
					borderBottom: `1px solid rgba(${extractRGB(theme.palette.divider)}, 0.99)`,
				}),
				paddingCheckbox: ({ theme }: OwnerStateThemeType) => ({
					paddingLeft: theme.spacing(3.25),
				}),
				stickyHeader: ({ theme }: OwnerStateThemeType) => ({
					// extractRGB kullanımı
					backgroundColor: `rgba(${extractRGB(theme.palette.customColors.tableHeaderBg)}, 0.99)`,
				}),
			},
		},
	};
};

export default Table;
