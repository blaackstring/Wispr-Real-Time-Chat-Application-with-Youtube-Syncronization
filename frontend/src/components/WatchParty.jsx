import React, { useEffect, useRef } from "react";
import { playorpaused, seeked, sendurl } from "@/Controllers/watchPartyController.js";
import { useSelector } from "react-redux";
import './watchparty.css';
import Message from "./Message";
import Messagesmall from "./Messagesmall";

function WatchParty({ setiswatchparty, socket, OnlineUsers }) {
  const urlRef = useRef("");
  const senderUrlDataIdRef = useRef("");
  const isPlayingRef = useRef(true);
  const idRef = useRef(null);
  const inputRef = useRef();
  const playerRef = useRef(null);
  const selector = useSelector((state) => state.UserClickedSlice.user);
  const isExternalSeek = useRef(false);
  const syncplaying = useRef(false);

  useEffect(() => {
    if (selector?.user?._id) {
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
    const syncVideoState = (data) => {
      console.log("Syncing play/pause:", data);
      isPlayingRef.current = data;
      togglePlayPause();
    };

    const syncSeek = (data) => {
      if (!idRef.current) return;
      isExternalSeek.current = true;
      syncplaying.current=true;
      // Mark as external seek
     
      playerRef.current.seekTo(data,false);
      
      
      setTimeout(() => {
      
          isExternalSeek.current = false;
          syncplaying.current=false;
          playerRef.current.playVideo()
      }, 1000);
  };
  
    const syncUrl = (data) => {
      console.log("Syncing URL:", data);
      const videoId = extractVideoId(data);
      senderUrlDataIdRef.current = videoId;
      createPlayer(videoId);
    };

    socket.on("play_pause", syncVideoState);
    socket.on("seek", syncSeek);
    socket.on("send_url", syncUrl);

    return () => {
      socket.off("play_pause", syncVideoState);
      socket.off("seek", syncSeek);
      socket.off("send_url", syncUrl);
    };
  }, [socket]);

  const extractVideoId = (url) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : "";
  };

  const handleInputChange = (e) => {
    urlRef.current = e.target.value;
  };

  const handleEvent = async (isPlaying) => {
    if (!idRef.current) return;
    await playorpaused(isPlaying, idRef.current);
  };

  const handleForm = async (e) => {
    e.preventDefault();
    if (!urlRef.current) return;

    try {
      const res = await sendurl(urlRef.current, idRef.current);
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
             event.target.playVideo();
          },
          onStateChange: async (event) => {
            if (!idRef.current) return;
            if (event.data === YT.PlayerState.BUFFERING) {
              if (isExternalSeek.current) return;
              let seekTime = playerRef.current.getCurrentTime();
                await  seeked(seekTime, idRef.current);
               
            }

            if (event.data === 1) {
              if (event.data !== YT.PlayerState.BUFFERING&&syncplaying!==true)
                  await handleEvent(true);
            } else if (event.data === 2) {
              if (event.data !== YT.PlayerState.BUFFERING&&syncplaying!==true&&isPlayingRef.current==true)
              await handleEvent(false);

            
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
    <div className="wdiv min-h-[100vh] w-[100vw] flex justify-center items-center overflow-hidden sm:h-[100vh] sm:p-6 md:p-8 lg:p-10 relative">
      <nav>
        <div className="w-[80vw] absolute top-0 left-10 flex items-center justify-center">
          <div className="text-[#E50914] text-[30px] lg:text-4xl font-extrabold mb-3">
            Watch-Party
          </div>
        </div>
        <button
          onClick={handleClose}
          className="absolute top-2 right-4 text-white text-2xl font-bold cursor-pointer bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition"
        >
          ✖
        </button>
      </nav>

      <div className="flex w-screen-[85%] h-full flex-col items-center justify-items-center lg:flex-row p-4 overflow-hidden">
        <div className="left mb-5">
          <div className="w-full mt-6 flex flex-col items-center space-y-4 px-4 sm:px-6 md:px-8">
            <form
              onSubmit={handleForm}
              className="w-full flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3"
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Enter YouTube URL"
                className="w-full p-2 rounded-lg border text-white bg-black/50 border-gray-400 focus:outline-none focus:border-blue-500"
                onChange={handleInputChange}
              />
              <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Search
              </button>
            </form>

            <div className="max-w-[800px] lg:w-[700px] h-[200px] w-[365px] md:w-[450px] sm:h-[200px] sm:w-[350px] md:h-[280px] lg:h-[405px] rounded-lg shadow-lg">
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
