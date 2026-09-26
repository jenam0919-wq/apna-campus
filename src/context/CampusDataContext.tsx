import React, { createContext, useContext, useState, useEffect } from 'react';
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
import { UserAccount, UserRole } from '../types/auth';
import { NavigationTab } from '../types/campus';
import { CampusAPI } from '../services/api';
import {
  subscribeToFirestoreCollection,
  setFirestoreDocument,
  updateFirestoreDocument,
  getFirestoreDocument,
} from '../services/firebase';

interface RecurringAlert {
  id: string;
  category: string;
  hostel: string;
  count: number;
  message: string;
  recommendedAction: string;
  detectedAt: string;
}

interface CampusDataContextType {
  // Complaints
  complaints: Complaint[];
  createComplaint: (data: Omit<Complaint, 'id' | 'createdAt' | 'status' | 'history' | 'aiRouting'>) => string;
  updateComplaintStatus: (id: string, newStatus: Complaint['status'], notes?: string, photo?: string) => void;
  confirmComplaintResolution: (id: string, rating: number, feedback?: string) => void;
  reassignComplaint: (id: string, staffName: string, priority: 'High' | 'Medium' | 'Low') => void;
  recurringAlerts: RecurringAlert[];

  // Certificate Requests
  certificateRequests: CertificateRequest[];
  createCertificateRequest: (data: Omit<CertificateRequest, 'id' | 'createdAt' | 'status' | 'verificationCode'>) => string;
  reviewCertificateRequest: (id: string, status: 'Approved' | 'Rejected', approverName: string, reason?: string) => void;

  // Gate Passes
  gatePasses: GatePass[];
  applyGatePass: (data: Omit<GatePass, 'id' | 'status' | 'qrPayload' | 'approvedBy' | 'approvedAt'>) => string;
  reviewGatePass: (id: string, status: 'Approved' | 'Rejected', wardenName: string, reason?: string) => void;
  verifyGatePassCode: (query: string) => { valid: boolean; pass?: GatePass; message: string };

  // Notices
  notices: CampusNotice[];
  createNotice: (data: Omit<CampusNotice, 'id' | 'publishDate' | 'isRead'>) => string;
  markNoticeAsRead: (id: string) => void;
  completeNoticeAction: (id: string) => void;

  // Notifications
  notifications: CampusNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotification: (id: string) => void;
  unreadNotificationsCount: number;
  dispatchNotification: (
    type: CampusNotification['type'],
    title: string,
    message: string,
    targetRole?: UserRole | 'All',
    actionTab?: NavigationTab,
    relatedId?: string
  ) => void;

  // Attendance
  attendanceRecords: AttendanceRecord[];
  markClassAttendance: (courseCode: string, studentRoll: string, isPresent: boolean) => void;
  overallAttendancePercentage: number;

  // Timetable
  cancelledClasses: string[];
  cancelClass: (courseCode: string, facultyName: string, reason?: string) => void;

  // Mess
  messFeedback: MessFeedback[];
  submitMealFeedback: (mealType: MessFeedback['mealType'], rating: number, comment: string, studentName: string) => void;
  averageMessRating: number;

  // Fees
  feeDetails: FeeDetails;
  payFees: (amount: number, method: string) => { success: boolean; txnId: string };

  // Audit Trail
  auditLogs: AuditLogEntry[];
  addAuditLog: (actor: string, role: string, action: string, details: string) => void;

  // Reset store helper for test demos
  resetToDefaultData: () => void;
}

const STORAGE_KEY = 'campus360_unified_store_v3';

// AI Auto-classification rule engine
export function classifyComplaintWithAI(title: string, description: string): {
  category: Complaint['category'];
  department: string;
  priority: 'High' | 'Medium' | 'Low';
  assignedTeam: string;
} {
  const combined = `${title} ${description}`.toLowerCase();

  if (combined.includes('leak') || combined.includes('water') || combined.includes('pipe') || combined.includes('tap') || combined.includes('flush') || combined.includes('drain')) {
    return {
      category: 'Plumbing',
      department: 'Estate Maintenance',
      priority: combined.includes('overflow') || combined.includes('flood') || combined.includes('burst') ? 'High' : 'High',
      assignedTeam: 'Plumbing & Water Supply Team (Rajesh Verma)',
    };
  }

  if (combined.includes('power') || combined.includes('light') || combined.includes('fan') || combined.includes('switch') || combined.includes('fuse') || combined.includes('spark') || combined.includes('shock')) {
    return {
      category: 'Electricity',
      department: 'Electrical Engineering Division',
      priority: combined.includes('spark') || combined.includes('shock') || combined.includes('blackout') ? 'High' : 'Medium',
      assignedTeam: 'Electrical Works Crew (K. Somesh)',
    };
  }

  if (combined.includes('wifi') || combined.includes('internet') || combined.includes('router') || combined.includes('lan') || combined.includes('ethernet') || combined.includes('speed')) {
    return {
      category: 'Wi-Fi',
      department: 'Campus IT & Network Operations',
      priority: combined.includes('exam') || combined.includes('no connection') ? 'High' : 'Medium',
      assignedTeam: 'Campus Network Ops (NOC Level-2)',
    };
  }

  if (combined.includes('clean') || combined.includes('dustbin') || combined.includes('garbage') || combined.includes('sweep') || combined.includes('smell') || combined.includes('corridor')) {
    return {
      category: 'Cleaning',
      department: 'Sanitation & Housekeeping',
      priority: 'Medium',
      assignedTeam: 'Housekeeping Block B Squad',
    };
  }

  if (combined.includes('bed') || combined.includes('chair') || combined.includes('table') || combined.includes('cupboard') || combined.includes('door') || combined.includes('lock') || combined.includes('hinge')) {
    return {
      category: 'Furniture',
      department: 'Carpentry & Estate Services',
      priority: combined.includes('lock') ? 'High' : 'Low',
      assignedTeam: 'Carpentry & Fixtures Unit',
    };
  }

  if (combined.includes('ac') || combined.includes('cooling') || combined.includes('filter')) {
    return {
      category: 'Fan/AC',
      department: 'HVAC Maintenance',
      priority: 'Medium',
      assignedTeam: 'HVAC Air Systems Team',
    };
  }

  return {
    category: 'Other',
    department: 'General Operations',
    priority: 'Medium',
    assignedTeam: 'Central Facilities Desk',
  };
}

