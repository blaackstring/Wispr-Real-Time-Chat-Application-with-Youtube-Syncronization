import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [text, setText] = useState("WISPR");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleInput = (event) => {
    const newText = event.target.innerText;
    setText(newText);
  };

  // Track mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const mouseX = mousePosition.x / window.innerWidth;
  const mouseY = mousePosition.y / window.innerHeight;

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-400 via-purple-700 to-slate-600 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mouseX * 50 - 25}px, ${mouseY * 50 - 25}px)`,
            left: '10%',
            top: '20%',
          }}
        />
        <div 
          className="absolute w-80 h-80 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000"
          style={{
            transform: `translate(${mouseX * -30 + 15}px, ${mouseY * -30 + 15}px)`,
            right: '10%',
            bottom: '20%',
          }}
        />
        <div 
          className="absolute w-64 h-64 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse animation-delay-4000"
          style={{
            transform: `translate(${mouseX * 40 - 20}px, ${mouseY * 40 - 20}px)`,
            left: '60%',
            top: '60%',
          }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
              backgroundSize: '50px 50px',
              transform: `translate(${mouseX * 10}px, ${mouseY * 10}px)`,
            }}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Main heading with multiple layers */}
        <div className="relative">
          {/* Shadow layer */}
          <h1 
            className="absolute text-6xl md:text-8xl lg:text-9xl font-black text-black/20 blur-sm select-none"
            style={{
              transform: `translate(${mouseX * 8}px, ${mouseY * 8}px)`,
            }}
          >
            {text}
          </h1>
          
          {/* Glow layer */}
          <h1 
            className="absolute text-6xl md:text-8xl lg:text-9xl font-black text-white blur-md opacity-30 select-none"
            style={{
              transform: `translate(${mouseX * -4}px, ${mouseY * -4}px)`,
            }}
          >
            {text}
          </h1>

          {/* Main text */}
          <h1
            data-heading={text}
            className={`
              relative text-6xl md:text-8xl lg:text-9xl font-black
              bg-gradient-to-r from-yellow-200 via-white to-pink-400
              bg-clip-text text-transparent
              transition-all duration-500 ease-out cursor-pointer
              ${isHovered ? 'scale-110 rotate-1' : 'scale-100'}
            `}
            contentEditable
            suppressContentEditableWarning={true}
            onInput={handleInput}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              textShadow: '0 0 40px rgba(255, 255, 255, 0.5)',
              transform: `translate(${mouseX * 6}px, ${mouseY * 2}px) ${isHovered ? 'scale(1.5) rotate(1deg)' : ''}`,
            }}
          >
            {text}
          </h1>

          {/* Animated underline */}
          <div 
            className={`
              absolute bottom-0 left-1/2 transform -translate-x-1/2
              h-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500
              transition-all duration-700 ease-out
              ${isHovered ? 'w-full opacity-100' : 'w-0 opacity-0'}
            `}
            style={{
              boxShadow: '0 0 20px rgba(255, 105, 180, 0.7)',
            }}
          />
        </div>

        {/* Subtitle */}
        <div className="mt-8 space-y-4">
          <p 
            className={`
              text-xl md:text-2xl text-gray-300 font-light tracking-wider
              transition-all duration-700 ease-out
              ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-70 translate-y-2'}
            `}
          >
            Where Ideas Come to Life
          </p>
          
          {/* Animated dots */}
          <div className="flex justify-center space-x-2 mt-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`
                  w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-pink-500
                  animate-pulse
                `}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '2s',
                }}
              />
            ))}
          </div>
        </div>

        {/* Interactive elements */}
        <div className="mt-12 flex justify-center space-x-8">
          <Link
           to='/login'
            className={`
              px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600
              text-white font-semibold rounded-full
             hover:p-3 
              transform transition-all duration-300 ease-out
              hover:scale-105 hover:-translate-y-1
              focus:outline-none focus:ring-4 focus:ring-purple-500/50
            `}
         
          >
            Login
          </Link>
          
          <Link 
           to='/signup'
            className={`
              px-8 py-3 hover:p-3  bg-transparent border-2 border-gray-400
              shadow-[0_15px_16px_0_rgba(0,0,0,0.3)]
              text-gray-300 font-semibold rounded-full
              hover:border-white hover:text-white
              transform transition-all duration-300 ease-out
              hover:scale-105 hover:-translate-y-1
              focus:outline-none focus:ring-4 focus:ring-gray-500/50
            `}
          >
            Signup
          </Link>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.7;
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* Glitch effect for text */
        h1[contentEditable]:focus {
          animation: glitch 0.3s ease-in-out;
        }

        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }

        /* Gradient animation */
        .bg-gradient-to-r {
          background-size: 400% 400%;
          animation: gradientShift 8s ease infinite;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Enhanced text shadow */
        h1[data-heading]::before {
          content: attr(data-heading);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          background-size: 200% 200%;
          animation: shimmer 3s ease-in-out infinite;
          z-index: -1;
        }

        @keyframes shimmer {
          0% { background-position: -200% -200%; }
          50% { background-position: 200% 200%; }
          100% { background-position: -200% -200%; }
        }
      `}</style>
    </div>
  );
}

export default Home;