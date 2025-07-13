// src/components/dashboard/ReceivableSummaryCard.jsx
import React from 'react';
import { ArrowUpCircleIcon } from '@heroicons/react/24/solid'; // Solid icon

const ReceivableSummaryCard = ({ amount }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center space-x-4">
      <div className="p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
        <ArrowUpCircleIcon className="h-8 w-8" />
      </div>
      <div>
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400">Total Piutang</p>
        <h3 className="text-3xl font-bold text-green-600 dark:text-green-400">
          {formatCurrency(amount)}
        </h3>
      </div>
    </div>
  );
};

export default ReceivableSummaryCard;