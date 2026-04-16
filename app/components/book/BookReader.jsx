"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  BookOpen, X, ChevronLeft, ChevronRight, Download, Maximize, Minimize,
  ZoomIn, ZoomOut, Heart, Share2, Bookmark, BookmarkCheck, Eye,
  ChevronDown, ChevronUp, Loader2, AlertCircle, Info, GraduationCap, Sparkles
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { motion, AnimatePresence } from "framer-motion";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Matungulu Girls Color Palette
const colors = {
  primary: "#7B2D8E",    // Rich Purple
  secondary: "#FF69B4",  // Hot Pink
  accent: "#4CAF50",     // Fresh Green
  light: "#F3E5F5",      // Light Purple tint
  dark: "#4A148C",       // Deep Purple
  gradient: "linear-gradient(135deg, #7B2D8E 0%, #FF69B4 50%, #4CAF50 100%)",
  bgLight: "#FFF5F8",    // Soft pinkish white
  bgPattern: "radial-gradient(circle at 10% 20%, rgba(123,45,142,0.05) 0%, rgba(255,105,180,0.05) 100%)"
};

const BookReader = ({ issue, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [direction, setDirection] = useState(0);
  const [pageWidth, setPageWidth] = useState(600);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(issue.likes || 0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showPageJump, setShowPageJump] = useState(false);
  const [jumpPage, setJumpPage] = useState("");
  
  const containerRef = useRef(null);
  const touchStartY = useRef(0);
  const thumbnailsRef = useRef(null);

  // Load saved interactions
  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarked_magazines') || '[]');
    setIsBookmarked(savedBookmarks.includes(issue.id));
    
    const likedMagazines = JSON.parse(localStorage.getItem('liked_magazines') || '[]');
    setIsLiked(likedMagazines.includes(issue.id));
  }, [issue.id]);

  // Update page width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        setPageWidth(Math.min(w - 40, 900));
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      switch(e.key) {
        case "ArrowRight":
        case " ":
          e.preventDefault();
          goNext();
          break;
        case "ArrowLeft":
          e.preventDefault();
          goPrev();
          break;
        case "Escape":
          onClose();
          break;
        case "f":
          toggleFullscreen();
          break;
        case "Home":
          e.preventDefault();
          jumpToPage(1);
          break;
        case "End":
          e.preventDefault();
          if (numPages) jumpToPage(numPages);
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [numPages, currentPage]);

  // Hide scroll hint after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowScrollHint(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Fullscreen handler
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // Lock body scroll and add wheel/touch listeners
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const container = containerRef.current?.closest('.scroll-container');
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchend', handleTouchEnd);
    }
    return () => { 
      document.body.style.overflow = "";
      if (container) {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [currentPage, numPages, isFlipping]);

  const onDocumentLoadSuccess = ({ numPages: total }) => {
    setNumPages(total);
    setLoadingProgress(100);
  };

  const onDocumentLoadProgress = ({ loaded, total }) => {
    setLoadingProgress(Math.round((loaded / total) * 100));
  };

  const goNext = () => {
    if (numPages && currentPage < numPages && !isFlipping) {
      setIsFlipping(true);
      setDirection(1);
      setCurrentPage(p => p + 1);
      setTimeout(() => setIsFlipping(false), 500);
    }
  };

  const goPrev = () => {
    if (currentPage > 1 && !isFlipping) {
      setIsFlipping(true);
      setDirection(-1);
      setCurrentPage(p => p - 1);
      setTimeout(() => setIsFlipping(false), 500);
    }
  };

  const handleWheel = (e) => {
    if (isFlipping) return;
    const delta = e.deltaY;
    if (delta > 50 && currentPage < numPages) {
      e.preventDefault();
      goNext();
    } else if (delta < -50 && currentPage > 1) {
      e.preventDefault();
      goPrev();
    }
  };

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (isFlipping) return;
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    if (diff > 50 && currentPage < numPages) goNext();
    else if (diff < -50 && currentPage > 1) goPrev();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleLike = () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1);
    
    const likedMagazines = JSON.parse(localStorage.getItem('liked_magazines') || '[]');
    if (newLiked) {
      likedMagazines.push(issue.id);
    } else {
      const index = likedMagazines.indexOf(issue.id);
      if (index > -1) likedMagazines.splice(index, 1);
    }
    localStorage.setItem('liked_magazines', JSON.stringify(likedMagazines));
  };

  const handleBookmark = () => {
    const newBookmarked = !isBookmarked;
    setIsBookmarked(newBookmarked);
    
    const saved = JSON.parse(localStorage.getItem('bookmarked_magazines') || '[]');
    if (newBookmarked) {
      saved.push(issue.id);
    } else {
      const index = saved.indexOf(issue.id);
      if (index > -1) saved.splice(index, 1);
    }
    localStorage.setItem('bookmarked_magazines', JSON.stringify(saved));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: issue.title,
          text: `Reading ${issue.title} magazine from Matungulu Girls Senior School!`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const jumpToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= (numPages || 1) && !isFlipping) {
      setIsFlipping(true);
      setDirection(pageNum > currentPage ? 1 : -1);
      setCurrentPage(pageNum);
      setTimeout(() => setIsFlipping(false), 500);
      setShowPageJump(false);
      setJumpPage("");
    }
  };

  const handleJumpSubmit = (e) => {
    e.preventDefault();
    const pageNum = parseInt(jumpPage);
    if (!isNaN(pageNum)) jumpToPage(pageNum);
  };

  const progress = numPages ? (currentPage / numPages) * 100 : 0;

  const pageVariants = {
    enter: (dir) => ({ 
      x: dir > 0 ? "100%" : "-100%", 
      opacity: 0, 
      rotateY: dir > 0 ? -30 : 30,
      scale: 0.95
    }),
    center: { 
      x: 0, 
      opacity: 1, 
      rotateY: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
    },
    exit: (dir) => ({ 
      x: dir > 0 ? "-100%" : "100%", 
      opacity: 0, 
      rotateY: dir > 0 ? 30 : -30,
      scale: 0.95,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
    }),
  };

  return (
    <div className="fixed inset-0 z-50" style={{ background: colors.bgPattern, backgroundColor: colors.bgLight }}>
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-lg border-b shadow-lg px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3 sm:gap-4">
          <button 
            onClick={onClose} 
            className="p-2 rounded-full transition-all duration-300 hover:shadow-md active:scale-95"
            style={{ backgroundColor: colors.light, color: colors.primary }}
          >
            <X size={20} />
          </button>
          <div className="h-8 w-px" style={{ backgroundColor: colors.primary + '20' }} />
          
          {/* Logo and School Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md" style={{ background: colors.gradient }}>
              <GraduationCap className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base" style={{ color: colors.primary }}>
                Matungulu Girls
              </h1>
              <p className="text-xs opacity-70" style={{ color: colors.dark }}>
                Digital Library
              </p>
            </div>
          </div>
          
          <div className="h-8 w-px" style={{ backgroundColor: colors.primary + '20' }} />
          
          <div className="flex items-center gap-2">
            <Sparkles size={16} style={{ color: colors.secondary }} />
            <span className="font-semibold text-sm sm:text-base truncate max-w-[120px] sm:max-w-md" style={{ color: colors.dark }}>
              {issue.title} — {issue.year}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`p-2 rounded-full transition-all duration-300 hover:shadow-md active:scale-95 ${
              isLiked ? 'bg-pink-100 text-pink-500' : 'hover:bg-pink-50 text-gray-600'
            }`}
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
          </button>
          
          {/* Bookmark Button */}
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-full transition-all duration-300 hover:shadow-md active:scale-95 ${
              isBookmarked ? 'text-purple-600 bg-purple-50' : 'hover:bg-purple-50 text-gray-600'
            }`}
          >
            {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>
          
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-2 rounded-full transition-all duration-300 hover:shadow-md active:scale-95 hover:bg-green-50 text-gray-600 hover:text-green-600"
          >
            <Share2 size={18} />
          </button>

          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center gap-1 bg-gray-50 rounded-full px-2 py-1 mx-1">
            <button 
              onClick={() => setScale(s => Math.max(0.5, s - 0.1))} 
              className="p-1 rounded-full transition-all hover:bg-gray-200 w-7 h-7 flex items-center justify-center"
            >
              <ZoomOut size={14} className="text-gray-600" />
            </button>
            <span className="text-gray-700 text-xs w-12 text-center font-medium">{Math.round(scale * 100)}%</span>
            <button 
              onClick={() => setScale(s => Math.min(2, s + 0.1))} 
              className="p-1 rounded-full transition-all hover:bg-gray-200 w-7 h-7 flex items-center justify-center"
            >
              <ZoomIn size={14} className="text-gray-600" />
            </button>
          </div>

          {/* Download Button */}
          <a 
            href={issue.pdfUrl} 
            download 
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-white text-xs sm:text-sm font-semibold rounded-full flex items-center gap-2 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
            style={{ background: colors.gradient }}
          >
            <Download size={14} />
            <span className="hidden sm:inline">Download</span>
          </a>

          {/* Fullscreen Toggle */}
          <button 
            onClick={toggleFullscreen} 
            className="p-2 rounded-full transition-all duration-300 hover:shadow-md active:scale-95 bg-gray-50 text-gray-600 hover:bg-gray-100"
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-gray-100 shrink-0">
        <motion.div 
          className="h-full rounded-r-full" 
          style={{ background: colors.gradient }}
          animate={{ width: `${progress}%` }} 
          transition={{ duration: 0.4, ease: "easeOut" }} 
        />
      </div>

      {/* Main Content */}
      <div className="scroll-container flex-1 relative overflow-hidden">
        {/* Navigation Buttons */}
        <button 
          onClick={goPrev} 
          disabled={currentPage <= 1 || isFlipping} 
          className={`absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl active:scale-95 flex items-center justify-center ${
            currentPage <= 1 || isFlipping ? "opacity-30 cursor-not-allowed" : "opacity-90 hover:opacity-100"
          }`}
        >
          <ChevronLeft size={20} className="sm:w-5 sm:h-5" style={{ color: colors.primary }} />
        </button>

        <button 
          onClick={goNext} 
          disabled={!numPages || currentPage >= numPages || isFlipping} 
          className={`absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl active:scale-95 flex items-center justify-center ${
            !numPages || currentPage >= numPages || isFlipping ? "opacity-30 cursor-not-allowed" : "opacity-90 hover:opacity-100"
          }`}
        >
          <ChevronRight size={20} className="sm:w-5 sm:h-5" style={{ color: colors.primary }} />
        </button>

        {/* Scroll Hint */}
        <AnimatePresence>
          {showScrollHint && (
            <motion.div 
              className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0.8, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex flex-col items-center gap-1 shadow-lg">
                <svg className="w-5 h-5 animate-bounce" style={{ color: colors.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span className="text-xs font-medium whitespace-nowrap" style={{ color: colors.dark }}>Scroll to flip page</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Info */}
        <div className="absolute top-4 right-4 z-20">
          <button 
            onClick={() => setShowPageJump(true)} 
            className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg flex items-center gap-1 hover:shadow-xl transition-all duration-300"
          >
            <span className="text-sm font-semibold" style={{ color: colors.primary }}>
              {currentPage} / {numPages || "..."}
            </span>
            <ChevronDown size={14} className="text-gray-600" />
          </button>
        </div>

        {/* Page Jump Modal */}
        <AnimatePresence>
          {showPageJump && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center"
              onClick={() => setShowPageJump(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-96 shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <h3 className="font-bold text-xl mb-4" style={{ color: colors.primary }}>Jump to Page</h3>
                <form onSubmit={handleJumpSubmit}>
                  <input
                    type="number"
                    min={1}
                    max={numPages}
                    value={jumpPage}
                    onChange={e => setJumpPage(e.target.value)}
                    placeholder={`Enter page number (1-${numPages})`}
                    className="w-full px-4 py-2 border-2 rounded-xl mb-4 focus:outline-none focus:border-purple-400 transition-all"
                    style={{ borderColor: colors.primary + '30' }}
                    autoFocus
                  />
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowPageJump(false)}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:scale-105"
                      style={{ background: colors.gradient }}
                    >
                      Go to Page
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PDF Viewer */}
        <div 
          ref={containerRef}
          className="w-full h-full flex items-center justify-center p-4 sm:p-8"
          style={{ perspective: 1500 }}
        >
          <div className="relative w-full max-w-5xl mx-auto">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div 
                key={currentPage} 
                custom={direction} 
                variants={pageVariants} 
                initial="enter" 
                animate="center" 
                exit="exit" 
                className="bg-white rounded-2xl shadow-2xl overflow-hidden mx-auto"
                style={{ transformStyle: "preserve-3d", maxWidth: "100%", width: "fit-content" }}
              >
                <Document 
                  file={issue.pdfUrl} 
                  onLoadSuccess={onDocumentLoadSuccess} 
                  onLoadProgress={onDocumentLoadProgress}
                  loading={
                    <div className="flex flex-col items-center justify-center py-32 px-8 sm:px-16">
                      <div className="relative">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div>
                        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-600" size={20} />
                      </div>
                      <p className="text-gray-600 text-sm sm:text-base mt-4 font-medium">Loading magazine... {loadingProgress}%</p>
                      <p className="text-gray-400 text-xs mt-1">Preparing your reading experience</p>
                    </div>
                  } 
                  error={
                    <div className="flex flex-col items-center justify-center py-32 px-8 sm:px-16">
                      <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                      <p className="text-red-500 font-semibold text-base">Failed to load PDF</p>
                      <p className="text-gray-400 text-sm mt-1">Please try again or contact support</p>
                      <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-semibold hover:bg-purple-700 transition-all"
                      >
                        Retry
                      </button>
                    </div>
                  }
                >
                  <Page 
                    pageNumber={currentPage} 
                    width={Math.min(pageWidth * scale, window.innerWidth - 40)} 
                    renderTextLayer={true} 
                    renderAnnotationLayer={true}
                  />
                </Document>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white/95 backdrop-blur-lg border-t shadow-lg px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between shrink-0 z-30">
        <button
          onClick={goPrev}
          disabled={currentPage <= 1 || isFlipping}
          className={`px-4 sm:px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 active:scale-95 ${
            currentPage <= 1 || isFlipping 
              ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
              : "bg-purple-50 text-purple-700 hover:bg-purple-100 hover:shadow-md"
          }`}
        >
          ← Previous
        </button>

        <div className="flex items-center gap-3 sm:gap-6">
          <span className="text-gray-500 text-sm">Page</span>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              min={1} 
              max={numPages || 1} 
              value={currentPage} 
              onChange={(e) => jumpToPage(parseInt(e.target.value))} 
              className="w-16 text-center bg-gray-50 border-2 rounded-xl text-gray-800 text-sm py-1.5 focus:outline-none focus:border-purple-400 transition-all"
              style={{ borderColor: colors.primary + '30' }}
              disabled={isFlipping}
            />
            <span className="text-gray-500 text-sm">of {numPages || "..."}</span>
          </div>
        </div>

        <button
          onClick={goNext}
          disabled={!numPages || currentPage >= numPages || isFlipping}
          className={`px-4 sm:px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 active:scale-95 ${
            !numPages || currentPage >= numPages || isFlipping
              ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
              : "bg-purple-50 text-purple-700 hover:bg-purple-100 hover:shadow-md"
          }`}
        >
          Next →
        </button>
      </div>

      {/* Page Flip Effect Overlay */}
      {isFlipping && (
        <div className="absolute inset-0 pointer-events-none z-50">
          <div className={`absolute inset-0 bg-gradient-to-r ${direction > 0 ? 'from-purple-100/30 to-transparent' : 'to-purple-100/30 from-transparent'} animate-pulse`} />
        </div>
      )}
    </div>
  );
};

export default BookReader;