// // src/components/dashboard/DebtSummaryCard.jsx
// import React from 'react';
// import { ArrowDownCircleIcon } from '@heroicons/react/24/solid'; // Solid icon

// const DebtSummaryCard = ({ amount }) => {
//   const formatCurrency = (value) => {
//     return new Intl.NumberFormat('id-ID', {
//       style: 'currency',
//       currency: 'IDR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(value);
//   };

//   return (
//     <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center space-x-4">
//       <div className="p-3 rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300">
//         <ArrowDownCircleIcon className="h-8 w-8" />
//       </div>
//       <div>
//         <p className="text-lg font-medium text-gray-600 dark:text-gray-400">Total Utang</p>
//         <h3 className="text-3xl font-bold text-red-600 dark:text-red-400">
//           {formatCurrency(amount)}
//         </h3>
//       </div>
//     </div>
//   );
// };

// export default DebtSummaryCard;
