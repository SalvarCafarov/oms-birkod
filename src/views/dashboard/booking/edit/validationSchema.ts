import * as Yup from 'yup';

export const validationSchema = (t) => {
	return Yup.object().shape({
		roomTypeId: Yup.string(),
	});
};
