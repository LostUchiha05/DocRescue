import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useDocuments } from '../../context/DocumentContext';
import {
  LayoutDashboard,
  Upload,
  Cpu,
  SplitSquareVertical,
  Layers,
  CheckSquare,
  GitMerge,
  Table,
  MessageSquareText,
  Download,
  Settings,
  HelpCircle,
  Shield,
  FileCheck,
  ChevronRight,
  Database
} from 'lucide-react';

export const Sidebar = ({ isMobileOpen, setIsMobileOpen, onOpenGuide }) => {
  const { documents, needsReviewFields, totalDocuments } = useDocuments();
  const location = useLocation();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { to: '/documents/upload', label: 'Upload Documents', icon: Upload, badge: totalDocuments > 0 ? totalDocuments : null },
    { to: '/processing', label: 'Processing Pipeline', icon: Cpu, badge: null },
    { to: '/compare', label: 'Document Comparison', icon: SplitSquareVertical, badge: null },
    { to: '/extracted', label: 'Extracted Fields', icon: Layers, badge: null },
    { to: '/review', label: 'Review Queue', icon: CheckSquare, badge: needsReviewFields > 0 ? `${needsReviewFields} Flagged` : null, badgeColor: 'bg-amber-500 text-white' },
    { to: '/summary', label: 'Cross-Doc Intelligence', icon: GitMerge, badge: '⭐' },
    { to: '/final', label: 'Final Structured Data', icon: Table, badge: null },
    { to: '/chat', label: 'Ask Your Documents', icon: MessageSquareText, badge: 'AI' },
    { to: '/export', label: 'Export Center', icon: Download, badge: null },
  ];

  const content = (
    <div className="flex flex-col h-full bg-slate-950 text-slate-300 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white tracking-tight text-base">DOCUMENT RESCUE</span>
            </div>
            <p className="text-[10px] text-indigo-400 font-medium tracking-wider uppercase">AI Document Intelligence</p>
          </div>
        </NavLink>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Workspace
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600/90 text-white font-semibold shadow-subtle'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                    }`
                  }
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* System & Support */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            System & Guidance
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => {
                onOpenGuide();
                if (setIsMobileOpen) setIsMobileOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Hackathon Guide & Checklist</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            </button>
            <NavLink
              to="/export"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 transition-all"
            >
              <Database className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>API & Webhook Schema</span>
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Footer / System Status */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-slate-200">System Operational</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">v1.0-ai</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            <span>KYC Workspace</span>
            <span className="font-mono text-indigo-300">#DEMO-01</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-72 h-full z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
