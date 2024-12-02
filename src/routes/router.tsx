import { useAppSelector } from 'app/hooks';
import { selectPermissionsData } from 'context/permissions/permissionsSlice';
import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from 'views/dashboard/home';
import RolesPage from 'views/dashboard/roles';
import Room from 'views/dashboard/room';
import RoomExtra from 'views/dashboard/room-extra';
import RoomPrice from 'views/dashboard/room-price';
import RoomType from 'views/dashboard/room-type';
import SpecialDayPrice from 'views/dashboard/special-day-price';
import UsersPage from 'views/dashboard/users';
import NoPermission from 'views/misc/no-permission';

import { PrivateRoute as PrivateRoutes } from './PrivateRoute';

const RootLayout = lazy(() => import('views/layout/root'));
const AuthLayout = lazy(() => import('views/layout/auth'));
const DashboardLayout = lazy(() => import('views/layout/dashboard'));
const LoginPage = lazy(() => import('views/auth/login'));
const NotFoundPage = lazy(() => import('views/misc/404'));

const PermissionRoute = ({ permission, children }: { permission: string; children: React.ReactNode }) => {
	const permissionData = useAppSelector(selectPermissionsData);
	const normalizedPermissions = permissionData?.permissions?.map((perm: string) => perm.toLowerCase());

	if (normalizedPermissions?.includes('admin')) {
		return <>{children}</>;
	}

	if (!normalizedPermissions?.includes(permission.toLowerCase())) {
		return <Navigate replace to="/noPermission" />;
	}

	return <>{children}</>;
};

export const router = createBrowserRouter([
	{
		path: '/',
		element: <RootLayout />,
		children: [
			{
				element: <AuthLayout />,
				children: [
					{
						path: '/login',
						element: <LoginPage />,
					},
				],
			},
			{
				element: <PrivateRoutes />,
				children: [
					{
						element: <DashboardLayout />,
						children: [
							{
								index: true,
								element: <Home />,
							},
							{
								path: '/roles',
								element: (
									<PermissionRoute permission="roles.permissions">
										<RolesPage />
									</PermissionRoute>
								),
							},
							{
								path: '/users',
								element: (
									<PermissionRoute permission="user.roles">
										<UsersPage />
									</PermissionRoute>
								),
							},
							{
								path: '/room-type',
								element: (
									<PermissionRoute permission="roomType.list">
										<RoomType />
									</PermissionRoute>
								),
							},
							{
								path: '/room',
								element: (
									<PermissionRoute permission="room.list">
										<Room />
									</PermissionRoute>
								),
							},
							{
								path: '/special-day-price',
								element: (
									<PermissionRoute permission="specialDayPrice.list">
										<SpecialDayPrice />
									</PermissionRoute>
								),
							},
							{
								path: '/room-price',
								element: (
									<PermissionRoute permission="roomPrice.list">
										<RoomPrice />
									</PermissionRoute>
								),
							},
							{
								path: '/room-extra',
								element: (
									<PermissionRoute permission="roomExtra.list">
										<RoomExtra />
									</PermissionRoute>
								),
							},
						],
					},
				],
			},
			{
				path: 'noPermission',
				element: <NoPermission />,
			},
			{
				path: '/404',
				element: <NotFoundPage />,
			},
			{
				path: '*',
				element: <Navigate replace to="/404" />,
			},
		],
	},
]);
