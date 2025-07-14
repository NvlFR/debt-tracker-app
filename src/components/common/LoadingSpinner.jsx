import React from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline'; // Atau ikon spinner lainnya

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <ArrowPathIcon className="h-10 w-10 animate-spin text-primary-light" />
    </div>
  );
};

export default LoadingSpinner;