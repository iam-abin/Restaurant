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

    if (!authData) {
        return <Navigate to="/auth" />;
    }

    const CURRENT_USER_ROLE = authData?.role;
    if (authData && allowedRoles?.length && !allowedRoles.includes(CURRENT_USER_ROLE)) {
        // Redirect based on role
        const redirectPath =
            CURRENT_USER_ROLE === ROLES_CONSTANTS.ADMIN
                ? '/admin'
                : CURRENT_USER_ROLE === ROLES_CONSTANTS.RESTAURANT
                  ? '/restaurant'
                  : '/';
        return <Navigate to={redirectPath} />;
    }

    return <>{children}</>;
};
