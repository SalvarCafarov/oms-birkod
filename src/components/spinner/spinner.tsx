import Box, { BoxProps } from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export const Spinner = ({ sx, page = false }: { sx?: BoxProps['sx'] } & { page?: boolean }) => {
	return (
		<Box
			sx={{
				height: page ? '100vh' : 'initial',
				display: 'flex',
				alignItems: 'center',
				flexDirection: 'column',
				justifyContent: 'center',
				mb: page ? 0 : 10,
				...sx,
			}}
		>
			<CircularProgress disableShrink />
		</Box>
	);
};
