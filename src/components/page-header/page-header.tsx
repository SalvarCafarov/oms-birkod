import { Grid } from '@mui/material';
import { ReactNode } from 'react';

interface PageHeaderProps {
	title: ReactNode;
	subtitle?: ReactNode;
}

export const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
	return (
		<Grid item xs={12}>
			{title}
			{subtitle || null}
		</Grid>
	);
};
