/**
 * Apna Campus Design System Tokens & Brand Constants
 * "Apna Campus • One Campus. Everything Connected."
 */

export const BRAND = {
  name: 'Apna Campus',
  shortName: 'ApnaCampus',
  tagline: 'Apna Campus • One Campus. Everything Connected.',
  subheading:
    'Unified digital campus operations platform connecting Students, Faculty, Administration, Wardens, and Staff across all campus operations.',
  copyright: '© 2026 Apna Campus. All rights reserved.',
  supportEmail: 'support@apnacampus.edu',
  activeTerm: 'Autumn Semester 2026',
  activeWeek: 'Week 06',

  // Core Brand Colors
  colors: {
    primaryNavy: '#0F172A',
    electricBlue: '#2563EB',
    secondaryBlue: '#3B82F6',
    lightBlue: '#DBEAFE',
    success: '#16A34A',
    successLight: '#DCFCE7',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    error: '#DC2626',
    errorLight: '#FEE2E2',
    info: '#0891B2',
    background: '#F8FAFC',
    card: '#FFFFFF',
    border: '#E2E8F0',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
  },

  // Standard Button Classes adhering to 8-12px radius and >=44px touch targets
  buttonStyles: {
    primary:
      'min-h-[44px] px-4 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm rounded-xl shadow-sm transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40',
    secondary:
      'min-h-[44px] px-4 py-2.5 bg-white hover:bg-slate-50 text-[#0F172A] border border-[#E2E8F0] font-semibold text-sm rounded-xl shadow-xs transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-slate-300',
    success:
      'min-h-[44px] px-4 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold text-sm rounded-xl shadow-sm transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40',
    danger:
      'min-h-[44px] px-4 py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold text-sm rounded-xl shadow-sm transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-[#DC2626]/40',
    ghost:
      'min-h-[44px] px-3 py-2 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 font-semibold text-sm rounded-xl transition-all duration-150 active:scale-[0.98]',
  },

  // Standard Card Style (16px radius, #E2E8F0 border, #FFFFFF bg, padding 20-24px)
  cardStyle: 'bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-sm',
} as const;
