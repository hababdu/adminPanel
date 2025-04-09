import React, { useState } from 'react';

function UpdatesPage() {
  const [updates, setUpdates] = useState([
    { id: 1, title: 'Update 1', description: 'This is the first update.' },
    { id: 2, title: 'Update 2', description: 'This is the second update.' },
    { id: 3, title: 'Update 3', description: 'This is the third update.' },
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Updates</h1>
        {updates.length > 0 ? (
          <ul className="space-y-4">
            {updates.map((update) => (
              <li
                key={update.id}
                className="p-4 border rounded-lg hover:bg-gray-50 transition"
              >
                <h2 className="text-lg font-semibold text-gray-700">
                  {update.title}
                </h2>
                <p className="text-gray-600">{update.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No updates available.</p>
        )}
      </div>
    </div>
  );
}

export default UpdatesPage;