import React from 'react';
import {
  X,
  Home,
  CalendarCheck,
  Clock,
  BellRing,
  AlertTriangle,
  FileCheck2,
  KeyRound,
  UtensilsCrossed,
  Receipt,
  Bell,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { NavigationTab } from '../types/campus';
import { STUDENT_PROFILE } from '../data/mockCampusData';
import { Campus360Logo } from './Campus360Logo';
import { BRAND } from '../constants/brand';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: NavigationTab;
  onTabSelect: (tabName: NavigationTab) => void;
  unreadNoticesCount?: number;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabSelect,
  unreadNoticesCount = 6,
}) => {
  if (!isOpen) return null;

  const NAV_ITEMS: { id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'Home', label: 'Home', icon: Home },
    { id: 'Attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'Timetable', label: 'Timetable', icon: Clock },
    { id: 'Notices', label: 'Notices', icon: BellRing, badge: unreadNoticesCount },
    { id: 'Complaints', label: 'Complaints', icon: AlertTriangle, badge: 1 },
    { id: 'Requests', label: 'Requests', icon: FileCheck2 },
    { id: 'Gate Pass', label: 'Gate Pass', icon: KeyRound },
    { id: 'Mess', label: 'Mess', icon: UtensilsCrossed },
    { id: 'Fees & Dues', label: 'Fees & Dues', icon: Receipt },
    { id: 'Notifications', label: 'Notifications', icon: Bell, badge: 3 },
    { id: 'Profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div
        className="relative w-4/5 max-w-xs bg-[#0F172A] text-white flex flex-col h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200"
        role="dialog"
        aria-label="Navigation Menu"
      >
        {/* Drawer Header with Campus 360 Logo */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <Campus360Logo variant="horizontal" theme="dark" size="sm" />

          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            aria-label="Close navigation drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Profile Quick Card */}
        <div
          onClick={() => {
            onTabSelect('Profile');
            onClose();
          }}
          className="mx-3 my-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-3 cursor-pointer hover:bg-slate-800 transition-colors"
        >
          <img
            src={STUDENT_PROFILE.avatarUrl}
            alt={STUDENT_PROFILE.name}
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500/40 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-white truncate">{STUDENT_PROFILE.name}</h4>
            <p className="text-[11px] text-slate-400 truncate">{STUDENT_PROFILE.degree}</p>
            <p className="text-[10px] text-blue-400 font-mono mt-0.5">{STUDENT_PROFILE.rollNumber}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabSelect(item.id);
                  onClose();
                }}
                className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-md shadow-[#2563EB]/25 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white text-[#2563EB]' : 'bg-[#2563EB] text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Drawer Bottom Actions */}
        <div className="p-3 border-t border-slate-800 bg-[#090F1D] space-y-1">
          <button
            onClick={() => {
              onTabSelect('Profile');
              onClose();
            }}
            className="w-full flex items-center gap-3 min-h-[44px] px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Profile & Account</span>
          </button>

          <button
            onClick={() => {
              onTabSelect('Complaints');
              onClose();
            }}
            className="w-full flex items-center gap-3 min-h-[44px] px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Campus Helpdesk & Grievance</span>
          </button>

          <button
            onClick={() => {
              onClose();
            }}
            className="w-full flex items-center gap-3 min-h-[44px] px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 rounded-xl hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Close Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
