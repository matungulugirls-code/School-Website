"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  BookOpen, Search, Calendar, FileText, Trophy, Users, Sparkles,
  Clock, Filter, Grid3x3, List, TrendingUp, Award, Star,
  ChevronDown, ChevronUp, Eye, Heart, Share2, Download,
  Bookmark, BookmarkCheck, AlertCircle, X, Loader2, GraduationCap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { IoSparkles } from 'react-icons/io5';
import { CircularProgress, Box, Stack } from '@mui/material';

// Matungulu Girls Color Palette
const colors = {
  primary: "#7B2D8E",    // Rich Purple
  secondary: "#FF69B4",  // Hot Pink
  accent: "#4CAF50",     // Fresh Green
  light: "#F3E5F5",      // Light Purple tint
  dark: "#4A148C",       // Deep Purple
  gradient: "linear-gradient(135deg, #7B2D8E 0%, #FF69B4 50%, #4CAF50 100%)",
  bgLight: "#FFF5F8",    // Soft pinkish white
  textDark: "#2C1810",   // Dark brown-black for text
  textLight: "#FFFFFF"
};

// Dynamic import for BookReader
const BookReader = dynamic(() => import("../../components/book/BookReader"), {
  loading: () => (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div>
        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-600" size={24} />
      </div>
    </div>
  ),
  ssr: false
});

// Scroll to Top Component
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          style={{ background: colors.gradient }}
        >
          <ChevronUp size={20} className="text-white" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// Enhanced Magazine Card Component
