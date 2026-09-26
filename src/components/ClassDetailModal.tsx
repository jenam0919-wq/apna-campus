import React, { useState } from 'react';
import {
  X,
  Clock,
  MapPin,
  User,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Bell,
  Download,
  Share2,
  FileText,
  Mail,
  Building,
  Check,
} from 'lucide-react';
import { ClassItem } from '../types/timetable';

interface ClassDetailModalProps {
  classItem: ClassItem | null;
  onClose: () => void;
  onToggleReminder: (id: string) => void;
}

export const ClassDetailModal: React.FC<ClassDetailModalProps> = ({
  classItem,
  onClose,
  onToggleReminder,
}) => {
  const [reminderActive, setReminderActive] = useState(classItem?.reminderSet || false);
  const [showReminderToast, setShowReminderToast] = useState(false);

  if (!classItem) return null;

  const handleReminderClick = () => {
    setReminderActive(!reminderActive);
    onToggleReminder(classItem.id);
    setShowReminderToast(true);
    setTimeout(() => setShowReminderToast(false), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="class-modal-title"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-[#1677FF] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {classItem.code}
              </span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {classItem.type}
              </span>
              {classItem.status === 'Cancelled' ? (
                <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
                  Cancelled
                </span>
              ) : classItem.status === 'Ongoing' ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#1677FF] px-2 py-0.5 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  Ongoing Now
                </span>
              ) : (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {classItem.status}
                </span>
              )}
            </div>
            <h2 id="class-modal-title" className="text-lg font-bold text-slate-900 leading-snug">
              {classItem.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto custom-scrollbar text-xs">
          {/* Toast Notification */}
          {showReminderToast && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-[#1677FF] font-medium">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1677FF]" />
                {reminderActive
                  ? 'Reminder set! You will get notified 15 minutes before class.'
                  : 'Reminder removed for this session.'}
              </span>
            </div>
          )}

          {/* Cancellation Banner if applicable */}
          {classItem.status === 'Cancelled' && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold">Class Cancelled for Today</p>
                <p className="text-rose-700 text-[11px] mt-0.5">
                  Reason: {classItem.cancellationReason || 'Faculty unavailable due to official academic duty.'}
                </p>
              </div>
            </div>
          )}

          {/* Schedule Info Grid */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                  Time & Duration
                </span>
                <span className="font-bold text-slate-800 tabular-nums">
                  {classItem.displayTime}
                </span>
                <span className="text-[11px] text-slate-500 block">60 minutes</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                  Classroom / Lab
                </span>
                <span className="font-bold text-slate-800">
                  {classItem.room}
                </span>
                <span className="text-[11px] text-slate-500 block">CSE Wing, Campus South</span>
              </div>
            </div>
          </div>

          {/* Faculty Details */}
          <div className="p-3.5 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-[#1677FF] font-bold flex items-center justify-center text-sm">
                {classItem.faculty.split(' ').map((p) => p[0]).slice(-2).join('')}
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                  Faculty Instructor
                </span>
                <p className="font-bold text-slate-900 text-sm">{classItem.faculty}</p>
                <p className="text-slate-500 text-[11px]">
                  {classItem.facultyOffice || 'Department of Computer Science'}
                </p>
              </div>
            </div>

            {classItem.facultyEmail && (
              <a
                href={`mailto:${classItem.facultyEmail}`}
                className="p-2 text-slate-500 hover:text-[#1677FF] hover:bg-blue-50 rounded-lg transition-colors"
                title="Send academic email"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Attendance Status */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Attendance Status
              </span>
              {classItem.attendanceStatus === 'Present' ? (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded text-[11px]">
                  <Check className="w-3 h-3 text-emerald-600" />
                  Marked Present (RFID Confirmed)
                </span>
              ) : classItem.attendanceStatus === 'Excused' ? (
                <span className="font-semibold text-slate-600 bg-slate-200 px-2 py-0.5 rounded text-[11px]">
                  Excused Absence
                </span>
              ) : (
                <span className="font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                  Pending Swipe
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600 pt-2 border-t border-slate-200/60">
              <span>Semester Attendance in this Course:</span>
              <span className="font-bold text-slate-900 tabular-nums">
                {classItem.attendanceRate || '92%'} (Safe Zone &gt;75%)
              </span>
            </div>
          </div>

          {/* Topics Covered & Notes */}
          <div>
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Lecture Topics & Notes
            </span>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 leading-relaxed text-[12px]">
              {classItem.topics || 'Detailed syllabus module on theoretical paradigms, problem sets and implementation.'}
            </div>
          </div>

          {/* Materials if any */}
          {classItem.materials && classItem.materials.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Course Materials & Handouts
              </span>
              <div className="space-y-1.5">
                {classItem.materials.map((mat, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <FileText className="w-3.5 h-3.5 text-[#1677FF]" />
                      <span>{mat}</span>
                    </div>
                    <button
                      onClick={() => alert(`Downloading handout: ${mat}`)}
                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-white rounded transition-colors"
                      title="Download file"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Buttons matching prompt specification */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            Close
          </button>

          <button
            onClick={handleReminderClick}
            className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-xs ${
              reminderActive
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{reminderActive ? 'Reminder Active' : 'Add Reminder'}</span>
          </button>

          <button
            onClick={() => {
              alert(`Opening detailed syllabus & attendance ledger for ${classItem.name}`);
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-[#1677FF] hover:bg-blue-600 rounded-xl transition-all shadow-xs active:scale-95"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};
