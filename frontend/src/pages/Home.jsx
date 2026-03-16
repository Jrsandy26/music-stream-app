import { useState, useEffect } from "react";
import { setQueue, playStream } from "../audio/audioEngine";
import { useNavigate } from "react-router-dom"; // Essential for navigation
import {
  Box, Typography, Grid, Stack, Chip, alpha, styled, 
  Container, Fade, Skeleton, IconButton, useTheme, Avatar,
  Menu, MenuItem, Divider, ListItemIcon
} from "@mui/material";

// Icons
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import SongCard from "../components/SongCard";

// Styled Components (Kept outside to prevent re-renders)
const SearchDock = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: 10,
  zIndex: 100,
  backdropFilter: 'blur(30px) saturate(150%)',
  backgroundColor: alpha(theme.palette.background.paper, 0.6),
  borderRadius: '40px',
  padding: '6px 12px',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  marginBottom: theme.spacing(6),
  display: 'flex',
  alignItems: 'center',
  '&:focus-within': {
    backgroundColor: theme.palette.background.paper,
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
    transform: 'scale(1.01)',
  }
}));

const StyledInput = styled('input')(({ theme }) => ({
  width: '100%',
  border: 'none',
  background: 'transparent',
  color: theme.palette.text.primary,
  fontSize: '1.05rem',
  padding: '12px',
  outline: 'none',
  fontFamily: 'inherit',
  '&::placeholder': { color: alpha(theme.palette.text.primary, 0.4) }
}));

