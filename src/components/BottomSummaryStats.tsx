import React from 'react';
import {
  FileText,
  MailQuestion,
  AlertCircle,
  FileCheck,
  TrendingUp,
} from 'lucide-react';

interface BottomSummaryStatsProps {
  totalNotices?: number;
  unreadCount?: number;
  actionRequiredCount?: number;
  importantCount?: number;
}

export const BottomSummaryStats: React.FC<BottomSummaryStatsProps> = ({
  totalNotices = 24,
  unreadCount = 6,
  actionRequiredCount = 3,
  importantCount = 2,
}) => {
  return (
    <div className="space-y-3 pt-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Notices & Circulars Summary
          </h3>
          <p className="text-xs text-slate-500">
            Overview of semester notifications and pending academic action items
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Feed Synchronized</span>
        </div>
      </div>

      {/* 4 Cards matching specification */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Total Notices */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Notices
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#1677FF] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums tracking-tight">
            {totalNotices}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Official active campus notices
          </div>
        </div>

        {/* Unread */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Unread
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#1677FF] flex items-center justify-center">
              <MailQuestion className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#1677FF] tabular-nums tracking-tight">
            {unreadCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Awaiting your initial review
          </div>
        </div>

        {/* Action Required */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Action Required
            </span>
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-orange-600 tabular-nums tracking-tight">
            {actionRequiredCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Forms, hall tickets & submissions
          </div>
        </div>

        {/* Important */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Important
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 tabular-nums tracking-tight">
            {importantCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            High priority campus alerts
          </div>
        </div>
      </div>
    </div>
  );
};
