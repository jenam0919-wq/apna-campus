import React, { useState } from 'react';
import {
  AlertTriangle,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  Bot,
  Search,
  ChevronRight,
  X,
  Send,
  Building,
  Wrench,
  ShieldCheck,
  AlertCircle,
  FileText,
  Star,
  Image as ImageIcon,
  Check,
  ArrowRight,
} from 'lucide-react';
import { useCampusData, classifyComplaintWithAI } from '../../context/CampusDataContext';
import { Complaint } from '../../types/store';

export const ComplaintsView: React.FC = () => {
  const {
    complaints,
    createComplaint,
    updateComplaintStatus,
    confirmComplaintResolution,
    recurringAlerts,
  } = useCampusData();

  const [selectedTicketId, setSelectedTicketId] = useState<string>(complaints[0]?.id || 'CMP-1024');
  const [activeFilter, setActiveFilter] = useState<'All' | Complaint['status']>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);

  // New Complaint Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Complaint['category']>('Plumbing');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [newHostel, setNewHostel] = useState('Aryabhata Bhavan (Block B)');
  const [newRoom, setNewRoom] = useState('Room 312');
  const [newLocation, setNewLocation] = useState('3rd Floor West Corridor');
  const [newDescription, setNewDescription] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Resolution confirmation state
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');

  // AI Assistant live suggestion
  const aiSuggestion = React.useMemo(() => {
    if (!newTitle.trim() && !newDescription.trim()) return null;
    return classifyComplaintWithAI(newTitle, newDescription);
  }, [newTitle, newDescription]);

  // Selected ticket
  const selectedTicket = complaints.find((c) => c.id === selectedTicketId) || complaints[0] || null;

  // Filtered complaints
  const filtered = complaints.filter((item) => {
    if (activeFilter !== 'All' && item.status !== activeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.id.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.hostel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleApplyAISuggestion = () => {
    if (aiSuggestion) {
      setNewCategory(aiSuggestion.category);
      setNewPriority(aiSuggestion.priority);
    }
  };

  const handleCreateComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      const generatedId = createComplaint({
        title: newTitle,
        category: newCategory,
        description: newDescription,
        hostel: newHostel,
        room: newRoom,
        location: newLocation,
        priority: newPriority,
        studentName: 'Manoj Kumar Jena',
        studentEmail: 'student@campus360.edu',
        studentRoll: '2024CS1042',
      });

      setSelectedTicketId(generatedId);
      setShowReportModal(false);
      setNewTitle('');
      setNewDescription('');
      setAttachedImage(null);
      setSubmitting(false);

      setSuccessToast(`Complaint submitted successfully! Ticket ID: ${generatedId}`);
      setTimeout(() => setSuccessToast(null), 4000);
    }, 450);
  };

  const handleConfirmClose = () => {
    if (!selectedTicket) return;
    confirmComplaintResolution(selectedTicket.id, rating, feedback);
    setSuccessToast(`Resolution confirmed & ticket ${selectedTicket.id} closed. Thank you!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedTicket) return;
    updateComplaintStatus(selectedTicket.id, selectedTicket.status, `Student note: ${newComment}`);
    setNewComment('');
    setSuccessToast('Comment added to ticket history');
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Complaints & Maintenance Tickets
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Full lifecycle ticket tracking: AI auto-routing, SLA monitoring, and verification sign-off.
          </p>
        </div>

        <button
          onClick={() => setShowReportModal(true)}
          className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 bg-[#1677FF] hover:bg-blue-600 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Report Complaint</span>
        </button>
      </div>

      {/* Recurring Issue Detection Banner (Rule-Based Intelligence) */}
      {recurringAlerts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                  Recurring Issue Detected
                </span>
                <span className="text-xs text-amber-800 font-semibold">{recurringAlerts[0].detectedAt}</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-amber-950 mt-1">
                {recurringAlerts[0].message}
              </p>
              <p className="text-xs text-amber-800 mt-0.5">
                Recommended Action: <strong>{recurringAlerts[0].recommendedAction}</strong>
              </p>
            </div>
          </div>

          <div className="shrink-0 self-end md:self-center">
            <span className="text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-xl block">
              Flagged for Maintenance HOD
            </span>
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="flex sm:grid sm:grid-cols-5 gap-3 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
        <div className="min-w-[140px] flex-1 bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Tickets
          </span>
          <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
            {complaints.length}
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">Current Semester</p>
        </div>

        <div className="min-w-[140px] flex-1 bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
            Submitted
          </span>
          <span className="text-2xl font-extrabold text-[#1677FF] tabular-nums">
            {complaints.filter((c) => c.status === 'Submitted').length}
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">Queued for review</p>
        </div>

        <div className="min-w-[140px] flex-1 bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs">
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
            In Progress
          </span>
          <span className="text-2xl font-extrabold text-amber-600 tabular-nums">
            {complaints.filter((c) => c.status === 'In Progress' || c.status === 'Assigned').length}
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">Technicians on site</p>
        </div>

        <div className="min-w-[140px] flex-1 bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
            Resolved
          </span>
          <span className="text-2xl font-extrabold text-emerald-600 tabular-nums">
            {complaints.filter((c) => c.status === 'Resolved').length}
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">Pending student rating</p>
        </div>

        <div className="min-w-[140px] flex-1 bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs">
          <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">
            Closed
          </span>
          <span className="text-2xl font-extrabold text-purple-600 tabular-nums">
            {complaints.filter((c) => c.status === 'Closed').length}
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">Verified & confirmed</p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets by ID (CMP-1024), room, category..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1677FF]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {(['All', 'Submitted', 'Assigned', 'In Progress', 'Resolved', 'Closed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setActiveFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Ticket List (Left) & Ticket Details / Workflow (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Tickets List (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Complaints ({filtered.length})
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
              <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold">No complaints found</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or status filter.</p>
            </div>
          ) : (
            filtered.map((item) => {
              const isSelected = selectedTicket?.id === item.id;
              const isResolved = item.status === 'Resolved';

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedTicketId(item.id)}
                  className={`bg-white border rounded-2xl p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#1677FF] ring-2 ring-blue-500/20 shadow-md'
                      : 'border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                        {item.id}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                          item.priority === 'High'
                            ? 'bg-rose-100 text-rose-700'
                            : item.priority === 'Medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Closed'
                          ? 'bg-purple-100 text-purple-800'
                          : item.status === 'In Progress'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-2 line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{item.description}</p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {item.room}
                    </span>
                    <span className="font-medium text-slate-400">{item.createdAt}</span>
                  </div>

                  {isResolved && (
                    <div className="mt-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-2.5 py-1 text-[11px] font-bold flex items-center justify-between">
                      <span>Staff completed work! Ready for your sign-off</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Ticket Detail, Workflow & Student Confirmation */}
        <div className="lg:col-span-7">
          {selectedTicket ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
              {/* Ticket Top Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-[#1677FF] bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-100">
                      {selectedTicket.id}
                    </span>
                    <span className="text-xs font-bold text-slate-500">• {selectedTicket.category}</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                    {selectedTicket.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      selectedTicket.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedTicket.status === 'Closed'
                        ? 'bg-purple-100 text-purple-800'
                        : selectedTicket.status === 'In Progress'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    Status: {selectedTicket.status}
                  </span>
                </div>
              </div>

              {/* Location & Reported By Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hostel & Room</span>
                  <span className="text-xs font-bold text-slate-800">{selectedTicket.hostel}</span>
                  <span className="text-[11px] text-slate-500 block">{selectedTicket.room}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Staff</span>
                  <span className="text-xs font-bold text-slate-800">{selectedTicket.assignedStaff || 'Central Maintenance'}</span>
                  <span className="text-[11px] text-slate-500 block">{selectedTicket.assignedStaffRole || 'Technician'}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">AI Triage Routing</span>
                  <span className="text-xs font-bold text-indigo-700">{selectedTicket.aiRouting.department}</span>
                  <span className="text-[11px] text-slate-500 block">{selectedTicket.aiRouting.priority} Priority Team</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-600">Issue Description:</span>
                <p className="text-xs sm:text-sm text-slate-800 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                  {selectedTicket.description}
                </p>
              </div>

              {/* Staff Notes if available */}
              {selectedTicket.staffNotes && (
                <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                    <Wrench className="w-4 h-4 text-blue-600" />
                    <span>Technician Progress Note ({selectedTicket.assignedStaff || 'Staff'}):</span>
                  </div>
                  <p className="text-xs text-blue-800">{selectedTicket.staffNotes}</p>
                  {selectedTicket.resolvedAt && (
                    <span className="text-[10px] text-blue-600 block mt-1">Work completed at {selectedTicket.resolvedAt}</span>
                  )}
                </div>
              )}

              {/* Workflow Stepper */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Workflow Progression
                </span>
                <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-bold">
                  {[
                    { label: 'Submitted', key: 'Submitted' },
                    { label: 'Assigned', key: 'Assigned' },
                    { label: 'In Progress', key: 'In Progress' },
                    { label: 'Resolved', key: 'Resolved' },
                    { label: 'Closed', key: 'Closed' },
                  ].map((step, idx) => {
                    const stepOrder = ['Submitted', 'Assigned', 'In Progress', 'Resolved', 'Closed'];
                    const currentIdx = stepOrder.indexOf(selectedTicket.status);
                    const isDone = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div
                        key={step.key}
                        className={`p-2 rounded-xl border transition-all ${
                          isDone
                            ? 'bg-blue-50 border-blue-400 text-[#1677FF]'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        <div className="font-extrabold">{step.label}</div>
                        {isCurrent && <div className="text-[9px] text-blue-600 mt-0.5">● Current</div>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Workflow Step: Student Confirmation when Resolved */}
              {selectedTicket.status === 'Resolved' && (
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 space-y-4 animate-in zoom-in-95">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-emerald-950">
                        Technician Marked this Issue as Resolved!
                      </h3>
                      <p className="text-xs text-emerald-800 mt-0.5">
                        Please inspect the room/fixture. If satisfied, submit your rating to officially close the ticket.
                      </p>
                    </div>
                  </div>

                  {/* Rating Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Rate Maintenance Service Quality:</label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRating(s)}
                          className={`p-2 rounded-xl transition-all ${
                            rating >= s ? 'text-amber-500 scale-110' : 'text-slate-300 hover:text-slate-400'
                          }`}
                        >
                          <Star className={`w-6 h-6 ${rating >= s ? 'fill-amber-400' : ''}`} />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-slate-600 ml-2">
                        {rating === 5 ? 'Excellent' : rating === 4 ? 'Very Good' : rating === 3 ? 'Satisfactory' : 'Needs Improvement'}
                      </span>
                    </div>
                  </div>

                  {/* Feedback text */}
                  <div>
                    <input
                      type="text"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Add brief feedback (optional, e.g. Prompt fix, clean work...)"
                      className="w-full text-xs p-2.5 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <button
                    onClick={handleConfirmClose}
                    className="w-full min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirm Resolution & Close Ticket</span>
                  </button>
                </div>
              )}

              {/* Closed Review Summary */}
              {selectedTicket.status === 'Closed' && (
                <div className="bg-purple-50/60 border border-purple-200 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-purple-900 block">Ticket Officially Closed</span>
                    <span className="text-[11px] text-purple-700">Closed at {selectedTicket.closedAt || 'Recent'}</span>
                    {selectedTicket.studentFeedback && (
                      <p className="text-xs text-slate-600 mt-1 italic">"{selectedTicket.studentFeedback}"</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: selectedTicket.studentRating || 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                </div>
              )}

              {/* Audit Timeline */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Audit Trail & History
                </span>
                <div className="space-y-2.5">
                  {selectedTicket.history.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <span className="font-semibold text-slate-800">{h.action}</span>
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>{h.date}</span>
                          <span>•</span>
                          <span className="font-medium text-slate-600">{h.actor}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Comment Box */}
              {selectedTicket.status !== 'Closed' && (
                <form onSubmit={handleAddComment} className="pt-2 border-t border-slate-100 flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add an update or note to this ticket..."
                    className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1677FF]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400">
              Select a complaint ticket to inspect its lifecycle.
            </div>
          )}
        </div>
      </div>

      {/* REPORT COMPLAINT MODAL (Section 11, 28) */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto">
            {/* Header */}
            <div className="bg-[#0B132B] text-white p-5 sm:p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg">Submit Maintenance Complaint</h3>
                  <p className="text-xs text-slate-400">AI auto-classification & immediate department assignment</p>
                </div>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateComplaint} className="p-5 sm:p-6 space-y-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Category *
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1677FF]"
                >
                  <option value="Plumbing">Plumbing (Pipes, Taps, Drainage)</option>
                  <option value="Electricity">Electricity (Lighting, Wiring, Switches)</option>
                  <option value="Cleaning">Cleaning & Sanitation</option>
                  <option value="Wi-Fi">Wi-Fi & Network Access</option>
                  <option value="Furniture">Furniture & Fixtures</option>
                  <option value="Bathroom">Bathroom Fixtures</option>
                  <option value="Fan/AC">Fan / Air Conditioning</option>
                  <option value="Water">Water Supply & Geyser</option>
                  <option value="Other">Other Maintenance</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Issue Title *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Water is leaking from the bathroom pipe"
                  required
                  className="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1677FF]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Detailed Description *
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe the exact issue, frequency, and severity..."
                  required
                  className="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1677FF]"
                />
              </div>

              {/* AI Complaint Routing Helper Card (Section 28) */}
              {aiSuggestion && (
                <div className="bg-indigo-50/80 border border-indigo-200 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-950">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      AI Complaint Classification Engine
                    </span>
                    <button
                      type="button"
                      onClick={handleApplyAISuggestion}
                      className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 bg-white px-2 py-0.5 rounded-lg border border-indigo-200 shadow-xs"
                    >
                      Apply Suggestion
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">Suggested Category:</span>
                      <span className="font-bold text-indigo-900">{aiSuggestion.category}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">Recommended Priority:</span>
                      <span className="font-bold text-indigo-900">{aiSuggestion.priority}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">Assigned Team:</span>
                      <span className="font-medium text-slate-800">{aiSuggestion.assignedTeam}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Location Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Hostel Block</label>
                  <input
                    type="text"
                    value={newHostel}
                    onChange={(e) => setNewHostel(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Room / Location</label>
                  <input
                    type="text"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['High', 'Medium', 'Low'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewPriority(p)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                        newPriority === p
                          ? 'bg-[#1677FF] text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {p} Priority
                    </button>
                  ))}
                </div>
              </div>

              {/* Mock photo attachment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Attachment (Photo Proof)</label>
                <button
                  type="button"
                  onClick={() => setAttachedImage('fixture_photo_sample.jpg')}
                  className="w-full p-2.5 border border-dashed border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2"
                >
                  <ImageIcon className="w-4 h-4 text-slate-400" />
                  <span>{attachedImage ? `Attached: ${attachedImage}` : 'Click to simulate attaching photo proof'}</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-[#1677FF] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md active:scale-95 transition-all flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Auto-routing...' : 'Submit Complaint'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
