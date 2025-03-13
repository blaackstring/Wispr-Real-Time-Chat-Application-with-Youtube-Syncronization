import React, { useEffect, useState, useRef } from "react";
import { playorpaused, seeked, sendurl } from "@/Controllers/watchPartyController.js";
import { useSelector } from "react-redux";
import './watchparty.css'
import Message from "./Message";
import Messagesmall from "./Messagesmall";

function WatchParty({ setiswatchparty, socket, OnlineUsers }) {
  const [url, setUrl] = useState("");
  const [senderurldataid, setSenderUrlDataId] = useState("");
  const [isplaying, setisplaying] = useState(true);
  const [id, setId] = useState(null);
  const idRef = useRef(null);
  const inputref=useRef()
  const playerRef = useRef(null);
  const selector = useSelector((state) => state.UserClickedSlice.user);
  

  useEffect(() => {
    if (selector?.user?._id) {
      setId(selector.user._id);
      idRef.current = selector.user._id;
    }
  }, [selector]);

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
   

    socket.on("play_pause", syncVideoState);
    socket.on("seek", syncSeek);
    socket.on("send_url", syncUrl);

    return () => {
      socket.off("play_pause", syncVideoState);
      socket.off("seek", syncSeek);
      socket.off("send_url", syncUrl);
    };
  }, [socket]);
  const syncVideoState = (data) => {
    console.log("Syncing play/pause:", data);
    setisplaying(data);
  };

  const syncSeek = (data) => {
    console.log("Received seek point:", data);
    if (data && playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
  
      // Prevent repeated seeking at the same position
    
        playerRef.current.seekTo(data, true);
        playerRef.current.playVideo();
  
        // Update last seek time
    
      }
    }
  

  const syncUrl = (data) => {
    console.log("Syncing URL:", data);
    const videoId = extractVideoId(data);
    setSenderUrlDataId(videoId);
    createPlayer(videoId);
  };

  const extractVideoId = (url) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : "";
  };

  const handleInputChange = (e) => {
    setUrl(e.target.value);
  };

  const handleEvent = async (isPlaying) => {
    if (!idRef.current) return;
    await playorpaused(isPlaying, idRef.current);
  };

  const handleForm = async (e) => {
    e.preventDefault();
    if (!url) return;

    try {
      const res = await sendurl(url, idRef.current);
      const videoId = extractVideoId(url);
      setSenderUrlDataId(videoId);
      setUrl(null)
          inputref.current.value = '';
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

    if (playerRef.current) {
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
            if (!isplaying) {
              event.target.pauseVideo();
            } else {
              event.target.playVideo();
            }
          },
          onStateChange: async (event) => {
            if (!idRef.current) return;
            if (event.data === YT.PlayerState.BUFFERING) {
              let seekTime = playerRef.current.getCurrentTime();
              seeked(seekTime, idRef.current);
            }

            if (event.data === 1) {
              socket.emit("video_state", { state: "playing", videoId });
              await handleEvent(true);
            } else if (event.data === 2) {
              socket.emit("video_state", { state: "paused", videoId });
              await handleEvent(false);
            } else if (event.data === 0) {
              socket.emit("video_state", { state: "ended", videoId });
            }
          },
        },
      });
    }
  };

  useEffect(() => {
    if (playerRef.current) {
      if (isplaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isplaying]);

  const handleClose = () => {
    console.log("Closing Watch Party");
    inputref.current.value = '';
    setSenderUrlDataId("");
    setisplaying(true);
    setiswatchparty(false);

    if (playerRef.current) {
      playerRef.current.stopVideo(); // Stops the video
      playerRef.current.loadVideoById(""); // Clears the loaded video but keeps the player
    }
  };

  return (
    <div className="wdiv min-h-screen w-[100vw]  flex justify-center items-center overflow-hidden sm:h-[100vh] sm:p-6 md:p-8 lg:p-5 relative">
     <nav>
      <div className="w-[80vw] absolute top-0 left-10 flex items-center justify-center ">
        <div className="text-[#E50914] text-[40px] lg:text-5xl font-extrabold mt-1 text-center">Watch-Party</div>
      </div>
     <button
        onClick={handleClose}
        className="absolute top-1 right-4 text-white text-3xl font-bold cursor-pointer bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition"
      >
        ✖
      </button>
     </nav>

      <div className="flex w-screen-[85%] h-full flex-col items-center justify-items-center lg:flex-row p-4 overflow-hidden">
        <div className="left mb-5 ">
        <div className="w-full  mt-6 flex flex-col items-center space-y-4 px-4 sm:px-6 md:px-8">
        <form onSubmit={handleForm} className="w-full flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <input
          ref={inputref}
            type="text"
            placeholder="Enter YouTube URL"
            className="w-full p-2 rounded-lg border text-white bg-black/50 border-gray-400 focus:outline-none focus:border-blue-500"
            onChange={handleInputChange}
          />
          <button type="submit" className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
            Search
          </button>
        </form>

        <div className=" max-w-[860px] lg:w-[890px] h-[250px] w-[300px] md:w-[450px] sm:h-[200px]  sm:w-[300px] md:h-[280px] lg:h-[500px] rounded-lg shadow-lg">
          <div id="youtube-player" className="w-full h-full"></div>
        </div>
      </div>
        </div>
        <Messagesmall socket={socket} />
      </div>


    </div>
  );
}

export default WatchParty;
