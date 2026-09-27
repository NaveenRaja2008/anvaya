'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/navigation/Navbar';
import { JourneyStepper, StageId } from '@/components/navigation/JourneyStepper';
import { OverviewDashboard } from '@/components/overview/OverviewDashboard';
import { DiscoverView } from '@/components/discover/DiscoverView';
import { ProveView } from '@/components/prove/ProveView';
import { SimulateView } from '@/components/simulate/SimulateView';
import { BreakView } from '@/components/break/BreakView';
import { StructureView } from '@/components/structure/StructureView';
import { ActView } from '@/components/act/ActView';
import { EvidenceRegisterView } from '@/components/evidence/EvidenceRegisterView';
import { AdaptiveOnboardingModal } from '@/components/onboarding/AdaptiveOnboardingModal';
import { HowAnvayaDecidedDrawer } from '@/components/transparency/HowAnvayaDecidedDrawer';
import { ExecutiveReportModal } from '@/components/report/ExecutiveReportModal';
import { AnvayaAssistantDrawer } from '@/components/assistant/AnvayaAssistantDrawer';
import { AnvayaAppState } from '@/storage/state-store';
import { ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AnvayaApp() {
  const [appState, setAppState] = useState<AnvayaAppState | null>(null);
  const [activeStage, setActiveStage] = useState<StageId>('OVERVIEW');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isTransparencyOpen, setIsTransparencyOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Initial state fetch
  const fetchState = async () => {
    try {
      const res = await fetch('/api/state');
      const data = await res.json();
      if (data.success && data.state) {
        setAppState(data.state);
        if (data.state.activeStage) {
          setActiveStage(data.state.activeStage);
        }
      }
    } catch (err) {
      console.error('Failed to load initial Anvaya state:', err);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  // 1-Click Launch / Reset Demo Journey
  const handleResetDemo = async () => {
    try {
      const res = await fetch('/api/state?action=reset_demo');
      const data = await res.json();
      if (data.success && data.state) {
        setAppState(data.state);
        setActiveStage('OVERVIEW');
        showNotification('✓ Full Demo Dataset Loaded: Ramesh Kumar • Millet Food Enterprise • Kuknoor, Koppal');
      }
    } catch (err) {
      console.error('Failed to reset demo:', err);
    }
  };

  // Select Opportunity
  const handleSelectOpportunity = async (oppId: string) => {
    try {
      const res = await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'select_opportunity', opportunityId: oppId })
      });
      const data = await res.json();
      if (data.success && data.state) {
        setAppState(data.state);
        showNotification('✓ Selected Opportunity bound to Digital Twin & Stress Engines');
      }
    } catch (err) {
      console.error('Failed to select opportunity:', err);
    }
  };

  // Onboarding Submission
  const handleOnboardingSubmit = async (profileData: any) => {
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      const data = await res.json();
      if (data.success && data.state) {
        setAppState(data.state);
        setActiveStage('DISCOVER');
        showNotification('✓ Profile updated and Reverse Opportunity Discovery re-calculated');
      }
    } catch (err) {
      console.error('Failed to submit onboarding:', err);
    }
  };

  // Add Validation Response
  const handleAddValidationResponse = async (responseData: any) => {
    try {
      const res = await fetch('/api/validation/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(responseData)
      });
      const data = await res.json();
      if (data.success) {
        await fetchState();
        showNotification('✓ Validation response recorded and demand metrics updated');
      }
    } catch (err) {
      console.error('Failed to add validation response:', err);
    }
  };

  // Update Simulation Inputs
  const handleUpdateSimulationInputs = async (inputs: any) => {
    try {
      const currentInputs = appState?.simulationInputs;
      if (!currentInputs) return;

      const merged = { ...currentInputs, ...inputs };
      const res = await fetch('/api/simulation/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged)
      });
      const data = await res.json();
      if (data.success) {
        await fetchState();
      }
    } catch (err) {
      console.error('Failed to update simulation:', err);
    }
  };

  // Apply Stress Shocks
  const handleApplyStressShocks = async (shocks: any) => {
    try {
      const currentShocks = appState?.stressShocks;
      if (!currentShocks) return;

      const merged = { ...currentShocks, ...shocks };
      const res = await fetch('/api/stress-test/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged)
      });
      const data = await res.json();
      if (data.success) {
        await fetchState();
        showNotification('⚡ Shocks applied: Digital Twin and Failure Autopsy recomputed');
      }
    } catch (err) {
      console.error('Failed to apply stress shocks:', err);
    }
  };

  const handleStageSelect = (stage: StageId) => {
    setActiveStage(stage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!appState) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Initializing ANVAYA Deterministic Intelligence Engines...
          </h2>
          <p className="text-xs text-slate-500">
            Pre-Loan Enterprise Intelligence • SIH 2026
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xl dark:bg-white dark:text-slate-900 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Header */}
      <Navbar
        onResetDemo={handleResetDemo}
        onOpenTransparency={() => setIsTransparencyOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        onToggleAssistant={() => setIsAssistantOpen(!isAssistantOpen)}
        isAssistantOpen={isAssistantOpen}
        activeStage={activeStage}
      />

      {/* Primary 6-Stage Journey Stepper */}
      <JourneyStepper
        activeStage={activeStage}
        onSelectStage={handleStageSelect}
        decisionState={appState.finalDecision.state}
        isBusinessBroken={appState.stressResult.isBusinessBroken}
      />

      {/* Main Content Body */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        {activeStage === 'OVERVIEW' && (
          <OverviewDashboard
            state={appState}
            onNavigate={handleStageSelect}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
          />
        )}

        {activeStage === 'DISCOVER' && (
          <DiscoverView
            state={appState}
            onSelectOpportunity={handleSelectOpportunity}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
            onProceedToProve={() => handleStageSelect('PROVE')}
          />
        )}

        {activeStage === 'PROVE' && (
          <ProveView
            state={appState}
            onAddResponse={handleAddValidationResponse}
            onProceedToSimulate={() => handleStageSelect('SIMULATE')}
          />
        )}

        {activeStage === 'SIMULATE' && (
          <SimulateView
            state={appState}
            onUpdateInputs={handleUpdateSimulationInputs}
            onProceedToBreak={() => handleStageSelect('BREAK')}
          />
        )}

        {activeStage === 'BREAK' && (
          <BreakView
            state={appState}
            onApplyShocks={handleApplyStressShocks}
            onProceedToStructure={() => handleStageSelect('STRUCTURE')}
          />
        )}

        {activeStage === 'STRUCTURE' && (
          <StructureView
            state={appState}
            onProceedToAct={() => handleStageSelect('ACT')}
          />
        )}

        {activeStage === 'ACT' && (
          <ActView
            state={appState}
            onOpenReport={() => setIsReportOpen(true)}
            onOpenTransparency={() => setIsTransparencyOpen(true)}
          />
        )}

        {activeStage === 'EVIDENCE' && (
          <EvidenceRegisterView items={appState.evidenceItems} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            <strong>ANVAYA</strong> — Pre-Loan Enterprise Intelligence System • Smart India Hackathon 2026
          </p>
          <p className="text-[11px] text-slate-400">
            "Test the business before the loan." • Modelled results depend on empirical evidence and deterministic equations.
          </p>
        </div>
      </footer>

      {/* Adaptive Onboarding Modal */}
      <AdaptiveOnboardingModal
        initialProfile={appState.profile}
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onSubmit={handleOnboardingSubmit}
      />

      {/* Technical Transparency Drawer ("How ANVAYA Decided") */}
      <HowAnvayaDecidedDrawer
        state={appState}
        isOpen={isTransparencyOpen}
        onClose={() => setIsTransparencyOpen(false)}
      />

      {/* Executive Report Modal */}
      <ExecutiveReportModal
        state={appState}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

      {/* AI Assistant Drawer */}
      <AnvayaAssistantDrawer
        state={appState}
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />
    </div>
  );
}
