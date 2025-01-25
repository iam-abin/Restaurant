import { lazy } from 'react';

const Error404 = lazy(() => import('../../pages/common/Error404'));

const NotFoundRoute = () => ({ path: '*', element: <Error404 /> });

export default NotFoundRoute;
