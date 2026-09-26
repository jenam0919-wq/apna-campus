import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Globe,
  ChevronDown,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  Settings,
  ShieldCheck,
  User,
  X,
  Menu,
  FileBadge,
  KeyRound,
  Utensils,
  Clock,
  ArrowRight,
  Check,
  ScanLine,
} from 'lucide-react';
import { Campus360Logo } from './Campus360Logo';
import { GatePassVerificationModal } from './modals/GatePassVerificationModal';
import { STUDENT_PROFILE } from '../data/mockCampusData';
import { UserAccount } from '../types/auth';
import { useCampusData } from '../context/CampusDataContext';
import { NavigationTab } from '../types/campus';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectNotice?: (notice: any) => void;
  onNavigate?: (tab: NavigationTab) => void;
  unreadCount?: number;
  placeholder?: string;
  onOpenMobileDrawer?: () => void;
  onOpenProfile?: () => void;
  currentUser?: UserAccount | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onSelectNotice,
  onNavigate,
  unreadCount = 0,
  placeholder = 'Search Apna Campus...',
  onOpenMobileDrawer,
  onOpenProfile,
  currentUser,
  onLogout,
}) => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    complaints,
    certificateRequests,
    gatePasses,
    notices,
    attendanceRecords,
  } = useCampusData();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState<'All' | 'complaint' | 'gate_pass' | 'certificate' | 'notice' | 'attendance'>('All');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showGateScanner, setShowGateScanner] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (notificationFilter === 'All') return true;
    return n.type === notificationFilter;
  });

  // Global Search computations
  const q = searchQuery.trim().toLowerCase();
  const searchMatches = {
    students: [
      { name: 'Manoj Kumar Jena', roll: '2024CS1042', branch: 'B.Tech CSE Year 3' },
      { name: 'Aarav Mehta', roll: '2024CS1040', branch: 'B.Tech CSE Year 2' },
      { name: 'Aditi Deshmukh', roll: '2024CS1041', branch: 'B.Tech CSE Year 2' },
      { name: 'Sneha Kulkarni', roll: '2024CS1044', branch: 'B.Tech ECE Year 2' },
    ].filter(
      (s) => q && (s.name.toLowerCase().includes(q) || s.roll.toLowerCase().includes(q) || s.branch.toLowerCase().includes(q))
    ),
    notices: notices.filter(
      (n) => q && (n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q) || n.category.toLowerCase().includes(q))
    ),
    complaints: complaints.filter(
      (c) => q && (c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.hostel.toLowerCase().includes(q))
    ),
    requests: certificateRequests.filter(
      (r) => q && (r.id.toLowerCase().includes(q) || r.type.toLowerCase().includes(q) || r.studentName.toLowerCase().includes(q))
    ),
    gatePasses: gatePasses.filter(
      (g) => q && (g.id.toLowerCase().includes(q) || g.destination.toLowerCase().includes(q) || g.studentName.toLowerCase().includes(q))
    ),
    timetable: [
      { code: 'CS201', name: 'Data Structures & Algorithms', room: 'Hall 204' },
      { code: 'CS203P', name: 'Operating Systems Laboratory', room: 'Computing Lab 2' },
      { code: 'MA201', name: 'Discrete Mathematics', room: 'Room 101' },
    ].filter(
      (t) => q && (t.code.toLowerCase().includes(q) || t.name.toLowerCase().includes(q) || t.room.toLowerCase().includes(q))
    ),
  };

  const totalResultsCount =
    searchMatches.students.length +
    searchMatches.notices.length +
    searchMatches.complaints.length +
    searchMatches.requests.length +
    searchMatches.gatePasses.length +
    searchMatches.timetable.length;

  const handleSelectSearchResult = (type: string, item: any) => {
    setShowSearchDropdown(false);
    onSearchChange('');

    if (type === 'complaints' && onNavigate) {
      onNavigate('Complaints');
    } else if (type === 'requests' && onNavigate) {
      onNavigate('Requests');
    } else if (type === 'gatePasses' && onNavigate) {
      onNavigate('Gate Pass');
    } else if (type === 'notices') {
      if (onSelectNotice) onSelectNotice(item);
      else if (onNavigate) onNavigate('Notices');
    } else if (type === 'timetable' && onNavigate) {
      onNavigate('Timetable');
    } else if (type === 'students' && onNavigate) {
      onNavigate('Attendance');
    }
  };

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
      {/* Mobile: Hamburger Button & Campus 360 Logo */}
      <div className="flex items-center gap-2.5 lg:hidden">
        <button
          onClick={onOpenMobileDrawer}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors active:scale-95"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Campus360Logo variant="horizontal" theme="colored" size="xs" />
      </div>

      {/* Desktop: Search Bar with Global Real-Time Results Dropdown */}
      <div className="hidden lg:flex flex-1 max-w-md relative" ref={searchRef}>
        <div className="relative flex items-center w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            placeholder={placeholder}
            className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-[#1677FF] focus:ring-3 focus:ring-[#1677FF]/10 transition-all font-medium min-h-[44px]"
          />
          {searchQuery && (
            <button
              onClick={() => {
                onSearchChange('');
                setShowSearchDropdown(false);
              }}
              className="absolute right-3 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Global Search Results Dropdown */}
        {showSearchDropdown && searchQuery.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-[420px] overflow-y-auto z-50 p-3 text-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-slate-500 font-semibold">
              <span>Search results for "{searchQuery}"</span>
              <span className="text-[11px]">{totalResultsCount} items</span>
            </div>

            {totalResultsCount === 0 ? (
              <div className="py-6 text-center text-slate-400">
                No matching records found across campus modules.
              </div>
            ) : (
              <div className="space-y-3">
                {/* Students */}
                {searchMatches.students.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Students ({searchMatches.students.length})
                    </span>
                    {searchMatches.students.map((st) => (
                      <div
                        key={st.roll}
                        onClick={() => handleSelectSearchResult('students', st)}
                        className="p-2 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <span className="font-bold text-slate-800">{st.name}</span>
                          <span className="text-slate-400 text-[11px] ml-2">({st.roll})</span>
                          <div className="text-slate-500 text-[11px]">{st.branch}</div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Complaints */}
                {searchMatches.complaints.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Complaints ({searchMatches.complaints.length})
                    </span>
                    {searchMatches.complaints.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => handleSelectSearchResult('complaints', c)}
                        className="p-2 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-[#1677FF]">{c.id}</span>
                            <span className="font-bold text-slate-800 truncate max-w-[200px]">{c.title}</span>
                          </div>
                          <div className="text-slate-400 text-[11px]">{c.hostel} • Status: {c.status}</div>
                        </div>
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                          {c.category}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Notices */}
                {searchMatches.notices.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Notices & Bulletins ({searchMatches.notices.length})
                    </span>
                    {searchMatches.notices.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleSelectSearchResult('notices', n)}
                        className="p-2 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <span className="font-bold text-slate-800 block truncate max-w-[240px]">{n.title}</span>
                          <span className="text-slate-400 text-[11px]">{n.category} • {n.publishDate}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Gate Passes */}
                {searchMatches.gatePasses.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Gate Passes ({searchMatches.gatePasses.length})
                    </span>
                    {searchMatches.gatePasses.map((gp) => (
                      <div
                        key={gp.id}
                        onClick={() => handleSelectSearchResult('gatePasses', gp)}
                        className="p-2 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <span className="font-mono font-bold text-amber-700">{gp.id}</span>
                          <span className="text-slate-700 font-semibold ml-2">{gp.destination}</span>
                          <div className="text-slate-400 text-[11px]">Return: {gp.expectedReturnTime}</div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {gp.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Timetable */}
                {searchMatches.timetable.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Timetable Lectures ({searchMatches.timetable.length})
                    </span>
                    {searchMatches.timetable.map((t) => (
                      <div
                        key={t.code}
                        onClick={() => handleSelectSearchResult('timetable', t)}
                        className="p-2 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <span className="font-bold text-slate-800">{t.code} - {t.name}</span>
                          <div className="text-slate-400 text-[11px]">{t.room}</div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Mobile Search Toggle Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors active:scale-95"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Main Gate Security & Live Camera Scanner */}
        <button
          onClick={() => setShowGateScanner(true)}
          className="relative w-10 h-10 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors active:scale-95 group"
          title="Open Main Gate Camera Scanner & SMS Station"
          aria-label="Gate Scanner"
        >
          <ScanLine className="w-5 h-5 group-hover:scale-110 transition-transform text-slate-600 group-hover:text-blue-600" />
          <span className="sr-only">Main Gate Scanner</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-10 h-10 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors active:scale-95"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-2 right-2 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-3xl shadow-2xl z-40 overflow-hidden text-xs">
              <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
                  <span className="text-slate-400 text-[11px]">{unreadNotificationsCount} unread alerts</span>
                </div>
                {unreadNotificationsCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] font-bold text-[#1677FF] hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification Filters */}
              <div className="flex items-center gap-1 p-2 bg-slate-100/60 border-b border-slate-100 overflow-x-auto">
                {(['All', 'complaint', 'gate_pass', 'certificate', 'notice'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNotificationFilter(cat as any)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap capitalize transition-colors ${
                      notificationFilter === cat ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:bg-white/50'
                    }`}
                  >
                    {cat.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {/* Notification List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No notifications in this category.
                  </div>
                ) : (
                  filteredNotifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                        !n.read ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900">{n.title}</span>
                            {!n.read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                            )}
                          </div>
                          <p className="text-slate-600 mt-0.5">{n.message}</p>
                          <span className="text-slate-400 text-[10px] mt-1 block">{n.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown & Role Badge */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              if (window.innerWidth < 640 && onOpenProfile) {
                onOpenProfile();
              } else {
                setShowProfileMenu(!showProfileMenu);
              }
            }}
            className="flex items-center gap-2.5 p-1 min-h-[44px] rounded-xl hover:bg-slate-100/80 transition-colors group text-left"
            aria-label="User Profile"
          >
            <div className="relative">
              <img
                src={currentUser?.avatarUrl || STUDENT_PROFILE.avatarUrl}
                alt={currentUser?.name || STUDENT_PROFILE.name}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-white shadow-xs border border-slate-200"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"></span>
            </div>

            <div className="hidden xl:block leading-tight pr-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 tracking-tight group-hover:text-[#1677FF] transition-colors">
                  {currentUser?.name || STUDENT_PROFILE.name}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-[#1677FF] border border-blue-200">
                  {currentUser?.role || 'Student'}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-normal truncate max-w-[150px]">
                {currentUser?.title || `${STUDENT_PROFILE.year} • ${STUDENT_PROFILE.section}`}
              </div>
            </div>

            <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 p-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl mb-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900 text-sm">{currentUser?.name || STUDENT_PROFILE.name}</div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-[#1677FF]">
                    {currentUser?.role || 'Student'}
                  </span>
                </div>
                <div className="text-slate-500 text-xs mt-0.5">
                  {currentUser?.email || 'student@campus360.demo'}
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Department</span>
                  <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 truncate max-w-[150px]">
                    {currentUser?.department || 'Computer Science'}
                  </span>
                </div>
              </div>

              {onLogout && (
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2.5 p-2.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-bold text-xs"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Log Out (End Session)</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Gate Biometric & Camera Scanner Modal */}
      <GatePassVerificationModal
        isOpen={showGateScanner}
        onClose={() => setShowGateScanner(false)}
      />
    </header>
  );
};
