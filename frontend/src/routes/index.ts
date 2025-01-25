import { UserRoutes } from './user/UserRoutes';
import { RestaurantRoutes } from './restaurant/RestaurantRoutes';
import { AdminRoutes } from './admin/AdminRoutes';
import { AuthRoutes } from './auth/AuthRoutes';
import { NotFoundRoute } from './404/NotFoundRoute';

const routes = [...UserRoutes, ...RestaurantRoutes, ...AdminRoutes, ...AuthRoutes, ...NotFoundRoute];

export default routes;
