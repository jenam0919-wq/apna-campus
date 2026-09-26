import React, { useEffect, useState } from 'react';
import { UserAccount, UserRole } from '../../types/auth';
import {
  GraduationCap,
  BookOpen,
  ShieldAlert,
  Building,
  Wrench,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Campus360Logo } from '../Campus360Logo';

interface RoleTransitionScreenProps {
  user: UserAccount;
  onComplete: () => void;
}

export const RoleTransitionScreen: React.FC<RoleTransitionScreenProps> = ({
  user,
  onComplete,
}) => {
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const timer1 = setTimeout(() => setProgress(60), 300);
    const timer2 = setTimeout(() => setProgress(100), 900);
    const timer3 = setTimeout(() => onComplete(), 1400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  const getRoleConfig = (role: UserRole) => {
    switch (role) {
      case 'Student':
        return {
          icon: GraduationCap,
          title: `Welcome back, ${user.name.split(' ')[0]}`,
          sub: 'Student credentials verified',
          destination: 'Opening your Student Dashboard...',
          color: 'text-blue-400',
          bg: 'bg-blue-500/10 border-blue-500/30',
          badge: 'Apna Campus Student Portal',
        };
      case 'Faculty':
        return {
          icon: BookOpen,
          title: `Welcome back, ${user.name}`,
          sub: 'Faculty credentials authenticated',
          destination: 'Opening your Faculty Dashboard...',
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10 border-emerald-500/30',
          badge: 'Apna Campus Faculty Console',
        };
      case 'Admin':
        return {
          icon: ShieldAlert,
          title: 'Welcome back, Administrator',
          sub: 'Central Campus Administration authenticated',
          destination: 'Opening your Admin Dashboard...',
          color: 'text-purple-400',
          bg: 'bg-purple-500/10 border-purple-500/30',
          badge: 'Apna Campus Central Command',
        };
      case 'Warden':
        return {
          icon: Building,
          title: `Welcome back, Warden ${user.name.split(' ')[1] || user.name}`,
          sub: 'Hostel authority access cleared',
          destination: 'Opening your Hostel Dashboard...',
          color: 'text-amber-400',
          bg: 'bg-amber-500/10 border-amber-500/30',
          badge: 'Apna Campus Hostel Desk',
        };
      case 'Staff':
        return {
          icon: Wrench,
          title: `Welcome back, ${user.name.split(' ')[0]}`,
          sub: 'Facilities & operations access active',
          destination: 'Opening your Staff Dashboard...',
          color: 'text-cyan-400',
          bg: 'bg-cyan-500/10 border-cyan-500/30',
          badge: 'Apna Campus Operations Hub',
        };
    }
  };

  const config = getRoleConfig(user.role);
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A] text-white p-4 font-sans">
      {/* Background ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-600/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto text-center space-y-6">
        {/* Brand header */}
        <div className="flex justify-center">
          <Campus360Logo variant="horizontal" theme="dark" size="md" />
        </div>

        {/* Role Icon Card */}
        <div className="flex justify-center">
          <div className={`w-20 h-20 rounded-3xl ${config.bg} border flex items-center justify-center shadow-2xl relative`}>
            <Icon className={`w-10 h-10 ${config.color}`} />
            <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#0F172A] flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
        </div>

        {/* Greetings */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {config.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {config.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            {config.sub}
          </p>
        </div>

        {/* Destination message */}
        <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-center gap-2 text-xs font-semibold text-blue-300">
          <Sparkles className="w-4 h-4 text-blue-400 animate-spin" style={{ animationDuration: '3s' }} />
          <span>{config.destination}</span>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#2563EB] to-sky-400 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Loading Role Modules</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
