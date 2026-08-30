import React, { useState, useRef, useEffect } from 'react';
import { useDocuments } from '../context/DocumentContext';
import { PRESET_QUESTIONS } from '../data/mockResponses';
import {
  MessageSquareText,
  Send,
  Sparkles,
  Bot,
  User,
  FileText,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ChevronRight
} from 'lucide-react';

export const ChatPage = () => {
  const { chatMessages, isChatThinking, askAI, documents, applicantName } = useDocuments();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatThinking]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      askAI(inputText);
      setInputText('');
    }
  };

  const handleSelectPreset = (question) => {
    askAI(question);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ask Your Documents</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              ⭐ Grounded AI Assistant
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Query information extracted from {applicantName}'s Aadhaar, PAN, and Electricity bills with source document citations.
          </p>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          Suggested Questions
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {PRESET_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSelectPreset(q)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition-all shrink-0 shadow-subtle text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle flex flex-col h-[580px] overflow-hidden">
        {/* Chat Stream Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
          {chatMessages.map((msg) => {
            const isBot = msg.sender === 'assistant';

            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-subtle ${
                    isBot
                      ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white'
                      : 'bg-slate-900 text-white font-bold text-xs'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-2xl space-y-3 ${isBot ? 'text-left' : 'text-right'}`}>
                  <div
                    className={`p-4 rounded-2xl text-xs leading-relaxed inline-block ${
                      isBot
                        ? 'bg-slate-50 border border-slate-200/80 text-slate-800'
                        : 'bg-indigo-600 text-white font-medium shadow-subtle'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>

                    {/* Source Citations for Bot Responses */}
                    {isBot && msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-2 text-left">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <FileCheck className="w-3 h-3 text-indigo-500" />
                          Grounded Source Evidence ({msg.sources.length})
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {msg.sources.map((src, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-lg bg-white border border-slate-200 text-[11px] shadow-subtle space-y-1"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900 truncate">{src.doc}</span>
                                <span className="font-mono text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                  {src.confidence}% Conf
                                </span>
                              </div>
                              <p className="text-slate-500">
                                Field: <strong className="text-slate-700">{src.field}</strong>
                              </p>
                              <p className="font-mono text-slate-900 bg-slate-50 px-1.5 py-0.5 rounded text-[10px] truncate">
                                {src.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Discrepancy / Compliance Notes */}
                    {isBot && msg.notes && (
                      <div className="mt-2.5 p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium text-left flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{msg.notes}</span>
                      </div>
                    )}
                  </div>
                  <span className="block text-[10px] text-slate-400 px-1">{msg.timestamp}</span>
                </div>
              </div>
            );
          })}

          {/* Thinking Indicator */}
          {isChatThinking && (
            <div className="flex gap-3.5 items-start">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <span>Grounding query against extracted document index...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about the extracted document data (e.g. 'What is the date of birth?')..."
              className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-subtle"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isChatThinking}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-subtle transition-all flex items-center gap-1.5"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
