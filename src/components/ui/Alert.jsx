import React from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

const variants = {
  default: 'bg-gray-100 text-gray-800',
  error: 'bg-red-100 text-red-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  info: 'bg-blue-100 text-blue-800'
};

const icons = {
  default: Info,
  error: XCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info
};

export const Alert = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const Icon = icons[variant];

  return (
    <div
      role="alert"
      className={`flex items-center p-4 rounded-lg ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5 mr-3" />}
      {children}
    </div>
  );
};

export const AlertTitle = ({ children, className = '', ...props }) => (
  <h5 className={`font-medium mb-1 ${className}`} {...props}>
    {children}
  </h5>
);

export const AlertDescription = ({ children, className = '', ...props }) => (
  <div className={`text-sm ${className}`} {...props}>
    {children}
  </div>
);