import { Theme } from '@mui/material/styles';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GlobalStyles = (theme: Theme) => {
	console.log(theme.palette);

	return {
		'.demo-space-x > *': {
			marginTop: '1rem !important',
			marginRight: '1rem !important',
		},
		'.demo-space-y > *:not(:last-of-type)': {
			marginBottom: '1rem',
		},
		'.MuiGrid-container.match-height .MuiCard-root': {
			height: '100%',
		},
		'.iconify g, .iconify path': {
			strokeWidth: 1.5,
		},
		'& .recharts-cartesian-grid-vertical, & .recharts-cartesian-grid-horizontal, & .recharts-polar-grid-angle, & .recharts-polar-radius-axis, & .recharts-cartesian-axis':
			{
				'& line': {
					stroke: theme.palette.divider,
				},
			},
		'& .recharts-polar-grid-concentric-polygon': {
			stroke: theme.palette.divider,
		},
		'& .recharts-tooltip-wrapper': {
			outline: 'none',
		},
		'& .recharts-default-tooltip': {
			border: 'none !important',
			boxShadow: theme.shadows[3],
			borderRadius: theme.shape.borderRadius,
			backgroundColor: `${theme.palette.background.paper} !important`,
		},
		'& .recharts-custom-tooltip': {
			padding: theme.spacing(2.5),
			boxShadow: theme.shadows[3],
			borderRadius: theme.shape.borderRadius,
			backgroundColor: theme.palette.background.paper,
		},
		'& .recharts-tooltip-cursor': {
			fill: theme.palette.action.hover,
		},
		'& .recharts-yAxis .recharts-cartesian-axis-ticks .recharts-cartesian-axis-tick .recharts-cartesian-axis-tick-value':
			{
				textAnchor: theme.direction === 'rtl' ? 'end' : undefined,
			},
		'& .recharts-active-dot .recharts-dot': {
			fill: theme.palette.secondary.main,
		},
		'& .recharts-tooltip-item': {
			fontSize: theme.typography.body2.fontSize,
			color: `${theme.palette.text.primary} !important`,
		},
		'& .recharts-text': {
			fill: theme.palette.text.disabled,
			fontSize: theme.typography.body2.fontSize,
		},
	};
};

export default GlobalStyles;
