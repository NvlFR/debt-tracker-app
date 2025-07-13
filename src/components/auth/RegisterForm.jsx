// src/components/auth/RegisterForm.jsx
import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // Tidak perlu lagi useNavigate di sini
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Untuk pesan sukses register
  const [loading, setLoading] = useState(false);
  const { register } = useAuth(); // Ambil fungsi register dari AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      setLoading(false);
      return;
    }

    try {
      await register(name, email, password); // Panggil fungsi register dari context
      setSuccessMessage('Pendaftaran berhasil! Silakan login.');
      // Reset form setelah sukses
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat pendaftaran. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ... (input fields tetap sama) ... */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nama Lengkap
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama Anda"
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm
                     focus:ring-primary-light focus:border-primary-light
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                     placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>

      <div>
        <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email
        </label>
        <input
          type="email"
          id="register-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@example.com"
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm
                     focus:ring-primary-light focus:border-primary-light
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                     placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>

      <div>
        <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Password
        </label>
        <input
          type="password"
          id="register-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minimal 6 karakter"
          required
          minLength="6"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm
                     focus:ring-primary-light focus:border-primary-light
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                     placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>

      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Konfirmasi Password
        </label>
        <input
          type="password"
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Ulangi password Anda"
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm
                     focus:ring-primary-light focus:border-primary-light
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}
      {successMessage && (
        <p className="text-green-500 text-sm text-center">{successMessage}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full px-4 py-2 rounded-md text-white font-semibold
                   ${loading ? 'bg-primary-light opacity-70 cursor-not-allowed' : 'bg-primary-light hover:bg-primary-dark'}
                   dark:bg-primary-dark dark:hover:bg-secondary-dark
                   shadow-md hover:shadow-lg
                   transition-all duration-200`}
      >
        {loading ? 'Mendaftar...' : 'Daftar'}
      </button>
    </form>
  );
};

export default RegisterForm;