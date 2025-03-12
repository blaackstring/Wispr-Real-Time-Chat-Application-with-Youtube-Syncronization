import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputShad from "./InputShad";
import icon from "../assets/button.png";
import "./userhome.css";
import { useNavigate } from "react-router-dom";
import RecentUser from "./RecentUser";
import Message from "./Message";
import { userClicked } from "@/store/UserClickedSlice";
import { ArrowBigLeftDashIcon } from "lucide-react";
import Loader from "./Loader.jsx";
import { Recievemsg } from "@/Controllers/MessageController";
import { verifyUser } from "@/store/slice";
import WatchParty from "./WatchParty";
import { connectSocket, disconnectSocket } from "@/socketio/Socket";

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
      <div className={`userhome rounded-xl flex   justify-between flex-col w-[100vw] sm:w-full lg:w-[80vw]  lg:h-[88vh] h-[89vh] border-blue-300 border-1 shadow-[0_0_15px_10px_rgba(59,130,246,0.5)] ${iswatchparty ? 'hidden' : 'block'}`}>

        <nav className="h-[9vh] flex justify-evenly items-center bg-black/20 p-5">
          <InputShad setSearchUser={setSearchUser} ref={ref} />


          <div className="w-full h-full flex items-center justify-end">
            {selector.isloggedin && (
              <div className="w-4 h-4 flex items m-2">
                <img src={icon} alt="icon" />
              </div>
            )}
            {selector.ProfilePic && (
              <img
                src={selector?.ProfilePic}
                alt="pic"
                className="w-12 h-12 rounded-[50%] bg-blue-200 mr-5"
                onClick={userimghandler}
              />
            )}
          </div>
        </nav>

        <div className="flex mb-1 mt-1 flex-1 justify-center">
          {(isclicked || width > 900) && (
            <div className="left bg-[#151f25] mt-2 mb-5  ml-5 lg:w-[20vw] w-full">
              {SearchUser?.length > 0 ? (
                <div className="flex-1 w-full text-white  overflow-auto ">
                  {SearchUser?.map((recent) => (
                    <div
                      key={recent._id}
                      id={recent._id}
                      className="h-[8vh] mb-1   bg-[#2A3942] rounded  p-2 mt-1"
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
                <div className=" h-[74vh] overflow-y-scroll overflow-x-hidden">
                  <RecentUser isclicked={isclicked} setisclicked={setisclicked} />
                </div>
              )}

              {SearchUser?.length > 0 && (
                <div className="w-fit ml-2 mt-4">
                  <ArrowBigLeftDashIcon
                    className="bg-white/50 w-8 h-8"
                    onClick={handleAllUser}
                  />
                </div>
              )}
            </div>
          )}

          <div className="right flex justify-center items-center flex-1 w-[90%] p-3">
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
      <div className={`w-full h-[90vh]   ${iswatchparty ? 'block' : 'hidden'}`}>
        {socket && <WatchParty setiswatchparty={setiswatchparty}  socket={socket}  setisclicked={setisclicked}
                isclicked={isclicked}
                width={width}
                iswatchparty={iswatchparty}/>}
      </div>
    </>
  ); 
}

export default UserHomePage;
