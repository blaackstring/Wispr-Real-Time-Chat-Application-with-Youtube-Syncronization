import React, { useEffect, useRef } from "react";
import { playorpaused, seeked, sendurl } from "@/Controllers/watchPartyController.js";
import { useSelector } from "react-redux";
import "./watchparty.css";
import Message from "./Message";
import Messagesmall from "./Messagesmall";

function WatchParty({ setiswatchparty, socket, OnlineUsers }) {
  const urlRef = useRef("");
  const videoIdRef = useRef("");
  const isPlayingRef = useRef(true);
  const idRef = useRef(null);
  const inputRef = useRef();
  const playerRef = useRef(null);
  const isExternalSeek = useRef(false);
  const isSyncingPlayback = useRef(false);
  const isSeeking = useRef(false);

  const selector = useSelector((state) => state.UserClickedSlice.user);

  useEffect(() => {
    idRef.current = selector?.user?._id;
  }, [selector]);

  useEffect(() => {
    if (!window.YT) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);
      window.onYouTubeIframeAPIReady = () => console.log("YouTube API Ready");
    }
  }, []);

  useEffect(() => {
    socket.on("play_pause", handlePlayPauseSync);
    socket.on("seek", handleSeekSync);
    socket.on("send_url", handleUrlSync);

    return () => {
      socket.off("play_pause", handlePlayPauseSync);
      socket.off("seek", handleSeekSync);
      socket.off("send_url", handleUrlSync);
    };
  }, [socket]);

  const extractVideoId = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : "";
  };

  const handleInputChange = (e) => (urlRef.current = e.target.value);

  const handleEvent = async (isPlaying) => {
    if (idRef.current) await playorpaused(isPlaying, idRef.current);
  };

  const handleForm = async (e) => {
    e.preventDefault();
    if (!urlRef.current) return;

    try {
      const videoId = extractVideoId(urlRef.current);
      videoIdRef.current = videoId;
      await sendurl(urlRef.current, idRef.current);
      createPlayer(videoId);
      inputRef.current.value = "";
      urlRef.current = "";
    } catch (error) {
      console.error("Error sending URL", error);
    }
  };

  const createPlayer = (videoId) => {
    if (!window.YT?.Player) return console.error("YouTube API not loaded yet!");

    if (playerRef.current) {
      playerRef.current.loadVideoById(videoId);
    } else {
      playerRef.current = new window.YT.Player("youtube-player", {
        videoId,
        playerVars: { autoplay: 1, controls: 1 },
        events: {
          onReady: (event) => event.target.playVideo(),
          onStateChange: handlePlayerStateChange,
        },
      });
    }
  };

  const handlePlayerStateChange = async (event) => {
    if (!idRef.current) return;

    const { BUFFERING, PLAYING, PAUSED } = window.YT.PlayerState;

    if (event.data === BUFFERING && !isExternalSeek.current) {
      const seekTime = playerRef.current.getCurrentTime();
      isSeeking.current = true;
      await seeked(seekTime, idRef.current);
      setTimeout(() => (isSeeking.current = false), 700);
    }

    if (event.data === PLAYING && !isSyncingPlayback.current) await handleEvent(true);
    if (event.data === PAUSED && !isSyncingPlayback.current) await handleEvent(false);
  };

  const handlePlayPauseSync = (isPlaying) => {
    isPlayingRef.current = isPlaying;
    togglePlayPause();
  };

  const handleSeekSync = (time) => {
    if (!idRef.current) return;
    isExternalSeek.current = true;
    isSyncingPlayback.current = true;

    playerRef.current.seekTo(time, true);

    setTimeout(() => {
      playerRef.current.playVideo();
      isExternalSeek.current = false;
      isSyncingPlayback.current = false;
    }, 700);
  };

  const handleUrlSync = (url) => {
    const videoId = extractVideoId(url);
    videoIdRef.current = videoId;
    createPlayer(videoId);
  };

  const togglePlayPause = () => {
    if (playerRef.current) {
      isPlayingRef.current ? playerRef.current.playVideo() : playerRef.current.pauseVideo();
    }
  };

  const handleClose = () => {
    console.log("Closing Watch Party");
    setiswatchparty(false);

    if (playerRef.current) {
      playerRef.current.stopVideo();
      playerRef.current.loadVideoById("");
    }
  };

  return (
    <div className="wdiv min-h-screen w-screen flex justify-center items-center overflow-hidden">
      <nav>
        <div className="absolute top-0 left-10 flex items-center justify-center w-[80vw]">
          <h1 className="text-[#E50914] text-4xl font-extrabold">Watch-Party</h1>
        </div>
        <button
          onClick={handleClose}
          className="absolute top-2 right-4 text-white text-2xl bg-gray-800 p-2 rounded-full"
        >
          ✖
        </button>
      </nav>

      <div className="flex w-screen-[85%] flex-col items-center lg:flex-row p-4">
        <div className="left mb-5">
          <form onSubmit={handleForm} className="flex w-full space-x-3">
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter YouTube URL"
              className="w-full p-2 rounded-lg bg-black/50 text-white"
              onChange={handleInputChange}
            />
            <button type="submit" className="bg-black text-white px-4 py-2 rounded-lg">Search</button>
          </form>
          <div id="youtube-player" className="max-w-[800px] w-full h-[405px] rounded-lg"></div>
        </div>
        <Messagesmall socket={socket} />
      </div>
    </div>
  );
}

export default WatchParty;