// Initial Pre-seeded Data
const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'CMP-1024',
    title: 'Water tap leaking continuously in washroom',
    category: 'Plumbing',
    description: 'The basin mixer tap in 2nd floor common washroom has a cracked washer and is leaking water non-stop, creating a slippery floor.',
    hostel: 'Aryabhata Bhavan (Block B)',
    room: 'Washroom 204',
    location: '2nd Floor West Wing',
    priority: 'High',
    status: 'In Progress',
    studentName: 'Manoj Kumar Jena',
    studentEmail: 'student@campus360.demo',
    studentRoll: '2024CS1042',
    createdAt: '2026-09-21 09:30 AM',
    assignedStaff: 'Rajesh Verma',
    assignedStaffRole: 'Senior Plumbing Technician',
    staffNotes: 'Replaced internal valve washer; testing water pressure under main riser.',
    aiRouting: {
      category: 'Plumbing',
      department: 'Estate Maintenance',
      priority: 'High',
      assignedTeam: 'Plumbing Team (Rajesh Verma)',
    },
    history: [
      { date: '2026-09-21 09:30 AM', action: 'Submitted by student via Apna Campus', actor: 'Manoj Kumar Jena (Student)' },
      { date: '2026-09-21 09:35 AM', action: 'AI triage classified as High Priority Plumbing', actor: 'Apna Campus AI Engine' },
      { date: '2026-09-21 10:15 AM', action: 'Work order accepted by maintenance staff', actor: 'Rajesh Verma (Staff)' },
      { date: '2026-09-21 11:30 AM', action: 'Status moved to In Progress. Replacement parts requisitioned', actor: 'Rajesh Verma (Staff)' },
    ],
  },
  {
    id: 'CMP-1023',
    title: 'Ceiling fan making squeaking noise & oscillating erratically',
    category: 'Fan/AC',
    description: 'Room 312 ceiling fan bearing seems loose and wobbles at regulator speeds 4 and 5.',
    hostel: 'Aryabhata Bhavan (Block B)',
    room: 'Room 312',
    location: '3rd Floor North',
    priority: 'Medium',
    status: 'Resolved',
    studentName: 'Manoj Kumar Jena',
    studentEmail: 'student@campus360.demo',
    studentRoll: '2024CS1042',
    createdAt: '2026-09-19 02:15 PM',
    assignedStaff: 'K. Somesh (Electrical)',
    assignedStaffRole: 'Electrician',
    staffNotes: 'Tightened clamp screws and lubricated armature bearing with high-temp grease.',
    resolvedAt: '2026-09-20 04:45 PM',
    aiRouting: {
      category: 'Fan/AC',
      department: 'Electrical Engineering Division',
      priority: 'Medium',
      assignedTeam: 'Electrical Works Crew',
    },
    history: [
      { date: '2026-09-19 02:15 PM', action: 'Complaint created', actor: 'Manoj Kumar Jena (Student)' },
      { date: '2026-09-19 03:00 PM', action: 'Assigned to K. Somesh', actor: 'Admin Desk' },
      { date: '2026-09-20 04:45 PM', action: 'Work completed and marked Resolved', actor: 'K. Somesh (Staff)' },
    ],
  },
  {
    id: 'CMP-1022',
    title: 'Wi-Fi Access Point dropping packets in Wing C',
    category: 'Wi-Fi',
    description: 'Frequent timeout when connecting to Campus-Secure SSID on floor 1 corridor.',
    hostel: 'Aryabhata Bhavan (Block B)',
    room: 'Corridor 105',
    location: '1st Floor Wing C',
    priority: 'Medium',
    status: 'Closed',
    studentName: 'Aarav Patel',
    studentEmail: 'aarav.patel@campus360.demo',
    studentRoll: '2024CS1018',
    createdAt: '2026-09-17 11:00 AM',
    assignedStaff: 'Campus IT NOC',
    staffNotes: 'Re-flashed Cisco AP firmware; channel interference resolved.',
    resolvedAt: '2026-09-18 10:00 AM',
    studentRating: 5,
    studentFeedback: 'Super fast resolution! Speeds are back to 100 Mbps.',
    closedAt: '2026-09-18 01:15 PM',
    aiRouting: {
      category: 'Wi-Fi',
      department: 'Campus IT & Network Operations',
      priority: 'Medium',
      assignedTeam: 'Campus Network Ops',
    },
    history: [
      { date: '2026-09-17 11:00 AM', action: 'Submitted', actor: 'Aarav Patel (Student)' },
      { date: '2026-09-18 10:00 AM', action: 'Resolved by NOC', actor: 'Campus IT NOC' },
      { date: '2026-09-18 01:15 PM', action: 'Student confirmed resolution & gave 5-star review', actor: 'Aarav Patel (Student)' },
    ],
  },
  {
    id: 'CMP-1021',
    title: 'Low water pressure on 4th floor showers',
    category: 'Water',
    description: 'Shower head barely drips in 4th floor bathroom during peak morning hours (7:30 - 8:30 AM).',
    hostel: 'Aryabhata Bhavan (Block B)',
    room: 'Bathroom 401',
    location: '4th Floor North',
    priority: 'High',
    status: 'Submitted',
    studentName: 'Vikram Seth',
    studentEmail: 'vikram.seth@campus360.demo',
    studentRoll: '2024CS1089',
    createdAt: '2026-09-22 08:10 AM',
    aiRouting: {
      category: 'Water',
      department: 'Estate Maintenance',
      priority: 'High',
      assignedTeam: 'Plumbing Team (Rajesh Verma)',
    },
    history: [
      { date: '2026-09-22 08:10 AM', action: 'Submitted by student', actor: 'Vikram Seth (Student)' },
      { date: '2026-09-22 08:11 AM', action: 'Auto-routed to Estate Maintenance', actor: 'Apna Campus AI' },
    ],
  },
  {
    id: 'CMP-1020',
    title: 'Flush valve leaking in washroom 206',
    category: 'Plumbing',
    description: 'Constant dripping water from the cistern flush valve pipe.',
    hostel: 'Aryabhata Bhavan (Block B)',
    room: 'Washroom 206',
    location: '2nd Floor East Wing',
    priority: 'High',
    status: 'Submitted',
    studentName: 'Sameer Khan',
    studentEmail: 'sameer.khan@campus360.demo',
    studentRoll: '2024CS1066',
    createdAt: '2026-09-22 09:45 AM',
    aiRouting: {
      category: 'Plumbing',
      department: 'Estate Maintenance',
      priority: 'High',
      assignedTeam: 'Plumbing Team (Rajesh Verma)',
    },
    history: [
      { date: '2026-09-22 09:45 AM', action: 'Submitted', actor: 'Sameer Khan (Student)' },
    ],
  },
];

