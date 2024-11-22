import { request } from 'api';
import { GetListByDynamicResponseDto } from 'types';

import { Filter, PaginationParams } from '../types';
import { RoomTypeRequestDto, RoomTypeResponseDto } from './room-type.dto';

export const roomType = {
	// Add Room Type
	add: (body: RoomTypeRequestDto) => request.post('/RoomType/Add', body),

	// Update Room Type
	update: (body: RoomTypeResponseDto) => request.put('/RoomType/Update', body),

	// Delete Room Type
	delete: (key: number) =>
		request.delete(`/RoomType/Delete`, {
			params: {
				key: key,
			},
		}),

	// Get List by Dynamic
	getListByDynamic: (params: PaginationParams, filter?: Filter) =>
		request.post<GetListByDynamicResponseDto<RoomTypeResponseDto>>(
			'/RoomType/GetList/ByDynamic',
			filter ? (Object.keys(filter).length ? { filter } : {}) : {},
			{
				params: params,
			},
		),

	// Get List Non-Paging
	getListNonPaging: () => request.get<RoomTypeResponseDto[]>('/RoomType/GetListNonPaging'),

	queryKey: 'room-type',
};
