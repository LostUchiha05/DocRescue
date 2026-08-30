import React from 'react';

export const ConfidenceBadge = ({ score, size = 'md' }) => {
  const numScore = Number(score) || 0;
  
  let bg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let dot = 'bg-emerald-500';
  let label = 'High';

  if (numScore < 70) {
    bg = 'bg-rose-50 text-rose-700 border-rose-200';
    dot = 'bg-rose-500';
    label = 'Low';
  } else if (numScore < 90) {
    bg = 'bg-amber-50 text-amber-700 border-amber-200';
    dot = 'bg-amber-500';
    label = 'Review';
  }

  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs' 
    : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${bg} ${sizeClasses} shadow-subtle`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot} animate-pulse-subtle`} />
      <span>{numScore}%</span>
      <span className="opacity-75 font-normal">({label})</span>
    </span>
  );
};
