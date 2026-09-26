import React from 'react';
import {
  AlertCircle,
  Calendar,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  FileCheck2,
  FileText,
} from 'lucide-react';
import { NoticeItem } from '../types/notice';

interface FeaturedNoticeCardProps {
  notice: NoticeItem;
  onViewDetails: (notice: NoticeItem) => void;
  onToggleRead: (id: string) => void;
}

export const FeaturedNoticeCard: React.FC<FeaturedNoticeCardProps> = ({
  notice,
  onViewDetails,
  onToggleRead,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-50/90 via-blue-50/50 to-white border-2 border-blue-200/90 rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden transition-all hover:shadow-md hover:border-[#1677FF]/40">
      {/* Accent corner decorative pill */}
      <div className="absolute top-0 right-0 bg-[#1677FF] text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-bl-xl shadow-xs flex items-center gap-1.5">
        <Sparkles className="w-3 h-3" />
        <span>Featured Announcement</span>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-3 max-w-3xl">
          {/* Tagline & Priority */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-800 bg-amber-100 border border-amber-300/80 px-2.5 py-0.5 rounded-lg">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
              IMPORTANT — Examination Update
            </span>

            <span className="text-[11px] font-semibold text-[#1677FF] bg-blue-100/70 border border-blue-200 px-2 py-0.5 rounded-md">
              Priority: {notice.priority}
            </span>

            {notice.isRead ? (
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Read
              </span>
            ) : (
              <span className="text-[11px] text-[#1677FF] font-bold bg-white px-2 py-0.5 rounded-md border border-blue-200">
                New Unread
              </span>
            )}
          </div>

          {/* Title and Short Description */}
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Mid-Semester Examination schedule has been updated.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              {notice.summary}
            </p>
          </div>

          {/* Metadata Row: Posted by, Date, Target */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-600 pt-1 border-t border-blue-100/80 font-medium">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                Posted by: <strong className="text-slate-800 font-semibold">{notice.issuingDepartment}</strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5 tabular-nums">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                Date: <strong className="text-slate-800 font-semibold">{notice.dateStr}</strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                Target: <strong className="text-[#1677FF] font-semibold">{notice.targetAudience}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Buttons: View Details & Mark as Read */}
        <div className="flex items-center sm:flex-row lg:flex-col gap-2.5 shrink-0 self-start lg:self-center">
          <button
            onClick={() => onViewDetails(notice)}
            className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-bold text-white bg-[#1677FF] hover:bg-blue-600 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 active:scale-95 whitespace-nowrap"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onToggleRead(notice.id)}
            className={`flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all whitespace-nowrap ${
              notice.isRead
                ? 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-blue-50/50 border-slate-200'
            }`}
          >
            {notice.isRead ? 'Mark as Unread' : 'Mark as Read'}
          </button>
        </div>
      </div>
    </div>
  );
};
