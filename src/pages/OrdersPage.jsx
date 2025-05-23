
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
  Tabs,
  Tab,
  TextField,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Collapse,
  useMediaQuery,
  ThemeProvider,
  createTheme,
  MenuItem,
  Select
} from '@mui/material';
import {
  Refresh,
  CheckCircle,
  LocalShipping,
  Restaurant,
  Payment,
  Phone,
  AccessTime,
  Notifications as NotificationsIcon,
  ExpandMore,
  ExpandLess,
  Assignment,
  Edit,
  Timer,
  Search,
  Person,
  Delete
} from '@mui/icons-material';
import audio from '../assets/notification.mp3';

// API manzillari
const ORDERS_API = 'https://hosilbek.pythonanywhere.com/api/user/orders/';
const COURIERS_API = 'https://hosilbek.pythonanywhere.com/api/user/couriers/';
const BASE_URL = 'https://hosilbek.pythonanywhere.com';
const ACCEPT_ORDER_API = 'https://hosilbek.pythonanywhere.com/api/user/orders/';
const REMOVE_COURIER_API = 'https://hosilbek.pythonanywhere.com/api/user/remove_courier/';
const ASSIGN_COURIER_API = 'https://hosilbek.pythonanywhere.com/api/user/assign_courier/';
const REPLACE_COURIER_API = 'https://hosilbek.pythonanywhere.com/api/user/orders/replace_courier/';

