import NavBar from '../components/NavBar'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'

const MainLayout = () => {
  return (
    <div className='flex flex-col min-h-screen md:m-0'>
      {/* Navbar */}
      <NavBar />
      {/* Main body content */}
      <main className='flex-1'>
        <Outlet />
      </main>
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default MainLayout
