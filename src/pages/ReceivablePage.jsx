// src/pages/ReceivablePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import ReceivableForm from '../components/forms/ReceivableForm';
import { PlusIcon, ChevronLeftIcon, ChevronRightIcon, PencilIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import receivableService from '../services/receivableService'; // Import receivableService

const ReceivablePage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [receivables, setReceivables] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingReceivable, setEditingReceivable] = useState(null);

  // Fungsi untuk mengambil data piutang dari backend
  const fetchReceivables = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await receivableService.getAllReceivables();
      setReceivables(data);
    } catch (err) {
      setError(err.message || 'Gagal memuat daftar piutang.');
      console.error('Error fetching receivables:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReceivables();
  }, [fetchReceivables]);

  // Fungsi untuk menambahkan piutang baru
  const handleAddReceivable = async (newReceivableData) => {
    setError('');
    try {
      const addedReceivable = await receivableService.addReceivable(newReceivableData);
      setReceivables((prevReceivables) => [addedReceivable, ...prevReceivables]);
      setIsFormOpen(false);
    } catch (err) {
      setError(err.message || 'Gagal menambahkan piutang.');
      console.error('Error adding receivable:', err);
    }
  };

  // Fungsi untuk memulai mode edit
  const handleEditClick = (receivable) => {
    setEditingReceivable(receivable);
    setIsFormOpen(true);
  };

  // Fungsi untuk mengupdate piutang
  const handleUpdateReceivable = async (updatedReceivableData) => {
    setError('');
    try {
      const updatedReceivable = await receivableService.updateReceivable(editingReceivable.id, updatedReceivableData);
      setReceivables((prevReceivables) =>
        prevReceivables.map((rec) => (rec.id === updatedReceivable.id ? updatedReceivable : rec))
      );
      setEditingReceivable(null);
      setIsFormOpen(false);
    } catch (err) {
      setError(err.message || 'Gagal memperbarui piutang.');
      console.error('Error updating receivable:', err);
    }
  };

  // Fungsi untuk menghapus piutang
  const handleDeleteReceivable = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus piutang ini?')) {
      setError('');
      try {
        await receivableService.deleteReceivable(id);
        setReceivables((prevReceivables) => prevReceivables.filter((rec) => rec.id !== id));
      } catch (err) {
        setError(err.message || 'Gagal menghapus piutang.');
        console.error('Error deleting receivable:', err);
      }
    }
  };

  // Fungsi untuk menandai piutang lunas
  const handleMarkAsPaid = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menandai piutang ini sebagai Lunas?')) {
      setError('');
      try {
        const updatedReceivable = await receivableService.markReceivableAsPaid(id);
        setReceivables((prevReceivables) =>
          prevReceivables.map((rec) => (rec.id === updatedReceivable.id ? updatedReceivable : rec))
        );
      } catch (err) {
        setError(err.message || 'Gagal menandai piutang sebagai lunas.');
        console.error('Error marking receivable as paid:', err);
      }
    }
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

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingReceivable(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">Daftar Piutang</h1>
        <button
          onClick={() => { setIsFormOpen(true); setEditingReceivable(null); }}
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

      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}

      {/* Form Tambah/Edit Piutang */}
      {isFormOpen && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            {editingReceivable ? 'Edit Piutang' : 'Tambah Piutang Baru'}
          </h2>
          <ReceivableForm
            onAddReceivable={handleAddReceivable}
            onUpdateReceivable={handleUpdateReceivable}
            onCancel={handleFormClose}
            initialData={editingReceivable}
          />
        </div>
      )}

      {/* Daftar Piutang */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        {isLoading ? (
          <p className="text-center text-gray-600 dark:text-gray-400">Memuat data piutang...</p>
        ) : receivables.length === 0 ? (
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
                      {receivable.status !== 'Lunas' && (
                        <button
                          onClick={() => handleMarkAsPaid(receivable.id)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-4"
                          title="Tandai Lunas"
                        >
                          <CheckCircleIcon className="h-5 w-5 inline-block" />
                        </button>
                      )}
                      <button
                        onClick={() => handleEditClick(receivable)}
                        className="text-primary-light dark:text-primary-dark hover:text-primary-dark dark:hover:text-secondary-dark mr-4"
                        title="Edit Piutang"
                      >
                        <PencilIcon className="h-5 w-5 inline-block" />
                      </button>
                      <button
                        onClick={() => handleDeleteReceivable(receivable.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Hapus Piutang"
                      >
                        <TrashIcon className="h-5 w-5 inline-block" />
                      </button>
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