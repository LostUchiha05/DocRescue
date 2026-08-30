import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocuments } from '../context/DocumentContext';
import { ConfidenceBadge } from '../components/common/ConfidenceBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { drawDocumentCanvas } from '../utils/canvasRenderer';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Eye,
  CheckSquare,
  Edit2,
  Check,
  X,
  Sparkles,
  Info
} from 'lucide-react';

export const ExtractedPage = () => {
  const navigate = useNavigate();
  const {
    documents,
    activeDocId,
    setActiveDocId,
    activeDoc,
    updateField,
    approveField
  } = useDocuments();

  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [editingFieldId, setEditingFieldId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const canvasRef = useRef(null);

  const currentDoc = activeDoc || documents[0];
  const fields = currentDoc?.fields || [];

  // Draw enhanced canvas
  useEffect(() => {
    if (canvasRef.current && currentDoc) {
      drawDocumentCanvas(canvasRef.current, currentDoc.id, 'enhanced');
    }
  }, [currentDoc]);

  const handleStartEdit = (field) => {
    setEditingFieldId(field.id);
    setEditValue(field.value);
  };

  const handleSaveEdit = (fieldId) => {
    updateField(currentDoc.id, fieldId, editValue, true);
    setEditingFieldId(null);
  };

  const handleCancelEdit = () => {
    setEditingFieldId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Extraction Workspace</h1>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic per-document schema entities, OCR bounding coordinates, and confidence levels.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/review')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-glow transition-all"
          >
            <span>Review & Verify Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Document Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {documents.map((doc) => (
          <button
            key={doc.id}
            onClick={() => {
              setActiveDocId(doc.id);
              setSelectedFieldId(null);
              setEditingFieldId(null);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              doc.id === activeDocId
                ? 'bg-slate-900 text-white shadow-subtle'
                : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
            }`}
          >
            <span>{doc.documentType || doc.subType || doc.name}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${doc.id === activeDocId ? 'bg-slate-800 text-indigo-300' : 'bg-slate-100 text-slate-500'}`}>
              {doc.fields?.length || 0} fields
            </span>
          </button>
        ))}
      </div>

      {/* 2-Column Layout: Document Viewer with Bounding Boxes on Left, Schema Fields on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Document Viewer & Bounding Box Coordinates */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              Document OCR Coordinate Plane
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">{currentDoc?.name}</span>
          </div>

          <div className="relative bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-xl flex items-center justify-center min-h-[460px] overflow-hidden">
            <div className="relative rounded-xl overflow-hidden shadow-2xl bg-white">
              <canvas
                ref={canvasRef}
                width={520}
                height={350}
                className="w-full h-auto max-w-[520px] block"
              />

              {/* Dynamic Bounding Box Overlay for Selected / Hovered Field */}
              {fields.map((f) => {
                const isSelected = selectedFieldId === f.id;
                const bbox = f.bbox || { x: 20, y: 20, w: 50, h: 10 };

                return (
                  <div
                    key={f.id}
                    onClick={() => setSelectedFieldId(f.id)}
                    className={`absolute rounded transition-all cursor-pointer ${
                      isSelected
                        ? 'border-2 border-indigo-500 bg-indigo-500/20 shadow-glow z-20'
                        : 'border border-blue-400/40 hover:border-indigo-400 hover:bg-indigo-400/10'
                    }`}
                    style={{
                      left: `${bbox.x}%`,
                      top: `${bbox.y}%`,
                      width: `${bbox.w}%`,
                      height: `${bbox.h}%`
                    }}
                    title={`${f.label}: ${f.value}`}
                  >
                    {isSelected && (
                      <span className="absolute -top-5 left-0 bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                        {f.label} ({f.confidence}%)
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <p className="text-xs text-slate-400 text-center">
            Hover or click on any field on the right to highlight its OCR spatial bounding box on the card.
          </p>
        </div>

        {/* Right Column: Dynamic Extracted Schema Fields */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Extracted Schema Fields ({fields.length})
            </h3>
            <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
              Schema: {currentDoc?.documentType || currentDoc?.subType}
            </span>
          </div>

          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
            {fields.map((f) => {
              const isSelected = selectedFieldId === f.id;
              const isEditing = editingFieldId === f.id;
              const isNeedsReview = f.status === 'needs_review';

              return (
                <div
                  key={f.id}
                  onClick={() => setSelectedFieldId(f.id)}
                  className={`p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-white border-indigo-500 shadow-md ring-1 ring-indigo-500'
                      : isNeedsReview
                      ? 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-subtle'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                        {f.category} • {f.key}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-0.5">{f.label}</h4>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <ConfidenceBadge score={f.confidence} size="sm" />
                      <StatusBadge status={f.status} isEdited={f.isEdited} />
                    </div>
                  </div>

                  {/* Value / Inline Edit Box */}
                  <div className="mt-2.5">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 px-3 py-1.5 text-xs font-mono border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50/30"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEdit(f.id)}
                          className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                          title="Save and Verify"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold font-mono text-slate-900 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/80 flex-1 truncate">
                          {f.value}
                        </p>
                        <div className="flex items-center gap-1 ml-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEdit(f);
                            }}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit value"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {f.status !== 'verified' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                approveField(currentDoc.id, f.id);
                              }}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors font-bold text-xs"
                              title="Approve field"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Flag reason note if low confidence or conflict */}
                  {f.reason && (
                    <div className="mt-2 text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{f.reason}</span>
                    </div>
                  )}

                  {/* Raw OCR snippet */}
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-100">
                    <span>Raw OCR: <code className="font-mono text-slate-500">{f.rawOcr || f.value}</code></span>
                    <span>BBox: [{f.bbox?.x}%, {f.bbox?.y}%]</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
