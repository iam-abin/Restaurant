import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import routes from './routes';

const appRouter = createBrowserRouter(routes, {
    future: {
        v7_partialHydration: true,
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_relativeSplatPath: true,
        v7_skipActionErrorRevalidation: true,
    },
});

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
            <RouterProvider router={appRouter} />
        </main>
    );
}
