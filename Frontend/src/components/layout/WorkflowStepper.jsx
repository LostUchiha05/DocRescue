import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Upload, Cpu, SplitSquareVertical, Layers, CheckSquare, GitMerge, Table, Check } from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';

export const WorkflowStepper = () => {
  const location = useLocation();
  const { totalDocuments, needsReviewFields, isDobConflictResolved } = useDocuments();

  const steps = [
    { number: 1, to: '/documents/upload', label: 'Upload', icon: Upload, completed: totalDocuments > 0 },
    { number: 2, to: '/processing', label: 'Process', icon: Cpu, completed: totalDocuments > 0 },
    { number: 3, to: '/compare', label: 'Compare', icon: SplitSquareVertical, completed: totalDocuments > 0 },
    { number: 4, to: '/extracted', label: 'Extract', icon: Layers, completed: totalDocuments > 0 },
    { number: 5, to: '/review', label: 'Review', icon: CheckSquare, completed: needsReviewFields === 0 },
    { number: 6, to: '/summary', label: 'Reconcile', icon: GitMerge, completed: isDobConflictResolved },
    { number: 7, to: '/final', label: 'Finalize', icon: Table, completed: isDobConflictResolved && needsReviewFields === 0 },
  ];

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-2.5 overflow-x-auto shadow-subtle">
      <div className="max-w-7xl mx-auto flex items-center justify-between min-w-[720px] gap-2">
        {steps.map((step, idx) => {
          const isActive = location.pathname === step.to;
          const Icon = step.icon;

          return (
            <React.Fragment key={step.to}>
              <NavLink
                to={step.to}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 shadow-subtle'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : step.completed
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {step.completed && !isActive ? (
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  ) : (
                    step.number
                  )}
                </div>
                <span>{step.label}</span>
              </NavLink>

              {idx < steps.length - 1 && (
                <div className="h-[1px] flex-1 bg-slate-200 mx-1" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
