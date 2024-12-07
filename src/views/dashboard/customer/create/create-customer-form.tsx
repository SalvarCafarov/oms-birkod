import { Box, Button, Grid, InputLabel, TextField } from '@mui/material';
import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useMutation } from '@tanstack/react-query';
import { customer, CustomerRequestDto } from 'api/services/customer';
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
	name: string;
	surName: string;
	fatherName: string;
	passportNo: string;
	telephoneNo: string;
	email: string;
	birthday: Dayjs;
}

export const AddCustomerForm = ({ handleDialogToggle }: Props) => {
	const { t } = useTranslation();

	const { mutate: addCustomer } = useMutation({
		mutationFn: customer.add,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [customer.queryKey] });
			toast.success(t('successfullyCreated'));
			handleDialogToggle();
		},
		onError: () => {
			toast.error(t('errorOccurred'));
		},
	});

	const handleSubmit = (formData: FormData, { setSubmitting }: FormikHelpers<FormData>) => {
		const payload: CustomerRequestDto = {
			name: formData.name,
			surName: formData.surName,
			fatherName: formData.fatherName,
			passportNo: formData.passportNo,
			telephoneNo: formData.telephoneNo,
			email: formData.email,
			birthday: dayjs(formData.birthday).toDate(), // dayjs ile Date türüne dönüştürme
		};

		addCustomer(payload, {
			onSettled: () => setSubmitting(false),
		});
	};

	const initialValues: FormData = {
		name: '',
		surName: '',
		fatherName: '',
		passportNo: '',
		telephoneNo: '',
		email: '',
		birthday: dayjs(),
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
								<InputLabel required>{t('name')}</InputLabel>
								<TextField
									fullWidth
									name="name"
									size="small"
									variant="outlined"
									value={values.name}
									error={touched.name && Boolean(errors.name)}
									helperText={touched.name && errors.name}
									onChange={(event) => setFieldValue('name', event.target.value)}
								/>
							</Grid>
							<Grid item xs={12}>
								<InputLabel required>{t('surName')}</InputLabel>
								<TextField
									fullWidth
									name="surName"
									size="small"
									variant="outlined"
									value={values.surName}
									error={touched.surName && Boolean(errors.surName)}
									helperText={touched.surName && errors.surName}
									onChange={(event) => setFieldValue('surName', event.target.value)}
								/>
							</Grid>
							<Grid item xs={12}>
								<InputLabel required>{t('fatherName')}</InputLabel>
								<TextField
									fullWidth
									name="fatherName"
									size="small"
									variant="outlined"
									value={values.fatherName}
									error={touched.fatherName && Boolean(errors.fatherName)}
									helperText={touched.fatherName && errors.fatherName}
									onChange={(event) => setFieldValue('fatherName', event.target.value)}
								/>
							</Grid>
							<Grid item xs={12}>
								<InputLabel required>{t('passportNo')}</InputLabel>
								<TextField
									fullWidth
									name="passportNo"
									size="small"
									variant="outlined"
									value={values.passportNo}
									error={touched.passportNo && Boolean(errors.passportNo)}
									helperText={touched.passportNo && errors.passportNo}
									onChange={(event) => setFieldValue('passportNo', event.target.value)}
								/>
							</Grid>
							<Grid item xs={12}>
								<InputLabel required>{t('telephoneNo')}</InputLabel>
								<TextField
									fullWidth
									name="telephoneNo"
									size="small"
									variant="outlined"
									value={values.telephoneNo}
									error={touched.telephoneNo && Boolean(errors.telephoneNo)}
									helperText={touched.telephoneNo && errors.telephoneNo}
									onChange={(event) => setFieldValue('telephoneNo', event.target.value)}
								/>
							</Grid>
							<Grid item xs={12}>
								<InputLabel required>{t('email')}</InputLabel>
								<TextField
									fullWidth
									name="email"
									size="small"
									variant="outlined"
									value={values.email}
									error={touched.email && Boolean(errors.email)}
									helperText={touched.email && errors.email}
									onChange={(event) => setFieldValue('email', event.target.value)}
								/>
							</Grid>
							<Grid item xs={12}>
								<InputLabel required>{t('birthday')}</InputLabel>
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<MobileDateTimePicker
										value={values.birthday}
										ampm={false}
										slots={{
											textField: (params) => (
												<TextField
													{...params}
													fullWidth
													error={touched.birthday && Boolean(errors.birthday)}
													helperText={touched.birthday && errors.birthday}
												/>
											),
										}}
										onChange={(value) => setFieldValue('birthday', value || dayjs())}
									/>
								</LocalizationProvider>
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
