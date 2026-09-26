import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, CheckCircle2, Wifi } from 'lucide-react';

interface OfflineBannerProps {
  onRetry?: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ onRetry }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [retrying, setRetrying] = useState<boolean>(false);
  const [restoredToast, setRestoredToast] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setRestoredToast(true);
      setTimeout(() => setRestoredToast(false), 3000);
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const effectiveOffline = !isOnline || isSimulatedOffline;

  const handleManualRetry = () => {
    setRetrying(true);
    setTimeout(() => {
      setRetrying(false);
      if (isSimulatedOffline) {
        setIsSimulatedOffline(false);
      }
      if (onRetry) onRetry();
      setRestoredToast(true);
      setTimeout(() => setRestoredToast(false), 3000);
    }, 800);
  };

  return (
    <>
      {effectiveOffline && (
        <div className="bg-amber-600 text-white px-4 py-2.5 shadow-md flex items-center justify-between text-xs sm:text-sm animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <div className="p-1 rounded-full bg-amber-700/80">
              <WifiOff className="w-4 h-4 text-amber-200 animate-pulse" />
            </div>
            <div>
              <span className="font-bold">You're offline.</span>{' '}
              <span className="text-amber-100 hidden sm:inline">
                Some features may be temporarily unavailable. Viewing cached local timetable & profile.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualRetry}
              disabled={retrying}
              className="px-3 py-1 bg-white text-amber-800 hover:bg-amber-50 active:scale-95 font-bold rounded-lg text-xs shadow-xs flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${retrying ? 'animate-spin' : ''}`} />
              <span>{retrying ? 'Reconnecting...' : 'Retry'}</span>
            </button>
            <button
              onClick={() => setIsSimulatedOffline(false)}
              className="px-2 py-1 bg-amber-700 hover:bg-amber-800 text-white font-medium rounded-lg text-[11px]"
              title="Dismiss simulated offline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {restoredToast && (
        <div className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-50 bg-emerald-700 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <Wifi className="w-4 h-4 text-emerald-200" />
          <span>Connection restored! Apna Campus is online and synced.</span>
        </div>
      )}
    </>
  );
};
