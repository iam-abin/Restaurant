import { lazy } from 'react';
import { ROLES_CONSTANTS } from '../../utils/constants';
import { RoleProtectedRoute } from '../ProtectedRoute';
import MainLayout from '../../layout/MainLayout';

const AdminDashboard = lazy(() => import('../../pages/admin/AdminDashboard'));
const Users = lazy(() => import('../../pages/admin/UsersList'));
const RestaurantsList = lazy(() => import('../../pages/admin/RestaurantsList'));

const AdminRoutes = {
    path: '/admin',
    element: (
        <RoleProtectedRoute allowedRoles={[ROLES_CONSTANTS.ADMIN]}>
            <MainLayout />
        </RoleProtectedRoute>
    ),
    children: [
        { path: '', element: <AdminDashboard /> },
        { path: 'users', element: <Users /> },
        { path: 'restaurants', element: <RestaurantsList /> },
    ],
};

export default AdminRoutes;
