import { useState } from "react"
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  useMediaQuery,
  styled,
  alpha,
  Typography,
  useTheme,
  Tooltip
} from "@mui/material"

// Icons
import HomeRoundedIcon from "@mui/icons-material/HomeRounded"
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded"
import LibraryMusicRoundedIcon from "@mui/icons-material/LibraryMusicRounded"
import AddRoundedIcon from "@mui/icons-material/AddRounded"
import MenuIcon from "@mui/icons-material/Menu"
import { Link, useLocation } from "react-router-dom"

const fullDrawerWidth = 240;
const miniDrawerWidth = 80;

// 1. Pixel Styled Nav Item
const NavItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'isMini',
})(({ theme, active, isMini }) => ({
  borderRadius: '16px', // Pixel rounded corners
  margin: '4px 12px',
  padding: isMini ? '12px 0' : '10px 16px',
  display: 'flex',
  flexDirection: 'column', // Stack icon and text in mini mode
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease-in-out',
  
  // The "Active Pill" effect behind the icon
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    marginBottom: isMini ? '4px' : 0,
    marginRight: isMini ? 0 : '16px',
    color: active ? theme.palette.primary.main : theme.palette.text.primary,
    padding: '4px 20px',
    borderRadius: '20px',
    backgroundColor: active ? alpha(theme.palette.primary.main, 0.12) : 'transparent',
    transition: 'background-color 0.3s ease',
  },

  '& .MuiTypography-root': {
    fontSize: isMini ? '0.65rem' : '0.9rem',
    fontWeight: active ? 700 : 500,
    color: active ? theme.palette.primary.main : theme.palette.text.primary,
  },

  '&:hover': {
    backgroundColor: alpha(theme.palette.text.primary, 0.04),
  }
}));

export default function Sidebar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  const menuItems = [
    { text: "Home", icon: <HomeRoundedIcon />, path: "/" },
    { text: "Explore", icon: <ExploreRoundedIcon />, path: "/search" },
    { text: "Library", icon: <LibraryMusicRoundedIcon />, path: "/library" },
  ]

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  // --- DESKTOP VIEW (Mini Rail vs Full Sidebar) ---
  if (!isMobile) {
    return (
      <Drawer
        variant="permanent"
        sx={{
          width: isExpanded ? fullDrawerWidth : miniDrawerWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          "& .MuiDrawer-paper": {
            width: isExpanded ? fullDrawerWidth : miniDrawerWidth,
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflowX: 'hidden',
            boxSizing: "border-box",
            bgcolor: theme.palette.background.default,
            borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            pt: 1,
          },
        }}
      >
        {/* Toggle Button Container */}
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, mb: 2 }}>
          <IconButton onClick={toggleSidebar} sx={{ color: theme.palette.text.primary }}>
            <MenuIcon />
          </IconButton>
          {isExpanded && (
            <Typography variant="h6" sx={{ ml: 2, fontWeight: 900, color: theme.palette.primary.main }}>
              Hyde
            </Typography>
          )}
        </Box>

        <List sx={{ px: 0 }}>
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Tooltip key={item.text} title={!isExpanded ? item.text : ""} placement="right">
                <NavItem
                  component={Link}
                  to={item.path}
                  active={active}
                  isMini={!isExpanded}
                  sx={{ flexDirection: isExpanded ? 'row' : 'column' }}
                >
                  <ListItemIcon sx={{ px: isExpanded ? 0 : '12px' }}>{item.icon}</ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ opacity: isExpanded ? 1 : 1, textAlign: isExpanded ? 'left' : 'center' }} 
                    disableTypography
                  />
                </NavItem>
              </Tooltip>
            )
          })}
          
          <Box sx={{ my: 2, mx: 3, height: '1px', bgcolor: alpha(theme.palette.divider, 0.1) }} />

          <NavItem isMini={!isExpanded} sx={{ flexDirection: isExpanded ? 'row' : 'column' }}>
            <ListItemIcon sx={{ px: isExpanded ? 0 : '12px' }}>
              <AddRoundedIcon />
            </ListItemIcon>
            <ListItemText 
              primary="New Playlist" 
              sx={{ textAlign: isExpanded ? 'left' : 'center' }} 
              disableTypography
            />
          </NavItem>
        </List>
      </Drawer>
    )
  }

  // --- MOBILE VIEW (Bottom Navigation Bar) ---
  return (
    <Box sx={{
      position: 'fixed', bottom: 0, left: 0, right: 0, height: 70,
      bgcolor: alpha(theme.palette.background.paper, 0.95),
      backdropFilter: 'blur(20px)',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 2000,
      borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      pb: 1 // Padding for home indicator on iOS
    }}>
      {[...menuItems, { text: "New", icon: <AddRoundedIcon />, path: "#" }].map((item) => {
        const active = location.pathname === item.path;
        return (
          <Box 
            key={item.text} 
            component={Link} 
            to={item.path} 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              textDecoration: 'none', 
              flex: 1 
            }}
          >
            <Box sx={{
              width: 56, height: 32, borderRadius: '16px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              bgcolor: active ? alpha(theme.palette.primary.main, 0.12) : 'transparent', 
              color: active ? theme.palette.primary.main : theme.palette.text.primary,
              transition: 'all 0.3s ease'
            }}>
              {item.icon}
            </Box>
            <Typography variant="caption" sx={{ 
              color: active ? theme.palette.primary.main : theme.palette.text.primary, 
              mt: 0.5, 
              fontSize: '0.65rem', 
              fontWeight: active ? 700 : 400 
            }}>
              {item.text}
            </Typography>
          </Box>
        );
      })}
    </Box>
  )
}