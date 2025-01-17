import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { ReactNode } from 'react';
import { IUser, UserRole } from '../types';
import { checkRole } from '../utils';

interface RoleProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: string[];
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ children, allowedRoles }) => {
    const authData: IUser | null = useAppSelector((state: RootState) => state.authReducer.authData);

    if (!authData) {
        return <Navigate to="/auth" />;
    }

    const CURRENT_USER_ROLE: UserRole = authData?.role;
    if (authData && allowedRoles?.length && !allowedRoles.includes(CURRENT_USER_ROLE)) {
        // Redirect based on role
        const redirectPath = checkRole(UserRole.ADMIN, CURRENT_USER_ROLE)
            ? '/admin'
            : checkRole(UserRole.RESTAURANT, CURRENT_USER_ROLE)
              ? '/restaurant'
              : '/';
        return <Navigate to={redirectPath} />;
    }

    return <>{children}</>;
};
