import React, { useState } from 'react';
import {
  Clock,
  MapPin,
  User,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Radio,
  BookOpen,
} from 'lucide-react';
import { ClassItem, DayInfo } from '../types/timetable';

interface DayViewProps {
  days: DayInfo[];
  currentDayKey: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';
  onSelectDay: (dayKey: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT') => void;
  classes: ClassItem[];
  onSelectClass: (classItem: ClassItem) => void;
}

export const DayView: React.FC<DayViewProps> = ({
  days,
  currentDayKey,
  onSelectDay,
  classes,
  onSelectClass,
}) => {
  const currentDay = days.find((d) => d.key === currentDayKey) || days[2];
  const dayClasses = classes
    .filter((c) => c.day === currentDayKey)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-6 space-y-6">
      {/* Day Selector Buttons */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            {currentDay.dayName} Schedule
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentDay.dateStr}, 2026 {currentDay.isToday && '• Today'}
          </p>
        </div>

        {/* Day switch buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          {days.map((d) => (
            <button
              key={d.key}
              onClick={() => onSelectDay(d.key)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                currentDayKey === d.key
                  ? 'bg-[#1677FF] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {d.shortName}
            </button>
          ))}
        </div>
      </div>

      {/* Classes Timeline for the day */}
      {dayClasses.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300" />
          <p className="text-sm font-medium">No classes scheduled for {currentDay.dayName}</p>
        </div>
      ) : (
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {dayClasses.map((item) => {
            const isCompleted = item.status === 'Completed';
            const isOngoing = item.status === 'Ongoing';
            const isCancelled = item.status === 'Cancelled';

            return (
              <div key={item.id} className="relative group">
                {/* Timeline node icon */}
                <div
                  className={`absolute -left-6 top-4 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center transition-all ${
                    isOngoing
                      ? 'border-[#1677FF] ring-4 ring-blue-100'
                      : isCompleted
                      ? 'border-emerald-500 bg-emerald-50'
                      : isCancelled
                      ? 'border-rose-500 bg-rose-50'
                      : 'border-slate-300'
                  }`}
                >
                  {isOngoing && <div className="w-1.5 h-1.5 rounded-full bg-[#1677FF] animate-ping"></div>}
                </div>

                <div
                  onClick={() => onSelectClass(item)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isOngoing
                      ? 'bg-blue-50/70 border-[#1677FF] shadow-sm'
                      : isCancelled
                      ? 'bg-rose-50/70 border-rose-200'
                      : isCompleted
                      ? 'bg-slate-50/80 border-slate-200 hover:bg-slate-100'
                      : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#1677FF] bg-white px-2 py-0.5 rounded border border-slate-200">
                        {item.code}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#1677FF] transition-colors">
                        {item.name}
                      </h4>
                      <span className="text-[10px] uppercase font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {item.type}
                      </span>
                    </div>

                    <div>
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Completed
                        </span>
                      )}
                      {isOngoing && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-[#1677FF] px-2.5 py-0.5 rounded-md shadow-xs">
                          <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                          Ongoing Now
                        </span>
                      )}
                      {isCancelled && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 border border-rose-200 px-2.5 py-0.5 rounded-md">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Cancelled: {item.cancellationReason}
                        </span>
                      )}
                      {item.status === 'Upcoming' && (
                        <span className="text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                          Upcoming
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 font-medium tabular-nums">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.displayTime}</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-800">{item.room}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.faculty}</span>
                    </div>
                  </div>

                  {item.topics && (
                    <div className="mt-2 pt-2 border-t border-slate-200/60 text-xs text-slate-600 font-normal">
                      <span className="font-semibold text-slate-700">Topic: </span>
                      {item.topics}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
