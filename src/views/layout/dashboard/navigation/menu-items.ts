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
			title: 'RoomType',
			icon: 'tabler:home-edit',
			path: '/room-type',
		},
		{
			title: 'Room',
			icon: 'tabler:home-plus',
			path: '/room',
		},
		{
			title: 'RoomPrice',
			icon: 'tabler:home-plus',
			path: '/room-price',
		},
		{
			title: 'RoomExtra',
			icon: 'tabler:home-plus',
			path: '/room-extra',
		},
	];
};

export default menuItems;
