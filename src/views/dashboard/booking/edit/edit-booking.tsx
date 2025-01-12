import { Autocomplete, Box, Button, Grid, InputLabel, TextField } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { roomType, RoomTypeResponseDto } from 'api/services/room-type';
import { specialDayPrice, SpecialDayPriceResponseDto } from 'api/services/special-day-price';
import dayjs, { Dayjs } from 'dayjs';
import { Form, Formik } from 'formik';
import { queryClient } from 'main';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { validationSchema } from './validationSchema';

interface Props {
	priceProp: SpecialDayPriceResponseDto | null; // camelCase
	handleEditDialogToggle: () => void; // camelCase
}

interface FormData {
	roomTypeName: string;
	startDate: Dayjs;
	endDate: Dayjs;
	specialDailyRate: number;
	specialHourlyRate: number;
	description: string;
}

export const EditBooking = ({ priceProp, handleEditDialogToggle }: Props) => {
	const { t } = useTranslation();

	const { mutate: updateSpecialDayPrice } = useMutation({
		mutationFn: specialDayPrice.update,
		onSuccess: () => {
			handleEditDialogToggle();
			toast.success(t('successfullyUpdated'));
			queryClient.invalidateQueries({ queryKey: [specialDayPrice.queryKey] });
		},
	});

	const { data: roomTypeList = [] } = useQuery({
		queryKey: [roomType.queryKey],
		queryFn: roomType.getListNonPaging,
		placeholderData: [],
		staleTime: Infinity,
	});

	const initialValues: FormData = {
		roomTypeName: priceProp?.roomTypeName || '', // roomTypeName'ı kullanıyoruz
		startDate: priceProp?.startDate ? dayjs(priceProp.startDate) : dayjs(),
		endDate: priceProp?.endDate ? dayjs(priceProp.endDate) : dayjs(),
		specialDailyRate: priceProp?.specialDailyRate || 0,
		specialHourlyRate: priceProp?.specialHourlyRate || 0,
		description: priceProp?.description || '',
	};

	const handleSubmit = (formData: FormData) => {
		const selectedRoomType = roomTypeList?.find((item) => item.typeName === formData.roomTypeName);

		const payload = {
			key: priceProp!.key, // priceProp'tan gelen key
			roomTypeId: selectedRoomType?.key || 0, // roomTypeId'yi roomTypeName'e göre buluyoruz
			startDate: dayjs(formData.startDate).toDate(), // StartDate'yi Date nesnesine çeviriyoruz
			endDate: dayjs(formData.endDate).toDate(), // EndDate'yi Date nesnesine çeviriyoruz
			specialDailyRate: formData.specialDailyRate || 0, // Eğer boşsa 0 olarak ayarlıyoruz
			specialHourlyRate: formData.specialHourlyRate || 0, // Eğer boşsa 0 olarak ayarlıyoruz
			description: formData.description || '', // description boşsa boş string
		};

		updateSpecialDayPrice(payload);
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
								<InputLabel required>{t('roomTypeName')}</InputLabel> {/* roomTypeName kullanıyoruz */}
								<Autocomplete
									fullWidth
									id="room-type-autocomplete"
									size="small"
									options={roomTypeList || []}
									getOptionLabel={(option: RoomTypeResponseDto) => option?.typeName || ''}
									isOptionEqualToValue={(option, value) => option.key === value?.key}
									value={roomTypeList?.find((item) => item.typeName === values.roomTypeName) || null}
									renderInput={(params) => (
										<TextField
											{...params}
											variant="outlined"
											error={touched.roomTypeName && Boolean(errors.roomTypeName)}
											helperText={touched.roomTypeName && errors.roomTypeName}
										/>
									)}
									onChange={(event, value) => setFieldValue('roomTypeName', value?.typeName ?? '-')}
								/>
							</Grid>

							<Grid item xs={12}>
								<InputLabel required>{t('startDate')}</InputLabel>
								<TextField
									fullWidth
									type="date"
									size="small"
									variant="outlined"
									value={values.startDate.format('YYYY-MM-DD')}
									onChange={(event) => setFieldValue('startDate', dayjs(event.target.value))}
								/>
							</Grid>

							<Grid item xs={12}>
								<InputLabel required>{t('endDate')}</InputLabel>
								<TextField
									fullWidth
									type="date"
									size="small"
									variant="outlined"
									value={values.endDate.format('YYYY-MM-DD')}
									onChange={(event) => setFieldValue('endDate', dayjs(event.target.value))}
								/>
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
							<Button type="button" variant="outlined" color="secondary" onClick={handleEditDialogToggle}>
								{t('discard')}
							</Button>
						</Box>
					</Box>
				</Form>
			)}
		</Formik>
	);
};