const INITIAL_REQUESTS: CertificateRequest[] = [
  {
    id: 'REQ-1001',
    type: 'Bonafide Certificate',
    studentName: 'Manoj Kumar Jena',
    rollNumber: '2024CS1042',
    department: 'Computer Science & Engineering',
    academicYear: '2026-2027 (3rd Year)',
    purpose: 'National Level Smart India Hackathon participation & official visa clearance.',
    urgency: 'Urgent',
    status: 'Approved',
    createdAt: '2026-09-20 10:30 AM',
    approvedBy: 'Dr. K. Venkataraman (Dean)',
    approvedAt: '2026-09-21 02:15 PM',
    verificationCode: 'CERT-2026-BF-9042A',
  },
  {
    id: 'REQ-1002',
    type: 'Fee Certificate',
    studentName: 'Manoj Kumar Jena',
    rollNumber: '2024CS1042',
    department: 'Computer Science & Engineering',
    academicYear: '2026-2027 (3rd Year)',
    purpose: 'SBI Education Loan subsidy documentation for semester 5 tuition fees.',
    urgency: 'Normal',
    status: 'Submitted',
    createdAt: '2026-09-22 11:20 AM',
  },
  {
    id: 'REQ-1003',
    type: 'Hostel Certificate',
    studentName: 'Pooja Verma',
    rollNumber: '2024EC1012',
    department: 'Electronics & Comm.',
    academicYear: '2026-2027 (3rd Year)',
    purpose: 'Passport address verification and police clearance.',
    urgency: 'Normal',
    status: 'Under Review',
    createdAt: '2026-09-21 04:00 PM',
  },
];

const INITIAL_GATE_PASSES: GatePass[] = [
  {
    id: 'GP-2026-001',
    studentName: 'Manoj Kumar Jena',
    studentRoll: '2024CS1042',
    studentHostel: 'Aryabhata Bhavan (Block B)',
    studentRoom: 'Room 312',
    destination: 'City Center Tech Hub (Cyber Towers)',
    reason: 'Attending Google Developer Group AI Hackathon project kickoff meet',
    departureTime: '2026-09-23 16:30',
    expectedReturnTime: '2026-09-23 21:00',
    status: 'Approved',
    qrPayload: 'CAMPUS360-GP-2026-001|2024CS1042|RAHUL_SHARMA|APPROVED|VALID_UNTIL_21:00',
    approvedBy: 'Er. Sandeep Rathore (Hostel Warden)',
    approvedAt: '2026-09-23 11:15 AM',
  },
  {
    id: 'GP-2026-002',
    studentName: 'Ananya Roy',
    studentRoll: '2024CS1025',
    studentHostel: 'Kalpana Chawla Hall (Block A)',
    studentRoom: 'Room 108',
    destination: 'Apollo Hospital (Health Checkup)',
    reason: 'Dental appointment at Apollo Clinic',
    departureTime: '2026-09-23 14:00',
    expectedReturnTime: '2026-09-23 18:30',
    status: 'Pending',
    qrPayload: 'CAMPUS360-GP-2026-002|PENDING',
  },
  {
    id: 'GP-2026-003',
    studentName: 'Devendra Joshi',
    studentRoll: '2024ME1055',
    studentHostel: 'Aryabhata Bhavan (Block B)',
    studentRoom: 'Room 214',
    destination: 'Railway Station (Receiving family)',
    reason: 'Parents visiting for weekend convocation',
    departureTime: '2026-09-22 17:00',
    expectedReturnTime: '2026-09-22 20:30',
    status: 'Completed',
    qrPayload: 'CAMPUS360-GP-2026-003|COMPLETED',
    approvedBy: 'Er. Sandeep Rathore',
    approvedAt: '2026-09-22 15:00',
    verifiedAt: '2026-09-22 17:05 (Main Gate Security Post 1)',
    verifiedBy: 'Security Officer R. K. Nair',
  },
];

const INITIAL_NOTICES: CampusNotice[] = [
  {
    id: 'not-001',
    title: 'Final Term Mid-Semester Exam Schedule Released',
    description: 'The controller of examinations has published the date sheet for B.Tech Semester 3 and 5. Please review the timetable and seating matrix.',
    category: 'Examination',
    priority: 'Important',
    targetAudience: 'All Students',
    postedBy: 'Dean of Academic Affairs',
    publishDate: '23 Sep 2026',
    isRead: false,
    actionRequired: true,
    actionLabel: 'Download Exam Hall Ticket & Seating Matrix',
    actionCompleted: false,
  },
  {
    id: 'not-002',
    title: 'Emergency Power Grid Maintenance — Substation 2',
    description: 'Scheduled preventive shutdown of Substation 2 from 02:00 PM to 04:00 PM today. Library and Academic Block generators will maintain backup.',
    category: 'Emergency',
    priority: 'Emergency',
    targetAudience: 'All',
    postedBy: 'Campus Estate & Engineering Dept',
    publishDate: '23 Sep 2026',
    isRead: false,
  },
  {
    id: 'not-003',
    title: 'Hostel B Biometric Roll Call Verification',
    description: 'Mandatory hostel biometric verification for all residents of Aryabhata Bhavan before 10:00 PM tonight at the Warden Office.',
    category: 'Hostel',
    priority: 'Important',
    targetAudience: 'Hostel',
    postedBy: 'Chief Hostel Warden',
    publishDate: '22 Sep 2026',
    isRead: true,
    actionRequired: true,
    actionLabel: 'Confirm Biometric Slot Attendance',
    actionCompleted: true,
  },
  {
    id: 'not-004',
    title: 'Industry Mentorship: Google Cloud & GenAI Summit 2026',
    description: 'Registration open for the CSE special workshop featuring Google Cloud engineers on LLM fine-tuning and production deployments.',
    category: 'Events',
    priority: 'Regular',
    targetAudience: 'CSE',
    postedBy: 'HOD, Computer Science & Engineering',
    publishDate: '21 Sep 2026',
    isRead: true,
    actionRequired: true,
    actionLabel: 'Register for Workshop Slot',
    actionCompleted: false,
  },
];

