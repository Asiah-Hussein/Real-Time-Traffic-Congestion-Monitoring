import React from 'react';

const LoadingState = ({ message = 'Loading data...' }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-gray-500 text-center">{message}</p>
    </div>
  );
};

export default LoadingState;