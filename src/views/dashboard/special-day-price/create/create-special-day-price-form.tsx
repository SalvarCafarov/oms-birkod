import { Autocomplete, Box, Button, Grid, InputLabel, TextField } from '@mui/material';
import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useMutation, useQuery } from '@tanstack/react-query';
import { roomType, RoomTypeResponseDto } from 'api/services/room-type';
import { specialDayPrice, SpecialDayPriceRequestDto } from 'api/services/special-day-price';
import dayjs, { Dayjs } from 'dayjs';
import { Form, Formik, FormikHelpers } from 'formik';
import { queryClient } from 'main';
import React from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { validationSchema } from './validationSchema';

interface Props {
	handleDialogToggle: () => void;
}

interface FormData {
	roomTypeId: number;
	startDate: Dayjs;
	endDate: Dayjs;
	specialDailyRate: number;
	specialHourlyRate: number;
	description: string;
}

export const AddSpecialDayPriceForm = ({ handleDialogToggle }: Props) => {
	const { t } = useTranslation();

	const { mutate: addRoom } = useMutation({
		mutationFn: specialDayPrice.add,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [specialDayPrice.queryKey] });
			toast.success(t('successfullyCreated'));
			handleDialogToggle();
		},
	});

	const { data: roomTypeList } = useQuery({
		queryKey: [roomType.queryKey],
		queryFn: roomType.getListNonPaging,
		placeholderData: [],
		staleTime: Infinity,
	});

	const handleSubmit = (formData: FormData, { setSubmitting }: FormikHelpers<FormData>) => {
		const payload: SpecialDayPriceRequestDto = {
			roomTypeId: formData.roomTypeId,
			startDate: dayjs(formData.startDate).toDate(), // dayjs ile Date türüne dönüştürme
			endDate: dayjs(formData.endDate).toDate(), // dayjs ile Date türüne dönüştürme
			specialDailyRate: formData.specialDailyRate,
			specialHourlyRate: formData.specialHourlyRate,
			description: formData.description,
		};

		addRoom(payload, { onSettled: () => setSubmitting(false) });
	};

	const initialValues: FormData = {
		roomTypeId: 0,
		startDate: dayjs(),
		endDate: dayjs(),
		specialDailyRate: 0,
		specialHourlyRate: 0,
		description: '',
	};

	return (
		<Formik initialValues={initialValues} validationSchema={validationSchema(t)} onSubmit={handleSubmit}>
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
										setFieldValue('roomTypeId', value?.key ?? 0);
									}}
								/>
							</Grid>

							<Grid item xs={12}>
								<InputLabel required>{t('startDate')}</InputLabel>
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<MobileDateTimePicker
										value={values.startDate}
										ampm={false}
										slots={{
											textField: (params) => (
												<TextField
													{...params}
													fullWidth
													error={touched.startDate && Boolean(errors.startDate)}
													helperText={touched.startDate && errors.startDate}
												/>
											),
										}}
										onChange={(value) => setFieldValue('startDate', value || dayjs())}
									/>
								</LocalizationProvider>
							</Grid>

							<Grid item xs={12}>
								<InputLabel required>{t('endDate')}</InputLabel>
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<MobileDateTimePicker
										value={values.endDate}
										ampm={false}
										slots={{
											textField: (params) => (
												<TextField
													{...params}
													fullWidth
													error={touched.endDate && Boolean(errors.endDate)}
													helperText={touched.endDate && errors.endDate}
												/>
											),
										}}
										onChange={(value) => setFieldValue('endDate', value || dayjs())}
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
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								mt: 2,
								width: '100%',
							}}
						>
							<Button type="submit" variant="contained">
								{t('create')}
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
