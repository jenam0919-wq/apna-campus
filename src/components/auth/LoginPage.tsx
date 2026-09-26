import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  CheckCircle2,
  AlertCircle,
  WifiOff,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Building,
  Users,
  Wrench,
  GraduationCap,
  ArrowRight,
  Info,
} from 'lucide-react';
import { UserAccount, UserRole } from '../../types/auth';
import { MOCK_USERS, DEMO_PRESETS } from '../../data/mockUsers';
import { Campus360Logo, Campus360Icon } from '../Campus360Logo';
import { BRAND } from '../../constants/brand';
import { CampusAPI, setAuthToken, setStoredUser } from '../../services/api';
import {
  firebaseSignIn,
  firebaseResetPassword,
  getFirestoreDocument,
  setFirestoreDocument
} from '../../services/firebase';

interface LoginPageProps {
  onSuccess: (user: UserAccount) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // States: idle, loading, success, empty, invalid, disabled, network_error
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'empty' | 'invalid' | 'disabled' | 'network_error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [adminContactModal, setAdminContactModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [resetMsg, setResetMsg] = useState('');

  const handleSignIn = async (emailInput?: string, passwordInput?: string) => {
    const rawEmail = (emailInput !== undefined ? emailInput : emailOrId).trim();
    const emailToVerify = rawEmail.toLowerCase();
    const passwordToVerify = passwordInput !== undefined ? passwordInput : password;

    // 1. Empty State
    if (!emailToVerify) {
      setStatus('empty');
      setErrorMessage('Please enter your institution ID or email.');
      return;
    }

    if (!passwordToVerify && emailInput === undefined) {
      setStatus('invalid');
      setErrorMessage('Please enter your account password.');
      return;
    }

    // 2. Loading State
    setStatus('loading');
    setErrorMessage('');

    // Special simulation for network error
    if (emailToVerify === 'network@error' || emailToVerify === 'error@campus360.edu') {
      setTimeout(() => {
        setStatus('network_error');
        setErrorMessage('Unable to connect. Please check your internet connection and try again.');
      }, 700);
      return;
    }

    // Try Firebase Authentication
    let authenticatedUser: UserAccount | null = null;
    let authError: string | null = null;

    try {
      const fbUser = await firebaseSignIn(emailToVerify, passwordToVerify);
      if (fbUser) {
        // Fetch user document from Firestore
        const firestoreProfile = await getFirestoreDocument<UserAccount>('users', emailToVerify);
        if (firestoreProfile) {
          authenticatedUser = firestoreProfile;
        } else {
          // Check local mock users or create user profile
          const mockMatch =
            MOCK_USERS[emailToVerify] ||
            Object.values(MOCK_USERS).find((u) => u.account.email.toLowerCase() === emailToVerify);
          authenticatedUser = mockMatch
            ? mockMatch.account
            : {
                id: fbUser.uid,
                name: fbUser.displayName || 'Campus 360 User',
                email: fbUser.email || emailToVerify,
                role: 'Student',
                status: 'active',
                title: 'Student',
                department: 'Computer Science & Engineering',
                avatarUrl: fbUser.photoURL || '/src/assets/images/manoj_student_1790405327601.jpg',
              };
          setFirestoreDocument('users', emailToVerify, authenticatedUser).catch(() => {});
        }
      }
    } catch (fbErr: any) {
      console.warn('[Firebase Auth] Notice:', fbErr?.code || fbErr?.message);
      if (fbErr?.code === 'auth/wrong-password' || fbErr?.code === 'auth/invalid-credential') {
        authError = 'Invalid email/ID or password. Please verify your credentials.';
      } else if (fbErr?.code === 'auth/user-disabled') {
        authError = 'Account temporarily suspended. Please contact your campus administrator.';
      }
    }

    // If Firebase Auth succeeded
    if (authenticatedUser) {
      if (authenticatedUser.status === 'disabled') {
        setStatus('disabled');
        setErrorMessage('Account temporarily suspended. Please contact your campus administrator.');
        return;
      }

      setStatus('success');
      setAuthToken(authenticatedUser.email);
      setStoredUser(authenticatedUser);
      CampusAPI.login(emailToVerify, passwordToVerify).catch(() => {});

      setTimeout(() => {
        onSuccess(authenticatedUser!);
      }, 400);
      return;
    }

    // Fallback: Check local preset/mock users & backend API
    const userRecord =
      MOCK_USERS[emailToVerify] ||
      Object.values(MOCK_USERS).find(
        (u) =>
          u.account.email.toLowerCase() === emailToVerify ||
          u.account.id.toLowerCase() === emailToVerify ||
          (u.account.details &&
            'rollNumber' in u.account.details &&
            (u.account.details as any).rollNumber?.toLowerCase() === emailToVerify)
      );

    if (!userRecord) {
      setStatus('invalid');
      setErrorMessage(authError || 'Invalid email/ID or password. Please verify your credentials.');
      return;
    }

    if (userRecord.account.status === 'disabled') {
      setStatus('disabled');
      setErrorMessage('Account temporarily suspended. Please contact your campus administrator.');
      return;
    }

    const validPasswords = [
      userRecord.passwordHash,
      'password123',
      'student123',
      'faculty123',
      'admin123',
      'warden123',
      'staff123',
    ];
    if (!validPasswords.includes(passwordToVerify)) {
      setStatus('invalid');
      setErrorMessage('Invalid email/ID or password. Please check your credentials.');
      return;
    }

    setStatus('success');
    setAuthToken(userRecord.account.email);
    setStoredUser(userRecord.account);
    CampusAPI.login(emailToVerify, passwordToVerify).catch(() => {});

    setTimeout(() => {
      onSuccess(userRecord.account);
    }, 400);
  };

