import { VerticalNavItemsType } from '../types';

const menuItems = (): VerticalNavItemsType => {
	return [
		{
			title: 'home',
			icon: 'tabler:smart-home',
			path: '/',
		},
		{
			title: 'roles',
			icon: 'tabler:settings',
			path: '/roles',
		},
		{
			title: 'users',
			icon: 'tabler:users',
			path: '/users',
		},
	];
};

export default menuItems;
