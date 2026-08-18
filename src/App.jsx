import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { MOODS } from './data/moods';
import { fetchMoodPlaylist } from './api/youtube';
import { fetchLiveWeather } from './api/weather';
import { Settings, Play, Pause, SkipForward, SkipBack, ArrowLeft, Dumbbell, Coffee, Brain, CarFront, MoonStar, BookOpenText, Mic, Heart, Volume2, VolumeX, ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import CanvasEffects from './components/CanvasEffects';

const ICON_MAP = {
  Dumbbell, Coffee, Brain, CarFront, MoonStar, BookOpenText, Mic, Heart
};

// 3D Mouse Tilt Hook
function useMouseTilt() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  useEffect(() => {
    // Disable on touch devices to save performance
    if (window.matchMedia("(pointer: coarse)").matches) return;
    
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 15;
      const y = (e.clientY / window.innerHeight - 0.5) * -15;
      setTilt({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  return tilt;
}

const shuffleArray = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return "00:00";
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

function App() {
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [mood, setMood] = useState(null);
  const [activeMoodIndex, setActiveMoodIndex] = useState(Math.floor(MOODS.length / 2));
  const [playlist, setPlaylist] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [theme, setTheme] = useState('default');
  
  // New Player States
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(true);
  
  // Weather State
  const [weatherData, setWeatherData] = useState({ condition: 'clear', timeOfDay: 'night', temp: 25 });

  // Swipe States
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const playerRef = useRef(null);
  const tilt = useMouseTilt();
  const [isMobile, setIsMobile] = useState(false);

  // Weather Fetch & Mobile Check
  useEffect(() => {
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    const initApp = async () => {
      const weather = await fetchLiveWeather();
      setWeatherData(weather);
    };
    initApp();
  }, []);

  // Background play & MediaSession setup
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => {
        setIsPlaying(true);
        if (playerRef.current) playerRef.current.playVideo();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        setIsPlaying(false);
        if (playerRef.current) playerRef.current.pauseVideo();
      });
      navigator.mediaSession.setActionHandler('nexttrack', handleNextTrack);
      navigator.mediaSession.setActionHandler('previoustrack', handlePrevTrack);
    }
  }, [playlist.length]);

  useEffect(() => {
    const currentSong = playlist[currentSongIndex];
    if (currentSong) {
      document.title = `▶ ${currentSong.title}`;
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: currentSong.title,
          artist: 'VibeSync',
          album: `${MOODS.find(m => m.id === mood)?.name} Vibes`,
        });
      }
    } else {
      document.title = 'VibeSync';
    }
  }, [currentSongIndex, playlist, mood]);

  // Progress Polling
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        if (playerRef.current) {
          try {
            const time = playerRef.current.getCurrentTime();
            const dur = playerRef.current.getDuration();
            if (time !== undefined && time !== null) setCurrentTime(time);
            if (dur !== undefined && dur !== null) setDuration(dur);
          } catch (e) {}
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // --- SWIPE LOGIC ---
  const minSwipeDistance = 50;
  
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches ? e.targetTouches[0].clientX : e.clientX);
  };
  
  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches ? e.targetTouches[0].clientX : e.clientX);
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setTouchStart(null);
      setTouchEnd(null);
      return;
    }
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      setActiveMoodIndex(Math.min(MOODS.length - 1, activeMoodIndex + 1));
    }
    if (isRightSwipe) {
      setActiveMoodIndex(Math.max(0, activeMoodIndex - 1));
    }
    
    // Crucial: Clear touch states so it doesn't block clicks later!
    setTouchStart(null);
    setTouchEnd(null);
  };

  const onMouseDown = (e) => {
    setIsDragging(true);
    onTouchStart(e);
  };
  const onMouseMove = (e) => {
    if (isDragging) onTouchMove(e);
  };
  const onMouseUp = () => {
    if (isDragging) {
      onTouchEnd();
      setIsDragging(false);
    }
  };
  const onMouseLeave = () => {
    if (isDragging) {
      onTouchEnd();
      setIsDragging(false);
    }
  };
  // -------------------

  const handleMoodSelect = (selectedMood) => {
    const moodObj = MOODS.find(m => m.id === selectedMood);
    setTheme(moodObj.theme);
    startPlayer(selectedMood);
  };

  const startPlayer = async (selectedMood) => {
    setIsLoadingData(true);
    try {
      let liveSongs = await fetchMoodPlaylist(selectedMood);
      if (isShuffle) {
        liveSongs = shuffleArray(liveSongs);
      }
      setPlaylist(liveSongs);
      setMood(selectedMood);
      setCurrentSongIndex(0);
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(true);
    } catch (error) {
      console.error("Failed to load player", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
    if (!isShuffle && playlist.length > 0) {
      const current = playlist[currentSongIndex];
      const remaining = playlist.filter((_, i) => i !== currentSongIndex);
      const newPlaylist = [current, ...shuffleArray(remaining)];
      setPlaylist(newPlaylist);
      setCurrentSongIndex(0);
    }
  };

  const handleNextTrack = () => {
    if (playlist.length > 0) {
      setCurrentSongIndex(prev => (prev + 1) % playlist.length);
      setIsPlaying(true);
    }
  };

  const handlePrevTrack = () => {
    if (playlist.length > 0) {
      setCurrentSongIndex(prev => (prev - 1 + playlist.length) % playlist.length);
      setIsPlaying(true);
    }
  };

  const goBack = () => {
    if (mood) { 
      setMood(null); 
      setTheme('default'); 
      setIsPlaying(false);
      if (playerRef.current) playerRef.current.pauseVideo();
      return; 
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (playerRef.current) {
      if (!isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(newTime, true);
    }
  };

  const volumeTrackRef = useRef(null);

  const handleVolumeDrag = (e) => {
    if (!volumeTrackRef.current) return;
    const rect = volumeTrackRef.current.getBoundingClientRect();
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
    const percentage = 100 - (y / rect.height) * 100;
    const newVol = Math.max(0, Math.min(100, percentage));
    setVolume(newVol);
    if (playerRef.current && playerRef.current.setVolume) {
      playerRef.current.setVolume(newVol);
    }
  };

  const handleVolumePointerDown = (e) => {
    e.target.setPointerCapture(e.pointerId);
    handleVolumeDrag(e);
  };

  const onPlayerReady = (event) => {
    playerRef.current = event.target;
    playerRef.current.setVolume(volume);
    if (isPlaying) {
      playerRef.current.playVideo();
    }
  };

  const onPlayerStateChange = (event) => {
    if (event.data === 0) {
      handleNextTrack();
    } else if (event.data === 1) {
      setIsPlaying(true);
    } else if (event.data === 2) {
      setIsPlaying(false);
    }
  };

  const BackgroundLayers = () => (
    <>
      {/* Time of Day Backgrounds for Selection Screen */}
      <div className={`bg-layer time-sunrise ${!mood && weatherData.timeOfDay === 'sunrise' ? 'active' : ''}`} />
      <div className={`bg-layer time-day ${!mood && weatherData.timeOfDay === 'day' ? 'active' : ''}`} />
      <div className={`bg-layer time-sunset ${!mood && weatherData.timeOfDay === 'sunset' ? 'active' : ''}`} />
      <div className={`bg-layer time-night ${!mood && weatherData.timeOfDay === 'night' ? 'active' : ''}`} />

      {/* Mood Backgrounds for Player Screen */}
      <div className={`bg-layer theme-default ${mood && theme === 'default' ? 'active' : ''}`} />
      <div className={`bg-layer theme-red ${mood && theme === 'red' ? 'active' : ''}`} />
      <div className={`bg-layer theme-orange ${mood && theme === 'orange' ? 'active' : ''}`} />
      <div className={`bg-layer theme-blue ${mood && theme === 'blue' ? 'active' : ''}`} />
      <div className={`bg-layer theme-purple ${mood && theme === 'purple' ? 'active' : ''}`} />
      <div className={`bg-layer theme-indigo ${mood && theme === 'indigo' ? 'active' : ''}`} />
      <div className={`bg-layer theme-amber ${mood && theme === 'amber' ? 'active' : ''}`} />
    </>
  );

  if (isLoadingData) {
    return (
      <>
        <BackgroundLayers />
        <CanvasEffects mood="weather" isPlaying={true} weatherData={weatherData} />
        <div className="boot-container screen-enter" style={{background: 'transparent'}}>
          <div className="boot-logo" style={{fontSize: '1.5rem'}}>Connecting to Satellite...</div>
          <div className="scanner-line"></div>
          <div className="boot-text">Fetching Live Audio Streams</div>
        </div>
      </>
    );
  }

  const glassStyle = {
    transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
  };

  if (!mood) {
    return (
      <>
        <BackgroundLayers />
        <CanvasEffects mood="weather" isPlaying={true} weatherData={weatherData} />
        <div className="app-container screen-enter">
          <div className="glass-card" style={{...glassStyle, padding: '2rem 1rem'}}>
            <h1 style={{marginBottom: '0.5rem'}}>Select Vibe</h1>
            
            <div 
              className="carousel-container"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseLeave}
            >
              {MOODS.map((m, index) => {
                const diff = index - activeMoodIndex;
                let transformStyle = '';
                let opacity = 0;
                let zIndex = 1;
                
                // Using translate(-50%, -50%) as base because of absolute positioning in CSS
                // and % for translateX so it scales responsively on mobile
                const baseTranslate = 'translate(-50%, -50%)';
                
                if (diff === 0) {
                  transformStyle = `${baseTranslate} translateX(0) scale(1) translateZ(50px)`;
                  opacity = 1;
                  zIndex = 5;
                } else if (diff === -1) {
                  transformStyle = `${baseTranslate} translateX(-90%) scale(0.85) translateZ(0) rotateY(15deg)`;
                  opacity = 0.5;
                  zIndex = 4;
                } else if (diff === 1) {
                  transformStyle = `${baseTranslate} translateX(90%) scale(0.85) translateZ(0) rotateY(-15deg)`;
                  opacity = 0.5;
                  zIndex = 4;
                } else if (diff === -2) {
                  transformStyle = `${baseTranslate} translateX(-150%) scale(0.7) translateZ(-50px) rotateY(30deg)`;
                  opacity = 0.2;
                  zIndex = 3;
                } else if (diff === 2) {
                  transformStyle = `${baseTranslate} translateX(150%) scale(0.7) translateZ(-50px) rotateY(-30deg)`;
                  opacity = 0.2;
                  zIndex = 3;
                } else {
                  transformStyle = `${baseTranslate} translateX(${diff > 0 ? 250 : -250}%) scale(0.5) translateZ(-100px)`;
                  opacity = 0;
                }

                return (
                  <button 
                    key={m.id} 
                    className="card-btn carousel-item" 
                    style={{ transform: transformStyle, opacity, zIndex, cursor: diff === 0 ? 'pointer' : 'pointer' }}
                    onClick={(e) => {
                       // Prevent click if we were just dragging
                       if (isDragging || touchEnd) return; 
                       diff === 0 ? handleMoodSelect(m.id) : setActiveMoodIndex(index)
                    }}
                  >
                    <span className="card-emoji">
                      {(() => {
                        const Icon = ICON_MAP[m.iconName];
                        return Icon ? <Icon size={48} strokeWidth={1.5} /> : null;
                      })()}
                    </span>
                    <span className="card-title">{m.name}</span>
                    <span className="card-tagline" style={{opacity: diff === 0 ? 1 : 0, transition: 'opacity 0.3s'}}>{m.tagline}</span>
                  </button>
                );
              })}
            </div>
            
            <div style={{marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '2rem'}}>
              <button 
                className="btn-icon" 
                onClick={() => setActiveMoodIndex(Math.max(0, activeMoodIndex - 1))}
                disabled={activeMoodIndex === 0}
                style={{opacity: activeMoodIndex === 0 ? 0.3 : 1, width: '50px', height: '50px'}}
              >
                <ChevronLeft />
              </button>
              <button 
                className="btn-icon" 
                onClick={() => setActiveMoodIndex(Math.min(MOODS.length - 1, activeMoodIndex + 1))}
                disabled={activeMoodIndex === MOODS.length - 1}
                style={{opacity: activeMoodIndex === MOODS.length - 1 ? 0.3 : 1, width: '50px', height: '50px'}}
              >
                <ChevronRight />
              </button>
            </div>
            
          </div>
        </div>
      </>
    );
  }

  const currentSong = playlist[currentSongIndex];

  // Calculate Radial Scrubber Physics
  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const radius = 55;
  const dashArray = 2 * Math.PI * radius;
  const dashOffset = dashArray - (dashArray * progressPct) / 100;

  return (
    <>
      <BackgroundLayers />
      <CanvasEffects mood={mood} isPlaying={isPlaying} />

      <div className="app-container screen-enter">
        <button className="btn-icon" onClick={goBack} style={{position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 10, width: '50px', height: '50px'}}>
          <ArrowLeft />
        </button>
        
        <div className="glass-card" style={{maxWidth: '600px', zIndex: 10, ...glassStyle}}>
          <div className="player-container">
            
            {/* Radial Scrubber & Artwork */}
            <div style={{position: 'relative', width: '140px', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem'}}>
              <svg width="140" height="140" style={{position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)'}}>
                <circle cx="70" cy="70" r={radius} fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                <circle cx="70" cy="70" r={radius} fill="transparent" stroke="rgba(255,255,255,0.8)" strokeWidth="4" 
                  strokeDasharray={dashArray} strokeDashoffset={dashOffset} strokeLinecap="round" style={{transition: 'stroke-dashoffset 1s linear'}} />
              </svg>
              
              <span style={{color: 'rgba(255,255,255,0.9)', filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.5))'}}>
                {(() => {
                  const moodObj = MOODS.find(m => m.id === mood);
                  const Icon = moodObj ? ICON_MAP[moodObj.iconName] : null;
                  return Icon ? <Icon size={64} strokeWidth={1} /> : null;
                })()}
              </span>
            </div>

            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', margin: '0', padding: '0 4rem'}}>
              <h2 style={{margin: '0', fontSize: '2rem'}}>{MOODS.find(m => m.id === mood)?.name}</h2>
            </div>
            
            <div className="now-playing" style={{minHeight: '3rem', fontSize: '1rem', color: 'rgba(255,255,255,0.7)', padding: '0 5rem', lineHeight: '1.4'}}>
              {currentSong ? currentSong.title : 'No songs found for this selection.'}
            </div>

            {/* Linear Seek Bar */}
            <div className="seek-container" style={{ width: '100%', maxWidth: '350px', display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', padding: '0 1rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', fontVariantNumeric: 'tabular-nums' }}>
                {formatTime(currentTime)}
              </span>
              <input 
                type="range" 
                className="horizontal-seek-bar" 
                min="0" 
                max={duration || 100} 
                value={currentTime} 
                onChange={handleSeek} 
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', fontVariantNumeric: 'tabular-nums' }}>
                {formatTime(duration)}
              </span>
            </div>
            
            {/* Core Controls */}
            <div className="controls" style={{marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center'}}>
               <button className="btn-icon" onClick={toggleShuffle} style={{width: '50px', height: '50px', color: isShuffle ? '#fff' : 'rgba(255,255,255,0.3)', border: isShuffle ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent'}}>
                 <Shuffle size={20} />
               </button>
               
               <button className="btn-icon" onClick={handlePrevTrack} disabled={playlist.length <= 1}>
                 <SkipBack size={24} />
               </button>
               
               <button className="btn-icon play-btn" onClick={togglePlayPause} disabled={!currentSong}>
                 {isPlaying ? <Pause size={32} /> : <Play size={32} style={{marginLeft: '4px'}} />}
               </button>
               
               <button className="btn-icon" onClick={handleNextTrack} disabled={playlist.length <= 1}>
                 <SkipForward size={24} />
               </button>
             </div>
            
            {currentSong && (
              <div style={{display: 'none'}}>
                <YouTube
                  videoId={currentSong.id}
                  opts={{
                    playerVars: { autoplay: 1, controls: 0, loop: 1, playlist: currentSong.id },
                  }}
                  onReady={onPlayerReady}
                  onStateChange={onPlayerStateChange}
                  onEnd={handleNextTrack}
                />
              </div>
            )}
            
            {/* Vertical Volume Slider (Right Side) */}
            {!isMobile && (
              <div className="vertical-volume-container">
                <button onClick={() => {
                  const newVal = volume === 0 ? 100 : 0;
                  setVolume(newVal);
                  if (playerRef.current && playerRef.current.setVolume) playerRef.current.setVolume(newVal);
                }} className="vol-btn">
                  {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <div className="slider-wrapper">
                  <div 
                    ref={volumeTrackRef}
                    className="custom-vertical-slider"
                    onPointerDown={handleVolumePointerDown}
                    onPointerMove={(e) => e.buttons > 0 && handleVolumeDrag(e)}
                  >
                    <div className="custom-vertical-slider-fill" style={{ height: `${volume}%` }} />
                    <div className="custom-vertical-slider-thumb" style={{ bottom: `${volume}%` }} />
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
