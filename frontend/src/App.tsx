// import { createBrowserRouter, RouterProvider } from 'react-router';
import { Toaster } from 'react-hot-toast';
// import { Route, RouterProvider, Routes } from 'react-router';
// import AdminRoutes from './routes2/admin/AdminRoutes';
// import UserRoutes from './routes2/user/UserRoutes';
// import RestaurantRoutes from './routes2/restaurant/RestaurantRoutes';
// import AuthRoutes from './routes2/auth/AuthRoutes';
// import PasswordRoutes from './routes2/password/PasswordRoutes';
// import NotFoundRoute from './routes2/404/NotFoundRoute';
import { AnimatePresence } from 'framer-motion';
import { createBrowserRouter, RouterProvider } from 'react-router';
import routes from './routes';

const appRouter = createBrowserRouter(routes);

export default function App() {
    return (
        <main>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 6000,
                    style: { marginTop: '80px' },
                }}
            />
            <AnimatePresence mode="wait">
                <RouterProvider router={appRouter} />
            </AnimatePresence>
        </main>
    );
}
