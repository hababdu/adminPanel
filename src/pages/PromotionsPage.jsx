import React, { useState } from 'react';

function PromotionsPage() {
  const [promotions, setPromotions] = useState([
    { id: 1, title: 'Summer Sale', discount: '50%' },
    { id: 2, title: 'Winter Clearance', discount: '30%' },
    { id: 3, title: 'Black Friday', discount: '70%' },
  ]);

  const handleDelete = (id) => {
    setPromotions(promotions.filter((promo) => promo.id !== id));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Promotions</h1>
      <div className="bg-white shadow-md rounded-lg p-4">
        {promotions.length > 0 ? (
          <ul>
            {promotions.map((promo) => (
              <li
                key={promo.id}
                className="flex justify-between items-center border-b py-2"
              >
                <div>
                  <h2 className="text-lg font-semibold">{promo.title}</h2>
                  <p className="text-sm text-gray-500">Discount: {promo.discount}</p>
                </div>
                <button
                  onClick={() => handleDelete(promo.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No promotions available.</p>
        )}
      </div>
    </div>
  );
}

export default PromotionsPage;