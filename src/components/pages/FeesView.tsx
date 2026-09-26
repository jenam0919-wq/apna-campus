import React, { useState } from 'react';
import {
  Receipt,
  CheckCircle2,
  Clock,
  Download,
  AlertCircle,
  CreditCard,
  ShieldCheck,
  QrCode,
  Smartphone,
  Building,
  Sparkles,
  X,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { STUDENT_PROFILE } from '../../data/mockCampusData';

interface PaymentItem {
  id: string;
  item: string;
  amount: number;
  date: string;
  mode: string;
  status: 'Paid' | 'Pending';
  receiptUrl?: string;
}

export const FeesView: React.FC = () => {
  const [payments, setPayments] = useState<PaymentItem[]>([
    {
      id: 'RCP-2026-901',
      item: 'Semester 3 Academic Tuition & Lab Fee',
      amount: 72500,
      date: '12 Jul 2026',
      mode: 'Net Banking (SBI)',
      status: 'Paid',
    },
    {
      id: 'RCP-2026-902',
      item: 'Hostel B Accommodation & Central Mess Advance',
      amount: 38000,
      date: '15 Jul 2026',
      mode: 'UPI (GPay)',
      status: 'Paid',
    },
    {
      id: 'RCP-2026-903',
      item: 'IEEE Student Chapter & Library Security Deposit',
      amount: 3500,
      date: '20 Jul 2026',
      mode: 'Debit Card',
      status: 'Paid',
    },
  ]);

  // Pending fee item to pay
  const [pendingAmount, setPendingAmount] = useState<number>(12500);
  const [pendingTitle, setPendingTitle] = useState<string>('Mid-Semester Examination Fee & Practical Lab Assessment');
  const [dueDate, setDueDate] = useState<string>('30 Sep 2026');

  // Payment Modal State
  const [showPayModal, setShowPayModal] = useState<boolean>(false);
  const [payMethod, setPayMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('rahul.sharma@okaxis');
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const totalPaid = payments.reduce((acc, p) => (p.status === 'Paid' ? acc + p.amount : acc), 0);
  const totalFees = totalPaid + pendingAmount;

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    setTimeout(() => {
      const txnId = `TXN-2026-00${payments.length + 1}`;
      const newPaidItem: PaymentItem = {
        id: txnId,
        item: pendingTitle,
        amount: pendingAmount,
        date: 'Today, 23 Sep 2026',
        mode: payMethod === 'upi' ? `UPI (${upiId})` : payMethod === 'card' ? 'Visa Debit Card' : 'Net Banking',
        status: 'Paid',
      };

      setPayments([newPaidItem, ...payments]);
      setPendingAmount(0);
      setProcessing(false);
      setShowPayModal(false);
      triggerToast(`Payment of ₹${newPaidItem.amount.toLocaleString()} Successful! Generated Receipt ${txnId}`);
    }, 1200);
  };

  const handleDownloadReceipt = (p: PaymentItem) => {
    const textContent = `========================================================================
CAMPUS 360 CENTRAL FINANCE & BURSAR DESK
OFFICIAL STUDENT FEE RECEIPT
========================================================================
Transaction Reference: ${p.id}
Student Name         : ${STUDENT_PROFILE.name}
Roll Number          : ${STUDENT_PROFILE.rollNumber}
Degree / Branch      : ${STUDENT_PROFILE.degree}
Hostel & Room        : ${STUDENT_PROFILE.hostel}, ${STUDENT_PROFILE.room}
------------------------------------------------------------------------
Fee Particulars      : ${p.item}
Amount Paid          : INR ₹${p.amount.toLocaleString()}
Payment Gateway Mode : ${p.mode}
Transaction Timestamp: ${p.date}
Payment Clearance    : SUCCESS (100% RECONCILED)
------------------------------------------------------------------------
Status               : ZERO DUES CLEARED FOR THIS HEAD
Apna Campus Financial Digital Seal: [APNACAMPUS-FIN-AUTH-STAMP-VERIFIED]
========================================================================`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt_${p.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    triggerToast(`Downloaded electronic receipt ${p.id}`);
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
            Institutional Fees & Clearance Dues
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Instant digital fee payment, automated ledger reconciliation, and downloadable receipts.
          </p>
        </div>

        {pendingAmount === 0 ? (
          <div className="px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Admit Card Clearance Active (Zero Dues)</span>
          </div>
        ) : (
          <button
            onClick={() => setShowPayModal(true)}
            className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 bg-[#1677FF] hover:bg-blue-600 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all"
          >
            <CreditCard className="w-4 h-4" />
            <span>Pay Pending Dues (₹{pendingAmount.toLocaleString()})</span>
          </button>
        )}
      </div>

      {/* KPI Balance Cards (Section 23) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Total Semester Fees
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tabular-nums">
            ₹{totalFees.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Academic Year 2026-27</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
            Total Paid Amount
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1 tabular-nums">
            ₹{totalPaid.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Reconciled with Finance Desk</p>
        </div>

        <div
          className={`border rounded-3xl p-5 shadow-xs transition-all ${
            pendingAmount > 0 ? 'bg-amber-50/70 border-amber-300 text-amber-950' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider block ${
                pendingAmount > 0 ? 'text-amber-700' : 'text-slate-400'
              }`}
            >
              Pending Outstanding Dues
            </span>
            {pendingAmount > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                Due: {dueDate}
              </span>
            )}
          </div>
          <div
            className={`text-2xl sm:text-3xl font-extrabold mt-1 tabular-nums ${
              pendingAmount > 0 ? 'text-amber-600' : 'text-slate-900'
            }`}
          >
            ₹{pendingAmount.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {pendingAmount > 0 ? 'Action Required before exam cutoff' : 'All clear. Zero pending balance.'}
          </p>
        </div>
      </div>

      {/* Pending Fee Banner if amount > 0 */}
      {pendingAmount > 0 && (
        <div className="bg-white border-2 border-blue-200 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#1677FF] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#1677FF] bg-blue-50 px-2 py-0.5 rounded-md">
                Unsettled Fee Invoice
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                {pendingTitle}
              </h3>
              <p className="text-xs text-slate-500">
                Amount Payable: <strong className="text-slate-900">₹{pendingAmount.toLocaleString()}</strong> • Due before {dueDate}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowPayModal(true)}
            className="px-5 py-2.5 bg-[#1677FF] hover:bg-blue-600 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all self-end sm:self-center"
          >
            Pay Now
          </button>
        </div>
      )}

      {/* Receipts list */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Payment History & Tax Receipts</h3>
            <p className="text-xs text-slate-400">All payments are cryptographically timestamped & verified</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">{payments.length} Transactions</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {payments.map((r) => (
            <div
              key={r.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-[#1677FF] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {r.id}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    ✓ Paid
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-1.5">{r.item}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{r.date} • {r.mode}</p>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center">
                <span className="font-extrabold text-slate-900 text-sm sm:text-base tabular-nums">
                  ₹{r.amount.toLocaleString()}
                </span>
                <button
                  onClick={() => handleDownloadReceipt(r)}
                  className="min-h-[40px] px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center gap-1.5 transition-colors active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Receipt</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PAYMENT PROCESSING SIMULATION MODAL (Section 23) */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-auto">
            {/* Header */}
            <div className="bg-[#0F172A] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Apna Campus Secure Payment Gateway</h3>
                  <p className="text-xs text-slate-400">256-bit Encrypted Transaction</p>
                </div>
              </div>
              <button
                onClick={() => !processing && setShowPayModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bill Summary */}
            <div className="p-5 bg-slate-50 border-b border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Due</span>
              <div className="text-2xl font-black text-slate-900 mt-0.5">
                ₹{pendingAmount.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{pendingTitle}</p>
            </div>

            {/* Method Tabs */}
            <form onSubmit={handleSimulatePayment} className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPayMethod('upi')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                    payMethod === 'upi' ? 'bg-blue-50 border-[#1677FF] text-[#1677FF]' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>UPI / QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPayMethod('card')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                    payMethod === 'card' ? 'bg-blue-50 border-[#1677FF] text-[#1677FF]' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPayMethod('netbanking')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                    payMethod === 'netbanking' ? 'bg-blue-50 border-[#1677FF] text-[#1677FF]' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>NetBanking</span>
                </button>
              </div>

              {/* Method input */}
              {payMethod === 'upi' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">Enter UPI ID / VPA</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                    placeholder="e.g. mobile@upi or username@okhdfcbank"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                  <div className="flex gap-2 pt-1">
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">Google Pay</span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">PhonePe</span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">Paytm</span>
                  </div>
                </div>
              )}

              {payMethod === 'card' && (
                <div className="space-y-2 text-xs">
                  <label className="font-bold text-slate-700 block">Card Details (Simulated)</label>
                  <input
                    type="text"
                    defaultValue="4532 •••• •••• 9081"
                    disabled
                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl font-mono text-slate-600"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      defaultValue="08/29"
                      disabled
                      className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl font-mono text-slate-600"
                    />
                    <input
                      type="text"
                      defaultValue="•••"
                      disabled
                      className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl font-mono text-slate-600"
                    />
                  </div>
                </div>
              )}

              {payMethod === 'netbanking' && (
                <div className="space-y-2 text-xs">
                  <label className="font-bold text-slate-700 block">Select Primary Bank</label>
                  <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <option>State Bank of India (SBI)</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Punjab National Bank (PNB)</option>
                  </select>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  Bank Grade PCI-DSS
                </span>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay ₹{pendingAmount.toLocaleString()}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
