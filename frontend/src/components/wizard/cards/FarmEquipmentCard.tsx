import React from 'react';
import { useWizard } from '../../../context/WizardContext';
import { useLanguage } from '../../../context/LanguageContext';
import { triggerHaptic } from '../../../lib/utils';

interface EquipmentOption {
  id: string;
  titleKey: string;
  icon: string;
}

const EQUIPMENT_OPTIONS: EquipmentOption[] = [
  {
    id: 'TRACTOR',
    titleKey: 'equipmentTractor',
    icon: 'agriculture',
  },
  {
    id: 'PUMP',
    titleKey: 'equipmentPump',
    icon: 'water_drop',
  },
  {
    id: 'SPRAYER',
    titleKey: 'equipmentSprayer',
    icon: 'pest_control',
  },
  {
    id: 'HARVESTER',
    titleKey: 'equipmentHarvester',
    icon: 'precision_manufacturing',
  },
  {
    id: 'MANUAL_TOOLS',
    titleKey: 'equipmentManual',
    icon: 'handyman',
  },
];

export const FarmEquipmentCard: React.FC = () => {
  const { farmData, updateFarmData } = useWizard();
  const { t } = useLanguage();

  const selectedEquipments = farmData.equipments || [];

  const handleToggleEquipment = (id: string) => {
    triggerHaptic('medium');
    let nextSelected: string[];

    if (id === 'MANUAL_TOOLS') {
      // If manual tools selected, clear machinery
      nextSelected = selectedEquipments.includes('MANUAL_TOOLS') ? [] : ['MANUAL_TOOLS'];
    } else {
      // If machinery selected, remove MANUAL_TOOLS and toggle this machine
      const withoutManual = selectedEquipments.filter((e) => e !== 'MANUAL_TOOLS');
      if (withoutManual.includes(id)) {
        nextSelected = withoutManual.filter((e) => e !== id);
      } else {
        nextSelected = [...withoutManual, id];
      }
    }

    updateFarmData({ equipments: nextSelected });
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Question Title & Subtitle */}
      <div className="space-y-1.5 pt-1 pb-1">
        <h2 className="text-2xl font-black font-headline text-stone-900 dark:text-stone-100 leading-snug">
          {t('cardEquipmentTitle')}
        </h2>

        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium leading-relaxed">
          {t('cardEquipmentSub')}
        </p>
      </div>

      {/* Multi-Select Clean Equipment List */}
      <div className="space-y-2.5">
        {EQUIPMENT_OPTIONS.map((item) => {
          const isSelected = selectedEquipments.includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => handleToggleEquipment(item.id)}
              className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 active:scale-[0.99] shadow-2xs ${
                isSelected
                  ? 'bg-primary/5 border-primary dark:bg-primary/20 dark:border-primary shadow-xs ring-2 ring-primary/15'
                  : 'bg-white dark:bg-[#1E231B] border-stone-200 dark:border-stone-800 hover:border-primary/40'
              }`}
            >
              {/* Left: Icon + Title */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                </div>

                <h3 className="text-base font-black text-stone-900 dark:text-stone-100 font-headline leading-tight">
                  {t(item.titleKey)}
                </h3>
              </div>

              {/* Right: Checkbox */}
              <div
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                  isSelected
                    ? 'border-primary bg-primary text-white shadow-xs'
                    : 'border-stone-300 dark:border-stone-600 bg-transparent'
                }`}
              >
                {isSelected && (
                  <span className="material-symbols-outlined text-sm font-black leading-none">check</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
