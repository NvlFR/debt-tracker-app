// // src/components/forms/DebtForm.jsx
// import React, { useState, useEffect } from 'react';
// import { CurrencyDollarIcon, UserIcon, CalendarDaysIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

// // Menerima onUpdateDebt dan initialData sebagai props baru
// const DebtForm = ({ onAddDebt, onUpdateDebt, onCancel, initialData }) => {
//   const [person, setPerson] = useState('');
//   const [amount, setAmount] = useState('');
//   const [dueDate, setDueDate] = useState('');
//   const [description, setDescription] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Gunakan useEffect untuk mengisi form jika ada initialData (mode edit)
//   useEffect(() => {
//     if (initialData) {
//       setPerson(initialData.person || '');
//       setAmount(initialData.amount || '');
//       setDueDate(initialData.dueDate ? initialData.dueDate.split('T')[0] : ''); // Format tanggal untuk input type="date"
//       setDescription(initialData.description || '');
//     } else {
//       // Reset form jika tidak ada initialData (mode tambah baru)
//       setPerson('');
//       setAmount('');
//       setDueDate('');
//       setDescription('');
//     }
//     setError(''); // Bersihkan error saat initialData berubah
//   }, [initialData]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     if (!person || !amount || !dueDate) {
//       setError('Nama, Jumlah, dan Tanggal Jatuh Tempo wajib diisi.');
//       return;
//     }
//     if (isNaN(amount) || parseFloat(amount) <= 0) {
//       setError('Jumlah harus berupa angka positif.');
//       return;
//     }

//     setLoading(true);

//     const dataToSubmit = {
//       person,
//       amount: parseFloat(amount),
//       dueDate,
//       description,
//     };

//     try {
//       if (initialData) {
//         // Jika ada initialData, panggil onUpdateDebt
//         await onUpdateDebt(dataToSubmit);
//       } else {
//         // Jika tidak ada initialData, panggil onAddDebt
//         await onAddDebt(dataToSubmit);
//       }
//       // Reset form hanya jika mode tambah baru
//       if (!initialData) {
//           setPerson('');
//           setAmount('');
//           setDueDate('');
//           setDescription('');
//       }
//     } catch (err) {
//       setError(err.message || 'Terjadi kesalahan saat menyimpan data.');
//       console.error('Form submission error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-5">
//       <div>
//         <label htmlFor="person" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//           <UserIcon className="h-4 w-4 inline-block mr-1" />
//           Pihak Yang Berutang
//         </label>
//         <input
//           type="text"
//           id="person"
//           value={person}
//           onChange={(e) => setPerson(e.target.value)}
//           placeholder="Nama orang/entitas yang berutang"
//           required
//           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm
//                      focus:ring-primary-light focus:border-primary-light
//                      bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
//                      placeholder-gray-400 dark:placeholder-gray-500"
//         />
//       </div>

//       <div>
//         <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//           <CurrencyDollarIcon className="h-4 w-4 inline-block mr-1" />
//           Jumlah Utang (Rp)
//         </label>
//         <input
//           type="number"
//           id="amount"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           placeholder="Contoh: 500000"
//           required
//           min="0"
//           step="any"
//           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm
//                      focus:ring-primary-light focus:border-primary-light
//                      bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
//                      placeholder-gray-400 dark:placeholder-gray-500"
//         />
//       </div>

//       <div>
//         <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//           <CalendarDaysIcon className="h-4 w-4 inline-block mr-1" />
//           Tanggal Jatuh Tempo
//         </label>
//         <input
//           type="date"
//           id="dueDate"
//           value={dueDate}
//           onChange={(e) => setDueDate(e.target.value)}
//           required
//           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm
//                      focus:ring-primary-light focus:border-primary-light
//                      bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
//         />
//       </div>

//       <div>
//         <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//           <DocumentTextIcon className="h-4 w-4 inline-block mr-1" />
//           Deskripsi (Opsional)
//         </label>
//         <textarea
//           id="description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           rows="3"
//           placeholder="Contoh: Pinjam untuk modal usaha..."
//           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm
//                      focus:ring-primary-light focus:border-primary-light
//                      bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
//                      placeholder-gray-400 dark:placeholder-gray-500"
//         ></textarea>
//       </div>

//       {error && (
//         <p className="text-red-500 text-sm text-center">{error}</p>
//       )}

//       <div className="flex justify-end space-x-4">
//         <button
//           type="button"
//           onClick={onCancel}
//           className="px-6 py-2 rounded-md font-semibold
//                      bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200
//                      hover:bg-gray-400 dark:hover:bg-gray-600
//                      transition-colors duration-200"
//           disabled={loading}
//         >
//           Batal
//         </button>
//         <button
//           type="submit"
//           disabled={loading}
//           className={`px-6 py-2 rounded-md text-white font-semibold
//                      ${loading ? 'bg-primary-light opacity-70 cursor-not-allowed' : 'bg-primary-light hover:bg-primary-dark'}
//                      dark:bg-primary-dark dark:hover:bg-secondary-dark
//                      shadow-md hover:shadow-lg
//                      transition-all duration-200`}
//         >
//           {loading ? 'Menyimpan...' : (initialData ? 'Simpan Perubahan' : 'Simpan Utang')}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default DebtForm;
