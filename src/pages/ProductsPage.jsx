import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import axios from 'axios';
import {
  Box, Container, Grid, Card, CardContent, CardMedia, Typography, Chip, CircularProgress, Alert,
  Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  FormControl, InputLabel, Select, Snackbar, useMediaQuery, useTheme, InputAdornment, Tooltip,
  Table, TableBody, TableCell, TableContainer, FormControlLabel, TableHead, TableRow, Paper, Checkbox,
  Badge, Avatar, Rating, Pagination
} from '@mui/material';
import {
  Fastfood as FastfoodIcon, LocalDining as KitchenIcon, Category as CategoryIcon,
  AttachMoney as PriceIcon, Discount as DiscountIcon, Refresh as RefreshIcon, Edit as EditIcon,
  Delete as DeleteIcon, Save as SaveIcon, Add as AddIcon, Search as SearchIcon, CloudUpload as CloudUploadIcon,
  Close as CloseIcon, ViewList as ViewListIcon, ViewModule as ViewModuleIcon, Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon, GetApp as GetAppIcon, ShoppingCart as CartIcon, Favorite as FavoriteIcon,
  Share as ShareIcon, FilterAlt as FilterIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { debounce } from 'lodash';
import { saveAs } from 'file-saver';
import { useDropzone } from 'react-dropzone';

// Error Boundary komponenti
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100dvh' }}>
          <Alert severity="error">
            <Typography>Xatolik yuz berdi: {this.state.error?.message || 'Noma\'lum xato'}</Typography>
            <Button onClick={() => window.location.reload()} color="inherit">Sahifani yangilash</Button>
          </Alert>
        </Box>
      );
    }
    return this.props.children;
  }
}

// Custom Theme
const createCustomTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: { main: '#3366ff' },
    secondary: { main: '#ff3d71' },
    success: { main: '#00d68f' },
    warning: { main: '#ffaa00' },
    background: {
      default: mode === 'light' ? '#f7f9fc' : '#121212',
      paper: mode === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(30, 30, 30, 0.9)'
    },
    text: {
      primary: mode === 'light' ? '#333' : '#fff',
      secondary: mode === 'light' ? '#666' : '#bbb'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    h4: { fontWeight: 700, fontSize: '1.75rem' },
    h5: { fontWeight: 600, fontSize: '1.25rem' },
    body2: { fontSize: '0.85rem' }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backdropFilter: 'blur(10px)',
          background: mode === 'light' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(30, 30, 30, 0.7)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)'
          },
          maxWidth: '100%',
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.3s',
          padding: '8px 16px'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          height: 'auto',
          padding: '2px 6px'
        }
      }
    }
  }
});

