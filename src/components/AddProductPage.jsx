import React, { useState } from 'react';
import axios from 'axios';
import { FiUpload, FiSave, FiX } from 'react-icons/fi';

const AddProductPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Configure axios instance
  const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
    timeout: 10000,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await api.post('/products/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('Product added:', response.data);
      alert('Mahsulot muvaffaqiyatli qo\'shildi!');
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        image: null
      });
    } catch (err) {
      console.error('Xatolik yuz berdi:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Serverga ulanmadi. Iltimos, qayta urinib ko\'ring.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Yangi Mahsulot Qo'shish</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Nomi</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Tavsifi</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="3"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Narxi</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Rasm</label>
          <div className="flex items-center">
            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md border border-gray-300 flex items-center">
              <FiUpload className="mr-2" />
              {formData.image ? formData.image.name : 'Rasm tanlang'}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {formData.image && (
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <FiX />
              </button>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`flex items-center justify-center px-4 py-2 rounded-md text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? (
            'Yuklanmoqda...'
          ) : (
            <>
              <FiSave className="mr-2" />
              Saqlash
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;