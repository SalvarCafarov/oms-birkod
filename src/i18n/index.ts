import { LANGUAGE_KEY, VERSION } from 'configs/constants';
import * as i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-chained-backend';
import HttpApi from 'i18next-http-backend'; // fallback http load
import LocalStorageBackend from 'i18next-localstorage-backend'; // primary use cache
import { initReactI18next } from 'react-i18next';
import { Language } from 'types/enum';

import { namespaces } from './config';

const currentLang = localStorage.getItem(LANGUAGE_KEY);

i18n
	// load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
	// learn more: https://github.com/i18next/i18next-http-backend
	.use(Backend)
	// detect user language
	// learn more: https://github.com/i18next/i18next-browser-languageDetector
	.use(LanguageDetector)
	// pass the i18n instance to react-i18next.
	.use(initReactI18next)
	// init i18next
	// for all options read: https://www.i18next.com/overview/configuration-options
	.init({
		ns: namespaces,
		defaultNS: 'common',
		fallbackLng: Language.AZ,
		debug: false,
		load: 'languageOnly',
		lng: currentLang && Object.values(Language).includes(currentLang as Language) ? currentLang : Language.AZ,
		backend: {
			backends: [
				LocalStorageBackend, // primary
				HttpApi, // fallback
			],
			backendOptions: [
				{
					prefix: 'i18next_res_',
					expirationTime: 5 * 60 * 1000,
				},
				{
					loadPath: `/lang/{{lng}}/{{ns}}.json`,
					queryStringParams: {
						hash: VERSION,
					},
				},
			],
		},
		react: {
			// Turn off the use of React Suspense
			useSuspense: false,
		},
	});

export default i18n;
