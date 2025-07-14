// src/services/authService.js
import api from './api'; // Import instance Axios yang sudah kita buat

// AuthService Object
const authService = {
  /**
   * Mendaftarkan pengguna baru.
   * @param {string} name - Nama pengguna.
   * @param {string} email - Email pengguna.
   * @param {string} password - Password pengguna.
   * @returns {Promise<Object>} Data respons dari server (misal: user data).
   */
  register: async (name, email, password) => {
    try {
      const response = await api.post('/users', { name, email, password, isVerified: true });
      return response.data;
    } catch (error) {
      console.error('Register failed:', error.response?.data || error.message, error);
      const message = error.response?.data?.message || 'Terjadi kesalahan saat pendaftaran.';
      throw new Error(message);
    }
  },

  /**
   * Melakukan login pengguna.
   * @param {string} email - Email pengguna.
   * @param {string} password - Password pengguna.
   * @returns {Promise<Object>} Data user.
   */
  login: async (email, password) => {
    try {
      const response = await api.get(`/users?email=${email}&password=${password}`);
      const user = response.data[0]; // Ambil user pertama yang cocok

      if (user) {
        const token = `dummy_jwt_token_for_user_id_${user.id}_${Date.now()}`;
        localStorage.setItem('token', token);   // <--- PENTING: Gunakan 'token'
        localStorage.setItem('userId', user.id); // <--- PENTING: Simpan userId
        return { ...user, id: user.id }; // Mengembalikan objek user lengkap
      } else {
        throw new Error('Email atau password salah.');
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message, error);
      const message = error.response?.data?.message || 'Email atau password salah.';
      throw new Error(message);
    }
  },

  /**
   * Melakukan logout pengguna.
   * Menghapus token dan userId dari localStorage.
   */
  logout: () => {
    localStorage.removeItem('token');   // <--- PENTING: Gunakan 'token'
    localStorage.removeItem('userId');  // <--- PENTING: Hapus juga userId
  },

  /**
   * Mendapatkan data user saat ini berdasarkan token dan userId dari localStorage.
   * @returns {Promise<Object>} Data user.
   */
  getCurrentUser: async () => {
    const token = localStorage.getItem('token');   // <--- PENTING: Ambil 'token'
    const userId = localStorage.getItem('userId'); // <--- PENTING: Ambil 'userId'

    if (!token || !userId) {
      return null;
    }

    try {
      const response = await api.get(`/users/${userId}`);
      const user = response.data;
      if (user) {
        return { ...user, id: user.id, isVerified: user.isVerified !== undefined ? user.isVerified : true };
      }
      console.error('User not found for token or ID. Returning null.');
      return null;
    } catch (error) {
      console.error('Failed to get current user:', error.response?.data || error.message, error);
      return null; // Biarkan AuthContext yang menangani logout jika ini gagal
    }
  },

  /**
   * Mengubah password pengguna (mock).
   * @param {string} currentPassword
   * @param {string} newPassword
   * @returns {Promise<Object>} Respons sukses (mock).
   */
  changePassword: async (currentPassword, newPassword) => { // 'currentPassword' sekarang digunakan
    try {
      console.log('Mocking change password for JSON Server. Received currentPassword:', currentPassword);
      console.log('New password:', newPassword);
      await new Promise(resolve => setTimeout(resolve, 500));
      return { message: 'Password berhasil diperbarui (mock).' };
    } catch (error) {
      console.error('Change password failed (mock):', error);
      throw new Error('Gagal memperbarui password (mock).');
    }
  },

  // --- Operasi CRUD untuk Utang ---
  getDebts: async (userId) => {
    try {
      const response = await api.get(`/debts?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching debts:', error.response?.data || error.message, error);
      throw new Error('Gagal mengambil data utang.');
    }
  },

  addDebt: async (debtData) => {
    try {
      const response = await api.post('/debts', debtData);
      return response.data;
    } catch (error) {
      console.error('Error adding debt:', error.response?.data || error.message, error);
      throw new Error('Gagal menambahkan utang.');
    }
  },

  updateDebt: async (id, debtData) => {
    try {
      const response = await api.put(`/debts/${id}`, debtData);
      return response.data;
    } catch (error) {
      console.error('Error updating debt:', error.response?.data || error.message, error);
      throw new Error('Gagal memperbarui utang.');
    }
  },

  deleteDebt: async (id) => {
    try {
      await api.delete(`/debts/${id}`);
      return { message: 'Utang berhasil dihapus.' };
    } catch (error) {
      console.error('Error deleting debt:', error.response?.data || error.message, error);
      throw new Error('Gagal menghapus utang.');
    }
  },

  // --- Operasi CRUD untuk Piutang ---
  getReceivables: async (userId) => {
    try {
      const response = await api.get(`/receivables?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching receivables:', error.response?.data || error.message, error);
      throw new Error('Gagal mengambil data piutang.');
    }
  },

  addReceivable: async (receivableData) => {
    try {
      const response = await api.post('/receivables', receivableData);
      return response.data;
    } catch (error) {
      console.error('Error adding receivable:', error.response?.data || error.message, error);
      throw new Error('Gagal menambahkan piutang.');
    }
  },

  updateReceivable: async (id, receivableData) => {
    try {
      const response = await api.put(`/receivables/${id}`, receivableData);
      return response.data;
    } catch (error) {
      console.error('Error updating receivable:', error.response?.data || error.message, error);
      throw new Error('Gagal memperbarui piutang.');
    }
  },

  deleteReceivable: async (id) => {
    try {
      await api.delete(`/receivables/${id}`);
      return { message: 'Piutang berhasil dihapus.' };
    } catch (error) {
      console.error('Error deleting receivable:', error.response?.data || error.message, error);
      throw new Error('Gagal menghapus piutang.');
    }
  },
};

export default authService; // <--- PENTING: Ekspor objek authService secara default