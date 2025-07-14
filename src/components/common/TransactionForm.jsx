// src/components/common/TransactionForm.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const TransactionForm = ({ type, initialData = {}, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    personName: '',
    amount: '',
    transactionDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    description: '',
    status: 'pending',
    category: 'Pribadi',
    paymentDate: '',
    proofUrl: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        personName: initialData.personName || '',
        amount: Number(initialData.amount) || '',
        transactionDate: initialData.transactionDate || new Date().toISOString().split('T')[0],
        dueDate: initialData.dueDate || '',
        description: initialData.description || '',
        status: initialData.status || 'pending',
        category: initialData.category || 'Pribadi',
        paymentDate: initialData.paymentDate || '',
        proofUrl: initialData.proofUrl || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;
    if (name === 'amount') {
      newValue = value === '' ? '' : Number(value);
      if (isNaN(newValue) && newValue !== '') {
        setErrors(prevErrors => ({ ...prevErrors, amount: 'Jumlah harus angka valid.' }));
      } else {
        setErrors(prevErrors => ({ ...prevErrors, amount: '' }));
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));

    if (errors[name] && name !== 'amount') {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.personName.trim()) {
      newErrors.personName = `${type === 'debt' ? 'Nama Pemberi Utang' : 'Nama Penerima Piutang'} tidak boleh kosong.`;
    }
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Jumlah harus angka positif.';
    }
    if (!formData.transactionDate) {
      newErrors.transactionDate = 'Tanggal transaksi tidak boleh kosong.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Mohon lengkapi semua bidang yang wajib diisi dan pastikan formatnya benar.");
      return;
    }

    try {
      const dataToSubmit = {
        ...formData,
        amount: Number(formData.amount),
      };
      if (isNaN(dataToSubmit.amount)) {
        toast.error("Jumlah yang dimasukkan tidak valid.");
        return;
      }

      await onSubmit(dataToSubmit);
      toast.success(`${type === 'debt' ? 'Utang' : 'Piutang'} berhasil disimpan!`);
      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(`Gagal menyimpan ${type === 'debt' ? 'utang' : 'piutang'}: ${error.message || 'Terjadi kesalahan.'}`);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 px-8 py-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white mb-2">
            {initialData.id ? 'Edit' : 'Tambah'} {type === 'debt' ? 'Utang' : 'Piutang'}
          </h2>
          <p className="text-blue-100 text-sm">
            {type === 'debt' ? 'Kelola data utang Anda' : 'Kelola data piutang Anda'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Person Name */}
          <div className="group">
            <label htmlFor="personName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {type === 'debt' ? 'Nama Pemberi Utang' : 'Nama Penerima Piutang'} *
            </label>
            <div className="relative">
              <input
                type="text"
                id="personName"
                name="personName"
                value={formData.personName}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 ${
                  errors.personName 
                    ? 'border-red-400 bg-red-50 dark:bg-red-900/20' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
                placeholder={type === 'debt' ? 'Masukkan nama pemberi utang...' : 'Masukkan nama penerima piutang...'}
                required
              />
              {errors.personName && (
                <div className="absolute -bottom-6 left-0 flex items-center text-red-500 text-xs">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.personName}
                </div>
              )}
            </div>
          </div>

          {/* Amount */}
          <div className="group">
            <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Jumlah/Nominal *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Rp</span>
              </div>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 ${
                  errors.amount 
                    ? 'border-red-400 bg-red-50 dark:bg-red-900/20' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
                placeholder="1,000,000"
                required
              />
              {formData.amount && (
                <div className="absolute -bottom-6 left-0 text-xs text-gray-500 dark:text-gray-400">
                  {formatCurrency(formData.amount)}
                </div>
              )}
              {errors.amount && (
                <div className="absolute -bottom-6 right-0 flex items-center text-red-500 text-xs">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.amount}
                </div>
              )}
            </div>
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Transaction Date */}
            <div className="group">
              <label htmlFor="transactionDate" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Tanggal Transaksi *
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="transactionDate"
                  name="transactionDate"
                  value={formData.transactionDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 ${
                    errors.transactionDate 
                      ? 'border-red-400 bg-red-50 dark:bg-red-900/20' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                  required
                />
                {errors.transactionDate && (
                  <div className="absolute -bottom-6 left-0 flex items-center text-red-500 text-xs">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.transactionDate}
                  </div>
                )}
              </div>
            </div>

            {/* Due Date */}
            <div className="group">
              <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Tanggal Jatuh Tempo
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Description */}
          <div className="group">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Deskripsi
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 resize-none"
              placeholder="Deskripsi singkat tentang transaksi ini..."
            />
          </div>

          {/* Status and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status */}
            <div className="group">
              <label htmlFor="status" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <div className="relative">
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 appearance-none"
                >
                  <option value="pending">Belum Lunas</option>
                  <option value="paid">Lunas</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="group">
              <label htmlFor="category" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Kategori
              </label>
              <div className="relative">
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 appearance-none"
                >
                  <option value="Pribadi">Pribadi</option>
                  <option value="Bisnis">Bisnis</option>
                  <option value="Keluarga">Keluarga</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Date (conditional) */}
          {formData.status === 'paid' && (
            <div className="group animate-fadeIn">
              <label htmlFor="paymentDate" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Tanggal Pembayaran/Penyelesaian
              </label>
              <input
                type="date"
                id="paymentDate"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          )}

          {/* Proof URL */}
          <div className="group">
            <label htmlFor="proofUrl" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              URL Bukti Transaksi
            </label>
            <input
              type="url"
              id="proofUrl"
              name="proofUrl"
              value={formData.proofUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              placeholder="https://example.com/bukti-transaksi.jpg"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-600">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-105 shadow-lg"
            >
              {initialData.id ? 'Update' : 'Simpan'} {type === 'debt' ? 'Utang' : 'Piutang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;