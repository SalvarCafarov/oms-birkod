import { Divider, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import { useMutation } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import Icon from 'components/icon';
import { LogoutDialog } from 'components/logout-dialog';
import { REFRESH_TOKEN_KEY } from 'configs/constants';
import { logout, logoutAsync, selectCurrentUser } from 'context/auth/authSlice';
import { SyntheticEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

const BadgeContentSpan = styled('span')(({ theme }) => ({
	width: 8,
	height: 8,
	borderRadius: '50%',
	backgroundColor: theme.palette.success.main,
	boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
}));

const MenuItemStyled = styled(MenuItem)<MenuItemProps>(({ theme }) => ({
	'&:hover .MuiBox-root, &:hover .MuiBox-root svg': {
		color: theme.palette.primary.main,
	},
}));

const UserMenu = () => {
	const [anchorEl, setAnchorEl] = useState<Element | null>(null);
	const [openDialog, setOpenDialog] = useState(false);

	const { t } = useTranslation();
	const user = useAppSelector(selectCurrentUser)!;
	const dispatch = useAppDispatch();

	const { mutate: logoutAndRevoke } = useMutation({
		mutationFn: (refreshToken: string) => {
			return dispatch(logoutAsync(refreshToken));
		},
	});

	const handleDropdownOpen = (event: SyntheticEvent) => {
		setAnchorEl(event.currentTarget);
	};

	const handleDropdownClose = () => {
		setAnchorEl(null);
	};

	const styles = {
		px: 4,
		py: 1.75,
		width: '100%',
		display: 'flex',
		alignItems: 'center',
		color: 'text.primary',
		textDecoration: 'none',
		'& svg': {
			mr: 2.5,
			fontSize: '1.5rem',
			color: 'text.secondary',
		},
	};

	const handleLogout = () => {
		const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
		if (refreshToken) {
			logoutAndRevoke(refreshToken);
		} else {
			dispatch(logout());
		}
	};

	const handleOpenDialog = () => {
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	const initials =
		user?.name.split(' ').length > 1
			? user.name.split(' ')[0][0] + user?.name.split(' ')[1][0]
			: user?.name.split(' ')[0][0];

	return (
		<>
			<Badge
				overlap="circular"
				sx={{ ml: 2, cursor: 'pointer' }}
				badgeContent={<BadgeContentSpan />}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				onClick={handleDropdownOpen}
			>
				<Avatar
					sx={{
						width: 38,
						height: 38,
						bgcolor: (theme) => theme.palette.primary.main,
						color: (theme) => theme.palette.common.white,
					}}
					onClick={handleDropdownOpen}
				>
					{initials}
				</Avatar>
			</Badge>
			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				sx={{ '& .MuiMenu-paper': { width: 230, mt: 4.75 } }}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				onClose={() => handleDropdownClose()}
			>
				<Box sx={{ py: 1.75, px: 6 }}>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<Badge
							overlap="circular"
							badgeContent={<BadgeContentSpan />}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'right',
							}}
						>
							<Avatar
								sx={{
									width: '2.5rem',
									height: '2.5rem',
									bgcolor: (theme) => theme.palette.primary.main,
									color: (theme) => theme.palette.common.white,
								}}
							>
								{initials}
							</Avatar>
						</Badge>
						<Box sx={{ display: 'flex', ml: 2.5, alignItems: 'flex-start', flexDirection: 'column' }}>
							<Typography sx={{ fontWeight: 500 }}>{user?.name}</Typography>
							<Typography variant="body2">{user?.role}</Typography>
						</Box>
					</Box>
				</Box>
				<Divider sx={{ my: (theme) => `${theme.spacing(2)} !important` }} />
				<MenuItemStyled sx={{ p: 0 }} onClick={handleOpenDialog}>
					<Box sx={styles}>
						<Icon icon="tabler:logout" />
						{t('signOut')}
					</Box>
				</MenuItemStyled>
			</Menu>
			<LogoutDialog open={openDialog} handleConfirm={handleLogout} handleClose={handleCloseDialog} />
		</>
	);
};

export default UserMenu;
