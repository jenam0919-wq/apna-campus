import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PrivateDataToggleProps {
  value?: string | null;
  maskType?: 'phone' | 'email' | 'highly_sensitive' | 'address';
  fallback?: string;
  className?: string;
}

export const PrivateDataToggle: React.FC<PrivateDataToggleProps> = ({ 
  value, 
  maskType = 'highly_sensitive', 
  fallback = 'Not Available',
  className = ''
}) => {
  const [isRevealed, setIsRevealed] = useState(false);

  // Clear visible state on unmount
  useEffect(() => {
    return () => setIsRevealed(false);
  }, []);

  if (!value) {
    return <span className={className}>{fallback}</span>;
  }

  const getMaskedValue = () => {
    if (maskType === 'phone') {
      // ******1234
      return '******' + value.slice(-4);
    }
    if (maskType === 'email') {
      // m******@gmail.com
      const parts = value.split('@');
      if (parts.length !== 2) return '••••••••';
      const local = parts[0];
      const domain = parts[1];
      return local.charAt(0) + '******@' + domain;
    }
    if (maskType === 'address') {
      // e.g. H.No 123...
      return value.substring(0, 5) + '******';
    }
    // highly_sensitive
    return '••••••••';
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className="font-mono tracking-wide">
        {isRevealed ? value : getMaskedValue()}
      </span>
      <button
        onClick={() => setIsRevealed(!isRevealed)}
        className="text-slate-400 hover:text-blue-600 transition-colors focus:outline-none"
        aria-label={isRevealed ? 'Hide private data' : 'Show private data'}
        title={isRevealed ? 'Hide' : 'Reveal'}
        type="button"
      >
        {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
};
