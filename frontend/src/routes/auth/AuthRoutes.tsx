import { lazy } from 'react';
import { AuthenticatedUser } from '../AuthenticatedUser';

const Auth = lazy(() => import('../../pages/common/Auth'));
const ForgotPasswordEmail = lazy(() => import('../../pages/common/ForgotPasswordEmail'));
const ResetPassword = lazy(() => import('../../pages/common/ResetPassword'));
const Otp = lazy(() => import('../../pages/common/Otp'));
const ResetPasswordSended = lazy(() => import('../../pages/common/ResetPasswordSended'));

export const AuthRoutes = [
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
    { path: '/forgot-password/resetlink-sended', element: <ResetPasswordSended /> },
    { path: '/reset-password/:uniqueId', element: <ResetPassword /> },
    { path: '/signup/otp', element: <Otp /> },
];
