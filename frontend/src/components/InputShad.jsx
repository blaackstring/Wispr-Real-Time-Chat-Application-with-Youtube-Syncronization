import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getAllUsers } from "@/Controllers/getAllUsers.js";
import { forwardRef, useRef, useState } from "react";
import Loader from "./Loader";


export function InputShad({
  setSearchUser,
  ref
}) {
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async() => {
   try {
    const msg=ref.current.value;
    if(!msg==''){
      setIsLoading(true);
    const datafromAllUsers=await getAllUsers(ref.current.value);
    console.log(datafromAllUsers.users);
    setSearchUser(datafromAllUsers.users);
    setIsLoading(false);
    }
   } catch (error) {
    console.error(error);
   }
  };

  return (
    <div className="flex w-full max-w-sm items-center text-white  border-none space-x-2">
      <Input type="text" placeholder="Search Username " className=' w-[20vw] ' ref={ref}  />
      {!isLoading?( <Button type="submit" className="bg-amber-50 text-black hover:text-blue-700 lg:w-[5vw]  " onClick={handleSubmit} >Search</Button>):(<div className=" flex justify-center w-[12%] mr-4 items-center">
      <Loader/>
      </div>)}
    </div>
 
  )
}

export default InputShad