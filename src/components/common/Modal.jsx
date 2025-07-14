// src/components/common/Modal.jsx
import React, { useEffect } from 'react';

const Modal = ({ children, onClose }) => {
  // Menangani penekanan tombol Escape untuk menutup modal
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    // Cleanup event listener saat komponen di-unmount
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]); // Dependensi onClose agar useEffect re-run jika onClose berubah

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose} // Menutup modal saat mengklik di luar konten
    >
      <div
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-lg w-full m-4 relative"
        onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam modal menutup modal
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold"
          aria-label="Tutup modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;