import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDocuments } from '../context/DocumentContext';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  RefreshCw,
  Download,
  CheckCircle2,
  ArrowRight,
  SlidersHorizontal,
  Check
} from 'lucide-react';

export const ComparePage = () => {
  const navigate = useNavigate();

  const {
    documents,
    activeDocId,
    setActiveDocId,
    activeDoc
  } = useDocuments();

  const API_URL = "http://127.0.0.1:8000";

  const [sliderPos, setSliderPos] = useState(50);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const [filterMode, setFilterMode] = useState({
    binarize: false,
    contrast: true,
    sharpen: true,
    denoise: true,
    deskew: true
  });

  // Current document
  const currentDoc = activeDoc || documents[0];

  const enhancedImageUrl = currentDoc?.downloads?.enhanced
    ? `${API_URL}${currentDoc.downloads.enhanced}`
    : null;
  
  // Original uploaded file URL
  const [originalImageUrl, setOriginalImageUrl] = useState(null);

  useEffect(() => {
    if (!currentDoc?.file) {
      setOriginalImageUrl(null);
      return;
    }

    const url = URL.createObjectURL(currentDoc.file);

    setOriginalImageUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [currentDoc]);

  // Toggle enhancement controls
  const toggleFilter = (key) => {
    setFilterMode(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Download TXT / Excel
  const handleDownload = (type) => {
    if (!currentDoc?.downloads?.[type]) {
      console.error("Download not available:", type);
      return;
    }

    window.open(
      `${API_URL}${currentDoc.downloads[type]}`,
      "_blank"
    );
  };

  // Download enhanced image
  const handleDownloadEnhanced = async () => {
    if (!enhancedImageUrl) {
      console.error("Enhanced image not available");
      return;
    }

    try {
      // Fetch the image data into memory as a Blob to force a direct file save
      const response = await fetch(enhancedImageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `Enhanced_${currentDoc?.name || "document"}.png`;

      document.body.appendChild(link);
      link.click();

      // Clean up temporary DOM elements and Object URL memory
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Direct download failed, opening in new tab:", error);
      // Fallback: Opens image in a new tab so your main application page stays open
      window.open(enhancedImageUrl, "_blank");
    }
  };
  // Improvement values
  const improvements = currentDoc?.improvements || {
    readability: '+85%',
    noiseReduction: '-92%',
    contrastBoost: '+140%',
    deskewApplied: 'Corrected'
  };

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}

      <div className="flex items-center justify-between mb-6">
  {/* Left Header Title / Info */}
  <div>
    <h1 className="text-2xl font-bold text-slate-900">Document Comparison</h1>
    <p className="text-xs text-slate-500 mt-1">
      Compare the original uploaded document with Document Rescue's enhanced version.
    </p>
  </div>

  {/* Right Header Action Buttons */}
  <div className="flex items-center gap-2">
    {currentDoc?.downloads?.txt && (
      <a
        href={`${API_URL}${currentDoc.downloads.txt}`}
        download
        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-subtle transition-all cursor-pointer"
      >
        <Download className="w-3.5 h-3.5 text-slate-500" />
        <span>Download TXT</span>
      </a>
    )}

    {currentDoc?.downloads?.excel && (
      <a
        href={`${API_URL}${currentDoc.downloads.excel}`}
        download
        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-subtle transition-all cursor-pointer"
      >
        <Download className="w-3.5 h-3.5 text-slate-500" />
        <span>Download Excel</span>
      </a>
    )}

    <button
      onClick={handleDownloadEnhanced}
      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-subtle transition-all"
    >
      <Download className="w-3.5 h-3.5 text-slate-500" />
      <span>Download Enhanced</span>
    </button>

    <button
      onClick={() => navigate('/extracted')}
      className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-glow transition-all"
    >
      <span>Extracted Information</span>
      <ArrowRight className="w-3.5 h-3.5" />
    </button>
  </div>
</div>


      {/* ================= DOCUMENT TABS ================= */}

      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">

        {documents.map((doc) => (

          <button
            key={doc.id}
            onClick={() => setActiveDocId(doc.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              doc.id === activeDocId
                ? 'bg-slate-900 text-white shadow-subtle'
                : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
            }`}
          >

            <span>
              {doc.subType || doc.name}
            </span>

            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                doc.id === activeDocId
                  ? 'bg-slate-800 text-indigo-300'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {doc.quality?.overall ?? '--'}% Quality
            </span>

          </button>

        ))}

      </div>


      {/* ================= MAIN CONTENT ================= */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">


        {/* ================= COMPARISON ================= */}

        <div className="lg:col-span-8 space-y-3">


          {/* Controls */}

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-subtle flex flex-wrap items-center justify-between gap-3 text-xs">

            {/* Zoom / Rotation */}

            <div className="flex items-center gap-1">

              <button
                onClick={() =>
                  setZoom(prev => Math.min(prev + 0.15, 2))
                }
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <button
                onClick={() =>
                  setZoom(prev => Math.max(prev - 0.15, 0.7))
                }
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <button
                onClick={() =>
                  setRotation(prev => (prev + 90) % 360)
                }
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                title="Rotate 90°"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setZoom(1);
                  setRotation(0);
                }}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                title="Reset"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <span className="text-slate-400 font-mono text-[11px] ml-1">
                {Math.round(zoom * 100)}%
              </span>

            </div>


            {/* Slider */}

            <div className="flex items-center gap-2">

              <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                Original
              </span>

              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) =>
                  setSliderPos(Number(e.target.value))
                }
                className="w-36 accent-indigo-600 cursor-pointer"
              />

              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Enhanced
              </span>

            </div>

          </div>


          {/* ================= IMAGE COMPARISON ================= */}

          <div className="relative bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-2xl overflow-hidden min-h-[460px] flex items-center justify-center">

            <div
              className="relative rounded-xl overflow-hidden bg-slate-950 shadow-2xl"
              style={{
                width: '640px',
                height: '420px',
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transition: 'transform 0.2s ease'
              }}
            >

              {/* ================= ENHANCED IMAGE ================= */}

              {enhancedImageUrl ? (

              <img
                src={enhancedImageUrl}
                alt="Enhanced document"
                className="absolute inset-0 w-full h-full object-contain"
              />

              ) : (

                <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
                  Enhanced document not available
                </div>

              )}


              {/* ================= ORIGINAL IMAGE ================= */}

              <div
                className="absolute top-0 left-0 bottom-0 overflow-hidden z-10 border-r-2 border-indigo-500"
                style={{
                  width: `${sliderPos}%`
                }}
              >

                {originalImageUrl ? (

                  <img
                    src={originalImageUrl}
                    alt="Original document"
                    className="absolute top-0 left-0 max-w-none"
                    style={{
                      width: '640px',
                      height: '420px',
                      objectFit: 'contain'
                    }}
                  />

                ) : (

                  <div className="flex items-center justify-center w-full h-full text-white text-sm">
                    Original document not available
                  </div>

                )}

              </div>


              {/* ================= SLIDER HANDLE ================= */}

              <div
                className="absolute top-0 bottom-0 z-20 pointer-events-none"
                style={{
                  left: `${sliderPos}%`
                }}
              >

                <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2">

                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white shadow-xl border-2 border-white flex items-center justify-center text-xs font-bold">
                    ↔
                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* ================= ENHANCEMENT CONTROLS ================= */}

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-subtle flex flex-wrap items-center justify-between gap-2 text-xs">

            <span className="font-bold text-slate-700 flex items-center gap-1.5">

              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-500" />

              Enhancement Controls:

            </span>


            <div className="flex items-center gap-1.5 flex-wrap">

              {[
                'denoise',
                'contrast',
                'sharpen',
                'binarize',
                'deskew'
              ].map((f) => {

                const isActive = filterMode[f];

                return (

                  <button
                    key={f}
                    onClick={() => toggleFilter(f)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all flex items-center gap-1 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-subtle'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >

                    {isActive && (
                      <Check className="w-3 h-3" />
                    )}

                    <span>
                      {f}
                    </span>

                  </button>

                );

              })}

            </div>

          </div>

        </div>


        {/* ================= RIGHT METRICS ================= */}

        <div className="lg:col-span-4 space-y-4">

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle space-y-4">

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">

              <div>

                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Measurable Improvements
                </h3>

                <p className="text-xs text-slate-500">
                  {currentDoc?.subType || currentDoc?.name}
                </p>

              </div>

              <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                Good ✓
              </span>

            </div>


            {/* Readability */}

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">

              <div>

                <p className="text-xs font-semibold text-slate-700">
                  Readability
                </p>

                <p className="text-[11px] text-slate-400">
                  OCR token confidence gain
                </p>

              </div>

              <span className="text-sm font-bold text-emerald-600 font-mono">
                {improvements.readability}
              </span>

            </div>


            {/* Noise */}

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">

              <div>

                <p className="text-xs font-semibold text-slate-700">
                  Noise
                </p>

                <p className="text-[11px] text-slate-400">
                  Artifacts & specks removed
                </p>

              </div>

              <span className="text-sm font-bold text-indigo-600 font-mono">
                {improvements.noiseReduction}
              </span>

            </div>


            {/* Contrast */}

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">

              <div>

                <p className="text-xs font-semibold text-slate-700">
                  Contrast
                </p>

                <p className="text-[11px] text-slate-400">
                  Dynamic range boosted
                </p>

              </div>

              <span className="text-sm font-bold text-blue-600 font-mono">
                {improvements.contrastBoost}
              </span>

            </div>


            {/* Skew */}

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">

              <div>

                <p className="text-xs font-semibold text-slate-700">
                  Skew
                </p>

                <p className="text-[11px] text-slate-400">
                  Document alignment
                </p>

              </div>

              <span className="text-sm font-bold text-slate-900 font-mono">
                {improvements.deskewApplied}
              </span>

            </div>


            {/* Summary */}

            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-700">

              <p className="font-bold text-slate-900">
                Transformation Summary:
              </p>

              <div className="flex items-center gap-2 text-emerald-700">

                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />

                <span>
                  Improved readability
                </span>

              </div>

              <div className="flex items-center gap-2 text-emerald-700">

                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />

                <span>
                  Corrected orientation
                </span>

              </div>

              <div className="flex items-center gap-2 text-emerald-700">

                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />

                <span>
                  Enhanced contrast
                </span>

              </div>

              <div className="flex items-center gap-2 text-emerald-700">

                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />

                <span>
                  Reduced visual noise
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};