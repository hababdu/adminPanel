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
  DialogActions
} from '@mui/material';
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const AllUsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, userId: null });

  const token = localStorage.getItem('token');
  const API_BASE_URL = 'https://hosilbek.pythonanywhere.com/api/user/';

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        if (!token) {
          throw new Error('Avtorizatsiya talab qilinadi. Iltimos, tizimga kiring.');
        }

        const response = await axios.get(
          `${API_BASE_URL}/user-profiles/`, // Changed from /user/orders/ to /user-profiles/
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data && Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          throw new Error('Foydalanuvchilar ma\'lumotlari topilmadi');
        }
      } catch (error) {
        console.error('Foydalanuvchilarni olishda xatolik:', error);
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, [token, success]); // Added success to dependencies to refresh after delete

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleDeleteClick = (userId) => {
    setDeleteConfirm({ open: true, userId });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ open: false, userId: null });
  };

  const handleDeleteUser = async () => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/user-profiles/${deleteConfirm.userId}/`, // Changed from /user/user-profiles/ to /user-profiles/
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 204) {
        setUsers(users.filter(user => user.id !== deleteConfirm.userId));
        setSuccess('Foydalanuvchi muvaffaqiyatli o\'chirildi');
      }
    } catch (error) {
      console.error('Foydalanuvchini o\'chirishda xatolik:', error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setDeleteConfirm({ open: false, userId: null });
    }
  };

  const handleCloseSnackbar = () => {
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error && users.length === 0) {
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

  if (users.length === 0) {
    return (
      <Box p={3}>
        <MuiAlert severity="info">
          Foydalanuvchilar ro'yxati bo'sh
        </MuiAlert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Barcha Foydalanuvchilar
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Jami: {users.length} ta foydalanuvchi
      </Typography>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Foydalanuvchi</TableCell>
                  <TableCell>Telefon</TableCell>
                  <TableCell>Manzil</TableCell>
                  <TableCell>Ro'yxatdan o'tgan sana</TableCell>
                  <TableCell align="right">Harakatlar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {user.id}
                    </TableCell>
                    <TableCell>{user.user}</TableCell>
                    <TableCell>{user.phone_number}</TableCell>
                    <TableCell>{user.address}</TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Batafsil">
                        <IconButton
                          color="primary"
                          onClick={() => handleViewDetails(user)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Tahrirlash">
                        <IconButton color="secondary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="O'chirish">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(user.id)}
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

      {/* Foydalanuvchi tafsilotlari dialogi */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Foydalanuvchi tafsilotlari</Typography>
            <IconButton onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedUser && (
            <Box>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar sx={{ width: 60, height: 60, mr: 2, bgcolor: 'primary.main' }}>
                  <PersonIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h5">{selectedUser.user}</Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    ID: {selectedUser.id}
                  </Typography>
                </Box>
              </Box>

              <Box component="dl" sx={{ display: 'grid', gridTemplateColumns: 'max-content auto', gap: 2 }}>
                <Typography component="dt" fontWeight="bold">Telefon:</Typography>
                <Typography component="dd">{selectedUser.phone_number}</Typography>

                <Typography component="dt" fontWeight="bold">Manzil:</Typography>
                <Typography component="dd">{selectedUser.address}</Typography>

                <Typography component="dt" fontWeight="bold">Joylashuv:</Typography>
                <Typography component="dd">{selectedUser.location}</Typography>

                <Typography component="dt" fontWeight="bold">Ro'yxatdan o'tgan sana:</Typography>
                <Typography component="dd">
                  {new Date(selectedUser.created_at).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Yopish
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm.open} onClose={handleDeleteCancel}>
        <DialogTitle>Foydalanuvchini o'chirish</DialogTitle>
        <DialogContent>
          <Typography>Haqiqatan ham bu foydalanuvchini o'chirmoqchimisiz?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Bekor qilish</Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            O'chirish
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

export default AllUsersList;