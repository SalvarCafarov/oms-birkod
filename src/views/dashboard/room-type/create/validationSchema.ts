import * as Yup from 'yup';

export const validationSchema = (t) => {
	return Yup.object().shape({
		typeName: Yup.string().trim().required(t('validation:required')),
		// description: Yup.string().trim().required(t('validation:required')),
	});
};
