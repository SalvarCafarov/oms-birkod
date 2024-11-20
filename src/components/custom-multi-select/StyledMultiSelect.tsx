import 'primereact/resources/themes/saga-blue/theme.css'; // Tema stili
import 'primereact/resources/primereact.min.css'; // PrimeReact bileşenleri stili
import 'primeicons/primeicons.css';

import { styled } from '@mui/material';

const blue = {
	100: '#E1D5FF',
	200: '#B69FFF',
	400: '#7556FF',
	500: '#5C3DBE',
	600: '#51359B',
	900: '#2B1D53',
};

const grey = {
	0: '#06b5d400',
	50: '#F3F6F9',
	100: '#E5EAF2',
	200: '#DAE2ED',
	300: '#C7D0DD',
	400: '#B0B8C4',
	500: '#9DA8B7',
	600: '#6B7A90',
	700: '#434D5B',
	800: '#303740',
	900: '#1C2025',
};

export const StyledMultiSelect = styled('div')<{ error?: boolean }>(({ theme, error }) => ({
	position: 'relative',
	width: '100%',
	display: 'flex',
	flexDirection: 'column',
	fontSize: '1rem !important',

	'.no-data': {
		textAlign: 'center',
		padding: '10px',
		fontSize: '1.2rem',
		fontWeight: '100',
		fontFamily: `Public Sans,sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`,
	},

	'.options-container': {
		height: '300px',
		visibility: 'visible',
		border: `1px solid ${theme.palette.mode === 'dark' ? grey[600] : grey[200]}`,
		background: theme.palette.mode === 'dark' ? '#2F3349' : '#fff',
		overflow: 'hidden',
		position: 'absolute',
		width: '100%',
		zIndex: 1,
		boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
		maxHeight: '300px',
		marginTop: '40px',
		borderRadius: '0.375rem',
		transition: '0.2s all cubic-bezier(0.175, 0.885, 0.32, 1.275)',
		color: '#000000',
	},
	'.search-box': {
		border: `1px solid ${theme.palette.mode === 'dark' ? grey[600] : grey[200]}`,
		background: theme.palette.mode === 'dark' ? '#2F3349' : '#fff',
		display: 'flex',
		alignItems: 'center',
		padding: '8px',
		justifyContent: 'center',
		position: 'relative',
		width: '100%',

		input: {
			marginInline: '10px',
			transition: 'all 0.3s',

			'&:focus': {
				boxShadow: `0 0 0 0.1rem ${blue[200]} !important`,
				borderColor: `${blue[400]} !important`,
			},
		},

		'.pi-times': {
			transition: '0.3s cubic-bezier(0.075, 0.82, 0.165, 1) all',
			cursor: 'pointer',
			borderRadius: '50%',
			padding: '7px',
			color: theme.palette.mode === 'dark' ? grey[300] : grey[900],
			'&:hover': {
				color: 'black',
				borderColor: 'transparent',
				background: '#f3f4f6',
			},
		},
	},
	'.option': {
		display: 'flex',
		alignItems: 'center',
		padding: '8px',
		cursor: 'pointer',
		color: theme.palette.mode === 'dark' ? grey[300] : grey[900],
		transition: 'background-color 0.2s ease',
	},
	'.option-name': {
		marginLeft: '8px',
		display: 'flex',
		alignItems: 'center',
		paddingBlock: '2px !important',
		marginBlock: '0px !important',
	},
	' pi-times': {
		color: theme.palette.mode === 'dark' ? grey[0] : grey[900],
	},
	'.searchInput': {
		color: theme.palette.mode === 'dark' ? grey[300] : grey[900],
		background: theme.palette.mode === 'dark' ? 'transparent' : '#fff',
		border: `1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]}`,
		borderRadius: '8px',
	},
	input: {
		color: `${theme.palette.mode === 'dark' ? grey[300] : grey[900]}`,
		background: `${theme.palette.mode === 'dark' ? 'transparent' : '#fff'}`,
		border: `1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]}`,

		'&:hover': {
			borderColor: `${theme.palette.mode === 'dark' ? grey[600] : grey[300]}`,
		},
	},
	'.selected': {
		background: `${theme.palette.mode === 'dark' ? grey[700] : grey[200]}`,
	},

	'.checkbox': {
		display: 'inline-block',
		width: '16px',
		height: '16px',
		marginRight: '5px',
		verticalAlign: 'middle',
		border: '1px solid #ced4da',
		cursor: 'pointer',
		transition: 'background-color 0.2s ease',

		'&:checked': {
			backgroundColor: '#007bff',
			border: '1px solid #007bff',
		},
	},

	'.select-all-checkbox': {
		border: '2px solid #d1d5db',
		borderRadius: '6px',
	},
	'.error-message': {
		color: '#EA5455',
		fontSize: '0.8rem',
		marginTop: '5px',
	},

	'.options-box': {
		overflowY: 'scroll',
		maxHeight: '300px',
		background: 'white',
		border: '1px solid #ced4da',
		boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
		zIndex: 1,
		width: '100%',
		borderBottomLeftRadius: '0.375rem',
		borderBottomRightRadius: '0.375rem',

		'.option': {
			display: 'flex',
			alignItems: 'center',
			padding: '0',
			paddingLeft: '10px',
		},
	},
	'.multi-select-input': {
		background: theme.palette.mode === 'dark' ? 'transparent' : '#fff',
		border: `1px solid ${error ? '#EA5455' : theme.palette.mode === 'dark' ? grey[700] : grey[200]}`, // Change border color if there's an error

		width: '100%',
		padding: '9px',
		cursor: 'pointer',
		flex: 1,
		borderRadius: '0.375rem',
		outline: 'none',
		fontSize: '1rem !important',
		overflow: 'hidden', // Hide overflowing content
		textOverflow: 'ellipsis', // Add ellipsis for overflow
		whiteSpace: 'nowrap', // Prevent text wrapping
		position: 'relative',

		'&:hover .tooltip': {
			visibility: 'visible',
			opacity: 1,
		},
	},

	'.tooltip': {
		visibility: 'hidden',
		opacity: 0,
		backgroundColor: '#333',
		color: '#fff',
		textAlign: 'center',
		borderRadius: '5px',
		padding: '5px',
		position: 'absolute',
		width: 'max-content',
		maxWidth: '200px',
		left: '0',
		bottom: '100%',
		transform: 'translateY(-5px)',
		transition: 'opacity 0.3s',
		zIndex: 1000,
	},
}));
