// LoadingSpinner.jsx - Modern Minimalist Loading Component for Matungulu Girls Senior School
"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

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
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-emerald-50/30 flex flex-col items-center justify-center p-8">
      {/* Container for the Branding Reveal */}
      <div className="relative flex flex-col items-center">
        
        {/* The "Shield" Loader - High Performance Aesthetic */}
        <div className="relative w-32 h-32 flex items-center justify-center mb-8">
          {/* Rotating Geometric Border */}
          <div className="absolute inset-0 border-[1px] border-emerald-200 rounded-full" />
          <div className="absolute inset-0 border-t-2 border-emerald-600 rounded-full animate-spin [animation-duration:1.5s]" />
          <div className="absolute inset-0 border-r-2 border-teal-500 rounded-full animate-spin [animation-duration:2s] [animation-direction:reverse]" />
          
          {/* Central Branding - School Logo Image */}
          <div className="w-20 h-20 bg-white shadow-[0_20px_50px_rgba(6,78,59,0.15)] rounded-2xl flex items-center justify-center border border-emerald-100 transform transition-transform hover:scale-105">
            <Image
              src="/MatG.jpg"
              alt="Matungulu Girls Senior School Logo"
              width={56}
              height={56}
              className="object-contain rounded-xl"
              priority
            />
          </div>
        </div>

        {/* Textual Hierarchy - Vibrant and Bold */}
        <div className="text-center space-y-4">
          <div className="overflow-hidden">
            <h2 className="text-[11px] font-black tracking-[0.5em] text-emerald-600 uppercase animate-pulse">
              Loading Your Portal
            </h2>
          </div>
          
          <h1 className="text-2xl font-black tracking-tight text-gray-900">
            Matungulu Girls <span className="text-emerald-700">Senior School</span>
          </h1>

          {/* Motto - Vibrant */}
          <p className="text-base italic font-semibold tracking-wide text-emerald-700">
            "Committed to Excellence"
          </p>

          {/* Progress Bar - Clean and Minimal */}
          <div className="w-48 h-1 bg-emerald-100 rounded-full overflow-hidden mt-6">
            <div 
              className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Progress Percentage - Bold */}
          <p className="text-sm font-black text-emerald-600 tracking-wider">
            {progress}%
          </p>
        </div>

        {/* Footer Meta - Bold text */}
        <div className="absolute bottom-[-100px] flex items-center gap-4 opacity-60">
          <div className="h-[1px] w-8 bg-emerald-300" />
          <span className="text-[10px] font-black tracking-widest uppercase text-emerald-700">
            Matungulu Girls Senior School Student Portal {new Date().getFullYear()}
          </span>
          <div className="h-[1px] w-8 bg-emerald-300" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;