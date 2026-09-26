import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Info,
  Calendar,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { useCampusData } from '../../context/CampusDataContext';
import { AttendanceRecord } from '../../types/store';

export const AttendanceView: React.FC = () => {
  const { attendanceRecords, markClassAttendance, overallAttendancePercentage } = useCampusData();
  const [toast, setToast] = useState<string | null>(null);

  const overallAttended = attendanceRecords.reduce((acc: number, s: AttendanceRecord) => acc + s.attendedClasses, 0);
  const overallTotal = attendanceRecords.reduce((acc: number, s: AttendanceRecord) => acc + s.totalClasses, 0);
  const overallPercentage = overallAttendancePercentage;
  const isOverallSafe = overallPercentage >= 75;

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSimulateLog = (code: string, present: boolean) => {
    markClassAttendance(code, '2024CS1042', present);
    triggerToast(`Logged ${present ? 'Present' : 'Absent'} for ${code}. Recalculated aggregate!`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Hero Summary Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30">
              Official University Attendance Record
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Biometric & Lecture Attendance
            </h1>
            <p className="text-xs sm:text-sm text-blue-200 max-w-xl">
              Real-time synchronization across RFID biometric turnstiles, smart attendance beacons, and faculty logs.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-xs">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200 block">
                Overall Aggregate
              </span>
              <span className={`text-3xl sm:text-4xl font-black ${isOverallSafe ? 'text-emerald-300' : 'text-rose-300'} tabular-nums`}>
                {overallPercentage}%
              </span>
            </div>
            <div className={`p-2.5 rounded-xl ${isOverallSafe ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
              {isOverallSafe ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
            </div>
          </div>
        </div>

        {/* Aggregate Stats Row */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-blue-300/80 block">Classes Attended</span>
            <span className="text-lg font-bold text-white tabular-nums">{overallAttended}</span>
          </div>
          <div>
            <span className="text-blue-300/80 block">Total Lectures Conducted</span>
            <span className="text-lg font-bold text-white tabular-nums">{overallTotal}</span>
          </div>
          <div>
            <span className="text-blue-300/80 block">Status Benchmark</span>
            <span className={`text-lg font-bold ${isOverallSafe ? 'text-emerald-300' : 'text-rose-300'}`}>
              {isOverallSafe ? 'Good Standing' : 'Debarment Risk'}
            </span>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-white/10 p-2.5 rounded-xl border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <Info className="w-4 h-4" />
              <span>Exam Threshold Policy</span>
            </div>
            <p className="text-slate-200 leading-normal">
              Minimum 75% required per subject to generate Mid-Semester & End-Semester admit cards without debarment.
            </p>
          </div>
        </div>

        {/* Aggregate Progress Bar */}
        <div className="mt-5 w-full bg-white/20 h-3 rounded-full overflow-hidden flex">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isOverallSafe ? 'bg-emerald-400' : 'bg-rose-400'
            }`}
            style={{ width: `${Math.min(overallPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Warning Alert if any subject < 75% */}
      {attendanceRecords.some((s: AttendanceRecord) => s.percentage < 75) && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 text-xs text-rose-900 shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div className="flex-1">
            <span className="font-bold">Low Attendance Notice: </span>
            <span>
              One or more registered courses are currently below the required 75% threshold. Please attend upcoming lectures to avoid exam debarment.
            </span>
          </div>
        </div>
      )}

      {/* SUBJECT CARDS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Course-Wise Attendance Breakdown
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {attendanceRecords.length} Enrolled Courses
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {attendanceRecords.map((subject: AttendanceRecord) => {
            const isSafe = subject.percentage >= 75;
            const isCritical = subject.percentage < 75;

            return (
              <div
                key={subject.courseCode}
                className={`bg-white border rounded-3xl p-5 shadow-xs transition-all space-y-3.5 flex flex-col justify-between ${
                  isCritical ? 'border-rose-300 ring-1 ring-rose-400/30' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[11px] font-bold text-[#1677FF] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block">
                        {subject.courseCode}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">
                        {subject.courseName}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{subject.facultyName}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-xl font-black tabular-nums block ${
                          isSafe ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {subject.percentage}%
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                          isSafe
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {isSafe ? 'Satisfactory' : 'Debarred'}
                      </span>
                    </div>
                  </div>

                  {/* Subject progress bar */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                      <span>{subject.attendedClasses} attended</span>
                      <span>{subject.totalClasses} total</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isSafe ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(subject.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Simulation Action Bar */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">Simulate Biometric:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleSimulateLog(subject.courseCode, true)}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-700 font-bold rounded-lg border border-emerald-200 transition-all text-[11px]"
                    >
                      + Present
                    </button>
                    <button
                      onClick={() => handleSimulateLog(subject.courseCode, false)}
                      className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 active:scale-95 text-rose-700 font-bold rounded-lg border border-rose-200 transition-all text-[11px]"
                    >
                      + Absent
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
