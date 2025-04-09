import React, { useState } from 'react';

function TagsPage() {
  const [tags, setTags] = useState(['React', 'JavaScript', 'Tailwind']);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Tags Management</h1>
      <div className="mb-6">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Enter a new tag"
          className="border border-gray-300 rounded-md p-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddTag}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Add Tag
        </button>
      </div>
      <ul className="space-y-2">
        {tags.map((tag, index) => (
          <li
            key={index}
            className="flex items-center justify-between bg-white p-4 rounded-md shadow"
          >
            <span className="text-gray-700">{tag}</span>
            <button
              onClick={() => handleRemoveTag(tag)}
              className="text-red-500 hover:text-red-700 transition"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TagsPage;