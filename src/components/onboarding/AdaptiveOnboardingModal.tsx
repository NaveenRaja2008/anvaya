'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { EntrepreneurProfile } from '@/types/domain';
import { useTranslation } from '@/i18n/context';
import { SUPPORTED_LANGUAGES, SupportedLanguageCode } from '@/i18n/languages';

interface AdaptiveOnboardingModalProps {
  initialProfile: EntrepreneurProfile;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (profileData: any) => Promise<void>;
}

export const AdaptiveOnboardingModal: React.FC<AdaptiveOnboardingModalProps> = ({
  initialProfile,
  isOpen,
  onClose,
  onSubmit
}) => {
  const { t, language, setLanguage, languageInfo } = useTranslation();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: initialProfile.name,
    district: initialProfile.location.district,
    subDistrictOrBlock: initialProfile.location.subDistrictOrBlock,
    villageOrTown: initialProfile.location.villageOrTown,
    state: initialProfile.location.state,
    capitalAvailable: initialProfile.capitalAvailable,
    hasHomeWorkspace: initialProfile.assets.hasHomeWorkspace,
    workspaceAreaSqFt: initialProfile.assets.workspaceAreaSqFt || 200,
    hasTwoWheeler: initialProfile.assets.hasTwoWheeler,
    hasFourWheelerOrCommercialVehicle: initialProfile.assets.hasFourWheelerOrCommercialVehicle,
    skills: initialProfile.skills.join(', '),
    workExperienceYears: initialProfile.workExperienceYears,
    experienceDescription: initialProfile.experienceDescription,
    riskPreference: initialProfile.riskPreference,
    timeAvailabilityHoursPerDay: initialProfile.timeAvailabilityHoursPerDay,
    hasBusinessIdea: initialProfile.hasBusinessIdea,
    initialIdeaDescription: initialProfile.initialIdeaDescription || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const skillsArray = formData.skills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      await onSubmit({
        name: formData.name,
        district: formData.district,
        subDistrictOrBlock: formData.subDistrictOrBlock,
        villageOrTown: formData.villageOrTown,
        state: formData.state,
        capitalAvailable: Number(formData.capitalAvailable),
        assets: {
          hasLand: false,
          hasHomeWorkspace: formData.hasHomeWorkspace,
          workspaceAreaSqFt: formData.hasHomeWorkspace ? Number(formData.workspaceAreaSqFt) : 0,
          hasCommercialSpace: false,
          hasTwoWheeler: formData.hasTwoWheeler,
          hasFourWheelerOrCommercialVehicle: formData.hasFourWheelerOrCommercialVehicle,
          hasColdStorageAccess: false,
          hasPowerBackup: false,
          machineryOwned: []
        },
        skills: skillsArray.length > 0 ? skillsArray : ['Food preparation'],
        workExperienceYears: Number(formData.workExperienceYears),
        experienceDescription: formData.experienceDescription,
        interests: ['Agro food processing'],
        timeAvailabilityHoursPerDay: Number(formData.timeAvailabilityHoursPerDay),
        familySupport: true,
        labourAvailability: 'FAMILY',
        transportAccess: formData.hasTwoWheeler || formData.hasFourWheelerOrCommercialVehicle,
        storageAccess: formData.hasHomeWorkspace,
        existingInfrastructure: formData.hasHomeWorkspace
          ? [`${formData.workspaceAreaSqFt} sq ft workspace`]
          : [],
        preferredBusinessType: ['FOOD_PROCESSING'],
        riskPreference: formData.riskPreference,
        hasBusinessIdea: formData.hasBusinessIdea,
        initialIdeaDescription: formData.initialIdeaDescription
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {t('onboarding.badge')}
              </span>
              <span className="text-xs text-slate-400">SIH 2026</span>
            </div>
            <h2 className="text-base font-black text-slate-900 dark:text-white mt-1">
              {t('onboarding.title', { step })}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick in-modal language switch without losing form state */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg px-2 py-1 border border-slate-200 dark:border-slate-700">
              <Globe className="h-3.5 w-3.5 text-slate-500" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguageCode)}
                className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
                title="Switch language without losing form answers"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="text-slate-900 dark:text-slate-100">
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleNext} className="space-y-4 text-xs">
          {/* Step 1: Location & Available Capital */}
          {step === 1 && (
            <div className="space-y-3.5">
              <div>
                <label className="font-bold block mb-1">{t('onboarding.fullName')}</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-md border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">{t('onboarding.village')}</label>
                  <input
                    type="text"
                    required
                    value={formData.villageOrTown}
                    onChange={(e) => setFormData({ ...formData, villageOrTown: e.target.value })}
                    className="w-full rounded-md border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">{t('onboarding.district')}</label>
                  <input
                    type="text"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full rounded-md border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">{t('onboarding.availableCapital')}</label>
                <input
                  type="number"
                  min="5000"
                  max="1000000"
                  step="5000"
                  required
                  value={formData.capitalAvailable}
                  onChange={(e) =>
                    setFormData({ ...formData, capitalAvailable: Number(e.target.value) })
                  }
                  className="w-full rounded-md border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800 font-mono font-bold text-sm"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  {t('onboarding.capitalNotice')}
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Assets & Mobility (Adaptive Rules) */}
          {step === 2 && (
            <div className="space-y-3.5">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="font-bold block mb-1 text-slate-900 dark:text-white">
                  {t('onboarding.workspaceLabel')}
                </span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasHomeWorkspace}
                    onChange={(e) =>
                      setFormData({ ...formData, hasHomeWorkspace: e.target.checked })
                    }
                    className="accent-emerald-600 h-4 w-4"
                  />
                  <span>{t('onboarding.workspaceCheck')}</span>
                </label>

                {/* Adaptive follow-up: only ask size if home workspace exists */}
                {formData.hasHomeWorkspace && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <label className="text-[11px] font-semibold block mb-1">
                      {t('onboarding.workspaceArea')}
                    </label>
                    <input
                      type="number"
                      value={formData.workspaceAreaSqFt}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          workspaceAreaSqFt: Number(e.target.value)
                        })
                      }
                      className="w-32 rounded-md border border-slate-300 p-1.5 dark:border-slate-700 dark:bg-slate-800 font-mono"
                    />
                  </div>
                )}
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="font-bold block mb-1 text-slate-900 dark:text-white">
                  {t('onboarding.vehicleLabel')}
                </span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasTwoWheeler}
                    onChange={(e) =>
                      setFormData({ ...formData, hasTwoWheeler: e.target.checked })
                    }
                    className="accent-emerald-600 h-4 w-4"
                  />
                  <span>{t('onboarding.vehicleCheck')}</span>
                </label>
                <p className="text-[11px] text-slate-400 mt-1">
                  {t('onboarding.adaptiveVehicleNote')}
                </p>
              </div>

              <div>
                <label className="font-bold block mb-1">{t('onboarding.riskPreference')}</label>
                <select
                  value={formData.riskPreference}
                  onChange={(e) =>
                    setFormData({ ...formData, riskPreference: e.target.value as any })
                  }
                  className="w-full rounded-md border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800"
                >
                  <option value="LOW">{t('onboarding.riskConservative')}</option>
                  <option value="MEDIUM">{t('onboarding.riskBalanced')}</option>
                  <option value="HIGH">{t('onboarding.riskAggressive')}</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Skills & Vocational Experience */}
          {step === 3 && (
            <div className="space-y-3.5">
              <div>
                <label className="font-bold block mb-1">{t('onboarding.skillsLabel')}</label>
                <input
                  type="text"
                  required
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="e.g. Food preparation, grain sorting, packaging, retail sales"
                  className="w-full rounded-md border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">{t('onboarding.experienceYears')}</label>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    value={formData.workExperienceYears}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        workExperienceYears: Number(e.target.value)
                      })
                    }
                    className="w-full rounded-md border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">{t('onboarding.dailyHours')}</label>
                  <input
                    type="number"
                    min="2"
                    max="16"
                    value={formData.timeAvailabilityHoursPerDay}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        timeAvailabilityHoursPerDay: Number(e.target.value)
                      })
                    }
                    className="w-full rounded-md border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">{t('onboarding.experienceDesc')}</label>
                <textarea
                  rows={2}
                  value={formData.experienceDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, experienceDescription: e.target.value })
                  }
                  placeholder="Briefly describe your prior work history or trades..."
                  className="w-full rounded-md border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-900 dark:text-emerald-200 block">
                    {t('onboarding.existingIdeaQuestion')}
                  </span>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-300">
                    {t('onboarding.existingIdeaSubtext')}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.hasBusinessIdea}
                  onChange={(e) =>
                    setFormData({ ...formData, hasBusinessIdea: e.target.checked })
                  }
                  className="accent-emerald-600 h-5 w-5"
                />
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
              >
                {t('onboarding.backBtn')}
              </button>
            ) : (
              <div />
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-emerald-700 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-800 disabled:opacity-50"
            >
              {isSubmitting
                ? t('onboarding.recalculating')
                : step === 3
                ? t('onboarding.saveBtn')
                : t('onboarding.nextBtn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
