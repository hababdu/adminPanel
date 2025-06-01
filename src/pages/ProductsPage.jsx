import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  FormControl,
  InputLabel,
  Select,
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
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  Scale as ScaleIcon,
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#3366ff' },
    secondary: { main: '#ff3d71' },
    success: { main: '#00d68f' },
    background: { default: '#f7f9fc' },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h4: { fontWeight: 700, fontSize: '1.75rem' },
    h5: { fontWeight: 600, fontSize: '1.25rem' },
  },
});

const ProductsList = () => {
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const isTablet = useMediaQuery(themeContext.breakpoints.between('sm', 'md'));

  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [filters, setFilters] = useState({ category: null, subcategory: null });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [kitchens, setKitchens] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const API_URL = 'https://hosilbek.pythonanywhere.com/api/user/products/';
  const token = localStorage.getItem('token');

  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: { Authorization: token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' },
  });

  const fetchProducts = useCallback(async () => {
    if (!token) {
      setError('Foydalanuvchi tizimga kirmagan');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const { data } = await axiosInstance.get('');
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Mahsulotlarni yuklab bo‘lmadi');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchInitialData = useCallback(async () => {
    if (!token) {
      setError('Foydalanuvchi tizimga kirmagan');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const headers = { Authorization: `Bearer ${token}` };
      const [kitchensRes, categoriesRes, subcategoriesRes] = await Promise.all([
        axios.get('https://hosilbek.pythonanywhere.com/api/user/kitchens/', { headers }),
        axios.get('https://hosilbek.pythonanywhere.com/api/user/categories/', { headers }),
        axios.get('https://hosilbek.pythonanywhere.com/api/user/subcategories/', { headers }),
      ]);
      setKitchens(Array.isArray(kitchensRes.data) ? kitchensRes.data : []);
      setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
      setSubcategories(Array.isArray(subcategoriesRes.data) ? subcategoriesRes.data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Ma\'lumotlarni yuklab bo‘lmadi');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const filterProducts = useCallback((query, category, subcategory) => {
    let filtered = products;
    if (query) {
      filtered = filtered.filter((product) =>
        [product.title, product.description, product.kitchen?.name, product.category?.name, product.subcategory?.name]
          .some((field) => field?.toLowerCase().includes(query))
      );
    }
    if (category) filtered = filtered.filter((p) => p.category?.id === category);
    if (subcategory) filtered = filtered.filter((p) => p.subcategory?.id === subcategory);
    return filtered;
  }, [products]);

  const categoriesList = useMemo(() => [...new Map(products.map((p) => [p.category?.id, p.category])).values()].filter(Boolean), [products]);
  const subcategoriesList = useMemo(() => {
    return filters.category
      ? [...new Map(products.filter((p) => p.category?.id === filters.category).map((p) => [p.subcategory?.id, p.subcategory])).values()].filter(Boolean)
      : [];
  }, [products, filters.category]);

  const filteredProducts = useMemo(() => filterProducts(searchQuery.toLowerCase(), filters.category, filters.subcategory), [searchQuery, filters, filterProducts]);

  useEffect(() => {
    fetchProducts();
    fetchInitialData();
  }, [fetchProducts, fetchInitialData]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleEdit = useCallback((product) => {
    setEditingProduct({
      ...product,
      kitchen_id: product.kitchen?.id || (kitchens[0]?.id || 1),
      category_id: product.category?.id || (categories[0]?.id || 1),
      subcategory_id: product.subcategory?.id || '',
    });
    setImageFile(null);
    setImagePreview(product.photo ? `https://hosilbek.pythonanywhere.com${product.photo}` : null);
  }, [kitchens, categories]);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setSnackbar({ open: true, message: 'Faqat JPG yoki PNG rasm formatlari qabul qilinadi', severity: 'error' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setSnackbar({ open: true, message: 'Rasm hajmi 5MB dan kichik bo‘lishi kerak', severity: 'error' });
      return;
    }
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }, [imagePreview]);

  const handleRemovePhoto = useCallback(() => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  }, [imagePreview]);

  const handleSaveEdit = useCallback(async () => {
    if (!token) {
      setSnackbar({ open: true, message: 'Foydalanuvchi tizimga kirmagan', severity: 'error' });
      return;
    }
    if (!editingProduct.title || !editingProduct.price || !editingProduct.unit) {
      setSnackbar({ open: true, message: 'Iltimos, barcha majburiy maydonlarni to‘ldiring', severity: 'error' });
      return;
    }
    if (isNaN(editingProduct.price) || parseFloat(editingProduct.price) <= 0) {
      setSnackbar({ open: true, message: 'Narx musbat son bo‘lishi kerak', severity: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('title', editingProduct.title);
    formData.append('description', editingProduct.description || '');
    formData.append('price', parseFloat(editingProduct.price));
    formData.append('discount', editingProduct.discount ? parseFloat(editingProduct.discount) : 0);
    formData.append('unit', editingProduct.unit);
    formData.append('kitchen_id', editingProduct.kitchen_id);
    formData.append('category_id', editingProduct.category_id);
    formData.append('subcategory_id', editingProduct.subcategory_id);
    if (imageFile) formData.append('photo', imageFile);

    try {
      setLoading(true);
      const url = editingProduct.id ? `${editingProduct.id}/` : '';
      await axiosInstance[editingProduct.id ? 'put' : 'post'](url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSnackbar({ open: true, message: `Mahsulot ${editingProduct.id ? 'tahrirlandi' : 'qo‘shildi'}!`, severity: 'success' });
      setEditingProduct(null);
      setImageFile(null);
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
      fetchProducts();
    } catch (err) {
      const errorMessage = err.response?.status === 401
        ? 'Tizimga qayta kirish kerak. Sessiya tugagan.'
        : err.response?.status === 400
        ? Object.values(err.response?.data || {}).flat().join(', ') || 'Ma\'lumotlar noto\'g\'ri'
        : err.response?.data?.message || 'Amalni bajarishda xatolik';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [token, editingProduct, imageFile, imagePreview, fetchProducts]);

  const handleDelete = useCallback(async () => {
    if (!token || !productToDelete) {
      setSnackbar({ open: true, message: 'Foydalanuvchi tizimga kirmagan yoki mahsulot tanlanmagan', severity: 'error' });
      return;
    }
    try {
      setLoading(true);
      await axiosInstance.delete(`${productToDelete.id}/`);
      setSnackbar({ open: true, message: 'Mahsulot o‘chirildi!', severity: 'success' });
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'O‘chirishda xatolik', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [token, productToDelete, fetchProducts]);

  const handleAddCategory = useCallback(async () => {
    if (!newCategoryName.trim()) {
      setSnackbar({ open: true, message: 'Kategoriya nomi kiritilishi shart', severity: 'error' });
      return;
    }
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post('https://hosilbek.pythonanywhere.com/api/user/categories/', { name: newCategoryName.trim() }, { headers });
      setCategories((prev) => [...prev, response.data]);
      setNewCategoryName('');
      setSnackbar({ open: true, message: 'Kategoriya muvaffaqiyatli qo‘shildi!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Kategoriya qo‘shishda xatolik', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [token, newCategoryName]);

  const handleAddSubcategory = useCallback(async () => {
    if (!newSubcategoryName.trim() || !editingProduct?.category_id) {
      setSnackbar({ open: true, message: 'Subkategoriya nomi va kategoriya tanlang', severity: 'error' });
      return;
    }
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post('https://hosilbek.pythonanywhere.com/api/user/subcategories/', {
        name: newSubcategoryName.trim(),
        category_id: Number(editingProduct.category_id),
      }, { headers });
      setSubcategories((prev) => [...prev, response.data]);
      setEditingProduct((prev) => ({ ...prev, subcategory_id: response.data.id }));
      setNewSubcategoryName('');
      setSnackbar({ open: true, message: 'Subkategoriya muvaffaqiyatli qo‘shildi!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Subkategoriya qo‘shishda xatolik', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [token, newSubcategoryName, editingProduct?.category_id]);

  const handleCloseSnackbar = useCallback(() => setSnackbar((prev) => ({ ...prev, open: false })), []);

  const getGridColumns = () => (isMobile ? 12 : isTablet ? 6 : 4);

  const renderRating = (rating = 0) => {
    const stars = [];
    const maxStars = 5;
    const roundedRating = Math.round(rating * 2) / 2;
    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        i <= roundedRating ? (
          <StarIcon key={i} color="primary" fontSize="small" />
        ) : i - 0.5 === roundedRating ? (
          <StarIcon key={i} color="primary" fontSize="small" style={{ opacity: 0.5 }} />
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

  if (!token) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}><Alert severity="warning">Iltimos, tizimga kiring!</Alert></Box>;
  if (loading && !editingProduct) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}><CircularProgress /><Typography ml={2}>Mahsulotlar yuklanmoqda...</Typography></Box>;
  if (error) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}><Alert severity="error" action={<Button color="inherit" size="small" onClick={fetchProducts}>Qayta urinish</Button>}>{error}</Alert></Box>;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ height: '100dvh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
        <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2, display: 'flex', alignItems: 'center', gap: 2, boxShadow: 1 }}>
          <Typography variant="h6" fontWeight="medium">Barcha mahsulotlar</Typography>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', p: 2, '&::-webkit-scrollbar': { width: 6 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'primary.light', borderRadius: 2 } }}>
          <Container maxWidth="md" disableGutters>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}></Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  label="Mahsulotlarni qidirish"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="small"
                  sx={{ minWidth: { xs: '150px', sm: '250px' } }}
                  InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => setEditingProduct({
                    title: '',
                    description: '',
                    kitchen_id: kitchens[0]?.id || '',
                    category_id: categories[0]?.id || '',
                    subcategory_id: '',
                    price: '',
                    discount: '0.00',
                    unit: 'gram',
                  })}
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

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'semibold' }}>Kategoriyalar</Typography>
              <Box sx={{ overflowX: 'auto', whiteSpace: 'nowrap', pb: 2 }}>
                <Box component="ul" sx={{ display: 'flex', gap: 1 }}>
                  <li>
                    <Button
                      variant={filters.category === null ? 'contained' : 'outlined'}
                      color="primary"
                      onClick={() => setFilters({ category: null, subcategory: null })}
                      sx={{ minWidth: '100px' }}
                    >
                      Hammasi
                    </Button>
                  </li>
                  {categoriesList.map((category) => (
                    <li key={category.id}>
                      <Button
                        variant={filters.category === category.id ? 'contained' : 'outlined'}
                        color="primary"
                        onClick={() => setFilters((prev) => ({ ...prev, category: category.id, subcategory: null }))}
                        sx={{ minWidth: '100px' }}
                      >
                        {category.name || 'Noma\'lum'}
                      </Button>
                    </li>
                  ))}
                </Box>
              </Box>
            </Box>

            {filters.category && subcategoriesList.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'semibold' }}>Subkategoriyalar</Typography>
                <Box sx={{ overflowX: 'auto', whiteSpace: 'nowrap', pb: 2 }}>
                  <Box component="ul" sx={{ display: 'flex', gap: 1 }}>
                    <li>
                      <Button
                        variant={filters.subcategory === null ? 'contained' : 'outlined'}
                        color="secondary"
                        onClick={() => setFilters((prev) => ({ ...prev, subcategory: null }))}
                        sx={{ minWidth: '100px' }}
                      >
                        Hammasi
                      </Button>
                    </li>
                    {subcategoriesList.map((subcategory) => (
                      <li key={subcategory.id}>
                        <Button
                          variant={filters.subcategory === subcategory.id ? 'contained' : 'outlined'}
                          color="secondary"
                          onClick={() => setFilters((prev) => ({ ...prev, subcategory: subcategory.id }))}
                          sx={{ minWidth: '100px' }}
                        >
                          {subcategory.name || 'Noma\'lum'}
                        </Button>
                      </li>
                    ))}
                  </Box>
                </Box>
              </Box>
            )}

            {filteredProducts.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                <Alert
                  severity="info"
                  action={!searchQuery && !filters.category && !filters.subcategory ? (
                    <Button color="info" size="small" onClick={() => setEditingProduct({
                      title: '',
                      description: '',
                      kitchen_id: kitchens[0]?.id || '',
                      category_id: categories[0]?.id || '',
                      subcategory_id: '',
                      price: '',
                      discount: '0.00',
                      unit: 'gram',
                    })}>
                      Yangi mahsulot qo'shish
                    </Button>
                  ) : null}
                >
                  {searchQuery || filters.category || filters.subcategory ? 'Qidiruv yoki filtr bo‘yicha mahsulotlar topilmadi.' : 'Mahsulotlar topilmadi. Birinchi mahsulotni qo‘shing.'}
                </Alert>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {filteredProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={4} key={product.id || Math.random()} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Card
                      sx={{
                        width: '100%',
                        maxWidth: 300,
                        borderRadius: 2,
                        border: !product.id ? '2px dashed' : '1px solid',
                        borderColor: !product.id ? 'primary.main' : 'divider',
                        backgroundColor: !product.id ? 'primary.light' + '22' : 'background.paper',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 },
                      }}
                    >
                      <Box sx={{ position: 'absolute', top: 2, right: 2, zIndex: 10 }}>
                        <IconButton color="primary" onClick={() => handleEdit(product)} size="small" sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'blue.50' }, mr: 0.5 }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton color="error" onClick={() => { setProductToDelete(product); setDeleteDialogOpen(true); }} size="small" sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'red.50' } }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      {product.photo ? (
                        <CardMedia component="img" height="120" image={`https://hosilbek.pythonanywhere.com${product.photo}`} alt={product.title || 'Mahsulot'} sx={{ objectFit: 'cover', aspectRatio: '4/3' }} />
                      ) : (
                        <Box sx={{ height: 120, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'grey.100', aspectRatio: '4/3' }}>
                          <FastfoodIcon fontSize="medium" color="disabled" />
                        </Box>
                      )}
                      <CardContent sx={{ flexGrow: 1, p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                          <Typography variant="subtitle1" noWrap>{product.title || 'Yangi mahsulot'}</Typography>
                          <Chip label={product.unit || 'Noma\'lum'} size="small" color={!product.id ? 'primary' : 'secondary'} variant={!product.id ? 'outlined' : 'filled'} />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ lineClamp: 2, minHeight: '2.5em', mb: 1, fontSize: '0.85rem' }}>
                          {product.description || 'Tavsif mavjud emas'}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                          <Chip icon={<KitchenIcon fontSize="small" />} label={product.kitchen?.name || 'Noma\'lum'} size="small" variant="outlined" sx={{ fontSize: '0.75rem' }} />
                          <Chip icon={<CategoryIcon fontSize="small" />} label={product.category?.name || 'Noma\'lum'} size="small" variant="outlined" sx={{ fontSize: '0.75rem' }} />
                          {product.subcategory && <Chip label={product.subcategory.name || 'Noma\'lum'} size="small" variant="outlined" sx={{ fontSize: '0.75rem' }} />}
                        </Box>
                        <Box sx={{ mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <PriceIcon color="primary" fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant="body2" sx={{ mr: 1, fontWeight: 'bold' }}>{parseFloat(product.price || 0).toLocaleString()} so'm</Typography>
                          </Box>
                          {parseFloat(product.discount) > 0 && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <DiscountIcon color="error" fontSize="small" sx={{ mr: 0.5 }} />
                              <Typography variant="body2" color="error" sx={{ textDecoration: 'line-through' }}>{parseFloat(product.discount).toLocaleString()} so'm</Typography>
                            </Box>
                          )}
                        </Box>
                        {product.discounted_price && (
                          <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Chegirmadagi narx: {parseFloat(product.discounted_price).toLocaleString()} so'm
                          </Typography>
                        )}
                        {renderRating(product.rating)}
                        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption" color="text.secondary">
                            {product.created_at ? new Date(product.created_at).toLocaleDateString() : 'Yangi'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">ID: {product.id || '—'}</Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Container>
        </Box>

        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', boxShadow: '0 -2px 8px rgba(0,0,0,0.05)' }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={fetchProducts}
            disabled={loading}
            sx={{ py: 1.5, borderRadius: 2, fontWeight: 'medium', textTransform: 'none', fontSize: '1rem' }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Yangilash'}
          </Button>
        </Box>

        <Dialog open={!!editingProduct} onClose={() => { setEditingProduct(null); setImageFile(null); if (imagePreview) URL.revokeObjectURL(imagePreview); setImagePreview(null); }} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
            {editingProduct?.id ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo‘shish'}
          </DialogTitle>
          <DialogContent sx={{ py: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'text.primary' }}>
                      <ImageIcon color="primary" sx={{ mr: 1 }} /> Mahsulot Rasmi
                    </Typography>
                    <Box
                      sx={{
                        height: 150,
                        bgcolor: 'action.hover',
                        borderRadius: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        position: 'relative',
                        border: '1px dashed',
                        borderColor: 'divider',
                        cursor: 'pointer',
                        '&:hover': { borderColor: 'primary.main', bgcolor: 'action.selected' },
                      }}
                      onClick={() => document.getElementById('file-upload').click()}
                    >
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} alt="Mahsulot rasmi" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <IconButton
                            onClick={(e) => { e.stopPropagation(); handleRemovePhoto(); }}
                            size="small"
                            sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'text.secondary' }}>
                            <CloudUploadIcon fontSize="medium" sx={{ mb: 1 }} />
                            <Typography variant="body2" align="center">Rasm yuklash uchun bosing</Typography>
                            <Typography variant="caption" align="center">PNG yoki JPEG, maks. 5MB</Typography>
                          </Box>
                        </>
                      )}
                      <input id="file-upload" type="file" accept="image/jpeg,image/png" hidden onChange={handleImageChange} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'text.primary' }}>
                      <InfoIcon color="primary" sx={{ mr: 1 }} /> Asosiy Ma'lumotlar
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Mahsulot nomi"
                          name="title"
                          value={editingProduct?.title || ''}
                          onChange={(e) => setEditingProduct((prev) => ({ ...prev, title: e.target.value }))}
                          required
                          InputProps={{ startAdornment: <InputAdornment position="start"><FastfoodIcon color="primary" fontSize="small" /></InputAdornment> }}
                          sx={{ mb: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Tavsif"
                          name="description"
                          value={editingProduct?.description || ''}
                          onChange={(e) => setEditingProduct((prev) => ({ ...prev, description: e.target.value }))}
                          multiline
                          rows={3}
                          sx={{ mb: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Narx (so'm)"
                          name="price"
                          value={editingProduct?.price || ''}
                          onChange={(e) => setEditingProduct((prev) => ({ ...prev, price: e.target.value }))}
                          type="number"
                          required
                          InputProps={{ startAdornment: <InputAdornment position="start"><PriceIcon color="primary" fontSize="small" /></InputAdornment>, inputProps: { min: 0 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Chegirma (so'm)"
                          name="discount"
                          value={editingProduct?.discount || '0.00'}
                          onChange={(e) => setEditingProduct((prev) => ({ ...prev, discount: e.target.value }))}
                          type="number"
                          InputProps={{ startAdornment: <InputAdornment position="start"><DiscountIcon color="primary" fontSize="small" /></InputAdornment>, inputProps: { min: 0 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                          <InputLabel>O'lchov birligi</InputLabel>
                          <Select
                            name="unit"
                            value={editingProduct?.unit || 'gram'}
                            onChange={(e) => setEditingProduct((prev) => ({ ...prev, unit: e.target.value }))}
                            label="O'lchov birligi"
                            required
                          >
                            {['gram', 'liter', 'dona', 'kg', 'ml', 'portion'].map((unit) => (
                              <MenuItem key={unit} value={unit}>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <ScaleIcon fontSize="small" />
                                  {unit}
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                          <InputLabel>Oshxona</InputLabel>
                          <Select
                            name="kitchen_id"
                            value={editingProduct?.kitchen_id || ''}
                            onChange={(e) => setEditingProduct((prev) => ({ ...prev, kitchen_id: e.target.value }))}
                            label="Oshxona"
                            required
                          >
                            {kitchens.map((kitchen) => (
                              <MenuItem key={kitchen.id} value={kitchen.id}>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <KitchenIcon fontSize="small" />
                                  {kitchen.name}
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'text.primary' }}>
                      <CategoryIcon color="primary" sx={{ mr: 1 }} /> Kategoriyalar
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Kategoriya</InputLabel>
                          <Select
                            name="category_id"
                            value={editingProduct?.category_id || ''}
                            onChange={(e) => setEditingProduct((prev) => ({ ...prev, category_id: e.target.value, subcategory_id: '' }))}
                            label="Kategoriya"
                            required
                          >
                            {categories.map((category) => (
                              <MenuItem key={category.id} value={category.id}>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <CategoryIcon fontSize="small" />
                                  {category.name}
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Subkategoriya</InputLabel>
                          <Select
                            name="subcategory_id"
                            value={editingProduct?.subcategory_id || ''}
                            onChange={(e) => setEditingProduct((prev) => ({ ...prev, subcategory_id: e.target.value }))}
                            label="Subkategoriya"
                            disabled={!editingProduct?.category_id}
                          >
                            {editingProduct?.category_id ? (
                              subcategories
                                .filter((sub) => sub.category?.id === Number(editingProduct.category_id))
                                .map((subcategory) => (
                                  <MenuItem key={subcategory.id} value={subcategory.id}>
                                    {subcategory.name}
                                  </MenuItem>
                                ))
                            ) : (
                              <MenuItem disabled>Avval kategoriyani tanlang</MenuItem>
                            )}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Yangi kategoriya nomi"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            sx={{ flex: 1 }}
                          />
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={handleAddCategory}
                            disabled={!newCategoryName.trim()}
                            sx={{ minWidth: 40 }}
                          >
                            <AddIcon fontSize="small" />
                          </Button>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Yangi subkategoriya nomi"
                            value={newSubcategoryName}
                            onChange={(e) => setNewSubcategoryName(e.target.value)}
                            disabled={!editingProduct?.category_id}
                            sx={{ flex: 1 }}
                          />
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={handleAddSubcategory}
                            disabled={!newSubcategoryName.trim() || !editingProduct?.category_id}
                            sx={{ minWidth: 40 }}
                          >
                            <AddIcon fontSize="small" />
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setEditingProduct(null); setImageFile(null); if (imagePreview) URL.revokeObjectURL(imagePreview); setImagePreview(null); }} color="inherit">Bekor qilish</Button>
            <Button onClick={handleSaveEdit} variant="contained" color="primary" startIcon={<SaveIcon />} disabled={loading} sx={{ minWidth: '120px' }}>
              {loading ? <CircularProgress size={24} /> : 'Saqlash'}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle sx={{ bgcolor: 'red.600', color: 'white' }}>Mahsulotni o'chirish</DialogTitle>
          <DialogContent sx={{ py: 3 }}>
            <Typography>Rostan ham <strong>{productToDelete?.title || 'Mahsulot'}</strong> mahsulotini o'chirmoqchimisiz?</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Bu amalni qaytarib bo'lmaydi.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">Bekor qilish</Button>
            <Button onClick={handleDelete} variant="contained" color="error" startIcon={<DeleteIcon />} disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'O\'chirish'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default ProductsList;