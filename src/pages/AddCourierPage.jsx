import React, { useState } from 'react';

function AddCourierPage() {
  const [courierName, setCourierName] = useState('');
  const [courierPhone, setCourierPhone] = useState('');
  const [courierEmail, setCourierEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCourier = {
      name: courierName,
      phone: courierPhone,
      email: courierEmail,
    };
    console.log('New Courier:', newCourier);
    setCourierName('');
    setCourierPhone('');
    setCourierEmail('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Add Courier</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name:
            </label>
            <input
              type="text"
              id="name"
              value={courierName}
              onChange={(e) => setCourierName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone:
            </label>
            <input
              type="text"
              id="phone"
              value={courierPhone}
              onChange={(e) => setCourierPhone(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={courierEmail}
              onChange={(e) => setCourierEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Courier
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCourierPage;