import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, deleteUser, clearError } from '../redax/usersSlice';
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
} from '@mui/material';
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const AllUsersList = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, userId: null });
  const [success, setSuccess] = useState('');

  const handleRefresh = () => {
    dispatch(fetchUsers());
  };

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
    const result = await dispatch(deleteUser(deleteConfirm.userId));
    if (deleteUser.fulfilled.match(result)) {
      setSuccess('Foydalanuvchi muvaffaqiyatli o‘chirildi');
    }
    setDeleteConfirm({ open: false, userId: null });
  };

  const handleCloseSnackbar = () => {
    setSuccess('');
    dispatch(clearError());
  };

  const handleLoginRedirect = () => {
    localStorage.removeItem('token');
    window.location.href = '/register';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <MuiAlert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={error.includes('Autentifikatsiya xatosi') ? handleLoginRedirect : handleRefresh}
            >
              {error.includes('Autentifikatsiya xatosi') ? 'Qayta kirish' : 'Qayta urinish'}
            </Button>
          }
        >
          {error}
        </MuiAlert>
      </Box>
    );
  }

  if (users.length === 0) {
    return (
      <Box p={3}>
        <MuiAlert severity="info">
          Foydalanuvchilar ro'yxati bo'sh
        </MuiAlert>
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRefresh}
          >
            Yangilash
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Barcha Foydalanuvchilar
        </Typography>
        <IconButton color="primary" onClick={handleRefresh} title="Yangilash">
          <RefreshIcon />
        </IconButton>
      </Box>
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
                    <TableCell component="th" scope="row">{user.id}</TableCell>
                    <TableCell>{user.user?.username || 'Noma‘lum'}</TableCell>
                    <TableCell>{user.phone_number || '—'}</TableCell>
                    <TableCell>{user.address || '—'}</TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Batafsil">
                        <IconButton color="primary" onClick={() => handleViewDetails(user)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Tahrirlash (hozirda ishlamaydi)">
                        <span>
                          <IconButton color="secondary" disabled>
                            <EditIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="O'chirish">
                        <IconButton color="error" onClick={() => handleDeleteClick(user.id)}>
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
                  <Typography variant="h5">{selectedUser.user?.username || 'Noma‘lum'}</Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    ID: {selectedUser.id}
                  </Typography>
                </Box>
              </Box>
              <Box component="dl" sx={{ display: 'grid', gridTemplateColumns: 'max-content auto', gap: 2 }}>
                <Typography component="dt" fontWeight="bold">Telefon:</Typography>
                <Typography component="dd">{selectedUser.phone_number || '—'}</Typography>
                <Typography component="dt" fontWeight="bold">Manzil:</Typography>
                <Typography component="dd">{selectedUser.address || '—'}</Typography>
                <Typography component="dt" fontWeight="bold">Joylashuv:</Typography>
                <Typography component="dd">{selectedUser.location || '—'}</Typography>
                <Typography component="dt" fontWeight="bold">Ro'yxatdan o'tgan sana:</Typography>
                <Typography component="dd">{new Date(selectedUser.created_at).toLocaleString()}</Typography>
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