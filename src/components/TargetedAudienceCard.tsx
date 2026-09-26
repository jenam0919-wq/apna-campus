import React from 'react';
import { Sparkles, ShieldCheck, UserCheck, Layers, Check } from 'lucide-react';
import { TARGET_PROFILE } from '../data/mockNotices';

export const TargetedAudienceCard: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3.5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Target Audience
            </h3>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#2563EB] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
              <Sparkles className="w-2.5 h-2.5" />
              Personalized for you
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Apna Campus smart filtering delivers relevant notices based on your profile.
          </p>
        </div>
      </div>

      {/* Target Breakdown Pills */}
      <div className="space-y-2">
        <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs">
          <span className="text-slate-500 font-medium">Department</span>
          <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
            {TARGET_PROFILE.branch}
          </span>
        </div>

        <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs">
          <span className="text-slate-500 font-medium">Academic Year</span>
          <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
            {TARGET_PROFILE.year}
          </span>
        </div>

        <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs">
          <span className="text-slate-500 font-medium">Class Section</span>
          <span className="font-bold text-[#1677FF] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            {TARGET_PROFILE.section}
          </span>
        </div>

        <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs">
          <span className="text-slate-500 font-medium">Hostel Residence</span>
          <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
            {TARGET_PROFILE.hostel}
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500 leading-normal">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
        <span>
          No spam or irrelevant circulars. You only receive verified institutional notices tailored to your curriculum and hostel block.
        </span>
      </div>
    </div>
  );
};
