'use client';

import { useEffect } from 'react';
import { Button } from './Button';

export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'default',
  showCloseButton = true,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isLoading = false
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'max-w-md';
      case 'lg':
        return 'max-w-4xl';
      case 'xl':
        return 'max-w-6xl';
      case 'full':
        return 'max-w-[90vw] h-[90vh]';
      default:
        return 'max-w-2xl';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-60 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative bg-gray-800 rounded-lg shadow-2xl ${getSizeClasses()} w-full mx-4 ${size === 'full' ? 'h-full' : 'max-h-[90vh]'} overflow-hidden border border-gray-700`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 className="text-lg font-medium text-white">
            {title}
          </h3>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Body */}
        <div className={`p-6 ${size === 'full' ? 'flex-1 overflow-auto' : 'max-h-[60vh] overflow-auto'} bg-gray-800`}>
          {children}
        </div>

        {/* Footer */}
        {(onConfirm || onCancel) && (
          <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-700 bg-gray-750">
            {onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                {cancelText}
              </Button>
            )}
            {onConfirm && (
              <Button
                onClick={onConfirm}
                isLoading={isLoading}
              >
                {confirmText}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};