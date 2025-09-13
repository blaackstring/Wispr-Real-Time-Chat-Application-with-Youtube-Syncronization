import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import bckbtn from '../assets/backbutton.png';
import ProfileComponent from './ProfieComponent';

function UserProfile() {
  const navigate = useNavigate();
  const dataFromSlice = useSelector((state) => state.user);

  const userimghandler = () => {
    navigate('/userhome', { state: true });
  };

  useEffect(() => {
    const isPageRefreshed = localStorage.getItem('isPageRefreshed');

    if (isPageRefreshed) {
      navigate('/userhome');
    } else {
      localStorage.setItem('isPageRefreshed', 'true');
    }

    return () => {
      localStorage.removeItem('isPageRefreshed');
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center m bg-gradient-to-b from-[#0B141A] to-[#1A1F26] p-4">
      {/* Card Container */}
      <div className="lg:w-[35vw] w-[90vw] bg-[#0B141A] rounded-3xl shadow-lg p-6 flex flex-col items-center text-white font-medium">
        {/* Back Button */}
        <div className="w-full flex justify-start mb-4">
          <img
            src={bckbtn}
            alt="back"
            className="w-10 h-10 rounded-full p-1 bg-amber-50 hover:scale-105 transition-transform cursor-pointer"
            onClick={userimghandler}
          />
        </div>

        {/* Profile Picture */}
        <ProfileComponent pic={dataFromSlice?.ProfilePic} />

        {/* User Info */}
        <div className="mt-6 w-full flex flex-col gap-4 text-sm lg:text-base">
          <div className="flex justify-between bg-gray-800/50 rounded-xl p-3 shadow-sm hover:bg-gray-700/60 transition-colors">
            <span className="uppercase font-semibold">Full Name:</span>
            <span>{dataFromSlice.fullname}</span>
          </div>
          <div className="flex justify-between bg-gray-800/50 rounded-xl p-3 shadow-sm hover:bg-gray-700/60 transition-colors">
            <span className="uppercase font-semibold">Username:</span>
            <span>{dataFromSlice.username}</span>
          </div>
          <div className="flex justify-between bg-gray-800/50 rounded-xl p-3 shadow-sm hover:bg-gray-700/60 transition-colors">
            <span className="uppercase font-semibold">Email:</span>
            <span>{dataFromSlice.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
