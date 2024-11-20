import { LayoutProps, NavGroup, NavLink, NavSectionTitle } from '../../types';
import VerticalNavGroup from './nav-group';
import VerticalNavLink from './nav-link';
import VerticalNavSectionTitle from './nav-section-title';

interface Props {
	parent?: NavGroup;
	navVisible?: boolean;
	groupActive: string[];
	isSubToSub?: NavGroup;
	currentActiveGroup: string[];
	navigationBorderWidth: number;
	settings: LayoutProps['settings'];
	saveSettings: LayoutProps['saveSettings'];
	setGroupActive: (value: string[]) => void;
	setCurrentActiveGroup: (item: string[]) => void;
	verticalNavItems?: LayoutProps['verticalLayoutProps']['navMenu']['navItems'];
}

const resolveNavItemComponent = (item: NavGroup | NavLink | NavSectionTitle) => {
	if ((item as NavSectionTitle).sectionTitle) return VerticalNavSectionTitle;
	if ((item as NavGroup).children) return VerticalNavGroup;

	return VerticalNavLink;
};

const NavItems = (props: Props) => {
	const { verticalNavItems } = props;

	const RenderMenuItems = verticalNavItems?.map((item: NavGroup | NavLink | NavSectionTitle, index: number) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const TagName: any = resolveNavItemComponent(item);

		return <TagName {...props} key={index} item={item} />;
	});

	return <>{RenderMenuItems}</>;
};

export default NavItems;
