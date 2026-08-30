import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocuments } from '../context/DocumentContext';
import {
  GitMerge,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ArrowRight,
  Sparkles,
  User,
  MapPin,
  Calendar,
  CreditCard,
  Zap,
  Check,
  Sliders
} from 'lucide-react';

export const SummaryPage = () => {
  const navigate = useNavigate();
  const {
    documents,
    applicantName,
    resolvedDob,
    isDobConflictResolved,
    resolveDobConflict,
    totalDocuments,
    totalFields,
    verifiedFields
  } = useDocuments();

  const [selectedCanonicalDob, setSelectedCanonicalDob] = useState('12/05/2002');
  const [customDobInput, setCustomDobInput] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleApplyResolution = (val) => {
    resolveDobConflict(val);
    setIsDrawerOpen(false);
  };

  const activeDob = resolvedDob || '12/05/2002';
  const consistencyScore = isDobConflictResolved ? 100 : 90;
  const overallReadiness = isDobConflictResolved ? 98 : 94;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Cross-Document Intelligence
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              ⭐ Hackathon Key Feature
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Consolidated multi-document applicant dossier, entity graph reconciliation, and automatic discrepancy detection.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/final')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-glow transition-all"
          >
            <span>Final Structured Data</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Discrepancy & Conflict Radar Box */}
      <div
        className={`p-5 rounded-2xl border transition-all ${
          isDobConflictResolved
            ? 'bg-emerald-50/50 border-emerald-200'
            : 'bg-amber-50/60 border-amber-200 shadow-subtle'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`p-2.5 rounded-xl shrink-0 ${
                isDobConflictResolved
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {isDobConflictResolved ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  {isDobConflictResolved
                    ? 'Cross-Document Conflict Resolved'
                    : 'Discrepancy Radar: Date of Birth Mismatch'}
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isDobConflictResolved
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-200/80 text-amber-900 border border-amber-300'
                  }`}
                >
                  {isDobConflictResolved ? 'Reconciled ✓' : 'Action Required ⚠'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {isDobConflictResolved ? (
                  <>
                    Date of Birth reconciled to canonical value:{' '}
                    <strong className="font-mono text-emerald-800">{activeDob}</strong> across all records.
                  </>
                ) : (
                  <>
                    Aadhaar specifies <strong className="font-mono text-slate-900">12/05/2002</strong> (96% conf) while PAN specifies <strong className="font-mono text-slate-900">12/05/2003</strong> (71% conf).
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className={`px-4 py-2 text-xs font-bold rounded-xl shadow-subtle transition-all ${
                isDobConflictResolved
                  ? 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'
                  : 'bg-amber-600 hover:bg-amber-700 text-white active:scale-95'
              }`}
            >
              {isDobConflictResolved ? 'Modify Resolution' : 'Resolve Conflict'}
            </button>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Consolidated Applicant Dossier & Verification Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Consolidated Dossier (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-subtle space-y-5">
            {/* Applicant Profile Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-subtle">
                {applicantName
                  ? applicantName
                      .split(' ')
                      .map(word => word[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()
                  : '--'}
              </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">{applicantName}</h2>
                  <p className="text-xs text-slate-400">KYC Applicant ID: #KYC-2026-84920</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Dossier Verified
              </span>
            </div>

            {/* Ingested Documents Badge Strip */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Correlated Documents ({totalDocuments})
              </span>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {documents.map((d) => (
                  <div
                    key={d.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-xs"
                  >
                    <FileCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div className="truncate">
                      <p className="font-semibold text-slate-900 truncate">{d.subType}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{d.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Consolidated Verified Entities Matrix */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Cross-Document Unified Entity Graph
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Full Name */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                    <User className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="font-semibold">Full Legal Name</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">
                  {applicantName || 'Awaiting document processing...'}
                  </p>
                  <p className="text-[10px] text-emerald-600 font-medium mt-1">
                    ✓ Matches across Aadhaar & PAN Card (100% agreement)
                  </p>
                </div>

                {/* Date of Birth */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="font-semibold">Date of Birth</span>
                  </div>
                  <p className="text-sm font-bold font-mono text-slate-900">{activeDob}</p>
                  <p
                    className={`text-[10px] font-medium mt-1 ${
                      isDobConflictResolved ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {isDobConflictResolved ? '✓ Canonical value confirmed' : '⚠ 1 discrepancy resolved'}
                  </p>
                </div>

                {/* Official Identifiers */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                    <CreditCard className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="font-semibold">Verified Identifiers</span>
                  </div>
                  <p className="font-mono font-bold text-slate-800 text-xs">
                    UID: XXXX XXXX 1234
                  </p>
                  <p className="font-mono font-bold text-slate-800 text-xs">
                    PAN: ABCDE1234F
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">Both identity checksums valid</p>
                </div>

                {/* Utility Validation */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                    <Zap className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="font-semibold">Utility Bill Reference</span>
                  </div>
                  <p className="font-mono font-bold text-slate-800 text-xs">
                    Acc: 028549102941 (MSEDCL)
                  </p>
                  <p className="font-mono text-slate-600 text-xs">Due: ₹2,840.00 (22/08/2026)</p>
                  <p className="text-[10px] text-emerald-600 mt-1">✓ Active proof of address (&lt; 90 days)</p>
                </div>
              </div>

              {/* Full Address Block */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="font-semibold">Consolidated Residential Address</span>
                </div>
                <p className="text-xs font-semibold text-slate-900 leading-relaxed">
                  Flat 402, Shivam Heights, Off Link Road, Andheri West, Mumbai, Maharashtra 400058
                </p>
                <p className="text-[10px] text-emerald-600 font-medium mt-1">
                  ✓ Address string alignment score: 98.4% between UIDAI and Electricity Utility
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Verification Readiness Score (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Verification Readiness
                </h3>
                <p className="text-xs text-slate-500">KYC Compliance Score</p>
              </div>
              <span className="text-2xl font-bold font-mono text-emerald-600">
                {overallReadiness}%
              </span>
            </div>

            {/* Breakdown List */}
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex items-center justify-between text-slate-700 mb-1">
                  <span>Document Quality Index</span>
                  <span className="font-mono font-bold">92%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[92%]" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-700 mb-1">
                  <span>Extraction Confidence</span>
                  <span className="font-mono font-bold">96%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[96%]" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-700 mb-1">
                  <span>Field Verification Rate</span>
                  <span className="font-mono font-bold">{Math.round((verifiedFields / Math.max(totalFields, 1)) * 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.round((verifiedFields / Math.max(totalFields, 1)) * 100)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-700 mb-1">
                  <span>Cross-Document Consistency</span>
                  <span className="font-mono font-bold">{consistencyScore}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${isDobConflictResolved ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${consistencyScore}%` }} />
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
              <p className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Ready for Finalization & Export
              </p>
              <p className="text-[11px] text-emerald-700 mt-1">
                Dossier passes automated fintech and banking onboarding thresholds.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Conflict Resolution Drawer / Modal */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <GitMerge className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Resolve Date of Birth Conflict</h3>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Select the canonical Date of Birth value to establish across all enterprise records and reports:
            </p>

            <div className="space-y-2.5">
              {/* Option 1: Aadhaar */}
              <label
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedCanonicalDob === '12/05/2002'
                    ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="dob-option"
                    checked={selectedCanonicalDob === '12/05/2002'}
                    onChange={() => setSelectedCanonicalDob('12/05/2002')}
                    className="accent-indigo-600"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900 font-mono">12/05/2002 (Aadhaar Card)</p>
                    <p className="text-[11px] text-emerald-600 font-medium">⭐ Recommended (96% Confidence • UIDAI Primary)</p>
                  </div>
                </div>
              </label>

              {/* Option 2: PAN */}
              <label
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedCanonicalDob === '12/05/2003'
                    ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="dob-option"
                    checked={selectedCanonicalDob === '12/05/2003'}
                    onChange={() => setSelectedCanonicalDob('12/05/2003')}
                    className="accent-indigo-600"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900 font-mono">12/05/2003 (PAN Card)</p>
                    <p className="text-[11px] text-amber-600 font-medium">71% OCR Confidence on Year Digit</p>
                  </div>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApplyResolution(selectedCanonicalDob)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-subtle"
              >
                Apply Canonical Resolution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
