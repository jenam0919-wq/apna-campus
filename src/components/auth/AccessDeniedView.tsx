import React from 'react';
import { ShieldAlert, ArrowLeft, LogOut, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../../types/auth';

interface AccessDeniedViewProps {
  currentRole: UserRole;
  attemptedRoute: string;
  onGoToMyDashboard: () => void;
  onLogout: () => void;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({
  currentRole,
  attemptedRoute,
  onGoToMyDashboard,
  onLogout,
}) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white border border-rose-200 rounded-3xl p-6 sm:p-10 max-w-lg w-full text-center shadow-xl space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border-2 border-rose-200">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-100/60 px-3 py-1 rounded-full">
            HTTP 403 Forbidden • RBAC Protected
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Access Denied</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            You do not have permission to access <code className="bg-slate-100 px-2 py-0.5 rounded font-mono text-xs text-rose-700">{attemptedRoute}</code>.
          </p>
          <p className="text-xs text-slate-500">
            Your current logged-in role is <strong>{currentRole}</strong>. This section requires elevated institutional clearance.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onGoToMyDashboard}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#1677FF] hover:bg-blue-600 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to My Dashboard</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm flex items-center justify-center gap-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4 text-slate-500" />
            <span>Switch Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
