import { NoticeItem, NotificationSettings } from '../types/notice';

export const FEATURED_NOTICE: NoticeItem = {
  id: 'notice-feat-exam',
  title: 'IMPORTANT — Examination Update',
  summary: 'Mid-Semester Examination schedule has been updated with revised slot timings for CSE theory courses.',
  fullContent: `The Office of the Controller of Examinations has released the revised timetable for the Autumn 2026 Mid-Semester Examinations. 

Key Updates:
1. Data Structures (CS201) has been shifted from morning slot to 02:00 PM – 04:00 PM on 14 October 2026.
2. Operating Systems (CS203) practical examinations will be conducted in batches in Software Lab 2 & 3.
3. Admit cards (Hall Tickets) are mandatory. Please download your hall ticket from the student portal and bring a printed copy along with your Campus RFID smart card.
4. Electronic devices, smartwatches, and programmable calculators are strictly prohibited inside the examination halls.

Please verify your seating plan and room allocation on your student dashboard 24 hours prior to each exam.`,
  category: 'Examination',
  priority: 'Important',
  postedAt: '23 September 2026 • 10:30 AM',
  dateStr: '23 September 2026',
  issuingDepartment: 'Academic Office',
  issuedBy: 'Dr. R. K. Mukherjee',
  issuerRole: 'Controller of Examinations',
  targetAudience: 'B.Tech • CSE • 2nd Year',
  targetBreakdown: {
    branch: 'Computer Science & Engineering',
    year: '2nd Year (Semester 3)',
    section: 'Sections A & B',
  },
  isRead: false,
  actionRequired: true,
  actionTitle: 'Download Hall Ticket',
  actionCompleted: false,
  isPersonalized: true,
  attachments: [
    { name: 'Revised_MidSem_Schedule_CSE_2026.pdf', size: '1.4 MB', type: 'PDF' },
    { name: 'Exam_Conduct_Guidelines_Students.pdf', size: '840 KB', type: 'PDF' },
  ],
  engagement: {
    delivered: 186,
    read: 164,
    unread: 22,
    actionCompleted: 132,
  },
};

export const EMERGENCY_NOTICE: NoticeItem = {
  id: 'notice-emerg-fire',
  title: 'Emergency Campus Alert',
  summary: 'Hostel B fire safety drill scheduled at 4:00 PM today. Mandatory evacuation protocol applies.',
  fullContent: `This is an urgent campus-wide safety drill notice issued by Campus Security and Disaster Management Cell.

All residents of Hostel B (Boys Hostel 2) are required to participate in the scheduled Fire Evacuation & Safety Drill today at 4:00 PM sharp.

Action Instructions:
1. When the fire sirens sound at 16:00 IST, immediately cease all room activities.
2. Do not use the elevators. Use the fire escape stairwells on the North and South wings.
3. Assemble in designated assembly Area B (Football Ground East Perimeter).
4. Wardens and student floor captains will conduct roll calls.
5. Duration of drill is estimated at 25 minutes.

Mandatory acknowledgment is required from all Hostel B residents before 3:30 PM.`,
  category: 'Emergency',
  priority: 'Emergency',
  postedAt: 'Today • 01:15 PM',
  dateStr: '23 September 2026',
  issuingDepartment: 'Campus Safety & Disaster Cell',
  issuedBy: 'Col. V. Nair (Retd.)',
  issuerRole: 'Chief Security Officer',
  targetAudience: 'Hostel B Residents',
  targetBreakdown: {
    branch: 'All Branches',
    year: 'All Years',
    hostel: 'Hostel B (Blocks 1-4)',
  },
  isRead: false,
  actionRequired: true,
  actionTitle: 'Acknowledge Drill Notice',
  actionCompleted: false,
  isPersonalized: true,
  isEmergency: true,
  acknowledged: false,
  attachments: [
    { name: 'Hostel_B_Emergency_Evacuation_Map.pdf', size: '2.1 MB', type: 'PDF' },
  ],
  engagement: {
    delivered: 340,
    read: 312,
    unread: 28,
    actionCompleted: 289,
  },
};

