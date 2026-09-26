import React, { useState } from 'react';
import {
  CalendarCheck,
  FileCheck2,
  AlertTriangle,
  Bell,
  Clock,
  ChevronRight,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Calendar,
  KeyRound,
  FileBadge,
  PlusCircle,
  Utensils,
  CreditCard,
  QrCode,
  Check,
  ArrowRight,
  Activity,
  Star,
  MapPin,
} from 'lucide-react';
import { STUDENT_PROFILE } from '../../data/mockCampusData';
import { FEATURED_NOTICE, EMERGENCY_NOTICE } from '../../data/mockNotices';
import { NavigationTab } from '../../types/campus';
import { useCampusData } from '../../context/CampusDataContext';

interface DashboardViewProps {
  onNavigate: (tab: NavigationTab) => void;
  onSelectNotice?: (notice: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onSelectNotice,
}) => {
  const {
    complaints,
    certificateRequests,
    gatePasses,
    attendanceRecords,
    overallAttendancePercentage,
    notices,
    notifications,
    cancelledClasses,
  } = useCampusData();

  const [toast, setToast] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const unreadNoticesCount = notices.filter((n) => !n.isRead).length;
  const activeComplaintsCount = complaints.filter((c) => c.status !== 'Closed').length;
  const readyCertificatesCount = certificateRequests.filter((r) => r.status === 'Approved').length;
  const pendingCertificatesCount = certificateRequests.filter((r) => r.status === 'Submitted' || r.status === 'Under Review').length;

  const overallAttended = attendanceRecords.reduce((acc, s) => acc + s.attendedClasses, 0);
  const overallTotal = attendanceRecords.reduce((acc, s) => acc + s.totalClasses, 0);
  const overallPercentage = overallAttendancePercentage;

  // Active or latest Gate Pass
  const latestGatePass = gatePasses[0] || null;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#2563EB] rounded-3xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/25 border border-blue-400/30 text-blue-200">
              <Sparkles className="w-3 h-3" />
              <span>Apna Campus • One Campus. Everything Connected.</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Welcome, {STUDENT_PROFILE.name}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              {STUDENT_PROFILE.degree} • {STUDENT_PROFILE.year} • Roll: {STUDENT_PROFILE.rollNumber}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-white/10 backdrop-blur-xs border border-white/15 px-3.5 py-2 rounded-2xl text-left">
              <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-semibold">
                Hostel Residence
              </span>
              <span className="text-xs font-bold text-white">
                {STUDENT_PROFILE.hostel} • {STUDENT_PROFILE.room}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS BUTTONS (Module 1 Requirement: 5 Working Buttons) */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 block">
          Quick Actions & Service Desks
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Action 1: Report Complaint */}
          <button
            onClick={() => onNavigate('Complaints')}
            className="p-3.5 bg-white border border-slate-200 hover:border-blue-400 rounded-2xl flex items-center gap-3 text-left shadow-xs hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 block group-hover:text-[#1677FF] truncate">
                Report Complaint
              </span>
              <span className="text-[10px] text-slate-500 block truncate">Hostel & Labs</span>
            </div>
          </button>

          {/* Action 2: Request Certificate */}
          <button
            onClick={() => onNavigate('Requests')}
            className="p-3.5 bg-white border border-slate-200 hover:border-blue-400 rounded-2xl flex items-center gap-3 text-left shadow-xs hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <FileBadge className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 block group-hover:text-[#1677FF] truncate">
                Request Certificate
              </span>
              <span className="text-[10px] text-slate-500 block truncate">Bonafide & NOC</span>
            </div>
          </button>

          {/* Action 3: Apply Gate Pass */}
          <button
            onClick={() => onNavigate('Gate Pass')}
            className="p-3.5 bg-white border border-slate-200 hover:border-blue-400 rounded-2xl flex items-center gap-3 text-left shadow-xs hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1677FF] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <KeyRound className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 block group-hover:text-[#1677FF] truncate">
                Apply Gate Pass
              </span>
              <span className="text-[10px] text-slate-500 block truncate">QR Clearance</span>
            </div>
          </button>

          {/* Action 4: View Notices */}
          <button
            onClick={() => onNavigate('Notices')}
            className="p-3.5 bg-white border border-slate-200 hover:border-blue-400 rounded-2xl flex items-center gap-3 text-left shadow-xs hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Bell className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 block group-hover:text-[#1677FF] truncate">
                View Notices
              </span>
              <span className="text-[10px] text-slate-500 block truncate">Campus Bulletins</span>
            </div>
          </button>

          {/* Action 5: View Timetable */}
          <button
            onClick={() => onNavigate('Timetable')}
            className="p-3.5 bg-white border border-slate-200 hover:border-blue-400 rounded-2xl flex items-center gap-3 text-left shadow-xs hover:shadow-md transition-all group col-span-2 sm:col-span-1"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 block group-hover:text-[#1677FF] truncate">
                View Timetable
              </span>
              <span className="text-[10px] text-slate-500 block truncate">Lectures & Labs</span>
            </div>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards: Desktop 4-col, Tablet 2-col, Mobile 1-col */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Attendance Widget */}
        <div
          onClick={() => onNavigate('Attendance')}
          className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Attendance Status
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1677FF] flex items-center justify-center group-hover:scale-105 transition-transform">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                {overallPercentage}%
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ml-2 ${
                overallPercentage >= 75 ? 'text-emerald-600 bg-emerald-50 border border-emerald-200' : 'text-rose-600 bg-rose-50 border border-rose-200'
              }`}>
                {overallPercentage >= 75 ? 'Good Standing' : 'Debarment Risk'}
              </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#1677FF] transition-colors" />
          </div>
          <div className="mt-2.5 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${overallPercentage >= 75 ? 'bg-[#1677FF]' : 'bg-rose-500'}`}
              style={{ width: `${Math.min(overallPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Certificate Requests Widget */}
        <div
          onClick={() => onNavigate('Requests')}
          className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Certificates & Requests
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                {readyCertificatesCount} Ready
              </span>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md ml-2">
                {pendingCertificatesCount} Pending
              </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#1677FF] transition-colors" />
          </div>
          <p className="mt-2 text-[11px] text-slate-500 truncate">
            {readyCertificatesCount > 0 ? 'Digital certificate available to download' : 'Track your clearance approvals'}
          </p>
        </div>

        {/* Complaints Widget */}
        <div
          onClick={() => onNavigate('Complaints')}
          className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Complaints & Tickets
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 tabular-nums">
                {activeComplaintsCount} Active
              </span>
              <span className="text-xs font-semibold text-slate-500 ml-2">
                #{complaints[0]?.id || 'CMP-1024'}
              </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#1677FF] transition-colors" />
          </div>
          <p className="mt-2 text-[11px] text-slate-500 truncate">
            {complaints[0]?.title || 'Maintenance auto-triage active'}
          </p>
        </div>

        {/* Notices Widget */}
        <div
          onClick={() => onNavigate('Notices')}
          className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Notices & Alerts
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Bell className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#1677FF] tabular-nums">
                {unreadNoticesCount} Unread
              </span>
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md ml-2">
                1 Emergency
              </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#1677FF] transition-colors" />
          </div>
          <p className="mt-2 text-[11px] text-slate-500 truncate">
            Mid-Sem Exam & Hall Ticket released
          </p>
        </div>
      </div>

      {/* Emergency Alert Banner */}
      <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-rose-800 uppercase tracking-wider">
                Emergency Alert
              </span>
              <span className="text-[10px] bg-rose-200 text-rose-800 px-1.5 py-0.2 rounded font-bold">
                Hostel B
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-rose-900 mt-0.5">
              {EMERGENCY_NOTICE.title}
            </p>
            <p className="text-xs text-rose-700">
              {EMERGENCY_NOTICE.summary}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            if (onSelectNotice) onSelectNotice(EMERGENCY_NOTICE);
          }}
          className="w-full sm:w-auto min-h-[44px] px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs active:scale-95"
        >
          Review & Acknowledge
        </button>
      </div>

      {/* ROW: Gate Pass Status + Mess Menu + Pending Fees Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Gate Pass Status Widget */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#1677FF] flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Gate Pass Status</h3>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              latestGatePass?.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {latestGatePass ? latestGatePass.status : 'No Pass'}
            </span>
          </div>

          {latestGatePass ? (
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#1677FF] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {latestGatePass.id}
                </span>
                <span className="text-slate-500 font-medium">Curfew: 09:30 PM</span>
              </div>
              <p className="font-semibold text-slate-800">{latestGatePass.destination}</p>
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span>Dep: {latestGatePass.departureTime}</span>
                <span>Ret: {latestGatePass.expectedReturnTime}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">No active out-of-campus passes.</p>
          )}

          <button
            onClick={() => onNavigate('Gate Pass')}
            className="w-full min-h-[40px] px-3 py-2 bg-blue-50 hover:bg-blue-100 text-[#1677FF] font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>View Pass QR / Apply New</span>
          </button>
        </div>

        {/* Mess Menu Widget */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Utensils className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Today's Dining (Wednesday)</h3>
            </div>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              Lunch Next
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="font-bold text-slate-800">Lunch (12:30 - 02:30 PM):</span>
              <span className="text-slate-500 text-[11px]">750 kcal</span>
            </div>
            <p className="text-slate-600 line-clamp-2">
              Shahi Paneer, Chana Dal, Jeera Rice, Butter Roti, Fresh Salad
            </p>
            <div className="pt-1 flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="text-[11px] font-bold text-slate-600 ml-1">4.4/5 Student Rating</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('Mess')}
            className="w-full min-h-[40px] px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <span>Weekly Menu & Meal Feedback</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pending Fees Widget */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Fees & Financial Dues</h3>
            </div>
            <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
              Due in 7 Days
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-baseline">
              <span className="text-slate-500">Pending Amount:</span>
              <span className="text-xl font-black text-rose-600">₹12,500</span>
            </div>
            <p className="text-slate-600">Mid-Semester Exam Fee & Practical Lab Assessment</p>
            <div className="text-[11px] text-slate-400">Due Date: 30 Sep 2026 • Zero Convenience Fee</div>
          </div>

          <button
            onClick={() => onNavigate('Fees & Dues')}
            className="w-full min-h-[40px] px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
          >
            <span>Pay Now (Mock Checkout)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Two Column Layout: Today's Schedule & Curated Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Timetable */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1677FF] flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Today's Schedule</h3>
                <p className="text-xs text-slate-500">Wednesday, 23 Sep 2026</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('Timetable')}
              className="text-xs font-semibold text-[#1677FF] hover:underline flex items-center gap-1"
            >
              <span>Full Timetable</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {[
              {
                time: '09:00 AM - 10:00 AM',
                subject: 'Data Structures & Algorithms',
                code: 'CS201',
                room: 'Room 204 • Academic Block A',
                instructor: 'Prof. S. Kumar',
                status: 'Completed',
              },
              {
                time: '11:00 AM - 01:00 PM',
                subject: 'Operating Systems Laboratory',
                code: 'CS203P',
                room: 'Computing Lab 2 • 3rd Floor',
                instructor: 'Prof. A. Singh',
                status: cancelledClasses.includes('CS203P') ? 'Cancelled' : 'Ongoing',
                highlight: true,
              },
              {
                time: '02:30 PM - 03:30 PM',
                subject: 'Discrete Mathematics',
                code: 'MA201',
                room: 'Lecture Hall 101',
                instructor: 'Dr. M. Sharma',
                status: 'Upcoming',
              },
            ].map((slot, index) => (
              <div
                key={index}
                className={`p-3.5 rounded-2xl border transition-all ${
                  slot.highlight
                    ? 'bg-blue-50/70 border-blue-200 ring-1 ring-blue-300/40'
                    : 'bg-slate-50 border-slate-100'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-500">{slot.time}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      slot.status === 'Cancelled'
                        ? 'bg-rose-200 text-rose-800'
                        : slot.status === 'Ongoing'
                        ? 'bg-[#1677FF] text-white animate-pulse'
                        : slot.status === 'Completed'
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {slot.status}
                  </span>
                </div>
                <div className="font-bold text-slate-900 text-xs sm:text-sm">{slot.subject}</div>
                <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                  <span>{slot.room}</span>
                  <span>•</span>
                  <span>{slot.instructor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notices */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1677FF] flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Important Notices</h3>
                <p className="text-xs text-slate-500">Curated for B.Tech CSE 2nd Year</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('Notices')}
              className="text-xs font-semibold text-[#1677FF] hover:underline flex items-center gap-1"
            >
              <span>View All ({unreadNoticesCount} Unread)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            <div
              onClick={() => onSelectNotice && onSelectNotice(FEATURED_NOTICE)}
              className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-2xl cursor-pointer hover:border-blue-400 transition-colors"
            >
              <div className="flex items-center justify-between text-[11px] text-blue-700 font-bold mb-1">
                <span>EXAMINATION UPDATE</span>
                <span>23 Sep 2026</span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                {FEATURED_NOTICE.title}
              </h4>
              <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                {FEATURED_NOTICE.summary}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                  Action Required
                </span>
                <p className="text-xs font-bold text-slate-800">
                  Mess Rebate Application Window Open
                </p>
                <span className="text-[11px] text-slate-500">Hostel & Dining Council</span>
              </div>
              <button
                onClick={() => onNavigate('Mess')}
                className="min-h-[44px] px-3.5 py-1.5 text-xs font-semibold text-[#1677FF] hover:bg-blue-50 rounded-xl"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY STREAM (Module 1 Requirement: Live complaints, requests, gate passes, notifications) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#1677FF]" />
            <h3 className="text-sm font-bold text-slate-900">Recent Student Activity & Audit Stream</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Real-time sync from campus data layer</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Latest Complaints */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Recent Maintenance Complaints
            </span>
            {complaints.slice(0, 2).map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => onNavigate('Complaints')}
                className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl cursor-pointer transition-colors text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#1677FF]">{ticket.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    ticket.status === 'Resolved' || ticket.status === 'Closed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
                <p className="font-semibold text-slate-900 truncate">{ticket.title}</p>
                <span className="text-[10px] text-slate-400">{ticket.hostel} • {ticket.createdAt}</span>
              </div>
            ))}
          </div>

          {/* Latest Certificate Requests & Notifications */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Recent Requests & Push Alerts
            </span>
            {certificateRequests.slice(0, 1).map((req) => (
              <div
                key={req.id}
                onClick={() => onNavigate('Requests')}
                className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl cursor-pointer transition-colors text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-emerald-700">{req.id}</span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    {req.status}
                  </span>
                </div>
                <p className="font-semibold text-slate-900 truncate">{req.type}</p>
                <span className="text-[10px] text-slate-400">Purpose: {req.purpose} • {req.createdAt}</span>
              </div>
            ))}

            {notifications.slice(0, 1).map((ntf) => (
              <div
                key={ntf.id}
                onClick={() => onNavigate('Notices')}
                className="p-3 bg-blue-50/60 hover:bg-blue-100/60 border border-blue-200 rounded-2xl cursor-pointer transition-colors text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1677FF]">{ntf.title}</span>
                  <span className="text-[10px] text-slate-400">{ntf.timestamp}</span>
                </div>
                <p className="text-slate-600 line-clamp-1">{ntf.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
