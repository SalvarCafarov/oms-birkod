import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Icon from 'components/icon';
import { MouseEvent, ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';

import { OptionMenuItemType, OptionsMenuType, OptionType } from './types';

const MenuItemWrapper = ({ children, option }: { children: ReactNode; option: OptionMenuItemType }) => {
	if (option.href) {
		return (
			<Box
				component={Link}
				to={option.href}
				{...option.linkProps}
				sx={{
					px: 4,
					py: 1.5,
					width: '100%',
					display: 'flex',
					color: 'inherit',
					alignItems: 'center',
					textDecoration: 'none',
				}}
			>
				{children}
			</Box>
		);
	} else {
		return <>{children}</>;
	}
};

export const OptionsMenu = (props: OptionsMenuType) => {
	const { icon, options, menuProps, iconProps, leftAlignMenu, iconButtonProps } = props;

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const handleClick = (event: MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<IconButton aria-haspopup="true" onClick={handleClick} {...iconButtonProps}>
				{icon ? icon : <Icon icon="tabler:dots-vertical" {...iconProps} />}
			</IconButton>
			<Menu
				keepMounted
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleClose}
				{...(!leftAlignMenu && {
					anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
					transformOrigin: { vertical: 'top', horizontal: 'right' },
				})}
				{...menuProps}
			>
				{options.map((option: OptionType, index: number) => {
					if (typeof option === 'string') {
						return (
							<MenuItem key={index} onClick={handleClose}>
								{option}
							</MenuItem>
						);
					} else if ('divider' in option) {
						return option.divider && <Divider key={index} {...option.dividerProps} />;
					} else {
						return (
							<MenuItem
								key={index}
								{...option.menuItemProps}
								{...(option.href && { sx: { p: 0 } })}
								onClick={(e) => {
									handleClose();
									option.menuItemProps && option.menuItemProps.onClick
										? option.menuItemProps.onClick(e)
										: null;
								}}
							>
								<MenuItemWrapper option={option}>
									{option.icon ? option.icon : null}
									{option.text}
								</MenuItemWrapper>
							</MenuItem>
						);
					}
				})}
			</Menu>
		</>
	);
};
