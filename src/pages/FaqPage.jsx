import React, { useState } from 'react';

function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'What is your return policy?',
      answer: 'You can return any item within 30 days of purchase for a full refund.',
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Yes, we ship to most countries worldwide. Shipping fees may apply.',
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order is shipped, you will receive a tracking number via email.',
    },
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex justify-between items-center p-4 bg-gray-200 hover:bg-gray-300 focus:outline-none"
              >
                <span className="text-gray-800 font-medium">{faq.question}</span>
                <span className="text-gray-500">
                  {openIndex === index ? '-' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div className="p-4 bg-gray-50 text-gray-700">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FaqPage;