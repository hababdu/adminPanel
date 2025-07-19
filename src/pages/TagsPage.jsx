import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const apiUrl = 'https://hosilbek02.pythonanywhere.com/api/user/kitchens/';
const GOOGLE_MAPS_API_KEY = 'AIzaSyDpdheNdHd6ydObrXLdB8uDuGkWNhixgpY';

const mapContainerStyle = {
  height: '300px',
  width: '100%',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
};

const defaultCenter = {
  lat: 41.2995, // Toshkent
  lng: 69.2401
};

const KitchenPanel = () => {
  const [kitchens, setKitchens] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    is_aktiv: true,
    latitude: '',
    longitude: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);

  const getToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token topilmadi. Iltimos, avtorizatsiyadan o‘ting.');
      return null;
    }
    return token;
  };

  useEffect(() => {
    fetchKitchens();
  }, []);

  const fetchKitchens = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Token ${token}`, // O'zgartirildi: Bearer o'rniga Token
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        if (response.status === 401) throw new Error('Token noto‘g‘ri yoki muddati tugagan');
        throw new Error('Oshxonalar ro‘yxatini olishda xatolik');
      }
      const data = await response.json();
      setKitchens(data);
    } catch (error) {
      setError('Oshxonalar ro‘yxatini olishda xatolik: ' + error.message);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData({ ...formData, latitude: latitude.toFixed(6), longitude: longitude.toFixed(6) });
          setMapCenter({ lat: latitude, lng: longitude });
          setMarkerPosition({ lat: latitude, lng: longitude });
        },
        (error) => {
          setError('Joylashuvni aniqlashda xatolik: ' + error.message);
        }
      );
    } else {
      setError('Brauzeringiz geolokatsiyani qo‘llab-quvvatlamaydi');
    }
  };

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setFormData({ ...formData, latitude: lat.toFixed(6), longitude: lng.toFixed(6) });
    setMarkerPosition({ lat, lng });
  };

  const handleMarkerDrag = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setFormData({ ...formData, latitude: lat.toFixed(6), longitude: lng.toFixed(6) });
    setMarkerPosition({ lat, lng });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Oshxona nomi majburiy!');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError(null);
    const token = getToken();
    if (!token) return;

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${apiUrl}${editingId}/` : apiUrl;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}` // O'zgartirildi: Bearer o'rniga Token
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          is_aktiv: formData.is_aktiv,
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null
        })
      });
      if (response.ok) {
        setFormData({
          name: '',
          is_aktiv: true,
          latitude: '',
          longitude: ''
        });
        setEditingId(null);
        setMarkerPosition(defaultCenter);
        setMapCenter(defaultCenter);
        fetchKitchens();
        alert(editingId ? 'Oshxona muvaffaqiyatli yangilandi!' : 'Oshxona muvaffaqiyatli qo‘shildi!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Oshxonani saqlashda xatolik');
      }
    } catch (error) {
      setError('Oshxonani saqlashda xatolik: ' + error.message);
    }
  };

  const handleEdit = (kitchen) => {
    setFormData({
      name: kitchen.name,
      is_aktiv: kitchen.is_aktiv,
      latitude: kitchen.latitude ? kitchen.latitude.toString() : '',
      longitude: kitchen.longitude ? kitchen.longitude.toString() : ''
    });
    setEditingId(kitchen.id);
    setMapCenter({
      lat: parseFloat(kitchen.latitude) || defaultCenter.lat,
      lng: parseFloat(kitchen.longitude) || defaultCenter.lng
    });
    setMarkerPosition({
      lat: parseFloat(kitchen.latitude) || defaultCenter.lat,
      lng: parseFloat(kitchen.longitude) || defaultCenter.lng
    });
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    setError(null);
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${apiUrl}${deleteId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}` // O'zgartirildi: Bearer o'rniga Token
        }
      });
      if (response.ok) {
        fetchKitchens();
        setShowModal(false);
        alert('Oshxona muvaffaqiyatli o‘chirildi!');
      } else {
        throw new Error('Oshxonani o‘chirishda xatolik');
      }
    } catch (error) {
      setError('Oshxonani o‘chirishda xatolik: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Oshxonalar Boshqaruvi</h1>
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg shadow-md">
          {error}
        </div>
      )}

      {/* Forma */}
      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Oshxona Nomi</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Holati</label>
            <select
              value={formData.is_aktiv.toString()}
              onChange={(e) => setFormData({ ...formData, is_aktiv: e.target.value === 'true' })}
              className="p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="true">Faol</option>
              <option value="false">Nofaol</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kenglik (Latitude)</label>
            <input
              type="number"
              step="any"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              className="p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Uzunlik (Longitude)</label>
            <input
              type="number"
              step="any"
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              className="p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={getCurrentLocation}
          className="mb-5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          Joriy Joylashuvni Aniqlash
        </button>

        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={13}
            onClick={handleMapClick}
          >
            <Marker
              position={markerPosition}
              draggable={true}
              onDragEnd={handleMarkerDrag}
            />
          </GoogleMap>
        </LoadScript>

        <button
          type="submit"
          className="mt-5 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md"
        >
          {editingId ? 'Oshxonani Yangilash' : 'Oshxona Qo‘shish'}
        </button>
      </form>

      {/* Oshxonalar ro‘yxati */}
      <div className="grid gap-6">
        {kitchens.map((kitchen) => (
          <div key={kitchen.id} className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{kitchen.name}</h3>
                <p className="text-gray-600">Holati: {kitchen.is_aktiv ? 'Faol' : 'Nofaol'}</p>
                <p className="text-gray-500 text-sm mt-2">
                  Joylashuv: {kitchen.latitude || 'N/A'}, {kitchen.longitude || 'N/A'}
                </p>
              </div>
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => handleEdit(kitchen)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                >
                  Tahrirlash
                </button>
                <button
                  onClick={() => confirmDelete(kitchen.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  O‘chirish
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* O‘chirish tasdiqlash modali */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800">O‘chirishni Tasdiqlang</h2>
            <p className="text-gray-600 mb-6">Bu oshxonani o‘chirishga ishonchingiz komilmi?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Bekor Qilish
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                O‘chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KitchenPanel;