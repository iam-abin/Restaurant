import { lazy } from 'react';
import { RoleProtectedRoute } from '../ProtectedRoute';
import MainLayout from '../../layout/MainLayout';
import { UserRole } from '../../types';

const Landing = lazy(() => import('../../pages/user/Landing'));
const Profile = lazy(() => import('../../pages/user/UserProfile'));
const SearchResult = lazy(() => import('../../pages/user/SearchResult'));
const RestaurantDetails = lazy(() => import('../../pages/common/RestaurantDetails'));
const Cart = lazy(() => import('../../pages/user/Cart'));
const OrdersUser = lazy(() => import('../../pages/user/OrdersUser'));
const Success = lazy(() => import('../../pages/user/Success'));

const UserRoutes = {
    path: '/',
    element: (
        <RoleProtectedRoute allowedRoles={[UserRole.USER]}>
            <MainLayout />
        </RoleProtectedRoute>
    ),
    children: [
        { path: '/', element: <Landing /> },
        { path: '/profile', element: <Profile /> },
        { path: '/search/:searchText', element: <SearchResult /> },
        { path: '/user/restaurant/:restaurantId', element: <RestaurantDetails /> },
        { path: '/cart/:restaurantId', element: <Cart /> },
        { path: '/orders', element: <OrdersUser /> },
        { path: '/order/status', element: <Success /> },
    ],
};

export default UserRoutes;