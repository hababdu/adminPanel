import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiSmile, FiImage, FiCheck, FiClock, FiSearch, FiTrash } from 'react-icons/fi';
import EmojiPicker from 'emoji-picker-react';
import { formatDistanceToNow } from 'date-fns';

function MessagesPage() {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: 'Alice', 
      content: 'Hello there! 👋', 
      timestamp: new Date(Date.now() - 3600000),
      status: 'read',
      isMine: false,
      reactions: []
    },
    { 
      id: 2, 
      sender: 'You', 
      content: 'Hi! How are you?', 
      timestamp: new Date(Date.now() - 1800000),
      status: 'delivered',
      isMine: true,
      reactions: ['👍']
    },
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef(null);

  // Avtomatik scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Xabar yuborish
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: 'You',
        content: newMessage,
        timestamp: new Date(),
        status: 'sent',
        isMine: true,
        reactions: []
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
      setShowEmojiPicker(false);
    }
  };

  // Emoji qo'shish
  const handleEmojiClick = (emoji) => {
    setNewMessage(prev => prev + emoji.emoji);
  };

  // Xabarni o'chirish
  const deleteMessage = (id) => {
    setMessages(messages.filter(msg => msg.id !== id));
  };

  // Reaction qo'shish
  const addReaction = (messageId, reaction) => {
    setMessages(messages.map(msg => 
      msg.id === messageId 
        ? { ...msg, reactions: [...msg.reactions, reaction] } 
        : msg
    ));
  };

  // Filttrlangan xabarlar
  const filteredMessages = messages.filter(msg => 
    msg.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors`}>
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className={`flex justify-between items-center mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Messages
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <FiSearch className={`absolute left-3 top-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search messages..."
                className={`pl-10 pr-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {/* Xabarlar ro'yxati */}
        <div className={`rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 h-[600px] overflow-y-auto`}>
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isMine ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div className={`max-w-[70%] rounded-lg p-4 relative ${
                message.isMine 
                  ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                  : darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'
              }`}>
                {/* Xabar header */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">{message.sender}</span>
                  <span className={`text-xs ${message.isMine ? 'text-blue-100' : 'text-gray-500'}`}>
                    {formatDistanceToNow(message.timestamp)} ago
                  </span>
                </div>

                {/* Xabar content */}
                <p className="mb-2">{message.content}</p>

                {/* Reactions */}
                <div className="flex gap-1 mt-2">
                  {message.reactions.map((reaction, idx) => (
                    <span key={idx} className="text-sm">{reaction}</span>
                  ))}
                </div>

                {/* Status */}
                {message.isMine && (
                  <div className="absolute bottom-1 right-2 text-xs">
                    {message.status === 'sent' && <FiClock className="text-gray-400" />}
                    {message.status === 'delivered' && <FiCheck className="text-gray-400" />}
                    {message.status === 'read' && <FiCheck className="text-blue-400" />}
                  </div>
                )}

                {/* Actions */}
                <div className="absolute top-2 right-2 flex gap-1">
                  {!message.isMine && (
                    <button
                      onClick={() => addReaction(message.id, '👍')}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                    >
                      👍
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(message.id)}
                    className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded ${
                      darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                    }`}
                  >
                    <FiTrash className="text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center gap-2">
            <div className="relative flex-grow">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`absolute left-3 top-3 p-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
              >
                <FiSmile />
              </button>
              
              {showEmojiPicker && (
                <div className="absolute bottom-12 left-0 z-10">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}

              <input
                type="text"
                className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                  darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'
                }`}
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
            </div>

            <button className={`p-2 rounded-lg ${darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>
              <FiImage />
            </button>

            <button
              onClick={handleSendMessage}
              className={`p-2 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
            >
              <FiSend />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessagesPage;