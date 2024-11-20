import { Box, Card, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { roles } from 'api/services/roles';
import Icon from 'components/icon';
import { Modal } from 'components/modal/modal';
import { Spinner } from 'components/spinner';
import { useConfirmation } from 'configs/context/confirmationContext';
import { queryClient } from 'main';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Role } from 'types';

import { EditRole } from '../edit/edit-role';
import { Permissions } from '../permissions/permissions';
import { TableHeader } from './table-header';

interface CellType {
	row: Role;
}

export const Table = () => {
	const { t } = useTranslation();
	const { confirm } = useConfirmation();
	const [editOpen, setEditOpen] = useState<boolean>(false);
	const [permissionsOpen, setPermissionsOpen] = useState<boolean>(false);
	const [selectedRole, setSelectedRole] = useState<Role>();
	const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
		page: 0,
		pageSize: 10,
	});

	const { data: rolesData, isPending } = useQuery({
		queryKey: [roles.queryKey, paginationModel],
		queryFn: () => roles.getAll(paginationModel),
		placeholderData: keepPreviousData,
		staleTime: Infinity,
	});

	const { mutate: deleteRole } = useMutation({
		mutationFn: roles.delete,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [roles.queryKey] });
		},
	});

	const handleEditDialogToggle = () => setEditOpen((open) => !open);
	const handlePermissionsDialogToggle = () => setPermissionsOpen((open) => !open);

	const columns: GridColDef[] = [
		{
			flex: 0.3,
			field: 'name',
			minWidth: 200,
			headerName: t('roles:name'),
			renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.name}</Typography>,
		},
		{
			flex: 0.5,
			minWidth: 240,
			field: 'description',
			headerName: t('roles:description'),
			renderCell: ({ row }: CellType) => (
				<Typography sx={{ color: 'text.secondary' }}>{row.description || '-'}</Typography>
			),
		},
		{
			flex: 0.2,
			minWidth: 120,
			sortable: false,
			field: 'actions',
			headerName: t('actions'),
			renderCell: ({ row }: CellType) => (
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<IconButton
						onClick={() => {
							setSelectedRole(row);
							handlePermissionsDialogToggle();
						}}
					>
						<Icon icon="tabler:shield-plus" style={{ pointerEvents: 'none' }} />
					</IconButton>
					<IconButton
						onClick={() => {
							setSelectedRole(row);
							handleEditDialogToggle();
						}}
					>
						<Icon icon="tabler:edit" style={{ pointerEvents: 'none' }} />
					</IconButton>
					<IconButton
						onClick={(event) => {
							event.stopPropagation();
							confirm({
								confirmText: t('roles:delete'),
								onConfirm: () => {
									deleteRole(row.key, {
										onSuccess: () => {
											toast.success(t('successfullyDeleted'));
										},
									});
								},
							});
						}}
					>
						<Icon icon="tabler:trash" style={{ pointerEvents: 'none' }} />
					</IconButton>
				</Box>
			),
		},
	];

	return (
		<Card>
			<TableHeader />
			{isPending ? (
				<Spinner />
			) : (
				<>
					<DataGrid
						autoHeight
						disableRowSelectionOnClick
						disableColumnMenu
						rows={rolesData?.items || []}
						getRowId={(row) => row.key}
						columns={columns}
						paginationMode="server"
						rowCount={rolesData?.count}
						paginationModel={paginationModel}
						pageSizeOptions={[10, 25, 50, 100]}
						onPaginationModelChange={setPaginationModel}
					/>
					<Modal open={editOpen} title={t('edit')} onClose={handleEditDialogToggle}>
						<EditRole role={selectedRole} handleDialogToggle={handleEditDialogToggle} />
					</Modal>
					<Modal
						open={permissionsOpen}
						title={t('roles:permissions')}
						onClose={handlePermissionsDialogToggle}
					>
						<Permissions role={selectedRole} handleDialogToggle={handlePermissionsDialogToggle} />
					</Modal>
				</>
			)}
		</Card>
	);
};
