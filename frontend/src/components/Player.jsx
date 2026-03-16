import React, { useEffect, useState, useRef } from "react";
import { getAudio, playNext, playPrevious, getQueue, getCurrentIndex } from "../audio/audioEngine";
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Paper,
  styled,
  createTheme,
  ThemeProvider,
  keyframes,
  Fade,
  Slider
} from "@mui/material";

// Icons
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import PauseRounded from "@mui/icons-material/PauseRounded";
import SkipNextRounded from "@mui/icons-material/SkipNextRounded";
import SkipPreviousRounded from "@mui/icons-material/SkipPreviousRounded";
import VolumeUpRounded from "@mui/icons-material/VolumeUpRounded";
import VolumeOffRounded from "@mui/icons-material/VolumeOffRounded";
import KeyboardArrowRightRounded from "@mui/icons-material/KeyboardArrowRightRounded";

const m3Theme = createTheme({
  palette: {
    primary: { main: '#FCD9E6' },
    background: { paper: '#543944' },
    text: { primary: '#FFFFFF' }
  },
});

// 1. Pixel-style Wave Animation (Looping)
const moveWave = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-80px); } 
`;

const SnakeSliderRoot = styled('div')(({ playing, percent, mini }) => ({
  position: 'relative',
  width: '100%',
  height: mini ? 4 : 32,
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  touchAction: 'none',

  // Grey background track
  '& .track': {
    position: 'absolute',
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2
  },

  // The active colored container (Masks the wave)
  '& .active-container': {
    position: 'absolute',
    width: `${percent}%`,
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    transition: 'width 0.1s linear',
    zIndex: 1
  },

  // The Wave SVG - Long enough to loop
  '& .wave-svg': {
    width: '160px', 
    height: 12,
    stroke: '#FCD9E6',
    strokeWidth: 4,
    fill: 'none',
    strokeLinecap: 'round',
    animation: playing && !mini ? `${moveWave} 2s linear infinite` : 'none',
    display: mini ? 'none' : 'block'
  },

  // Thumb / Head of the snake
  '& .thumb': {
    position: 'absolute',
    left: `${percent}%`,
    width: mini ? 0 : 14,
    height: mini ? 0 : 14,
    backgroundColor: '#FCD9E6',
    borderRadius: '50%',
    transform: 'translateX(-50%)',
    zIndex: 2,
    transition: 'left 0.1s linear',
    boxShadow: '0 0 10px rgba(0,0,0,0.3)',
    display: mini ? 'none' : 'block'
  },

  '& .mini-progress': {
    width: '100%',
    height: '100%',
    backgroundColor: '#FCD9E6',
    display: mini ? 'block' : 'none'
  }
}));

export default function SidePlayer() {
  const audio = getAudio();
  const playerRef = useRef(null);
  
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [paused, setPaused] = useState(true);
  const [song, setSong] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const update = () => {
      setProgress(audio.currentTime || 0);
      setDuration(audio.duration || 0);
      setPaused(audio.paused);
      const queue = getQueue();
      const index = getCurrentIndex();
      if (queue?.[index]) setSong(queue[index]);
    };

    const handleClickOutside = (e) => {
      if (playerRef.current && !playerRef.current.contains(e.target)) {
        setIsMinimized(true);
      }
    };

    audio.addEventListener("timeupdate", update);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      audio.removeEventListener("timeupdate", update);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [audio]);

  if (!song) return null;

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    audio.currentTime = (x / rect.width) * (duration || 1);
  };

  const formatTime = (time) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const percent = (progress / (duration || 1)) * 100;

  return (
    <ThemeProvider theme={m3Theme}>
      <Box
        ref={playerRef}
        sx={{
          position: 'fixed',
          right: 20,
          bottom: 20,
          zIndex: 2000,
          width: isMinimized ? 300 : 340,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Paper elevation={12} sx={{
          p: isMinimized ? 1.5 : 3,
          borderRadius: 8,
          bgcolor: 'background.paper',
          color: 'white',
          overflow: 'hidden'
        }}>
          
          {!isMinimized && (
            <Fade in={!isMinimized}>
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="overline" sx={{ opacity: 0.6, letterSpacing: 1.5 }}>Now Playing</Typography>
                  <IconButton size="small" onClick={() => setIsMinimized(true)} sx={{ color: 'white' }}>
                    <KeyboardArrowRightRounded />
                  </IconButton>
                </Stack>

                <Box component="img" src={song.albumArt} sx={{ 
                  width: '100%', aspectRatio: '1/1', borderRadius: 6, mb: 2.5,
                  boxShadow: '0 15px 35px rgba(0,0,0,0.4)' 
                }} />

                <Typography variant="h6" noWrap fontWeight="800" sx={{ mb: 0.5 }}>{song.title}</Typography>
                <Typography variant="body2" sx={{ color: 'primary.main', opacity: 0.8, mb: 2.5 }}>{song.artist}</Typography>

                {/* THE PIXEL SNAKE SLIDER */}
                <SnakeSliderRoot playing={!paused} percent={percent} onClick={handleSeek}>
                  <div className="track" />
                  <div className="active-container">
                    <svg className="wave-svg" viewBox="0 0 160 20" preserveAspectRatio="none">
                      <path d="M 0 10 C 10 0, 10 20, 20 10 C 30 0, 30 20, 40 10 C 50 0, 50 20, 60 10 C 70 0, 70 20, 80 10 C 90 0, 90 20, 100 10 C 110 0, 110 20, 120 10 C 130 0, 130 20, 140 10 C 150 0, 150 20, 160 10" />
                    </svg>
                  </div>
                  <div className="thumb" />
                </SnakeSliderRoot>

                <Stack direction="row" justifyContent="space-between" sx={{ mt: -0.5, mb: 3 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{formatTime(progress)}</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{formatTime(duration)}</Typography>
                </Stack>

                <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mb: 3.5 }}>
                  <IconButton color="inherit" onClick={playPrevious}><SkipPreviousRounded fontSize="large"/></IconButton>
                  <IconButton 
                    onClick={() => audio.paused ? audio.play() : audio.pause()} 
                    sx={{ 
                      bgcolor: 'primary.main', 
                      color: '#543944', 
                      p: 2.5,
                      borderRadius: '24px',
                      '&:hover': { bgcolor: '#fff' }
                    }}
                  >
                    {paused ? <PlayArrowRounded fontSize="large" /> : <PauseRounded fontSize="large" />}
                  </IconButton>
                  <IconButton color="inherit" onClick={playNext}><SkipNextRounded fontSize="large"/></IconButton>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center" sx={{ px: 1 }}>
                  {volume === 0 ? <VolumeOffRounded fontSize="small" /> : <VolumeUpRounded fontSize="small" />}
                  <Slider 
                    size="small" 
                    value={volume} 
                    min={0} max={1} step={0.01} 
                    onChange={(e, v) => { setVolume(v); audio.volume = v; }} 
                    sx={{ color: 'primary.main' }} 
                  />
                </Stack>
              </Box>
            </Fade>
          )}

          {isMinimized && (
            <Stack direction="row" alignItems="center" spacing={1.5} onClick={() => setIsMinimized(false)} sx={{ cursor: 'pointer' }}>
              <Box component="img" src={song.albumArt} sx={{ width: 44, height: 44, borderRadius: 3 }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="caption" noWrap fontWeight="800" sx={{ display: 'block', mb: 0.5 }}>{song.title}</Typography>
                <SnakeSliderRoot mini percent={percent}>
                  <div className="track" /><div className="active-container"><div className="mini-progress" /></div>
                </SnakeSliderRoot>
              </Box>
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); audio.paused ? audio.play() : audio.pause(); }} sx={{ color: 'primary.main' }}>
                {paused ? <PlayArrowRounded /> : <PauseRounded />}
              </IconButton>
            </Stack>
          )}
        </Paper>
      </Box>
    </ThemeProvider>
  );
}