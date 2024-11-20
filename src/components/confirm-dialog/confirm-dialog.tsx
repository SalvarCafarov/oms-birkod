import { Box, Button, Dialog as MUIDialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ConfirmIcon from 'assets/icons/confirm.svg?react';
import DeleteIcon from 'assets/icons/delete.svg?react';
import { useTranslation } from 'react-i18next';

export type ConfirmDialogType = 'error' | 'success';
export type ConfirmDialogDescription = string | undefined;

const Dialog = styled(MUIDialog)(({ theme }) => ({
	'& .MuiPaper-root': {
		width: 368,
	},
	'& .header': {
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'column',
		'& p': {
			marginTop: theme.spacing(1.5),
			fontWeight: 600,
		},
	},
	'& .header-wrapper': {
		padding: theme.spacing(3.5, 3.75),
		paddingBottom: 0,
		marginBottom: theme.spacing(0.5),
	},
	'& .content-wrapper': {
		padding: theme.spacing(3.5, 3.75),
		paddingTop: 0,
	},
	'& .content': {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column',
	},
	'& .description': {
		marginBottom: theme.spacing(4),
		textAlign: 'center',
		color: '#7A8892',
	},
	'& .name': {
		fontWeight: 600,
		marginBottom: theme.spacing(1.5),
		color: '#36566D',
	},
	'& .buttons': {
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		gap: theme.spacing(2),
	},
}));

type ConfirmDialogProps = {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	confirmText?: string;
	confirmButtonText?: string;
	description?: ConfirmDialogDescription;
	type?: ConfirmDialogType;
	name?: string;
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
	open,
	confirmText,
	confirmButtonText,
	description,
	type = 'error',
	onClose,
	onConfirm,
	name,
}) => {
	const { t } = useTranslation();

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle className="header-wrapper">
				<Box className="header">
					{type === 'success' ? (
						<Box
							sx={{
								fill: 'green',
								width: 40,
								height: 40,
							}}
						>
							<ConfirmIcon />
						</Box>
					) : (
						<Box
							sx={{
								fill: 'red',
								width: 40,
								height: 40,
							}}
						>
							<DeleteIcon
								width={'100%'}
								style={{
									position: 'relative',
									height: '100%',
								}}
							/>
						</Box>
					)}
					<Typography>{confirmText || t('confirmText')}</Typography>
				</Box>
			</DialogTitle>
			<DialogContent className="content-wrapper">
				<Box className="content">
					{name && <Typography className="name">{name}</Typography>}
					<Typography className="description">{description || t('descriptionText')}</Typography>
					<Box className="buttons">
						<Button variant="tonal" color="secondary" onClick={onClose}>
							{t('cancel')}
						</Button>
						<Button
							variant="contained"
							color={type === 'success' ? 'primary' : 'error'}
							onClick={onConfirm}
						>
							{confirmButtonText || t('delete')}
						</Button>
					</Box>
				</Box>
			</DialogContent>
		</Dialog>
	);
};
