import { createRoot } from 'react-dom/client';
import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import App from './App.tsx';
import { Provider } from 'react-redux';
import { persistor, store } from './redux/store.ts';
import { PersistGate } from 'redux-persist/integration/react';
import { Suspense } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ConfirmationProvider } from './context/confirmationContext.tsx';
// import { BrowserRouter } from 'react-router';

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <Suspense
                fallback={<div className="w-full h-screen flex items-center justify-center">Loading...</div>}
            >
                <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
                    <ConfirmationProvider>
                        <App />
                    </ConfirmationProvider>
                </GoogleOAuthProvider>
            </Suspense>
        </PersistGate>
    </Provider>,
);
