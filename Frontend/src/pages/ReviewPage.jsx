import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocuments } from '../context/DocumentContext';
import { ConfidenceBadge } from '../components/common/ConfidenceBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  CheckSquare,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Edit3,
  Check,
  X,
  RotateCcw,
  ShieldCheck,
  Filter,
  FileText
} from 'lucide-react';

export const ReviewPage = () => {
  const navigate = useNavigate();
  const {
    documents,
    updateField,
    approveField,
    rejectField,
    approveAllHighConfidence,
    totalFields,
    verifiedFields,
    needsReviewFields
  } = useDocuments();

  const [activeFilter, setActiveFilter] = useState('needs_review'); // 'all' | 'needs_review' | 'low_confidence' | 'conflicts'
  const [editingId, setEditingId] = useState(null);
  const [editVal, setEditVal] = useState('');

  // Collect all fields across all docs with document reference
  const allFlattenedFields = documents.flatMap(doc =>
    (doc.fields || []).map(f => ({
      ...f,
      docId: doc.id,
      docName: doc.name,
      docSubType: doc.subType,
      docCategory: doc.category
    }))
  );

  const filteredFields = allFlattenedFields.filter(f => {
    if (activeFilter === 'needs_review') return f.status === 'needs_review';
    if (activeFilter === 'low_confidence') return f.confidence < 85;
    if (activeFilter === 'conflicts') return f.key === 'dob' || f.reason?.includes('mismatch');
    return true;
  });

  const progressPercentage = totalFields > 0 ? Math.round((verifiedFields / totalFields) * 100) : 100;

  const handleStartEdit = (f) => {
    setEditingId(f.id);
    setEditVal(f.value);
  };

  const handleSave = (docId, fieldId) => {
    updateField(docId, fieldId, editVal, true);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Review Queue</h1>
          <p className="text-xs text-slate-500 mt-1">
            Human-in-the-loop verification hub. Review flagged items, correct low-confidence OCR, and approve final values.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => approveAllHighConfidence(90)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold rounded-xl transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Approve All High Confidence (&gt;90%)</span>
          </button>
          <button
            onClick={() => navigate('/summary')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-glow transition-all"
          >
            <span>Cross-Doc Intelligence</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Verification Progress Tracker */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-slate-900">Verification Progress</span>
            <p className="text-xs text-slate-500 mt-0.5">
              {verifiedFields} of {totalFields} fields verified • {needsReviewFields} requiring supervisor check
            </p>
          </div>
          <span className="text-sm font-bold font-mono text-indigo-600">
            {progressPercentage}% Completed
          </span>
        </div>

        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveFilter('needs_review')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeFilter === 'needs_review'
                ? 'bg-amber-500 text-white shadow-subtle'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Needs Review ({needsReviewFields})</span>
          </button>

          <button
            onClick={() => setActiveFilter('conflicts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeFilter === 'conflicts'
                ? 'bg-indigo-600 text-white shadow-subtle'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <span>Cross-Doc Conflicts</span>
          </button>

          <button
            onClick={() => setActiveFilter('low_confidence')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeFilter === 'low_confidence'
                ? 'bg-slate-900 text-white shadow-subtle'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <span>Low Confidence (&lt;85%)</span>
          </button>

          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white shadow-subtle'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <span>All Fields ({totalFields})</span>
          </button>
        </div>

        <span className="text-xs text-slate-400 font-mono hidden md:block">
          Showing {filteredFields.length} entities
        </span>
      </div>

      {/* Verification Queue List */}
      {filteredFields.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center shadow-subtle animate-fadeIn">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">All Queue Items Verified!</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No pending fields under the "{activeFilter.replace('_', ' ')}" filter. Proceed to cross-document summary or final export.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
            >
              View All Master Fields
            </button>
            <button
              onClick={() => navigate('/summary')}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-subtle transition-all"
            >
              Go to Summary →
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFields.map((f) => {
            const isEditing = editingId === f.id;
            const isNeedsReview = f.status === 'needs_review';

            return (
              <div
                key={f.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isNeedsReview
                    ? 'bg-amber-50/30 border-amber-200 shadow-subtle'
                    : 'bg-white border-slate-200 shadow-subtle'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Document Source & Field Label */}
                  <div className="min-w-[240px]">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 font-mono">
                        {f.docSubType}
                      </span>
                      <span className="text-[11px] text-slate-400 truncate">{f.docName}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{f.label}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">Schema Key: {f.key}</p>
                  </div>

                  {/* Middle: Value / Editable Input */}
                  <div className="flex-1 max-w-lg">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editVal}
                          onChange={(e) => setEditVal(e.target.value)}
                          className="flex-1 px-3 py-2 text-xs font-mono border-2 border-indigo-500 rounded-xl focus:outline-none bg-white shadow-subtle"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSave(f.docId, f.id)}
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-subtle"
                        >
                          <Check className="w-4 h-4" /> Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-subtle">
                          <span className="font-mono text-sm font-bold text-slate-900 truncate">
                            {f.value}
                          </span>
                          <button
                            onClick={() => handleStartEdit(f)}
                            className="p-1 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors ml-2"
                            title="Edit value"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Reason / Flag notice */}
                        {f.reason && (
                          <p className="text-[11px] text-amber-700 mt-1.5 flex items-start gap-1 font-medium">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                            <span>{f.reason}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right: Confidence, Badges & Verification Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                    <div className="flex flex-col items-end gap-1">
                      <ConfidenceBadge score={f.confidence} size="sm" />
                      <StatusBadge status={f.status} isEdited={f.isEdited} />
                    </div>

                    <div className="flex items-center gap-1.5">
                      {f.status !== 'verified' ? (
                        <>
                          <button
                            onClick={() => approveField(f.docId, f.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-subtle transition-all active:scale-95"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => rejectField(f.docId, f.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                            title="Reject field"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(f)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl transition-colors"
                        >
                          Modify
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
