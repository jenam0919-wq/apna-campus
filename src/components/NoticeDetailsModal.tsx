import React, { useState } from 'react';
import {
  X,
  Building2,
  Calendar,
  Users,
  Paperclip,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Share2,
  Check,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { NoticeItem } from '../types/notice';

interface NoticeDetailsModalProps {
  notice: NoticeItem | null;
  onClose: () => void;
  onToggleRead: (id: string) => void;
  onTakeAction?: (notice: NoticeItem) => void;
}

export const NoticeDetailsModal: React.FC<NoticeDetailsModalProps> = ({
  notice,
  onClose,
  onToggleRead,
  onTakeAction,
}) => {
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  if (!notice) return null;

  const handleDownload = (filename: string) => {
    setDownloadToast(`Downloading ${filename}...`);
    setTimeout(() => setDownloadToast(null), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="notice-modal-title"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/80 sticky top-0 z-10">
          <div className="space-y-1 pr-3">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-700 bg-slate-200/80 px-2 py-0.5 rounded">
                {notice.category}
              </span>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                  notice.priority === 'Emergency'
                    ? 'bg-rose-100 text-rose-800 border-rose-200'
                    : notice.priority === 'Important'
                    ? 'bg-amber-100 text-amber-800 border-amber-200'
                    : 'bg-blue-100 text-[#1677FF] border-blue-200'
                }`}
              >
                Priority: {notice.priority}
              </span>

              {notice.isPersonalized && (
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#1677FF]" />
                  Personalized for you
                </span>
              )}
            </div>

            <h2 id="notice-modal-title" className="text-base sm:text-xl font-extrabold text-slate-900 leading-snug pt-0.5">
              {notice.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors shrink-0"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto custom-scrollbar text-xs">
          {/* Download Toast Notification */}
          {downloadToast && (
            <div className="p-3 bg-blue-50 border border-blue-200 text-[#1677FF] rounded-xl font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#1677FF]" />
              <span>{downloadToast}</span>
            </div>
          )}

          {/* Metadata Grid: Issued by, Department, Date, Target */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 border border-slate-100 p-3.5 rounded-xl">
            <div className="flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                  Department
                </span>
                <span className="font-bold text-slate-800">{notice.issuingDepartment}</span>
                <span className="text-[11px] text-slate-500 block">
                  Issued by: {notice.issuedBy} {notice.issuerRole ? `(${notice.issuerRole})` : ''}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                  Published Date & Time
                </span>
                <span className="font-bold text-slate-800 tabular-nums">{notice.dateStr}</span>
                <span className="text-[11px] text-slate-500 block">{notice.postedAt}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 sm:col-span-2 pt-2 border-t border-slate-200/60">
              <Users className="w-4 h-4 text-[#1677FF] mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                  Target Audience
                </span>
                <span className="font-bold text-slate-800">{notice.targetAudience}</span>
                {notice.targetBreakdown && (
                  <span className="text-[11px] text-slate-500 block">
                    Criteria: Branch: {notice.targetBreakdown.branch} · Year: {notice.targetBreakdown.year}
                    {notice.targetBreakdown.section ? ` · Section: ${notice.targetBreakdown.section}` : ''}
                    {notice.targetBreakdown.hostel ? ` · Hostel: ${notice.targetBreakdown.hostel}` : ''}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Full Notice Content */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Notice Content
            </h4>
            <div className="p-3.5 sm:p-4 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-normal">
              {notice.fullContent}
            </div>
          </div>

          {/* Attachments Section */}
          {notice.attachments && notice.attachments.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                <span>Official Attachments ({notice.attachments.length})</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {notice.attachments.map((att, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between hover:bg-blue-50/50 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1677FF] flex items-center justify-center font-bold text-[10px] shrink-0">
                        {att.type}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{att.name}</p>
                        <span className="text-[10px] text-slate-400 tabular-nums">{att.size}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownload(att.name)}
                      className="min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-500 hover:text-[#1677FF] hover:bg-white rounded-lg transition-colors"
                      title="Download Attachment"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Engagement stats if present */}
          {notice.engagement && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span>Delivery Status for your batch:</span>
              <span className="font-bold text-slate-800 tabular-nums">
                {notice.engagement.read} of {notice.engagement.delivered} students have read this notice
              </span>
            </div>
          )}
        </div>

        {/* Sticky Mobile/Desktop Footer with Buttons (>=44px touch targets) */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50/90 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sticky bottom-0 z-10">
          <div>
            {notice.attachments && notice.attachments.length > 0 && (
              <button
                onClick={() => handleDownload(notice.attachments![0].name)}
                className="w-full sm:w-auto min-h-[44px] px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Download Attachment</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleRead(notice.id)}
              className={`flex-1 sm:flex-initial min-h-[44px] px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all ${
                notice.isRead
                  ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  : 'bg-blue-50 border-blue-200 text-[#1677FF] hover:bg-blue-100'
              }`}
            >
              {notice.isRead ? 'Mark as Unread' : 'Mark as Read'}
            </button>

            {notice.actionRequired && (
              <button
                onClick={() => {
                  if (onTakeAction) onTakeAction(notice);
                }}
                className="flex-1 sm:flex-initial min-h-[44px] px-4 py-2 text-xs font-bold text-white bg-[#1677FF] hover:bg-blue-600 rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-95 flex items-center justify-center"
              >
                {notice.actionTitle || 'Take Action'}
              </button>
            )}

            <button
              onClick={onClose}
              className="min-h-[44px] px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
