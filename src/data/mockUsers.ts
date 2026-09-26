import { UserAccount, UserRole } from '../types/auth';

export const MOCK_USERS: Record<string, { account: UserAccount; passwordHash: string }> = {
  // Student - Demo & Edu (Campus 360)
  'student@campus360.demo': {
    passwordHash: 'student123',
    account: {
      id: 'usr-student-01',
      email: 'student@campus360.demo',
      name: 'Manoj Kumar Jena',
      role: 'Student',
      title: 'B.Tech Student (3rd Sem)',
      department: 'Computer Science & Engineering',
      avatarUrl: '/src/assets/images/manoj_student_1790405327601.jpg',
      status: 'active',
      phone: '+91 98765 43210',
      details: {
        rollNumber: '2024CS1042',
        section: 'Section A',
        hostelAssigned: 'Aryabhata Bhavan (Block B)',
      },
    },
  },
  'student@campus360.edu': {
    passwordHash: 'password123',
    account: {
      id: 'usr-student-01',
      email: 'student@campus360.edu',
      name: 'Manoj Kumar Jena',
      role: 'Student',
      title: 'B.Tech Student (3rd Sem)',
      department: 'Computer Science & Engineering',
      avatarUrl: '/src/assets/images/manoj_student_1790405327601.jpg',
      status: 'active',
      phone: '+91 98765 43210',
      details: {
        rollNumber: '2024CS1042',
        section: 'Section A',
        hostelAssigned: 'Aryabhata Bhavan (Block B)',
      },
    },
  },
  'manoj.jena@campus360.edu': {
    passwordHash: 'password123',
    account: {
      id: 'usr-student-01',
      email: 'manoj.jena@campus360.edu',
      name: 'Manoj Kumar Jena',
      role: 'Student',
      title: 'B.Tech Student (3rd Sem)',
      department: 'Computer Science & Engineering',
      avatarUrl: '/src/assets/images/manoj_student_1790405327601.jpg',
      status: 'active',
      phone: '+91 98765 43210',
      details: {
        rollNumber: '2024CS1042',
        section: 'Section A',
        hostelAssigned: 'Aryabhata Bhavan (Block B)',
      },
    },
  },
  'jena06459@gmail.com': {
    passwordHash: 'student123',
    account: {
      id: 'usr-student-01',
      email: 'jena06459@gmail.com',
      name: 'Manoj Kumar Jena',
      role: 'Student',
      title: 'B.Tech Student (3rd Sem)',
      department: 'Computer Science & Engineering',
      avatarUrl: '/src/assets/images/manoj_student_1790405327601.jpg',
      status: 'active',
      phone: '+91 98765 43210',
      details: {
        rollNumber: '2024CS1042',
        section: 'Section A',
        hostelAssigned: 'Aryabhata Bhavan (Block B)',
      },
    },
  },
  '2024cs1042': {
    passwordHash: 'student123',
    account: {
      id: 'usr-student-01',
      email: 'student@campus360.demo',
      name: 'Manoj Kumar Jena',
      role: 'Student',
      title: 'B.Tech Student (3rd Sem)',
      department: 'Computer Science & Engineering',
      avatarUrl: '/src/assets/images/manoj_student_1790405327601.jpg',
      status: 'active',
      phone: '+91 98765 43210',
      details: {
        rollNumber: '2024CS1042',
        section: 'Section A',
        hostelAssigned: 'Aryabhata Bhavan (Block B)',
      },
    },
  },
  'stu-1042': {
    passwordHash: 'student123',
    account: {
      id: 'usr-student-01',
      email: 'student@campus360.demo',
      name: 'Manoj Kumar Jena',
      role: 'Student',
      title: 'B.Tech Student (3rd Sem)',
      department: 'Computer Science & Engineering',
      avatarUrl: '/src/assets/images/manoj_student_1790405327601.jpg',
      status: 'active',
      phone: '+91 98765 43210',
      details: {
        rollNumber: '2024CS1042',
        section: 'Section A',
        hostelAssigned: 'Aryabhata Bhavan (Block B)',
      },
    },
  },
  // Backward compatibility aliases
  'student@campusos.demo': {
    passwordHash: 'student123',
    account: {
      id: 'usr-student-01',
      email: 'student@campus360.demo',
      name: 'Manoj Kumar Jena',
      role: 'Student',
      title: 'B.Tech Student (3rd Sem)',
      department: 'Computer Science & Engineering',
      avatarUrl: '/src/assets/images/manoj_student_1790405327601.jpg',
      status: 'active',
      phone: '+91 98765 43210',
      details: {
        rollNumber: '2024CS1042',
        section: 'Section A',
        hostelAssigned: 'Aryabhata Bhavan (Block B)',
      },
    },
  },
  'student@campusos.edu': {
    passwordHash: 'password123',
    account: {
      id: 'usr-student-01',
      email: 'student@campus360.edu',
      name: 'Manoj Kumar Jena',
      role: 'Student',
      title: 'B.Tech Student (3rd Sem)',
      department: 'Computer Science & Engineering',
      avatarUrl: '/src/assets/images/manoj_student_1790405327601.jpg',
      status: 'active',
      phone: '+91 98765 43210',
      details: {
        rollNumber: '2024CS1042',
        section: 'Section A',
        hostelAssigned: 'Aryabhata Bhavan (Block B)',
      },
    },
  },

  // Faculty - Demo & Edu
  'faculty@campus360.demo': {
    passwordHash: 'faculty123',
    account: {
      id: 'usr-faculty-01',
      email: 'faculty@campus360.demo',
      name: 'Dr. A. Singh',
      role: 'Faculty',
      title: 'Associate Professor & HOD',
      department: 'Computer Science & Engineering',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      status: 'active',
      phone: '+91 98111 22334',
      details: {
        designation: 'Associate Professor & HOD',
        section: 'CS201, CS203',
      },
    },
  },
  'faculty@campus360.edu': {
    passwordHash: 'password123',
    account: {
      id: 'usr-faculty-01',
      email: 'faculty@campus360.edu',
      name: 'Dr. A. Singh',
      role: 'Faculty',
      title: 'Associate Professor & HOD',
      department: 'Computer Science & Engineering',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      status: 'active',
      phone: '+91 98111 22334',
      details: {
        designation: 'Associate Professor & HOD',
        section: 'CS201, CS203',
      },
    },
  },
  // Backward compatibility alias
  'faculty@campusos.demo': {
    passwordHash: 'faculty123',
    account: {
      id: 'usr-faculty-01',
      email: 'faculty@campus360.demo',
      name: 'Dr. A. Singh',
      role: 'Faculty',
      title: 'Associate Professor & HOD',
      department: 'Computer Science & Engineering',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      status: 'active',
      phone: '+91 98111 22334',
      details: {
        designation: 'Associate Professor & HOD',
        section: 'CS201, CS203',
      },
    },
  },

  // Admin - Demo & Edu
  'admin@campus360.demo': {
    passwordHash: 'admin123',
    account: {
      id: 'usr-admin-01',
      email: 'admin@campus360.demo',
      name: 'Dr. K. Venkataraman',
      role: 'Admin',
      title: 'Dean of Academic Operations & System Admin',
      department: 'Central Administration Office',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
      status: 'active',
      phone: '+91 98222 33445',
      details: {
        designation: 'Dean of Academic Operations',
      },
    },
  },
  'admin@campus360.edu': {
    passwordHash: 'password123',
    account: {
      id: 'usr-admin-01',
      email: 'admin@campus360.edu',
      name: 'Dr. K. Venkataraman',
      role: 'Admin',
      title: 'Dean of Academic Operations & System Admin',
      department: 'Central Administration Office',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
      status: 'active',
      phone: '+91 98222 33445',
      details: {
        designation: 'Dean of Academic Operations',
      },
    },
  },
  // Backward compatibility alias
  'admin@campusos.demo': {
    passwordHash: 'admin123',
    account: {
      id: 'usr-admin-01',
      email: 'admin@campus360.demo',
      name: 'Dr. K. Venkataraman',
      role: 'Admin',
      title: 'Dean of Academic Operations & System Admin',
      department: 'Central Administration Office',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
      status: 'active',
      phone: '+91 98222 33445',
      details: {
        designation: 'Dean of Academic Operations',
      },
    },
  },

  // Warden - Demo & Edu
  'warden@campus360.demo': {
    passwordHash: 'warden123',
    account: {
      id: 'usr-warden-01',
      email: 'warden@campus360.demo',
      name: 'Er. Sandeep Rathore',
      role: 'Warden',
      title: 'Chief Hostel Warden',
      department: 'Hostel Administration Council',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
      status: 'active',
      phone: '+91 98333 44556',
      details: {
        hostelAssigned: 'Aryabhata & Ramanujan Hostels',
      },
    },
  },
  'warden@campus360.edu': {
    passwordHash: 'password123',
    account: {
      id: 'usr-warden-01',
      email: 'warden@campus360.edu',
      name: 'Er. Sandeep Rathore',
      role: 'Warden',
      title: 'Chief Hostel Warden',
      department: 'Hostel Administration Council',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
      status: 'active',
      phone: '+91 98333 44556',
      details: {
        hostelAssigned: 'Aryabhata & Ramanujan Hostels',
      },
    },
  },
  // Backward compatibility alias
  'warden@campusos.demo': {
    passwordHash: 'warden123',
    account: {
      id: 'usr-warden-01',
      email: 'warden@campus360.demo',
      name: 'Er. Sandeep Rathore',
      role: 'Warden',
      title: 'Chief Hostel Warden',
      department: 'Hostel Administration Council',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
      status: 'active',
      phone: '+91 98333 44556',
      details: {
        hostelAssigned: 'Aryabhata & Ramanujan Hostels',
      },
    },
  },

  // Staff - Demo & Edu
  'staff@campus360.demo': {
    passwordHash: 'staff123',
    account: {
      id: 'usr-staff-01',
      email: 'staff@campus360.demo',
      name: 'Rajesh Verma',
      role: 'Staff',
      title: 'Facilities & Maintenance Supervisor',
      department: 'Campus Estate & Engineering Dept',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
      status: 'active',
      phone: '+91 98444 55667',
      details: {
        assignedDepartment: 'Civil & Electrical Maintenance',
      },
    },
  },
  'staff@campus360.edu': {
    passwordHash: 'password123',
    account: {
      id: 'usr-staff-01',
      email: 'staff@campus360.edu',
      name: 'Rajesh Verma',
      role: 'Staff',
      title: 'Facilities & Maintenance Supervisor',
      department: 'Campus Estate & Engineering Dept',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
      status: 'active',
      phone: '+91 98444 55667',
      details: {
        assignedDepartment: 'Civil & Electrical Maintenance',
      },
    },
  },
  // Backward compatibility alias
  'staff@campusos.demo': {
    passwordHash: 'staff123',
    account: {
      id: 'usr-staff-01',
      email: 'staff@campus360.demo',
      name: 'Rajesh Verma',
      role: 'Staff',
      title: 'Facilities & Maintenance Supervisor',
      department: 'Campus Estate & Engineering Dept',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
      status: 'active',
      phone: '+91 98444 55667',
      details: {
        assignedDepartment: 'Civil & Electrical Maintenance',
      },
    },
  },

  // Disabled Account for Testing
  'disabled@campus360.edu': {
    passwordHash: 'password123',
    account: {
      id: 'usr-disabled-01',
      email: 'disabled@campus360.edu',
      name: 'Priya Nambiar',
      role: 'Student',
      title: 'Suspended Account',
      department: 'Electronics Engineering',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
      status: 'disabled',
      phone: '+91 98999 00112',
    },
  },
  'disabled@campusos.edu': {
    passwordHash: 'password123',
    account: {
      id: 'usr-disabled-01',
      email: 'disabled@campus360.edu',
      name: 'Priya Nambiar',
      role: 'Student',
      title: 'Suspended Account',
      department: 'Electronics Engineering',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
      status: 'disabled',
      phone: '+91 98999 00112',
    },
  },
};

