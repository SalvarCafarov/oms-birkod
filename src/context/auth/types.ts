export interface User {
	id: number;
	email: string;
	name: string;
	role: string[] | string;
}

export interface AuthState {
	currentUser: User | null;
	isLoggedIn: boolean;
}
