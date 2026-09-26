export type UserRole = 'Student' | 'Faculty' | 'Admin' | 'Warden' | 'Staff';

export type AccountStatus = 'active' | 'inactive' | 'disabled';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  title: string;
  department: string;
  avatarUrl: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
  institutionId?: string;
  details?: {
    rollNumber?: string;
    section?: string;
    designation?: string;
    hostelAssigned?: string;
    assignedDepartment?: string;
    [key: string]: any;
  };
}

export type Permission =
  | 'profile:read'
  | 'profile:write'
  | 'attendance:read'
  | 'attendance:mark'
  | 'complaints:read_own'
  | 'complaints:read_all'
  | 'complaints:create'
  | 'complaints:update_status'
  | 'complaints:reassign'
  | 'requests:read_own'
  | 'requests:read_all'
  | 'requests:create'
  | 'requests:review'
  | 'gatepasses:read_own'
  | 'gatepasses:read_all'
  | 'gatepasses:create'
  | 'gatepasses:review'
  | 'gatepasses:verify'
  | 'notices:read'
  | 'notices:create'
  | 'timetable:read'
  | 'timetable:manage'
  | 'mess:read'
  | 'mess:feedback'
  | 'fees:read'
  | 'fees:pay'
  | 'users:manage'
  | 'audit:read';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  Student: [
    'profile:read',
    'profile:write',
    'attendance:read',
    'complaints:read_own',
    'complaints:create',
    'requests:read_own',
    'requests:create',
    'gatepasses:read_own',
    'gatepasses:create',
    'notices:read',
    'timetable:read',
    'mess:read',
    'mess:feedback',
    'fees:read',
    'fees:pay',
  ],
  Faculty: [
    'profile:read',
    'profile:write',
    'attendance:read',
    'attendance:mark',
    'timetable:read',
    'timetable:manage',
    'notices:read',
    'notices:create',
    'requests:read_all',
    'requests:review',
    'complaints:read_all',
  ],
  Admin: [
    'profile:read',
    'profile:write',
    'attendance:read',
    'attendance:mark',
    'complaints:read_own',
    'complaints:read_all',
    'complaints:create',
    'complaints:update_status',
    'complaints:reassign',
    'requests:read_own',
    'requests:read_all',
    'requests:create',
    'requests:review',
    'gatepasses:read_own',
    'gatepasses:read_all',
    'gatepasses:create',
    'gatepasses:review',
    'gatepasses:verify',
    'notices:read',
    'notices:create',
    'timetable:read',
    'timetable:manage',
    'mess:read',
    'mess:feedback',
    'fees:read',
    'fees:pay',
    'users:manage',
    'audit:read',
  ],
  Warden: [
    'profile:read',
    'profile:write',
    'gatepasses:read_all',
    'gatepasses:review',
    'gatepasses:verify',
    'complaints:read_all',
    'complaints:update_status',
    'complaints:reassign',
    'mess:read',
    'notices:read',
    'notices:create',
    'audit:read',
  ],
  Staff: [
    'profile:read',
    'profile:write',
    'complaints:read_all',
    'complaints:update_status',
    'complaints:reassign',
    'notices:read',
    'audit:read',
  ],
};

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: UserAccount | null;
  role: UserRole | null;
  loading: boolean;
}

export interface AuthContextType extends AuthState {
  currentPath: string;
  navigate: (path: string, options?: { replace?: boolean }) => void;
  login: (emailOrId: string, password: string, rememberMe?: boolean) => Promise<{
    success: boolean;
    error?: string;
    status?: 'invalid' | 'disabled' | 'network_error' | 'success';
    user?: UserAccount;
  }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<UserAccount | null>;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  hasPermission: (permission: Permission) => boolean;
}
