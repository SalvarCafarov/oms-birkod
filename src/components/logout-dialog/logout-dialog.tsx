/// <reference types="vite-plugin-svgr/client" />
import { Box, Button, Dialog as MUIDialog, DialogContent, DialogProps, DialogTitle, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import LogoutIcon from 'assets/icons/logout.svg?react';
import { useTranslation } from 'react-i18next';

type LogoutDialogProps = {
	open: boolean;
	handleConfirm: () => void;
	handleClose: () => void;
};

const Dialog = styled(MUIDialog)<DialogProps>(({ theme }) => ({
	'& .MuiPaper-root': {
		padding: theme.spacing(8, 1.25),
		width: 368,
	},
	'& .header': {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	'& .content': {
		padding: 0,
		paddingBottom: theme.spacing(4),
	},
	'& .dialog-title': {
		textAlign: 'center',
		marginBottom: theme.spacing(0.5),
	},
	'& .dialog-description': {
		textAlign: 'center',
	},
	'& .button-box': {
		display: 'flex',
		justifyContent: 'center',
		gap: theme.spacing(1),
		'& .action-button': {
			width: 112,
		},
	},
	'& .title': {
		padding: 0,
		paddingBottom: theme.spacing(1.5),
	},
}));

export const LogoutDialog = ({ open, handleConfirm, handleClose }: LogoutDialogProps) => {
	const { t } = useTranslation();

	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle className="title">
				<Box className="header">
					<LogoutIcon />
				</Box>
			</DialogTitle>
			<DialogContent className="content">
				<Typography variant="h5" className="dialog-title">
					{t('signOut')}
				</Typography>
				<Typography className="dialog-description">{t('signOutDescription')}</Typography>
			</DialogContent>
			<Box className="button-box">
				<Button
					disableElevation
					variant="contained"
					color="secondary"
					className="action-button"
					onClick={handleClose}
				>
					{t('no')}
				</Button>
				<Button
					disableElevation
					variant="contained"
					color="error"
					className="action-button"
					onClick={handleConfirm}
				>
					{t('yes')}
				</Button>
			</Box>
		</Dialog>
	);
};
