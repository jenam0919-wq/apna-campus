import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Filter,
  Download,
  Printer,
  Sparkles,
} from 'lucide-react';
import { ClassType } from '../types/timetable';

interface TimetableControlsProps {
  currentWeekLabel: string;
  selectedDateText: string;
  viewMode: 'week' | 'day';
  onViewModeChange: (mode: 'week' | 'day') => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
  selectedTypeFilter: ClassType | 'All';
  onTypeFilterChange: (type: ClassType | 'All') => void;
  onPrintTimetable: () => void;
  onExportCalendar: () => void;
}

export const TimetableControls: React.FC<TimetableControlsProps> = ({
  currentWeekLabel,
  selectedDateText,
  viewMode,
  onViewModeChange,
  onPrevWeek,
  onNextWeek,
  onToday,
  selectedTypeFilter,
  onTypeFilterChange,
  onPrintTimetable,
  onExportCalendar,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <div className="space-y-4">
      {/* Main Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Timetable
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-normal">
            View your classes, schedule and important class updates.
          </p>
        </div>

        {/* Right side of Main Header: Date selector, Today button, Calendar icon */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
              title="Select specific date"
            >
              <CalendarIcon className="w-4 h-4 text-[#1677FF]" />
              <span>{selectedDateText}</span>
            </button>

            {showDatePicker && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-30 text-xs">
                <div className="font-bold text-slate-800 mb-2 flex items-center justify-between">
                  <span>Jump to Date</span>
                  <span className="text-[10px] text-[#1677FF] font-semibold bg-blue-50 px-2 py-0.5 rounded">Oct 2026</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-[11px]">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                    <span key={i} className="text-slate-400 font-medium py-1">{d}</span>
                  ))}
                  {[28, 29, 30, 1, 2, 3, 4].map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        setShowDatePicker(false);
                        if (d === 1) onToday();
                      }}
                      className={`py-1.5 rounded-lg font-medium transition-colors ${
                        d === 1
                          ? 'bg-[#1677FF] text-white font-bold'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onToday}
            className="px-3.5 py-2 text-xs font-semibold text-[#1677FF] bg-blue-50 border border-blue-200/80 rounded-xl hover:bg-blue-100/70 transition-all shadow-sm active:scale-95"
          >
            Today
          </button>
        </div>
      </div>

      {/* TIMETABLE CONTROLS SECTION */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Previous Week / Current Week Label / Next Week / Today / Calendar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Week Navigation controls */}
          <div className="inline-flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1 shadow-xs">
            <button
              onClick={onPrevWeek}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
              title="Previous Week"
              aria-label="Previous Week"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 text-xs font-bold text-slate-800 tracking-tight tabular-nums whitespace-nowrap">
              {currentWeekLabel}
            </span>

            <button
              onClick={onNextWeek}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
              title="Next Week"
              aria-label="Next Week"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onToday}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-[#1677FF] bg-white border border-slate-200 rounded-xl hover:bg-blue-50/40 transition-colors shadow-xs"
          >
            Today
          </button>

          {/* Filter Type Pills */}
          <div className="hidden md:flex items-center gap-1 pl-2 border-l border-slate-200">
            {(['All', 'Lecture', 'Lab', 'Tutorial'] as const).map((type) => (
              <button
                key={type}
                onClick={() => onTypeFilterChange(type)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  selectedTypeFilter === type
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {type === 'All' ? 'All Classes' : `${type}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Right: View Switch (Week View / Day View) & Export Actions */}
        <div className="flex items-center gap-2.5">
          {/* View Switch */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-medium">
            <button
              onClick={() => onViewModeChange('week')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'week'
                  ? 'bg-white text-[#1677FF] font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Week View
            </button>
            <button
              onClick={() => onViewModeChange('day')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'day'
                  ? 'bg-white text-[#1677FF] font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Day View
            </button>
          </div>

          {/* Export / Print */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={onPrintTimetable}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
              title="Print Timetable"
              aria-label="Print Timetable"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onExportCalendar}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
              title="Export as iCal / ICS"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
