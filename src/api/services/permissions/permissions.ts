import { request } from 'api';

import { AddPermissionRequestDto, GetRolePermissionsResponseDto, RemovePermissionParams } from './permissions.dto';

export const permissions = {
	getRolePermissions: (roleId: number) =>
		request.post<GetRolePermissionsResponseDto[]>(`/RoleOperationClaim/${roleId}`),
	addPermission: (data: AddPermissionRequestDto) => request.post('/RoleOperationClaim/Add', data),
	removePermission: (params: RemovePermissionParams) =>
		request.delete('/RoleOperationClaim/Delete', {
			params,
		}),
	queryKey: 'permissions',
};
