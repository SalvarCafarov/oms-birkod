import Box, { BoxProps } from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import Icon from 'components/icon';
import themeConfig from 'configs/theme/themeConfig';
import { t } from 'i18next';
import { Fragment, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { hasActiveChild, removeChildren } from 'utils/nav-utils';

import { LayoutProps, NavGroup as NavGroupType } from '../../types';
import VerticalNavItems from './nav-items';

interface Props {
	item: NavGroupType;
	parent?: NavGroupType;
	navVisible?: boolean;
	groupActive: string[];
	collapsedNavWidth: number;
	currentActiveGroup: string[];
	navigationBorderWidth: number;
	settings: LayoutProps['settings'];
	isSubToSub?: NavGroupType | undefined;
	saveSettings: LayoutProps['saveSettings'];
	setGroupActive: (values: string[]) => void;
	setCurrentActiveGroup: (items: string[]) => void;
}

const MenuItemTextWrapper = styled(Box)<BoxProps>(({ theme }) => ({
	width: '100%',
	display: 'flex',
	alignItems: 'center',
	gap: theme.spacing(2),
	justifyContent: 'space-between',
	transition: 'opacity .25s ease-in-out',
	...(themeConfig.menuTextTruncate && { overflow: 'hidden' }),
}));

const NavGroup = (props: Props) => {
	const {
		item,
		parent,
		settings,
		navVisible,
		isSubToSub,
		groupActive,
		setGroupActive,
		collapsedNavWidth,
		currentActiveGroup,
		setCurrentActiveGroup,
		navigationBorderWidth,
	} = props;

	const { pathname } = useLocation();
	const { navCollapsed, verticalNavToggleType } = settings;

	// ** Accordion menu group open toggle
	const toggleActiveGroup = (item: NavGroupType, parent: NavGroupType | undefined) => {
		let openGroup = groupActive;

		// ** If Group is already open and clicked, close the group
		if (openGroup.includes(item.title)) {
			openGroup.splice(openGroup.indexOf(item.title), 1);

			// If clicked Group has open group children, Also remove those children to close those groups
			if (item.children) {
				removeChildren(item.children, openGroup, currentActiveGroup);
			}
		} else if (parent) {
			// ** If Group clicked is the child of an open group, first remove all the open groups under that parent
			if (parent.children) {
				removeChildren(parent.children, openGroup, currentActiveGroup);
			}

			// ** After removing all the open groups under that parent, add the clicked group to open group array
			if (!openGroup.includes(item.title)) {
				openGroup.push(item.title);
			}
		} else {
			// ** If clicked on another group that is not active or open, create openGroup array from scratch

			// ** Empty Open Group array
			openGroup = [];

			// ** push Current Active Group To Open Group array
			if (currentActiveGroup.every((elem) => groupActive.includes(elem))) {
				openGroup.push(...currentActiveGroup);
			}

			// ** Push current clicked group item to Open Group array
			if (!openGroup.includes(item.title)) {
				openGroup.push(item.title);
			}
		}
		setGroupActive([...openGroup]);
	};

	// ** Menu Group Click
	const handleGroupClick = () => {
		const openGroup = groupActive;
		if (verticalNavToggleType === 'collapse') {
			if (openGroup.includes(item.title)) {
				openGroup.splice(openGroup.indexOf(item.title), 1);
			} else {
				openGroup.push(item.title);
			}
			setGroupActive([...openGroup]);
		} else {
			toggleActiveGroup(item, parent);
		}
	};

	useEffect(() => {
		if (hasActiveChild(item, pathname)) {
			if (!groupActive.includes(item.title)) groupActive.push(item.title);
		} else {
			const index = groupActive.indexOf(item.title);
			if (index > -1) groupActive.splice(index, 1);
		}
		setGroupActive([...groupActive]);
		setCurrentActiveGroup([...groupActive]);

		// Empty Active Group When Menu is collapsed and not hovered, to fix issue route change
		if (navCollapsed) {
			setGroupActive([]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	useEffect(() => {
		if (navCollapsed) {
			setGroupActive([]);
		}

		if (navCollapsed || (groupActive.length === 0 && !navCollapsed)) {
			setGroupActive([...currentActiveGroup]);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [navCollapsed]);

	useEffect(() => {
		if (groupActive.length === 0 && !navCollapsed) {
			setGroupActive([]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const icon = parent && !item.icon ? themeConfig.navSubItemIcon : item.icon;

	const menuGroupCollapsedStyles = navCollapsed ? { opacity: 0 } : { opacity: 1 };

	return (
		<Fragment>
			<ListItem
				disablePadding
				className="nav-group"
				sx={{ mt: 1, px: '0 !important', flexDirection: 'column' }}
				onClick={handleGroupClick}
			>
				<ListItemButton
					className={clsx({
						'Mui-selected': groupActive.includes(item.title) || currentActiveGroup.includes(item.title),
					})}
					sx={{
						py: 2,
						mx: 3.5,
						borderRadius: 1,
						width: (theme) => `calc(100% - ${theme.spacing(3.5 * 2)})`,
						transition: 'padding-left .25s ease-in-out, padding-right .25s ease-in-out',
						px: navCollapsed ? (collapsedNavWidth - navigationBorderWidth - 22 - 28) / 8 : 4,
						'&:hover': {
							backgroundColor: 'action.hover',
						},
						'& .MuiTypography-root, & :not(.menu-item-meta) > svg': {
							color: 'text.secondary',
						},
						'&.Mui-selected': {
							backgroundColor: 'action.selected',
							'&:hover': {
								backgroundColor: 'action.selected',
							},
							'& .MuiTypography-root, & :not(.menu-item-meta) > svg': {
								color: 'text.primary',
							},
							'& .menu-item-meta > svg': {
								color: 'text.secondary',
							},
							'&.Mui-focusVisible': {
								backgroundColor: 'action.focus',
								'&:hover': {
									backgroundColor: 'action.focus',
								},
							},
						},
					}}
				>
					<ListItemIcon
						sx={{
							transition: 'margin .25s ease-in-out',
							...(parent && navCollapsed ? {} : { mr: 2 }),
							...(navCollapsed ? { mr: 0 } : {}), // this condition should come after (parent && navCollapsed && !navHover) condition for proper styling
							...(parent && item.children ? { ml: 1.5, mr: 3.5 } : {}),
						}}
					>
						<Icon icon={icon as string} {...(parent && { fontSize: '0.625rem' })} />
					</ListItemIcon>
					<MenuItemTextWrapper sx={{ ...menuGroupCollapsedStyles, ...(isSubToSub ? { ml: 2 } : {}) }}>
						<Typography
							{...((themeConfig.menuTextTruncate || (!themeConfig.menuTextTruncate && navCollapsed)) && {
								noWrap: true,
							})}
						>
							{t(`navigation:${item.title}`)}
						</Typography>
						<Box
							className="menu-item-meta"
							sx={{
								display: 'flex',
								alignItems: 'center',
								'& svg': {
									color: 'text.disabled',
									transition: 'transform .25s ease-in-out',
									...(groupActive.includes(item.title) && {
										transform: 'rotate(90deg)',
									}),
								},
							}}
						>
							{item.badgeContent ? (
								<Chip
									size="small"
									label={item.badgeContent}
									color={item.badgeColor || 'primary'}
									sx={{
										mr: 2,
										height: 22,
										minWidth: 22,
										'& .MuiChip-label': { px: 1.5, textTransform: 'capitalize' },
									}}
								/>
							) : null}
							<Icon fontSize="1.125rem" icon="tabler:chevron-right" />
						</Box>
					</MenuItemTextWrapper>
				</ListItemButton>
				<Collapse
					component="ul"
					in={groupActive.includes(item.title)}
					sx={{
						pl: 0,
						width: '100%',
						...menuGroupCollapsedStyles,
						transition: 'all 0.25s ease-in-out',
					}}
					onClick={(e) => e.stopPropagation()}
				>
					<VerticalNavItems
						{...props}
						parent={item}
						navVisible={navVisible}
						verticalNavItems={item.children}
						isSubToSub={parent && item.children ? item : undefined}
					/>
				</Collapse>
			</ListItem>
		</Fragment>
	);
};

export default NavGroup;
