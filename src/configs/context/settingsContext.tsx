import { SETTINGS_KEY } from 'configs/constants';
import themeConfig from 'configs/theme/themeConfig';
import { createContext, useContext, useEffect, useState } from 'react';

import { Settings, SettingsContextValue, SettingsProviderProps } from './types';

const initialSettings: Settings = {
	themeColor: 'primary',
	mode: themeConfig.mode,
	skin: themeConfig.skin,
	footer: themeConfig.footer,
	layout: themeConfig.layout,
	lastLayout: themeConfig.layout,
	navHidden: themeConfig.navHidden,
	appBarBlur: themeConfig.appBarBlur,
	navCollapsed: themeConfig.navCollapsed,
	contentWidth: themeConfig.contentWidth,
	toastPosition: themeConfig.toastPosition,
	verticalNavToggleType: themeConfig.verticalNavToggleType,
	appBar: themeConfig.layout === 'horizontal' && themeConfig.appBar === 'hidden' ? 'fixed' : themeConfig.appBar,
	locale: 'enUS',
};

const staticSettings = {
	appBar: initialSettings.appBar,
	footer: initialSettings.footer,
	layout: initialSettings.layout,
	navHidden: initialSettings.navHidden,
	lastLayout: initialSettings.lastLayout,
	toastPosition: initialSettings.toastPosition,
};

const restoreSettings = (): Settings | null => {
	let settings: Settings | null = null;

	try {
		const storedData: string | null = localStorage.getItem(SETTINGS_KEY);

		if (storedData) {
			settings = { ...JSON.parse(storedData), ...staticSettings };
		} else {
			settings = initialSettings;
		}
	} catch (err) {
		console.error(err);
	}

	return settings;
};

const storeSettings = (settings: Settings) => {
	const initSettings = Object.assign({}, settings);

	delete initSettings.appBar;
	delete initSettings.footer;
	delete initSettings.layout;
	delete initSettings.navHidden;
	delete initSettings.lastLayout;
	delete initSettings.toastPosition;
	localStorage.setItem(SETTINGS_KEY, JSON.stringify(initSettings));
};

const SettingsContext = createContext<SettingsContextValue>({
	saveSettings: () => null,
	settings: initialSettings,
});

export const SettingsProvider = ({ children, pageSettings }: SettingsProviderProps) => {
	const [settings, setSettings] = useState<Settings>({ ...initialSettings });

	useEffect(() => {
		const restoredSettings = restoreSettings();

		if (restoredSettings) {
			setSettings({ ...restoredSettings });
		}
		if (pageSettings) {
			setSettings({ ...settings, ...pageSettings });
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pageSettings]);

	useEffect(() => {
		if (settings.layout === 'horizontal' && settings.mode === 'semi-dark') {
			saveSettings({ ...settings, mode: 'light' });
		}
		if (settings.layout === 'horizontal' && settings.appBar === 'hidden') {
			saveSettings({ ...settings, appBar: 'fixed' });
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [settings.layout]);

	const saveSettings = (updatedSettings: Settings) => {
		storeSettings(updatedSettings);
		setSettings(updatedSettings);
	};

	return <SettingsContext.Provider value={{ settings, saveSettings }}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
	const context = useContext(SettingsContext);
	if (!context) {
		throw new Error('useSettings must be used within a SettingsProvider');
	}

	return context;
};

export const SettingsConsumer = SettingsContext.Consumer;
