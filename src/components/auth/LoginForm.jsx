// src/components/auth/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../contexts/AuthContext'; 

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // Ambil fungsi login dari AuthContext
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password); 
      //toast.success('Login berhasil!');
      navigate('/dashboard');
      console.log('success')
    } catch (err) {
      // Error akan dilempar dari authService dan ditangkap di sini
      setError(err.message || 'Email atau password salah. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ... (input fields tetap sama) ... */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
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
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password Anda"
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm
                     focus:ring-primary-light focus:border-primary-light
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                     placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
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
        {loading ? 'Memuat...' : 'Login'}
      </button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        <a href="#" className="text-primary-light dark:text-primary-dark hover:underline">Lupa Password?</a>
      </p>
    </form>
  );
};

export default LoginForm;