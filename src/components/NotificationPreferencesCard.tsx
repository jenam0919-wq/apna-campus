import React, { useState } from 'react';
import { Bell, Lock, Check } from 'lucide-react';
import { NotificationSettings } from '../types/notice';
import { INITIAL_SETTINGS } from '../data/mockNotices';

interface NotificationPreferencesCardProps {
  onSettingsChange?: (settings: NotificationSettings) => void;
}

export const NotificationPreferencesCard: React.FC<NotificationPreferencesCardProps> = ({
  onSettingsChange,
}) => {
  const [settings, setSettings] = useState<NotificationSettings>(INITIAL_SETTINGS);

  const toggleOption = (key: keyof NotificationSettings) => {
    if (key === 'emergency') {
      // Emergency alerts are mandatory for campus safety
      return;
    }
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    if (onSettingsChange) onSettingsChange(updated);
  };

  const OPTIONS: { key: keyof NotificationSettings; label: string; locked?: boolean }[] = [
    { key: 'academic', label: 'Academic Notices' },
    { key: 'hostel', label: 'Hostel Notices' },
    { key: 'examination', label: 'Examination Notices' },
    { key: 'events', label: 'Events' },
    { key: 'emergency', label: 'Emergency Alerts', locked: true },
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3.5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-[#1677FF]" />
            <span>Notification Preferences</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Customize instant alert popups and email delivery
          </p>
        </div>
      </div>

      <div className="space-y-2.5 text-xs">
        {OPTIONS.map((item) => {
          const isEnabled = settings[item.key];

          return (
            <div
              key={item.key}
              className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">{item.label}</span>
                {item.locked && (
                  <span
                    className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-100/70 px-1.5 py-0.2 rounded font-medium"
                    title="Required for student safety"
                  >
                    <Lock className="w-2.5 h-2.5" />
                    Required
                  </span>
                )}
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={isEnabled}
                disabled={item.locked}
                onClick={() => toggleOption(item.key)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isEnabled ? 'bg-[#1677FF]' : 'bg-slate-300'
                } ${item.locked ? 'opacity-80 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    isEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* Delivery Channels */}
      <div className="pt-3 border-t border-slate-100 space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
          Dispatch Channels Active:
        </span>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2 rounded-xl bg-blue-50/70 border border-blue-200/60 text-blue-900 font-medium flex items-center justify-between">
            <span>📱 In-App Push</span>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">Active</span>
          </div>
          <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-emerald-900 font-medium flex items-center justify-between">
            <span>💬 SMS + WhatsApp</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">Active</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            try {
              const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(659, ctx.currentTime);
              osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
              gain.gain.setValueAtTime(0.15, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start();
              osc.stop(ctx.currentTime + 0.25);
            } catch {
              // ignore
            }
            if (onSettingsChange) {
              onSettingsChange({ ...settings });
            }
          }}
          className="w-full py-2 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-800 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
        >
          <span>🔔 Test Instant Sound & Notification Delivery</span>
        </button>
      </div>
    </div>
  );
};
