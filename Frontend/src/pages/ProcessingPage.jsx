import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocuments } from '../context/DocumentContext';
import {
  Cpu,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Terminal,
  Layers,
  Sparkles,
  SplitSquareVertical,
  FileText
} from 'lucide-react';

export const ProcessingPage = () => {
  const navigate = useNavigate();

  const {
    documents,
    processingState,
    processUploadedDocuments,
    totalDocuments
  } = useDocuments();

  const processingStartedRef = useRef(false);

  useEffect(() => {
    if (
      !processingStartedRef.current &&
      documents.length > 0 &&
      !processingState.isProcessing &&
      !processingState.completed
    ) {
      processingStartedRef.current = true;

      console.log("STARTING DOCUMENT PROCESSING");

      processUploadedDocuments()
        .then((results) => {
          console.log("PROCESSING COMPLETED:", results);
        })
        .catch((error) => {
          console.error("PROCESSING FAILED:", error);
        });
    }
  }, [
    documents,
    processingState.isProcessing,
    processingState.completed,
    processUploadedDocuments
  ]);

  const pipelineStages = [
    { title: 'Quality Analysis', desc: 'Luminance, blur entropy & skew calculation' },
    { title: 'Image Enhancement', desc: 'Noise filtering, contrast boost & deskew matrix' },
    { title: 'OCR', desc: 'Multi-pass neural text recognition' },
    { title: 'Field Detection', desc: 'Tabular bounds & document type classifier' },
    { title: 'Confidence Scoring', desc: 'Statistical validation against checksum algorithms' },
    { title: 'Cross-document Analysis', desc: 'Discrepancy radar & entity conflict resolution' },
  ];

  const currentIdx = processingState.currentStepIndex;
  const isDone = processingState.completed;
  const overallProg = processingState.progress;

  // Document-specific progress
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Processing Your Documents</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time execution of neural image restoration, dynamic schema extraction, and cross-document reconciliation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => processUploadedDocuments()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-subtle transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Re-process Documents</span>
          </button>
          {isDone && (
            <button
              onClick={() => navigate('/compare')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-glow transition-all"
            >
              <span>Continue to Comparison</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Overall Progress Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Cpu className={`w-5 h-5 ${processingState.isProcessing ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isDone
                  ? 'All Documents Successfully Processed'
                  : `Processing ${Math.min(currentIdx + 1, totalDocuments)} of ${totalDocuments} documents`}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isDone
                  ? `${totalDocuments} document(s) processed successfully. Extracted data is ready for review.`
                  : 'Current Stage: ' + (pipelineStages[currentIdx]?.title || 'Finalizing...')}
              </p>
            </div>
          </div>
          <span className="text-xl font-bold font-mono text-indigo-600">
            {overallProg}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500 rounded-full transition-all duration-500 shadow-subtle"
            style={{ width: `${overallProg}%` }}
          />
        </div>
      </div>

      {/* Document-Specific Progress Cards */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Individual Document Pipeline Progress
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {documents.map((doc) => {
              const p = isDone ? 100 : overallProg;
            return (
              <div key={doc.id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-subtle space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="text-xs font-bold text-slate-900 truncate">{doc.name}</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-700">{p}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      p >= 90 ? 'bg-emerald-500' : p >= 60 ? 'bg-indigo-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${p}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                  <span>{doc.subType}</span>
                  <span className={p >= 90 ? 'text-emerald-600 font-semibold' : 'text-slate-500'}>
                    {p === 100 ? 'Completed ✓' : 'Processing...'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2-Column Grid: Pipeline Stages on Left, Engine Logs on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 6 Pipeline Stages */}
        <div className="lg:col-span-7 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Pipeline Execution Stages
          </h3>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle divide-y divide-slate-100 overflow-hidden">
            {pipelineStages.map((stage, idx) => {
              const isPassed = isDone || currentIdx > idx;
              const isCurrent = !isDone && currentIdx === idx;
              const isPending = !isDone && currentIdx < idx;

              return (
                <div
                  key={stage.title}
                  className={`p-3.5 sm:p-4 flex items-center justify-between transition-colors ${
                    isCurrent ? 'bg-indigo-50/50' : 'hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isPassed
                          ? 'bg-emerald-100 text-emerald-700'
                          : isCurrent
                          ? 'bg-indigo-600 text-white animate-pulse'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <div>
                      <h4
                        className={`text-xs font-bold ${
                          isCurrent
                            ? 'text-indigo-900'
                            : isPassed
                            ? 'text-slate-900'
                            : 'text-slate-500'
                        }`}
                      >
                        {stage.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{stage.desc}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isPassed
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : isCurrent
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isPassed ? 'Complete ✓' : isCurrent ? 'Processing ●' : 'Waiting ○'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Real-Time Engine Console Logs */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              Engine Stream Log
            </h3>
            <span className="text-[10px] font-mono text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              ● Live Stream
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 text-slate-300 font-mono text-[11px] border border-slate-800 shadow-xl h-[380px] overflow-y-auto space-y-2">
            <p className="text-slate-500">// Document Rescue Neural Processing Log Stream</p>
            <p className="text-indigo-400">// Ingestion engine v1.0.0 initialized</p>

            {processingState.logs.map((log, i) => (
              <div key={i} className="pt-1.5 border-t border-slate-900 leading-relaxed">
                <span className="text-slate-500">[{log.time}]</span>{' '}
                <span className="text-indigo-300 font-bold">[{log.stage}]</span>{' '}
                <span className="text-slate-200">{log.message}</span>
              </div>
            ))}

            {processingState.isProcessing && (
              <div className="flex items-center gap-2 text-indigo-400 pt-2 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span>Computing neural embeddings & binarization matrix...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom CTA to move to Comparison */}
      {isDone && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-subtle animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-xs text-emerald-900 font-medium">
              Extraction pipeline completed. Ready to inspect before/after image restoration and extracted field schemas.
            </p>
          </div>
          <button
            onClick={() => navigate('/compare')}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-glow transition-all"
          >
            <span>Continue to Comparison</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
