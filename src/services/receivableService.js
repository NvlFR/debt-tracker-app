// src/services/receivableService.js
import api from './api'; // Menggunakan instance Axios yang sudah dikonfigurasi

const receivableService = {
  /**
   * Mengambil semua daftar piutang untuk pengguna yang login.
   * @returns {Promise<Array>} Array berisi objek piutang.
   */
  getAllReceivables: async () => {
    try {
      const response = await api.get('/receivables'); // Contoh endpoint: /api/receivables
      return response.data;
    } catch (error) {
      console.error('Failed to fetch receivables:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Gagal mengambil data piutang.' };
    }
  },

  /**
   * Menambahkan piutang baru.
   * @param {Object} receivableData - Objek yang berisi data piutang.
   * @returns {Promise<Object>} Objek piutang yang baru ditambahkan.
   */
  addReceivable: async (receivableData) => {
    try {
      const response = await api.post('/receivables', receivableData); // Contoh endpoint: /api/receivables
      return response.data;
    } catch (error) {
      console.error('Failed to add receivable:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Gagal menambahkan piutang.' };
    }
  },

  /**
   * Mengupdate piutang berdasarkan ID.
   * @param {string} id - ID piutang yang akan diupdate.
   * @param {Object} updatedData - Objek yang berisi data piutang yang diperbarui.
   * @returns {Promise<Object>} Objek piutang yang sudah diperbarui.
   */
  updateReceivable: async (id, updatedData) => {
    try {
      const response = await api.put(`/receivables/${id}`, updatedData); // Contoh endpoint: /api/receivables/:id
      return response.data;
    } catch (error) {
      console.error('Failed to update receivable:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Gagal memperbarui piutang.' };
    }
  },

  /**
   * Menghapus piutang berdasarkan ID.
   * @param {string} id - ID piutang yang akan dihapus.
   * @returns {Promise<Object>} Pesan sukses atau data konfirmasi.
   */
  deleteReceivable: async (id) => {
    try {
      const response = await api.delete(`/receivables/${id}`); // Contoh endpoint: /api/receivables/:id
      return response.data;
    } catch (error) {
      console.error('Failed to delete receivable:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Gagal menghapus piutang.' };
    }
  },

  /**
   * Mengupdate status piutang menjadi lunas.
   * @param {string} id - ID piutang yang akan dilunasi.
   * @returns {Promise<Object>} Objek piutang yang sudah diperbarui.
   */
  markReceivableAsPaid: async (id) => {
    try {
      const response = await api.patch(`/receivables/${id}/mark-paid`); // Contoh endpoint: /api/receivables/:id/mark-paid
      return response.data;
    } catch (error) {
      console.error('Failed to mark receivable as paid:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Gagal mengubah status piutang menjadi lunas.' };
    }
  },
};

export default receivableService;