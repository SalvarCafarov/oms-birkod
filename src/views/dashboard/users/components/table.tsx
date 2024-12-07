import { Box, Card, IconButton } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Filter } from 'api/services/types';
import { users } from 'api/services/users';
import { useAppSelector } from 'app/hooks';
import Icon from 'components/icon';
import { Modal } from 'components/modal/modal';
import { Spinner } from 'components/spinner';
import { selectFilterData } from 'context/filter/filterSlice';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User } from 'types';

import { UserRoles } from '../user-roles/user-roles';
import { createDynamicFilterFromObject } from './createDynamicFilterFromObject';
import { TableHeader } from './table-header';

interface CellType {
	row: User;
}

export const Table = () => {
	const { t } = useTranslation();
	const [selectedUser, setSelectedUser] = useState<User>();
	const [userRoleOpen, setUserRoleOpen] = useState<boolean>(false);
	const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
		page: 0,
		pageSize: 10,
	});

	const filterDataRedux = useAppSelector(selectFilterData);

	const filterData: Filter = useMemo(() => {
		return createDynamicFilterFromObject(filterDataRedux.usersFilter, {}, [
			'name',
			'surname',
			'telephoneNo',
			'position',
			'email',
			'isActive',
			'department',
		]);
	}, [filterDataRedux.usersFilter]);

	const { data: usersData, isPending } = useQuery({
		queryKey: [users.queryKey, paginationModel, filterDataRedux],
		queryFn: () => users.getAll(paginationModel, filterData),
		placeholderData: keepPreviousData,
		staleTime: Infinity,
		enabled: filterDataRedux.usersFilter !== null,
	});

	const handleUserRoleDialogToggle = () => setUserRoleOpen((open) => !open);

	const columns: GridColDef[] = [
		{
			flex: 0.2,
			minWidth: 80,
			sortable: false,
			field: 'actions',
			headerName: t('actions'),
			renderCell: ({ row }: CellType) => (
				<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<IconButton
						onClick={() => {
							setSelectedUser(row);
							handleUserRoleDialogToggle();
						}}
					>
						<Icon icon="tabler:user-shield" style={{ pointerEvents: 'none' }} />
					</IconButton>
				</Box>
			),
		},
		{
			field: 'name',
			headerName: t('users:name'),
			flex: 0.2,
			minWidth: 120,
			valueGetter: (params) => params.row.name || '-',
		},
		{
			field: 'surname',
			headerName: t('users:surname'),
			flex: 0.2,
			minWidth: 120,
			valueGetter: (params) => params.row.surname || '-',
		},
		{
			field: 'telephoneNo',
			headerName: t('users:telephoneNo'),
			flex: 0.3,
			minWidth: 120,
			valueGetter: (params) => params.row.telephoneNo || '-',
		},
		{
			field: 'position',
			headerName: t('users:position'),
			flex: 0.3,
			minWidth: 120,
			valueGetter: (params) => params.row.position || '-',
		},

		{
			field: 'email',
			headerName: t('users:email'),
			flex: 0.3,
			minWidth: 120,
			valueGetter: (params) => params.row.email || '-',
		},
		{
			field: 'isActive',
			headerName: t('users:isActive'),
			flex: 0.3,
			minWidth: 120,
			valueGetter: (params) => params.row.isActive || '-',
		},
	];

	return (
		<div>
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
							rows={usersData?.items || []}
							getRowId={(row) => row.key}
							columns={columns}
							paginationMode="server"
							rowCount={usersData?.count}
							paginationModel={paginationModel}
							pageSizeOptions={[10, 25, 50, 100]}
							onPaginationModelChange={setPaginationModel}
						/>

						<Modal open={userRoleOpen} title={t('users:role')} onClose={handleUserRoleDialogToggle}>
							<UserRoles user={selectedUser} handleDialogToggle={handleUserRoleDialogToggle} />
						</Modal>
					</>
				)}
			</Card>
		</div>
	);
};
