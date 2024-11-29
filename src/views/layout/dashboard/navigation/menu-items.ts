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
		{
			title: 'room-type',
			icon: 'tabler:home-edit',
			path: '/room-type',
		},
		{
			title: 'room',
			icon: 'tabler:home-plus',
			path: '/room',
		},
	];
};

export default menuItems;
