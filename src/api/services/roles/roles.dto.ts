import { Role } from 'types';

import { PaginationResponse } from '../types';

export interface RoleCreateDto {
	name: string;
	description: string;
}

export interface RolesGetAllResponseDto extends PaginationResponse {
	items: Role[];
}

export interface RolesUpdateDto {
	key: number;
	name: string;
	description: string;
}
