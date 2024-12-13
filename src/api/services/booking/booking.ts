import { request } from 'api';
import { GetListByDynamicResponseDto } from 'types';

import { Filter, PaginationParams } from '../types';
import { BookingRequestDto, GuestDto } from './booking.dto';

export const specialDayPrice = {
	// Add SpecialDayPrice
	add: (body: BookingRequestDto) => request.post('/SpecialDayPrice/Add', body),

	// Update SpecialDayPrice
	update: (body: BookingRequestDto) => request.put('/SpecialDayPrice/Update', body),

	// Delete SpecialDayPrice
	delete: (key: number) =>
		request.delete(`/SpecialDayPrice/Delete`, {
			params: { key: key },
		}),

	// Get List by Dynamic
	getListByDynamic: (params: PaginationParams, filter?: Filter) =>
		request.post<GetListByDynamicResponseDto<GuestDto>>(
			'/SpecialDayPrice/GetList/ByDynamic',
			filter ? (Object.keys(filter).length ? { filter } : {}) : {},
			{
				params: params,
			},
		),

	// Get List Non-Paging
	getListNonPaging: () => request.get<GuestDto[]>('/SpecialDayPrice/GetListNonPaging'),

	queryKey: 'special-day-price',
};
