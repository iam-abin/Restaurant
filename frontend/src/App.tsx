import MainLayout from "./components/MainLayout";
import Auth from "./pages/Auth";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Otp from "./pages/Otp";

const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
    },
    {
        path: "/auth",
        element: <Auth />,
    },
    {
        path: "/landing",
        element: <MainLayout />,
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
