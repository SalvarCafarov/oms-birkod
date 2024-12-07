import { Autocomplete, Box, Button, Grid, InputLabel, TextField } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { customer, CustomerResponseDto } from 'api/services/customer';
import { roomType, RoomTypeResponseDto } from 'api/services/room-type';
import dayjs, { Dayjs } from 'dayjs';
import { Field, Form, Formik } from 'formik';
import { queryClient } from 'main';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { validationSchema } from './validationSchema';

interface Props {
	customerProp?: CustomerResponseDto;
	handleEditDialogToggle: () => void;
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

export const EditCustomerForm = ({ customerProp, handleEditDialogToggle }: Props) => {
	const { t } = useTranslation();

	const { mutate: updateCustomer } = useMutation({
		mutationFn: customer.update,
		onSuccess: () => {
			handleEditDialogToggle();
			toast.success(t('successfullyUpdated'));
			queryClient.invalidateQueries({ queryKey: [customer.queryKey] });
		},
	});

	const initialValues: FormData = {
		name: customerProp?.name || '', // roomTypeName'ı kullanıyoruz
		surName: customerProp?.surName || '',
		fatherName: customerProp?.fatherName || '',
		passportNo: customerProp?.fatherName || '',
		telephoneNo: customerProp?.telephoneNo || '',
		email: customerProp?.email || '',
		birthday: customerProp?.birthday ? dayjs(customerProp.birthday) : dayjs(),
	};

	const handleSubmit = (formData: FormData) => {
		// const selectedRoomType = roomTypeList?.find((item) => item.typeName === formData.roomTypeName);

		const payload = {
			key: customerProp!.key, // customerProp'tan gelen key
			birthday: dayjs(formData.birthday).toDate(), // birthday'yi Date nesnesine çeviriyoruz
			name: formData.name || '',
			surName: formData.surName || '',
			fatherName: formData.fatherName || '',
			passportNo: formData.passportNo || '',
			telephoneNo: formData.telephoneNo || '',
			email: formData.email || '',
		};

		updateCustomer(payload);
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
								<InputLabel required>{t('surName')}</InputLabel>
								<Field
									name="surName"
									size="small"
									component={TextField}
									onChange={(event) => setFieldValue('surName', event.target.value || '')}
								/>
							</Grid>
							<Grid item xs={12}>
								<InputLabel required>{t('fatherName')}</InputLabel>
								<Field
									name="fatherName"
									size="small"
									component={TextField}
									onChange={(event) => setFieldValue('fatherName', event.target.value || '')}
								/>
							</Grid>
							<Grid item xs={12}>
								<InputLabel required>{t('fatherName')}</InputLabel>
								<Field
									name="fatherName"
									size="small"
									component={TextField}
									onChange={(event) => setFieldValue('fatherName', event.target.value || '')}
								/>
							</Grid>
							<Grid item xs={12}>
								<InputLabel required>{t('passportNo')}</InputLabel>
								<Field
									name="passportNo"
									size="small"
									component={TextField}
									onChange={(event) => setFieldValue('passportNo', event.target.value || '')}
								/>
							</Grid>
							<Grid item xs={12}>
								<InputLabel required>{t('telephoneNo')}</InputLabel>
								<Field
									name="telephoneNo"
									size="small"
									component={TextField}
									onChange={(event) => setFieldValue('telephoneNo', event.target.value || '')}
								/>
							</Grid>
							<Grid item xs={12}>
								<InputLabel>{t('email')}</InputLabel>
								<Field
									name="email"
									size="small"
									component={TextField}
									onChange={(event) => setFieldValue('email', event.target.value || '')}
								/>
							</Grid>
							<Grid item xs={12}>
								<InputLabel required>{t('birthday')}</InputLabel>
								<TextField
									fullWidth
									type="date"
									size="small"
									variant="outlined"
									value={values.birthday.format('YYYY-MM-DD')}
									onChange={(event) => setFieldValue('birthday', dayjs(event.target.value))}
								/>
							</Grid>
							<Grid item xs={12}>
								<InputLabel required>{t('name')}</InputLabel>
								<Field
									name="name"
									size="small"
									component={TextField}
									onChange={(event) => setFieldValue('name', Number(event.target.value) || 0)}
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