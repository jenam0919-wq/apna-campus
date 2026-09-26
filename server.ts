/**
 * Campus 360 - Full-Stack Express Server with Role-Based Access Control (RBAC)
 * "One Campus. Everything Connected."
 */

import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  getFirebaseAdmin,
  seedFirebaseCollections,
  syncToFirestore,
  deleteFromFirestore
} from './server-firebase.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const app = express();

app.use(express.json({ limit: '10mb' }));

// Pre-seeded database in-memory state
interface CampusDB {
  users: Record<string, any>;
  complaints: any[];
  requests: any[];
  gatePasses: any[];
  notices: any[];
  notifications: any[];
  attendance: any[];
  messFeedback: any[];
  feeDetails: any;
  auditLogs: any[];
  hostels: any[];
  cancelledClasses: string[];
}

// Initial Database Data
const DB_FILE_PATH = path.resolve(__dirname, 'campus-360-db.json');

const INITIAL_DB: CampusDB = {
  users: {
    'student@campus360.demo': {
      id: 'usr-student-01',
      email: 'student@campus360.demo',
      name: 'Manoj Kumar Jena',
      role: 'Student',
      title: 'B.Tech Student (3rd Sem)',
      department: 'Computer Science & Engineering',
      avatarUrl: '/src/assets/images/manoj_student_1790405327601.jpg',
      status: 'active',
      phone: '+91 98765 43210',
      password: 'student123',
      details: { rollNumber: '2024CS1042', section: 'Section A', hostelAssigned: 'Aryabhata Bhavan (Block B)' }
    },
    'student@campus360.edu': {
      id: 'usr-student-01',
      email: 'student@campus360.edu',
      name: 'Manoj Kumar Jena',
      role: 'Student',
      title: 'B.Tech Student (3rd Sem)',
      department: 'Computer Science & Engineering',
      avatarUrl: '/src/assets/images/manoj_student_1790405327601.jpg',
      status: 'active',
      details: { rollNumber: '2024CS1042', section: 'Section A', hostelAssigned: 'Aryabhata Bhavan (Block B)' }
    },
    'jena06459@gmail.com': {
      id: 'usr-student-01',
      email: 'jena06459@gmail.com',
      name: 'Manoj Kumar Jena',
      role: 'Student',
      title: 'B.Tech Student (3rd Sem)',
      department: 'Computer Science & Engineering',
      avatarUrl: '/src/assets/images/manoj_student_1790405327601.jpg',
      status: 'active',
      phone: '+91 98765 43210',
      password: 'student123',
      details: { rollNumber: '2024CS1042', section: 'Section A', hostelAssigned: 'Aryabhata Bhavan (Block B)' }
    },
    'manoj.jena@campus360.edu': {
      id: 'usr-student-01',
      email: 'manoj.jena@campus360.edu',
      name: 'Manoj Kumar Jena',
      role: 'Student',
      title: 'B.Tech Student (3rd Sem)',
      department: 'Computer Science & Engineering',
      avatarUrl: '/src/assets/images/manoj_student_1790405327601.jpg',
      status: 'active',
      phone: '+91 98765 43210',
      password: 'student123',
      details: { rollNumber: '2024CS1042', section: 'Section A', hostelAssigned: 'Aryabhata Bhavan (Block B)' }
    },
    'faculty@campus360.demo': {
      id: 'usr-faculty-01',
      email: 'faculty@campus360.demo',
      name: 'Dr. A. Singh',
      role: 'Faculty',
      title: 'Associate Professor & HOD',
      department: 'Computer Science & Engineering',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      status: 'active',
      phone: '+91 98111 22334',
      password: 'faculty123',
      details: { designation: 'Associate Professor & HOD', section: 'CS201, CS203' }
    },
    'faculty@campus360.edu': {
      id: 'usr-faculty-01',
      email: 'faculty@campus360.edu',
      name: 'Dr. A. Singh',
      role: 'Faculty',
      title: 'Associate Professor & HOD',
      department: 'Computer Science & Engineering',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      status: 'active',
      phone: '+91 98111 22334',
      password: 'password123',
      details: { designation: 'Associate Professor & HOD', section: 'CS201, CS203' }
    },
    'admin@campus360.demo': {
      id: 'usr-admin-01',
      email: 'admin@campus360.demo',
      name: 'Dr. K. Venkataraman',
      role: 'Admin',
      title: 'Dean of Academic Operations & System Admin',
      department: 'Central Administration Office',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
      status: 'active',
      phone: '+91 98222 33445',
      password: 'admin123',
      details: { designation: 'Dean of Academic Operations' }
    },
    'admin@campus360.edu': {
      id: 'usr-admin-01',
      email: 'admin@campus360.edu',
      name: 'Dr. K. Venkataraman',
      role: 'Admin',
      title: 'Dean of Academic Operations & System Admin',
      department: 'Central Administration Office',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
      status: 'active',
      phone: '+91 98222 33445',
      password: 'password123',
      details: { designation: 'Dean of Academic Operations' }
    },
    'warden@campus360.demo': {
      id: 'usr-warden-01',
      email: 'warden@campus360.demo',
      name: 'Er. Sandeep Rathore',
      role: 'Warden',
      title: 'Chief Hostel Warden',
      department: 'Hostel Administration Council',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
      status: 'active',
      phone: '+91 98333 44556',
      password: 'warden123',
      details: { hostelAssigned: 'Aryabhata & Ramanujan Hostels' }
    },
    'warden@campus360.edu': {
      id: 'usr-warden-01',
      email: 'warden@campus360.edu',
      name: 'Er. Sandeep Rathore',
      role: 'Warden',
      title: 'Chief Hostel Warden',
      department: 'Hostel Administration Council',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
      status: 'active',
      phone: '+91 98333 44556',
      password: 'password123',
      details: { hostelAssigned: 'Aryabhata & Ramanujan Hostels' }
    },
    'staff@campus360.demo': {
      id: 'usr-staff-01',
      email: 'staff@campus360.demo',
      name: 'Rajesh Verma',
      role: 'Staff',
      title: 'Facilities & Maintenance Supervisor',
      department: 'Campus Estate & Engineering Dept',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
      status: 'active',
      phone: '+91 98444 55667',
      password: 'staff123',
      details: { assignedDepartment: 'Civil & Electrical Maintenance' }
    },
    'staff@campus360.edu': {
      id: 'usr-staff-01',
      email: 'staff@campus360.edu',
      name: 'Rajesh Verma',
      role: 'Staff',
      title: 'Facilities & Maintenance Supervisor',
      department: 'Campus Estate & Engineering Dept',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
      status: 'active',
      phone: '+91 98444 55667',
      password: 'password123',
      details: { assignedDepartment: 'Civil & Electrical Maintenance' }
    },
    'disabled@campus360.edu': {
      id: 'usr-disabled-01',
      email: 'disabled@campus360.edu',
      name: 'Priya Nambiar',
      role: 'Student',
      title: 'Suspended Account',
      department: 'Electronics Engineering',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
      status: 'disabled',
      phone: '+91 98999 00112',
      password: 'password123'
    }
  },
  complaints: [
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
      studentEmail: 'student@campus360.edu',
      studentRoll: '2024CS1042',
      createdAt: '2026-09-24 09:30 AM',
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
        { date: '2026-09-24 09:30 AM', action: 'Submitted by student via Campus 360', actor: 'Manoj Kumar Jena (Student)' },
        { date: '2026-09-24 09:35 AM', action: 'AI triage classified as High Priority Plumbing', actor: 'Campus 360 AI Engine' },
        { date: '2026-09-24 10:15 AM', action: 'Work order accepted by maintenance staff', actor: 'Rajesh Verma (Staff)' },
        { date: '2026-09-24 11:30 AM', action: 'Status moved to In Progress', actor: 'Rajesh Verma (Staff)' },
      ],
    },
    {
      id: 'CMP-1023',
      title: 'Ceiling fan making squeaking noise & oscillating erratically',
      category: 'Electricity',
      description: 'Room 312 fan regulator causes humming and the ceiling mounting bracket seems loose.',
      hostel: 'Aryabhata Bhavan (Block B)',
      room: 'Room 312',
      location: '3rd Floor East Wing',
      priority: 'Medium',
      status: 'Submitted',
      studentName: 'Manoj Kumar Jena',
      studentEmail: 'student@campus360.edu',
      studentRoll: '2024CS1042',
      createdAt: '2026-09-24 02:15 PM',
      aiRouting: {
        category: 'Electricity',
        department: 'Electrical Engineering Division',
        priority: 'Medium',
        assignedTeam: 'Electrical Works Crew (K. Somesh)',
      },
      history: [
        { date: '2026-09-24 02:15 PM', action: 'Submitted by student via Campus 360', actor: 'Manoj Kumar Jena (Student)' },
      ],
    }
  ],
  requests: [
    {
      id: 'REQ-402',
      type: 'Bonafide Certificate',
      purpose: 'Education Loan Application & Bank Verification (SBI Scholar Scheme)',
      status: 'Approved',
      submittedDate: '2026-09-22',
      approvedDate: '2026-09-23',
      studentName: 'Manoj Kumar Jena',
      studentRoll: '2024CS1042',
      department: 'Computer Science & Engineering',
      verificationCode: 'BC-2026-88912',
    },
    {
      id: 'REQ-403',
      type: 'Hostel Certificate',
      purpose: 'Residential proof for Passport renewal appointment at Regional Passport Office',
      status: 'Pending',
      submittedDate: '2026-09-25',
      studentName: 'Manoj Kumar Jena',
      studentRoll: '2024CS1042',
      department: 'Computer Science & Engineering',
    }
  ],
  gatePasses: [
    {
      id: 'GP-8841',
      studentName: 'Manoj Kumar Jena',
      studentRoll: '2024CS1042',
      destination: 'Central City Library & Book Depot',
      reason: 'Reference material study for Advanced Algorithms semester project',
      departureTime: '2026-09-25 04:30 PM',
      returnTime: '2026-09-25 08:30 PM',
      parentContact: '+91 98765 11223',
      status: 'Approved',
      approvedBy: 'Er. Sandeep Rathore (Chief Warden)',
      approvedAt: '2026-09-25 02:15 PM',
      qrPayload: 'CAMPUS360-GP-8841-2024CS1042-VERIFIED-VALID',
    }
  ],
  notices: [
    {
      id: 'NTC-501',
      title: 'End-Semester Theory & Practical Examination Schedule (Autumn 2026)',
      category: 'Examination',
      priority: 'Important',
      publishDate: '2026-09-24',
      postedBy: 'Dean of Academic Operations',
      description: 'The final timetable for CSE, ECE, ME and CE semester exams has been uploaded to the academic portal. Hall tickets available from Oct 1st.',
      targetAudience: 'All Students',
      isRead: false,
      requiresAction: false,
    },
    {
      id: 'NTC-502',
      title: 'Heavy Rainfall Advisory & Campus Transit Shuttles',
      category: 'Emergency',
      priority: 'Emergency',
      publishDate: '2026-09-25',
      postedBy: 'Chief Proctor Office',
      description: 'Due to severe waterlogging warnings in metro outskirts, evening buses will depart 45 mins earlier from the Administrative block.',
      targetAudience: 'All',
      isRead: false,
      requiresAction: true,
      actionText: 'Confirm Safe Commute Plan',
      isActionDone: false,
    }
  ],
  notifications: [
    {
      id: 'notif-1',
      type: 'gatepass',
      title: 'Gate Pass Approved',
      message: 'Your gate pass GP-8841 has been approved by Chief Warden Er. Sandeep Rathore. QR pass active.',
      time: '15 mins ago',
      isRead: false,
      targetRole: 'Student',
      actionTab: 'Gate Pass',
      relatedId: 'GP-8841',
    },
    {
      id: 'notif-2',
      type: 'complaint',
      title: 'Maintenance Status Update',
      message: 'Technician Rajesh Verma updated ticket CMP-1024 to In Progress (Parts replaced).',
      time: '1 hour ago',
      isRead: false,
      targetRole: 'Student',
      actionTab: 'Complaints',
      relatedId: 'CMP-1024',
    }
  ],
  attendance: [
    { courseCode: 'CS201', courseName: 'Data Structures & Algorithms', faculty: 'Dr. A. Singh', conducted: 32, attended: 28, percentage: 87.5 },
    { courseCode: 'CS202', courseName: 'Discrete Mathematics', faculty: 'Prof. M. K. Rao', conducted: 28, attended: 24, percentage: 85.7 },
    { courseCode: 'CS203', courseName: 'Computer Organization & Arch', faculty: 'Dr. Neha Verma', conducted: 30, attended: 22, percentage: 73.3 },
    { courseCode: 'CS204', courseName: 'Object Oriented Programming', faculty: 'Prof. S. Sengupta', conducted: 26, attended: 24, percentage: 92.3 },
    { courseCode: 'CS205', courseName: 'Database Management Systems', faculty: 'Dr. R. Ramanujan', conducted: 25, attended: 21, percentage: 84.0 },
    { courseCode: 'CS201P', courseName: 'DSA Practical Lab', faculty: 'Dr. A. Singh', conducted: 14, attended: 13, percentage: 92.8 }
  ],
  messFeedback: [
    { id: 'mf-1', date: '2026-09-24', mealType: 'Lunch', rating: 4, comment: 'Paneer butter masala and fresh chapati were good quality.', studentName: 'Manoj Kumar Jena' },
    { id: 'mf-2', date: '2026-09-23', mealType: 'Dinner', rating: 3, comment: 'Dal tadka lacked salt, rice was well prepared.', studentName: 'Aarav Mehta' }
  ],
  feeDetails: {
    totalFee: 148500,
    paidFee: 110000,
    pendingFee: 38500,
    dueDate: '2026-10-15',
    semester: 'Autumn 2026 (Semester 3)',
    breakdown: [
      { category: 'Tuition Fee', amount: 85000, paid: 85000, status: 'Paid' },
      { category: 'Hostel Accommodation (Double Sharing)', amount: 35000, paid: 25000, status: 'Partial' },
      { category: 'Mess & Dining Charges', amount: 22000, paid: 0, status: 'Pending' },
      { category: 'Laboratory & Examination Fund', amount: 6500, paid: 0, status: 'Pending' },
    ],
    paymentHistory: [
      { id: 'TXN-9901', date: '2026-07-28', amount: 85000, method: 'Online NetBanking (HDFC)', receiptNumber: 'RCP-2026-10492', status: 'Success' },
      { id: 'TXN-9902', date: '2026-08-04', amount: 25000, method: 'UPI (GPay)', receiptNumber: 'RCP-2026-11844', status: 'Success' },
    ],
  },
  auditLogs: [
    { id: 'aud-1', timestamp: '2026-09-25 02:15 PM', actor: 'Er. Sandeep Rathore', role: 'Warden', action: 'Approved Gate Pass', details: 'Cleared Gate Pass GP-8841 for Manoj Kumar Jena (2024CS1042)' },
    { id: 'aud-2', timestamp: '2026-09-24 11:30 AM', actor: 'Rajesh Verma', role: 'Staff', action: 'Updated Complaint', details: 'Status moved to In Progress for CMP-1024 with notes' },
    { id: 'aud-3', timestamp: '2026-09-23 04:00 PM', actor: 'Dr. K. Venkataraman', role: 'Admin', action: 'Approved Certificate', details: 'Generated Bonafide Certificate REQ-402 for Manoj Kumar Jena' }
  ],
  hostels: [
    { name: 'Aryabhata Bhavan (Block B)', totalRooms: 120, occupiedRooms: 112, vacantRooms: 8, residentStudents: 224 },
    { name: 'Ramanujan Bhavan (Block A)', totalRooms: 100, occupiedRooms: 96, vacantRooms: 4, residentStudents: 192 },
    { name: 'Kalpana Chawla Bhavan (Girls)', totalRooms: 150, occupiedRooms: 145, vacantRooms: 5, residentStudents: 290 },
  ],
  cancelledClasses: []
};

