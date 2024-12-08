import { Box, Card, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { travelAgency, TravelAgencyResponseDto } from 'api/services/travel-agency';
import Icon from 'components/icon';
import { Modal } from 'components/modal/modal';
import { Spinner } from 'components/spinner';
import { useConfirmation } from 'configs/context/confirmationContext';
import { queryClient } from 'main';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { EditTravelAgencyForm } from '../edit/edit-travel-agency-form';
import { TableHeader } from './table-header';

interface CellType {
	row: TravelAgencyResponseDto;
}

export const Table = () => {
	const { t } = useTranslation();
	const { confirm } = useConfirmation();
	const [editOpen, setEditOpen] = useState<boolean>(false);
	const [selectedTravelAgency, setSelectedTravelAgency] = useState<TravelAgencyResponseDto | undefined>(undefined);

	const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
		page: 0,
		pageSize: 10,
	});

	const { data: travelAgencyList, isPending } = useQuery({
		queryKey: [travelAgency.queryKey, paginationModel],
		queryFn: () => travelAgency.getListByDynamic(paginationModel, {}),
		placeholderData: keepPreviousData,
		staleTime: Infinity,
	});

	const { mutate: deleteTravelAgency } = useMutation({
		mutationFn: travelAgency.delete,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [travelAgency.queryKey] });
		},
	});

	const handleEditDialogToggle = () => setEditOpen((open) => !open);

	const columns: GridColDef[] = [
		{
			flex: 0.3,
			field: 'agencyName',
			minWidth: 200,
			headerName: t('agencyName'),
			renderCell: ({ row }: CellType) => (
				<Typography sx={{ color: 'text.secondary' }}>{row.agencyName}</Typography>
			),
		},
		{
			field: 'formNo',
			headerName: t('formNo'),
			minWidth: 150,
			flex: 1,
		},
		{
			flex: 0.5,
			field: 'StartDate',
			minWidth: 200,
			headerName: t('Start Date'),
			renderCell: ({ row }: CellType) => (
				<Typography sx={{ color: 'text.secondary' }}>{new Date(row.startDate).toLocaleDateString()}</Typography>
			),
		},
		{
			flex: 0.5,
			field: 'EndDate',
			minWidth: 200,
			headerName: t('End Date'),
			renderCell: ({ row }: CellType) => (
				<Typography sx={{ color: 'text.secondary' }}>{new Date(row.endDate).toLocaleDateString()}</Typography>
			),
		},

		{
			flex: 0.5,
			minWidth: 240,
			field: 'discountRate',
			headerName: t('discountRate'),
			renderCell: ({ row }: CellType) => (
				<Typography sx={{ color: 'text.secondary' }}>{row.discountRate || '-'}</Typography>
			),
		},
		{
			field: 'isActive',
			headerName: t('isActive'),
			minWidth: 100,
			flex: 0.5,
			renderCell: ({ row }: CellType) => <Typography>{row.isActive ? t('active') : t('inactive')}</Typography>,
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
							setSelectedTravelAgency(row);
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
								onConfirm: () => {
									deleteTravelAgency(row.key, {
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
						rows={travelAgencyList?.items || []}
						getRowId={(row) => row.key}
						columns={columns}
						paginationMode="server"
						rowCount={travelAgencyList?.count}
						paginationModel={paginationModel}
						pageSizeOptions={[10, 25, 50, 100]}
						onPaginationModelChange={setPaginationModel}
					/>
					<Modal open={editOpen} title={t('edit')} onClose={handleEditDialogToggle}>
						<EditTravelAgencyForm
							travelAgencyProp={selectedTravelAgency}
							handleEditDialogToggle={handleEditDialogToggle}
						/>
					</Modal>
				</>
			)}
		</Card>
	);
};
