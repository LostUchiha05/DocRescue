import React, { createContext, useContext, useState, useEffect } from 'react';
import { SAMPLE_DOCUMENTS, MOCK_PROCESSING_LOGS } from '../data/mockDocuments';
import { getAIResponseForQuery } from '../data/mockResponses';
import confetti from 'canvas-confetti';
const API_URL = "http://127.0.0.1:8000";

const DocumentContext = createContext();

const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/documents/upload`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Document processing failed");
  }

  const result = await response.json();

  console.log("BACKEND RESULT:", result);

  return result;
};

export const DocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState([]);
  const [activeDocId, setActiveDocId] = useState(null);
  const [applicantName, setApplicantName] = useState('');

  const [processedDocuments, setProcessedDocuments] = useState([]);
  
  // Cross-doc discrepancy state
  const [resolvedDob, setResolvedDob] = useState(null); // '12/05/2002' | '12/05/2003' | custom
  const [isDobConflictResolved, setIsDobConflictResolved] = useState(false);

  // Processing state
  const [processingState, setProcessingState] = useState({
    isProcessing: false,
    currentStepIndex: 0,
    progress: 0,
    logs: [],
    completed: false
  });

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Chat conversation state
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: "Hello! I am your Document Intelligence Assistant. I have indexed the 3 documents in this workspace (Aadhaar, PAN, and Electricity Bill). You can ask me any question regarding extracted entities, address matching, or flagged discrepancies.",
      timestamp: 'Just now',
      sources: []
    }
  ]);
  const [isChatThinking, setIsChatThinking] = useState(false);

  // Add toast helper
  const addToast = (type, title, message = '') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Load sample case
  const loadSampleCase = () => {
    setDocuments(JSON.parse(JSON.stringify(SAMPLE_DOCUMENTS)));
    setActiveDocId('doc-aadhaar');
    setResolvedDob(null);
    setIsDobConflictResolved(false);
    setProcessingState({
      isProcessing: false,
      currentStepIndex: 5,
      progress: 100,
      logs: MOCK_PROCESSING_LOGS,
      completed: true
    });
    addToast('success', 'Demo KYC Case Loaded', 'Loaded Aadhaar, PAN Card, and Utility Bill with real-world verification states.');
  };

  // Clear workspace
  const clearWorkspace = () => {
    setDocuments([]);
    setActiveDocId(null);
    setResolvedDob(null);
    setIsDobConflictResolved(false);
    setProcessingState({
      isProcessing: false,
      currentStepIndex: 0,
      progress: 0,
      logs: [],
      completed: false
    });
    addToast('info', 'Workspace Reset', 'All documents and cached states have been cleared.');
  };

  // Run simulated processing sequence
  const startProcessingSimulation = (onComplete) => {
    setProcessingState({
      isProcessing: true,
      currentStepIndex: 0,
      progress: 5,
      logs: [{ time: new Date().toLocaleTimeString(), stage: 'Init', message: 'Starting Document Intelligence Pipeline...' }],
      completed: false
    });

    const pipelineSteps = [
      { step: 0, prog: 20, log: MOCK_PROCESSING_LOGS[0] },
      { step: 1, prog: 38, log: MOCK_PROCESSING_LOGS[1] },
      { step: 2, prog: 55, log: MOCK_PROCESSING_LOGS[2] },
      { step: 3, prog: 72, log: MOCK_PROCESSING_LOGS[3] },
      { step: 4, prog: 88, log: MOCK_PROCESSING_LOGS[4] },
      { step: 5, prog: 96, log: MOCK_PROCESSING_LOGS[5] },
      { step: 6, prog: 100, log: MOCK_PROCESSING_LOGS[6] }
    ];

    pipelineSteps.forEach((s, idx) => {
      setTimeout(() => {
        setProcessingState(prev => ({
          ...prev,
          currentStepIndex: s.step,
          progress: s.prog,
          logs: [...prev.logs, s.log],
          isProcessing: idx < pipelineSteps.length - 1,
          completed: idx === pipelineSteps.length - 1
        }));

        if (idx === pipelineSteps.length - 1) {
          addToast('success', 'Processing Complete', 'All 3 documents successfully analyzed, enhanced, and mapped.');
          if (onComplete) onComplete();
        }
      }, (idx + 1) * 850);
    });
  };

  const convertResultToFields = (data, parentKey = '') => {
    const fields = [];
  
    Object.entries(data || {}).forEach(([key, value]) => {
      const fieldKey = parentKey
        ? `${parentKey}.${key}`
        : key;
  
      // Nested object
      if (
        value !== null &&
        typeof value === 'object' &&
        !Array.isArray(value)
      ) {
        fields.push(
          ...convertResultToFields(value, fieldKey)
        );
        return;
      }
  
      // Array
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (
            item !== null &&
            typeof item === 'object'
          ) {
            fields.push(
              ...convertResultToFields(
                item,
                `${fieldKey}[${index + 1}]`
              )
            );
          } else {
            fields.push({
              id: `field-${fieldKey}-${index}`,
              key: `${fieldKey}[${index + 1}]`,
              label: key,
              value: item ?? '',
              rawOcr: item ?? '',
              confidence: 95,
              status: 'verified',
              category: parentKey || 'Extracted Data',
              bbox: {
                x: 10,
                y: 10,
                w: 80,
                h: 10
              }
            });
          }
        });
  
        return;
      }
  
      // Normal value
      fields.push({
        id: `field-${fieldKey}`,
        key: fieldKey,
        label: key
          .replace(/_/g, ' ')
          .replace(/\b\w/g, char => char.toUpperCase()),
        value: value ?? '',
        rawOcr: value ?? '',
        confidence: 95,
        status: 'verified',
        category: parentKey || 'Extracted Data',
        bbox: {
          x: 10,
          y: 10,
          w: 80,
          h: 10
        }
      });
    });
  
    return fields;
  };


  const processUploadedDocuments = async (onComplete) => {
    console.log("PROCESS FUNCTION CALLED");
  
    try {
      setProcessingState({
        isProcessing: true,
        currentStepIndex: 0,
        progress: 5,
        logs: [
          {
            time: new Date().toLocaleTimeString(),
            stage: 'Init',
            message: 'Starting Document Intelligence Pipeline...'
          }
        ],
        completed: false
      });
  
      const results = [];
  
      for (let i = 0; i < documents.length; i++) {
        const doc = documents[i];
  
        if (!doc.file) {
          console.warn(`No file found for ${doc.name}`);
          continue;
        }
  
        // Stage 1 - Starting
        setProcessingState(prev => ({
          ...prev,
          currentStepIndex: 0,
          progress: 10,
          logs: [
            ...prev.logs,
            {
              time: new Date().toLocaleTimeString(),
              stage: 'Quality Analysis',
              message: `Analyzing ${doc.name}...`
            }
          ]
        }));
  
        // Small delay so UI can visibly update
        await new Promise(resolve => setTimeout(resolve, 400));
  
        // Stage 2 - Processing
        setProcessingState(prev => ({
          ...prev,
          currentStepIndex: 1,
          progress: 25,
          logs: [
            ...prev.logs,
            {
              time: new Date().toLocaleTimeString(),
              stage: 'Image Enhancement',
              message: 'Preparing document for extraction...'
            }
          ]
        }));
  
        await new Promise(resolve => setTimeout(resolve, 400));
  
        // Stage 3 - OCR
        setProcessingState(prev => ({
          ...prev,
          currentStepIndex: 2,
          progress: 40,
          logs: [
            ...prev.logs,
            {
              time: new Date().toLocaleTimeString(),
              stage: 'OCR',
              message: `Extracting text from ${doc.name}...`
            }
          ]
        }));
  
        console.log("Sending file to backend:", doc.name);
  
        // ACTUAL BACKEND PROCESSING
        const result = await uploadDocument(doc.file);
  
        console.log("BACKEND RESULT:", result);
  
        // Stage 4 - Field Detection
        setProcessingState(prev => ({
          ...prev,
          currentStepIndex: 3,
          progress: 65,
          logs: [
            ...prev.logs,
            {
              time: new Date().toLocaleTimeString(),
              stage: 'Field Detection',
              message: 'Detecting document structure and fields...'
            }
          ]
        }));
  
        await new Promise(resolve => setTimeout(resolve, 400));
  
        // Stage 5 - Confidence
        setProcessingState(prev => ({
          ...prev,
          currentStepIndex: 4,
          progress: 82,
          logs: [
            ...prev.logs,
            {
              time: new Date().toLocaleTimeString(),
              stage: 'Confidence Scoring',
              message: 'Validating extracted information...'
            }
          ]
        }));
  
        await new Promise(resolve => setTimeout(resolve, 400));
  
        const extractedFields = convertResultToFields(result.data);
  
        results.push({
          id: doc.id,
          name: doc.name,
          result: result.data,
          fields: extractedFields,
          downloads: result.downloads,
          // Convert backend relative URL into a complete URL
          // so the frontend can display/download the enhanced image.
          enhancedImageUrl: result.downloads?.enhanced
            ? `${API_URL}${result.downloads.enhanced}`
            : null
        });
  
        // Stage 6 - Cross document
        setProcessingState(prev => ({
          ...prev,
          currentStepIndex: 5,
          progress: 95,
          logs: [
            ...prev.logs,
            {
              time: new Date().toLocaleTimeString(),
              stage: 'Cross-document Analysis',
              message: `Finished analysis of ${doc.name}.`
            }
          ]
        }));
      }
  
      // Save processed documents
      setProcessedDocuments(results);
  
      // Update documents with backend data
      setDocuments(prevDocs =>
        prevDocs.map(doc => {
          const processed = results.find(
            result => result.id === doc.id
          );
  
          if (!processed) {
            return doc;
          }
  
          return {
            ...doc,
            fields: processed.fields,
            extractedData: processed.result,
            downloads: processed.downloads,
            enhancedImageUrl: processed.downloads?.enhanced
              ? `${API_URL}${processed.downloads.enhanced}`
              : null,
            documentType:
              processed.result?.document_type || doc.subType
          };
        })
      );
  
      // COMPLETE
      setProcessingState(prev => ({
        ...prev,
        isProcessing: false,
        currentStepIndex: 5,
        progress: 100,
        completed: true,
        logs: [
          ...prev.logs,
          {
            time: new Date().toLocaleTimeString(),
            stage: 'Complete',
            message: 'All documents processed successfully.'
          }
        ]
      }));
  
      addToast(
        'success',
        'Processing Complete',
        `${results.length} document(s) processed successfully.`
      );
  
      if (onComplete) {
        onComplete(results);
      }
  
      return results;
  
    } catch (error) {
  
      console.error('DOCUMENT PROCESSING ERROR:', error);
  
      setProcessingState(prev => ({
        ...prev,
        isProcessing: false,
        completed: false,
        logs: [
          ...prev.logs,
          {
            time: new Date().toLocaleTimeString(),
            stage: 'Error',
            message: error.message
          }
        ]
      }));
  
      addToast(
        'error',
        'Processing Failed',
        error.message
      );
  
      throw error;
    }
  };
  // Update field value
  const updateField = (docId, fieldId, newValue, markVerified = true) => {
    setDocuments(prevDocs =>
      prevDocs.map(doc => {
        if (doc.id !== docId) return doc;
        return {
          ...doc,
          fields: doc.fields.map(f => {
            if (f.id !== fieldId) return f;
            return {
              ...f,
              value: newValue,
              status: markVerified ? 'verified' : f.status,
              confidence: markVerified ? Math.max(f.confidence, 96) : f.confidence,
              isEdited: true,
              editedAt: new Date().toLocaleTimeString()
            };
          })
        };
      })
    );
    addToast('success', 'Field Updated', `Value set to "${newValue}" and marked verified.`);
  };

  // Approve single field
  const approveField = (docId, fieldId) => {
    setDocuments(prevDocs =>
      prevDocs.map(doc => {
        if (doc.id !== docId) return doc;
        return {
          ...doc,
          fields: doc.fields.map(f => {
            if (f.id !== fieldId) return f;
            return {
              ...f,
              status: 'verified',
              confidence: Math.max(f.confidence, 95)
            };
          })
        };
      })
    );
    addToast('success', 'Field Verified', 'Field approved and moved to verified status.');
  };

  // Reject single field
  const rejectField = (docId, fieldId) => {
    setDocuments(prevDocs =>
      prevDocs.map(doc => {
        if (doc.id !== docId) return doc;
        return {
          ...doc,
          fields: doc.fields.map(f => {
            if (f.id !== fieldId) return f;
            return {
              ...f,
              status: 'rejected'
            };
          })
        };
      })
    );
    addToast('warning', 'Field Rejected', 'Field flagged as rejected for compliance audit.');
  };

  // Batch approve all fields above confidence threshold
  const approveAllHighConfidence = (threshold = 90) => {
    let approvedCount = 0;
    setDocuments(prevDocs =>
      prevDocs.map(doc => ({
        ...doc,
        fields: doc.fields.map(f => {
          if (f.confidence >= threshold && f.status !== 'verified') {
            approvedCount++;
            return { ...f, status: 'verified' };
          }
          return f;
        })
      }))
    );

    // Subtle celebration
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#3B82F6', '#10B981', '#6366F1']
    });

    addToast('success', 'Batch Verification Applied', `Automatically verified high-confidence fields.`);
  };

  // Resolve cross-document DOB conflict
  const resolveDobConflict = (canonicalValue) => {
    setResolvedDob(canonicalValue);
    setIsDobConflictResolved(true);

    // Update PAN card field to match
    setDocuments(prevDocs =>
      prevDocs.map(doc => {
        if (doc.id === 'doc-pan') {
          return {
            ...doc,
            fields: doc.fields.map(f => {
              if (f.key === 'dob') {
                return {
                  ...f,
                  value: canonicalValue,
                  status: 'verified',
                  confidence: 98,
                  isEdited: true,
                  reason: 'Reconciled via Cross-Document Intelligence to canonical value'
                };
              }
              return f;
            })
          };
        }
        return doc;
      })
    );

    addToast('success', 'Conflict Resolved', `Date of Birth consolidated to canonical value "${canonicalValue}".`);
  };

  // Ask AI in Chat
  const askAI = (queryText) => {
    if (!queryText.trim()) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: 'Just now'
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsChatThinking(true);

    setTimeout(() => {
      const responseData = getAIResponseForQuery(queryText, documents, resolvedDob);
      const botMsg = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: responseData.answer,
        sources: responseData.sources,
        notes: responseData.notes,
        timestamp: 'Just now'
      };
      setChatMessages(prev => [...prev, botMsg]);
      setIsChatThinking(false);
    }, 600);
  };

  // Add custom uploaded document
  const addUploadedFile = (file) => {
    const isImage = file.type.startsWith('image/');
    const newDocId = `doc-custom-${Date.now()}`;
    const newDoc = {
      id: newDocId,
      name: file.name,
      file: file,
      category: 'Supporting Document',
      subType: file.name.includes('Aadhaar') ? 'Aadhaar Card' : file.name.includes('PAN') ? 'PAN Card' : 'General Document',
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      format: file.name.split('.').pop().toUpperCase() || 'PNG',
      uploadedAt: 'Just now',
      quality: {
        overall: 78,
        blur: 82,
        brightness: 75,
        contrast: 70,
        skew: 0.8,
        crop: 'Good',
        status: 'Good Quality',
        notes: 'Document successfully parsed with high resolution.'
      },
      improvements: {
        readability: '+76%',
        noiseReduction: '-85%',
        contrastBoost: '+90%',
        deskewApplied: '0.8° Normalized'
      },
      fields: [],

      extractedData:null,
      downloads:null
    };

      setDocuments(prev => [...prev, newDoc]);
      setActiveDocId(newDocId);
      addToast('success', 'Document Ingested', `File "${file.name}" uploaded and queued for processing.`);
  };

  // Remove document
  const removeDocument = (docId) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
    if (activeDocId === docId) {
      const remaining = documents.filter(d => d.id !== docId);
      setActiveDocId(remaining[0]?.id || null);
    }
    addToast('info', 'Document Removed', 'Document removed from current workspace.');
  };

  // Computed summary metrics
  const totalDocuments = documents.length;
  const allFields = documents.flatMap(d => d.fields || []);
  const totalFields = allFields.length;
  const verifiedFields = allFields.filter(f => f.status === 'verified').length;
  const needsReviewFields = allFields.filter(f => f.status === 'needs_review').length;
  const averageConfidence = totalFields > 0
    ? (allFields.reduce((acc, f) => acc + f.confidence, 0) / totalFields).toFixed(1)
    : 0;

  const activeDoc = documents.find(d => d.id === activeDocId) || documents[0] || null;

  return (
    <DocumentContext.Provider
      value={{
        documents,
        processedDocuments,
        activeDocId,
        setActiveDocId,
        activeDoc,
        applicantName,
        setApplicantName,
        resolvedDob,
        isDobConflictResolved,
        resolveDobConflict,
        processingState,
        startProcessingSimulation,
        processUploadedDocuments,
        toasts,
        addToast,
        removeToast,
        loadSampleCase,
        clearWorkspace,
        updateField,
        approveField,
        rejectField,
        approveAllHighConfidence,
        chatMessages,
        isChatThinking,
        askAI,
        addUploadedFile,
        removeDocument,
        totalDocuments,
        totalFields,
        verifiedFields,
        needsReviewFields,
        averageConfidence,
        uploadDocument
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => useContext(DocumentContext);
