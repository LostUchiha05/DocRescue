import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocuments } from '../context/DocumentContext';
import { ConfidenceBadge } from '../components/common/ConfidenceBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  Table,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  MessageSquareText,
  Edit2,
  Check,
  X,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export const FinalDataPage = () => {
  const navigate = useNavigate();
  const {
    documents,
    updateField,
    totalDocuments,
    totalFields,
    verifiedFields,
    needsReviewFields,
    averageConfidence
  } = useDocuments();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocFilter, setSelectedDocFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [sortField, setSortField] = useState('docName'); // 'docName' | 'label' | 'confidence'
  const [sortOrder, setSortOrder] = useState('asc');

  const [editingKey, setEditingKey] = useState(null);
  const [editVal, setEditVal] = useState('');

  // Flatten all fields
  const allRows = documents.flatMap(doc =>
    (doc.fields || []).map(f => ({
      ...f,
      docId: doc.id,
      docName: doc.name,
      docSubType: doc.subType,
      docCategory: doc.category
    }))
  );

  // Filter rows
  const filteredRows = allRows.filter(row => {
    const matchesSearch =
      row.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.docName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.key.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDoc =
      selectedDocFilter === 'ALL' || row.docId === selectedDocFilter;

    const matchesStatus =
      selectedStatusFilter === 'ALL' ||
      (selectedStatusFilter === 'VERIFIED' && row.status === 'verified') ||
      (selectedStatusFilter === 'REVIEW' && row.status === 'needs_review');

    return matchesSearch && matchesDoc && matchesStatus;
  });

  // Sort rows
  const sortedRows = [...filteredRows].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === 'confidence') {
      return sortOrder === 'asc' ? a.confidence - b.confidence : b.confidence - a.confidence;
    }

    if (typeof aVal === 'string') {
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return 0;
  });

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleStartEdit = (row) => {
    setEditingKey(`${row.docId}-${row.id}`);
    setEditVal(row.value);
  };

  const handleSaveEdit = (docId, fieldId) => {
    updateField(docId, fieldId, editVal, true);
    setEditingKey(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Final Structured Data</h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete verified master dataset extracted across all submitted identity and address proof documents.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/chat')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-subtle transition-all"
          >
            <MessageSquareText className="w-3.5 h-3.5 text-indigo-500" />
            <span>Ask Documents</span>
          </button>
          <button
            onClick={() => navigate('/export')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-glow transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Data Center</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-subtle">
          <p className="text-xs text-slate-500 font-medium">Documents Processed</p>
          <p className="text-2xl font-bold text-slate-900 font-mono mt-1">{totalDocuments}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Aadhaar, PAN & Utility</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-subtle">
          <p className="text-xs text-slate-500 font-medium">Total Entities Extracted</p>
          <p className="text-2xl font-bold text-indigo-600 font-mono mt-1">{totalFields}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Across all dynamic schemas</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-subtle">
          <p className="text-xs text-slate-500 font-medium">Verified Fields</p>
          <p className="text-2xl font-bold text-emerald-600 font-mono mt-1">{verifiedFields}</p>
          <p className="text-[11px] text-emerald-600/80 font-medium mt-0.5">
            {totalFields > 0 ? `${Math.round((verifiedFields / totalFields) * 100)}% verified` : '100%'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-subtle">
          <p className="text-xs text-slate-500 font-medium">Average Confidence</p>
          <p className="text-2xl font-bold text-slate-900 font-mono mt-1">{averageConfidence}%</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Enterprise OCR Accuracy</p>
        </div>
      </div>

      {/* Master Data Filter & Search Toolbar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by field, value, document name, or schema key..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
          />
        </div>

        {/* Document Filter & Status Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedDocFilter}
            onChange={(e) => setSelectedDocFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Documents ({totalDocuments})</option>
            {documents.map(d => (
              <option key={d.id} value={d.id}>{d.subType}</option>
            ))}
          </select>

          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="VERIFIED">Verified Only</option>
            <option value="REVIEW">Needs Review Only</option>
          </select>
        </div>
      </div>

      {/* Master Structured Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider sticky top-0">
              <tr>
                <th
                  onClick={() => toggleSort('docName')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center gap-1">
                    <span>Document & Category</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('label')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center gap-1">
                    <span>Field Label</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Extracted Verified Value</th>
                <th
                  onClick={() => toggleSort('confidence')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center gap-1">
                    <span>Confidence</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {sortedRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No fields match the specified search or filter criteria.
                  </td>
                </tr>
              ) : (
                sortedRows.map((row) => {
                  const isEditing = editingKey === `${row.docId}-${row.id}`;

                  return (
                    <tr key={`${row.docId}-${row.id}`} className="hover:bg-slate-50/60 transition-colors">
                      {/* Document */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-900">{row.docSubType}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{row.docName}</p>
                      </td>

                      {/* Field Label */}
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-slate-900">{row.label}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{row.key}</p>
                      </td>

                      {/* Extracted Value */}
                      <td className="py-3.5 px-4 font-mono">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editVal}
                              onChange={(e) => setEditVal(e.target.value)}
                              className="px-2.5 py-1 text-xs border border-indigo-500 rounded bg-white"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveEdit(row.docId, row.id)}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingKey(null)}
                              className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="font-semibold text-slate-900 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                            {row.value}
                          </span>
                        )}
                      </td>

                      {/* Confidence */}
                      <td className="py-3.5 px-4">
                        <ConfidenceBadge score={row.confidence} size="sm" />
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={row.status} isEdited={row.isEdited} />
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleStartEdit(row)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Inline edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
