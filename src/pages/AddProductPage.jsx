import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Box, Button, TextField, Typography, Container, Card, CardContent, Avatar,
  Snackbar, Alert, InputAdornment, Select, MenuItem, FormControl, InputLabel,
  Grid, Paper, Divider, IconButton, CircularProgress
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Fastfood as FastfoodIcon,
  Description as DescriptionIcon,
  Kitchen as KitchenIcon,
  Category as CategoryIcon,
  SubdirectoryArrowRight as SubcategoryIcon,
  AttachMoney as PriceIcon,
  Discount as DiscountIcon,
  UploadFile as UploadIcon,
  Scale as ScaleIcon,
  Add as AddIcon,
  CheckCircle as CheckIcon,
  Image as ImageIcon,
  Close as CloseIcon
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
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="md">
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box textAlign="center" mb={4}>
                <Avatar sx={{ 
                  bgcolor: 'primary.main', 
                  width: 64, 
                  height: 64, 
                  mx: 'auto',
                  mb: 2
                }}>
                  <FastfoodIcon fontSize="large" />
                </Avatar>
                <Typography variant="h4" gutterBottom>
                  Yangi Mahsulot Qo‘shish
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Quyidagi ma’lumotlarni to‘ldiring
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <FastfoodIcon sx={{ mr: 1 }} /> Asosiy Ma’lumotlar
                      </Typography>
                      
                      <TextField
                        fullWidth
                        label="Mahsulot Nomi"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        margin="normal"
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FastfoodIcon />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Tavsif"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        margin="normal"
                        required
                        multiline
                        rows={4}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <DescriptionIcon />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <FormControl fullWidth margin="normal" required>
                        <InputLabel>Oshxona</InputLabel>
                        <Select
                          name="kitchen_id"
                          value={formData.kitchen_id}
                          onChange={handleChange}
                          label="Oshxona"
                          startAdornment={
                            <InputAdornment position="start">
                              <KitchenIcon />
                            </InputAdornment>
                          }
                        >
                          {kitchens.length === 0 ? (
                            <MenuItem disabled>Oshxonalar mavjud emas</MenuItem>
                          ) : (
                            kitchens.map(kitchen => (
                              <MenuItem key={kitchen.id} value={kitchen.id}>
                                {kitchen.name}
                              </MenuItem>
                            ))
                          )}
                        </Select>
                      </FormControl>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <PriceIcon sx={{ mr: 1 }} /> Narxlar
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Narx"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            margin="normal"
                            required
                            type="number"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PriceIcon />
                                </InputAdornment>
                              ),
                              inputProps: { min: 0, step: 0.01 }
                            }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Chegirma"
                            name="discount"
                            value={formData.discount}
                            onChange={handleChange}
                            margin="normal"
                            required
                            type="number"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <DiscountIcon />
                                </InputAdornment>
                              ),
                              inputProps: { min: 0, step: 0.01 }
                            }}
                          />
                        </Grid>
                      </Grid>

                      <FormControl fullWidth margin="normal" required>
                        <InputLabel>O‘lchov Birligi</InputLabel>
                        <Select
                          name="unit"
                          value={formData.unit}
                          onChange={handleChange}
                          label="O‘lchov Birligi"
                          startAdornment={
                            <InputAdornment position="start">
                              <ScaleIcon />
                            </InputAdornment>
                          }
                        >
                          {unitOptions.map(unit => (
                            <MenuItem key={unit} value={unit}>
                              {unit}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <CategoryIcon sx={{ mr: 1 }} /> Kategoriyalar
                      </Typography>
                      
                      <FormControl fullWidth margin="normal" required>
                        <InputLabel>Kategoriya</InputLabel>
                        <Select
                          name="category_id"
                          value={formData.category_id}
                          onChange={handleChange}
                          label="Kategoriya"
                          startAdornment={
                            <InputAdornment position="start">
                              <CategoryIcon />
                            </InputAdornment>
                          }
                        >
                          {categories.length === 0 ? (
                            <MenuItem disabled>Kategoriyalar mavjud emas</MenuItem>
                          ) : (
                            categories.map(category => (
                              <MenuItem key={category.id} value={category.id}>
                                {category.name}
                              </MenuItem>
                            ))
                          )}
                        </Select>
                      </FormControl>

                      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <TextField
                          fullWidth
                          label="Yangi Kategoriya"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          size="small"
                        />
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={handleAddCategory}
                          disabled={isLoading || !newCategoryName.trim()}
                          startIcon={<AddIcon />}
                          sx={{ whiteSpace: 'nowrap' }}
                        >
                          Qo‘shish
                        </Button>
                      </Box>

                      <Divider sx={{ my: 3 }} />

                      <FormControl fullWidth margin="normal" required>
                        <InputLabel>Subkategoriya</InputLabel>
                        <Select
                          name="subcategory_id"
                          value={formData.subcategory_id}
                          onChange={handleChange}
                          label="Subkategoriya"
                          startAdornment={
                            <InputAdornment position="start">
                              <SubcategoryIcon />
                            </InputAdornment>
                          }
                          disabled={isSubcategoriesLoading || !formData.category_id}
                        >
                          {isSubcategoriesLoading ? (
                            <MenuItem disabled>
                              <CircularProgress size={20} sx={{ mr: 2 }} /> Yuklanmoqda...
                            </MenuItem>
                          ) : !formData.category_id ? (
                            <MenuItem disabled>Avval kategoriyani tanlang</MenuItem>
                          ) : subcategories.filter(sub => sub.category && sub.category.id === Number(formData.category_id)).length === 0 ? (
                            <MenuItem disabled>Subkategoriyalar mavjud emas. Quyida qo‘shing.</MenuItem>
                          ) : (
                            subcategories
                              .filter(sub => sub.category && sub.category.id === Number(formData.category_id))
                              .map(subcategory => (
                                <MenuItem key={subcategory.id} value={subcategory.id}>
                                  {subcategory.name}
                                </MenuItem>
                              ))
                          )}
                        </Select>
                      </FormControl>

                      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <TextField
                          fullWidth
                          label="Yangi Subkategoriya"
                          value={newSubcategoryName}
                          onChange={(e) => setNewSubcategoryName(e.target.value)}
                          size="small"
                        />
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={handleAddSubcategory}
                          disabled={isLoading || !newSubcategoryName.trim() || !formData.category_id}
                          startIcon={<AddIcon />}
                          sx={{ whiteSpace: 'nowrap' }}
                        >
                          Qo‘shish
                        </Button>
                      </Box>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <ImageIcon sx={{ mr: 1 }} /> Mahsulot Rasmi
                      </Typography>
                      
                      {photoPreview ? (
                        <Box sx={{ position: 'relative' }}>
                          <Box
                            component="img"
                            src={photoPreview}
                            alt="Preview"
                            sx={{ 
                              width: '100%', 
                              height: 200,
                              objectFit: 'cover',
                              borderRadius: 1,
                              mb: 2
                            }}
                          />
                          <IconButton
                            onClick={handleRemovePhoto}
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              backgroundColor: 'rgba(0,0,0,0.5)',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.7)'
                              }
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </Box>
                      ) : (
                        <Button
                          variant="outlined"
                          component="label"
                          fullWidth
                          sx={{ 
                            py: 3,
                            borderStyle: 'dashed',
                            mb: 2
                          }}
                          startIcon={<UploadIcon />}
                        >
                          Rasm Yuklash
                          <input
                            type="file"
                            accept="image/jpeg,image/png"
                            hidden
                            onChange={handleFileChange}
                          />
                        </Button>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        JPEG yoki PNG, maksimal 5MB
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <CheckIcon />}
                    sx={{ px: 6 }}
                  >
                    {isLoading ? 'Yuklanmoqda...' : 'Mahsulot Qo‘shish'}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Snackbar
            open={!!error || !!success}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert 
              onClose={handleCloseSnackbar} 
              severity={error ? 'error' : 'success'}
              sx={{ width: '100%' }}
            >
              {error || success}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AddProductPage;