const MagazineCard = ({ issue, onOpen, viewMode = "grid" }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarked_magazines') || '[]');
    setIsBookmarked(savedBookmarks.includes(issue.id));
  }, [issue.id]);

  const handleBookmark = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    const saved = JSON.parse(localStorage.getItem('bookmarked_magazines') || '[]');
    if (!isBookmarked) {
      saved.push(issue.id);
    } else {
      const index = saved.indexOf(issue.id);
      if (index > -1) saved.splice(index, 1);
    }
    localStorage.setItem('bookmarked_magazines', JSON.stringify(saved));
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: issue.title,
          text: `Check out ${issue.title} magazine from Matungulu Girls Senior School!`,
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

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, boxShadow: "0 20px 25px -12px rgba(0, 0, 0, 0.1)" }}
        onClick={() => onOpen(issue)}
        className="bg-white rounded-2xl shadow-md cursor-pointer overflow-hidden border transition-all duration-300"
        style={{ borderColor: colors.primary + '20' }}
      >
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-48 h-48 sm:h-auto bg-gradient-to-br" style={{ background: colors.gradient + '10' }}>
            {issue.thumbnail ? (
              <Image
                src={issue.thumbnail}
                alt={issue.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <BookOpen className="w-12 h-12" style={{ color: colors.primary }} />
              </div>
            )}
            <div className="absolute top-3 left-3 rounded-lg px-2 py-1" style={{ background: colors.gradient }}>
              <span className="text-white text-xs font-bold">{issue.year}</span>
            </div>
          </div>

          <div className="flex-1 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold mb-1" style={{ color: colors.dark }}>{issue.title}</h3>
                <div className="flex items-center gap-3 text-sm mb-3" style={{ color: colors.primary }}>
                  <span className="flex items-center gap-1 font-semibold">
                    <Calendar size={14} />
                    {issue.year}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button 
                  onClick={handleBookmark} 
                  className={`p-1.5 rounded-full transition-all duration-300 ${
                    isBookmarked ? 'bg-purple-100' : 'hover:bg-gray-100'
                  }`}
                  style={{ color: isBookmarked ? colors.primary : colors.textDark }}
                >
                  {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                </button>
                <button 
                  onClick={handleShare} 
                  className="p-1.5 rounded-full transition-all duration-300 hover:bg-gray-100"
                  style={{ color: colors.textDark }}
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
              {issue.description || "Annual magazine showcasing school achievements, events, and student stories from Matungulu Girls Senior School."}
            </p>

            <div className="flex items-center justify-between">
              <span 
                className="text-sm font-semibold flex items-center gap-1 transition-all duration-300 group-hover:gap-2"
                style={{ color: colors.primary }}
              >
                Read Now →
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onOpen(issue)}
      className="bg-white rounded-2xl shadow-lg cursor-pointer overflow-hidden transition-all duration-300"
      style={{ boxShadow: isHovered ? `0 20px 30px -12px ${colors.primary}40` : "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br" style={{ background: colors.gradient + '20' }} />
        {issue.thumbnail ? (
          <Image src={issue.thumbnail} alt={issue.title} fill className="object-cover transition-transform duration-500" style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <BookOpen className="w-16 h-16" style={{ color: colors.primary }} />
          </div>
        )}
        <div className="absolute top-3 left-3 rounded-lg px-2 py-1 shadow-lg" style={{ background: colors.gradient }}>
          <span className="text-white text-xs font-bold">{issue.year}</span>
        </div>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/40 flex items-center justify-center"
          >
            <span className="text-white font-bold text-sm px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
              Click to Read →
            </span>
          </motion.div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 line-clamp-1" style={{ color: colors.dark }}>
          {issue.title}
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {issue.description || "Annual magazine showcasing school achievements, events, and student stories from Matungulu Girls Senior School."}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold" style={{ color: colors.primary }}>
              📖 Digital Edition
            </span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleBookmark} 
              className={`p-1.5 rounded-full transition-all duration-300 ${
                isBookmarked ? 'bg-purple-100' : 'hover:bg-gray-100'
              }`}
              style={{ color: isBookmarked ? colors.primary : colors.textDark }}
            >
              {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>
            <button 
              onClick={handleShare} 
              className="p-1.5 rounded-full transition-all duration-300 hover:bg-gray-100"
              style={{ color: colors.textDark }}
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
        
        {issue.pdfUrl && (
          <a
            href={issue.pdfUrl}
            download
            onClick={e => e.stopPropagation()}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-white rounded-xl font-bold text-xs transition-all duration-300 hover:shadow-lg hover:scale-105"
            style={{ background: colors.gradient }}
          >
            <Download size={16} /> DOWNLOAD PDF
          </a>
        )}
      </div>
    </motion.div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.02 }}
    className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300"
    style={{ borderBottom: `3px solid ${colors.secondary}` }}
  >
    <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md" style={{ background: colors.gradient }}>
      <Icon className="text-white" size={24} />
    </div>
    <h3 className="font-bold mb-2" style={{ color: colors.dark }}>{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </motion.div>
);

// Main Component
export default function MagazineArchive() {
  const [magazines, setMagazines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("year");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    totalIssues: 0,
    totalPages: 0,
    earliestYear: null,
    latestYear: null
  });

  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/school');
        const data = await response.json();
        
        console.log("Fetched school data:", data);
        
        let magazinesArray = [];
        
        if (data.success && data.school) {
          if (data.school.magazine) {
            magazinesArray = [data.school.magazine];
          } else if (data.school.Magazine) {
            magazinesArray = [data.school.Magazine];
          }
        }
        
        if (data.magazines && Array.isArray(data.magazines)) {
          magazinesArray = data.magazines;
        }
        
        console.log("Processed magazines:", magazinesArray);
        
        setMagazines(magazinesArray);

        if (magazinesArray.length > 0) {
          const years = magazinesArray.map(m => m.year).filter(y => y);
          const totalPages = magazinesArray.reduce((sum, m) => sum + (m.pages || 80), 0);
          setStats({
            totalIssues: magazinesArray.length,
            totalPages: totalPages,
            earliestYear: years.length ? Math.min(...years) : null,
            latestYear: years.length ? Math.max(...years) : null
          });
        }
      } catch (error) {
        console.error('Error fetching school/magazines:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMagazines();
  }, []);

  const filteredAndSortedMagazines = useMemo(() => {
    let filtered = [...magazines];

    if (searchQuery) {
      filtered = filtered.filter(m =>
        m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.year?.toString().includes(searchQuery)
      );
    }

    if (selectedYear !== "all") {
      filtered = filtered.filter(m => m.year === parseInt(selectedYear));
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "year":
          comparison = (a.year || 0) - (b.year || 0);
          break;
        case "title":
          comparison = (a.title || "").localeCompare(b.title || "");
          break;
        case "views":
          comparison = (a.views || 0) - (b.views || 0);
          break;
        case "downloads":
          comparison = (a.downloads || 0) - (b.downloads || 0);
          break;
        default:
          comparison = (a.year || 0) - (b.year || 0);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [magazines, searchQuery, selectedYear, sortBy, sortOrder]);

  const years = useMemo(() => {
    const uniqueYears = [...new Set(magazines.map(m => m.year).filter(y => y))];
    return uniqueYears.sort((a, b) => b - a);
  }, [magazines]);

  if (loading) {
    return (
      <Box className="min-h-[70vh] flex items-center justify-center p-4" style={{ background: colors.bgLight }}>
        <Stack spacing={2} alignItems="center" className="w-full transition-all duration-500">
          <Box className="relative flex items-center justify-center scale-90 sm:scale-110">
            <CircularProgress
              variant="determinate"
              value={100}
              size={48}
              thickness={4.5}
              sx={{ color: colors.primary + '30' }}
            />
            <CircularProgress
              variant="indeterminate"
              disableShrink
              size={48}
              thickness={4.5}
              sx={{
                color: colors.primary,
                animationDuration: '1000ms',
                position: 'absolute',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                },
              }}
            />
            <Box className="absolute">
              <Sparkles className="text-purple-600 text-sm animate-pulse" />
            </Box>
          </Box>
          <div className="text-center px-4">
            <p className="font-medium text-sm sm:text-base tracking-tight" style={{ color: colors.primary }}>
              Loading School Magazines
            </p>
            <p className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-widest mt-1 font-bold">
              Matungulu Girls Senior School
            </p>
          </div>
        </Stack>
      </Box>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: colors.bgLight }}>
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden" style={{ background: colors.gradient }}>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-4 h-4 text-pink-200" />
              <span className="text-sm font-bold tracking-wide">Digital Archive</span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black mb-6 tracking-tight">
              Matungulu Girls
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-purple-200">
                Magazine Archive
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed">
              Discover the rich history, achievements, and inspiring stories of Matungulu Girls Senior School through our digital magazine collection.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-16 flex flex-wrap justify-center gap-12"
          >
            <div className="text-center group">
              <div className="text-4xl font-black text-white group-hover:text-pink-200 transition-colors">
                {stats.totalIssues}
              </div>
              <div className="text-purple-200 text-xs uppercase tracking-widest font-bold mt-1">Issues</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-black text-white group-hover:text-pink-200 transition-colors">
                {stats.totalPages}+
              </div>
              <div className="text-purple-200 text-xs uppercase tracking-widest font-bold mt-1">Pages</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-black text-white group-hover:text-pink-200 transition-colors">
                {stats.earliestYear || "-"} {stats.latestYear && stats.earliestYear !== stats.latestYear ? `- ${stats.latestYear}` : ""}
              </div>
              <div className="text-purple-200 text-xs uppercase tracking-widest font-bold mt-1">Timeline</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="sticky top-0 z-30 bg-white/95 backdrop-blur-md shadow-lg py-4 px-2 sm:px-6 border-b" style={{ borderColor: colors.primary + '20' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} style={{ color: colors.primary }} />
              <input
                type="text"
                placeholder="Search by title, year, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border-2 rounded-xl text-sm font-medium focus:outline-none focus:border-purple-400 transition-all"
                style={{ borderColor: colors.primary + '30', color: colors.textDark }}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2 flex-wrap">
              
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2.5 bg-white border-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-300 hover:shadow-md"
                style={{ borderColor: colors.primary + '30', color: colors.primary }}
              >
                <Filter size={16} />
                Filters
                {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {/* View Mode */}
              <div className="flex bg-gray-100 rounded-xl p-1 border-2" style={{ borderColor: colors.primary + '30' }}>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === "grid"
                      ? "text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                  style={{ background: viewMode === "grid" ? colors.gradient : 'transparent' }}
                >
                  <Grid3x3 size={18} />
                </button>

                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === "list"
                      ? "text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                  style={{ background: viewMode === "list" ? colors.gradient : 'transparent' }}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t-2"
                style={{ borderColor: colors.primary + '20' }}
              >
                <div className="flex flex-wrap gap-4">
                  
                  {/* Year */}
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-xs font-semibold mb-1" style={{ color: colors.primary }}>
                      Year
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full px-3 py-2 bg-white border-2 rounded-lg text-sm font-medium focus:outline-none focus:border-purple-400 transition-all"
                      style={{ borderColor: colors.primary + '30', color: colors.textDark }}
                    >
                      <option value="all">All Years</option>
                      {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sort */}
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-xs font-semibold mb-1" style={{ color: colors.primary }}>
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 bg-white border-2 rounded-lg text-sm font-medium focus:outline-none focus:border-purple-400 transition-all"
                      style={{ borderColor: colors.primary + '30', color: colors.textDark }}
                    >
                      <option value="year">Year</option>
                      <option value="title">Title</option>
                      <option value="views">Most Viewed</option>
                      <option value="downloads">Most Downloaded</option>
                    </select>
                  </div>

                  {/* Order */}
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-xs font-semibold mb-1" style={{ color: colors.primary }}>
                      Order
                    </label>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="w-full px-3 py-2 bg-white border-2 rounded-lg text-sm font-medium focus:outline-none focus:border-purple-400 transition-all"
                      style={{ borderColor: colors.primary + '30', color: colors.textDark }}
                    >
                      <option value="desc">Newest First</option>
                      <option value="asc">Oldest First</option>
                    </select>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Magazine Grid/List */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
        {filteredAndSortedMagazines.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <BookOpen className="mx-auto mb-4" size={64} style={{ color: colors.primary }} />
            <h3 className="text-xl font-bold mb-2" style={{ color: colors.dark }}>No magazines found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedYear("all");
              }}
              className="mt-4 px-4 py-2 text-white rounded-xl text-sm font-bold transition-all duration-300 hover:shadow-lg hover:scale-105"
              style={{ background: colors.gradient }}
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {filteredAndSortedMagazines.map((issue, index) => (
              <MagazineCard
                key={issue.id || index}
                issue={issue}
                onOpen={setSelectedIssue}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black mb-2" style={{ color: colors.dark }}>Why Read Our Magazine?</h2>
            <p className="text-gray-600 mt-2">Every edition captures the essence of Matungulu Girls</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={Trophy}
              title="Achievements"
              description="Academic and co-curricular excellence recognized and celebrated"
            />
            <FeatureCard
              icon={Users}
              title="Student Stories"
              description="Inspiring journeys and success stories of our young women"
            />
            <FeatureCard
              icon={Calendar}
              title="Events Coverage"
              description="Memorable moments from school events and activities"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-3xl p-10 shadow-2xl"
            style={{ background: colors.gradient }}
          >
            <Sparkles className="text-white mx-auto mb-4" size={32} />
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
              Missing an Edition?
            </h2>
            <p className="text-purple-100 mb-6">
              Past magazines are being digitized. Check back soon for more issues!
            </p>
            <div className="inline-flex items-center gap-2 text-white/80 text-sm">
              <Clock size={14} />
              <span>New issues added annually after publication</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modal */}
      {selectedIssue && (
        <BookReader issue={selectedIssue} onClose={() => setSelectedIssue(null)} />
      )}
      
      <ScrollToTop />
    </div>
  );
}