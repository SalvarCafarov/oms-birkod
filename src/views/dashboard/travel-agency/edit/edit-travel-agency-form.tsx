import { Box, Button, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { travelAgency, TravelAgencyResponseDto } from 'api/services/travel-agency';
import dayjs, { Dayjs } from 'dayjs';
import { Form, Formik } from 'formik';
import { queryClient } from 'main';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { validationSchema } from './validationSchema';

interface Props {
	travelAgencyProp?: TravelAgencyResponseDto; // Opsiyonel olacak şekilde güncellendi
	handleEditDialogToggle: () => void;
}

interface FormData {
	agencyName: string;
	formNo: string;
	discountRate: number;
	startDate: Dayjs;
	endDate: Dayjs;
	isActive: string;
}

export const EditTravelAgencyForm = ({ travelAgencyProp, handleEditDialogToggle }: Props) => {
	const { t } = useTranslation();

	const { mutate: updateTravelAgency } = useMutation({
		mutationFn: travelAgency.update,
		onSuccess: () => {
			handleEditDialogToggle();
			toast.success(t('successfullyUpdated'));
			queryClient.invalidateQueries({ queryKey: [travelAgency.queryKey] });
		},
	});

	// Burada yapılan kontrol ile `undefined` durumu düzgün şekilde yönetiliyor
	const initialValues: FormData = travelAgencyProp
		? {
				agencyName: travelAgencyProp.agencyName,
				formNo: travelAgencyProp.formNo,
				discountRate: travelAgencyProp.discountRate,
				startDate: dayjs(travelAgencyProp.startDate),
				endDate: dayjs(travelAgencyProp.endDate),
				isActive: travelAgencyProp.isActive,
			}
		: {
				agencyName: '',
				formNo: '',
				discountRate: 0,
				startDate: dayjs(),
				endDate: dayjs(),
				isActive: '',
			};

	const handleSubmit = (formData: FormData) => {
		if (travelAgencyProp) {
			const payload = {
				key: travelAgencyProp.key,
				agencyName: formData.agencyName,
				formNo: formData.formNo,
				discountRate: formData.discountRate,
				startDate: dayjs(formData.startDate).toDate(),
				endDate: dayjs(formData.endDate).toDate(),
				isActive: formData.isActive,
			};

			updateTravelAgency(payload);
		}
	};

	if (!travelAgencyProp) {
		return (
			<Box sx={{ mt: 4, mx: 'auto', textAlign: 'center' }}>
				<Typography variant="h6">{t('noAgencySelected')}</Typography>
			</Box>
		);
	}

	return (
		<Formik
			enableReinitialize
			initialValues={initialValues}
			validationSchema={validationSchema(t)}
			onSubmit={handleSubmit}
		>
			{({ values, setFieldValue }) => (
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
								<InputLabel required>{t('agencyName')}</InputLabel>
								<TextField
									fullWidth
									name="agencyName"
									size="small"
									variant="outlined"
									value={values.agencyName}
									onChange={(event) => setFieldValue('agencyName', event.target.value)}
								/>
							</Grid>
							<Grid item xs={12}>
								<InputLabel required>{t('discountRate')}</InputLabel>
								<TextField
									fullWidth
									name="discountRate"
									size="small"
									type="number"
									variant="outlined"
									value={values.discountRate}
									onChange={(event) => setFieldValue('discountRate', Number(event.target.value))}
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
								<InputLabel required>{t('isActive')}</InputLabel>
								<Select
									fullWidth
									name="isActive"
									value={values.isActive ? 'true' : 'false'}
									onChange={(event) => setFieldValue('isActive', event.target.value === 'true')}
								>
									<MenuItem value="true">{t('yes')}</MenuItem>
									<MenuItem value="false">{t('no')}</MenuItem>
								</Select>
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
