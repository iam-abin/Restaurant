import MainLayout from "./layout/MainLayout";
import Auth from "./pages/Auth";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
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

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: "/",
                element: <Landing />
            },
            {
                path: "/profile",
                element: <Profile />
            },
            {
                path: "/search/:searchKey",
                element: <SearchResult />
            },
            {
                path: "/restaurant/:restaurantId",
                element: <RestaurantDetails />
            },
            {
                path: "/cart",
                element: <Cart />
            },
            // Admin routes
            {
                path: "/admin/restaurant",
                element: <Restaurant />
            },
            {
                path: "/admin/menu",
                element: <Menu />
            }
            ,
            {
                path: "/admin/orders",
                element: <Orders />
            }
        ]
    },
    {
        path: "/auth",
        element: <Auth />,
    },
    {
        path: "/forgot-password",
        element: <ForgotPassword />,
    },
    {
        path: "/reset-password",
        element: <ResetPassword />,
    },
    {
        path: "/otp",
        element: <Otp />,
    },
]);

export default function ButtonUsage() {
    return (
  
            <main>
                <RouterProvider router={appRouter}></RouterProvider>
            </main>
    );
}
