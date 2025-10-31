"use client";

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IconChevronDown, IconSearch, IconLayoutGrid, IconList } from '@tabler/icons-react';
import { faqData, faqCategories, FAQItem } from '../../../data/faq';
import debounce from 'lodash.debounce';

// Componente FAQ Card memoizado para mejor rendimiento
const FAQCard = React.memo(({ 
  faq, 
  index, 
  viewMode, 
  isOpen, 
  onToggle 
}: {
  faq: FAQItem;
  index: number;
  viewMode: 'grid' | 'list';
  isOpen: boolean;
  onToggle: (id: number) => void;
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.2, 
        delay: Math.min(index * 0.02, 0.2) // Limitar delay para mejor UX
      }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 h-fit"
    >
      <motion.button
        onClick={() => onToggle(faq.id)}
        className={`w-full text-left flex items-start justify-between hover:bg-gray-50 transition-colors duration-150 ${
          viewMode === 'grid' ? 'px-5 py-4' : 'px-6 py-4'
        }`}
        whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex-1 pr-3">
          <h3 className={`font-semibold text-gray-900 leading-tight mb-3 ${
            viewMode === 'grid' ? 'text-base' : 'text-lg'
          }`}>
            {faq.question}
          </h3>
          {faq.category && (
            <span className="inline-block px-2 py-1 bg-gradient-to-r from-red-800/10 to-amber-600/10 text-red-800 text-xs font-medium rounded-full">
              {faq.category}
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 mt-1"
        >
          <IconChevronDown className={viewMode === 'grid' ? 'w-4 h-4 text-gray-500' : 'w-5 h-5 text-gray-500'} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-100"
          >
            <div className={`text-gray-600 leading-relaxed ${
              viewMode === 'grid' ? 'px-5 py-4 text-sm' : 'px-6 py-4 text-base'
            }`}>
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

FAQCard.displayName = 'FAQCard';

export function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Crear índice de búsqueda precomputado para mejorar rendimiento
  const searchIndex = useMemo(() => {
    return faqData.map(faq => ({
      ...faq,
      searchText: `${faq.question} ${faq.answer} ${faq.category || ''}`.toLowerCase()
    }));
  }, []);

  // Debounce de búsqueda para evitar filtros excesivos
  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      setDebouncedSearchQuery(query);
    }, 300),
    []
  );

  // Efecto para ejecutar búsqueda debounced
  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch]);

  const toggleItem = useCallback((id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  }, []);

  // Filtrado optimizado con memoización
  const filteredFAQs = useMemo(() => {
    if (!debouncedSearchQuery && selectedCategory === "Todos") {
      return faqData;
    }

    return searchIndex.filter((faq) => {
      const matchesCategory = selectedCategory === "Todos" || faq.category === selectedCategory;
      const matchesSearch = !debouncedSearchQuery || faq.searchText.includes(debouncedSearchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchIndex, selectedCategory, debouncedSearchQuery]);

  // Función optimizada para cambio de categoría
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    // Cerrar todos los elementos abiertos al cambiar categoría para mejor UX
    if (openItems.length > 0) {
      setOpenItems([]);
    }
  }, [openItems.length]);

  // Función optimizada para cambio de vista
  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode);
  }, []);

  return (
    <motion.section 
      id="faq"
      className="w-full py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-gray-100"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            
          </motion.div>
          
          <motion.h2 
            className="text-3xl font-montserrat sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Preguntas <span className=" font-montserrat text-[#CBA135] font-semibol">Frecuentes</span>
          </motion.h2>
          {/* Red underline with gradient */}
                  <motion.div 
                    className="w-32 h-1 bg-gradient-to-r from-red-800 to-rose-800 rounded-full mx-auto mb-12  shadow-sm"
                    initial={{ width: 0 }}
                    whileInView={{ width: 128 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    viewport={{ once: true }}
                  ></motion.div>
          <motion.p 
            className="text-lg text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Encuentra respuestas a las preguntas más importantes sobre el proceso electoral boliviano
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.div 
          className="max-w-2xl mx-auto mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="relative">
            <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar preguntas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3 text-black bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-800/20 focus:border-red-800 transition-all duration-300 placeholder:text-black/60"
            />
            
            {/* Botón para limpiar búsqueda */}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                title="Limpiar búsqueda"
              >
                <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            
            {/* Indicador de búsqueda activa */}
            {searchQuery && searchQuery !== debouncedSearchQuery && (
              <div className="absolute right-12 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-red-800 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          
          {/* Contador de resultados */}
          {(debouncedSearchQuery || selectedCategory !== "Todos") && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-3 text-sm text-gray-600"
            >
              <span className="bg-gray-100 px-3 py-1 rounded-full">
                {filteredFAQs.length} {filteredFAQs.length === 1 ? 'resultado' : 'resultados'} encontrado{filteredFAQs.length === 1 ? '' : 's'}
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* View Toggle & Category Filter */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          {/* View Mode Toggle */}
          <motion.div 
            className="flex justify-center lg:justify-start"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-lg border border-gray-200 p-1 flex">
              <motion.button
                onClick={() => handleViewModeChange('grid')}
                className={`p-2 rounded-md transition-all duration-200 flex items-center gap-2 ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-red-800 to-amber-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconLayoutGrid className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:block">Grid</span>
              </motion.button>
              <motion.button
                onClick={() => handleViewModeChange('list')}
                className={`p-2 rounded-md transition-all duration-200 flex items-center gap-2 ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-red-800 to-amber-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconList className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:block">Lista</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Category Filter */}
          <motion.div 
            className="flex flex-wrap justify-center lg:justify-end gap-2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {faqCategories.map((category: string, index: number) => (
              <motion.button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-red-800 to-amber-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-red-800/30 hover:text-red-800'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* FAQ Content */}
        <motion.div 
          className={viewMode === 'grid' ? "max-w-7xl mx-auto" : "max-w-4xl mx-auto"}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            <AnimatePresence mode="popLayout">
              {filteredFAQs.map((faq: FAQItem, index: number) => (
                <FAQCard
                  key={faq.id}
                  faq={faq}
                  index={index}
                  viewMode={viewMode}
                  isOpen={openItems.includes(faq.id)}
                  onToggle={toggleItem}
                />
              ))}
            </AnimatePresence>
          </div>

          {filteredFAQs.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-full text-center py-12"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <IconSearch className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron resultados</h3>
              <p className="text-gray-600">
                Intenta con otros términos de búsqueda o selecciona una categoría diferente.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-red-800 to-amber-600 bg-clip-text text-transparent mb-2">
              {faqData.length}
            </div>
            <div className="text-gray-600">Preguntas Frecuentes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-red-800 to-amber-600 bg-clip-text text-transparent mb-2">
              {faqCategories.length - 1}
            </div>
            <div className="text-gray-600">Categorías</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-red-800 to-amber-600 bg-clip-text text-transparent mb-2">
              100%
            </div>
            <div className="text-gray-600">Información Oficial</div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
