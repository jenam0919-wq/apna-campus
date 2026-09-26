import React, { useState } from 'react';
import {
  KeyRound,
  QrCode,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Send,
  Sparkles,
  Search,
  ScanLine,
} from 'lucide-react';
import { useCampusData } from '../../context/CampusDataContext';
import { GatePass } from '../../types/store';
import { GatePassVerificationModal } from '../modals/GatePassVerificationModal';

export const GatePassView: React.FC = () => {
  const { gatePasses, applyGatePass } = useCampusData();

  const [selectedPassId, setSelectedPassId] = useState<string>(gatePasses[0]?.id || 'GP-2026-001');
  const [destination, setDestination] = useState('');
  const [reason, setReason] = useState('');
  const [departureTime, setDepartureTime] = useState('2026-09-23 17:00');
  const [expectedReturnTime, setExpectedReturnTime] = useState('2026-09-23 21:00');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Security Verification Scanner Modal state
  const [scannerOpen, setScannerOpen] = useState(false);
  const [testCodeForScanner, setTestCodeForScanner] = useState<string>('');

  const selectedPass = gatePasses.find((p) => p.id === selectedPassId) || gatePasses[0] || null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim() || !reason.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      const generatedId = applyGatePass({
        studentName: 'Manoj Kumar Jena',
        studentRoll: '2024CS1042',
        studentHostel: 'Aryabhata Bhavan (Block B)',
        studentRoom: 'Room 312',
        destination,
        reason,
        departureTime,
        expectedReturnTime,
      });

      setSelectedPassId(generatedId);
      setDestination('');
      setReason('');
      setSubmitting(false);

      setToast(`Gate Pass application ${generatedId} submitted to Hostel Warden.`);
      setTimeout(() => setToast(null), 4000);
    }, 400);
  };

  const handleOpenScannerWithCode = (code: string) => {
    setTestCodeForScanner(code);
    setScannerOpen(true);
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

      {/* Header with Security Gate Scanner Launcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Smart RFID & QR Gate Pass
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Submit outing requests, receive warden authorization, and scan dynamic QR codes at campus checkpoints.
          </p>
        </div>

        {/* Security QR Verification button */}
        <button
          onClick={() => handleOpenScannerWithCode(selectedPass?.id || 'GP-2026-001')}
          className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <ScanLine className="w-4 h-4 text-emerald-400" />
          <span>Security QR Scanner Station</span>
        </button>
      </div>

      {/* Main Grid: Form (5 cols) & Pass Details / QR (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Apply Form */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1677FF] flex items-center justify-center">
              <KeyRound className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Apply for Campus Exit Permit</h3>
              <p className="text-xs text-slate-500">Auto-routes to Chief Warden</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Destination *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. City Center Mall, Book Market, Railway Station..."
                  required
                  className="w-full min-h-[44px] pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1677FF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Reason for Outing *
              </label>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="State valid reason for exit clearance..."
                required
                className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1677FF]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Departure Time *
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    required
                    className="w-full min-h-[44px] pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Expected Return *
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={expectedReturnTime}
                    onChange={(e) => setExpectedReturnTime(e.target.value)}
                    required
                    className="w-full min-h-[44px] pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-[11px] text-blue-800">
              Hostel Assigned: <strong>Aryabhata Bhavan (Block B) • Room 312</strong>. Warden: <strong>Er. Sandeep Rathore</strong>.
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full min-h-[44px] px-5 py-2.5 bg-[#1677FF] hover:bg-blue-600 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Transmitting to Warden...' : 'Apply for Gate Pass'}</span>
            </button>
          </form>

          {/* Quick List of past/recent passes */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Recent Gate Passes
            </span>
            <div className="space-y-1.5">
              {gatePasses.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPassId(p.id)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                    selectedPass?.id === p.id
                      ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <span className="font-mono">{p.id}</span> • {p.destination}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : p.status === 'Completed'
                        ? 'bg-purple-100 text-purple-800'
                        : p.status === 'Rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Pass Digital ID Card & Dynamic QR */}
        <div className="lg:col-span-7">
          {selectedPass ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                      {selectedPass.id}
                    </span>
                    <span className="text-xs font-bold text-slate-500">Hostel Exit Clearance</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                    {selectedPass.destination}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      selectedPass.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedPass.status === 'Completed'
                        ? 'bg-purple-100 text-purple-800'
                        : selectedPass.status === 'Rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    Status: {selectedPass.status}
                  </span>
                </div>
              </div>

              {/* Pass details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Student Details</span>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedPass.studentName}</p>
                  <p className="text-slate-500 font-mono text-[11px]">{selectedPass.studentRoll} • {selectedPass.studentHostel}</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Outing Schedule</span>
                  <p className="font-bold text-slate-900 mt-0.5">Depart: {selectedPass.departureTime}</p>
                  <p className="text-emerald-700 font-bold text-[11px]">Curfew Return: {selectedPass.expectedReturnTime}</p>
                </div>
              </div>

              {/* Purpose */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Reason for Outing</span>
                <p className="text-xs text-slate-800 mt-0.5 font-medium">{selectedPass.reason}</p>
              </div>

              {/* QR Code Presentation Box (When Approved or Pending) */}
              <div className="p-6 bg-radial from-slate-900 to-slate-950 text-white rounded-3xl text-center space-y-4 shadow-lg border border-slate-800">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold border border-blue-400/30">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Dynamic Security Checkpoint Pass</span>
                </div>

                <div className="flex flex-col items-center justify-center">
                  {/* Dynamic QR Code representation */}
                  <div className="bg-white p-4 rounded-2xl shadow-xl border-4 border-slate-700 inline-block">
                    <svg viewBox="0 0 100 100" className="w-40 h-40">
                      {/* Stylized realistic QR patterns */}
                      <rect width="100" height="100" fill="#ffffff" />
                      {/* Corner 1 */}
                      <rect x="10" y="10" width="28" height="28" fill="#0f172a" />
                      <rect x="14" y="14" width="20" height="20" fill="#ffffff" />
                      <rect x="18" y="18" width="12" height="12" fill="#0f172a" />
                      {/* Corner 2 */}
                      <rect x="62" y="10" width="28" height="28" fill="#0f172a" />
                      <rect x="66" y="14" width="20" height="20" fill="#ffffff" />
                      <rect x="70" y="18" width="12" height="12" fill="#0f172a" />
                      {/* Corner 3 */}
                      <rect x="10" y="62" width="28" height="28" fill="#0f172a" />
                      <rect x="14" y="66" width="20" height="20" fill="#ffffff" />
                      <rect x="18" y="70" width="12" height="12" fill="#0f172a" />
                      {/* Data Dots */}
                      <rect x="44" y="12" width="6" height="6" fill="#0f172a" />
                      <rect x="52" y="18" width="6" height="6" fill="#0f172a" />
                      <rect x="42" y="28" width="6" height="6" fill="#0f172a" />
                      <rect x="52" y="36" width="6" height="6" fill="#0f172a" />
                      <rect x="14" y="44" width="6" height="6" fill="#0f172a" />
                      <rect x="26" y="48" width="6" height="6" fill="#0f172a" />
                      <rect x="36" y="44" width="6" height="6" fill="#0f172a" />
                      <rect x="46" y="48" width="6" height="6" fill="#0f172a" />
                      <rect x="56" y="44" width="6" height="6" fill="#0f172a" />
                      <rect x="66" y="48" width="6" height="6" fill="#0f172a" />
                      <rect x="78" y="44" width="6" height="6" fill="#0f172a" />
                      <rect x="44" y="58" width="6" height="6" fill="#0f172a" />
                      <rect x="54" y="66" width="6" height="6" fill="#0f172a" />
                      <rect x="44" y="76" width="6" height="6" fill="#0f172a" />
                      <rect x="64" y="66" width="6" height="6" fill="#0f172a" />
                      <rect x="76" y="72" width="6" height="6" fill="#0f172a" />
                      <rect x="84" y="80" width="6" height="6" fill="#0f172a" />
                    </svg>
                  </div>
                  <div className="mt-3 font-mono text-xs text-slate-300">
                    ID: {selectedPass.id} • {selectedPass.studentRoll}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-xs text-slate-400">
                  {selectedPass.status === 'Approved' ? (
                    <div className="text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Cleared by {selectedPass.approvedBy || 'Chief Warden Sandeep Rathore'}</span>
                    </div>
                  ) : selectedPass.status === 'Pending' ? (
                    <div className="text-amber-400 font-bold">
                      Awaiting Warden Approval Review
                    </div>
                  ) : (
                    <div>Status: {selectedPass.status}</div>
                  )}
                </div>

                {/* Test button to simulate scanning this exact QR code */}
                <button
                  onClick={() => handleOpenScannerWithCode(selectedPass.id)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  Test Scan this Pass at Security Gate
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400">
              No gate pass selected.
            </div>
          )}
        </div>
      </div>

      {/* Verification Scanner Modal */}
      <GatePassVerificationModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        initialCode={testCodeForScanner}
      />
    </div>
  );
};
