import React, { useRef, useState, useEffect } from 'react';
import { PlayIcon, PauseIcon, VolumeIcon, FullscreenIcon, ArrowLeftIcon, ShieldIcon } from './Icons';

export default function VideoPlayer({ item, episode, onBack }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [videoError, setVideoError] = useState(false);

  const activeVideoUrl = episode ? episode.videoUrl : (item ? item.videoUrl : '');
  const title = episode ? `${item?.title}: S${episode.season} E${episode.episodeNumber} - ${episode.title}` : item?.title;

  // Toggle play/pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Seek time
  const handleProgressChange = (e) => {
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Volume change
  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
    setIsMuted(val === 0);
  };

  // Toggle mute
  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextState = !isMuted;
    setIsMuted(nextState);
    videoRef.current.muted = nextState;
  };

  // Playback speed
  const handleSpeedChange = (e) => {
    const speed = parseFloat(e.target.value);
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Format time MM:SS
  const formatTime = (secs) => {
    if (isNaN(secs) || secs === Infinity) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Hide controls on idle in fullscreen
  useEffect(() => {
    let timer;
    const resetTimer = () => {
      setShowControls(true);
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 3500);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [isPlaying]);

  return (
    <div className="player-page" role="region" aria-label="Video Player">
      {/* Top Header Bar */}
      <div className="player-header">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onBack}
          aria-label="Back to details"
        >
          <ArrowLeftIcon size={18} /> Back
        </button>

        <div style={{ textAlign: 'center', maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <h2 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{title}</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ShieldIcon size={13} /> Authorized Stream
          </span>
        </div>

        <div style={{ width: '80px' }}></div>
      </div>

      {/* Video Viewport Container */}
      <div className="player-container">
        <div
          ref={containerRef}
          className="custom-video-wrapper"
          onMouseEnter={() => setShowControls(true)}
          style={{ cursor: showControls ? 'default' : 'none' }}
        >
          {/* HTML5 Native Video Tag */}
          <video
            ref={videoRef}
            src={activeVideoUrl}
            className="video-element"
            poster={item?.backdrop || item?.poster}
            onClick={togglePlay}
            onTimeUpdate={() => {
              if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
            }}
            onLoadedMetadata={() => {
              if (videoRef.current) setDuration(videoRef.current.duration);
            }}
            onEnded={() => setIsPlaying(false)}
            onError={() => setVideoError(true)}
            playsInline
          />

          {/* Video Error or Missing Video Fallback Notice */}
          {videoError && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(9, 10, 13, 0.95)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                textAlign: 'center',
                zIndex: 5,
              }}
            >
              <h3 style={{ color: 'var(--accent-gold)', marginBottom: '12px' }}>Authorized Video Stream</h3>
              <p style={{ maxWidth: '500px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                This title is registered under the owner&apos;s distribution license. For custom production deployments, connect your self-hosted HLS/DASH/MP4 bucket in the Admin Panel.
              </p>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setVideoError(false);
                  if (videoRef.current) {
                    videoRef.current.src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
                    videoRef.current.play();
                  }
                }}
              >
                Load Open-Source Stream Sample
              </button>
            </div>
          )}

          {/* Custom Overlay Controls */}
          <div
            className="video-controls"
            style={{
              opacity: showControls || !isPlaying ? 1 : 0,
              pointerEvents: showControls || !isPlaying ? 'auto' : 'none',
            }}
          >
            {/* Seek Bar */}
            <div
              className="progress-container"
              onClick={handleProgressChange}
              role="slider"
              aria-label="Video timeline scrubber"
              aria-valuemin="0"
              aria-valuemax={duration || 100}
              aria-valuenow={currentTime}
            >
              <div
                className="progress-bar"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>

            {/* Controls Button Row */}
            <div className="controls-row">
              <div className="controls-left">
                {/* Play / Pause */}
                <button
                  type="button"
                  className="icon-btn"
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause" : "Play"}
                  style={{ width: '40px', height: '40px', backgroundColor: 'var(--accent-gold)', color: '#090A0D' }}
                >
                  {isPlaying ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
                </button>

                {/* Volume & Mute */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={toggleMute}
                    aria-label={isMuted ? "Unmute" : "Mute"}
                    style={{ width: '36px', height: '36px' }}
                  >
                    <VolumeIcon size={18} muted={isMuted} />
                  </button>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    style={{
                      width: '75px',
                      accentColor: 'var(--accent-gold)',
                      cursor: 'pointer',
                    }}
                    aria-label="Volume slider"
                  />
                </div>

                {/* Time Display */}
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="controls-right">
                {/* Playback Speed Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <label htmlFor="speed-select" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Speed:
                  </label>
                  <select
                    id="speed-select"
                    value={playbackSpeed}
                    onChange={handleSpeedChange}
                    className="select-input"
                    style={{ padding: '4px 8px', minHeight: '32px', fontSize: '0.82rem' }}
                    aria-label="Playback speed selection"
                  >
                    <option value="0.5">0.5x</option>
                    <option value="1">1.0x (Normal)</option>
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2.0x</option>
                  </select>
                </div>

                {/* Fullscreen Toggle */}
                <button
                  type="button"
                  className="icon-btn"
                  onClick={toggleFullscreen}
                  aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                  style={{ width: '36px', height: '36px' }}
                >
                  <FullscreenIcon size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
