


import React, { useRef, useEffect, useState } from "react";
import Hls from "hls.js";
import "./videoPlayer.css";

const VideoPlayer = ({ src, subtitleSrc }) => {
  const videoRef = useRef(null);
  const [hlsInstance, setHlsInstance] = useState(null);
  const [availableQualities, setAvailableQualities] = useState([]);
  const [currentQuality, setCurrentQuality] = useState("auto");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPip, setIsPip] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;

    if (Hls.isSupported() && src.endsWith(".m3u8")) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      setHlsInstance(hls);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const levels = hls.levels.map((level, index) => ({
          quality: level.height,
          index: index,
        }));
        setAvailableQualities([{ quality: "auto", index: -1 }, ...levels]);
      });
    } else {
      video.src = src; // Fallback for MP4
    }

    video.addEventListener("play", () => setIsPlaying(true));
    video.addEventListener("pause", () => setIsPlaying(false));
    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      if (hlsInstance) hlsInstance.destroy();
      video.removeEventListener("play", () => setIsPlaying(true));
      video.removeEventListener("pause", () => setIsPlaying(false));
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [src]);

  const handleQualityChange = (event) => {
    const selectedIndex = parseInt(event.target.value, 10);
    setCurrentQuality(selectedIndex);

    if (hlsInstance) {
      if (selectedIndex === -1) {
        hlsInstance.currentLevel = -1; // Auto quality
      } else {
        hlsInstance.currentLevel = selectedIndex;
      }
    }
  };

  const toggleSubtitles = () => {
    const video = videoRef.current;
    const tracks = video.textTracks;
    if (tracks) {
      for (let i = 0; i < tracks.length; i++) {
        tracks[i].mode = showSubtitles ? "hidden" : "showing";
      }
      setShowSubtitles(!showSubtitles);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      const progressValue = (video.currentTime / video.duration) * 100;
      setProgress(progressValue || 0);
    }
  };

  const handleProgressChange = (e) => {
    const video = videoRef.current;
    const newTime = (e.target.value / 100) * video.duration;
    video.currentTime = newTime;
    setProgress(e.target.value);
  };

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!document.fullscreenElement) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const togglePip = async () => {
    try {
      if (!document.pictureInPictureElement) {
        await videoRef.current.requestPictureInPicture();
        setIsPip(true);
      } else {
        await document.exitPictureInPicture();
        setIsPip(false);
      }
    } catch (error) {
      console.error("Picture-in-Picture Error:", error);
    }
  };

  return (
    <div className="video-container">
      <video ref={videoRef} controls={false}>
        <track
          src={subtitleSrc}
          kind="subtitles"
          srcLang="en"
          label="English"
          default
        />
      </video>

      <div>
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={progress}
          onChange={handleProgressChange}
          className="progress-bar"
        />
      </div>

      <div className="controls">
        <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
        />
        <button onClick={toggleFullscreen}>
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </button>
        <button onClick={togglePip}>
          {isPip ? "Exit PiP" : "Picture-in-Picture"}
        </button>
        <button onClick={toggleSubtitles}>
          {showSubtitles ? "Hide Subtitles" : "Show Subtitles"}
        </button>
        <select
          value={currentQuality}
          onChange={handleQualityChange}
          className="quality-selector"
        >
          {availableQualities.map((quality) => (
            <option key={quality.index} value={quality.index}>
              {quality.quality === "auto" ? "Auto" : `${quality.quality}p`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default VideoPlayer;

