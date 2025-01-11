import NavBar from '../components/navbar/NavBar';
import { NavigateFunction, Outlet, useNavigate } from 'react-router-dom';
import Footer from '../components/footer/Footer';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { logoutUser } from '../redux/thunk/authThunk';
import { clearRestaurant } from '../redux/slice/restaurantSlice';
import { IUser, UserRole } from '../types';
import { checkRole } from '../utils';
import { clearAdminDashboard } from '../redux/slice/dashboardSlice';
import { clearMenus } from '../redux/slice/menusSlice';
import { clearProfile } from '../redux/slice/profileSlice';
import { clearCart } from '../redux/slice/cartSlice';

const MainLayout = () => {
    const currentUser: IUser | null = useAppSelector((store: RootState) => store.authReducer.authData);
    const naivgate: NavigateFunction = useNavigate();
    const dispatch = useAppDispatch();

    const isAdmin: boolean = checkRole(UserRole.ADMIN, currentUser?.role);
    const isRestaurant: boolean = checkRole(UserRole.RESTAURANT, currentUser?.role);
    const isUser: boolean = checkRole(UserRole.USER, currentUser?.role);

    const handleLogout = async (): Promise<void> => {
        const response = await dispatch(logoutUser());
        if (isUser) {
            dispatch(clearProfile());
            dispatch(clearCart());
        }

        if (isRestaurant) {
            dispatch(clearRestaurant());
            dispatch(clearMenus());
        }

        if (isAdmin) {
            dispatch(clearAdminDashboard());
        }

        // Check if the action was rejected
        if (response.meta.requestStatus !== 'rejected') {
            naivgate('/auth');
        }
    };

    return (
        <div className="flex flex-col min-h-screen w-full">
            {/* Header */}
            <header className="sticky top-0 z-50">
                <NavBar currentUser={currentUser!} handleLogout={handleLogout} />
            </header>

            {/* Main body content */}
            <main
                className={`flex-grow ${checkRole(UserRole.USER, currentUser?.role) ? 'bg-gray-100' : 'bg-white'}`}
            >
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Outlet />
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-100">
                <Footer />
            </footer>
        </div>
    );
};

export default MainLayout;
