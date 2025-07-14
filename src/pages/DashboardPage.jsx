// src/pages/DashboardPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import {
  CurrencyDollarIcon,
  ReceiptPercentIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DashboardPage = () => {
  const { currentUser, authService, isLoading: authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    totalDebts: 0,
    totalReceivables: 0,
    activeDebts: 0,
    activeReceivables: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const fetchDashboardData = useCallback(async () => {
    if (!currentUser || !currentUser.id || !authService || !authService.getDebts || !authService.getReceivables) {
      setIsLoading(false);
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
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Gagal memuat data dashboard.");
      toast.error("Gagal memuat data dashboard.");
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, authService]);

  useEffect(() => {
    if (!authLoading && currentUser) {
      fetchDashboardData();
    } else if (!authLoading && !currentUser) {
      setIsLoading(false);
      setError("User not logged in or user ID is missing.");
    }
  }, [authLoading, currentUser, fetchDashboardData]);

  if (authLoading || isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-red-600 dark:text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  const netBalance = dashboardData.totalReceivables - dashboardData.totalDebts;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Selamat datang kembali, {currentUser?.name || 'User'}
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">Saldo Bersih</p>
                <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatRupiah(netBalance)}
                </p>
              </div>
              {netBalance >= 0 ? (
                <ArrowTrendingUpIcon className="h-8 w-8 text-green-500" />
              ) : (
                <ArrowTrendingDownIcon className="h-8 w-8 text-red-500" />
              )}
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Utang Card */}
          <div className="group relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-800">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                  <ArrowTrendingDownIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Total Utang
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {formatRupiah(dashboardData.totalDebts)}
                </p>
                <div className="flex items-center space-x-2">
                  <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Perlu perhatian
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Total Piutang Card */}
          <div className="group relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-800">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <ArrowTrendingUpIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Total Piutang
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {formatRupiah(dashboardData.totalReceivables)}
                </p>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Pemasukan potensial
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Utang Aktif Card */}
          <div className="group relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-yellow-200 dark:hover:border-yellow-800">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                  <ClockIcon className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Utang Aktif
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {dashboardData.activeDebts}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Transaksi pending
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Piutang Aktif Card */}
          <div className="group relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <BanknotesIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Piutang Aktif
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {dashboardData.activeReceivables}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Menunggu pembayaran
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Balance Summary */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Ringkasan Keuangan
              </h3>
              <ChartBarIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Total Piutang</span>
                </div>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {formatRupiah(dashboardData.totalReceivables)}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Total Utang</span>
                </div>
                <span className="font-semibold text-red-600 dark:text-red-400">
                  {formatRupiah(dashboardData.totalDebts)}
                </span>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Saldo Bersih
                  </span>
                  <span className={`text-xl font-bold ${netBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatRupiah(netBalance)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Status */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Status Aktivitas
              </h3>
              <ReceiptPercentIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                  {dashboardData.activeDebts}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Utang Pending
                </div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {dashboardData.activeReceivables}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Piutang Pending
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
              <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                {dashboardData.activeDebts + dashboardData.activeReceivables === 0 
                  ? "Tidak ada transaksi pending" 
                  : `${dashboardData.activeDebts + dashboardData.activeReceivables} transaksi memerlukan tindak lanjut`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Analisis Keuangan
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <ChartBarIcon className="h-5 w-5" />
              <span>Segera Hadir</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full mb-4">
              <ChartBarIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Grafik Analisis
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Fitur visualisasi data utang dan piutang dalam bentuk grafik interaktif akan segera tersedia untuk membantu Anda menganalisis tren keuangan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;