export default function Home({ toggleTheme, userProfile, onLogout }) {
  const theme = useTheme();
  const navigate = useNavigate(); // Now correctly inside the function
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [greeting, setGreeting] = useState("Discover");
  const isDark = theme.palette.mode === 'dark';

  // Menu State
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  // Dynamic Greeting based on time
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Good morning");
    else if (hours < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
    
    fetchData("trending");
  }, []);

  const handleProfileClick = (event) => {
    if (!userProfile) {
      navigate("/login");
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleCloseMenu = () => setAnchorEl(null);

  const fetchData = async (q) => {
    if (!q) return;
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/search?query=${q}`);
      const data = await res.json();
      setSongs(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const play = async (song, index) => {
    setQueue(songs, index);
    const res = await fetch(`http://127.0.0.1:8000/stream/${song.videoId}`);
    const data = await res.json();
    if (data.audio) playStream(data.audio);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      pb: 15, 
      pt: 2,
      transition: 'background-color 0.5s ease' 
    }}>
      <Container maxWidth="xl">
        
        {/* Top Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4, px: 1 }}>
          <Box>
            <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.5, fontWeight: 700 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Typography>
            <Typography variant="h2" sx={{ 
              fontSize: { xs: '2.2rem', md: '3.2rem' },
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1.1
            }}>
              {greeting}, <span style={{ color: theme.palette.primary.main }}>{userProfile?.name || "Explorer"}</span>
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={1.5}>
            {/* Theme Toggle Button */}
            <IconButton 
              onClick={toggleTheme}
              sx={{ 
                bgcolor: alpha(theme.palette.text.primary, 0.05),
                p: 1.5,
                borderRadius: '16px',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                transition: '0.3s',
                '&:hover': { transform: 'rotate(15deg)' }
              }}
            >
              {isDark ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
            </IconButton>

            {/* User Profile Avatar */}
            <IconButton 
              onClick={handleProfileClick}
              sx={{ 
                p: 0.5, 
                border: `2px solid ${userProfile ? theme.palette.primary.main : alpha(theme.palette.divider, 0.2)}`, 
                borderRadius: '20px',
                transition: '0.3s'
              }}
            >
              <Avatar 
                src={userProfile?.avatar} 
                sx={{ 
                  width: 42, 
                  height: 42, 
                  bgcolor: userProfile ? 'primary.main' : alpha(theme.palette.text.primary, 0.1) 
                }}
              >
                <PersonRoundedIcon sx={{ color: userProfile ? 'background.paper' : 'inherit' }} />
              </Avatar>
            </IconButton>
          </Stack>
        </Stack>

        {/* Material 3 Account Menu */}
        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleCloseMenu}
          onClick={handleCloseMenu}
          PaperProps={{
            elevation: 0,
            sx: {
              width: 280,
              mt: 1.5,
              borderRadius: '24px',
              bgcolor: 'background.paper',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              p: 1,
              backgroundImage: 'none',
              boxShadow: '0 12px 40px rgba(0,0,0,0.3)'
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
             <Avatar src={userProfile?.avatar} sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}>
                {userProfile?.name?.charAt(0)}
             </Avatar>
             <Box sx={{ overflow: 'hidden' }}>
                <Typography variant="subtitle1" fontWeight={800} noWrap>{userProfile?.name}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.6 }} noWrap>{userProfile?.email}</Typography>
             </Box>
          </Box>
          <Divider sx={{ my: 1, opacity: 0.5 }} />
          <MenuItem onClick={() => navigate("/settings")} sx={{ borderRadius: '12px', py: 1.5 }}>
            <ListItemIcon><SettingsRoundedIcon fontSize="small" /></ListItemIcon>
            Pixel Music Settings
          </MenuItem>
          <MenuItem onClick={onLogout} sx={{ borderRadius: '12px', py: 1.5, color: '#ff5252' }}>
            <ListItemIcon><LogoutRoundedIcon fontSize="small" sx={{ color: '#ff5252' }} /></ListItemIcon>
            Sign out
          </MenuItem>
        </Menu>

        {/* Floating Search Dock */}
        <SearchDock>
          <SearchRoundedIcon sx={{ ml: 1.5, opacity: 0.5, color: theme.palette.primary.main }} />
          <StyledInput 
            placeholder="Search for music, artists..." 
            onChange={(e) => fetchData(e.target.value)} 
          />
          <IconButton size="small" sx={{ mr: 1, opacity: 0.5 }}>
            <TuneRoundedIcon />
          </IconButton>
        </SearchDock>

        {/* Vibe Chips */}
        <Stack 
            direction="row" 
            spacing={1.2} 
            sx={{ 
                mb: 6, 
                overflowX: 'auto', 
                pb: 1, 
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' } 
            }}
        >
          {["Relax", "Workout", "Focus", "Party", "New Releases", "Discover"].map((v) => (
            <Chip 
              key={v} 
              label={v} 
              onClick={() => fetchData(v)}
              sx={{ 
                px: 1.5, 
                height: 42, 
                borderRadius: '16px',
                fontWeight: 700,
                fontSize: '0.85rem',
                bgcolor: alpha(theme.palette.text.primary, 0.05),
                border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
                transition: '0.2s',
                '&:hover': { 
                    bgcolor: theme.palette.primary.main, 
                    color: 'background.paper',
                    transform: 'translateY(-2px)'
                }
              }} 
            />
          ))}
        </Stack>

        {/* Music Content Area */}
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, px: 1 }}>
          Your Daily Mix
        </Typography>

        <Grid container spacing={3}>
          {loading ? (
            [...Array(10)].map((_, i) => (
              <Grid item xs={6} sm={4} md={3} lg={2.4} xl={2} key={i}>
                <Skeleton variant="rectangular" height={220} sx={{ borderRadius: '28px' }} />
                <Skeleton variant="text" sx={{ mt: 1, width: '80%' }} />
                <Skeleton variant="text" sx={{ width: '50%' }} />
              </Grid>
            ))
          ) : (
            songs.map((song, index) => (
              <Fade in={true} key={song.videoId} timeout={index * 50}>
                <Grid item xs={6} sm={4} md={3} lg={2.4} xl={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <SongCard song={song} onPlay={() => play(song, index)} />
                  </Box>
                </Grid>
              </Fade>
            ))
          )}
        </Grid>
      </Container>
    </Box>
  );
}