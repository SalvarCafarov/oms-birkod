import { User } from 'types';

import { PaginationResponse } from '../types';

export interface UserCreateDto {
	name: string;
	surName: string;
	telephoneNo: string;
	password: string;
	isActive: string;
	email: string;
}

export interface UsersGetAllResponseDto extends PaginationResponse {
	items: User[];
}

export interface UserUpdateDto {
	key: number;
	name: string;
	surName: string;
	telephoneNo: string;
	password: string;
	isActive: string;
	email: string;
}

export interface UsersLDAPResponseDto {
	name: string;
	surName: string;
	telephoneNo: string;
	password: string;
	email: string;
	key: number;
}
