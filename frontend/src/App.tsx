import { createBrowserRouter, RouterProvider } from 'react-router';
import { Toaster } from 'react-hot-toast';
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
            <RouterProvider router={appRouter} />
        </main>
    );
}
