import React, { useEffect, useRef, useState } from "react";
import "./message.css";
import { useDispatch, useSelector } from "react-redux";
import { ArrowBigLeftDashIcon, Send } from "lucide-react";
import Loader from "./Loader";
import { sendmsg } from "@/Controllers/MessageController";
import { getRecentUsers } from "@/Controllers/getRecentUser";
import { setRecentUsers } from "@/store/userslice";
import sound from '../assets/notifysound.mp3'

function Messagesmall({ socket }) {
  const ref = useRef();
  const userstate = useSelector((state) => state.UserClickedSlice.user);
  const [allmsg, setallmsg] = useState([]);
  const [OnlineUsers, setOnlineUsers] = useState();
  const [isLoading, setisLoading] = useState(false);
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.user);
  const grabuser = useRef()

  useEffect(() => {
    grabuser.current = userstate
    grabuser.current = userstate.user?._id
    console.log(grabuser.current);

  }, [userstate])



  useEffect(() => {
    scrollToBottom();
  }, [allmsg]);

  useEffect(() => {
    if (!socket) return;
    socket.on("New_Message", (msg) => {
      console.log(grabuser.current);
      console.log(msg.senderid.toString());
      if (msg.senderid.toString() == grabuser.current) {
        let audio = new Audio(sound);
        audio.play();
        console.log(msg);
        setallmsg((prev) => [...prev, msg]);
        setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth" }), 100);
      }

    });

    socket.on("getOnlineUsers", (Users) => {
      setOnlineUsers(Users);
    });
  }, [socket]);

  useEffect(() => {
    setallmsg(userstate.Messages || []);
    scrollToBottom();
  }, [userstate.Messages]);

  const scrollToBottom = () => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  const handleform = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const msg = form.get("msg");

    if (msg.trim() !== "") {
      setisLoading(true);
      await sendmsg(userstate?.user?._id, msg);
      setallmsg((prev) => [
        ...prev,
        { senderid: selector.userid, messageContent: msg, _id: Date.now() },
      ]);

      const stack = await getRecentUsers(userstate.user._id);
      dispatch(setRecentUsers({ recentUsers: stack.recentUsers }));


      setisLoading(false);
    }
    e.target.reset();
    scrollToBottom();
  };

  return (
    <div className="h-[55vh]  lg:w-[33vw]   ">
      <div className="chat-container h-fit lg:h-full w-[35vw] min-w-[300px] max-w-[800px] bg-[#29373d] text-white flex flex-col">
        {/* Header */}
        <div className="flex items-center  p-2">
          {userstate?.user?.ProfilePic && (
            <img
              src={userstate?.user?.ProfilePic || ''}
              alt="Profile"
              className="w-7 h-7 rounded-full bg-blue-200 mr-3"
            />
          )}
          <div className="flex flex-row justify-center items-center ">
            <span className="text-lg font-semibold ">{userstate.user?.fullname}</span>
            {OnlineUsers?.includes(userstate?.user?._id) ? (
              <span className=" text-green-400 ml-2 text-sm">🟢 Online</span>
            ) : (
              <span className="text-xs text-red-400">🔴 Offline</span>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="msgcontent flex flex-col max-h-[55vh] lg:h-[46vh] h-[27vh]  sm:h-[25vh] overflow-x-hidden p-1 overflow-y-auto">
          {allmsg?.length > 0 &&
            allmsg?.map((msg) => (
              <div className="w-full h-full " key={msg._id}>
                <div
                  className={`w-full  p-1 flex items-center mt-2  text-l ${selector.userid === msg.senderid
                      ? "justify-end"
                      : "justify-start"
                    }`}
                >
                  <div
                    className={` p-3 text-white flex flex-col justify-center items-center rounded-[20%] ${selector.userid === msg.senderid
                        ? "bg-blue-400"
                        : "bg-green-400"
                      }`}
                  >
                    {msg.messageContent}
                  </div>
                </div>
              </div>
            ))}


          <div ref={ref}></div>
        </div>

        {/* Input Field */}
        <div className="p-2 bg-[#2b3237] h-fit flex-row ">
          <form className="flex" onSubmit={handleform}>
            <input
              type="text"
              className="flex-1 p-2 rounded-xl text-white bg-[#2A3942] outline-none border-none"
              placeholder="Message"
              name="msg"
              autoComplete="off"
            />
            <button
              className="ml-2 w-10 h-10 flex items-center justify-center bg-blue-500 rounded-xl"
              type="submit"
            >
              {isLoading ? <Loader /> : <Send />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Messagesmall;