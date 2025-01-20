// src/views/dashboard/booking/create/getBookingSchema.ts

import { z } from 'zod';

/**
 * Creates a dynamic Zod schema for the booking form,
 * depending on whether discount & guests are enabled.
 *
 * @param showDiscount - Boolean indicating if discount fields are enabled
 * @param showGuests - Boolean indicating if guests fields are enabled
 * @param t - Translation function from i18n
 */
export function getBookingSchema(showDiscount: boolean, showGuests: boolean, t: (key: string) => string) {
	return z.object({
		// CustomerId (required)
		CustomerId: z
			.number({ required_error: t('booking:customerIdRequired') })
			.nonnegative(t('booking:customerIdNonnegative'))
			.min(1, t('booking:customerIdMinError')),

		// TravelAgencyId (optional)
		TravelAgencyId: z.number().optional(),

		// startDate (required)
		startDate: z
			.string({ required_error: t('booking:startDateRequired') })
			.refine((val) => val !== '' && val !== undefined, {
				message: t('booking:startDateEmptyError'),
			}),

		// endDate (optional)
		endDate: z
			.string({ required_error: t('booking:endDateRequired') })
			.refine((val) => val !== '' && val !== undefined, {
				message: t('booking:endDateEmptyError'),
			}),

		// checkIn (boolean, optional)
		checkIn: z.boolean().optional(),

		// isHourly (required)
		isHourly: z.boolean({ required_error: t('booking:isHourlyRequired') }),

		// childCount (optional)
		childCount: z
			.preprocess(
				(val) => (val === '' || val === undefined ? undefined : Number(val)),
				z.number().min(0, t('booking:childCountNonnegative')).optional(),
			)
			.optional(),

		// description (optional)
		description: z.string().optional(),

		// discountAmount + discountReason
		// If "You want discount" is checked, discountAmount is required
		discountAmount: showDiscount
			? z.preprocess(
					(val) => (val === '' || val === undefined ? undefined : Number(val)),
					z.number({ required_error: t('booking:discountAmountRequired') }),
				)
			: z.number().optional(),

		// discountReason is also required if showDiscount is true
		discountReason: showDiscount ? z.string().min(1, t('booking:discountReasonRequired')) : z.string().optional(),

		// rooms (array, at least one)
		rooms: z.array(z.number()).nonempty(t('booking:roomsRequiredError')),

		// roomExtras (optional)
		roomExtras: z.array(z.number()).optional(),

		// guests
		guests: showGuests
			? z.array(
					z.object({
						name: z.string().min(1, t('booking:guestNameRequired')),
						surname: z.string().min(1, t('booking:guestSurnameRequired')),
						fatherName: z.string().optional(),
						passportNo: z.string().optional(),
						birthday: z.string().min(1, t('booking:guestBirthdayRequired')),
					}),
				)
			: z
					.array(
						z.object({
							name: z.string().optional(),
							surname: z.string().optional(),
							fatherName: z.string().optional(),
							passportNo: z.string().optional(),
							birthday: z.string().optional(),
						}),
					)
					.optional()
					.default([]),
	});
}
