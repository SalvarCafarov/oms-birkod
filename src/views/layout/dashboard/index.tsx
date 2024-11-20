import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSettings } from 'configs/context/settingsContext';

import AppBarContent from './appBar/components/content';
import Layout from './layout';
import NavItems from './navigation/menu-items';

const DashboardLayout = () => {
	const { settings, saveSettings } = useSettings();

	const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

	return (
		<Layout
			hidden={hidden}
			settings={settings}
			saveSettings={saveSettings}
			verticalLayoutProps={{
				navMenu: {
					navItems: NavItems(),
				},
				appBar: {
					content: (props) => (
						<AppBarContent
							hidden={hidden}
							settings={settings}
							toggleNavVisibility={props.toggleNavVisibility}
						/>
					),
				},
			}}
		/>
	);
};

export default DashboardLayout;
