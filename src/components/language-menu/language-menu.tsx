import { useAppDispatch } from 'app/hooks';
import Icon from 'components/icon';
import { OptionsMenu } from 'components/options-menu';
import { useSettings } from 'configs/context/settingsContext';
import { setLanguage } from 'context/settings/settingsSlice';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Language, Locale } from 'types';

export const LanguageMenu = () => {
	const { i18n, t } = useTranslation();
	const dispatch = useAppDispatch();
	const { settings, saveSettings } = useSettings();

	const handleLangItemClick = (lang: Language) => {
		i18n.changeLanguage(lang);
		dispatch(setLanguage(lang));
		saveSettings({ ...settings, locale: Locale[lang] });
	};

	useEffect(() => {
		document.documentElement.setAttribute('lang', i18n.language);
	}, [i18n.language]);

	return (
		<OptionsMenu
			iconButtonProps={{ color: 'inherit' }}
			icon={<Icon fontSize="1.625rem" icon="tabler:language" />}
			menuProps={{ sx: { '& .MuiMenu-paper': { mt: 4.25, minWidth: 130 } } }}
			options={Object.values(Language).map((lang) => ({
				text: t(lang),
				menuItemProps: {
					sx: { py: 2 },
					selected: i18n.language === lang,
					onClick: () => {
						handleLangItemClick(lang);
					},
				},
			}))}
		/>
	);
};
