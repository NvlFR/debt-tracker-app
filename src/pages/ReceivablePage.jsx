// src/pages/ReceivablePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import TransactionForm from '../components/common/TransactionForm'; // Import form
import { PlusCircleIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const ReceivablePage = () => {
  const { user, authService } = useAuth();
  const [receivables, setReceivables] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReceivable, setEditingReceivable] = useState(null);

  const fetchReceivables = useCallback(async () => {
    setIsLoading(true);
    try {
      if (user && user.id) {
        const data = await authService.getReceivables(user.id);
        setReceivables(data);
      }
    } catch (error) {
      console.error('Error fetching receivables:', error);
      toast.error('Gagal mengambil data piutang.');
    } finally {
      setIsLoading(false);
    }
  }, [user, authService]);

  useEffect(() => {
    fetchReceivables();
  }, [fetchReceivables]);

  const handleAddReceivable = async (receivableData) => {
    try {
      await authService.addReceivable({ ...receivableData, userId: user.id });
      fetchReceivables();
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateReceivable = async (receivableData) => {
    try {
      await authService.updateReceivable(editingReceivable.id, receivableData);
      fetchReceivables();
      setEditingReceivable(null);
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteReceivable = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus piutang ini?')) {
      try {
        await authService.deleteReceivable(id);
        toast.success('Piutang berhasil dihapus!');
        fetchReceivables();
      } catch (error) {
        console.error('Error deleting receivable:', error);
        toast.error('Gagal menghapus piutang.');
      }
    }
  };

  const handleMarkAsPaid = async (receivable) => {
    try {
      const updatedReceivable = { ...receivable, status: 'paid', paymentDate: new Date().toISOString().split('T')[0] };
      await authService.updateReceivable(receivable.id, updatedReceivable);
      toast.success('Piutang berhasil ditandai lunas!');
      fetchReceivables();
    } catch (error) {
      console.error('Error marking receivable as paid:', error);
      toast.error('Gagal menandai piutang lunas.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Daftar Piutang</h1>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingReceivable(null);
          }}
          className="px-4 py-2 bg-primary-light text-white rounded-md flex items-center hover:bg-primary-dark transition-colors"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Tambah Piutang Baru
        </button>
      </div>

      {/* Modal / Form Tambah/Edit Piutang */}
      {(showAddForm || editingReceivable) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <TransactionForm
            type="receivable"
            initialData={editingReceivable || {}}
            onSubmit={editingReceivable ? handleUpdateReceivable : handleAddReceivable}
            onClose={() => {
              setShowAddForm(false);
              setEditingReceivable(null);
            }}
          />
        </div>
      )}

      {isLoading ? (
        <p className="text-gray-600 dark:text-gray-400">Memuat data piutang...</p>
      ) : receivables.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">Belum ada piutang. Tambahkan yang pertama!</p>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
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
                  Jatuh Tempo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {receivables.map((receivable) => (
                <tr key={receivable.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {receivable.personName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    Rp {receivable.amount.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {receivable.dueDate ? new Date(receivable.dueDate).toLocaleDateString('id-ID') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${receivable.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' : ''}
                      ${receivable.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : ''}
                      ${receivable.status === 'overdue' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' : ''}
                    `}>
                      {receivable.status === 'pending' ? 'Belum Lunas' : receivable.status === 'paid' ? 'Lunas' : 'Jatuh Tempo'}
                    </span>
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {receivable.category || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {receivable.status !== 'paid' && (
                      <button
                        onClick={() => handleMarkAsPaid(receivable)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200 mr-3"
                      >
                        Lunas
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setEditingReceivable(receivable);
                        setShowAddForm(false);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 mr-3"
                    >
                      <PencilSquareIcon className="h-5 w-5 inline-block" />
                    </button>
                    <button
                      onClick={() => handleDeleteReceivable(receivable.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
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
    </div>
  );
};

export default ReceivablePage;