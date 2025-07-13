// src/pages/DebtPage.jsx
import React, { useState } from 'react';
import DebtForm from '../components/forms/DebtForm'; // Komponen form akan kita buat di bawah
import { PlusIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'; // Untuk ikon

const DebtPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false); // State untuk mengontrol visibilitas form
  // Data dummy untuk daftar utang
  const [debts, setDebts] = useState([
    {
      id: 'd1',
      person: 'Andi Nugraha',
      amount: 500000,
      dueDate: '2025-08-15',
      description: 'Pinjam uang untuk bayar kosan',
      status: 'Belum Lunas'
    },
    {
      id: 'd2',
      person: 'Budi Santoso',
      amount: 250000,
      dueDate: '2025-07-20',
      description: 'Utang pulsa dan kopi',
      status: 'Belum Lunas'
    },
    {
      id: 'd3',
      person: 'Citra Dewi',
      amount: 1000000,
      dueDate: '2025-06-30',
      description: 'Pinjaman renovasi rumah',
      status: 'Lunas'
    },
  ]);

  // Fungsi untuk menambahkan utang baru (akan dipanggil dari DebtForm)
  const handleAddDebt = (newDebt) => {
    setDebts((prevDebts) => [
      { id: Date.now().toString(), status: 'Belum Lunas', ...newDebt }, // Tambah ID dan status default
      ...prevDebts,
    ]);
    setIsFormOpen(false); // Tutup form setelah berhasil
    console.log('Utang baru ditambahkan:', newDebt);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">Daftar Utang</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-6 py-3 rounded-full text-white font-semibold
                     bg-primary-light dark:bg-primary-dark
                     hover:bg-primary-dark dark:hover:bg-secondary-dark
                     shadow-md hover:shadow-lg
                     transition-all duration-200 flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Tambah Utang</span>
        </button>
      </div>

      {/* Form Tambah Utang (Conditional Rendering) */}
      {isFormOpen && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Tambah Utang Baru</h2>
          <DebtForm onAddDebt={handleAddDebt} onCancel={() => setIsFormOpen(false)} />
        </div>
      )}

      {/* Daftar Utang */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        {debts.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">Belum ada data utang.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Orang/Entitas
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Jumlah
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Jatuh Tempo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Deskripsi
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Aksi</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {debts.map((debt) => (
                  <tr key={debt.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {debt.person}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {formatCurrency(debt.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {formatDate(debt.dueDate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {debt.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                        ${debt.status === 'Lunas' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                        {debt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-primary-light dark:text-primary-dark hover:text-primary-dark dark:hover:text-secondary-dark mr-4">Edit</button>
                      <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination (dummy) */}
        <div className="flex justify-between items-center mt-6">
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg flex items-center space-x-2">
                <ChevronLeftIcon className="h-4 w-4" />
                <span>Sebelumnya</span>
            </button>
            <span className="text-gray-600 dark:text-gray-400 text-sm">Halaman 1 dari 1</span>
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg flex items-center space-x-2">
                <span>Berikutnya</span>
                <ChevronRightIcon className="h-4 w-4" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default DebtPage;