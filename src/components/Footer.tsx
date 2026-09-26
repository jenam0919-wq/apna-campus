import React, { useState } from 'react';
import { Campus360Icon } from './Campus360Logo';
import { BRAND } from '../constants/brand';

export const Footer: React.FC = () => {
  const [showSupportModal, setShowSupportModal] = useState(false);

  return (
    <footer className="mt-12 py-6 border-t border-[#E2E8F0] text-xs text-[#64748B]">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Campus360Icon size={20} theme="colored" />
          <span className="font-extrabold text-[#0F172A] tracking-tight">{BRAND.name}</span>
          <span className="text-slate-300">·</span>
          <span className="text-[#64748B] font-medium">{BRAND.tagline}</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[#94A3B8]">
          <span>Enterprise Campus Portal</span>
          <span>·</span>
          <span>{BRAND.activeTerm}</span>
          <span>·</span>
          <button
            onClick={() => setShowSupportModal(true)}
            className="text-[#2563EB] hover:text-[#1D4ED8] font-semibold hover:underline cursor-pointer"
          >
            Helpdesk & Support
          </button>
        </div>
      </div>

      {showSupportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-sm w-full p-6 shadow-2xl text-slate-900 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2">
              <Campus360Icon size={28} theme="colored" />
              <h3 className="font-bold text-base text-[#0F172A]">{BRAND.name} Helpdesk</h3>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              For assistance with hostel complaints, certificates, attendance disputes, or account credentials, contact the central campus administration.
            </p>
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 text-xs space-y-1.5 font-mono">
              <div>Email: <span className="text-[#2563EB] font-bold">{BRAND.supportEmail}</span></div>
              <div>Emergency: <span className="text-emerald-700 font-bold">Ext: 3600 (24x7 Control Room)</span></div>
            </div>
            <button
              onClick={() => setShowSupportModal(false)}
              className="w-full min-h-[44px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};
