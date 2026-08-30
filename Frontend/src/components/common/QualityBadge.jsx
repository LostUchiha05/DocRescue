import React from 'react';

export const QualityBadge = ({ score, statusText }) => {
  const num = Number(score) || 0;

  let color = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let dot = 'bg-emerald-500';
  let text = statusText || (num >= 80 ? 'Good' : num >= 60 ? 'Fair' : 'Poor');

  if (num < 55) {
    color = 'bg-rose-50 text-rose-700 border-rose-200';
    dot = 'bg-rose-500';
  } else if (num < 75) {
    color = 'bg-amber-50 text-amber-700 border-amber-200';
    dot = 'bg-amber-500';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${color}`}>
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      <span>{num}%</span>
      <span className="font-normal opacity-85">— {text}</span>
    </span>
  );
};
