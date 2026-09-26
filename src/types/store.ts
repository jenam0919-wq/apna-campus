import { UserRole } from './auth';
import { NavigationTab } from './campus';

export interface Complaint {
  id: string; // e.g. CMP-1024
  title: string;
  category: 'Plumbing' | 'Electricity' | 'Cleaning' | 'Wi-Fi' | 'Furniture' | 'Bathroom' | 'Fan/AC' | 'Water' | 'Other';
  description: string;
  hostel: string;
  room: string;
  location: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Submitted' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';
  studentName: string;
  studentEmail: string;
  studentRoll: string;
  createdAt: string;
  assignedStaff?: string;
  assignedStaffRole?: string;
  staffNotes?: string;
  resolutionPhoto?: string;
  resolvedAt?: string;
  studentRating?: number;
  studentFeedback?: string;
  closedAt?: string;
  history: {
    date: string;
    action: string;
    actor: string;
  }[];
  aiRouting: {
    category: string;
    department: string;
    priority: 'High' | 'Medium' | 'Low';
    assignedTeam: string;
  };
}

export interface CertificateRequest {
  id: string; // e.g. REQ-1001
  type: 'Bonafide Certificate' | 'Study Certificate' | 'Character Certificate' | 'Fee Certificate' | 'Hostel Certificate' | 'Other';
  studentName: string;
  rollNumber: string;
  department: string;
  academicYear: string;
  purpose: string;
  urgency: 'Normal' | 'Urgent';
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  verificationCode?: string;
  rejectionReason?: string;
}

export interface GatePass {
  id: string; // e.g. GP-2026-001
  studentName: string;
  studentRoll: string;
  studentHostel: string;
  studentRoom: string;
  destination: string;
  reason: string;
  departureTime: string;
  expectedReturnTime: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  qrPayload: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface CampusNotice {
  id: string;
  title: string;
  description: string;
  category: 'Academic' | 'Examination' | 'Hostel' | 'Events' | 'Fees' | 'Emergency';
  priority: 'Important' | 'Emergency' | 'Regular';
  targetAudience: 'All Students' | 'Faculty' | 'CSE' | '2nd Year' | 'Hostel' | 'All';
  postedBy: string;
  publishDate: string;
  isRead: boolean;
  actionRequired?: boolean;
  actionLabel?: string;
  actionCompleted?: boolean;
}

export interface CampusNotification {
  id: string;
  type: 'complaint' | 'certificate' | 'gatepass' | 'notice' | 'class_cancellation' | 'fee' | 'emergency';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  targetRole: UserRole | 'All';
  actionTab?: NavigationTab;
  relatedId?: string;
}

export interface AttendanceRecord {
  courseCode: string;
  courseName: string;
  facultyName: string;
  attendedClasses: number;
  totalClasses: number;
  percentage: number;
  thresholdWarning: boolean;
}

export interface MessFeedback {
  id: string;
  day: string;
  mealType: 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';
  studentName: string;
  rating: number; // 1 - 5
  comment: string;
  date: string;
}

export interface FeeDetails {
  totalFee: number;
  paidAmount: number;
  pendingAmount: number;
  dueDate: string;
  transactions: {
    id: string; // TXN-2026-XXX
    date: string;
    amount: number;
    method: string;
    status: 'Success' | 'Pending';
    receiptNo: string;
  }[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  details: string;
  ip: string;
}
