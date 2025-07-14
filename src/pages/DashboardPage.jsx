// src/pages/DashboardPage.jsx
import React from 'react';

// Import komponen-komponen dashboard yang akan kita buat
import DebtSummaryCard from '../components/dashboard/DebtSummaryCard';
import ReceivableSummaryCard from '../components/dashboard/ReceivableSummaryCard';
import TransactionChart from '../components/dashboard/TransactionChart';

const DashboardPage = () => {
  // Data dummy untuk contoh
  const totalDebt = 1500000; // Rp 1.500.000
  const totalReceivable = 750000; // Rp 750.000
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
    debts: [300000, 200000, 400000, 100000, 500000, 250000],
    receivables: [150000, 100000, 200000, 300000, 100000, 200000],
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">Dashboard Utama</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300">Selamat datang kembali, [Nama User]!</p> {/* Nanti ganti dengan nama user asli */}

      {/* Ringkasan Utang dan Piutang */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DebtSummaryCard amount={totalDebt} />
        <ReceivableSummaryCard amount={totalReceivable} />
      </div>

      {/* Grafik Transaksi */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Grafik Utang & Piutang Bulanan</h2>
        <TransactionChart data={monthlyData} />
      </div>

      {/* Bagian lain seperti Transaksi Terbaru (akan dibuat komponennya nanti) */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Transaksi Terbaru</h2>
        <p className="text-gray-600 dark:text-gray-400">Daftar transaksi terbaru akan muncul di sini...</p>
        {/* Nanti diisi dengan komponen daftar transaksi */}
      </div>
    </div>
  );
};

export default DashboardPage;

