import React, { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { useDocuments } from '../context/DocumentContext';
import {
  FileCheck,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  GitMerge,
  MessageSquareText,
  Download,
  Eye,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { loadSampleCase } = useDocuments();
  const outletContext = useOutletContext();
  const onOpenGuide = outletContext?.onOpenGuide;

  const [sliderPos, setSliderPos] = useState(50);

  const handleLaunchDemo = () => {
    loadSampleCase();
    navigate('/documents/upload');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-glow">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white tracking-tight text-base">DOCUMENT RESCUE</span>
              <span className="ml-2 text-[10px] bg-indigo-500/20 text-indigo-300 font-semibold px-2 py-0.5 rounded-full border border-indigo-500/30">
                Enterprise AI
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onOpenGuide && (
              <button
                onClick={onOpenGuide}
                className="hidden sm:inline-flex text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-900 transition-colors"
              >
                Hackathon Guide
              </button>
            )}
            <Link
              to="/dashboard"
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-900 transition-colors"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLaunchDemo}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-glow transition-all active:scale-95"
            >
              Launch Live App <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-600/20 to-blue-600/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-indigo-300 mb-6 shadow-subtle">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Next-Gen Document Intelligence for KYC & Lending</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Turn Difficult Documents into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-emerald-400">
              Trusted, Structured Data.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Enhance blurry, tilted, and low-contrast document images. Extract adaptive schemas, reconcile cross-document mismatches, and export verified master data.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleLaunchDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-glow transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              Upload & Process Documents
            </button>
            <Link
              to="/compare"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 text-sm font-semibold rounded-xl border border-slate-800 transition-colors"
            >
              <Eye className="w-4 h-4 text-slate-400" />
              Explore Enhancement Slider
            </Link>
          </div>

          {/* Interactive Interactive Before/After Showcase */}
          <div className="mt-14 max-w-4xl mx-auto bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="ml-2 font-mono text-slate-400">pipeline_preview :: Aadhaar_Identity_Extraction</span>
              </div>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Readability +88% Enhanced
              </span>
            </div>

            {/* Simulated Interactive Before/After Card */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {/* Raw Input Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    🔴 Original Degraded Scan
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">Quality: 48% (Blur/Skew)</span>
                </div>
                <div className="p-4 rounded-lg bg-amber-950/20 border border-amber-900/30 text-xs text-amber-200/80 font-mono space-y-1.5 blur-[0.4px] rotate-[-1deg] opacity-75">
                  <p className="font-bold text-amber-100">GOVT 0F 1ND1A (U1DAI)</p>
                  <p>Nam : R@hu1 Sh@rma</p>
                  <p>D0B : 12/05/2002 [Uncl3ar]</p>
                  <p>Aadhaar: XXXX XXXX 1234</p>
                </div>
                <p className="text-[11px] text-slate-500 mt-3">
                  ⚠ Uneven lighting, 4.2° skew angle, low DPI scan.
                </p>
              </div>

              {/* Enhanced & Extracted Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    🟢 Restored & Structured Schema
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono">Confidence: 98%</span>
                </div>
                <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono space-y-1.5 shadow-subtle">
                  <p className="font-bold text-white">GOVERNMENT OF INDIA (UIDAI)</p>
                  <p className="text-emerald-300">Name: "Rahul Sharma" (98%)</p>
                  <p className="text-emerald-300">DOB: "12/05/2002" (96%)</p>
                  <p className="text-emerald-300">Aadhaar: "XXXX XXXX 1234" (97%)</p>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-indigo-300">
                  <span>✓ Deskew Corrected</span>
                  <span>✓ Binarized</span>
                  <span>✓ Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Grid */}
      <section className="py-16 bg-slate-900 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Engineered for Real-World Enterprise Workflows
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              From noisy mobile camera uploads to audited KYC approval queues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Smart Enhancement</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Adaptive threshold binarization, automatic deskew angle correction, and background noise removal.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Dynamic Schemas</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Per-document schemas that dynamically adjust fields for Aadhaar, PAN, passports, and utility bills.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <GitMerge className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Cross-Doc Intelligence ⭐</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Automatically flags conflicts between documents (e.g. Aadhaar vs PAN DOB mismatch) with 1-click resolution.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <MessageSquareText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Ask Your Documents ⭐</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Conversational AI grounded in your uploaded documents with source file citations and evidence cards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Step Process Roadmap */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">How Document Rescue Works</h2>
            <p className="text-xs text-slate-400 mt-2">The complete 5-step intelligence lifecycle</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { num: '01', title: 'Upload & Ingest', desc: 'Drag-and-drop batch scans with real-time quality scoring.' },
              { num: '02', title: 'AI Enhancement', desc: 'Deskew, denoise, and normalize contrast before OCR.' },
              { num: '03', title: 'Adaptive Extraction', desc: 'Map raw tokens into structured fields with confidence scores.' },
              { num: '04', title: 'Human Verification', desc: 'Audit queue for low-confidence items and cross-doc conflicts.' },
              { num: '05', title: 'Enterprise Export', desc: 'Download verified master data as Excel, CSV, JSON, or PDF.' },
            ].map((step) => (
              <div key={step.num} className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 text-left">
                <span className="text-2xl font-extrabold text-indigo-500/80 font-mono">{step.num}</span>
                <h4 className="text-sm font-bold text-white mt-2">{step.title}</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <footer className="mt-auto py-12 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-white">Ready to experience Document Rescue?</h3>
            <p className="text-xs text-slate-400 mt-1">
              Load the pre-configured sample KYC bundle with 1-click to test all platform features.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLaunchDemo}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-glow transition-all"
            >
              Start Live Demo
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
