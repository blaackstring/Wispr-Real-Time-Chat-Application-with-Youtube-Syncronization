import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthLogout, verifyUser } from "./store/slice";
import { LogoutController } from "./Controllers/authController";
import { setRecentUsers } from "./store/userslice";
import BG from "./components/ui/BG/BG";

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selector = useSelector((state) => state.user);
  
  const [loginornot, setLoginOrNot] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setLoginOrNot(selector.isloggedin);
  }, [selector.isloggedin]);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll detection for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await LogoutController();
    dispatch(AuthLogout());
    dispatch(setRecentUsers({ recentUsers: [] }));
    navigate("/login");
  };

  const mouseX = mousePosition.x / (window.innerWidth || 1);
  const mouseY = mousePosition.y / (window.innerHeight || 1);

  return (
    <div className="w-full min-h-screen relative overflow-x-hidden bg-gradient-to-br from-black/99 via-slate-900/90 to-gray-900">
   

      {/* Enhanced Navbar - Only show when NOT logged in */}
      <div className="w-screen flex top-4 justify-center absolute z-50">
        {!loginornot && (
          <nav 
            className={`
              min-w-[50%] flex justify-around items-center border-1
              ${isScrolled 
                ? 'backdrop-blur-xl bg-white/90 border border-white/40' 
                : 'backdrop-blur-md bg-white/5 border border-white/10'
              }
              rounded-2xl lg:text-xl font-bold px-4 py-1
              transition-all duration-500 ease-out shadow-2xl
            `}
            style={{
              boxShadow: isScrolled 
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 50px rgba(255, 255, 255, 0.1)' 
                : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Logo/Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">🎥</span>
              </div>
           <h1 className="text-2xl md:text-2xl text-white font-bold drop-shadow-lg">
          Tube<span className="text-purple-400">2</span>Gether
        </h1>
   
            </div>

            {/* Navigation Links */}
            <div className="flex space-x-6">
              <Link
                to="/login"
                className={`
                  relative px-6 py-3 font-semibold text-sm uppercase tracking-wider
                  transition-all duration-300 ease-out rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-white/50
                  ${location.pathname === "/login"
                    ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg transform scale-105 border-2 border-white/30"
                    : "text-gray-300 hover:text-white hover:bg-white/10 hover:scale-105 hover:shadow-lg"
                  }
                `}
                style={{
                  boxShadow: location.pathname === "/login" 
                    ? '0 10px 25px rgba(59, 130, 246, 0.4)' 
                    : undefined,
                }}
              >
                <span className="relative z-10">Login</span>
                {location.pathname === "/login" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-20 blur-sm" />
                )}
              </Link>

              <Link
                to="/signup"
                className={`
                  relative px-6 py-3 font-semibold text-sm uppercase tracking-wider
                  transition-all duration-300 ease-out rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-white/50
                  ${location.pathname === "/signup"
                    ? "text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg transform scale-105 border-2 border-white/30"
                    : "text-gray-300 hover:text-white hover:bg-white/10 hover:scale-105 hover:shadow-lg"
                  }
                `}
                style={{
                  boxShadow: location.pathname === "/signup" 
                    ? '0 10px 25px rgba(147, 51, 234, 0.4)' 
                    : undefined,
                }}
              >
                <span className="relative z-10">Signup</span>
                {location.pathname === "/signup" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-20 blur-sm" />
                )}
              </Link>
            </div>
          </nav>
        )}
      </div>


      {/* Main Content - EXACTLY as your original */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <Outlet />
      </div>

  
    </div>
  );
}

export default App;