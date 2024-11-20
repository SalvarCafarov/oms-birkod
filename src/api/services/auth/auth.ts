import { request } from 'api';

import { LoginRequestDto, LoginResponseDto, RefreshTokenResponseDto } from './auth.dto';

export const auth = {
	login: (data: LoginRequestDto) => request.post<LoginResponseDto>('/auth/login', data),
	refreshToken: (refreshToken: string) =>
		request.post<RefreshTokenResponseDto>('/auth/refreshToken', { refreshToken }),
	revokeToken: (refreshToken: string) => request.post('/auth/revokeToken', { refreshToken }),
};
