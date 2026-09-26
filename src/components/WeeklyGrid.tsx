import React from 'react';
import {
  Code,
  Cpu,
  Globe,
  Network,
  Database,
  Terminal,
  BookOpen,
  Layers,
  MapPin,
  User,
  CalendarX,
  AlertCircle,
  Clock,
  Radio,
  Sparkles,
} from 'lucide-react';
import { ClassItem, DayInfo } from '../types/timetable';
import { TIME_SLOTS } from '../data/mockTimetable';

interface WeeklyGridProps {
  days: DayInfo[];
  classes: ClassItem[];
  selectedClassId?: string;
  onSelectClass: (classItem: ClassItem) => void;
  filteredType?: string;
  searchQuery?: string;
}

// Icon mapping per subject code/name
const getSubjectIcon = (code: string, name: string) => {
  const lower = (code + ' ' + name).toLowerCase();
  if (lower.includes('data structure') || lower.includes('cs201')) return Code;
  if (lower.includes('operating') || lower.includes('cs203')) return Terminal;
  if (lower.includes('web') || lower.includes('cs204')) return Globe;
  if (lower.includes('network') || lower.includes('cs205')) return Network;
  if (lower.includes('database') || lower.includes('dbms') || lower.includes('cs207')) return Database;
  if (lower.includes('algorithm') || lower.includes('cs202')) return Layers;
  if (lower.includes('organization') || lower.includes('cs208')) return Cpu;
  return BookOpen;
};

// Subtle border and background styles based on status and subject
const getCardStyle = (item: ClassItem, isSelected: boolean) => {
  if (item.status === 'Cancelled') {
    return 'bg-rose-50/70 border-rose-200 text-rose-900 hover:border-rose-300 hover:bg-rose-50';
  }
  if (item.status === 'Ongoing') {
    return 'bg-blue-50/80 border-[#1677FF] ring-2 ring-[#1677FF]/20 text-slate-900 shadow-sm';
  }
  if (item.status === 'Completed') {
    return 'bg-white border-slate-200/90 text-slate-800 hover:border-slate-300 hover:shadow-sm opacity-95';
  }
  // Upcoming
  return 'bg-white border-slate-200 text-slate-800 hover:border-blue-300 hover:shadow-md';
};

