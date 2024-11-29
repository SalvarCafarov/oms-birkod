import { request } from 'api';
import { GetListByDynamicResponseDto } from 'types';

import { Filter, PaginationParams } from '../types';
import { RoomRequestDto, RoomResponseDto } from './room.dto';

export const room = {
	// Add Room
	add: (body: RoomRequestDto) => request.post('/Room/Add', body),

	// Update Room
	update: (body: RoomResponseDto) => request.put('/Room/Update', body),

	// Delete Room
	delete: (key: number) =>
		request.delete(`/Room/Delete`, {
			params: { key: key },
		}),

	// Get List by Dynamic
	getListByDynamic: (params: PaginationParams, filter?: Filter) =>
		request.post<GetListByDynamicResponseDto<RoomResponseDto>>(
			'/Room/GetList/ByDynamic',
			filter ? (Object.keys(filter).length ? { filter } : {}) : {},
			{
				params: params,
			},
		),

	// Get List Non-Paging
	getListNonPaging: () => request.get<RoomResponseDto[]>('/Room/GetListNonPaging'),

	queryKey: 'room',
};
