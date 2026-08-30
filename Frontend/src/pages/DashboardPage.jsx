import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDocuments } from '../context/DocumentContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { QualityBadge } from '../components/common/QualityBadge';
import { ConfidenceBadge } from '../components/common/ConfidenceBadge';
import {
  FileText,
  AlertTriangle,
  Clock,
  Percent,
  Upload,
  CheckSquare,
  MessageSquareText,
  Download,
  SplitSquareVertical,
  Layers,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  GitMerge
} from 'lucide-react';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const {
    documents,
    totalDocuments,
    totalFields,
    verifiedFields,
    needsReviewFields,
    averageConfidence,
    isDobConflictResolved,
    setActiveDocId,
    loadSampleCase
  } = useDocuments();

  const handleNavigateToDoc = (docId, route) => {
    setActiveDocId(docId);
    navigate(route);
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Document Operations</h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor document ingestion, quality scoring, dynamic extraction, and human verification queues.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/documents/upload"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-subtle transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Add Documents</span>
          </Link>
          <Link
            to="/review"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-subtle transition-all"
          >
            <CheckSquare className="w-3.5 h-3.5 text-amber-500" />
            <span>Review Queue ({needsReviewFields})</span>
          </Link>
        </div>
      </div>

      {/* Discrepancy / Conflict Alert Banner */}
      {!isDobConflictResolved && totalDocuments > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-subtle animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900">
                Cross-Document Intelligence Alert: Date of Birth Discrepancy Detected
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                Aadhaar lists <strong className="font-mono">12/05/2002</strong> while PAN lists <strong className="font-mono">12/05/2003</strong>. Please review and resolve canonical value.
              </p>
            </div>
          </div>
          <Link
            to="/summary"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-subtle shrink-0 transition-colors"
          >
            <GitMerge className="w-3.5 h-3.5" />
            <span>Resolve Conflict</span>
          </Link>
        </div>
      )}

      {/* Top 4 Operational Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Documents Ingested</span>
            <FileText className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2 font-mono">{totalDocuments}</p>
          <p className="text-[11px] text-slate-400 mt-1">Identity & Utility verification</p>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Needs Human Review</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2 font-mono">{needsReviewFields}</p>
          <p className="text-[11px] text-amber-600/80 mt-1 font-medium">
            {needsReviewFields > 0 ? 'Requires supervisor approval' : 'All fields verified'}
          </p>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Fields Extracted</span>
            <CheckSquare className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2 font-mono">
            {verifiedFields} / {totalFields}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {totalFields > 0 ? `${Math.round((verifiedFields / totalFields) * 100)}% verified` : '0%'}
          </p>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Average Confidence</span>
            <Percent className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2 font-mono">{averageConfidence}%</p>
          <p className="text-[11px] text-emerald-600 mt-1 font-medium">High Accuracy Tier</p>
        </div>
      </div>

      {/* Main Operational Table: Recent Documents */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Current Workspace Documents</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live status, quality indicators, and quick action shortcuts for each file.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
            Active Case: Rahul Sharma
          </span>
        </div>

        {documents.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">No Documents in Workspace</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Upload documents or load the sample KYC case to inspect extraction and quality enhancement.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={loadSampleCase}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-subtle"
              >
                Load Sample Case
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Document</th>
                  <th className="py-3 px-4">Type & Category</th>
                  <th className="py-3 px-4">Uploaded</th>
                  <th className="py-3 px-4">Quality Score</th>
                  <th className="py-3 px-4">Fields Status</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {documents.map((doc) => {
                  const docFields = doc.fields || [];
                  const needsReview = docFields.some(f => f.status === 'needs_review');
                  const docConfidence = docFields.length > 0
                    ? Math.round(docFields.reduce((a, b) => a + b.confidence, 0) / docFields.length)
                    : 90;

                  return (
                    <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Document Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold text-xs">
                            {doc.format || 'IMG'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 truncate max-w-[180px]">{doc.name}</p>
                            <p className="text-[11px] text-slate-400">{doc.size}</p>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-slate-900">{doc.subType}</p>
                        <p className="text-[11px] text-slate-400">{doc.category}</p>
                      </td>

                      {/* Uploaded */}
                      <td className="py-3.5 px-4 text-slate-500">{doc.uploadedAt}</td>

                      {/* Quality Score */}
                      <td className="py-3.5 px-4">
                        <QualityBadge score={doc.quality?.overall} statusText={doc.quality?.status} />
                      </td>

                      {/* Fields Status */}
                      <td className="py-3.5 px-4">
                        <ConfidenceBadge score={docConfidence} />
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={needsReview ? 'needs_review' : 'verified'} />
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleNavigateToDoc(doc.id, '/compare')}
                            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Compare Original vs Enhanced"
                          >
                            <SplitSquareVertical className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleNavigateToDoc(doc.id, '/extracted')}
                            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="View Extracted Fields"
                          >
                            <Layers className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/compare"
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-subtle transition-all group flex items-start gap-3"
        >
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform">
            <SplitSquareVertical className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">Document Comparison</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Interactive slider & canvas filters</p>
          </div>
        </Link>

        <Link
          to="/review"
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-subtle transition-all group flex items-start gap-3"
        >
          <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 group-hover:scale-105 transition-transform">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-600">Review Queue</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">{needsReviewFields} items need human check</p>
          </div>
        </Link>

        <Link
          to="/chat"
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-subtle transition-all group flex items-start gap-3"
        >
          <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 group-hover:scale-105 transition-transform">
            <MessageSquareText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">Ask Your Documents</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">AI chat with source citations</p>
          </div>
        </Link>

        <Link
          to="/export"
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-subtle transition-all group flex items-start gap-3"
        >
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600">Export Center</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Excel, CSV, JSON, PDF dossier</p>
          </div>
        </Link>
      </div>
    </div>
  );
};
