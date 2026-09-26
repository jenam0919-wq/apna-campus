import React from 'react';
import { X, AlertTriangle, Building2, Calendar, Clock, CheckCircle } from 'lucide-react';
import { NoticeItem } from '../types/timetable';

interface NoticeDetailModalProps {
  notice: NoticeItem | null;
  onClose: () => void;
}

export const NoticeDetailModal: React.FC<NoticeDetailModalProps> = ({ notice, onClose }) => {
  if (!notice) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-amber-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded">
                {notice.category}
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">{notice.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium leading-relaxed text-sm">
            {notice.message}
          </div>

          <div className="space-y-2 text-slate-600">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>Issued By: <strong className="text-slate-800">{notice.issuedBy}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Timestamp: <strong className="text-slate-800">{notice.date}</strong></span>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-[11px] text-[#1677FF] leading-relaxed">
            Note: All students enrolled in CSE 2nd Year Web Tech practical groups are requested to report directly to Software Lab 3. The attendance RFID scanner will operate at Lab 3 entrance.
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all"
          >
            Understood & Acknowledged
          </button>
        </div>
      </div>
    </div>
  );
};
