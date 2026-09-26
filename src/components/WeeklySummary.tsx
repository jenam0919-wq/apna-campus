import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  AlertOctagon,
  TrendingUp,
  Percent,
} from 'lucide-react';

interface WeeklySummaryProps {
  total?: number;
  completed?: number;
  upcoming?: number;
  cancelled?: number;
}

export const WeeklySummary: React.FC<WeeklySummaryProps> = ({
  total = 28,
  completed = 18,
  upcoming = 8,
  cancelled = 2,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Weekly Summary
          </h3>
          <p className="text-xs text-slate-500">
            Performance & schedule distribution for current academic week
          </p>
        </div>

        <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span>Attendance Health:</span>
          <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 tabular-nums">
            89.2% (Good)
          </span>
        </div>
      </div>

      {/* 4 Cards matching specification */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Total Classes */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Classes
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#1677FF] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums tracking-tight">
            {total}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Lectures, Labs & Tutorials
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Completed
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tabular-nums tracking-tight">
            {completed}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {Math.round((completed / total) * 100)}% of weekly curriculum
          </div>
        </div>

        {/* Upcoming */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Upcoming
            </span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 tabular-nums tracking-tight">
            {upcoming}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Scheduled across remaining days
          </div>
        </div>

        {/* Cancelled */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Cancelled
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 tabular-nums tracking-tight">
            {cancelled}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Excused from attendance quota
          </div>
        </div>
      </div>
    </div>
  );
};
