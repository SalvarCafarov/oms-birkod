import { Autocomplete, Box, Button, Checkbox, FormControlLabel, Grid, InputLabel, TextField } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { room, RoomResponseDto } from 'api/services/room';
import { roomType, RoomTypeResponseDto } from 'api/services/room-type';
import { Field, Form, Formik } from 'formik';
import { queryClient } from 'main';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { validationSchema } from './validationSchema';

interface Props {
	roomProp: RoomResponseDto | null;
	handleDialogToggle: () => void;
}

interface FormData {
	roomNumber: string;
	roomTypeId: number;
	isAvailable: boolean | true;
}

export const EditRoom = ({ roomProp, handleDialogToggle }: Props) => {
	const { t } = useTranslation();

	const { mutate: updateRoom } = useMutation({
		mutationFn: room.update,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [room.queryKey] });
		},
	});

	const handleSubmit = (formData: FormData) => {
		updateRoom(
			{ ...formData, key: roomProp!.key },
			{
				onSuccess: () => {
					toast.success(t('successfullyUpdated'));
					handleDialogToggle();
				},
			},
		);
	};

	const { data: roomTypeList } = useQuery({
		queryKey: [roomType.queryKey],
		queryFn: () => roomType.getListNonPaging(),
		placeholderData: [],
		staleTime: Infinity,
	});

	const initialValues = {
		roomNumber: roomProp?.roomNumber || '',
		roomTypeId: roomProp?.roomTypeId || 0,
		isAvailable: roomProp?.isAvailable || true,
	};

	const translatedValidationSchema = validationSchema(t);

	return (
		<Formik
			enableReinitialize
			initialValues={initialValues}
			validationSchema={translatedValidationSchema}
			onSubmit={handleSubmit}
		>
			{({ values, touched, errors, setFieldValue }) => {
				return (
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
								<Grid item xs={12}>
									<InputLabel required>{t('roomNumber')}</InputLabel>
									<Field
										name="roomNumber"
										size="small"
										component={TextField}
										defaultValue={roomProp?.roomNumber}
										onChange={(event) => setFieldValue('roomNumber', event.target.value)}
									/>
								</Grid>

								<Grid item xs={12}>
									<FormControlLabel
										control={
											<Checkbox
												defaultChecked={roomProp!.isAvailable}
												name="isAvailable"
												value={values.isAvailable}
												onChange={(event) => setFieldValue('isAvailable', event.target.checked)}
											/>
										}
										label={t('isAvailable')}
									/>
								</Grid>
								<Grid item xs={12}>
									<InputLabel>{t('roomTypeId')}</InputLabel>
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
										onChange={(event, value) => {
											setFieldValue('roomTypeId', value?.key ?? null);
										}}
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
				);
			}}
		</Formik>
	);
};
