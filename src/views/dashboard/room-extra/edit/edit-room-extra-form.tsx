import { Autocomplete, Box, Button, Checkbox, FormControlLabel, Grid, InputLabel, TextField } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { room } from 'api/services/room';
import { roomExtra, RoomExtraResponseDto } from 'api/services/room-extra';
import { Field, Form, Formik } from 'formik';
import { queryClient } from 'main';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { validationSchema } from './validationSchema';

interface Props {
	roomExtraProp: RoomExtraResponseDto | null;
	handleDialogToggle: () => void;
}

interface FormData {
	extraName: string;
	description: string;
	price: number;
}

export const EditRoom = ({ roomExtraProp, handleDialogToggle }: Props) => {
	const { t } = useTranslation();

	const { mutate: updateRoom } = useMutation({
		mutationFn: roomExtra.update,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [roomExtra.queryKey] });
		},
	});

	const handleSubmit = (formData: FormData) => {
		updateRoom(
			{ ...formData, key: roomExtraProp!.key },
			{
				onSuccess: () => {
					toast.success(t('successfullyUpdated'));
					handleDialogToggle();
				},
			},
		);
	};

	// initialValues updated
	const initialValues: FormData = {
		extraName: roomExtraProp?.extraName ?? '',
		description: roomExtraProp?.description ?? '',
		price: roomExtraProp?.price ?? 0,
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
									<InputLabel required>{t('extraName')}</InputLabel>
									<Field
										name="extraName"
										size="small"
										component={TextField}
										onChange={(event) =>
											setFieldValue('extraName', Number(event.target.value) || 0)
										}
									/>
								</Grid>
								<Grid item xs={12}>
									<InputLabel>{t('description')}</InputLabel>
									<Field
										name="description"
										size="small"
										component={TextField}
										onChange={(event) =>
											setFieldValue('description', Number(event.target.value) || 0)
										}
									/>
								</Grid>
								<Grid item xs={12}>
									<InputLabel required>{t('price')}</InputLabel>
									<Field
										name="price"
										size="small"
										component={TextField}
										onChange={(event) => setFieldValue('price', Number(event.target.value))}
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
