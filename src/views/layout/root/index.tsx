import { useAppDispatch } from 'app/hooks';
import { Page } from 'components/page';
import { Spinner } from 'components/spinner';
import { setPermissions } from 'context/permissions/permissionsSlice';
import { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router-dom';
import { getUserFromToken } from 'utils/get-user-from-token';

const RootLayout = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const [currentPath, setCurrentPath] = useState('');

	const { pathname } = useLocation();
	const user = getUserFromToken();

	// const { data: userOperationClaimsData } = useQuery({
	// 	queryKey: [userOperationClaims.queryKey],
	// 	queryFn: () => {
	// 		if (user?.id) {
	// 			return userOperationClaims.getUserOperationClaims(user.id);
	// 		}

	// 		return Promise.reject('User ID is undefined');
	// 	},
	// 	enabled: !!user?.id,
	// 	staleTime: Infinity,
	// });

	useEffect(() => {
		setCurrentPath(pathname);
	}, [pathname]);

	useEffect(() => {
		let permissions: string[] = [];

		if (Array.isArray(user?.role)) {
			permissions = user.role.map((item) => item?.toLowerCase()).filter((item) => item !== undefined) as string[];
		} else if (typeof user?.role === 'string') {
			permissions = [user.role.toLowerCase()];
		}

		dispatch(setPermissions(permissions));
	}, [dispatch, user]);

	return (
		<Suspense fallback={<Spinner page />}>
			<Page title={t(`pages:${currentPath}`)}>
				<Outlet />
			</Page>
		</Suspense>
	);
};

export default RootLayout;
