// src/components/layout/Footer.jsx
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner p-4 text-center text-gray-600 dark:text-gray-400 text-sm">
      <p>&copy; {currentYear} DebtWise. All rights reserved.</p>
      <p>Dibuat dengan ❤️ di Bandung, Indonesia</p>
    </footer>
  );
};

export default Footer;