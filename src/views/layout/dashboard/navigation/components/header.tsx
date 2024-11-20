import { Link, LinkProps } from '@mui/material';
import Box, { BoxProps } from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Typography, { TypographyProps } from '@mui/material/Typography';
import HeaderLogo from 'assets/img/socar.png';
import Icon from 'components/icon';
import themeConfig from 'configs/theme/themeConfig';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

import { LayoutProps } from '../../types';

interface Props {
	collapsedNavWidth: number;
	hidden: LayoutProps['hidden'];
	navigationBorderWidth: number;
	toggleNavVisibility: () => void;
	settings: LayoutProps['settings'];
	saveSettings: LayoutProps['saveSettings'];
	navMenuBranding?: LayoutProps['verticalLayoutProps']['navMenu']['branding'];
	menuLockedIcon?: LayoutProps['verticalLayoutProps']['navMenu']['lockedIcon'];
	menuUnlockedIcon?: LayoutProps['verticalLayoutProps']['navMenu']['unlockedIcon'];
}

const MenuHeaderWrapper = styled(Box)<BoxProps>(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	paddingRight: theme.spacing(3.5),
	transition: 'padding .25s ease-in-out',
	minHeight: theme.mixins.toolbar.minHeight,
}));

const HeaderTitle = styled(Typography)<TypographyProps>({
	fontWeight: 700,
	lineHeight: '24px',
	transition: 'opacity .25s ease-in-out, margin .25s ease-in-out',
});

const LinkStyled = styled(Link)<LinkProps | RouterLinkProps>({
	display: 'flex',
	alignItems: 'center',
	textDecoration: 'none',
});

const NavHeader = (props: Props) => {
	const {
		hidden,
		settings,
		collapsedNavWidth,
		toggleNavVisibility,
		navigationBorderWidth,
		navMenuBranding: userNavMenuBranding,
	} = props;

	const { navCollapsed } = settings;

	const menuCollapsedStyles = navCollapsed ? { opacity: 0 } : { opacity: 1 };

	const menuHeaderPaddingLeft = () => {
		if (navCollapsed) {
			if (userNavMenuBranding) {
				return 0;
			} else {
				return (collapsedNavWidth - navigationBorderWidth - 34) / 8;
			}
		} else {
			return 6;
		}
	};

	return (
		<MenuHeaderWrapper className="nav-header" sx={{ pl: menuHeaderPaddingLeft() }}>
			{userNavMenuBranding ? (
				userNavMenuBranding(props)
			) : (
				<LinkStyled to="/" component={RouterLink}>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: navCollapsed ? 'center' : 'flex-start',
						}}
					>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								pt: 4.5,
							}}
						>
							<img src={HeaderLogo} alt="Header Logo" />
							<HeaderTitle
								variant="h4"
								sx={{ ...menuCollapsedStyles, ...(navCollapsed ? {} : { ml: 2.5 }) }}
							>
								{themeConfig.templateName}
							</HeaderTitle>
						</Box>

						<Box
							sx={{
								alignItems: navCollapsed ? 'center' : 'flex-start',
							}}
						>
							<Typography
								sx={{
									fontSize: '0.65rem',
									fontFamily: 'Poppins, sans-serif',
									color: 'text.primary',
									lineHeight: 1.5,
									pt: 0.8,
									pb: 5,
								}}
							>
								{'Boilerplate'}
							</Typography>
						</Box>
					</Box>
				</LinkStyled>
			)}

			{hidden && (
				<IconButton
					disableRipple
					disableFocusRipple
					sx={{ p: 0, color: 'text.secondary', backgroundColor: 'transparent !important' }}
					onClick={toggleNavVisibility}
				>
					<Icon icon="tabler:x" fontSize="1.25rem" />
				</IconButton>
			)}
		</MenuHeaderWrapper>
	);
};

export default NavHeader;
