import { Navigate } from 'react-router-dom';

import { useAppSelector } from '../redux/hooks';
import { IUser, UserRole } from '../types';
import { checkRole } from '../utils';

export const AuthenticatedUser = ({ children }: { children: React.ReactNode }) => {
    const authData: IUser | null = useAppSelector((state) => state.authReducer.authData);
    const CURRENT_USER_ROLE = authData?.role;
    if (authData && authData.isVerified) {
        const redirectPath = checkRole(UserRole.ADMIN, CURRENT_USER_ROLE)
            ? '/admin'
            : checkRole(UserRole.RESTAURANT, CURRENT_USER_ROLE)
              ? '/restaurant'
              : '/';
        return <Navigate to={redirectPath} replace />;
    }
    return children;
};
