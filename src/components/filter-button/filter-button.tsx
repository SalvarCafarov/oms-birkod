import { Button } from '@mui/material';
import { useAppDispatch } from 'app/hooks';
import Icon from 'components/icon';
import { openFilterSidebar } from 'context/settings/settingsSlice';
import { useTranslation } from 'react-i18next';

export const FilterButton = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const handleFilterOpen = () => {
		dispatch(openFilterSidebar());
	};

	return (
		<Button variant="contained" sx={{ mb: 2, '& svg': { mr: 2 } }} onClick={handleFilterOpen}>
			<Icon fontSize="1.125rem" icon="tabler:filter" />
			{t('filters')}
		</Button>
	);
};
