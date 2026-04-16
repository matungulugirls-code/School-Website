// LoadingSpinner.jsx - Modern Loading Component for Matungulu Girls Senior School
"use client";
import React, { useState, useEffect } from 'react';
import { FaFeatherAlt, FaBookOpen, FaStar, FaGraduationCap } from 'react-icons/fa';

const LoadingSpinner = () => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState(0);
  
  const loadingMessages = [
    "Loading your Student Portal...",
    "Fetching your academic dashboard...",
    "Preparing your personalized resources...",
    "Syncing your progress and results...."
  ];

  useEffect(() => {
    const textInterval = setInterval(() => {
      setLoadingText((prev) => (prev + 1) % loadingMessages.length);
    }, 400);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 30);

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-rose-50 via-white to-emerald-50 z-50 flex items-center justify-center overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Soft gradient orbs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-rose-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-r from-emerald-300/20 to-teal-300/20 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-300/10 via-rose-300/10 to-emerald-300/10 rounded-full blur-3xl animate-spin-slow"></div>
        
        {/* Floating icons */}
        <div className="absolute inset-0 opacity-40">
          {[...Array(8)].map((_, i) => {
            let IconComponent;
            if (i % 4 === 0) IconComponent = FaFeatherAlt;
            else if (i % 4 === 1) IconComponent = FaBookOpen;
            else if (i % 4 === 2) IconComponent = FaStar;
            else IconComponent = FaGraduationCap;
            // Make the animation duration much slower (18s to 24s)
            const slowDuration = 18 + Math.random() * 6;
            return (
              <div
                key={i}
                className="absolute text-2xl text-emerald-400 opacity-70"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float-petal ${slowDuration}s ease-in-out infinite`,
                  animationDelay: `${i * 0.5}s`,
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
              >
                <IconComponent />
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md px-6">
        
        {/* Logo Section */}
        <div className="relative mb-8">
          {/* Outer rotating ring */}
          <div className="absolute -inset-4 border-2 border-dashed border-rose-300/50 rounded-full animate-spin-slow"></div>
          
          {/* Pulsing ring */}
          <div className="absolute -inset-2 border border-emerald-300/40 rounded-full animate-pulse"></div>
          
          {/* Logo Container */}
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-rose-500 via-pink-500 to-emerald-500 p-0.5 shadow-2xl">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white/20"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              
              {/* Animated spinner inside logo */}
              <svg className="w-16 h-16" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                  className="opacity-20"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="url(#spinnerGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="220"
                  strokeDashoffset={220 - (220 * progress) / 100}
                  className="transition-all duration-300"
                  transform="rotate(-90 50 50)"
                />
                <defs>
                  <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="50%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Center dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-gradient-to-r from-rose-400 to-emerald-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* School Name */}
        <div className="text-center mb-3">
          <h2 className="text-xl md:text-2xl font-serif font-black tracking-wide text-gray-800">
            MATUNGULU GIRLS'
          </h2>
          <p className="text-gray-600 text-[10px] md:text-xs tracking-[0.3em] font-medium mt-1">
            SENIOR SCHOOL
          </p>
        </div>

        {/* Motto */}
        <div className="text-center mb-6">
          <p className="text-base md:text-lg font-serif italic tracking-wide text-gray-700">
            "Strive to Excel"
          </p>
        </div>

        {/* Loading Message */}
        <div className="h-8 flex items-center justify-center mb-4">
          <p className="text-gray-600 text-sm md:text-base font-medium tracking-wide">
            {loadingMessages[loadingText]}
            <span className="inline-flex ml-1">
              <span className="animate-bounce" style={{ animationDelay: '0s' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
            </span>
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-48 md:w-64 h-0.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-rose-400 via-pink-400 to-emerald-400 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          </div>
        </div>

        {/* Decorative dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 bg-gradient-to-r from-rose-400 to-emerald-400 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>

        {/* Bottom decorative elements */}
        <div className="absolute bottom-8 flex items-center gap-6">
          {[FaGraduationCap, FaBookOpen, FaStar, FaFeatherAlt].map((Icon, i) => (
            <span 
              key={i}
              className="text-emerald-400 text-lg opacity-60"
              style={{ 
                animation: `float-icon ${3 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`
              }}
            >
              <Icon />
            </span>
          ))}
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes float-petal {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg); 
            opacity: 0.3; 
          }
          25% { 
            transform: translateY(-20px) translateX(10px) rotate(90deg); 
            opacity: 0.6; 
          }
          50% { 
            transform: translateY(-40px) translateX(-5px) rotate(180deg); 
            opacity: 0.4; 
          }
          75% { 
            transform: translateY(-20px) translateX(-15px) rotate(270deg); 
            opacity: 0.6; 
          }
        }
        
        @keyframes float-icon {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 30s linear infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-bounce {
          animation: bounce 0.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;