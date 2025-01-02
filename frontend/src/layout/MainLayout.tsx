import NavBar from '../components/navbar/NavBar';
import { Outlet, useNavigate } from 'react-router-dom';
import Footer from '../components/footer/Footer';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { logoutUser } from '../redux/thunk/authThunk';
import { clearRestaurant } from '../redux/slice/restaurantSlice';
import { ROLES_CONSTANTS } from '../utils/constants';

const MainLayout = () => {
    const currentUser = useAppSelector((store: RootState) => store.authReducer.authData);
    const dispatch = useAppDispatch();
    const naivgate = useNavigate();

    const handleLogout = async () => {
        const response = await dispatch(logoutUser());
        dispatch(clearRestaurant());

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
                className={`flex-grow ${currentUser?.role === ROLES_CONSTANTS.USER ? 'bg-gray-100' : 'bg-white'}`}
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
