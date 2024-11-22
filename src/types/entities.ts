export interface Role {
	key: number;
	name: string;
	description: string;
}

export interface User {
	key: number;
	department: string;
	email: string;
	name: string;
	position: string;
	surname: string;
	telephoneNo: string;
	userName: string;
}

export interface GetListByDynamicResponseDto<T> {
	items: T[];
	index: number; // Current page index
	size: number; // Page size
	count: number; // Total number of items
	pages: number; // Total number of pages
	hasPrevious: boolean; // Whether there is a previous page
	hasNext: boolean; // Whether there is a next page
}
