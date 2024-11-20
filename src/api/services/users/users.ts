import { request } from 'api';

import { Filter, PaginationParams } from '../types';
import { UserCreateDto, UsersGetAllResponseDto, UsersLDAPResponseDto, UserUpdateDto } from './users.dto';

export const users = {
	create: (data: UserCreateDto) => request.post('/users/add', data),
	getAll: (params: PaginationParams, filter?: Filter) =>
		request.post<UsersGetAllResponseDto>(
			'/users/getList/byDynamic',
			filter ? (Object.keys(filter).length ? { filter } : {}) : {},
			{
				params: params,
			},
		),
	update: (data: UserUpdateDto) => request.put('/users/UpdateProfile', data),
	delete: (key: number) =>
		request.delete('/users/delete', {
			params: { key },
		}),
	getUsers: () => request.get<UsersLDAPResponseDto[]>('/users/GetListUserInfo'),
	getLabMembers: () => request.get<string[]>('/users/getLabMemberList'),
	queryKey: 'users',
};