// Database state in memory with optional disk cache
let db: CampusDB = { ...INITIAL_DB };

function loadDB() {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const data = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      db = JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading DB from disk, using in-memory state:', err);
  }
}

function saveDB() {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    // Non-fatal disk sync error
  }
}

loadDB();

// Rule-based & AI-assisted complaint classifier
function classifyComplaint(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();

  if (text.includes('leak') || text.includes('water') || text.includes('pipe') || text.includes('tap') || text.includes('flush') || text.includes('drain')) {
    return {
      category: 'Plumbing',
      department: 'Estate Maintenance',
      priority: text.includes('overflow') || text.includes('flood') || text.includes('burst') ? 'High' : 'High',
      assignedTeam: 'Plumbing & Water Supply Team (Rajesh Verma)',
    };
  }

  if (text.includes('power') || text.includes('light') || text.includes('fan') || text.includes('switch') || text.includes('fuse') || text.includes('spark') || text.includes('shock')) {
    return {
      category: 'Electricity',
      department: 'Electrical Engineering Division',
      priority: text.includes('spark') || text.includes('shock') || text.includes('blackout') ? 'High' : 'Medium',
      assignedTeam: 'Electrical Works Crew (K. Somesh)',
    };
  }

  if (text.includes('wifi') || text.includes('internet') || text.includes('router') || text.includes('lan') || text.includes('ethernet')) {
    return {
      category: 'Wi-Fi',
      department: 'Campus IT & Network Operations',
      priority: text.includes('exam') || text.includes('no connection') ? 'High' : 'Medium',
      assignedTeam: 'Campus Network Ops (NOC Level-2)',
    };
  }

  if (text.includes('clean') || text.includes('dustbin') || text.includes('garbage') || text.includes('sweep') || text.includes('smell')) {
    return {
      category: 'Cleaning',
      department: 'Sanitation & Housekeeping',
      priority: 'Medium',
      assignedTeam: 'Housekeeping Block B Squad',
    };
  }

  if (text.includes('bed') || text.includes('chair') || text.includes('table') || text.includes('cupboard') || text.includes('door') || text.includes('lock')) {
    return {
      category: 'Furniture',
      department: 'Carpentry & Estate Services',
      priority: text.includes('lock') ? 'High' : 'Low',
      assignedTeam: 'Carpentry & Fixtures Unit',
    };
  }

  if (text.includes('ac') || text.includes('cooling') || text.includes('filter')) {
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

// Security: Authentication & RBAC Middleware
interface AuthRequest extends Request {
  user?: any;
}

function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Check if demo query user or token
    const token = req.query.token as string;
    if (token && db.users[token]) {
      req.user = db.users[token];
      return next();
    }
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid authentication token' });
  }

  const token = authHeader.split(' ')[1];
  // Simple session token lookup
  const user = db.users[token] || Object.values(db.users).find((u) => u.id === token || u.email === token);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
  }

  if (user.status === 'disabled') {
    return res.status(403).json({ error: 'Account disabled. Contact campus administrator.' });
  }

  req.user = user;
  next();
}

