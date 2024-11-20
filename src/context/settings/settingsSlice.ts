import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { LANGUAGE_KEY } from 'configs/constants';
import { Language } from 'types/enum';

import { SettingsState } from './types';

const getInitialLanguage = (): Language => {
	let storedLanguage = localStorage.getItem(LANGUAGE_KEY);

	if (!storedLanguage || !Object.values(Language).includes(storedLanguage as Language)) {
		storedLanguage = Language.AZ;
		localStorage.setItem(LANGUAGE_KEY, storedLanguage);
	}

	return storedLanguage as Language;
};

const initialState: SettingsState = {
	language: getInitialLanguage(),
	filterSidebarVisible: false,
};

export const settingsSlice = createSlice({
	name: 'settings',
	initialState,
	reducers: {
		setLanguage: (state, action: PayloadAction<Language>) => {
			state.language = action.payload;
			localStorage.setItem(LANGUAGE_KEY, action.payload);
		},
		openFilterSidebar: (state) => {
			state.filterSidebarVisible = true;
		},
		closeFilterSidebar: (state) => {
			state.filterSidebarVisible = false;
		},
	},
});

export const { setLanguage, openFilterSidebar, closeFilterSidebar } = settingsSlice.actions;

export const selectLanguage = (state: RootState) => state.settings.language;
export const selectFilterSidebarVisible = (state: RootState) => state.settings.filterSidebarVisible;

export default settingsSlice.reducer;
