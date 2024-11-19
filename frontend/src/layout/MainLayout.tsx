import NavBar from "../components/navbar/NavBar";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../components/footer/Footer";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { logoutUser } from "../redux/thunk/authThunk";
import { clearRestaurant } from "../redux/slice/restaurantSlice";

const MainLayout = () => {
  const currentUser = useAppSelector(
      (store: RootState) => store.authReducer.authData
  );
  const dispatch = useAppDispatch();
  const naivgate = useNavigate();

  const handleLogout = async () => {
    
      const response = await dispatch(logoutUser());
      dispatch(clearRestaurant());

      // Check if the action was rejected
      if (response.meta.requestStatus !== "rejected") {
          naivgate("/auth");
      }
  };

  return (
      <div className="flex flex-col min-h-screen md:m-0">
          {/* Navbar */}
          <NavBar currentUser={currentUser} handleLogout={handleLogout} />
          {/* Main body content */}
          <main className="flex-1 mx-2">
              <Outlet />
          </main>
          {/* Footer */}
          <Footer />
      </div>
  );
};

export default MainLayout;

