import React, { useState } from 'react';

function PaymentsPage() {
  const [payments, setPayments] = useState([
    { id: 1, name: 'John Doe', amount: 100, status: 'Paid' },
    { id: 2, name: 'Jane Smith', amount: 200, status: 'Pending' },
    { id: 3, name: 'Alice Johnson', amount: 150, status: 'Failed' },
  ]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Payments</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">ID</th>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Amount</th>
              <th className="px-4 py-2 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b text-center">{payment.id}</td>
                <td className="px-4 py-2 border-b">{payment.name}</td>
                <td className="px-4 py-2 border-b text-right">${payment.amount}</td>
                <td
                  className={`px-4 py-2 border-b text-center ${
                    payment.status === 'Paid'
                      ? 'text-green-500'
                      : payment.status === 'Pending'
                      ? 'text-yellow-500'
                      : 'text-red-500'
                  }`}
                >
                  {payment.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PaymentsPage;