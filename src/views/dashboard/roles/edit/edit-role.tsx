import { Box, Button, Grid, InputLabel } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { roles } from 'api/services/roles';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { TextField } from 'formik-mui';
import { queryClient } from 'main';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Role } from 'types';

import { validationSchema } from '../edit/validationSchema';

interface Props {
	role?: Role;
	handleDialogToggle: () => void;
}

interface FormData {
	name: string;
	description: string;
}

export const EditRole = ({ role, handleDialogToggle }: Props) => {
	const { t } = useTranslation();

	const { mutate: updateRole } = useMutation({
		mutationFn: roles.update,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [roles.queryKey] });
		},
	});

	const handleSubmit = (formData: FormData, { setSubmitting }: FormikHelpers<FormData>) => {
		updateRole(
			{ ...formData, key: role!.key },
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
		name: role?.name || '',
		description: role?.description || '',
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
									<InputLabel required>{t('roles:name')}</InputLabel>
									<Field name="name" size="small" component={TextField} />
								</Grid>
								<Grid item xs={12}>
									<InputLabel>{t('roles:description')}</InputLabel>
									<Field multiline rows={3} name="description" component={TextField} />
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
