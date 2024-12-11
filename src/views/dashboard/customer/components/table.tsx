import { Box, Card, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { customer, CustomerResponseDto } from 'api/services/customer';
import Icon from 'components/icon';
import { Modal } from 'components/modal/modal';
import { Spinner } from 'components/spinner';
import { useConfirmation } from 'configs/context/confirmationContext';
import { queryClient } from 'main';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { EditCustomerForm } from '../edit/edit-customer-form';
import { TableHeader } from './table-header';

interface CellType {
	row: CustomerResponseDto;
}

export const Table = () => {
	const { t } = useTranslation();
	const { confirm } = useConfirmation();
	const [editOpen, setEditOpen] = useState<boolean>(false);
	const [selectedCustomer, setSelectedCustomer] = useState<CustomerResponseDto | undefined>(undefined);

	const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
		page: 0,
		pageSize: 10,
	});

	// Customer Listesi
	const { data: customerList, isLoading } = useQuery({
		queryKey: [customer.queryKey, paginationModel],
		queryFn: () => customer.getListByDynamic(paginationModel, {}),
		placeholderData: keepPreviousData,
		staleTime: Infinity,
	});

	// Customer Silme İşlemi
	const { mutate: deleteCustomer } = useMutation({
		mutationFn: customer.delete,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [customer.queryKey] });
			toast.success(t('successfullyDeleted'));
		},
	});

	const handleEditDialogToggle = () => setEditOpen((prevState) => !prevState);

	const columns: GridColDef[] = [
		{
			flex: 0.2,
			minWidth: 100,
			sortable: false,
			field: 'actions',
			headerName: t('actions'),
			renderCell: ({ row }: CellType) => (
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<IconButton
						onClick={() => {
							setSelectedCustomer(row);
							handleEditDialogToggle();
						}}
					>
						<Icon icon="tabler:edit" style={{ pointerEvents: 'none' }} />
					</IconButton>
					<IconButton
						onClick={(event) => {
							event.stopPropagation();
							confirm({
								confirmText: t('delete'),
								onConfirm: () => deleteCustomer(row.key),
							});
						}}
					>
						<Icon icon="tabler:trash" style={{ pointerEvents: 'none' }} />
					</IconButton>
				</Box>
			),
		},
		{
			flex: 0.5,
			field: 'name',
			minWidth: 70,
			headerName: t('Name'),
			renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.name}</Typography>,
		},
		{
			flex: 0.5,
			field: 'surname',
			minWidth: 70,
			headerName: t('SurName'),
			renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.surname}</Typography>,
		},
		{
			flex: 0.5,
			field: 'fatherName',
			minWidth: 70,
			headerName: t('FatherName'),
			renderCell: ({ row }: CellType) => (
				<Typography sx={{ color: 'text.secondary' }}>{row.fatherName}</Typography>
			),
		},
		{
			flex: 0.5,
			field: 'passportNo',
			minWidth: 70,
			headerName: t('PassportNo'),
			renderCell: ({ row }: CellType) => (
				<Typography sx={{ color: 'text.secondary' }}>{row.passportNo}</Typography>
			),
		},
		{
			flex: 0.5,
			field: 'telephoneNo',
			minWidth: 70,
			headerName: t('TelephoneNo'),
			renderCell: ({ row }: CellType) => (
				<Typography sx={{ color: 'text.secondary' }}>{row.telephoneNo}</Typography>
			),
		},
		{
			flex: 0.5,
			field: 'email',
			minWidth: 70,
			headerName: t('Email'),
			renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.email}</Typography>,
		},
		{
			flex: 0.5,
			field: 'birthday',
			minWidth: 70,
			headerName: t('Birthday'),
			renderCell: ({ row }: CellType) => (
				<Typography sx={{ color: 'text.secondary' }}>{new Date(row.birthday).toLocaleDateString()}</Typography>
			),
		},
	];

	return (
		<Card>
			<TableHeader />
			{isLoading ? (
				<Spinner />
			) : (
				<>
					<DataGrid
						autoHeight
						disableRowSelectionOnClick
						disableColumnMenu
						rows={customerList?.items || []}
						getRowId={(row) => row.key}
						columns={columns}
						paginationMode="server"
						rowCount={customerList?.count}
						paginationModel={paginationModel}
						pageSizeOptions={[10, 25, 50, 100]}
						onPaginationModelChange={setPaginationModel}
					/>
					<Modal open={editOpen} title={t('edit')} onClose={handleEditDialogToggle}>
						<EditCustomerForm
							customerProp={selectedCustomer}
							handleEditDialogToggle={handleEditDialogToggle}
						/>
					</Modal>
				</>
			)}
		</Card>
	);
};
