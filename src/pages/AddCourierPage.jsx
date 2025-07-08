import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Snackbar,
  Alert as MuiAlert,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

const CouriersPage = () => {
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone_number: '',
    photo: null,
    passport_series: '',
    passport_number: ''
  });

  const token = localStorage.getItem('token');

  // Barcha kuryerlarni olish
  useEffect(() => {
    const fetchCouriers = async () => {
      try {
        if (!token) {
          throw new Error('Avtorizatsiya talab qilinadi. Iltimos, tizimga kiring.');
        }

        const response = await axios.get(
          'https://hosilbek02.pythonanywhere.com/api/user/couriers/',
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data && Array.isArray(response.data)) {
          setCouriers(response.data);
        } else {
          throw new Error('Kuryerlar ma\'lumotlari topilmadi');
        }
      } catch (error) {
        console.error('Kuryerlarni olishda xatolik:', error);
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCouriers();
  }, [token, success]);

  // Yangi kuryer qo'shish
  const handleAddCourier = async () => {
    try {
      setLoading(true);
      setError('');
  
      // Ma'lumotlarni tekshirish
      if (!formData.username || !formData.email || !formData.password || 
          !formData.phone_number || !formData.passport_series || !formData.passport_number) {
        throw new Error('Barcha majburiy maydonlarni to\'ldiring');
      }
  
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('phone_number', formData.phone_number);
      formDataToSend.append('passport_series', formData.passport_series);
      formDataToSend.append('passport_number', formData.passport_number);
      
      // Agar rasm tanlangan bo'lsa
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }
  
      // Debug uchun FormData ni ko'rish
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }
  
      const response = await axios.post(
        'https://hosilbek02.pythonanywhere.com/api/user/couriers/',
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          timeout: 10000
        }
      );
  
      console.log('Server javobi:', response);
  
      if (response.status === 201) {
        setSuccess('Kuryer muvaffaqiyatli qo\'shildi');
        setOpenAddDialog(false);
        setFormData({
          username: '',
          email: '',
          password: '',
          phone_number: '',
          photo: null,
          passport_series: '',
          passport_number: ''
        });
      }
    } catch (error) {
      console.error('Kuryer qo\'shishda xatolik:', error);
      
      let errorMessage = 'Kuryer qo\'shishda xatolik yuz berdi';
      
      if (error.response) {
        // Agar serverdan tushunarli xabar kelgan bo'lsa
        if (error.response.data && typeof error.response.data === 'object') {
          errorMessage = error.response.data.detail || 
                        error.response.data.message || 
                        JSON.stringify(error.response.data);
        } else {
          errorMessage = `Server xatosi (${error.response.status})`;
        }
        
        console.error('Server xato javobi:', {
          status: error.response.status,
          headers: error.response.headers,
          data: error.response.data,
        });
      } else if (error.request) {
        errorMessage = 'Serverga ulanib bo\'lmadi. Internet aloqasini tekshiring';
      } else {
        errorMessage = error.message || 'Noma\'lum xatolik yuz berdi';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Kuryerni o'chirish
  const handleDeleteCourier = async (courierId) => {
    try {
      const response = await axios.delete(
        `https://hosilbek.pythonanywhere.com/api/user/couriers/${courierId}/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 204) {
        setSuccess('Kuryer muvaffaqiyatli o\'chirildi');
      }
    } catch (error) {
      console.error('Kuryerni o\'chirishda xatolik:', error);
      setError(error.response?.data?.message || error.message);
    }
  };

  // Form inputlarini boshqarish
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Rasmni tanlash
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      photo: e.target.files[0]
    });
  };

  // Modal oynalarni yopish
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCourier(null);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleCloseSnackbar = () => {
    setError('');
    setSuccess('');
  };

  if (loading && couriers.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error && couriers.length === 0) {
    return (
      <Box p={3}>
        <MuiAlert severity="error">
          {error}
        </MuiAlert>
        <Box mt={2}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => window.location.reload()}
          >
            Qayta urinish
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Kuryerlar Boshqaruvi
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Jami: {couriers.length} ta kuryer
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddDialog(true)}
        >
          Yangi Kuryer Qo'shish
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Kuryer</TableCell>
                  <TableCell>Telefon</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Passport</TableCell>
                  <TableCell align="right">Harakatlar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {couriers.map((courier) => (
                  <TableRow
                    key={courier.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {courier.id}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar 
                          src={courier.photo} 
                          sx={{ width: 40, height: 40, mr: 2 }}
                        >
                          <PersonIcon />
                        </Avatar>
                        {courier.username}
                      </Box>
                    </TableCell>
                    <TableCell>{courier.phone_number}</TableCell>
                    <TableCell>{courier.email}</TableCell>
                    <TableCell>
                      {courier.passport_series} {courier.passport_number}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Batafsil">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setSelectedCourier(courier);
                            setOpenDialog(true);
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="O'chirish">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteCourier(courier.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Kuryer tafsilotlari dialogi */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Kuryer tafsilotlari</Typography>
            <IconButton onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedCourier && (
            <Box>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar 
                  src={selectedCourier.photo} 
                  sx={{ width: 80, height: 80, mr: 2 }}
                >
                  <PersonIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h5">{selectedCourier.username}</Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    ID: {selectedCourier.id}
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Email:</strong> {selectedCourier.email}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Telefon:</strong> {selectedCourier.phone_number}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Passport seriya:</strong> {selectedCourier.passport_series}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Passport raqam:</strong> {selectedCourier.passport_number}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Qo'shilgan sana:</strong> {new Date(selectedCourier.created_at).toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Yopish
          </Button>
        </DialogActions>
      </Dialog>

      {/* Yangi kuryer qo'shish dialogi */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Yangi Kuryer Qo'shish</Typography>
            <IconButton onClick={handleCloseAddDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Foydalanuvchi nomi"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Parol"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Telefon raqami"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                  placeholder="+998901234567"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Passport seriyasi"
                  name="passport_series"
                  value={formData.passport_series}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Passport raqami"
                  name="passport_number"
                  value={formData.passport_number}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  Rasm Yuklash
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
                {formData.photo && (
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Tanlangan fayl: {formData.photo.name}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} color="secondary">
            Bekor qilish
          </Button>
          <Button 
            onClick={handleAddCourier} 
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Qo'shish"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Xabar qutisi */}
      <Snackbar
        open={!!success || !!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity={error ? 'error' : 'success'}
          elevation={6}
          variant="filled"
        >
          {error || success}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default CouriersPage;