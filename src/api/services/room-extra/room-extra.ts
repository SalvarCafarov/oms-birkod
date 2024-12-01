import { request } from 'api';
import { GetListByDynamicResponseDto } from 'types';

import { Filter, PaginationParams } from '../types';
import { RoomExtraRequestDto, RoomExtraResponseDto } from './room-extra.dto';

export const roomExtra = {
	// Add RoomExtra
	add: (body: RoomExtraRequestDto) => request.post('/RoomExtra/Add', body),

	// Update RoomExtra
	update: (body: RoomExtraResponseDto) => request.put('/RoomExtra/Update', body),

	// Delete RoomExtra
	delete: (key: number) =>
		request.delete(`/RoomExtra/Delete`, {
			params: { key: key },
		}),

	// Get List by Dynamic
	getListByDynamic: (params: PaginationParams, filter?: Filter) =>
		request.post<GetListByDynamicResponseDto<RoomExtraResponseDto>>(
			'/RoomExtra/GetList/ByDynamic',
			filter ? (Object.keys(filter).length ? { filter } : {}) : {},
			{
				params: params,
			},
		),

	// Get List Non-Paging
	getListNonPaging: () => request.get<RoomExtraResponseDto[]>('/RoomExtra/GetListNonPaging'),

	queryKey: 'room-extra',
};
