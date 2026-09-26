import React from 'react';
import {
  Clock,
  MapPin,
  User,
  CheckCircle2,
  PlayCircle,
  Calendar,
  Bell,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { ClassItem } from '../types/timetable';

interface TodayClassesPanelProps {
  todayClasses: ClassItem[];
  nextClass?: ClassItem;
  onSelectClass: (classItem: ClassItem) => void;
  onAddReminder: (classItem: ClassItem) => void;
}

export const TodayClassesPanel: React.FC<TodayClassesPanelProps> = ({
  todayClasses,
  nextClass,
  onSelectClass,
  onAddReminder,
}) => {
  // Compute completion stats for today
  const total = todayClasses.length;
  const completedCount = todayClasses.filter((c) => c.status === 'Completed').length;
  const progressPercent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  // Next class fallback to ongoing or first upcoming class
  const highlightedClass = nextClass || todayClasses.find((c) => c.status === 'Ongoing') || todayClasses.find((c) => c.status === 'Upcoming');

  return (
    <div className="space-y-4">
      {/* 9. UPCOMING / NEXT CLASS HIGHLIGHTED CARD */}
      {highlightedClass && (
        <div className="bg-gradient-to-br from-[#1677FF] to-blue-700 text-white rounded-2xl p-5 shadow-lg shadow-blue-500/15 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10">
            {/* Top Label & Countdown */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[11px] uppercase font-bold tracking-wider text-blue-200 bg-white/15 px-2.5 py-0.5 rounded-full backdrop-blur-xs border border-white/20">
                Next Class
              </span>

              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-400 text-emerald-950 px-2.5 py-0.5 rounded-full shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-900 animate-ping"></span>
                Starts in 18 minutes
              </span>
            </div>

            {/* Subject Title */}
            <h3 className="text-xl font-bold text-white tracking-tight leading-snug">
              {highlightedClass.name}
            </h3>

            {/* Time & Room & Faculty details */}
            <div className="mt-3 space-y-1.5 text-xs text-blue-100 font-medium">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-200 shrink-0" />
                <span className="tabular-nums font-semibold text-white">
                  11:30 AM - 12:30 PM
                </span>
                <span className="text-blue-300">·</span>
                <span className="bg-white/15 px-2 py-0.5 rounded text-[11px] text-white">
                  {highlightedClass.type}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-200 shrink-0" />
                <span className="text-white font-semibold">Lab 2</span>
                <span className="text-blue-300">·</span>
                <span className="text-blue-200">Software Engineering Block</span>
              </div>

              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-200 shrink-0" />
                <span className="text-blue-100">Prof. R. Mehta</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-4 pt-3.5 border-t border-white/20 flex items-center gap-2">
              <button
                onClick={() => onSelectClass(highlightedClass)}
                className="flex-1 bg-white text-[#1677FF] font-bold text-xs py-2 px-3 rounded-xl hover:bg-blue-50 transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onAddReminder(highlightedClass)}
                className="p-2 bg-white/15 hover:bg-white/25 text-white rounded-xl transition-colors border border-white/20"
                title="Add Class Reminder"
                aria-label="Add Class Reminder"
              >
                <Bell className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. TODAY'S CLASSES PANEL */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
        {/* Panel Header */}
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Today's Classes
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Wednesday, 01 Oct 2026
            </p>
          </div>

          <span className="text-xs font-bold text-[#1677FF] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg tabular-nums">
            {completedCount}/{total} Done
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-[11px] text-slate-500 mb-1 font-medium">
            <span>Daily Schedule Progress</span>
            <span className="tabular-nums font-semibold text-slate-700">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#1677FF] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* List of Today's Classes */}
        <div className="space-y-2.5">
          {todayClasses.map((item) => {
            const isCompleted = item.status === 'Completed';
            const isOngoing = item.status === 'Ongoing';
            const isUpcoming = item.status === 'Upcoming';

            return (
              <div
                key={item.id}
                onClick={() => onSelectClass(item)}
                className={`p-3 rounded-xl border transition-all cursor-pointer group flex items-center justify-between gap-2.5 ${
                  isOngoing
                    ? 'bg-blue-50/60 border-blue-300 ring-1 ring-[#1677FF]/30 shadow-xs'
                    : isCompleted
                    ? 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/70'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold tabular-nums text-slate-500">
                      {item.displayTime}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium px-1.5 py-0.2 bg-slate-100 rounded">
                      {item.room}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 mt-1 truncate group-hover:text-[#1677FF] transition-colors">
                    {item.name}
                  </h4>

                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {item.faculty}
                  </p>
                </div>

                {/* Status Badges matching specification */}
                <div className="shrink-0 text-right">
                  {isCompleted && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Completed
                    </span>
                  )}

                  {isOngoing && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-white bg-[#1677FF] px-2 py-0.5 rounded-md shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                      Ongoing
                    </span>
                  )}

                  {isUpcoming && (
                    <span className="inline-flex items-center text-[10px] font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                      Upcoming
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
