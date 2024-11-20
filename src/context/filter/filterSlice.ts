import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HomeFilterState } from 'api/services/types';
import { RootState } from 'app/store';

import { FilterState } from './types';

const initialState: FilterState<HomeFilterState> = {};

const filterSlice = createSlice({
	name: 'filter',
	initialState,
	reducers: {
		setFilter: <T>(state: FilterState<T>, action: PayloadAction<{ key: string; value: T }>) => {
			state[action.payload.key] = action.payload.value;
		},
		clearFilter: <T>(state: FilterState<T>, action: PayloadAction<string>) => {
			// Farid: ask gpt if this approach is correct
			delete state[action.payload];
		},
	},
});

export const { setFilter, clearFilter } = filterSlice.actions;

export const selectFilterData = (state: RootState) => state.filter;

export default filterSlice.reducer;
