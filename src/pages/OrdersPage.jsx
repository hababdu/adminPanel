import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
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
  Select,
  Checkbox,
  FormControlLabel as FormControlLabelCheckbox
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
  Delete,
  Print,
  RestartAlt
} from '@mui/icons-material';
import { logout } from '../redax/authSlice'; // Fixed 'redax' to 'redux'
import audio from '../assets/notification.mp3';

// API manzillari
const ORDERS_API = 'https://hosilbek02.pythonanywhere.com/api/user/orders/';
const COURIERS_API = 'https://hosilbek02.pythonanywhere.com/api/user/couriers/';
const BASE_URL = 'https://hosilbek02.pythonanywhere.com';
const ACCEPT_ORDER_API = 'https://hosilbek02.pythonanywhere.com/api/user/orders/';
const REMOVE_COURIER_API = 'https://hosilbek02.pythonanywhere.com/api/user/remove_courier/';
const ASSIGN_COURIER_API = 'https://hosilbek02.pythonanywhere.com/api/user/assign_courier/';
const REPLACE_COURIER_API = 'https://hosilbek02.pythonanywhere.com/api/user/orders/replace_courier/';
const DELETE_ORDER_API = 'https://hosilbek02.pythonanywhere.com/api/user/orders/';

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
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
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
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ordersToDelete, setOrdersToDelete] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [dailySales, setDailySales] = useState(0);
  const [dailySalesCommission, setDailySalesCommission] = useState(0);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [sortBy, setSortBy] = useState('id'); // New: Sorting option
  const [sortOrder, setSortOrder] = useState('desc'); // New: Sort order

  const notificationSound = new Audio(audio);

  useEffect(() => {
    notificationSound.load();
    return () => {
      notificationSound.pause();
      notificationSound.currentTime = 0;
    };
  }, []);

  const fetchCouriers = async () => {
    setIsFetchingCouriers(true);
    setCourierDialogError('');
    setSuccessMessage('');
    if (!token || !isAuthenticated) {
      console.error('fetchCouriers: Token yoki autentifikatsiya topilmadi');
      setError('Tizimga kirish talab qilinadi');
      dispatch(logout());
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
      setIsFetchingCouriers(false);
      return;
    }

    try {
      const response = await axios.get(COURIERS_API, {
        headers: { Authorization: `Token ${token}` }
      });
      const courierData = Array.isArray(response.data) ? response.data : [];
      setCouriers(courierData);
      setSuccessMessage('Kuryerlar ro‘yxati yangilandi');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('fetchCouriers xatosi:', err.response?.status, err.response?.data);
      const errorMessage = err.response?.data?.detail || 'Kuryerlar ro‘yxatini olishda xato';
      setCourierDialogError(errorMessage);
    } finally {
      setIsFetchingCouriers(false);
    }
  };

  const calculateDailySales = (orders, start, end) => {
    if (!start || !end) {
      return { totalSales: 0, commission: 0, completedOrders: [] };
    }

    const startDate = new Date(start).toISOString().split('T')[0];
    const endDate = new Date(end).toISOString().split('T')[0];
    if (new Date(endDate) < new Date(startDate)) {
      setError('Oxirgi sana boshlang‘ich sanadan oldin bo‘lishi mumkin emas');
      return { totalSales: 0, commission: 0, completedOrders: [] };
    }

    const completedOrders = orders.filter(
      order => order.status === 'buyurtma_topshirildi' && 
               order.created_at && 
               new Date(order.created_at).toISOString().split('T')[0] >= startDate &&
               new Date(order.created_at).toISOString().split('T')[0] <= endDate
    );

    const totalSales = completedOrders.reduce((sum, order) => {
      if (!order.items || !Array.isArray(order.items)) return sum;
      const orderTotal = order.items.reduce((orderSum, item) => {
        const price = parseFloat(item.kitchen_price || item.price || 0);
        if (isNaN(price) || !item.quantity) return orderSum;
        return orderSum + item.quantity * price;
      }, 0);
      return sum + orderTotal;
    }, 0);

    const commission = totalSales * 0.1; // 10% of total sales

    return { totalSales, commission, completedOrders };
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    setOrdersToDelete([]);
    setSelectAll(false);

    if (!token || !isAuthenticated) {
      console.error('fetchOrders: Token yoki autentifikatsiya topilmadi');
      setError('Tizimga kirish talab qilinadi');
      dispatch(logout());
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(ORDERS_API, {
        headers: { Authorization: `Token ${token}` }
      });
      console.log('Raw API Response:', response.data);
      const ordersData = Array.isArray(response.data) ? response.data : [];
      
      // Filter new orders for notification
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

      // Calculate daily sales and commission for the selected date range
      const { totalSales, commission } = calculateDailySales(ordersData, startDate, endDate);

      setOrders(ordersData);
      setDailySales(totalSales);
      setDailySalesCommission(commission);
      setLastFetch(new Date().toISOString());
      setIsInitialFetch(false);
    } catch (err) {
      handleFetchError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyDateFilter = () => {
    if (!startDate || !endDate) {
      setError('Iltimos, boshlang‘ich va oxirgi sanalarni tanlang');
      return;
    }
    setFilterLoading(true);
    setError('');
    const { totalSales, commission } = calculateDailySales(orders, startDate, endDate);
    setDailySales(totalSales);
    setDailySalesCommission(commission);
    setFilterLoading(false);
  };

  const handleResetDateFilter = () => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);
    setError('');
    handleApplyDateFilter();
  };

  const handleFetchError = (err) => {
    console.error('handleFetchError:', err.response?.status, err.response?.data);
    let errorMessage = 'Buyurtmalarni olishda xato';
    if (err.response) {
      if (err.response.status === 401) {
        errorMessage = 'Sessiya tugagan. Iltimos, qayta kiring';
        dispatch(logout());
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

  const handleAcceptOrder = async (orderId) => {
    if (!token || !isAuthenticated) {
      console.error('handleAcceptOrder: Token yoki autentifikatsiya topilmadi');
      setError('Tizimga kirish talab qilinadi');
      dispatch(logout());
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
      return;
    }

    try {
      const response = await axios.post(
        `${ACCEPT_ORDER_API}${orderId}/`,
        {},
        { headers: { Authorization: `Token ${token}` } }
      );
      console.log('handleAcceptOrder: Muvaffaqiyatli:', response.status);
      fetchOrders();
    } catch (err) {
      console.error('handleAcceptOrder xatosi:', err.response?.status, err.response?.data);
      setError(err.response?.data?.detail || 'Buyurtmani qabul qilishda xato');
    }
  };

  const handleRemoveCourier = async (orderId) => {
    if (!token || !isAuthenticated) {
      console.error('handleRemoveCourier: Token yoki autentifikatsiya topilmadi');
      setError('Tizimga kirish talab qilinadi');
      dispatch(logout());
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
      return;
    }

    try {
      const response = await axios.post(
        `${REMOVE_COURIER_API}${orderId}/`,
        {},
        { headers: { Authorization: `Token ${token}` } }
      );
      console.log('handleRemoveCourier: Muvaffaqiyatli:', response.status);
      setSuccessMessage('Kuryer buyurtmadan olib tashlandi');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchOrders();
    } catch (err) {
      console.error('handleRemoveCourier xatosi:', err.response?.status, err.response?.data);
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

  const handleDeleteOrders = async () => {
    if (ordersToDelete.length === 0) {
      setError('O‘chirish uchun buyurtma tanlanmagan');
      return;
    }

    if (!token || !isAuthenticated) {
      console.error('handleDeleteOrders: Token yoki autentifikatsiya topilmadi');
      setError('Tizimga kirish talab qilinadi');
      dispatch(logout());
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
      return;
    }

    try {
      const responses = await Promise.all(
        ordersToDelete.map(orderId =>
          axios.delete(`${DELETE_ORDER_API}${orderId}/`, {
            headers: { Authorization: `Token ${token}` }
          })
        )
      );
      console.log('handleDeleteOrders: Muvaffaqiyatli:', responses.map(res => res.status));
      setSuccessMessage(`${ordersToDelete.length} ta buyurtma muvaffaqiyatli o‘chirildi`);
      setTimeout(() => setSuccessMessage(''), 3000);
      setDeleteDialogOpen(false);
      setOrdersToDelete([]);
      setSelectAll(false);
      fetchOrders();
    } catch (err) {
      console.error('handleDeleteOrders xatosi:', err.response?.status, err.response?.data);
      let errorMessage = 'Buyurtmalarni o‘chirishda xato yuz berdi';
      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = 'Buyurtma topilmadi';
        } else if (err.response.status === 403) {
          errorMessage = 'Bu buyurtmani o‘chirishga ruxsat yo‘q';
        } else if (err.response.status === 400) {
          errorMessage = err.response.data?.detail || 'Noto‘g‘ri so‘rov';
        } else if (err.response.status === 500) {
          errorMessage = 'Server xatosi. Iltimos, keyinroq urinib ko‘ring';
        } else {
          errorMessage = err.response.data?.detail || errorMessage;
        }
      } else if (err.request) {
        errorMessage = 'Internet aloqasi yo‘q';
      }
      setError(errorMessage);
      setDeleteDialogOpen(false);
      setOrdersToDelete([]);
      setSelectAll(false);
    }
  };

  const openEditDialog = (order) => {
    setCurrentOrder(order);
    if (order.kitchen_time) {
      if (typeof order.kitchen_time === 'string' && order.kitchen_time.includes(':')) {
        const [hours, minutes] = order.kitchen_time.split(':').map(Number);
        setKitchenHours(hours || '');
        setKitchenMinutes(minutes || '');
      } else {
        const totalMinutes = parseInt(order.kitchen_time) || 0;
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

    if (!token || !isAuthenticated) {
      console.error('handleUpdateKitchenTime: Token yoki autentifikatsiya topilmadi');
      setDialogError('Tizimga kirish kerak');
      dispatch(logout());
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
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
      const response = await axios.patch(
        `${ORDERS_API}${currentOrder.id}/`,
        { kitchen_time: formattedTime },
        { headers: { Authorization: `Token ${token}` } }
      );
      console.log('handleUpdateKitchenTime: Muvaffaqiyatli:', response.status);
      setEditDialogOpen(false);
      setKitchenHours('');
      setKitchenMinutes('');
      fetchOrders();
    } catch (err) {
      console.error('handleUpdateKitchenTime xatosi:', err.response?.status, err.response?.data);
      setDialogError(err.response?.data?.detail || 'Vaqtni yangilashda xato');
    }
  };

  const openEditCourierDialog = (order) => {
    setCurrentOrder(order);
    setNewCourierId(order.courier?.id || '');
    setCourierDialogError('');
    setSuccessMessage('');
    setEditCourierDialogOpen(true);
    fetchCouriers();
  };

  const openDeleteDialog = (orderIds = ordersToDelete) => {
    if (orderIds.length === 0) {
      setError('O‘chirish uchun buyurtma tanlang');
      return;
    }
    setOrdersToDelete(orderIds);
    setDeleteDialogOpen(true);
    setError('');
  };

  const handleSelectOrder = (orderId) => {
    setOrdersToDelete(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setOrdersToDelete([]);
      setSelectAll(false);
    } else {
      const tabOrders = getTabOrders()[activeTab];
      const orderIds = tabOrders.map(order => order.id);
      setOrdersToDelete(orderIds);
      setSelectAll(true);
    }
  };

  const testSound = async () => {
    try {
      await notificationSound.play();
      setSuccessMessage('Ovoz muvaffaqiyatli sinovdan o‘tdi');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Ovoz sinovi xatosi:', err);
      setCourierDialogError('Ovoz sinovida xato yuz berdi');
    }
  };

  const handleUpdateCourier = async () => {
    if (!currentOrder) {
      setCourierDialogError('Buyurtma tanlanmagan');
      return;
    }

    if (!token || !isAuthenticated) {
      console.error('handleUpdateCourier: Token yoki autentifikatsiya topilmadi');
      setCourierDialogError('Tizimga kirish kerak');
      dispatch(logout());
      localStorage.removeItem('token');
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

        const response = await axios.post(
          endpoint,
          { courier_id: parseInt(newCourierId) },
          { headers: { Authorization: `Token ${token}` } }
        );
        console.log('handleUpdateCourier: Muvaffaqiyatli:', response.status);
      } else {
        endpoint = `${REMOVE_COURIER_API}${currentOrder.id}/`;
        successMessage = 'Kuryer muvaffaqiyatli o‘chirildi';

        const response = await axios.post(
          endpoint,
          {},
          { headers: { Authorization: `Token ${token}` } }
        );
        console.log('handleUpdateCourier (remove): Muvaffaqiyatli:', response.status);
      }

      setSuccessMessage(successMessage);
      setTimeout(() => setSuccessMessage(''), 3000);
      setEditCourierDialogOpen(false);
      setNewCourierId('');
      fetchOrders();
    } catch (err) {
      console.error('handleUpdateCourier xatosi:', err.response?.status, err.response?.data);
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
    }
  };

  // Buyurtma chekini chop etish funksiyasi
  const handlePrintReceipt = (order) => {
    const totalAmount = order.items?.reduce((sum, item) => {
      const price = parseFloat(item.kitchen_price || item.price || 0);
      return isNaN(price) || !item.quantity ? sum : sum + item.quantity * price;
    }, 0) || 0;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Buyurtma Cheki #${order.id}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              max-width: 300px;
              font-size: 14px;
              line-height: 1.4;
            }
            .receipt {
              border: 1px solid #000;
              padding: 15px;
              border-radius: 5px;
            }
            .header {
              text-align: center;
              border-bottom: 2px dashed #000;
              padding-bottom: 10px;
              margin-bottom: 10px;
            }
            .item {
              display: flex;
              justify-content: space-between;
              margin: 5px 0;
            }
            .total {
              border-top: 2px dashed #000;
              padding-top: 10px;
              font-weight: bold;
            }
            .info {
              margin: 10px 0;
            }
            @media print {
              body {
                margin: 0;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h2>Buyurtma Cheki</h2>
              <p>Buyurtma ID: #${order.id}</p>
              <p>Restoran: ${order.kitchen?.name || 'Mavjud emas'}</p>
              <p>Sana: ${order.created_at ? new Date(order.created_at).toLocaleString('uz-UZ') : 'Mavjud emas'}</p>
            </div>
            <div class="info">
              <p><strong>Mijoz:</strong> ${order.user || 'Noma‘lum'}</p>
              <p><strong>Telefon:</strong> ${order.contact_number || 'Mavjud emas'}</p>
              <p><strong>To‘lov:</strong> ${order.payment === 'naqd' ? 'Naqd' : order.payment === 'karta' ? 'Karta' : 'Noma‘lum'}</p>
              <p><strong>Oshxona vaqti:</strong> ${formatTime(order.kitchen_time)}</p>
              ${order.courier ? `
                <p><strong>Kuryer:</strong> ${order.courier.user?.username || 'Noma‘lum'}</p>
                <p><strong>Kuryer telefoni:</strong> ${order.courier.phone_number || 'Mavjud emas'}</p>
              ` : ''}
              ${order.notes ? `<p><strong>Eslatmalar:</strong> ${order.notes}</p>` : ''}
            </div>
            <h3>Mahsulotlar:</h3>
            ${order.items?.map(item => `
              <div class="item">
                <span>${item.product?.title || 'Noma‘lum Mahsulot'} (${item.quantity || 0}x)</span>
                <span>${((item.quantity || 0) * parseFloat(item.kitchen_price || item.price || 0)).toLocaleString('uz-UZ')} so‘m</span>
              </div>
            `).join('') || '<p>Mahsulotlar mavjud emas</p>'}
            <div class="total">
              <span>Jami:</span>
              <span>${totalAmount.toLocaleString('uz-UZ')} so‘m</span>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Kunlik savdo hisobotini jadval ko‘rinishida chop etish funksiyasi
  const handlePrintDailySalesReport = () => {
    const startDateFormatted = startDate ? new Date(startDate).toLocaleDateString('uz-UZ') : 'Noma‘lum';
    const endDateFormatted = endDate ? new Date(endDate).toLocaleDateString('uz-UZ') : 'Noma‘lum';
    const { completedOrders, totalSales, commission } = calculateDailySales(orders, startDate, endDate);

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Kunlik Savdo Hisoboti - ${startDateFormatted} dan ${endDateFormatted} gacha</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              max-width: 800px;
              font-size: 14px;
              line-height: 1.4;
            }
            .report {
              border: 1px solid #000;
              padding: 20px;
              border-radius: 5px;
            }
            .header {
              text-align: center;
              border-bottom: 2px dashed #000;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
              font-weight: bold;
            }
            .total, .commission {
              border-top: 2px dashed #000;
              padding-top: 10px;
              font-weight: bold;
              font-size: 16px;
              margin-top: 20px;
            }
            .items {
              margin-left: 20px;
            }
            @media print {
              body {
                margin: 0;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="report">
            <div class="header">
              <h2>Kunlik Savdo Hisoboti</h2>
              <p>Sana oralig‘i: ${startDateFormatted} - ${endDateFormatted}</p>
              <p>Jami buyurtmalar: ${completedOrders.length}</p>
              <p>Jami savdo (oshxona narxlari): ${totalSales.toLocaleString('uz-UZ')} so‘m</p>
              <p>10% Komissiya: ${commission.toLocaleString('uz-UZ')} so‘m</p>
            </div>
            ${completedOrders.length === 0 ? `<p>${startDateFormatted} dan ${endDateFormatted} gacha tugallangan buyurtmalar mavjud emas</p>` : `
              <table>
                <thead>
                  <tr>
                    <th>Buyurtma ID</th>
                    <th>Restoran</th>
                    <th>Mijoz</th>
                    <th>Mahsulotlar</th>
                    <th>Jami (so‘m)</th>
                    <th>To‘lov</th>
                  </tr>
                </thead>
                <tbody>
                  ${completedOrders.map(order => `
                    <tr>
                      <td>#${order.id}</td>
                      <td>${order.kitchen?.name || 'Mavjud emas'}</td>
                      <td>${order.user || 'Noma‘lum'}</td>
                      <td class="items">
                        ${order.items?.map(item => `
                          ${item.product?.title || 'Noma‘lum Mahsulot'} (${item.quantity || 0}x, ${(parseFloat(item.kitchen_price || item.price || 0)).toLocaleString('uz-UZ')} so‘m)
                        `).join('<br>') || 'Mahsulotlar mavjud emas'}
                      </td>
                      <td>${(order.items?.reduce((sum, item) => {
                        const price = parseFloat(item.kitchen_price || item.price || 0);
                        return isNaN(price) || !item.quantity ? sum : sum + item.quantity * price;
                      }, 0) || 0).toLocaleString('uz-UZ')}</td>
                      <td>${order.payment === 'naqd' ? 'Naqd' : order.payment === 'karta' ? 'Karta' : 'Noma‘lum'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              <div class="total">
                <span>Umumiy savdo (oshxona narxlari):</span>
                <span>${totalSales.toLocaleString('uz-UZ')} so‘m</span>
              </div>
              <div class="commission">
                <span>10% Komissiya:</span>
                <span>${commission.toLocaleString('uz-UZ')} so‘m</span>
              </div>
            `}
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  useEffect(() => {
    fetchOrders();
    fetchCouriers();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [token, isAuthenticated]);

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

  const filteredOrders = orders.filter(order =>
    order && (
      (order.id?.toString() || '').includes(searchQuery) ||
      (order.user?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    )
  );

  const sortedFilteredOrders = [...filteredOrders].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (sortBy === 'created_at') {
      valA = new Date(valA);
      valB = new Date(valB);
    }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const newOrders = sortedFilteredOrders.filter(o => o && ['buyurtma_tushdi', 'oshxona_vaqt_belgiladi'].includes(o.status));
  const acceptedOrders = sortedFilteredOrders.filter(o => o && o.status === 'kuryer_oldi');
  const inDeliveryOrders = sortedFilteredOrders.filter(o => o && o.status === 'kuryer_yolda');
  const completedOrders = sortedFilteredOrders.filter(o => o && o.status === 'buyurtma_topshirildi' &&
    (!startDate || !endDate || (
      new Date(o.created_at).toISOString().split('T')[0] >= new Date(startDate).toISOString().split('T')[0] &&
      new Date(o.created_at).toISOString().split('T')[0] <= new Date(endDate).toISOString().split('T')[0]
    )));

  const getTabOrders = () => [newOrders, acceptedOrders, inDeliveryOrders, completedOrders, sortedFilteredOrders];

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
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

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: isMobile ? 2 : 4, bgcolor: 'background.default', minHeight: '100vh' }}>
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
            <Button
              variant="contained"
              startIcon={<Print />}
              onClick={handlePrintDailySalesReport}
              sx={{ bgcolor: 'info.main', '&:hover': { bgcolor: 'info.dark' } }}
            >
              Hisobot Chop Etish
            </Button>
          </Stack>
        </Stack>

        <Stack direction={isMobile ? 'column' : 'row'} spacing={2} mb={3} alignItems="center">
          <TextField
            label="Boshlang‘ich Sana"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: isMobile ? '100%' : 200 }}
          />
          <TextField
            label="Oxirgi Sana"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: isMobile ? '100%' : 200 }}
          />
          <Button
            variant="contained"
            startIcon={filterLoading ? <CircularProgress size={20} color="inherit" /> : <Search />}
            onClick={handleApplyDateFilter}
            disabled={filterLoading || !startDate || !endDate}
          >
            Filtrlash
          </Button>
          <Button
            variant="outlined"
            startIcon={<RestartAlt />}
            onClick={handleResetDateFilter}
            disabled={filterLoading || (startDate === new Date().toISOString().split('T')[0] && endDate === new Date().toISOString().split('T')[0])}
          >
            Qayta tiklash
          </Button>
        </Stack>

        <Grid container spacing={isMobile ? 2 : 3} mb={4}>
          {[
            { title: 'Jami Buyurtmalar', value: orders.length, color: 'text.primary' },
            { title: 'Yangi Buyurtmalar', value: newOrders.length, color: 'primary.main' },
            { title: 'Qabul qilingan', value: acceptedOrders.length, color: 'secondary.main' },
            { title: 'Yetkazilmoqda', value: inDeliveryOrders.length, color: 'warning.main' },
            { title: 'Bajarilgan', value: completedOrders.length, color: 'success.main' },
            { title: 'Savdo (Oshxona Narxlari)', value: `${dailySales.toLocaleString('uz-UZ')} so‘m`, color: 'info.main' },
            { title: '10% Komissiya', value: `${dailySalesCommission.toLocaleString('uz-UZ')} so‘m`, color: 'success.main' }
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={2} key={index}>
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

        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <FormControlLabelCheckbox
            control={
              <Checkbox
                checked={selectAll}
                onChange={handleSelectAll}
                indeterminate={ordersToDelete.length > 0 && ordersToDelete.length < getTabOrders()[activeTab].length}
              />
            }
            label="Barchasini tanlash"
          />
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={() => openDeleteDialog()}
            disabled={ordersToDelete.length === 0}
          >
            Tanlanganlarni o‘chirish (${ordersToDelete.length})
          </Button>
          <Select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            size="small"
            label="Saralash"
          >
            <MenuItem value="id">ID bo'yicha</MenuItem>
            <MenuItem value="created_at">Sana bo'yicha</MenuItem>
            <MenuItem value="status">Holati bo'yicha</MenuItem>
          </Select>
          <IconButton onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
            {sortOrder === 'asc' ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Stack>

        <Box>
          {getTabOrders()[activeTab].length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="body1" color="text.secondary">
                Ushbu bo‘limda buyurtmalar mavjud emas
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={isMobile ? 2 : 3}>
              {getTabOrders()[activeTab].map(order => (
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
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Checkbox
                            checked={ordersToDelete.includes(order.id)}
                            onChange={() => handleSelectOrder(order.id)}
                          />
                          <Typography variant="h6" fontWeight="bold">#{order.id}</Typography>
                        </Stack>
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
                          Mijoz: {order.user || 'Noma‘lum'}
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
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<Delete />}
                          onClick={() => openDeleteDialog([order.id])}
                        >
                          Buyurtmani o‘chirish
                        </Button>
                        <Button
                          variant="contained"
                          color="info"
                          size="small"
                          startIcon={<Print />}
                          onClick={() => handlePrintReceipt(order)}
                        >
                          Chek chop etish
                        </Button>
                      </Stack>
                      <Collapse in={expandedOrder === order.id}>
                        <Box sx={{ mt: 3 }}>
                          <Divider sx={{ mb: 3 }} />
                          <Grid container spacing={isMobile ? 2 : 3}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle1" fontWeight="bold" mb={2}>
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
                                    To‘lov: {order.payment === 'naqd' ? 'Naqd' : order.payment === 'karta' ? 'Karta' : 'Noma‘lum'}
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
                                          Ish haqi: {order.courier.user?.courier_salary || 'Noma‘lum'}
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
                                      secondary={`${item.quantity || 0} × ${(parseFloat(item.kitchen_price || item.price || 0)).toLocaleString('uz-UZ')} so‘m`}
                                    />
                                    <Typography variant="body2" fontWeight="bold">
                                      {((item.quantity || 0) * parseFloat(item.kitchen_price || item.price || 0)).toLocaleString('uz-UZ')} so‘m
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
                        {courier.user?.username || 'Noma‘lum'} (ID: {courier.id}, Tel: {courier.phone_number || 'N/A'})
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
              {successMessage && <Alert severity="success">{successMessage}</Alert>}
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

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ bgcolor: 'error.main', color: 'white' }}>
            Buyurtmani O‘chirish
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Typography variant="body1">
              {ordersToDelete.length === 1
                ? `Buyurtma #${ordersToDelete[0]} ni o‘chirishni tasdiqlaysizmi?`
                : `${ordersToDelete.length} ta buyurtmani o‘chirishni tasdiqlaysizmi? (#${ordersToDelete.join(', #')})`}
              <br />
              Bu amalni qaytarib bo‘lmaydi.
            </Typography>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Bekor qilish</Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteOrders}
            >
              O‘chirish
            </Button>
          </DialogActions>
        </Dialog>

        {successMessage && !editCourierDialogOpen && (
          <Alert severity="success" sx={{ m: 2 }}>
            {successMessage}
          </Alert>
        )}

        {lastFetch && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block', textAlign: 'center' }}>
            Oxirgi yangilanish: {new Date(lastFetch).toLocaleString('uz-UZ')}
          </Typography>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default AdminOrdersDashboard;