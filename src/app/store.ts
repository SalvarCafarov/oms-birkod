import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import permissionsReducer from 'context/permissions/permissionsSlice';

import authReducer from '../context/auth/authSlice';
import filterReducer from '../context/filter/filterSlice';
import settingsReducer from '../context/settings/settingsSlice';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		settings: settingsReducer,
		filter: filterReducer,
		permissions: permissionsReducer,
	},
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
