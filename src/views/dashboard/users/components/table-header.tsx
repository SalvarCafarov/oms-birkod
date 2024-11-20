import { Box } from '@mui/material';
import { FilterButton } from 'components/filter-button';

export const TableHeader = () => {
	return (
		<>
			<Box
				sx={{
					p: 5,
					pb: 2,
					display: 'flex',
					flexWrap: 'wrap',
					flexDirection: { xs: 'column', sm: 'row' },
					justifyContent: 'end',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: { xs: 'column', sm: 'row' },
						gap: (theme) => theme.spacing(2),
					}}
				>
					<FilterButton />
				</Box>
			</Box>
		</>
	);
};
