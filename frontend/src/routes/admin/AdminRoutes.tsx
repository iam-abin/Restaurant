import { lazy } from 'react';
import { RoleProtectedRoute } from '../ProtectedRoute';
import MainLayout from '../../layout/MainLayout';
import { UserRole } from '../../types';

const AdminDashboard = lazy(() => import('../../pages/admin/AdminDashboard'));
const Users = lazy(() => import('../../pages/admin/UsersList'));
const RestaurantsList = lazy(() => import('../../pages/admin/RestaurantsList'));

const AdminRoutes = {
    path: '/admin',
    element: (
        <RoleProtectedRoute allowedRoles={[UserRole.ADMIN]}>
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