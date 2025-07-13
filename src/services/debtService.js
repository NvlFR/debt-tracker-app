// src/services/debtService.js
import api from './api'; // Menggunakan instance Axios yang sudah dikonfigurasi

const debtService = {
  /**
   * Mengambil semua daftar utang untuk pengguna yang login.
   * @returns {Promise<Array>} Array berisi objek utang.
   */
  getAllDebts: async () => {
    try {
      const response = await api.get('/debts'); // Contoh endpoint: /api/debts
      return response.data;
    } catch (error) {
      console.error('Failed to fetch debts:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Gagal mengambil data utang.' };
    }
  },

  /**
   * Menambahkan utang baru.
   * @param {Object} debtData - Objek yang berisi data utang (person, amount, dueDate, description).
   * @returns {Promise<Object>} Objek utang yang baru ditambahkan.
   */
  addDebt: async (debtData) => {
    try {
      const response = await api.post('/debts', debtData); // Contoh endpoint: /api/debts
      return response.data;
    } catch (error) {
      console.error('Failed to add debt:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Gagal menambahkan utang.' };
    }
  },

  /**
   * Mengupdate utang berdasarkan ID.
   * @param {string} id - ID utang yang akan diupdate.
   * @param {Object} updatedData - Objek yang berisi data utang yang diperbarui.
   * @returns {Promise<Object>} Objek utang yang sudah diperbarui.
   */
  updateDebt: async (id, updatedData) => {
    try {
      const response = await api.put(`/debts/${id}`, updatedData); // Contoh endpoint: /api/debts/:id
      return response.data;
    } catch (error) {
      console.error('Failed to update debt:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Gagal memperbarui utang.' };
    }
  },

  /**
   * Menghapus utang berdasarkan ID.
   * @param {string} id - ID utang yang akan dihapus.
   * @returns {Promise<Object>} Pesan sukses atau data konfirmasi.
   */
  deleteDebt: async (id) => {
    try {
      const response = await api.delete(`/debts/${id}`); // Contoh endpoint: /api/debts/:id
      return response.data;
    } catch (error) {
      console.error('Failed to delete debt:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Gagal menghapus utang.' };
    }
  },

  /**
   * Mengupdate status utang menjadi lunas.
   * @param {string} id - ID utang yang akan dilunasi.
   * @returns {Promise<Object>} Objek utang yang sudah diperbarui.
   */
  markDebtAsPaid: async (id) => {
    try {
      const response = await api.patch(`/debts/${id}/mark-paid`); // Contoh endpoint: /api/debts/:id/mark-paid
      return response.data;
    } catch (error) {
      console.error('Failed to mark debt as paid:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Gagal mengubah status utang menjadi lunas.' };
    }
  },
};

export default debtService;