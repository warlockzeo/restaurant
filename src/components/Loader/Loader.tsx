import React from 'react';

const Loader = ({ isLoading = true }: { isLoading?: boolean }) => {
  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-lg font-semibold text-gray-600'>Carregando...</div>
      </div>
    );
  }
  return null;
};

export default Loader;
