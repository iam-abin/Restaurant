import { lazy } from 'react';

const Error404 = lazy(() => import('../../pages/common/Error404'));

export const NotFoundRoute = [{ path: '*', element: <Error404 /> }];

