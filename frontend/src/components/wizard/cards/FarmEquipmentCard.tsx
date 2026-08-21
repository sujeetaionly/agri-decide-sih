import React from 'react';
import { useWizard } from '../../../context/WizardContext';
import { useLanguage } from '../../../context/LanguageContext';
import { triggerHaptic } from '../../../lib/utils';
import { speakText } from '../../../lib/speech';

interface EquipmentOption {
  id: string;
  titleKey: string;
  descKey: string;
  icon: string;
  savingsBadge: string;
  savingsColor: string;
}

const EQUIPMENT_OPTIONS: EquipmentOption[] = [
  {
    id: 'TRACTOR',
    titleKey: 'equipmentTractor',
    descKey: 'equipmentTractorDesc',
    icon: 'agriculture',
    savingsBadge: 'जुताई में ₹2,500 बचत/एकड़',
    savingsColor: 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
  },
  {
    id: 'PUMP',
    titleKey: 'equipmentPump',
    descKey: 'equipmentPumpDesc',
    icon: 'water_drop',
    savingsBadge: 'सिंचाई खर्च में ₹600 बचत/एकड़',
    savingsColor: 'bg-sky-50 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800/60',
  },
  {
    id: 'SPRAYER',
    titleKey: 'equipmentSprayer',
    descKey: 'equipmentSprayerDesc',
    icon: 'pest_control',
    savingsBadge: 'छिड़काव में ₹800 बचत/एकड़',
    savingsColor: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
  },
  {
    id: 'HARVESTER',
    titleKey: 'equipmentHarvester',
    descKey: 'equipmentHarvesterDesc',
    icon: 'precision_manufacturing',
    savingsBadge: 'मड़ाई में ₹1,500 बचत/एकड़',
    savingsColor: 'bg-purple-50 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
  },
  {
    id: 'MANUAL_TOOLS',
    titleKey: 'equipmentManual',
    descKey: 'equipmentManualDesc',
    icon: 'handyman',
    savingsBadge: 'मानक CACP किराया दर',
    savingsColor: 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700',
  },
];

export const FarmEquipmentCard: React.FC = () => {
  const { farmData, updateFarmData, nextCard, prevCard } = useWizard();
  const { language, t } = useLanguage();

  const selectedEquipments = farmData.equipments || [];
  const isSelectedAny = selectedEquipments.length > 0;

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

  const handleAudio = () => {
    triggerHaptic('light');
    const count = selectedEquipments.length;
    const msg = count > 0
      ? `${t('cardEquipmentTitle')}। आपने ${count} उपकरण चुने हैं।`
      : `${t('cardEquipmentTitle')}। ${t('cardEquipmentSub')}`;
    speakText(msg, language);
  };

  const handleContinue = () => {
    // If none selected, default to MANUAL_TOOLS (Rent)
    if (!isSelectedAny) {
      updateFarmData({ equipments: ['MANUAL_TOOLS'] });
    }
    triggerHaptic('success');
    nextCard();
  };

  const handleBack = () => {
    triggerHaptic('light');
    prevCard();
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Question Title & Category Header with Audio */}
      <div className="space-y-2 pt-1 pb-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
            {t('cardEquipmentCategory')}
          </span>
          <button
            type="button"
            onClick={handleAudio}
            aria-label={t('listen')}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary hover:bg-primary/15 active:scale-95 transition-all cursor-pointer shadow-none"
          >
            <span className="material-symbols-outlined text-base">volume_up</span>
            <span>{t('listen')}</span>
          </button>
        </div>

        <h2 className="text-2xl font-black font-headline text-stone-900 dark:text-stone-100 leading-snug">
          {t('cardEquipmentTitle')}
        </h2>

        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium leading-relaxed">
          {t('cardEquipmentSub')}
        </p>
      </div>

      {/* Multi-Select Equipment List */}
      <div className="space-y-3">
        {EQUIPMENT_OPTIONS.map((item) => {
          const isSelected = selectedEquipments.includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => handleToggleEquipment(item.id)}
              className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex items-start gap-3.5 active:scale-[0.99] shadow-xs ${
                isSelected
                  ? 'bg-primary/5 border-primary dark:bg-primary/20 dark:border-primary shadow-sm ring-2 ring-primary/20'
                  : 'bg-white dark:bg-[#1E231B] border-stone-300 dark:border-stone-700 hover:border-primary/40'
              }`}
            >
              {/* Category Icon */}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                }`}
              >
                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
              </div>

              {/* Text & Savings Badge */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-black text-stone-900 dark:text-stone-100 font-headline leading-tight">
                    {t(item.titleKey)}
                  </h3>
                  <div
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                      isSelected
                        ? 'border-primary bg-primary text-white shadow-xs'
                        : 'border-stone-400 dark:border-stone-600'
                    }`}
                  >
                    {isSelected && (
                      <span className="material-symbols-outlined text-sm font-bold">check</span>
                    )}
                  </div>
                </div>

                {/* Savings Pill Tag */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${item.savingsColor}`}
                  >
                    <span className="material-symbols-outlined text-xs">savings</span>
                    <span>{item.savingsBadge}</span>
                  </span>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                  {t(item.descKey)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inline Pill Action Buttons (Tight to Card) */}
      <div className="pt-4 pb-4 flex items-center justify-center gap-3 max-w-[300px] mx-auto w-full">
        <button
          type="button"
          onClick={handleBack}
          className="h-13 min-h-[50px] px-6 rounded-full bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-extrabold text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shadow-2xs"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>{t('back')}</span>
        </button>

        <button
          type="button"
          onClick={handleContinue}
          className="flex-1 h-13 min-h-[50px] px-6 rounded-full bg-primary hover:bg-primary/95 text-white active:scale-95 cursor-pointer shadow-md font-extrabold text-sm transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
        >
          <span>{t('continue')}</span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
