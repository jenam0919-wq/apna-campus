import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Columns3,
  CalendarDays,
} from 'lucide-react';
import { DAYS_LIST, INITIAL_CLASSES } from '../../data/mockTimetable';
import { ClassItem, DayInfo } from '../../types/timetable';
import { WeeklyGrid } from '../WeeklyGrid';
import { ClassDetailModal } from '../ClassDetailModal';

export const TimetableResponsiveView: React.FC = () => {
  const [activeDayIndex, setActiveDayIndex] = useState(2); // Wednesday (Today)
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [viewFormat, setViewFormat] = useState<'day' | 'week'>('week');

  const currentDay: DayInfo = DAYS_LIST[activeDayIndex] || DAYS_LIST[0];
  const dayClasses = INITIAL_CLASSES.filter((c) => c.day === currentDay.key).sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );

  const handlePrevDay = () => {
    setActiveDayIndex((prev) => (prev > 0 ? prev - 1 : DAYS_LIST.length - 1));
  };

  const handleNextDay = () => {
    setActiveDayIndex((prev) => (prev < DAYS_LIST.length - 1 ? prev + 1 : 0));
  };

  const handleGoToday = () => {
    const todayIndex = DAYS_LIST.findIndex((d) => d.isToday);
    if (todayIndex !== -1) setActiveDayIndex(todayIndex);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Academic Timetable
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            B.Tech Computer Science & Engineering • 2nd Year • Section A (Autumn 2026)
          </p>
        </div>

        {/* View mode toggle (Day vs Week for Desktop) */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center p-1 bg-white border border-slate-200 rounded-xl shadow-xs">
            <button
              onClick={() => setViewFormat('week')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewFormat === 'week'
                  ? 'bg-[#1677FF] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns3 className="w-3.5 h-3.5" />
              <span>Weekly Grid</span>
            </button>

            <button
              onClick={() => setViewFormat('day')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewFormat === 'day'
                  ? 'bg-[#1677FF] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Day View</span>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE CONTROLS: Day Selector + Prev / Today / Next (Section 16) */}
      <div className="lg:hidden bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
        {/* Navigation buttons: Prev, Today, Next */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrevDay}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-700"
              aria-label="Previous day"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleGoToday}
              className="min-h-[44px] px-3.5 bg-blue-50 hover:bg-blue-100 text-[#1677FF] border border-blue-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Today</span>
            </button>

            <button
              onClick={handleNextDay}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-700"
              aria-label="Next day"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="text-right">
            <div className="text-sm font-extrabold text-slate-900">
              {currentDay.dayName}
            </div>
            <div className="text-[11px] text-slate-500">
              {currentDay.dateStr} {currentDay.isToday && '• Today'}
            </div>
          </div>
        </div>

        {/* Horizontal Day Buttons (Mon, Tue, Wed, Thu, Fri, Sat) */}
        <div className="grid grid-cols-6 gap-1 pt-1">
          {DAYS_LIST.map((d, index) => (
            <button
              key={d.key}
              onClick={() => setActiveDayIndex(index)}
              className={`min-h-[44px] py-1 px-1 rounded-xl text-center transition-all ${
                activeDayIndex === index
                  ? 'bg-[#1677FF] text-white font-bold shadow-xs'
                  : d.isToday
                  ? 'bg-blue-50 text-[#1677FF] font-bold border border-blue-200'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 text-xs font-medium'
              }`}
            >
              <span className="block text-[10px] uppercase tracking-tight">{d.shortName}</span>
              <span className="block text-xs">{d.dateStr.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* DESKTOP WEEKLY GRID (Hidden on mobile) */}
      <div className="hidden lg:block">
        {viewFormat === 'week' ? (
          <WeeklyGrid
            days={DAYS_LIST}
            classes={INITIAL_CLASSES}
            onSelectClass={setSelectedClass}
          />
        ) : (
          /* Desktop Day View fallback */
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {currentDay.dayName} Schedule ({dayClasses.length} lectures)
              </h3>
              <div className="flex items-center gap-1.5">
                {DAYS_LIST.map((d, idx) => (
                  <button
                    key={d.key}
                    onClick={() => setActiveDayIndex(idx)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                      activeDayIndex === idx
                        ? 'bg-[#1677FF] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {d.shortName}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {dayClasses.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedClass(item)}
                  className="p-4 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 rounded-xl cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-[#1677FF]">{item.displayTime}</span>
                    <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-500">{item.room} • {item.faculty}</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-200 text-slate-700">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MOBILE TIMETABLE CLASS LIST (Section 16: vertical schedule cards) */}
      <div className="lg:hidden space-y-3">
        <div className="flex items-center justify-between px-1 text-xs text-slate-500 font-medium">
          <span>Classes for {currentDay.dayName}</span>
          <span>{dayClasses.length} Scheduled</span>
        </div>

        {dayClasses.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-400">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-xs font-medium">No classes scheduled for {currentDay.dayName}</p>
          </div>
        ) : (
          dayClasses.map((item) => {
            const isCompleted = item.status === 'Completed';
            const isOngoing = item.status === 'Ongoing';
            const isCancelled = item.status === 'Cancelled';

            return (
              <div
                key={item.id}
                onClick={() => setSelectedClass(item)}
                className={`bg-white border rounded-2xl p-4 shadow-xs active:scale-[0.99] transition-all cursor-pointer ${
                  isOngoing
                    ? 'border-[#1677FF] bg-blue-50/30 ring-1 ring-blue-400/50'
                    : isCancelled
                    ? 'border-rose-200 bg-rose-50/30'
                    : isCompleted
                    ? 'border-slate-200 bg-slate-50/70'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                {/* Time & Status Badge */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 tabular-nums">
                    <Clock className="w-3.5 h-3.5 text-[#1677FF]" />
                    <span>{item.displayTime}</span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isOngoing
                        ? 'bg-[#1677FF] text-white animate-pulse'
                        : isCompleted
                        ? 'bg-slate-200 text-slate-700'
                        : isCancelled
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Subject Name & Room as specified in Section 16 */}
                <div>
                  <span className="font-mono text-[10px] font-bold text-[#1677FF] bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200 inline-block mb-1">
                    {item.code}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-slate-600 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-800">{item.room}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{item.faculty}</span>
                  </div>
                </div>

                {item.topics && (
                  <p className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100 line-clamp-1">
                    Topic: {item.topics}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Class Details Modal */}
      {selectedClass && (
        <ClassDetailModal
          classItem={selectedClass}
          onClose={() => setSelectedClass(null)}
          onToggleReminder={(id) => {
            console.log('Toggled reminder for class:', id);
          }}
        />
      )}
    </div>
  );
};
