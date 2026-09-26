import React from 'react';
import { Inbox, CheckCircle2, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  onClearFilters: () => void;
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onClearFilters,
  message = "You're all caught up.",
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-10 text-center space-y-3.5 shadow-sm">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#1677FF] flex items-center justify-center mx-auto border border-blue-100">
        <Inbox className="w-7 h-7" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-bold text-slate-900">
          No notices found
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          {message} There are no announcements matching your selected category or search filters.
        </p>
      </div>

      <button
        onClick={onClearFilters}
        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#1677FF] bg-blue-50 hover:bg-blue-100/70 border border-blue-200 rounded-xl transition-colors active:scale-95"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Clear Filters</span>
      </button>
    </div>
  );
};
