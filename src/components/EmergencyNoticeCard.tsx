import React from 'react';
import {
  AlertTriangle,
  Siren,
  CheckCircle2,
  ArrowRight,
  Clock,
  MapPin,
  ShieldAlert,
} from 'lucide-react';
import { NoticeItem } from '../types/notice';

interface EmergencyNoticeCardProps {
  notice: NoticeItem;
  onViewDetails: (notice: NoticeItem) => void;
  onAcknowledge: (id: string) => void;
}

export const EmergencyNoticeCard: React.FC<EmergencyNoticeCardProps> = ({
  notice,
  onViewDetails,
  onAcknowledge,
}) => {
  return (
    <div className="bg-rose-50/80 border-2 border-rose-300/90 rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden transition-all hover:border-rose-400">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left alert icon and texts */}
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-600/20">
            <Siren className="w-5 h-5 animate-pulse" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-rose-700 bg-rose-100/90 border border-rose-200 px-2 py-0.5 rounded">
                Emergency Campus Alert
              </span>
              <span className="text-[11px] text-rose-600 font-semibold tabular-nums">
                {notice.postedAt}
              </span>
              {notice.acknowledged && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 border border-emerald-300 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Acknowledged
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              Hostel B fire safety drill scheduled at 4:00 PM.
            </h3>

            <p className="text-xs text-slate-700 leading-relaxed max-w-2xl">
              {notice.summary}
            </p>
          </div>
        </div>

        {/* Buttons: View Details & Acknowledge */}
        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
          <button
            onClick={() => onViewDetails(notice)}
            className="px-3.5 py-2 text-xs font-semibold text-rose-900 bg-white border border-rose-200 hover:bg-rose-100/60 rounded-xl transition-all shadow-xs"
          >
            View Details
          </button>

          <button
            onClick={() => onAcknowledge(notice.id)}
            disabled={notice.acknowledged}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
              notice.acknowledged
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
            }`}
          >
            {notice.acknowledged ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Acknowledged</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Acknowledge</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
