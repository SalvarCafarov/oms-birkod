import { User } from 'types';

import { PaginationResponse } from '../types';

export interface UserCreateDto {
	fullName: string;
	phone: string;
	password: string;
	email: string;
}

export interface UsersGetAllResponseDto extends PaginationResponse {
	items: User[];
}

export interface UserUpdateDto {
	key: number;
	fullName: string;
	phone: string;
	email: string;
}

export interface UsersLDAPResponseDto {
	name: string;
	surname: string;
	position: string;
	department: string;
	key: number;
}
