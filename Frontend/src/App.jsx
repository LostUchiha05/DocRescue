import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DocumentProvider } from './context/DocumentContext';
import { AppShell } from './components/layout/AppShell';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { UploadPage } from './pages/UploadPage';
import { ProcessingPage } from './pages/ProcessingPage';
import { ComparePage } from './pages/ComparePage';
import { ExtractedPage } from './pages/ExtractedPage';
import { ReviewPage } from './pages/ReviewPage';
import { SummaryPage } from './pages/SummaryPage';
import { FinalDataPage } from './pages/FinalDataPage';
import { ChatPage } from './pages/ChatPage';
import { ExportPage } from './pages/ExportPage';

export function App() {
  return (
    <DocumentProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/documents/upload" element={<UploadPage />} />
            <Route path="/upload" element={<Navigate to="/documents/upload" replace />} />
            <Route path="/processing" element={<ProcessingPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/extracted" element={<ExtractedPage />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="/summary" element={<SummaryPage />} />
            <Route path="/final" element={<FinalDataPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/export" element={<ExportPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DocumentProvider>
  );
}

export default App;
