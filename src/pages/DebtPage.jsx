// src/pages/DebtPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import DebtForm from '../components/forms/DebtForm';
import { PlusIcon, ChevronLeftIcon, ChevronRightIcon, PencilIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import debtService from '../services/debtService'; // Import debtService

const DebtPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [debts, setDebts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingDebt, setEditingDebt] = useState(null); // State untuk utang yang sedang diedit

  // Fungsi untuk mengambil data utang dari backend
  const fetchDebts = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await debtService.getAllDebts();
      setDebts(data);
    } catch (err) {
      setError(err.message || 'Gagal memuat daftar utang.');
      console.error('Error fetching debts:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDebts();
  }, [fetchDebts]);

  // Fungsi untuk menambahkan utang baru
  const handleAddDebt = async (newDebtData) => {
    setError('');
    try {
      const addedDebt = await debtService.addDebt(newDebtData);
      setDebts((prevDebts) => [addedDebt, ...prevDebts]);
      setIsFormOpen(false);
    } catch (err) {
      setError(err.message || 'Gagal menambahkan utang.');
      console.error('Error adding debt:', err);
    }
  };

  // Fungsi untuk memulai mode edit
  const handleEditClick = (debt) => {
    setEditingDebt(debt); // Set utang yang akan diedit
    setIsFormOpen(true); // Buka form
  };

  // Fungsi untuk mengupdate utang
  const handleUpdateDebt = async (updatedDebtData) => {
    setError('');
    try {
      const updatedDebt = await debtService.updateDebt(editingDebt.id, updatedDebtData);
      setDebts((prevDebts) =>
        prevDebts.map((debt) => (debt.id === updatedDebt.id ? updatedDebt : debt))
      );
      setEditingDebt(null); // Hapus state editing
      setIsFormOpen(false); // Tutup form
    } catch (err) {
      setError(err.message || 'Gagal memperbarui utang.');
      console.error('Error updating debt:', err);
    }
  };

  // Fungsi untuk menghapus utang
  const handleDeleteDebt = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus utang ini?')) {
      setError('');
      try {
        await debtService.deleteDebt(id);
        setDebts((prevDebts) => prevDebts.filter((debt) => debt.id !== id));
      } catch (err) {
        setError(err.message || 'Gagal menghapus utang.');
        console.error('Error deleting debt:', err);
      }
    }
  };

  // Fungsi untuk menandai utang lunas
  const handleMarkAsPaid = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menandai utang ini sebagai Lunas?')) {
      setError('');
      try {
        const updatedDebt = await debtService.markDebtAsPaid(id);
        setDebts((prevDebts) =>
          prevDebts.map((debt) => (debt.id === updatedDebt.id ? updatedDebt : debt))
        );
      } catch (err) {
        setError(err.message || 'Gagal menandai utang sebagai lunas.');
        console.error('Error marking debt as paid:', err);
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
    setEditingDebt(null); // Pastikan editingDebt direset saat form ditutup
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">Daftar Utang</h1>
        <button
          onClick={() => { setIsFormOpen(true); setEditingDebt(null); }} // Reset editingDebt saat buka form baru
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

      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}

      {/* Form Tambah/Edit Utang */}
      {isFormOpen && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            {editingDebt ? 'Edit Utang' : 'Tambah Utang Baru'}
          </h2>
          <DebtForm
            onAddDebt={handleAddDebt}
            onUpdateDebt={handleUpdateDebt}
            onCancel={handleFormClose}
            initialData={editingDebt} // Kirim data utang jika sedang edit
          />
        </div>
      )}

      {/* Daftar Utang */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        {isLoading ? (
          <p className="text-center text-gray-600 dark:text-gray-400">Memuat data utang...</p>
        ) : debts.length === 0 ? (
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
                      {debt.status !== 'Lunas' && (
                        <button
                          onClick={() => handleMarkAsPaid(debt.id)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-4"
                          title="Tandai Lunas"
                        >
                          <CheckCircleIcon className="h-5 w-5 inline-block" />
                        </button>
                      )}
                      <button
                        onClick={() => handleEditClick(debt)}
                        className="text-primary-light dark:text-primary-dark hover:text-primary-dark dark:hover:text-secondary-dark mr-4"
                        title="Edit Utang"
                      >
                        <PencilIcon className="h-5 w-5 inline-block" />
                      </button>
                      <button
                        onClick={() => handleDeleteDebt(debt.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Hapus Utang"
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

        {/* Pagination (dummy, masih butuh backend untuk fungsi penuh) */}
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