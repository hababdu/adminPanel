import React, { useState } from 'react';

function MessagesPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Alice', content: 'Hello there!' },
    { id: 2, sender: 'Bob', content: 'How are you?' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { id: messages.length + 1, sender: 'You', content: newMessage },
      ]);
      setNewMessage('');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className="p-3 border rounded-lg bg-gray-50"
            >
              <p className="font-semibold">{message.sender}:</p>
              <p>{message.content}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default MessagesPage;