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
  Snackbar,
  useMediaQuery,
  useTheme,
  InputAdornment,
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
  Add as AddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

const ProductsList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const API_URL = 'https://hosilbek.pythonanywhere.com/api/user/products/';

  const token = localStorage.getItem('token');

  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });

  const fetchProducts = async () => {
    if (!token) {
      setError('Foydalanuvchi tizimga kirmagan');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('');
      const fetchedProducts = Array.isArray(response.data) ? response.data : [];
      setProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Mahsulotlarni yuklab bo‘lmadi';
      setError(errorMessage);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = products.filter(
      (product) =>
        product.title?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.kitchen?.name?.toLowerCase().includes(query) ||
        product.category?.name?.toLowerCase().includes(query) ||
        product.subcategory?.name?.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getGridColumns = () => {
    if (isMobile) return 12;
    if (isTablet) return 6;
    return 4;
  };

  // Handle file change for photo upload
  const handleFileChange = (e) => {
    setEditingProduct({
      ...editingProduct,
      photo: e.target.files[0],
    });
  };

  const handleEdit = (product) => {
    setEditingProduct({
      ...product,
      kitchen_id: product.kitchen?.id || 1,
      category_id: product.category?.id || 1,
      subcategory_id: product.subcategory?.id || 1,
      photo: null, // Reset photo for editing
    });
  };

  const handleSaveEdit = async () => {
    if (!token) {
      showSnackbar('Foydalanuvchi tizimga kirmagan', 'error');
      return;
    }

    // Validate required fields
    if (!editingProduct.title || !editingProduct.price || !editingProduct.unit) {
      showSnackbar('Iltimos, barcha majburiy maydonlarni to‘ldiring (nomi, narx, birlik)', 'error');
      return;
    }

    if (isNaN(editingProduct.price) || parseFloat(editingProduct.price) <= 0) {
      showSnackbar('Narx musbat son bo‘lishi kerak', 'error');
      return;
    }

    // Prepare FormData for multipart/form-data request
    const formData = new FormData();
    formData.append('title', editingProduct.title);
    formData.append('description', editingProduct.description || '');
    formData.append('price', parseFloat(editingProduct.price));
    formData.append('discount', editingProduct.discount ? parseFloat(editingProduct.discount) : 0);
    formData.append('unit', editingProduct.unit);
    formData.append('kitchen_id', editingProduct.kitchen_id || 1);
    formData.append('category_id', editingProduct.category_id || 1);
    formData.append('subcategory_id', editingProduct.subcategory_id || 1);

    if (editingProduct.photo) {
      formData.append('photo', editingProduct.photo);
    }

    // Debug FormData
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      setLoading(true);
      if (editingProduct.id) {
        await axiosInstance.put(`${editingProduct.id}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showSnackbar('Mahsulot muvaffaqiyatli tahrirlandi!', 'success');
      } else {
        await axiosInstance.post('', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showSnackbar('Mahsulot muvaffaqiyatli qo‘shildi!', 'success');
      }
      await fetchProducts();
      setEditingProduct(null);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!token) {
      showSnackbar('Foydalanuvchi tizimga kirmagan', 'error');
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.delete(`${productToDelete.id}/`);
      showSnackbar('Mahsulot muvaffaqiyatli o‘chirildi!', 'success');
      await fetchProducts();
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleApiError = (err) => {
    if (err.response?.status === 400) {
      const errorMessage =
        err.response?.data?.message ||
        Object.values(err.response?.data || {})
          .flat()
          .join(', ') ||
        'Ma\'lumotlar noto\'g\'ri';
      showSnackbar(`Xatolik: ${errorMessage}`, 'error');
    } else if (err.response?.status === 401) {
      showSnackbar('Tizimga qayta kirish kerak. Sessiya tugagan.', 'error');
    } else {
      showSnackbar(err.response?.data?.message || 'Amalni bajarishda xatolik', 'error');
    }
  };

  const renderRating = (rating) => {
    const stars = [];
    const maxStars = 5;
    const roundedRating = Math.round(rating * 2) / 2;

    for (let i = 1; i <= maxStars; i++) {
      if (i <= roundedRating) {
        stars.push(<StarIcon key={i} color="primary" fontSize="small" />);
      } else if (i - 0.5 === roundedRating) {
        stars.push(<StarIcon key={i} color="primary" fontSize="small" style={{ opacity: 0.5 }} />);
      } else {
        stars.push(<StarEmptyIcon key={i} color="primary" fontSize="small" />);
      }
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

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

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

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
          Barcha mahsulotlar
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            label="Mahsulotlarni qidirish"
            value={searchQuery}
            onChange={handleSearch}
            size="small"
            sx={{ minWidth: { xs: 150, sm: 250 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
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
                photo: null, // Initialize photo as null
              })
            }
            sx={{ whiteSpace: 'nowrap' }}
          >
            Yangi mahsulot
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={fetchProducts}
            disabled={loading}
          >
            Yangilash
          </Button>
        </Box>
      </Box>

      {(!Array.isArray(filteredProducts) || filteredProducts.length === 0) ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Alert
            severity="info"
            action={
              searchQuery ? null : (
                <Button
                  color="info"
                  size="small"
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
                      photo: null,
                    })
                  }
                >
                  Yangi mahsulot qo'shish
                </Button>
              )
            }
          >
            {searchQuery ? 'Qidiruv bo‘yicha mahsulotlar topilmadi.' : 'Mahsulotlar topilmadi. Birinchi mahsulotni qo‘shing.'}
          </Alert>
        </Box>
      ) : (
        <Grid
          container
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            minHeight: '200px',
            width: '100%',
            padding: 2,
            backgroundColor: theme.palette.background.default,
          }}
          spacing={3}
        >
          {filteredProducts.map((product) => (
            <Grid item xs={getGridColumns()} key={product.id}>
              <Card
                sx={{
                  margin: '0 auto',
                  borderRadius: 2,
                  boxShadow: theme.shadows[2],
                  border: '1px solid ' + theme.palette.divider,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[6],
                  },
                  position: 'relative',
                  border: !product.id ? '2px dashed ' + theme.palette.primary.main : 'none',
                  backgroundColor: !product.id ? theme.palette.primary.light + '22' : 'background.paper',
                }}
              >
                <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(product)}
                    sx={{
                      backgroundColor: 'background.paper',
                      mr: 1,
                      '&:hover': { backgroundColor: theme.palette.primary.light },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => {
                      setProductToDelete(product);
                      setDeleteDialogOpen(true);
                    }}
                    sx={{
                      backgroundColor: 'background.paper',
                      '&:hover': { backgroundColor: theme.palette.error.light },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                {product.photo ? (
                  <CardMedia
                    component="img"
                    height="160"
                    image={`https://hosilbek.pythonanywhere.com${product.photo}`}
                    alt={product.title}
                    sx={{ objectFit: 'cover', aspectRatio: '4/3' }}
                  />
                ) : (
                  <Box
                    height="160"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bgcolor="action.hover"
                    sx={{ aspectRatio: '4/3' }}
                  >
                    <FastfoodIcon fontSize="large" color="disabled" />
                  </Box>
                )}

                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Typography gutterBottom variant="h6" component="h2" noWrap>
                      {product.title || 'Yangi mahsulot'}
                    </Typography>
                    <Chip
                      label={product.unit}
                      size="small"
                      color={!product.id ? 'primary' : 'secondary'}
                      variant={!product.id ? 'outlined' : 'filled'}
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={2}
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '4.5em',
                    }}
                  >
                    {product.description || 'Tavsif mavjud emas'}
                  </Typography>

                  <Box mb={1} display="flex" flexWrap="wrap" gap={1}>
                    <Chip
                      icon={<KitchenIcon fontSize="small" />}
                      label={product.kitchen?.name || 'Noma\'lum'}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      icon={<CategoryIcon fontSize="small" />}
                      label={product.category?.name || 'Noma\'lum'}
                      size="small"
                      variant="outlined"
                    />
                    {product.subcategory && (
                      <Chip
                        label={product.subcategory.name}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>

                  <Box mb={1}>
                    <Box display="flex" alignItems="center" mb={0.5}>
                      <PriceIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body1" sx={{ mr: 2, fontWeight: 'bold' }}>
                        {parseFloat(product.price).toLocaleString()} so'm
                      </Typography>
                    </Box>

                    {parseFloat(product.discount) > 0 && (
                      <Box display="flex" alignItems="center">
                        <DiscountIcon color="error" fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body1" color="error" sx={{ textDecoration: 'line-through' }}>
                          {parseFloat(product.discount).toLocaleString()} so'm
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {product.discounted_price && (
                    <Typography variant="subtitle2" color="primary" mb={1} sx={{ fontWeight: 'bold' }}>
                      Chegirmadagi narx: {parseFloat(product.discounted_price).toLocaleString()} so'm
                    </Typography>
                  )}

                  {renderRating(product.rating || 0)}

                  <Box mt={2} display="flex" justifyContent="space-between">
                    <Typography variant="caption" color="text.secondary">
                      {product.created_at ? new Date(product.created_at).toLocaleDateString() : 'Yangi'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {product.id || '—'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Edit/Add Dialog */}
      <Dialog open={!!editingProduct} onClose={() => setEditingProduct(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
          {editingProduct?.id ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo\'shish'}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
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
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ mt: 1 }}
              >
                Rasm Yuklash
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              {editingProduct?.photo && (
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Tanlangan fayl: {editingProduct.photo.name}
                </Typography>
              )}
            </Grid>
          </Grid>
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
            sx={{ minWidth: 120 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Saqlash'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ bgcolor: 'error.main', color: 'white' }}>Mahsulotni o'chirish</DialogTitle>
        <DialogContent sx={{ py: 3 }}>
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
            {loading ? <CircularProgress size={24} color="inherit" /> : 'O\'chirish'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductsList;