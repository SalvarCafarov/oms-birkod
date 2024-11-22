import { Box, Button, Grid, InputLabel } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { roomType } from 'api/services/room-type';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { TextField } from 'formik-mui';
import { queryClient } from 'main';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { validationSchema } from './validationSchema';

interface Props {
	handleDialogToggle: () => void;
}

interface FormData {
	typeName: string;
	description: string;
}

export const AddRoomTypeForm = ({ handleDialogToggle }: Props) => {
	const { t } = useTranslation();

	const { mutate: addRoomType } = useMutation({
		mutationFn: roomType.add,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [roomType.queryKey] });
		},
	});

	const handleSubmit = (formData: FormData, { setSubmitting }: FormikHelpers<FormData>) => {
		addRoomType(formData, {
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
		typeName: '',
		description: '',
	};

	const translatedValidationSchema = validationSchema(t);

	return (
		<Formik initialValues={initialValues} validationSchema={translatedValidationSchema} onSubmit={handleSubmit}>
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
									<InputLabel required>{t('typeName')}</InputLabel>
									<Field name="typeName" size="small" component={TextField} />
								</Grid>
								<Grid item xs={12}>
									<InputLabel required>{t('description')}</InputLabel>
									<Field multiline rows={3} name="description" component={TextField} />
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
				);
			}}
		</Formik>
	);
};