// Modern tema
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#f50057' },
    background: { default: '#f5f7fa' }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 6px 24px rgba(0,0,0,0.15)' }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 600
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          padding: '12px 16px'
        }
      }
    }
  }
});

  const AdminOrdersDashboard = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastFetch, setLastFetch] = useState(null);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [kitchenHours, setKitchenHours] = useState('');
  const [kitchenMinutes, setKitchenMinutes] = useState('');
  const [dialogError, setDialogError] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isInitialFetch, setIsInitialFetch] = useState(true);
  const [editCourierDialogOpen, setEditCourierDialogOpen] = useState(false);
  const [newCourierId, setNewCourierId] = useState('');
  const [courierDialogError, setCourierDialogError] = useState('');
  const [couriers, setCouriers] = useState([]);
  const [isFetchingCouriers, setIsFetchingCouriers] = useState(false);
  const [courierSuccess, setCourierSuccess] = useState('');

  // Ovoz faylini Audio ob'ekti sifatida yaratish
  const notificationSound = new Audio(audio);

  // Ovoz faylini oldindan yuklash
  useEffect(() => {
    notificationSound.load();
    return () => {
      notificationSound.pause();
      notificationSound.currentTime = 0;
    };
  }, []);

  // Kuryerlar ro‘yxatini olish
  const fetchCouriers = async () => {
    setIsFetchingCouriers(true);
    setCourierDialogError('');
    setCourierSuccess('');
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Tizimga kirish talab qilinadi');
      navigate('/login', { replace: true });
      setIsFetchingCouriers(false);
      return;
    }

    try {
      const response = await axios.get(COURIERS_API, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const courierData = Array.isArray(response.data) ? response.data : [];
      setCouriers(courierData);
      setCourierSuccess('Kuryerlar ro‘yxati yangilandi');
      setTimeout(() => setCourierSuccess(''), 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Kuryerlar ro‘yxatini olishda xato';
      setCourierDialogError(errorMessage);
      console.error('Kuryerlarni olishda xato:', err);
    } finally {
      setIsFetchingCouriers(false);
    }
  };

  // Buyurtmalarni olish
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
        headers: { Authorization: `Bearer ${token}` }
      });

      const ordersData = Array.isArray(response.data) ? response.data : [];
      console.log('Buyurtmalar:', ordersData);
      const newOrders = ordersData.filter(
        newOrder => !orders.some(prevOrder => prevOrder.id === newOrder.id) &&
                    ['buyurtma_tushdi', 'oshxona_vaqt_belgiladi'].includes(newOrder.status)
      );

      if (!isInitialFetch && newOrders.length > 0) {
        setNewOrdersCount(prev => prev + newOrders.length);
        if (soundEnabled) {
          try {
            await notificationSound.play();
            console.log(`Ovozli bildirishnoma: ${newOrders.length} yangi buyurtma`);
          } catch (err) {
            console.error('Ovoz xatosi:', err);
            setError('Ovozli bildirishnoma ijro etilmadi');
          }
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

  // Xato boshqaruvi
  const handleFetchError = (err) => {
    let errorMessage = 'Buyurtmalarni olishda xato';
    if (err.response) {
      if (err.response.status === 401) {
        errorMessage = 'Sessiya tugagan. Iltimos, qayta kiring';
        localStorage.setItem('authError', errorMessage);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userProfile');
        navigate('/login', { replace: true });
      } else if (err.response.status === 500) {
        errorMessage = 'Server xatosi. Keyinroq urinib ko‘ring';
      } else {
        errorMessage = err.response.data?.detail || err.response.data?.message || JSON.stringify(err.response.data) || errorMessage;
      }
    } else if (err.request) {
      errorMessage = 'Internet aloqasi yo‘q';
    }
    setError(errorMessage);
  };

  // Buyurtmani qabul qilish
  const handleAcceptOrder = async (orderId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Tizimga kirish talab qilinadi');
      navigate('/login', { replace: true });
      return;
    }

    try {
      await axios.post(
        `${ACCEPT_ORDER_API}${orderId}/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.detail || 'Buyurtmani qabul qilishda xato');
    }
  };

  // Buyurtmani qaytarish (kuryerni olib tashlash)
  const handleRemoveCourier = async (orderId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Tizimga kirish talab qilinadi');
      navigate('/login', { replace: true });
      return;
    }

    try {
      await axios.post(
        `${REMOVE_COURIER_API}${orderId}/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourierSuccess('Kuryer buyurtmadan olib tashlandi');
      setTimeout(() => setCourierSuccess(''), 3000);
      fetchOrders();
    } catch (err) {
      let errorMessage = 'Kuryerni olib tashlashda xato';
      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = 'Buyurtma topilmadi';
        } else if (err.response.status === 400) {
          errorMessage = err.response.data?.detail || 'Noto‘g‘ri so‘rov';
        } else if (err.response.status === 500) {
          errorMessage = 'Server xatosi. Keyinroq urinib ko‘ring';
        } else {
          errorMessage = err.response.data?.detail || errorMessage;
        }
      }
      setError(errorMessage);
    }
  };

  // Oshxona vaqtini tahrirlash dialogini ochish
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

  // Oshxona vaqtini yangilash
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
        setDialogError('Tizimga kirish kerak');
        navigate('/login', { replace: true });
        return;
      }

      await axios.patch(
        `${ORDERS_API}${currentOrder.id}/`,
        { kitchen_time: formattedTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditDialogOpen(false);
      setKitchenHours('');
      setKitchenMinutes('');
      fetchOrders();
    } catch (err) {
      setDialogError(err.response?.data?.detail || 'Vaqtni yangilashda xato');
    }
  };

  // Kuryer tahrirlash dialogini ochish
  const openEditCourierDialog = (order) => {
    setCurrentOrder(order);
    setNewCourierId(order.courier?.id || '');
    setCourierDialogError('');
    setCourierSuccess('');
    setEditCourierDialogOpen(true);
    fetchCouriers();
  };

  // Kuryerni yangilash (yangi endpointlar bilan)
  const handleUpdateCourier = async () => {
    if (!currentOrder) {
      setCourierDialogError('Buyurtma tanlanmagan');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setCourierDialogError('Tizimga kirish kerak');
      navigate('/login', { replace: true });
      return;
    }

    try {
      let endpoint;
      let successMessage;

      if (newCourierId) {
        endpoint = currentOrder.courier
          ? `${REPLACE_COURIER_API}${currentOrder.id}/`
          : `${ASSIGN_COURIER_API}${currentOrder.id}/`;
        successMessage = currentOrder.courier
          ? 'Kuryer muvaffaqiyatli almashtirildi'
          : 'Kuryer muvaffaqiyatli tayinlandi';

        await axios.post(
          endpoint,
          { courier_id: parseInt(newCourierId) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        endpoint = `${REMOVE_COURIER_API}${currentOrder.id}/`;
        successMessage = 'Kuryer muvaffaqiyatli o‘chirildi';

        await axios.post(
          endpoint,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setCourierSuccess(successMessage);
      setTimeout(() => setCourierSuccess(''), 3000);
      setEditCourierDialogOpen(false);
      setNewCourierId('');
      fetchOrders();
    } catch (err) {
      let errorMessage = 'Kuryerni yangilashda xato';
      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = 'Buyurtma yoki kuryer topilmadi';
        } else if (err.response.status === 400) {
          errorMessage = err.response.data?.detail || 'Noto‘g‘ri so‘rov';
        } else if (err.response.status === 500) {
          errorMessage = 'Server xatosi. Keyinroq urinib ko‘ring';
        } else {
          errorMessage = err.response.data?.detail || errorMessage;
        }
      }
      setCourierDialogError(errorMessage);
      console.error('Kuryer yangilash xatosi:', err);
    }
  };

  // Ovoz sinovi
  const testSound = async () => {
    try {
      await notificationSound.play();
      setCourierSuccess('Ovoz muvaffaqiyatli sinovdan o‘tdi');
      setTimeout(() => setCourierSuccess(''), 3000);
    } catch (err) {
      console.error('Ovoz sinovi xatosi:', err);
      setCourierDialogError('Ovoz sinovida xato yuz berdi');
    }
  };

  // Boshlang‘ich yuklash va interval
  useEffect(() => {
    fetchOrders();
    fetchCouriers();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  // Holat chipini olish
  const getStatusChip = (status) => {
    const statusMap = {
      'buyurtma_tushdi': { label: 'Yangi', color: 'primary', icon: <AccessTime /> },
      'oshxona_vaqt_belgiladi': { label: 'Oshxona vaqt belgilaydi', color: 'info', icon: <Timer /> },
      'kuryer_oldi': { label: 'Kuryer oldi', color: 'secondary', icon: <CheckCircle /> },
      'kuryer_yolda': { label: 'Yetkazilmoqda', color: 'warning', icon: <LocalShipping /> },
      'buyurtma_topshirildi': { label: 'Yetkazib berildi', color: 'success', icon: <CheckCircle /> }
    };
    const config = statusMap[status] || { label: 'Noma‘lum', color: 'default', icon: null };
    return (
      <Chip
        label={config.label}
        color={config.color}
        icon={config.icon}
        size="small"
        variant="filled"
        sx={{ fontWeight: 'bold', borderRadius: '8px' }}
      />
    );
  };

  // Vaqtni formatlash
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

  // Buyurtmalarni filtrlash
  const filteredOrders = orders.filter(order =>
    order.id.toString().includes(searchQuery) ||
    order.user?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const newOrders = filteredOrders.filter(o => ['buyurtma_tushdi', 'oshxona_vaqt_belgiladi'].includes(o.status));
  const acceptedOrders = filteredOrders.filter(o => o.status === 'kuryer_oldi');
  const inDeliveryOrders = filteredOrders.filter(o => o.status === 'kuryer_yolda');
  const completedOrders = filteredOrders.filter(o => o.status === 'buyurtma_topshirildi');

  // Yuklanish holati
  if (loading && orders.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  // Xato holati
  if (error) {
    return (
      <Alert severity="error" sx={{ m: 3, borderRadius: 2 }}>
        {error}
        <Button onClick={fetchOrders} sx={{ ml: 2, color: 'error.main' }}>Qayta urinish</Button>
      </Alert>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: isMobile ? 2 : 4, bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* Sarlavha */}
        <Stack direction={isMobile ? 'column' : 'row'} justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" color="primary.main">
            Buyurtmalar Boshqaruvi
            {newOrdersCount > 0 && (
              <Badge badgeContent={newOrdersCount} color="error" sx={{ ml: 2 }}>
                <NotificationsIcon />
              </Badge>
            )}
          </Typography>
          <Stack direction={isMobile ? 'column' : 'row'} spacing={2} sx={{ mt: isMobile ? 2 : 0 }}>
            <TextField
              size="small"
              placeholder="ID yoki mijoz bo‘yicha qidirish"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
              }}
              sx={{ width: isMobile ? '100%' : 300 }}
            />
            <FormControlLabel
              control={<Switch checked={soundEnabled} onChange={() => setSoundEnabled(prev => !prev)} />}
              label="Ovozli bildirishnomalar"
            />
            <Button variant="outlined" onClick={testSound}>Ovoz sinovi</Button>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={fetchOrders}
              sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
            >
              Yangilash
            </Button>
          </Stack>
        </Stack>

        {/* Umumiy statistika */}
        <Grid container spacing={isMobile ? 2 : 3} mb={4}>
          {[
            { title: 'Jami Buyurtmalar', value: orders.length, color: 'text.primary' },
            { title: 'Yangi Buyurtmalar', value: newOrders.length, color: 'primary.main' },
            { title: 'Qabul qilingan', value: acceptedOrders.length, color: 'secondary.main' },
            { title: 'Yetkazilmoqda', value: inDeliveryOrders.length, color: 'warning.main' },
            { title: 'Bajarilgan', value: completedOrders.length, color: 'success.main' }
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={2.4} key={index}>
              <Paper
                sx={{
                  p: 2,
                  borderRadius: 3,
                  borderLeft: `4px solid ${item.color}`,
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.02)' }
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">{item.title}</Typography>
                <Typography variant="h5" color={item.color} fontWeight="bold">{item.value}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Tablar */}
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant={isMobile ? 'scrollable' : 'fullWidth'}
          scrollButtons="auto"
          sx={{ mb: 3, bgcolor: 'white', borderRadius: 2 }}
        >
          <Tab label={`Yangi (${newOrders.length})`} />
          <Tab label={`Kuryer oldi (${acceptedOrders.length})`} />
          <Tab label={`Kuryer yolda (${inDeliveryOrders.length})`} />
          <Tab label={`Tugatildi (${completedOrders.length})`} />
          <Tab label={`Barchasi (${orders.length})`} />
        </Tabs>

        {/* Buyurtmalar ro‘yxati */}
        <Box>
          {[
            newOrders,
            acceptedOrders,
            inDeliveryOrders,
            completedOrders,
            filteredOrders
          ][activeTab].length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="body1" color="text.secondary">
                Ushbu bo‘limda buyurtmalar mavjud emas
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={isMobile ? 2 : 3}>
              {[
                newOrders,
                acceptedOrders,
                inDeliveryOrders,
                completedOrders,
                filteredOrders
              ][activeTab].map(order => (
                <Grid item xs={12} key={order.id}>
                  <Card
                    sx={{
                      borderLeft: `4px solid ${
                        order.status === 'buyurtma_tushdi' || order.status === 'oshxona_vaqt_belgiladi'
                          ? theme.palette.primary.main
                          : order.status === 'kuryer_oldi'
                          ? theme.palette.secondary.main
                          : order.status === 'kuryer_yolda'
                          ? theme.palette.warning.main
                          : theme.palette.success.main
                      }`
                    }}
                  >
                    <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" fontWeight="bold">#{order.id}</Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {getStatusChip(order.status)}
                          <IconButton onClick={() => toggleOrderExpand(order.id)}>
                            {expandedOrder === order.id ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        </Stack>
                      </Stack>
                      <Stack direction={isMobile ? 'column' : 'row'} spacing={2} mb={2}>
                        <Typography variant="body2" color="text.secondary">
                          Restoran: {order.kitchen?.name || 'Mavjud emas'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Mijoz: {order.user}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Oshxona vaqti: {formatTime(order.kitchen_time)}
                        </Typography>
                      </Stack>
                      <Stack direction={isMobile ? 'column' : 'row'} spacing={1}>
                        {['buyurtma_tushdi', 'oshxona_vaqt_belgiladi', 'kuryer_oldi'].includes(order.status) && (
                          <>
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              startIcon={<Edit />}
                              onClick={() => openEditDialog(order)}
                            >
                              Vaqt belgilash
                            </Button>
                            <Button
                              variant="outlined"
                              color="secondary"
                              size="small"
                              startIcon={<Person />}
                              onClick={() => openEditCourierDialog(order)}
                            >
                              {order.courier ? 'Kuryer almashtirish' : 'Kuryer qo‘shish'}
                            </Button>
                          </>
                        )}
                        {['kuryer_oldi', 'kuryer_yolda'].includes(order.status) && order.courier && (
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<Delete />}
                            onClick={() => handleRemoveCourier(order.id)}
                          >
                            Kuryerni olib tashlash
                          </Button>
                        )}
                      </Stack>
                      <Collapse in={expandedOrder === order.id}>
                        <Box sx={{ mt: 3 }}>
                          <Divider sx={{ mb: 3 }} />
                          <Grid container spacing={isMobile ? 2 : 3}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle نورث 1" fontWeight="bold" mb={2}>
                                Buyurtma Tafsilotlari
                              </Typography>
                              <Stack spacing={2}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Phone fontSize="small" color="action" />
                                  <Typography variant="body2">{order.contact_number || 'Mavjud emas'}</Typography>
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
                                {order.courier && (
                                  <>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="subtitle2" fontWeight="bold">
                                      Kuryer Ma‘lumotlari
                                    </Typography>
                                    <Stack spacing={1}>
                                      <Stack direction="row" spacing={1} alignItems="center">
                                        <Person fontSize="small" color="action" />
                                        <Typography variant="body2">
                                          Ism: {order.courier.user?.username || 'Noma‘lum'}
                                        </Typography>
                                        <Typography variant="body2">
                                          Ism: {order.courier.user?.courier_salary || 'Noma‘lum'}
                                        </Typography>
                                      </Stack>
                                      <Stack direction="row" spacing={1} alignItems="center">
                                        <Phone fontSize="small" color="action" />
                                        <Typography variant="body2">
                                          Telefon: {order.courier.phone_number || 'Mavjud emas'}
                                        </Typography>
                                      </Stack>
                                      <Stack direction="row" spacing={1} alignItems="center">
                                        <Assignment fontSize="small" color="action" />
                                        <Typography variant="body2">
                                          Pasport: {order.courier.passport_series || ''} {order.courier.passport_number || ''}
                                        </Typography>
                                      </Stack>
                                    </Stack>
                                  </>
                                )}
                              </Stack>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                                Mahsulotlar ({order.items?.length || 0})
                              </Typography>
                              <List dense>
                                {order.items?.map((item, index) => (
                                  <ListItem key={index} sx={{ py: 1 }}>
                                    <ListItemAvatar>
                                      <Avatar
                                        variant="rounded"
                                        src={item.product?.photo ? `${BASE_URL}${item.product.photo}` : undefined}
                                        sx={{ bgcolor: 'grey.200', width: 40, height: 40 }}
                                      >
                                        <Restaurant fontSize="small" />
                                      </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                      primary={item.product?.title || 'Noma‘lum Mahsulot'}
                                      secondary={`${item.quantity} × ${item.price} so‘m`}
                                    />
                                    <Typography variant="body2" fontWeight="bold">
                                      {(item.quantity * parseFloat(item.price)).toLocaleString('uz-UZ')} so‘m
                                    </Typography>
                                  </ListItem>
                                )) || <Typography variant="body2">Mahsulotlar mavjud emas</Typography>}
                              </List>
                            </Grid>
                          </Grid>
                        </Box>
                      </Collapse>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Oshxona vaqti dialogi */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
            Oshxona Vaqtini Belgilash
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Stack spacing={3}>
              <TextField
                label="Soat"
                type="number"
                fullWidth
                value={kitchenHours}
                onChange={(e) => setKitchenHours(e.target.value)}
                InputProps={{ inputProps: { min: 0, max: 3 } }}
                helperText="0-3 soat"
              />
              <TextField
                label="Minut"
                type="number"
                fullWidth
                value={kitchenMinutes}
                onChange={(e) => setKitchenMinutes(e.target.value)}
                InputProps={{ inputProps: { min: 0, max: 59 } }}
                helperText="0-59 minut"
              />
              {dialogError && <Alert severity="error">{dialogError}</Alert>}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Bekor qilish</Button>
            <Button
              variant="contained"
              onClick={handleUpdateKitchenTime}
              disabled={!kitchenHours && !kitchenMinutes}
            >
              Saqlash
            </Button>
          </DialogActions>
        </Dialog>

        {/* Kuryer qo‘shish/almashtirish dialogi */}
        <Dialog open={editCourierDialogOpen} onClose={() => setEditCourierDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ bgcolor: 'secondary.main', color: 'white' }}>
            {currentOrder?.courier ? 'Kuryer Almashtirish' : 'Kuryer Qo‘shish'}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Stack spacing={3}>
              <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                  select
                  label="Online Kuryer"
                  fullWidth
                  value={newCourierId}
                  onChange={(e) => setNewCourierId(e.target.value)}
                  helperText="Online kuryerni tanlang yoki o‘chirish uchun bo‘sh qoldiring"
                  disabled={isFetchingCouriers}
                >
                  <MenuItem value="">Kuryerni o‘chirish</MenuItem>
                  {couriers
                    .filter(courier => courier.is_active)
                    .map(courier => (
                      <MenuItem key={courier.id} value={courier.id}>
                        {courier.user.username} (ID: {courier.id}, Tel: {courier.phone_number || 'N/A'})
                      </MenuItem>
                    ))}
                </TextField>
                <Button
                  variant="outlined"
                  startIcon={isFetchingCouriers ? <CircularProgress size={20} /> : <Refresh />}
                  onClick={fetchCouriers}
                  disabled={isFetchingCouriers}
                >
                  Yangilash
                </Button>
              </Stack>
              {courierSuccess && <Alert severity="success">{courierSuccess}</Alert>}
              {courierDialogError && <Alert severity="error">{courierDialogError}</Alert>}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditCourierDialogOpen(false)}>Bekor qilish</Button>
            <Button
              variant="contained"
              onClick={handleUpdateCourier}
              disabled={isFetchingCouriers}
            >
              Saqlash
            </Button>
          </DialogActions>
        </Dialog>

        {/* Global muvaffaqiyat xabari */}
        {courierSuccess && !editCourierDialogOpen && (
          <Alert severity="success" sx={{ m: 2 }}>
            {courierSuccess}
          </Alert>
        )}

        {/* Oxirgi yangilanish vaqti */}
        {lastFetch && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block', textAlign: 'center' }}>
            Oxirgi yangilanish: {new Date(lastFetch).toLocaleString('uz-UZ')}
          </Typography>
        )}
      </Box>
    </ThemeProvider>
  );

  function toggleOrderExpand(orderId) {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  }
};

export default AdminOrdersDashboard;
