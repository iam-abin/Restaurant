import { lazy } from 'react';
import { AuthenticatedUser } from '../AuthenticatedUser';

const Auth = lazy(() => import('../../pages/common/Auth'));
const ForgotPasswordEmail = lazy(() => import('../../pages/common/ForgotPasswordEmail'));
const ResetPassword = lazy(() => import('../../pages/common/ResetPassword'));
const Otp = lazy(() => import('../../pages/common/Otp'));

const AuthRoutes = [
    {
        path: '/auth',
        element: (
            <AuthenticatedUser>
                <Auth />
            </AuthenticatedUser>
        ),
    },
    {
        path: '/auth/restaurant',
        element: (
            <AuthenticatedUser>
                <Auth />
            </AuthenticatedUser>
        ),
    },
    {
        path: '/auth/admin',
        element: (
            <AuthenticatedUser>
                <Auth />
            </AuthenticatedUser>
        ),
    },
    {
        path: '/forgot-password/email',
        element: (
            <AuthenticatedUser>
                <ForgotPasswordEmail />
            </AuthenticatedUser>
        ),
    },
    { path: '/reset-password/:uniqueId', element: <ResetPassword /> },
    { path: '/forgot-password/otp', element: <Otp /> },
    { path: '/signup/otp', element: <Otp /> },
];

export default AuthRoutes;
