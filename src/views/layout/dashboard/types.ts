/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppBarProps, SwipeableDrawerProps } from '@mui/material';
import { Settings } from 'configs/context/types';
import { ReactNode } from 'react';

export type Layout = 'vertical' | 'horizontal' | 'blank' | 'blankWithAppBar';

export type ContentWidth = 'full' | 'boxed';

export type AppBar = 'fixed' | 'static' | 'hidden';

export type Footer = 'fixed' | 'static' | 'hidden';

export type VerticalNavToggle = 'accordion' | 'collapse';

export type NavSectionTitle = {
	auth?: boolean;
	action?: string;
	subject?: string;
	sectionTitle: string;
};

export type NavGroup = {
	icon?: string;
	title: string;
	auth?: boolean;
	action?: string;
	subject?: string;
	badgeContent?: string;
	children?: (NavGroup | NavLink)[];
	badgeColor?: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
};

export type NavLink = {
	icon?: string;
	path?: string;
	title: string;
	auth?: boolean;
	action?: string;
	subject?: string;
	disabled?: boolean;
	badgeContent?: string;
	externalLink?: boolean;
	openInNewTab?: boolean;
	badgeColor?: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
};

export type VerticalNavItemsType = (NavLink | NavGroup | NavSectionTitle)[];

export type VerticalLayoutProps = {
	appBar?: {
		componentProps?: AppBarProps;
		content?: (props?: any) => ReactNode;
	};
	navMenu: {
		lockedIcon?: ReactNode;
		unlockedIcon?: ReactNode;
		navItems?: VerticalNavItemsType;
		content?: (props?: any) => ReactNode;
		branding?: (props?: any) => ReactNode;
		afterContent?: (props?: any) => ReactNode;
		beforeContent?: (props?: any) => ReactNode;
		componentProps?: Omit<SwipeableDrawerProps, 'open' | 'onOpen' | 'onClose'>;
	};
};

export type LayoutProps = {
	hidden: boolean;
	settings: Settings;
	contentHeightFixed?: boolean;
	scrollToTop?: (props?: any) => ReactNode;
	saveSettings: (values: Settings) => void;
	verticalLayoutProps: VerticalLayoutProps;
};

export type FilterItemsType = {
	path: string;
	component: ReactNode;
};
