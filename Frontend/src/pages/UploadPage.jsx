import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocuments } from '../context/DocumentContext';
import { QualityBadge } from '../components/common/QualityBadge';
import {
  Upload,
  FileText,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Shield,
  FileCheck,
  RotateCcw,
  Sliders
} from 'lucide-react';

export const UploadPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    documents,
    addUploadedFile,
    removeDocument,
    loadSampleCase,
    clearWorkspace,
    totalDocuments,
  } = useDocuments();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach(file => {
        addUploadedFile(file);
      });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach(file => {
        addUploadedFile(file);
      });
    }
  };

  const handleProcessDocuments = () => {
    console.log("PROCESS BUTTON CLICKED");
    navigate('/processing');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Add Documents</h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload one or more documents for quality analysis, image restoration, and adaptive schema extraction.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadSampleCase}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-semibold rounded-xl shadow-subtle transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            <span>Load Sample Case</span>
          </button>
          {documents.length > 0 && (
            <button
              onClick={clearWorkspace}
              className="inline-flex items-center gap-1 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-xl transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Drag and Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-8 sm:p-12 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]'
            : 'border-slate-300 hover:border-indigo-400 bg-white hover:bg-slate-50/50'
        } shadow-subtle`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 shadow-subtle">
          <Upload className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Drag & drop your documents here</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Support for multi-page identity cards, invoices, receipts, and government proofs in JPG, JPEG, PNG, or PDF formats.
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold border border-slate-200">
            Browse Files
          </span>
          <span className="text-slate-400">or use "Load Sample Case" above</span>
        </div>
      </div>

      {/* Uploaded Documents List with Quality Analysis */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Uploaded Documents ({totalDocuments})
          </h2>
          <span className="text-xs text-slate-400">
            Real-Time Quality Analysis & Enhancement Plan
          </span>
        </div>

        {documents.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-slate-500">
            <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-semibold">No files currently in upload queue.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Click "Load Sample Case" to test with standard degraded KYC files.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {documents.map((doc) => {
              const q = doc.quality || { overall: 70, blur: 70, brightness: 70, contrast: 70, skew: 0, crop: 'Good', notes: '' };
              const isLowQuality = q.overall < 60;

              return (
                <div
                  key={doc.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  {/* Left: Thumbnail & Doc Info */}
                  <div className="flex items-start gap-4 min-w-[240px]">
                    <div className="w-12 h-14 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-600 shrink-0 font-mono text-xs font-bold shadow-subtle">
                      <FileText className="w-5 h-5 text-indigo-600 mb-0.5" />
                      <span className="text-[9px] uppercase">{doc.format || 'IMG'}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{doc.name}</h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          {doc.subType}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{doc.size} • {doc.category} • Uploaded {doc.uploadedAt}</p>
                      {isLowQuality && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-700 font-medium">
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>⚠ Low image quality detected — Automated enhancement will engage during processing.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Middle: Document Quality Metrics Breakdown */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex-1 min-w-[280px]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-700">Pre-Processing Quality Radar</span>
                      <QualityBadge score={q.overall} statusText={q.status} />
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                      <div className="p-1.5 rounded bg-white border border-slate-100">
                        <p className="text-slate-400">Blur</p>
                        <p className="font-semibold text-slate-800 font-mono">{q.blur}%</p>
                      </div>
                      <div className="p-1.5 rounded bg-white border border-slate-100">
                        <p className="text-slate-400">Contrast</p>
                        <p className="font-semibold text-slate-800 font-mono">{q.contrast}%</p>
                      </div>
                      <div className="p-1.5 rounded bg-white border border-slate-100">
                        <p className="text-slate-400">Skew</p>
                        <p className="font-semibold text-slate-800 font-mono">{q.skew}°</p>
                      </div>
                      <div className="p-1.5 rounded bg-white border border-slate-100">
                        <p className="text-slate-400">Crop</p>
                        <p className="font-semibold text-slate-800">{q.crop}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center justify-end gap-2 shrink-0">
                    <button
                      onClick={() => removeDocument(doc.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Remove Document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Processing Action Bar */}
      {documents.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              Ready to execute AI Restoration & Extraction Pipeline
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {totalDocuments} documents staged for quality analysis, deskewing, entity mapping, and reconciliation.
            </p>
          </div>
         <button
            onClick={handleProcessDocuments}
            disabled={isProcessing}
            className={`inline-flex items-center justify-center gap-2 px-6 py-3 text-white text-xs font-bold rounded-xl shadow-glow transition-all ${
            isProcessing
              ? 'bg-slate-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95'
            }`}
            >
            <span>
            {isProcessing ? 'Processing...' : 'Process Documents'}
            </span>

            {isProcessing ? (
            <RotateCcw className="w-4 h-4 animate-spin" />
            ) : (
            <ArrowRight className="w-4 h-4" />
            )}
            </button>
        </div>
      )}
    </div>
  );
};