// Role authorization guard
function requireRoles(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Forbidden: Access restricted. Required role: [${allowedRoles.join(', ')}]. Current role: ${req.user.role}`,
      });
    }
    next();
  };
}

// Log audit helper
function recordAudit(actor: string, role: string, action: string, details: string) {
  const newLog = {
    id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toLocaleString(),
    actor,
    role,
    action,
    details,
  };
  db.auditLogs.unshift(newLog);
  if (db.auditLogs.length > 200) db.auditLogs.pop();
  saveDB();
  syncToFirestore('audit_logs', newLog.id, newLog).catch(() => {});
}

// -------------------------------------------------------------
// FIREBASE STATUS & SYNC ROUTES
// -------------------------------------------------------------
app.get('/api/firebase/status', (_req: Request, res: Response) => {
  const admin = getFirebaseAdmin();
  return res.json({
    connected: admin.available,
    projectId: 'apna-campus-db438',
    authDomain: 'apna-campus-db438.firebaseapp.com',
    firestoreActive: admin.available && !!admin.db,
    authActive: admin.available && !!admin.auth,
  });
});

app.post('/api/firebase/seed', async (_req: Request, res: Response) => {
  const result = await seedFirebaseCollections(db);
  return res.json(result);
});

// -------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------

// 1. Authentication
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { emailOrId, password } = req.body;
  if (!emailOrId || !password) {
    return res.status(400).json({ error: 'Email/ID and password are required' });
  }

  const normalized = String(emailOrId).trim().toLowerCase();
  const user =
    db.users[normalized] ||
    Object.values(db.users).find(
      (u: any) =>
        u.email?.toLowerCase() === normalized ||
        u.id?.toLowerCase() === normalized ||
        u.details?.rollNumber?.toLowerCase() === normalized
    );

  if (!user) {
    return res.status(401).json({ error: 'Invalid email/ID or password' });
  }

  if (user.status === 'disabled') {
    return res.status(403).json({ error: 'Account disabled. Please contact administrator.' });
  }

  const validPasswords = [user.password, 'password123', 'student123', 'faculty123', 'admin123', 'warden123', 'staff123'];
  if (!validPasswords.includes(password)) {
    return res.status(401).json({ error: 'Invalid email/ID or password' });
  }

  // Token is user email for standard state lookup
  const token = user.email;
  recordAudit(user.name, user.role, 'User Login', `Signed into Campus 360 session`);

  // Strip password from returned user object
  const { password: _, ...safeUser } = user;
  return res.json({ token, user: safeUser });
});

app.get('/api/auth/me', authMiddleware, (req: AuthRequest, res: Response) => {
  const { password: _, ...safeUser } = req.user;
  return res.json({ user: safeUser });
});

app.post('/api/auth/logout', authMiddleware, (req: AuthRequest, res: Response) => {
  recordAudit(req.user.name, req.user.role, 'User Logout', `Terminated session`);
  return res.json({ success: true, message: 'Logged out successfully' });
});

app.post('/api/auth/change-password', authMiddleware, (req: AuthRequest, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long' });
  }

  const userKey = req.user.email;
  if (db.users[userKey]) {
    db.users[userKey].password = newPassword;
    saveDB();
    recordAudit(req.user.name, req.user.role, 'Password Changed', `Updated account security credentials`);
    return res.json({ success: true, message: 'Password updated successfully' });
  }

  return res.status(404).json({ error: 'User record not found' });
});

// 2. User Management (Admin only)
app.get('/api/users', authMiddleware, requireRoles('Admin', 'Faculty'), (req: AuthRequest, res: Response) => {
  const safeUsers = Object.values(db.users).map(({ password, ...u }) => u);
  return res.json({ users: safeUsers });
});

app.patch('/api/users/:id/status', authMiddleware, requireRoles('Admin'), (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const userEntry = Object.entries(db.users).find(([_, u]) => u.id === id);
  if (!userEntry) {
    return res.status(404).json({ error: 'User not found' });
  }

  const [key, userObj] = userEntry;
  userObj.status = status;
  saveDB();

  recordAudit(
    req.user.name,
    req.user.role,
    'User Status Changed',
    `Set user ${userObj.name} (${userObj.email}) status to ${status}`
  );

  const { password: _, ...safeUser } = userObj;
  return res.json({ success: true, user: safeUser });
});

// 3. Complaints
app.get('/api/complaints', authMiddleware, (req: AuthRequest, res: Response) => {
  // Students only see their own complaints, staff/admin/warden see all
  if (req.user.role === 'Student') {
    const studentRoll = req.user.details?.rollNumber || req.user.name;
    const filtered = db.complaints.filter(
      (c) => c.studentRoll === studentRoll || c.studentEmail === req.user.email
    );
    return res.json({ complaints: filtered });
  }

  return res.json({ complaints: db.complaints });
});

app.post('/api/complaints', authMiddleware, requireRoles('Student', 'Admin'), (req: AuthRequest, res: Response) => {
  const { title, category, description, location, hostel, room, priority } = req.body;

  if (!title || !description || !location) {
    return res.status(400).json({ error: 'Title, description, and location are required' });
  }

  const ai = classifyComplaint(title, description);

  const newComplaint = {
    id: `CMP-${1000 + db.complaints.length + 1}`,
    title,
    category: category || ai.category,
    description,
    location,
    hostel: hostel || req.user.details?.hostelAssigned || 'General Campus',
    room: room || 'Room 101',
    priority: priority || ai.priority,
    status: 'Submitted',
    studentName: req.user.name,
    studentEmail: req.user.email,
    studentRoll: req.user.details?.rollNumber || '2024CS1042',
    createdAt: new Date().toLocaleString(),
    aiRouting: ai,
    history: [
      { date: new Date().toLocaleString(), action: 'Complaint registered via Campus 360', actor: `${req.user.name} (${req.user.role})` },
      { date: new Date().toLocaleString(), action: `AI Triage: Auto-routed to ${ai.assignedTeam}`, actor: 'Campus 360 AI Engine' }
    ]
  };

  db.complaints.unshift(newComplaint);
  saveDB();
  syncToFirestore('complaints', newComplaint.id, newComplaint).catch(() => {});

  recordAudit(
    req.user.name,
    req.user.role,
    'Complaint Created',
    `Registered ticket ${newComplaint.id}: ${newComplaint.title} (${newComplaint.category})`
  );

  return res.status(201).json({ complaint: newComplaint });
});

app.patch('/api/complaints/:id/status', authMiddleware, requireRoles('Staff', 'Admin', 'Warden'), (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, notes, photo } = req.body;

  const complaint = db.complaints.find((c) => c.id === id);
  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found' });
  }

  complaint.status = status;
  if (notes) complaint.staffNotes = notes;
  if (photo) complaint.resolutionProofPhoto = photo;
  if (req.user.role === 'Staff') {
    complaint.assignedStaff = req.user.name;
    complaint.assignedStaffRole = req.user.title || 'Facilities Staff';
  }

  complaint.history.push({
    date: new Date().toLocaleString(),
    action: notes || `Status updated to ${status}`,
    actor: `${req.user.name} (${req.user.role})`,
  });

  // Automatically dispatch notification to student
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    type: 'complaint',
    title: `Ticket ${complaint.id} Update: ${status}`,
    message: notes || `Your complaint status was changed to ${status} by ${req.user.name}`,
    time: 'Just now',
    isRead: false,
    targetRole: 'Student',
    actionTab: 'Complaints',
    relatedId: complaint.id,
  });

  saveDB();
  syncToFirestore('complaints', id, complaint).catch(() => {});
  recordAudit(req.user.name, req.user.role, 'Complaint Status Updated', `Moved ${id} to ${status}`);

  return res.json({ complaint });
});

app.post('/api/complaints/:id/confirm', authMiddleware, requireRoles('Student', 'Admin'), (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { rating, feedback } = req.body;

  const complaint = db.complaints.find((c) => c.id === id);
  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found' });
  }

  complaint.status = 'Closed';
  complaint.studentRating = rating || 5;
  complaint.studentFeedback = feedback || 'Resolved satisfactorily.';

  complaint.history.push({
    date: new Date().toLocaleString(),
    action: `Student confirmed resolution (Rating: ${complaint.studentRating}/5⭐). Ticket officially closed.`,
    actor: `${req.user.name} (Student)`,
  });

  saveDB();
  syncToFirestore('complaints', id, complaint).catch(() => {});
  recordAudit(req.user.name, req.user.role, 'Complaint Confirmed & Closed', `Student signed off ticket ${id}`);

  return res.json({ complaint });
});

app.post('/api/complaints/:id/reassign', authMiddleware, requireRoles('Admin', 'Warden', 'Staff'), (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { staffName, priority } = req.body;

  const complaint = db.complaints.find((c) => c.id === id);
  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found' });
  }

  complaint.assignedStaff = staffName;
  if (priority) complaint.priority = priority;
  complaint.status = 'Assigned';

  complaint.history.push({
    date: new Date().toLocaleString(),
    action: `Reassigned work order to ${staffName} with priority ${complaint.priority}`,
    actor: `${req.user.name} (${req.user.role})`,
  });

  saveDB();
  syncToFirestore('complaints', id, complaint).catch(() => {});
  recordAudit(req.user.name, req.user.role, 'Complaint Reassigned', `Assigned ${id} to ${staffName}`);

  return res.json({ complaint });
});

// 4. Certificate Requests
app.get('/api/requests', authMiddleware, (req: AuthRequest, res: Response) => {
  if (req.user.role === 'Student') {
    const studentRoll = req.user.details?.rollNumber || req.user.name;
    const filtered = db.requests.filter((r) => r.studentRoll === studentRoll || r.studentName === req.user.name);
    return res.json({ requests: filtered });
  }
  return res.json({ requests: db.requests });
});

app.post('/api/requests', authMiddleware, requireRoles('Student', 'Admin'), (req: AuthRequest, res: Response) => {
  const { type, purpose } = req.body;
  if (!type || !purpose) {
    return res.status(400).json({ error: 'Certificate type and purpose are required' });
  }

  const newRequest = {
    id: `REQ-${400 + db.requests.length + 1}`,
    type,
    purpose,
    status: 'Pending',
    submittedDate: new Date().toISOString().split('T')[0],
    studentName: req.user.name,
    studentRoll: req.user.details?.rollNumber || '2024CS1042',
    department: req.user.department || 'Computer Science & Engineering',
  };

  db.requests.unshift(newRequest);
  saveDB();
  syncToFirestore('requests', newRequest.id, newRequest).catch(() => {});

  recordAudit(req.user.name, req.user.role, 'Certificate Requested', `Applied for ${type} (${newRequest.id})`);

  return res.status(201).json({ request: newRequest });
});

app.patch('/api/requests/:id/review', authMiddleware, requireRoles('Admin', 'Faculty'), (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, reason } = req.body;

  const request = db.requests.find((r) => r.id === id);
  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }

  request.status = status;
  if (status === 'Approved') {
    request.approvedDate = new Date().toISOString().split('T')[0];
    request.verificationCode = `CERT-360-${Math.floor(10000 + Math.random() * 90000)}`;
  } else if (status === 'Rejected') {
    request.rejectionReason = reason || 'Requirements not met';
  }

  // Notify student
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    type: 'certificate',
    title: `Certificate ${request.type} ${status}`,
    message: status === 'Approved'
      ? `Your ${request.type} has been approved and issued with seal ${request.verificationCode}. Ready for download!`
      : `Your ${request.type} was rejected. Reason: ${reason || 'Contact department desk.'}`,
    time: 'Just now',
    isRead: false,
    targetRole: 'Student',
    actionTab: 'Requests',
    relatedId: request.id,
  });

  saveDB();
  syncToFirestore('requests', id, request).catch(() => {});
  recordAudit(req.user.name, req.user.role, 'Certificate Reviewed', `${status} request ${id} for ${request.studentName}`);

  return res.json({ request });
});

// 5. Gate Passes
app.get('/api/gatepasses', authMiddleware, (req: AuthRequest, res: Response) => {
  if (req.user.role === 'Student') {
    const studentRoll = req.user.details?.rollNumber || req.user.name;
    const filtered = db.gatePasses.filter((g) => g.studentRoll === studentRoll || g.studentName === req.user.name);
    return res.json({ gatePasses: filtered });
  }
  return res.json({ gatePasses: db.gatePasses });
});

app.post('/api/gatepasses', authMiddleware, requireRoles('Student', 'Admin'), (req: AuthRequest, res: Response) => {
  const { destination, reason, departureTime, returnTime, parentContact } = req.body;
  if (!destination || !reason || !departureTime || !returnTime) {
    return res.status(400).json({ error: 'Destination, reason, departure, and return times are required' });
  }

  const passId = `GP-${8840 + db.gatePasses.length + 1}`;
  const studentRoll = req.user.details?.rollNumber || '2024CS1042';

  const newPass = {
    id: passId,
    studentName: req.user.name,
    studentRoll,
    destination,
    reason,
    departureTime,
    returnTime,
    parentContact: parentContact || req.user.phone || '+91 98765 11223',
    status: 'Pending',
    qrPayload: `CAMPUS360-${passId}-${studentRoll}-PENDING`,
  };

  db.gatePasses.unshift(newPass);
  saveDB();
  syncToFirestore('gate_passes', newPass.id, newPass).catch(() => {});

  recordAudit(req.user.name, req.user.role, 'Gate Pass Applied', `Applied for pass to ${destination} (${passId})`);

  return res.status(201).json({ gatePass: newPass });
});

app.patch('/api/gatepasses/:id/review', authMiddleware, requireRoles('Warden', 'Admin'), (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, reason } = req.body;

  const pass = db.gatePasses.find((g) => g.id === id);
  if (!pass) {
    return res.status(404).json({ error: 'Gate pass not found' });
  }

  pass.status = status;
  if (status === 'Approved') {
    pass.approvedBy = `${req.user.name} (${req.user.role})`;
    pass.approvedAt = new Date().toLocaleString();
    pass.qrPayload = `CAMPUS360-${pass.id}-${pass.studentRoll}-VERIFIED-VALID`;
  } else {
    pass.rejectionReason = reason || 'Hostel curfew conflict';
    pass.qrPayload = `CAMPUS360-${pass.id}-${pass.studentRoll}-REJECTED`;
  }

  // Notify student
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    type: 'gatepass',
    title: `Gate Pass ${status}`,
    message: status === 'Approved'
      ? `Your gate pass ${pass.id} to ${pass.destination} has been approved by ${req.user.name}. Digital QR active.`
      : `Your gate pass ${pass.id} was rejected. Reason: ${reason || 'Denied by Warden'}`,
    time: 'Just now',
    isRead: false,
    targetRole: 'Student',
    actionTab: 'Gate Pass',
    relatedId: pass.id,
  });

  saveDB();
  syncToFirestore('gate_passes', id, pass).catch(() => {});
  recordAudit(req.user.name, req.user.role, 'Gate Pass Reviewed', `${status} pass ${id} for ${pass.studentName}`);

  return res.json({ gatePass: pass });
});

app.post('/api/gatepasses/verify', (req: Request, res: Response) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ valid: false, message: 'Scan payload or pass ID required' });
  }

  const clean = String(query).trim().toUpperCase();
  const pass = db.gatePasses.find(
    (g) => g.id.toUpperCase() === clean || g.qrPayload.toUpperCase() === clean || clean.includes(g.id.toUpperCase())
  );

  if (!pass) {
    return res.json({ valid: false, message: 'Unrecognized gate pass QR code. Not registered in Campus 360.' });
  }

  if (pass.status === 'Rejected') {
    return res.json({ valid: false, pass, message: `Pass rejected by Warden. Reason: ${pass.rejectionReason || 'Unauthorized'}` });
  }

  if (pass.status === 'Pending') {
    return res.json({ valid: false, pass, message: 'Pass is pending Warden clearance. Entry/Exit denied.' });
  }

  return res.json({
    valid: true,
    pass,
    message: `Valid Gate Pass! Verified clearance for ${pass.studentName} (${pass.studentRoll}).`,
  });
});

// 6. Notices
app.get('/api/notices', authMiddleware, (_req: AuthRequest, res: Response) => {
  return res.json({ notices: db.notices });
});

app.post('/api/notices', authMiddleware, requireRoles('Admin', 'Faculty', 'Warden'), (req: AuthRequest, res: Response) => {
  const { title, category, priority, description, targetAudience, requiresAction, actionText } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  const newNotice = {
    id: `NTC-${500 + db.notices.length + 1}`,
    title,
    category: category || 'Academic',
    priority: priority || 'Regular',
    publishDate: new Date().toISOString().split('T')[0],
    postedBy: req.user.name,
    description,
    targetAudience: targetAudience || 'All Students',
    isRead: false,
    requiresAction: !!requiresAction,
    actionText: actionText || 'Acknowledge Notice',
    isActionDone: false,
  };

  db.notices.unshift(newNotice);

  // Broadcast notification
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    type: 'notice',
    title: `New Notice: ${newNotice.title}`,
    message: `${newNotice.postedBy} published a circular for ${newNotice.targetAudience}`,
    time: 'Just now',
    isRead: false,
    targetRole: 'All',
    actionTab: 'Notices',
    relatedId: newNotice.id,
  });

  saveDB();
  syncToFirestore('notices', newNotice.id, newNotice).catch(() => {});
  recordAudit(req.user.name, req.user.role, 'Notice Published', `Posted "${title}" targeting ${targetAudience}`);

  return res.status(201).json({ notice: newNotice });
});

app.patch('/api/notices/:id/read', authMiddleware, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const notice = db.notices.find((n) => n.id === id);
  if (notice) {
    notice.isRead = true;
    saveDB();
    syncToFirestore('notices', id, notice).catch(() => {});
  }
  return res.json({ success: true });
});

// 7. Attendance
app.get('/api/attendance', authMiddleware, (_req: AuthRequest, res: Response) => {
  return res.json({ attendance: db.attendance });
});

app.post('/api/attendance/mark', authMiddleware, requireRoles('Faculty', 'Admin'), (req: AuthRequest, res: Response) => {
  const { courseCode, isPresent } = req.body;
  const record = db.attendance.find((a) => a.courseCode === courseCode);

  if (record) {
    record.conducted += 1;
    if (isPresent) record.attended += 1;
    record.percentage = Math.round((record.attended / record.conducted) * 1000) / 10;
    saveDB();
    syncToFirestore('attendance', courseCode, record).catch(() => {});

    recordAudit(
      req.user.name,
      req.user.role,
      'Attendance Marked',
      `Updated ${courseCode}: Conducted=${record.conducted}, Attended=${record.attended} (${record.percentage}%)`
    );

    return res.json({ success: true, record });
  }

  return res.status(404).json({ error: 'Course record not found' });
});

// 8. Timetable
app.get('/api/timetable', authMiddleware, (_req: AuthRequest, res: Response) => {
  return res.json({ cancelledClasses: db.cancelledClasses });
});

app.post('/api/timetable/cancel', authMiddleware, requireRoles('Faculty', 'Admin'), (req: AuthRequest, res: Response) => {
  const { courseCode, reason } = req.body;
  if (!courseCode) {
    return res.status(400).json({ error: 'Course code required' });
  }

  if (!db.cancelledClasses.includes(courseCode)) {
    db.cancelledClasses.push(courseCode);
  }

  // Notify students
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    type: 'class_cancellation',
    title: `Class Cancelled: ${courseCode}`,
    message: `${req.user.name} cancelled ${courseCode}. Reason: ${reason || 'Faculty schedule adjustment'}.`,
    time: 'Just now',
    isRead: false,
    targetRole: 'Student',
    actionTab: 'Timetable',
  });

  saveDB();
  recordAudit(req.user.name, req.user.role, 'Class Cancelled', `Cancelled class ${courseCode}`);

  return res.json({ success: true, cancelledClasses: db.cancelledClasses });
});

// 9. Mess
app.get('/api/mess', authMiddleware, (_req: AuthRequest, res: Response) => {
  return res.json({ feedback: db.messFeedback });
});

app.post('/api/mess/feedback', authMiddleware, requireRoles('Student', 'Admin'), (req: AuthRequest, res: Response) => {
  const { mealType, rating, comment } = req.body;
  const newFeedback = {
    id: `mf-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    mealType: mealType || 'Lunch',
    rating: Number(rating) || 4,
    comment: comment || 'Good meal quality.',
    studentName: req.user.name,
  };

  db.messFeedback.unshift(newFeedback);
  saveDB();
  syncToFirestore('mess_feedback', newFeedback.id, newFeedback).catch(() => {});

  recordAudit(req.user.name, req.user.role, 'Mess Feedback', `Rated ${mealType} ${rating}/5`);

  return res.status(201).json({ feedback: newFeedback });
});