  const handleDemoLogin = (email: string) => {
    let pwd = 'password123';
    if (email.includes('student')) pwd = 'student123';
    else if (email.includes('faculty')) pwd = 'faculty123';
    else if (email.includes('admin')) pwd = 'admin123';
    else if (email.includes('warden')) pwd = 'warden123';
    else if (email.includes('staff')) pwd = 'staff123';
    else if (email.includes('jena')) pwd = 'student123';

    setEmailOrId(email);
    setPassword(pwd);
    handleSignIn(email, pwd);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col justify-center items-center p-3.5 sm:p-6 lg:p-10 font-sans selection:bg-[#2563EB] selection:text-white relative overflow-hidden">
      {/* Background radial ambient lights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-sky-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container: 1240px max width for desktop 2-column, stacked single-column for mobile */}
      <div className="w-full max-w-[1240px] bg-white text-[#0F172A] rounded-3xl shadow-2xl overflow-hidden border border-[#E2E8F0] grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* LEFT COLUMN: Campus 360 Branding & Features */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white p-6 sm:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle ambient glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Logo */}
          <div className="relative z-10 space-y-6">
            <Campus360Logo
              variant="full"
              theme="dark"
              size="lg"
              showTagline={false}
            />

            {/* Tagline & Supporting Statement */}
            <div className="space-y-3 pt-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                One Campus. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">
                  Everything Connected.
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
                Access attendance, notices, hostel services, requests, complaints and campus operations from one platform.
              </p>
            </div>
          </div>

          {/* Middle: Connected Roles & Infrastructure */}
          <div className="relative z-10 my-6 p-4 bg-slate-900/80 border border-slate-700/60 rounded-2xl backdrop-blur-xs space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                360° Unified Role Access Control
              </span>
              <span className="text-[10px] text-blue-400 font-mono">Live Routing</span>
            </div>

            {/* 5 Connected Roles Grid */}
            <div className="grid grid-cols-5 gap-1.5 text-center">
              {[
                { name: 'Student', icon: Users, color: 'text-blue-400' },
                { name: 'Faculty', icon: GraduationCap, color: 'text-emerald-400' },
                { name: 'Admin', icon: ShieldCheck, color: 'text-purple-400' },
                { name: 'Warden', icon: Building, color: 'text-amber-400' },
                { name: 'Staff', icon: Wrench, color: 'text-cyan-400' },
              ].map((r, i) => (
                <div key={i} className="p-2 rounded-xl bg-slate-800/90 border border-slate-700/60 flex flex-col items-center gap-1">
                  <r.icon className={`w-3.5 h-3.5 ${r.color}`} />
                  <span className="text-[10px] font-bold text-slate-300 truncate w-full">{r.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Feature Highlights */}
          <div className="relative z-10 pt-2 border-t border-slate-800">
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Smart Attendance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Digital Certificates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Hostel & Gate Passes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Realtime Bulletins</span>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>AI-Assisted Maintenance Routing</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Login Card & Demo Presets */}
        <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-white">
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Welcome Back
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B]">
                Sign in to continue to Apna Campus
              </p>
            </div>

            {/* Firebase Live Status Pill */}
            <div className="flex items-center justify-between p-2.5 px-3 bg-gradient-to-r from-blue-50/90 to-sky-50/90 border border-blue-200/80 rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-slate-800">Firebase Live:</span>
                <span className="text-blue-700 font-mono text-[11px] font-bold">apna-campus-db438</span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-300/80">
                Firestore & Auth Active
              </span>
            </div>

            {/* Error & Warning Alert Banners */}
            {status === 'empty' && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="font-semibold">{errorMessage}</span>
              </div>
            )}

            {status === 'invalid' && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs space-y-1 animate-in fade-in">
                <div className="flex items-center gap-2 font-bold text-rose-900">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Invalid credentials</span>
                </div>
                <p className="text-[11px] text-rose-700 pl-6">
                  {errorMessage}
                </p>
              </div>
            )}

            {status === 'disabled' && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs space-y-1 animate-in fade-in">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Account temporarily suspended</span>
                </div>
                <p className="text-[11px] text-amber-700 pl-6">
                  Please contact the campus IT administrator or registrar.
                </p>
              </div>
            )}

