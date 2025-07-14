// src/services/authService.js
import api from './api'; // Import instance Axios yang sudah kita buat

const authService = {
  /**
   * Mendaftarkan pengguna baru.
   * Untuk JSON Server, kita akan mempost ke /users
   * @param {string} name - Nama pengguna.
   * @param {string} email - Email pengguna.
   * @param {string} password - Password pengguna.
   * @returns {Promise<Object>} Data respons dari server (misal: user data).
   */
  register: async (name, email, password) => {
    try {
      // JSON Server secara otomatis akan menambahkan ID baru
      // Tambahkan isVerified secara default untuk JSON Server (sesuaikan jika ada verifikasi email sungguhan)
      const response = await api.post('/users', { name, email, password, isVerified: true });
      return response.data;
    } catch (error) {
      console.error('Register failed:', error.response?.data || error.message, error); // Tambahkan 'error' objek lengkap
      const message = error.response?.data?.message || 'Terjadi kesalahan saat pendaftaran.';
      throw new Error(message); // Lempar Error object
    }
  },

  /**
   * Melakukan login pengguna.
   * Untuk JSON Server, kita akan mencari user di /users dan mem-mock token.
   * @param {string} email - Email pengguna.
   * @param {string} password - Password pengguna.
   * @returns {Promise<Object>} Data respons dummy (misal: user data, token dummy).
   */
  login: async (email, password) => {
    try {
      // Di dunia nyata, ini akan menjadi POST ke /auth/login di backend.
      // Dengan JSON Server, kita akan simulasi mencari user.
      const response = await api.get(`/users?email=${email}&password=${password}`);
      const user = response.data[0]; // Ambil user pertama yang cocok

      if (user) {
        // Jika user ditemukan, simulasikan login berhasil
        // Gunakan user.id di token agar getCurrentUser bisa mengambilnya kembali
        const dummyToken = `dummy_jwt_token_for_user_id_${user.id}_${Date.now()}`;
        localStorage.setItem('userToken', dummyToken);
        // Kembalikan data user dan token dummy
        return { token: dummyToken, user: { ...user, id: user.id } };
      } else {
        // Jika user tidak ditemukan
        throw new Error('Email atau password salah.'); // Lempar Error object
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message, error);
      const message = error.response?.data?.message || 'Email atau password salah.';
      throw new Error(message); // Lempar Error object
    }
  },

  /**
   * Melakukan logout pengguna.
   * Menghapus token dari localStorage.
   */
  logout: () => {
    localStorage.removeItem('userToken');
    // Tidak ada panggilan API ke JSON Server untuk logout karena tidak relevan di sini
  },

  /**
   * Mendapatkan data user saat ini berdasarkan token dummy dari localStorage.
   * Untuk JSON Server, kita akan mengambil data user dari db.json berdasarkan ID yang di-mock dari token.
   * @returns {Promise<Object>} Data user.
   */
  getCurrentUser: async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      return null;
    }

    // Ekstrak ID user dari token dummy (misal: token_for_user_id_123_timestamp -> ID 123)
    const userIdMatch = token.match(/_user_id_(\d+)_/); // Sesuaikan regex agar lebih spesifik
    if (!userIdMatch || !userIdMatch[1]) {
      console.error('Invalid dummy token format. Logging out.');
      authService.logout(); // Paksa logout jika format token tidak valid
      return null;
    }
    const userId = parseInt(userIdMatch[1], 10);

    try {
      // Dengan JSON Server, kita langsung GET user berdasarkan ID
      const response = await api.get(`/users/${userId}`);
      const user = response.data;
      if (user) {
        // Pastikan user memiliki properti `id` dan `isVerified`
        // Jika isVerified tidak ada dari db.json, berikan default (misal: true atau false)
        return { ...user, id: user.id, isVerified: user.isVerified !== undefined ? user.isVerified : true };
      }
      // Jika user tidak ditemukan di JSON Server (meskipun ada token)
      console.error('User not found for token. Logging out.');
      authService.logout();
      return null;
    } catch (error) {
      console.error('Failed to get current user:', error.response?.data || error.message, error);
      // Jika ada error (misal 404 dari JSON Server jika ID tidak ada), paksa logout
      authService.logout();
      return null;
    }
  },

  /**
   * Mengubah password pengguna (mock).
   * @param {string} currentPassword
   * @param {string} newPassword
   * @returns {Promise<Object>} Respons sukses (mock).
   */
  changePassword: async (currentPassword, newPassword) => {
    // Di aplikasi nyata, Anda akan memanggil endpoint API backend di sini.
    // Untuk JSON Server, ini hanyalah mock.
    try {
      console.log('Mocking change password for JSON Server. Received currentPassword:', currentPassword);
      console.log('New password:', newPassword);
      // Simulasikan penundaan API
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
      // Filter berdasarkan userId jika diperlukan, atau ambil semua jika admin
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

export default authService;