export const ALL_NOTICES: NoticeItem[] = [
  // Example 1
  {
    id: 'notice-1',
    title: "Tomorrow's CSE class cancelled",
    summary: 'Design & Analysis of Algorithms lecture on Thursday at 10:15 AM is cancelled due to faculty university symposium.',
    fullContent: `Prof. K. Verma will be attending the National Computer Science Faculty Colloquium on Thursday. 

Consequently, the lecture on Algorithms & Complexity (CS202) scheduled for tomorrow (Thursday, 24 Sep) at 10:15 AM in Room 205 stands cancelled. 

A replacement compensatory lecture will be scheduled on Saturday between 02:00 PM and 03:00 PM. Students are advised to complete the dynamic programming problem set uploaded on LMS in the interim.`,
    category: 'Academic',
    priority: 'Urgent',
    postedAt: '2 hours ago',
    dateStr: '23 September 2026',
    issuingDepartment: 'Department of Computer Science',
    issuedBy: 'Prof. K. Verma',
    issuerRole: 'Associate Professor, CSE',
    targetAudience: 'CSE • 2nd Year',
    targetBreakdown: {
      branch: 'CSE',
      year: '2nd Year',
      section: 'Section A & B',
    },
    isRead: false,
    actionRequired: false,
    isPersonalized: true,
    attachments: [
      { name: 'Compensatory_Schedule_Notice.pdf', size: '320 KB', type: 'PDF' },
    ],
    engagement: {
      delivered: 186,
      read: 98,
      unread: 88,
      actionCompleted: 0,
    },
  },

  // Example 2
  {
    id: 'notice-2',
    title: 'Hostel B maintenance schedule',
    summary: 'Scheduled solar water heater maintenance and electrical backup testing will take place between 10:00 AM and 01:00 PM.',
    fullContent: `Estate and Maintenance Engineering division will perform routine preventative overhaul on the solar thermal water grids and backup generators in Hostel B on Friday.

During this interval:
- Hot water supply will be suspended between 10:00 AM and 01:00 PM.
- Brief electrical switchover delays (2-3 minutes) may occur.
- Wi-Fi routers are on dedicated UPS and will remain uninterrupted.

Please plan your morning routines accordingly.`,
    category: 'Hostel',
    priority: 'Normal',
    postedAt: 'Yesterday',
    dateStr: '22 September 2026',
    issuingDepartment: 'Estate & Hostel Administration',
    issuedBy: 'Er. Sandeep Rathore',
    issuerRole: 'Hostel B Warden',
    targetAudience: 'Hostel B',
    targetBreakdown: {
      branch: 'All Branches',
      year: 'All Years',
      hostel: 'Hostel B',
    },
    isRead: true,
    actionRequired: false,
    isPersonalized: true,
  },

  // Example 3
  {
    id: 'notice-3',
    title: 'Mid-Semester Examination Schedule',
    summary: 'Official comprehensive timetable and hall ticket generation window is now open on the academic portal.',
    fullContent: `All undergraduate engineering candidates enrolled in Autumn 2026 semester are hereby notified that Mid-Semester Examinations commence from 12 October 2026.

Important Instructions:
1. Online Hall Ticket verification requires confirmation of course prerequisites.
2. Students with fee dues must clear accounts before 05 October to prevent admit card withholding.
3. Seating charts will be synchronized with student RFID IDs.`,
    category: 'Examination',
    priority: 'Important',
    postedAt: '2 days ago',
    dateStr: '21 September 2026',
    issuingDepartment: 'Controller of Examinations',
    issuedBy: 'Examination Board',
    issuerRole: 'Dean Academic Affairs',
    targetAudience: 'All B.Tech Students',
    targetBreakdown: {
      branch: 'B.Tech (All Departments)',
      year: '1st - 4th Year',
    },
    isRead: false,
    actionRequired: true,
    actionTitle: 'Verify Hall Ticket',
    actionCompleted: false,
    isPersonalized: false,
    attachments: [
      { name: 'Master_Autumn_MidSem_Timetable.pdf', size: '2.8 MB', type: 'PDF' },
    ],
    engagement: {
      delivered: 1420,
      read: 1280,
      unread: 140,
      actionCompleted: 980,
    },
  },

  // Example 4
  {
    id: 'notice-4',
    title: 'Annual Technical Fest Registration',
    summary: 'Registrations are now open for InnovateX 2026 hackathon, robotics arena, and coding marathons.',
    fullContent: `The Student Council and Technical Society are thrilled to announce the 14th edition of InnovateX 2026 — Eastern India's largest collegiate technical fest.

Events Featured:
- 36-Hour Hackathon with cash prizes over ₹3,00,000.
- Robowars & Autonomous Drone Racing.
- CP Sprint with LeetCode & Codeforces rating rewards.
- Industry keynote talks by AI & Semiconductor architects.

Early bird registrations close on 30 September 2026. Teams can register directly through Campus 360 Events tab.`,
    category: 'Events',
    priority: 'Normal',
    postedAt: '3 days ago',
    dateStr: '20 September 2026',
    issuingDepartment: 'Student Welfare & Technical Society',
    issuedBy: 'Aman Singhania',
    issuerRole: 'Convener, Tech Fest Committee',
    targetAudience: 'All Students',
    targetBreakdown: {
      branch: 'All Departments',
      year: 'All Batches',
    },
    isRead: true,
    actionRequired: false,
    isPersonalized: false,
    attachments: [
      { name: 'InnovateX_Rulebook_Brochure.pdf', size: '4.2 MB', type: 'PDF' },
    ],
  },

  // Example 5 (Fees)
  {
    id: 'notice-5',
    title: 'Mess Rebate Application Deadline',
    summary: 'Submit your rebate applications for upcoming Autumn break before 28 September to claim dining fee deduction.',
    fullContent: `Hostel dining council invites mess rebate submissions for students leaving campus during the upcoming semester break (08 Oct - 16 Oct).

Rules for Mess Rebate:
1. Minimum absence required: 5 consecutive days.
2. Gate Pass clearance must match rebate dates.
3. Rebates submitted after 28 September 11:59 PM will not be processed.
4. Approved rebate amount will be credited to next month's dining invoice.`,
    category: 'Fees',
    priority: 'Important',
    postedAt: '4 days ago',
    dateStr: '19 September 2026',
    issuingDepartment: 'Central Mess Committee & Accounts',
    issuedBy: 'Mess Board Executive',
    issuerRole: 'Assistant Registrar (Hostels)',
    targetAudience: 'Hostel Residents',
    targetBreakdown: {
      branch: 'All Branches',
      year: 'All Batches',
      hostel: 'Hostels A, B, C, D & Girls Towers',
    },
    isRead: false,
    actionRequired: true,
    actionTitle: 'Submit Rebate Form',
    actionCompleted: false,
    isPersonalized: true,
    attachments: [
      { name: 'Mess_Rebate_Policy_2026.pdf', size: '512 KB', type: 'PDF' },
    ],
    engagement: {
      delivered: 840,
      read: 710,
      unread: 130,
      actionCompleted: 490,
    },
  },

  // Example 6 (Academic)
  {
    id: 'notice-6',
    title: 'Library RFID Smart Return & Dues Clearance',
    summary: 'All overdue books from the previous semester must be returned to automated kiosks by 30 September without fine.',
    fullContent: `Central Library is conducting annual book inventory and catalog synchronization.

Key Highlights:
- Amnesty period: Zero late fines for all overdue books returned between 20 Sep and 30 Sep.
- Use 24/7 Smart Book Drop kiosks located at Library Ground Floor and Student Activity Center.
- Check active borrowings on your RFID student card.`,
    category: 'Academic',
    priority: 'Normal',
    postedAt: '5 days ago',
    dateStr: '18 September 2026',
    issuingDepartment: 'University Central Library',
    issuedBy: 'Dr. Anita Desai',
    issuerRole: 'Head Librarian',
    targetAudience: '2nd Year Students',
    targetBreakdown: {
      branch: 'All Departments',
      year: '2nd Year',
    },
    isRead: false,
    actionRequired: false,
    isPersonalized: true,
  },

  // Example 7 (Academic)
  {
    id: 'notice-7',
    title: 'CSE Lab Relocation for Web Technologies',
    summary: 'Wednesday practical sessions for Web Tech lab group CSE-2A shifted from Lab 2 to Software Lab 3.',
    fullContent: `Due to routine hardware calibration and GPU server upgrades in Software Lab 2, practical batches scheduled for Web Technologies (CS204L) on Wednesday 11:30 AM will be held in Software Lab 3 (Second Floor, CS Wing).

Attendance RFID scanners will be active at Lab 3 door from 11:20 AM.`,
    category: 'Academic',
    priority: 'Urgent',
    postedAt: 'Today',
    dateStr: '23 September 2026',
    issuingDepartment: 'Department of Computer Science',
    issuedBy: 'Prof. R. Mehta',
    issuerRole: 'Lab In-Charge',
    targetAudience: 'CSE • 2nd Year',
    targetBreakdown: {
      branch: 'CSE',
      year: '2nd Year',
      section: 'Section A',
    },
    isRead: false,
    actionRequired: false,
    isPersonalized: true,
  },

  // Example 8 (Hostel)
  {
    id: 'notice-8',
    title: 'Hostel Night Curfew Revision for Festival Week',
    summary: 'In-gate timing extended to 11:30 PM for campus cultural evenings from 25 Sep to 29 Sep.',
    fullContent: `In view of the upcoming inter-college cultural events and practice sessions, hostel in-time is relaxed to 11:30 PM with valid student RFID identification.

Students are required to swipe RFID at the campus main security gate before 11:30 PM.`,
    category: 'Hostel',
    priority: 'Normal',
    postedAt: '6 days ago',
    dateStr: '17 September 2026',
    issuingDepartment: 'Chief Warden Office',
    issuedBy: 'Prof. P. Sengupta',
    issuerRole: 'Chief Warden',
    targetAudience: 'Hostel Residents',
    targetBreakdown: {
      branch: 'All Branches',
      year: 'All Batches',
      hostel: 'All Hostels',
    },
    isRead: true,
    actionRequired: false,
    isPersonalized: true,
  },

  // Example 9 (Fees / Scholarship)
  {
    id: 'notice-9',
    title: 'State Merit Scholarship Renewal Portal Live',
    summary: 'Eligible students with CGPA >= 8.5 must submit verified grade sheets and income affidavits by 05 October.',
    fullContent: `The State Higher Education Directorate has activated the scholarship renewal portal for academic year 2026-2027.

Eligible candidates must upload:
1. Semesters 1 & 2 verified grade cards.
2. Family annual income certificate.
3. Bank passbook with linked Aadhaar.

Submit physical verification documents to Accounts Office Counter 4.`,
    category: 'Fees',
    priority: 'Important',
    postedAt: '1 week ago',
    dateStr: '16 September 2026',
    issuingDepartment: 'Accounts & Scholarships Section',
    issuedBy: 'Scholarship Cell',
    issuerRole: 'Finance Officer',
    targetAudience: 'Eligible B.Tech Students',
    targetBreakdown: {
      branch: 'All Departments',
      year: '2nd Year onwards',
    },
    isRead: true,
    actionRequired: true,
    actionTitle: 'Verify Documents',
    actionCompleted: true,
    isPersonalized: false,
  },
];

export const INITIAL_SETTINGS: NotificationSettings = {
  academic: true,
  hostel: true,
  examination: true,
  events: true,
  emergency: true,
};

export const TARGET_PROFILE = {
  name: 'Manoj Kumar Jena',
  degree: 'B.Tech CSE • 2nd Year',
  branch: 'Computer Science & Engineering',
  year: '2nd Year (Semester 3)',
  section: 'Section A',
  hostel: 'Hostel B (Room 314)',
  rollNumber: '24BCSE1042',
  deliveredTotal: 186,
  readTotal: 164,
  unreadTotal: 22,
  actionCompletedTotal: 132,
};
