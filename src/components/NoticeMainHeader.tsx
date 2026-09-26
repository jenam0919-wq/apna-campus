import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  CheckCheck,
  X,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { NoticePriority } from '../types/notice';

interface NoticeMainHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: 'newest' | 'priority' | 'action';
  onSortChange: (sort: 'newest' | 'priority' | 'action') => void;
  priorityFilter: NoticePriority | 'All';
  onPriorityFilterChange: (p: NoticePriority | 'All') => void;
  onMarkAllAsRead: () => void;
  unreadCount: number;
}

export const NoticeMainHeader: React.FC<NoticeMainHeaderProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  priorityFilter,
  onPriorityFilterChange,
  onMarkAllAsRead,
  unreadCount,
}) => {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  return (
    <div className="space-y-4">
      {/* Page Title & Mark All as Read */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Notices & Announcements
            </h1>
            {unreadCount > 0 && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1677FF] border border-blue-200">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1 font-normal">
            Stay updated with important campus information, circulars and administrative alerts.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onMarkAllAsRead}
            disabled={unreadCount === 0}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all shadow-xs active:scale-95 ${
              unreadCount > 0
                ? 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border-slate-200 cursor-pointer'
                : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-70'
            }`}
            title="Mark all notifications as read"
          >
            <CheckCheck className="w-4 h-4 text-emerald-600" />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      {/* Search, Filter & Sort Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by notice title, department, or keyword..."
            className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1677FF]/20 focus:border-[#1677FF] transition-all placeholder:text-slate-400 text-slate-800"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter and Sort Dropdowns */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          {/* Priority Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowFilterDropdown(!showFilterDropdown);
                setShowSortDropdown(false);
              }}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl border transition-all shadow-xs ${
                priorityFilter !== 'All'
                  ? 'bg-blue-50 text-[#1677FF] border-blue-200'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
              }`}
            >
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Priority: {priorityFilter}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-30 text-xs">
                {(['All', 'Emergency', 'Important', 'Urgent', 'Normal'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      onPriorityFilterChange(p);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                      priorityFilter === p
                        ? 'font-bold text-[#1677FF] bg-blue-50'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{p === 'All' ? 'All Priorities' : p}</span>
                    {priorityFilter === p && <span className="w-1.5 h-1.5 rounded-full bg-[#1677FF]"></span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSortDropdown(!showSortDropdown);
                setShowFilterDropdown(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-xs"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <span>
                Sort: {sortBy === 'newest' ? 'Newest' : sortBy === 'priority' ? 'Priority' : 'Action Required'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showSortDropdown && (
              <div className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-30 text-xs">
                {[
                  { id: 'newest', label: 'Newest First' },
                  { id: 'priority', label: 'Highest Priority' },
                  { id: 'action', label: 'Action Required First' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onSortChange(s.id as any);
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                      sortBy === s.id
                        ? 'font-bold text-[#1677FF] bg-blue-50'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{s.label}</span>
                    {sortBy === s.id && <span className="w-1.5 h-1.5 rounded-full bg-[#1677FF]"></span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
