import * as Yup from 'yup';

export const validationSchema = (t) => {
	return Yup.object().shape({
		roomNumber: Yup.string().trim().required(t('validation:required')),

		roomStatus: Yup.number().required(t('validation:required')),
		roomTypeId: Yup.string()
			.nullable() // Null değer kabul ediliyor
			.required(t('validation:required')), // Ancak boş bırakılamaz
	});
};
