import { store } from 'app/store';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from 'configs/constants';
import { logoutAsync, refreshTokenAsync } from 'context/auth/authSlice';
import i18next from 'i18next';
import toast from 'react-hot-toast';

const baseURL = import.meta.env.VITE_BACKEND_URL;

export const api = axios.create({
	baseURL,
	headers: {
		'Content-Type': 'application/json',
	},
});

api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem(ACCESS_TOKEN_KEY);
		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`;
			config.headers['lang'] = i18next.language || 'az';
		}

		return config;
	},
	(error: AxiosError) => {
		return Promise.reject(error);
	},
);

api.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		const { status, request } = error.response!;
		if (request.responseURL.includes('/auth/refreshToken')) {
			localStorage.removeItem(ACCESS_TOKEN_KEY);
			localStorage.removeItem(REFRESH_TOKEN_KEY);

			return Promise.reject(error);
		}
		switch (status) {
			case 500:
			case 401:
			case 403: {
				const originalRequest = error.config;
				const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)!;
				if (originalRequest!.url!.indexOf('Auth/RefreshToken') > -1) {
					await store.dispatch(logoutAsync(refreshToken));

					return Promise.reject(error);
				}
				if (!originalRequest._retry) {
					originalRequest._retry = true;
					await store.dispatch(refreshTokenAsync(refreshToken));

					return api(originalRequest);
				}
				break;
			}
			default: {
				toast.error(error.response.data.detail || i18next.t('defaultErrorMessage'));
			}
		}

		return Promise.reject(error);
	},
);

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

export const request = {
	get: <T>(url: string, config?: AxiosRequestConfig) => api.get<T>(url, config).then(responseBody),
	post: <T>(url: string, body?: object, config?: AxiosRequestConfig) =>
		api.post<T>(url, body, config).then(responseBody),
	put: <T>(url: string, body: object, config?: AxiosRequestConfig) =>
		api.put<T>(url, body, config).then(responseBody),
	delete: <T>(url: string, config?: AxiosRequestConfig) => api.delete<T>(url, config).then(responseBody),
};
