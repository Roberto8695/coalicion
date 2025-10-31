'use client';

import { useState, useRef } from 'react';
import { Button } from './Button';

interface FileUploadProps {
  label: string;
  accept?: string;
  maxSize?: number; // en MB
  onFileSelect: (file: File) => void;
  onUpload?: (file: File) => Promise<any>;
  preview?: boolean;
  disabled?: boolean;
  helperText?: string;
  className?: string;
  multiple?: boolean;
}

export const FileUpload = ({
  label,
  accept = "*/*",
  maxSize = 10,
  onFileSelect,
  onUpload,
  preview = true,
  disabled = false,
  helperText,
  className = "",
  multiple = false
}: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): boolean => {
    setError('');

    // Validar tamaño
    if (file.size > maxSize * 1024 * 1024) {
      setError(`El archivo es demasiado grande. Máximo permitido: ${maxSize}MB`);
      return false;
    }

    // Validar tipo si se especifica
    if (accept !== "*/*") {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const isValidType = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        return file.type.match(type.replace('*', '.*'));
      });

      if (!isValidType) {
        setError(`Tipo de archivo no permitido. Tipos aceptados: ${accept}`);
        return false;
      }
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (!validateFile(file)) return;

    setSelectedFile(file);
    setUploadedUrl('');
    setError('');
    onFileSelect(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !onUpload) return;

    try {
      setUploading(true);
      setError('');
      
      const result = await onUpload(selectedFile);
      
      if (result.success) {
        setUploadedUrl(result.data.url);
      } else {
        setError(result.message || 'Error al subir el archivo');
      }
    } catch (err: any) {
      setError(err.message || 'Error al subir el archivo');
    } finally {
      setUploading(false);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const clearFile = () => {
    setSelectedFile(null);
    setUploadedUrl('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    
    switch (ext) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'ppt':
      case 'pptx':
        return '📽️';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
        return '🖼️';
      case 'mp4':
      case 'avi':
      case 'mov':
        return '🎥';
      case 'mp3':
      case 'wav':
        return '🎵';
      default:
        return '📁';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-300">
        {label}
      </label>

      {/* Área de drop */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
          ${dragOver 
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-600 hover:border-gray-500'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!disabled ? openFileDialog : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          disabled={disabled}
          multiple={multiple}
          className="hidden"
        />

        {selectedFile ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">{getFileIcon(selectedFile.name)}</span>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-300 truncate max-w-xs">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            
            {/* Preview para imágenes */}
            {preview && selectedFile.type.startsWith('image/') && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="max-w-xs max-h-32 mx-auto rounded-lg"
                />
              </div>
            )}

            <div className="flex space-x-2 justify-center">
              {onUpload && (
                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  size="sm"
                  variant="primary"
                >
                  {uploading ? 'Subiendo...' : 'Subir'}
                </Button>
              )}
              <Button
                onClick={clearFile}
                disabled={uploading}
                size="sm"
                variant="outline"
              >
                Quitar
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="text-gray-400">
              <p className="text-sm">
                Haz clic para seleccionar o arrastra un archivo aquí
              </p>
              <p className="text-xs">
                Máximo {maxSize}MB {accept !== "*/*" && `• Tipos: ${accept}`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* URL del archivo subido */}
      {uploadedUrl && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-700 dark:text-green-300">
            ✅ Archivo subido correctamente
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1 break-all">
            {uploadedUrl}
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-300">
            ❌ {error}
          </p>
        </div>
      )}

      {/* Texto de ayuda */}
      {helperText && (
        <p className="text-xs text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};