const INITIAL_NOTIFICATIONS: CampusNotification[] = [
  {
    id: 'ntf-01',
    type: 'gatepass',
    title: 'Gate Pass Approved (GP-2026-001)',
    message: 'Warden Sandeep Rathore has approved your gate pass to City Center. QR code is ready for gate check.',
    timestamp: '15 mins ago',
    read: false,
    targetRole: 'Student',
    actionTab: 'Gate Pass',
    relatedId: 'GP-2026-001',
  },
  {
    id: 'ntf-02',
    type: 'complaint',
    title: 'Work In Progress on CMP-1024',
    message: 'Staff Rajesh Verma has arrived at Washroom 204 with replacement parts and started repair work.',
    timestamp: '1 hour ago',
    read: false,
    targetRole: 'Student',
    actionTab: 'Complaints',
    relatedId: 'CMP-1024',
  },
  {
    id: 'ntf-03',
    type: 'certificate',
    title: 'Bonafide Certificate Generated (REQ-1001)',
    message: 'Dean Dr. K. Venkataraman approved your Bonafide Certificate. You can now download the digital stamped copy.',
    timestamp: 'Yesterday',
    read: true,
    targetRole: 'Student',
    actionTab: 'Requests',
    relatedId: 'REQ-1001',
  },
  {
    id: 'ntf-04',
    type: 'notice',
    title: 'New Exam Notice Released',
    message: 'Mid-term exam date sheets and guidelines have been posted by the Academic Office.',
    timestamp: '2 hours ago',
    read: false,
    targetRole: 'All',
    actionTab: 'Notices',
  },
];

const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  { courseCode: 'CS201', courseName: 'Data Structures & Algorithms', facultyName: 'Dr. A. Singh', attendedClasses: 36, totalClasses: 40, percentage: 90, thresholdWarning: false },
  { courseCode: 'CS202', courseName: 'Computer Org. & Architecture', facultyName: 'Prof. R. Menon', attendedClasses: 28, totalClasses: 32, percentage: 87.5, thresholdWarning: false },
  { courseCode: 'CS203', courseName: 'Operating Systems & Kernels', facultyName: 'Dr. Priya Desai', attendedClasses: 26, totalClasses: 30, percentage: 86.6, thresholdWarning: false },
  { courseCode: 'CS204', courseName: 'Discrete Mathematics', facultyName: 'Prof. S. Sen', attendedClasses: 25, totalClasses: 30, percentage: 83.3, thresholdWarning: false },
  { courseCode: 'CS205', courseName: 'Design & Analysis of Algorithms', facultyName: 'Prof. T. Sharma', attendedClasses: 18, totalClasses: 26, percentage: 69.2, thresholdWarning: true },
];

const INITIAL_MESS_FEEDBACK: MessFeedback[] = [
  { id: 'mf-01', day: 'Wednesday', mealType: 'Lunch', studentName: 'Manoj Kumar Jena', rating: 4, comment: 'Paneer butter masala and rotis were fresh and warm.', date: '2026-09-23' },
  { id: 'mf-02', day: 'Wednesday', mealType: 'Breakfast', studentName: 'Priya N.', rating: 5, comment: 'Poha & filter coffee was well prepared.', date: '2026-09-23' },
  { id: 'mf-03', day: 'Tuesday', mealType: 'Dinner', studentName: 'Aarav Patel', rating: 3, comment: 'Dal tadka lacked salt, salad was good.', date: '2026-09-22' },
  { id: 'mf-04', day: 'Monday', mealType: 'Lunch', studentName: 'Sneha Roy', rating: 4, comment: 'Good quality rice and curd.', date: '2026-09-21' },
];

const INITIAL_FEES: FeeDetails = {
  totalFee: 85000,
  paidAmount: 65000,
  pendingAmount: 20000,
  dueDate: '15 Oct 2026',
  transactions: [
    { id: 'TXN-2026-8812', date: '10 Aug 2026', amount: 45000, method: 'UPI / HDFC NetBanking', status: 'Success', receiptNo: 'RCP-2026-9901' },
    { id: 'TXN-2026-8945', date: '01 Sep 2026', amount: 20000, method: 'Campus Pay Credit Card', status: 'Success', receiptNo: 'RCP-2026-9954' },
  ],
};

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  { id: 'aud-01', timestamp: '23 Sep 2026 11:15 AM', actor: 'Er. Sandeep Rathore', role: 'Warden', action: 'Approved Gate Pass', details: 'Approved GP-2026-001 for Manoj Kumar Jena (City Center)', ip: '10.0.12.45' },
  { id: 'aud-02', timestamp: '23 Sep 2026 09:30 AM', actor: 'Manoj Kumar Jena', role: 'Student', action: 'Created Ticket', details: 'Submitted CMP-1024: Washroom 204 leaking tap', ip: '10.0.24.112' },
  { id: 'aud-03', timestamp: '22 Sep 2026 02:15 PM', actor: 'Dr. K. Venkataraman', role: 'Admin', action: 'Approved Certificate', details: 'Approved Bonafide REQ-1001 with ref CERT-2026-BF-9042A', ip: '10.0.1.10' },
  { id: 'aud-04', timestamp: '21 Sep 2026 10:00 AM', actor: 'Dr. A. Singh', role: 'Faculty', action: 'Updated Attendance', details: 'Marked CS201 Attendance for 40 students in Section A', ip: '10.0.8.99' },
  { id: 'aud-05', timestamp: '20 Sep 2026 04:45 PM', actor: 'K. Somesh', role: 'Staff', action: 'Resolved Ticket', details: 'Marked CMP-1023 Resolved with parts replaced', ip: '10.0.14.77' },
];

const CampusDataContext = createContext<CampusDataContextType | null>(null);

