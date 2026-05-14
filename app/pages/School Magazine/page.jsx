"use client";

import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock3,
  Download,
  Eye,
  FileText,
  Filter,
  Grid3x3,
  Loader2,
  Search,
  Share2,
  Sparkles,
  Star,
  Trophy,
  Users,
  List,
} from "lucide-react";

const BookReader = dynamic(() => import("../../components/book/BookReader"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#081712]/85 backdrop-blur-xl">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 px-8 py-7 text-center text-white shadow-2xl">
        <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-[#d8b15a]" />
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">
          Opening Reader
        </p>
      </div>
    </div>
  ),
});

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-[#10392f] text-white shadow-[0_16px_40px_rgba(16,57,47,0.35)] transition-transform duration-300 hover:-translate-y-1"
        >
          <ChevronUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const defaultMagazineDescription =
  "A polished yearly showcase of school life, student voice, leadership milestones, school memories, and growth stories across Matungulu Girls Senior School.";

const getTruncatedText = (text, limit = 170) => {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= limit) return { text: clean, truncated: false };
  const slice = clean.slice(0, limit);
  const safeEnd = slice.lastIndexOf(" ") > 80 ? slice.lastIndexOf(" ") : limit;
  return { text: `${slice.slice(0, safeEnd).trim()}...`, truncated: true };
};

const ExpandableDescription = ({ text, limit = 170, className = "" }) => {
  const [expanded, setExpanded] = useState(false);
  const source = text || defaultMagazineDescription;
  const truncated = getTruncatedText(source, limit);
  const shouldToggle = truncated.truncated;

  return (
    <div className={className}>
      <p>{expanded || !shouldToggle ? source : truncated.text}</p>
      {shouldToggle && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setExpanded((value) => !value);
          }}
          className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-[#c89b3c] transition hover:text-[#10392f]"
        >
          {expanded ? "Show Less" : "Read More"}
        </button>
      )}
    </div>
  );
};

