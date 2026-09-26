import React from 'react';
import {
  GraduationCap,
  FileCheck2,
  Building,
  CalendarDays,
  CreditCard,
  AlertTriangle,
  Clock,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Paperclip,
  Check,
} from 'lucide-react';
import { NoticeItem, NoticeCategory, NoticePriority } from '../types/notice';

interface NoticeCardProps {
  notice: NoticeItem;
  onViewDetails: (notice: NoticeItem) => void;
  onToggleRead: (id: string) => void;
  onTakeAction?: (notice: NoticeItem) => void;
}

const getCategoryIcon = (category: NoticeCategory) => {
  switch (category) {
    case 'Academic':
      return GraduationCap;
    case 'Examination':
      return FileCheck2;
    case 'Hostel':
      return Building;
    case 'Events':
      return CalendarDays;
    case 'Fees':
      return CreditCard;
    case 'Emergency':
      return AlertTriangle;
    default:
      return GraduationCap;
  }
};

const getPriorityStyle = (priority: NoticePriority) => {
  switch (priority) {
    case 'Emergency':
      return 'bg-rose-100 text-rose-700 border-rose-200';
    case 'Urgent':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Important':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Normal':
      return 'bg-slate-100 text-slate-600 border-slate-200';
  }
};

export const NoticeCard: React.FC<NoticeCardProps> = ({
  notice,
  onViewDetails,
  onToggleRead,
  onTakeAction,
}) => {
  const Icon = getCategoryIcon(notice.category);

  return (
    <div
      onClick={() => onViewDetails(notice)}
      className={`bg-white border rounded-2xl p-4 sm:p-5 transition-all duration-150 cursor-pointer group relative ${
        !notice.isRead
          ? 'border-blue-200/90 shadow-xs hover:border-[#1677FF] hover:shadow-md'
          : 'border-slate-200/80 hover:border-slate-300 hover:shadow-sm opacity-95'
      }`}
    >
      {/* Unread indicator dot */}
      {!notice.isRead && (
        <span
          className="absolute -top-1 -right-1 w-3 h-3 bg-[#1677FF] rounded-full ring-4 ring-white"
          title="Unread notice"
        ></span>
      )}

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        {/* Left Section with Category Icon */}
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
              notice.category === 'Emergency'
                ? 'bg-rose-100 text-rose-600'
                : notice.category === 'Examination'
                ? 'bg-amber-100 text-amber-700'
                : notice.category === 'Hostel'
                ? 'bg-purple-100 text-purple-700'
                : notice.category === 'Fees'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-blue-100/70 text-[#1677FF]'
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            {/* Header Badges: Category, Priority, Action, Read Status */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                {notice.category}
              </span>

              <span
                className={`font-semibold px-2 py-0.5 rounded border ${getPriorityStyle(
                  notice.priority
                )}`}
              >
                {notice.priority}
              </span>

              {notice.actionRequired && (
                <span className="font-bold text-white bg-blue-600 px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
                  <span>Action Required</span>
                </span>
              )}

              {notice.isPersonalized && (
                <span className="text-blue-700 font-semibold bg-blue-50 border border-blue-200 px-2 py-0.5 rounded flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-[#1677FF]" />
                  <span>Personalized</span>
                </span>
              )}

              {notice.isRead ? (
                <span className="text-slate-400 font-medium">· Read</span>
              ) : (
                <span className="text-[#1677FF] font-bold">· Unread</span>
              )}
            </div>

            {/* Notice Title */}
            <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#1677FF] transition-colors leading-snug">
              {notice.title}
            </h3>

            {/* Short Description */}
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {notice.summary}
            </p>

            {/* Meta tags: Department, Time, Target */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1.5 text-xs text-slate-500 font-normal">
              <div className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate max-w-[180px]">{notice.issuingDepartment}</span>
              </div>

              <div className="flex items-center gap-1 tabular-nums">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{notice.postedAt}</span>
              </div>

              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-slate-700 font-medium">{notice.targetAudience}</span>
              </div>

              {notice.attachments && notice.attachments.length > 0 && (
                <div className="flex items-center gap-1 text-[#1677FF]">
                  <Paperclip className="w-3 h-3" />
                  <span>{notice.attachments.length} attachment</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center sm:flex-col gap-2 shrink-0 self-end sm:self-center pt-2 sm:pt-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(notice);
            }}
            className="px-3.5 py-1.5 text-xs font-semibold text-[#1677FF] bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200/80 rounded-xl transition-colors flex items-center gap-1"
          >
            <span>View Details</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          {notice.actionRequired && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onTakeAction) onTakeAction(notice);
              }}
              className="px-3 py-1 text-[11px] font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
            >
              {notice.actionTitle || 'Take Action'}
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleRead(notice.id);
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-[11px]"
            title={notice.isRead ? 'Mark as Unread' : 'Mark as Read'}
          >
            {notice.isRead ? 'Unread' : 'Read'}
          </button>
        </div>
      </div>
    </div>
  );
};
