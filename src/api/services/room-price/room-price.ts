import { request } from 'api';
import { GetListByDynamicResponseDto } from 'types';

import { Filter, PaginationParams } from '../types';
import { RoomPriceRequestDto, RoomPriceResponseDto } from './room-price.dto';

export const roomPrice = {
	// Add RoomPrice
	add: (body: RoomPriceRequestDto) => request.post('/RoomPrice/Add', body),

	// Update RoomPrice
	update: (body: RoomPriceResponseDto) => request.put('/RoomPrice/Update', body),

	// Delete RoomPrice
	delete: (key: number) =>
		request.delete(`/RoomPrice/Delete`, {
			params: { key: key },
		}),

	// Get List by Dynamic
	getListByDynamic: (params: PaginationParams, filter?: Filter) =>
		request.post<GetListByDynamicResponseDto<RoomPriceResponseDto>>(
			'/RoomPrice/GetList/ByDynamic',
			filter ? (Object.keys(filter).length ? { filter } : {}) : {},
			{
				params: params,
			},
		),

	// Get List Non-Paging
	getListNonPaging: () => request.get<RoomPriceResponseDto[]>('/RoomPrice/GetListNonPaging'),

	queryKey: 'room-price',
};
