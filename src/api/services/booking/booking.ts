import { request } from 'api';
import { GetListByDynamicResponseDto } from 'types';

import { Filter, PaginationParams } from '../types';
import { BookingRequestDto, UpdateBookingDto } from './booking.dto';

// BookingRequestDto içeriğini, verdiğiniz JSON örneğine göre düzenliyoruz
// Key alanı "Add" isteğinde gerekmiyor, "Update" isteğinde "key" gerekiyor.

export const booking = {
	// Add Booking
	add: (body: BookingRequestDto) => request.post('/Booking/Add', body),

	// Update Booking
	update: (body: UpdateBookingDto) => request.put('/Booking/Update', body),

	// Delete Booking
	delete: (key: number) =>
		request.delete('/Booking/Delete', {
			params: { key },
		}),

	// Get List by Dynamic
	getListByDynamic: (params: PaginationParams, filter?: Filter) =>
		request.post<GetListByDynamicResponseDto<unknown>>(
			'/Booking/GetList/ByDynamic',
			filter ? (Object.keys(filter).length ? { filter } : {}) : {},
			{
				params: params,
			},
		),

	getFormByKey: (key: number) => request.get<UpdateBookingDto>(`/Booking/${key}`),

	// Diğer fonksiyonları (getList vs.) kendiniz yazmak isterseniz, buraya eklemeden bırakabilirsiniz.

	queryKey: 'booking',
};
