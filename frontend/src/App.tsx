import MainLayout from './layout/MainLayout'
import Auth from './pages/Auth'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import ForgotPasswordEmail from './pages/ForgotPasswordEmail'
import ResetPassword from './pages/ResetPassword'
import Otp from './pages/Otp'
import Landing from './pages/Landing'
import Profile from './pages/Profile'
import SearchResult from './pages/SearchResult'
import RestaurantDetails from './pages/RestaurantDetails'
import Cart from './pages/Cart'
import Restaurant from './pages/restaurant/Restaurant'
import Menu from './pages/restaurant/Menu'
import Orders from './pages/restaurant/Orders'
import Success from './pages/Success'
import { Toaster } from 'react-hot-toast'
import Error404 from './pages/Error404'
import { RoleProtectedRoute } from './components/ProtectedRoute'
import { ROLES_CONSTANTS } from './utils/constants'
import { useAppSelector } from './redux/hooks'

const AuthenticatedUser = ({ children }: { children: React.ReactNode }) => {
    const authData = useAppSelector((state) => state.authReducer.authData)
    const CURRENT_USER_ROLE = authData?.role
    if (authData && authData.isVerified) {
        const redirectPath =
            CURRENT_USER_ROLE === ROLES_CONSTANTS.ADMIN
                ? '/admin'
                : CURRENT_USER_ROLE === ROLES_CONSTANTS.RESTAURANT
                  ? '/restaurant'
                  : '/'
        return <Navigate to={redirectPath} replace />
    }
    return children
}

const appRouter = createBrowserRouter([
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
                element: <RestaurantDetails />
            },
            { path: '/cart', element: <Cart /> },
            { path: '/order/status', element: <Success /> },
            { path: '*', element: <Error404 /> }
        ]
    },
    {
        path: '/restaurant',
        element: (
            <RoleProtectedRoute allowedRoles={[ROLES_CONSTANTS.RESTAURANT]}>
                <MainLayout />
            </RoleProtectedRoute>
        ),
        children: [
            { path: 'details', element: <Restaurant /> }, // Correct relative path
            { path: 'menu', element: <Menu /> },
            { path: 'orders', element: <Orders /> }
        ]
    },
    {
        path: '/admin',
        element: (
            <RoleProtectedRoute allowedRoles={[ROLES_CONSTANTS.ADMIN]}>
                <MainLayout />
            </RoleProtectedRoute>
        ),
        children: [
            // { path: "/", element: <Dashboard /> },
            // { path: "/users", element: <Users /> },
            // { path: "/restaurants", element: <Restaurants /> },
        ]
    },

    {
        path: '/auth',
        element: (
            <AuthenticatedUser>
                {' '}
                <Auth />
            </AuthenticatedUser>
        )
    },
    {
        path: '/restaurant/auth',
        element: (
            <AuthenticatedUser>
                {' '}
                <Auth />
            </AuthenticatedUser>
        )
    },
    {
        path: 'admin/auth',
        element: (
            <AuthenticatedUser>
                {' '}
                <Auth />
            </AuthenticatedUser>
        )
    },
    {
        path: '/forgot-password/email',
        element: (
            <AuthenticatedUser>
                {' '}
                <ForgotPasswordEmail />
            </AuthenticatedUser>
        )
    },
    {
        path: '/reset-password/:uniqueId',
        element: <ResetPassword />
    },
    {
        path: '/forgot-password/otp',
        element: <Otp />
    },
    {
        path: '/signup/otp',
        element: <Otp />
    }
])

export default function App() {
    return (
        <main>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 6000,
                    style: { marginTop: '80px' }
                }}
            />
            <RouterProvider router={appRouter} />
        </main>
    )
}
