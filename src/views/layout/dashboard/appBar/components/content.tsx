import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Icon from 'components/icon';
import { LanguageMenu } from 'components/language-menu';
import { Settings } from 'configs/context/types';

import ModeToggler from './mode-toggler';
import UserMenu from './user-menu';

interface Props {
	hidden: boolean;
	settings: Settings;
	toggleNavVisibility: () => void;
}

const AppBarContent = (props: Props) => {
	const { hidden, settings, toggleNavVisibility } = props;

	return (
		<Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
			<Box className="actions-left" sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
				{hidden && !settings.navHidden ? (
					<IconButton color="inherit" sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
						<Icon fontSize="1.5rem" icon="tabler:menu-2" />
					</IconButton>
				) : null}
			</Box>
			<Box className="actions-right" sx={{ display: 'flex', alignItems: 'center' }}>
				<LanguageMenu />
				<ModeToggler />
				<UserMenu />
			</Box>
		</Box>
	);
};

export default AppBarContent;
