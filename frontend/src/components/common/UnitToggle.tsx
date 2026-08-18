import React from 'react';
import { AreaUnit } from '@/types/wizard';
import { useLanguage } from '@/context/LanguageContext';

interface UnitToggleProps {
  value: AreaUnit;
  onChange: (unit: AreaUnit) => void;
}

export const UnitToggle: React.FC<UnitToggleProps> = ({ value, onChange }) => {
  const { isHindi } = useLanguage();

  return (
    <div className="inline-flex p-1 rounded-xl bg-surface-container-low border border-outline-variant/60">
      <button
        type="button"
        onClick={() => onChange('Acres')}
        className={`px-4 py-2 text-sm font-bold rounded-lg transition-all btn-tactile ${
          value === 'Acres'
            ? 'bg-primary text-on-primary shadow-sm'
            : 'text-on-surface hover:text-primary'
        }`}
      >
        {isHindi ? 'एकड़ (Acres)' : 'Acres'}
      </button>

      <button
        type="button"
        onClick={() => onChange('Hectares')}
        className={`px-4 py-2 text-sm font-bold rounded-lg transition-all btn-tactile ${
          value === 'Hectares'
            ? 'bg-primary text-on-primary shadow-sm'
            : 'text-on-surface hover:text-primary'
        }`}
      >
        {isHindi ? 'हेक्टेयर (Hectares)' : 'Hectares'}
      </button>
    </div>
  );
};
