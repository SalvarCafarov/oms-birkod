import { request } from 'api';

import { PaginationParams } from '../types';
import { RoleCreateDto, RolesGetAllResponseDto, RolesUpdateDto } from './roles.dto';

export const roles = {
	create: (data: RoleCreateDto) => request.post('/role/add', data),
	getAll: (filter: PaginationParams) =>
		request.get<RolesGetAllResponseDto>('/role/getList', {
			params: filter,
		}),
	update: (data: RolesUpdateDto) => request.put('/role/update', data),
	delete: (key: number) =>
		request.delete('/role/delete', {
			params: { key },
		}),
	queryKey: 'roles',
};
