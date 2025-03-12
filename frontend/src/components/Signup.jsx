import {  useState } from "react";
import Input from "./Input";
import addImg from '../assets/add.png'
import { Buttons } from "./Button";
import { SignupController } from "@/Controllers/authController";
import { useNavigate } from "react-router-dom";
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Signup=()=>{
  const navigate=useNavigate()
    const [formdata,setformdata]=useState({
        email:"",
        password:"",
        fullname:'',
        gender:'',
        username:'',
    })
const handleinputchange=(e)=>{
    setformdata({...formdata,[e.target.name]:e.target.value})
} 
const handleSubmit = async (e) => {
  try {
    e.preventDefault();
    console.log(formdata);
    const fetchData = await SignupController(formdata); // Call API
    console.log(fetchData);

    if (fetchData.success) {  // FIX: Use fetchData.success instead of formdata.success
      navigate("/login");
      toast.success('🦄 Signup Successful!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });

      setformdata({   // Reset form after success
        email: "",
        password: "",
        fullname: "",
        gender: "",
        username: "",
      });
    } else {
      toast.error(fetchData.message || "Signup Failed!", {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
      });
    }
  } catch (error) {
    console.log(error);
    toast.error("Something Went Wrong!", { theme: "dark" });
  }
};

    return <>
     <div className="lg:w-[40vw] sm:w-[60vw] p-2 flex items-center justify-center backdrop:blur-3xl  bg-white/40 rounded-4xl">
        <div className=" w-90 bg-white/70 p-3 rounded-lg shadow-lg h-full flex flex-col items-center justify-around">
                 <img src={addImg} alt="" className='w-[100px] h-[100px] '/>
          <form action="" onSubmit={handleSubmit} className=" flex items-center flex-col justify-center">

          <Input   onChange={handleinputchange} classname="w-full p-2 border-2 rounded-2xl bg-white" placeholder="Email" name="email" label="Email" />
            <Input   onChange={handleinputchange} classname="w-full p-2 border-2 rounded-2xl bg-white" placeholder="Password" name="password"  label="Password"/>
            
          <Input   onChange={handleinputchange} classname="w-full p-2 border-2 rounded-2xl bg-white" placeholder="username" name="username" label="username" />
            <Input   onChange={handleinputchange} classname="w-full p-2 border-2 rounded-2xl bg-white" placeholder="fullname" name="fullname"  label="fullname"/>
            <label htmlFor="" className="ml-4">Gender:</label>
       <div className="grid grid-cols-2">
       <Input type="radio" onChange={handleinputchange} value="male" name="gender" label="male" />
  
       <Input type="radio"  onChange={handleinputchange} value='female'name="gender" label="female" />
       </div> 
     
      <Buttons name="Signup " className=' mt-[-20px] w-full'/>
     
          </form>
          {/* Your Login Form */}
        </div>
      </div>
    </>
    }

export default Signup;