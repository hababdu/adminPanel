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
  Delete as DeleteIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

const AdminsPage = () => {
  const [admins, setAdmins] = useState([]);
  const [kitchens, setKitchens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone_number: '',
    kitchen_id: ''
  });

  const token = localStorage.getItem('token');
  const API_URL = 'https://hosilbek02.pythonanywhere.com/api/user/kitchen-admins/';
  const KITCHENS_API = 'https://hosilbek02.pythonanywhere.com/api/user/kitchens/';

  // Adminlar va oshxonalarni olish
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          throw new Error('Avtorizatsiya talab qilinadi. Iltimos, tizimga kiring.');
        }

        // Adminlar ro'yxatini olish
        const adminsResponse = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // Oshxonalarni olish
        const kitchensResponse = await axios.get(KITCHENS_API, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (adminsResponse.data && Array.isArray(adminsResponse.data)) {
          setAdmins(adminsResponse.data);
        } else {
          throw new Error('Adminlar ma\'lumotlari topilmadi');
        }

        if (kitchensResponse.data && Array.isArray(kitchensResponse.data)) {
          setKitchens(kitchensResponse.data);
          if (kitchensResponse.data.length > 0) {
            setFormData(prev => ({ ...prev, kitchen_id: kitchensResponse.data[0].id }));
          }
        } else {
          throw new Error('Oshxonalar ma\'lumotlari topilmadi');
        }
      } catch (error) {
        console.error('Ma\'lumotlarni olishda xatolik:', error);
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, success]);

  // Yangi admin qo'shish
  const handleAddAdmin = async () => {
    try {
      setLoading(true);
      setError('');

      // Ma'lumotlarni tekshirish
      if (!formData.username || !formData.email || !formData.password ||
          !formData.phone_number || !formData.kitchen_id) {
        throw new Error('Barcha majburiy maydonlarni to\'ldiring');
      }

      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        plain_password: formData.password,  // Oddiy matn paroli
        phone_number: formData.phone_number,
        kitchen_id: parseInt(formData.kitchen_id)
      };

      const response = await axios.post(API_URL, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });      if (response.status === 201) {
        setSuccess('Admin muvaffaqiyatli qo\'shildi');
        setOpenAddDialog(false);
        setFormData({
          username: '',
          email: '',
          password: '',
          phone_number: '',
          kitchen_id: kitchens.length > 0 ? kitchens[0].id : ''
        });
      }
    } catch (error) {
      console.error('Admin qo\'shishda xatolik:', error);

      let errorMessage = 'Admin qo\'shishda xatolik yuz berdi';

      if (error.response) {
        if (error.response.data && typeof error.response.data === 'object') {
          errorMessage = error.response.data.detail ||
                        error.response.data.message ||
                        Object.values(error.response.data).flat().join(', ');
        } else if (Array.isArray(error.response.data)) {
          errorMessage = error.response.data[0];
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

  // Adminni o'chirish
  const handleDeleteAdmin = async (adminId) => {
    try {
      const response = await axios.delete(`${API_URL}${adminId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 204) {
        setSuccess('Admin muvaffaqiyatli o\'chirildi');
        setAdmins(admins.filter(admin => admin.id !== adminId));
      }
    } catch (error) {
      console.error('Adminni o\'chirishda xatolik:', error);
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

  // Modal oynalarni yopish
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAdmin(null);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleCloseSnackbar = () => {
    setError('');
    setSuccess('');
  };

  if (loading && admins.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error && admins.length === 0) {
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
        Adminlar Boshqaruvi
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Jami: {admins.length} ta admin
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddDialog(true)}
        >
          Yangi Admin Qo'shish
        </Button>
      </Box>      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="adminlar jadvali">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Admin</TableCell>
                  <TableCell>Telefon</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Oshxona</TableCell>
                  <TableCell>Parol</TableCell>
                  <TableCell align="right">Harakatlar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow
                    key={admin.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {admin.id}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar
                          src={admin.user?.photo}
                          sx={{ width: 40, height: 40, mr: 2 }}
                        >
                          <PersonIcon />
                        </Avatar>
                        {admin.user?.username || 'Noma\'lum'}
                      </Box>
                    </TableCell>
                    <TableCell>{admin.phone_number || 'Noma\'lum'}</TableCell>
                    <TableCell>{admin.user?.email || 'Noma\'lum'}</TableCell>
                    <TableCell>
                      {admin.kitchen?.name || 'Noma\'lum'}
                    </TableCell>
                    <TableCell>{admin.password || 'Maxfiy'}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Batafsil">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setSelectedAdmin(admin);
                            setOpenDialog(true);
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="O'chirish">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteAdmin(admin.id)}
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
      </Card>      {/* Admin tafsilotlari dialogi */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Admin tafsilotlari</Typography>
            <IconButton onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedAdmin && (
            <Box>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar
                  src={selectedAdmin.user?.photo}
                  sx={{ width: 80, height: 80, mr: 2 }}
                >
                  <PersonIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h5">{selectedAdmin.user?.username || 'Noma\'lum'}</Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    ID: {selectedAdmin.id}
                  </Typography>
                </Box>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Email:</strong> {selectedAdmin.user?.email || 'Noma\'lum'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Telefon:</strong> {selectedAdmin.phone_number || 'Noma\'lum'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Oshxona:</strong> 
                    {selectedAdmin.kitchen?.name || 'Noma\'lum'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Parol:</strong> 
                    {selectedAdmin.password || 'Maxfiy'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Qo'shilgan sana:</strong> 
                    {selectedAdmin.created_at ? new Date(selectedAdmin.created_at).toLocaleString() : 'Noma\'lum'}
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
      </Dialog>      {/* Yangi admin qo'shish dialogi */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Yangi Admin Qo'shish</Typography>
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
                  inputProps={{ maxLength: 150 }}
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
                  inputProps={{ maxLength: 254 }}
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
                  inputProps={{ minLength: 8, maxLength: 128 }}
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
                  inputProps={{ pattern: "\\+998[0-9]{9}" }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Oshxona</InputLabel>
                  <Select
                    name="kitchen_id"
                    value={formData.kitchen_id}
                    onChange={handleInputChange}
                    label="Oshxona"
                  >
                    <MenuItem value="">Oshxona tanlang</MenuItem>
                    {kitchens.map(kitchen => (
                      <MenuItem key={kitchen.id} value={kitchen.id}>
                        {kitchen.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} color="secondary">
            Bekor qilish
          </Button>
          <Button
            onClick={handleAddAdmin}
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

export default AdminsPage;