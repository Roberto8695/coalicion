'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { IconX } from '@tabler/icons-react'

interface VerificationModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function VerificationModal({ isOpen, onClose }: VerificationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      // Pequeño delay para que el DOM se actualice antes de la animación
      setTimeout(() => setIsAnimating(true), 10)
    } else {
      setIsAnimating(false)
      // Esperar a que termine la animación antes de desmontar
      setTimeout(() => setShouldRender(false), 300)
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose])

  if (!shouldRender) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`} 
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          ref={modalRef}
          className={`bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ease-out ${
            isAnimating 
              ? 'translate-y-0 opacity-100 scale-100' 
              : '-translate-y-8 opacity-0 scale-95'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 font-montserrat">
              Verifica Desinformación
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <IconX className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-600 mb-6 text-center font-montserrat">
              Selecciona una plataforma para verificar información:
            </p>

            <div className="space-y-4">
              {/* Chequea Bolivia */}
              <a
                href="https://chekibot.chequeabolivia.bo/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-[#CBA135] hover:bg-gray-50 transition-all duration-200 group"
                onClick={onClose}
              >
                <div className="relative w-16 h-16 mr-4 flex-shrink-0">
                  <Image
                    src="/logos/logo-chequea.webp"
                    alt="Chequea Bolivia"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 font-montserrat group-hover:text-[#CBA135] transition-colors">
                    Chequea Bolivia
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Verifica información con ChekiBot
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-[#CBA135] transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>

              {/* Bolivia Verifica */}
              <a
                href="https://t.co/Y64Q6vAHrv"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-[#CBA135] hover:bg-gray-50 transition-all duration-200 group"
                onClick={onClose}
              >
                <div className="relative w-16 h-16 mr-4 flex-shrink-0">
                  <Image
                    src="/logos/LOGO-bolivia.png"
                    alt="Bolivia Verifica"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 font-montserrat group-hover:text-[#CBA135] transition-colors">
                    Bolivia Verifica
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Plataforma de verificación de hechos
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-[#CBA135] transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            <p className="text-xs text-gray-500 text-center">
              Las plataformas se abrirán en una nueva ventana
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
