import { Box, Button, FormControlLabel, Grid, Switch } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { userRoles } from 'api/services/user-roles';
import { Spinner } from 'components/spinner';
import { queryClient } from 'main';
import { useTranslation } from 'react-i18next';
import { User } from 'types';

interface Props {
	user?: User;
	handleDialogToggle: () => void;
}

export const UserRoles = ({ user, handleDialogToggle }: Props) => {
	const { t } = useTranslation();

	const { data: userRolesData, isPending } = useQuery({
		queryKey: [userRoles.queryKey, user!.key],
		queryFn: () => userRoles.getUserRoles(user!.key),
		enabled: !!user,
	});

	const { mutate: addUserRole } = useMutation({
		mutationFn: userRoles.addUserRole,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [userRoles.queryKey, user!.key],
				exact: true,
			});
		},
	});

	const { mutate: deleteUserRole } = useMutation({
		mutationFn: userRoles.deleteUserRole,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [userRoles.queryKey, user!.key],
				exact: true,
			});
		},
	});

	const handleChange = (checked: boolean, roleId: number) => {
		if (checked) {
			addUserRole({
				userId: user!.key,
				roleId: roleId,
			});
		} else {
			deleteUserRole({
				userId: user!.key,
				roleId: roleId,
			});
		}
	};

	return isPending ? (
		<Spinner />
	) : (
		<Grid container>
			{userRolesData?.map((ur) => (
				<Grid key={ur.key} item xs={6}>
					<FormControlLabel
						control={
							<Switch
								checked={ur.checked}
								onChange={(_event, checked) => handleChange(checked, ur.key)}
							/>
						}
						label={ur.name}
					/>
				</Grid>
			))}
			<Box
				sx={{
					mt: 4,
					mx: 'auto',
					width: '100%',
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				<Button variant="tonal" color="secondary" onClick={handleDialogToggle}>
					{t('close')}
				</Button>
			</Box>
		</Grid>
	);
};
