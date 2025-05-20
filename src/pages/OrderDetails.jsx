import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Button,
  Stack,
  Container,
  Paper,
  Grid,
  Badge,
  IconButton,
  LinearProgress
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowBack,
  LocalShipping,
  Restaurant,
  Payment,
  Phone,
  Notes,
  CalendarToday,
  LocationOn,
  Person,
  AccessTime,
  MonetizationOn,
  CheckCircle,
  Error
} from '@mui/icons-material';

const OrderDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;

  if (!order) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
          <Error color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" color="error" gutterBottom>
            Buyurtma ma'lumotlari topilmadi
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Iltimos, buyurtmalar ro'yxatidan qayta urunib ko'ring
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/orders')}
            sx={{
              bgcolor: '#2e7d32',
              '&:hover': { bgcolor: '#1b5e20' },
              px: 4,
              py: 1.5
            }}
          >
            Buyurtmalarga qaytish
          </Button>
        </Paper>
      </Container>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'buyurtma_tushdi':
        return 'primary';
      case 'tayyorlandi':
        return 'success';
      case 'yetkazildi':
        return 'info';
      case 'bekor_qilindi':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'buyurtma_tushdi':
        return <AccessTime color="primary" />;
      case 'tayyorlandi':
        return <Restaurant color="success" />;
      case 'yetkazildi':
        return <CheckCircle color="info" />;
      case 'bekor_qilindi':
        return <Error color="error" />;
      default:
        return null;
    }
  };

  const calculateProgress = () => {
    switch (order.status) {
      case 'buyurtma_tushdi':
        return 30;
      case 'tayyorlandi':
        return 60;
      case 'yetkazildi':
        return 100;
      default:
        return 0;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/orders')}
        sx={{ mb: 3, color: '#2e7d32' }}
      >
        Orqaga
      </Button>

      <Paper
        elevation={4}
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: 3,
          background: 'linear-gradient(to right, #f5f7fa, #e4e7eb)'
        }}
      >
        {/* Sarlavha va Status */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a3c34' }}>
            Buyurtma №{order.id}
          </Typography>
          <Chip
            icon={getStatusIcon(order.status)}
            label={order.status?.replace(/_/g, ' ') || 'Nomaʼlum'}
            color={getStatusColor(order.status)}
            sx={{
              fontWeight: 'bold',
              px: 2,
              py: 1,
              fontSize: '1rem',
              textTransform: 'capitalize'
            }}
          />
        </Stack>

        {/* Jarayon Indikatori */}
        <Box sx={{ mb: 4 }}>
          <LinearProgress
            variant="determinate"
            value={calculateProgress()}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                backgroundColor: getStatusColor(order.status)
              }
            }}
          />
          <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Qabul qilindi
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Tayyorlanmoqda
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Yetkazilmoqda
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Yakunlandi
            </Typography>
          </Stack>
        </Box>

        <Grid container spacing={3}>
          {/* Asosiy Ma'lumotlar */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 2, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center' }}>
                  <CalendarToday sx={{ mr: 1, color: '#1a3c34' }} />
                  Buyurtma Tafsilotlari
                </Typography>
                
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOn color="primary" sx={{ mr: 1.5 }} />
                    <Typography>
                      <strong>Manzil:</strong> {order.shipping_address || '—'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Phone color="primary" sx={{ mr: 1.5 }} />
                    <Typography>
                      <strong>Telefon:</strong> {order.contact_number || '—'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Payment color="primary" sx={{ mr: 1.5 }} />
                    <Typography>
                      <strong>To'lov turi:</strong> {order.payment === 'naqd' ? 'Naqd pul' : order.payment || 'Nomaʼlum'}
                    </Typography>
                  </Box>
                  
                  {order.notes && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Notes color="primary" sx={{ mr: 1.5, mt: 0.5 }} />
                      <Typography>
                        <strong>Izoh:</strong> {order.notes}
                      </Typography>
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MonetizationOn color="primary" sx={{ mr: 1.5 }} />
                    <Typography>
                      <strong>Umumiy summa:</strong> {parseFloat(order.total_amount || 0).toLocaleString('uz-UZ')} so'm
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Oshxona va Kuryer */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 2, mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center' }}>
                  <Restaurant sx={{ mr: 1, color: '#1a3c34' }} />
                  Oshxona
                </Typography>
                
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Person color="secondary" sx={{ mr: 1.5 }} />
                    <Typography>
                      <strong>Nomi:</strong> {order.kitchen?.name || 'Nomaʼlum oshxona'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MonetizationOn color="secondary" sx={{ mr: 1.5 }} />
                    <Typography>
                      <strong>Oshxona maoshi:</strong> {parseFloat(order.kitchen_salary || 0).toLocaleString('uz-UZ')} so'm
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTime color="secondary" sx={{ mr: 1.5 }} />
                    <Typography>
                      <strong>Vaqti:</strong> {order.kitchen_time || 'Belgilanmagan'}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
            
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center' }}>
                  <LocalShipping sx={{ mr: 1, color: '#1a3c34' }} />
                  Kuryer
                </Typography>
                
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Person color="secondary" sx={{ mr: 1.5 }} />
                    <Typography>
                      <strong>Kuryer:</strong> {order.courier || 'Biriktirilmagan'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MonetizationOn color="secondary" sx={{ mr: 1.5 }} />
                    <Typography>
                      <strong>Kuryer maoshi:</strong> {parseFloat(order.courier_salary || 0).toLocaleString('uz-UZ')} so'm
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTime color="secondary" sx={{ mr: 1.5 }} />
                    <Typography>
                      <strong>Vaqti:</strong> {order.courier_time || 'Belgilanmagan'}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Mahsulotlar */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center' }}>
                  Mahsulotlar
                </Typography>
                
                <List>
                  {(order.items || []).map((item, index) => (
                    <ListItem
                      key={index}
                      divider
                      sx={{
                        py: 2,
                        '&:hover': { backgroundColor: '#f5f5f5' }
                      }}
                    >
                      <ListItemAvatar>
                        <Badge
                          badgeContent={item.quantity}
                          color="primary"
                          overlap="circular"
                          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                          <Avatar
                            src={item.product?.photo ? `https://hosilbek.pythonanywhere.com${item.product.photo}` : undefined}
                            variant="rounded"
                            sx={{ width: 60, height: 60 }}
                          >
                            {!item.product?.photo && <Restaurant />}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {item.product?.title || 'Nomaʼlum mahsulot'}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            {item.product?.description || 'Tavsif mavjud emas'}
                          </Typography>
                        }
                        sx={{ ml: 2 }}
                      />
                      
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d81b60' }}>
                        {(item.price * item.quantity).toLocaleString('uz-UZ')} so'm
                      </Typography>
                    </ListItem>
                  ))}
                </List>
                
                <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Jami:
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#d81b60' }}>
                      {parseFloat(order.total_amount || 0).toLocaleString('uz-UZ')} so'm
                    </Typography>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Harakatlar */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/orders')}
            sx={{
              bgcolor: '#2e7d32',
              '&:hover': { bgcolor: '#1b5e20' },
              px: 6,
              py: 1.5,
              fontSize: '1rem'
            }}
          >
            Buyurtmalarga qaytish
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderDetails;