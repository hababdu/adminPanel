import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  Button,
  Card,
  CardContent,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Grid,
  Paper,
  Badge,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Refresh,
  CheckCircle,
  LocalShipping,
  Restaurant,
  Payment,
  LocationOn,
  Phone,
  AccessTime,
  Notifications as NotificationsIcon,
  ExpandMore,
  ExpandLess,
  Assignment,
  Edit,
  Timer
} from '@mui/icons-material';

const ORDERS_API = 'https://hosilbek.pythonanywhere.com/api/user/orders/';
const BASE_URL = 'https://hosilbek.pythonanywhere.com';

const AdminOrdersDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastFetch, setLastFetch] = useState(null);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [isInitialFetch, setIsInitialFetch] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [kitchenHours, setKitchenHours] = useState('');
  const [kitchenMinutes, setKitchenMinutes] = useState('');
  const [dialogError, setDialogError] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const navigate = useNavigate();

  const notificationSound = new Audio('/sounds/notification.mp3');

  const fetchOrders = async () => {
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Tizimga kirish talab qilinadi');
      localStorage.setItem('authError', 'Tizimga kirish talab qilinadi. Iltimos, login qiling.');
      navigate('/login', { replace: true });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(ORDERS_API, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const ordersData = Array.isArray(response.data) ? response.data : [];
      const newOrders = ordersData.filter(
        newOrder => !orders.some(prevOrder => prevOrder.id === newOrder.id)
      );
      if (!isInitialFetch && newOrders.length > 0) {
        setNewOrdersCount(prev => prev + newOrders.length);
        if (soundEnabled) {
          notificationSound.play().catch(err => {
            console.error('Ovoz ijro etishda xato:', err);
          });
        }
      }

      setOrders(ordersData);
      setLastFetch(new Date().toISOString());
      setIsInitialFetch(false);
    } catch (err) {
      handleFetchError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchError = (err) => {
    let errorMessage = 'Buyurtmalarni olishda xato yuz berdi';
    if (err.response) {
      console.error('API xato javobi:', err.response.data);
      if (err.response.status === 401) {
        errorMessage = 'Sessiya tugagan. Iltimos, qayta kiring';
        localStorage.setItem('authError', errorMessage);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userProfile');
        navigate('/login', { replace: true });
      } else {
        errorMessage = err.response.data?.detail || err.response.data?.message || JSON.stringify(err.response.data) || errorMessage;
      }
    } else if (err.request) {
      errorMessage = 'Internet aloqasi yo‘q';
    }
    setError(errorMessage);
  };

  const openEditDialog = (order) => {
    setCurrentOrder(order);
    if (order.kitchen_time) {
      if (typeof order.kitchen_time === 'string' && order.kitchen_time.includes(':')) {
        const [hours, minutes] = order.kitchen_time.split(':').map(Number);
        setKitchenHours(hours || '');
        setKitchenMinutes(minutes || '');
      } else {
        const totalMinutes = parseInt(order.kitchen_time);
        setKitchenHours(Math.floor(totalMinutes / 60));
        setKitchenMinutes(totalMinutes % 60);
      }
    } else {
      setKitchenHours('');
      setKitchenMinutes('');
    }
    setDialogError('');
    setEditDialogOpen(true);
  };

  const handleUpdateKitchenTime = async () => {
    if (!currentOrder) {
      setDialogError('Buyurtma tanlanmagan');
      return;
    }

    const hours = parseInt(kitchenHours) || 0;
    const minutes = parseInt(kitchenMinutes) || 0;
    const totalMinutes = hours * 60 + minutes;

    if (totalMinutes < 5 || totalMinutes > 180) {
      setDialogError('Vaqt 5 daqiqadan 3 soatgacha bo‘lishi kerak');
      return;
    }

    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setDialogError('Tizimga qayta kirish kerak');
        navigate('/login', { replace: true });
        return;
      }

      const updateUrl = `https://hosilbek.pythonanywhere.com/api/user/orders/${currentOrder.id}/`;
      console.log('So‘rov ma’lumotlari:', {
        url: updateUrl,
        data: { kitchen_time: formattedTime },
        headers: { Authorization: `Bearer ${token}` }
      });

      const response = await axios.patch(
        updateUrl,
        { kitchen_time: formattedTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('API javobi:', response.data);

      setEditDialogOpen(false);
      setKitchenHours('');
      setKitchenMinutes('');
      fetchOrders();
    } catch (err) {
      let errorMessage = 'Vaqtni yangilashda xato yuz berdi';
      if (err.response) {
        console.error('API xato javobi:', err.response.data);
        if (err.response.status === 404) {
          errorMessage = 'Buyurtma topilmadi';
        } else {
          errorMessage = err.response.data?.detail || err.response.data?.message || JSON.stringify(err.response.data) || errorMessage;
        }
      }
      setDialogError(errorMessage);
    }
  };

  const testSound = () => {
    notificationSound.play().catch(err => {
      console.error('Sinov ovozi xatosi:', err);
    });
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const getStatusChip = (status) => {
    const statusMap = {
      'buyurtma_tushdi': { label: 'Yangi', color: 'primary', icon: <AccessTime /> },
      'qabul_qilindi': { label: 'Qabul qilindi', color: 'secondary', icon: <CheckCircle /> },
      'yetkazilmoqda': { label: 'Yetkazilmoqda', color: 'warning', icon: <LocalShipping /> },
      'yetkazib_berildi': { label: 'Yetkazib berildi', color: 'success', icon: <CheckCircle /> },
      'oshxona_vaqt_belgiladi': { label: 'Oshxona vaqt belgiladi', color: 'info', icon: <Timer /> },
    };

    const config = statusMap[status] || { label: status, color: 'default' };
    return (
      <Chip
        label={config.label}
        color={config.color}
        icon={config.icon}
        size="small"
        variant="outlined"
        sx={{ fontWeight: 'medium' }}
      />
    );
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const formatTime = (kitchenTime) => {
    if (!kitchenTime) return 'Belgilanmagan';
    if (typeof kitchenTime === 'string' && kitchenTime.includes(':')) {
      const [hours, minutes] = kitchenTime.split(':').map(Number);
      return `${hours > 0 ? `${hours} soat` : ''} ${minutes > 0 ? `${minutes} minut` : ''}`.trim();
    }
    const hours = Math.floor(kitchenTime / 60);
    const mins = kitchenTime % 60;
    return `${hours > 0 ? `${hours} soat` : ''} ${mins > 0 ? `${mins} minut` : ''}`.trim();
  };

  if (loading && orders.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 3, borderRadius: 2 }}>
        {error}
        <Button onClick={fetchOrders} sx={{ ml: 2, color: 'error.main' }}>Qayta urinish</Button>
      </Alert>
    );
  }

  if (orders.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Hozirda buyurtmalar mavjud emas
        </Typography>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={fetchOrders}
          sx={{ mt: 2 }}
        >
          Yangilash
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, bgcolor: 'background.default' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold" color="primary.main">
          Buyurtmalar Paneli
          {newOrdersCount > 0 && (
            <Badge
              badgeContent={newOrdersCount}
              color="error"
              sx={{ ml: 2, verticalAlign: 'middle' }}
            >
              <NotificationsIcon color="action" />
            </Badge>
          )}
        </Typography>
        <Stack direction="row" spacing={2}>
          <FormControlLabel
            control={<Switch checked={soundEnabled} onChange={() => setSoundEnabled(prev => !prev)} />}
            label="Ovozli bildirishnomalar"
            sx={{ mr: 2 }}
          />
          <Button
            variant="outlined"
            onClick={testSound}
            sx={{ borderRadius: 2 }}
          >
            Ovoz sinovi
          </Button>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={fetchOrders}
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              boxShadow: '0 3px 5px 2px rgba(25, 118, 210, .3)'
            }}
          >
            Yangilash
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={3} mb={4}>
        {[
          { title: 'Jami Buyurtmalar', value: orders.length, color: 'text.primary' },
          { title: 'Yangi Buyurtmalar', value: orders.filter(o => ['buyurtma_tushdi', 'oshxona_vaqt_belgiladi'].includes(o.status)).length, color: 'primary.main' },
          { title: 'Jarayonda', value: orders.filter(o => o.status === 'yetkazilmoqda').length, color: 'warning.main' },
          { title: 'Bajarilgan', value: orders.filter(o => o.status === 'yetkazib_berildi').length, color: 'success.main' }
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={4}
              sx={{
                p: 3,
                borderRadius: 3,
                borderLeft: `4px solid ${item.color}`,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.02)' }
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">{item.title}</Typography>
              <Typography variant="h4" color={item.color} fontWeight="bold">{item.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper elevation={4} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                {[
                  { key: 'id', label: 'Buyurtma ID' },
                  { key: 'created_at', label: 'Sana' },
                  { label: 'Restoran' },
                  { label: 'Mijoz' },
                  { label: 'Oshxona vaqti' },
                  { label: 'Holati' },
                  { label: 'Harakatlar' }
                ].map((header, index) => (
                  <TableCell key={index}>
                    {header.key ? (
                      <TableSortLabel
                        active={sortConfig.key === header.key}
                        direction={sortConfig.key === header.key ? sortConfig.direction : 'desc'}
                        onClick={() => handleSort(header.key)}
                      >
                        {header.label}
                      </TableSortLabel>
                    ) : (
                      header.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <TableRow
                    hover
                    sx={{
                      '&:hover': { bgcolor: 'grey.50' },
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleString('uz-UZ')}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {order.kitchen?.name || 'Mavjud emas'}
                      </Typography>
                    </TableCell>
                    <TableCell>{order.user}</TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Timer color={order.kitchen_time ? 'primary' : 'disabled'} />
                        <Typography variant="body2">{formatTime(order.kitchen_time)}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{getStatusChip(order.status)}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Tafsilotlarni ko‘rish">
                          <IconButton onClick={() => toggleOrderExpand(order.id)} size="small">
                            {expandedOrder === order.id ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        </Tooltip>
                        {['buyurtma_tushdi', 'oshxona_vaqt_belgiladi'].includes(order.status) && (
                          <Tooltip title="Oshxona vaqtini belgilash">
                            <IconButton
                              onClick={() => openEditDialog(order)}
                              size="small"
                              color="primary"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                  {expandedOrder === order.id && (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ p: 0, bgcolor: 'grey.50' }}>
                        <Box sx={{ p: 3 }}>
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                              <Card
                                variant="outlined"
                                sx={{
                                  borderRadius: 2,
                                  borderColor: ['buyurtma_tushdi', 'oshxona_vaqt_belgiladi'].includes(order.status) ? 'primary.main' : 'grey.300'
                                }}
                              >
                                <CardContent>
                                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                                    Buyurtma Tafsilotlari
                                  </Typography>
                                  <Divider sx={{ mb: 2 }} />
                                  <Stack spacing={2}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                      <Phone fontSize="small" color="action" />
                                      <Typography variant="body2">{order.contact_number}</Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                      <LocationOn fontSize="small" color="action" />
                                      <Typography variant="body2">{order.shipping_address}</Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                      <Payment fontSize="small" color="action" />
                                      <Typography variant="body2">
                                        To‘lov: {order.payment === 'naqd' ? 'Naqd' : 'Karta'}
                                      </Typography>
                                    </Stack>
                                    {order.notes && (
                                      <Stack direction="row" spacing={1} alignItems="center">
                                        <Assignment fontSize="small" color="action" />
                                        <Typography variant="body2">Eslatmalar: {order.notes}</Typography>
                                      </Stack>
                                    )}
                                    <Stack direction="row" spacing={1} alignItems="center">
                                      <Timer fontSize="small" color="action" />
                                      <Typography variant="body2">
                                        Oshxona vaqti: {formatTime(order.kitchen_time)}
                                      </Typography>
                                    </Stack>
                                  </Stack>
                                </CardContent>
                              </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                                <CardContent>
                                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                                    Buyurtma Mahsulotlari ({order.items.length})
                                  </Typography>
                                  <Divider sx={{ mb: 2 }} />
                                  <List dense disablePadding>
                                    {order.items.map((item, index) => (
                                      <ListItem key={index} disablePadding sx={{ py: 1.5 }}>
                                        <ListItemAvatar>
                                          <Avatar
                                            variant="rounded"
                                            src={item.product?.photo ? `${BASE_URL}${item.product.photo}` : undefined}
                                            sx={{ bgcolor: 'grey.200', width: 48, height: 48 }}
                                          >
                                            <Restaurant fontSize="small" />
                                          </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                          primary={
                                            <Typography variant="body2" fontWeight="medium">
                                              {item.product?.title || 'Noma’lum Mahsulot'}
                                            </Typography>
                                          }
                                          secondary={
                                            <Stack component="span">
                                              <Typography variant="body2" component="span">
                                                {item.quantity} × {item.price} so‘m
                                              </Typography>
                                              <Typography variant="caption" color="text.secondary">
                                                {item.product?.description?.substring(0, 60)}...
                                              </Typography>
                                            </Stack>
                                          }
                                        />
                                        <Typography variant="body2" fontWeight="bold">
                                          {item.quantity * parseFloat(item.price)} so‘m
                                        </Typography>
                                      </ListItem>
                                    ))}
                                  </List>
                                </CardContent>
                              </Card>
                            </Grid>
                          </Grid>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
          Oshxona Vaqtini Belgilash
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3} sx={{ minWidth: 300 }}>
            <TextField
              label="Soat"
              type="number"
              fullWidth
              value={kitchenHours}
              onChange={(e) => setKitchenHours(e.target.value)}
              InputProps={{ inputProps: { min: 0, max: 3 } }}
              helperText="0-3 soat oralig‘ida kiriting"
            />
            <TextField
              label="Minut"
              type="number"
              fullWidth
              value={kitchenMinutes}
              onChange={(e) => setKitchenMinutes(e.target.value)}
              InputProps={{ inputProps: { min: 0, max: 59 } }}
              helperText="0-59 minut oralig‘ida kiriting"
            />
            {dialogError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {dialogError}
              </Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setEditDialogOpen(false)}
            sx={{ color: 'text.secondary' }}
          >
            Bekor qilish
          </Button>
          <Button
            onClick={handleUpdateKitchenTime}
            variant="contained"
            disabled={!kitchenHours && !kitchenMinutes}
            sx={{ borderRadius: 2 }}
          >
            Saqlash
          </Button>
        </DialogActions>
      </Dialog>

      {lastFetch && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 3, display: 'block', textAlign: 'center' }}
        >
          Oxirgi yangilanish: {new Date(lastFetch).toLocaleString('uz-UZ')}
        </Typography>
      )}
    </Box>
  );
};

export default AdminOrdersDashboard;