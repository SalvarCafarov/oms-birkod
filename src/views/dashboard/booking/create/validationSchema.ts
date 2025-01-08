// src/views/dashboard/booking/create/validationSchema.ts
import dayjs from 'dayjs';
import * as yup from 'yup';

const bookingSchema = yup.object().shape({
	CustomerId: yup.number().required('Customer is required'),

	TravelAgencyId: yup.number().nullable(),

	// Tarih alanlarını string olarak tutuyoruz, .test ile kontrol ediyoruz.
	startDate: yup
		.string()
		.required('Start Date is required')
		.test('is-valid-date', 'Start Date must be a valid date', (value) => {
			if (!value) return false; // Boş ise geçersiz

			return dayjs(value).isValid();
		}),

	endDate: yup
		.string()
		.nullable()
		.test('is-valid-date', 'End Date must be a valid date', (value) => {
			// boş veya null ise sorun yok
			if (!value) return true;

			return dayjs(value).isValid();
		}),

	checkIn: yup
		.string()
		.nullable()
		.test('is-valid-date', 'Check-In must be a valid date', (value) => {
			if (!value) return true;

			return dayjs(value).isValid();
		}),

	isHourly: yup.boolean().required(),

	childCount: yup.number().typeError('Child Count must be a number').nullable(),

	description: yup.string().nullable(),

	// discountAmount: UI'da metin olarak girilebilir;
	// ama biz number'a çeviriyoruz. Boş ise 0 veriyoruz.
	discountAmount: yup
		.number()
		.transform((curr, originalValue) => {
			// Eğer kullanıcı hiç değer girmemişse veya boş string girmişse 0'a çeviriyoruz.
			return originalValue === '' || originalValue == null ? 0 : curr;
		})
		.typeError('Discount Amount must be a valid number')
		.required('Discount amount is required'),

	discountReason: yup.string().nullable(),

	rooms: yup
		.array()
		.of(yup.number().required())
		.min(1, 'At least one room is required') // Örnek kural
		.required('Rooms is required'),

	roomExtras: yup.array().of(yup.number()).nullable(),

	guests: yup.array().of(
		yup.object().shape({
			name: yup.string().required('Guest name is required'),
			surname: yup.string().required('Guest surname is required'),
			fatherName: yup.string().nullable(),
			passportNo: yup.string().nullable(),
			birthday: yup
				.string()
				.required('Birthday is required')
				.test('is-valid-date', 'Birthday must be a valid date', (value) => {
					if (!value) return false;

					return dayjs(value).isValid();
				}),
		}),
	),
});

export default bookingSchema;
