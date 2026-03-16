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
  useTheme // Added to access system palette
} from "@mui/material"

// Icons
import HomeRoundedIcon from "@mui/icons-material/HomeRounded"
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded"
import LibraryMusicRoundedIcon from "@mui/icons-material/LibraryMusicRounded"
import AddRoundedIcon from "@mui/icons-material/AddRounded"
import MenuIcon from "@mui/icons-material/Menu"
import { Link, useLocation } from "react-router-dom"

const drawerWidth = 240;

// 1. Pixel Styled Nav Item
const NavItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'action',
})(({ theme, active, action }) => ({
  borderRadius: '32px',
  margin: '4px 12px',
  padding: '10px 16px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Dynamic colors based on system theme
  backgroundColor: active 
    ? theme.palette.primary.main 
    : (action ? alpha(theme.palette.primary.main, 0.1) : 'transparent'),
  
  color: active 
    ? theme.palette.getContrastText(theme.palette.primary.main) 
    : (action ? theme.palette.primary.main : theme.palette.text.primary),

  '&:hover': {
    backgroundColor: active 
      ? theme.palette.primary.main 
      : alpha(theme.palette.text.primary, 0.08),
  },
  '& .MuiListItemIcon-root': {
    color: 'inherit',
    minWidth: '40px',
  },
  '& .MuiTypography-root': {
    fontWeight: (active || action) ? 700 : 500,
  }
}));

export default function Sidebar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { text: "Home", icon: <HomeRoundedIcon />, path: "/" },
    { text: "Explore", icon: <ExploreRoundedIcon />, path: "/search" },
    { text: "Library", icon: <LibraryMusicRoundedIcon />, path: "/library" },
  ]

  const toggleSidebar = () => setIsOpen(!isOpen);

  // --- DESKTOP VIEW ---
  if (!isMobile) {
    return (
      <>
        {/* Floating Menu Button */}
        <Box sx={{ position: 'fixed', top: 12, left: 16, zIndex: 3000 }}>
          <IconButton 
            onClick={toggleSidebar} 
            sx={{ 
              color: theme.palette.text.primary, 
              bgcolor: alpha(theme.palette.background.paper, 0.5), 
              backdropFilter: 'blur(10px)',
              '&:hover': { bgcolor: alpha(theme.palette.background.paper, 0.8) } 
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        <Drawer
          variant="persistent"
          open={isOpen}
          sx={{
            width: isOpen ? drawerWidth : 0,
            flexShrink: 0,
            transition: 'width 0.3s ease',
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              // GLASSMORPHISM EFFECT
              bgcolor: alpha(theme.palette.background.paper, 0.7), // Transparent system color
              backdropFilter: "blur(20px) saturate(160%)", // The "Glass" frosting
              borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              p: 1,
              pt: 8,
            },
          }}
        >
          {isOpen && (
             <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 900, px: 3, mb: 2, letterSpacing: 1 }}>
               Hyde Music
             </Typography>
          )}

          <List>
            {menuItems.map((item) => (
              <NavItem
                key={item.text}
                component={Link}
                to={item.path}
                active={location.pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </NavItem>
            ))}

            <Box sx={{ my: 2, mx: 3, height: '1px', bgcolor: alpha(theme.palette.text.primary, 0.1) }} />

            <NavItem action onClick={() => console.log("New Playlist")}>
              <ListItemIcon><AddRoundedIcon /></ListItemIcon>
              <ListItemText primary="New Playlist" />
            </NavItem>
          </List>
        </Drawer>
      </>
    )
  }

  // --- MOBILE VIEW ---
  return (
    <Box sx={{
      position: 'fixed', bottom: 0, left: 0, right: 0, height: 75,
      // MOBILE GLASS EFFECT
      bgcolor: alpha(theme.palette.background.paper, 0.8), 
      backdropFilter: 'blur(20px)',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 2000,
      borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
    }}>
      {[...menuItems, { text: "New", icon: <AddRoundedIcon />, path: "#" }].map((item) => {
        const active = location.pathname === item.path;
        return (
          <Box key={item.text} component={Link} to={item.path} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', flex: 1 }}>
            <Box sx={{
              width: 56, height: 30, borderRadius: '16px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              bgcolor: active ? theme.palette.primary.main : 'transparent', 
              color: active ? theme.palette.background.paper : theme.palette.text.primary,
            }}>
              {item.icon}
            </Box>
            <Typography variant="caption" sx={{ color: active ? theme.palette.primary.main : theme.palette.text.primary, mt: 0.5, fontSize: '0.65rem', fontWeight: active ? 700 : 400 }}>
              {item.text}
            </Typography>
          </Box>
        );
      })}
    </Box>
  )
}