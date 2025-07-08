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

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const API_URL = 'https://hosilbek02.pythonanywhere.com/api/user/products/';
  const token = localStorage.getItem('token');

  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: { Authorization: token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' },
  });

  const fetchProducts = useCallback(async () => {
    if (!token) {
      setError('Foydalanuvchi tizimga kirmagan');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const { data } = await axiosInstance.get('');
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Mahsulotlarni yuklab bo‘lmadi');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleToggleActive = useCallback(
    async (productId, isActive) => {
      if (!token) {
        setSnackbar({ open: true, message: 'Foydalanuvchi tizimga kirmagan', severity: 'error' });
        return;
      }
      try {
        setLoading(true);
        // PATCH so'rovi orqali is_aktiv holatini o'zgartirish
        const response = await axiosInstance.patch(`${productId}/`, { is_aktiv: !isActive });
        setProducts((prev) =>
          prev.map((product) =>
            product.id === productId ? { ...product, is_aktiv: !isActive } : product
          )
        );
        setSnackbar({
          open: true,
          message: `Mahsulot ${!isActive ? 'faollashtirildi' : 'noaktiv qilindi'}!`,
          severity: 'success',
        });
      } catch (err) {
        console.error('Xato tafsilotlari:', err.response?.data); // Xato haqida batafsil ma'lumot
        setSnackbar({
          open: true,
          message: err.response?.data?.message || err.response?.data?.detail || 'Holatni o‘zgartirishda xatolik',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    },
    [token, axiosInstance]
  );

  const filterProducts = useCallback(() => {
    if (!searchQuery) return products;
    return products.filter((product) =>
      product.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  if (!token) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <Alert severity="warning">Iltimos, tizimga kiring!</Alert>
      </Box>
    );
  }

  if (loading && !products.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
        <Typography ml={2}>Mahsulotlar yuklanmoqda...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={fetchProducts}>
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
            Mahsulotlar Jadvali
          </Typography>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
          <Container maxWidth="lg" disableGutters>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                Mahsulotlar
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  label="Mahsulotlarni qidirish"
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
                  onClick={fetchProducts}
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
                    <TableCell sx={{ fontWeight: 'bold' }}>Narx (so‘m)</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Faol</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filterProducts().map((product) => (
                    <TableRow key={product.id} hover>
                      <TableCell>{product.title || 'Noma\'lum'}</TableCell>
                      <TableCell>{parseFloat(product.price || 0).toLocaleString()}</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={product.is_aktiv || false}
                          onChange={() => handleToggleActive(product.id, product.is_aktiv)}
                          color="primary"
                          disabled={loading}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {filterProducts().length === 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                <Alert severity="info">
                  {searchQuery ? 'Qidiruv bo‘yicha mahsulotlar topilmadi.' : 'Mahsulotlar topilmadi.'}
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
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: 2 }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default ProductsTable;