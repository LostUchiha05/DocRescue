import React from 'react';
import { X, Sparkles, CheckCircle2, FileText, ArrowRight, ShieldCheck, MessageSquare, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DemoWalkthroughModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">Hackathon Demo & Evaluation Guide</h3>
              <p className="text-xs text-slate-400">Document Rescue — AI Document Intelligence Platform</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-700">
          <div className="p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-100 text-sm text-indigo-900">
            <span className="font-semibold">🏆 Key Innovation:</span> Document Rescue transforms low-quality, blurry, tilted, dot-matrix documents into high-confidence verified data with multi-stage enhancement, dynamic per-document schemas, and automated cross-document reconciliation.
          </div>

          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recommended Presentation Flow</h4>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</div>
              <div>
                <p className="font-semibold text-slate-900">1-Click Sample KYC Ingestion (/documents/upload)</p>
                <p className="text-xs text-slate-500 mt-0.5">Click "Load Sample Case" to ingest degraded Aadhaar, skewed PAN, and low-contrast Utility Bill images.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</div>
              <div>
                <p className="font-semibold text-slate-900">Visual Quality & Enhancement Comparison (/compare)</p>
                <p className="text-xs text-slate-500 mt-0.5">Use the interactive before/after curtain slider and canvas enhancement filters to see real deskewing, binarization, and noise reduction.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</div>
              <div>
                <p className="font-semibold text-slate-900">Dynamic Schemas & Extraction Workspace (/extracted)</p>
                <p className="text-xs text-slate-500 mt-0.5">Observe how Aadhaar, PAN, and Electricity bills each dynamically adapt their schema fields and confidence scores.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">4</div>
              <div>
                <p className="font-semibold text-slate-900">Cross-Document Conflict Radar ⭐ (/summary)</p>
                <p className="text-xs text-slate-500 mt-0.5">Highlight the automated Date of Birth conflict detection (Aadhaar 12/05/2002 vs PAN 12/05/2003) and 1-click canonical resolution.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">5</div>
              <div>
                <p className="font-semibold text-slate-900">Ask Your Documents (Grounded AI Assistant) ⭐ (/chat)</p>
                <p className="text-xs text-slate-500 mt-0.5">Query the documents in natural language with source file citations and evidence cards.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500">Document Rescue v1.0.0 • College Hackathon Edition</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow transition-colors flex items-center gap-1.5"
          >
            Explore Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
