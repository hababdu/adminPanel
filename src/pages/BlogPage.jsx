import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  Snackbar, Alert, CircularProgress, Avatar
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Kitchen, Delete, Edit } from '@mui/icons-material';

// MUI temasi (AddProductPage bilan moslashtirilgan)
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
    h5: { fontWeight: 600, fontSize: '1.25rem' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, textTransform: 'none', padding: '8px 20px' },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': { borderRadius: 8 },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
  },
});

const KitchenListPage = () => {
  const [kitchens, setKitchens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedKitchen, setSelectedKitchen] = useState(null);
  const [editName, setEditName] = useState('');
  const token = localStorage.getItem('token');

  // Oshxonalarni olish
  const fetchKitchens = async () => {
    if (!token) {
      setError('Autentifikatsiya tokeni topilmadi. Iltimos, tizimga kiring.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        'https://hosilbek.pythonanywhere.com/api/user/kitchens/',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Ma’lumotlarni validatsiya qilish
      if (!Array.isArray(response.data)) {
        throw new Error('Oshxona ma’lumotlari noto‘g‘ri: Massiv kutilmoqda');
      }
      const ids = new Set();
      response.data.forEach(item => {
        if (!item.id || ids.has(item.id)) {
          throw new Error('Oshxona ma’lumotlari noto‘g‘ri: Takrorlangan yoki yo‘q ID');
        }
        ids.add(item.id);
      });
      setKitchens(response.data);
      setError('');
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Token yaroqsiz yoki muddati o‘tgan. Iltimos, qayta kiring.');
      } else if (err.response?.status === 500) {
        setError('Serverda ichki xato yuz berdi. Iltimos, keyinroq qayta urinib ko‘ring.');
      } else {
        setError(err.response?.data?.message || 'Oshxonalarni olishda xato: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Komponent yuklanganda oshxonalarni olish
  useEffect(() => {
    fetchKitchens();
  }, [token]);

  // Oshxonani o‘chirish
  const handleDeleteKitchen = async () => {
    if (!selectedKitchen || !token) {
      setError('Oshxonani o‘chirish uchun ma’lumotlar yetarli emas.');
      return;
    }
    setLoading(true);
    try {
      await axios.delete(
        `https://hosilbek.pythonanywhere.com/api/user/kitchens/${selectedKitchen.id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setKitchens(prev => prev.filter(k => k.id !== selectedKitchen.id));
      setSuccess('Oshxona muvaffaqiyatli o‘chirildi!');
      setOpenDeleteDialog(false);
      setSelectedKitchen(null);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Token yaroqsiz yoki muddati o‘tgan. Iltimos, qayta kiring.');
      } else if (err.response?.status === 500) {
        setError('Serverda ichki xato yuz berdi. Iltimos, keyinroq qayta urinib ko‘ring.');
      } else {
        setError(err.response?.data?.message || 'Oshxonani o‘chirishda xato.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Oshxonani tahrirlash
  const handleEditKitchen = async () => {
    if (!selectedKitchen || !editName || editName.trim().length < 3) {
      setError('Oshxona nomi kamida 3 belgidan iborat bo‘lishi kerak.');
      return;
    }
    if (!token) {
      setError('Autentifikatsiya tokeni topilmadi. Iltimos, tizimga kiring.');
      return;
    }
    if (kitchens.some(k => k.name.toLowerCase() === editName.toLowerCase() && k.id !== selectedKitchen.id)) {
      setError('Bu nomdagi oshxona allaqachon mavjud.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.put(
        `https://hosilbek.pythonanywhere.com/api/user/kitchens/${selectedKitchen.id}/`,
        { name: editName.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setKitchens(prev => prev.map(k => k.id === selectedKitchen.id ? response.data : k));
      setSuccess('Oshxona muvaffaqiyatli tahrirlandi!');
      setOpenEditDialog(false);
      setSelectedKitchen(null);
      setEditName('');
    } catch (err) {
      if (err.response?.status === 400) {
        setError('Noto‘g‘ri ma’lumotlar yuborildi: ' + (err.response?.data?.message || 'Nomni tekshiring.'));
      } else if (err.response?.status === 401) {
        setError('Token yaroqsiz yoki muddati o‘tgan. Iltimos, qayta kiring.');
      } else if (err.response?.status === 500) {
        setError('Serverda ichki xato yuz berdi. Iltimos, keyinroq qayta urinib ko‘ring.');
      } else {
        setError(err.response?.data?.message || 'Oshxonani tahrirlashda xato.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Dialoglarni ochish/yopish
  const handleOpenEditDialog = (kitchen) => {
    setSelectedKitchen(kitchen);
    setEditName(kitchen.name);
    setOpenEditDialog(true);
  };

  const handleOpenDeleteDialog = (kitchen) => {
    setSelectedKitchen(kitchen);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
    setSelectedKitchen(null);
    setEditName('');
    setError('');
  };

  // Snackbar yopish
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setError('');
    setSuccess('');
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="md">
          <Paper sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)' }}>
            <Box textAlign="center" mb={4}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mx: 'auto' }}>
                <Kitchen fontSize="large" />
              </Avatar>
              <Typography variant="h4" mt={2}>Oshxona Ro‘yxati</Typography>
            </Box>

            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : kitchens.length === 0 ? (
              <Typography textAlign="center" color="textSecondary">
                Oshxonalar topilmadi.
              </Typography>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><Typography fontWeight="bold">ID</Typography></TableCell>
                      <TableCell><Typography fontWeight="bold">Nomi</Typography></TableCell>
                      <TableCell align="right"><Typography fontWeight="bold">Amallar</Typography></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {kitchens.map(kitchen => (
                      <TableRow key={kitchen.id} hover>
                        <TableCell>{kitchen.id}</TableCell>
                        <TableCell>{kitchen.name}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenEditDialog(kitchen)}
                            disabled={loading}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            onClick={() => handleOpenDeleteDialog(kitchen)}
                            disabled={loading}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>

          {/* Tahrirlash dialogi */}
          <Dialog open={openEditDialog} onClose={handleCloseDialog}>
            <DialogTitle>Oshxonani Tahrirlash</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Oshxona Nomi"
                fullWidth
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                error={!!error}
                helperText={error}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} disabled={loading}>Bekor Qilish</Button>
              <Button
                onClick={handleEditKitchen}
                color="primary"
                disabled={loading || !editName}
              >
                Saqlash
              </Button>
            </DialogActions>
          </Dialog>

          {/* O‘chirish dialogi */}
          <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
            <DialogTitle>Oshxonani O‘chirish</DialogTitle>
            <DialogContent>
              <Typography>
                Haqiqatdan ham <strong>{selectedKitchen?.name}</strong> oshxonasini o‘chirmoqchimisiz?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} disabled={loading}>Bekor Qilish</Button>
              <Button
                onClick={handleDeleteKitchen}
                color="secondary"
                disabled={loading}
              >
                O‘chirish
              </Button>
            </DialogActions>
          </Dialog>

          {/* Xabarlar */}
          <Snackbar open={!!error || !!success} autoHideDuration={6000} onClose={handleCloseSnackbar}>
            <Alert onClose={handleCloseSnackbar} severity={error ? 'error' : 'success'}>
              {error || success}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default KitchenListPage;