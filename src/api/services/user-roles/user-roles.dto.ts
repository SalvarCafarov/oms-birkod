export interface GetUserRoleResponseDto {
	key: number;
	name: string;
	checked: boolean;
}

export interface AddUserRoleDto {
	userId: number;
	roleId: number;
}

export interface DeleteUserRoleDto {
	userId: number;
	roleId: number;
}
