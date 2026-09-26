import React, { useState } from 'react';
import {
  FileCheck2,
  Download,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  ChevronRight,
  Sparkles,
  X,
  FileBadge,
  Eye,
  Send,
  Award,
} from 'lucide-react';
import { useCampusData } from '../../context/CampusDataContext';
import { CertificateRequest } from '../../types/store';
import { CertificatePreviewModal } from '../modals/CertificatePreviewModal';

export const RequestsView: React.FC = () => {
  const { certificateRequests, createCertificateRequest } = useCampusData();

  const [selectedReqId, setSelectedReqId] = useState<string>(certificateRequests[0]?.id || 'REQ-1001');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | CertificateRequest['status']>('All');
  const [showNewModal, setShowNewModal] = useState(false);

  // New Request state
  const [certType, setCertType] = useState<CertificateRequest['type']>('Bonafide Certificate');
  const [purpose, setPurpose] = useState('');
  const [urgency, setUrgency] = useState<'Normal' | 'Urgent'>('Normal');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Modal for downloading / viewing certificate
  const [previewCert, setPreviewCert] = useState<CertificateRequest | null>(null);

  const selectedReq = certificateRequests.find((r) => r.id === selectedReqId) || certificateRequests[0] || null;

  const filtered = certificateRequests.filter((r) => {
    if (statusFilter !== 'All' && r.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.id.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        r.purpose.toLowerCase().includes(q) ||
        r.studentName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      const generatedId = createCertificateRequest({
        type: certType,
        studentName: 'Manoj Kumar Jena',
        rollNumber: '2024CS1042',
        department: 'Computer Science & Engineering',
        academicYear: '2026-2027 (3rd Year)',
        purpose,
        urgency,
      });

      setSelectedReqId(generatedId);
      setShowNewModal(false);
      setPurpose('');
      setSubmitting(false);

      setToast(`Certificate request ${generatedId} submitted to Registrar Desk.`);
      setTimeout(() => setToast(null), 4000);
    }, 450);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Digital Certificates & Approvals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Apply for Bonafide, Study, Character & Fee NOC certificates. Track approvals and download digitally signed documents.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 bg-[#1677FF] hover:bg-blue-600 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Request Certificate</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID (REQ-1001), certificate type, or purpose..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1677FF]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {(['All', 'Submitted', 'Under Review', 'Approved', 'Rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Request List (5 cols) & Selected Details (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Request List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Applications ({filtered.length})
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
              <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold">No requests match your filter</p>
            </div>
          ) : (
            filtered.map((item) => {
              const isSelected = selectedReq?.id === item.id;
              const isApproved = item.status === 'Approved';

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedReqId(item.id)}
                  className={`bg-white border rounded-2xl p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#1677FF] ring-2 ring-blue-500/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                        {item.id}
                      </span>
                      {item.urgency === 'Urgent' && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-rose-100 text-rose-700">
                          Urgent
                        </span>
                      )}
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-2 line-clamp-1">{item.type}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{item.purpose}</p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Applied: {item.createdAt}</span>
                    {isApproved && (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Ready to Download
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Details & Certificate Download Workflow */}
        <div className="lg:col-span-7">
          {selectedReq ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-[#1677FF] bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-100">
                      {selectedReq.id}
                    </span>
                    <span className="text-xs font-bold text-slate-500">• {selectedReq.academicYear}</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                    {selectedReq.type}
                  </h2>
                </div>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    selectedReq.status === 'Approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedReq.status === 'Rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {selectedReq.status}
                </span>
              </div>

              {/* Student Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Student</span>
                  <span className="text-xs font-bold text-slate-900">{selectedReq.studentName}</span>
                  <span className="text-[11px] text-slate-500 font-mono block">{selectedReq.rollNumber}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Department</span>
                  <span className="text-xs font-bold text-slate-900">{selectedReq.department}</span>
                  <span className="text-[11px] text-slate-500 block">Class of 2027</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Urgency / SLA</span>
                  <span className="text-xs font-bold text-indigo-700">{selectedReq.urgency} Processing</span>
                  <span className="text-[11px] text-slate-500 block">{selectedReq.urgency === 'Urgent' ? 'Within 24 hrs' : 'Within 3 days'}</span>
                </div>
              </div>

              {/* Stated Purpose */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-600">Application Purpose:</span>
                <p className="text-xs sm:text-sm text-slate-800 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                  {selectedReq.purpose}
                </p>
              </div>

              {/* Workflow Stepper: Submitted -> Under Review -> Approved -> Generated -> Download */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Verification Lifecycle
                </span>
                <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold">
                  {[
                    { label: 'Submitted', key: 'Submitted' },
                    { label: 'Under Review', key: 'Under Review' },
                    { label: 'Approved', key: 'Approved' },
                    { label: 'Ready to Download', key: 'Generated' },
                  ].map((step, idx) => {
                    const stepOrder = ['Submitted', 'Under Review', 'Approved'];
                    const currentIdx = stepOrder.indexOf(selectedReq.status);
                    const isDone = selectedReq.status === 'Approved' ? true : idx <= currentIdx;

                    return (
                      <div
                        key={step.key}
                        className={`p-2 rounded-xl border transition-all ${
                          isDone
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        <div className="font-extrabold">{step.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* If Approved: Download Certificate Banner */}
              {selectedReq.status === 'Approved' && (
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-emerald-950">
                          Digital Certificate Generated & Ready
                        </h3>
                        <p className="text-xs text-emerald-800 mt-0.5">
                          Digitally stamped by {selectedReq.approvedBy || 'Dean Dr. K. Venkataraman'}. Valid for official submissions.
                        </p>
                        <div className="mt-1 font-mono text-[11px] font-semibold text-emerald-700">
                          Verification Ref: {selectedReq.verificationCode || 'CERT-2026-BF-9042A'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                    <button
                      onClick={() => setPreviewCert(selectedReq)}
                      className="w-full sm:flex-1 min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Preview Official Certificate</span>
                    </button>
                    <button
                      onClick={() => setPreviewCert(selectedReq)}
                      className="w-full sm:w-auto min-h-[44px] px-4 bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-900 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Stamped Document</span>
                    </button>
                  </div>
                </div>
              )}

              {/* If Rejected: Show reason */}
              {selectedReq.status === 'Rejected' && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-800">
                  <span className="font-bold block">Application Declined:</span>
                  <p className="mt-1">{selectedReq.rejectionReason || 'Incomplete documentation or eligibility requirements not met.'}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400">
              Select an application to view details.
            </div>
          )}
        </div>
      </div>

      {/* NEW REQUEST MODAL */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-auto">
            <div className="bg-[#0B132B] text-white p-5 sm:p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
                  <FileBadge className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg">Apply for Certificate</h3>
                  <p className="text-xs text-slate-400">Electronic submission to Registrar & Dean Council</p>
                </div>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="p-5 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Certificate Type *
                </label>
                <select
                  value={certType}
                  onChange={(e) => setCertType(e.target.value as any)}
                  className="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1677FF]"
                >
                  <option value="Bonafide Certificate">Bonafide Certificate (General / Competitions)</option>
                  <option value="Study Certificate">Study Certificate (Academic Proof)</option>
                  <option value="Character Certificate">Character Certificate</option>
                  <option value="Fee Certificate">Fee Certificate & NOC (Bank / Loan Subsidy)</option>
                  <option value="Hostel Certificate">Hostel Resident Certificate</option>
                  <option value="Other">Other Institutional Recommendation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Purpose / External Organization *
                </label>
                <textarea
                  rows={3}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Specify purpose e.g. National Hackathon registration, Passport verification, or Education Loan subsidy..."
                  required
                  className="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1677FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Processing Urgency</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Normal', 'Urgent'] as const).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUrgency(u)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                        urgency === u
                          ? 'bg-[#1677FF] text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {u} {u === 'Urgent' ? '(Fast-Track 24h)' : '(Standard 3 Days)'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-[11px] text-blue-800">
                Candidate: <strong>Manoj Kumar Jena</strong> (Roll: <strong>2024CS1042</strong>) • Semester 3
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-[#1677FF] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md active:scale-95 transition-all flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Submit Application'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Certificate Download & Printable Modal */}
      <CertificatePreviewModal
        isOpen={!!previewCert}
        request={previewCert}
        onClose={() => setPreviewCert(null)}
      />
    </div>
  );
};
