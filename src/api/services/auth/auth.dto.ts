export interface LoginRequestDto {
	username: string;
	password: string;
}

export interface LoginResponseDto {
	accessToken: string;
	refreshToken: string;
}

export interface RefreshTokenResponseDto {
	accessToken: string;
	refreshToken: string;
}
