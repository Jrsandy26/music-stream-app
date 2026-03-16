import {
  CardMedia,
  Typography,
  Box,
  IconButton,
  styled,
  alpha,
  ButtonBase,
  useTheme // Added for mode detection
} from "@mui/material";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";

// Updated Root to handle light/dark mode colors dynamically
const SongCardRoot = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'active'
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: 180,
  borderRadius: 32,
  // Adaptive Background: Pitch dark in dark mode, soft grey in light mode
  backgroundColor: theme.palette.mode === 'dark' ? "#121212" : "#f5f5f5",
  color: theme.palette.text.primary,
  padding: 12,
  textAlign: 'left',
  position: "relative",
  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  
  "&:hover": {
    backgroundColor: theme.palette.mode === 'dark' ? alpha("#ffffff", 0.08) : alpha("#000000", 0.04),
    transform: "scale(1.03) translateY(-4px)",
    "& .playButton": {
      opacity: 1,
      transform: "translateY(0) scale(1)",
    }
  },
  "&:active": {
    transform: "scale(0.97)",
  }
}));

const PlayButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: 18,
  bottom: 82,
  width: 52,
  height: 52,
  borderRadius: 18, // Squircle
  backgroundColor: theme.palette.primary.main, // Pink accent
  color: "#543944",
  opacity: 0,
  transform: "translateY(10px) scale(0.8)",
  transition: "all 0.3s cubic-bezier(0.2, 0, 0, 1)",
  boxShadow: "0 8px 16px rgba(0,0,0,0.4)",
  zIndex: 2,

  "&:hover": {
    backgroundColor: "#ffffff",
    transform: "scale(1.1) !important",
  }
}));

export default function SongCard({ song, onPlay }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handlePlay = (e) => {
    e.stopPropagation();
    onPlay(song);
  };

  return (
    <SongCardRoot component="div">
      <Box sx={{ position: "relative", width: "100%", mb: 1.5 }}>
        <CardMedia
          component="img"
          image={song.albumArt}
          alt={song.title}
          sx={{
            borderRadius: 24,
            width: "100%",
            aspectRatio: "1/1",
            objectFit: "cover",
            display: 'block',
            // Depth shadow that pops on black backgrounds
            boxShadow: isDark ? "0 8px 24px rgba(0,0,0,0.6)" : "0 8px 20px rgba(0,0,0,0.1)"
          }}
        />

        <PlayButton className="playButton" onClick={handlePlay}>
          <PlayArrowRounded sx={{ fontSize: 32 }} />
        </PlayButton>
      </Box>

      <Box sx={{ px: 0.5, width: '100%' }}>
        <Typography
          variant="body1"
          sx={{ 
            fontWeight: 800,
            fontSize: '0.9rem',
            lineHeight: 1.2,
            mb: 0.3,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            color: isDark ? "#fff" : "#000"
          }}
        >
          {song.title}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: isDark ? alpha("#fff", 0.5) : alpha("#000", 0.6),
            fontWeight: 600,
            display: 'block'
          }}
        >
          {song.artist}
        </Typography>
      </Box>
    </SongCardRoot>
  );
}