export const DEMO_PRESETS: {
  role: UserRole;
  label: string;
  email: string;
  passwordHint: string;
  name: string;
  description: string;
  iconBg: string;
}[] = [
  {
    role: 'Student',
    label: 'Student Demo',
    email: 'student@campus360.demo',
    passwordHint: 'student123',
    name: 'Manoj Kumar Jena',
    description: 'Attendance, Passes, Complaints, Requests',
    iconBg: 'bg-blue-600',
  },
  {
    role: 'Faculty',
    label: 'Faculty Demo',
    email: 'faculty@campus360.demo',
    passwordHint: 'faculty123',
    name: 'Dr. A. Singh',
    description: 'Attendance marking, Timetable, Approvals',
    iconBg: 'bg-emerald-600',
  },
  {
    role: 'Admin',
    label: 'Admin Demo',
    email: 'admin@campus360.demo',
    passwordHint: 'admin123',
    name: 'Dr. K. Venkataraman',
    description: 'Full Apna Campus RBAC, Analytics, Notices',
    iconBg: 'bg-purple-600',
  },
  {
    role: 'Warden',
    label: 'Warden Demo',
    email: 'warden@campus360.demo',
    passwordHint: 'warden123',
    name: 'Er. S. Rathore',
    description: 'Gate pass approvals, Hostels, Rooms',
    iconBg: 'bg-amber-600',
  },
  {
    role: 'Staff',
    label: 'Staff Demo',
    email: 'staff@campus360.demo',
    passwordHint: 'staff123',
    name: 'Rajesh Verma',
    description: 'Work orders, Repairs, Resolution sign-off',
    iconBg: 'bg-slate-700',
  },
];
