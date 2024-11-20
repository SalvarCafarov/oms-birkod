import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { LanguageMenu } from 'components/language-menu';
import { Outlet } from 'react-router-dom';

const Root = styled(Box)<BoxProps>(({ theme }) => ({
	height: '100vh',
	'& .app-content': {
		minHeight: '100vh',
		overflow: 'hidden',
		position: 'relative',
		'& .content-center': {
			display: 'flex',
			minHeight: '100vh',
			alignItems: 'center',
			justifyContent: 'center',
			padding: theme.spacing(5),
		},
		'& .language-menu-wrapper': {
			position: 'absolute',
			top: '4%',
			right: '5%',
			backgroundColor: theme.palette.background.paper,
			borderRadius: 8,
			padding: theme.spacing(1),
			boxShadow: theme.shadows[1],
		},
	},
}));

const AuthLayout = () => {
	return (
		<Root>
			<Box className="app-content">
				<Box className="content-center">
					<Outlet />
				</Box>
				<Box className="language-menu-wrapper">
					<LanguageMenu />
				</Box>
			</Box>
		</Root>
	);
};

export default AuthLayout;
