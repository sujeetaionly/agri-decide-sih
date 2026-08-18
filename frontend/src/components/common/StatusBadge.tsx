import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface StatusBadgeProps {
  status: 'live' | 'offline' | 'high-confidence';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const { isHindi } = useLanguage();

  if (status === 'live') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 ${className}`}>
        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
        <span>{isHindi ? 'लाइव मौसम डेटा' : 'Live Weather Sync'}</span>
      </div>
    );
  }

  if (status === 'offline') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-950 border border-amber-300 ${className}`}>
        <span className="material-symbols-outlined text-[16px] text-amber-700">offline_pin</span>
        <span>{isHindi ? 'ऑफलाइन सुरक्षित (No Internet Required)' : 'Saved Offline'}</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-secondary-container text-on-secondary-container ${className}`}>
      <span className="material-symbols-outlined text-[16px]">verified</span>
      <span>{isHindi ? 'उच्च विश्वसनीयता (High Confidence)' : 'High Confidence'}</span>
    </div>
  );
};
