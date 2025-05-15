import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Tooltip,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import MyLocationIcon from '@mui/icons-material/MyLocation';

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

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    address: '',
    phone_number: '',
    location: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Joylashuvni aniqlash funksiyasi
  const handleDetectLocation = () => {
    setIsLoading(true);
    setError('');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setFormData({ ...formData, location });
          setSuccess('Joylashuv muvaffaqiyatli aniqlandi!');
          setIsLoading(false);
        },
        (err) => {
          setError(
            err.code === 1
              ? 'Joylashuvga ruxsat berilmadi. Qo‘lda kiriting.'
              : 'Joylashuvni aniqlashda xatolik yuz berdi.'
          );
          setIsLoading(false);
        }
      );
    } else {
      setError('Brauzeringiz geolocation’ni qo‘llab-quvvatlamaydi.');
      setIsLoading(false);
    }
  };

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

    // Validatsiya
    if (formData.username.length < 3) {
      setError('Foydalanuvchi ismi kamida 3 belgidan iborat bo‘lishi kerak.');
      setIsLoading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('To‘g‘ri email manzilini kiriting.');
      setIsLoading(false);
      return;
    }
    const phoneRegex = /^\+998\d{9}$/;
    if (!phoneRegex.test(formData.phone_number)) {
      setError('Telefon raqami +998 bilan boshlanib, 9 ta raqamdan iborat bo‘lishi kerak.');
      setIsLoading(false);
      return;
    }
    const locationRegex = /^\d+\.\d{4}, \d+\.\d{4}$/;
    if (!locationRegex.test(formData.location)) {
      setError('Joylashuv kenglik va uzunlik formatida bo‘lishi kerak (masalan, 41.3111, 69.2797).');
      setIsLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError('Parol kamida 6 belgidan iborat bo‘lishi kerak.');
      setIsLoading(false);
      return;
    }

    // Ma'lumotlarni JSON tartibida tayyorlash
    const payload = {
      address: formData.address,
      phone_number: formData.phone_number,
      location: formData.location,
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await axios.post(
        'https://hosilbek.pythonanywhere.com/api/user/user-profiles/',
        payload,
        {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ3MjQ2ODA3LCJpYXQiOjE3NDcxNjA0MDcsImp0aSI6ImE1YjFhMzAyMWJmYzQ2OTU5OTgwNTM5NzExZjE3YTdjIiwidXNlcl9pZCI6MX0.Ad09zXiI1d2gzySCfKWgqpKHnZ4RGboAw865GUVNeGI',
          },
        }
      );
      setSuccess('Ro‘yxatdan o‘tish muvaffaqiyatli! Tizimga kirish sahifasiga o‘tyapsiz...');
      setFormData({
        username: '',
        address: '',
        phone_number: '',
        location: '',
        email: '',
        password: '',
      });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Ro‘yxatdan o‘tishda xatolik yuz berdi. Token yoki ma\'lumotlarni tekshiring.');
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
                  Ro‘yxatdan o‘tish
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Foydalanuvchi ismi"
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
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    margin="normal"
                    required
                    type="email"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Manzil"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    margin="normal"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <HomeIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Telefon raqami"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    margin="normal"
                    type="tel"
                    required
                    placeholder="+998901234567"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Box display="flex" alignItems="center" gap={1}>
                    <TextField
                      fullWidth
                      label="Joylashuv (kenglik, uzunlik)"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      margin="normal"
                      required
                      placeholder="41.3111, 69.2797"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOnIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Tooltip title="Joriy joylashuvni aniqlash">
                      <IconButton
                        onClick={handleDetectLocation}
                        disabled={isLoading}
                        color="primary"
                        sx={{ mt: 1 }}
                      >
                        <MyLocationIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
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
                    {isLoading ? 'Yuklanmoqda...' : 'Ro‘yxatdan o‘tish'}
                  </Button>
                </Box>
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

export default Register;