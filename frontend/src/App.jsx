import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthLogout, verifyUser } from "./store/slice";
import { LogoutController } from "./Controllers/authController";
import { setRecentUsers } from "./store/userslice";

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
    <div className="w-full min-h-screen relative overflow-x-hidden">
      {/* Enhanced Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Moving gradient orbs */}
          <div 
            className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"
            style={{
              transform: `translate(${mouseX * 100 - 50}px, ${mouseY * 100 - 50}px)`,
              left: '10%',
              top: '10%',
            }}
          />
          <div 
            className="absolute w-80 h-80 bg-gradient-to-r from-pink-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse"
            style={{
              transform: `translate(${mouseX * -80 + 40}px, ${mouseY * -80 + 40}px)`,
              right: '10%',
              bottom: '10%',
              animationDelay: '2s',
            }}
          />
          <div 
            className="absolute w-64 h-64 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 rounded-full blur-3xl animate-pulse"
            style={{
              transform: `translate(${mouseX * 60 - 30}px, ${mouseY * 60 - 30}px)`,
              left: '50%',
              top: '50%',
              animationDelay: '4s',
            }}
          />
        </div>

        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: `translate(${mouseX * 20}px, ${mouseY * 20}px)`,
          }}
        />
      </div>

      {/* Enhanced Navbar - Only show when NOT logged in */}
      <div className="w-screen flex top-4 justify-center absolute z-50">
        {!loginornot && (
          <nav 
            className={`
              min-w-[50%] flex justify-around items-center 
              ${isScrolled 
                ? 'backdrop-blur-xl bg-white/20 border border-white/30' 
                : 'backdrop-blur-md bg-white/10 border border-white/20'
              }
              rounded-2xl lg:text-xl font-bold px-8 py-4
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
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                WISPR
              </span>
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

      {/* Floating particles for ambiance */}
      <div className="fixed inset-0 pointer-events-none z-5">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full animate-float"
            style={{
              left: `${10 + (i * 7)}%`,
              top: `${15 + (i * 6)}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
            opacity: 0.8;
          }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        /* Enhanced scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #2563eb, #7c3aed);
        }
      `}</style>
    </div>
  );
}

export default App;