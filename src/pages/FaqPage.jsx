import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  CircularProgress,
  Alert,
  Button,
  TextField,
  InputAdornment,
  Typography,
  Snackbar,
} from '@mui/material';
import { Search as SearchIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#3366ff' },
    secondary: { main: '#ff3d71' },
    success: { main: '#00d68f' },
    background: { default: '#f7f9fc' },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h4: { fontWeight: 700, fontSize: '1.75rem' },
  },
});

const KitchensTable = () => {
  const [kitchens, setKitchens] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const API_URL = 'https://hosilbek.pythonanywhere.com/api/user/kitchens/';
  const token = localStorage.getItem('token');

  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: { Authorization: token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' },
  });

  const fetchKitchens = useCallback(async () => {
    if (!token) {
      setError('Foydalanuvchi tizimga kirmagan');
      setLoading(false);
      window.location.href = '/login';
      return;
    }
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching kitchens with token:', token);
      const { data } = await axiosInstance.get('');
      setKitchens(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch error:', err.response?.data || err.message);
      setError(err.response?.data?.message || err.response?.data?.detail || 'Oshxonalarni yuklab bo‘lmadi');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleToggleActive = useCallback(
    async (kitchenId, isActive) => {
      if (!token) {
        setSnackbar({
          open: true,
          message: 'Foydalanuvchi tizimga kirmagan. Iltimos, tizimga kiring.',
          severity: 'error',
        });
        window.location.href = '/login';
        return;
      }
      try {
        setLoading(true);
        const url = `${kitchenId}/`;
        const payload = { is_aktiv: !isActive };

        await axiosInstance.patch(url, payload);
        setKitchens((prev) =>
          prev.map((kitchen) =>
            kitchen.id === kitchenId ? { ...kitchen, is_aktiv: !isActive } : kitchen
          )
        );
        setSnackbar({
          open: true,
          message: `Oshxona ${!isActive ? 'faollashtirildi' : 'noaktiv qilindi'}!`,
          severity: 'success',
        });
      } catch (err) {
        console.error('PATCH error:', err);
        console.error('Response data:', err.response?.data);
        console.error('Response status:', err.response?.status);
        if (err.code === 'ERR_INTERNET_DISCONNECTED') {
          setSnackbar({
            open: true,
            message: 'Internet ulanishingiz yo‘q. Iltimos, tarmoqni tekshiring.',
            severity: 'error',
          });
        } else if (err.response?.status === 401) {
          setSnackbar({
            open: true,
            message: 'Autentifikatsiya xatosi: Iltimos, qayta tizimga kiring.',
            severity: 'error',
          });
          window.location.href = '/login';
        } else if (err.response?.status === 404) {
          setSnackbar({
            open: true,
            message: 'Oshxona topilmadi. ID ni tekshiring.',
            severity: 'error',
          });
        } else {
          setSnackbar({
            open: true,
            message: err.response?.data?.message || err.response?.data?.detail || 'Holatni o‘zgartirishda xatolik',
            severity: 'error',
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [token, axiosInstance]
  );

  const filterKitchens = useCallback(() => {
    if (!searchQuery) return kitchens;
    return kitchens.filter((kitchen) =>
      kitchen.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [kitchens, searchQuery]);

  useEffect(() => {
    fetchKitchens();
  }, [fetchKitchens]);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  if (!token) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <Alert
          severity="warning"
          action={
            <Button color="inherit" size="small" onClick={() => (window.location.href = '/login')}>
              Tizimga kirish
            </Button>
          }
        >
          Iltimos, tizimga kiring!
        </Alert>
      </Box>
    );
  }

  if (loading && !kitchens.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
        <Typography ml={2}>Oshxonalar yuklanmoqda...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={fetchKitchens}>
              Qayta urinish
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ height: '100dvh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
        <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2, display: 'flex', alignItems: 'center', gap: 2, boxShadow: 1 }}>
          <Typography variant="h6" fontWeight="medium">
            Oshxonalar Jadvali
          </Typography>
        </Box>

        <Box sx={{ flex: 'auto', overflowY: 'auto', p: 2 }}>
          <Container maxWidth="lg" disableGutters>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                Oshxonalar
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  label="Oshxonalarni qidirish"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="small"
                  sx={{ minWidth: { xs: '150px', sm: '250px' } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<RefreshIcon />}
                  onClick={fetchKitchens}
                  disabled={loading}
                >
                  Yangilash
                </Button>
              </Box>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Nomi</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Faol</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filterKitchens().map((kitchen) => (
                    <TableRow key={kitchen.id} hover>
                      <TableCell>{kitchen.name || 'Noma\'lum'}</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={kitchen.is_aktiv || false}
                          onChange={() => handleToggleActive(kitchen.id, kitchen.is_aktiv)}
                          color="primary"
                          disabled={loading}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {filterKitchens().length === 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                <Alert severity="info">
                  {searchQuery ? 'Qidiruv bo‘yicha oshxonalar topilmadi.' : 'Oshxonalar topilmadi.'}
                </Alert>
              </Box>
            )}
          </Container>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%', borderRadius: 2 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default KitchensTable;