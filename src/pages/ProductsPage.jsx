import React, { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });
  
  const itemsPerPage = 5;
  const priceRegex = /^\$?(\d+)?$/;

  useEffect(() => {
    setTimeout(() => {
      setProducts([
        { id: 1, name: 'Product 1', price: '$10' },
        { id: 2, name: 'Product 2', price: '$20' },
        { id: 3, name: 'Product 3', price: '$30' },
      ]);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
  };

  const handleDelete = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const handlePriceChange = (id, value) => {
    if (priceRegex.test(value)) {
      const formattedValue = value.startsWith('$') ? value : `$${value}`;
      setProducts(products.map(product =>
        product.id === id ? { ...product, price: formattedValue } : product
      ));
    }
  };

  const sortedAndFilteredData = React.useMemo(() => {
    let filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = sortConfig.key === 'price' ? parseInt(a.price.slice(1)) : a[sortConfig.key];
        const bValue = sortConfig.key === 'price' ? parseInt(b.price.slice(1)) : b[sortConfig.key];
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [products, searchTerm, sortConfig]);

  const paginatedData = sortedAndFilteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedAndFilteredData.length / itemsPerPage);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-800 bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 inline-block">
              Product Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Managing {products.length} products</p>
          </div>
          
          <div className="flex gap-4 items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2.5 border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                value={searchTerm}
                onChange={handleSearch}
              />
              <svg 
                className="w-5 h-5 absolute left-3 top-3 text-gray-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Add Product
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-600 uppercase tracking-wide">
              <div className="col-span-1 flex items-center cursor-pointer" onClick={() => handleSort('id')}>
                ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? <ArrowUpIcon className="h-4 w-4 ml-1" /> : <ArrowDownIcon className="h-4 w-4 ml-1" />)}
              </div>
              <div className="col-span-4 cursor-pointer" onClick={() => handleSort('name')}>
                PRODUCT {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? <ArrowUpIcon className="h-4 w-4 ml-1" /> : <ArrowDownIcon className="h-4 w-4 ml-1" />)}
              </div>
              <div className="col-span-3 cursor-pointer" onClick={() => handleSort('price')}>
                PRICE {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? <ArrowUpIcon className="h-4 w-4 ml-1" /> : <ArrowDownIcon className="h-4 w-4 ml-1" />)}
              </div>
              <div className="col-span-4 text-right">ACTIONS</div>
            </div>
          </div>

          {paginatedData.map((product) => (
            <div key={product.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 group transition-colors">
              <div className="grid grid-cols-12 gap-4 items-center px-6 py-4">
                <div className="col-span-1 text-sm text-gray-500 font-medium">#{product.id}</div>
                
                <div className="col-span-4">
                  {editingId === product.id ? (
                    <input
                      value={product.name}
                      onChange={(e) => handleEditField(product.id, 'name', e.target.value)}
                      className="border-b-2 border-blue-500 focus:outline-none px-2 py-1 w-full"
                    />
                  ) : (
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-medium">P</span>
                      </div>
                      <span className="font-medium text-gray-700">{product.name}</span>
                    </div>
                  )}
                </div>

                <div className="col-span-3">
                  {editingId === product.id ? (
                    <div className="flex items-center">
                      <span className="mr-1 text-gray-500">$</span>
                      <input
                        type="number"
                        value={product.price.replace('$', '')}
                        onChange={(e) => handleEditField(product.id, 'price', e.target.value)}
                        className="border-b-2 border-blue-500 focus:outline-none px-2 py-1 w-20"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-gray-700">{product.price}</span>
                      <span className="ml-2 text-sm text-gray-500">USD</span>
                    </div>
                  )}
                </div>

                <div className="col-span-4 flex justify-end items-center space-x-3">
                  {editingId === product.id ? (
                    <>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-600 transition-colors"
                      >
                        <CheckIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleCancelEdit(product.id)}
                        className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingId(product.id)}
                        className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md transform transition-all duration-300 scale-95 hover:scale-100">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Create New Product</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">$</span>
                  <input
                    type="number"
                    className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-gray-600 hover:text-gray-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <PlusIcon className="h-5 w-5" />
                Create Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;