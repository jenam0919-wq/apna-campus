import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  GraduationCap,
  Building,
  Wrench,
  Receipt,
  FileCheck2,
  BellRing,
  Settings,
  Search,
  CheckCircle2,
  AlertCircle,
  Download,
  Activity,
  Layers,
  Sparkles,
  Filter,
  UserCheck,
  UserX,
  Plus,
  Send,
  X,
  Clock,
  Check,
  TrendingUp,
  BarChart3,
  FileSpreadsheet,
  Utensils,
  CreditCard,
  Bed,
  Edit2,
  Trash2,
  Eye,
  AlertTriangle,
} from 'lucide-react';
import { UserAccount, UserRole } from '../../types/auth';
import { useCampusData } from '../../context/CampusDataContext';
import { Complaint, CertificateRequest } from '../../types/store';
import { CertificatePreviewModal } from '../modals/CertificatePreviewModal';

interface AdminDashboardProps {
  user: UserAccount;
  onLogout: () => void;
}

type AdminTab =
  | 'overview'
  | 'users'
  | 'students'
  | 'faculty'
  | 'wardens'
  | 'staff'
  | 'complaints'
  | 'requests'
  | 'notices'
  | 'hostel'
  | 'mess'
  | 'fees'
  | 'analytics'
  | 'audit'
  | 'settings';

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  active: boolean;
  phone?: string;
  roomOrHostel?: string;
  yearOrDesignation?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const {
    complaints,
    updateComplaintStatus,
    reassignComplaint,
    certificateRequests,
    reviewCertificateRequest,
    gatePasses,
    attendanceRecords,
    notices,
    createNotice,
    auditLogs,
  } = useCampusData();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [toast, setToast] = useState<string | null>(null);

  // Complaints filter state
  const [complaintCategoryFilter, setComplaintCategoryFilter] = useState<string>('All');
  const [complaintPriorityFilter, setComplaintPriorityFilter] = useState<string>('All');
  const [complaintStatusFilter, setComplaintStatusFilter] = useState<string>('All');
  const [complaintSearch, setComplaintSearch] = useState('');

  // Selected complaint for Admin Modal Action
  const [assignModalComplaint, setAssignModalComplaint] = useState<Complaint | null>(null);
  const [assignedStaffName, setAssignedStaffName] = useState('Rajesh Verma (Facilities Lead)');
  const [assignPriority, setAssignPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [adminNote, setAdminNote] = useState('');

  // Broadcast Notice Modal
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [bTitle, setBTitle] = useState('');
  const [bCategory, setBCategory] = useState<'Academic' | 'Examination' | 'Hostel' | 'Events' | 'Fees' | 'Emergency'>('Emergency');
  const [bPriority, setBPriority] = useState<'Important' | 'Emergency' | 'Regular'>('Emergency');
  const [bAudience, setBAudience] = useState<'All Students' | 'Faculty' | 'CSE' | '2nd Year' | 'Hostel' | 'All'>('All');
  const [bContent, setBContent] = useState('');

  // Universal Managed Users Directory
  const [managedUsers, setManagedUsers] = useState<ManagedUser[]>([
    { id: 'STU-1042', name: 'Manoj Kumar Jena', email: 'student@campus360.demo', role: 'Student', department: 'Computer Science', active: true, phone: '+91 98765 43210', roomOrHostel: 'Aryabhata B-312', yearOrDesignation: '3rd Year' },
    { id: 'STU-1043', name: 'Aarav Patel', email: 'aarav.patel@campus360.demo', role: 'Student', department: 'Computer Science', active: true, phone: '+91 98765 43211', roomOrHostel: 'Aryabhata B-204', yearOrDesignation: '3rd Year' },
    { id: 'STU-1044', name: 'Priya Nambiar', email: 'priya.n@campus360.demo', role: 'Student', department: 'Electronics & Comm', active: false, phone: '+91 98765 43212', roomOrHostel: 'Gargi Hall G-102', yearOrDesignation: '2nd Year' },
    { id: 'FAC-1092', name: 'Dr. Anand Singh', email: 'faculty@campus360.demo', role: 'Faculty', department: 'Computer Science', active: true, phone: '+91 98765 43220', yearOrDesignation: 'Associate Professor & HOD' },
    { id: 'FAC-1093', name: 'Prof. T. Sharma', email: 't.sharma@campus360.demo', role: 'Faculty', department: 'Computer Science', active: true, phone: '+91 98765 43221', yearOrDesignation: 'Assistant Professor' },
    { id: 'WRD-201', name: 'Er. Sandeep Rathore', email: 'warden@campus360.demo', role: 'Warden', department: 'Hostel Block B Council', active: true, phone: '+91 98765 43230', roomOrHostel: 'Aryabhata Bhavan', yearOrDesignation: 'Senior Warden' },
    { id: 'WRD-202', name: 'Dr. Sunita Deshmukh', email: 'sunita.d@campus360.demo', role: 'Warden', department: 'Girls Hostel Council', active: true, phone: '+91 98765 43231', roomOrHostel: 'Gargi Bhavan', yearOrDesignation: 'Chief Warden' },
    { id: 'STF-301', name: 'Rajesh Verma', email: 'staff@campus360.demo', role: 'Staff', department: 'Plumbing & Facilities', active: true, phone: '+91 98765 43240', yearOrDesignation: 'Maintenance Lead' },
    { id: 'STF-302', name: 'K. Somesh', email: 'somesh.k@campus360.demo', role: 'Staff', department: 'Electrical Maintenance', active: true, phone: '+91 98765 43241', yearOrDesignation: 'Chief Electrician' },
    { id: 'ADM-001', name: 'Dr. K. Venkataraman', email: 'admin@campus360.demo', role: 'Admin', department: 'Registrar Office', active: true, phone: '+91 98765 43201', yearOrDesignation: 'Super Administrator' },
  ]);

  // User search & filters
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'All' | UserRole>('All');

  // Add / Edit User Modal
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('Student');
  const [userDept, setUserDept] = useState('Computer Science');
  const [userPhone, setUserPhone] = useState('+91 98765 00000');
  const [userDetail, setUserDetail] = useState('');

  // Certificate preview modal
  const [previewCert, setPreviewCert] = useState<CertificateRequest | null>(null);

  // Settings State
  const [attendanceThreshold, setAttendanceThreshold] = useState(75);
  const [curfewTime, setCurfewTime] = useState('21:30');
  const [institutionName, setInstitutionName] = useState('National Institute of Technology & Sciences');

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Filtered complaints
  const filteredComplaints = complaints.filter((c) => {
    if (complaintCategoryFilter !== 'All' && c.category !== complaintCategoryFilter) return false;
    if (complaintPriorityFilter !== 'All' && c.priority !== complaintPriorityFilter) return false;
    if (complaintStatusFilter !== 'All' && c.status !== complaintStatusFilter) return false;
    if (complaintSearch.trim()) {
      const q = complaintSearch.toLowerCase();
      const match = c.title.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.studentName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModalComplaint) return;

    reassignComplaint(assignModalComplaint.id, assignedStaffName, assignPriority);
    if (adminNote.trim()) {
      updateComplaintStatus(assignModalComplaint.id, assignModalComplaint.status, `Admin Note: ${adminNote}`);
    }

    triggerToast(`Ticket ${assignModalComplaint.id} assigned to ${assignedStaffName} with ${assignPriority} priority.`);
    setAssignModalComplaint(null);
    setAdminNote('');
  };

  const handleCloseTicket = (id: string) => {
    updateComplaintStatus(id, 'Closed', 'Admin officially validated resolution and closed ticket.');
    triggerToast(`Ticket ${id} Closed.`);
  };

  const handleBroadcastNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bTitle.trim()) return;

    createNotice({
      title: bTitle,
      category: bCategory,
      priority: bPriority,
      description: bContent,
      targetAudience: bAudience,
      postedBy: user.name,
    });

    setShowBroadcastModal(false);
    setBTitle('');
    setBContent('');
    triggerToast('Broadcast bulletin officially dispatched to campus devices!');
  };

  const handleExportReport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Ticket ID,Category,Priority,Status,Hostel,Room,Student,Assigned Staff,Created At']
        .concat(
          complaints.map(
            (c) =>
              `${c.id},"${c.category}","${c.priority}","${c.status}","${c.hostel}","${c.room}","${c.studentName}","${c.assignedStaff || 'Unassigned'}","${c.createdAt}"`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Apna_Campus_Operations_Audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Generated and exported Apna Campus Operations CSV Report');
  };

  // User Management Actions
  const handleToggleUserActive = (id: string) => {
    setManagedUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
    );
    triggerToast(`Updated user status for ID ${id}`);
  };

  const handleOpenAddUser = (role?: UserRole) => {
    setEditingUserId(null);
    setUserName('');
    setUserEmail('');
    setUserRole(role || 'Student');
    setUserDept('Computer Science');
    setUserPhone('+91 98765 00000');
    setUserDetail('');
    setShowUserModal(true);
  };

  const handleOpenEditUser = (u: ManagedUser) => {
    setEditingUserId(u.id);
    setUserName(u.name);
    setUserEmail(u.email);
    setUserRole(u.role);
    setUserDept(u.department);
    setUserPhone(u.phone || '+91 98765 00000');
    setUserDetail(u.roomOrHostel || u.yearOrDesignation || '');
    setShowUserModal(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) return;

    if (editingUserId) {
      setManagedUsers((prev) =>
        prev.map((u) =>
          u.id === editingUserId
            ? {
                ...u,
                name: userName,
                email: userEmail,
                role: userRole,
                department: userDept,
                phone: userPhone,
                roomOrHostel: userRole === 'Student' || userRole === 'Warden' ? userDetail : undefined,
                yearOrDesignation: userRole !== 'Student' ? userDetail : undefined,
              }
            : u
        )
      );
      triggerToast(`Updated profile for ${userName} (${editingUserId})`);
    } else {
      const prefix = userRole === 'Student' ? 'STU' : userRole === 'Faculty' ? 'FAC' : userRole === 'Warden' ? 'WRD' : 'STF';
      const newId = `${prefix}-${Math.floor(Math.random() * 9000 + 1000)}`;
      const newUser: ManagedUser = {
        id: newId,
        name: userName,
        email: userEmail,
        role: userRole,
        department: userDept,
        active: true,
        phone: userPhone,
        roomOrHostel: userRole === 'Student' || userRole === 'Warden' ? userDetail : undefined,
        yearOrDesignation: userDetail,
      };
      setManagedUsers((prev) => [newUser, ...prev]);
      triggerToast(`Provisioned new ${userRole} account: ${userName} (${newId})`);
    }

    setShowUserModal(false);
  };

  // Filter users by role and search
  const filteredUsers = managedUsers.filter((u) => {
    if (userRoleFilter !== 'All' && u.role !== userRoleFilter) return false;
    if (userSearch.trim()) {
      const q = userSearch.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q) || u.department.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-purple-500/20 text-purple-300 border border-purple-400/30">
                Central Campus Administration
              </span>
              <span className="text-xs text-slate-300">Super Administrator Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Apna Campus Command Center
            </h1>
            <p className="text-xs sm:text-sm text-purple-200/90 max-w-xl">
              Administrator: {user.name} ({user.department}). Manage campus operations, user RBAC privileges, work orders, certificates, hostelling, and audit logs.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="min-h-[44px] px-4 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all"
            >
              <BellRing className="w-4 h-4" />
              <span>Broadcast Bulletin</span>
            </button>
            <button
              onClick={handleExportReport}
              className="min-h-[44px] px-4 py-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold rounded-xl text-xs sm:text-sm backdrop-blur-xs flex items-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* 15 Sub-Navigation Tabs as Specified in Module 3 */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200">
        {[
          { id: 'overview', label: 'Dashboard', icon: Layers },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'students', label: 'Students', icon: GraduationCap },
          { id: 'faculty', label: 'Faculty', icon: Users },
          { id: 'wardens', label: 'Wardens', icon: Building },
          { id: 'staff', label: 'Staff', icon: Wrench },
          { id: 'complaints', label: `Complaints (${complaints.length})`, icon: AlertTriangle },
          { id: 'requests', label: `Requests (${certificateRequests.length})`, icon: FileCheck2 },
          { id: 'notices', label: 'Notices', icon: BellRing },
          { id: 'hostel', label: 'Hostel', icon: Bed },
          { id: 'mess', label: 'Mess', icon: Utensils },
          { id: 'fees', label: 'Fees', icon: CreditCard },
          { id: 'analytics', label: 'Analytics', icon: Activity },
          { id: 'audit', label: 'Audit Logs', icon: ShieldAlert },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB: Overview (Dashboard) */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Overview Cards (Section 8 Requirement) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { label: 'Total Students', val: '4,250', color: 'text-blue-600' },
              { label: 'Total Faculty', val: '180', color: 'text-emerald-600' },
              { label: 'Total Wardens', val: '12', color: 'text-amber-600' },
              { label: 'Total Staff', val: '45', color: 'text-cyan-600' },
              { label: 'Open Complaints', val: complaints.filter(c => c.status !== 'Closed').length.toString(), color: 'text-rose-600' },
              { label: 'Pending Requests', val: certificateRequests.filter(r => r.status === 'Submitted' || r.status === 'Under Review').length.toString(), color: 'text-purple-600' },
              { label: 'Active Notices', val: notices.length.toString(), color: 'text-indigo-600' },
              { label: 'Hostel Occupancy', val: '94%', color: 'text-slate-800' },
            ].map((m, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block truncate">{m.label}</span>
                <span className={`text-xl font-black ${m.color} tabular-nums block`}>{m.val}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Attendance Analytics Preview */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-900">Department Attendance & Compliance Benchmarks</h2>
                <span className="text-xs text-emerald-600 font-bold">Campus Average: 84.6%</span>
              </div>
              <div className="space-y-3 text-xs">
                {[
                  { dept: 'Computer Science & Engineering', rate: 88, students: 920 },
                  { dept: 'Electronics & Communication', rate: 84, students: 810 },
                  { dept: 'Mechanical Engineering', rate: 79, students: 740 },
                  { dept: 'Civil Engineering', rate: 83, students: 620 },
                  { dept: 'Information Technology', rate: 87, students: 780 },
                ].map((d, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between font-semibold text-slate-700">
                      <span>{d.dept} ({d.students} students)</span>
                      <span className="font-bold">{d.rate}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-full rounded-full" style={{ width: `${d.rate}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SLA Performance */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-900">Campus Operations SLA</h2>
                <span className="text-xs text-purple-600 font-bold">Live Target</span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <div className="flex justify-between text-slate-500">
                    <span>Plumbing Resolution Avg</span>
                    <strong className="text-slate-800">4.2 hrs</strong>
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold">Under 6h SLA benchmark</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <div className="flex justify-between text-slate-500">
                    <span>Certificate Turnaround</span>
                    <strong className="text-slate-800">18.5 hrs</strong>
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold">Under 24h digital policy</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <div className="flex justify-between text-slate-500">
                    <span>Gate Pass Verification</span>
                    <strong className="text-slate-800">Instant (QR)</strong>
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold">100% digital pass clearance</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Users (Global RBAC Directory) */}
      {(activeTab === 'users' || activeTab === 'students' || activeTab === 'faculty' || activeTab === 'wardens' || activeTab === 'staff') && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 capitalize">
                {activeTab === 'users' ? 'Campus User Management (RBAC)' : `${activeTab} Management`}
              </h2>
              <p className="text-xs text-slate-500">
                Create, edit, view, disable accounts and enforce identity permissions
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  handleOpenAddUser(
                    activeTab === 'students' ? 'Student' : activeTab === 'faculty' ? 'Faculty' : activeTab === 'wardens' ? 'Warden' : activeTab === 'staff' ? 'Staff' : undefined
                  )
                }
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>
                  Add {activeTab === 'students' ? 'Student' : activeTab === 'faculty' ? 'Faculty' : activeTab === 'wardens' ? 'Warden' : activeTab === 'staff' ? 'Staff' : 'User'}
                </span>
              </button>
            </div>
          </div>

          {/* Search & Role Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search by name, ID, email, or department..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            {activeTab === 'users' && (
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                {(['All', 'Student', 'Faculty', 'Warden', 'Staff', 'Admin'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setUserRoleFilter(r as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                      userRoleFilter === r
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Users Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="py-3 px-4">User ID</th>
                  <th className="py-3 px-4">Name & Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Department / Details</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers
                  .filter((u) => {
                    if (activeTab === 'students') return u.role === 'Student';
                    if (activeTab === 'faculty') return u.role === 'Faculty';
                    if (activeTab === 'wardens') return u.role === 'Warden';
                    if (activeTab === 'staff') return u.role === 'Staff';
                    return true;
                  })
                  .map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{u.id}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">{u.name}</div>
                        <div className="text-slate-400 text-[11px]">{u.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.role === 'Student'
                              ? 'bg-blue-100 text-blue-800'
                              : u.role === 'Faculty'
                              ? 'bg-emerald-100 text-emerald-800'
                              : u.role === 'Warden'
                              ? 'bg-amber-100 text-amber-800'
                              : u.role === 'Staff'
                              ? 'bg-cyan-100 text-cyan-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-700">{u.department}</div>
                        {(u.roomOrHostel || u.yearOrDesignation) && (
                          <div className="text-slate-400 text-[11px]">
                            {u.roomOrHostel || u.yearOrDesignation}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            u.active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {u.active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditUser(u)}
                          className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleUserActive(u.id)}
                          className={`px-2.5 py-1 rounded-lg font-bold ${
                            u.active ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          {u.active ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Complaints Management */}
      {activeTab === 'complaints' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Institutional Complaints & Service Orders</h2>
              <p className="text-xs text-slate-500">Triage reported incidents, dispatch trade teams, and oversee closures</p>
            </div>
            <span className="text-xs font-bold text-slate-500">{filteredComplaints.length} Work Orders</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <input
              type="text"
              placeholder="Search title, student, ID..."
              value={complaintSearch}
              onChange={(e) => setComplaintSearch(e.target.value)}
              className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
            <select
              value={complaintCategoryFilter}
              onChange={(e) => setComplaintCategoryFilter(e.target.value)}
              className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="All">All Categories</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electricity">Electricity</option>
              <option value="Water">Water</option>
              <option value="Wi-Fi">Wi-Fi</option>
              <option value="Cleaning">Cleaning</option>
            </select>
            <select
              value={complaintPriorityFilter}
              onChange={(e) => setComplaintPriorityFilter(e.target.value)}
              className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              value={complaintStatusFilter}
              onChange={(e) => setComplaintStatusFilter(e.target.value)}
              className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredComplaints.map((c) => (
              <div
                key={c.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#1677FF] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {c.id}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{c.title}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {c.priority} Priority
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.status === 'Resolved' || c.status === 'Closed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <p className="text-slate-600">{c.description}</p>
                  <p className="text-slate-400">
                    Location: {c.hostel} • {c.room} | Student: {c.studentName} | Assigned: <strong>{c.assignedStaff || 'Pending'}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => {
                      setAssignModalComplaint(c);
                      setAssignPriority(c.priority);
                      setAssignedStaffName(c.assignedStaff || 'Rajesh Verma (Facilities Lead)');
                    }}
                    className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 font-bold rounded-xl"
                  >
                    Assign / Triage
                  </button>
                  {c.status !== 'Closed' && (
                    <button
                      onClick={() => handleCloseTicket(c.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                    >
                      Close Ticket
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Requests */}
      {activeTab === 'requests' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Certificate & Clearance Requests</h2>
              <p className="text-xs text-slate-500">Validate official bonafides, study certifications, and generate certificates</p>
            </div>
            <span className="text-xs font-bold text-slate-500">{certificateRequests.length} Applications</span>
          </div>

          <div className="space-y-3">
            {certificateRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {req.id}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{req.studentName} ({req.rollNumber})</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-700 mt-1">{req.type} • Purpose: {req.purpose}</p>
                  <p className="text-slate-400">Department: {req.department} • Submitted: {req.createdAt}</p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {req.status !== 'Approved' && (
                    <button
                      onClick={() => {
                        reviewCertificateRequest(req.id, 'Approved', user.name);
                        triggerToast(`Approved and generated certificate for ${req.studentName}`);
                      }}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                    >
                      Approve & Generate
                    </button>
                  )}
                  {req.status === 'Approved' && (
                    <button
                      onClick={() => setPreviewCert(req)}
                      className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl flex items-center gap-1 border border-blue-200"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Certificate</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Notices */}
      {activeTab === 'notices' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Campus Circulars & Broadcast Notices</h2>
              <p className="text-xs text-slate-500">Publish institution-wide or targeted departmental announcements</p>
            </div>
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Notice</span>
            </button>
          </div>

          <div className="space-y-3">
            {notices.map((n) => (
              <div key={n.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{n.title}</span>
                    <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                      {n.category}
                    </span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                      Audience: {n.targetAudience}
                    </span>
                  </div>
                  <span className="text-slate-400">{n.publishDate}</span>
                </div>
                <p className="text-slate-600">{n.description}</p>
                <div className="text-[11px] text-slate-400">Published by: {n.postedBy}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Hostel */}
      {activeTab === 'hostel' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Residential Hostel Complexes</h2>
              <p className="text-xs text-slate-500">Real-time room occupancy, block wardens, and infrastructure status</p>
            </div>
            <span className="text-xs font-bold text-slate-500">4 Residential Blocks</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Aryabhata Bhavan (Block B)', beds: 480, occupied: 452, warden: 'Er. Sandeep Rathore', status: 'Optimal' },
              { name: 'Ramanujan Bhavan (Block A)', beds: 520, occupied: 498, warden: 'Er. Rajesh Nair', status: 'Optimal' },
              { name: 'Gargi Hall of Residence', beds: 400, occupied: 380, warden: 'Dr. Sunita Deshmukh', status: 'Optimal' },
              { name: 'Kalpana Chawla Hall', beds: 350, occupied: 320, warden: 'Dr. Meenakshi Rao', status: 'Maintenance' },
            ].map((h, i) => (
              <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2">
                <div className="font-bold text-slate-900 text-sm">{h.name}</div>
                <div className="flex justify-between text-slate-600">
                  <span>Occupancy:</span>
                  <strong>{h.occupied} / {h.beds} ({Math.round((h.occupied/h.beds)*100)}%)</strong>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(h.occupied/h.beds)*100}%` }} />
                </div>
                <p className="text-slate-400 text-[11px]">Chief Warden: {h.warden}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Mess */}
      {activeTab === 'mess' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Dining & Mess Operations Control</h2>
              <p className="text-xs text-slate-500">Manage meal nutrition, review student ratings, and rebate compliance</p>
            </div>
            <span className="text-xs font-bold text-slate-500">Average Student Rating: 4.4 / 5</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="font-bold text-slate-500">Breakfast</span>
              <p className="text-slate-800 font-semibold">Masala Dosa, Sambar, Chutney, Coffee</p>
              <div className="text-[11px] text-amber-600 font-bold">Rating: 4.8 / 5.0</div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="font-bold text-slate-500">Lunch</span>
              <p className="text-slate-800 font-semibold">Shahi Paneer, Chana Dal, Roti, Salad</p>
              <div className="text-[11px] text-amber-600 font-bold">Rating: 4.4 / 5.0</div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="font-bold text-slate-500">Evening Snacks</span>
              <p className="text-slate-800 font-semibold">Veg Cutlet, Mint Chutney, Tea</p>
              <div className="text-[11px] text-amber-600 font-bold">Rating: 4.2 / 5.0</div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="font-bold text-slate-500">Dinner</span>
              <p className="text-slate-800 font-semibold">Malai Kofta, Yellow Dal, Rice, Ice Cream</p>
              <div className="text-[11px] text-amber-600 font-bold">Rating: 4.6 / 5.0</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Fees */}
      {activeTab === 'fees' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Tuition & Institutional Accounts Ledger</h2>
              <p className="text-xs text-slate-500">Central fee collection, semester invoices, and mock payment records</p>
            </div>
            <span className="text-xs font-bold text-emerald-600">Total Collected: ₹3.61 Cr</span>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { id: 'TXN-2026-901', student: 'Manoj Kumar Jena (2024CS1042)', item: 'Semester 3 Tuition Fee', amount: '₹72,500', status: 'Success', date: '12 Jul 2026' },
              { id: 'TXN-2026-902', student: 'Manoj Kumar Jena (2024CS1042)', item: 'Hostel B Accommodation & Mess Advance', amount: '₹38,000', status: 'Success', date: '15 Jul 2026' },
              { id: 'TXN-2026-903', student: 'Aarav Patel (2024CS1018)', item: 'Semester 3 Tuition Fee', amount: '₹72,500', status: 'Success', date: '16 Jul 2026' },
            ].map((t) => (
              <div key={t.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{t.id}</span>
                    <span className="font-semibold text-slate-800">{t.student}</span>
                  </div>
                  <span className="text-slate-500">{t.item} • Date: {t.date}</span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-slate-900 block">{t.amount}</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Analytics */}
      {activeTab === 'analytics' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Institutional Operations Analytics</h2>
              <p className="text-xs text-slate-500">Performance metrics across student services, SLAs, and infrastructure</p>
            </div>
            <button
              onClick={handleExportReport}
              className="px-3.5 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold rounded-xl text-xs flex items-center gap-1 border border-purple-200"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Raw Data</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
              <span className="font-bold text-slate-600 block">Complaints by Category</span>
              {['Plumbing (38%)', 'Electricity (24%)', 'Wi-Fi (18%)', 'Water (12%)', 'Cleaning (8%)'].map((c, i) => (
                <div key={i} className="flex justify-between text-slate-700">
                  <span>{c.split(' ')[0]}</span>
                  <strong>{c.split(' ')[1]}</strong>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
              <span className="font-bold text-slate-600 block">Request Turnaround Time</span>
              <div className="text-3xl font-black text-purple-600">18.5 hrs</div>
              <p className="text-slate-500">Average duration from student submission to digitally signed certificate release.</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
              <span className="font-bold text-slate-600 block">Digital Gate Pass Volume</span>
              <div className="text-3xl font-black text-[#1677FF]">{gatePasses.length} Passes</div>
              <p className="text-slate-500">100% verified with security QR scanner without physical register books.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Security & Administrative Audit Trail</h2>
              <p className="text-xs text-slate-500">Immutable ledger recording logins, approvals, passes, and role events</p>
            </div>
            <span className="text-xs font-bold text-slate-500">{auditLogs.length} Events Logged</span>
          </div>

          <div className="space-y-2 text-xs">
            {auditLogs.map((a) => (
              <div key={a.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{a.action}</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-bold">
                      {a.role}
                    </span>
                    <span className="text-slate-500">by {a.actor}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{a.details}</p>
                </div>
                <div className="text-right text-slate-400 text-[11px] shrink-0">
                  <div>{a.timestamp}</div>
                  <div>IP: {a.ip}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Institutional Governance & System Configurations</h2>
            <p className="text-xs text-slate-500">Set campus-wide compliance thresholds, curfew hours, and security parameters</p>
          </div>

          <div className="max-w-xl space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Institution Legal Name</label>
              <input
                type="text"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Minimum Mandatory Attendance Cutoff (%)
              </label>
              <input
                type="number"
                value={attendanceThreshold}
                onChange={(e) => setAttendanceThreshold(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
              <span className="text-[11px] text-slate-400">
                Students dropping below this threshold will automatically trigger academic warnings.
              </span>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Hostel Evening Curfew Deadline</label>
              <input
                type="time"
                value={curfewTime}
                onChange={(e) => setCurfewTime(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
              <span className="text-[11px] text-slate-400">
                Gate passes returning later than this hour require special Warden approval.
              </span>
            </div>

            <button
              onClick={() => triggerToast('Institutional settings successfully saved.')}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs"
            >
              Save Configuration
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Assign / Triage Work Order */}
      {assignModalComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Triage & Assign Ticket #{assignModalComplaint.id}</h3>
              <button onClick={() => setAssignModalComplaint(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAssignSubmit} className="space-y-3 text-xs">
              <p className="text-slate-600 font-medium">
                {assignModalComplaint.title} ({assignModalComplaint.hostel})
              </p>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Assign Technician / Lead</label>
                <select
                  value={assignedStaffName}
                  onChange={(e) => setAssignedStaffName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="Rajesh Verma (Facilities Lead)">Rajesh Verma (Facilities Lead)</option>
                  <option value="K. Somesh (Chief Electrician)">K. Somesh (Chief Electrician)</option>
                  <option value="Mohan Lal (Plumbing Crew)">Mohan Lal (Plumbing Crew)</option>
                  <option value="Campus IT Network NOC">Campus IT Network NOC</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Priority Override</label>
                <select
                  value={assignPriority}
                  onChange={(e) => setAssignPriority(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Admin Dispatch Notes</label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={2}
                  placeholder="Special instructions or parts required..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignModalComplaint(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  Dispatch Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Broadcast Bulletin */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Broadcast Campus Circular</h3>
              <button onClick={() => setShowBroadcastModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleBroadcastNotice} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Notice Title</label>
                <input
                  type="text"
                  value={bTitle}
                  onChange={(e) => setBTitle(e.target.value)}
                  placeholder="e.g. Campus Emergency Water Supply Restoration Notice"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={bCategory}
                    onChange={(e) => setBCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Emergency">Emergency</option>
                    <option value="Academic">Academic</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Examination">Examination</option>
                    <option value="Fees">Fees</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={bPriority}
                    onChange={(e) => setBPriority(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Emergency">Emergency (Push Notification)</option>
                    <option value="Important">Important</option>
                    <option value="Regular">Regular</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Audience</label>
                <select
                  value={bAudience}
                  onChange={(e) => setBAudience(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="All">All Campus Residents (Students & Staff)</option>
                  <option value="All Students">All Students Only</option>
                  <option value="Faculty">Faculty Members</option>
                  <option value="Hostel">Hostel Residents</option>
                  <option value="CSE">B.Tech CSE</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Notice Content</label>
                <textarea
                  value={bContent}
                  onChange={(e) => setBContent(e.target.value)}
                  rows={4}
                  placeholder="Type official notification body..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  Broadcast Bulletin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add / Edit User */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {editingUserId ? `Edit User: ${editingUserId}` : 'Provision New Campus Account'}
              </h3>
              <button onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveUser} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Institutional Email / ID</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="e.g. john.doe@campus360.demo"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Role (RBAC)</label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Warden">Warden</option>
                    <option value="Staff">Staff</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Department</label>
                  <input
                    type="text"
                    value={userDept}
                    onChange={(e) => setUserDept(e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {userRole === 'Student' ? 'Hostel & Room / Academic Year' : userRole === 'Warden' ? 'Assigned Hostel' : userRole === 'Staff' ? 'Assigned Division' : 'Designation'}
                </label>
                <input
                  type="text"
                  value={userDetail}
                  onChange={(e) => setUserDetail(e.target.value)}
                  placeholder={userRole === 'Student' ? 'Aryabhata B-312 • 3rd Year' : userRole === 'Warden' ? 'Aryabhata & Ramanujan Halls' : 'Facilities Maintenance Division'}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  {editingUserId ? 'Save Changes' : 'Provision User'}
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
