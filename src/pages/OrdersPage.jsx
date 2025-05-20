import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Refresh } from '@mui/icons-material';
import OrderNotification from '../components/OrderNotification'; // Yangi komponentni import qilamiz

const ORDERS_API = 'https://hosilbek.pythonanywhere.com/api/user/orders/';

const OrderPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastFetch, setLastFetch] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');

    if (!token) {
      setError('Tizimga kirish uchun token topilmadi. Iltimos, qayta kiring.');
      setLoading(false);
      return;
    }

    try {
      const orderRes = await axios.get(ORDERS_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ordersData = Array.isArray(orderRes.data) ? orderRes.data : [];
      console.log('Orders API response:', ordersData); // Log the full response
      setOrders(prevOrders => {
        const newOrders = ordersData.filter(
          newOrder => !prevOrders.some(prevOrder => prevOrder.id === newOrder.id)
        );
        return [...prevOrders, ...newOrders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      });
      setLastFetch(new Date().toISOString());
    } catch (err) {
      console.error('Error fetching orders:', err);
      let errorMessage = 'Buyurtmalarni yuklashda xatolik yuz berdi.';
      if (err.response) {
        if (err.response.status === 400) {
          errorMessage = err.response.data?.detail || 'Noto‘g‘ri so‘rov: Server ma’lumotlarni qayta ishlay olmadi.';
        } else if (err.response.status === 401) {
          errorMessage = 'Autentifikatsiya xatosi: Token yaroqsiz yoki muddati o‘tgan. Iltimos, qayta kiring.';
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data?.detail) {
          errorMessage = err.response.data.detail;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(); // Initial fetch
    const interval = setInterval(fetchOrders, 30000); // Polling every 30 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleLoginRedirect = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleRefresh = () => {
    fetchOrders();
  };

  if (loading && orders.length === 0) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <Alert
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
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a3c34' }}>
          Sizning Buyurtmalaringiz
        </Typography>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={handleRefresh}
          sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } }}
        >
          Yangilash
        </Button>
      </Stack>

      {orders.length === 0 ? (
        <Alert severity="info" sx={{ maxWidth: 800, mx: 'auto' }}>
          Buyurtmalar mavjud emas
        </Alert>
      ) : (
        <Box>
          {orders.map(order => (
            <OrderNotification key={order.id} order={order} />
          ))}
        </Box>
      )}
      {lastFetch && (
        <Typography color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
          Oxirgi yangilanish: {new Date(lastFetch).toLocaleString('uz-UZ')}
        </Typography>
      )}
    </Box>
  );
};

export default OrderPage;