import { getRecentUsers } from '@/Controllers/getRecentUser'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userClicked } from '@/store/UserClickedSlice.js';
import { Recievemsg } from '@/Controllers/MessageController';
import Loader from './Loader.jsx';

function RecentUser({setisclicked,}) {
  const RecentUsers = useSelector((state) => state.RecentSlice.recentUsers);//it is an array of all chatted users
  const OnlineUsers = useSelector((state) => state.OnlineUsers);
  console.log(OnlineUsers);
  
  
  const [Rcnt, setRcnt] = useState();
  const ref = useRef();
  const mapref=useRef();
  const dispatch = useDispatch();
  const clickhandler = async (recent) => {
    setisclicked(false);
    try {
      const res = await Recievemsg(recent._id);
      setRcnt(recent)
      scrollToBottom()
      dispatch(userClicked({ clicked: true, user: recent, Messages: res }));
    } catch (error) {
      console.error("Error While RCV MSG", error)
    }
  };
  const scrollToBottom = () => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };


  return <>
    {RecentUsers.length > 0 ? <div className='min-w-[80vw] flex-1  text-white justify-center flex flex-col p-1 '>
      {RecentUsers.map((recent) => {
        return (
          <div
            key={recent._id + 9}
            id={recent._id}
            className='h-[8vh]  lg:w-[19vw] items-center flex mb-1 justify-center  rounded'
            onClick={() => clickhandler(recent)} // Pass the recent object
          >
            <div className={`flex items-center w-full justify-start p-2 h-full mt-2 bg-[#2e313f] ${Rcnt?._id === recent._id ? 'bg-white text-black' : ''}  hover:bg-[#fbe5e5] rounded hover:text-black`} key={recent._id + 7}>
              {recent.ProfilePic ? (
                <img src={recent?.ProfilePic} alt="pic" className='w-12 h-12 rounded-[50%] bg-blue-200 mr-5' />
              ) : ''}
      { OnlineUsers?.includes(recent._id) ?(
                  <span className="text-green-400 ml-2 text-sm">🟢</span>
                ) : (
                  <span className="text-xs text-red-400 mr-4">🔴</span>
                )}
              <span className='uppercase w-full min-w-[10vw] inline-block'> {recent.fullname}</span>
              <div className='flex justify-end items-center w-full'>
          
              </div>
            </div>
            <div ref={ref}></div>
          </div>

        );
      })}

    </div> : <Loader />}
  </>
}

export default RecentUser
