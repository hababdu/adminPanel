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
  Image as ImageIcon,
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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
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
      const errorMessage = err.response?.data?.message || 'Mahsulotlarni yuklab bo‘lmadi';
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
    filterProducts(query, selectedCategory, selectedSubcategory);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
    filterProducts(searchQuery, categoryId, null);
  };

  const handleSubcategoryClick = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
    filterProducts(searchQuery, selectedCategory, subcategoryId);
  };

  const filterProducts = (query, categoryId, subcategoryId) => {
    let filtered = products;

    if (query) {
      filtered = filtered.filter((product) =>
        product.title?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.kitchen?.name?.toLowerCase().includes(query) ||
        product.category?.name?.toLowerCase().includes(query) ||
        product.subcategory?.name?.toLowerCase().includes(query)
      );
    }

    if (categoryId) {
      filtered = filtered.filter((product) => product.category?.id === categoryId);
    }

    if (subcategoryId) {
      filtered = filtered.filter((product) => product.subcategory?.id === subcategoryId);
    }

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = [...new Map(products.map(p => [p.category?.id, p.category])).values()].filter(Boolean);
  const subcategories = selectedCategory
    ? [...new Map(products
        .filter(p => p.category?.id === selectedCategory)
        .map(p => [p.subcategory?.id, p.subcategory])).values()].filter(Boolean)
    : [];

  const handleEdit = (product) => {
    setEditingProduct({
      ...product,
      kitchen_id: product.kitchen?.id || 1,
      category_id: product.category?.id || 1,
      subcategory_id: product.subcategory?.id || 1,
    });
    setImageFile(null);
    setImagePreview(product.photo ? `https://hosilbek.pythonanywhere.com${product.photo}` : null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveEdit = async () => {
    if (!token) {
      showSnackbar('Foydalanuvchi tizimga kirmagan', 'error');
      return;
    }
    if (!editingProduct.title || !editingProduct.price || !editingProduct.unit) {
      showSnackbar('Iltimos, barcha majburiy maydonlarni to‘ldiring', 'error');
      return;
    }
    if (isNaN(editingProduct.price) || parseFloat(editingProduct.price) <= 0) {
      showSnackbar('Narx musbat son bo‘lishi kerak', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('title', editingProduct.title);
    formData.append('description', editingProduct.description || '');
    formData.append('price', parseFloat(editingProduct.price));
    formData.append('discount', editingProduct.discount ? parseFloat(editingProduct.discount) : 0);
    formData.append('unit', editingProduct.unit);
    formData.append('kitchen_id', editingProduct.kitchen_id || 1);
    formData.append('category_id', editingProduct.category_id || 1);
    formData.append('subcategory_id', editingProduct.subcategory_id || 1);
    if (imageFile) {
      formData.append('photo', imageFile);
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
      setImageFile(null);
      setImagePreview(null);
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
      const errorMessage = err.response?.data?.message || Object.values(err.response?.data || {}).flat().join(', ') || 'Ma\'lumotlar noto\'g\'ri';
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

  const getGridColumns = () => {
    if (isMobile) return 12; // 1 card per row on mobile
    if (isTablet) return 6;  // 2 cards per row on tablet
    return 4;               // 3 cards per row on desktop (md and larger)
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
        <Alert severity="error" action={<Button color="inherit" size="small" onClick={fetchProducts}>Qayta urinish</Button>}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Container  className="py-4">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h4" component="h1" className="font-bold text-blue-600">
          Barcha mahsulotlar
        </Typography>
        <Box className="flex gap-2 items-center">
          <TextField
            label="Mahsulotlarni qidirish"
            value={searchQuery}
            onChange={handleSearch}
            size="small"
            className="min-w-[150px] sm:min-w-[250px]"
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
              })
            }
            className="whitespace-nowrap"
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

      {/* Category Slider */}
      <Box className="mb-4">
        <Typography variant="h6" className="mb-2 font-semibold">Kategoriyalar</Typography>
        <Box className="overflow-x-auto whitespace-nowrap pb-2">
          <ul className="flex gap-2">
            <li>
              <Button
                variant={selectedCategory === null ? "contained" : "outlined"}
                color="primary"
                onClick={() => handleCategoryClick(null)}
                className="min-w-[100px]"
              >
                Hammasi
              </Button>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <Button
                  variant={selectedCategory === category.id ? "contained" : "outlined"}
                  color="primary"
                  onClick={() => handleCategoryClick(category.id)}
                  className="min-w-[100px]"
                >
                  {category.name}
                </Button>
              </li>
            ))}
          </ul>
        </Box>
      </Box>

      {/* Subcategory Slider */}
      {selectedCategory && subcategories.length > 0 && (
        <Box className="mb-4">
          <Typography variant="h6" className="mb-2 font-semibold">Subkategoriyalar</Typography>
          <Box className="overflow-x-auto whitespace-nowrap pb-2">
            <ul className="flex gap-2">
              <li>
                <Button
                  variant={selectedSubcategory === null ? "contained" : "outlined"}
                  color="secondary"
                  onClick={() => handleSubcategoryClick(null)}
                  className="min-w-[100px]"
                >
                  Hammasi
                </Button>
              </li>
              {subcategories.map((subcategory) => (
                <li key={subcategory.id}>
                  <Button
                    variant={selectedSubcategory === subcategory.id ? "contained" : "outlined"}
                    color="secondary"
                    onClick={() => handleSubcategoryClick(subcategory.id)}
                    className="min-w-[100px]"
                  >
                    {subcategory.name}
                  </Button>
                </li>
              ))}
            </ul>
          </Box>
        </Box>
      )}

      {(!Array.isArray(filteredProducts) || filteredProducts.length === 0) ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Alert
            severity="info"
            action={
              searchQuery || selectedCategory || selectedSubcategory ? null : (
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
                    })
                  }
                >
                  Yangi mahsulot qo'shish
                </Button>
              )
            }
          >
            {(searchQuery || selectedCategory || selectedSubcategory)
              ? 'Qidiruv yoki filtr bo‘yicha mahsulotlar topilmadi.'
              : 'Mahsulotlar topilmadi. Birinchi mahsulotni qo‘shing.'}
          </Alert>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filteredProducts.map((product) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              key={product.id}
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Card
                className="flex flex-col transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
                sx={{
                  width: '100%',
                  maxWidth: 300, // Constrain card width
                  borderRadius: 2,
                  border: !product.id ? '2px dashed' : '1px solid',
                  borderColor: !product.id ? 'primary.main' : 'divider',
                  backgroundColor: !product.id ? 'primary.light' + '22' : 'background.paper',
                }}
              >
                <Box className="absolute top-2 right-2 z-10">
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(product)}
                    className="bg-white hover:bg-blue-100 mr-1"
                    size="small"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => {
                      setProductToDelete(product);
                      setDeleteDialogOpen(true);
                    }}
                    className="bg-white hover:bg-red-100"
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>

                {product.photo ? (
                  <CardMedia
                    component="img"
                    height="120" // Reduced image height
                    image={`https://hosilbek.pythonanywhere.com${product.photo}`}
                    alt={product.title}
                    className="object-cover aspect-[4/3]"
                  />
                ) : (
                  <Box
                    height="120" // Reduced placeholder height
                    className="flex items-center justify-center bg-gray-100 aspect-[4/3]"
                  >
                    <FastfoodIcon fontSize="medium" color="disabled" />
                  </Box>
                )}

                <CardContent className="flex-grow" sx={{ padding: 2 }}>
                  <Box className="flex justify-between items-start mb-1">
                    <Typography variant="subtitle1" noWrap>
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
                    className="line-clamp-2 min-h-[2.5em] mb-1"
                    sx={{ fontSize: '0.85rem' }}
                  >
                    {product.description || 'Tavsif mavjud emas'}
                  </Typography>

                  <Box className="flex flex-wrap gap-1 mb-1">
                    <Chip
                      icon={<KitchenIcon fontSize="small" />}
                      label={product.kitchen?.name || 'Noma\'lum'}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                    <Chip
                      icon={<CategoryIcon fontSize="small" />}
                      label={product.category?.name || 'Noma\'lum'}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                    {product.subcategory && (
                      <Chip
                        label={product.subcategory.name}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    )}
                  </Box>

                  <Box className="mb-1">
                    <Box className="flex items-center mb-0.5">
                      <PriceIcon color="primary" fontSize="small" className="mr-1" />
                      <Typography variant="body2" className="mr-2 font-bold">
                        {parseFloat(product.price).toLocaleString()} so'm
                      </Typography>
                    </Box>
                    {parseFloat(product.discount) > 0 && (
                      <Box className="flex items-center">
                        <DiscountIcon color="error" fontSize="small" className="mr-1" />
                        <Typography variant="body2" color="error" className="line-through">
                          {parseFloat(product.discount).toLocaleString()} so'm
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {product.discounted_price && (
                    <Typography variant="caption" color="primary" className="font-bold mb-1">
                      Chegirmadagi narx: {parseFloat(product.discounted_price).toLocaleString()} so'm
                    </Typography>
                  )}

                  {renderRating(product.rating || 0)}

                  <Box className="mt-1 flex justify-between">
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

      <Dialog open={!!editingProduct} onClose={() => setEditingProduct(null)} maxWidth="sm" fullWidth>
        <DialogTitle className="bg-blue-600 text-white">
          {editingProduct?.id ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo\'shish'}
        </DialogTitle>
        <DialogContent className="py-3">
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
                startIcon={<ImageIcon />}
                fullWidth
                sx={{ marginTop: 2 }}
              >
                Rasm tanlash
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              {imagePreview && (
                <Box mt={2} display="flex" justifyContent="center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      objectFit: 'contain',
                      borderRadius: '4px',
                    }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setEditingProduct(null);
              setImageFile(null);
              setImagePreview(null);
            }}
            color="inherit"
          >
            Bekor qilish
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            disabled={loading}
            className="min-w-[120px]"
          >
            {loading ? <CircularProgress size={24} /> : 'Saqlash'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle className="bg-red-600 text-white">Mahsulotni o'chirish</DialogTitle>
        <DialogContent className="py-3">
          <Typography>
            Rostan ham <strong>{productToDelete?.title}</strong> mahsulotini o'chirmoqchimisiz?
          </Typography>
          <Typography variant="body2" color="text.secondary" className="mt-2">
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          className="w-full"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductsList;