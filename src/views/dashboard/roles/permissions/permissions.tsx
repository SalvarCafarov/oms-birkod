import { Box, Button, FormControlLabel, Grid, Switch } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { permissions } from 'api/services/permissions';
import { Spinner } from 'components/spinner';
import { queryClient } from 'main';
import { useTranslation } from 'react-i18next';
import { Role } from 'types';

interface Props {
	role?: Role;
	handleDialogToggle: () => void;
}

export const Permissions = ({ role, handleDialogToggle }: Props) => {
	const { t } = useTranslation('roles');

	const { data: rolePermissions, isPending } = useQuery({
		queryKey: [permissions.queryKey, role!.key],
		queryFn: () => permissions.getRolePermissions(role!.key),
		enabled: !!role,
	});

	const { mutate: addPermission } = useMutation({
		mutationFn: permissions.addPermission,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [permissions.queryKey, role!.key],
				exact: true,
			});
		},
	});

	const { mutate: removePermission } = useMutation({
		mutationFn: permissions.removePermission,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [permissions.queryKey, role!.key],
				exact: true,
			});
		},
	});

	const handleChange = (checked: boolean, permissionId: number) => {
		if (checked) {
			addPermission({
				roleId: role!.key,
				operationClaimId: permissionId,
			});
		} else {
			removePermission({
				roleId: role!.key,
				operationClaimId: permissionId,
			});
		}
	};

	return isPending ? (
		<Spinner />
	) : (
		<Grid container>
			{rolePermissions?.map((rp) => (
				<Grid key={rp.key} item xs={6}>
					<FormControlLabel
						control={
							<Switch
								checked={rp.checked}
								onChange={(_event, checked) => handleChange(checked, rp.key)}
							/>
						}
						label={t(rp.name)}
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
