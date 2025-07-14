// src/pages/DashboardPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import {
  CurrencyDollarIcon,
  CurrencyEuroIcon,
  ReceiptPercentIcon,
} from '@heroicons/react/24/outline'; // Sesuaikan ikon jika perlu
import LoadingSpinner from '../components/common/LoadingSpinner'; // Pastikan path benar

const DashboardPage = () => {
  const { currentUser, authService, isLoading: authLoading } = useAuth(); // Ambil authLoading
  const [dashboardData, setDashboardData] = useState({
    totalDebts: 0,
    totalReceivables: 0,
    activeDebts: 0,
    activeReceivables: 0,
  });
  const [isLoading, setIsLoading] = useState(true); // Loading untuk data dashboard
  const [error, setError] = useState(null);

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const fetchDashboardData = useCallback(async () => {
    // Pastikan currentUser dan authService tersedia sebelum melakukan fetch
    if (!currentUser || !currentUser.id || !authService || !authService.getDebts || !authService.getReceivables) {
      // Ini adalah kondisi yang menangani "User not logged in or user ID is missing."
      // Jika AuthContext masih memuat, kita tunggu. Jika user null, kita tidak fetch.
      setIsLoading(false); // Penting: set false agar tidak stuck di loading jika user null
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const debts = await authService.getDebts(currentUser.id);
      const receivables = await authService.getReceivables(currentUser.id);

      const totalDebts = debts.reduce((sum, debt) => sum + debt.amount, 0);
      const totalReceivables = receivables.reduce((sum, rec) => sum + rec.amount, 0);
      const activeDebts = debts.filter(debt => debt.status === 'pending').length;
      const activeReceivables = receivables.filter(rec => rec.status === 'pending').length;

      setDashboardData({
        totalDebts,
        totalReceivables,
        activeDebts,
        activeReceivables,
      });
      // toast.success("Data dashboard berhasil dimuat!"); // Opsional: notifikasi sukses
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Gagal memuat data dashboard.");
      toast.error("Gagal memuat data dashboard.");
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, authService]); // Dependencies untuk useCallback

  useEffect(() => {
    // Hanya fetch data dashboard jika AuthContext sudah selesai memuat (authLoading === false)
    // DAN currentUser sudah ada.
    if (!authLoading && currentUser) {
      fetchDashboardData();
    } else if (!authLoading && !currentUser) {
        // Jika authLoading selesai tapi currentUser null, berarti user memang tidak login.
        setIsLoading(false); // Pastikan state loading di DashboardPage juga false
        setError("User not logged in or user ID is missing."); // Tampilkan pesan ini di UI
    }
  }, [authLoading, currentUser, fetchDashboardData]); // Dependencies untuk useEffect

  // Tampilkan spinner jika AuthContext masih memuat ATAU data dashboard sedang dimuat
  if (authLoading || isLoading) {
    return <LoadingSpinner />;
  }

  // Tampilkan pesan error jika ada
  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-red-600 dark:text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Dashboard</h1>

      {/* Grid for key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Utang */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Utang</p>
            <p className="text-2xl font-semibold text-red-600 dark:text-red-400">{formatRupiah(dashboardData.totalDebts)}</p>
          </div>
          <CurrencyDollarIcon className="h-10 w-10 text-red-500 dark:text-red-400" />
        </div>

        {/* Total Piutang */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Piutang</p>
            <p className="text-2xl font-semibold text-green-600 dark:text-green-400">{formatRupiah(dashboardData.totalReceivables)}</p>
          </div>
          <CurrencyEuroIcon className="h-10 w-10 text-green-500 dark:text-green-400" />
        </div>

        {/* Utang Aktif */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Utang Aktif</p>
            <p className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400">{dashboardData.activeDebts}</p>
          </div>
          <ReceiptPercentIcon className="h-10 w-10 text-yellow-500 dark:text-yellow-400" />
        </div>

        {/* Piutang Aktif */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Piutang Aktif</p>
            <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">{dashboardData.activeReceivables}</p>
          </div>
          <ReceiptPercentIcon className="h-10 w-10 text-blue-500 dark:text-blue-400" />
        </div>
      </div>

      {/* Bagian untuk grafik atau daftar transaksi terbaru (belum diimplementasikan) */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Grafik Ringkasan (Segera Hadir)</h2>
        <p className="text-gray-600 dark:text-gray-300">Bagian ini akan menampilkan grafik utang dan piutang Anda.</p>
        <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-400 dark:text-gray-500 mt-4">
          Grafik akan muncul di sini
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;