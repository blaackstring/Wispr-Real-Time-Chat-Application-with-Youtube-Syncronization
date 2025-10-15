import { useEffect, useState } from "react";
import BG from "./ui/BG/BG";
import { useSelector } from "react-redux";


export default function Home() {
 const selector = useSelector((state) => state.user);
  
  const [loginornot, setLoginOrNot] = useState(true);

  const isLogged=()=>{
  if(!loginornot){
    
    window.location.href="/login";
  }else{
    window.location.href="/userhome";
  }
}
  return (
    <div className="relative w-screen h-screen overflow-hidden text-white font-inter">
      {/* Animated Background */}
      <BG />

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-6xl md:text-7xl font-bold drop-shadow-lg">
          Tube<span className="text-purple-400">2</span>Gether
        </h1>

        <p className="text-lg md:text-xl mt-4 max-w-2xl opacity-90">
          Watch YouTube videos together in real-time and chat live — from anywhere.
        </p>

        <div className="flex gap-6 mt-10">
          <button className="bg-transparent border  cursor-pointer border-purple-1 
          00 px-8 py-3 rounded-2xl text-lg font-semibold hover:bg-purple-500/10 transition-all" onClick={isLogged}>
            Join Room
          </button>
        </div>
      </div>

      {/* Optional Header */}

    </div>
  );
}
