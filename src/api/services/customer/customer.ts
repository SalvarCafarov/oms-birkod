import { request } from 'api';
import { GetListByDynamicResponseDto } from 'types';

import { Filter, PaginationParams } from '../types';
import { CustomerRequestDto, CustomerResponseDto } from './customer.dto';

export const customer = {
	// Add Customer
	add: (body: CustomerRequestDto) => request.post('/Customer/Add', body),

	// Update Customer
	update: (body: CustomerRequestDto) => request.put('/Customer/Update', body),

	// Delete Customer
	delete: (key: number) =>
		request.delete(`/Customer/Delete`, {
			params: { key: key },
		}),

	// Get List by Dynamic
	getListByDynamic: (params: PaginationParams, filter?: Filter) =>
		request.post<GetListByDynamicResponseDto<CustomerResponseDto>>(
			'/Customer/GetList/ByDynamic',
			filter ? (Object.keys(filter).length ? { filter } : {}) : {},
			{
				params: params,
			},
		),

	// Get List Non-Paging
	getListNonPaging: () => request.get<CustomerResponseDto[]>('/Customer/GetListNonPaging'),

	queryKey: 'customer',
};
