/**
 * Campus 360 - Production Application Entry & Role Routing
 * "One Campus. Everything Connected."
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileDrawer } from './components/MobileDrawer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DeviceSimulatorBar, PreviewMode } from './components/DeviceSimulatorBar';
import { Footer } from './components/Footer';

// Auth Components & Context
import { LoginPage } from './components/auth/LoginPage';
import { RoleTransitionScreen } from './components/auth/RoleTransitionScreen';
import { AccessDeniedView } from './components/auth/AccessDeniedView';
import { UserAccount, UserRole } from './types/auth';
import { AuthProvider, useAuth, getRoleDashboardPath, isPathAllowedForRole } from './context/AuthContext';

// Role Dashboards
import { FacultyDashboard } from './components/dashboards/FacultyDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { WardenDashboard } from './components/dashboards/WardenDashboard';
import { StaffDashboard } from './components/dashboards/StaffDashboard';

// Student Responsive Pages
import { DashboardView } from './components/pages/DashboardView';
import { NoticesResponsiveView } from './components/pages/NoticesResponsiveView';
import { ComplaintsView } from './components/pages/ComplaintsView';
import { RequestsView } from './components/pages/RequestsView';
import { GatePassView } from './components/pages/GatePassView';
import { TimetableResponsiveView } from './components/pages/TimetableResponsiveView';
import { AttendanceView } from './components/pages/AttendanceView';
import { ProfileView } from './components/pages/ProfileView';
import { MessView } from './components/pages/MessView';
import { FeesView } from './components/pages/FeesView';

import { NavigationTab } from './types/campus';
import { NoticeItem } from './types/notice';
import { CheckCircle2, ShieldCheck, LogOut, ArrowRight, RefreshCw } from 'lucide-react';
import { useCampusData } from './context/CampusDataContext';
import { OfflineBanner } from './components/OfflineBanner';
import { Campus360Logo } from './components/Campus360Logo';

function AppContent() {
  const { notices } = useCampusData();
  const unreadNoticesCount = notices.filter((n) => !n.isRead).length;

  const {
    currentUser,
    isAuthenticated,
    loading,
    currentPath,
    navigate,
    logout,
  } = useAuth();

  const [transitionUser, setTransitionUser] = useState<UserAccount | null>(null);

  // Student portal navigation tab
  const [activeNavTab, setActiveNavTab] = useState<NavigationTab>('Home');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewMode, setPreviewMode] = useState<PreviewMode>('fluid');
  const [selectedNoticeExternal, setSelectedNoticeExternal] = useState<NoticeItem | null>(null);

  // Floating toast notification system
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync activeNavTab with path for student
  useEffect(() => {
    if (currentUser?.role === 'Student') {
      if (currentPath.includes('/attendance')) setActiveNavTab('Attendance');
      else if (currentPath.includes('/complaints')) setActiveNavTab('Complaints');
      else if (currentPath.includes('/requests')) setActiveNavTab('Requests');
      else if (currentPath.includes('/gatepass')) setActiveNavTab('Gate Pass');
      else if (currentPath.includes('/timetable')) setActiveNavTab('Timetable');
      else if (currentPath.includes('/mess')) setActiveNavTab('Mess');
      else if (currentPath.includes('/fees')) setActiveNavTab('Fees & Dues');
      else if (currentPath.includes('/profile')) setActiveNavTab('Profile');
      else if (currentPath.includes('/notices')) setActiveNavTab('Notices');
      else if (currentPath.includes('/student')) setActiveNavTab('Home');
    }
  }, [currentPath, currentUser]);

  const handleLoginSuccess = (user: UserAccount) => {
    setTransitionUser(user);
  };

  const handleTransitionComplete = () => {
    if (transitionUser) {
      const targetDashboard = getRoleDashboardPath(transitionUser.role);
      navigate(targetDashboard);
      setTransitionUser(null);
      setActiveNavTab('Home');
      triggerToast(`Authenticated as ${transitionUser.role}: Welcome, ${transitionUser.name}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    triggerToast('Logged out of Apna Campus session.');
  };

  const handleNavigate = (tab: NavigationTab) => {
    setActiveNavTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Map tab to URL route
    if (currentUser?.role === 'Student') {
      switch (tab) {
        case 'Home':
          navigate('/student/dashboard');
          break;
        case 'Attendance':
          navigate('/student/attendance');
          break;
        case 'Complaints':
          navigate('/student/complaints');
          break;
        case 'Requests':
          navigate('/student/requests');
          break;
        case 'Gate Pass':
          navigate('/student/gatepass');
          break;
        case 'Timetable':
          navigate('/student/timetable');
          break;
        case 'Mess':
          navigate('/student/mess');
          break;
        case 'Fees & Dues':
          navigate('/student/fees');
          break;
        case 'Profile':
          navigate('/student/profile');
          break;
        case 'Notices':
        case 'Notifications':
          navigate('/student/notices');
          break;
      }
    }
  };

  const handleSelectNoticeFromAnywhere = (notice: NoticeItem) => {
    setSelectedNoticeExternal(notice);
    handleNavigate('Notices');
  };

  // Device simulator container width classes
  const getDeviceContainerClass = () => {
    switch (previewMode) {
      case 'desktop':
        return 'max-w-[1440px] mx-auto border-x border-slate-300 shadow-2xl my-3 rounded-2xl overflow-hidden';
      case 'tablet':
        return 'max-w-[768px] mx-auto border-x border-slate-300 shadow-2xl my-3 rounded-2xl overflow-hidden';
      case 'mobile':
        return 'max-w-[390px] mx-auto border border-slate-400 shadow-2xl my-3 rounded-3xl overflow-hidden ring-8 ring-slate-800/10';
      case 'fluid':
      default:
        return 'w-full';
    }
  };

  // 1. Loading State on Startup (Verifying session)
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-4 text-white font-sans">
        <Campus360Logo variant="full" theme="dark" size="lg" showTagline={false} />
        <div className="mt-8 flex items-center gap-3 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-300">
          <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
          <span>Restoring authenticated session...</span>
        </div>
      </div>
    );
  }

  // 2. Role Transition Animation Screen (1-2s after login)
  if (transitionUser) {
    return (
      <RoleTransitionScreen
        user={transitionUser}
        onComplete={handleTransitionComplete}
      />
    );
  }

  // 3. Unauthenticated State (Login Page)
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col font-sans">
        <DeviceSimulatorBar
          currentMode={previewMode}
          onModeChange={setPreviewMode}
          currentPath={currentPath}
          onNavigatePath={(path) => navigate(path)}
        />
        <div className={`flex-1 transition-all duration-300 ${getDeviceContainerClass()}`}>
          <LoginPage onSuccess={handleLoginSuccess} />
        </div>
      </div>
    );
  }

  // 4. Role-Based Access Control: Path Authorization Check
  const isAllowed = isPathAllowedForRole(currentPath, currentUser.role);

  // If authenticated user visits /login or /, redirect to their dashboard
  if (currentPath === '/login' || currentPath === '/') {
    navigate(getRoleDashboardPath(currentUser.role), { replace: true });
  }

  const isStudent = currentUser.role === 'Student';

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col font-sans text-[#0F172A] antialiased selection:bg-[#2563EB] selection:text-white">
      {/* 1. Device Simulator Toolbar & Interactive URL Address Bar */}
      <DeviceSimulatorBar
        currentMode={previewMode}
        onModeChange={setPreviewMode}
        currentPath={currentPath}
        onNavigatePath={(path) => navigate(path)}
      />

      {/* Simulator Device Frame or Fluid Container */}
      <div className={`flex-1 flex flex-row bg-[#F8FAFC] transition-all duration-300 ${getDeviceContainerClass()}`}>
        {/* 2. Desktop Left Sidebar (Only visible on Student layout on Desktop) */}
        {isStudent && isAllowed && (
          <Sidebar
            activeTab={activeNavTab}
            onTabSelect={handleNavigate}
            unreadNoticesCount={unreadNoticesCount}
          />
        )}

        {/* 3. Mobile Navigation Drawer for Student */}
        {isStudent && isAllowed && (
          <MobileDrawer
            isOpen={mobileDrawerOpen}
            onClose={() => setMobileDrawerOpen(false)}
            activeTab={activeNavTab}
            onTabSelect={handleNavigate}
          />
        )}

        {/* 4. Main Scrollable Content Canvas */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen relative overflow-y-auto">
          {/* Offline indicator banner */}
          <OfflineBanner />

          {/* Top Header */}
          <Header
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectNotice={handleSelectNoticeFromAnywhere}
            onNavigate={handleNavigate}
            unreadCount={unreadNoticesCount}
            onOpenMobileDrawer={() => setMobileDrawerOpen(true)}
            onOpenProfile={() => {
              if (isStudent) handleNavigate('Profile');
              else triggerToast(`Viewing ${currentUser.name} profile settings`);
            }}
            currentUser={currentUser}
            onLogout={handleLogout}
            placeholder={
              currentUser.role === 'Faculty'
                ? 'Search students, classes, submissions...'
                : currentUser.role === 'Admin'
                ? 'Search campus users, audit logs, reports...'
                : currentUser.role === 'Warden'
                ? 'Search hostel rooms, gate passes...'
                : currentUser.role === 'Staff'
                ? 'Search maintenance work orders...'
                : 'Search Apna Campus...'
            }
          />

          {/* RBAC Role Security Status Ribbon */}
          <div className="bg-[#0F172A] text-slate-300 px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="font-semibold text-white">Apna Campus RBAC:</span>
              <span className="text-blue-300 font-bold bg-[#2563EB]/25 px-2 py-0.5 rounded border border-[#2563EB]/40">
                {currentUser.role} Active
              </span>
              <span className="hidden md:inline text-slate-400">
                • {currentUser.name} ({currentUser.email}) • Route: <code className="font-mono text-blue-300">{currentPath}</code>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleLogout}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-in slide-in-from-bottom-5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Main Body View */}
          <main className={`flex-1 p-3.5 sm:p-6 lg:p-7 max-w-[1440px] w-full mx-auto ${isStudent ? 'pb-24 lg:pb-8' : 'pb-10'}`}>
            {/* ACCESS DENIED VIEW: Triggered if user role does not permit route */}
            {!isAllowed ? (
              <AccessDeniedView
                currentRole={currentUser.role}
                attemptedRoute={currentPath}
                onGoToMyDashboard={() => navigate(getRoleDashboardPath(currentUser.role))}
                onLogout={handleLogout}
              />
            ) : (
              <>
                {/* ROLE 1: FACULTY DASHBOARD */}
                {currentUser.role === 'Faculty' && (
                  <FacultyDashboard user={currentUser} onLogout={handleLogout} />
                )}

                {/* ROLE 2: ADMIN DASHBOARD */}
                {currentUser.role === 'Admin' && (
                  <AdminDashboard user={currentUser} onLogout={handleLogout} />
                )}

                {/* ROLE 3: WARDEN DASHBOARD */}
                {currentUser.role === 'Warden' && (
                  <WardenDashboard user={currentUser} onLogout={handleLogout} />
                )}

                {/* ROLE 4: STAFF DASHBOARD */}
                {currentUser.role === 'Staff' && (
                  <StaffDashboard user={currentUser} onLogout={handleLogout} />
                )}

                {/* ROLE 5: STUDENT DASHBOARD */}
                {currentUser.role === 'Student' && (
                  <>
                    {activeNavTab === 'Home' && (
                      <DashboardView
                        onNavigate={handleNavigate}
                        onSelectNotice={handleSelectNoticeFromAnywhere}
                      />
                    )}

                    {activeNavTab === 'Notices' && (
                      <NoticesResponsiveView
                        onTriggerToast={triggerToast}
                        selectedNoticeExternal={selectedNoticeExternal}
                        onClearSelectedNoticeExternal={() => setSelectedNoticeExternal(null)}
                      />
                    )}

                    {activeNavTab === 'Complaints' && <ComplaintsView />}

                    {activeNavTab === 'Requests' && <RequestsView />}

                    {activeNavTab === 'Gate Pass' && <GatePassView />}

                    {activeNavTab === 'Timetable' && <TimetableResponsiveView />}

                    {activeNavTab === 'Attendance' && <AttendanceView />}

                    {activeNavTab === 'Mess' && <MessView />}

                    {activeNavTab === 'Fees & Dues' && <FeesView />}

                    {activeNavTab === 'Profile' && <ProfileView onLogout={handleLogout} user={currentUser} />}

                    {activeNavTab === 'Notifications' && (
                      <NoticesResponsiveView
                        onTriggerToast={triggerToast}
                        selectedNoticeExternal={selectedNoticeExternal}
                        onClearSelectedNoticeExternal={() => setSelectedNoticeExternal(null)}
                      />
                    )}
                  </>
                )}
              </>
            )}

            {/* Footer */}
            <div className="mt-10">
              <Footer />
            </div>
          </main>
        </div>
      </div>

      {/* 5. Mobile Bottom Navigation Bar (Active for Student role) */}
      {isStudent && isAllowed && (
        <MobileBottomNav
          activeTab={activeNavTab}
          onTabSelect={handleNavigate}
          unreadNoticesCount={unreadNoticesCount}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
