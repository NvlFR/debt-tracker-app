// src/services/authService.js
import api from './api'; // Import instance Axios yang sudah kita buat

const authService = {
  /**
   * Mendaftarkan pengguna baru.
   * @param {string} name - Nama pengguna.
   * @param {string} email - Email pengguna.
   * @param {string} password - Password pengguna.
   * @returns {Promise<Object>} Data respons dari server (misal: user data, token).
   */
  register: async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      // Setelah register, biasanya langsung login atau redirect ke halaman login
      // Jika backend langsung mengembalikan token, bisa disimpan di sini
      // localStorage.setItem('userToken', response.data.token);
      return response.data;
    } catch (error) {
      // Tangani error spesifik dari backend (misal: email sudah terdaftar)
      console.error('Register failed:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Terjadi kesalahan saat pendaftaran.' };
    }
  },

  /**
   * Melakukan login pengguna.
   * @param {string} email - Email pengguna.
   * @param {string} password - Password pengguna.
   * @returns {Promise<Object>} Data respons dari server (misal: user data, token).
   */
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      // Asumsi backend mengembalikan { token: '...', user: { ... } }
      localStorage.setItem('userToken', response.data.token);
      return response.data; // Mengembalikan data user dan token
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Email atau password salah.' };
    }
  },

  /**
   * Melakukan logout pengguna.
   * Menghapus token dari localStorage.
   */
  logout: () => {
    localStorage.removeItem('userToken');
    // Mungkin ada endpoint logout di backend juga untuk invalidasi sesi
    // try {
    //   await api.post('/auth/logout');
    // } catch (error) {
    //   console.error('Logout API error:', error);
    // }
  },

  /**
   * Mendapatkan data user saat ini berdasarkan token.
   * @returns {Promise<Object>} Data user.
   */
  getCurrentUser: async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      return null;
    }
    try {
      // Endpoint ini diasumsikan membutuhkan otentikasi (token di header)
      const response = await api.get('/auth/me'); // Contoh endpoint untuk mendapatkan data user saat ini
      return response.data;
    } catch (error) {
      console.error('Failed to get current user:', error.response?.data || error.message);
      // Jika token tidak valid atau expired, paksa logout
      if (error.response?.status === 401) {
        authService.logout(); // Hapus token
        // Tidak perlu redirect di sini, biarkan AuthProvider yang menanganinya
      }
      throw error.response?.data || { message: 'Gagal mendapatkan data pengguna.' };
    }
  },

  /**
   * Mengubah password pengguna.
   * @param {string} currentPassword
   * @param {string} newPassword
   * @returns {Promise<Object>} Respons sukses.
   */
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/auth/change-password', { currentPassword, newPassword });
      return response.data;
    } catch (error) {
      console.error('Change password failed:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Gagal memperbarui password.' };
    }
  },

  // Tambahkan fungsi lain yang berkaitan dengan otentikasi/otorisasi
};

export default authService;