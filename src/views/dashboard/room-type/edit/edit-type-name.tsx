import { Box, Button, Grid, InputLabel } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { roomType, RoomTypeResponseDto } from 'api/services/room-type';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { TextField } from 'formik-mui';
import { queryClient } from 'main';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { validationSchema } from './validationSchema';

interface Props {
	roomTypeProp?: RoomTypeResponseDto;
	handleDialogToggle: () => void;
}

interface FormData {
	typeName: string;
	description: string;
}

export const EditRoomType = ({ roomTypeProp: roomTypeProp, handleDialogToggle }: Props) => {
	const { t } = useTranslation();

	const { mutate: updateRoomType } = useMutation({
		mutationFn: roomType.update,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [roomType.queryKey] });
		},
	});

	const handleSubmit = (formData: FormData, { setSubmitting }: FormikHelpers<FormData>) => {
		updateRoomType(
			{ ...formData, key: roomTypeProp!.key },
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
		typeName: roomTypeProp?.typeName || '',
		description: roomTypeProp?.description || '',
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
									<Field name="typeName" size="small" component={TextField} />
								</Grid>
								<Grid item xs={12}>
									<InputLabel>{t('description')}</InputLabel>
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
