import { Box, Card, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { roomType, RoomTypeResponseDto } from 'api/services/room-type';
import Icon from 'components/icon';
import { Modal } from 'components/modal/modal';
import { Spinner } from 'components/spinner';
import { useConfirmation } from 'configs/context/confirmationContext';
import { queryClient } from 'main';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { EditRoomType } from '../edit/edit-type-name';
import { TableHeader } from './table-header';

interface CellType {
	row: RoomTypeResponseDto;
}

export const Table = () => {
	const { t } = useTranslation();
	const { confirm } = useConfirmation();
	const [editOpen, setEditOpen] = useState<boolean>(false);
	const [selectedRoomType, setSelectedRoomType] = useState<RoomTypeResponseDto>();
	const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
		page: 0,
		pageSize: 10,
	});

	const { data: roomTypeList, isPending } = useQuery({
		queryKey: [roomType.queryKey, paginationModel],
		queryFn: () => roomType.getListByDynamic(paginationModel, {}),
		placeholderData: keepPreviousData,
		staleTime: Infinity,
	});

	const { mutate: deleteRoomType } = useMutation({
		mutationFn: roomType.delete,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [roomType.queryKey] });
		},
	});

	const handleEditDialogToggle = () => setEditOpen((open) => !open);

	const columns: GridColDef[] = [
		{
			flex: 0.3,
			field: 'name',
			minWidth: 200,
			headerName: t('name'),
			renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.typeName}</Typography>,
		},
		{
			flex: 0.5,
			minWidth: 240,
			field: 'description',
			headerName: t('description'),
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
							setSelectedRoomType(row);
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
									deleteRoomType(row.key, {
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
						rows={roomTypeList?.items || []}
						getRowId={(row) => row.key}
						columns={columns}
						paginationMode="server"
						rowCount={roomTypeList?.count}
						paginationModel={paginationModel}
						pageSizeOptions={[10, 25, 50, 100]}
						onPaginationModelChange={setPaginationModel}
					/>
					<Modal open={editOpen} title={t('edit')} onClose={handleEditDialogToggle}>
						<EditRoomType roomTypeProp={selectedRoomType} handleDialogToggle={handleEditDialogToggle} />
					</Modal>
				</>
			)}
		</Card>
	);
};
