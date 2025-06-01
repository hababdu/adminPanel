import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const apiUrl = 'https://hosilbek.pythonanywhere.com/api/user/kitchens/';
const GOOGLE_MAPS_API_KEY = 'AIzaSyDpdheNdHd6ydObrXLdB8uDuGkWNhixgpY';

const mapContainerStyle = {
  height: '300px',
  width: '100%',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
};

const defaultCenter = {
  lat: 40.901058, // Toshkent
  lng: 71.850070
};

const KitchenPanel = () => {
  const [kitchens, setKitchens] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const token = localStorage.getItem('token');

  // Tokenni localStorage-dan olish
  const getToken = () => {
    if (!token) {
      setError('API tokeni topilmadi. Iltimos, tizimga kiring.');
      return null;
    }
    return token;
  };

  // API dan ma'lumotlarni olish
  useEffect(() => {
    fetchKitchens();
  }, []);

  const fetchKitchens = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        if (response.status === 401) throw new Error('Token noto‘g‘ri yoki muddati tugagan');
        throw new Error('Kuchalar ro‘yxatini olishda xatolik');
      }
      const data = await response.json();
      setKitchens(data);
    } catch (error) {
      setError('Kuchalar ro‘yxatini olishda xatolik: ' + error.message);
    }
  };

  // Joriy joylashuvni aniqlash
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

  // Xaritada bosish orqali joylashuvni tanlash
  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setFormData({ ...formData, latitude: lat.toFixed(6), longitude: lng.toFixed(6) });
    setMarkerPosition({ lat, lng });
  };

  // Marker sudrash
  const handleMarkerDrag = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setFormData({ ...formData, latitude: lat.toFixed(6), longitude: lng.toFixed(6) });
    setMarkerPosition({ lat, lng });
  };

  // Forma yuborish (Qo'shish/Yangilash)
  const handleSubmit = async (e) => {
    e.preventDefault();
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
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude)
        })
      });
      if (response.ok) {
        setFormData({ name: '', latitude: '', longitude: '' });
        setEditingId(null);
        setMarkerPosition(defaultCenter);
        setMapCenter(defaultCenter);
        fetchKitchens();
        alert(editingId ? 'Kucha muvaffaqiyatli yangilandi!' : 'Kucha muvaffaqiyatli qo‘shildi!');
      } else {
        if (response.status === 401) throw new Error('Token noto‘g‘ri yoki muddati tugagan');
        throw new Error('Kuchani saqlashda xatolik');
      }
    } catch (error) {
      setError('Kuchani saqlashda xatolik: ' + error.message);
    }
  };

  // Tahrirlash
  const handleEdit = (kitchen) => {
    setFormData({
      name: kitchen.name,
      latitude: kitchen.latitude,
      longitude: kitchen.longitude
    });
    setEditingId(kitchen.id);
    setMapCenter({ lat: parseFloat(kitchen.latitude), lng: parseFloat(kitchen.longitude) });
    setMarkerPosition({ lat: parseFloat(kitchen.latitude), lng: parseFloat(kitchen.longitude) });
  };

  // O‘chirish tasdiqlash
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  // O‘chirish
  const handleDelete = async () => {
    setError(null);
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${apiUrl}${deleteId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        fetchKitchens();
        setShowModal(false);
        alert('Kucha muvaffaqiyatli o‘chirildi!');
      } else {
        if (response.status === 401) throw new Error('Token noto‘g‘ri yoki muddati tugagan');
        throw new Error('Kuchani o‘chirishda xatolik');
      }
    } catch (error) {
      setError('Kuchani o‘chirishda xatolik: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Kuchalar Boshqaruvi</h1>
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg shadow-md">
          {error}
        </div>
      )}

      {/* Forma */}
      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-lg shadow-lg">
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Kucha Nomi</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>
        <div className="mb-5 flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Kenglik (Latitude)</label>
            <input
              type="number"
              step="any"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              className="p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Uzunlik (Longitude)</label>
            <input
              type="number"
              step="any"
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              className="p-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
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
          {editingId ? 'Kuchani Yangilash' : 'Kucha Qo‘shish'}
        </button>
      </form>

      {/* Kuchalar ro‘yxati */}
      <div className="grid gap-6">
        {kitchens.map((kitchen) => (
          <div key={kitchen.id} className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-gray-800">{kitchen.name}</h3>
            <p className="text-gray-600">Kenglik: {kitchen.latitude}, Uzunlik: {kitchen.longitude}</p>
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
        ))}
      </div>

      {/* O‘chirish tasdiqlash modali */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800">O‘chirishni Tasdiqlang</h2>
            <p className="text-gray-600 mb-6">Bu kuchani o‘chirishga ishonchingiz komilmi?</p>
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