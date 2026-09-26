import React, { useState } from 'react';
import { AlertTriangle, ChevronRight, X, BellRing, Info } from 'lucide-react';
import { CURRENT_NOTICE } from '../data/mockTimetable';
import { NoticeItem } from '../types/timetable';

interface NoticeBannerProps {
  onOpenNoticeModal: (notice: NoticeItem) => void;
}

export const NoticeBanner: React.FC<NoticeBannerProps> = ({ onOpenNoticeModal }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 shadow-xs relative overflow-hidden transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-700 shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-amber-800">
                {CURRENT_NOTICE.title}
              </span>
              <span className="text-[10px] text-amber-600 bg-amber-100/80 px-2 py-0.2 rounded-full font-medium">
                {CURRENT_NOTICE.category}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-900 mt-0.5">
              {CURRENT_NOTICE.message}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button
            onClick={() => onOpenNoticeModal(CURRENT_NOTICE)}
            className="px-3.5 py-1.5 text-xs font-bold text-amber-900 bg-amber-200/70 hover:bg-amber-200 rounded-xl transition-colors flex items-center gap-1 active:scale-95"
          >
            <span>View Notice</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 text-amber-700 hover:text-amber-900 hover:bg-amber-100 rounded-lg transition-colors"
            title="Dismiss update"
            aria-label="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
