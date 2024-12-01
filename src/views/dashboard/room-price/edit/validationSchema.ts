import * as Yup from 'yup';

export const validationSchema = (t) => {
	return Yup.object().shape({
		roomTypeId: Yup.number()
			.nullable() // Null değer kabul ediliyor
			.required(t('validation:required')), // Ancak boş bırakılamaz
		dailyRate: Yup.number()
			.nullable() // Null değer kabul ediliyor
			.required(t('validation:required')), // Ancak boş bırakılamaz
		hourlyRate: Yup.number()
			.nullable() // Null değer kabul ediliyor
			.required(t('validation:required')), // Ancak boş bırakılamaz
	});
};
