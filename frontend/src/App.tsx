import MainLayout from "./components/MainLayout";
import Auth from "./pages/Auth";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
]);

export default function ButtonUsage() {
    return (
        <main>
            <RouterProvider router={appRouter}></RouterProvider>
        </main>
    );
}
