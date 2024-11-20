import { styled } from '@mui/material/styles';
import MuiSwipeableDrawer, { SwipeableDrawerProps } from '@mui/material/SwipeableDrawer';
import { useAppDispatch } from 'app/hooks';
import { closeFilterSidebar, openFilterSidebar, selectFilterSidebarVisible } from 'context/settings/settingsSlice';
import { useSelector } from 'react-redux';

import { LayoutProps } from '../types';
import { FilterHeader } from './components/filter-header';
import { getCurrentFilter } from './filter-items';

interface Props {
	navWidth: number;
	collapsedWidth: number;
	borderWidth: number;
	settings: LayoutProps['settings'];
	menuProps: LayoutProps['verticalLayoutProps']['navMenu']['componentProps'];
}

const SwipeableDrawer = styled(MuiSwipeableDrawer)<SwipeableDrawerProps>(({ theme }) => ({
	overflowX: 'hidden',
	transition: 'width .25s ease-in-out',
	'& ul': {
		listStyle: 'none',
	},
	'& .MuiListItem-gutters': {
		paddingLeft: 4,
		paddingRight: 4,
	},
	'& .MuiDrawer-paper': {
		overflowX: 'hidden',
		transition: 'width .25s ease-in-out, box-shadow .25s ease-in-out',
		padding: theme.spacing(4),
	},
}));

export const FilterSidebar = (props: Props) => {
	const { navWidth, settings, menuProps, collapsedWidth, borderWidth } = props;
	const { navCollapsed } = settings;

	const dispatch = useAppDispatch();
	const filterSidebarVisible = useSelector(selectFilterSidebarVisible);

	// Drawer Props for Mobile & Tablet screens
	const MobileDrawerProps = {
		open: filterSidebarVisible,
		onOpen: () => dispatch(openFilterSidebar()),
		onClose: () => dispatch(closeFilterSidebar()),
		ModalProps: {
			keepMounted: true, // Better open performance on mobile.
		},
	};

	let userNavMenuStyle = {};
	let userNavMenuPaperStyle = {};
	if (menuProps && menuProps.sx) {
		userNavMenuStyle = menuProps.sx;
	}
	if (menuProps && menuProps.PaperProps && menuProps.PaperProps.sx) {
		userNavMenuPaperStyle = menuProps.PaperProps.sx;
	}
	const userNavMenuProps = Object.assign({}, menuProps);
	delete userNavMenuProps.sx;
	delete userNavMenuProps.PaperProps;

	const Filter = getCurrentFilter();

	return (
		<SwipeableDrawer
			className="layout-vertical-nav"
			anchor="right"
			{...MobileDrawerProps}
			PaperProps={{
				sx: {
					backgroundColor: 'background.paper',
					width: navCollapsed ? collapsedWidth : navWidth,
					borderRight: (theme) => (borderWidth === 0 ? 0 : `${borderWidth}px solid ${theme.palette.divider}`),
					...userNavMenuPaperStyle,
				},
				...menuProps?.PaperProps,
			}}
			sx={{
				width: navCollapsed ? collapsedWidth : navWidth,
				...userNavMenuStyle,
			}}
			{...userNavMenuProps}
		>
			<FilterHeader />

			{Filter}
		</SwipeableDrawer>
	);
};
