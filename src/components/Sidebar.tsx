import React from 'react';
import {
  Calendar,
  CheckSquare,
  Home,
  Bell,
  AlertCircle,
  FileText,
  KeyRound,
  Utensils,
  CreditCard,
  User,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { NavigationTab } from '../types/campus';
import { Campus360Logo } from './Campus360Logo';
import { BRAND } from '../constants/brand';

interface SidebarProps {
  activeTab: NavigationTab | string;
  onTabSelect: (tabName: NavigationTab) => void;
  unreadNoticesCount?: number;
}

interface NavItem {
  id: NavigationTab;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'Home', name: 'Dashboard', icon: Home },
  { id: 'Attendance', name: 'Attendance', icon: CheckSquare, badge: '82%' },
  { id: 'Timetable', name: 'Timetable', icon: Calendar },
  { id: 'Notices', name: 'Notices', icon: FileText, badge: 6, badgeColor: 'bg-[#2563EB]' },
  { id: 'Complaints', name: 'Complaints', icon: AlertCircle, badge: 1, badgeColor: 'bg-amber-500' },
  { id: 'Requests', name: 'Requests', icon: Sparkles },
  { id: 'Gate Pass', name: 'Gate Pass', icon: KeyRound },
  { id: 'Mess', name: 'Mess', icon: Utensils },
  { id: 'Fees & Dues', name: 'Fees & Dues', icon: CreditCard },
  { id: 'Notifications', name: 'Notifications', icon: Bell, badge: 3, badgeColor: 'bg-emerald-500' },
  { id: 'Profile', name: 'Profile', icon: User },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab = 'Home',
  onTabSelect,
  unreadNoticesCount = 6,
}) => {
  return (
    <aside
      className="hidden lg:flex w-[256px] shrink-0 bg-[#0F172A] text-slate-300 flex-col h-screen sticky top-0 z-30 border-r border-slate-800 select-none"
      aria-label="Apna Campus Main Navigation"
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800">
        <Campus360Logo
          variant="full"
          theme="dark"
          size="sm"
          showTagline={true}
        />
      </div>

      {/* Academic Term Indicator */}
      <div className="px-4 pt-3.5 pb-1">
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl px-3 py-2 flex items-center justify-between text-xs">
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              {BRAND.activeTerm}
            </div>
            <div className="text-slate-200 font-medium text-[11px] truncate">
              Spring / Autumn Cycle
            </div>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span>
            {BRAND.activeWeek}
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-1 custom-scrollbar">
        <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Campus Modules
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id || (activeTab === 'Home' && item.id === 'Home');
          const badgeValue = item.id === 'Notices' ? unreadNoticesCount : item.badge;

          return (
            <button
              key={item.id}
              onClick={() => onTabSelect(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative text-left ${
                isActive
                  ? 'bg-[#2563EB] text-white shadow-md shadow-[#2563EB]/25 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform duration-150 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200 group-hover:scale-105'
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </div>

              {badgeValue !== undefined && (
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-md tabular-nums ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.badgeColor
                      ? `${item.badgeColor} text-white`
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {badgeValue}
                </span>
              )}

              {isActive && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white/40 rounded-l"></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Connectivity Card */}
      <div className="p-3 border-t border-slate-800 bg-[#090F1D]">
        <div className="bg-slate-900 border border-slate-800/90 rounded-xl p-2.5 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-500/20"></div>
            <div>
              <p className="text-slate-200 font-semibold text-xs leading-none">All Systems Online</p>
              <p className="text-[10px] text-slate-400 mt-0.5">360° Realtime Sync</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </aside>
  );
};
