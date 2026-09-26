export type NavigationTab =
  | 'Home'
  | 'Attendance'
  | 'Timetable'
  | 'Notices'
  | 'Complaints'
  | 'Requests'
  | 'Gate Pass'
  | 'Mess'
  | 'Fees & Dues'
  | 'Notifications'
  | 'Profile';

export type PriorityLevel = 'High' | 'Medium' | 'Low' | 'Emergency';
export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Under Review';

export interface ComplaintItem {
  id: string; // e.g. "CMP-1024"
  title: string;
  category: 'Plumbing' | 'Electrical' | 'Internet & Wi-Fi' | 'Carpentry' | 'Cleanliness';
  location: string; // e.g. "Hostel B • Room 204"
  priority: PriorityLevel;
  status: TicketStatus;
  assigned: string; // e.g. "Plumbing Maintenance Team"
  submittedAt: string;
  description: string;
  aiClassification?: {
    categoryDetected: string;
    urgencyScore: number;
    recommendedSLA: string;
    recurringIssueDetected: boolean;
  };
  timeline?: {
    step: string;
    time: string;
    done: boolean;
  }[];
}

export interface RequestItem {
  id: string; // e.g. "REQ-1021"
  title: string; // e.g. "Bonafide Certificate"
  category: 'Academic' | 'Hostel' | 'Fee Clearance' | 'ID Card Duplicate';
  submittedDate: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  approvedBy?: string;
  expectedDate?: string;
  notes?: string;
  downloadAvailable: boolean;
}

export interface GatePassItem {
  id: string; // e.g. "GP-8924"
  destination: string;
  reason: string;
  departure: string;
  expectedReturn: string;
  actualReturn?: string;
  status: 'Approved' | 'Pending' | 'Active' | 'Completed' | 'Overdue';
  wardenName: string;
  qrCodeId: string;
}

export interface SubjectAttendance {
  code: string;
  name: string;
  attended: number;
  total: number;
  percentage: number;
  faculty: string;
  status: 'Safe' | 'Warning' | 'Critical';
}

export interface StudentProfile {
  name: string;
  rollNumber: string;
  degree: string;
  year: string;
  semester: string;
  section: string;
  email: string;
  phone: string;
  hostel: string;
  room: string;
  bloodGroup: string;
  emergencyContact: string;
  cgpa: string;
  avatarUrl: string;
}
