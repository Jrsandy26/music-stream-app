import { useState } from "react";
import { 
  Box, Typography, TextField, Button, Paper, Stack, styled, alpha, useTheme 
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import MusicNoteRoundedIcon from '@mui/icons-material/MusicNoteRounded';
// Assume your api.js exports these as named exports
import { login } from "../api/api"; 

const LoginContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  borderRadius: '40px',
  width: '100%',
  maxWidth: '400px',
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  textAlign: 'center',
  boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
}));

const PixelInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    backgroundColor: alpha(theme.palette.text.primary, 0.04),
    '& fieldset': { border: 'none' },
    '&.Mui-focused': {
      backgroundColor: alpha(theme.palette.text.primary, 0.08),
    }
  }
}));

export default function Login({ onLogin }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(email, password);
      
      if (data.token) {
        // Save JWT to local storage
        localStorage.setItem("token", data.token);
        
        // Update global App state with user info from backend
        // If your backend doesn't return user info here, you may need a separate /me fetch
        onLogin({
          name: data.username || email.split('@')[0],
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          email: email
        });

        navigate("/");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Server connection failed. Is the backend running?");
      console.error("Login Error:", err);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
      <LoginContainer elevation={0}>
        <Box sx={{ width: 64, height: 64, bgcolor: 'primary.main', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
          <MusicNoteRoundedIcon sx={{ color: 'background.paper', fontSize: 32 }} />
        </Box>

        <Typography variant="h4" fontWeight={900} mb={1}>Hyde Music</Typography>
        <Typography variant="body2" sx={{ opacity: 0.6, mb: 4 }}>Welcome back! Sign in to continue.</Typography>

        {error && <Typography color="error" variant="caption" sx={{ mb: 2, display: 'block' }}>{error}</Typography>}

        <form onSubmit={handleLogin}>
          <Stack spacing={2}>
            <PixelInput 
              fullWidth 
              placeholder="Email" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <PixelInput 
              fullWidth 
              placeholder="Password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth
              sx={{ py: 1.8, borderRadius: '16px', fontWeight: 700, mt: 2, boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}` }}
            >
              Sign In
            </Button>
            
            <Typography variant="body2" sx={{ mt: 2 }}>
              Don't have an account? <Link to="/register" style={{ color: theme.palette.primary.main, textDecoration: 'none', fontWeight: 700 }}>Register</Link>
            </Typography>
          </Stack>
        </form>
      </LoginContainer>
    </Box>
  );
}