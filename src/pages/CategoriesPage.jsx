
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Button, TextField, Typography, Card, CardContent, Grid, Paper,
  FormControl, InputLabel, Select, MenuItem, CircularProgress, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
  InputAdornment,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Add, Edit, Delete, Category, SubdirectoryArrowRight } from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: { main: '#4a6cf7', contrastText: '#fff' },
    secondary: { main: '#ff6b6b', contrastText: '#fff' },
    error: { main: '#dc3545', contrastText: '#fff' },
    background: { paper: '#fff' },
  },
  typography: { fontFamily: '"Inter", sans-serif', h5: { fontWeight: 600, fontSize: '1.2rem' } },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 6, px: 2, py: 1 } } },
    MuiTextField: { styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: 6, fontSize: '0.9rem' } } } },
    MuiSelect: { styleOverrides: { root: { borderRadius: 6, fontSize: '0.9rem' } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' } } },
    MuiPaper: { styleOverrides: { root: { borderRadius: 10 } } },
    MuiTable: { styleOverrides: { root: { '& .MuiTableCell-root': { borderBottom: '1px solid #e9ecef' } } } },
  },
});

const CategorySubcategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [editCategory, setEditCategory] = useState(null);
  const [editSubcategory, setEditSubcategory] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [categoryRes, subcategoryRes] = await Promise.all([
          axios.get('https://hosilbek02.pythonanywhere.com/api/user/categories/', { headers }),
          axios.get('https://hosilbek02.pythonanywhere.com/api/user/subcategories/', { headers }),
        ]);
        setCategories(categoryRes.data);
        setSubcategories(subcategoryRes.data);
      } catch (err) {
        setError('Ma\'lumotlarni olishda xatolik: ' + (err.response?.data?.message || err.message));
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleAddCategory = async () => {
    if (!newCategoryName || newCategoryName.length < 3) return setError('Kategoriya nomi 3+ belgi.');
    setIsAddingCategory(true);
    try {
      const res = await axios.post(
        'https://hosilbek02.pythonanywhere.com/api/user/categories/',
        { name: newCategoryName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories([...categories, res.data]);
      setNewCategoryName('');
      setSuccess('Kategoriya qo‘shildi!');
    } catch (err) {
      setError(err.response?.data?.message || 'Kategoriya qo‘shishda xatolik.');
    } finally {
      setIsAddingCategory(false);
    }
  };

  const handleAddSubcategory = async () => {
    if (!newSubcategoryName || newSubcategoryName.length < 3) return setError('Subkategoriya nomi 3+ belgi.');
    if (!selectedCategoryId) return setError('Kategoriya tanlang.');
    setIsAddingSubcategory(true);
    try {
      const res = await axios.post(
        'https://hosilbek02.pythonanywhere.com/api/user/subcategories/',
        { name: newSubcategoryName, category_id: selectedCategoryId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubcategories([...subcategories, res.data]);
      setNewSubcategoryName('');
      setSelectedCategoryId('');
      setSuccess('Subkategoriya qo‘shildi!');
    } catch (err) {
      setError(err.response?.data?.message || 'Subkategoriya qo‘shishda xatolik.');
    } finally {
      setIsAddingSubcategory(false);
    }
  };

  const handleEditCategory = async () => {
    if (!editCategory.name || editCategory.name.length < 3) return setError('Kategoriya nomi 3+ belgi.');
    try {
      const res = await axios.put(
        `https://hosilbek02.pythonanywhere.com/api/user/categories/${editCategory.id}/`,
        { name: editCategory.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories(categories.map((c) => (c.id === editCategory.id ? res.data : c)));
      setSuccess('Kategoriya tahrirlandi!');
      setOpenEditDialog(false);
      setEditCategory(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Tahrirlashda xatolik.');
    }
  };

  const handleEditSubcategory = async () => {
    if (!editSubcategory.name || editSubcategory.name.length < 3) return setError('Subkategoriya nomi 3+ belgi.');
    if (!editSubcategory.category_id) return setError('Kategoriya tanlang.');
    try {
      const res = await axios.put(
        `https://hosilbek02.pythonanywhere.com/api/user/subcategories/${editSubcategory.id}/`,
        { name: editSubcategory.name, category_id: editSubcategory.category_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubcategories(subcategories.map((s) => (s.id === editSubcategory.id ? res.data : s)));
      setSuccess('Subkategoriya tahrirlandi!');
      setOpenEditDialog(false);
      setEditSubcategory(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Tahrirlashda xatolik.');
    }
  };

  const handleDelete = async () => {
    try {
      const isCategory = deleteItem.type === 'category';
      const url = isCategory
        ? `https://hosilbek02.pythonanywhere.com/api/user/categories/${deleteItem.id}/`
        : `https://hosilbek02.pythonanywhere.com/api/user/subcategories/${deleteItem.id}/`;
      await axios.delete(url, { headers: { Authorization: `Bearer ${token}` } });
      if (isCategory) {
        setCategories(categories.filter((c) => c.id !== deleteItem.id));
      } else {
        setSubcategories(subcategories.filter((s) => s.id !== deleteItem.id));
      }
      setSuccess(`${isCategory ? 'Kategoriya' : 'Subkategoriya'} o‘chirildi!`);
      setOpenDeleteDialog(false);
      setDeleteItem(null);
    } catch (err) {
      setError(err.response?.data?.message || 'O‘chirishda xatolik.');
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setError('');
    setSuccess('');
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 2, maxWidth: 1200, mx: 'auto' }}>
        <Typography variant="h5" sx={{ mb: 2 }}><Category sx={{ mr: 1 }} />Kategoriyalar va Subkategoriyalar</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h5" sx={{ mb: 2 }}><Category sx={{ mr: 1 }} />Yangi Kategoriya</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    label="Kategoriya nomi"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    margin="dense"
                    size="small"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddCategory}
                    disabled={isAddingCategory || !newCategoryName}
                    startIcon={isAddingCategory ? <CircularProgress size={16} /> : <Add />}
                    sx={{ minWidth: '100px' }}
                  >
                    Qo‘sh
                  </Button>
                </Box>
                {isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}><CircularProgress /></Box>
                ) : (
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Nomi</TableCell>
                          <TableCell align="right">Amallar</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {categories.length === 0 ? (
                          <TableRow><TableCell colSpan={2} align="center">Kategoriya topilmadi</TableCell></TableRow>
                        ) : (
                          categories.map((c) => (
                            <TableRow key={c.id}>
                              <TableCell>{c.name}</TableCell>
                              <TableCell align="right">
                                <IconButton
                                  onClick={() => {
                                    setEditCategory({ id: c.id, name: c.name });
                                    setOpenEditDialog(true);
                                  }}
                                >
                                  <Edit color="primary" />
                                </IconButton>
                                <IconButton
                                  onClick={() => {
                                    setDeleteItem({ id: c.id, name: c.name, type: 'category' });
                                    setOpenDeleteDialog(true);
                                  }}
                                >
                                  <Delete color="error" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h5" sx={{ mb: 2 }}><SubdirectoryArrowRight sx={{ mr: 1 }} />Yangi Subkategoriya</Typography>
                <FormControl fullWidth margin="dense" required>
                  <InputLabel>Kategoriya</InputLabel>
                  <Select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    startAdornment={<InputAdornment position="start"><Category /></InputAdornment>}
                  >
                    {categories.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                  </Select>
                </FormControl>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <TextField
                    fullWidth
                    label="Subkategoriya nomi"
                    value={newSubcategoryName}
                    onChange={(e) => setNewSubcategoryName(e.target.value)}
                    margin="dense"
                    size="small"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddSubcategory}
                    disabled={isAddingSubcategory || !newSubcategoryName || !selectedCategoryId}
                    startIcon={isAddingSubcategory ? <CircularProgress size={16} /> : <Add />}
                    sx={{ minWidth: '100px' }}
                  >
                    Qo‘sh
                  </Button>
                </Box>
                {isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}><CircularProgress /></Box>
                ) : (
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Nomi</TableCell>
                          <TableCell>Kategoriya</TableCell>
                          <TableCell align="right">Amallar</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {subcategories.length === 0 ? (
                          <TableRow><TableCell colSpan={3} align="center">Subkategoriya topilmadi</TableCell></TableRow>
                        ) : (
                          subcategories.map((s) => (
                            <TableRow key={s.id}>
                              <TableCell>{s.name}</TableCell>
                              <TableCell>{categories.find((c) => c.id === s.category_id)?.name || 'Noma\'lum'}</TableCell>
                              <TableCell align="right">
                                <IconButton
                                  onClick={() => {
                                    setEditSubcategory({ id: s.id, name: s.name, category_id: s.category_id });
                                    setOpenEditDialog(true);
                                  }}
                                >
                                  <Edit color="primary" />
                                </IconButton>
                                <IconButton
                                  onClick={() => {
                                    setDeleteItem({ id: s.id, name: s.name, type: 'subcategory' });
                                    setOpenDeleteDialog(true);
                                  }}
                                >
                                  <Delete color="error" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editCategory ? 'Kategoriya Tahrirlash' : 'Subkategoriya Tahrirlash'}</DialogTitle>
          <DialogContent>
            {editCategory ? (
              <TextField
                fullWidth
                label="Kategoriya nomi"
                value={editCategory.name}
                onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                margin="dense"
                required
              />
            ) : (
              <>
                <FormControl fullWidth margin="dense" required>
                  <InputLabel>Kategoriya</InputLabel>
                  <Select
                    value={editSubcategory?.category_id || ''}
                    onChange={(e) => setEditSubcategory({ ...editSubcategory, category_id: e.target.value })}
                  >
                    {categories.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Subkategoriya nomi"
                  value={editSubcategory?.name || ''}
                  onChange={(e) => setEditSubcategory({ ...editSubcategory, name: e.target.value })}
                  margin="dense"
                  required
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)} variant="outlined">Bekor</Button>
            <Button
              onClick={editCategory ? handleEditCategory : handleEditSubcategory}
              variant="contained"
              color="primary"
            >
              Saqlash
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <DialogTitle>O‘chirishni Tasdiqlash</DialogTitle>
          <DialogContent>
            <Typography>
              Haqiqatan ham <strong>{deleteItem?.name}</strong> {deleteItem?.type === 'category' ? 'kategoriyani' : 'subkategoriyani'} o‘chirmoqchimisiz?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)} variant="outlined">Bekor</Button>
            <Button onClick={handleDelete} color="error" variant="contained">O‘chir</Button>
          </DialogActions>
        </Dialog>
        <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose}>
          <Alert severity="error" onClose={handleClose}>{error}</Alert>
        </Snackbar>
        <Snackbar open={!!success} autoHideDuration={6000} onClose={handleClose}>
          <Alert severity="success" onClose={handleClose}>{success}</Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default CategorySubcategoryManager;