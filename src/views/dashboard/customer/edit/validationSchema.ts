import * as Yup from 'yup';

export const validationSchema = (t) => {
	return Yup.object().shape({
		name: Yup.string().required(t('validation:required')),
		surName: Yup.string().required(t('validation:required')),
		fatherName: Yup.string().required(t('validation:required')),
		passportNo: Yup.string().required(t('validation:required')),
		telephoneNo: Yup.string().required(t('validation:required')),
		email: Yup.string().required(t('validation:required')),
		birthday: Yup.date().required(t('validation:required')),
	});
};
