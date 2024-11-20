import { Box, Grid, IconButton, Typography } from '@mui/material';
import { useAppDispatch } from 'app/hooks';
import Icon from 'components/icon';
import { closeFilterSidebar } from 'context/settings/settingsSlice';
import { useTranslation } from 'react-i18next';

export const FilterHeader = () => {
	const dispatch = useAppDispatch();
	const { t } = useTranslation();

	return (
		<Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 3 }}>
			<Grid
				container
				sx={{
					padding: ' 0 0.5rem',
				}}
			>
				<Grid item xs={11}>
					<Typography variant="h4" component="h4">
						{t('filterName')}
					</Typography>
				</Grid>
				<Grid item xs={1}>
					<IconButton
						onClick={() => {
							dispatch(closeFilterSidebar());
						}}
					>
						<Icon fontSize="1.125rem" icon="tabler:x" />
					</IconButton>
				</Grid>
			</Grid>
		</Box>
	);
};
