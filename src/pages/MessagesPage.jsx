import React, { useState } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://hosilbek02.pythonanywhere.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

const GoogleMapTokenForm = () => {
  const [notes, setNotes] = useState('');
  const token = localStorage.getItem('authToken');

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post(
      'google-map-tokens/',
      { notes },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-[600px] mx-auto p-4">
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Izoh kiriting"
        className="w-full p-2 border border-gray-300 rounded-lg"
        rows="4"
      />
      <button
        type="submit"
        className="mt-2 bg-[#FF6347] text-white px-4 py-2 rounded-lg"
      >
        Yuborish
      </button>
    </form>
  );
};

export default GoogleMapTokenForm;