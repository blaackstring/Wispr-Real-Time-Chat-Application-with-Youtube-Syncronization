import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import bckbtn from '../assets/backbutton.png'
import { useNavigate } from 'react-router-dom'
import ProfileComponent from './ProfieComponent'

function UserProfile() {


  const navigate=useNavigate()




  useEffect(() => {
    // Check if this is the first page load or refresh using localStorage
    const isPageRefreshed = localStorage.getItem('isPageRefreshed');
    
    if (isPageRefreshed) {
      // If the flag is found, navigate to '/userhome'
      navigate('/userhome');
    } else {
      // If it's the first time, set the flag in localStorage
      localStorage.setItem('isPageRefreshed', 'true');
    }

    // Clean up the localStorage flag when the component is unmounted or on new session
    return () => {
      localStorage.removeItem('isPageRefreshed');
    };
  }, [navigate]); 
  
    const dataFromSlice=useSelector((state)=>state.user)
    const userimghandler=(e)=>{
      if(e.target)
        navigate('/userhome');
    }
      
  return (
    <div className='lg:w-[30vw] h-[50vh] w-[70vw] flex-col text-white flex justify-center items-center  lg:text-2xl font-bold rounded-2xl p-2 bg-[#0B141A]'>
       <nav className='w-full '>
         <img src={bckbtn} alt="" className='rounded-[50%] w-8 h-8 bg-amber-50' onClick={userimghandler} />
       </nav>
      <div className='w-[35vw] h-[40vh] flex items-center flex-col justify-around'>
      
      <div className=''>
      <nav className='w-full '>
        <ProfileComponent pic={dataFromSlice?.ProfilePic}/>
       </nav>
      </div>
      <span>
        <span className='mr-5 underline uppercase'>fullname:</span>{dataFromSlice.fullname}
      </span>
      <span>
       <span className='mr-5 underline uppercase'> username:</span>{dataFromSlice.username}
      </span>
      <span>
       <span className='mr-5 underline uppercase'> Email:</span>{dataFromSlice.email}
      </span>
   
      </div>
    </div>
  )
}

export default UserProfile
