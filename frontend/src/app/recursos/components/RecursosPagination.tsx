"use client";

import { AnimatePresence, motion } from "motion/react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

interface RecursosCarouselProps {
  page: number;
  direction: number;
  children: React.ReactNode;
}

interface RecursosPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function RecursosCarousel({ page, direction, children }: RecursosCarouselProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={page}
        initial={{ opacity: 0, x: direction * 48 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: direction * -48 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function RecursosPagination({ page, totalPages, onPageChange }: RecursosPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Paginación de recursos">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Página anterior"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition-colors hover:border-[#CBA135] hover:text-[#CBA135] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <IconChevronLeft className="h-5 w-5" />
      </button>

      {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
        <button
          type="button"
          key={pageNumber}
          onClick={() => onPageChange(pageNumber)}
          aria-current={pageNumber === page ? "page" : undefined}
          className={`h-10 min-w-10 rounded-full px-3 text-sm font-semibold transition-all ${
            pageNumber === page
              ? "bg-gradient-to-r from-[#CBA135] to-[#B8941F] text-white shadow-lg"
              : "border border-gray-200 bg-white text-gray-700 hover:border-[#CBA135] hover:text-[#CBA135]"
          }`}
        >
          {pageNumber}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Página siguiente"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition-colors hover:border-[#CBA135] hover:text-[#CBA135] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <IconChevronRight className="h-5 w-5" />
      </button>
    </nav>
  );
}
