import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { NewWorkflowModal } from './components/workflows/NewWorkflowModal';
import { PlanReviewView } from './components/workflows/PlanReviewView';
import { ExecutionWorkspace } from './components/execution/ExecutionWorkspace';
import { ReportView } from './components/artifacts/ReportView';
import { EvaluationsPage } from './components/evaluations/EvaluationsPage';
import { NebiusStatusModal } from './components/nebius/NebiusStatusModal';
import { WorkflowRun, WorkflowPlan } from '@flowpilot/shared';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [activeRun, setActiveRun] = useState<WorkflowRun | null>(null);
  const [activePlan, setActivePlan] = useState<WorkflowPlan | null>(null);
  const [initialGoalPrompt, setInitialGoalPrompt] = useState<string>('');
  const [isNebiusModalOpen, setIsNebiusModalOpen] = useState<boolean>(false);

  const handleStartWorkflow = (goalPrompt?: string) => {
    if (goalPrompt) setInitialGoalPrompt(goalPrompt);
    setCurrentView('new_workflow');
  };

  const handlePlanReady = (run: WorkflowRun, plan: WorkflowPlan) => {
    setActiveRun(run);
    setActivePlan(plan);
    setCurrentView('plan_review');
  };

  const handleExecutionStarted = () => {
    setCurrentView('execution');
  };

  const handleViewReport = (runId: string) => {
    if (activeRun) {
      setActiveRun({ ...activeRun, id: runId });
    }
    setCurrentView('report');
  };

  const handleSelectRunFromDashboard = (runId: string) => {
    setActiveRun({ id: runId } as WorkflowRun);
    setCurrentView('execution');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 selection:bg-cyan-500 selection:text-black">
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onOpenNebiusModal={() => setIsNebiusModalOpen(true)}
      />

      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onStartWorkflow={handleStartWorkflow}
            onNavigate={(view) => setCurrentView(view)}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardPage
            onNewWorkflow={() => handleStartWorkflow()}
            onSelectRun={handleSelectRunFromDashboard}
            onSelectArtifact={handleViewReport}
          />
        )}

        {currentView === 'new_workflow' && (
          <NewWorkflowModal
            initialGoal={initialGoalPrompt}
            onPlanReady={handlePlanReady}
            onCancel={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'plan_review' && activeRun && activePlan && (
          <PlanReviewView
            run={activeRun}
            plan={activePlan}
            onExecutionStarted={handleExecutionStarted}
            onCancelled={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'execution' && activeRun && (
          <ExecutionWorkspace
            runId={activeRun.id}
            onViewReport={handleViewReport}
            onCancel={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'report' && activeRun && (
          <ReportView runId={activeRun.id} onBack={() => setCurrentView('execution')} />
        )}

        {currentView === 'evaluations' && <EvaluationsPage />}
      </main>

      <Footer />

      <NebiusStatusModal
        isOpen={isNebiusModalOpen}
        onClose={() => setIsNebiusModalOpen(false)}
      />
    </div>
  );
};
