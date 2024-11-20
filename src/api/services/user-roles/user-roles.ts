import { request } from 'api';

import { AddUserRoleDto, DeleteUserRoleDto, GetUserRoleResponseDto } from './user-roles.dto';

export const userRoles = {
	getUserRoles: (userId: number) =>
		request.post<GetUserRoleResponseDto[]>(`/UserRole/GetListAdminNonPagingById/${userId}`),
	addUserRole: (data: AddUserRoleDto) => request.post(`/UserRole/Add`, data),
	deleteUserRole: (data: DeleteUserRoleDto) =>
		request.delete(`/UserRole/Delete`, {
			params: data,
		}),
	queryKey: 'userRoles',
};