const ProductsList = () => {
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const isTablet = useMediaQuery(themeContext.breakpoints.between('sm', 'md'));
  const [themeMode, setThemeMode] = useState('light');
  const theme = useMemo(() => createCustomTheme(themeMode), [themeMode]);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productsToDelete, setProductsToDelete] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [filters, setFilters] = useState({
    categories: [],
    subcategories: [],
    kitchens: [],
    priceRange: [0, 100000],
    hasDiscount: false
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [kitchens, setKitchens] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [viewMode, setViewMode] = useState('cards');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const observer = useRef();
  const token = localStorage.getItem('token');

  const API_URL = 'https://hosilbek02.pythonanywhere.com/api/user/products/';
  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: { Authorization: token ? `Token ${token}` : '', 'Content-Type': 'application/json' }
  });

  const calculateGridColumns = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 4;
  };

  const fetchProducts = useCallback(async (pageNum = 1, append = false) => {
    if (!token) {
      setError('Foydalanuvchi tizimga kirmagan');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: pageNum,
        limit: productsPerPage,
        search: searchQuery || undefined,
        category: filters.categories.length > 0 ? filters.categories.join(',') : undefined,
        subcategory: filters.subcategories.length > 0 ? filters.subcategories.join(',') : undefined,
        kitchen: filters.kitchens.length > 0 ? filters.kitchens.join(',') : undefined,
        min_price: filters.priceRange[0] || undefined,
        max_price: filters.priceRange[1] || undefined,
        has_discount: filters.hasDiscount ? 'true' : undefined
      };
      const { data } = await axiosInstance.get('', { params });
      console.log('Fetch Products Response:', data);
      let newProducts = [];
      if (Array.isArray(data)) {
        newProducts = data;
        setHasMore(false);
      } else if (data.results && Array.isArray(data.results)) {
        newProducts = data.results;
        setHasMore(!!data.next);
      } else {
        throw new Error('Unexpected API response format');
      }
      setProducts(prev => append ? [...prev, ...newProducts] : newProducts);
    } catch (err) {
      console.error('Fetch Products Error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Mahsulotlarni yuklab bo‘lmadi');
    } finally {
      setLoading(false);
    }
  }, [token, searchQuery, filters]);

  const fetchInitialData = useCallback(async () => {
    if (!token) {
      setError('Foydalanuvchi tizimga kirmagan');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const headers = { Authorization: `Token ${token}` };
      const [kitchensRes, categoriesRes, subcategoriesRes] = await Promise.all([
        axios.get('https://hosilbek02.pythonanywhere.com/api/user/kitchens/', { headers }),
        axios.get('https://hosilbek02.pythonanywhere.com/api/user/categories/', { headers }),
        axios.get('https://hosilbek02.pythonanywhere.com/api/user/subcategories/', { headers })
      ]);
      setKitchens(Array.isArray(kitchensRes.data) ? kitchensRes.data : []);
      setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
      setSubcategories(Array.isArray(subcategoriesRes.data) ? subcategoriesRes.data : []);
      console.log('Initial Data:', { kitchens: kitchensRes.data, categories: categoriesRes.data, subcategories: subcategoriesRes.data });
    } catch (err) {
      console.error('Fetch Initial Data Error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Ma\'lumotlarni yuklab bo‘lmadi');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const filterProducts = useCallback((products, query, filters) => {
    let filtered = [...products];
    
    if (query) {
      filtered = filtered.filter(product =>
        [product.title, product.description, product.kitchen?.name, product.category?.name, product.subcategory?.name]
          .filter(field => field)
          .some(field => field.toLowerCase().includes(query.toLowerCase()))
      );
    }
    
    if (filters.categories.length > 0) {
      filtered = filtered.filter(p => p.category && filters.categories.includes(p.category.id));
    }
    
    if (filters.subcategories.length > 0) {
      filtered = filtered.filter(p => p.subcategory && filters.subcategories.includes(p.subcategory.id));
    }
    
    if (filters.kitchens.length > 0) {
      filtered = filtered.filter(p => p.kitchen && filters.kitchens.includes(p.kitchen.id));
    }
    
    filtered = filtered.filter(p => {
      const price = parseFloat(p.price || 0);
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });
    
    if (filters.hasDiscount) {
      filtered = filtered.filter(p => parseFloat(p.discount || 0) > 0);
    }
    
    return filtered;
  }, []);

  const filteredProducts = useMemo(() => 
    filterProducts(products, searchQuery, filters), 
    [products, searchQuery, filters, filterProducts]
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const debouncedSearch = useMemo(() => 
    debounce((value) => setSearchQuery(value), 300), 
    []
  );

  const lastProductElementRef = useCallback(node => {
    if (loading || !hasMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    fetchProducts(1);
    fetchInitialData();
    
    const savedFavorites = localStorage.getItem('favorites');
    const savedCart = localStorage.getItem('cart');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedCart) setCart(JSON.parse(savedCart));
  }, [fetchProducts, fetchInitialData]);

  useEffect(() => {
    if (page > 1) {
      fetchProducts(page, true);
    }
  }, [page, fetchProducts]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] },
    maxSize: 5 * 1024 * 1024,
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0];
      if (file) {
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    },
    onDropRejected: () => {
      setSnackbar({ open: true, message: 'Faqat JPG yoki PNG, maks. 5MB', severity: 'error' });
    }
  });

  const handleEdit = useCallback((product) => {
    setEditingProduct({
      ...product,
      kitchen_id: product.kitchen?.id || kitchens[0]?.id || '',
      category_id: product.category?.id || categories[0]?.id || '',
      subcategory_id: product.subcategory?.id || ''
    });
    setImageFile(null);
    setImagePreview(product.photo ? `https://hosilbek02.pythonanywhere.com${product.photo}` : null);
    console.log('Editing Product:', product);
  }, [kitchens, categories]);

  const handleSaveEdit = useCallback(async () => {
    if (!editingProduct || !token) {
      setSnackbar({ open: true, message: 'Foydalanuvchi tizimga kirmagan yoki mahsulot tanlanmagan', severity: 'error' });
      return;
    }
    if (!editingProduct.title || !editingProduct.price || !editingProduct.unit || !editingProduct.kitchen_id || !editingProduct.category_id) {
      setSnackbar({ open: true, message: 'Barcha majburiy maydonlarni to‘ldiring', severity: 'error' });
      return;
    }
    const formData = new FormData();
    formData.append('title', editingProduct.title);
    formData.append('price', parseFloat(editingProduct.price).toString());
    formData.append('unit', editingProduct.unit);
    formData.append('kitchen_id', editingProduct.kitchen_id);
    formData.append('category_id', editingProduct.category_id);
    formData.append('subcategory_id', editingProduct.subcategory_id ? String(editingProduct.subcategory_id) : '');
    if (editingProduct.description) formData.append('description', editingProduct.description);
    if (editingProduct.discount && parseFloat(editingProduct.discount) > 0) {
      formData.append('discount', parseFloat(editingProduct.discount).toString());
    }
    if (imageFile) formData.append('photo', imageFile);

    try {
      setLoading(true);
      console.log('FormData:', Object.fromEntries(formData));
      const url = editingProduct.id ? `${editingProduct.id}/` : '';
      const response = await axiosInstance[editingProduct.id ? 'put' : 'post'](url, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Token ${token}` }
      });
      console.log('Save Edit Response:', response.data);
      setSnackbar({ open: true, message: `Mahsulot ${editingProduct.id ? 'tahrirlandi' : 'qo‘shildi'}!`, severity: 'success' });
      setEditingProduct(null);
      setImageFile(null);
      setImagePreview(null);
      fetchProducts(1);
    } catch (err) {
      console.error('Save Edit Error:', err.response?.data || err.message);
      setSnackbar({ open: true, message: err.response?.data?.message || 'Amalni bajarishda xatolik', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [editingProduct, imageFile, token, fetchProducts]);

  const handleBulkDelete = useCallback(async () => {
    if (!token || productsToDelete.length === 0) {
      setSnackbar({ open: true, message: 'Foydalanuvchi tizimga kirmagan yoki mahsulot tanlanmagan', severity: 'error' });
      return;
    }
    try {
      setLoading(true);
      await Promise.all(productsToDelete.map(id => axiosInstance.delete(`${id}/`)));
      setSnackbar({ open: true, message: `${productsToDelete.length} ta mahsulot o‘chirildi!`, severity: 'success' });
      setDeleteDialogOpen(false);
      setProductsToDelete([]);
      fetchProducts(1);
    } catch (err) {
      console.error('Bulk Delete Error:', err.response?.data || err.message);
      setSnackbar({ open: true, message: err.response?.data?.message || 'O‘chirishda xatolik', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [token, productsToDelete, fetchProducts]);

  const exportToCSV = useCallback(() => {
    const headers = ['ID', 'Title', 'Kitchen', 'Category', 'Subcategory', 'Price', 'Discount', 'Unit', 'Rating'];
    const csvRows = [
      headers.join(','),
      ...filteredProducts.map(product =>
        [
          product.id || '',
          `"${product.title || ''}"`,
          product.kitchen?.name || 'N/A',
          product.category?.name || 'N/A',
          product.subcategory?.name || 'N/A',
          product.price || 0,
          product.discount || 0,
          product.unit || '',
          product.rating || 0
        ].join(',')
      )
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `products_${new Date().toISOString()}.csv`);
    setSnackbar({ open: true, message: 'Mahsulotlar CSV sifatida eksport qilindi', severity: 'success' });
  }, [filteredProducts]);

  const toggleFavorite = useCallback((productId) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const addToCart = useCallback((product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      let newCart;
      
      if (existingItem) {
        newCart = prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newCart = [...prev, { ...product, quantity: 1 }];
      }
      
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
    setSnackbar({ open: true, message: 'Mahsulot savatga qo‘shildi', severity: 'success' });
  }, []);

  const handleAddCategory = useCallback(async () => {
    if (!newCategoryName.trim()) {
      setSnackbar({ open: true, message: 'Kategoriya nomi kiritilishi shart', severity: 'error' });
      return;
    }
    try {
      setLoading(true);
      const headers = { Authorization: `Token ${token}` };
      const response = await axios.post('https://hosilbek02.pythonanywhere.com/api/user/categories/', { name: newCategoryName.trim() }, { headers });
      setCategories(prev => [...prev, response.data]);
      setNewCategoryName('');
      setSnackbar({ open: true, message: 'Kategoriya qo‘shildi!', severity: 'success' });
    } catch (err) {
      console.error('Add Category Error:', err.response?.data || err.message);
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
      const headers = { Authorization: `Token ${token}` };
      const response = await axios.post('https://hosilbek02.pythonanywhere.com/api/user/subcategories/', {
        name: newSubcategoryName.trim(),
        category_id: Number(editingProduct.category_id)
      }, { headers });
      setSubcategories(prev => [...prev, response.data]);
      setEditingProduct(prev => ({ ...prev, subcategory_id: response.data.id }));
      setNewSubcategoryName('');
      setSnackbar({ open: true, message: 'Subkategoriya qo‘shildi!', severity: 'success' });
    } catch (err) {
      console.error('Add Subcategory Error:', err.response?.data || err.message);
      setSnackbar({ open: true, message: err.response?.data?.message || 'Subkategoriya qo‘shishda xatolik', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [token, newSubcategoryName, editingProduct]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'categories' ? { subcategories: prev.subcategories.filter(id => {
        const subcategory = subcategories.find(s => s.id === id);
        return subcategory && value.includes(subcategory.category?.id);
      })} : {})
    }));
  };

  const resetFilters = () => {
    setFilters({
      categories: [],
      subcategories: [],
      kitchens: [],
      priceRange: [0, 100000],
      hasDiscount: false
    });
    setFilterDialogOpen(false);
  };

  const applyFilters = () => {
    setCurrentPage(1);
    setFilterDialogOpen(false);
    fetchProducts(1);
  };

  const renderPrice = (price, discount) => {
    if (discount > 0) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body1" fontWeight="bold" color="error">
            {parseFloat(price - discount).toLocaleString()} so'm
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
            {parseFloat(price).toLocaleString()} so'm
          </Typography>
          <Chip 
            label={`${Math.round((discount / price) * 100)}%`} 
            size="small" 
            color="error"
            sx={{ ml: 'auto' }}
          />
        </Box>
      );
    }
    return (
      <Typography variant="body1" fontWeight="bold">
        {parseFloat(price).toLocaleString()} so'm
      </Typography>
    );
  };

  if (!token) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100dvh' }}>
          <Alert severity="warning">
            Iltimos, tizimga kiring!{' '}
            <Button component="a" href="/login" color="inherit">Login</Button>
          </Alert>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" color="primary.main">
              Mahsulotlar Boshqaruvi
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Qidirish"
                size="small"
                onChange={e => debouncedSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
                sx={{ minWidth: 200 }}
                aria-label="Mahsulotlarni qidirish"
              />
              <Tooltip title="Filtrlar">
                <IconButton onClick={() => setFilterDialogOpen(true)}>
                  <Badge badgeContent={Object.values(filters).flat().length + (filters.hasDiscount ? 1 : 0)} color="primary">
                    <FilterIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title={viewMode === 'cards' ? 'Jadval ko‘rinishi' : 'Kartalar ko‘rinishi'}>
                <IconButton onClick={() => setViewMode(prev => prev === 'cards' ? 'table' : 'cards')}>
                  {viewMode === 'cards' ? <ViewListIcon /> : <ViewModuleIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Mavzuni o‘zgartirish">
                <IconButton onClick={() => setThemeMode(prev => prev === 'light' ? 'dark' : 'light')}>
                  {themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
                </IconButton>
              </Tooltip>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setEditingProduct({
                  title: '', description: '', kitchen_id: kitchens[0]?.id || '',
                  category_id: categories[0]?.id || '', subcategory_id: '', price: '', discount: '0.00', unit: 'gram'
                })}
                aria-label="Yangi mahsulot qo‘shish"
              >
                Yangi
              </Button>
              <Button
                variant="outlined"
                startIcon={<GetAppIcon />}
                onClick={exportToCSV}
                aria-label="CSV eksport"
                disabled={filteredProducts.length === 0}
              >
                Eksport
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => fetchProducts(1)}
                aria-label="Yangilash"
                disabled={loading}
              >
                Yangilash
              </Button>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 4 }} action={
              <Button color="inherit" onClick={() => fetchProducts(1)}>Qayta urinish</Button>
            }>
              {error}
            </Alert>
          )}

          {viewMode === 'cards' ? (
            <Grid container spacing={3}>
              {currentProducts.map((product, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={product.id || index}
                  ref={index === currentProducts.length - 1 ? lastProductElementRef : null}
                >
                  <Card>
                    <Box sx={{ position: 'relative' }}>
                      <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10, display: 'flex', gap: 1 }}>
                        <Tooltip title="Sevimlilar">
                          <IconButton
                            color={favorites.includes(product.id) ? 'error' : 'default'}
                            onClick={() => toggleFavorite(product.id)}
                            sx={{ bgcolor: 'rgba(255,255,255,0.8)' }}
                            size="small"
                          >
                            <FavoriteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Ulashish">
                          <IconButton
                            sx={{ bgcolor: 'rgba(255,255,255,0.8)' }}
                            size="small"
                            onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}/product/${product.id}`);
                              setSnackbar({ open: true, message: 'Havola nusxalandi!', severity: 'success' });
                            }}
                          >
                            <ShareIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Box sx={{ position: 'absolute', top: 8, left: 8, zIndex: 10, display: 'flex', gap: 1 }}>
                        <Tooltip title="Tahrirlash">
                          <IconButton
                            color="primary"
                            onClick={() => handleEdit(product)}
                            sx={{ bgcolor: 'rgba(255,255,255,0.8)' }}
                            size="small"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="O‘chirish">
                          <IconButton
                            color="error"
                            onClick={() => { setProductsToDelete([product.id]); setDeleteDialogOpen(true); }}
                            sx={{ bgcolor: 'rgba(255,255,255,0.8)' }}
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <CardMedia
                        component="img"
                        height="160"
                        image={product.photo ? `https://hosilbek02.pythonanywhere.com${product.photo}` : 'https://via.placeholder.com/300'}
                        alt={product.title || 'Mahsulot'}
                        sx={{ objectFit: 'cover' }}
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography
                          variant="h6"
                          noWrap
                          sx={{ fontSize: '0.95rem', fontWeight: 600 }}
                        >
                          {product.title || 'Noma\'lum'}
                        </Typography>
                        <Rating
                          value={product.rating || 0}
                          precision={0.5}
                          readOnly
                          size="small"
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          mb: 1.5,
                          fontSize: '0.8rem'
                        }}
                      >
                        {product.description || 'Tavsif yo‘q'}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, mb: 1.5, flexWrap: 'wrap' }}>
                        {product.kitchen && (
                          <Chip
                            icon={<KitchenIcon fontSize="small" />}
                            label={product.kitchen.name}
                            size="small"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                        {product.category && (
                          <Chip
                            icon={<CategoryIcon fontSize="small" />}
                            label={product.category.name}
                            size="small"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                        {product.subcategory && (
                          <Chip
                            label={product.subcategory.name}
                            size="small"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                      {renderPrice(product.price, product.discount)}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Chip
                          label={product.unit}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<CartIcon fontSize="small" />}
                          onClick={() => addToCart(product)}
                          sx={{ borderRadius: 2 }}
                        >
                          Savatga
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <TableContainer component={Paper}>
              <Table aria-label="Mahsulotlar jadvali">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={productsToDelete.length === filteredProducts.length && filteredProducts.length > 0}
                        onChange={() => setProductsToDelete(
                          productsToDelete.length === filteredProducts.length
                            ? []
                            : filteredProducts.map(p => p.id).filter(id => id)
                        )}
                      />
                    </TableCell>
                    <TableCell>Rasm</TableCell>
                    <TableCell>Nomi</TableCell>
                    <TableCell>Oshxona</TableCell>
                    <TableCell>Kategoriya</TableCell>
                    <TableCell>Narx</TableCell>
                    <TableCell>Amallar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentProducts.map((product, index) => (
                    <TableRow
                      key={product.id || index}
                      ref={index === currentProducts.length - 1 ? lastProductElementRef : null}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={productsToDelete.includes(product.id)}
                          onChange={() => setProductsToDelete(prev =>
                            prev.includes(product.id) ? prev.filter(id => id !== product.id) : [...prev, product.id]
                          )}
                          disabled={!product.id}
                        />
                      </TableCell>
                      <TableCell>
                        <Avatar
                          src={product.photo ? `https://hosilbek02.pythonanywhere.com${product.photo}` : 'https://via.placeholder.com/50'}
                          alt={product.title || 'Mahsulot'}
                          sx={{ width: 50, height: 50 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight="medium">{product.title || 'Noma\'lum'}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {product.description?.substring(0, 50)}{product.description?.length > 50 ? '...' : ''}
                        </Typography>
                      </TableCell>
                      <TableCell>{product.kitchen?.name || 'N/A'}</TableCell>
                      <TableCell>
                        {product.category?.name || 'N/A'}
                        {product.subcategory && (
                          <Typography variant="caption" display="block" color="text.secondary">
                            {product.subcategory.name}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {renderPrice(product.price, product.discount)}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Savatga qo'shish">
                            <IconButton color="primary" size="small" onClick={() => addToCart(product)}>
                              <CartIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Tahrirlash">
                            <IconButton color="primary" size="small" onClick={() => handleEdit(product)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="O‘chirish">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => { setProductsToDelete([product.id]); setDeleteDialogOpen(true); }}
                              disabled={!product.id}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
              <Typography ml={2}>Yuklanmoqda...</Typography>
            </Box>
          )}

          {filteredProducts.length === 0 && !loading && !error && (
            <Alert
              severity="info"
              sx={{ mt: 4 }}
              action={
                <Button
                  color="inherit"
                  onClick={() => setEditingProduct({
                    title: '', description: '', kitchen_id: kitchens[0]?.id || '',
                    category_id: categories[0]?.id || '', subcategory_id: '', price: '', discount: '0.00', unit: 'gram'
                  })}
                >
                  Yangi qo‘shish
                </Button>
              }
            >
              {searchQuery || filters.categories.length > 0 || filters.subcategories.length > 0
                ? 'Qidiruv yoki filtrlar bo‘yicha mahsulotlar topilmadi.'
                : 'Mahsulotlar topilmadi. Yangi mahsulot qo‘shing.'}
            </Alert>
          )}

          {filteredProducts.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                color="primary"
                showFirstButton
                showLastButton
                siblingCount={1}
                boundaryCount={1}
              />
            </Box>
          )}

          <Dialog open={!!editingProduct} onClose={() => { setEditingProduct(null); setImageFile(null); setImagePreview(null); }} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
              {editingProduct?.id ? 'Mahsulotni Tahrirlash' : 'Yangi Mahsulot Qo‘shish'}
            </DialogTitle>
            <DialogContent sx={{ py: 4 }}>
              <Box {...getRootProps()} sx={{
                height: 200,
                border: '2px dashed',
                borderColor: isDragActive ? 'primary.main' : 'divider',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: isDragActive ? 'action.selected' : 'action.hover',
                cursor: 'pointer',
                mb: 3
              }}>
                <input {...getInputProps()} />
                {imagePreview ? (
                  <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                    <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <IconButton
                      onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(null); }}
                      sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.5)', color: 'white' }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                    <CloudUploadIcon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography>Rasmni bu yerga tashlang yoki bosing</Typography>
                    <Typography variant="caption">PNG yoki JPEG, maks. 5MB</Typography>
                  </Box>
                )}
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nomi"
                    value={editingProduct?.title || ''}
                    onChange={e => setEditingProduct(prev => ({ ...prev, title: e.target.value }))}
                    required
                    InputProps={{ startAdornment: <InputAdornment position="start"><FastfoodIcon /></InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tavsif"
                    value={editingProduct?.description || ''}
                    onChange={e => setEditingProduct(prev => ({ ...prev, description: e.target.value }))}
                    multiline
                    rows={3}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Narx (so‘m)"
                    type="number"
                    value={editingProduct?.price || ''}
                    onChange={e => setEditingProduct(prev => ({ ...prev, price: e.target.value }))}
                    required
                    InputProps={{ startAdornment: <InputAdornment position="start"><PriceIcon /></InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Chegirma (so‘m)"
                    type="number"
                    value={editingProduct?.discount || '0.00'}
                    onChange={e => setEditingProduct(prev => ({ ...prev, discount: e.target.value }))}
                    InputProps={{ startAdornment: <InputAdornment position="start"><DiscountIcon /></InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>O‘lchov birligi</InputLabel>
                    <Select
                      value={editingProduct?.unit || 'gram'}
                      onChange={e => setEditingProduct(prev => ({ ...prev, unit: e.target.value }))}
                      label="O‘lchov birligi"
                    >
                      {['gram', 'liter', 'dona', 'kg', 'ml', 'portion'].map(unit => (
                        <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Oshxona</InputLabel>
                    <Select
                      value={editingProduct?.kitchen_id || ''}
                      onChange={e => setEditingProduct(prev => ({ ...prev, kitchen_id: e.target.value }))}
                      label="Oshxona"
                    >
                      {Array.isArray(kitchens) && kitchens.length > 0 ? (
                        kitchens.map(kitchen => (
                          <MenuItem key={kitchen.id} value={kitchen.id}>{kitchen.name}</MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No kitchens available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Kategoriya</InputLabel>
                    <Select
                      value={editingProduct?.category_id || ''}
                      onChange={e => {
                        const newCategoryId = e.target.value;
                        setEditingProduct(prev => ({
                          ...prev,
                          category_id: newCategoryId,
                          subcategory_id: ''
                        }));
                        console.log('Selected category_id:', newCategoryId);
                      }}
                      label="Kategoriya"
                    >
                      {Array.isArray(categories) && categories.length > 0 ? (
                        categories.map(category => (
                          <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No categories available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Subkategoriya</InputLabel>
                    <Select
                      value={editingProduct?.subcategory_id || ''}
                      onChange={e => {
                        const newSubcategoryId = e.target.value || '';
                        setEditingProduct(prev => ({
                          ...prev,
                          subcategory_id: newSubcategoryId
                        }));
                        console.log('Selected subcategory_id:', newSubcategoryId);
                      }}
                      label="Subkategoriya"
                      disabled={!editingProduct?.category_id}
                    >
                      {editingProduct?.category_id && Array.isArray(subcategories) ? (
                        subcategories
                          .filter(sub => sub.category?.id === Number(editingProduct.category_id))
                          .map(subcategory => (
                            <MenuItem key={subcategory.id} value={subcategory.id}>{subcategory.name}</MenuItem>
                          ))
                      ) : (
                        <MenuItem disabled>Avval kategoriyani tanlang</MenuItem>
                      )}
                      {editingProduct?.category_id && subcategories.filter(sub => sub.category?.id === Number(editingProduct.category_id)).length === 0 && (
                        <MenuItem disabled>No subcategories available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      label="Yangi kategoriya"
                      value={newCategoryName}
                      onChange={e => setNewCategoryName(e.target.value)}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleAddCategory}
                      disabled={!newCategoryName.trim()}
                    >
                      <AddIcon />
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      label="Yangi subkategoriya"
                      value={newSubcategoryName}
                      onChange={e => setNewSubcategoryName(e.target.value)}
                      disabled={!editingProduct?.category_id}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleAddSubcategory}
                      disabled={!newSubcategoryName.trim() || !editingProduct?.category_id}
                    >
                      <AddIcon />
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => { setEditingProduct(null); setImageFile(null); setImagePreview(null); }} color="inherit">
                Bekor qilish
              </Button>
              <Button onClick={handleSaveEdit} variant="contained" color="primary" startIcon={<SaveIcon />} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Saqlash'}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
            <DialogTitle sx={{ bgcolor: 'error.main', color: 'white' }}>
              Mahsulot(lar)ni O‘chirish
            </DialogTitle>
            <DialogContent sx={{ py: 3 }}>
              <Typography>
                {productsToDelete.length > 1
                  ? `${productsToDelete.length} ta mahsulotni o‘chirmoqchimisiz?`
                  : `Mahsulotni o‘chirmoqchimisiz?`}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Bu amalni qaytarib bo‘lmaydi.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">Bekor qilish</Button>
              <Button onClick={handleBulkDelete} color="error" variant="contained" disabled={loading}>
                O‘chirish
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
              Filtrlash
            </DialogTitle>
            <DialogContent sx={{ py: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Kategoriyalar</InputLabel>
                    <Select
                      multiple
                      value={filters.categories}
                      onChange={(e) => handleFilterChange('categories', e.target.value)}
                      label="Kategoriyalar"
                      renderValue={(selected) => selected.map(id => categories.find(c => c.id === id)?.name).filter(Boolean).join(', ')}
                    >
                      {Array.isArray(categories) && categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          <Checkbox checked={filters.categories.includes(category.id)} />
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Subkategoriyalar</InputLabel>
                    <Select
                      multiple
                      value={filters.subcategories}
                      onChange={(e) => handleFilterChange('subcategories', e.target.value)}
                      label="Subkategoriyalar"
                      renderValue={(selected) => selected.map(id => subcategories.find(s => s.id === id)?.name).filter(Boolean).join(', ')}
                      disabled={filters.categories.length === 0}
                    >
                      {Array.isArray(subcategories) && subcategories
                        .filter(sub => filters.categories.length === 0 || filters.categories.includes(sub.category?.id))
                        .map((subcategory) => (
                          <MenuItem key={subcategory.id} value={subcategory.id}>
                            <Checkbox checked={filters.subcategories.includes(subcategory.id)} />
                            {subcategory.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Oshxonalar</InputLabel>
                    <Select
                      multiple
                      value={filters.kitchens}
                      onChange={(e) => handleFilterChange('kitchens', e.target.value)}
                      label="Oshxonalar"
                      renderValue={(selected) => selected.map(id => kitchens.find(k => k.id === id)?.name).filter(Boolean).join(', ')}
                    >
                      {Array.isArray(kitchens) && kitchens.map((kitchen) => (
                        <MenuItem key={kitchen.id} value={kitchen.id}>
                          <Checkbox checked={filters.kitchens.includes(kitchen.id)} />
                          {kitchen.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Typography gutterBottom>Narx oralig'i</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField
                      label="Min"
                      type="number"
                      value={filters.priceRange[0]}
                      onChange={(e) => handleFilterChange('priceRange', [Number(e.target.value), filters.priceRange[1]])}
                      fullWidth
                    />
                    <Typography>-</Typography>
                    <TextField
                      label="Max"
                      type="number"
                      value={filters.priceRange[1]}
                      onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], Number(e.target.value)])}
                      fullWidth
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={filters.hasDiscount}
                        onChange={(e) => handleFilterChange('hasDiscount', e.target.checked)}
                      />
                    }
                    label="Faqat chegirmali mahsulotlar"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={resetFilters} color="inherit">
                Tozalash
              </Button>
              <Button onClick={applyFilters} variant="contained" color="primary">
                Qo'llash
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

// Error Boundary bilan o‘rash
const WrappedProductsList = () => (
  <ErrorBoundary>
    <ProductsList />
  </ErrorBoundary>
);

export default WrappedProductsList;