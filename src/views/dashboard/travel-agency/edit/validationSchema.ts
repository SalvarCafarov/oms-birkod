import * as Yup from 'yup';

export const validationSchema = (t) => {
	return Yup.object().shape({
		agencyName: Yup.string().trim().required(t('validation:required')),
		startDate: Yup.date().required(t('validation:required')),
		endDate: Yup.date().required(t('validation:required')),
		discountRate: Yup.number().required(t('validation:required')),
		isActive: Yup.string().trim().required(t('validation:required')),
	});
};
