import React from 'react';
import {
  Layers,
  GraduationCap,
  FileCheck2,
  Building,
  CalendarDays,
  CreditCard,
  AlertTriangle,
  MailCheck,
} from 'lucide-react';
import { NoticeCategory } from '../types/notice';

interface NoticeCategoryTabsProps {
  activeCategory: NoticeCategory;
  onSelectCategory: (category: NoticeCategory) => void;
  showUnreadOnly: boolean;
  onToggleUnreadOnly: () => void;
  unreadCount: number;
  categoryCounts: Record<string, number>;
}

export const NoticeCategoryTabs: React.FC<NoticeCategoryTabsProps> = ({
  activeCategory,
  onSelectCategory,
  showUnreadOnly,
  onToggleUnreadOnly,
  unreadCount,
  categoryCounts,
}) => {
  const CATEGORIES: { id: NoticeCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'All', label: 'All', icon: Layers },
    { id: 'Academic', label: 'Academic', icon: GraduationCap },
    { id: 'Examination', label: 'Examination', icon: FileCheck2 },
    { id: 'Hostel', label: 'Hostel', icon: Building },
    { id: 'Events', label: 'Events', icon: CalendarDays },
    { id: 'Fees', label: 'Fees', icon: CreditCard },
    { id: 'Emergency', label: 'Emergency', icon: AlertTriangle },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = !showUnreadOnly && activeCategory === cat.id;
          const count = categoryCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => {
                if (showUnreadOnly) onToggleUnreadOnly();
                onSelectCategory(cat.id);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{cat.label}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md tabular-nums font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Unread Filter Toggle Button */}
      <div className="shrink-0">
        <button
          onClick={onToggleUnreadOnly}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all duration-150 shadow-xs ${
            showUnreadOnly
              ? 'bg-[#1677FF] text-white border-[#1677FF] shadow-md shadow-blue-500/20'
              : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border-slate-200'
          }`}
        >
          <MailCheck className={`w-3.5 h-3.5 ${showUnreadOnly ? 'text-white' : 'text-[#1677FF]'}`} />
          <span>Unread Notices</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold tabular-nums ${
              showUnreadOnly ? 'bg-white/25 text-white' : 'bg-blue-50 text-[#1677FF] border border-blue-200'
            }`}
          >
            {unreadCount}
          </span>
        </button>
      </div>
    </div>
  );
};
