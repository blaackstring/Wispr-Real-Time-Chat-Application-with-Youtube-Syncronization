import { useEffect, useState } from "react";
import Input from "./Input";
import loginImg from '../assets/login.png'
import { Buttons } from "./Button";
import { Navigate, useNavigate } from "react-router-dom";
import { LoginController } from "@/Controllers/authController.js";
import { AuthLogin } from "@/store/slice";
import { useDispatch, useSelector } from "react-redux";
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spin from "./ui/Spin";



function Login() {
const dispatch=useDispatch()
  // const selector=useSelector((state)=>state.user) //state is the whole redux store and state.user → The user slice(jo tumne slice banai hai) from the store (because in store.js, you named it user).
 const [isLoading,setisLoading]=useState(false)
  const navigate=useNavigate()
    const [formdata,setFormData] =useState({
        email: '',
        password: '',
      });
    const handleSubmit=async(e)=>{
      try {
        e.preventDefault();
        
     if(formdata.email!=''&&formdata.password!=''){
      setisLoading(true)
      console.log(formdata);
      const fetchData = await LoginController(formdata);

      if(fetchData.success===true){
       const {message,user}=fetchData;
    dispatch(AuthLogin({...user}))
    setisLoading(false)
    navigate('/userhome',{
      replace: true, 
      state:true
    })
    toast.success('🦄 Login SuccessFull!', {
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
      
     }
     else{
      toast("Invalid Credentials")
     }
     setisLoading(false)
     
    }else{
      toast("Forget to 😅😅 Enter Email or Password ")
    }
        
      } catch (error) {
        toast("Invalid Credentials")
        console.log(error);
      }
  
     
    }

  
const handleinputchange=(e)=>{
    setFormData({...formdata,[e.target.name]:e.target.value});   

}

    return (
      <div className="lg:w-[45vw] sm:w-[90vw]  lg:h-[60vh] h-[50vh] w-[95vw] p-2 flex items-center justify-center backdrop:blur-3xl   bg-white/20 rounded-2xl">
        <div className="   bg-white/40 p-3 lg:w-[35vw] rounded-lg shadow-lg lg:h-[45vh] flex flex-col items-center justify-around">
                 <img src={loginImg} alt="" className='w-[100px] h-[100px] '/>
          <form action="" onSubmit={handleSubmit} className="flex items-center flex-col">

          <Input   onChange={handleinputchange} classname="w-full p-2 border-2 rounded-2xl bg-white" placeholder="Email" name="email" label="Email"  />
            <Input   onChange={handleinputchange} classname="w-full p-2 border-2 rounded-2xl bg-white" placeholder="Password" name="password" type="password" label="Password"/>
          <Buttons className=" w-full-[-30px]"/>
          </form>
       
        </div>
        <div className={`bg absolute  z-30 ${isLoading?'block':'hidden'}`}>
          <Spin/>
        </div>
      </div>
    );
  }
  
  export default Login;
  