import { Box, Card, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { roomPrice, RoomPriceResponseDto } from 'api/services/room-price';
import { roomType } from 'api/services/room-type';
import Icon from 'components/icon';
import { Modal } from 'components/modal/modal';
import { Spinner } from 'components/spinner';
import { useConfirmation } from 'configs/context/confirmationContext';
import { queryClient } from 'main';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { EditRoom } from '../edit/edit-room-price-form';
import { TableHeader } from './table-header';

interface CellType {
	row: RoomPriceResponseDto;
}

export const Table = () => {
	const { t } = useTranslation();
	const { confirm } = useConfirmation();
	const [editOpen, setEditOpen] = useState<boolean>(false);
	const [selectedRoomPrice, setSelectedRoomPrice] = useState<RoomPriceResponseDto | undefined>(undefined);

	const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
		page: 0,
		pageSize: 10,
	});

	const { data: roomTypeList } = useQuery({
		queryKey: [roomType.queryKey],
		queryFn: () => roomType.getListNonPaging(),
		placeholderData: [],
		staleTime: Infinity,
	});

	const { data: roomPriceList, isLoading } = useQuery({
		queryKey: [roomPrice.queryKey, paginationModel],
		queryFn: () => roomPrice.getListByDynamic(paginationModel, {}),
		placeholderData: keepPreviousData,
		staleTime: Infinity,
	});

	const { mutate: deleteRoomPrice } = useMutation({
		mutationFn: roomPrice.delete,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [roomPrice.queryKey] });
			toast.success(t('successfullyDeleted'));
		},
	});

	const handleEditDialogToggle = () => setEditOpen((prevState) => !prevState);

	const columns: GridColDef[] = [
		{
			flex: 0.5,
			minWidth: 240,
			field: 'roomTypeId',
			headerName: t('Room Type'),
			renderCell: ({ row }: CellType) => {
				const roomTypeName = roomTypeList?.find((item) => item.key === row.roomTypeId)?.typeName || '-';

				return <Typography sx={{ color: 'text.secondary' }}>{roomTypeName}</Typography>;
			},
		},
		{
			flex: 0.3,
			field: 'dailyRate',
			minWidth: 200,
			headerName: t('Daily Rate'),
			renderCell: ({ row }: CellType) => (
				<Typography sx={{ color: 'text.secondary' }}>{row.dailyRate}</Typography>
			),
		},
		{
			flex: 0.3,
			field: 'hourlyRate',
			minWidth: 200,
			headerName: t('Hourly Rate'),
			renderCell: ({ row }: CellType) => (
				<Typography sx={{ color: 'text.secondary' }}>{row.hourlyRate}</Typography>
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
							setSelectedRoomPrice(row);
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
								onConfirm: () => deleteRoomPrice(row.key),
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
			{isLoading ? (
				<Spinner />
			) : (
				<>
					<DataGrid
						autoHeight
						disableRowSelectionOnClick
						disableColumnMenu
						rows={roomPriceList?.items || []}
						getRowId={(row) => row.key}
						columns={columns}
						paginationMode="server"
						rowCount={roomPriceList?.count}
						paginationModel={paginationModel}
						pageSizeOptions={[10, 25, 50, 100]}
						onPaginationModelChange={setPaginationModel}
					/>
					<Modal open={editOpen} title={t('edit')} onClose={handleEditDialogToggle}>
						{selectedRoomPrice && (
							<EditRoom roomPriceProp={selectedRoomPrice} handleDialogToggle={handleEditDialogToggle} />
						)}
					</Modal>
				</>
			)}
		</Card>
	);
};
