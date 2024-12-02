import { Autocomplete, Box, Button, Grid, InputLabel, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useMutation, useQuery } from '@tanstack/react-query';
import { roomType, RoomTypeResponseDto } from 'api/services/room-type';
import { specialDayPrice, SpecialDayPriceResponseDto } from 'api/services/special-day-price';
import { Form, Formik } from 'formik';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { validationSchema } from './validationSchema';

interface Props {
	priceProp: SpecialDayPriceResponseDto | null;
	handleDialogToggle: () => void;
}

interface FormData {
	roomTypeId: number;
	startDate: Date;
	endDate: Date;
	specialDailyRate: number;
	specialHourlyRate: number;
	description: string;
}

export const EditSpecialDayPriceForm = ({ priceProp, handleDialogToggle }: Props) => {
	const { t } = useTranslation();

	const { mutate: updateSpecialDayPrice } = useMutation({
		mutationFn: specialDayPrice.update,
		onSuccess: () => {
			toast.success(t('successfullyUpdated'));
			handleDialogToggle();
		},
	});

	const { data: roomTypeList } = useQuery({
		queryKey: [roomType.queryKey],
		queryFn: roomType.getListNonPaging,
		placeholderData: [],
		staleTime: Infinity,
	});

	const initialValues: FormData = {
		roomTypeId: priceProp?.RoomTypeId || 0,
		startDate: priceProp?.StartDate ? new Date(priceProp.StartDate) : new Date(),
		endDate: priceProp?.EndDate ? new Date(priceProp.EndDate) : new Date(),
		specialDailyRate: priceProp?.SpecialDailyRate || 0,
		specialHourlyRate: priceProp?.SpecialHourlyRate || 0,
		description: priceProp?.Description || '',
	};

	const handleSubmit = (formData: FormData) => {
		const payload = {
			key: priceProp!.key, // key mevcutsa ekleniyor
			RoomTypeId: formData.roomTypeId,
			StartDate: formData.startDate,
			EndDate: formData.endDate,
			SpecialDailyRate: formData.specialDailyRate,
			SpecialHourlyRate: formData.specialHourlyRate,
			Description: formData.description,
		};

		updateSpecialDayPrice(payload, {
			onSuccess: () => {
				toast.success(t('successfullyUpdated'));
				handleDialogToggle();
			},
		});
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
									onChange={(event, value) => setFieldValue('roomTypeId', value?.key ?? 0)}
								/>
							</Grid>

							<Grid item xs={12}>
								<InputLabel required>{t('startDate')}</InputLabel>
								<LocalizationProvider dateAdapter={AdapterDateFns}>
									<DatePicker
										value={values.startDate}
										renderInput={(params) => (
											<TextField
												{...params}
												fullWidth
												error={touched.startDate && Boolean(errors.startDate)}
												helperText={
													touched.startDate && errors.startDate
														? String(errors.startDate)
														: '' // Boş bir string ile varsayılan değer
												}
											/>
										)}
										onChange={(value) => setFieldValue('startDate', value)}
									/>
								</LocalizationProvider>
							</Grid>

							<Grid item xs={12}>
								<InputLabel required>{t('endDate')}</InputLabel>
								<LocalizationProvider dateAdapter={AdapterDateFns}>
									<DatePicker
										value={values.endDate}
										renderInput={(params) => (
											<TextField
												{...params}
												fullWidth
												error={touched.endDate && Boolean(errors.endDate)}
												helperText={
													touched.endDate && errors.endDate ? String(errors.endDate) : '' // Boş bir string ile varsayılan değer
												}
											/>
										)}
										onChange={(value) => setFieldValue('endDate', value)}
									/>
								</LocalizationProvider>
							</Grid>

							<Grid item xs={12}>
								<InputLabel required>{t('specialDailyRate')}</InputLabel>
								<TextField
									fullWidth
									name="specialDailyRate"
									size="small"
									variant="outlined"
									value={values.specialDailyRate}
									error={touched.specialDailyRate && Boolean(errors.specialDailyRate)}
									helperText={touched.specialDailyRate && errors.specialDailyRate}
									onChange={(event) =>
										setFieldValue('specialDailyRate', Number(event.target.value) || 0)
									}
								/>
							</Grid>

							<Grid item xs={12}>
								<InputLabel required>{t('specialHourlyRate')}</InputLabel>
								<TextField
									fullWidth
									name="specialHourlyRate"
									size="small"
									variant="outlined"
									value={values.specialHourlyRate}
									error={touched.specialHourlyRate && Boolean(errors.specialHourlyRate)}
									helperText={touched.specialHourlyRate && errors.specialHourlyRate}
									onChange={(event) =>
										setFieldValue('specialHourlyRate', Number(event.target.value) || 0)
									}
								/>
							</Grid>

							<Grid item xs={12}>
								<InputLabel>{t('description')}</InputLabel>
								<TextField
									fullWidth
									multiline
									rows={3}
									value={values.description}
									onChange={(event) => setFieldValue('description', event.target.value)}
								/>
							</Grid>
						</Grid>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, width: '100%' }}>
							<Button type="submit" variant="contained">
								{t('save')}
							</Button>
							<Button type="button" variant="outlined" color="secondary" onClick={handleDialogToggle}>
								{t('discard')}
							</Button>
						</Box>
					</Box>
				</Form>
			)}
		</Formik>
	);
};
