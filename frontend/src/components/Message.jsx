import React, { useEffect, useMemo, useRef, useState } from "react";
import "./message.css";
import { useDispatch, useSelector } from "react-redux";
import { ArrowBigLeftDashIcon, Send } from "lucide-react";
import Loader from "./Loader";
import { sendmsg } from "@/Controllers/MessageController";
import { getRecentUsers } from "@/Controllers/getRecentUser";
import vdoplr from '../assets/video-player.png'
import { setRecentUsers } from "@/store/userslice";
import { connectSocket, disconnectSocket } from "@/socketio/Socket";
import { getUsers } from "@/store/getOnlineUserslice.js";
import sound from '../assets/notifysound.mp3'

function Message({ setisclicked, isclicked, socket, width,iswatchparty,setiswatchparty }) {
  const ref = useRef();
  const grabuser=useRef();
  const userstate = useSelector((state) => state.UserClickedSlice.user);




  useEffect(()=>{
grabuser.current=userstate
console.log(grabuser.current);

  },[userstate])
  

  grabuser.current=userstate.user?._id
  console.log(grabuser.current);
  
  const dispatchOnlineUser=useDispatch()
  const [allmsg, setallmsg] = useState([]);

  const [isLoading, setisLoading] = useState(false);
  

   const onlineusrs=useRef([])
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.user);
  useEffect(()=>{
    scrollToBottom();
  },[allmsg])


  useEffect(() => {
    if (!socket) return;
  
    console.log("Socket Connected:", socket);
  
    // Remove previous listeners to prevent duplication
    socket.off("New_Message"); // ✅ Ensures no duplicate listeners
    socket.off("getOnlineUsers");
  
    // Add fresh listeners
    socket.on("getOnlineUsers", (Users) => {
      if (JSON.stringify(Users) !== JSON.stringify(onlineusrs.current)) {
          onlineusrs.current = Users; 
          dispatchOnlineUser(getUsers(Users)); // Dispatch action if needed
      }
  });
    socket.on("New_Message", (msg) => {
      console.log( grabuser.current);
      console.log(msg.senderid.toString());

      if (msg.senderid.toString() == grabuser.current){
        let audio = new Audio(sound);
        audio.play();
        console.log(msg);
        setallmsg((prev) => [...prev, msg]);
        setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth" }), 100);}
      
    });
    
  
    return () => {
      // Cleanup on unmount
      socket.off("New_Message");
      socket.off("getOnlineUsers");
      
    };
  }, [selector.userid]); // Only runs when userid changes
  

  // ✅ Update Messages when user changes
  useEffect(() => {
    setallmsg(userstate.Messages || []);
    scrollToBottom();
  }, [userstate.Messages]);

  // ✅ Auto-Scroll Function
  const scrollToBottom = () => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  // ✅ Handle Sending Message
  const handleform = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const msg = form.get("msg");

    if (msg.trim() !== "") {
        setisLoading(true);

        const res = await sendmsg(userstate.user._id, msg);
        setallmsg((prev) => [
            ...prev,
            { senderid: selector.userid, messageContent: msg, _id: Date.now() },
        ]);

        setisLoading(false);

        const stack = await getRecentUsers(userstate.user._id);
        dispatch(setRecentUsers({ recentUsers: stack.recentUsers }));

        socket.emit("send_message", {
            senderId: selector.userid,
            receiverId: userstate.user._id,
            messageContent: msg,
        });
    }

    e.target.reset();
    e.target.querySelector("input[name='msg']").focus(); // 👈 Focus back to the input

    scrollToBottom();
};



  return (
   <div className="w-full bg-[#1a2228] h-full">
    <div className={`w-full h-full ${iswatchparty?'hidden':'block'}`}>
      {(!isclicked || width > 900) && (
        <div className="msg h-full bg-amber-300 w-full flex overflow-x-hidden justify-center items-center flex-col">
          {/* ✅ Header Section */}
          {!userstate.clicked ? (
            <div className="lg:text-xl relative top-[-40px] text-lg font-bold text-white text-center">
              Start Chat Now...💬
            </div>
          ) : (
            <div className="w-full h-full">
              <nav className="w-full h-[9vh] bg-[#141b20] text-white text-xl flex items-center justify-start p-3">
                {width < 800 && (
                  <div className="min-w-[15%] ml-2 flex overflow-hidden">
                    <ArrowBigLeftDashIcon
                      className="w-8 h-8 rounded-2xl cursor-pointer"
                      onClick={() => setisclicked(true)}
                    />
                  </div>
                )}
                {userstate.user.ProfilePic ? (
                  <img
                    src={userstate.user.ProfilePic}
                    alt="Profile"
                    className="lg:w-12 lg:h-12 h-14 w-14 rounded-full bg-blue-200 mr-5"
                  />
                ) : (
                  ""
                )}
                <div className="w-full ">
                  <span className="text-sm">{userstate.user.fullname}</span>
                  {onlineusrs.current.includes(userstate.user._id) ? (
                    <span className="text-xs text-green-400 ml-2">🟢</span>
                  ) : (
                    <span className="text-xs text-red-400 ml-2">🔴</span>
                  )}
                </div>
                <div className="w-full p-2 ml-2 h-full flex justify-end">
                {onlineusrs.current?.includes(userstate.user._id) &&<div className="  text-black  cursor-pointer flex flex-col items-center justify-center" onClick={()=>setiswatchparty(true)}>
                  <img src={vdoplr} alt="watchparty"  className=" w-8 h-8 rounded-[50%]"/>
                 <span className="text-l text-white font-bold">Watch-2Gether</span>
                  </div>}

                </div>
              </nav>
            </div>
          )}

          {/* ✅ Message Container */}
        {<div className="msgcontent flex flex-col sm:min-h-[69vh] lg:min-h-[55vh] w-full p-1 overflow-y-auto">
            {allmsg?.length > 0 &&
              allmsg?.map((msg) => (
                <div className="w-full h-full " key={msg._id}>
                  <div
                    className={`w-full  p-1 flex items-center mt-2  text-l ${
                      selector.userid === msg.senderid
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                   { <div
                      className={` p-3 text-white flex flex-col justify-center items-center rounded-[20%] ${
                        selector.userid === msg.senderid
                          ? "bg-blue-400"
                          : "bg-green-400"
                      }`}
                    >
                      {msg.messageContent}
                    </div>}
                  </div>
                </div>
              ))}     
              
               <div ref={ref}></div>
          </div>}


          {userstate.clicked && (
            <div className="w-full  p-2">
              <form className="w-full flex" onSubmit={handleform}>
                <input
                  type="text"
                  className="min-w-[80%] h-9 p-2 rounded-l mr-1 text-white bg-[#2A3942] outline-none border-none"
                  placeholder="Message"
                  name="msg"
                  autoComplete="off"
                  onChange={() => socket.emit("user_typing", { senderId: selector.userid })}
                />
                  <button
              className="ml-2 w-40 h-9 lg:mb-0 sm:mb-4 text-white flex items-center justify-center bg-blue-500 rounded-l"
              type="submit"
            >
              {isLoading ? <Loader /> : <Send />}
            </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
    
 
      
      </div>
    
  );
}

export default Message;
