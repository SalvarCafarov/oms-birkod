import { useAppSelector } from 'app/hooks';
import { selectIsLoggedIn } from 'context/auth/authSlice';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const PrivateRoute = () => {
	const location = useLocation();
	const isLoggedIn = useAppSelector(selectIsLoggedIn);

	if (!isLoggedIn) {
		return <Navigate replace to="/login" state={{ from: location }} />;
	}

	return <Outlet />;
};
