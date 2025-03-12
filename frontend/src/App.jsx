import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthLogout, verifyUser } from "./store/slice"; // Import the verification action
import { LogoutController } from "./Controllers/authController";
import { setRecentUsers } from "./store/userslice";


function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate=useNavigate();
  
  const selector = useSelector((state) => state.user);
  useEffect(() => {
    setLoginOrNot(selector.isloggedin);
  }, [selector.isloggedin]);
  const [loginornot, setLoginOrNot] = useState(false);

  // 🔥 Fetch user on app load


  // ✅ Update state when Redux state changes





  const handleLogout = async () => {
    await LogoutController() 
    dispatch(AuthLogout());// Ensure cookies/session are cleared
    dispatch(setRecentUsers({ recentUsers: [] })); 
    navigate("/login"); 
  };
  return (
    <div className="w-screen min-h-screen flex bg-white/30 flex-col ">
      {/* Navbar */}
      <div className="w-screen flex  top-1 justify-center absolute">
        <nav className="min-w-[20%] h-[7vh] flex justify-around items-center backdrop-blur-md bg-white/10 rounded-2xl lg:text-xl font-bold ">
          {loginornot ? (
            <Link
              onClick={handleLogout}
              className="text-white border-2  hover:text-black hover:bg-white hover:transition-0.3s border-white/30 p-1 rounded-2xl"
            >
              Logout
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className={`${
                  location.pathname === "/login"
                    ? "text-white border-2 border-b-black p-2 rounded-2xl"
                    : ""
                }`.trim()}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className={`${
                  location.pathname === "/signup"
                    ? "text-white border-2 border-b-black border-t-amber-600 p-2 rounded-2xl"
                    : ""
                }`.trim()}
              >
                Signup
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center mt-[10vh]">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
