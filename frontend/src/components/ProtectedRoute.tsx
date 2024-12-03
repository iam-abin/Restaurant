import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { ReactNode } from 'react';
import { ROLES_CONSTANTS } from '../utils/constants';

interface RoleProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: string[];
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ children, allowedRoles }) => {
    const authData = useAppSelector((state: RootState) => state.authReducer.authData);
    console.log(1);

    if (!authData) {
        console.log(location, ' location');
        // console.log();

        return <Navigate to="/auth" />;
    }

    console.log(2);
    console.log(authData);
    console.log(allowedRoles);

    const CURRENT_USER_ROLE = authData?.role;
    if (authData && allowedRoles?.length && !allowedRoles.includes(CURRENT_USER_ROLE)) {
        console.log('inside if authdata ', authData);

        // Redirect based on role
        const redirectPath =
            CURRENT_USER_ROLE === ROLES_CONSTANTS.ADMIN
                ? '/admin'
                : CURRENT_USER_ROLE === ROLES_CONSTANTS.RESTAURANT
                  ? '/restaurant'
                  : '/';
        return <Navigate to={redirectPath} />;
    }
    console.log(3);

    return <>{children}</>;
};
