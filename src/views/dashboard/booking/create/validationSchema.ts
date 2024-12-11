import * as Yup from 'yup';

export const validationSchema = (t) => {
	return Yup.object().shape({
		roomTypeId: Yup.string()
			.nullable() // Null değer kabul ediliyor
			.required(t('validation:required')), // Ancak boş bırakılamaz
		startDate: Yup.date().required(t('validation:required')),
		endDate: Yup.date().required(t('validation:required')),
		specialDailyRate: Yup.number().required(t('validation:required')),
		specialHourlyRate: Yup.number().required(t('validation:required')),
		description: Yup.string().required(t('validation:required')),
	});
};
