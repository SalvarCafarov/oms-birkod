import { Autocomplete, Box, Button, Checkbox, FormControlLabel, Grid, InputLabel, TextField } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { room } from 'api/services/room';
import { roomType, RoomTypeResponseDto } from 'api/services/room-type';
import { Form, Formik, FormikHelpers } from 'formik';
import { queryClient } from 'main';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { validationSchema } from './validationSchema';

interface Props {
	handleDialogToggle: () => void;
}

interface FormData {
	roomNumber: string;
	roomTypeId: number | null;
	isAvailable: boolean;
}

export const AddRoomForm = ({ handleDialogToggle }: Props) => {
	const { t } = useTranslation();

	const { mutate: addRoom } = useMutation({
		mutationFn: room.add,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [room.queryKey] });
		},
	});

	const { data: roomTypeList } = useQuery({
		queryKey: [roomType.queryKey],
		queryFn: () => roomType.getListNonPaging(),
		placeholderData: [],
		staleTime: Infinity,
	});

	const handleSubmit = (formData: FormData, { setSubmitting }: FormikHelpers<FormData>) => {
		const payload = {
			...formData,
			roomTypeId: formData.roomTypeId ?? 0,
		};
		console.log(payload);

		addRoom(payload, {
			onSuccess: () => {
				toast.success(t('successfullyCreated'));
				handleDialogToggle();
			},
			onSettled: () => {
				setSubmitting(false);
			},
		});
	};

	const initialValues: FormData = {
		roomNumber: '',
		roomTypeId: null,
		isAvailable: true,
	};

	const translatedValidationSchema = validationSchema(t);

	return (
		<Formik initialValues={initialValues} validationSchema={translatedValidationSchema} onSubmit={handleSubmit}>
			{({ setFieldValue, errors, touched, values }) => (
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
								<TextField
									fullWidth
									name="roomNumber"
									size="small"
									variant="outlined"
									error={touched.roomNumber && Boolean(errors.roomNumber)}
									helperText={touched.roomNumber && errors.roomNumber}
									onChange={(event) => {
										setFieldValue('roomNumber', event.target.value);
										console.log();
									}}
								/>
							</Grid>

							<Grid item xs={12}>
								<InputLabel required>{t('roomTypeId')}</InputLabel>
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

							<Grid item xs={12}>
								<FormControlLabel
									label={t('isAvailable')}
									control={
										<Checkbox
											checked={values.isAvailable}
											name="isAvailable"
											onChange={(event) => setFieldValue('isAvailable', event.target.checked)}
										/>
									}
								/>
							</Grid>
						</Grid>
						<Box className="demo-space-x" sx={{ '& > :last-child': { mr: '0 !important' } }}>
							<Button type="submit" variant="contained">
								{t('create')}
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
