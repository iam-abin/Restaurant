import MainLayout from "./layout/MainLayout";
import Auth from "./pages/Auth";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Otp from "./pages/Otp";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import SearchResult from "./pages/SearchResult";
import RestaurantDetails from "./pages/RestaurantDetails";
import Cart from "./pages/Cart";
import Restaurant from "./pages/admin/Restaurant";
import Menu from "./pages/admin/Menu";
import Orders from "./pages/admin/Orders";
import Success from "./pages/Success";
import { Toaster } from "react-hot-toast";
import Error404 from "./pages/Error404";
import { RoleProtectedRoute } from "./components/ProtectedRoute";
import { ROLES_CONSTANTS } from "./utils/constants";

const appRouter = createBrowserRouter([
    {
        path: "/",
        element: (
            <RoleProtectedRoute >
                <MainLayout />
            </RoleProtectedRoute>
        ),
        children: [
            { path: "/", element: <Landing /> },
            { path: "/profile", element: <Profile /> },
            { path: "/search/:searchKey", element: <SearchResult /> },
            { path: "/user/restaurant/:restaurantId", element: <RestaurantDetails /> },
            { path: "/cart", element: <Cart /> },
            { path: "/success", element: <Success /> },
            { path: "*", element: <Error404 /> },
        ],
    },
    {
        path: "/restaurant",
        element: (
            <RoleProtectedRoute allowedRoles={[ROLES_CONSTANTS.RESTAURANT]}>
                <MainLayout />
            </RoleProtectedRoute>
        ),
        children: [
            { path: "", element: <Restaurant /> },  // Correct relative path
            { path: "menu", element: <Menu /> },
            { path: "orders", element: <Orders /> },
        ],
    },
    {
        path: "/admin",
        element: (
            <RoleProtectedRoute allowedRoles={[ROLES_CONSTANTS.ADMIN]}>
                <MainLayout />
            </RoleProtectedRoute>
        ),
        children: [
            // { path: "/", element: <Dashboard /> },
            // { path: "/users", element: <Users /> },
            // { path: "/restaurants", element: <Restaurants /> },
        ],
    },
    
    {
        path: "/auth",
        element: <Auth />,
    },
    {
        path: "/restaurant/auth",
        element: <Auth />,
    },
    {
        path: "admin/auth",
        element: <Auth />,
    },
    {
        path: "/forgot-password/email",
        element: <ForgotPassword />,
    },
    {
        path: "/reset-password/:uniqueId",
        element: <ResetPassword />,
    },
    {
        path: "/otp/forgot-password",
        element: <Otp />,
    },
    {
        path: "/otp/signup",
        element: <Otp />,
    },
]);

export default function App() {
    return (
        <main>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 6000,
                    style: { marginTop: "80px" },
                }}
            />
            <RouterProvider router={appRouter} />
        </main>
    );
}

