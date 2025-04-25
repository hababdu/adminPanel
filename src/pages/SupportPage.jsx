import React, { useState, useEffect } from 'react';
import { FiAlertCircle, FiCheckCircle, FiSend, FiLoader } from 'react-icons/fi';

function SupportPage() {
  const [formData, setFormData] = useState(() => {
    const savedDraft = localStorage.getItem('supportDraft');
    return savedDraft ? JSON.parse(savedDraft) : {
      name: '',
      email: '',
      message: '',
      urgency: 'medium'
    };
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [charCount, setCharCount] = useState(0);

  // Form draftini saqlash
  useEffect(() => {
    localStorage.setItem('supportDraft', JSON.stringify(formData));
  }, [formData]);

  // Xabar uzunligini hisoblash
  useEffect(() => {
    setCharCount(formData.message.length);
  }, [formData.message]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (Math.random() < 0.2) throw new Error('Server error');
      
      setStatus({ type: 'success', message: 'Message sent successfully!' });
      localStorage.removeItem('supportDraft');
      setFormData({ name: '', email: '', message: '', urgency: 'medium' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-8 w-full max-w-2xl transition-all duration-300 hover:shadow-3xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            <span className="text-blue-500">Support</span> Center
          </h1>
          {localStorage.getItem('supportDraft') && (
            <div className="flex items-center text-yellow-500 text-sm">
              <FiAlertCircle className="mr-2" />
              Draft saved
            </div>
          )}
        </div>

        {status.message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            status.type === 'success' ? 'bg-green-100 text-green-700' :
            status.type === 'error' ? 'bg-red-100 text-red-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {status.type === 'success' ? <FiCheckCircle className="mr-2" /> : <FiAlertCircle className="mr-2" />}
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isPreview ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border ${
                      formData.email && !validateEmail(formData.email) 
                        ? 'border-red-500' 
                        : 'border-gray-200 dark:border-gray-600'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    placeholder="john@example.com"
                    required
                  />
                  {formData.email && !validateEmail(formData.email) && (
                    <p className="text-red-500 text-sm mt-1">Please enter a valid email</p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Message
                  </label>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {charCount}/1000
                  </span>
                </div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none min-h-[150px]"
                  placeholder="Describe your issue in detail..."
                  maxLength="1000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Urgency Level
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {['low', 'medium', 'high'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({ ...formData, urgency: level })}
                      className={`p-3 rounded-lg flex items-center justify-center transition-all ${
                        formData.urgency === level
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">Preview:</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Name:</strong> {formData.name || 'Not provided'}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Email:</strong> {formData.email || 'Not provided'}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Urgency:</strong> {formData.urgency}
                </p>
                <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
                  {formData.message}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4">
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              className="px-6 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
            >
              {isPreview ? 'Edit' : 'Preview'}
            </button>
            
            <button
              type="submit"
              disabled={isLoading || (formData.email && !validateEmail(formData.email))}
              className={`px-6 py-3 rounded-lg flex items-center justify-center transition-all ${
                isLoading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white flex-1`}
            >
              {isLoading ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <FiSend className="mr-2" />
                  Send Message
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>24/7 Support Available • Average Response Time: 2 hours</p>
            <div className="mt-2 flex justify-center space-x-4">
              <a href="tel:+123456789" className="hover:text-blue-500">📞 +1 (234) 567-89</a>
              <a href="mailto:support@example.com" className="hover:text-blue-500">✉️ support@example.com</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupportPage;