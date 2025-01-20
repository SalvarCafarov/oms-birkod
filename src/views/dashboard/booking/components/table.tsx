import { Box, Card, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { booking, BookingDynamicDto } from 'api/services/booking';
import { roomType } from 'api/services/room-type';
import Icon from 'components/icon';
import { Modal } from 'components/modal/modal';
import { Spinner } from 'components/spinner';
import { useConfirmation } from 'configs/context/confirmationContext';
import { queryClient } from 'main';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { EditBookingForm } from '../edit/edit-booking';
import { TableHeader } from './table-header';

interface CellType {
	row: BookingDynamicDto;
}

export const Table = () => {
	const { t } = useTranslation();
	const { confirm } = useConfirmation();
	const [editOpen, setEditOpen] = useState<boolean>(false);
	const [selectedBooking, setSelectedBooking] = useState<number | undefined>(undefined);

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
	const { data: bookingList, isLoading } = useQuery({
		queryKey: [booking.queryKey, paginationModel],
		queryFn: () => booking.getListByDynamic(paginationModel, {}),
		placeholderData: keepPreviousData,
		staleTime: Infinity,
	});

	// SpecialDayPrice Silme İşlemi
	const { mutate: deleteSpecialDayPrice } = useMutation({
		mutationFn: booking.delete,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [booking.queryKey] });
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
				<Typography sx={{ color: 'text.secondary' }}>{row.customerName}</Typography>
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
				<Typography sx={{ color: 'text.secondary' }}>{new Date(row.startDate).toLocaleDateString()}</Typography>
			),
		},
		{
			flex: 0.3,
			field: 'SpecialDailyRate',
			minWidth: 150,
			headerName: t('Special Daily Rate'),
			renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.endDate}</Typography>,
		},
		{
			flex: 0.3,
			field: 'SpecialHourlyRate',
			minWidth: 150,
			headerName: t('Special Hourly Rate'),
			renderCell: ({ row }: CellType) => (
				<Typography sx={{ color: 'text.secondary' }}>{row.customerName}</Typography>
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
							setSelectedBooking(row.key);
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
						rows={(bookingList?.items as BookingDynamicDto[]) || []}
						getRowId={(row) => row.key}
						columns={columns}
						paginationMode="server"
						rowCount={bookingList?.count}
						paginationModel={paginationModel}
						pageSizeOptions={[10, 25, 50, 100]}
						onPaginationModelChange={setPaginationModel}
					/>
					<Modal open={editOpen} title={t('edit')} onClose={handleEditDialogToggle}>
						{selectedBooking && (
							<EditBookingForm keyProp={selectedBooking} handleDialogToggle={handleEditDialogToggle} />
						)}
					</Modal>
				</>
			)}
		</Card>
	);
};
