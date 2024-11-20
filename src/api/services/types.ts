export interface PaginationParams {
	page: number;
	pageSize: number;
}

export interface HomeFilterParams extends PaginationParams {
	TestClientId: number[];
	ProductId?: number[];
	SecurityId?: number[];
}

export interface HomeFilterState {
	orderCode: string;
	pressure: string;
	temperature: string;
	status: string;
	sampleLocationId: number;
	sampleRequestors: number[];
	sampleDescriptions: number[];
	sampleSecurity: number[];
}

export interface PaginationResponse {
	index: number;
	size: number;
	count: number;
	pages: number;
	hasPrevious: boolean;
	hasNext: boolean;
}

export interface Filter {
	field: string;
	operator: Operator;
	value: string;
	logic: Logic;
	filters: Filter[];
}

export type Operator =
	| 'eq'
	| 'neq'
	| 'lt'
	| 'lte'
	| 'gt'
	| 'gte'
	| 'contains'
	| 'startswith'
	| 'endswith'
	| 'isnull'
	| 'isnotnull'
	| 'doesnotcontain';

export type Logic = 'and' | 'or';
