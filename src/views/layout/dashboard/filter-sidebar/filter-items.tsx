import UsersFilter from 'views/dashboard/users/filter/filter';

import { FilterItemsType } from '../types';

const filterItems: FilterItemsType[] = [
	{
		path: '/users',
		component: <UsersFilter />,
	},
];

export const getCurrentFilter = () => {
	const currentPath = location.pathname;
	const currentItem = filterItems.find((item) => item.path === currentPath);

	return currentItem ? currentItem.component : null;
};

export default filterItems;
