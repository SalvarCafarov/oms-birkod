import { request } from 'api';
import { GetListByDynamicResponseDto } from 'types';

import { Filter, PaginationParams } from '../types';
import { SpecialDayPriceRequestDto, SpecialDayPriceResponseDto } from './special-day-price.dto';

export const specialDayPrice = {
	// Add SpecialDayPrice
	add: (body: SpecialDayPriceRequestDto) => request.post('/SpecialDayPrice/Add', body),

	// Update SpecialDayPrice
	update: (body: SpecialDayPriceResponseDto) => request.put('/SpecialDayPrice/Update', body),

	// Delete SpecialDayPrice
	delete: (key: number) =>
		request.delete(`/SpecialDayPrice/Delete`, {
			params: { key: key },
		}),

	// Get List by Dynamic
	getListByDynamic: (params: PaginationParams, filter?: Filter) =>
		request.post<GetListByDynamicResponseDto<SpecialDayPriceResponseDto>>(
			'/SpecialDayPrice/GetList/ByDynamic',
			filter ? (Object.keys(filter).length ? { filter } : {}) : {},
			{
				params: params,
			},
		),

	// Get List Non-Paging
	getListNonPaging: () => request.get<SpecialDayPriceResponseDto[]>('/SpecialDayPrice/GetListNonPaging'),

	queryKey: 'special-day-price',
};
