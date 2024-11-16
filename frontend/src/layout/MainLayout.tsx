import NavBar from '../components/navbar/NavBar'
import { Outlet } from 'react-router-dom'
import Footer from '../components/footer/Footer'
import { useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';

const MainLayout = () => {
  const currentUser = useAppSelector((store: RootState) => store.authReducer.authData); 

  return (
    <div className='flex flex-col min-h-screen md:m-0'>
      {/* Navbar */}
      <NavBar currentUser={currentUser} />
      {/* Main body content */}
      <main className='flex-1 mx-2'>
        <Outlet />
      </main>
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default MainLayout
