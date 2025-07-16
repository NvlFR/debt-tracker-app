import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import TransactionForm from "../components/common/TransactionForm";
import Modal from "../components/common/Modal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { MinusCircle, PlusCircle } from "lucide-react";
import { useLocation } from "react-router-dom";

const TransactionPage = () => {
  const { currentUser, authService } = useAuth();
  const location = useLocation();

  const [filterType, setFilterType] = useState("all"); // 'all', 'debt', 'receivable'
  const [searchQuery, setSearchQuery] = useState("");
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

  // Tentukan filterType dari URL
  useEffect(() => {
    if (location.pathname.includes("/transactions/debt")) {
      setFilterType("debt");
    } else if (location.pathname.includes("/transactions/receivable")) {
      setFilterType("receivable");
    } else {
      setFilterType("all");
    }
  }, [location.pathname]);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!authService || !currentUser?.id) {
      setError("User belum tersedia.");
      setIsLoading(false);
      return;
    }

    try {
      const all = await authService.getTransactions(
        currentUser.id,
        filterType !== "all" ? filterType : null
      );

      const searched = all.filter((item) =>
        item.personName?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setTransactions(searched);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Gagal memuat data.");
      toast.error("Gagal memuat data.");
    } finally {
      setIsLoading(false);
    }
  }, [authService, currentUser, filterType, searchQuery]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleAdd = async (data) => {
    try {
      await authService.addTransaction({
        ...data,
        userId: currentUser.id,
        type: data.type || filterType,
      });
      toast.success("Berhasil ditambahkan!");
      fetchTransactions();
    } catch (error) {
      toast.error(`Gagal menambah data: ${error.message}`);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await authService.updateTransaction(editingData.id, {
        ...data,
        type: editingData.type || filterType,
      });
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <h1 className="text-xl font-bold">
          Daftar{" "}
          {filterType === "debt"
            ? "Utang"
            : filterType === "receivable"
            ? "Piutang"
            : "Transaksi"}
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Cari nama pihak..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={openAddForm}
            className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Tambah
          </button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : transactions.length === 0 ? (
        <p className="text-gray-600">Tidak ditemukan data.</p>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Pihak
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
                  <td className="px-4 py-2 flex items-center gap-1">
                    {item.type === "debt" ? (
                      <MinusCircle className="w-4 h-4 text-red-500" />
                    ) : (
                      <PlusCircle className="w-4 h-4 text-green-500" />
                    )}
                    <span>{formatRupiah(item.amount)}</span>
                  </td>
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
        <Modal isOpen={isFormOpen} onClose={closeForm}>
          <TransactionForm
            type={editingData?.type || filterType || "debt"}
            initialData={editingData || {}}
            onSubmit={editingData ? handleUpdate : handleAdd}
            onClose={closeForm}
          />
        </Modal>
      )}
    </div>
  );
};

export default TransactionPage;
