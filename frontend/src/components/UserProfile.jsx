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
      navigate('/userhome');
    } else {
 
      localStorage.setItem('isPageRefreshed', 'true');
    }

    
    return () => {
      localStorage.removeItem('isPageRefreshed');
    };
  }, [navigate]); 
  
    const dataFromSlice=useSelector((state)=>state.user)
    const userimghandler=(e)=>{
      if(e.target)
        navigate('/userhome',{
      state:true
      });
    }
      
  return (
    <div className='lg:w-[35vw] h-[60vh] w-[80vw] flex-col text-white flex justify-center items-center  lg:text-xl font-bold rounded-2xl p-2 bg-[#0B141A]'>
       <nav className='w-full '>
         <img src={bckbtn} alt="" className='rounded-[50%] w-8 h-8 bg-amber-50' onClick={userimghandler} />
       </nav>
      <div className='w-[35vw] h-[50vh] flex flex-col justify-around items-center'>
      
      <div className=''>
      <nav className='w-full '>
        <ProfileComponent pic={dataFromSlice?.ProfilePic}/>
       </nav>
      </div>
      
<div className='flex flex-col p-1  h-screen-[60%] items-center text-l lg:w-full w-[80vw]'>
<div className='mr-5 underline uppercase mt-5 '>fullname: <span className='ml-4 mt-5 '>{dataFromSlice.fullname}</span></div>
        <div className='mr-5 underline uppercase mt-5 '>Username <span className='ml-4 mt-5'>{dataFromSlice.username}</span></div>
        <div className='mr-5 underline uppercase mt-5 '>Email: <span className='ml-5 mt-5'>{dataFromSlice.email}</span></div>
</div>
    
   
      </div>
    </div>
  )
}

export default UserProfile
