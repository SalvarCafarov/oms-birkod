import * as locales from '@mui/material/locale';

import { Language } from './enum';

export interface AutocompleteOption {
	label: string;
	value: string;
}

export const Locale: Record<Language, keyof typeof locales> = {
	[Language.AZ]: 'azAZ',
	[Language.EN]: 'enUS',
};
