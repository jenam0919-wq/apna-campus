import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages = 3,
  onPageChange,
  totalItems,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3">
      <div className="text-xs text-slate-500 font-medium">
        Showing <span className="font-bold text-slate-800">{(currentPage - 1) * 4 + 1}</span> to{' '}
        <span className="font-bold text-slate-800">
          {Math.min(currentPage * 4, totalItems)}
        </span>{' '}
        of <span className="font-bold text-slate-800">{totalItems}</span> notices
      </div>

      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
            currentPage === 1
              ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
              : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border-slate-200 shadow-xs'
          }`}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        {/* Page Numbers 1, 2, 3 */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`w-8 h-8 rounded-xl text-xs font-bold transition-all tabular-nums ${
              currentPage === pageNum
                ? 'bg-[#1677FF] text-white shadow-xs shadow-blue-500/20'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {pageNum}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
            currentPage === totalPages
              ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
              : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border-slate-200 shadow-xs'
          }`}
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
