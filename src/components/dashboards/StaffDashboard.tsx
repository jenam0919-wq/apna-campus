import React, { useState } from 'react';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Upload,
  User,
  MapPin,
  Flame,
  ArrowRight,
  Sparkles,
  Phone,
  Check,
  Play,
  FileCheck,
  MessageSquare,
  Image as ImageIcon,
} from 'lucide-react';
import { UserAccount } from '../../types/auth';
import { useCampusData } from '../../context/CampusDataContext';
import { Complaint } from '../../types/store';

interface StaffDashboardProps {
  user: UserAccount;
  onLogout: () => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({ user, onLogout }) => {
  const { complaints, updateComplaintStatus, reassignComplaint } = useCampusData();

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
    complaints[0]?.id || null
  );
  const [activeFilter, setActiveFilter] = useState<'All' | 'Submitted' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed'>('All');
  const [staffNote, setStaffNote] = useState('');
  const [resolutionComment, setResolutionComment] = useState('');
  const [etaTime, setEtaTime] = useState('Today, 04:30 PM');
  const [toast, setToast] = useState<string | null>(null);
  const [uploadedProof, setUploadedProof] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const selectedComplaint = complaints.find((c) => c.id === selectedTicketId) || complaints[0] || null;

  // Overview metrics (Module 5 Requirement: Assigned, High Priority, In Progress, Completed, Overdue)
  const assignedTicketsCount = complaints.filter((c) => c.status === 'Submitted' || c.status === 'Assigned').length;
  const highPriorityCount = complaints.filter((c) => c.priority === 'High' && c.status !== 'Closed').length;
  const inProgressCount = complaints.filter((c) => c.status === 'In Progress').length;
  const completedCount = complaints.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length;
  const overdueCount = complaints.filter((c) => c.priority === 'High' && c.status === 'Submitted').length;

  const filteredComplaints = complaints.filter((c) => {
    if (activeFilter === 'All') return true;
    return c.status === activeFilter;
  });

  // Workflow transitions: Assigned -> Accepted -> In Progress -> Resolved
  const handleAcceptTask = () => {
    if (!selectedComplaint) return;
    updateComplaintStatus(
      selectedComplaint.id,
      'Assigned',
      `Staff ${user.name} accepted task. Assigned crew dispatched to ${selectedComplaint.hostel}.`
    );
    triggerToast(`Task accepted by ${user.name}`);
  };

