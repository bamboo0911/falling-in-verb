
import React from 'react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center p-12 space-y-4 animate-fade-in w-full h-full">
    <div className="w-10 h-10 border-4 border-rose-100 border-t-rose-300 rounded-full animate-spin"></div>
    <p className="text-rose-300 font-medium animate-pulse text-sm">{message || "Loading..."}</p>
  </div>
);
