import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Snackbar,
  Alert as MuiAlert,
  InputAdornment,
  IconButton,
  Fade,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { login } from '../redax/authSlice';

// Maxsus MUI theme
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2', contrastText: '#fff' },
    secondary: { main: '#f50057' },
    background: { default: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, color: '#1976d2' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontSize: '1rem',
          padding: '10px 20px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': { transform: 'scale(1.05)' },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#fff',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            '&:hover fieldset': { borderColor: '#1976d2' },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          backgroundColor: '#ffffff',
        },
      },
    },
  },
});

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!formData.username) {
      setError('Foydalanuvchi nomini kiriting.');
      setIsLoading(false);
      return;
    }
    if (!formData.password) {
      setError('Parolni kiriting.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'https://hosilbek02.pythonanywhere.com/api/user/login/',
        {
          username: formData.username,
          password: formData.password,
        }
      );
      const { token } = response.data;
      console.log('Login token:', token); // Debug uchun
      dispatch(login({ username: formData.username, token }));
      localStorage.setItem('token', token);
      setSuccess('Kirish muvaffaqiyatli! Bosh sahifaga o‘tyapsiz...');
      setFormData({ username: '', password: '' });
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error('Login xatosi:', err.response?.status, err.response?.data);
      setError(err.response?.data?.detail || 'Login yoki parol xato.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setError('');
    setSuccess('');
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.palette.background.default,
        }}
      >
        <Container maxWidth="sm">
          <Fade in={true} timeout={1000}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" justifyContent="center" mb={3}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                    <PersonIcon fontSize="large" />
                  </Avatar>
                </Box>
                <Typography variant="h4" align="center" gutterBottom>
                  Kirish
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Foydalanuvchi nomi"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    margin="normal"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Parol"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    margin="normal"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {isLoading && <LinearProgress sx={{ mt: 2, mb: 2 }} />}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Yuklanmoqda...' : 'Kirish'}
                  </Button>
                </Box>
                <Typography align="center" variant="body2" sx={{ mt: 2 }}>
                  Agar ro‘yxatdan o‘tmagan bo‘lsangiz,{' '}
                  <Link to="/register" style={{ color: theme.palette.primary.main, textDecoration: 'none' }}>
                    ro‘yxatdan o‘ting
                  </Link>
                </Typography>
              </CardContent>
            </Card>
          </Fade>
          <Snackbar
            open={!!error || !!success}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <MuiAlert
              onClose={handleClose}
              severity={error ? 'error' : 'success'}
              sx={{ width: '100%' }}
            >
              {error || success}
            </MuiAlert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Login;