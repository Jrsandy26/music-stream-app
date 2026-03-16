import { useState, useMemo, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Box, createTheme, ThemeProvider, CssBaseline } from "@mui/material";

// Components
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";

// Pages
import Home from "./pages/Home";
import Search from "./pages/Search";
import Library from "./pages/Library";
import Login from "./pages/Login";
import Register from "./pages/Register"; // Make sure to import your new Register page

function AppLayout({ userProfile, onLogin, onLogout, toggleTheme }) {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Hide Sidebar on Auth screens */}
      {!isAuthPage && <Sidebar userProfile={userProfile} />}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          // Adjust padding bottom based on whether player is visible
          pb: isAuthPage ? 0 : "140px", 
          overflowX: "hidden"
        }}
      >
        <Routes>
          {/* Public Home Page */}
          <Route path="/" element={
            <Home 
              userProfile={userProfile} 
              onLogout={onLogout} 
              toggleTheme={toggleTheme} 
            />
          } />
          
          <Route path="/search" element={<Search />} />
          
          {/* Protected Library Page - Redirects to login if no user */}
          <Route 
            path="/library" 
            element={userProfile ? <Library /> : <Navigate to="/login" />} 
          />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login onLogin={onLogin} />} />
          <Route path="/register" element={<Register />} />
          
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Box>

      {/* Hide Player on Auth screens */}
      {!isAuthPage && <Player />}
    </Box>
  );
}

export default function App() {
  const [userProfile, setUserProfile] = useState(null);
  const [mode, setMode] = useState('dark');

  // 1. AUTO-LOGIN: Check for token on App Load
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    
    if (savedToken && savedUser) {
      try {
        setUserProfile(JSON.parse(savedUser));
      } catch (e) {
        localStorage.clear();
      }
    }
  }, []);

  const handleLogin = (data) => {
    // Expects data to be { user: {name, email, avatar}, token: "..." }
    setUserProfile(data.user);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const handleLogout = () => {
    setUserProfile(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // 2. Dynamic Theme Engine
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: '#FCD9E6' },
      background: {
        default: mode === 'dark' ? '#000000' : '#F5F5F5',
        paper: mode === 'dark' ? '#121212' : '#FFFFFF',
      },
      text: {
        primary: mode === 'dark' ? '#FFFFFF' : '#000000',
      }
    },
    typography: {
      fontFamily: '"Inter", "Roboto", sans-serif',
      h2: { fontWeight: 900, letterSpacing: '-0.04em' },
    },
    shape: { borderRadius: 24 } // Pixel-style high rounding
  }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppLayout 
          userProfile={userProfile} 
          onLogin={handleLogin} 
          onLogout={handleLogout} 
          toggleTheme={toggleTheme}
        />
      </Router>
    </ThemeProvider>
  );
}