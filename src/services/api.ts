/**
 * Campus 360 - Frontend API Client
 * Seamlessly interfaces with Express backend with offline fallback for patchy hostel networks.
 */

import { UserAccount, UserRole } from '../types/auth';
import {
  Complaint,
  CertificateRequest,
  GatePass,
  CampusNotice,
  CampusNotification,
  AttendanceRecord,
  MessFeedback,
  FeeDetails,
  AuditLogEntry,
} from '../types/store';

const API_BASE = '/api';

// Retrieve stored token if available (checks localStorage and sessionStorage)
export function getAuthToken(): string | null {
  try {
    return localStorage.getItem('campus360_auth_token') || sessionStorage.getItem('campus360_auth_token');
  } catch {
    return null;
  }
}

export function setAuthToken(token: string | null, rememberMe = true) {
  try {
    if (token) {
      if (rememberMe) {
        localStorage.setItem('campus360_auth_token', token);
        sessionStorage.removeItem('campus360_auth_token');
      } else {
        sessionStorage.setItem('campus360_auth_token', token);
        localStorage.removeItem('campus360_auth_token');
      }
    } else {
      localStorage.removeItem('campus360_auth_token');
      sessionStorage.removeItem('campus360_auth_token');
    }
  } catch {
    // Graceful fallback for restricted storage
  }
}

export function getStoredUser(): UserAccount | null {
  try {
    const raw = localStorage.getItem('campus360_auth_user') || sessionStorage.getItem('campus360_auth_user');
    if (!raw) return null;
    const user: UserAccount = JSON.parse(raw);
    if (user && user.id === 'usr-student-01') {
      user.name = 'Manoj Kumar Jena';
      if (!user.avatarUrl || user.avatarUrl.includes('unsplash') || user.avatarUrl.includes('avatar_rahul')) {
        user.avatarUrl = '/src/assets/images/manoj_student_1790405327601.jpg';
      }
    }
    return user;
  } catch {
    return null;
  }
}

export function setStoredUser(user: UserAccount | null, rememberMe = true) {
  try {
    if (user) {
      if (rememberMe) {
        localStorage.setItem('campus360_auth_user', JSON.stringify(user));
        sessionStorage.removeItem('campus360_auth_user');
      } else {
        sessionStorage.setItem('campus360_auth_user', JSON.stringify(user));
        localStorage.removeItem('campus360_auth_user');
      }
    } else {
      localStorage.removeItem('campus360_auth_user');
      sessionStorage.removeItem('campus360_auth_user');
    }
  } catch {
    // Storage fallback
  }
}

export function clearAuthSession() {
  try {
    localStorage.removeItem('campus360_auth_token');
    localStorage.removeItem('campus360_auth_user');
    sessionStorage.removeItem('campus360_auth_token');
    sessionStorage.removeItem('campus360_auth_user');
  } catch {
    // Storage fallback
  }
}

// Universal fetch wrapper with timeout and auth headers
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string; status: number }> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout for patchy networks

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (!res.ok) {
        return { error: data.error || `HTTP error ${res.status}`, status: res.status };
      }
      return { data, status: res.status };
    }

    if (!res.ok) {
      return { error: `Server error ${res.status}`, status: res.status };
    }

    return { status: res.status } as any;
  } catch (err: any) {
    // Offline or connection timeout
    return {
      error: err.name === 'AbortError' ? 'Connection timed out. Check network.' : 'Network connection failure',
      status: 0,
    };
  }
}

