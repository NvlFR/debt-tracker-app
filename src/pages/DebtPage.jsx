// src/pages/DebtPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import TransactionForm from "../components/common/TransactionForm";
import Modal from "../components/common/Modal";
import LoadingSpinner from "../components/common/LoadingSpinner";

const DebtPage = () => {
  const { currentUser, authService } = useAuth();
  const [debts, setDebts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState(null);

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const fetchDebts = useCallback(async () => {
    if (
      !currentUser ||
      !currentUser.id ||
      !authService ||
      !authService.getDebts
    ) {
      setError("User ID tidak ditemukan atau layanan autentikasi tidak siap.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.getDebts(currentUser.id);
      setDebts(data);
    } catch (err) {
      console.error("Failed to fetch debts:", err);
      setError("Gagal memuat daftar utang.");
      toast.error("Gagal memuat daftar utang.");
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, authService]);

  useEffect(() => {
    fetchDebts();
  }, [fetchDebts]);

  const handleAddDebt = async (debtData) => {
    if (!authService || !authService.addDebt) {
      toast.error("Layanan untuk menambahkan utang tidak tersedia.");
      throw new Error("AuthService not ready for addDebt.");
    }
    try {
      await authService.addDebt({ ...debtData, userId: currentUser.id });
      toast.success("Utang berhasil ditambahkan!");
      fetchDebts();
    } catch (error) {
      console.error("Error adding debt:", error);
      toast.error(`Gagal menambahkan utang: ${error.message || ""}`);
      throw error;
    }
  };

  const handleUpdateDebt = async (debtData) => {
    if (!authService || !authService.updateDebt) {
      toast.error("Layanan untuk memperbarui utang tidak tersedia.");
      throw new Error("AuthService not ready for updateDebt.");
    }
    try {
      await authService.updateDebt(editingDebt.id, debtData);
      toast.success("Utang berhasil diperbarui!");
      fetchDebts();
      setEditingDebt(null);
    } catch (error) {
      console.error("Error updating debt:", error);
      toast.error(`Gagal memperbarui utang: ${error.message || ""}`);
      throw error;
    }
  };

  const handleDeleteDebt = async (id) => {
    if (!authService || !authService.deleteDebt) {
      toast.error("Layanan untuk menghapus utang tidak tersedia.");
      return;
    }
    if (!window.confirm("Apakah Anda yakin ingin menghapus utang ini?")) return;
    try {
      await authService.deleteDebt(id);
      toast.success("Utang berhasil dihapus!");
      fetchDebts();
    } catch (error) {
      console.error("Error deleting debt:", error);
      toast.error(`Gagal menghapus utang: ${error.message || ""}`);
    }
  };

  const handleMarkAsPaid = async (debt) => {
    if (!authService || !authService.updateDebt) {
      toast.error("Layanan untuk menandai lunas tidak tersedia.");
      return;
    }
    const updatedDebt = {
      ...debt,
      status: "paid",
      paymentDate: new Date().toISOString().split("T")[0],
    };
    try {
      await authService.updateDebt(debt.id, updatedDebt);
      toast.success("Utang berhasil ditandai lunas!");
      fetchDebts();
    } catch (error) {
      console.error("Error marking debt as paid:", error);
      toast.error(`Gagal menandai lunas: ${error.message || ""}`);
    }
  };

  const openAddForm = () => {
    setEditingDebt(null);
    setIsFormOpen(true);
  };

  const openEditForm = (debt) => {
    setEditingDebt(debt);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingDebt(null);
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
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Daftar Utang
      </h1>
      <button
        onClick={openAddForm}
        className="mb-4 px-4 py-2 bg-primary-light text-white rounded-md hover:bg-primary-dark transition duration-200"
      >
        Tambah Utang Baru
      </button>

      {debts.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          Belum ada utang tercatat.
        </p>
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
              {debts.map((debt) => (
                <tr key={debt.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {debt.personName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {formatRupiah(debt.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {debt.transactionDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {debt.dueDate || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        debt.status === "paid"
                          ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100"
                          : debt.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100"
                          : "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100" // Untuk overdue, jika ada
                      }`}
                    >
                      {debt.status === "pending"
                        ? "Belum Lunas"
                        : debt.status === "paid"
                        ? "Lunas"
                        : "Jatuh Tempo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {debt.status === "pending" && (
                      <button
                        onClick={() => handleMarkAsPaid(debt)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200 mr-2"
                      >
                        Lunas
                      </button>
                    )}
                    <button
                      onClick={() => openEditForm(debt)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDebt(debt.id)}
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
            type="debt"
            initialData={editingDebt || {}}
            onSubmit={editingDebt ? handleUpdateDebt : handleAddDebt}
            onClose={closeForm}
          />
        </Modal>
      )}
    </div>
  );
};

export default DebtPage;
