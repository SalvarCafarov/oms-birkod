import { extractRGB } from 'utils/extract-rgb';

import { OwnerStateThemeType } from './';

const Timeline = () => {
	return {
		MuiTimeline: {
			styleOverrides: {
				root: {
					margin: 0,
					padding: 0,
				},
			},
		},
		MuiTimelineItem: {
			styleOverrides: {
				root: ({ theme }: OwnerStateThemeType) => ({
					'&:last-of-type': {
						minHeight: 0,
					},
					'&:not(:last-of-type) .MuiTimelineContent-root': {
						marginBottom: theme.spacing(4),
					},
				}),
			},
		},
		MuiTimelineConnector: {
			styleOverrides: {
				root: ({ theme }: OwnerStateThemeType) => ({
					backgroundColor: `rgba(${extractRGB(theme.palette.divider)}, 0.99)`,
				}),
			},
		},
		MuiTimelineContent: {
			styleOverrides: {
				root: ({ theme }: OwnerStateThemeType) => ({
					marginTop: theme.spacing(0.5),
				}),
			},
		},
		MuiTimelineDot: {
			styleOverrides: {
				filledPrimary: ({ theme }: OwnerStateThemeType) => ({
					boxShadow: `0 0 0 3px rgba(${extractRGB(theme.palette.primary.main)}, 0.16)`,
				}),
				filledSecondary: ({ theme }: OwnerStateThemeType) => ({
					boxShadow: `0 0 0 3px rgba(${extractRGB(theme.palette.secondary.main)}, 0.16)`,
				}),
				filledSuccess: ({ theme }: OwnerStateThemeType) => ({
					boxShadow: `0 0 0 3px rgba(${extractRGB(theme.palette.success.main)}, 0.16)`,
				}),
				filledError: ({ theme }: OwnerStateThemeType) => ({
					boxShadow: `0 0 0 3px rgba(${extractRGB(theme.palette.error.main)}, 0.16)`,
				}),
				filledWarning: ({ theme }: OwnerStateThemeType) => ({
					boxShadow: `0 0 0 3px rgba(${extractRGB(theme.palette.warning.main)}, 0.16)`,
				}),
				filledInfo: ({ theme }: OwnerStateThemeType) => ({
					boxShadow: `0 0 0 3px rgba(${extractRGB(theme.palette.info.main)}, 0.16)`,
				}),
				filledGrey: ({ theme }: OwnerStateThemeType) => ({
					boxShadow: `0 0 0 3px rgba(${extractRGB(theme.palette.grey[400])}, 0.16)`,
				}),
				outlinedPrimary: ({ theme }: OwnerStateThemeType) => ({
					'& svg': { color: theme.palette.primary.main },
				}),
				outlinedSecondary: ({ theme }: OwnerStateThemeType) => ({
					'& svg': { color: theme.palette.secondary.main },
				}),
				outlinedSuccess: ({ theme }: OwnerStateThemeType) => ({
					'& svg': { color: theme.palette.success.main },
				}),
				outlinedError: ({ theme }: OwnerStateThemeType) => ({
					'& svg': { color: theme.palette.error.main },
				}),
				outlinedWarning: ({ theme }: OwnerStateThemeType) => ({
					'& svg': { color: theme.palette.warning.main },
				}),
				outlinedInfo: ({ theme }: OwnerStateThemeType) => ({
					'& svg': { color: theme.palette.info.main },
				}),
				outlinedGrey: ({ theme }: OwnerStateThemeType) => ({
					'& svg': { color: theme.palette.grey[400] },
				}),
			},
		},
	};
};

export default Timeline;
