import React, { useState } from 'react';
import {
  Building,
  KeyRound,
  Users,
  AlertTriangle,
  UtensilsCrossed,
  CheckCircle2,
  XCircle,
  Clock,
  BellRing,
  Bed,
  FileText,
  ShieldCheck,
  Search,
  Check,
  X,
  QrCode,
  ArrowRight,
  Filter,
  Plus,
  Radio,
  Eye,
} from 'lucide-react';
import { UserAccount } from '../../types/auth';
import { useCampusData } from '../../context/CampusDataContext';
import { GatePassVerificationModal } from '../modals/GatePassVerificationModal';
import { GatePass } from '../../types/store';

interface WardenDashboardProps {
  user: UserAccount;
  onLogout: () => void;
}

interface VisitorEntry {
  id: string;
  visitorName: string;
  studentRoll: string;
  studentName: string;
  room: string;
  relation: string;
  inTime: string;
  outTime?: string;
  status: 'Inside' | 'Exited';
  idProof: string;
}

export const WardenDashboard: React.FC<WardenDashboardProps> = ({ user, onLogout }) => {
  const {
    gatePasses,
    reviewGatePass,
    complaints,
    updateComplaintStatus,
    reassignComplaint,
    createNotice,
    notices,
  } = useCampusData();

  const [activeTab, setActiveTab] = useState<'overview' | 'gatepasses' | 'students' | 'rooms' | 'maintenance' | 'visitors' | 'curfew'>('overview');
  const [toast, setToast] = useState<string | null>(null);

  // Reject Modal
  const [rejectModalPass, setRejectModalPass] = useState<GatePass | null>(null);
  const [rejectReason, setRejectReason] = useState('Exceeds evening curfew or academic hours overlap');

  // QR Inspection Modal
  const [inspectPass, setInspectPass] = useState<GatePass | null>(null);

  // Emergency Alert Modal
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [alertTitle, setAlertTitle] = useState('Hostel Block B Emergency Inspection & Roll Call');
  const [alertMessage, setAlertMessage] = useState('Mandatory physical headcount at 09:30 PM in Common Room. All residents must be present.');

  // Create Hostel Notice Modal
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');

  // Assign Maintenance Staff Modal
  const [assignComplaintModal, setAssignComplaintModal] = useState<any | null>(null);
  const [selectedStaff, setSelectedStaff] = useState('Rajesh Verma (Facilities Lead)');

  // Visitor Log State
  const [visitors, setVisitors] = useState<VisitorEntry[]>([
    { id: 'VIS-201', visitorName: 'Ramesh Jena', studentRoll: '2024CS1042', studentName: 'Manoj Kumar Jena', room: 'B-312', relation: 'Father', inTime: '02:30 PM', outTime: '04:15 PM', status: 'Exited', idProof: 'Aadhaar: ****3921' },
    { id: 'VIS-202', visitorName: 'Sunita Mehta', studentRoll: '2024CS1040', studentName: 'Aarav Mehta', room: 'B-204', relation: 'Mother', inTime: '04:00 PM', status: 'Inside', idProof: 'PAN: ****8129' },
    { id: 'VIS-203', visitorName: 'Vikram Joshi', studentRoll: '2024CS1045', studentName: 'Tanmay Bhatt', room: 'B-108', relation: 'Brother', inTime: '05:15 PM', status: 'Inside', idProof: 'Driving License' },
  ]);
  const [showVisitorModal, setShowVisitorModal] = useState(false);
  const [vName, setVName] = useState('');
  const [vRoll, setVRoll] = useState('2024CS1042');
  const [vStudent, setVStudent] = useState('Manoj Kumar Jena');
  const [vRoom, setVRoom] = useState('B-312');
  const [vRelation, setVRelation] = useState('Parent');
  const [vIdProof, setVIdProof] = useState('Aadhaar Card');

  // Hostel Students List
  const [studentSearch, setStudentSearch] = useState('');
  const hostelStudents = [
    { roll: '2024CS1040', name: 'Aarav Mehta', room: 'B-204', bed: 'Bed 1', phone: '+91 98765 43210', status: 'In Hostel' },
    { roll: '2024CS1041', name: 'Aditi Deshmukh', room: 'B-205', bed: 'Bed 2', phone: '+91 98765 43211', status: 'In Hostel' },
    { roll: '2024CS1042', name: 'Manoj Kumar Jena', room: 'B-312', bed: 'Bed 1', phone: '+91 98765 43212', status: 'Pass Approved' },
    { roll: '2024CS1043', name: 'Rohan Iyer', room: 'B-312', bed: 'Bed 2', phone: '+91 98765 43213', status: 'In Hostel' },
    { roll: '2024CS1044', name: 'Sneha Kulkarni', room: 'B-108', bed: 'Bed 1', phone: '+91 98765 43214', status: 'In Hostel' },
    { roll: '2024CS1045', name: 'Tanmay Bhatt', room: 'B-108', bed: 'Bed 2', phone: '+91 98765 43215', status: 'Visitor with Resident' },
  ];

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const pendingPasses = gatePasses.filter((g) => g.status === 'Pending');
  const approvedPasses = gatePasses.filter((g) => g.status === 'Approved');
  const hostelComplaints = complaints.filter((c) =>
    c.category === 'Plumbing' || c.category === 'Electricity' || c.category === 'Bathroom' || c.category === 'Cleaning' || c.category === 'Furniture'
  );

  const handleApprove = (id: string, studentName: string) => {
    reviewGatePass(id, 'Approved', user.name);
    triggerToast(`Approved Gate Pass ${id} for ${studentName}. QR clearance enabled!`);
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalPass) return;
    reviewGatePass(rejectModalPass.id, 'Rejected', user.name, rejectReason);
    triggerToast(`Declined Gate Pass ${rejectModalPass.id}: ${rejectReason}`);
    setRejectModalPass(null);
  };

  const handleSendEmergencyAlert = (e: React.FormEvent) => {
    e.preventDefault();
    createNotice({
      title: alertTitle,
      category: 'Emergency',
      priority: 'Emergency',
      description: alertMessage,
      targetAudience: 'Hostel',
      postedBy: user.name,
    });
    setShowEmergencyModal(false);
    triggerToast('Hostel Emergency Alert dispatched to all resident student devices!');
  };

  const handleCreateHostelNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim()) return;
    createNotice({
      title: noticeTitle,
      category: 'Hostel',
      priority: 'Important',
      description: noticeContent,
      targetAudience: 'Hostel',
      postedBy: user.name,
    });
    setShowNoticeModal(false);
    setNoticeTitle('');
    setNoticeContent('');
    triggerToast('Hostel announcement posted to residents bulletin!');
  };

  const handleAssignStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignComplaintModal) return;
    reassignComplaint(assignComplaintModal.id, selectedStaff, 'High');
    setAssignComplaintModal(null);
    triggerToast(`Assigned ticket ${assignComplaintModal.id} to ${selectedStaff}`);
  };

  const handleAddVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vName.trim()) return;
    const newV: VisitorEntry = {
      id: `VIS-${Math.floor(Math.random() * 900 + 100)}`,
      visitorName: vName,
      studentRoll: vRoll,
      studentName: vStudent,
      room: vRoom,
      relation: vRelation,
      inTime: 'Just Now',
      status: 'Inside',
      idProof: vIdProof,
    };
    setVisitors([newV, ...visitors]);
    setShowVisitorModal(false);
    setVName('');
    triggerToast(`Visitor entry logged for ${newV.visitorName}`);
  };

  const handleMarkVisitorOut = (id: string) => {
    setVisitors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'Exited', outTime: 'Just Now' } : v))
    );
    triggerToast(`Visitor departure recorded for ${id}`);
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

      {/* Hero */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-stone-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-400/30">
                Hostel Administration Desk
              </span>
              <span className="text-xs text-slate-300">Assigned: Aryabhata & Ramanujan Halls</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hostel Warden Console
            </h1>
            <p className="text-xs sm:text-sm text-amber-200/90 max-w-xl">
              Chief Warden: {user.name}. Approve student out-of-campus passes, enforce 09:30 PM curfews, dispatch hostel repairs, log visitors, and broadcast alerts.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowEmergencyModal(true)}
              className="min-h-[44px] px-4 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all"
            >
              <Radio className="w-4 h-4" />
              <span>Broadcast Emergency Alert</span>
            </button>
            <button
              onClick={() => setShowNoticeModal(true)}
              className="min-h-[44px] px-4 py-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold rounded-xl text-xs sm:text-sm backdrop-blur-xs flex items-center gap-2 transition-all"
            >
              <BellRing className="w-4 h-4" />
              <span>Post Hostel Notice</span>
            </button>
          </div>
        </div>
      </div>

      {/* 8 Metric Overview Cards (Module 4 Requirement) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: 'Hostel Occupancy', val: '94%', color: 'text-amber-600' },
          { label: 'Total Residents', val: '480', color: 'text-blue-600' },
          { label: 'Pending Passes', val: pendingPasses.length.toString(), color: 'text-purple-600' },
          { label: 'Open Complaints', val: hostelComplaints.filter(c => c.status !== 'Closed').length.toString(), color: 'text-rose-600' },
          { label: 'Maintenance Issues', val: '5', color: 'text-cyan-600' },
          { label: 'Visitor Entries', val: visitors.length.toString(), color: 'text-emerald-600' },
          { label: 'Mess Feedback', val: '4.4 / 5', color: 'text-amber-500' },
          { label: 'Emergency Alerts', val: '1 Active', color: 'text-rose-700' },
        ].map((m, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block truncate">{m.label}</span>
            <span className={`text-xl font-black ${m.color} tabular-nums block`}>{m.val}</span>
          </div>
        ))}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200">
        {[
          { id: 'overview', label: 'Overview', icon: Building },
          { id: 'gatepasses', label: `Gate Passes (${pendingPasses.length})`, icon: KeyRound },
          { id: 'students', label: 'Hostel Students', icon: Users },
          { id: 'rooms', label: 'Room Matrix', icon: Bed },
          { id: 'maintenance', label: `Maintenance (${hostelComplaints.length})`, icon: AlertTriangle },
          { id: 'visitors', label: `Visitor Logs (${visitors.filter(v => v.status === 'Inside').length} Inside)`, icon: FileText },
          { id: 'curfew', label: 'Curfew Monitoring', icon: Clock },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Gate Pass Action Queue */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-900">Urgent Gate Pass Requests</h2>
                <button
                  onClick={() => setActiveTab('gatepasses')}
                  className="text-xs font-bold text-amber-600 hover:underline"
                >
                  View All ({pendingPasses.length})
                </button>
              </div>

              {pendingPasses.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No pending gate pass applications.</p>
              ) : (
                <div className="space-y-3">
                  {pendingPasses.slice(0, 3).map((gp) => (
                    <div
                      key={gp.id}
                      className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            {gp.id}
                          </span>
                          <span className="font-bold text-slate-900">{gp.studentName} ({gp.studentRoll})</span>
                        </div>
                        <p className="text-slate-600 mt-1">{gp.destination} • {gp.reason}</p>
                        <span className="text-[11px] text-slate-400">Return by: {gp.expectedReturnTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(gp.id, gp.studentName)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setRejectModalPass(gp)}
                          className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold rounded-xl text-xs"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Hostel Notices & Announcements */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-900">Hostel Bulletins & Curfew Rules</h2>
                <span className="text-xs font-bold text-slate-400">Curfew: 09:30 PM</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl">
                  <div className="flex justify-between font-bold text-rose-800">
                    <span>MANDATORY HEADCOUNT</span>
                    <span>Today, 09:30 PM</span>
                  </div>
                  <p className="text-rose-900 mt-1">
                    All residents of Aryabhata Bhavan must report to Common Room A for semester roll call.
                  </p>
                </div>
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl">
                  <div className="flex justify-between font-bold text-amber-800">
                    <span>SOLAR WATER HEATER REPAIR</span>
                    <span>Tomorrow, 08:00 AM</span>
                  </div>
                  <p className="text-amber-900 mt-1">
                    Hot water service will be paused on 2nd and 3rd floors for pump valve replacement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Gate Passes */}
      {activeTab === 'gatepasses' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Student Gate Pass Applications</h2>
              <p className="text-xs text-slate-500">Approve or reject campus exits; approved passes generate real-time QR security tokens</p>
            </div>
            <span className="text-xs font-bold text-slate-500">{gatePasses.length} Total Passes</span>
          </div>

          <div className="space-y-3">
            {gatePasses.map((gp) => (
              <div
                key={gp.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {gp.id}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{gp.studentName} ({gp.studentRoll})</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        gp.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : gp.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {gp.status}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-800">{gp.destination} • {gp.reason}</p>
                  <p className="text-slate-500">
                    Depart: <strong>{gp.departureTime}</strong> | Return: <strong>{gp.expectedReturnTime}</strong> | Parent Consent: Verified
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {gp.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(gp.id, gp.studentName)}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                      >
                        Approve Pass
                      </button>
                      <button
                        onClick={() => setRejectModalPass(gp)}
                        className="px-3.5 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold rounded-xl"
                      >
                        Decline
                      </button>
                    </>
                  )}
                  {gp.status === 'Approved' && (
                    <button
                      onClick={() => setInspectPass(gp)}
                      className="px-3.5 py-2 bg-blue-50 text-[#1677FF] hover:bg-blue-100 border border-blue-200 font-bold rounded-xl flex items-center gap-1.5"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Inspect QR Token</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Hostel Students */}
      {activeTab === 'students' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Aryabhata Bhavan Student Roster</h2>
              <p className="text-xs text-slate-500">Resident directory with room numbers, contact info, and campus status</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search roll, name, or room..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {hostelStudents
              .filter(
                (s) =>
                  s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                  s.roll.toLowerCase().includes(studentSearch.toLowerCase()) ||
                  s.room.toLowerCase().includes(studentSearch.toLowerCase())
              )
              .map((s) => (
                <div key={s.roll} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded mr-2">
                      {s.room}
                    </span>
                    <span className="font-bold text-slate-800">{s.name}</span>
                    <span className="text-slate-400 text-[11px] ml-2 font-mono">({s.roll})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">{s.phone}</span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {s.status}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB: Room Matrix */}
      {activeTab === 'rooms' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Floor & Room Allocation Matrix</h2>
              <p className="text-xs text-slate-500">Block B: 3 Floors • 240 Rooms • 480 Beds capacity</p>
            </div>
            <span className="text-xs font-bold text-amber-600">452 Beds Occupied (94%)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            {Array.from({ length: 18 }).map((_, i) => {
              const roomNum = 301 + i;
              const isOccupied = i !== 4 && i !== 11;
              return (
                <div
                  key={roomNum}
                  className={`p-3 rounded-2xl border text-center space-y-1 ${
                    isOccupied ? 'bg-slate-50 border-slate-200' : 'bg-emerald-50 border-emerald-300'
                  }`}
                >
                  <div className="font-mono font-bold text-slate-800">B-{roomNum}</div>
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isOccupied ? 'bg-slate-200 text-slate-700' : 'bg-emerald-200 text-emerald-800'
                    }`}
                  >
                    {isOccupied ? 'Occupied (2/2)' : '1 Bed Free'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: Maintenance */}
      {activeTab === 'maintenance' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Hostel Repair & Maintenance Complaints</h2>
              <p className="text-xs text-slate-500">Assign complaints directly to campus facility trade staff</p>
            </div>
            <span className="text-xs font-bold text-slate-500">{hostelComplaints.length} Tickets</span>
          </div>

          <div className="space-y-3">
            {hostelComplaints.map((c) => (
              <div
                key={c.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#1677FF] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {c.id}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{c.title}</span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                      {c.category}
                    </span>
                    <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                      {c.status}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">{c.description}</p>
                  <p className="text-slate-400">
                    Room: <strong>{c.room}</strong> ({c.hostel}) | Reported by: {c.studentName} | Assigned: <strong>{c.assignedStaff || 'Unassigned'}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => setAssignComplaintModal(c)}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-xs"
                  >
                    Assign Staff
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Visitor Logs (Module 4 Requirement) */}
      {activeTab === 'visitors' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Hostel Visitor Entry / Exit Logs</h2>
              <p className="text-xs text-slate-500">Track external guests, parents, and visiting relatives</p>
            </div>
            <button
              onClick={() => setShowVisitorModal(true)}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Visitor Entry</span>
            </button>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="py-3 px-4">Visitor Pass</th>
                  <th className="py-3 px-4">Visitor Name</th>
                  <th className="py-3 px-4">Visiting Student & Room</th>
                  <th className="py-3 px-4">Relation</th>
                  <th className="py-3 px-4">In Time / Out Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visitors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-amber-700">{v.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{v.visitorName}</td>
                    <td className="py-3 px-4">
                      {v.studentName} ({v.studentRoll}) • <strong>Room {v.room}</strong>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{v.relation}</td>
                    <td className="py-3 px-4 text-slate-500">
                      In: {v.inTime} {v.outTime ? `| Out: ${v.outTime}` : ''}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          v.status === 'Inside' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {v.status === 'Inside' && (
                        <button
                          onClick={() => handleMarkVisitorOut(v.id)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                        >
                          Mark Exited
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Curfew */}
      {activeTab === 'curfew' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Evening Curfew & Night-Out Compliance</h2>
              <p className="text-xs text-slate-500">Security gate pass synchronizer and automated late return tracking</p>
            </div>
            <span className="text-xs font-bold text-rose-600">Curfew Active at 09:30 PM</span>
          </div>

          <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl text-xs space-y-2">
            <h3 className="font-bold text-amber-900">Hostel Residence Policy Enforcement</h3>
            <p className="text-amber-800">
              Students returning after 09:30 PM without pre-authorized Emergency Gate Pass will have incidents logged in their permanent institutional record and parents notified automatically via SMS/Email.
            </p>
          </div>
        </div>
      )}

      {/* MODAL: Emergency Alert */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Broadcast Hostel Emergency Alert</h3>
              <button onClick={() => setShowEmergencyModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSendEmergencyAlert} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Alert Headline</label>
                <input
                  type="text"
                  value={alertTitle}
                  onChange={(e) => setAlertTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Emergency Instructions</label>
                <textarea
                  value={alertMessage}
                  onChange={(e) => setAlertMessage(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEmergencyModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
                >
                  Send Push Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Post Notice */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Post Hostel Circular</h3>
              <button onClick={() => setShowNoticeModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateHostelNotice} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Title</label>
                <input
                  type="text"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g. Block B Water Tank Cleaning Schedule"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Notice Body</label>
                <textarea
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  rows={3}
                  placeholder="Describe details, timings, and instructions for residents..."
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
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Reject Gate Pass */}
      {rejectModalPass && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Decline Gate Pass</h3>
              <button onClick={() => setRejectModalPass(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleConfirmReject} className="space-y-3 text-xs">
              <p className="text-slate-600">
                Declining gate pass for {rejectModalPass.studentName} ({rejectModalPass.destination}).
              </p>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason for Rejection</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="Provide reason for student..."
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalPass(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Back
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

      {/* MODAL: Assign Staff to Complaint */}
      {assignComplaintModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Assign Maintenance Staff</h3>
              <button onClick={() => setAssignComplaintModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAssignStaff} className="space-y-3 text-xs">
              <p className="text-slate-700 font-medium">
                {assignComplaintModal.title} (Room {assignComplaintModal.room})
              </p>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Facility Technician</label>
                <select
                  value={selectedStaff}
                  onChange={(e) => setSelectedStaff(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="Rajesh Verma (Facilities Lead)">Rajesh Verma (Facilities Lead)</option>
                  <option value="K. Somesh (Chief Electrician)">K. Somesh (Chief Electrician)</option>
                  <option value="Mohan Lal (Plumbing Crew)">Mohan Lal (Plumbing Crew)</option>
                  <option value="Hostel B Caretaker">Hostel B Caretaker</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignComplaintModal(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  Assign Technician
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Log Visitor Entry */}
      {showVisitorModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Log Guest / Visitor Entry</h3>
              <button onClick={() => setShowVisitorModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddVisitor} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Visitor Full Name</label>
                <input
                  type="text"
                  value={vName}
                  onChange={(e) => setVName(e.target.value)}
                  placeholder="e.g. Ramesh Jena"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Student Roll Number</label>
                  <input
                    type="text"
                    value={vRoll}
                    onChange={(e) => setVRoll(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hostel Room</label>
                  <input
                    type="text"
                    value={vRoom}
                    onChange={(e) => setVRoom(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Relation</label>
                  <select
                    value={vRelation}
                    onChange={(e) => setVRelation(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Parent">Parent / Guardian</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Relative">Relative</option>
                    <option value="Courier/Delivery">Delivery Agent</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Government ID</label>
                  <input
                    type="text"
                    value={vIdProof}
                    onChange={(e) => setVIdProof(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVisitorModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  Record Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect QR Modal */}
      {inspectPass && (
        <GatePassVerificationModal
          isOpen={!!inspectPass}
          initialCode={inspectPass.id}
          onClose={() => setInspectPass(null)}
        />
      )}
    </div>
  );
};
