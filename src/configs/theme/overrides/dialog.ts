import { extractRGB } from 'utils/extract-rgb'; // extractRGB eklendi

import { Skin } from '../types';
import { OwnerStateThemeType } from './';

const Dialog = (skin: Skin) => {
	return {
		MuiDialog: {
			styleOverrides: {
				paper: ({ theme }: OwnerStateThemeType) => ({
					// Eğer divider RGBA formatında sorun çıkarıyorsa extractRGB'yi uygula
					boxShadow: theme.shadows[skin === 'bordered' ? 0 : 18],
					...(skin === 'bordered' && { border: `1px solid ${extractRGB(theme.palette.divider)}` }),
					'&:not(.MuiDialog-paperFullScreen)': {
						[theme.breakpoints.down('sm')]: {
							margin: theme.spacing(4),
							width: `calc(100% - ${theme.spacing(8)})`,
							maxWidth: `calc(100% - ${theme.spacing(8)}) !important`,
						},
					},
					'& > .MuiList-root': {
						paddingLeft: theme.spacing(1),
						paddingRight: theme.spacing(1),
					},
				}),
			},
		},
		MuiDialogTitle: {
			styleOverrides: {
				root: ({ theme }: OwnerStateThemeType) => ({
					padding: theme.spacing(5, 6, 1),
				}),
			},
		},
		MuiDialogContent: {
			styleOverrides: {
				root: ({ theme }: OwnerStateThemeType) => ({
					padding: `${theme.spacing(5, 6)} !important`,
				}),
			},
		},
		MuiDialogActions: {
			styleOverrides: {
				root: ({ theme }: OwnerStateThemeType) => ({
					padding: theme.spacing(1, 6, 5),
					'&.dialog-actions-dense': {
						padding: theme.spacing(1, 2.5, 2.5),
					},
				}),
			},
		},
	};
};

export default Dialog;
