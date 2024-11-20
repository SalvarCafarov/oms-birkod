export interface GetRolePermissionsResponseDto {
	name: string;
	checked: boolean;
	key: number;
}

export interface AddPermissionRequestDto {
	roleId: number;
	operationClaimId: number;
}

export interface RemovePermissionParams {
	roleId: number;
	operationClaimId: number;
}
