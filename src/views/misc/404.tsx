import Box, { BoxProps } from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

const Root = styled(Box)<BoxProps>(({ theme }) => ({
	minHeight: '100vh',
	padding: theme.spacing(5),
	'& .box-wrapper': {
		[theme.breakpoints.down('md')]: {
			width: '90vw',
		},
	},
}));

const Error404 = () => {
	const { t } = useTranslation();

	return (
		<Root>
			<Box sx={{ p: 5, textAlign: 'center' }}>
				<Box className="box-wrapper">
					<Typography variant="h2" sx={{ mb: 1.5 }}>
						{t('notFound')}
					</Typography>
					<Typography sx={{ mb: 6, color: 'text.secondary' }}>{t('urlNotFound')}</Typography>
					<Button to="/" variant="contained" component={RouterLink}>
						{t('backToHome')}
					</Button>
				</Box>
			</Box>
		</Root>
	);
};

export default Error404;
