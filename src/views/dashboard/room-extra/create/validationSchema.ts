import * as Yup from 'yup';

export const validationSchema = (t) => {
	return Yup.object().shape({
		extraName: Yup.string()
			.nullable() // Null değer kabul ediliyor
			.required(t('validation:required')), // Ancak boş bırakılamaz
		// description: Yup.string()
		// 	.nullable() // Null değer kabul ediliyor
		// 	.required(t('validation:required')), // Ancak boş bırakılamaz
		price: Yup.number()
			.nullable() // Null değer kabul ediliyor
			.required(t('validation:required')), // Ancak boş bırakılamaz
	});
};
