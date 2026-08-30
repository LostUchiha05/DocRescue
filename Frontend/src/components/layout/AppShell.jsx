import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { WorkflowStepper } from './WorkflowStepper';
import { ToastContainer } from '../common/ToastContainer';
import { DemoWalkthroughModal } from '../common/DemoWalkthroughModal';

export const AppShell = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const location = useLocation();

  const isLandingPage = location.pathname === '/';

  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <ToastContainer />
        <DemoWalkthroughModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
        <Outlet context={{ onOpenGuide: () => setIsGuideOpen(true) }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      <ToastContainer />
      <DemoWalkthroughModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      {/* Persistent Sidebar */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          onToggleMobile={() => setIsMobileOpen(true)}
          onOpenGuide={() => setIsGuideOpen(true)}
        />
        <WorkflowStepper />

        {/* Dynamic Route View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet context={{ onOpenGuide: () => setIsGuideOpen(true) }} />
          </div>
        </main>
      </div>
    </div>
  );
};
