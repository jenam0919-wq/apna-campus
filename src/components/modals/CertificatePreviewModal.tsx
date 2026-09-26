import React, { useRef } from 'react';
import { Download, Printer, X, ShieldCheck, CheckCircle2, Award, Calendar, Building, Stamp } from 'lucide-react';
import { CertificateRequest } from '../../types/store';

interface CertificatePreviewModalProps {
  request: CertificateRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificatePreviewModal: React.FC<CertificatePreviewModalProps> = ({
  request,
  isOpen,
  onClose,
}) => {
  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !request) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const textContent = `========================================================================
CAMPUS 360 INSTITUTION OF ENGINEERING & TECHNOLOGY
OFFICE OF THE ACADEMIC REGISTRAR & DEAN OF ACADEMIC AFFAIRS
CAMPUS BLOCK A, TECH CITY • ACCREDITED A++ GRADE
========================================================================

CERTIFICATE OF BONAFIDE / OFFICIAL INSTITUTIONAL CLEARANCE
Reference No: ${request.verificationCode || 'CERT-2026-BF-9042A'}
Date of Issue: ${request.approvedAt || '23 September 2026'}
Status: VERIFIED & DIGITALLY REGISTERED

TO WHOM IT MAY CONCERN

This is to certify that:

  Candidate Name   : ${request.studentName}
  Roll Number      : ${request.rollNumber}
  Department       : ${request.department}
  Academic Year    : ${request.academicYear}
  Document Type    : ${request.type}

is a bona fide enrolled student of Apna Campus Institute of Technology.
This certificate is issued upon the student's formal electronic application
for the specific purpose of:
"${request.purpose}"

According to the institute records, their conduct and academic character
have been exemplary.

Issuing Authority:
${request.approvedBy || 'Dr. K. Venkataraman, Dean of Academic Operations'}
Central Academic Council, Apna Campus

Digital Cryptographic Verification Hash:
[SHA-256: 8f94a612bc48d910fe208479e0a29487c56ef982054bc118eac37105]
Scan or enter reference code at: https://apnacampus.edu/verify
========================================================================`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${request.id}_${request.type.replace(/\s+/g, '_')}_Official.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Action Header */}
        <div className="bg-[#0B132B] text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">Official Digital Certificate Preview</h3>
              <p className="text-[11px] text-slate-400">Verifiable Institutional Record • Ref: {request.verificationCode || request.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Area */}
        <div className="p-4 sm:p-8 overflow-y-auto bg-amber-50/20 flex-1">
          <div
            ref={certRef}
            className="bg-white border-8 border-double border-slate-800 p-6 sm:p-10 rounded-xl relative shadow-md text-slate-900"
          >
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
              <Award className="w-96 h-96 text-slate-900" />
            </div>

            {/* Top Emblem & Header */}
            <div className="text-center pb-6 border-b-2 border-slate-800/80">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-900 text-amber-400 mb-2 shadow-sm font-serif font-black text-xl">
                AC
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-black uppercase tracking-wider text-slate-900">
                Apna Campus Institute of Technology
              </h2>
              <p className="text-[11px] font-bold tracking-widest uppercase text-slate-600 mt-0.5">
                Accredited Grade A++ • Office of Academic Operations
              </p>
              <div className="mt-3 inline-block bg-slate-900 text-white font-serif text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-sm">
                {request.type}
              </div>
            </div>

            {/* Certificate Details */}
            <div className="py-6 space-y-4 text-xs sm:text-sm leading-relaxed font-serif">
              <div className="flex justify-between items-center text-xs text-slate-500 font-sans border-b border-slate-100 pb-2">
                <span>Ref: <strong className="font-mono text-slate-800">{request.verificationCode || 'CERT-2026-BF-9042A'}</strong></span>
                <span>Date: <strong className="text-slate-800">{request.approvedAt || '23 Sep 2026'}</strong></span>
              </div>

              <p className="text-slate-800 pt-2 indent-6">
                This is to officially certify that <strong>{request.studentName}</strong>, bearing University Roll Number{' '}
                <strong className="font-mono bg-slate-100 px-1 py-0.5 rounded">{request.rollNumber}</strong>, is a bona fide enrolled student in the{' '}
                <strong>{request.department}</strong>, studying in <strong>{request.academicYear}</strong> at this Institute.
              </p>

              <p className="text-slate-800 indent-6">
                This certificate is granted following student's formal request for the declared purpose of:
              </p>

              <div className="bg-slate-50 border-l-4 border-slate-800 p-3 text-xs italic font-sans text-slate-700 rounded-r-lg">
                "{request.purpose}"
              </div>

              <p className="text-slate-800 indent-6">
                According to institutional records, their conduct, character, and academic track record during their tenure have been thoroughly satisfactory.
              </p>
            </div>

            {/* Signature & Seal Footer */}
            <div className="pt-6 border-t border-slate-200 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
              {/* Digital Stamp Seal */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-emerald-600 p-1 flex items-center justify-center text-center text-[9px] font-bold text-emerald-800 uppercase tracking-tighter shrink-0 bg-emerald-50/50">
                  Apna Campus<br />DIGITALLY<br />STAMPED
                </div>
                <div className="text-[11px] text-slate-600">
                  <div className="font-bold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Cryptographically Validated
                  </div>
                  <div className="font-mono text-[10px] text-slate-500">Hash: 8f94-9042-VERIF</div>
                </div>
              </div>

              {/* Dean Signature */}
              <div className="text-center sm:text-right">
                <div className="font-serif italic font-bold text-sm text-slate-900 border-b border-slate-400 pb-1 px-4 inline-block">
                  Dr. K. Venkataraman
                </div>
                <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mt-0.5">
                  Dean of Academic Operations
                </p>
                <p className="text-[9px] text-slate-500">Authorized Signatory, Central Registry</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info bar */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 text-center text-xs text-slate-600 flex items-center justify-between px-5">
          <span className="flex items-center gap-1 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Permanent digital credential stored in student vault
          </span>
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-700 hover:text-slate-900 px-3 py-1 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
