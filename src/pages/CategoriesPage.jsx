import React, { useState } from 'react';

function CategoriesPage() {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Category 1' },
    { id: 2, name: 'Category 2' },
    { id: 2, name: 'Category 2' },
    { id: 2, name: 'Category 2' },
    { id: 2, name: 'Category 2' },
    { id: 2, name: 'Category 2' },
    { id: 2, name: 'Category 2' },
  ]);
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim() === '') return;
    const newId = categories.length ? categories[categories.length - 1].id + 1 : 1;
    setCategories([...categories, { id: newId, name: newCategory }]);
    setNewCategory('');
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Categories</h1>
        <div className="bg-white shadow-md rounded-lg p-6"></div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Category List</h2>
            <div className="flex items-center">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New category"
                className="border border-gray-300 rounded px-3 py-2 mr-2"
              />
              <button
                onClick={handleAddCategory}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Category
              </button>
            </div>
          </div>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-left">#</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="border border-gray-300 px-4 py-2">{category.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{category.name}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button className="text-blue-500 hover:underline mr-2">Edit</button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                  >
                    No categories available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
  );
}

export default CategoriesPage;