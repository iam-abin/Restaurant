import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { lazy } from 'react';

import { ROLES_CONSTANTS } from './utils/constants';
import { useAppSelector } from './redux/hooks';

import { RoleProtectedRoute } from './components/ProtectedRoute';

import MainLayout from './layout/MainLayout';
const Auth = lazy(() => import('./pages/common/Auth'));
const ForgotPasswordEmail = lazy(() => import('./pages/common/ForgotPasswordEmail'));
const ResetPassword = lazy(() => import('./pages/common/ResetPassword'));
const Otp = lazy(() => import('./pages/common/Otp'));
const Landing = lazy(() => import('./pages/user/Landing'));
const Profile = lazy(() => import('./pages/user/Profile'));
const SearchResult = lazy(() => import('./pages/user/SearchResult'));
const RestaurantDetails = lazy(() => import('./pages/common/RestaurantDetails'));
const Cart = lazy(() => import('./pages/user/Cart'));
const Restaurant = lazy(() => import('./pages/restaurant/Restaurant'));
const Menu = lazy(() => import('./pages/restaurant/Menu'));
const Orders = lazy(() => import('./pages/restaurant/Orders'));
const Success = lazy(() => import('./pages/user/Success'));
const Error404 = lazy(() => import('./pages/common/Error404'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Users = lazy(() => import('./pages/admin/UsersList'));
const RestaurantsList = lazy(() => import('./pages/admin/RestaurantsList'));
const OrdersUser = lazy(() => import('./pages/user/OrdersUser'));
const DashBoard = lazy(() => import('./pages/restaurant/DashBoard'));

const AuthenticatedUser = ({ children }: { children: React.ReactNode }) => {
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

const appRouter = createBrowserRouter(
    [
        {
            path: '/',
            element: (
                <RoleProtectedRoute allowedRoles={[ROLES_CONSTANTS.USER]}>
                    <MainLayout />
                </RoleProtectedRoute>
            ),
            children: [
                { path: '/', element: <Landing /> },
                { path: '/profile', element: <Profile /> },
                { path: '/search/:searchText', element: <SearchResult /> },
                {
                    path: '/user/restaurant/:restaurantId',
                    element: <RestaurantDetails />,
                },
                { path: '/cart/:restaurantId', element: <Cart /> },
                { path: '/orders', element: <OrdersUser /> },
                { path: '/order/status', element: <Success /> },
                { path: '*', element: <Error404 /> },
            ],
        },
        {
            path: '/restaurant',
            element: (
                <RoleProtectedRoute allowedRoles={[ROLES_CONSTANTS.RESTAURANT]}>
                    <MainLayout />
                </RoleProtectedRoute>
            ),
            children: [
                { path: '', element: <DashBoard /> }, // Correct relative path
                { path: 'details', element: <Restaurant /> }, // Correct relative path
                { path: 'menu', element: <Menu /> },
                { path: 'orders', element: <Orders /> },
            ],
        },
        {
            path: '/admin',
            element: (
                <RoleProtectedRoute allowedRoles={[ROLES_CONSTANTS.ADMIN]}>
                    <MainLayout />
                </RoleProtectedRoute>
            ),
            children: [
                { path: '', element: <Dashboard /> },
                { path: 'users', element: <Users /> },
                { path: 'restaurants', element: <RestaurantsList /> },
            ],
        },

        {
            path: '/auth',
            element: (
                <AuthenticatedUser>
                    {' '}
                    <Auth />
                </AuthenticatedUser>
            ),
        },
        {
            path: '/restaurant/auth',
            element: (
                <AuthenticatedUser>
                    {' '}
                    <Auth />
                </AuthenticatedUser>
            ),
        },
        {
            path: '/admin/auth',
            element: (
                <AuthenticatedUser>
                    {' '}
                    <Auth />
                </AuthenticatedUser>
            ),
        },
        {
            path: '/forgot-password/email',
            element: (
                <AuthenticatedUser>
                    {' '}
                    <ForgotPasswordEmail />
                </AuthenticatedUser>
            ),
        },
        {
            path: '/reset-password/:uniqueId',
            element: <ResetPassword />,
        },
        {
            path: '/forgot-password/otp',
            element: <Otp />,
        },
        {
            path: '/signup/otp',
            element: <Otp />,
        },
    ],
    {
        future: {
            v7_partialHydration: true,
            v7_fetcherPersist: true,
            v7_normalizeFormMethod: true,
            v7_relativeSplatPath: true,
            v7_skipActionErrorRevalidation: true,
        },
    },
);

export default function App() {
    return (
        <main>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 6000,
                    style: { marginTop: '80px' },
                }}
            />
            <RouterProvider router={appRouter} />
        </main>
    );
}
