import React, { useState } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  Maximize2,
  Lock,
  Globe,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export type PreviewMode = 'fluid' | 'desktop' | 'tablet' | 'mobile';

interface DeviceSimulatorBarProps {
  currentMode: PreviewMode;
  onModeChange: (mode: PreviewMode) => void;
  currentPath?: string;
  onNavigatePath?: (path: string) => void;
}

export const DeviceSimulatorBar: React.FC<DeviceSimulatorBarProps> = ({
  currentMode,
  onModeChange,
  currentPath = '/login',
  onNavigatePath,
}) => {
  const [inputUrl, setInputUrl] = useState(currentPath);

  // Keep input in sync with currentPath changes
  React.useEffect(() => {
    setInputUrl(currentPath);
  }, [currentPath]);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onNavigatePath && inputUrl.trim()) {
      let target = inputUrl.trim();
      if (!target.startsWith('/')) target = '/' + target;
      onNavigatePath(target);
    }
  };

  return (
    <aside
      aria-label="Responsive Viewport Selector & URL Bar"
      className="bg-[#0F172A] text-white border-b border-slate-800 px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs sticky top-0 z-50 shadow-md"
    >
      {/* Brand & Live Path */}
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2563EB]"></span>
        </span>
        <span className="font-bold tracking-tight text-white hidden sm:inline">
          Apna Campus
        </span>
      </div>

      {/* Interactive Browser Address Bar for Direct URL Access Testing */}
      {onNavigatePath && (
        <form
          onSubmit={handleUrlSubmit}
          className="flex-1 max-w-md mx-2 flex items-center bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1 text-slate-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
        >
          <Lock className="w-3 h-3 text-emerald-400 shrink-0 mr-1.5" />
          <span className="text-[10px] text-slate-500 font-mono select-none hidden md:inline">https://campus360.edu</span>
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="/admin/dashboard, /student/dashboard..."
            className="flex-1 bg-transparent border-none outline-hidden font-mono text-[11px] text-white px-1"
          />
          <button
            type="submit"
            title="Go to URL (Test Direct URL Navigation)"
            className="text-slate-400 hover:text-white px-1.5 py-0.5 rounded hover:bg-slate-800 text-[10px] font-bold flex items-center gap-0.5 cursor-pointer"
          >
            <span>Go</span>
            <ArrowRight className="w-2.5 h-2.5" />
          </button>
        </form>
      )}

      {/* Viewport Selectors */}
      <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-700/80">
        <button
          onClick={() => onModeChange('fluid')}
          title="Auto Responsive — fits your browser window"
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
            currentMode === 'fluid'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Maximize2 className="w-3 h-3" />
          <span className="hidden xs:inline">Fluid</span>
        </button>

        <button
          onClick={() => onModeChange('desktop')}
          title="Desktop Preview (1440 × 900)"
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
            currentMode === 'desktop'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Monitor className="w-3 h-3" />
          <span className="hidden md:inline">1440px</span>
        </button>

        <button
          onClick={() => onModeChange('tablet')}
          title="Tablet Preview (768 × 1024)"
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all hidden sm:flex ${
            currentMode === 'tablet'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Tablet className="w-3 h-3" />
          <span>768px</span>
        </button>

        <button
          onClick={() => onModeChange('mobile')}
          title="Mobile Preview (390 × 844 iPhone/Android)"
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
            currentMode === 'mobile'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Smartphone className="w-3 h-3" />
          <span>390px</span>
        </button>
      </div>
    </aside>
  );
};
