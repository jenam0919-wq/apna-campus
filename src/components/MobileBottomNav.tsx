import React from 'react';
import { Home, BellRing, AlertTriangle, FileCheck2, User } from 'lucide-react';
import { NavigationTab } from '../types/campus';

interface MobileBottomNavProps {
  activeTab: NavigationTab;
  onTabSelect: (tab: NavigationTab) => void;
  unreadNoticesCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabSelect,
  unreadNoticesCount = 6,
}) => {
  const BOTTOM_ITEMS: { id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'Home', label: 'Home', icon: Home },
    { id: 'Notices', label: 'Notices', icon: BellRing, badge: unreadNoticesCount },
    { id: 'Complaints', label: 'Complaints', icon: AlertTriangle, badge: 1 },
    { id: 'Requests', label: 'Requests', icon: FileCheck2 },
    { id: 'Profile', label: 'Profile', icon: User },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1 shadow-lg"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {BOTTOM_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabSelect(item.id)}
              className={`flex flex-col items-center justify-center flex-1 min-w-[56px] min-h-[50px] py-1 px-1 rounded-xl transition-all relative ${
                isActive
                  ? 'text-[#2563EB]'
                  : 'text-[#64748B] hover:text-[#0F172A] active:scale-95'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#2563EB] text-white text-[9px] font-extrabold flex items-center justify-center ring-2 ring-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 tracking-tight ${
                  isActive ? 'font-bold' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#2563EB] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
