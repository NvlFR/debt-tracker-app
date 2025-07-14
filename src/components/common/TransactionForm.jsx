// src/components/common/TransactionForm.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/outline'; // Pastikan XMarkIcon diimport

const TransactionForm = ({ type, initialData = {}, onSubmit, onClose }) => {
  // 'type' bisa 'debt' atau 'receivable'
  // 'initialData' akan digunakan untuk mode edit
  // 'onSubmit' adalah fungsi yang akan dipanggil saat form disubmit
  // 'onClose' adalah fungsi untuk menutup form/modal

  // Fungsi utilitas untuk memformat tanggal ke YYYY-MM-DD
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      // Pastikan date valid sebelum memformat
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string provided:', dateString);
        return '';
      }
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return '';
    }
  };

  // Inisialisasi state dengan nilai default yang aman
  // Ini akan menjadi state default untuk mode "tambah baru"
  const [formData, setFormData] = useState({
    personName: '',
    amount: '',
    transactionDate: formatDateForInput(new Date()), // Default ke tanggal hari ini
    dueDate: '',
    description: '',
    status: 'pending', // Default status
    category: 'pribadi', // Default category
    proofUrl: '',
    paymentDate: '',
    reminderDate: '',
    // userId akan ditambahkan di parent component (DebtPage/ReceivablePage) saat submit
  });

  const [isLoading, setIsLoading] = useState(false);

  // isEditMode harus dihitung berdasarkan apakah initialData memiliki ID
  // Atau properti unik lain yang menandakan itu adalah data yang sudah ada
  const isEditMode = initialData && initialData.id;
  const formTitle = isEditMode
    ? `Edit ${type === 'debt' ? 'Utang' : 'Piutang'}`
    : `Tambah ${type === 'debt' ? 'Utang' : 'Piutang'}`;
  const submitButtonText = isEditMode ? 'Simpan Perubahan' : 'Tambah';

  // useEffect untuk mempopulasi form ketika initialData berubah (misal, saat masuk mode edit)
  useEffect(() => {
    if (isEditMode) {
      // Ketika di mode edit, kita mengisi formData dengan initialData yang ada.
      // Pastikan semua nilai yang mungkin undefined dari initialData diisi dengan string kosong
      // dan format tanggal yang sesuai.
      setFormData({
        personName: initialData.personName || '',
        amount: initialData.amount !== undefined && initialData.amount !== null ? String(initialData.amount) : '',
        transactionDate: formatDateForInput(initialData.transactionDate),
        dueDate: formatDateForInput(initialData.dueDate),
        description: initialData.description || '',
        status: initialData.status || 'pending', // Pastikan default jika initialData.status kosong
        category: initialData.category || 'pribadi', // Pastikan default jika initialData.category kosong
        proofUrl: initialData.proofUrl || '',
        paymentDate: formatDateForInput(initialData.paymentDate),
        reminderDate: formatDateForInput(initialData.reminderDate),
        // userId tidak perlu diatur di sini karena akan ditambahkan saat onSubmit di parent
        // atau sudah ada di initialData jika datang dari fetched data
        // Jika Anda ingin mempertahankan ID dari initialData, tambahkan:
        id: initialData.id || undefined, // Penting untuk update
      });
    } else {
      // Reset form ke nilai default jika keluar dari mode edit atau beralih ke mode tambah
      setFormData({
        personName: '',
        amount: '',
        transactionDate: formatDateForInput(new Date()), // Default ke tanggal hari ini
        dueDate: '',
        description: '',
        status: 'pending',
        category: 'pribadi',
        proofUrl: '',
        paymentDate: '',
        reminderDate: '',
      });
    }
  }, [initialData, isEditMode]); // Dependensi: hanya jalankan jika initialData atau isEditMode berubah

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dataToSubmit = { ...formData };

      // Konversi amount ke number, pastikan itu string numerik valid
      dataToSubmit.amount = parseFloat(formData.amount) || 0; // Default ke 0 jika gagal konversi

      // Hapus kolom yang tidak relevan jika nilainya kosong atau tidak dibutuhkan saat submit
      // Ini juga membantu JSON Server tidak menyimpan field kosong yang tidak perlu
      if (!dataToSubmit.proofUrl) delete dataToSubmit.proofUrl;
      if (!dataToSubmit.paymentDate) delete dataToSubmit.paymentDate;
      if (!dataToSubmit.reminderDate) delete dataToSubmit.reminderDate;
      if (!dataToSubmit.dueDate) delete dataToSubmit.dueDate;
      if (!dataToSubmit.description) delete dataToSubmit.description;
      if (!dataToSubmit.category) delete dataToSubmit.category; // Meskipun ada default, kalau kosong dari user hapus

      await onSubmit(dataToSubmit); // Panggil fungsi onSubmit dari parent
      // Toast message ini sudah ditangani di parent (DebtPage/ReceivablePage)
      // Menghapus toast di sini untuk menghindari duplikasi
      // toast.success(`${type === 'debt' ? 'Utang' : 'Piutang'} berhasil ${isEditMode ? 'diperbarui' : 'ditambahkan'}!`);
      onClose(); // Tutup form setelah sukses
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(error.message || `Gagal ${isEditMode ? 'memperbarui' : 'menambahkan'} ${type === 'debt' ? 'utang' : 'piutang'}.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Pilihan status
  const statuses = [
    { value: 'pending', label: 'Belum Lunas' },
    { value: 'paid', label: 'Lunas' },
    { value: 'overdue', label: 'Jatuh Tempo' }, // Status ini biasanya ditentukan secara otomatis berdasarkan tanggal
  ];

  // Pilihan kategori
  const categories = [
    { value: 'pribadi', label: 'Pribadi' },
    { value: 'bisnis', label: 'Bisnis' },
    { value: 'pinjaman', label: 'Pinjaman' },
    { value: 'pembelian', label: 'Pembelian' },
    { value: 'gaji', label: 'Gaji' },
    { value: 'sewa', label: 'Sewa' },
    { value: 'lainnya', label: 'Lainnya' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg mx-auto relative"> {/* Tambahkan relative */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <XMarkIcon className="h-6 w-6" />
      </button>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">{formTitle}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Pihaknya */}
        <div>
          <label htmlFor="personName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Pihaknya
          </label>
          <input
            type="text"
            id="personName"
            name="personName"
            value={formData.personName}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-light focus:ring-primary-light dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>

        {/* Jumlah/Nominal */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Jumlah/Nominal (Rp)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="0"
            step="any"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-light focus:ring-primary-light dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>

        {/* Tanggal Utang/Piutang (Transaction Date) */}
        <div>
          <label htmlFor="transactionDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tanggal {type === 'debt' ? 'Utang' : 'Piutang'}
          </label>
          <input
            type="date"
            id="transactionDate"
            name="transactionDate"
            value={formData.transactionDate}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-light focus:ring-primary-light dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>

        {/* Tanggal Jatuh Tempo */}
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tanggal Jatuh Tempo
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-light focus:ring-primary-light dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Deskripsi
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-light focus:ring-primary-light dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          ></textarea>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-light focus:ring-primary-light dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Jenis Transaksi/Kategori */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Kategori
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-light focus:ring-primary-light dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tanggal Pembayaran/Penyelesaian */}
        <div>
          <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tanggal Pembayaran/Penyelesaian (jika sudah lunas)
          </label>
          <input
            type="date"
            id="paymentDate"
            name="paymentDate"
            value={formData.paymentDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-light focus:ring-primary-light dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>

        {/* Reminder Date */}
        <div>
          <label htmlFor="reminderDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tanggal Pengingat
          </label>
          <input
            type="date"
            id="reminderDate"
            name="reminderDate"
            value={formData.reminderDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-light focus:ring-primary-light dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>

        {/* Proof URL (Opsional) */}
        <div>
          <label htmlFor="proofUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            URL Bukti Transaksi (Opsional)
          </label>
          <input
            type="url"
            id="proofUrl"
            name="proofUrl"
            value={formData.proofUrl}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-light focus:ring-primary-light dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            disabled={isLoading}
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium rounded-md text-white bg-primary-light hover:bg-primary-dark transition-colors duration-200 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <ArrowPathIcon className="h-5 w-5 animate-spin mr-2" />
            ) : null}
            {submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;