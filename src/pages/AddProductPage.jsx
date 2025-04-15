import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiRefreshCw, FiEdit2, FiTrash2, FiSearch, FiX, FiCheck, FiDollarSign } from 'react-icons/fi';

const ProductFormWithList = () => {
  const API_URL = 'http://localhost:9000/admin_for/v1/product/';
  
  // States
  const [formData, setFormData] = useState({ 
    name: '', 
    price: '', 
    description: '',
    category: '',
    stock: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isFetching, setIsFetching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [categories, setCategories] = useState(['Electronics', 'Clothing', 'Food', 'Books', 'Other']);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  // Axios instance
  const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  // Fetch products
  const fetchProducts = async () => {
    setIsFetching(true);
    setMessage({ text: '', type: '' });
    
    try {
      const response = await api.get('/');
      setProducts(response.data);
    } catch (error) {
      handleApiError(error, 'Mahsulotlarni yuklashda xato:');
    } finally {
      setIsFetching(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, []);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Nomi kiritilishi shart';
      isValid = false;
    } else if (formData.name.length < 2) {
      newErrors.name = 'Nom 2 ta belgidan kam bo\'lmasligi kerak';
      isValid = false;
    }

    if (!formData.price) {
      newErrors.price = 'Narx kiritilishi shart';
      isValid = false;
    } else if (isNaN(formData.price)) {
      newErrors.price = 'Raqam kiriting';
      isValid = false;
    } else if (parseFloat(formData.price) <= 0) {
      newErrors.price = 'Musbat son kiriting';
      isValid = false;
    }

    if (formData.stock && isNaN(formData.stock)) {
      newErrors.stock = 'Raqam kiriting';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        category: formData.category,
        stock: formData.stock ? parseInt(formData.stock) : null
      };

      let response;
      if (editingId) {
        response = await api.put(`/${editingId}/`, productData);
        setProducts(prev => prev.map(p => p.id === editingId ? response.data : p));
        setMessage({ text: `${formData.name} muvaffaqiyatli yangilandi!`, type: 'success' });
      } else {
        response = await api.post('/', productData);
        setProducts(prev => [response.data, ...prev]);
        setMessage({ text: `${formData.name} muvaffaqiyatli qo'shildi!`, type: 'success' });
      }

      resetForm();
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      handleApiError(error, 'Xato:');
    } finally {
      setIsLoading(false);
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description || '',
      category: product.category || '',
      stock: product.stock || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm('Ushbu mahsulotni o\'chirishni tasdiqlaysizmi?')) return;
    
    try {
      await api.delete(`/${id}/`);
      setProducts(prev => prev.filter(p => p.id !== id));
      setMessage({ text: 'Mahsulot muvaffaqiyatli o\'chirildi!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      handleApiError(error, 'O\'chirishda xato:');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({ name: '', price: '', description: '', category: '', stock: '' });
    setEditingId(null);
  };

  // Handle API errors
  const handleApiError = (error, prefix = 'Xato:') => {
    console.error(prefix, error);
    
    let errorMessage = 'Noma\'lum xato yuz berdi';
    if (error.response) {
      errorMessage = error.response.data.message || 
                    error.response.data.detail || 
                    JSON.stringify(error.response.data);
    } else if (error.request) {
      errorMessage = 'Serverga ulanib bo\'lmadi';
    } else {
      errorMessage = error.message;
    }
    
    setMessage({ text: `${prefix} ${errorMessage}`, type: 'error' });
  };

  // Sort products
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort products
  const getFilteredAndSortedProducts = () => {
    let filteredProducts = products;
    
    // Filter by search term
    if (searchTerm) {
      filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Sort products
    if (sortConfig.key) {
      filteredProducts = [...filteredProducts].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filteredProducts;
  };

  const filteredProducts = getFilteredAndSortedProducts();

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Form section */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {editingId ? 'Mahsulotni Tahrirlash' : 'Yangi Mahsulot Qo\'shish'}
          </h2>
          {editingId && (
            <button
              onClick={resetForm}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
            >
              <FiX className="mr-1" /> Bekor qilish
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Mahsulot nomi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-3 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Mahsulot nomi"
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>
            </div>
            
            {/* Product price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Narxi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiDollarSign className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Kategoriya
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="">Tanlang...</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            {/* Product stock */}
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                Qoldiq (soni)
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className={`w-full pl-3 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                  errors.stock ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nol cheksiz"
                min="0"
              />
              {errors.stock && <p className="mt-1 text-xs text-red-600">{errors.stock}</p>}
            </div>
          </div>
          
          {/* Product description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Tavsif
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Mahsulot haqida qo'shimcha ma'lumot..."
            ></textarea>
          </div>
          
          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center space-x-2 ${
                isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              } transition-colors`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{editingId ? 'Saqlanmoqda...' : 'Qo\'shilmoqda...'}</span>
                </>
              ) : (
                <>
                  <FiPlus />
                  <span>{editingId ? 'O\'zgarishlarni Saqlash' : 'Mahsulot Qo\'shish'}</span>
                </>
              )}
            </button>
          </div>
        </form>
        
        {/* Message display */}
        {message.text && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}
      </div>
      
      {/* Products list section */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h3 className="text-xl font-semibold text-gray-800">Mahsulotlar Ro'yxati</h3>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search input */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <FiX className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            
            {/* Refresh button */}
            <button 
              onClick={fetchProducts}
              disabled={isFetching}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 flex items-center justify-center space-x-2 min-w-[120px]"
            >
              {isFetching ? (
                <FiRefreshCw className="animate-spin" />
              ) : (
                <FiRefreshCw />
              )}
              <span>Yangilash</span>
            </button>
          </div>
        </div>
        
        {/* Products table */}
        {isFetching && products.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-500">Mahsulotlar yuklanmoqda...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="mt-2 text-gray-700 font-medium">Mahsulotlar topilmadi</h4>
            <p className="mt-1 text-gray-500 text-sm">
              {searchTerm ? 'Boshqa kalit so\'z bilan qidiring' : 'Yangi mahsulot qo\'shish uchun yuqoridagi formadan foydalaning'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => requestSort('name')}
                  >
                    <div className="flex items-center">
                      Nomi
                      {sortConfig.key === 'name' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => requestSort('price')}
                  >
                    <div className="flex items-center">
                      Narxi
                      {sortConfig.key === 'price' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategoriya
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qoldiq
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Harakatlar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          {product.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {product.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${parseFloat(product.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.stock === null 
                          ? 'bg-gray-100 text-gray-800' 
                          : product.stock > 10 
                            ? 'bg-green-100 text-green-800' 
                            : product.stock > 0 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock === null ? 'Nol cheksiz' : product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="Tahrirlash"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="O'chirish"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFormWithList;