import { NavGroup, NavLink } from 'views/layout/dashboard/types';

export const hasActiveChild = (item: NavGroup, currentURL: string): boolean => {
	const { children } = item;

	if (!children) {
		return false;
	}

	for (const child of children) {
		if ((child as NavGroup).children) {
			if (hasActiveChild(child, currentURL)) {
				return true;
			}
		}
		const childPath = (child as NavLink).path;

		// Check if the child has a link and is active
		if (
			child &&
			childPath &&
			currentURL &&
			(childPath === currentURL || (currentURL.includes(childPath) && childPath !== '/'))
		) {
			return true;
		}
	}

	return false;
};

export const removeChildren = (children: NavLink[], openGroup: string[], currentActiveGroup: string[]) => {
	children.forEach((child: NavLink) => {
		if (!currentActiveGroup.includes(child.title)) {
			const index = openGroup.indexOf(child.title);
			if (index > -1) openGroup.splice(index, 1);

			// @ts-expect-error abc
			if (child.children) removeChildren(child.children, openGroup, currentActiveGroup);
		}
	});
};
