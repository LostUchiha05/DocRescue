import React from 'react';
import { useDocuments } from '../../context/DocumentContext';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useDocuments();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isInfo = toast.type === 'info';

        const bg = isSuccess ? 'bg-slate-900 text-white border-slate-700' :
                   isWarning ? 'bg-amber-950 text-amber-50 border-amber-800' :
                   'bg-slate-900 text-white border-slate-700';

        const icon = isSuccess ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" /> :
                     isWarning ? <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" /> :
                     <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />;

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-xl border shadow-xl transition-all duration-300 ${bg}`}
          >
            <div className="flex items-start gap-3">
              {icon}
              <div>
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.message && (
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
