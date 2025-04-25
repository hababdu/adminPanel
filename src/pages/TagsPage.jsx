import React, { useState, useEffect } from 'react';
import { FiX, FiPlus, FiSearch, FiTag } from 'react-icons/fi';

function TagsPage() {
  const [tags, setTags] = useState(() => {
    const savedTags = localStorage.getItem('tags');
    return savedTags ? JSON.parse(savedTags) : [
      { id: 1, name: 'React', color: '#61DAFB' },
      { id: 2, name: 'JavaScript', color: '#F7DF1E' },
      { id: 3, name: 'Tailwind', color: '#38BDF8' },
    ];
  });

  const [newTag, setNewTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(null);

  // LocalStorage ga saqlash
  useEffect(() => {
    localStorage.setItem('tags', JSON.stringify(tags));
  }, [tags]);

  const handleAddTag = () => {
    setError('');
    const trimmedTag = newTag.trim();

    if (!trimmedTag) {
      setError('Tag name cannot be empty');
      return;
    }

    if (tags.some(tag => tag.name.toLowerCase() === trimmedTag.toLowerCase())) {
      setError('Tag already exists');
      return;
    }

    if (trimmedTag.length > 20) {
      setError('Tag name cannot exceed 20 characters');
      return;
    }

    const newTagObj = {
      id: Date.now(),
      name: trimmedTag,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    };

    setTags([...tags, newTagObj]);
    setNewTag('');
  };

  const handleRemoveTag = (id) => {
    setTags(tags.filter(tag => tag.id !== id));
  };

  const handleEditTag = (id, newName) => {
    setTags(tags.map(tag => 
      tag.id === id ? { ...tag, name: newName } : tag
    ));
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <FiTag className="mr-3" />
            Tags Manager
          </h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {tags.length} tags
          </span>
        </div>

        <div className="mb-6 relative">
          <FiSearch className="absolute left-3 top-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={newTag}
              onChange={(e) => {
                setNewTag(e.target.value);
                setError('');
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="Create new tag..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              maxLength="20"
            />
            <button
              onClick={handleAddTag}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center transition-all"
            >
              <FiPlus className="mr-2" />
              Add Tag
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTags.map(tag => (
            <div
              key={tag.id}
              className="group relative bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              style={{ borderLeft: `4px solid ${tag.color}` }}
            >
              {editMode === tag.id ? (
                <input
                  type="text"
                  defaultValue={tag.name}
                  onBlur={(e) => {
                    handleEditTag(tag.id, e.target.value);
                    setEditMode(null);
                  }}
                  className="w-full px-2 py-1 border-b-2 border-blue-500 focus:outline-none bg-transparent"
                  autoFocus
                />
              ) : (
                <div className="flex items-center justify-between">
                  <span
                    className="cursor-text text-gray-700 dark:text-gray-300"
                    onClick={() => setEditMode(tag.id)}
                  >
                    {tag.name}
                  </span>
                  <button
                    onClick={() => handleRemoveTag(tag.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <FiX />
                  </button>
                </div>
              )}
              
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  {new Date(tag.id).toLocaleDateString()}
                </span>
                <div
                  className="w-4 h-4 rounded-full cursor-pointer"
                  style={{ backgroundColor: tag.color }}
                  title="Tag color"
                />
              </div>
            </div>
          ))}
        </div>

        {filteredTags.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <FiSearch className="text-4xl mx-auto mb-4" />
            <p>No tags found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TagsPage;