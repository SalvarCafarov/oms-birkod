import { Box, Button, Grid, InputLabel } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { travelAgency, TravelAgencyResponseDto } from 'api/services/travel-agency';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { TextField } from 'formik-mui';
import { queryClient } from 'main';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { validationSchema } from './validationSchema';

interface Props {
	travelAgencyProp?: TravelAgencyResponseDto;
	handleDialogToggle: () => void;
}

interface FormData {
	agencyName: string;
	discountRate: number;
}

export const EditTravelAgency = ({ travelAgencyProp: travelAgencyProp, handleDialogToggle }: Props) => {
	const { t } = useTranslation();

	const { mutate: updateTravelAgency } = useMutation({
		mutationFn: travelAgency.update,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [travelAgency.queryKey] });
		},
	});

	const handleSubmit = (formData: FormData, { setSubmitting }: FormikHelpers<FormData>) => {
		updateTravelAgency(
			{ ...formData, key: travelAgencyProp!.key },
			{
				onSuccess: () => {
					toast.success(t('successfullyUpdated'));
					handleDialogToggle();
				},
				onSettled: () => {
					setSubmitting(false);
				},
			},
		);
	};

	const initialValues = {
		agencyName: travelAgencyProp?.agencyName || '',
		discountRate: travelAgencyProp?.discountRate || 0,
	};

	const translatedValidationSchema = validationSchema(t);

	return (
		<Formik
			enableReinitialize
			initialValues={initialValues}
			validationSchema={translatedValidationSchema}
			onSubmit={handleSubmit}
		>
			{() => {
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
									<InputLabel required>{t('name')}</InputLabel>
									<Field name="agencyName" size="small" component={TextField} />
								</Grid>
								<Grid item xs={12}>
									<InputLabel required>{t('name')}</InputLabel>
									<Field name="discountRate" size="small" component={TextField} />
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