            {status === 'network_error' && (
              <div className="p-3.5 bg-slate-100 border border-slate-300 text-slate-800 rounded-xl text-xs space-y-2 animate-in fade-in">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <WifiOff className="w-4 h-4 text-slate-600 shrink-0" />
                  <span>Unable to connect</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Please check your internet connection and try again.
                </p>
                <button
                  type="button"
                  onClick={() => handleSignIn()}
                  className="px-3 py-1.5 bg-[#2563EB] text-white font-bold rounded-lg text-xs flex items-center gap-1.5 hover:bg-blue-700 shadow-xs"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Retry</span>
                </button>
              </div>
            )}

            {status === 'success' && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2.5 font-semibold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Authenticated. Entering Apna Campus portal...</span>
              </div>
            )}

            {/* Login Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSignIn();
              }}
              className="space-y-4"
              noValidate
            >
              {/* Institution Email / ID */}
              <div className="space-y-1.5">
                <label
                  htmlFor="emailOrId"
                  className="block text-xs font-bold uppercase tracking-wider text-[#0F172A]"
                >
                  Institution ID / Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="emailOrId"
                    type="text"
                    value={emailOrId}
                    onChange={(e) => {
                      setEmailOrId(e.target.value);
                      if (status !== 'idle') setStatus('idle');
                    }}
                    placeholder="e.g. student@campus360.demo or roll number"
                    className="w-full min-h-[44px] pl-10 pr-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-bold uppercase tracking-wider text-[#0F172A]"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordModal(true)}
                    className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (status !== 'idle') setStatus('idle');
                    }}
                    placeholder="Enter your account password"
                    className="w-full min-h-[44px] pl-10 pr-11 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2563EB] border-slate-300 focus:ring-[#2563EB] cursor-pointer"
                  />
                  <span className="text-xs text-[#64748B] font-medium">Remember me</span>
                </label>

                <span className="text-[11px] text-[#94A3B8]">Campus SSO Protected</span>
              </div>

              {/* Primary Sign In Button (min 44px touch target) */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full min-h-[46px] px-4 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-blue-400 active:scale-[0.99] text-white text-sm font-bold rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {status === 'loading' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Institution Account Notice */}
              <p className="text-center text-xs text-[#64748B] pt-1">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAdminContactModal(true)}
                  className="font-bold text-[#2563EB] hover:underline cursor-pointer"
                >
                  Contact your college administrator
                </button>
              </p>
            </form>
          </div>

          {/* Section: 1-Click Demo Quick Presets */}
          <div className="mt-8 pt-5 border-t border-[#E2E8F0] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#2563EB]" />
                Demo 1-Click Role Login
              </span>
              <span className="text-[10px] text-[#94A3B8]">Quick Testing</span>
            </div>

            <p className="text-[11px] text-[#64748B]">
              Select any campus role to explore instant dashboard workflows:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5">
              {DEMO_PRESETS.map((demo) => (
                <button
                  key={demo.role}
                  type="button"
                  onClick={() => handleDemoLogin(demo.email)}
                  className="min-h-[44px] p-2 bg-[#F8FAFC] hover:bg-blue-50/80 hover:border-blue-300 border border-[#E2E8F0] rounded-xl text-left transition-all group flex flex-col justify-center cursor-pointer"
                >
                  <span className="text-xs font-bold text-[#0F172A] group-hover:text-[#2563EB]">
                    {demo.role}
                  </span>
                  <span className="text-[10px] text-[#64748B] truncate block">
                    {demo.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#94A3B8] pt-1">
              <span>Demo credentials: password123</span>
              <button
                type="button"
                onClick={() => {
                  setEmailOrId('disabled@campus360.edu');
                  setPassword('password123');
                  handleSignIn('disabled@campus360.edu', 'password123');
                }}
                className="hover:text-rose-600 underline cursor-pointer"
              >
                Test Suspended Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-[#0F172A] shadow-2xl space-y-4 border border-[#E2E8F0]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Firebase Password Reset</h3>
                <p className="text-xs text-[#64748B]">Project: apna-campus-db438</p>
              </div>
            </div>

            <p className="text-xs text-[#64748B] leading-relaxed">
              Enter your registered institution email to receive a secure password recovery link directly via Firebase Authentication.
            </p>

            <div className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email (e.g. jena06459@gmail.com)"
                value={resetEmail || emailOrId}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {resetStatus === 'sent' && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Password reset email dispatched via Firebase Auth! Check your inbox.</span>
                </div>
              )}
              {resetStatus === 'error' && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{resetMsg || 'Unable to send reset email. Verify the address.'}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setForgotPasswordModal(false);
                  setResetStatus('idle');
                }}
                className="min-h-[40px] px-3.5 py-2 text-slate-600 hover:bg-slate-100 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={resetStatus === 'sending'}
                onClick={async () => {
                  const target = (resetEmail || emailOrId).trim();
                  if (!target) return;
                  setResetStatus('sending');
                  try {
                    await firebaseResetPassword(target);
                    setResetStatus('sent');
                  } catch (err: any) {
                    setResetStatus('error');
                    setResetMsg(err.message || 'Unable to send reset email.');
                  }
                }}
                className="min-h-[40px] px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-xl cursor-pointer disabled:opacity-50"
              >
                {resetStatus === 'sending' ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Contact Modal */}
      {adminContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-[#0F172A] shadow-2xl space-y-4 border border-[#E2E8F0]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                <Campus360Icon size={24} theme="colored" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Apna Campus Account Issuance</h3>
                <p className="text-xs text-[#64748B]">Registrar & IT Admissions Office</p>
              </div>
            </div>

            <p className="text-xs text-[#64748B] leading-relaxed">
              Apna Campus student and faculty accounts are provisioned centrally upon institutional enrollment. If you need your login credentials reissued:
            </p>

            <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs space-y-1">
              <p className="font-semibold text-[#0F172A]">Central Registrar Desk:</p>
              <p className="text-[#64748B]">• Email: registrar@apnacampus.edu</p>
              <p className="text-[#64748B]">• Phone: +91 (800) 360-CAMPUS</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setAdminContactModal(false)}
                className="min-h-[44px] px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
