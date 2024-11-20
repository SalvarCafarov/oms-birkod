import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';

// Başlangıç durumu (initialState)
interface FilterState {
	permissions: string[];
}

const initialState: FilterState = {
	permissions: [],
};

// Slice oluşturulması
const permissionsSlice = createSlice({
	name: 'permissions',
	initialState,
	reducers: {
		// Reducer: setPermissions
		setPermissions: (state, action: PayloadAction<string[]>) => {
			state.permissions = action.payload;
		},
	},
});

// Action ve reducer'ları dışa aktarma
export const { setPermissions } = permissionsSlice.actions;
export const selectPermissionsData = (state: RootState) => state.permissions;

export default permissionsSlice.reducer;
