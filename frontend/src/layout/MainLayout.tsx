import NavBar from '../components/navbar/NavBar';
import { Outlet } from 'react-router';
import Footer from '../components/footer/Footer';
import { useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { IUser, UserRole } from '../types';
import { checkRole } from '../utils';
import PageTransition from '../components/framer-motion/PageTransition';

const MainLayout = () => {
    const currentUser: IUser | null = useAppSelector((store: RootState) => store.authReducer.authData);

    return (
        <div className="flex flex-col min-h-screen w-full">
            {/* Header */}
            <header className="sticky top-0 z-50">
                <NavBar currentUser={currentUser!} />
            </header>

            {/* Main body content */}
            <main
                className={`flex-grow ${checkRole(UserRole.USER, currentUser?.role) ? 'bg-gray-100' : 'bg-white'}`}
            >
                <PageTransition>
                    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <Outlet />
                    </div>
                </PageTransition>
            </main>

            {/* Footer */}
            <footer className="bg-gray-100">
                <Footer />
            </footer>
        </div>
    );
};

export default MainLayout;
