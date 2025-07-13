// src/pages/ReceivablePage.jsx
import React, { useState } from 'react';
import ReceivableForm from '../components/forms/ReceivableForm'; // Komponen form akan kita buat di bawah
import { PlusIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'; // Untuk ikon

const ReceivablePage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  // Data dummy untuk daftar piutang
  const [receivables, setReceivables] = useState([
    {
      id: 'r1',
      person: 'Dedi Kurniawan',
      amount: 700000,
      dueDate: '2025-09-01',
      description: 'Piutang penjualan barang',
      status: 'Belum Lunas'
    },
    {
      id: 'r2',
      person: 'Eka Putri',
      amount: 300000,
      dueDate: '2025-07-25',
      description: 'Pembayaran jasa desain',
      status: 'Belum Lunas'
    },
    {
      id: 'r3',
      person: 'Faisal Akbar',
      amount: 1200000,
      dueDate: '2025-06-10',
      description: 'Piutang proyek X',
      status: 'Lunas'
    },
  ]);

  const handleAddReceivable = (newReceivable) => {
    setReceivables((prevReceivables) => [
      { id: Date.now().toString(), status: 'Belum Lunas', ...newReceivable },
      ...prevReceivables,
    ]);
    setIsFormOpen(false);
    console.log('Piutang baru ditambahkan:', newReceivable);
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
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">Daftar Piutang</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-6 py-3 rounded-full text-white font-semibold
                     bg-primary-light dark:bg-primary-dark
                     hover:bg-primary-dark dark:hover:bg-secondary-dark
                     shadow-md hover:shadow-lg
                     transition-all duration-200 flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Tambah Piutang</span>
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Tambah Piutang Baru</h2>
          <ReceivableForm onAddReceivable={handleAddReceivable} onCancel={() => setIsFormOpen(false)} />
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        {receivables.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">Belum ada data piutang.</p>
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
                {receivables.map((receivable) => (
                  <tr key={receivable.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {receivable.person}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {formatCurrency(receivable.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {formatDate(receivable.dueDate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {receivable.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                        ${receivable.status === 'Lunas' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                        {receivable.status}
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

export default ReceivablePage;