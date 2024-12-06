import { Autocomplete, Box, Button, Checkbox, FormControlLabel, Grid, InputLabel, TextField } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { roomExtra } from 'api/services/room-extra';
import { Form, Formik, FormikHelpers } from 'formik';
import { queryClient } from 'main';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { validationSchema } from './validationSchema';

interface Props {
	handleDialogToggle: () => void;
}

interface FormData {
	extraName: string;
	description: string;
	price: number;
}

export const AddRoomExtraForm = ({ handleDialogToggle }: Props) => {
	const { t } = useTranslation();

	const { mutate: addRoomExtra } = useMutation({
		mutationFn: roomExtra.add,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [roomExtra.queryKey] });
		},
	});

	const handleSubmit = (formData: FormData, { setSubmitting }: FormikHelpers<FormData>) => {
		const payload = {
			...formData,
		};

		addRoomExtra(payload, {
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
		extraName: '',
		description: '',
		price: 0,
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
								<InputLabel required>{t('extraName')}</InputLabel>
								<TextField
									fullWidth
									name="extraName"
									size="small"
									variant="outlined"
									value={values.extraName}
									error={touched.extraName && Boolean(errors.extraName)}
									helperText={touched.extraName && errors.extraName}
									onChange={(event) => {
										setFieldValue('extraName', event.target.value || '');
									}}
								/>
							</Grid>
							<Grid item xs={12}>
								<InputLabel>{t('description')}</InputLabel>
								<TextField
									fullWidth
									name="description"
									size="small"
									variant="outlined"
									value={values.description}
									error={touched.description && Boolean(errors.description)}
									helperText={touched.description && errors.description}
									onChange={(event) => {
										setFieldValue('description', event.target.value || '');
									}}
								/>
							</Grid>
							<Grid item xs={12}>
								<InputLabel required>{t('price')}</InputLabel>
								<TextField
									fullWidth
									name="price"
									size="small"
									variant="outlined"
									value={values.price}
									error={touched.price && Boolean(errors.price)}
									helperText={touched.price && errors.price}
									onChange={(event) => {
										setFieldValue('price', Number(event.target.value) || 0);
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
