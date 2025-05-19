import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Snackbar,
  Alert as MuiAlert,
  IconButton
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const token = localStorage.getItem('token');

  const API_URL = 'https://hosilbek.pythonanywhere.com/api/user/orders/';

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(API_URL, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 soniya timeout
      });

      if (response.data && Array.isArray(response.data)) {
        setOrders(response.data);
        console.log('Buyurtmalar muvaffaqiyatli olindi:', response.data);
      } else {
        throw new Error('Ma\'lumotlar formati noto\'g\'ri');
      }
    } catch (err) {
      console.error('Buyurtmalarni olishda xatolik:', err);
      
      let errorMessage = 'Tarmoq xatosi. Iltimos, internet aloqasini tekshiring.';
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Server javob bermadi. Iltimos, keyinroq urinib ko\'ring.';
      } else if (err.response) {
        errorMessage = err.response.data.message || 'Server xatosi';
      }
      
      setError(errorMessage);
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  // Avtomatik qayta urinish
  useEffect(() => {
    if (error && retryCount < 3) {
      const timer = setTimeout(() => {
        fetchOrders();
      }, 5000); // 5 soniyadan keyin qayta urinish
      return () => clearTimeout(timer);
    }
  }, [error, retryCount]);

  // Birinchi marta yuklash
  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading && orders.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography ml={2}>Buyurtmalar yuklanmoqda...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3} textAlign="center">
        <MuiAlert severity="error" sx={{ mb: 2 }}>
          {error}
        </MuiAlert>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchOrders}
          disabled={loading}
        >
          Qayta urinish
        </Button>
        {retryCount < 3 && (
          <Typography variant="body2" mt={1}>
            Avtomatik ravishda {5 - (retryCount * 1.5)} soniyadan keyin qayta uriniladi...
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Buyurtmalar</Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchOrders}
          disabled={loading}
        >
          Yangilash
        </Button>
      </Box>

      {orders.length === 0 ? (
        <Typography variant="body1" textAlign="center" py={4}>
          Hozircha buyurtmalar mavjud emas
        </Typography>
      ) : (
        <Box>
          <Typography variant="subtitle1" mb={2}>
            Jami: {orders.length} ta buyurtma
          </Typography>
          
          {/* Buyurtmalar ro'yxati */}
          {orders.map(order => (
            <Card key={order.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">Buyurtma #{order.id}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Mijoz: {order.user}
                </Typography>
                <Typography variant="body2">
                  Summa: {order.full_salary} so'm
                </Typography>
                <Typography variant="body2">
                  Holat: {order.status}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default OrdersPage;