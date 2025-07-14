// src/components/common/TransactionForm.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const TransactionForm = ({ type, initialData = {}, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    personName: '',
    amount: '', // Ini akan diisi angka
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
        // <--- PENTING: Pastikan initialData.amount juga dikonversi menjadi Number
        // Karena data dari db.json bisa saja masih string jika sudah ada yang tersimpan string sebelumnya
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

    // <--- PENTING: Tambahkan logika konversi untuk 'amount'
    let newValue = value;
    if (name === 'amount') {
      // Konversi ke number. Jika input kosong, biarkan kosong string untuk validasi
      newValue = value === '' ? '' : Number(value);
      // Anda juga bisa menambahkan validasi di sini untuk NaN
      if (isNaN(newValue) && newValue !== '') {
        setErrors(prevErrors => ({ ...prevErrors, amount: 'Jumlah harus angka valid.' }));
      } else {
        setErrors(prevErrors => ({ ...prevErrors, amount: '' })); // Hapus error jika valid
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue, // Gunakan newValue yang sudah dikonversi
    }));

    // Clear error for the field being changed (jika bukan amount, atau amount sudah valid)
    if (errors[name] && name !== 'amount') { // Hindari menghapus error amount prematur
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.personName.trim()) {
      newErrors.personName = `${type === 'debt' ? 'Nama Pemberi Utang' : 'Nama Penerima Piutang'} tidak boleh kosong.`;
    }
    // Pastikan amount adalah angka dan positif
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
      // Saat submit, kita pastikan lagi amount adalah angka
      const dataToSubmit = {
        ...formData,
        amount: Number(formData.amount), // Konversi akhir sebelum dikirim
      };
      if (isNaN(dataToSubmit.amount)) { // Double-check for safety
        toast.error("Jumlah yang dimasukkan tidak valid.");
        return;
      }

      await onSubmit(dataToSubmit); // Kirim data yang sudah divalidasi dan dikonversi
      toast.success(`${type === 'debt' ? 'Utang' : 'Piutang'} berhasil disimpan!`);
      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(`Gagal menyimpan ${type === 'debt' ? 'utang' : 'piutang'}: ${error.message || 'Terjadi kesalahan.'}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {initialData.id ? 'Edit' : 'Tambah'} {type === 'debt' ? 'Utang' : 'Piutang'}
      </h2>

      {/* Person Name */}
      <div className="mb-4">
        <label htmlFor="personName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Pihaknya
        </label>
        <input
          type="text"
          id="personName"
          name="personName"
          value={formData.personName}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-light focus:ring focus:ring-primary-light focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${
            errors.personName ? 'border-red-500' : ''
          }`}
          placeholder={type === 'debt' ? 'Nama Pemberi Utang' : 'Nama Penerima Piutang'}
          required
        />
        {errors.personName && <p className="text-red-500 text-xs mt-1">{errors.personName}</p>}
      </div>

      {/* Amount */}
      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Jumlah/Nominal (Rp)
        </label>
        <input
          type="number" // Tetap type="number" untuk UI
          id="amount"
          name="amount"
          value={formData.amount} // Ini akan menjadi angka atau string kosong
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-light focus:ring focus:ring-primary-light focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${
            errors.amount ? 'border-red-500' : ''
          }`}
          placeholder="e.g., 1000000"
          required
        />
        {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
      </div>

      {/* Transaction Date */}
      <div className="mb-4">
        <label htmlFor="transactionDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tanggal Transaksi
        </label>
        <input
          type="date"
          id="transactionDate"
          name="transactionDate"
          value={formData.transactionDate}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-light focus:ring focus:ring-primary-light focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${
            errors.transactionDate ? 'border-red-500' : ''
          }`}
          required
        />
        {errors.transactionDate && <p className="text-red-500 text-xs mt-1">{errors.transactionDate}</p>}
      </div>

      {/* Due Date (Optional) */}
      <div className="mb-4">
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tanggal Jatuh Tempo (Opsional)
        </label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-light focus:ring focus:ring-primary-light focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Deskripsi
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-light focus:ring focus:ring-primary-light focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          placeholder="Deskripsi singkat tentang transaksi ini"
        ></textarea>
      </div>

      {/* Status */}
      <div className="mb-4">
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-light focus:ring focus:ring-primary-light focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        >
          <option value="pending">Belum Lunas</option>
          <option value="paid">Lunas</option>
        </select>
      </div>

      {/* Category */}
      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Kategori
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-light focus:ring focus:ring-primary-light focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        >
          <option value="Pribadi">Pribadi</option>
          <option value="Bisnis">Bisnis</option>
          <option value="Keluarga">Keluarga</option>
          <option value="Lainnya">Lainnya</option>
        </select>
      </div>

      {/* Payment Date (only if status is 'paid') */}
      {formData.status === 'paid' && (
        <div className="mb-4">
          <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tanggal Pembayaran/Penyelesaian (Jika sudah lunas)
          </label>
          <input
            type="date"
            id="paymentDate"
            name="paymentDate"
            value={formData.paymentDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-light focus:ring focus:ring-primary-light focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
        </div>
      )}

      {/* Proof URL (Optional) */}
      <div className="mb-4">
        <label htmlFor="proofUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          URL Bukti Transaksi (Opsional)
        </label>
        <input
          type="text"
          id="proofUrl"
          name="proofUrl"
          value={formData.proofUrl}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-light focus:ring focus:ring-primary-light focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          placeholder="URL gambar bukti pembayaran, dll."
        />
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200"
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-light text-white rounded-md hover:bg-primary-dark transition duration-200"
        >
          Simpan
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;