export const CampusDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Complaints
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_complaints`);
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });

  // 2. Certificate Requests
  const [certificateRequests, setCertificateRequests] = useState<CertificateRequest[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_requests`);
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  // 3. Gate Passes
  const [gatePasses, setGatePasses] = useState<GatePass[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_gatepasses`);
    return saved ? JSON.parse(saved) : INITIAL_GATE_PASSES;
  });

  // 4. Notices
  const [notices, setNotices] = useState<CampusNotice[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notices`);
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  // 5. Notifications
  const [notifications, setNotifications] = useState<CampusNotification[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // 6. Attendance
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_attendance`);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  // 7. Timetable Cancelled Classes
  const [cancelledClasses, setCancelledClasses] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_cancelled_classes`);
    return saved ? JSON.parse(saved) : [];
  });

  // 8. Mess Feedback
  const [messFeedback, setMessFeedback] = useState<MessFeedback[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_mess`);
    return saved ? JSON.parse(saved) : INITIAL_MESS_FEEDBACK;
  });

  // 9. Fees
  const [feeDetails, setFeeDetails] = useState<FeeDetails>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_fees`);
    return saved ? JSON.parse(saved) : INITIAL_FEES;
  });

  // 10. Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_audit`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Save to LocalStorage whenever state updates
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_complaints`, JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_requests`, JSON.stringify(certificateRequests));
  }, [certificateRequests]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_gatepasses`, JSON.stringify(gatePasses));
  }, [gatePasses]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_notices`, JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_attendance`, JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_fees`, JSON.stringify(feeDetails));
  }, [feeDetails]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_mess`, JSON.stringify(messFeedback));
  }, [messFeedback]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Real-time synchronization with Cloud Firestore
  useEffect(() => {
    // 1. Complaints real-time listener
    const unsubComplaints = subscribeToFirestoreCollection<Complaint>('complaints', (items) => {
      if (items && items.length > 0) setComplaints(items);
    });

    // 2. Certificate Requests real-time listener
    const unsubRequests = subscribeToFirestoreCollection<CertificateRequest>('requests', (items) => {
      if (items && items.length > 0) setCertificateRequests(items);
    });

    // 3. Gate Passes real-time listener
    const unsubPasses = subscribeToFirestoreCollection<GatePass>('gate_passes', (items) => {
      if (items && items.length > 0) setGatePasses(items);
    });

    // 4. Notices real-time listener
    const unsubNotices = subscribeToFirestoreCollection<CampusNotice>('notices', (items) => {
      if (items && items.length > 0) setNotices(items);
    });

    // 5. Notifications real-time listener
    const unsubNotifs = subscribeToFirestoreCollection<CampusNotification>('notifications', (items) => {
      if (items && items.length > 0) setNotifications(items);
    });

    // 6. Attendance real-time listener
    const unsubAttendance = subscribeToFirestoreCollection<AttendanceRecord>('attendance', (items) => {
      if (items && items.length > 0) setAttendanceRecords(items);
    });

    // 7. Mess Feedback real-time listener
    const unsubMess = subscribeToFirestoreCollection<MessFeedback>('mess_feedback', (items) => {
      if (items && items.length > 0) setMessFeedback(items);
    });

    // 8. Audit Logs real-time listener
    const unsubAudit = subscribeToFirestoreCollection<AuditLogEntry>('audit_logs', (items) => {
      if (items && items.length > 0) setAuditLogs(items);
    });

    // 9. Initial Fee details from Firestore
    getFirestoreDocument<FeeDetails>('settings', 'fee_details').then((doc) => {
      if (doc) setFeeDetails(doc);
    }).catch(() => {});

    // Fallback sync with Express backend API
    let isMounted = true;
    CampusAPI.getBootstrapData().then((res) => {
      if (!isMounted || !res.data) return;
      const b = res.data;
      if (b.complaints && b.complaints.length > 0) setComplaints(b.complaints);
      if (b.requests && b.requests.length > 0) setCertificateRequests(b.requests);
      if (b.gatePasses && b.gatePasses.length > 0) setGatePasses(b.gatePasses);
      if (b.notices && b.notices.length > 0) setNotices(b.notices);
      if (b.notifications && b.notifications.length > 0) setNotifications(b.notifications);
      if (b.attendance && b.attendance.length > 0) setAttendanceRecords(b.attendance);
      if (b.messFeedback && b.messFeedback.length > 0) setMessFeedback(b.messFeedback);
      if (b.feeDetails) setFeeDetails(b.feeDetails);
      if (b.auditLogs && b.auditLogs.length > 0) setAuditLogs(b.auditLogs);
    }).catch(() => {
      // Offline fallback: continue using cached local state
    });

    return () => {
      isMounted = false;
      unsubComplaints();
      unsubRequests();
      unsubPasses();
      unsubNotices();
      unsubNotifs();
      unsubAttendance();
      unsubMess();
      unsubAudit();
    };
  }, []);

  const addAuditLog = (actor: string, role: string, action: string, details: string) => {
    const newEntry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actor,
      role,
      action,
      details,
      ip: '10.0.18.' + Math.floor(Math.random() * 200 + 10),
    };
    setAuditLogs((prev) => [newEntry, ...prev.slice(0, 49)]);
    setFirestoreDocument('audit_logs', newEntry.id, newEntry).catch(() => {});
  };

  const dispatchNotification = (
    type: CampusNotification['type'],
    title: string,
    message: string,
    targetRole: UserRole | 'All' = 'All',
    actionTab?: NavigationTab,
    relatedId?: string
  ) => {
    const newNotification: CampusNotification = {
      id: `ntf-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      title,
      message,
      timestamp: 'Just now',
      read: false,
      targetRole,
      actionTab,
      relatedId,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  // Rule-based recurring issue detection: scans complaints for 3+ complaints of same category in same hostel
  const recurringAlerts: RecurringAlert[] = React.useMemo(() => {
    const counts: Record<string, { category: string; hostel: string; count: number }> = {};
    complaints.forEach((c) => {
      const key = `${c.category}_${c.hostel}`;
      if (!counts[key]) {
        counts[key] = { category: c.category, hostel: c.hostel, count: 0 };
      }
      counts[key].count += 1;
    });

    const alerts: RecurringAlert[] = [];
    Object.entries(counts).forEach(([key, val]) => {
      if (val.count >= 2) {
        alerts.push({
          id: `alert-${key}`,
          category: val.category,
          hostel: val.hostel,
          count: val.count,
          message: `${val.count} ${val.category.toLowerCase()} issues reported in ${val.hostel} in recent cycles.`,
          recommendedAction: `Inspect ${val.hostel} ${val.category.toLowerCase()} main manifold and riser pipeline.`,
          detectedAt: 'Live Automated Analysis',
        });
      }
    });
    return alerts;
  }, [complaints]);

  // Complaints CRUD
  const createComplaint = (data: Omit<Complaint, 'id' | 'createdAt' | 'status' | 'history' | 'aiRouting'>) => {
    const highestId = complaints.reduce((max, c) => {
      const num = parseInt(c.id.replace('CMP-', ''), 10);
      return !isNaN(num) && num > max ? num : max;
    }, 1024);
    const newId = `CMP-${highestId + 1}`;

    const aiRouting = classifyComplaintWithAI(data.title, data.description);

    const newComplaint: Complaint = {
      ...data,
      id: newId,
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Submitted',
      aiRouting,
      assignedStaff: aiRouting.assignedTeam.includes('Rajesh Verma') ? 'Rajesh Verma' : 'Facilities Maintenance Desk',
      assignedStaffRole: 'Assigned via AI Triage',
      history: [
        {
          date: 'Just now',
          action: `Complaint ticket submitted by ${data.studentName}`,
          actor: `${data.studentName} (Student)`,
        },
        {
          date: 'Just now',
          action: `AI routed to ${aiRouting.department} [Priority: ${aiRouting.priority}]`,
          actor: 'Apna Campus AI Intelligence',
        },
      ],
    };

    setComplaints((prev) => [newComplaint, ...prev]);

    // Dispatch notification to staff
    dispatchNotification(
      'complaint',
      `New Work Order: ${newId}`,
      `${data.title} reported in ${data.hostel} (${data.room}). Priority: ${aiRouting.priority}`,
      'Staff',
      'Complaints',
      newId
    );

    // Audit log
    addAuditLog(data.studentName, 'Student', 'Created Ticket', `Filed ${newId}: ${data.title} (${data.hostel})`);

    // Synchronize to Cloud Firestore & backend REST API
    setFirestoreDocument('complaints', newId, newComplaint).catch(() => {});
    CampusAPI.createComplaint(newComplaint).catch(() => {});

    return newId;
  };

  const updateComplaintStatus = (id: string, newStatus: Complaint['status'], notes?: string, photo?: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updatedHistory = [
            ...c.history,
            {
              date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              action: `Status updated to ${newStatus}${notes ? ` - "${notes}"` : ''}`,
              actor: 'Rajesh Verma (Staff)',
            },
          ];

          return {
            ...c,
            status: newStatus,
            staffNotes: notes || c.staffNotes,
            resolutionPhoto: photo || c.resolutionPhoto,
            resolvedAt: newStatus === 'Resolved' ? new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : c.resolvedAt,
            history: updatedHistory,
          };
        }
        return c;
      })
    );

    const targetComplaint = complaints.find((c) => c.id === id);
    const title = targetComplaint?.title || 'Your complaint';

    if (newStatus === 'Resolved') {
      dispatchNotification(
        'complaint',
        `Complaint ${id} Marked Resolved`,
        `Staff Rajesh Verma has marked "${title}" as resolved. Please test and confirm resolution.`,
        'Student',
        'Complaints',
        id
      );
    } else if (newStatus === 'In Progress') {
      dispatchNotification(
        'complaint',
        `Work In Progress on ${id}`,
        `Staff has begun on-site work for "${title}".`,
        'Student',
        'Complaints',
        id
      );
    }

    addAuditLog('Rajesh Verma', 'Staff', 'Updated Ticket Status', `${id} status changed to ${newStatus}`);
    updateFirestoreDocument('complaints', id, {
      status: newStatus,
      staffNotes: notes || '',
      ...(photo ? { resolutionPhoto: photo } : {}),
      ...(newStatus === 'Resolved' ? { resolvedAt: new Date().toISOString() } : {}),
    }).catch(() => {});
    CampusAPI.updateComplaintStatus(id, newStatus, notes, photo).catch(() => {});
  };

  const confirmComplaintResolution = (id: string, rating: number, feedback?: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: 'Closed',
            studentRating: rating,
            studentFeedback: feedback || '',
            closedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            history: [
              ...c.history,
              {
                date: 'Just now',
                action: `Student confirmed resolution and awarded ${rating} stars rating${feedback ? `: "${feedback}"` : ''}`,
                actor: `${c.studentName} (Student)`,
              },
            ],
          };
        }
        return c;
      })
    );

    dispatchNotification(
      'complaint',
      `Ticket ${id} Closed & Confirmed`,
      `Student confirmed resolution with ${rating}-star satisfaction.`,
      'Staff',
      'Complaints',
      id
    );

    addAuditLog('Manoj Kumar Jena', 'Student', 'Confirmed Resolution', `Closed ${id} with ${rating} stars`);
    updateFirestoreDocument('complaints', id, {
      status: 'Closed',
      studentRating: rating,
      studentFeedback: feedback || '',
      closedAt: new Date().toISOString(),
    }).catch(() => {});
    CampusAPI.confirmComplaintResolution(id, rating, feedback).catch(() => {});
  };

  const reassignComplaint = (id: string, staffName: string, priority: 'High' | 'Medium' | 'Low') => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            assignedStaff: staffName,
            priority,
            status: 'Assigned',
            history: [
              ...c.history,
              {
                date: 'Just now',
                action: `Reassigned to ${staffName} by Administration (Priority: ${priority})`,
                actor: 'Admin Desk',
              },
            ],
          };
        }
        return c;
      })
    );

    addAuditLog('Dr. K. Venkataraman', 'Admin', 'Reassigned Ticket', `${id} reassigned to ${staffName} [Priority: ${priority}]`);
    updateFirestoreDocument('complaints', id, {
      assignedStaff: staffName,
      priority,
      status: 'Assigned',
    }).catch(() => {});
    CampusAPI.reassignComplaint(id, staffName, priority).catch(() => {});
  };

  // Certificate Requests CRUD
  const createCertificateRequest = (data: Omit<CertificateRequest, 'id' | 'createdAt' | 'status' | 'verificationCode'>) => {
    const highestId = certificateRequests.reduce((max, r) => {
      const num = parseInt(r.id.replace('REQ-', ''), 10);
      return !isNaN(num) && num > max ? num : max;
    }, 1003);
    const newId = `REQ-${highestId + 1}`;

    const newRequest: CertificateRequest = {
      ...data,
      id: newId,
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Submitted',
    };

    setCertificateRequests((prev) => [newRequest, ...prev]);

    dispatchNotification(
      'certificate',
      `New Certificate Request (${newId})`,
      `${data.studentName} (${data.rollNumber}) applied for ${data.type}. Urgency: ${data.urgency}`,
      'Admin',
      'Requests',
      newId
    );

    addAuditLog(data.studentName, 'Student', 'Requested Certificate', `Applied for ${data.type} (${newId})`);
    setFirestoreDocument('requests', newId, newRequest).catch(() => {});
    CampusAPI.createRequest(newRequest).catch(() => {});
    return newId;
  };

  const reviewCertificateRequest = (id: string, status: 'Approved' | 'Rejected', approverName: string, reason?: string) => {
    const verificationCode = `CERT-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(Math.random() * 9000 + 1000)}`;

    setCertificateRequests((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            status,
            approvedBy: approverName,
            approvedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            verificationCode: status === 'Approved' ? verificationCode : undefined,
            rejectionReason: reason,
          };
        }
        return r;
      })
    );

    const targetReq = certificateRequests.find((r) => r.id === id);
    if (status === 'Approved') {
      dispatchNotification(
        'certificate',
        `${targetReq?.type || 'Certificate'} Approved!`,
        `Your certificate has been digitally signed by ${approverName}. Digital stamp ref: ${verificationCode}. Ready for download.`,
        'Student',
        'Requests',
        id
      );
    } else {
      dispatchNotification(
        'certificate',
        `${targetReq?.type || 'Certificate'} Request Declined`,
        `Reason: ${reason || 'Incomplete documentation'}. Please update and resubmit.`,
        'Student',
        'Requests',
        id
      );
    }

    addAuditLog(approverName, 'Admin', `${status} Certificate`, `${status} ${id} for ${targetReq?.studentName}`);
    updateFirestoreDocument('requests', id, {
      status,
      approvedBy: approverName,
      approvedAt: new Date().toISOString(),
      ...(status === 'Approved' ? { verificationCode } : { rejectionReason: reason || '' }),
    }).catch(() => {});
    CampusAPI.reviewRequest(id, status, reason).catch(() => {});
  };

  // Gate Passes CRUD
  const applyGatePass = (data: Omit<GatePass, 'id' | 'status' | 'qrPayload' | 'approvedBy' | 'approvedAt'>) => {
    const count = gatePasses.length + 1;
    const newId = `GP-2026-${count.toString().padStart(3, '0')}`;

    const newPass: GatePass = {
      ...data,
      id: newId,
      status: 'Pending',
      qrPayload: `CAMPUS360-${newId}|${data.studentRoll}|${data.studentName}|PENDING`,
    };

    setGatePasses((prev) => [newPass, ...prev]);

    dispatchNotification(
      'gatepass',
      `New Gate Pass Application (${newId})`,
      `${data.studentName} requested outing to ${data.destination}. Return: ${data.expectedReturnTime}`,
      'Warden',
      'Gate Pass',
      newId
    );

    addAuditLog(data.studentName, 'Student', 'Applied Gate Pass', `${newId} destination: ${data.destination}`);
    setFirestoreDocument('gate_passes', newId, newPass).catch(() => {});
    CampusAPI.applyGatePass(newPass).catch(() => {});
    return newId;
  };

  const reviewGatePass = (id: string, status: 'Approved' | 'Rejected', wardenName: string, reason?: string) => {
    setGatePasses((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const qrPayload = `CAMPUS360-${id}|${p.studentRoll}|${p.studentName.replace(/\s+/g, '_')}|${status.toUpperCase()}|VALID_UNTIL_${p.expectedReturnTime}|BY_${wardenName.replace(/\s+/g, '_')}`;
          return {
            ...p,
            status,
            approvedBy: wardenName,
            approvedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            rejectionReason: reason,
            qrPayload,
          };
        }
        return p;
      })
    );

    if (status === 'Approved') {
      dispatchNotification(
        'gatepass',
        `Gate Pass ${id} Approved`,
        `Warden ${wardenName} has approved your outing pass. Present your QR code at the campus gate.`,
        'Student',
        'Gate Pass',
        id
      );
    } else {
      dispatchNotification(
        'gatepass',
        `Gate Pass ${id} Rejected`,
        `Application rejected by Warden. Reason: ${reason || 'Hostel policy restrictions'}.`,
        'Student',
        'Gate Pass',
        id
      );
    }

    addAuditLog(wardenName, 'Warden', `${status} Gate Pass`, `${status} pass ${id}`);
    updateFirestoreDocument('gate_passes', id, {
      status,
      approvedBy: wardenName,
      approvedAt: new Date().toISOString(),
      rejectionReason: reason || '',
    }).catch(() => {});
    CampusAPI.reviewGatePass(id, status, reason).catch(() => {});
  };

  const verifyGatePassCode = (query: string): { valid: boolean; pass?: GatePass; message: string } => {
    const cleanQuery = query.trim().toUpperCase();
    const pass = gatePasses.find((p) => p.id.toUpperCase() === cleanQuery || p.qrPayload.toUpperCase().includes(cleanQuery));

    if (!pass) {
      return { valid: false, message: `Gate Pass ID "${query}" not found in Apna Campus registry.` };
    }

    if (pass.status === 'Approved') {
      // Mark verified
      setGatePasses((prev) =>
        prev.map((p) => {
          if (p.id === pass.id) {
            return {
              ...p,
              verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' at Main Gate',
              verifiedBy: 'Security Station 1',
            };
          }
          return p;
        })
      );
      addAuditLog('Security Guard', 'Security', 'Verified Gate Pass', `Scanned & validated ${pass.id} for ${pass.studentName}`);
      return { valid: true, pass, message: `VERIFIED & VALID: Gate pass ${pass.id} is approved. Clearance granted for ${pass.studentName}.` };
    }

    return { valid: false, pass, message: `INVALID / NOT CLEARED: Gate pass is currently "${pass.status}". Exit access denied.` };
  };

  // Notices CRUD
  const createNotice = (data: Omit<CampusNotice, 'id' | 'publishDate' | 'isRead'>) => {
    const newId = `not-${Date.now()}`;
    const newNotice: CampusNotice = {
      ...data,
      id: newId,
      publishDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      isRead: false,
    };

    setNotices((prev) => [newNotice, ...prev]);

    dispatchNotification(
      'notice',
      `New Notice: ${data.title}`,
      `Target: ${data.targetAudience} • Posted by ${data.postedBy}`,
      data.targetAudience === 'Faculty' ? 'Faculty' : 'Student',
      'Notices',
      newId
    );

    addAuditLog(data.postedBy, 'Admin/Staff', 'Published Notice', `Title: "${data.title}" (Audience: ${data.targetAudience})`);
    setFirestoreDocument('notices', newId, newNotice).catch(() => {});
    CampusAPI.createNotice(newNotice).catch(() => {});
    return newId;
  };

  const markNoticeAsRead = (id: string) => {
    setNotices((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    updateFirestoreDocument('notices', id, { isRead: true }).catch(() => {});
    CampusAPI.markNoticeRead(id).catch(() => {});
  };

  const completeNoticeAction = (id: string) => {
    setNotices((prev) => prev.map((n) => (n.id === id ? { ...n, actionCompleted: true, isRead: true } : n)));
    updateFirestoreDocument('notices', id, { actionCompleted: true, isRead: true }).catch(() => {});
    dispatchNotification('notice', 'Action Completed', 'Your notice compliance action has been recorded in the Dean registry.', 'Student', 'Notices');
    addAuditLog('Manoj Kumar Jena', 'Student', 'Completed Notice Action', `Action verified for notice ${id}`);
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    updateFirestoreDocument('notifications', id, { read: true }).catch(() => {});
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Attendance
  const markClassAttendance = (courseCode: string, studentRoll: string, isPresent: boolean) => {
    let updatedRec: AttendanceRecord | undefined;
    setAttendanceRecords((prev) =>
      prev.map((rec) => {
        if (rec.courseCode === courseCode) {
          const attended = isPresent ? rec.attendedClasses + 1 : rec.attendedClasses;
          const total = rec.totalClasses + 1;
          const pct = Math.round((attended / total) * 1000) / 10;
          updatedRec = {
            ...rec,
            attendedClasses: attended,
            totalClasses: total,
            percentage: pct,
            thresholdWarning: pct < 75,
          };
          return updatedRec;
        }
        return rec;
      })
    );

    dispatchNotification(
      'attendance' as any,
      `Attendance Updated: ${courseCode}`,
      `Faculty marked you ${isPresent ? 'PRESENT' : 'ABSENT'} for today's lecture.`,
      'Student',
      'Attendance'
    );

    addAuditLog('Dr. A. Singh', 'Faculty', 'Marked Attendance', `Student ${studentRoll} marked ${isPresent ? 'Present' : 'Absent'} for ${courseCode}`);
    if (updatedRec) {
      setFirestoreDocument('attendance', courseCode, updatedRec).catch(() => {});
    }
    CampusAPI.markAttendance(courseCode, studentRoll, isPresent).catch(() => {});
  };

  const overallAttendancePercentage = React.useMemo(() => {
    const totalAttended = attendanceRecords.reduce((acc, c) => acc + c.attendedClasses, 0);
    const totalHeld = attendanceRecords.reduce((acc, c) => acc + c.totalClasses, 0);
    return totalHeld > 0 ? Math.round((totalAttended / totalHeld) * 1000) / 10 : 85.0;
  }, [attendanceRecords]);

  // Timetable Class Cancellation
  const cancelClass = (courseCode: string, facultyName: string, reason?: string) => {
    setCancelledClasses((prev) => [...prev, courseCode]);

    dispatchNotification(
      'class_cancellation',
      `Class Cancelled: ${courseCode}`,
      `Today's ${courseCode} class by ${facultyName} has been cancelled.${reason ? ` Reason: ${reason}` : ''}`,
      'All',
      'Timetable'
    );

    addAuditLog(facultyName, 'Faculty', 'Cancelled Class', `${courseCode} class cancelled for today`);
  };

  // Mess
  const submitMealFeedback = (mealType: MessFeedback['mealType'], rating: number, comment: string, studentName: string) => {
    const newFeedback: MessFeedback = {
      id: `mf-${Date.now()}`,
      day: new Date().toLocaleDateString('en-GB', { weekday: 'long' }),
      mealType,
      studentName,
      rating,
      comment,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    setMessFeedback((prev) => [newFeedback, ...prev]);
    dispatchNotification('notice', 'Mess Feedback Submitted', `Thank you for rating today's ${mealType}. Rating: ${rating}/5`, 'Student', 'Mess');
    addAuditLog(studentName, 'Student', 'Submitted Mess Feedback', `Rated ${mealType} ${rating}/5`);
    setFirestoreDocument('mess_feedback', newFeedback.id, newFeedback).catch(() => {});
    CampusAPI.submitMessFeedback(mealType, rating, comment).catch(() => {});
  };

  const averageMessRating = React.useMemo(() => {
    if (messFeedback.length === 0) return 4.0;
    const sum = messFeedback.reduce((acc, m) => acc + m.rating, 0);
    return Math.round((sum / messFeedback.length) * 10) / 10;
  }, [messFeedback]);

  // Fee Payment Simulator
  const payFees = (amount: number, method: string) => {
    const txnId = `TXN-2026-${Math.floor(Math.random() * 90000 + 10000)}`;
    const receiptNo = `RCP-2026-${Math.floor(Math.random() * 9000 + 1000)}`;

    setFeeDetails((prev) => {
      const newPaid = prev.paidAmount + amount;
      const newPending = Math.max(0, prev.totalFee - newPaid);
      const updated = {
        ...prev,
        paidAmount: newPaid,
        pendingAmount: newPending,
        transactions: [
          {
            id: txnId,
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            amount,
            method,
            status: 'Success',
            receiptNo,
          },
          ...prev.transactions,
        ],
      };
      setFirestoreDocument('settings', 'fee_details', updated).catch(() => {});
      return updated;
    });

    dispatchNotification(
      'fee',
      `Fee Payment Received (₹${amount.toLocaleString()})`,
      `Transaction ${txnId} successful via ${method}. Receipt generated. Pending balance: ₹0.`,
      'Student',
      'Fees & Dues'
    );

    addAuditLog('Manoj Kumar Jena', 'Student', 'Paid Tuition Fees', `Paid ₹${amount.toLocaleString()} via ${method} (Txn: ${txnId})`);
    CampusAPI.payFees(amount, method).catch(() => {});
    return { success: true, txnId };
  };

  // Reset to default demo data
  const resetToDefaultData = () => {
    setComplaints(INITIAL_COMPLAINTS);
    setCertificateRequests(INITIAL_REQUESTS);
    setGatePasses(INITIAL_GATE_PASSES);
    setNotices(INITIAL_NOTICES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAttendanceRecords(INITIAL_ATTENDANCE);
    setCancelledClasses([]);
    setMessFeedback(INITIAL_MESS_FEEDBACK);
    setFeeDetails(INITIAL_FEES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    localStorage.clear();
  };

  return (
    <CampusDataContext.Provider
      value={{
        complaints,
        createComplaint,
        updateComplaintStatus,
        confirmComplaintResolution,
        reassignComplaint,
        recurringAlerts,

        certificateRequests,
        createCertificateRequest,
        reviewCertificateRequest,

        gatePasses,
        applyGatePass,
        reviewGatePass,
        verifyGatePassCode,

        notices,
        createNotice,
        markNoticeAsRead,
        completeNoticeAction,

        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotification,
        unreadNotificationsCount,
        dispatchNotification,

        attendanceRecords,
        markClassAttendance,
        overallAttendancePercentage,

        cancelledClasses,
        cancelClass,

        messFeedback,
        submitMealFeedback,
        averageMessRating,

        feeDetails,
        payFees,

        auditLogs,
        addAuditLog,

        resetToDefaultData,
      }}
    >
      {children}
    </CampusDataContext.Provider>
  );
};

export const useCampusData = () => {
  const context = useContext(CampusDataContext);
  if (!context) {
    throw new Error('useCampusData must be used within a CampusDataProvider');
  }
  return context;
};
