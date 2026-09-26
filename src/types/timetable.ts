export type ClassType = 'Lecture' | 'Lab' | 'Tutorial' | 'Seminar';

export type ClassStatus = 'Completed' | 'Ongoing' | 'Upcoming' | 'Cancelled';

export interface ClassItem {
  id: string;
  code: string;
  name: string;
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "10:00"
  displayTime: string; // "09:00 - 10:00"
  timeSlotId: string; // "09:00"
  day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';
  room: string;
  faculty: string;
  facultyEmail?: string;
  facultyOffice?: string;
  type: ClassType;
  status: ClassStatus;
  cancellationReason?: string;
  attendanceStatus?: 'Present' | 'Absent' | 'Pending' | 'Excused';
  attendanceRate?: string;
  colorScheme: 'blue' | 'purple' | 'emerald' | 'amber' | 'indigo' | 'rose' | 'teal';
  topics?: string;
  materials?: string[];
  reminderSet?: boolean;
}

export interface DayInfo {
  key: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';
  dayName: string;
  shortName: string;
  dateStr: string;
  dayNumber: number;
  month: string;
  isToday: boolean;
}

export interface NoticeItem {
  id: string;
  title: string;
  message: string;
  date: string;
  priority: 'urgent' | 'normal' | 'info';
  category: string;
  issuedBy: string;
}
