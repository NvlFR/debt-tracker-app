// src/pages/TransactionsPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import TransactionForm from "../components/common/TransactionForm";
import Modal from "../components/common/Modal";
import LoadingSpinner from "../components/common/LoadingSpinner";

const TransactionsPage = () => {
  const { currentUser, authService } = useAuth();
  const [type, setType] = useState("debt");
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingData, setEditingData] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState(null);

  const formatRupiah = (amount) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!authService || !currentUser?.id) {
      setError("User belum tersedia.");
      setIsLoading(false);
      return;
    }

    try {
      const all = await authService.getTransactions(currentUser.id);
      const filtered = all.filter((item) => item.type === type);
      setTransactions(filtered);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Gagal memuat data.");
      toast.error("Gagal memuat data.");
    } finally {
      setIsLoading(false);
    }
  }, [type, authService, currentUser]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleAdd = async (data) => {
    try {
      await authService.addTransaction({
        ...data,
        userId: currentUser.id,
        type,
      });
      toast.success("Berhasil ditambahkan!");
      fetchTransactions();
    } catch (error) {
      toast.error(`Gagal menambah data: ${error.message}`);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await authService.updateTransaction(editingData.id, data);
      toast.success("Berhasil diperbarui!");
      fetchTransactions();
      setEditingData(null);
    } catch (error) {
      toast.error(`Gagal memperbarui data: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;

    try {
      await authService.deleteTransaction(id);
      toast.success("Berhasil dihapus!");
      fetchTransactions();
    } catch (error) {
      toast.error(`Gagal menghapus data: ${error.message}`);
    }
  };

  const handleMarkAsPaid = async (data) => {
    const updated = {
      ...data,
      status: "paid",
      paymentDate: new Date().toISOString().split("T")[0],
    };
    try {
      await authService.updateTransaction(data.id, updated);
      toast.success("Berhasil ditandai lunas!");
      fetchTransactions();
    } catch (error) {
      toast.error(`Gagal menandai lunas: ${error.message}`);
    }
  };

  const openAddForm = () => {
    setEditingData(null);
    setIsFormOpen(true);
  };

  const openEditForm = (data) => {
    setEditingData(data);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingData(null);
    setIsFormOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {type === "debt" ? "Daftar Utang" : "Daftar Piutang"}
        </h1>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border px-3 py-2 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-100"
        >
          <option value="debt">Utang</option>
          <option value="receivable">Piutang</option>
        </select>
      </div>

      <button
        onClick={openAddForm}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Tambah {type === "debt" ? "Utang" : "Piutang"}
      </button>

      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : transactions.length === 0 ? (
        <p className="text-gray-600">Belum ada data.</p>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Pihaknya
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Jumlah
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Tanggal
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Jatuh Tempo
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-2">{item.personName}</td>
                  <td className="px-4 py-2">{formatRupiah(item.amount)}</td>
                  <td className="px-4 py-2">{item.transactionDate}</td>
                  <td className="px-4 py-2">{item.dueDate || "-"}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.status === "paid"
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {item.status === "paid" ? "Lunas" : "Belum Lunas"}
                    </span>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    {item.status === "pending" && (
                      <button
                        onClick={() => handleMarkAsPaid(item)}
                        className="text-green-600 hover:underline"
                      >
                        Lunas
                      </button>
                    )}
                    <button
                      onClick={() => openEditForm(item)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:underline"
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
            type={type}
            initialData={editingData || {}}
            onSubmit={editingData ? handleUpdate : handleAdd}
            onClose={closeForm}
          />
        </Modal>
      )}
    </div>
  );
};

export default TransactionsPage;
