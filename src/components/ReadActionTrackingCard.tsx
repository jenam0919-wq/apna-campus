import React from 'react';
import {
  TrendingUp,
  CheckCircle2,
  Mail,
  FileCheck2,
  Users,
} from 'lucide-react';
import { TARGET_PROFILE } from '../data/mockNotices';

interface ReadActionTrackingCardProps {
  delivered?: number;
  read?: number;
  unread?: number;
  actionCompleted?: number;
}

export const ReadActionTrackingCard: React.FC<ReadActionTrackingCardProps> = ({
  delivered = TARGET_PROFILE.deliveredTotal,
  read = TARGET_PROFILE.readTotal,
  unread = TARGET_PROFILE.unreadTotal,
  actionCompleted = TARGET_PROFILE.actionCompletedTotal,
}) => {
  const readPercentage = Math.round((read / delivered) * 100);
  const actionPercentage = Math.round((actionCompleted / delivered) * 100);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Notice Engagement
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Cohort engagement & compliance rate
          </p>
        </div>

        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg tabular-nums">
          {readPercentage}% Read Rate
        </span>
      </div>

      {/* Progress Bars */}
      <div className="space-y-3 text-xs">
        {/* Read vs Delivered Progress */}
        <div>
          <div className="flex items-center justify-between text-slate-600 mb-1.5 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Read Confirmation</span>
            </span>
            <span className="font-bold text-slate-900 tabular-nums">
              {read} / {delivered} ({readPercentage}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${readPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Action Completed Progress */}
        <div>
          <div className="flex items-center justify-between text-slate-600 mb-1.5 font-medium">
            <span className="flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-[#1677FF]" />
              <span>Action Completed</span>
            </span>
            <span className="font-bold text-slate-900 tabular-nums">
              {actionCompleted} / {delivered} ({actionPercentage}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
            <div
              className="bg-[#1677FF] h-full rounded-full transition-all duration-500"
              style={{ width: `${actionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 4 Stats Grid */}
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
            Delivered
          </span>
          <span className="text-base font-extrabold text-slate-800 tabular-nums">
            {delivered}
          </span>
        </div>

        <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100 text-center">
          <span className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider block">
            Read
          </span>
          <span className="text-base font-extrabold text-emerald-700 tabular-nums">
            {read}
          </span>
        </div>

        <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100 text-center">
          <span className="text-[10px] text-blue-600 font-semibold uppercase tracking-wider block">
            Unread
          </span>
          <span className="text-base font-extrabold text-[#1677FF] tabular-nums">
            {unread}
          </span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
            Action Completed
          </span>
          <span className="text-base font-extrabold text-slate-900 tabular-nums">
            {actionCompleted}
          </span>
        </div>
      </div>
    </div>
  );
};
