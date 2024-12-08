import { Autocomplete, Box, Button, Grid, InputLabel, TextField } from '@mui/material';
import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useMutation, useQuery } from '@tanstack/react-query';
import { travelAgency, TravelAgencyCreateRequestDto } from 'api/services/travel-agency';
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
	agencyName: string;
	formNo: string;
	startDate: Dayjs;
	endDate: Dayjs;
	discountRate: number;
}

export const AddTravelAgencyForm = ({ handleDialogToggle }: Props) => {
	const { t } = useTranslation();

	const { mutate: addTravelAgency } = useMutation({
		mutationFn: travelAgency.add,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [travelAgency.queryKey] });
			toast.success(t('successfullyCreated'));
			handleDialogToggle();
		},
	});

	const handleSubmit = (formData: FormData, { setSubmitting }: FormikHelpers<FormData>) => {
		const payload: TravelAgencyCreateRequestDto = {
			agencyName: formData.agencyName,
			formNo: formData.formNo,
			startDate: dayjs(formData.startDate).toDate(),
			endDate: dayjs(formData.endDate).toDate(),
			discountRate: formData.discountRate,
		};

		addTravelAgency(payload, { onSettled: () => setSubmitting(false) });
	};

	const initialValues: FormData = {
		agencyName: '',
		formNo: '',
		startDate: dayjs(),
		endDate: dayjs(),
		discountRate: 0,
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
							{/* Agency Name */}
							<Grid item xs={12}>
								<InputLabel required>{t('agencyName')}</InputLabel>
								<TextField
									name="agencyName"
									size="small"
									variant="outlined"
									value={values.agencyName}
									error={touched.agencyName && Boolean(errors.agencyName)}
									helperText={touched.agencyName && errors.agencyName}
									onChange={(event) => setFieldValue('agencyName', event.target.value)}
								/>
							</Grid>

							{/* Request Number */}
							<Grid item xs={12}>
								<InputLabel>{t('formNo')}</InputLabel>
								<TextField
									name="formNo"
									size="small"
									variant="outlined"
									value={values.formNo}
									error={touched.formNo && Boolean(errors.formNo)}
									helperText={touched.formNo && errors.formNo}
									onChange={(event) => setFieldValue('formNo', event.target.value)}
								/>
							</Grid>

							{/* Start Date */}
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
										onChange={(value) => setFieldValue('startDate', value || dayjs().toDate())}
									/>
								</LocalizationProvider>
							</Grid>

							{/* End Date */}
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
										onChange={(value) => setFieldValue('endDate', value || dayjs().toDate())}
									/>
								</LocalizationProvider>
							</Grid>

							{/* Discount Rate */}
							<Grid item xs={12}>
								<InputLabel required>{t('discountRate')}</InputLabel>
								<TextField
									fullWidth
									name="discountRate"
									size="small"
									variant="outlined"
									value={values.discountRate}
									error={touched.discountRate && Boolean(errors.discountRate)}
									helperText={touched.discountRate && errors.discountRate}
									onChange={(event) => setFieldValue('discountRate', Number(event.target.value) || 0)}
								/>
							</Grid>

							{/* Active Status */}
							{/* <Grid item xs={12}>
								<InputLabel required>{t('isActive')}</InputLabel>
								<TextField
									fullWidth
									name="isActive"
									value={values.isActive}
									error={touched.isActive && Boolean(errors.isActive)}
									helperText={touched.isActive && errors.isActive}
									onChange={(event) => setFieldValue('isActive', event.target.value)}
								/>
							</Grid> */}
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
