import { useState, useEffect } from 'react';
import axios from 'axios';

const ProductFormWithList = () => {
  // API manzili - o'zingizning backend manzilingizga o'zgartiring
  const API_URL = 'http://127.0.0.1:8000/admin_for/v1/product/';
  
  // Holatlar (states)
  const [formData, setFormData] = useState({ name: '', price: '' });
  const [errors, setErrors] = useState({ name: '', price: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isFetching, setIsFetching] = useState(false);

  // Axios instance yaratish
  const api = axios.create({
    baseURL: API_URL,
    timeout: 10000, // 10 soniya
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': 'Bearer your-token' // Agar kerak bo'lsa
    }
  }); 

  // Mahsulotlarni yuklash
  const fetchProducts = async () => {
    setIsFetching(true);
    setMessage({ text: '', type: '' });
    
    try {
      const response = await api.get('/');
      setProducts(response.data); // response.data deb o'zgartirildi
      
    } catch (error) {
      console.error('Mahsulotlarni yuklashda xato:', error);
      setMessage({ 
        text: `Mahsulotlarni yuklashda xato: ${error.message}`, 
        type: 'error' 
      });
    } finally {
      setIsFetching(false);
    }
  };

  // Dastlabki yuklash
  useEffect(() => {
    fetchProducts();
  }, []);

  // Forma validatsiyasi
  const validateForm = () => {
    let valid = true;
    const newErrors = { name: '', price: '' };

    if (!formData.name.trim()) {
      newErrors.name = 'Nomi kiritilishi shart';
      valid = false;
    } else if (formData.name.length < 2) {
      newErrors.name = 'Nom 2 ta belgidan kam bo\'lmasligi kerak';
      valid = false;
    }

    if (!formData.price) {
      newErrors.price = 'Narx kiritilishi shart';
      valid = false;
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Noto\'g\'ri narx formati';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Input o'zgarishlari
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validatsiya
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Forma yuborish
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const response = await api.post('/', {
        name: formData.name,
        price: parseFloat(formData.price)
      });

      setMessage({ 
        text: `${formData.name} muvaffaqiyatli qo'shildi!`, 
        type: 'success' 
      });
      
      // Formani tozalash
      setFormData({ name: '', price: '' });
      
      // Yangi mahsulotni ro'yxatga qo'shish
      setProducts(prev => [response.data, ...prev]);
      
      // Xabarni 3 soniyadan keyin yo'q qilish
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      
    } catch (error) {
      console.error('Xato:', error);
      
      let errorMessage = 'Noma\'lum xato yuz berdi';
      if (error.response) {
        // Serverdan kelgan xato
        errorMessage = error.response.data.message || 
                      error.response.data.detail || 
                      JSON.stringify(error.response.data);
      } else if (error.request) {
        // So'rov yuborildi, lekin javob kelmadi
        errorMessage = 'Serverga ulanib bo\'lmadi';
      } else {
        // So'rov yuborishdan oldin xato
        errorMessage = error.message;
      }
      
      setMessage({ 
        text: `Xato: ${errorMessage}`, 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Forma qismi */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Yangi Mahsulot Qo'shish</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mahsulot nomi */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Mahsulot nomi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              }`}
              placeholder="Mahsulot nomi"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>
          
          {/* Mahsulot narxi */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Narxi <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                  errors.price ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
          </div>
          
          {/* Yuborish tugmasi */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Qo'shilmoqda...
              </span>
            ) : 'Qo\'shish'}
          </button>
        </form>
        
        {/* Xabar qismi */}
        {message.text && (
          <div className={`mt-4 p-3 rounded-md text-sm ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}
      </div>
      
      {/* Mahsulotlar ro'yxati */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Mahsulotlar Ro'yxati</h3>
          <button 
            onClick={fetchProducts}
            disabled={isFetching}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          >
            {isFetching ? (
              <>
                <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Yuklanmoqda...
              </>
            ) : 'Yangilash'}
          </button>
        </div>
        
        {isFetching && products.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
            <p className="text-gray-500">Mahsulotlar yuklanmoqda...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-2 text-gray-500">Mahsulotlar topilmadi</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {products.map((product) => (
              <div key={product.id} className="py-3 flex justify-between items-center hover:bg-gray-50 px-2 rounded">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 truncate">{product.name}</h4>
                  <p className="text-xs text-gray-500 truncate">ID: {product.id}</p>
                </div>
                <span className="font-semibold text-blue-600 whitespace-nowrap ml-4">
                  ${parseFloat(product.price).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFormWithList;