import { Navigate } from 'react-router-dom';

import { ROLES_CONSTANTS } from '../utils/constants';
import { useAppSelector } from '../redux/hooks';

export const AuthenticatedUser = ({ children }: { children: React.ReactNode }) => {
    const authData = useAppSelector((state) => state.authReducer.authData);
    const CURRENT_USER_ROLE = authData?.role;
    if (authData && authData.isVerified) {
        const redirectPath =
            CURRENT_USER_ROLE === ROLES_CONSTANTS.ADMIN
                ? '/admin'
                : CURRENT_USER_ROLE === ROLES_CONSTANTS.RESTAURANT
                  ? '/restaurant'
                  : '/';
        return <Navigate to={redirectPath} replace />;
    }
    return children;
};
