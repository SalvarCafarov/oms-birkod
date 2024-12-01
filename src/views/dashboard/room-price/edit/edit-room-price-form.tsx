import { Autocomplete, Box, Button, Checkbox, FormControlLabel, Grid, InputLabel, TextField } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { roomPrice, RoomPriceResponseDto } from 'api/services/room-price';
import { roomType, RoomTypeResponseDto } from 'api/services/room-type';
import { Field, Form, Formik } from 'formik';
import { queryClient } from 'main';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { validationSchema } from './validationSchema';

interface Props {
	roomPriceProp: RoomPriceResponseDto | null;
	handleDialogToggle: () => void;
}

interface FormData {
	roomTypeId: number;
	dailyRate: number;
	hourlyRate: number;
}

export const EditRoom = ({ roomPriceProp, handleDialogToggle }: Props) => {
	const { t } = useTranslation();

	const { mutate: updateRoom } = useMutation({
		mutationFn: roomPrice.update,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [roomPrice.queryKey] });
		},
	});

	const handleSubmit = (formData: FormData) => {
		updateRoom(
			{ ...formData, key: roomPriceProp!.key },
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
		roomTypeId: roomPriceProp?.roomTypeId || 0,
		dailyRate: roomPriceProp?.dailyRate || 0,
		hourlyRate: roomPriceProp?.hourlyRate || 0,
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
									<Field
										name="dailyRate"
										size="small"
										component={TextField}
										defaultValue={roomPriceProp?.dailyRate}
										onChange={(event) =>
											setFieldValue('dailyRate', Number(event.target.value) || 0)
										}
									/>
								</Grid>
								<Grid item xs={12}>
									<InputLabel required>{t('hourlyRate')}</InputLabel>
									<Field
										name="hourlyRate"
										size="small"
										component={TextField}
										defaultValue={roomPriceProp?.hourlyRate}
										onChange={(event) =>
											setFieldValue('hourlyRate', Number(event.target.value) || 0)
										}
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
