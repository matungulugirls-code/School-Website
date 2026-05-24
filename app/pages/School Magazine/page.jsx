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

const MagazineCard = ({ issue, onOpen, viewMode = "gallery" }) => {
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
      onClick={() => onOpen(issue)}
      className={`group w-full cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:shadow-lg ${
        isList ? "grid lg:grid-cols-[minmax(300px,0.85fr)_minmax(0,1.25fr)]" : "flex h-full flex-col"
      }`}
    >
      <div className={`relative w-full bg-slate-100 ${isList ? "min-h-[260px] sm:min-h-[320px] lg:min-h-[300px]" : "h-64 sm:h-72"}`}>
        {issue.thumbnail ? (
          <Image
            src={issue.thumbnail}
            alt={issue.title}
            fill
            className="object-cover transition-transform duration-500"
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
            <ArrowRight className="h-4 w-4 transition-transform duration-300" />
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
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white transition">
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
  const timelineLabel = stats.earliestYear
    ? `${stats.earliestYear}${stats.latestYear && stats.latestYear !== stats.earliestYear ? ` to ${stats.latestYear}` : ""}`
    : "--";
  const heroStats = [
    { label: "Published Editions", value: stats.totalIssues, icon: BookOpen },
    { label: "Archive Pages", value: stats.totalPages || 0, icon: FileText },
    { label: "Timeline", value: timelineLabel, icon: Calendar },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center bg-white px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <Loader2 className="h-7 w-7 animate-spin" />
          </div>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            Preparing Archive
          </p>
          <h2 className="mt-3 text-3xl font-black text-slate-950">School Magazine Library</h2>
          <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
            Bringing the Matungulu Girls editorial collection into view.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-2xl bg-white text-slate-950 shadow-sm">
          <div className="flex flex-col items-center justify-center px-5 py-10 text-center sm:px-8 sm:py-12 lg:px-12">
            <div className="inline-flex max-w-full items-center gap-3 rounded-full bg-slate-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-slate-600">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
                <Image
                  src="/MatG.jpg"
                  alt="Matungulu Girls Logo"
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </span>
              Matungulu Girls Senior School
            </div>

            <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
              <BookOpen className="h-8 w-8" />
            </div>

            <div className="mx-auto mt-8 max-w-4xl">
              <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-5xl">
                School Magazine
                <span className="block text-slate-700">Editorial Archive</span>
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-7 text-slate-600 sm:text-base">
                Explore school editions, student stories, achievements, activities, and memories in the same clean public-page experience used across the School Hub.
              </p>
            </div>

            <div className="mt-8 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
              {heroStats.map(({ label, value, icon: StatIcon }) => (
                <div key={label} className="rounded-2xl bg-slate-50 px-5 py-4 text-center">
                  <StatIcon className="mx-auto mb-3 h-5 w-5 text-slate-500" />
                  <p className="text-2xl font-black text-slate-950">{value}</p>
                  <p className="mt-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {leadIssue && (
              <div className="mt-8 w-full max-w-3xl rounded-2xl bg-white p-5 text-slate-900 shadow-sm">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
                  Featured Edition
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">{leadIssue.title}</h2>
                <ExpandableDescription
                  text={leadIssue.description || defaultMagazineDescription}
                  limit={190}
                  className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-7 text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setSelectedIssue(leadIssue)}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  Read Issue
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-center lg:text-left">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                Browse Magazines
              </p>
              <h2 className="mt-1 text-xl font-black text-slate-950">
                Find the right edition faster
              </h2>
            </div>

            <div className="grid w-full gap-3 lg:max-w-4xl lg:grid-cols-[minmax(0,1fr)_150px_170px_170px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search editions, stories, or years"
                  className="h-12 w-full rounded-xl bg-slate-50 py-3 pl-11 pr-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-500/10"
                />
              </div>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="h-12 rounded-xl bg-slate-50 px-4 text-sm font-bold text-slate-800 outline-none transition focus:bg-white focus:ring-4 focus:ring-slate-500/10"
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
                className="h-12 rounded-xl bg-slate-50 px-4 text-sm font-bold text-slate-800 outline-none transition focus:bg-white focus:ring-4 focus:ring-slate-500/10"
              >
                <option value="year">Sort by Year</option>
                <option value="title">Sort by Title</option>
                <option value="views">Sort by Views</option>
                <option value="downloads">Sort by Downloads</option>
              </select>

              <button
                type="button"
                onClick={() => setSortOrder((current) => (current === "desc" ? "asc" : "desc"))}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 text-sm font-bold text-slate-800 transition hover:bg-slate-100"
              >
                <Filter className="h-4 w-4 text-slate-500" />
                {sortOrder === "desc" ? "Newest First" : "Oldest First"}
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-3 lg:justify-end">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                viewMode === "list" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <List className="h-4 w-4" />
              List
            </button>
            <button
              type="button"
              onClick={() => setViewMode("gallery")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                viewMode === "gallery" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Grid3x3 className="h-4 w-4" />
              Grid
            </button>
            <button
              type="button"
              onClick={() => setShowFilters((current) => !current)}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
            >
              <Sparkles className="h-4 w-4" />
              Notes
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-5 grid gap-3 border-t border-slate-100 pt-5 md:grid-cols-3">
                  {[
                    {
                      icon: Star,
                      title: "What you will find",
                      text: "Annual highlights, prize-giving moments, academics, trips, student writing, leadership, and school activities.",
                    },
                    {
                      icon: Clock3,
                      title: "Reader tip",
                      text: "Open any edition in the document reader, scroll naturally from top to bottom, and download the PDF when available.",
                    },
                    {
                      icon: Trophy,
                      title: "Why it matters",
                      text: "The archive preserves school identity while helping families understand student life, achievement, and culture.",
                    },
                  ].map(({ icon: NoteIcon, title, text }) => (
                    <div key={title} className="rounded-2xl bg-slate-50 p-4">
                      <NoteIcon className="h-5 w-5 text-slate-500" />
                      <p className="mt-4 text-sm font-black text-slate-950">{title}</p>
                      <p className="mt-2 text-sm font-medium leading-7 text-slate-600">{text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <section className="mt-8">
          {filteredAndSortedMagazines.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <BookOpen className="h-10 w-10 text-slate-400" />
              </div>
              <h2 className="text-xl font-black text-slate-800">No editions match this search</h2>
              <p className="mt-2 text-sm font-medium text-slate-500">
                Try another year, title, or keyword to reopen the archive.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedYear("all");
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Reset Archive
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              <section>
                <div className="mb-5 flex flex-col items-center justify-between gap-3 pb-4 text-center sm:flex-row sm:text-left">
                  <div className="flex flex-col items-center gap-3 sm:flex-row">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-950">Magazine Editions</h2>
                      <p className="text-xs font-bold uppercase text-slate-500">
                        {filteredAndSortedMagazines.length}{" "}
                        {filteredAndSortedMagazines.length === 1 ? "edition" : "editions"} available
                      </p>
                    </div>
                  </div>
                </div>

                <div className={viewMode === "gallery" ? "grid gap-5 md:grid-cols-2 xl:grid-cols-3" : "grid gap-5 rounded-2xl bg-slate-50 p-3 sm:p-4"}>
                  {filteredAndSortedMagazines.map((issue, index) => (
                    <MagazineCard
                      key={issue.id || `${issue.title}-${index}`}
                      issue={issue}
                      onOpen={setSelectedIssue}
                      viewMode={viewMode}
                      index={index}
                    />
                  ))}
                </div>
              </section>
            </div>
          )}
        </section>

        <section className="mt-10 grid gap-5 pb-14 md:grid-cols-3">
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
      </main>

      {selectedIssue && <BookReader issue={selectedIssue} onClose={() => setSelectedIssue(null)} />}
      <ScrollToTop />
    </div>
  );
}
