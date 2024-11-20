import IconButton from '@mui/material/IconButton';
import Icon from 'components/icon';
import { useSettings } from 'configs/context/settingsContext';
import { Mode } from 'configs/theme/types';

const ModeToggler = () => {
	const { settings, saveSettings } = useSettings();

	const handleModeChange = (mode: Mode) => {
		saveSettings({ ...settings, mode: mode });
	};

	const handleModeToggle = () => {
		let newMode: Mode;
		if (settings.mode === 'light') {
			newMode = 'semi-dark';
		} else if (settings.mode === 'semi-dark') {
			newMode = 'dark';
		} else {
			newMode = 'light';
		}
		handleModeChange(newMode);
	};

	return (
		<IconButton color="inherit" onClick={handleModeToggle}>
			<Icon
				fontSize="1.625rem"
				icon={
					settings.mode === 'dark'
						? 'tabler:sun'
						: settings.mode === 'semi-dark'
						  ? 'tabler:moon-stars'
						  : 'tabler:sun-moon'
				}
			/>
		</IconButton>
	);
};

export default ModeToggler;
