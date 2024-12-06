import * as Yup from 'yup';

export const validationSchema = (t) => {
	return Yup.object().shape({
		agencyName: Yup.string().trim().required(t('validation:required')),
		discountRate: Yup.number().required(t('validation:required')),
	});
};
