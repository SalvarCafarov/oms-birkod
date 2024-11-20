import { ACCESS_TOKEN_KEY } from 'configs/constants';
import { User } from 'context/auth/types';

export const getUserFromToken = (): User | null => {
	const token = localStorage.getItem(ACCESS_TOKEN_KEY);

	if (!token) return null;

	const decodedToken = JSON.parse(atob(token.split('.')[1]));

	const user: User = {
		id: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
		name: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
		email: decodedToken.email,
		role: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
	};

	return user;
};
