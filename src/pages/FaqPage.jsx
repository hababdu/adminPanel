import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiSearch, FiCopy, FiCheckCircle, FiPackage, FiGlobe, FiClock } from 'react-icons/fi';

function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const faqCategories = [
    { id: 'all', name: 'All', icon: <FiPackage /> },
    { id: 'shipping', name: 'Shipping', icon: <FiGlobe /> },
    { id: 'returns', name: 'Returns', icon: <FiClock /> },
    { id: 'payments', name: 'Payments', icon: <FiCheckCircle /> }
  ];

  const faqs = [
    {
      question: 'What is your return policy?',
      answer: 'You can return any item within 30 days of purchase for a full refund.',
      category: 'returns',
      tags: ['returns', 'policy']
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Yes, we ship to most countries worldwide. Shipping fees may apply.',
      category: 'shipping',
      tags: ['shipping', 'international']
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order is shipped, you will receive a tracking number via email.',
      category: 'shipping',
      tags: ['tracking', 'orders']
    },
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
    setCopiedIndex(null);
  };

  const copyToClipboard = async (text, index) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const filteredFaqs = faqs.filter(faq => 
    (faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
     faq.answer.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (activeCategory === 'all' || faq.category === activeCategory)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about our services
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {faqCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  activeCategory === category.id 
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                } transition-colors`}
              >
                {category.icon}
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center p-6 focus:outline-none"
                >
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {faq.question}
                    </h3>
                    <div className="flex gap-2 mt-2">
                      {faq.tags.map(tag => (
                        <span 
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-gray-500 ml-4">
                    {openIndex === index ? <FiChevronUp /> : <FiChevronDown />}
                  </span>
                </button>
                
                {openIndex === index && (
                  <div className="p-6 pt-0 border-t border-gray-100">
                    <div className="flex justify-between items-start">
                      <p className="text-gray-600 text-base leading-relaxed">
                        {faq.answer}
                      </p>
                      <button
                        onClick={() => copyToClipboard(faq.answer, index)}
                        className="text-gray-400 hover:text-blue-600 ml-4"
                        title="Copy answer"
                      >
                        {copiedIndex === index ? <FiCheckCircle className="text-green-500" /> : <FiCopy />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl">
              <p className="text-gray-500 text-lg">
                No questions found matching your search
              </p>
            </div>
          )}
        </div>

        {/* Back to Top */}
        <div className="mt-8 text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-blue-600 hover:text-blue-800 flex items-center justify-center gap-2"
          >
            Back to Top
            <FiChevronUp className="inline-block" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FaqPage;