import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Shield,
  Bell,
  Globe,
  LogOut,
  Edit2,
  Edit3,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  X,
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
} from 'lucide-react';
import { STUDENT_PROFILE } from '../../data/mockCampusData';
import { UserAccount } from '../../types/auth';
import { CampusAPI, setStoredUser, getStoredUser } from '../../services/api';

interface ProfileViewProps {
  onLogout?: () => void;
  user?: UserAccount;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onLogout, user }) => {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(true);
  const [language, setLanguage] = useState('English');

  // Contact details editing state
  const [showEditContactModal, setShowEditContactModal] = useState(false);
  const [phoneState, setPhoneState] = useState(user?.phone || STUDENT_PROFILE.phone);
  const [emergencyState, setEmergencyState] = useState(STUDENT_PROFILE.emergencyContact);
  const [bloodGroupState, setBloodGroupState] = useState(STUDENT_PROFILE.bloodGroup);
  const [personalEmailState, setPersonalEmailState] = useState(
    user?.email?.includes('gmail') ? user.email : 'jena06459@gmail.com'
  );
  const [contactSuccessMessage, setContactSuccessMessage] = useState<string | null>(null);

  // Password Change Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  // Logout confirm modal
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const displayName = user?.name || STUDENT_PROFILE.name;
  const displayEmail = user?.email || STUDENT_PROFILE.email;
  const displayRoll = user?.details?.rollNumber || STUDENT_PROFILE.rollNumber;
  const displayHostel = user?.details?.hostelAssigned || STUDENT_PROFILE.hostel;
  const displayDegree = STUDENT_PROFILE.degree;

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const updated: UserAccount = {
        ...user,
        phone: phoneState,
      };
      setStoredUser(updated);
    }
    setContactSuccessMessage('Personal contact information updated successfully.');
    setShowEditContactModal(false);
    setTimeout(() => setContactSuccessMessage(null), 3500);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!newPassword || newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match. Please re-enter.');
      return;
    }

    setChangingPassword(true);
    const res = await CampusAPI.changePassword(oldPassword, newPassword);
    setChangingPassword(false);

    if (res.error) {
      setPasswordError(res.error);
    } else {
      setPasswordSuccess('Password successfully updated! Your account security is updated.');
      setTimeout(() => {
        setShowPasswordModal(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordSuccess(null);
      }, 2000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-5xl">
      {/* Header Profile Photo & Title Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
          <div className="relative shrink-0">
            <img
              src={user?.avatarUrl || STUDENT_PROFILE.avatarUrl}
              alt={displayName}
              referrerPolicy="no-referrer"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-blue-50 border-2 border-[#2563EB]"
            />
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-white" />
          </div>

          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {displayName}
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-[#2563EB]">
                  {displayDegree} • {STUDENT_PROFILE.year}
                </p>
              </div>

              <span className="inline-block self-center sm:self-start text-xs font-mono font-bold bg-blue-50 text-[#2563EB] border border-blue-200 px-3 py-1 rounded-xl">
                Roll No: {displayRoll}
              </span>
            </div>

            <p className="text-xs text-slate-500 pt-1">
              Active Student Account • Enrolled Autumn 2024 • Academic Status: Regular • Apna Campus RBAC Verified
            </p>
          </div>
        </div>
      </div>

      {/* Notification banner when contact updated */}
      {contactSuccessMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{contactSuccessMessage}</span>
        </div>
      )}

      {/* Two Column Layout on Desktop, Vertical Stack on Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#2563EB]" />
              <h3 className="text-sm font-bold text-slate-900">Personal Information</h3>
            </div>
            <button
              onClick={() => setShowEditContactModal(true)}
              className="text-xs text-[#2563EB] hover:text-blue-700 font-bold flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
              <span className="text-slate-500 font-medium">Official Email</span>
              <span className="font-bold text-slate-800">{displayEmail}</span>
            </div>

            <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
              <span className="text-slate-500 font-medium">Personal Email</span>
              <span className="font-bold text-slate-800">{personalEmailState}</span>
            </div>

            <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
              <span className="text-slate-500 font-medium">Registered Mobile</span>
              <span className="font-bold text-slate-800">{phoneState}</span>
            </div>

            <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
              <span className="text-slate-500 font-medium">Blood Group</span>
              <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                {bloodGroupState}
              </span>
            </div>

            <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
              <span className="text-slate-500 font-medium">Emergency Contact</span>
              <span className="font-bold text-slate-800">{emergencyState}</span>
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3.5">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
            <GraduationCap className="w-4 h-4 text-[#2563EB]" />
            <h3 className="text-sm font-bold text-slate-900">Academic Information</h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
              <span className="text-slate-500 font-medium">Current Semester</span>
              <span className="font-bold text-slate-800">{STUDENT_PROFILE.semester}</span>
            </div>

            <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
              <span className="text-slate-500 font-medium">Class Section</span>
              <span className="font-bold text-slate-800">{STUDENT_PROFILE.section}</span>
            </div>

            <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
              <span className="text-slate-500 font-medium">Hostel Residence</span>
              <span className="font-bold text-slate-800">{displayHostel}</span>
            </div>

            <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
              <span className="text-slate-500 font-medium">Hostel Room</span>
              <span className="font-bold text-slate-800">{STUDENT_PROFILE.room}</span>
            </div>
          </div>
        </div>

        {/* Account & App Settings */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3.5 md:col-span-2">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
            <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
            <h3 className="text-sm font-bold text-slate-900">Account Security & Notifications</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-600 font-medium flex items-center gap-2">
                <Bell className="w-4 h-4 text-slate-400" />
                Email Alerts & Academic Circulars
              </span>
              <button
                type="button"
                onClick={() => setEmailNotifs(!emailNotifs)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  emailNotifs ? 'bg-[#2563EB]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    emailNotifs ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-600 font-medium flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-slate-400" />
                Account Security Password
              </span>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#2563EB] border border-blue-200 font-bold rounded-lg transition-colors"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Action Bar */}
      <div className="pt-2">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full min-h-[48px] bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-colors active:scale-98"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout from Apna Campus Session</span>
        </button>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#2563EB]" />
                <h3 className="font-bold text-base text-slate-900">Change Account Password</h3>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-4 text-xs">
              {passwordError && (
                <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Password</label>
                <input
                  type={showPasswordFields ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Password (min 6 chars)</label>
                <input
                  type={showPasswordFields ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new strong password"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Confirm New Password</label>
                <input
                  type={showPasswordFields ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setShowPasswordFields(!showPasswordFields)}
                  className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
                >
                  {showPasswordFields ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPasswordFields ? 'Hide Passwords' : 'Show Passwords'}</span>
                </button>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="flex-1 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                >
                  {changingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Contact Details Modal */}
      {showEditContactModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#2563EB]" />
                <h3 className="font-bold text-base text-slate-900">Edit Personal Information</h3>
              </div>
              <button
                onClick={() => setShowEditContactModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student Name</label>
                <input
                  type="text"
                  disabled
                  value={displayName}
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-semibold cursor-not-allowed"
                />
                <p className="text-[10px] text-slate-400 mt-1">Official name changes require registrar approval.</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Personal / Recovery Email</label>
                <input
                  type="email"
                  value={personalEmailState}
                  onChange={(e) => setPersonalEmailState(e.target.value)}
                  placeholder="e.g. jena06459@gmail.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Registered Mobile Number</label>
                <input
                  type="tel"
                  value={phoneState}
                  onChange={(e) => setPhoneState(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
                <select
                  value={bloodGroupState}
                  onChange={(e) => setBloodGroupState(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                >
                  <option value="A+ Positive">A+ Positive</option>
                  <option value="A- Negative">A- Negative</option>
                  <option value="B+ Positive">B+ Positive</option>
                  <option value="B- Negative">B- Negative</option>
                  <option value="O+ Positive">O+ Positive</option>
                  <option value="O- Negative">O- Negative</option>
                  <option value="AB+ Positive">AB+ Positive</option>
                  <option value="AB- Negative">AB- Negative</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Emergency Contact (Parent / Guardian)</label>
                <input
                  type="text"
                  value={emergencyState}
                  onChange={(e) => setEmergencyState(e.target.value)}
                  placeholder="+91 98765 11223 (Father)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditContactModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Details</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
              <LogOut className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Logout of Apna Campus?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to exit your active student session?
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  if (onLogout) onLogout();
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl"
              >
                Confirm Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