const MagazineCard = ({ issue, onOpen, viewMode = "gallery", index = 0 }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bookmarked_magazines") || "[]");
    setIsBookmarked(saved.includes(issue.id));
  }, [issue.id]);

  const handleBookmark = (e) => {
    e.stopPropagation();
    const next = !isBookmarked;
    setIsBookmarked(next);
    const saved = JSON.parse(localStorage.getItem("bookmarked_magazines") || "[]");

    if (next && !saved.includes(issue.id)) {
      saved.push(issue.id);
    }

    if (!next) {
      const idx = saved.indexOf(issue.id);
      if (idx > -1) saved.splice(idx, 1);
    }

    localStorage.setItem("bookmarked_magazines", JSON.stringify(saved));
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: issue.title,
          text: `Explore ${issue.title} from Matungulu Girls Senior School.`,
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

  const isList = viewMode === "list";
  const descriptionLimit = isList ? 245 : 165;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={() => onOpen(issue)}
      className={`group w-full cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
        isList ? "grid lg:grid-cols-[minmax(300px,0.85fr)_minmax(0,1.25fr)]" : "flex h-full flex-col"
      }`}
    >
      <div className={`relative w-full bg-slate-100 ${isList ? "min-h-[260px] sm:min-h-[320px] lg:min-h-full" : "h-64 sm:h-72"}`}>
        {issue.thumbnail ? (
          <Image
            src={issue.thumbnail}
            alt={issue.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100">
            <BookOpen className="h-16 w-16 text-slate-400" />
          </div>
        )}
        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-700 shadow-sm">
            <BookOpen className="h-3 w-3" />
            {issue.year || "Archive"}
          </span>
        </div>
        <div className="absolute right-3 top-3 flex gap-2">
          <button
            type="button"
            onClick={handleBookmark}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 text-slate-700 shadow-sm transition hover:bg-slate-100"
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark magazine"}
          >
            {isBookmarked ? <BookmarkCheck className="h-4 w-4 text-emerald-700" /> : <Bookmark className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 text-slate-700 shadow-sm transition hover:bg-slate-100"
            aria-label="Share magazine"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex min-h-[300px] flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap gap-2">
          <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
            <FileText className="h-3 w-3" />
            {issue.pages || 80} pages
          </span>
          <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
            <Eye className="h-3 w-3" />
            {issue.views || "New"} views
          </span>
          <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
            <Download className="h-3 w-3" />
            {issue.downloads || "Ready"}
          </span>
        </div>

        <h3 className="mt-5 text-2xl font-black leading-tight text-slate-950">
          {issue.title}
        </h3>

        <ExpandableDescription
          text={issue.description || defaultMagazineDescription}
          limit={descriptionLimit}
          className="mt-3 text-sm font-medium leading-7 text-slate-600"
        />

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
            Open Reader
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
          <div className="flex items-center gap-2">
            {issue.pdfUrl && (
              <a
                href={issue.pdfUrl}
                download
                onClick={(e) => e.stopPropagation()}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                aria-label="Download magazine PDF"
              >
                <Download className="h-4 w-4" />
              </a>
            )}
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white transition group-hover:translate-x-0.5">
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

const InfoTile = ({ icon: Icon, eyebrow, title, text, tone = "emerald" }) => {
  const toneMap = {
    emerald: "bg-white text-slate-900 border-slate-200",
    ivory: "bg-white text-slate-900 border-slate-200",
    rose: "bg-white text-slate-900 border-slate-200",
  };

  return (
    <div className={`rounded-2xl border p-6 shadow-sm ${toneMap[tone]}`}>
      <div className="mb-6 inline-flex rounded-2xl bg-slate-900 p-3 text-white">
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-500">{eyebrow}</p>
      <h3 className="mt-3 text-2xl font-black text-slate-950">{title}</h3>
      <p className="mt-3 text-sm font-medium leading-7 text-slate-600">{text}</p>
    </div>
  );
};

export default function MagazineArchive() {
  const [magazines, setMagazines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [viewMode, setViewMode] = useState("list");
  const [sortBy, setSortBy] = useState("year");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    totalIssues: 0,
    totalPages: 0,
    earliestYear: null,
    latestYear: null,
  });

  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/school");
        const data = await response.json();

        let magazinesArray = [];

        if (data.success && data.school) {
          if (data.school.magazine) magazinesArray = [data.school.magazine];
          else if (data.school.Magazine) magazinesArray = [data.school.Magazine];
        }

        if (data.magazines && Array.isArray(data.magazines)) {
          magazinesArray = data.magazines;
        }

        setMagazines(magazinesArray);

        if (magazinesArray.length > 0) {
          const years = magazinesArray.map((m) => m.year).filter(Boolean);
          const totalPages = magazinesArray.reduce((sum, m) => sum + (m.pages || 80), 0);
          setStats({
            totalIssues: magazinesArray.length,
            totalPages,
            earliestYear: years.length ? Math.min(...years) : null,
            latestYear: years.length ? Math.max(...years) : null,
          });
        }
      } catch (error) {
        console.error("Error fetching school/magazines:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMagazines();
  }, []);

  const filteredAndSortedMagazines = useMemo(() => {
    const filtered = [...magazines]
      .filter((magazine) => {
        if (!searchQuery) return true;
        return (
          magazine.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          magazine.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          magazine.year?.toString().includes(searchQuery)
        );
      })
      .filter((magazine) => {
        if (selectedYear === "all") return true;
        return magazine.year === parseInt(selectedYear, 10);
      });

    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "title":
          comparison = (a.title || "").localeCompare(b.title || "");
          break;
        case "views":
          comparison = (a.views || 0) - (b.views || 0);
          break;
        case "downloads":
          comparison = (a.downloads || 0) - (b.downloads || 0);
          break;
        case "year":
        default:
          comparison = (a.year || 0) - (b.year || 0);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [magazines, searchQuery, selectedYear, sortBy, sortOrder]);

  const years = useMemo(() => {
    const uniqueYears = [...new Set(magazines.map((m) => m.year).filter(Boolean))];
    return uniqueYears.sort((a, b) => b - a);
  }, [magazines]);

  const leadIssue = filteredAndSortedMagazines[0];

  if (loading) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center bg-[#f4f0e5] px-4">
        <div className="w-full max-w-md rounded-[2rem] border border-[#11281f12] bg-[#fffaf0] p-10 text-center shadow-[0_28px_80px_rgba(17,40,31,0.12)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#10392f] text-white">
            <Loader2 className="h-7 w-7 animate-spin" />
          </div>
          <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.35em] text-[#10392f]">
            Preparing Archive
          </p>
          <h2 className="mt-3 text-3xl font-black text-[#11281f]">School Magazine Library</h2>
          <p className="mt-3 text-sm leading-7 text-[#5f665e]">
            Bringing the Matungulu Girls editorial collection into view.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f0e5] text-[#11281f]">
      <section className="relative overflow-hidden border-b border-[#11281f12] bg-[#fffaf0]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,57,47,0.10),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(212,177,95,0.18),transparent_38%)]" />
        <div className="absolute inset-y-0 right-0 hidden w-[38%] border-l border-[#11281f12] bg-[linear-gradient(180deg,rgba(255,255,255,0.65),rgba(255,255,255,0.22))] lg:block" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_380px] lg:gap-14 lg:py-20">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-[#11281f12] bg-white px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.32em] text-[#5f665e] shadow-sm">
              <Sparkles className="h-4 w-4 text-[#d8b15a]" />
              Matungulu Girls Editorial Archive
            </div>

            <div className="max-w-3xl">
              <h1 className="text-2xl text-[#266c48]  sm:text-4xl lg:text-5xl">
                A digital magazine experience with a more refined school story.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#5f665e] sm:text-lg">
                Explore school editions through a more immersive archive built around achievement,
                student life, creative expression, and the signature confidence of Matungulu Girls Senior School.
              </p>
            </div>

         <div className="flex gap-4 flex-nowrap">
   <div className="min-w-0 flex-1 rounded-[1.6rem] border border-[#11281f12] bg-white p-5 shadow-sm">
     <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#5f665e]">Magazines</p>
     <p className="mt-3 text-4xl font-black text-[#10392f]">{stats.totalIssues}</p>
   </div>
   
   <div className="min-w-0 flex-1 rounded-[1.6rem] border border-[#11281f12] bg-white p-5 shadow-sm">
     <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#5f665e]">Timeline</p>
     <p className="mt-3 text-2xl font-black text-[#10392f]">
       {stats.earliestYear || "--"}
       {stats.latestYear && stats.latestYear !== stats.earliestYear ? ` to ${stats.latestYear}` : ""}
     </p>
   </div>
</div>
          </div>

          <div className="rounded-[2rem] border border-[#11281f12] bg-white p-6 shadow-[0_24px_80px_rgba(17,40,31,0.10)]">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.32em] text-[#5f665e]">
              Need To Know
            </p>
            <div className="mt-6 space-y-4">
              <div className="rounded-[1.5rem] border border-[#11281f12] bg-[#fffaf0] p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-[#f4ecda] p-3 text-[#7a5a1d]">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#11281f]">Immersive browsing</p>
                    <p className="mt-1 text-sm leading-6 text-[#5f665e]">
                      Use the gallery rail or switch to ledger view for a different archive rhythm.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-[#11281f12] bg-[#fffaf0] p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-[#f4ecda] p-3 text-[#7a5a1d]">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#11281f]">Built for students and parents</p>
                    <p className="mt-1 text-sm leading-6 text-[#5f665e]">
                      Each edition captures academics, co-curricular highlights, student voice, and school identity.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-[#11281f12] bg-[#fffaf0] p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-[#f4ecda] p-3 text-[#7a5a1d]">
                    <Download className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#11281f]">Keep an offline copy</p>
                    <p className="mt-1 text-sm leading-6 text-[#5f665e]">
                      Open any issue in the reader or download the PDF for later access.
                    </p>
                  </div>
                </div>
              </div>
            </div>

              {leadIssue && (
                <div className="mt-6 rounded-[1.6rem] border border-[#d8b15a]/25 bg-[#f3e5bc]/10 p-5">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#7a5a1d]">Featured edition</p>
                <h2 className="mt-3 text-2xl font-black text-[#11281f]">{leadIssue.title}</h2>
                <p className="mt-2 text-sm leading-7 text-[#5f665e]">
                  {leadIssue.description || "A showcase of School stories, student excellence, and school milestones."}
                </p>
                <button
                  onClick={() => setSelectedIssue(leadIssue)}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#d8b15a] px-5 py-3 text-sm font-black text-[#11281f]"
                >
                  Open Highlight
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-8 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl rounded-[2.2rem] border border-[#11281f12] bg-[#fffaf0]/95 p-4 shadow-[0_24px_80px_rgba(17,40,31,0.1)] backdrop-blur-xl sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_180px_180px_180px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5f665e]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search editions, stories, or years"
                  className="w-full rounded-[1.35rem] border border-[#11281f12] bg-white px-12 py-4 text-sm font-semibold text-[#11281f] outline-none transition focus:border-[#10392f]"
                />
              </div>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="rounded-[1.35rem] border border-[#11281f12] bg-white px-4 py-4 text-sm font-bold text-[#11281f] outline-none transition focus:border-[#10392f]"
              >
                <option value="all">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-[1.35rem] border border-[#11281f12] bg-white px-4 py-4 text-sm font-bold text-[#11281f] outline-none transition focus:border-[#10392f]"
              >
                <option value="year">Sort by Year</option>
                <option value="title">Sort by Title</option>
                <option value="views">Sort by Views</option>
                <option value="downloads">Sort by Downloads</option>
              </select>

              <button
                onClick={() => setSortOrder((current) => (current === "desc" ? "asc" : "desc"))}
                className="inline-flex items-center justify-center gap-2 rounded-[1.35rem] border border-[#11281f12] bg-white px-4 py-4 text-sm font-black text-[#11281f]"
              >
                <Filter className="h-4 w-4 text-[#10392f]" />
                {sortOrder === "desc" ? "Newest First" : "Oldest First"}
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setViewMode("gallery")}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-black transition ${
                  viewMode === "gallery"
                    ? "bg-[#10392f] text-white shadow-[0_14px_28px_rgba(16,57,47,0.2)]"
                    : "border border-[#11281f12] bg-white text-[#11281f]"
                }`}
              >
                <Grid3x3 className="h-4 w-4" />
                Gallery
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-black transition ${
                  viewMode === "list"
                    ? "bg-[#10392f] text-white shadow-[0_14px_28px_rgba(16,57,47,0.2)]"
                    : "border border-[#11281f12] bg-white text-[#11281f]"
                }`}
              >
                <List className="h-4 w-4" />
                Ledger
              </button>
              <button
                onClick={() => setShowFilters((current) => !current)}
                className="inline-flex items-center gap-2 rounded-full border border-[#11281f12] bg-[#f4ecda] px-5 py-3 text-sm font-black text-[#7a5a1d]"
              >
                <Grid3x3 className="h-4 w-4" />
                Archive Notes
                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-5 grid gap-4 border-t border-[#11281f12] pt-5 md:grid-cols-3">
                  <div className="rounded-[1.5rem] bg-white p-4">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#5f665e]">What you will find</p>
                    <p className="mt-3 text-sm leading-7 text-[#5f665e]">
                      Annual school highlights, prize-giving moments, clubs, academics, trips, student writing, and leadership features.
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] bg-white p-4">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#5f665e]">Reader tip</p>
                    <p className="mt-3 text-sm leading-7 text-[#5f665e]">
                      The premium reader supports swipe, keyboard arrows, direct page jump, bookmarking, sharing, and downloads.
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] bg-white p-4">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#5f665e]">Why it matters</p>
                    <p className="mt-3 text-sm leading-7 text-[#5f665e]">
                      Parents and students can quickly understand the school culture, achievements, values, and lived student experience.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        {leadIssue && (
          <div className="mb-10 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[2rem] border border-[#11281f12] bg-[#fffaf0] p-6 shadow-[0_24px_60px_rgba(17,40,31,0.08)] sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-[#10392f]">
                    Editorial spotlight
                  </p>
                  <h2 className="mt-3 text-3xl font-black text-[#11281f] sm:text-4xl">
                    {leadIssue.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedIssue(leadIssue)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#10392f] px-5 py-3 text-sm font-black text-white"
                >
                  Read Issue
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-[1.5rem] border border-[#11281f12] bg-[#f7f2e7] p-5">
                  <Calendar className="h-5 w-5 text-[#10392f]" />
                  <p className="mt-4 text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#5f665e]">Edition Year</p>
                  <p className="mt-2 text-2xl font-black text-[#11281f]">{leadIssue.year || "Current"}</p>
                </div>
                <div className="rounded-[1.5rem] border border-[#11281f12] bg-[#f7f2e7] p-5">
                  <FileText className="h-5 w-5 text-[#10392f]" />
                  <p className="mt-4 text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#5f665e]">Approx. Length</p>
                  <p className="mt-2 text-2xl font-black text-[#11281f]">{leadIssue.pages || 80} pages</p>
                </div>
                <div className="rounded-[1.5rem] border border-[#11281f12] bg-[#f7f2e7] p-5">
                  <Clock3 className="h-5 w-5 text-[#10392f]" />
                  <p className="mt-4 text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#5f665e]">Best Use</p>
                  <p className="mt-2 text-2xl font-black text-[#11281f]">Reader or PDF</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#11281f12] bg-white p-6 shadow-[0_24px_60px_rgba(17,40,31,0.08)] sm:p-8">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-[#5f665e]">
                Why this archive works
              </p>
              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-4 rounded-[1.35rem] border border-[#11281f12] bg-[#fffaf0] p-4">
                  <Star className="mt-1 h-5 w-5 text-[#7a5a1d]" />
                  <div>
                    <p className="font-black text-[#11281f]">More than a publication</p>
                    <p className="mt-1 text-sm leading-7 text-[#5f665e]">
                      It doubles as a school memory wall, a leadership record, and a celebration of girls' growth.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-[1.35rem] border border-[#11281f12] bg-[#fffaf0] p-4">
                  <Users className="mt-1 h-5 w-5 text-[#7a5a1d]" />
                  <div>
                    <p className="font-black text-[#11281f]">Useful for families</p>
                    <p className="mt-1 text-sm leading-7 text-[#5f665e]">
                      Parents can quickly see the school’s culture, visibility of student voice, and the breadth of activities.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-[1.35rem] border border-[#11281f12] bg-[#fffaf0] p-4">
                  <Trophy className="mt-1 h-5 w-5 text-[#7a5a1d]" />
                  <div>
                    <p className="font-black text-[#11281f]">Useful for students</p>
                    <p className="mt-1 text-sm leading-7 text-[#5f665e]">
                      Students see themselves reflected through stories of achievement, talent, participation, and belonging.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {filteredAndSortedMagazines.length === 0 ? (
          <div className="rounded-[2rem] border border-[#11281f12] bg-[#fffaf0] px-6 py-20 text-center shadow-[0_24px_60px_rgba(17,40,31,0.08)]">
            <BookOpen className="mx-auto h-14 w-14 text-[#10392f]" />
            <h3 className="mt-6 text-3xl font-black text-[#11281f]">No editions match this search</h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#5f665e]">
              Try another year, title, or keyword to reopen the archive trail.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedYear("all");
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#10392f] px-5 py-3 text-sm font-black text-white"
            >
              Reset Archive
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : viewMode === "gallery" ? (
          <div className="space-y-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-[#10392f]">Gallery rail</p>
                <h2 className="mt-3 text-3xl font-black text-[#11281f] sm:text-4xl">
                  Explore editions in a cinematic flow
                </h2>
              </div>
                <p className="hidden max-w-sm text-right text-sm leading-7 text-[#5f665e] lg:block">
                Browse polished edition cards, then open any copy in the reader or save the PDF for offline reading.
              </p>
            </div>
            <div className="pb-4">
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredAndSortedMagazines.map((issue, index) => (
                  <MagazineCard
                    key={issue.id || `${issue.title}-${index}`}
                    issue={issue}
                    onOpen={setSelectedIssue}
                    viewMode="gallery"
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredAndSortedMagazines.map((issue, index) => (
              <MagazineCard
                key={issue.id || `${issue.title}-${index}`}
                issue={issue}
                onOpen={setSelectedIssue}
                viewMode="list"
                index={index}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-20 sm:px-6 md:grid-cols-3">
        <InfoTile
          icon={Eye}
          eyebrow="For Parents"
          title="See the school culture"
          text="The archive helps families understand the rhythm of school life, student leadership, academic focus, and the confidence-building atmosphere of the school."
          tone="ivory"
        />
        <InfoTile
          icon={Users}
          eyebrow="For Students"
          title="Follow student voice"
          text="Stories, photography, reports, and highlights make the editions feel personal while still documenting excellence and growth."
          tone="emerald"
        />
        <InfoTile
          icon={Sparkles}
          eyebrow="For The Community"
          title="Keep the school story alive"
          text="Each edition becomes a living archive of memory, identity, and achievement, preserving the evolving story of Matungulu Girls Senior School."
          tone="rose"
        />
      </section>

      {selectedIssue && <BookReader issue={selectedIssue} onClose={() => setSelectedIssue(null)} />}
      <ScrollToTop />
    </div>
  );
}