export const WeeklyGrid: React.FC<WeeklyGridProps> = ({
  days,
  classes,
  selectedClassId,
  onSelectClass,
  filteredType,
  searchQuery,
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
      {/* Scrollable Container for 1440px+ or horizontal scrolling on small screens */}
      <div className="overflow-x-auto">
        <div className="min-w-[1020px]">
          {/* 5. WEEK HEADER: Monday to Saturday */}
          <div className="grid grid-cols-[100px_repeat(6,1fr)] border-b border-slate-200 bg-slate-50/70 text-slate-700 select-none">
            {/* Corner time header */}
            <div className="p-3.5 border-r border-slate-200 flex flex-col justify-center items-center text-xs font-bold text-slate-400">
              <span>TIME</span>
              <span className="text-[10px] font-normal text-slate-400">IST (UTC+5:30)</span>
            </div>

            {/* Day columns */}
            {days.map((day) => (
              <div
                key={day.key}
                className={`py-3 px-3 text-center border-r border-slate-200 last:border-r-0 transition-colors ${
                  day.isToday
                    ? 'bg-[#1677FF] text-white shadow-xs font-bold'
                    : 'hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span
                    className={`text-xs font-extrabold uppercase tracking-wider ${
                      day.isToday ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {day.shortName}
                  </span>
                  {day.isToday && (
                    <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-full bg-white/20 text-white border border-white/30">
                      Today
                    </span>
                  )}
                </div>
                <div
                  className={`text-sm font-semibold tabular-nums mt-0.5 ${
                    day.isToday ? 'text-blue-100' : 'text-slate-500'
                  }`}
                >
                  {day.dateStr}
                </div>
              </div>
            ))}
          </div>

          {/* 6. MAIN TIMETABLE ROWS */}
          <div className="divide-y divide-slate-100">
            {TIME_SLOTS.map((slot) => {
              // Special handling for Break row
              if (slot.isBreak) {
                return (
                  <div
                    key={slot.id}
                    className="grid grid-cols-[100px_repeat(6,1fr)] bg-slate-50/50 border-y border-dashed border-slate-200 text-slate-500 min-h-[44px]"
                  >
                    <div className="p-2 border-r border-slate-200 flex flex-col justify-center items-center text-center">
                      <span className="text-xs font-bold text-slate-700 tabular-nums">{slot.label}</span>
                      <span className="text-[10px] text-slate-400 font-mono">12:30 PM</span>
                    </div>
                    <div className="col-span-6 flex items-center justify-center gap-2 py-2 px-4 text-xs font-medium text-slate-500 bg-amber-50/30">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>{slot.labelSub || 'Lunch Break & Student Commons (12:30 PM – 01:30 PM)'}</span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={slot.id}
                  className="grid grid-cols-[100px_repeat(6,1fr)] min-h-[120px] transition-colors"
                >
                  {/* Left Time Column */}
                  <div className="p-3 border-r border-slate-200 flex flex-col justify-start items-center text-center bg-slate-50/30">
                    <span className="text-xs font-bold text-slate-800 tabular-nums">{slot.label}</span>
                    <span className="text-[11px] text-slate-400 font-mono mt-0.5 whitespace-nowrap">
                      {slot.timeRange.split(' - ')[0]}
                    </span>
                  </div>

                  {/* Day Slots */}
                  {days.map((day) => {
                    // Find class matching this day and timeSlotId
                    const classItem = classes.find(
                      (c) => c.day === day.key && c.timeSlotId === slot.id
                    );

                    // Check if it matches search or type filters
                    const matchesSearch =
                      !searchQuery ||
                      (classItem &&
                        (classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          classItem.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          classItem.faculty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          classItem.room.toLowerCase().includes(searchQuery.toLowerCase())));

                    const matchesType =
                      !filteredType ||
                      filteredType === 'All' ||
                      (classItem && classItem.type.toLowerCase() === filteredType.toLowerCase());

                    const isDimmed = (searchQuery && !matchesSearch) || (filteredType && !matchesType);

                    return (
                      <div
                        key={`${day.key}-${slot.id}`}
                        className={`p-2 border-r border-slate-100 last:border-r-0 flex flex-col justify-start relative group transition-colors ${
                          day.isToday ? 'bg-blue-50/15' : ''
                        }`}
                      >
                        {classItem ? (
                          <div
                            onClick={() => onSelectClass(classItem)}
                            className={`w-full h-full min-h-[104px] p-2.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all duration-150 relative ${getCardStyle(
                              classItem,
                              selectedClassId === classItem.id
                            )} ${isDimmed ? 'opacity-30 grayscale-[50%]' : ''}`}
                          >
                            {/* Card Top: Subject Icon, Name, Type */}
                            <div>
                              <div className="flex items-start justify-between gap-1 mb-1">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  {React.createElement(getSubjectIcon(classItem.code, classItem.name), {
                                    className: `w-3.5 h-3.5 shrink-0 ${
                                      classItem.status === 'Cancelled'
                                        ? 'text-rose-500'
                                        : classItem.status === 'Ongoing'
                                        ? 'text-[#1677FF]'
                                        : 'text-slate-600'
                                    }`,
                                  })}
                                  <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1 truncate">
                                    {classItem.name}
                                  </h4>
                                </div>

                                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 bg-slate-100/80 px-1.5 py-0.5 rounded shrink-0">
                                  {classItem.type}
                                </span>
                              </div>

                              {/* Time and Room */}
                              <div className="text-[11px] text-slate-500 space-y-0.5 mt-1 font-normal">
                                <div className="flex items-center gap-1 tabular-nums">
                                  <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span>{classItem.displayTime}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="font-medium text-slate-700">{classItem.room}</span>
                                </div>
                              </div>
                            </div>

                            {/* Card Bottom: Faculty and Status Badge */}
                            <div className="mt-2 pt-1.5 border-t border-slate-100/80 flex items-center justify-between gap-1 text-[11px]">
                              <div className="flex items-center gap-1 text-slate-600 min-w-0">
                                <User className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">{classItem.faculty}</span>
                              </div>

                              {/* 7. CLASS STATUS BADGES */}
                              {classItem.status === 'Completed' && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                                  Completed
                                </span>
                              )}

                              {classItem.status === 'Ongoing' && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#1677FF] text-white shadow-xs shrink-0">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                                  Ongoing
                                </span>
                              )}

                              {classItem.status === 'Upcoming' && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                                  Upcoming
                                </span>
                              )}

                              {classItem.status === 'Cancelled' && (
                                <div className="text-right">
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                                    <AlertCircle className="w-2.5 h-2.5 mr-0.5" />
                                    Cancelled
                                  </span>
                                  {classItem.cancellationReason && (
                                    <p className="text-[9px] text-rose-600 font-normal leading-tight mt-0.5">
                                      {classItem.cancellationReason}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          /* 12. EMPTY / NO CLASS STATE */
                          <div className="w-full h-full min-h-[104px] border border-dashed border-slate-200 rounded-xl p-2 flex flex-col items-center justify-center text-slate-400 group-hover:border-slate-300 group-hover:bg-slate-50/50 transition-colors">
                            <CalendarX className="w-4 h-4 text-slate-300 mb-1 group-hover:text-slate-400" />
                            <span className="text-[11px] font-medium text-slate-400">No Class</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
