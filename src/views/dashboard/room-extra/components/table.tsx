import { Box, Card, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { roomExtra, RoomExtraResponseDto } from 'api/services/room-extra';
import Icon from 'components/icon';
import { Modal } from 'components/modal/modal';
import { Spinner } from 'components/spinner';
import { useConfirmation } from 'configs/context/confirmationContext';
import { queryClient } from 'main';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { EditRoom } from '../edit/edit-room-extra-form';
import { TableHeader } from './table-header';

interface CellType {
	row: RoomExtraResponseDto;
}

export const Table = () => {
	const { t } = useTranslation();
	const { confirm } = useConfirmation();
	const [editOpen, setEditOpen] = useState<boolean>(false);
	const [selectedRoomExtra, setSelectedRoomExtra] = useState<RoomExtraResponseDto | undefined>(undefined);

	const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
		page: 0,
		pageSize: 10,
	});

	const { data: roomExtraList, isLoading } = useQuery({
		queryKey: [roomExtra.queryKey, paginationModel],
		queryFn: () => roomExtra.getListByDynamic(paginationModel, {}),
		placeholderData: keepPreviousData,
		staleTime: Infinity,
	});

	const { mutate: deleteRoomExtra } = useMutation({
		mutationFn: roomExtra.delete,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [roomExtra.queryKey] });
			toast.success(t('successfullyDeleted'));
		},
	});

	const handleEditDialogToggle = () => setEditOpen((prevState) => !prevState);

	const columns: GridColDef[] = [
		{
			flex: 0.3,
			field: 'extraName',
			minWidth: 200,
			headerName: t('Extra Name'),
			renderCell: ({ row }: CellType) => (
				<Typography sx={{ color: 'text.secondary' }}>{row.extraName}</Typography>
			),
		},
		{
			flex: 0.3,
			field: 'description',
			minWidth: 200,
			headerName: t('Description'),
			renderCell: ({ row }: CellType) => (
				<Typography sx={{ color: 'text.secondary' }}>{row.description}</Typography>
			),
		},
		{
			flex: 0.3,
			field: 'price',
			minWidth: 200,
			headerName: t('Price'),
			renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.price}</Typography>,
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
							setSelectedRoomExtra(row);
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
								onConfirm: () => deleteRoomExtra(row.key),
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
						rows={roomExtraList?.items || []}
						getRowId={(row) => row.key}
						columns={columns}
						paginationMode="server"
						rowCount={roomExtraList?.count}
						paginationModel={paginationModel}
						pageSizeOptions={[10, 25, 50, 100]}
						onPaginationModelChange={setPaginationModel}
					/>
					<Modal open={editOpen} title={t('edit')} onClose={handleEditDialogToggle}>
						{selectedRoomExtra && (
							<EditRoom roomExtraProp={selectedRoomExtra} handleDialogToggle={handleEditDialogToggle} />
						)}
					</Modal>
				</>
			)}
		</Card>
	);
};
