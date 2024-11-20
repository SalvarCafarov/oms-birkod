import { Dialog, DialogContent, DialogTitle, IconButton, IconButtonProps, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Icon from 'components/icon';
import { ReactNode } from 'react';

const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
	top: 0,
	right: 0,
	color: 'grey.500',
	position: 'absolute',
	boxShadow: theme.shadows[2],
	transform: 'translate(10px, -10px)',
	borderRadius: theme.shape.borderRadius,
	backgroundColor: `${theme.palette.background.paper} !important`,
	transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
	'&:hover': {
		transform: 'translate(7px, -5px)',
	},
}));

interface ModalProps {
	open: boolean;
	title: string;
	onClose: () => void;
	children: ReactNode;
	maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal = ({ open, onClose, title, children, maxWidth }: ModalProps) => {
	return (
		<Dialog
			fullWidth
			maxWidth={maxWidth || 'sm'}
			open={open}
			sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
			onClose={onClose}
		>
			<DialogTitle
				component="div"
				sx={{
					textAlign: 'center',
					px: (theme) => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
					pt: (theme) => [`${theme.spacing(8)} !important`, `${theme.spacing(9)} !important`],
				}}
			>
				<Typography variant="h3" sx={{ mb: 2 }}>
					{title}
				</Typography>
			</DialogTitle>
			<DialogContent
				sx={{
					px: (theme) => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
					pb: (theme) => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`],
				}}
			>
				<CustomCloseButton onClick={onClose}>
					<Icon icon="tabler:x" fontSize="1.25rem" />
				</CustomCloseButton>
				{children}
			</DialogContent>
		</Dialog>
	);
};
