import { Box, Button } from '@mui/material';
import Icon from 'components/icon';
import { Modal } from 'components/modal/modal';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CreateBookingForm } from '../create/create-booking';

export const TableHeader = () => {
	const { t } = useTranslation();
	const [open, setOpen] = useState<boolean>(false);

	const handleDialogToggle = () => setOpen((open) => !open);

	return (
		<>
			<Box
				sx={{
					p: 5,
					pb: 3,
					display: 'flex',
					flexWrap: 'wrap',
					alignItems: 'center',
					justifyContent: 'right',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						gap: (theme) => theme.spacing(2),
					}}
				>
					<Button variant="contained" sx={{ mb: 2, '& svg': { mr: 2 } }} onClick={handleDialogToggle}>
						<Icon fontSize="1.125rem" icon="tabler:plus" />
						{t('add')}
					</Button>
				</Box>
			</Box>
			<Modal maxWidth={'lg'} open={open} title={t('roles:add')} onClose={handleDialogToggle}>
				<CreateBookingForm handleDialogToggle={handleDialogToggle} />
			</Modal>
		</>
	);
};
