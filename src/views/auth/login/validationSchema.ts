import * as Yup from 'yup';

export const validationSchema = (t) => {
	return Yup.object().shape({
		username: Yup.string().required(t('validation:required')),
		password: Yup.string().required(t('validation:required')),
	});
};
