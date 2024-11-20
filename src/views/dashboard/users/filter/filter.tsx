import { Icon } from '@iconify/react/dist/iconify.js';
import { Box, Button, Container, InputLabel } from '@mui/material';
import { useAppDispatch } from 'app/hooks';
import { setFilter } from 'context/filter/filterSlice';
import { closeFilterSidebar } from 'context/settings/settingsSlice';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { TextField } from 'formik-mui';
import { queryClient } from 'main';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

interface FormData {
	name: string;
	surname: string;
	telephoneNo: string;
	position: string;
	email: string;
	department: string;
}

const Filter = () => {
	const dispatch = useAppDispatch();
	const location = useLocation();
	const { t } = useTranslation();
	const [initialValues, setInitialValues] = useState<FormData>({
		name: '',
		surname: '',
		telephoneNo: '',
		position: '',
		email: '',
		department: '',
	});

	useEffect(() => {
		setInitialValues({
			name: '',
			surname: '',
			telephoneNo: '',
			position: '',
			email: '',
			department: '',
		});
		dispatch(setFilter({ key: 'usersFilter', value: {} }));
		queryClient.invalidateQueries({ queryKey: ['users'] });
	}, [location.pathname, dispatch]);

	const onSubmit = (values: FormData, { setSubmitting }: FormikHelpers<FormData>) => {
		setSubmitting(false);

		dispatch(setFilter({ key: 'usersFilter', value: values }));
		dispatch(closeFilterSidebar());
		queryClient.invalidateQueries({ queryKey: ['users'] });
	};

	const resetForm = (resetFormikForm: () => void) => {
		dispatch(setFilter({ key: 'usersFilter', value: {} }));
		dispatch(closeFilterSidebar());
		queryClient.invalidateQueries({ queryKey: ['users'] });
		resetFormikForm();
	};

	const isAllFieldsEmpty = (values: FormData) => {
		return (
			!values.name &&
			!values.surname &&
			!values.telephoneNo &&
			!values.position &&
			!values.email &&
			!values.department
		);
	};

	return (
		<Container maxWidth="sm">
			<Formik key={location.pathname} initialValues={initialValues} onSubmit={onSubmit}>
				{({ submitForm, isSubmitting, values, resetForm: formikResetForm }) => (
					<Form>
						<Box marginBottom={2} width="100%">
							<InputLabel>{t('users:name')}</InputLabel>
							<Field fullWidth size="small" name="name" type="text" component={TextField} />
						</Box>
						<Box marginBottom={2} width="100%">
							<InputLabel>{t('users:surname')}</InputLabel>
							<Field fullWidth size="small" name="surname" type="text" component={TextField} />
						</Box>
						<Box marginBottom={2} width="100%">
							<InputLabel>{t('users:telephoneNo')}</InputLabel>
							<Field fullWidth size="small" name="telephoneNo" type="text" component={TextField} />
						</Box>
						<Box marginBottom={2} width="100%">
							<InputLabel>{t('users:position')}</InputLabel>
							<Field fullWidth size="small" name="position" type="text" component={TextField} />
						</Box>
						<Box marginBottom={2} width="100%">
							<InputLabel>{t('users:email')}</InputLabel>
							<Field fullWidth size="small" name="email" type="text" component={TextField} />
						</Box>
						<Box marginBottom={2} width="100%">
							<InputLabel>{t('users:department')}</InputLabel>
							<Field fullWidth size="small" name="department" type="text" component={TextField} />
						</Box>

						<Button
							fullWidth
							variant="contained"
							color="primary"
							disabled={isSubmitting || isAllFieldsEmpty(values)}
							sx={{ marginTop: 2 }}
							onClick={submitForm}
						>
							<Icon fontSize="1.125rem" icon="tabler:filter" />
							{t('filter')}
						</Button>
						<Button
							fullWidth
							variant="tonal"
							color="primary"
							disabled={isSubmitting}
							type="reset"
							sx={{ marginTop: 3 }}
							onClick={() => resetForm(formikResetForm)}
						>
							<Icon fontSize="1.125rem" icon="tabler:filter-x" />
							{t('reset')}
						</Button>
					</Form>
				)}
			</Formik>
		</Container>
	);
};

export default Filter;
