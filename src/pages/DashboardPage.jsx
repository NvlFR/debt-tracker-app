import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner from "../components/common/LoadingSpinner";

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

  const formatRupiah = (amount) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const fetchDashboardData = useCallback(async () => {
    if (!currentUser || !currentUser.id || !authService?.getTransactions) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const transactions = await authService.getTransactions(currentUser.id);

      const debts = transactions.filter((t) => t.type === "debt");
      const receivables = transactions.filter((t) => t.type === "receivable");

      const totalDebts = debts.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      );
      const totalReceivables = receivables.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      );

      const activeDebts = debts.filter(
        (item) => item.status === "pending"
      ).length;
      const activeReceivables = receivables.filter(
        (item) => item.status === "pending"
      ).length;

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
      setError("User tidak ditemukan.");
    }
  }, [authLoading, currentUser, fetchDashboardData]);

  if (authLoading || isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  const netBalance = dashboardData.totalReceivables - dashboardData.totalDebts;
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Selamat datang kembali, {currentUser?.name || "User"}
          </p>
        </div>

        {/* Net Balance Card */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Saldo Bersih
                </p>
                <p
                  className={`text-2xl sm:text-3xl font-bold ${
                    netBalance >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {formatRupiah(netBalance)}
                </p>
              </div>
              <div className="flex items-center">
                {netBalance >= 0 ? (
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <ArrowTrendingUpIcon className="h-6 w-6 mr-1" />
                    <span className="text-sm font-medium">Positif</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600 dark:text-red-400">
                    <ArrowTrendingDownIcon className="h-6 w-6 mr-1" />
                    <span className="text-sm font-medium">Negatif</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {/* Total Debts Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-rose-50 dark:bg-rose-900/10 rounded-lg">
                <ArrowTrendingDownIcon className="h-5 w-5 text-rose-600 dark:text-rose-400" />
              </div>
              <ExclamationTriangleIcon className="h-4 w-4 text-rose-500" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Total Utang
            </p>
            <p className="text-xl font-bold text-rose-600 dark:text-rose-400">
              {formatRupiah(dashboardData.totalDebts)}
            </p>
          </div>

          {/* Total Receivables Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg">
                <ArrowTrendingUpIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Total Piutang
            </p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatRupiah(dashboardData.totalReceivables)}
            </p>
          </div>

          {/* Active Debts Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-50 dark:bg-amber-900/10 rounded-lg">
                <ClockIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Utang Aktif
            </p>
            <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
              {dashboardData.activeDebts}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Transaksi pending
            </p>
          </div>

          {/* Active Receivables Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-sky-50 dark:bg-sky-900/10 rounded-lg">
                <BanknotesIcon className="h-5 w-5 text-sky-600 dark:text-sky-400" />
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Piutang Aktif
            </p>
            <p className="text-xl font-bold text-sky-600 dark:text-sky-400">
              {dashboardData.activeReceivables}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Menunggu pembayaran
            </p>
          </div>
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Financial Summary */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Ringkasan Keuangan
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    Piutang
                  </span>
                </div>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatRupiah(dashboardData.totalReceivables)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-rose-500 rounded-full mr-3"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    Utang
                  </span>
                </div>
                <span className="font-semibold text-rose-600 dark:text-rose-400">
                  {formatRupiah(dashboardData.totalDebts)}
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Saldo Bersih
                  </span>
                  <span
                    className={`font-bold ${
                      netBalance >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {formatRupiah(netBalance)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Status */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Status Aktivitas
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-1">
                  {dashboardData.activeDebts}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Utang Pending
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-sky-600 dark:text-sky-400 mb-1">
                  {dashboardData.activeReceivables}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Piutang Pending
                </div>
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {dashboardData.activeDebts + dashboardData.activeReceivables ===
                0
                  ? "Tidak ada transaksi pending"
                  : `${
                      dashboardData.activeDebts +
                      dashboardData.activeReceivables
                    } transaksi memerlukan tindak lanjut`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
