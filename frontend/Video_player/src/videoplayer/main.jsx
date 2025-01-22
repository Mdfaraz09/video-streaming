import React from "react";
import VideoPlayer from "./hlsplayer";

const Main = () => {
  return (
    <div>
      <h1>Custom Video Player</h1>
      <VideoPlayer 
        src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
        subtitleSrc="/subtitles-en.vtt"  // Local subtitle file
      />
    </div>
  );
};

export default Main;

