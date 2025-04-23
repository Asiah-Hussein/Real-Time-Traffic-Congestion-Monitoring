import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorState = ({ message = 'Failed to load data', onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex flex-col items-center justify-center h-64">
      <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
      <p className="text-red-800 text-center mb-4">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;