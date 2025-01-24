import { lazy } from 'react';
import { RoleProtectedRoute } from '../ProtectedRoute';
import { UserRole } from '../../types';

const MainLayout = lazy(() => import('../../layout/MainLayout'));
const Landing = lazy(() => import('../../pages/user/Landing'));
const Profile = lazy(() => import('../../pages/user/UserProfile'));
const SearchResult = lazy(() => import('../../pages/user/SearchResult'));
const RestaurantDetails = lazy(() => import('../../pages/user/RestaurantDetails'));
const Cart = lazy(() => import('../../pages/user/Cart'));
const OrdersUser = lazy(() => import('../../pages/user/OrdersUser'));
const PaymentSuccess = lazy(() => import('../../pages/user/PaymentSuccess'));

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
        { path: '/order/status', element: <PaymentSuccess /> },
    ],
};

export default UserRoutes;