  const handleStartWork = () => {
    if (!selectedComplaint) return;
    updateComplaintStatus(
      selectedComplaint.id,
      'In Progress',
      `Technician began on-site diagnostics at ${selectedComplaint.hostel} ${selectedComplaint.room}. ETA: ${etaTime}`
    );
    triggerToast(`Work started on ticket ${selectedComplaint.id}`);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint || !staffNote.trim()) return;
    updateComplaintStatus(
      selectedComplaint.id,
      selectedComplaint.status,
      `Staff Update (${user.name}): ${staffNote.trim()}`
    );
    setStaffNote('');
    triggerToast('Progress comment logged and notified to student');
  };

  const handleMarkResolved = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    const finalNote = resolutionComment.trim() || 'Work order completed and tested in presence of floor representative.';
    updateComplaintStatus(
      selectedComplaint.id,
      'Resolved',
      `Resolution Verified: ${finalNote}`
    );
    triggerToast(`Ticket ${selectedComplaint.id} marked as Resolved! Sent confirmation request to student.`);
    setResolutionComment('');
    setUploadedProof(null);
  };

  const handleSimulateProofUpload = () => {
    setUploadedProof('https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60');
    triggerToast('Proof photo uploaded: Repair verification image attached');
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
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-sky-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                Facilities Maintenance Operations
              </span>
              <span className="text-xs text-slate-300">Staff ID: STF-301</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Maintenance Staff Workbench
            </h1>
            <p className="text-xs sm:text-sm text-cyan-200/90 max-w-xl">
              Technician: {user.name} ({user.department}). Manage assigned repair work orders, upload proof of fix, update ETAs, and notify students upon resolution.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => triggerToast('Emergency repairs crew notified via campus VHF dispatch')}
              className="min-h-[44px] px-4 py-2 bg-cyan-600 hover:bg-cyan-700 active:scale-95 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Contact Dispatch</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Metrics Cards (Module 5 Requirement: Assigned, High Priority, In Progress, Completed, Overdue) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: 'Assigned Tickets', val: assignedTicketsCount.toString(), color: 'text-amber-600' },
          { label: 'High Priority', val: highPriorityCount.toString(), color: 'text-rose-600' },
          { label: 'In Progress Tasks', val: inProgressCount.toString(), color: 'text-blue-600' },
          { label: 'Completed Tasks', val: completedCount.toString(), color: 'text-emerald-600' },
          { label: 'Overdue Tasks', val: overdueCount.toString(), color: 'text-purple-600' },
        ].map((m, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block truncate">{m.label}</span>
            <span className={`text-xl font-black ${m.color} tabular-nums block`}>{m.val}</span>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(['All', 'Submitted', 'Assigned', 'In Progress', 'Resolved', 'Closed'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setActiveFilter(st)}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeFilter === st
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {st} ({st === 'All' ? complaints.length : complaints.filter((c) => c.status === st).length})
          </button>
        ))}
      </div>

      {/* Main Grid: Ticket List (Left) and Interactive Staff Workflow Console (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Orders list */}
        <div className="lg:col-span-5 space-y-3">
          {filteredComplaints.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-slate-400 text-xs">
              No tickets found in {activeFilter} status.
            </div>
          ) : (
            filteredComplaints.map((item) => {
              const isSelected = selectedComplaint?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedTicketId(item.id)}
                  className={`bg-white border rounded-3xl p-4.5 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-cyan-500 shadow-md ring-2 ring-cyan-500/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-md">
                        {item.id}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.priority === 'High'
                          ? 'bg-rose-50 text-rose-600 border border-rose-200'
                          : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      {item.priority} Priority
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{item.description}</p>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1 text-slate-700 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.hostel} • {item.room}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'Resolved' || item.status === 'Closed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800 animate-pulse'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Active Work Order Details & Action Console */}
        <div className="lg:col-span-7">
          {selectedComplaint ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-cyan-600">
                      {selectedComplaint.id}
                    </span>
                    <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {selectedComplaint.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedComplaint.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {selectedComplaint.status}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                    {selectedComplaint.title}
                  </h2>
                </div>

                <div className="text-left sm:text-right text-xs text-slate-500">
                  <div>Reported: {selectedComplaint.createdAt}</div>
                  <div>Student: <strong>{selectedComplaint.studentName}</strong></div>
                </div>
              </div>

              {/* Workflow Stepper: Assigned -> Accepted -> In Progress -> Resolved */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Staff Workflow Lifecycle
                </span>
                <div className="flex items-center justify-between text-xs font-bold">
                  {[
                    { step: 'Assigned', done: true },
                    { step: 'Accepted', done: selectedComplaint.status !== 'Submitted' },
                    { step: 'In Progress', done: selectedComplaint.status === 'In Progress' || selectedComplaint.status === 'Resolved' || selectedComplaint.status === 'Closed' },
                    { step: 'Resolved', done: selectedComplaint.status === 'Resolved' || selectedComplaint.status === 'Closed' },
                  ].map((s, idx, arr) => (
                    <div key={s.step} className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                        s.done ? 'bg-cyan-600 text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {s.done ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      <span className={s.done ? 'text-slate-900' : 'text-slate-400'}>{s.step}</span>
                      {idx < arr.length - 1 && <span className="text-slate-300 mx-1">→</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Workflow Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                {selectedComplaint.status === 'Submitted' && (
                  <button
                    onClick={handleAcceptTask}
                    className="min-h-[42px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>Accept Task</span>
                  </button>
                )}

                {(selectedComplaint.status === 'Submitted' || selectedComplaint.status === 'Assigned') && (
                  <button
                    onClick={handleStartWork}
                    className="min-h-[42px] px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all"
                  >
                    <Play className="w-4 h-4" />
                    <span>Start Work (In Progress)</span>
                  </button>
                )}

                <button
                  onClick={handleSimulateProofUpload}
                  className="min-h-[42px] px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-2 transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>{uploadedProof ? 'Proof Attached ✓' : 'Upload Proof Image'}</span>
                </button>
              </div>

              {/* Uploaded Proof Preview */}
              {uploadedProof && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                  <img src={uploadedProof} alt="Proof" className="w-14 h-14 rounded-xl object-cover border border-slate-300" />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 block">Repair Photographic Verification</span>
                    <span className="text-emerald-600 font-semibold">Attached to permanent work order record</span>
                  </div>
                </div>
              )}

              {/* ETA Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Estimated Time of Arrival (ETA)</label>
                  <input
                    type="text"
                    value={etaTime}
                    onChange={(e) => setEtaTime(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Current Assignee</label>
                  <div className="p-2 bg-white border border-slate-200 rounded-xl text-slate-800 font-semibold">
                    {selectedComplaint.assignedStaff || `${user.name} (Assigned)`}
                  </div>
                </div>
              </div>

              {/* Add Progress Comment Form */}
              <form onSubmit={handleAddComment} className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Add Technician Comment / Progress Update
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={staffNote}
                    onChange={(e) => setStaffNote(e.target.value)}
                    placeholder="e.g. Spare valve collected from central warehouse; heading to 3rd floor..."
                    className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Update</span>
                  </button>
                </div>
              </form>

              {/* Mark Resolved Section */}
              {selectedComplaint.status !== 'Resolved' && selectedComplaint.status !== 'Closed' && (
                <form onSubmit={handleMarkResolved} className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-xs font-bold text-emerald-900">Mark Work Order as Resolved</h3>
                  </div>
                  <textarea
                    value={resolutionComment}
                    onChange={(e) => setResolutionComment(e.target.value)}
                    rows={2}
                    placeholder="Enter resolution details (e.g. Replaced leaking PVC washer, pressurized line, tested for 15 mins)..."
                    className="w-full p-2.5 bg-white border border-emerald-300 rounded-xl text-xs"
                  />
                  <button
                    type="submit"
                    className="w-full min-h-[40px] px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete & Mark Resolved</span>
                  </button>
                </form>
              )}

              {/* Status History & Audit Notes */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Activity Timeline & Resolution Log
                </span>
                <div className="space-y-2 text-xs">
                  {selectedComplaint.history?.map((h, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{h.action}</span>
                          <span className="text-[10px] text-slate-400">by {h.actor}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">{h.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400 text-xs">
              Select a work order from the left column to view specifications and update status.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
