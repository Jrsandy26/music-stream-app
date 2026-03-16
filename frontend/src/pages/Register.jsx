import { useState } from "react";
import { 
  Box, Typography, TextField, Button, Paper, Stack, styled, alpha, useTheme 
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import AppRegistrationRoundedIcon from '@mui/icons-material/AppRegistrationRounded';
import { register } from "../api/api";

const RegisterContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  borderRadius: '40px',
  width: '100%',
  maxWidth: '400px',
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  textAlign: 'center',
}));

const PixelInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    backgroundColor: alpha(theme.palette.text.primary, 0.04),
    '& fieldset': { border: 'none' },
  }
}));

export default function Register() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(email, password);
      alert("Account created successfully! You can now login.");
      navigate("/login");
    } catch (err) {
      alert("Registration failed. Email might already be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
      <RegisterContainer elevation={0}>
        <Box sx={{ width: 64, height: 64, bgcolor: 'primary.main', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
          <AppRegistrationRoundedIcon sx={{ color: 'background.paper', fontSize: 32 }} />
        </Box>

        <Typography variant="h4" fontWeight={900} mb={1}>Join the Beat</Typography>
        <Typography variant="body2" sx={{ opacity: 0.6, mb: 4 }}>Create your account to start streaming.</Typography>

        <form onSubmit={handleRegister}>
          <Stack spacing={2}>
            <PixelInput 
              fullWidth 
              placeholder="Email" 
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
              disabled={loading}
              sx={{ py: 1.8, borderRadius: '16px', fontWeight: 700, mt: 2 }}
            >
              {loading ? "Creating..." : "Create Account"}
            </Button>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Already have an account? <Link to="/login" style={{ color: theme.palette.primary.main, textDecoration: 'none', fontWeight: 700 }}>Sign In</Link>
            </Typography>
          </Stack>
        </form>
      </RegisterContainer>
    </Box>
  );
}