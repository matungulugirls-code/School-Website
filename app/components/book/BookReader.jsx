"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  GraduationCap,
  Heart,
  Info,
  Loader2,
  Maximize,
  Minimize,
  Share2,
  Sparkles,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { motion, AnimatePresence } from "framer-motion";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const BookReader = ({ issue, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [direction, setDirection] = useState(0);
  const [pageWidth, setPageWidth] = useState(860);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showReaderTip, setShowReaderTip] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(issue.likes || 0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showPageJump, setShowPageJump] = useState(false);
  const [jumpPage, setJumpPage] = useState("");

  const containerRef = useRef(null);
  const touchStartY = useRef(0);

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarked_magazines") || "[]");
    setIsBookmarked(savedBookmarks.includes(issue.id));

    const likedMagazines = JSON.parse(localStorage.getItem("liked_magazines") || "[]");
    setIsLiked(likedMagazines.includes(issue.id));
  }, [issue.id]);

  useEffect(() => {
    const updateWidth = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const gutters = width < 768 ? 28 : 72;
      setPageWidth(Math.max(260, Math.min(width - gutters, 980)));
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      switch (e.key) {
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
  }, [numPages, currentPage, isFlipping]);

  useEffect(() => {
    const timer = setTimeout(() => setShowReaderTip(false), 4500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const container = containerRef.current?.closest(".reader-shell");
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      container.addEventListener("touchstart", handleTouchStart);
      container.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      document.body.style.overflow = "";
      if (container) {
        container.removeEventListener("wheel", handleWheel);
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [currentPage, numPages, isFlipping]);

  const onDocumentLoadSuccess = ({ numPages: total }) => {
    setNumPages(total);
    setLoadingProgress(100);
  };

  const onDocumentLoadProgress = ({ loaded, total }) => {
    if (!total) return;
    setLoadingProgress(Math.round((loaded / total) * 100));
  };

  const goNext = () => {
    if (numPages && currentPage < numPages && !isFlipping) {
      setIsFlipping(true);
      setDirection(1);
      setCurrentPage((page) => page + 1);
      setTimeout(() => setIsFlipping(false), 420);
    }
  };

  const goPrev = () => {
    if (currentPage > 1 && !isFlipping) {
      setIsFlipping(true);
      setDirection(-1);
      setCurrentPage((page) => page - 1);
      setTimeout(() => setIsFlipping(false), 420);
    }
  };

  const handleWheel = (e) => {
    if (isFlipping) return;
    if (e.deltaY > 50 && currentPage < numPages) {
      e.preventDefault();
      goNext();
    } else if (e.deltaY < -50 && currentPage > 1) {
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
    const next = !isLiked;
    setIsLiked(next);
    setLikesCount((count) => (next ? count + 1 : count - 1));

    const likedMagazines = JSON.parse(localStorage.getItem("liked_magazines") || "[]");
    if (next && !likedMagazines.includes(issue.id)) {
      likedMagazines.push(issue.id);
    }
    if (!next) {
      const index = likedMagazines.indexOf(issue.id);
      if (index > -1) likedMagazines.splice(index, 1);
    }
    localStorage.setItem("liked_magazines", JSON.stringify(likedMagazines));
  };

  const handleBookmark = () => {
    const next = !isBookmarked;
    setIsBookmarked(next);

    const saved = JSON.parse(localStorage.getItem("bookmarked_magazines") || "[]");
    if (next && !saved.includes(issue.id)) {
      saved.push(issue.id);
    }
    if (!next) {
      const index = saved.indexOf(issue.id);
      if (index > -1) saved.splice(index, 1);
    }
    localStorage.setItem("bookmarked_magazines", JSON.stringify(saved));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: issue.title,
          text: `Reading ${issue.title} from Matungulu Girls Senior School.`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const jumpToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= (numPages || 1) && !isFlipping) {
      setIsFlipping(true);
      setDirection(pageNum > currentPage ? 1 : -1);
      setCurrentPage(pageNum);
      setTimeout(() => setIsFlipping(false), 420);
      setShowPageJump(false);
      setJumpPage("");
    }
  };

  const handleJumpSubmit = (e) => {
    e.preventDefault();
    const parsedPage = parseInt(jumpPage, 10);
    if (!Number.isNaN(parsedPage)) jumpToPage(parsedPage);
  };

  const progress = numPages ? (currentPage / numPages) * 100 : 0;
  const readerWidth = Math.max(260, Math.min(pageWidth * scale, pageWidth * 1.75));

  const pageVariants = {
    enter: (dir) => ({
      x: dir > 0 ? "18%" : "-18%",
      opacity: 0,
      rotateY: dir > 0 ? -16 : 16,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      rotateY: 0,
      scale: 1,
      transition: { duration: 0.42, ease: [0.4, 0, 0.2, 1] },
    },
    exit: (dir) => ({
      x: dir > 0 ? "-18%" : "18%",
      opacity: 0,
      rotateY: dir > 0 ? 16 : -16,
      scale: 0.98,
      transition: { duration: 0.42, ease: [0.4, 0, 0.2, 1] },
    }),
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#071410] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(216,177,90,0.16),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(28,91,77,0.28),transparent_32%)]" />
      <div className="absolute inset-y-0 left-0 hidden w-[88px] border-r border-white/6 bg-white/[0.03] backdrop-blur-xl xl:block" />

      <div className="reader-shell relative flex h-full flex-col xl:grid xl:grid-cols-[88px_340px_minmax(0,1fr)]">
        <div className="hidden xl:flex xl:flex-col xl:items-center xl:justify-between xl:py-8">
          <div className="space-y-4">
            <button
              onClick={onClose}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white transition hover:bg-white/[0.1]"
            >
              close
              <X className="h-5 w-5" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white transition hover:bg-white/[0.1]"
            >
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </button>
          </div>

          <div className="flex flex-col items-center gap-4 text-white/65">
            <button
              onClick={handleLike}
              className={`flex h-12 w-12 items-center justify-center rounded-full border transition ${
                isLiked ? "border-[#d8b15a]/60 bg-[#d8b15a]/15 text-[#f6df9f]" : "border-white/10 bg-white/[0.05]"
              }`}
            >
              <Heart className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} />
            </button>
            <button
              onClick={handleBookmark}
              className={`flex h-12 w-12 items-center justify-center rounded-full border transition ${
                isBookmarked ? "border-[#d8b15a]/60 bg-[#d8b15a]/15 text-[#f6df9f]" : "border-white/10 bg-white/[0.05]"
              }`}
            >
              {isBookmarked ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
            </button>
            <button
              onClick={handleShare}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] transition hover:bg-white/[0.1]"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        <aside className="order-2 border-t border-white/8 bg-white/[0.03] backdrop-blur-xl xl:order-none xl:border-r xl:border-t-0">
          <div className="flex items-center justify-between border-b border-white/8 px-4 py-4 sm:px-6 xl:hidden">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06]"
              >
                <X className="h-5 w-5" />
              </button>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-white/55">Reader</p>
                <p className="text-sm font-black text-white">Magazine Experience</p>
              </div>
            </div>
            <button
              onClick={toggleFullscreen}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06]"
            >
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </button>
          </div>

          <div className="max-h-full overflow-y-auto px-4 py-5 sm:px-6 xl:h-full xl:px-7 xl:py-8">
            <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(160deg,rgba(18,59,49,0.96),rgba(8,23,18,0.98))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <GraduationCap className="h-6 w-6 text-[#f6df9f]" />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-white/55">
                    Matungulu Girls
                  </p>
                  <p className="text-lg font-black text-white">Premium Reader</p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-[#f6df9f]">
                  Current Edition
                </p>
                <h1 className="mt-3 text-3xl font-black leading-tight text-white">
                  {issue.title}
                </h1>
                <p className="mt-3 text-sm leading-7 text-white/72">
                  {issue.description ||
                    "A polished collection of student stories, school achievements, School life, and the lived identity of Matungulu Girls Senior School."}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.06] px-4 py-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-white/55">Year</p>
                  <p className="mt-2 text-xl font-black text-white">{issue.year || "Current"}</p>
                </div>
                <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.06] px-4 py-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-white/55">Pages</p>
                  <p className="mt-2 text-xl font-black text-white">{numPages || issue.pages || "--"}</p>
                </div>
                <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.06] px-4 py-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-white/55">Views</p>
                  <p className="mt-2 text-xl font-black text-white">{issue.views || "Live"}</p>
                </div>
                <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.06] px-4 py-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-white/55">Likes</p>
                  <p className="mt-2 text-xl font-black text-white">{likesCount}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-white/55">Reader Controls</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <button
                  onClick={handleLike}
                  className={`flex items-center justify-between rounded-[1.3rem] border px-4 py-4 text-left transition ${
                    isLiked ? "border-[#d8b15a]/45 bg-[#d8b15a]/12" : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <span>
                    <span className="block text-sm font-black text-white">Like Edition</span>
                    <span className="mt-1 block text-xs text-white/58">Save your appreciation locally</span>
                  </span>
                  <Heart className="h-5 w-5 text-[#f6df9f]" fill={isLiked ? "currentColor" : "none"} />
                </button>

                <button
                  onClick={handleBookmark}
                  className={`flex items-center justify-between rounded-[1.3rem] border px-4 py-4 text-left transition ${
                    isBookmarked ? "border-[#d8b15a]/45 bg-[#d8b15a]/12" : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <span>
                    <span className="block text-sm font-black text-white">Bookmark Edition</span>
                    <span className="mt-1 block text-xs text-white/58">Return to this issue faster</span>
                  </span>
                  {isBookmarked ? (
                    <BookmarkCheck className="h-5 w-5 text-[#f6df9f]" />
                  ) : (
                    <Bookmark className="h-5 w-5 text-[#f6df9f]" />
                  )}
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center justify-between rounded-[1.3rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-left transition hover:bg-white/[0.05]"
                >
                  <span>
                    <span className="block text-sm font-black text-white">Share Reader</span>
                    <span className="mt-1 block text-xs text-white/58">Send this issue to another reader</span>
                  </span>
                  <Share2 className="h-5 w-5 text-[#f6df9f]" />
                </button>

                <a
                  href={issue.pdfUrl}
                  download
                  className="flex items-center justify-between rounded-[1.3rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-left transition hover:bg-white/[0.05]"
                >
                  <span>
                    <span className="block text-sm font-black text-white">Download PDF</span>
                    <span className="mt-1 block text-xs text-white/58">Keep an offline copy of the magazine</span>
                  </span>
                  <Download className="h-5 w-5 text-[#f6df9f]" />
                </a>
              </div>
            </div>

            <div className="mt-5 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-white/55">Need To Know</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex items-start gap-3">
                    <Info className="mt-1 h-4 w-4 text-[#f6df9f]" />
                    <div>
                      <p className="text-sm font-black text-white">Navigation</p>
                      <p className="mt-1 text-xs leading-6 text-white/60">
                        Use swipe, mouse wheel, or arrow keys to move through pages. Press <span className="font-bold text-white">F</span> for fullscreen.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex items-start gap-3">
                    <Eye className="mt-1 h-4 w-4 text-[#f6df9f]" />
                    <div>
                      <p className="text-sm font-black text-white">Why the magazine matters</p>
                      <p className="mt-1 text-xs leading-6 text-white/60">
                        It gives parents, students, and alumnae a fuller picture of school life, growth, achievement, and student voice.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-1 h-4 w-4 text-[#f6df9f]" />
                    <div>
                      <p className="text-sm font-black text-white">Best experience</p>
                      <p className="mt-1 text-xs leading-6 text-white/60">
                        Open on a larger screen for the full editorial feel, then download if you want a quick offline read later.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="order-1 flex min-h-0 flex-col xl:order-none">
          <div className="border-b border-white/8 bg-white/[0.03] px-4 py-4 backdrop-blur-xl sm:px-6 xl:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
                  <BookOpen className="h-5 w-5 text-[#f6df9f]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-white/50">
                    Digital Magazine Reader
                  </p>
                  <p className="truncate text-lg font-black text-white sm:text-2xl">
                    {issue.title} {issue.year ? `- ${issue.year}` : ""}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center rounded-full border border-white/10 bg-white/[0.05] px-2 py-2">
                  <button
                    onClick={() => setScale((value) => Math.max(0.7, value - 0.1))}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-white/75 transition hover:bg-white/[0.08]"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  <span className="w-16 text-center text-sm font-black text-white">{Math.round(scale * 100)}%</span>
                  <button
                    onClick={() => setScale((value) => Math.min(1.8, value + 0.1))}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-white/75 transition hover:bg-white/[0.08]"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={() => setShowPageJump(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-black text-white"
                >
                  Page {currentPage} of {numPages || "..."}
                  <ChevronDown className="h-4 w-4 text-[#f6df9f]" />
                </button>
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8">
              <motion.div
                className="h-full rounded-full bg-[linear-gradient(90deg,#d8b15a,#f6df9f,#2b7a68)]"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              />
            </div>
          </div>

          <div
            ref={containerRef}
            className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4 py-5 sm:px-6 xl:px-8 xl:py-7"
            style={{ perspective: 1800 }}
          >
            <button
              onClick={goPrev}
              disabled={currentPage <= 1 || isFlipping}
              className={`absolute left-3 top-1/2 z-20 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur-xl transition lg:flex ${
                currentPage <= 1 || isFlipping
                  ? "cursor-not-allowed border-white/6 bg-white/[0.03] text-white/20"
                  : "border-white/10 bg-white/[0.08] text-white shadow-[0_18px_40px_rgba(0,0,0,0.28)] hover:bg-white/[0.12]"
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={goNext}
              disabled={!numPages || currentPage >= numPages || isFlipping}
              className={`absolute right-3 top-1/2 z-20 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur-xl transition lg:flex ${
                !numPages || currentPage >= numPages || isFlipping
                  ? "cursor-not-allowed border-white/6 bg-white/[0.03] text-white/20"
                  : "border-white/10 bg-white/[0.08] text-white shadow-[0_18px_40px_rgba(0,0,0,0.28)] hover:bg-white/[0.12]"
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <AnimatePresence>
              {showReaderTip && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 14 }}
                  className="pointer-events-none absolute bottom-7 left-1/2 z-20 -translate-x-1/2"
                >
                  <div className="rounded-full border border-white/10 bg-[#0d211c]/90 px-5 py-3 text-xs font-bold uppercase tracking-[0.22em] text-white/82 shadow-[0_20px_50px_rgba(0,0,0,0.25)] backdrop-blur-xl">
                    Swipe, scroll, or use arrow keys to move pages
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative w-full">
              <div className="absolute inset-0 mx-auto max-w-[1100px] rounded-[2.5rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_52%)] blur-3xl" />
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentPage}
                  custom={direction}
                  variants={pageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="relative mx-auto overflow-hidden rounded-[2rem] border border-white/10 bg-[#f4ead4] shadow-[0_35px_110px_rgba(0,0,0,0.45)]"
                  style={{ width: "fit-content", maxWidth: "100%", transformStyle: "preserve-3d" }}
                >
                  <div className="absolute inset-x-0 top-0 z-10 h-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),transparent)]" />
                  <Document
                    file={issue.pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadProgress={onDocumentLoadProgress}
                    loading={
                      <div className="flex min-h-[60vh] flex-col items-center justify-center px-8 py-20 text-center text-[#11281f]">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#10392f] text-white">
                          <Loader2 className="h-7 w-7 animate-spin" />
                        </div>
                        <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.3em] text-[#10392f]">
                          Building Reader
                        </p>
                        <h3 className="mt-3 text-3xl font-black">Loading magazine pages</h3>
                        <p className="mt-2 text-sm text-[#5f665e]">{loadingProgress}% complete</p>
                      </div>
                    }
                    error={
                      <div className="flex min-h-[60vh] flex-col items-center justify-center px-8 py-20 text-center text-[#11281f]">
                        <AlertCircle className="h-12 w-12 text-[#9b4f66]" />
                        <h3 className="mt-5 text-2xl font-black">The PDF could not be loaded</h3>
                        <p className="mt-3 max-w-md text-sm leading-7 text-[#5f665e]">
                          Please try again or download the magazine directly instead.
                        </p>
                        <button
                          onClick={() => window.location.reload()}
                          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#10392f] px-5 py-3 text-sm font-black text-white"
                        >
                          Retry Reader
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    }
                  >
                    <Page
                      pageNumber={currentPage}
                      width={readerWidth}
                      renderTextLayer
                      renderAnnotationLayer
                    />
                  </Document>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="border-t border-white/8 bg-white/[0.03] px-4 py-4 backdrop-blur-xl sm:px-6 xl:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={goPrev}
                  disabled={currentPage <= 1 || isFlipping}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-black transition ${
                    currentPage <= 1 || isFlipping
                      ? "cursor-not-allowed border border-white/8 bg-white/[0.03] text-white/30"
                      : "bg-white/[0.08] text-white shadow-[0_14px_28px_rgba(0,0,0,0.2)]"
                  }`}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </button>

                <button
                  onClick={goNext}
                  disabled={!numPages || currentPage >= numPages || isFlipping}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-black transition ${
                    !numPages || currentPage >= numPages || isFlipping
                      ? "cursor-not-allowed border border-white/8 bg-white/[0.03] text-white/30"
                      : "bg-[#d8b15a] text-[#11281f] shadow-[0_14px_28px_rgba(216,177,90,0.22)]"
                  }`}
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3">
                  <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-white/50">Jump</span>
                  <input
                    type="number"
                    min={1}
                    max={numPages || 1}
                    value={currentPage}
                    onChange={(e) => {
                      const nextPage = parseInt(e.target.value, 10);
                      if (!Number.isNaN(nextPage)) jumpToPage(nextPage);
                    }}
                    className="w-16 bg-transparent text-center text-sm font-black text-white outline-none"
                    disabled={isFlipping}
                  />
                  <span className="text-sm font-bold text-white/65">/ {numPages || "..."}</span>
                </div>

                <a
                  href={issue.pdfUrl}
                  download
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-black text-white"
                >
                  <Download className="h-4 w-4 text-[#f6df9f]" />
                  Download PDF
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {showPageJump && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] flex items-center justify-center bg-black/45 px-4 backdrop-blur-md"
            onClick={() => setShowPageJump(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#0d211c] p-6 text-white shadow-[0_30px_90px_rgba(0,0,0,0.35)]"
            >
              <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-white/55">Quick Navigation</p>
              <h3 className="mt-3 text-3xl font-black">Jump to a page</h3>
              <p className="mt-2 text-sm leading-7 text-white/62">
                Enter any page number from 1 to {numPages || "..."} to move directly through the edition.
              </p>

              <form onSubmit={handleJumpSubmit} className="mt-6">
                <input
                  type="number"
                  min={1}
                  max={numPages || 1}
                  value={jumpPage}
                  onChange={(e) => setJumpPage(e.target.value)}
                  placeholder={`Type a page between 1 and ${numPages || "..."}`}
                  className="w-full rounded-[1.4rem] border border-white/10 bg-white/[0.05] px-5 py-4 text-base font-bold text-white outline-none placeholder:text-white/35 focus:border-[#d8b15a]/45"
                  autoFocus
                />

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setShowPageJump(false)}
                    className="flex-1 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-black text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-full bg-[#d8b15a] px-5 py-3 text-sm font-black text-[#11281f]"
                  >
                    Go to Page
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isFlipping && (
        <div className="pointer-events-none absolute inset-0 z-40">
          <div
            className={`absolute inset-0 bg-gradient-to-r ${
              direction > 0 ? "from-[#d8b15a]/10 to-transparent" : "from-transparent to-[#d8b15a]/10"
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default BookReader;
