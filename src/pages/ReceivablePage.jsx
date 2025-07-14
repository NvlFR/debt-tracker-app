// src/pages/ReceivablePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import TransactionForm from '../components/common/TransactionForm'; // Pastikan path ini benar
import Modal from '../components/common/Modal'; // Asumsi Anda punya komponen Modal
import LoadingSpinner from '../components/common/LoadingSpinner'; // Import LoadingSpinner

const ReceivablePage = () => {
  const { currentUser, authService } = useAuth(); // Pastikan authService tersedia dari context
  const [receivables, setReceivables] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReceivable, setEditingReceivable] = useState(null);

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const fetchReceivables = useCallback(async () => {
    if (!currentUser || !currentUser.id || !authService || !authService.getReceivables) {
      setError("User ID tidak ditemukan atau layanan autentikasi tidak siap.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.getReceivables(currentUser.id); // Panggil getReceivables dari authService
      setReceivables(data);
    } catch (err) {
      console.error("Failed to fetch receivables:", err);
      setError("Gagal memuat daftar piutang.");
      toast.error("Gagal memuat daftar piutang.");
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, authService]); // currentUser dan authService adalah dependencies

  useEffect(() => {
    fetchReceivables();
  }, [fetchReceivables]); // Tambahkan fetchReceivables sebagai dependency (mengatasi peringatan linter)

  const handleAddReceivable = async (receivableData) => {
    if (!authService || !authService.addReceivable || !currentUser || !currentUser.id) { // Tambahkan pengecekan currentUser.id
        toast.error("Layanan untuk menambahkan piutang tidak tersedia atau user ID tidak ada.");
        throw new Error("AuthService not ready or User ID missing for addReceivable.");
    }
    try {
      await authService.addReceivable({ ...receivableData, userId: currentUser.id }); // Panggil addReceivable dari authService
      toast.success('Piutang berhasil ditambahkan!');
      fetchReceivables(); // Muat ulang daftar piutang
    } catch (error) {
      console.error('Error adding receivable:', error);
      toast.error(`Gagal menambahkan piutang: ${error.message || ''}`);
      throw error;
    }
  };

  const handleUpdateReceivable = async (receivableData) => {
    if (!authService || !authService.updateReceivable) {
        toast.error("Layanan untuk memperbarui piutang tidak tersedia.");
        throw new Error("AuthService not ready for updateReceivable.");
    }
    try {
      await authService.updateReceivable(editingReceivable.id, receivableData); // Panggil updateReceivable dari authService
      toast.success('Piutang berhasil diperbarui!');
      fetchReceivables();
      setEditingReceivable(null);
    } catch (error) {
      console.error('Error updating receivable:', error);
      toast.error(`Gagal memperbarui piutang: ${error.message || ''}`);
      throw error;
    }
  };

  const handleDeleteReceivable = async (id) => {
    if (!authService || !authService.deleteReceivable) {
        toast.error("Layanan untuk menghapus piutang tidak tersedia.");
        return;
    }
    if (!window.confirm('Apakah Anda yakin ingin menghapus piutang ini?')) return;
    try {
      await authService.deleteReceivable(id); // Panggil deleteReceivable dari authService
      toast.success('Piutang berhasil dihapus!');
      fetchReceivables();
    } catch (error) {
      console.error('Error deleting receivable:', error);
      toast.error(`Gagal menghapus piutang: ${error.message || ''}`);
    }
  };

  const handleMarkAsPaid = async (receivable) => {
    if (!authService || !authService.updateReceivable) {
        toast.error("Layanan untuk menandai lunas tidak tersedia.");
        return;
    }
    const updatedReceivable = {
      ...receivable,
      status: 'paid',
      paymentDate: new Date().toISOString().split('T')[0],
    };
    try {
      await authService.updateReceivable(receivable.id, updatedReceivable);
      toast.success('Piutang berhasil ditandai lunas!');
      fetchReceivables();
    } catch (error) {
      console.error('Error marking receivable as paid:', error);
      toast.error(`Gagal menandai lunas: ${error.message || ''}`);
    }
  };

  const openAddForm = () => {
    setEditingReceivable(null);
    setIsFormOpen(true);
  };

  const openEditForm = (receivable) => {
    setEditingReceivable(receivable);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingReceivable(null);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-red-600 dark:text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Daftar Piutang</h1>
      <button
        onClick={openAddForm}
        className="mb-4 px-4 py-2 bg-primary-light text-white rounded-md hover:bg-primary-dark transition duration-200"
      >
        Tambah Piutang Baru
      </button>

      {receivables.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">Belum ada piutang tercatat.</p>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Pihaknya
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tanggal Transaksi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Jatuh Tempo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {receivables.map((receivable) => (
                <tr key={receivable.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{receivable.personName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{formatRupiah(receivable.amount)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{receivable.transactionDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{receivable.dueDate || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      receivable.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' :
                      receivable.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100' :
                      'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100' // Untuk overdue, jika ada
                    }`}>
                      {receivable.status === 'pending' ? 'Belum Lunas' : receivable.status === 'paid' ? 'Lunas' : 'Jatuh Tempo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {receivable.status === 'pending' && (
                      <button
                        onClick={() => handleMarkAsPaid(receivable)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200 mr-2"
                      >
                        Lunas
                      </button>
                    )}
                    <button
                      onClick={() => openEditForm(receivable)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteReceivable(receivable.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

 {isFormOpen && (
        <Modal onClose={closeForm}>
          <TransactionForm
            type="receivable"
            initialData={editingReceivable || {}}
            onSubmit={editingReceivable ? handleUpdateReceivable : handleAddReceivable}
            onClose={closeForm}
          />
        </Modal>
      )}
    </div>
  ); 

}; 


export default ReceivablePage;