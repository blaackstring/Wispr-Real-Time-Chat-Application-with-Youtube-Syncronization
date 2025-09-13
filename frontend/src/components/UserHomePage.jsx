import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputShad from "./InputShad";
import icon from "../assets/button.png";
import "./userhome.css";
import { useLocation, useNavigate } from "react-router-dom";
import RecentUser from "./RecentUser";
import Message from "./Message";
import { userClicked } from "@/store/UserClickedSlice";
import { ArrowBigLeftDashIcon } from "lucide-react";
import Loader from "./Loader.jsx";
import { Recievemsg } from "@/Controllers/MessageController";
import { AuthLogout, verifyUser } from "@/store/slice";
import WatchParty from "./WatchParty";
import { connectSocket, disconnectSocket } from "@/socketio/Socket";
import { setRecentUsers } from "@/store/userslice";
import { LogoutController } from "@/Controllers/authController";

function UserHomePage() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [socket, setsocket] = useState()
  const selector = useSelector((state) => state.user);
  const [ispending, setispending] = useState(true)
  const [iswatchparty, setiswatchparty] = useState()
  const [SearchUser, setSearchUser] = useState([]);
  const [isclicked, setisclicked] = useState(true);
  const ref = useRef(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [isActive, setisActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();


useEffect(()=>{
 if( location.state==null){
  navigate("/login")
 }
})

  const handleLogout = async () => {
    await LogoutController() 
    dispatch(AuthLogout());// Ensure cookies/session are cleared
    dispatch(setRecentUsers({ recentUsers: [] })); 
    navigate("/login"); 
  };

  useEffect(() => {
    if (selector.userid) {
      const soc = connectSocket(selector.userid)
      setsocket(soc)
      console.log(socket);

      setispending(false)

      return () => {
        disconnectSocket(); // Cleanup socket on unmount
      };
    }
  }, [selector.userid])




  useEffect(() => {
    dispatch(verifyUser());
  }, [dispatch]);


  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);




 



  const clickhandlerAll = async (recent) => {
    try {
      dispatch(userClicked({ clicked: true, user: recent }));
      setisclicked(false);
      const res = await Recievemsg(recent._id);
      dispatch(userClicked({ clicked: true, user: recent, Messages: res }));
      console.log(res);
    } catch (error) {
      console.error("Error While RCV MSG", error)
    }

  };
 

  const handleAllUser = () => {
    setSearchUser([]);
    if (ref.current) ref.current.value = "";
  };

  const userimghandler = async (e) => {
    if (e.target) navigate("/userprofile");
  };

  return (
    <>
      <div className={`userhome flex   justify-between flex-col w-[100vw] sm:w-full lg:w-[80vw]   lg:h-[87vh] h-screen border-blue-400 shadow-[0_0_5px_5px_rgba(59,130,246,0.5)] ${iswatchparty ? 'hidden' : 'block'}`}>

    <nav className="h-[9vh] flex items-center justify-between bg-black/20 p-2">
  {/* Search Input */}
  <InputShad setSearchUser={setSearchUser} ref={ref} />

  {/* Clear Search Button */}
  {SearchUser?.length > 0 && (
    <div className="ml-2 rounded-2xl bg-white hover:bg-blue-600">
      <ArrowBigLeftDashIcon
        className="w-8 h-8 cursor-pointer rounded-2xl"
        onClick={handleAllUser}
      />
    </div>
  )}

  {/* Profile Section */}
  <div className="flex items-center ml-auto gap-3">
    {selector.isloggedin && (
      <div className="w-4 h-4 flex items-center m-2">
        <img src={icon} alt="icon" />
      </div>
    )}

    {selector.ProfilePic && (
      <img
        src={selector?.ProfilePic}
        alt="profile"
        className="w-12 h-12 rounded-full bg-blue-200 cursor-pointer mr-5"
        onClick={userimghandler}
      />
    )}

    {/* Logout Button */}
    <button
      className="bg-black text-white text-lg rounded-2xl p-2 hover:bg-white hover:text-black ring-2 ring-blue-500"
      onClick={handleLogout}
    >
      LogOut
    </button>
  </div>
</nav>


        <div className="flex  flex-1  p-1 justify-center h-[65vh] items-stretch relative top-1">
          {(isclicked || width > 900) && (
            <div className="left bg-[#272a2c] lg:w-[20vw] overflow-y-auto   w-full">
              {SearchUser?.length > 0 ? (
                <div className="flex-1 w-full text-white  ">
                  {SearchUser?.map((recent) => (
                    <div
                      key={recent._id}
                      id={recent._id}
                      className="h-[8vh] mb-1   bg-[#2A3942] rounded   mt-1"
                      onClick={() => clickhandlerAll(recent)}
                    >
                      <div
                        className={`flex items-center justify-start p-2 h-full rounded-xl hover:bg-[#2b3033] ${isActive ? "bg-amber-300" : ""
                          }`}
                      >
                        {recent.ProfilePic && (
                          <img
                            src={recent?.ProfilePic}
                            alt="pic"
                            className="w-12 h-12 rounded-[50%] bg-blue-200 mr-5"
                          />
                        )}
                        <span>{recent.fullname}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="lg:h-[74vh] h-[85vh] overflow-y-scroll  overflow-x-hidden">
                  <RecentUser isclicked={isclicked} setisclicked={setisclicked} />
                </div>
              )}

             
            </div>
            
          )}
          

          <div className="right   flex-1 w-full mb-10 overflow-hidden ">
            {ispending ? <Loader /> : (socket && (
              <Message
                socket={socket}
                setisclicked={setisclicked}
                isclicked={isclicked}
                width={width}
                iswatchparty={iswatchparty}
                setiswatchparty={setiswatchparty}
              />
            ))}

          </div>
        </div>
      </div>
      <div className={`w-full h-[100vh]   ${iswatchparty ? 'block' : 'hidden'}`}>
        {socket && <WatchParty setiswatchparty={setiswatchparty}  socket={socket}  setisclicked={setisclicked}
                isclicked={isclicked}
                width={width}
                iswatchparty={iswatchparty}/>}
      </div>
    </>
  ); 
}

export default UserHomePage;
