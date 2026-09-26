export type NoticeCategory =
  | 'All'
  | 'Academic'
  | 'Examination'
  | 'Hostel'
  | 'Events'
  | 'Fees'
  | 'Emergency';

export type NoticePriority = 'Emergency' | 'Important' | 'Urgent' | 'Normal';

export interface NoticeAttachment {
  name: string;
  size: string;
  type: string;
  downloadUrl?: string;
}

export interface NoticeEngagement {
  delivered: number;
  read: number;
  unread: number;
  actionCompleted: number;
}

export interface NoticeItem {
  id: string;
  title: string;
  summary: string;
  fullContent: string;
  category: NoticeCategory;
  priority: NoticePriority;
  postedAt: string;
  dateStr: string;
  issuingDepartment: string;
  issuedBy: string;
  issuerRole?: string;
  targetAudience: string;
  targetBreakdown?: {
    branch: string;
    year: string;
    section?: string;
    hostel?: string;
  };
  isRead: boolean;
  actionRequired: boolean;
  actionTitle?: string;
  actionCompleted?: boolean;
  isPersonalized: boolean;
  isEmergency?: boolean;
  acknowledged?: boolean;
  attachments?: NoticeAttachment[];
  engagement?: NoticeEngagement;
}

export interface NotificationSettings {
  academic: boolean;
  hostel: boolean;
  examination: boolean;
  events: boolean;
  emergency: boolean;
}
