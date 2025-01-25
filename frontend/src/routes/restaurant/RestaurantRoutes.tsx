import { lazy } from 'react';
import { RoleProtectedRoute } from '../ProtectedRoute';
import { UserRole } from '../../types';

const MainLayout = lazy(() => import('../../layout/MainLayout'));
const RestaurantDashBoard = lazy(() => import('../../pages/restaurant/RestaurantDashBoard'));
const RestaurantProfile = lazy(() => import('../../pages/restaurant/RestaurantProfile'));
const Menu = lazy(() => import('../../pages/restaurant/Menu'));
const Orders = lazy(() => import('../../pages/restaurant/Orders'));

const RestaurantRoutes = () => ({
    path: '/restaurant',
    element: (
        <RoleProtectedRoute allowedRoles={[UserRole.RESTAURANT]}>
            <MainLayout />
        </RoleProtectedRoute>
    ),
    children: [
        { path: '', element: <RestaurantDashBoard /> },
        { path: 'details', element: <RestaurantProfile /> },
        { path: 'menu', element: <Menu /> },
        { path: 'orders', element: <Orders /> },
    ],
});

export default RestaurantRoutes;
