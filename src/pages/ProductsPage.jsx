import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar
} from '@mui/material';
import {
  Fastfood as FastfoodIcon,
  LocalDining as KitchenIcon,
  Category as CategoryIcon,
  AttachMoney as PriceIcon,
  Discount as DiscountIcon,
  Star as StarIcon,
  StarBorder as StarEmptyIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Add as AddIcon
} from '@mui/icons-material';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const API_URL = 'https://hosilbek.pythonanywhere.com/api/user/products/';

  // Get token from localStorage
  const token = localStorage.getItem('token');

  // Axios instance with default headers
  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });

  // Mahsulotlarni yuklash
  const fetchProducts = async () => {
    if (!token) {
      setError('Foydalanuvchi tizimga kirmagan');
      setLoading(false);
      console.log('No token found');
      return;
    }

    try {
      setLoading(true);
      setError(null); // Reset error state
      const response = await axiosInstance.get('');
      console.log('Fetch Products Response:', response.data);
      setProducts(Array.isArray(response.data) ? response.data : []);
      console.log('Products State Updated:', response.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Mahsulotlarni yuklab bo‘lmadi';
      setError(errorMessage);
      setProducts([]);
      console.error('Fetch Products Error:', err.response?.data || err);
    } finally {
      setLoading(false);
      console.log('Fetch Products Complete. Loading:', false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Mahsulotni tahrirlash
  const handleEdit = (product) => {
    setEditingProduct({
      ...product,
      kitchen_id: product.kitchen?.id || 1,
      category_id: product.category?.id || 1,
      subcategory_id: product.subcategory?.id || 1,
    });
    console.log('Editing Product:', product);
  };

  // Tahrirlashni saqlash
  const handleSaveEdit = async () => {
    if (!token) {
      setSnackbarMessage('Foydalanuvchi tizimga kirmagan');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.log('No token for edit');
      return;
    }

    // Validate required fields
    if (!editingProduct.title || !editingProduct.price || !editingProduct.unit) {
      setSnackbarMessage('Iltimos, barcha majburiy maydonlarni to‘ldiring (nomi, narx, birlik)');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.log('Validation failed:', editingProduct);
      return;
    }

    if (isNaN(editingProduct.price) || parseFloat(editingProduct.price) <= 0) {
      setSnackbarMessage('Narx musbat son bo‘lishi kerak');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.log('Invalid price:', editingProduct.price);
      return;
    }

    // Prepare payload with required fields
    const payload = {
      title: editingProduct.title,
      description: editingProduct.description || '',
      price: parseFloat(editingProduct.price),
      discount: editingProduct.discount ? parseFloat(editingProduct.discount) : 0,
      unit: editingProduct.unit,
      kitchen_id: editingProduct.kitchen_id || 1,
      category_id: editingProduct.category_id || 1,
      subcategory_id: editingProduct.subcategory_id || 1,
    };

    console.log('PUT Payload:', payload);

    try {
      setLoading(true);
      if (editingProduct.id) {
        // Update existing product
        const response = await axiosInstance.put(`${editingProduct.id}/`, payload);
        console.log('PUT Response:', response.data);
        setSnackbarMessage('Mahsulot muvaffaqiyatli tahrirlandi!');
      } else {
        // Create new product
        const response = await axiosInstance.post('', payload);
        console.log('POST Response:', response.data);
        setSnackbarMessage('Mahsulot muvaffaqiyatli qo‘shildi!');
      }
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      await fetchProducts(); // Ensure products are refreshed
      setEditingProduct(null);
      console.log('Edit successful, products refreshed');
    } catch (err) {
      console.error('PUT Error:', err.response?.data);
      if (err.response?.status === 400) {
        const errorMessage =
          err.response?.data?.message ||
          Object.values(err.response?.data || {})
            .flat()
            .join(', ') ||
          'Mahsulot ma‘lumotlari noto‘g‘ri';
        setSnackbarMessage(`Xatolik: ${errorMessage}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } else if (err.response?.status === 401) {
        setSnackbarMessage('Tizimga qayta kirish kerak. Sessiya tugagan.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage(err.response?.data?.message || 'Tahrirlashda xatolik yuz berdi');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } finally {
      setLoading(false);
      console.log('Edit Complete. Loading:', false);
    }
  };

  // Mahsulotni o'chirish
  const handleDelete = async () => {
    if (!token) {
      setSnackbarMessage('Foydalanuvchi tizimga kirmagan');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.log('No token for delete');
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.delete(`${productToDelete.id}/`);
      setSnackbarMessage('Mahsulot muvaffaqiyatli o‘chirildi!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      await fetchProducts();
    } catch (err) {
      setSnackbarMessage(err.response?.data?.message || 'O‘chirishda xatolik yuz berdi');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error('Delete Error:', err.response?.data);
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      console.log('Delete Complete. Loading:', false);
    }
  };

  // Baholarni ko'rsatish
  const renderRating = (rating) => {
    const stars = [];
    const maxStars = 5;

    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        i <= Math.floor(rating) ? (
          <StarIcon key={i} color="primary" fontSize="small" />
        ) : (
          <StarEmptyIcon key={i} color="primary" fontSize="small" />
        )
      );
    }

    return (
      <Box display="flex" alignItems="center">
        {stars}
        <Typography variant="caption" color="text.secondary" ml={1}>
          ({rating.toFixed(1)})
        </Typography>
      </Box>
    );
  };

  // Snackbar yopish
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Log current state for debugging
  console.log('Current State:', { products, loading, error, editingProduct });

  // Conditional rendering
  if (!token) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Alert severity="warning">Iltimos, tizimga kiring!</Alert>
      </Box>
    );
  }

  if (loading && !editingProduct) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography ml={2}>Mahsulotlar yuklanmoqda...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={fetchProducts}>
              Qayta urinish
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Alert severity="info">Mahsulotlar topilmadi</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Barcha mahsulotlar
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ mr: 2 }}
            onClick={() =>
              setEditingProduct({
                title: '',
                description: '',
                price: '',
                discount: '',
                unit: 'gram',
                kitchen_id: 1,
                category_id: 1,
                subcategory_id: 1,
              })
            }
          >
            Yangi mahsulot
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchProducts}
            disabled={loading}
          >
            Yangilash
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                <IconButton
                  color="primary"
                  onClick={() => handleEdit(product)}
                  sx={{ backgroundColor: 'background.paper', mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => {
                    setProductToDelete(product);
                    setDeleteDialogOpen(true);
                  }}
                  sx={{ backgroundColor: 'background.paper' }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>

              {product.photo && (
                <CardMedia
                  component="img"
                  height="200"
                  image={`https://hosilbek.pythonanywhere.com${product.photo}`}
                  alt={product.title}
                  sx={{ objectFit: 'cover' }}
                />
              )}

              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Typography gutterBottom variant="h6" component="h2" noWrap>
                    {product.title}
                  </Typography>
                  <Chip label={product.unit} size="small" color="secondary" />
                </Box>

                <Typography variant="body2" color="text.secondary" mb={2}>
                  {product.description || 'Tavsif mavjud emas'}
                </Typography>

                <Box mb={1}>
                  <Chip
                    icon={<KitchenIcon fontSize="small" />}
                    label={product.kitchen?.name || 'Noma’lum'}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    icon={<CategoryIcon fontSize="small" />}
                    label={product.category?.name || 'Noma’lum'}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                  {product.subcategory && (
                    <Chip
                      label={product.subcategory.name}
                      size="small"
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  )}
                </Box>

                <Box display="flex" alignItems="center" mb={1}>
                  <PriceIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body1" sx={{ mr: 2 }}>
                    {parseFloat(product.price).toLocaleString()} so'm
                  </Typography>

                  {parseFloat(product.discount) > 0 && (
                    <>
                      <DiscountIcon color="error" fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body1" color="error">
                        {parseFloat(product.discount).toLocaleString()} so'm
                      </Typography>
                    </>
                  )}
                </Box>

                {product.discounted_price && (
                  <Typography variant="subtitle2" color="primary" mb={1}>
                    Chegirmadagi narx: {parseFloat(product.discounted_price).toLocaleString()} so'm
                  </Typography>
                )}

                {renderRating(product.rating || 0)}

                <Box mt={2} display="flex" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">
                    {new Date(product.created_at).toLocaleDateString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ID: {product.id}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={!!editingProduct} onClose={() => setEditingProduct(null)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingProduct?.id ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo\'shish'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mahsulot nomi"
                  value={editingProduct?.title || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tavsif"
                  value={editingProduct?.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  margin="normal"
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Narx (so'm)"
                  type="number"
                  value={editingProduct?.price || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                  margin="normal"
                  required
                  InputProps={{
                    endAdornment: <Typography variant="body2">so'm</Typography>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Chegirma (so'm)"
                  type="number"
                  value={editingProduct?.discount || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, discount: e.target.value })}
                  margin="normal"
                  InputProps={{
                    endAdornment: <Typography variant="body2">so'm</Typography>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Birlik"
                  value={editingProduct?.unit || 'gram'}
                  onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                  margin="normal"
                  required
                >
                  {['gram', 'dona', 'litr', 'kg', 'porsiya'].map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingProduct(null)} color="inherit">
            Bekor qilish
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Saqlash'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Mahsulotni o'chirish</DialogTitle>
        <DialogContent>
          <Typography>
            Rostan ham <strong>{productToDelete?.title}</strong> mahsulotini o'chirmoqchimisiz?
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={2}>
            Bu amalni qaytarib bo'lmaydi.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Bekor qilish
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            disabled={loading}
          >
            O'chirish
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductsList;