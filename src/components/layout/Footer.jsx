import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            © 2024 Traffic Monitoring System
          </p>
          <div className="flex items-center space-x-4">
            <a href="#about" className="text-sm text-gray-600 hover:text-gray-900">
              About
            </a>
            <a href="#help" className="text-sm text-gray-600 hover:text-gray-900">
              Help
            </a>
            <a href="#contact" className="text-sm text-gray-600 hover:text-gray-900">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;