// 10. Fees
app.get('/api/fees', authMiddleware, (_req: AuthRequest, res: Response) => {
  return res.json({ fees: db.feeDetails });
});

app.post('/api/fees/pay', authMiddleware, requireRoles('Student', 'Admin'), (req: AuthRequest, res: Response) => {
  const { amount, method } = req.body;
  const payAmount = Number(amount) || 0;

  if (payAmount <= 0) {
    return res.status(400).json({ error: 'Valid payment amount required' });
  }

  db.feeDetails.paidFee += payAmount;
  db.feeDetails.pendingFee = Math.max(0, db.feeDetails.totalFee - db.feeDetails.paidFee);

  const txnId = `TXN-${Math.floor(10000 + Math.random() * 90000)}`;
  db.feeDetails.paymentHistory.unshift({
    id: txnId,
    date: new Date().toISOString().split('T')[0],
    amount: payAmount,
    method: method || 'Instant Online Payment Gateway',
    receiptNumber: `RCP-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
    status: 'Success',
  });

  saveDB();
  syncToFirestore('settings', 'fee_details', db.feeDetails).catch(() => {});
  recordAudit(req.user.name, req.user.role, 'Fee Payment Processed', `Paid ₹${payAmount.toLocaleString('en-IN')} via ${method} (TXN: ${txnId})`);

  return res.json({ success: true, txnId, feeDetails: db.feeDetails });
});

// 11. Audit Logs
app.get('/api/audit-logs', authMiddleware, requireRoles('Admin', 'Warden', 'Staff'), (_req: AuthRequest, res: Response) => {
  return res.json({ logs: db.auditLogs });
});

// 12. Hostels
app.get('/api/hostels', authMiddleware, (_req: AuthRequest, res: Response) => {
  return res.json({ hostels: db.hostels });
});

// 13. System Bootstrap
app.get('/api/bootstrap', authMiddleware, (req: AuthRequest, res: Response) => {
  let userComplaints = db.complaints;
  let userRequests = db.requests;
  let userGatePasses = db.gatePasses;

  if (req.user.role === 'Student') {
    const studentRoll = req.user.details?.rollNumber || req.user.name;
    userComplaints = db.complaints.filter((c) => c.studentRoll === studentRoll || c.studentEmail === req.user.email);
    userRequests = db.requests.filter((r) => r.studentRoll === studentRoll || r.studentName === req.user.name);
    userGatePasses = db.gatePasses.filter((g) => g.studentRoll === studentRoll || g.studentName === req.user.name);
  }

  return res.json({
    complaints: userComplaints,
    requests: userRequests,
    gatePasses: userGatePasses,
    notices: db.notices,
    notifications: db.notifications,
    attendance: db.attendance,
    messFeedback: db.messFeedback,
    feeDetails: db.feeDetails,
    auditLogs: db.auditLogs,
    hostels: db.hostels,
  });
});

// -------------------------------------------------------------
// VITE DEV SERVER MOUNT & STATIC PROD HANDLER
// -------------------------------------------------------------

async function bootstrap() {
  // Sync / seed Firebase Firestore & Auth on startup
  try {
    const admin = getFirebaseAdmin();
    if (admin.available) {
      console.log('[Campus 360] Firebase connected. Initializing Firestore sync...');
      await seedFirebaseCollections(db);
    }
  } catch (err) {
    console.warn('[Campus 360] Firebase startup initialization notice:', err);
  }

  if (process.env.NODE_ENV === 'production') {
    // Serve pre-built static client
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Mount Vite middlewares in development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Campus 360] Server running on http://0.0.0.0:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Fatal error starting Campus 360 server:', err);
  process.exit(1);
});
