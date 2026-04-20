// LoadingSpinner.jsx - Modern Minimalist Loading Component for Matungulu Girls Senior School
"use client";
import React, { useState, useEffect } from 'react';

const LoadingSpinner = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-8">
      {/* Container for the Branding Reveal */}
      <div className="relative flex flex-col items-center">
        
        {/* The "Shield" Loader - High Performance Aesthetic */}
        <div className="relative w-32 h-32 flex items-center justify-center mb-8">
          {/* Rotating Geometric Border */}
          <div className="absolute inset-0 border-[1px] border-slate-200 rounded-full" />
          <div className="absolute inset-0 border-t-2 border-emerald-700 rounded-full animate-spin [animation-duration:1.5s]" />
          
          {/* Central Branding - Minimalist Square Bento */}
          <div className="w-20 h-20 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl flex items-center justify-center border border-slate-100 transform -rotate-3 transition-transform hover:rotate-0">
            <span className="text-3xl font-serif font-bold text-slate-900">M</span>
            <span className="text-emerald-700 text-3xl font-serif font-bold -ml-1">G</span>
          </div>
        </div>

        {/* Textual Hierarchy */}
        <div className="text-center space-y-4">
          <div className="overflow-hidden">
            <h2 className="text-[11px] font-black tracking-[0.5em] text-slate-400 uppercase animate-pulse">
              Loading Your Portal
            </h2>
          </div>
          
          <h1 className="text-xl font-medium tracking-tight text-slate-900">
            Matungulu Girls <span className="text-slate-400">Senior School</span>
          </h1>

          {/* Motto */}
          <p className="text-sm italic tracking-wide text-slate-500">
            "Strive to Excel"
          </p>

          {/* Progress Bar - Clean and Minimal */}
          <div className="w-48 h-0.5 bg-slate-200 rounded-full overflow-hidden mt-6">
            <div 
              className="h-full bg-emerald-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Progress Percentage */}
          <p className="text-[10px] font-mono text-slate-400 tracking-wider">
            {progress}%
          </p>
        </div>

        {/* Footer Meta */}
        <div className="absolute bottom-[-100px] flex items-center gap-4 opacity-50">
          <div className="h-[1px] w-8 bg-slate-300" />
          <span className="text-[9px] font-bold tracking-widest uppercase text-slate-500">
          Matungulu Girls Senior School Student Portal {new Date().getFullYear()}          </span>
          <div className="h-[1px] w-8 bg-slate-300" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;