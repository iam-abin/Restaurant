// import { StrictMode } from 'react'
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

createRoot(document.getElementById('root')!).render(
    // <StrictMode>
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <Suspense
                fallback={<div className="w-full h-screen flex items-center justify-center">Loading...</div>}
            >
                <App />
            </Suspense>
        </PersistGate>
    </Provider>,
    // </StrictMode>,
);
