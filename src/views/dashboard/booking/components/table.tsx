import { Box, Card, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { roomType } from 'api/services/room-type';
import { specialDayPrice, SpecialDayPriceResponseDto } from 'api/services/special-day-price';
import Icon from 'components/icon';
import { Modal } from 'components/modal/modal';
import { Spinner } from 'components/spinner';
import { useConfirmation } from 'configs/context/confirmationContext';
import { queryClient } from 'main';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { EditSpecialDayPriceForm } from '../edit/edit-special-day-price-form';
import { TableHeader } from './table-header';

interface CellType {
	row: SpecialDayPriceResponseDto;
}

export const Table = () => {
	const { t } = useTranslation();
	const { confirm } = useConfirmation();
	const [editOpen, setEditOpen] = useState<boolean>(false);
	const [selectedSpecialDayPrice, setSelectedSpecialDayPrice] = useState<SpecialDayPriceResponseDto | undefined>(
		undefined,
	);

	const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
		page: 0,
		pageSize: 10,
	});

	// RoomType Listesi
	const { data: roomTypeList } = useQuery({
		queryKey: [roomType.queryKey],
		queryFn: () => roomType.getListNonPaging(),
		placeholderData: [],
		staleTime: Infinity,
	});

	// SpecialDayPrice Listesi
	const { data: specialDayPriceList, isLoading } = useQuery({
		queryKey: [specialDayPrice.queryKey, paginationModel],
		queryFn: () => specialDayPrice.getListByDynamic(paginationModel, {}),
		placeholderData: keepPreviousData,
		staleTime: Infinity,
	});

	// SpecialDayPrice Silme İşlemi
	const { mutate: deleteSpecialDayPrice } = useMutation({
		mutationFn: specialDayPrice.delete,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [specialDayPrice.queryKey] });
			toast.success(t('successfullyDeleted'));
		},
	});

	const handleEditDialogToggle = () => setEditOpen((prevState) => !prevState);

	const columns: GridColDef[] = [
		{
			flex: 0.5,
			field: 'RoomTypeId',
			minWidth: 200,
			headerName: t('Room Type'),
			renderCell: ({ row }: CellType) => (
				<Typography sx={{ color: 'text.secondary' }}>{row.roomTypeName}</Typography>
			),
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
			flex: 0.3,
			field: 'SpecialDailyRate',
			minWidth: 150,
			headerName: t('Special Daily Rate'),
			renderCell: ({ row }: CellType) => (
				<Typography sx={{ color: 'text.secondary' }}>{row.specialDailyRate}</Typography>
			),
		},
		{
			flex: 0.3,
			field: 'SpecialHourlyRate',
			minWidth: 150,
			headerName: t('Special Hourly Rate'),
			renderCell: ({ row }: CellType) => (
				<Typography sx={{ color: 'text.secondary' }}>{row.specialHourlyRate}</Typography>
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
							setSelectedSpecialDayPrice(row);
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
								onConfirm: () => deleteSpecialDayPrice(row.key),
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
			{isLoading && roomTypeList ? (
				<Spinner />
			) : (
				<>
					<DataGrid
						autoHeight
						disableRowSelectionOnClick
						disableColumnMenu
						rows={specialDayPriceList?.items || []}
						getRowId={(row) => row.key}
						columns={columns}
						paginationMode="server"
						rowCount={specialDayPriceList?.count}
						paginationModel={paginationModel}
						pageSizeOptions={[10, 25, 50, 100]}
						onPaginationModelChange={setPaginationModel}
					/>
					<Modal open={editOpen} title={t('edit')} onClose={handleEditDialogToggle}>
						{selectedSpecialDayPrice && (
							<EditSpecialDayPriceForm
								priceProp={selectedSpecialDayPrice}
								handleEditDialogToggle={handleEditDialogToggle}
							/>
						)}
					</Modal>
				</>
			)}
		</Card>
	);
};
