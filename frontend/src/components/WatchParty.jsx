import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import './watchparty.css';
import Messagesmall from "./Messagesmall";
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function WatchParty({ setiswatchparty, socket, OnlineUsers }) {
  const urlRef = useRef("");
  const senderUrlDataIdRef = useRef("");
  const isPlayingRef = useRef(true);
  const idRef = useRef(null);
  const inputRef = useRef();
  const playerRef = useRef(null);
  const selector = useSelector((state) => state.UserClickedSlice.user);
  const user= useSelector((state) => state.user);
  const userRef=useRef()
  const isExternalSeek = useRef(false);
  const syncplaying = useRef(false);
  const ReciverSocketId=useRef()

  useEffect(() => {
    if (selector?.user?._id) {
      idRef.current = selector.user._id;
    }
  }, [selector]);


  useEffect(() => {
    if (user?.userid) {
      userRef.current = user.userid
    }
  }, [user]);
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      document.body.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = () => {
      console.log("YouTube API Ready");
    };
  }, []);

  useEffect(() => {
    const syncVideoState = (data) => {
      console.log("Syncing play/pause:", data);
      isPlayingRef.current = data
      togglePlayPause();
    };


    const syncSeek = (data) => {
      console.log(data,"from seek");
      
      if (!idRef.current) return;
      isExternalSeek.current = true;
      
      syncplaying.current=true;
      playerRef.current.seekTo(data,true);
      setTimeout(() => {
          isExternalSeek.current = false;
          syncplaying.current=false;
          if (!isPlayingRef.current) playerRef.current.playVideo();
      }, 1000);
  };

    const syncUrl = (data) =>{
       { 
         const videoId = extractVideoId(data);
         senderUrlDataIdRef.current = videoId;
         console.log("videoId",videoId);
         
         createPlayer(videoId);
   };

  }
    socket.on("isUserBusy", (data) => {
      console.log("Received 'isUserBusy':",data);
      if (data) {
        toast('😒User is Busy!', {
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
    });
    socket.on("update_state", syncVideoState);
    socket.on("update_seek", syncSeek);
    socket.on("receive_url", syncUrl);

    return () => {
      socket.off("update_state");
      socket.off("update_seek");
      socket.off("receive_url");
  };
  
  }, [socket,selector]);

  const extractVideoId = (url) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : "";
};

  const handleInputChange = (e) => {
    urlRef.current = e.target.value;
  };


  const handleForm = async (e) => {
    e.preventDefault();
    if (!urlRef.current) return;
    try {
      console.log(urlRef.current);
      const vdourl=urlRef.current
      socket.emit("send_url", {
        userId: userRef.current,
        targetId: idRef.current,
        vdourl });
      const videoId = extractVideoId(urlRef.current);
      senderUrlDataIdRef.current = videoId;
      urlRef.current = "";
      inputRef.current.value = "";
      createPlayer(videoId);
    } catch (error) {
      console.error("Error sending URL", error);
    }
  };

  const createPlayer = (videoId) => {
    if (!window.YT || !window.YT.Player) {
      console.error("YouTube API not loaded yet!");
      return;
    }

    if (playerRef.current!=null) {
      playerRef.current.loadVideoById(videoId);
    } else {
      playerRef.current = new window.YT.Player("youtube-player", {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 1,
        },
        events: {
          onReady: (event) => {
            console.log("Player Ready");
             event.target.playVideo();
          },
          onStateChange: (event) => {
            if (!idRef.current) return;
            if (event.data === YT.PlayerState.BUFFERING) {
              if (isExternalSeek.current) return;
              let seekTime = playerRef.current.getCurrentTime();
              socket.emit("seek", { userId: userRef.current,targetId:idRef.current, timestamp: seekTime });
               
            }

            if (event.data === 1) {
              if (event.data !== YT.PlayerState.BUFFERING&&syncplaying!==true)
                socket.emit("play_pause", {  userId: userRef.current,targetId:idRef.current, state:true });
            } else if (event.data === 2) {
              if (event.data !== YT.PlayerState.BUFFERING&&syncplaying!==true&&isPlayingRef.current==true)
                socket.emit("play_pause", {  userId: userRef.current,targetId:idRef.current, state:false });
            
            } 
          },
        },
      });
    }
  };

  const togglePlayPause = () => {
    if (playerRef.current) {
      if (isPlayingRef.current) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  };

  const handleClose = () => {
    console.log("Closing Watch Party");
    inputRef.current.value = "";
    senderUrlDataIdRef.current = "";
    isPlayingRef.current = true;
    setiswatchparty(false);

    if (playerRef.current) {
      playerRef.current.stopVideo();
      playerRef.current.loadVideoById("");
    }
  };

  return (
    <div className="wdiv min-h-[100vh] w-[100vw]  overflow-hidden sm:h-[100vh] relative ">
      <nav className="w-[95vw] h-10 lg:h-14 flex pl-3 pt-2 items-center">
        <div className="w-full  flex justify-start items-center mt-2">
          <div className="text-[#E50914] text-[30px] lg:text-4xl font-extrabold mb-3 shadow-">
            Watch-2Gether
          </div>
        </div>
        <button
          onClick={handleClose}
          className="absolute top-1 right-3 text-white text-xl font-bold cursor-pointer bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition"
        >
          ✖
        </button>
      </nav>
      <div className="w-full bloc mt-7 mb-5 ">
        <form
              onSubmit={handleForm}
              className=" flex flex-row sm:flex-row  justify-center items-center w-full "
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Enter YouTube URL"
                className=" p-2 rounded-lg border lg:w-[20vw] text-white bg-black/50 border-gray-400 focus:outline-none focus:border-blue-500"
                onChange={handleInputChange}
              />
              <button
                type="submit"
                className="bg-black w-20 m-2  text-white  p-2 rounded-lg hover:bg-gray-800 transition"
              >
                Search
              </button>
            </form>
        </div>
      <div className="flex flex-1 mt-5 flex-col justify-around items-end  overflow-hidden">

        

      <div className=" h-full w-full justify-center mt-5 flex lg:flex-row items-center flex-col">


      <div className="left  ">
            <div className="max-w-[800px] lg:w-[700px] h-[200px]  w-[345px] md:w-[450px] sm:h-[200px] sm:w-[350px] md:h-[280px] lg:h-[405px] rounded-lg shadow-lg">
              <div id="youtube-player" className="w-full h-full"></div>
          </div>
        </div>
        <div className="right lg:mt-0 mt-4 lg:ml-4">
        <Messagesmall socket={socket} />
        </div>




      </div>
      </div>
    </div>
  );
}

export default WatchParty;
