import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Box, Button, TextField, Typography, Container, Card, CardContent, Avatar,
  Snackbar, Alert, InputAdornment, Select, MenuItem, FormControl, InputLabel,
  Grid, Paper, Divider, IconButton, CircularProgress ,FormHelperText
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Fastfood as FastfoodIcon,
  Kitchen as KitchenIcon,
  Category as CategoryIcon,
  AttachMoney as PriceIcon,
  Discount as DiscountIcon,
  UploadFile as UploadIcon,
  Scale as ScaleIcon,
  Add as AddIcon,
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  ArrowBackIos as ArrowBackIosIcon,
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon,
  Info as InfoIcon
} from '@mui/icons-material';

// MUI theme
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

const AddProductPage = () => {
  // State management
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    kitchen_id: '',
    category_id: '',
    subcategory_id: '',
    price: '',
    discount: '0.00',
    unit: 'gram',
  });
  
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [kitchens, setKitchens] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubcategoriesLoading, setIsSubcategoriesLoading] = useState(false);

  const unitOptions = ['gram', 'liter', 'dona', 'kg', 'ml', 'portion'];

  // Get token from localStorage
  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Autentifikatsiya tokeni topilmadi');
    }
    return { Authorization: `Bearer ${token}` };
  }, []);

  // Fetch initial data
  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    setIsSubcategoriesLoading(true);
    setError('');
    
    try {
      const headers = getAuthHeader();
      const [kitchensRes, categoriesRes, subcategoriesRes] = await Promise.all([
        axios.get('https://hosilbek.pythonanywhere.com/api/user/kitchens/', { headers }),
        axios.get('https://hosilbek.pythonanywhere.com/api/user/categories/', { headers }),
        axios.get('https://hosilbek.pythonanywhere.com/api/user/subcategories/', { headers }),
      ]);

      console.log('Kitchens API response:', kitchensRes.data);
      console.log('Categories API response:', categoriesRes.data);
      console.log('Subcategories API response:', subcategoriesRes.data);

      if (!Array.isArray(kitchensRes.data)) throw new Error('Oshxonalar ro‘yxati massiv emas');
      if (!Array.isArray(categoriesRes.data)) throw new Error('Kategoriyalar ro‘yxati massiv emas');
      if (!Array.isArray(subcategoriesRes.data)) throw new Error('Subkategoriyalar ro‘yxati massiv emas');

      setKitchens(kitchensRes.data);
      setCategories(categoriesRes.data);
      setSubcategories(subcategoriesRes.data);

      if (kitchensRes.data.length > 0) {
        setFormData(prev => ({ ...prev, kitchen_id: kitchensRes.data[0].id }));
      }
      if (categoriesRes.data.length > 0 && !formData.category_id) {
        setFormData(prev => ({ ...prev, category_id: categoriesRes.data[0].id }));
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
      setIsSubcategoriesLoading(false);
    }
  }, [getAuthHeader]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Update subcategory_id when category_id changes
  useEffect(() => {
    if (!formData.category_id) return;

    const availableSubcategories = subcategories.filter(
      sub => sub.category && sub.category.id === Number(formData.category_id)
    );
    console.log('Filtered subcategories:', availableSubcategories);

    setFormData(prev => ({ ...prev, subcategory_id: '' }));

    if (availableSubcategories.length > 0) {
      setFormData(prev => ({ ...prev, subcategory_id: availableSubcategories[0].id }));
    }
  }, [formData.category_id, subcategories]);

  // Handle API errors
  const handleApiError = (error) => {
    if (error.response) {
      const errorDetail = error.response.data;
      switch (error.response.status) {
        case 401:
          setError('Sessiya tugadi. Iltimos, qayta kiring.');
          break;
        case 400:
          if (typeof errorDetail === 'object') {
            const errors = Object.values(errorDetail).flat().join(', ');
            setError(`Noto‘g‘ri ma’lumot: ${errors || 'Iltimos, kiritilgan ma’lumotlarni tekshiring'}`);
          } else {
            setError(`Noto‘g‘ri ma’lumot: ${errorDetail || 'Iltimos, kiritilgan ma’lumotlarni tekshiring'}`);
          }
          break;
        case 500:
          setError('Server xatosi. Iltimos, keyinroq qayta urinib ko‘ring.');
          break;
        default:
          setError(error.response.data.message || 'Xato yuz berdi');
      }
    } else if (error.message === 'Autentifikatsiya tokeni topilmadi') {
      setError('Iltimos, tizimga kiring');
    } else {
      setError(error.message || 'Kutilmagan xato yuz berdi');
    }
    console.error('API xatosi:', error.response?.data || error);
  };

  // Handle photo preview
  useEffect(() => {
    if (!photo) {
      setPhotoPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(photo);
    setPhotoPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Faqat JPG yoki PNG rasm formatlari qabul qilinadi');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Rasm hajmi 5MB dan kichik bo‘lishi kerak');
      return;
    }

    setPhoto(file);
    setError('');
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  // Add new category
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setError('Kategoriya nomi kiritilishi shart');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const headers = getAuthHeader();
      const response = await axios.post(
        'https://hosilbek.pythonanywhere.com/api/user/categories/',
        { name: newCategoryName.trim() },
        { headers }
      );

      setCategories(prev => [...prev, response.data]);
      setFormData(prev => ({ ...prev, category_id: response.data.id }));
      setNewCategoryName('');
      setSuccess('Kategoriya muvaffaqiyatli qo‘shildi!');
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add new subcategory
  const handleAddSubcategory = async () => {
    if (!newSubcategoryName.trim()) {
      setError('Subkategoriya nomi kiritilishi shart');
      return;
    }
    if (!formData.category_id || isNaN(Number(formData.category_id))) {
      setError('Iltimos, to‘g‘ri kategoriyani tanlang');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const headers = getAuthHeader();
      const payload = {
        name: newSubcategoryName.trim(),
        category_id: Number(formData.category_id),
      };
      console.log('Subcategory POST payload:', payload);

      const response = await axios.post(
        'https://hosilbek.pythonanywhere.com/api/user/subcategories/',
        payload,
        { headers }
      );

      console.log('Subcategory API response:', response.data);

      setSubcategories(prev => [...prev, response.data]);
      setFormData(prev => ({ ...prev, subcategory_id: response.data.id }));
      setNewSubcategoryName('');
      setSuccess('Subkategoriya muvaffaqiyatli qo‘shildi!');
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title.trim()) {
      setError('Mahsulot nomi kiritilishi shart');
      return;
    }
    if (!formData.description.trim()) {
      setError('Tavsif kiritilishi shart');
      return;
    }
    if (!formData.kitchen_id) {
      setError('Oshxona tanlanishi shart');
      return;
    }
    if (!formData.category_id) {
      setError('Kategoriya tanlanishi shart');
      return;
    }
    if (!formData.subcategory_id) {
      setError('Subkategoriya tanlanishi shart');
      return;
    }
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      setError('Iltimos, to‘g‘ri narx kiriting');
      return;
    }
    if (!photo) {
      setError('Iltimos, mahsulot rasmini yuklang');
      return;
    }

    setIsLoading(true);
    
    try {
      const headers = {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data'
      };

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      formDataToSend.append('photo', photo);

      const response = await axios.post(
        'https://hosilbek.pythonanywhere.com/api/user/products/',
        formDataToSend,
        { headers }
      );

      setSuccess('Mahsulot muvaffaqiyatli qo‘shildi!');
      setFormData({
        title: '',
        description: '',
        kitchen_id: formData.kitchen_id,
        category_id: formData.category_id,
        subcategory_id: '',
        price: '',
        discount: '0.00',
        unit: 'gram',
      });
      setPhoto(null);
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError('');
    setSuccess('');
  };

  return (
<ThemeProvider theme={theme}>
  <Box sx={{
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    bgcolor: 'background.default'
  }}>
    {/* Sarlavha qismi */}
    <Box sx={{
      bgcolor: 'primary.main',
      color: 'white',
      p: 2,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      boxShadow: 1
    }}>
      <IconButton 
        color="inherit" 
        onClick={() => navigate(-1)}
        sx={{ '&:hover': { bgcolor: 'primary.dark' } }}
      >
        <ArrowBackIosIcon fontSize="small" />
      </IconButton>
      <Typography variant="h6" fontWeight="medium">
        Yangi Mahsulot Qo'shish
      </Typography>
    </Box>

    {/* Asosiy kontent - scroll qilinadigan qism */}
    <Box sx={{
      flex: 1,
      overflowY: 'auto',
      p: 2,
      '&::-webkit-scrollbar': { width: 6 },
      '&::-webkit-scrollbar-thumb': { bgcolor: 'primary.light', borderRadius: 2 }
    }}>
      <Container maxWidth="sm" disableGutters>
        {/* Rasm yuklash qismi */}
        <Card sx={{ 
          mb: 3, 
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <CardContent sx={{ p: 2 }}>
            <Typography 
              variant="subtitle1" 
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', color: 'text.primary' }}
            >
              <ImageIcon color="primary" sx={{ mr: 1 }} />
              Mahsulot Rasmi
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
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'action.selected'
                }
              }}
              onClick={() => document.getElementById('file-upload').click()}
            >
              {photoPreview ? (
                <>
                  <img
                    src={photoPreview}
                    alt="Mahsulot rasmi"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePhoto();
                    }}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <>
                  <Box sx={{ 
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    color: 'text.secondary'
                  }}>
                    <CloudUploadIcon fontSize="medium" sx={{ mb: 1 }} />
                    <Typography variant="body2" align="center">
                      Rasm yuklash uchun bosing
                    </Typography>
                    <Typography variant="caption" align="center">
                      PNG yoki JPEG, maks. 5MB
                    </Typography>
                  </Box>
                </>
              )}
              <input
                id="file-upload"
                type="file"
                accept="image/jpeg,image/png"
                hidden
                onChange={handleFileChange}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Asosiy maydonlar */}
        <Card sx={{ 
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          mb: 3
        }}>
          <CardContent sx={{ p: 2 }}>
            <Typography 
              variant="subtitle1" 
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', color: 'text.primary' }}
            >
              <InfoIcon color="primary" sx={{ mr: 1 }} />
              Asosiy Ma'lumotlar
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Mahsulot nomi"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FastfoodIcon color="primary" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 1 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Tavsif"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
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
                  value={formData.price}
                  onChange={handleChange}
                  type="number"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PriceIcon color="primary" fontSize="small" />
                      </InputAdornment>
                    ),
                    inputProps: { min: 0 }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Chegirma (so'm)"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DiscountIcon color="primary" fontSize="small" />
                      </InputAdornment>
                    ),
                    inputProps: { min: 0 }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                  <InputLabel>O'lchov birligi</InputLabel>
                  <Select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    label="O'lchov birligi"
                    required
                  >
                    {unitOptions.map(unit => (
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
                    value={formData.kitchen_id}
                    onChange={handleChange}
                    label="Oshxona"
                    required
                  >
                    {kitchens.map(kitchen => (
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

        {/* Kategoriyalar qismi */}
        <Card sx={{ 
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <CardContent sx={{ p: 2 }}>
            <Typography 
              variant="subtitle1" 
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', color: 'text.primary' }}
            >
              <CategoryIcon color="primary" sx={{ mr: 1 }} />
              Kategoriyalar
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Kategoriya</InputLabel>
                  <Select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    label="Kategoriya"
                    required
                  >
                    {categories.map(category => (
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
                    value={formData.subcategory_id}
                    onChange={handleChange}
                    label="Subkategoriya"
                    disabled={!formData.category_id}
                  >
                    {formData.category_id ? (
                      subcategories
                        .filter(sub => sub.category?.id === Number(formData.category_id))
                        .map(subcategory => (
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
                    disabled={!formData.category_id}
                    sx={{ flex: 1 }}
                  />
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={handleAddSubcategory}
                    disabled={!newSubcategoryName.trim() || !formData.category_id}
                    sx={{ minWidth: 40 }}
                  >
                    <AddIcon fontSize="small" />
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>

    {/* Saqlash tugmasi */}
    <Box sx={{ 
      p: 2,
      borderTop: '1px solid',
      borderColor: 'divider',
      bgcolor: 'background.paper',
      boxShadow: '0 -2px 8px rgba(0,0,0,0.05)'
    }}>
      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={handleSubmit}
        disabled={isLoading}
        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
        sx={{
          py: 1.5,
          borderRadius: 2,
          fontWeight: 'medium',
          textTransform: 'none',
          fontSize: '1rem'
        }}
      >
        {isLoading ? 'Saqlanmoqda...' : 'Mahsulotni Saqlash'}
      </Button>
    </Box>

    {/* Xabarlar uchun snackbar */}
    <Snackbar
      open={!!error || !!success}
      autoHideDuration={5000}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert 
        onClose={handleCloseSnackbar}
        severity={error ? 'error' : 'success'}
        sx={{ 
          width: '100%',
          borderRadius: 2,
          boxShadow: 3
        }}
      >
        {error || success}
      </Alert>
    </Snackbar>
  </Box>
</ThemeProvider>
  );
};

export default AddProductPage;