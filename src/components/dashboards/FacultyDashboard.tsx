import React, { useState } from 'react';
import {
  Users,
  CalendarCheck,
  Clock,
  BookOpen,
  BellRing,
  FileText,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Download,
  Filter,
  Plus,
  Send,
  Building,
  Check,
  X,
  Eye,
  Search,
  Calendar,
  AlertTriangle,
  History,
  Save,
} from 'lucide-react';
import { UserAccount } from '../../types/auth';
import { useCampusData } from '../../context/CampusDataContext';
import { CertificatePreviewModal } from '../modals/CertificatePreviewModal';
import { CertificateRequest } from '../../types/store';

interface FacultyDashboardProps {
  user: UserAccount;
  onLogout: () => void;
}

interface StudentAttendanceEntry {
  roll: string;
  name: string;
  status: 'Present' | 'Absent';
  overallRate: number;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ user, onLogout }) => {
  const {
    attendanceRecords,
    markClassAttendance,
    cancelledClasses,
    cancelClass,
    certificateRequests,
    reviewCertificateRequest,
    createNotice,
    notices,
  } = useCampusData();

  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'timetable' | 'students' | 'requests' | 'history'>('overview');
  const [toast, setToast] = useState<string | null>(null);
  const [previewCert, setPreviewCert] = useState<CertificateRequest | null>(null);

  // Attendance Controls State
  const [selectedClass, setSelectedClass] = useState('B.Tech CSE Year 2 - Sec A');
  const [selectedSubject, setSelectedSubject] = useState('CS201 - Data Structures');
  const [selectedDate, setSelectedDate] = useState('2026-09-23');

  // Student Attendance Roster State
  const [roster, setRoster] = useState<StudentAttendanceEntry[]>([
    { roll: '2024CS1040', name: 'Aarav Mehta', status: 'Present', overallRate: 92 },
    { roll: '2024CS1041', name: 'Aditi Deshmukh', status: 'Present', overallRate: 88 },
    { roll: '2024CS1042', name: 'Manoj Kumar Jena (Student)', status: 'Present', overallRate: 82 },
    { roll: '2024CS1043', name: 'Rohan Iyer', status: 'Absent', overallRate: 69 },
    { roll: '2024CS1044', name: 'Sneha Kulkarni', status: 'Present', overallRate: 95 },
    { roll: '2024CS1045', name: 'Tanmay Bhatt', status: 'Present', overallRate: 78 },
  ]);

  // Attendance Session History
  const [attendanceHistory, setAttendanceHistory] = useState([
    { id: 'att-hist-1', date: '2026-09-22', subject: 'CS201', class: 'CSE 2A', present: 38, absent: 4, percentage: 90.4 },
    { id: 'att-hist-2', date: '2026-09-21', subject: 'CS203P', class: 'CSE 2A', present: 41, absent: 1, percentage: 97.6 },
    { id: 'att-hist-3', date: '2026-09-19', subject: 'CS201', class: 'CSE 2A', present: 36, absent: 6, percentage: 85.7 },
  ]);

  // Class cancellation modal
  const [cancelModalClass, setCancelModalClass] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('Faculty on conference duty; makeup class on Saturday 11:00 AM');

  // Post Notice Modal
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<'Academic' | 'Examination' | 'Events' | 'Emergency'>('Academic');
  const [noticePriority, setNoticePriority] = useState<'Important' | 'Emergency' | 'Regular'>('Important');
  const [noticeAudience, setNoticeAudience] = useState<'All Students' | 'Faculty' | 'CSE' | '2nd Year' | 'Hostel' | 'All'>('CSE');
  const [noticeContent, setNoticeContent] = useState('');

  // Reject Request Modal
  const [rejectModalReq, setRejectModalReq] = useState<CertificateRequest | null>(null);
  const [rejectRemarks, setRejectRemarks] = useState('Insufficient attendance or missing advisor signoff');

  // Student search
  const [studentSearch, setStudentSearch] = useState('');

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const pendingRequests = certificateRequests.filter((r) => r.status === 'Submitted' || r.status === 'Under Review');

  const todayClasses = [
    { code: 'CS201', name: 'Data Structures & Algorithms', time: '10:00 AM - 11:30 AM', room: 'Hall 301', section: 'A' },
    { code: 'CS203P', name: 'Design and Analysis of Algorithms Lab', time: '02:00 PM - 04:00 PM', room: 'Software Lab 2', section: 'B' },
    { code: 'CS402', name: 'Distributed Systems & Cloud', time: '04:15 PM - 05:30 PM', room: 'Room 412', section: 'A' },
  ];

  const handleToggleStatus = (roll: string, status: 'Present' | 'Absent') => {
    setRoster((prev) =>
      prev.map((s) => (s.roll === roll ? { ...s, status } : s))
    );
  };

  const handleMarkAllPresent = () => {
    setRoster((prev) => prev.map((s) => ({ ...s, status: 'Present' })));
    triggerToast('All students marked Present');
  };

  const handleSaveAttendance = () => {
    const presentCount = roster.filter((s) => s.status === 'Present').length;
    const totalCount = roster.length;
    const calculatedRate = Math.round((presentCount / totalCount) * 100);

    // Update global store for student Manoj Kumar Jena if in roster
    const rahul = roster.find((r) => r.roll === '2024CS1042');
    if (rahul) {
      markClassAttendance('CS201', '2024CS1042', rahul.status === 'Present');
    }

    // Add to history
    const newHistEntry = {
      id: `att-hist-${Date.now()}`,
      date: selectedDate,
      subject: selectedSubject.split(' ')[0],
      class: selectedClass,
      present: presentCount,
      absent: totalCount - presentCount,
      percentage: calculatedRate,
    };
    setAttendanceHistory((prev) => [newHistEntry, ...prev]);

    triggerToast(`Attendance saved: ${presentCount}/${totalCount} (${calculatedRate}%) recorded for ${selectedSubject}`);
  };

  const handleConfirmCancelClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalClass) return;
    cancelClass(cancelModalClass, user.name, cancelReason);
    triggerToast(`Class ${cancelModalClass} marked Cancelled. Broadcasted alert to enrolled students.`);
    setCancelModalClass(null);
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim()) return;

    createNotice({
      title: noticeTitle,
      category: noticeCategory,
      priority: noticePriority,
      description: noticeContent,
      targetAudience: noticeAudience,
      postedBy: user.name,
    });

    setShowNoticeModal(false);
    setNoticeTitle('');
    setNoticeContent('');
    triggerToast('Department notice published to Apna Campus bulletins!');
  };

  const handleApproveRequest = (req: CertificateRequest) => {
    reviewCertificateRequest(req.id, 'Approved', user.name);
    triggerToast(`Approved request ${req.id} for ${req.studentName}. Generated digital certificate!`);
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalReq) return;
    reviewCertificateRequest(rejectModalReq.id, 'Rejected', user.name, rejectRemarks);
    triggerToast(`Declined request ${rejectModalReq.id}`);
    setRejectModalReq(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Role Notice & Welcome Hero */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Academic Faculty Hub
              </span>
              <span className="text-xs text-slate-300">Employee ID: FAC-1092</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {user.name} 🎓
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/90 max-w-xl">
              Department of {user.department} • Manage class attendance, publish lecture announcements, reschedule periods, and approve certificate requests.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowNoticeModal(true)}
              className="min-h-[44px] px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Class Notice</span>
            </button>
          </div>
        </div>
      </div>

      {/* Faculty Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'Faculty Overview', icon: BookOpen },
          { id: 'attendance', label: 'Mark Attendance', icon: CalendarCheck },
          { id: 'history', label: 'Attendance History', icon: History },
          { id: 'timetable', label: 'Timetable & Classes', icon: Clock },
          { id: 'students', label: 'Student Directory', icon: Users },
          { id: 'requests', label: `Student Requests (${pendingRequests.length})`, icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`min-h-[44px] px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Today's Lectures</span>
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900">{todayClasses.length} Sessions</span>
                <p className="text-[11px] text-slate-500 mt-1">CS201, CS203P, CS402</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Enrolled Students</span>
                <Users className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900">128 Students</span>
                <p className="text-[11px] text-slate-500 mt-1">Across 3 Lecture Sections</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Attendance Pending</span>
                <CalendarCheck className="w-5 h-5 text-amber-500" />
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-amber-600">1 Class</span>
                <p className="text-[11px] text-slate-500 mt-1">CS203P Afternoon Lab</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Approvals</span>
                <FileText className="w-5 h-5 text-purple-500" />
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-purple-600">{pendingRequests.length} Requests</span>
                <p className="text-[11px] text-slate-500 mt-1">Bonafide & Lab NOCs</p>
              </div>
            </div>
          </div>

          {/* Today's Schedule Overview */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Today's Teaching Schedule</h2>
              <button
                onClick={() => setActiveTab('timetable')}
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                <span>View Full Timetable</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {todayClasses.map((c) => {
                const isCancelled = cancelledClasses.includes(c.code);
                return (
                  <div
                    key={c.code}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {c.code}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">{c.name}</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                          Sec {c.section}
                        </span>
                      </div>
                      <p className="text-slate-500 mt-1">
                        {c.time} • Room {c.room}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          isCancelled ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isCancelled ? 'Cancelled' : 'Scheduled'}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedSubject(`${c.code} - ${c.name}`);
                          setActiveTab('attendance');
                        }}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
                      >
                        Mark Roster
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Mark Attendance (Module 2 Requirement) */}
      {activeTab === 'attendance' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Biometric & Classroom Attendance Logger</h2>
              <p className="text-xs text-slate-500">
                Select Class, Subject, and Date to review and record lecture attendance
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleMarkAllPresent}
                className="px-3.5 py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 font-bold rounded-xl text-xs transition-colors"
              >
                Mark All Present
              </button>
              <button
                onClick={handleSaveAttendance}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Attendance</span>
              </button>
            </div>
          </div>

          {/* Selectors: Class, Subject, Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Class / Batch</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-medium"
              >
                <option value="B.Tech CSE Year 2 - Sec A">B.Tech CSE Year 2 - Sec A</option>
                <option value="B.Tech CSE Year 2 - Sec B">B.Tech CSE Year 2 - Sec B</option>
                <option value="B.Tech CSE Year 3 - Sec A">B.Tech CSE Year 3 - Sec A</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-medium"
              >
                <option value="CS201 - Data Structures">CS201 - Data Structures</option>
                <option value="CS203P - OS & Algorithms Lab">CS203P - OS & Algorithms Lab</option>
                <option value="CS402 - Distributed Computing">CS402 - Distributed Computing</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Lecture Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-medium"
              />
            </div>
          </div>

          {/* Auto-Calculated Stats */}
          <div className="flex items-center justify-between px-3 py-2 bg-blue-50/60 rounded-xl border border-blue-200 text-xs text-blue-900">
            <span>
              <strong>Present:</strong> {roster.filter((s) => s.status === 'Present').length} / {roster.length}
            </span>
            <span>
              <strong>Absent:</strong> {roster.filter((s) => s.status === 'Absent').length}
            </span>
            <span>
              <strong>Calculated Session Attendance:</strong>{' '}
              <span className="font-extrabold">
                {Math.round((roster.filter((s) => s.status === 'Present').length / roster.length) * 100)}%
              </span>
            </span>
          </div>

          {/* Student List Table: Student ID | Student Name | Present | Absent */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Cumulative %</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {roster.map((st) => (
                  <tr key={st.roll} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{st.roll}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {st.name}
                      {st.overallRate < 75 && (
                        <span className="ml-2 text-[10px] text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded font-bold">
                          Below 75%
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-600">{st.overallRate}%</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          st.status === 'Present'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {st.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleStatus(st.roll, 'Present')}
                        className={`min-h-[34px] px-3 py-1 rounded-xl font-bold text-xs transition-all ${
                          st.status === 'Present'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                        }`}
                      >
                        Mark Present
                      </button>
                      <button
                        onClick={() => handleToggleStatus(st.roll, 'Absent')}
                        className={`min-h-[34px] px-3 py-1 rounded-xl font-bold text-xs transition-all ${
                          st.status === 'Absent'
                            ? 'bg-rose-600 text-white'
                            : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                        }`}
                      >
                        Mark Absent
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Attendance History */}
      {activeTab === 'history' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Attendance Log History</h2>
              <p className="text-xs text-slate-500">Historical records of verified classroom attendance sessions</p>
            </div>
            <span className="text-xs font-bold text-slate-500">{attendanceHistory.length} Sessions Logged</span>
          </div>

          <div className="space-y-3">
            {attendanceHistory.map((hist) => (
              <div
                key={hist.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#1677FF] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {hist.subject}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{hist.class}</span>
                    <span className="text-slate-500">• Date: {hist.date}</span>
                  </div>
                  <p className="text-slate-600 mt-1">
                    Present: <strong>{hist.present}</strong> | Absent: <strong>{hist.absent}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-sm font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
                    {hist.percentage}% Turnout
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Timetable */}
      {activeTab === 'timetable' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Faculty Weekly Timetable & Cancellation Controls</h2>
              <p className="text-xs text-slate-500">Cancelling updates student schedules and dispatches real-time broadcast alerts</p>
            </div>
            <span className="text-xs font-bold text-slate-500">{todayClasses.length} Scheduled Slots</span>
          </div>

          <div className="space-y-3">
            {todayClasses.map((cls) => {
              const isCancelled = cancelledClasses.includes(cls.code);
              return (
                <div
                  key={cls.code}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {cls.code}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">{cls.name}</span>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">
                        Section {cls.section}
                      </span>
                    </div>
                    <p className="text-slate-500 mt-1">
                      {cls.time} • Room {cls.room}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        isCancelled ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isCancelled ? 'Cancelled' : 'Scheduled'}
                    </span>
                    {!isCancelled && (
                      <button
                        onClick={() => setCancelModalClass(cls.code)}
                        className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl text-xs"
                      >
                        Cancel / Reschedule
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Students Directory */}
      {activeTab === 'students' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Enrolled Student Directory</h2>
              <p className="text-xs text-slate-500">Search students across classes and monitor attendance risk status</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search roll or name..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {roster
              .filter(
                (s) =>
                  s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                  s.roll.toLowerCase().includes(studentSearch.toLowerCase())
              )
              .map((s) => (
                <div key={s.roll} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded mr-2">
                      {s.roll}
                    </span>
                    <span className="font-bold text-slate-800">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-600">Attendance: {s.overallRate}%</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        s.overallRate >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {s.overallRate >= 75 ? 'Regular' : 'Warning'}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Requests */}
      {activeTab === 'requests' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Student Academic Requests & Certificate Endorsements
              </h2>
              <p className="text-xs text-slate-500">
                Approving generates cryptographic signature and releases official downloadable certificate
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">{certificateRequests.length} Applications</span>
          </div>

          <div className="space-y-3">
            {certificateRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-[#1677FF] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {req.id}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{req.studentName} ({req.rollNumber})</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        req.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-800">{req.type} • Purpose: {req.purpose}</p>
                  <p className="text-slate-500">
                    Department: {req.department} • Year: {req.academicYear} • Submitted: {req.createdAt}
                  </p>
                  {req.verificationCode && (
                    <div className="text-[11px] font-bold text-emerald-700">
                      Verification Reference: {req.verificationCode}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {req.status !== 'Approved' && req.status !== 'Rejected' && (
                    <>
                      <button
                        onClick={() => handleApproveRequest(req)}
                        className="min-h-[40px] px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs"
                      >
                        Approve & Issue Certificate
                      </button>
                      <button
                        onClick={() => setRejectModalReq(req)}
                        className="min-h-[40px] px-3.5 py-2 bg-slate-200 hover:bg-rose-100 text-slate-700 font-bold rounded-xl text-xs"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {req.status === 'Approved' && (
                    <button
                      onClick={() => setPreviewCert(req)}
                      className="min-h-[40px] px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-bold rounded-xl text-xs flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview Digital Certificate</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: Class Cancellation */}
      {cancelModalClass && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Cancel / Reschedule Lecture</h3>
              <button onClick={() => setCancelModalClass(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleConfirmCancelClass} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason for Cancellation</label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="State reason and makeup schedule..."
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelModalClass(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
                >
                  Broadcast Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Reject Certificate Request */}
      {rejectModalReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Decline Certificate Application</h3>
              <button onClick={() => setRejectModalReq(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleConfirmReject} className="space-y-3 text-xs">
              <p className="text-slate-600">
                Declining application <strong>{rejectModalReq.id}</strong> for {rejectModalReq.studentName}.
              </p>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Administrative Remarks / Reason</label>
                <textarea
                  value={rejectRemarks}
                  onChange={(e) => setRejectRemarks(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="Specify why the certificate request cannot be granted..."
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalReq(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
                >
                  Confirm Decline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Post Notice */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Publish Department Circular</h3>
              <button onClick={() => setShowNoticeModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateNotice} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Circular Title</label>
                <input
                  type="text"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g. Mid-term practical lab assessment submission deadlines"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={noticeCategory}
                    onChange={(e) => setNoticeCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Examination">Examination</option>
                    <option value="Events">Events</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={noticePriority}
                    onChange={(e) => setNoticePriority(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Important">Important</option>
                    <option value="Regular">Regular</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Audience</label>
                <select
                  value={noticeAudience}
                  onChange={(e) => setNoticeAudience(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="CSE">B.Tech CSE Students</option>
                  <option value="2nd Year">2nd Year All Branches</option>
                  <option value="All Students">All Campus Students</option>
                  <option value="Faculty">Faculty Only</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  rows={4}
                  placeholder="Type official details, venue, dates, or guidelines..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Digital Certificate Modal */}
      {previewCert && (
        <CertificatePreviewModal
          isOpen={!!previewCert}
          request={previewCert}
          onClose={() => setPreviewCert(null)}
        />
      )}
    </div>
  );
};
