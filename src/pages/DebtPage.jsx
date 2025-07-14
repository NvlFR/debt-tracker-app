// src/pages/DebtPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import TransactionForm from '../components/common/TransactionForm'; // Import form
import { PlusCircleIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'; // Ikon untuk tombol
import { toast } from 'react-toastify';




const DebtPage = () => {
  const { user, authService } = useAuth(); // Ambil user dan authService dari AuthContext
  const [debts, setDebts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false); // State untuk menampilkan/menyembunyikan form
  const [editingDebt, setEditingDebt] = useState(null); // State untuk data utang yang sedang diedit

  const fetchDebts = useCallback(async () => {
    setIsLoading(true);
    try {
      if (user && user.id) {
        const data = await authService.getDebts(user.id);
        setDebts(data);
      }
    } catch (error) {
      console.error('Error fetching debts:', error);
      toast.error('Gagal mengambil data utang.');
    } finally {
      setIsLoading(false);
    }
  }, [user, authService]);

  useEffect(() => {
    fetchDebts();
  }, [fetchDebts]);

const handleAddDebt = async (debtData) => {
  try {
    await authService.addDebt({ ...debtData, userId: user.id });
    // BARIS PENTING INI:
    fetchDebts(); // <--- PASTIKAN INI ADA SETELAH BERHASIL MENAMBAHKAN
  } catch (error) {
    throw error;
  }
};

const handleUpdateDebt = async (debtData) => {
  try {
    await authService.updateDebt(editingDebt.id, debtData);
    // BARIS PENTING INI:
    fetchDebts(); // <--- PASTIKAN INI ADA SETELAH BERHASIL MEMPERBARUI
    setEditingDebt(null);
  } catch (error) {
    throw error;
  }
};

const handleDeleteDebt = async (id) => {
  if (window.confirm('Apakah Anda yakin ingin menghapus utang ini?')) {
    try {
      await authService.deleteDebt(id);
      toast.success('Utang berhasil dihapus!');
      // BARIS PENTING INI:
      fetchDebts(); // <--- PASTIKAN INI ADA SETELAH BERHASIL MENGHAPUS
    } catch (error) {
      console.error('Error deleting debt:', error);
      toast.error('Gagal menghapus utang.');
    }
  }
};

  const handleMarkAsPaid = async (debt) => {
    try {
      const updatedDebt = { ...debt, status: 'paid', paymentDate: new Date().toISOString().split('T')[0] };
      await authService.updateDebt(debt.id, updatedDebt);
      toast.success('Utang berhasil ditandai lunas!');
      fetchDebts();
    } catch (error) {
      console.error('Error marking debt as paid:', error);
      toast.error('Gagal menandai utang lunas.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Daftar Utang</h1>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingDebt(null); // Pastikan tidak dalam mode edit saat tambah
          }}
          className="px-4 py-2 bg-primary-light text-white rounded-md flex items-center hover:bg-primary-dark transition-colors"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Tambah Utang Baru
        </button>
      </div>

      {/* Modal / Form Tambah/Edit Utang */}
      {(showAddForm || editingDebt) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <TransactionForm
            type="debt"
            initialData={editingDebt || {}}
            onSubmit={editingDebt ? handleUpdateDebt : handleAddDebt}
            onClose={() => {
              setShowAddForm(false);
              setEditingDebt(null);
            }}
          />
        </div>
      )}

      {isLoading ? (
        <p className="text-gray-600 dark:text-gray-400">Memuat data utang...</p>
      ) : debts.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">Belum ada utang. Tambahkan yang pertama!</p>
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
              {debts.map((debt) => (
                <tr key={debt.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {debt.personName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    Rp {debt.amount.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {debt.dueDate ? new Date(debt.dueDate).toLocaleDateString('id-ID') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${debt.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' : ''}
                      ${debt.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : ''}
                      ${debt.status === 'overdue' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' : ''}
                    `}>
                      {debt.status === 'pending' ? 'Belum Lunas' : debt.status === 'paid' ? 'Lunas' : 'Jatuh Tempo'}
                    </span>
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {debt.category || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {debt.status !== 'paid' && (
                      <button
                        onClick={() => handleMarkAsPaid(debt)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200 mr-3"
                      >
                        Lunas
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setEditingDebt(debt); // Set data utang untuk diedit
                        setShowAddForm(false); // Pastikan form tambah tidak aktif
                      }}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 mr-3"
                    >
                      <PencilSquareIcon className="h-5 w-5 inline-block" />
                    </button>
                    <button
                      onClick={() => handleDeleteDebt(debt.id)}
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

export default DebtPage;