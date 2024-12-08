import { request } from 'api';
import { GetListByDynamicResponseDto } from 'types';

import { Filter, PaginationParams } from '../types';
import { TravelAgencyCreateRequestDto, TravelAgencyRequestDto, TravelAgencyResponseDto } from './travel-agency.dto';

export const travelAgency = {
	// Add Room Type
	add: (body: TravelAgencyCreateRequestDto) => request.post('/TravelAgency/Add', body),

	// Update Room Type
	update: (body: TravelAgencyResponseDto) => request.put('/TravelAgency/Update', body),

	// Delete Room Type
	delete: (key: number) =>
		request.delete(`/TravelAgency/Delete`, {
			params: {
				key: key,
			},
		}),

	// Get List by Dynamic
	getListByDynamic: (params: PaginationParams, filter?: Filter) =>
		request.post<GetListByDynamicResponseDto<TravelAgencyResponseDto>>(
			'/TravelAgency/GetList/ByDynamic',
			filter ? (Object.keys(filter).length ? { filter } : {}) : {},
			{
				params: params,
			},
		),

	// Get List Non-Paging
	getListNonPaging: () => request.get<TravelAgencyResponseDto[]>('/TravelAgency/GetListNonPaging'),

	queryKey: 'travel-agency',
};