export const CampusAPI = {
  // Production Auth Endpoints
  async login(emailOrId: string, password: string, rememberMe = true) {
    return apiFetch<{ token: string; user: UserAccount; expiresIn: number }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ emailOrId, password, rememberMe }),
    });
  },

  async me() {
    return apiFetch<{ user: UserAccount }>('/auth/me');
  },

  async logout() {
    return apiFetch<{ success: boolean; message: string }>('/auth/logout', { method: 'POST' });
  },

  async forgotPassword(emailOrId: string) {
    return apiFetch<{ success: boolean; message: string; demoCode?: string; resetToken?: string; email?: string }>(
      '/auth/forgot-password',
      {
        method: 'POST',
        body: JSON.stringify({ emailOrId }),
      }
    );
  },

  async resetPassword(payload: { emailOrId: string; resetCode: string; newPassword: string }) {
    return apiFetch<{ success: boolean; message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async changePassword(oldPassword: string, newPassword: string) {
    return apiFetch<{ success: boolean; message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ oldPassword, newPassword }),
    });
  },

  // Users Management (Admin)
  async getUsers() {
    return apiFetch<{ users: UserAccount[] }>('/users');
  },

  async toggleUserStatus(userId: string, status: 'active' | 'disabled') {
    return apiFetch<{ success: boolean; user: UserAccount }>(`/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Complaints
  async getComplaints() {
    return apiFetch<{ complaints: Complaint[] }>('/complaints');
  },

  async createComplaint(payload: any) {
    return apiFetch<{ complaint: Complaint }>('/complaints', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateComplaintStatus(id: string, status: Complaint['status'], notes?: string, photo?: string) {
    return apiFetch<{ complaint: Complaint }>(`/complaints/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes, photo }),
    });
  },

  async confirmComplaintResolution(id: string, rating: number, feedback?: string) {
    return apiFetch<{ complaint: Complaint }>(`/complaints/${id}/confirm`, {
      method: 'POST',
      body: JSON.stringify({ rating, feedback }),
    });
  },

  async reassignComplaint(id: string, staffName: string, priority: 'High' | 'Medium' | 'Low') {
    return apiFetch<{ complaint: Complaint }>(`/complaints/${id}/reassign`, {
      method: 'POST',
      body: JSON.stringify({ staffName, priority }),
    });
  },

  // Certificate Requests
  async getRequests() {
    return apiFetch<{ requests: CertificateRequest[] }>('/requests');
  },

  async createRequest(payload: any) {
    return apiFetch<{ request: CertificateRequest }>('/requests', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async reviewRequest(id: string, status: 'Approved' | 'Rejected', reason?: string) {
    return apiFetch<{ request: CertificateRequest }>(`/requests/${id}/review`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason }),
    });
  },

  // Gate Passes
  async getGatePasses() {
    return apiFetch<{ gatePasses: GatePass[] }>('/gatepasses');
  },

  async applyGatePass(payload: any) {
    return apiFetch<{ gatePass: GatePass }>('/gatepasses', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async reviewGatePass(id: string, status: 'Approved' | 'Rejected', reason?: string) {
    return apiFetch<{ gatePass: GatePass }>(`/gatepasses/${id}/review`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason }),
    });
  },

  async verifyGatePassCode(query: string) {
    return apiFetch<{ valid: boolean; pass?: GatePass; message: string }>('/gatepasses/verify', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  },

  // Notices
  async getNotices() {
    return apiFetch<{ notices: CampusNotice[] }>('/notices');
  },

  async createNotice(payload: any) {
    return apiFetch<{ notice: CampusNotice }>('/notices', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async markNoticeRead(id: string) {
    return apiFetch<{ success: boolean }>(`/notices/${id}/read`, {
      method: 'PATCH',
    });
  },

  // Attendance
  async getAttendance() {
    return apiFetch<{ attendance: AttendanceRecord[] }>('/attendance');
  },

  async markAttendance(courseCode: string, studentRoll: string, isPresent: boolean) {
    return apiFetch<{ success: boolean }>('/attendance/mark', {
      method: 'POST',
      body: JSON.stringify({ courseCode, studentRoll, isPresent }),
    });
  },

  // Mess
  async getMess() {
    return apiFetch<{ feedback: MessFeedback[] }>('/mess');
  },

  async submitMessFeedback(mealType: MessFeedback['mealType'], rating: number, comment: string) {
    return apiFetch<{ feedback: MessFeedback }>('/mess/feedback', {
      method: 'POST',
      body: JSON.stringify({ mealType, rating, comment }),
    });
  },

  // Fees
  async getFees() {
    return apiFetch<{ fees: FeeDetails }>('/fees');
  },

  async payFees(amount: number, method: string) {
    return apiFetch<{ success: boolean; txnId: string; feeDetails: FeeDetails }>('/fees/pay', {
      method: 'POST',
      body: JSON.stringify({ amount, method }),
    });
  },

  // Audit Logs
  async getAuditLogs() {
    return apiFetch<{ logs: AuditLogEntry[] }>('/audit-logs');
  },

  // Bootstrap full dataset
  async getBootstrapData() {
    return apiFetch<{
      complaints: Complaint[];
      requests: CertificateRequest[];
      gatePasses: GatePass[];
      notices: CampusNotice[];
      notifications: CampusNotification[];
      attendance: AttendanceRecord[];
      messFeedback: MessFeedback[];
      feeDetails: FeeDetails;
      auditLogs: AuditLogEntry[];
    }>('/bootstrap');
  },
  // Firebase Status
  async getFirebaseStatus() {
    return apiFetch<{
      connected: boolean;
      projectId: string;
      authDomain: string;
      firestoreActive: boolean;
      authActive: boolean;
    }>('/firebase/status');
  },
};
