import { request } from 'api';

import { UserOperationClaimsDto } from './user-operation-claims.dto';

export const userOperationClaims = {
	getUserOperationClaims: (userId: number) =>
		request.post<UserOperationClaimsDto[]>(`/UserOperationClaims/${userId}`),
	queryKey: 'userOperationClaims',
};
