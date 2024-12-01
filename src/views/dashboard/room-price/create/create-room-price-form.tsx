import { Autocomplete, Box, Button, Checkbox, FormControlLabel, Grid, InputLabel, TextField } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { roomPrice } from 'api/services/room-price';
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
	roomTypeId: number | null;
	dailyRate: number;
	hourlyRate: number;
}

export const AddRoomPriceForm = ({ handleDialogToggle }: Props) => {
	const { t } = useTranslation();

	const { mutate: addRoomPrice } = useMutation({
		mutationFn: roomPrice.add,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [roomPrice.queryKey] });
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

		addRoomPrice(payload, {
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
		roomTypeId: null,
		dailyRate: 0,
		hourlyRate: 0,
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
								<InputLabel required>{t('dailyRate')}</InputLabel>
								<TextField
									fullWidth
									name="dailyRate"
									size="small"
									variant="outlined"
									value={values.dailyRate}
									error={touched.dailyRate && Boolean(errors.dailyRate)}
									helperText={touched.dailyRate && errors.dailyRate}
									onChange={(event) => {
										setFieldValue('dailyRate', Number(event.target.value) || 0);
									}}
								/>
							</Grid>
							<Grid item xs={12}>
								<InputLabel required>{t('hourlyRate')}</InputLabel>
								<TextField
									fullWidth
									name="hourlyRate"
									size="small"
									variant="outlined"
									value={values.hourlyRate}
									error={touched.hourlyRate && Boolean(errors.hourlyRate)}
									helperText={touched.hourlyRate && errors.hourlyRate}
									onChange={(event) => {
										setFieldValue('hourlyRate', Number(event.target.value) || 0);
									}}
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
