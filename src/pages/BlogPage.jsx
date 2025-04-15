import React, { useState, useEffect } from 'react';

function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedPostId, setExpandedPostId] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (postId) => {
    setExpandedPostId(prev => (prev === postId ? null : postId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Blog Page</h1>

      <div className="mb-6 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search posts..."
          className="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <div key={post.id} className="p-4 bg-white shadow-md rounded-xl transition hover:shadow-lg">
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-700">
              {expandedPostId === post.id ? post.body : `${post.body.slice(0, 100)}...`}
            </p>
            <button
              onClick={() => toggleExpand(post.id)}
              className="mt-2 text-blue-600 hover:underline"
            >
              {expandedPostId === post.id ? 'Read less' : 'Read more'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogPage;
