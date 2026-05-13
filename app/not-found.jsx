"use client"
import React, { useState, useEffect } from 'react';
import { 
  FiHome, 
  FiArrowLeft, 
  FiBook, 
  FiMail, 
  FiCalendar, 
  FiBookOpen, 
  FiUsers, 
  FiBell,
  FiSearch,
  FiAlertCircle,
  FiMapPin,
  FiGlobe,
  FiHeart,
  FiCompass
} from 'react-icons/fi';
import { FaGraduationCap, FaCrown, FaSeedling } from 'react-icons/fa';
import { IoSparkles, IoFlowerOutline } from 'react-icons/io5';

const Modern404 = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Official single message
  const officialMessage = "Committed to Excellence... 404 This page cannot be found";

  const quickLinks = [
    { name: 'Home Base', href: '/', icon: FiHome, description: 'Back to assembly' },
    { name: 'Academics', href: '/pages/Departments', icon: FiBook, description: 'Course directory' },
    { name: 'Gallery', href: '/pages/gallery', icon: FiBookOpen, description: 'School moments' },
    { name: 'Admissions', href: '/pages/admissions', icon: FiUsers, description: 'Join our sisterhood' },
    { name: 'Events', href: '/pages/eventsandnews', icon: FiCalendar, description: 'Upcoming terms' },
    { name: 'Support', href: '/pages/contact', icon: FiMail, description: 'Talk to the office' },
    { name: 'Portal', href: '/pages/StudentPortal', icon: FaGraduationCap, description: 'Student Portal' },
    { name: 'Guidance', href: '/pages/Guidance-and-Councelling', icon: FiHeart, description: 'Counseling sessions' },
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50/30 to-emerald-50/30 overflow-hidden relative font-sans text-slate-900 antialiased">
      
      {/* Mouse Follow Glow Effect */}
      <div 
        className="fixed pointer-events-none w-[600px] h-[600px] rounded-full opacity-20 blur-[100px] transition-all duration-1000 ease-out z-0"
        style={{
          left: mousePosition.x - 300,
          top: mousePosition.y - 300,
          background: 'radial-gradient(circle, rgba(244,114,182,0.3) 0%, rgba(16,185,129,0.1) 50%, transparent 100%)'
        }}
      />

      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Sparkles */}
        {[...Array(12)].map((_, i) => (
          <IoSparkles 
            key={`sparkle-${i}`}
            className="absolute text-amber-400/30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${12 + Math.random() * 20}px`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
        
        {/* Flowers */}
        {[...Array(6)].map((_, i) => (
          <IoFlowerOutline 
            key={`flower-${i}`}
            className="absolute text-pink-400/20 animate-spin-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${20 + Math.random() * 30}px`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${20 + Math.random() * 10}s`
            }}
          />
        ))}
        
        {/* Crowns */}
        {[...Array(4)].map((_, i) => (
          <FaCrown 
            key={`crown-${i}`}
            className="absolute text-amber-400/15"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${30 + Math.random() * 40}px`,
              transform: `rotate(${Math.random() * 30 - 15}deg)`
            }}
          />
        ))}
        
        {/* Large Decorative Icons */}
        <FaGraduationCap className="absolute top-[15%] -left-8 text-emerald-400/10 scale-[4] rotate-12" />
        <FaSeedling className="absolute bottom-[10%] -right-8 text-emerald-400/10 scale-[4] -rotate-12" />
        <FiCompass className="absolute top-[40%] left-[5%] text-rose-400/10 scale-[3] rotate-45" />
        <FiMapPin className="absolute bottom-[30%] right-[5%] text-rose-400/10 scale-[3] -rotate-45" />
      </div>

      <div className="min-h-screen flex items-center justify-center px-3 sm:px-6 py-6 md:py-12 relative z-10">
        <div className="container mx-auto max-w-6xl w-full">
          <div className="flex flex-col lg:flex-row gap-6 md:gap-12 lg:gap-16 items-center">
            
            {/* Left Side: Error Message Section */}
            <div className="w-full lg:w-1/2 text-center lg:text-left space-y-4 md:space-y-6">
              {/* School Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 rounded-full border border-rose-200 shadow-sm">
                <FaCrown className="text-xs text-amber-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">Matungulu Girls' Senior School</span>
                <IoSparkles className="text-xs text-amber-500" />
              </div>

              {/* 404 Number */}
              <div className="relative">
                <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-500 to-emerald-600 flex justify-center lg:justify-start items-baseline">
                  <span>4</span>
                  <span className="mx-1 md:mx-2">0</span>
                  <span>4</span>
                </h1>
                <div className="h-1.5 w-32 bg-gradient-to-r from-rose-400 via-pink-400 to-emerald-400 mx-auto lg:mx-0 mt-2 rounded-full shadow"></div>
              </div>

              {/* Official Message */}
              <div className="space-y-3 md:space-y-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-slate-800 leading-tight italic">
                  "{officialMessage}"
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Even the brightest students lose their way sometimes. Let us guide you back to your journey of excellence.
                </p>
              </div>

              {/* School Motto Display */}
              <div className="flex items-center justify-center lg:justify-start gap-3 py-2">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-rose-300"></div>
                <div className="flex items-center gap-2">
                  <FaSeedling className="text-emerald-500 text-sm" />
                  <span className="text-sm font-serif italic text-slate-600">Committed to Excellence</span>
                  <FaCrown className="text-amber-500 text-sm" />
                </div>
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-rose-300"></div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-row items-center gap-3 pt-2 w-full">
                {/* Back to Home - Primary */}
                <a
                  href="/"
                  className="
                    group
                    flex flex-1 items-center justify-center gap-2
                    bg-gradient-to-r from-rose-600 to-pink-600
                    hover:from-rose-700 hover:to-pink-700
                    text-white
                    px-4 py-3
                    rounded-xl
                    transition-all duration-200
                    shadow-lg shadow-rose-200/50
                    active:scale-95
                  "
                >
                  <FiHome className="text-base group-hover:scale-110 transition-transform" />
                  <span className="whitespace-nowrap font-black uppercase tracking-wider text-[10px] sm:text-xs">
                    Return Home
                  </span>
                </a>

                {/* Go Back - Secondary */}
                <button
                  onClick={() => window.history.back()}
                  className="
                    group
                    flex flex-1 items-center justify-center gap-2
                    bg-white
                    border-2 border-rose-200
                    hover:border-rose-300 hover:bg-rose-50
                    text-rose-700
                    px-4 py-3
                    rounded-xl
                    transition-all duration-200
                    shadow-sm
                    active:scale-95
                  "
                >
                  <FiArrowLeft className="text-base group-hover:-translate-x-1 transition-transform" />
                  <span className="whitespace-nowrap font-black uppercase tracking-wider text-[10px] sm:text-xs">
                    Go Back
                  </span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center lg:justify-start gap-6 pt-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Est. Excellence</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Girls' School</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Matungulu</span>
                </div>
              </div>
            </div>

            {/* Right Side: Quick Links Section */}
            <div className="w-full lg:w-1/2">
              <div className="relative">
                <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-tr from-rose-100 via-pink-50 to-emerald-100 rounded-[2rem] sm:rounded-[3rem] blur-xl opacity-60 -z-10"></div>
                
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-[2.5rem] shadow-2xl shadow-rose-200/40 border border-rose-100/80 p-5 sm:p-6 md:p-8">
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-800 flex items-center gap-2">
                      <FiCompass className="text-rose-600" />
                      Navigate Matungulu
                    </h3>
                    <div className="flex items-center gap-1">
                      <IoSparkles className="text-amber-400 text-sm" />
                      <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">Directory</span>
                    </div>
                  </div>
                  
                  {/* Quick Links Grid */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {quickLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <a
                          key={link.name}
                          href={link.href}
                          className="
                            p-2.5 sm:p-3
                            rounded-xl
                            border border-rose-100
                            bg-white
                            hover:border-rose-200 hover:bg-gradient-to-br hover:from-rose-50/50 hover:to-pink-50/50
                            transition-all duration-200
                            active:scale-[0.98]
                            group
                          "
                        >
                          <div className="flex flex-col items-start gap-1.5">
                            {/* Icon */}
                            <div
                              className="
                                p-1.5
                                bg-gradient-to-br from-rose-100 to-pink-100
                                text-rose-600
                                rounded-lg
                                shadow-sm
                                group-hover:from-rose-200 group-hover:to-pink-200
                                transition-colors
                              "
                            >
                              <Icon className="text-xs sm:text-sm" />
                            </div>

                            {/* Text */}
                            <div className="min-w-0 w-full">
                              <h4 className="font-black text-slate-800 text-[10px] sm:text-xs truncate">
                                {link.name}
                              </h4>
                              <p className="text-[8px] sm:text-[9px] text-slate-500 truncate italic">
                                {link.description}
                              </p>
                            </div>
                          </div>
                        </a>
                      );
                    })}
                  </div>

                  {/* Footer Card with School Spirit */}
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-rose-100">
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-rose-900 via-pink-800 to-emerald-900 p-3 sm:p-4 text-white">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                      
                      {/* Decorative Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        {[...Array(5)].map((_, i) => (
                          <FaCrown key={i} className="absolute text-white" style={{
                            left: `${i * 25}%`,
                            top: `${i * 20}%`,
                            fontSize: '40px',
                            transform: 'rotate(15deg)'
                          }} />
                        ))}
                      </div>

                      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <FaCrown className="text-amber-400 text-xs" />
                            <p className="text-rose-200 text-[8px] font-black uppercase tracking-wider">
                              Matungulu Girls' Senior School
                            </p>
                          </div>
                          <p className="text-white/90 text-sm font-serif italic">
                            "Committed to Excellence"
                          </p>
                          <p className="text-[8px] text-rose-200/60 mt-1">
                            Matungulu, Machakos • Since Excellence
                          </p>
                        </div>

                        <a
                          href="/pages/contact"
                          className="
                            inline-flex
                            items-center
                            gap-1.5
                            px-3 py-1.5
                            text-[9px] sm:text-[10px] font-black uppercase tracking-wider
                            rounded-lg
                            border border-rose-300/30
                            bg-white/10
                            backdrop-blur-sm
                            hover:bg-white/20
                            transition-colors
                            flex-shrink-0
                          "
                        >
                          <FiMail className="text-xs" />
                          Contact Office
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-8 md:mt-12 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FaSeedling className="text-emerald-500 text-xs" />
              <p className="text-slate-500 text-[10px] sm:text-xs font-medium">
                &copy; {new Date().getFullYear()} Matungulu Girls' Senior School
              </p>
              <FaSeedling className="text-emerald-500 text-xs" />
            </div>
            <p className="text-slate-400 text-[9px] sm:text-[10px]">
              Matungulu, Machakos • 
              <span className="mx-1.5">•</span>
              <span className="font-serif italic">Committed to Excellence</span>
              <span className="mx-1.5">•</span>
              <a href="/" className="text-rose-600 hover:text-rose-800 transition-colors font-black uppercase tracking-wider">
                Return Home
              </a>
            </p>
          </footer>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @media (max-width: 640px) {
          .rounded-\\[2\\.5rem\\] {
            border-radius: 1.5rem;
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 30s linear infinite;
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
};

export default Modern404;
