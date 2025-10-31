'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';
import { uploadsService } from '@/api';

interface FilePickerProps {
  label: string;
  type?: string;
  value?: string;
  onChange: (fileUrl: string, fileName: string) => void;
  placeholder?: string;
  helperText?: string;
  className?: string;
}

interface FileItem {
  name: string;
  type: 'file' | 'directory';
  path: string;
  url?: string;
  size?: string;
  format?: string;
  modified?: string;
  children?: FileItem[];
}

export const FilePicker = ({
  label,
  type,
  value = '',
  onChange,
  placeholder = "Seleccionar archivo",
  helperText,
  className = ""
}: FilePickerProps) => {
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [currentPath, setCurrentPath] = useState<string[]>([]);

  const loadFiles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await uploadsService.listFiles({ type });
      
      if (response.success) {
        setFiles(response.data);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error cargando archivos:', message);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    if (showModal) {
      loadFiles();
    }
  }, [showModal, loadFiles]);

  const handleFileSelect = (file: FileItem) => {
    if (file.type === 'file' && file.url) {
      setSelectedFile(file);
    }
  };

  const handleConfirm = () => {
    if (selectedFile && selectedFile.url) {
      onChange(selectedFile.url, selectedFile.name);
      setShowModal(false);
      setSelectedFile(null);
    }
  };

  const navigateToFolder = (folder: FileItem) => {
    if (folder.type === 'directory' && folder.children) {
      setCurrentPath([...currentPath, folder.name]);
      setFiles(folder.children);
    }
  };

  const navigateBack = () => {
    // Implementar navegación hacia atrás si es necesario
    loadFiles();
    setCurrentPath([]);
  };

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'directory') return '📁';
    
    const ext = file.format?.toLowerCase();
    switch (ext) {
      case 'PDF': return '📄';
      case 'JPG':
      case 'JPEG':
      case 'PNG':
      case 'SVG':
      case 'GIF': return '🖼️';
      case 'MP4':
      case 'AVI':
      case 'MOV': return '🎥';
      case 'MP3':
      case 'WAV': return '🎵';
      case 'DOC':
      case 'DOCX': return '📝';
      case 'PPT':
      case 'PPTX': return '📽️';
      default: return '📁';
    }
  };

  const formatFileName = (name: string) => {
    if (name.length > 30) {
      return name.substring(0, 27) + '...';
    }
    return name;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      
      <div className="flex space-x-2">
        <div className="flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value, '')}
            placeholder={placeholder}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <Button
          type="button"
          onClick={() => setShowModal(true)}
          variant="outline"
          size="sm"
        >
          Explorar
        </Button>
      </div>

      {helperText && (
        <p className="text-xs text-gray-500">
          {helperText}
        </p>
      )}

      {/* Modal de selección de archivos */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedFile(null);
        }}
        title="Seleccionar Archivo"
        size="lg"
        onConfirm={selectedFile ? handleConfirm : undefined}
        onCancel={() => setShowModal(false)}
        confirmText="Seleccionar"
        isLoading={loading}
      >
        <div className="space-y-4">
          {/* Navegación */}
          {currentPath.length > 0 && (
            <div className="flex items-center space-x-2 pb-2 border-b border-gray-700">
              <Button
                type="button"
                onClick={navigateBack}
                variant="ghost"
                size="sm"
              >
                ← Volver
              </Button>
              <span className="text-sm text-gray-400">
                /{currentPath.join('/')}/
              </span>
            </div>
          )}

          {/* Lista de archivos */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-400">Cargando archivos...</span>
              </div>
            ) : files.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay archivos disponibles
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className={`
                      flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors
                      ${selectedFile?.path === file.path 
                        ? 'bg-blue-600/20 border border-blue-500' 
                        : 'bg-gray-700 hover:bg-gray-600'
                      }
                      ${file.type === 'directory' ? 'border-l-4 border-l-yellow-500' : ''}
                    `}
                    onClick={() => {
                      if (file.type === 'directory') {
                        navigateToFolder(file);
                      } else {
                        handleFileSelect(file);
                      }
                    }}
                  >
                    <span className="text-2xl">{getFileIcon(file)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-300 truncate">
                        {formatFileName(file.name)}
                      </p>
                      {file.type === 'file' && (
                        <div className="flex space-x-4 text-xs text-gray-500">
                          {file.size && <span>{file.size}</span>}
                          {file.format && <span>{file.format}</span>}
                        </div>
                      )}
                    </div>
                    {file.type === 'directory' && (
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Archivo seleccionado */}
          {selectedFile && (
            <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
              <p className="text-sm font-medium text-blue-300">
                Archivo seleccionado:
              </p>
              <p className="text-sm text-gray-300 mt-1">
                {selectedFile.name}
              </p>
              {selectedFile.url && (
                <p className="text-xs text-gray-500 mt-1 break-all">
                  {selectedFile.url}
                </p>
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};