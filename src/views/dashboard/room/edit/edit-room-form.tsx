import { Autocomplete, Box, Button, Grid, InputLabel, TextField } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { room, RoomResponseDto } from 'api/services/room';
import { roomType, RoomTypeResponseDto } from 'api/services/room-type';
import { Form, Formik } from 'formik';
import { queryClient } from 'main';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { validationSchema } from './validationSchema';

const roomStatus = [
	{ key: 0, label: 'Available' },
	{ key: 1, label: 'Occupied' },
	{ key: 2, label: 'Cleaning' },
];

interface Props {
	roomProp: RoomResponseDto | null;
	handleDialogToggle: () => void;
}

interface FormData {
	roomNumber: string;
	roomTypeId: number;
	roomStatus: number | null; // Room status stored as a key
}

export const EditRoom = ({ roomProp, handleDialogToggle }: Props) => {
	const { t } = useTranslation();

	const { mutate: updateRoom } = useMutation({
		mutationFn: room.update,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [room.queryKey] });
			toast.success(t('successfullyUpdated'));
			handleDialogToggle();
		},
	});

	const handleSubmit = (formData: FormData) => {
		const payload = {
			...formData,
			key: roomProp!.key,
			roomStatus: formData.roomStatus ?? 0, // Default to 0 if null
		};

		updateRoom(payload, {
			onSuccess: () => {
				toast.success(t('successfullyUpdated'));
				handleDialogToggle();
			},
		});
	};

	const { data: roomTypeList } = useQuery({
		queryKey: [roomType.queryKey],
		queryFn: () => roomType.getListNonPaging(),
		placeholderData: [],
		staleTime: Infinity,
	});

	// Initialize form values
	const initialValues: FormData = {
		roomNumber: roomProp?.roomNumber || '',
		roomTypeId: roomProp?.roomTypeId || 0,
		roomStatus: roomProp?.roomStatus ?? null, // Initialize with existing value or null
	};

	return (
		<Formik
			enableReinitialize
			initialValues={initialValues}
			validationSchema={validationSchema(t)}
			onSubmit={handleSubmit}
		>
			{({ values, touched, errors, setFieldValue }) => (
				<Form>
					<Box
						sx={{
							mt: 4,
							mx: 'auto',
							width: '100%',
							maxWidth: 360,
							display: 'flex',
							alignItems: 'center',
							flexDirection: 'column',
						}}
					>
						<Grid container rowSpacing={4}>
							{/* Room Number */}
							<Grid item xs={12}>
								<InputLabel required>{t('roomNumber')}</InputLabel>
								<TextField
									fullWidth
									name="roomNumber"
									size="small"
									variant="outlined"
									value={values.roomNumber}
									error={touched.roomNumber && Boolean(errors.roomNumber)}
									helperText={touched.roomNumber && errors.roomNumber}
									onChange={(event) => setFieldValue('roomNumber', event.target.value)}
								/>
							</Grid>

							{/* Room Type */}
							<Grid item xs={12}>
								<InputLabel required>{t('roomType')}</InputLabel>
								<Autocomplete
									fullWidth
									id="room-type-autocomplete"
									size="small"
									options={roomTypeList || []}
									getOptionLabel={(option: RoomTypeResponseDto) => option?.typeName || ''}
									isOptionEqualToValue={(option, value) => option.key === value?.key}
									value={roomTypeList?.find((item) => item.key === values.roomTypeId) || null}
									renderInput={(params) => (
										<TextField
											{...params}
											variant="outlined"
											error={touched.roomTypeId && Boolean(errors.roomTypeId)}
											helperText={touched.roomTypeId && errors.roomTypeId}
										/>
									)}
									onChange={(event, value) => setFieldValue('roomTypeId', value?.key ?? null)}
								/>
							</Grid>

							{/* Room Status */}
							<Grid item xs={12}>
								<InputLabel required>{t('roomStatus')}</InputLabel>
								<Autocomplete
									fullWidth
									id="room-status-autocomplete"
									size="small"
									options={roomStatus}
									getOptionLabel={(option) => option.label}
									isOptionEqualToValue={(option, value) => option.key === value?.key}
									value={roomStatus.find((item) => item.key === values.roomStatus) || null}
									renderInput={(params) => (
										<TextField
											{...params}
											variant="outlined"
											error={touched.roomStatus && Boolean(errors.roomStatus)}
											helperText={touched.roomStatus && errors.roomStatus}
										/>
									)}
									onChange={(event, value) => setFieldValue('roomStatus', value?.key ?? null)}
								/>
							</Grid>
						</Grid>

						<Box className="demo-space-x" sx={{ '& > :last-child': { mr: '0 !important' } }}>
							<Button type="submit" variant="contained">
								{t('save')}
							</Button>
							<Button type="reset" variant="tonal" color="secondary" onClick={handleDialogToggle}>
								{t('discard')}
							</Button>
						</Box>
					</Box>
				</Form>
			)}
		</Formik>
	);
};
