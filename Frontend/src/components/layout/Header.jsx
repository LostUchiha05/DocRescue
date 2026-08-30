import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useDocuments } from '../../context/DocumentContext';
import {
  Menu,
  Sparkles,
  RotateCcw,
  Search,
  Bell,
  HelpCircle,
  Shield,
  Layers,
  ChevronRight
} from 'lucide-react';

export const Header = ({ onToggleMobile, onOpenGuide }) => {
  const { loadSampleCase, clearWorkspace, totalDocuments, needsReviewFields } = useDocuments();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  // Generate breadcrumb from pathname
  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Document Operations';
    if (path.includes('/upload')) return 'Add Documents';
    if (path === '/processing') return 'Processing Pipeline';
    if (path === '/compare') return 'Document Comparison';
    if (path === '/extracted') return 'Extraction Workspace';
    if (path === '/review') return 'Review Queue';
    if (path === '/summary') return 'Cross-Document Intelligence';
    if (path === '/final') return 'Final Structured Data';
    if (path === '/chat') return 'Ask Your Documents';
    if (path === '/export') return 'Export Center';
    return 'Document Intelligence';
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200">
      <div className="px-4 lg:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left Side: Mobile toggle + Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobile}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-800">Workspace</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
              {getBreadcrumb()}
            </span>
          </div>
        </div>

        {/* Right Side: Demo Presets, Actions, User */}
        <div className="flex items-center gap-2.5">
          {/* Load Demo KYC Case Button */}
          <button
            onClick={loadSampleCase}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-semibold rounded-lg shadow-subtle transition-all active:scale-95"
            title="Load sample Aadhaar, PAN, and Utility Bill"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            <span>Load Sample Case</span>
          </button>

          {/* Reset Workspace */}
          <button
            onClick={clearWorkspace}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
            title="Clear all documents in workspace"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Clear</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-200 hidden sm:block mx-1" />

          {/* Hackathon Guide Modal Button */}
          <button
            onClick={onOpenGuide}
            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Hackathon Evaluation Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {needsReviewFields > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900">Workspace Activity</span>
                  <span className="text-[10px] text-slate-400">Live Engine</span>
                </div>
                <div className="space-y-2 py-2 text-xs">
                  {needsReviewFields > 0 ? (
                    <div className="p-2 bg-amber-50 rounded-lg border border-amber-200 text-amber-900">
                      <p className="font-semibold">⚠ Human Review Required</p>
                      <p className="text-[11px] text-amber-700 mt-0.5">{needsReviewFields} fields need verification before export.</p>
                    </div>
                  ) : (
                    <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900">
                      <p className="font-semibold">✓ Ready for Finalization</p>
                      <p className="text-[11px] text-emerald-700 mt-0.5">All extracted entities are verified.</p>
                    </div>
                  )}
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-slate-600 text-[11px]">
                    <span className="font-medium text-slate-900">3 Documents Ingested</span> (Aadhaar, PAN, Electricity Bill).
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Secure Environment Tag */}
          <div className="hidden md:flex items-center gap-1.5 pl-2 text-[11px] font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure Workspace</span>
          </div>
        </div>
      </div>
    </header>
  );
};
