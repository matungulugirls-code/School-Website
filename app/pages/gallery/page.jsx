'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { toast, Toaster } from 'sonner';
import { 
  FiSearch, FiFilter, FiX, FiHome, FiChevronLeft, FiChevronRight,
  FiDownload, FiShare2, FiHeart, FiImage, FiVideo, FiPlay, FiPause,
  FiVolume2, FiVolumeX, FiGrid, FiList, FiChevronUp, FiChevronDown,
  FiUsers, FiBook, FiAward, FiMusic, FiMic, FiCamera, FiCalendar,
  FiUser, FiBookOpen, FiTarget, FiStar, FiGlobe, FiMessageSquare,
  FiFacebook, FiTwitter, FiFileText, FiInfo, FiRefreshCw, FiEye,
  FiBookmark, FiExternalLink, FiZap, FiTrendingUp, FiCopy, FiBell,
  FiUserPlus, FiArrowRight, FiPlus, FiRotateCw, FiEdit3, FiTrash2,
  FiSave, FiUpload, FiMapPin, FiAlertTriangle, FiMail, FiPhone, FiFolder, FiLock, FiMonitor 
} from 'react-icons/fi';
import { FaWhatsapp, FaFacebookF, FaTwitter, FaCopy, FaLeaf } from 'react-icons/fa';
import { 
  IoClose, IoMenu, IoSparkles, IoSchoolOutline
} from 'react-icons/io5';
import {
  IoCalendarClearOutline,
  IoRibbonOutline,
  IoPeopleCircle,
  IoStatsChart,
  IoShareSocialOutline,
  IoLocationOutline,
  IoTimeOutline,
  IoPersonOutline,
  IoShareOutline,
  IoNewspaperOutline
} from 'react-icons/io5';
import { CircularProgress, Box, Typography, Stack } from '@mui/material';

// Modern Modal Component
const ModernModal = ({ children, open, onClose, maxWidth = '800px', blur = true }) => {
  if (!open) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${blur ? 'backdrop-blur-md bg-[#172033]/45' : 'bg-black/50'}`}>
      <div 
        className="relative overflow-hidden rounded-[32px] border border-[#d9d0c3] bg-[#fcfaf6] shadow-2xl"
        style={{ 
          width: '90%',
          maxWidth: maxWidth,
          maxHeight: '90vh'
        }}
      >
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d9d0c3] bg-white/90 shadow-sm backdrop-blur-sm"
          >
            <FiX className="h-5 w-5 text-[#172033]" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Modern Hero Banner Component - Matungulu Girls Theme
const ModernHeroBanner = ({ stats, onRefresh }) => {
  return (
    <div className="relative mb-8 overflow-hidden rounded-lg border border-[#d9d0c3] bg-[#172033] text-white shadow-[0_30px_80px_-50px_rgba(15,23,42,0.82)]">
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-[#f2c357]/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute inset-y-0 right-[37%] hidden w-px bg-white/10 lg:block" />
      
      <div className="relative z-10 grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="p-6 md:p-10">
          <div className="flex h-full flex-col justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-1 rounded-full bg-[#f2c357] shadow-[0_0_15px_rgba(242,195,87,0.5)]" />
              <div>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#f2c357]">
                  Matungulu Girls Senior School
                </h2>
                <p className="text-[10px] italic font-medium text-white/45 tracking-widest uppercase">
                  "Strive to Excel"
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-white/10 bg-white/10 p-2 backdrop-blur-md">
                <IoSchoolOutline className="text-2xl text-[#f2c357]" />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white md:text-3xl lg:text-4xl">
                School <span className="bg-gradient-to-r from-[#f2c357] to-[#fff3c4] bg-clip-text text-transparent">Gallery</span>
              </h1>
            </div>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
              Explore School life, achievements, learning spaces, and student moments through a more refined Matungulu Girls gallery experience.
            </p>
          </div>
          
      <button
  onClick={onRefresh}
  className="flex w-full max-w-xs items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-black text-sm tracking-wide text-white backdrop-blur-xl transition-all hover:bg-white/20 sm:w-max sm:px-8"
>
  <FiRefreshCw className="text-lg" />
  <span>REFRESH GALLERY</span>
</button>
        </div>
        </div>

        <div className="border-t border-white/10 p-6 lg:border-l lg:border-t-0 md:p-10">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/40">Media Files</p>
              <p className="mt-2 text-3xl font-black text-white">{stats.totalFiles}</p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/40">Categories</p>
              <p className="mt-2 text-3xl font-black text-white">{stats.totalCategories}</p>
            </div>
            <div className="col-span-2 rounded-[22px] border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/40">This View</p>
              <p className="mt-2 text-sm font-bold text-[#f2c357]">
                {stats.thisMonth} galleries currently surfaced in the collection
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ModernGalleryCard = ({ gallery, onView, onFavorite, viewMode = 'grid', onShare }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const getCategoryStyle = (category) => {
    const styles = {
      // Original categories
      GENERAL: { 
        gradient: 'from-emerald-600 to-teal-600', 
        bg: 'bg-emerald-50', 
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
        buttonBg: 'bg-emerald-600',
      },
      CLASSROOMS: { 
        gradient: 'from-blue-600 to-cyan-600', 
        bg: 'bg-blue-50', 
        text: 'text-blue-700',
        border: 'border-blue-200',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        buttonBg: 'bg-blue-600',
      },
      LABORATORIES: { 
        gradient: 'from-amber-600 to-orange-600', 
        bg: 'bg-amber-50', 
        text: 'text-amber-700',
        border: 'border-amber-200',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        buttonBg: 'bg-amber-600',
      },
      DORMITORIES: { 
        gradient: 'from-purple-600 to-pink-600', 
        bg: 'bg-purple-50', 
        text: 'text-purple-700',
        border: 'border-purple-200',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        buttonBg: 'bg-purple-600',
      },
      DINING_HALL: { 
        gradient: 'from-orange-600 to-red-600', 
        bg: 'bg-orange-50', 
        text: 'text-orange-700',
        border: 'border-orange-200',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        buttonBg: 'bg-orange-600',
      },
      SPORTS_FACILITIES: { 
        gradient: 'from-green-600 to-lime-600', 
        bg: 'bg-green-50', 
        text: 'text-green-700',
        border: 'border-green-200',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        buttonBg: 'bg-green-600',
      },
      TEACHING: { 
        gradient: 'from-indigo-600 to-purple-600', 
        bg: 'bg-indigo-50', 
        text: 'text-indigo-700',
        border: 'border-indigo-200',
        iconBg: 'bg-indigo-100',
        iconColor: 'text-indigo-600',
        buttonBg: 'bg-indigo-600',
      },
      SCIENCE_LAB: { 
        gradient: 'from-cyan-600 to-blue-600', 
        bg: 'bg-cyan-50', 
        text: 'text-cyan-700',
        border: 'border-cyan-200',
        iconBg: 'bg-cyan-100',
        iconColor: 'text-cyan-600',
        buttonBg: 'bg-cyan-600',
      },
      COMPUTER_LAB: { 
        gradient: 'from-sky-600 to-indigo-600', 
        bg: 'bg-sky-50', 
        text: 'text-sky-700',
        border: 'border-sky-200',
        iconBg: 'bg-sky-100',
        iconColor: 'text-sky-600',
        buttonBg: 'bg-sky-600',
      },
      SPORTS_DAY: { 
        gradient: 'from-red-600 to-rose-600', 
        bg: 'bg-red-50', 
        text: 'text-red-700',
        border: 'border-red-200',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        buttonBg: 'bg-red-600',
      },
      MUSIC_FESTIVAL: { 
        gradient: 'from-fuchsia-600 to-pink-600', 
        bg: 'bg-fuchsia-50', 
        text: 'text-fuchsia-700',
        border: 'border-fuchsia-200',
        iconBg: 'bg-fuchsia-100',
        iconColor: 'text-fuchsia-600',
        buttonBg: 'bg-fuchsia-600',
      },
      DRAMA_PERFORMANCE: { 
        gradient: 'from-pink-600 to-rose-600', 
        bg: 'bg-pink-50', 
        text: 'text-pink-700',
        border: 'border-pink-200',
        iconBg: 'bg-pink-100',
        iconColor: 'text-pink-600',
        buttonBg: 'bg-pink-600',
      },
      ART_EXHIBITION: { 
        gradient: 'from-violet-600 to-purple-600', 
        bg: 'bg-violet-50', 
        text: 'text-violet-700',
        border: 'border-violet-200',
        iconBg: 'bg-violet-100',
        iconColor: 'text-violet-600',
        buttonBg: 'bg-violet-600',
      },
      DEBATE_COMPETITION: { 
        gradient: 'from-teal-600 to-emerald-600', 
        bg: 'bg-teal-50', 
        text: 'text-teal-700',
        border: 'border-teal-200',
        iconBg: 'bg-teal-100',
        iconColor: 'text-teal-600',
        buttonBg: 'bg-teal-600',
      },
      SCIENCE_FAIR: { 
        gradient: 'from-lime-600 to-green-600', 
        bg: 'bg-lime-50', 
        text: 'text-lime-700',
        border: 'border-lime-200',
        iconBg: 'bg-lime-100',
        iconColor: 'text-lime-600',
        buttonBg: 'bg-lime-600',
      },
      ADMIN_OFFICES: { 
        gradient: 'from-slate-600 to-gray-600', 
        bg: 'bg-slate-50', 
        text: 'text-slate-700',
        border: 'border-slate-200',
        iconBg: 'bg-slate-100',
        iconColor: 'text-slate-600',
        buttonBg: 'bg-slate-600',
      },
      STAFF: { 
        gradient: 'from-gray-600 to-zinc-600', 
        bg: 'bg-gray-50', 
        text: 'text-gray-700',
        border: 'border-gray-200',
        iconBg: 'bg-gray-100',
        iconColor: 'text-gray-600',
        buttonBg: 'bg-gray-600',
      },
      PRINCIPAL: { 
        gradient: 'from-yellow-600 to-amber-600', 
        bg: 'bg-yellow-50', 
        text: 'text-yellow-700',
        border: 'border-yellow-200',
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        buttonBg: 'bg-yellow-600',
      },
      BOARD: { 
        gradient: 'from-stone-600 to-neutral-600', 
        bg: 'bg-stone-50', 
        text: 'text-stone-700',
        border: 'border-stone-200',
        iconBg: 'bg-stone-100',
        iconColor: 'text-stone-600',
        buttonBg: 'bg-stone-600',
      },
      GRADUATION: { 
        gradient: 'from-emerald-600 to-green-600', 
        bg: 'bg-emerald-50', 
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
        buttonBg: 'bg-emerald-600',
      },
      AWARD_CEREMONY: { 
        gradient: 'from-amber-600 to-yellow-600', 
        bg: 'bg-amber-50', 
        text: 'text-amber-700',
        border: 'border-amber-200',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        buttonBg: 'bg-amber-600',
      },
      PARENTS_DAY: { 
        gradient: 'from-rose-600 to-pink-600', 
        bg: 'bg-rose-50', 
        text: 'text-rose-700',
        border: 'border-rose-200',
        iconBg: 'bg-rose-100',
        iconColor: 'text-rose-600',
        buttonBg: 'bg-rose-600',
      },
      OPEN_DAY: { 
        gradient: 'from-sky-600 to-blue-600', 
        bg: 'bg-sky-50', 
        text: 'text-sky-700',
        border: 'border-sky-200',
        iconBg: 'bg-sky-100',
        iconColor: 'text-sky-600',
        buttonBg: 'bg-sky-600',
      },
      VISITORS: { 
        gradient: 'from-violet-600 to-indigo-600', 
        bg: 'bg-violet-50', 
        text: 'text-violet-700',
        border: 'border-violet-200',
        iconBg: 'bg-violet-100',
        iconColor: 'text-violet-600',
        buttonBg: 'bg-violet-600',
      },
      STUDENT_ACTIVITIES: { 
        gradient: 'from-orange-600 to-amber-600', 
        bg: 'bg-orange-50', 
        text: 'text-orange-700',
        border: 'border-orange-200',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        buttonBg: 'bg-orange-600',
      },
      CLUBS: { 
        gradient: 'from-fuchsia-600 to-purple-600', 
        bg: 'bg-fuchsia-50', 
        text: 'text-fuchsia-700',
        border: 'border-fuchsia-200',
        iconBg: 'bg-fuchsia-100',
        iconColor: 'text-fuchsia-600',
        buttonBg: 'bg-fuchsia-600',
      },
      COUNCIL: { 
        gradient: 'from-indigo-600 to-blue-600', 
        bg: 'bg-indigo-50', 
        text: 'text-indigo-700',
        border: 'border-indigo-200',
        iconBg: 'bg-indigo-100',
        iconColor: 'text-indigo-600',
        buttonBg: 'bg-indigo-600',
      },
      LEADERSHIP: { 
        gradient: 'from-purple-600 to-violet-600', 
        bg: 'bg-purple-50', 
        text: 'text-purple-700',
        border: 'border-purple-200',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        buttonBg: 'bg-purple-600',
      },
      OTHER: { 
        gradient: 'from-gray-600 to-slate-600', 
        bg: 'bg-gray-50', 
        text: 'text-gray-700',
        border: 'border-gray-200',
        iconBg: 'bg-gray-100',
        iconColor: 'text-gray-600',
        buttonBg: 'bg-gray-600',
      }
    };
    return styles[category] || styles.GENERAL;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Recently added';
    }
  };

  // Grid View
  if (viewMode === 'grid') {
    const theme = getCategoryStyle(gallery.category);
    
    return (
      <div 
        onClick={() => onView(gallery)}
        className="group relative cursor-pointer"
      >
        <div className="relative overflow-hidden rounded-[30px] border border-[#d9d0c3] bg-white shadow-[0_28px_70px_-52px_rgba(15,23,42,0.48)] transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(135deg,#efe4d0_0%,#ffffff_42%,#dce6ef_100%)]" />

          <div className="relative px-4 pt-4 sm:px-5 sm:pt-5">
          <div className="relative h-56 w-full overflow-hidden rounded-[24px] border border-white shadow-lg">
            {gallery.files && gallery.files[0] ? (
              <>
                <img
                  src={gallery.files[0]}
                  alt={gallery.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/80 via-[#172033]/25 to-transparent" />
              </>
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${theme.gradient}`} />
            )}
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className={`rounded-full border px-4 py-1.5 text-xs font-black uppercase tracking-wider backdrop-blur-sm ${theme.bg} ${theme.text} ${theme.border}`}>
                {gallery.category.replace(/_/g, ' ') || 'Gallery'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(gallery);
                }}
                className="rounded-xl border border-white/20 bg-white/90 p-2.5 text-[#172033] shadow-sm backdrop-blur-sm"
              >
                <FiShare2 size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFavorite(gallery);
                  setIsFavorite(!isFavorite);
                }}
                className={`p-2.5 rounded-xl backdrop-blur-sm border ${
                  isFavorite 
                    ? 'border-[#172033] bg-[#172033] text-white' 
                    : 'border-white/20 bg-white/90 text-[#172033]'
                }`}
              >
                <FiBookmark className={isFavorite ? 'fill-current' : ''} size={16} />
              </button>
            </div>

            {/* File Count */}
            <div className="absolute bottom-4 right-4 rounded-xl border border-white/20 bg-[#172033]/78 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
              <span className="flex items-center gap-1.5">
                <FiImage size={12} className="opacity-70" />
                {gallery.files?.length || 0} files
              </span>
            </div>

            {/* Title Overlay */}
            <div className="absolute bottom-4 left-4 right-16">
              <h3 className="mb-1 line-clamp-2 text-xl font-black text-white drop-shadow-lg">
                {gallery.title}
              </h3>
            </div>
          </div>
          </div>

          {/* Content Area */}
          <div className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${theme.iconBg}`}>
                <FiImage className={`${theme.iconColor} h-4 w-4`} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Gallery Feature</p>
                <p className="text-xs font-bold text-slate-500">{formatDate(gallery.date)}</p>
              </div>
            </div>

            <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-slate-500">
              {gallery.description || 'School gallery collection capturing memorable moments.'}
            </p>

            {/* Info Row */}
            <div className="mb-5 grid grid-cols-2 gap-2 text-xs text-slate-500">
              <div className="rounded-[18px] border border-[#e8dfd3] bg-[#fcfaf6] p-3">
              <div className="flex items-center gap-1.5">
                  <FiCalendar size={14} className="text-[#172033]" />
                <span>{formatDate(gallery.date)}</span>
              </div>
              </div>
              <div className="rounded-[18px] border border-[#e8dfd3] bg-[#fcfaf6] p-3">
                <div className="flex items-center gap-1.5">
                <FiImage size={14} className="text-[#9a5b1f]" />
                <span>{gallery.files?.length || 0} items</span>
              </div>
              </div>
            </div>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                onView(gallery);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-[18px] bg-[#172033] py-3.5 text-sm font-black uppercase tracking-[0.16em] text-white shadow-lg"
            >
              <span>VIEW GALLERY</span>
              <FiArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List View - Also with hover effects removed
  return (
    <div 
      onClick={() => onView(gallery)}
      className="group relative cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-[28px] border border-[#d9d0c3] bg-white p-4 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.38)]">
        
        <div className="relative flex gap-5">
          {/* Image Thumbnail */}
          <div className="relative w-28 h-28 rounded-xl overflow-hidden shrink-0">
            {gallery.files && gallery.files[0] ? (
              <>
                <img
                  src={gallery.files[0]}
                  alt={gallery.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
              </>
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${getCategoryStyle(gallery.category).gradient}`} />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className={`mb-2 inline-block rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                  getCategoryStyle(gallery.category).bg
                } ${getCategoryStyle(gallery.category).text} ${getCategoryStyle(gallery.category).border}`}>
                  {gallery.category.replace(/_/g, ' ')}
                </span>
                <h3 className="mb-1 line-clamp-1 text-lg font-black text-[#172033]">
                  {gallery.title}
                </h3>
              </div>
              <span className="rounded-lg bg-[#fcfaf6] px-2 py-1 text-xs text-slate-500 ring-1 ring-[#e8dfd3]">
                {formatDate(gallery.date)}
              </span>
            </div>

            <p className="mb-3 line-clamp-2 text-sm text-slate-500">
              {gallery.description || 'School gallery collection.'}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <FiImage size={14} className="text-[#172033]" />
                  <span>{gallery.files?.length || 0} files</span>
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onView(gallery);
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#172033] px-5 py-2 text-xs font-black uppercase tracking-[0.14em] text-white shadow-lg"
              >
                <span>VIEW</span>
                <FiArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// Modern Stats Card Component
const ModernStatCard = ({ stat }) => {
  const Icon = stat.icon;
  
  return (
    <div className="relative rounded-[24px] border border-[#d9d0c3] bg-white p-4 shadow-[0_20px_50px_-42px_rgba(15,23,42,0.4)]">
      <div className="flex items-start justify-between mb-3">
        <div className="rounded-xl bg-[#fcfaf6] p-2 text-[#172033] ring-1 ring-[#e8dfd3]">
          <Icon className="text-lg" />
        </div>
        <div className="h-2 w-2 rounded-full bg-[#f2c357]" />
      </div>

      <div className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
          {stat.label}
        </p>
        <h3 className="text-xl md:text-2xl font-black text-[#172033]">
          {stat.number}
        </h3>
        <p className="text-xs text-slate-500">
          {stat.sublabel}
        </p>
      </div>
    </div>
  );
};

// Share Modal Component
const ShareModal = ({ isOpen, onClose, gallery }) => {
  const [copied, setCopied] = useState(false);
  
  if (!isOpen || !gallery) return null;

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/pages/gallery`
    : '';

  const shareTitle = `Check out this school gallery: ${gallery.title}`;
  const shareText = `${gallery.title} - ${gallery.description?.substring(0, 100)}...`;

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: FiCopy,
      color: 'bg-slate-100',
      iconColor: 'text-slate-600',
      action: () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success('Gallery link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      }
    },
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      color: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      action: () => {
        const url = `https://wa.me/?text=${encodeURIComponent(`${shareTitle}\n${shareText}\n${shareUrl}`)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    },
    {
      name: 'Twitter',
      icon: FaTwitter,
      color: 'bg-sky-50',
      iconColor: 'text-sky-600',
      action: () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareTitle}\n${shareUrl}`)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    },
    {
      name: 'Facebook',
      icon: FaFacebookF,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
      action: () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    },
    {
      name: 'Email',
      icon: FiMail,
      color: 'bg-rose-50',
      iconColor: 'text-rose-600',
      action: () => {
        const subject = encodeURIComponent(shareTitle);
        const body = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
        const url = `mailto:?subject=${subject}&body=${body}`;
        window.location.href = url;
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-[250] flex items-end justify-center sm:items-center">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div 
        className="relative w-full max-w-md overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#1a1a2e] px-6 pb-5 pt-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">Share Gallery</span>
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/60"
            >
              <FiX size={14} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 overflow-hidden rounded-xl bg-white/10 ring-2 ring-white/10">
              {gallery.files?.[0] ? (
                <img src={gallery.files[0]} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white/10 text-white">
                  <FiImage size={18} />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-white">{gallery.title}</h3>
              <p className="text-[11px] font-medium text-white/40">{gallery.files?.length || 0} files • {gallery.category?.replace(/_/g, ' ')}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Share via</p>
          <div className="grid grid-cols-3 gap-3">
            {shareOptions.map((option, index) => (
              <button
                key={index}
                onClick={option.action}
                className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 py-3"
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-full ${option.color}`}>
                  <option.icon className={`text-lg ${option.iconColor}`} />
                </div>
                <span className="text-[10px] font-semibold text-slate-500">{option.name}</span>
                {option.name === 'Copy Link' && copied && (
                  <span className="text-[8px] text-emerald-600 font-medium mt-1">COPIED!</span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-5 space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Direct Link</span>
            <div className="flex gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 bg-transparent px-3 text-[11px] text-slate-500 outline-none truncate"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="rounded-lg bg-[#1a1a2e] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white"
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Modern Gallery Detail Modal
const ModernGalleryDetailModal = ({ gallery, onClose, onDownload, onShare }) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [downloading, setDownloading] = useState(false);

  if (!gallery) return null;

  const getCategoryStyle = (category) => {
    return { gradient: 'from-emerald-600 to-teal-600', icon: FiImage };
  };

  const categoryStyle = getCategoryStyle(gallery.category);
  const CategoryIcon = categoryStyle.icon;

  const isVideoFile = (filename) => {
    if (!filename) return false;
    const videoExtensions = ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.webm', '.mkv'];
    return videoExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  };

  const isImageFile = (filename) => {
    if (!filename) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  };

  const downloadAllFiles = async () => {
    if (!gallery || !gallery.files || gallery.files.length === 0) {
      toast.error('No files available to download');
      return;
    }

    setDownloading(true);
    const toastId = toast.loading(`Starting download of ${gallery.files.length} files...`);
    
    try {
      const files = gallery.files;
      let downloadedCount = 0;
      
      for (let i = 0; i < files.length; i++) {
        const fileUrl = files[i];
        const fileName = fileUrl.split('/').pop() || `file_${i + 1}`;
        
        try {
          toast.loading(`Downloading ${i + 1}/${files.length}: ${fileName}`, { id: toastId });
          
          const link = document.createElement('a');
          link.href = fileUrl;
          link.download = fileName;
          link.style.display = 'none';
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          downloadedCount++;
          
          if (i < files.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          
        } catch (error) {
          console.error(`Failed to download ${fileName}:`, error);
        }
      }
      
      toast.dismiss(toastId);
      toast.success(`Successfully downloaded ${downloadedCount}/${files.length} files!`);
      
    } catch (error) {
      console.error('Error in download process:', error);
      toast.dismiss(toastId);
      toast.error('Download failed. Please try downloading files individually.');
    } finally {
      setDownloading(false);
    }
  };

  const downloadSelectedFile = async () => {
    if (!gallery.files || !gallery.files[selectedIndex]) {
      toast.error('No file selected to download');
      return;
    }
    
    const fileUrl = gallery.files[selectedIndex];
    const fileName = fileUrl.split('/').pop() || `gallery_file_${selectedIndex + 1}`;
    
    try {
      const toastId = toast.loading(`Downloading ${fileName}...`);
      
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.dismiss(toastId);
      toast.success(`Downloaded: ${fileName}`);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#172033]/80 p-0 backdrop-blur-md sm:p-4">
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#fcfaf6] shadow-2xl sm:h-auto sm:max-h-[90vh] sm:max-w-4xl sm:rounded-[30px] sm:border sm:border-[#d9d0c3]">
        
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 z-50 rounded-full border border-white/20 bg-[#172033]/65 p-2 text-white backdrop-blur-md"
        >
          <IoClose size={20} />
        </button>

        <div className="relative h-[40vh] sm:h-[300px] w-full shrink-0">
          {gallery.files && gallery.files[selectedIndex] ? (
            <img
              src={gallery.files[selectedIndex]}
              alt={gallery.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-r ${categoryStyle.gradient}`} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#fcfaf6] via-transparent to-black/10" />
          
          <div className="absolute bottom-4 left-4 flex gap-2">
            <span className="rounded-full border border-[#d9d0c3] bg-white/95 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[#172033]">
              {gallery.category.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#fcfaf6] p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-[#e8dfd3] bg-white p-3 shadow-sm">
                <CategoryIcon className="text-[#172033] text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-[#172033]">
                  {gallery.title}
                </h2>
                <p className="text-sm text-slate-500">{gallery.category.replace(/_/g, ' ')} Collection</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-2 rounded-full border border-[#e8dfd3] bg-white px-3 py-2">
                <FiCalendar size={14} className="text-[#172033]" />
                {new Date(gallery.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-2 rounded-full border border-[#e8dfd3] bg-white px-3 py-2">
                <FiImage size={14} className="text-[#f2c357]" />
                {gallery.files?.length || 0} files
              </div>
            </div>

            <div className="border-b border-[#e8dfd3]">
              <div className="flex gap-6">
                <button
                  className={`pb-2 text-xs font-medium border-b-2 ${
                    activeTab === 'preview' 
                      ? 'border-[#172033] text-[#172033]' 
                      : 'border-transparent text-slate-500'
                  }`}
                  onClick={() => setActiveTab('preview')}
                >
                  Preview
                </button>
                <button
                  className={`pb-2 text-xs font-medium border-b-2 ${
                    activeTab === 'files' 
                      ? 'border-[#172033] text-[#172033]' 
                      : 'border-transparent text-slate-500'
                  }`}
                  onClick={() => setActiveTab('files')}
                >
                  All Files ({gallery.files?.length || 0})
                </button>
                <button
                  className={`pb-2 text-xs font-medium border-b-2 ${
                    activeTab === 'info' 
                      ? 'border-[#172033] text-[#172033]' 
                      : 'border-transparent text-slate-500'
                  }`}
                  onClick={() => setActiveTab('info')}
                >
                  Info
                </button>
              </div>
            </div>

            {activeTab === 'preview' && (
              <div className="space-y-4">
                <div className="text-sm text-slate-600">
                  {gallery.description || 'No description available.'}
                </div>
                
                {gallery.files && gallery.files.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {gallery.files.slice(0, 6).map((file, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedIndex(index)}
                        className={`aspect-square overflow-hidden rounded-2xl border-2 ${
                          selectedIndex === index ? 'border-[#172033]' : 'border-transparent'
                        }`}
                      >
                        <img
                          src={file}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'files' && (
              <div className="space-y-2">
                {gallery.files?.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-2xl border border-[#e8dfd3] bg-white p-3"
                  >
                    <div className="rounded-xl bg-[#fcfaf6] p-2 ring-1 ring-[#e8dfd3]">
                      <FiImage className="text-[#172033]" size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {file.split('/').pop()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedIndex(index);
                          setActiveTab('preview');
                        }}
                        className="rounded-lg px-2 py-1 text-xs font-semibold text-[#172033] hover:bg-[#fcfaf6]"
                      >
                        View
                      </button>
                      <button
                        onClick={async () => {
                          const fileName = file.split('/').pop() || `file_${index + 1}`;
                          try {
                            const link = document.createElement('a');
                            link.href = file;
                            link.download = fileName;
                            link.click();
                            toast.success(`Downloaded: ${fileName}`);
                          } catch (error) {
                            toast.error('Failed to download file');
                          }
                        }}
                        className="rounded-lg px-2 py-1 text-xs font-semibold text-[#172033] hover:bg-[#fcfaf6]"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'info' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-[#e8dfd3] bg-white p-3">
                    <p className="text-xs text-slate-500 mb-1">Category</p>
                    <p className="text-sm font-semibold text-[#172033]">{gallery.category.replace(/_/g, ' ')}</p>
                  </div>
                  <div className="rounded-2xl border border-[#e8dfd3] bg-white p-3">
                    <p className="text-xs text-slate-500 mb-1">Total Files</p>
                    <p className="text-sm font-semibold text-[#172033]">{gallery.files?.length || 0}</p>
                  </div>
                  <div className="rounded-2xl border border-[#e8dfd3] bg-white p-3">
                    <p className="text-xs text-slate-500 mb-1">Date Added</p>
                    <p className="text-sm font-semibold text-[#172033]">{new Date(gallery.date).toLocaleDateString()}</p>
                  </div>
                  <div className="rounded-2xl border border-[#e8dfd3] bg-white p-3">
                    <p className="text-xs text-slate-500 mb-1">Status</p>
                    <p className="text-sm font-semibold text-[#b68424]">Published</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 border-t border-[#e8dfd3] bg-white/80 p-4 backdrop-blur-sm">
          <div className="max-w-2xl mx-auto flex flex-row gap-2">
            <button
              onClick={downloadSelectedFile}
              disabled={!gallery.files || !gallery.files[selectedIndex]}
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-[#d9d0c3] bg-[#fcfaf6] text-xs font-semibold text-[#172033] disabled:opacity-50"
            >
              <FiDownload size={14} />
              Download Selected
            </button>

            <button
              onClick={() => onShare(gallery)}
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-[#172033] text-xs font-black uppercase tracking-[0.14em] text-white"
            >
              <FiShare2 size={14} />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ModernGallery() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedYear, setSelectedYear] = useState('all');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [galleryToShare, setGalleryToShare] = useState(null);

const categoryOptions = [
  { id: 'all', name: 'All Galleries', icon: FiGlobe, bg: 'bg-indigo-500/20' },
  { id: 'GENERAL', name: 'General', icon: FiGlobe, bg: 'bg-slate-500/20' },
  { id: 'CLASSROOMS', name: 'Classrooms', icon: FiBookOpen, bg: 'bg-blue-500/20' },
  { id: 'LABORATORIES', name: 'Laboratories', icon: FiTarget, bg: 'bg-emerald-500/20' },
  { id: 'DORMITORIES', name: 'Dormitories', icon: FiHome, bg: 'bg-orange-500/20' },
  { id: 'DINING_HALL', name: 'Dining Hall', icon: FiUsers, bg: 'bg-amber-500/20' },
  { id: 'SPORTS_FACILITIES', name: 'Sports Facilities', icon: FiAward, bg: 'bg-red-500/20' },
  { id: 'TEACHING', name: 'Teaching', icon: FiBook, bg: 'bg-cyan-500/20' },
  { id: 'SCIENCE_LAB', name: 'Science Lab', icon: FiTarget, bg: 'bg-lime-500/20' },
  { id: 'COMPUTER_LAB', name: 'Computer Lab', icon: FiMonitor, bg: 'bg-sky-500/20' },
  { id: 'SPORTS_DAY', name: 'Sports Day', icon: FiAward, bg: 'bg-rose-500/20' },
  { id: 'MUSIC_FESTIVAL', name: 'Music Festival', icon: FiMusic, bg: 'bg-purple-500/20' },
  { id: 'DRAMA_PERFORMANCE', name: 'Drama', icon: FiMic, bg: 'bg-fuchsia-500/20' },
  { id: 'ART_EXHIBITION', name: 'Art Exhibition', icon: FiCamera, bg: 'bg-pink-500/20' },
  { id: 'DEBATE_COMPETITION', name: 'Debate', icon: FiMessageSquare, bg: 'bg-blue-600/20' },
  { id: 'SCIENCE_FAIR', name: 'Science Fair', icon: FiTarget, bg: 'bg-teal-500/20' },
  { id: 'ADMIN_OFFICES', name: 'Admin Offices', icon: FiFolder, bg: 'bg-gray-500/20' },
  { id: 'STAFF', name: 'Staff', icon: FiUsers, bg: 'bg-zinc-500/20' },
  { id: 'PRINCIPAL', name: 'Principal', icon: FiUser, bg: 'bg-violet-600/20' },
  { id: 'BOARD', name: 'Board', icon: FiUsers, bg: 'bg-indigo-600/20' },
  { id: 'GRADUATION', name: 'Graduation', icon: FiAward, bg: 'bg-yellow-500/20' },
  { id: 'AWARD_CEREMONY', name: 'Award Ceremony', icon: FiStar, bg: 'bg-amber-400/20' },
  { id: 'PARENTS_DAY', name: 'Parents Day', icon: FiUsers, bg: 'bg-orange-400/20' },
  { id: 'OPEN_DAY', name: 'Open Day', icon: FiGlobe, bg: 'bg-teal-400/20' },
  { id: 'VISITORS', name: 'Visitors', icon: FiUserPlus, bg: 'bg-emerald-400/20' },
  { id: 'STUDENT_ACTIVITIES', name: 'Student Activities', icon: FiUsers, bg: 'bg-sky-400/20' },
  { id: 'CLUBS', name: 'Clubs', icon: FiUsers, bg: 'bg-indigo-400/20' },
  { id: 'COUNCIL', name: 'Council', icon: FiUsers, bg: 'bg-blue-400/20' },
  { id: 'LEADERSHIP', name: 'Leadership', icon: FiStar, bg: 'bg-purple-400/20' },
  { id: 'OTHER', name: 'Other', icon: FiFolder, bg: 'bg-neutral-500/20' }
];

  const [stats, setStats] = useState([
    { 
      icon: FiImage, 
      number: '0', 
      label: 'Media Files', 
      sublabel: 'Total files',
      gradient: 'from-blue-900 to-slate-900'
    },
    { 
      icon: FiFolder, 
      number: '0', 
      label: 'Galleries', 
      sublabel: 'Collections',
      gradient: 'from-emerald-600 to-teal-600'
    },
    { 
      icon: FiGrid, 
      number: '0', 
      label: 'Categories', 
      sublabel: 'Available',
      gradient: 'from-amber-800 to-red-800'
    },
    { 
      icon: FiCalendar, 
      number: new Date().getFullYear().toString(),
      label: 'Latest', 
      sublabel: 'This year',
      gradient: 'from-purple-900 to-blue-900'
    }
  ]);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const response = await fetch('/api/gallery');
        const data = await response.json();
        
        if (data.success && data.galleries) {
          setGalleries(data.galleries);
          
          const totalFiles = data.galleries.reduce((acc, gallery) => acc + (gallery?.files?.length || 0), 0);
          
          setStats([
            { 
              icon: FiImage, 
              number: totalFiles.toString(), 
              label: 'Media Files', 
              sublabel: 'Total files',
              gradient: 'from-emerald-600 to-teal-600'
            },
            { 
              icon: FiFolder, 
              number: data.galleries.length.toString(), 
              label: 'Galleries', 
              sublabel: 'Collections',
              gradient: 'from-emerald-600 to-teal-600'
            },
            { 
              icon: FiGrid, 
              number: '7', 
              label: 'Categories', 
              sublabel: 'Available',
              gradient: 'from-emerald-600 to-teal-600'
            },
            { 
              icon: FiCalendar, 
              number: new Date().getFullYear().toString(),
              label: 'Latest', 
              sublabel: 'This year',
              gradient: 'from-emerald-600 to-teal-600'
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching galleries:', error);
        toast.error('Failed to load galleries');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleries();
  }, []);

  const transformedGalleries = useMemo(() => {
    return (galleries || []).map(gallery => ({
      id: gallery.id || Math.random().toString(),
      category: gallery.category || 'GENERAL',
      title: gallery.title || 'Untitled Gallery',
      description: gallery.description || 'No description available',
      files: gallery.files || [],
      date: gallery.createdAt || new Date().toISOString(),
      year: gallery.createdAt ? new Date(gallery.createdAt).getFullYear() : new Date().getFullYear()
    }));
  }, [galleries]);

  const years = useMemo(() => {
    const yearSet = new Set();
    galleries.forEach(gallery => {
      if (gallery?.createdAt) {
        const year = new Date(gallery.createdAt).getFullYear();
        yearSet.add(year);
      }
    });
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [galleries]);

  const filteredGalleries = useMemo(() => {
    let filtered = transformedGalleries.filter(gallery => {
      const matchesCategory = activeCategory === 'all' || gallery.category === activeCategory;
      const matchesYear = selectedYear === 'all' || gallery.year.toString() === selectedYear;
      const matchesSearch = searchTerm === '' || 
        gallery.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (gallery.description && gallery.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesYear && matchesSearch;
    });
    
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return filtered;
  }, [activeCategory, searchTerm, selectedYear, transformedGalleries]);

  const handleFavorite = (gallery) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(gallery.id)) {
      newFavorites.delete(gallery.id);
      toast.success('Removed from favorites');
    } else {
      newFavorites.add(gallery.id);
      toast.success('Added to favorites');
    }
    setFavorites(newFavorites);
  };

  const handleViewGallery = (gallery) => {
    setSelectedGallery(gallery);
  };

  const handleDownload = (gallery) => {
    setSelectedGallery(gallery);
  };

  const handleShare = (gallery) => {
    setGalleryToShare(gallery);
    setShareModalOpen(true);
  };

  const refreshData = async () => {
    setRefreshing(true);
    setTimeout(() => {
      window.location.reload();
      toast.success('Gallery refreshed!');
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f2ea] p-4 md:p-6">
        <div className="w-full md:w-[90%] lg:w-[80%] xl:w-[70%] mx-auto">
          <div className="flex min-h-[70vh] items-center justify-center">
            <Stack
              spacing={2}
              alignItems="center"
              className="rounded-[28px] border border-[#d9d0c3] bg-white px-10 py-12 shadow-[0_28px_70px_-52px_rgba(15,23,42,0.48)]"
            >
              <div className="relative flex items-center justify-center">
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={48}
                  thickness={4.5}
                  sx={{ color: '#efe6d8' }}
                />
                <CircularProgress
                  variant="indeterminate"
                  disableShrink
                  size={48}
                  thickness={4.5}
                  sx={{
                    color: '#172033',
                    animationDuration: '1000ms',
                    position: 'absolute',
                  }}
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-[#172033]">Loading school galleries...</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-[#b68424]">
                  Matungulu Girls Senior School
                </p>
              </div>
            </Stack>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f2ea] p-4 md:p-6">
      <Toaster position="top-right" richColors />
      
      <div className="w-full md:w-[80%]  mx-auto space-y-6">
        <ModernHeroBanner 
          stats={{
            totalFiles: stats[0].number,
            totalCategories: stats[2].number,
            thisMonth: transformedGalleries.length
          }} 
          onRefresh={refreshData}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {stats.map((stat, index) => (
            <ModernStatCard key={index} stat={stat} />
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0 space-y-6">

                      <div className="lg:w-80 space-y-4">
            <div className="lg:sticky lg:top-24 space-y-4">
              
              <div className="rounded-[28px] border border-[#d9d0c3] bg-white p-5 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.38)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#172033]">
                    <FiZap className="text-[#f2c357] text-sm" />
                  </div>
                  <h2 className="text-base font-black text-[#172033]">Quick Actions</h2>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      const mostRecent = filteredGalleries[0];
                      if (mostRecent) {
                        handleViewGallery(mostRecent);
                      }
                    }}
                    className="flex w-full items-center justify-between rounded-2xl border border-[#e8dfd3] bg-[#fcfaf6] p-3"
                  >
                    <div className="flex items-center gap-2">
                      <div className="rounded-xl bg-white p-2 ring-1 ring-[#e8dfd3]">
                        <FiEye className="text-[#172033]" size={14} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-black text-[#172033]">Latest Gallery</p>
                        <p className="text-[10px] text-[#b68424]">View most recent</p>
                      </div>
                    </div>
                    <FiArrowRight className="text-[#172033]" size={14} />
                  </button>

  
  
                </div>
              </div>

              <div className="rounded-[28px] border border-[#d9d0c3] bg-white p-5 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.38)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#172033]">
                    <FiCalendar className="text-[#f2c357] text-sm" />
                  </div>
                  <h2 className="text-base font-black text-[#172033]">Years</h2>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-2xl border border-[#e8dfd3] bg-[#fcfaf6] p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#f2c357]"></div>
                      <span className="text-xs text-slate-600">All Years</span>
                    </div>
                    <span className="text-xs font-black text-[#172033]">{transformedGalleries.length}</span>
                  </div>
                  
                  {years.slice(0, 3).map(year => (
                    <div key={year} className="flex items-center justify-between rounded-2xl border border-[#e8dfd3] bg-[#fcfaf6] p-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#f2c357]"></div>
                        <span className="text-xs text-slate-600">{year}</span>
                      </div>
                      <span className="text-xs font-black text-[#172033]">
                        {transformedGalleries.filter(g => g.year === year).length}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-[28px] border border-[#1f2a40] bg-[#172033] p-5 text-white shadow-[0_30px_80px_-50px_rgba(15,23,42,0.82)]">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                  <FaLeaf className="text-white text-sm" />
                </div>
                <h4 className="mb-1 text-base font-black">School Memories</h4>
                <p className="mb-4 text-xs leading-relaxed text-white/70">
                  Preserving our school's legacy through photos and videos.
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-[#f2c357]"></div>
                    <span>High quality media</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-[#f2c357]"></div>
                    <span>Organized by category</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-[#f2c357]"></div>
                    <span>Easy to download & share</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#172033] p-3 shadow-lg">
                  <FiImage className="text-[#f2c357] text-lg" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#172033]">School Galleries</h2>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    {filteredGalleries.length} Galleries
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-[#d9d0c3] bg-white p-4 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.38)]">
              <div className="flex flex-col md:flex-row items-stretch gap-3">
                <div className="relative w-full">
                  <div className="relative flex items-center rounded-2xl border border-[#e8dfd3] bg-[#fcfaf6]">
                    <div className="pl-3 pr-2">
                      <FiSearch className="text-[#172033]" size={16} />
                    </div>
                    <input
                      type="text"
                      placeholder="Search galleries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-transparent py-3 text-sm text-[#172033] placeholder:text-slate-400 focus:outline-none"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="pr-3 text-slate-400"
                      >
                        <FiX size={14} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full md:flex md:items-center md:gap-2">
                  <div className="relative w-full">
                    <select 
                      value={activeCategory}
                      onChange={(e) => setActiveCategory(e.target.value)}
                      className="w-full cursor-pointer appearance-none rounded-2xl border border-[#e8dfd3] bg-[#fcfaf6] px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#172033] focus:border-[#172033]"
                    >
                      {categoryOptions.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  <div className="relative w-full">
                    <select 
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full cursor-pointer appearance-none rounded-2xl border border-[#e8dfd3] bg-[#fcfaf6] px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#172033] focus:border-[#172033]"
                    >
                      <option value="all">All Years</option>
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setActiveCategory('all');
                      setSelectedYear('all');
                    }}
                    className="col-span-2 flex items-center justify-center gap-1 rounded-2xl bg-[#172033] px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-white"
                  >
                    <FiFilter size={12} />
                    Reset
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {categoryOptions.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;
                return (
<button
  key={category.id}
  onClick={() => setActiveCategory(category.id)}
  className={`flex items-center gap-2 rounded-full border px-4 py-2.5 transition-all duration-300 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.1em] ${
    isActive 
      ? `border-slate-800 ${category.bg} text-slate-900 shadow-sm scale-105` 
      : "border-[#d9d0c3] bg-white/50 text-slate-600 hover:bg-white hover:border-slate-400"
  }`}
>
  {Icon && <Icon size={14} className={isActive ? "animate-pulse" : ""} />}
  {category.name}
</button>
                );
              })}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-500">
                <span className="font-black text-[#172033]">{filteredGalleries.length}</span> galleries found
              </div>
              <div className="flex overflow-hidden rounded-2xl border border-[#d9d0c3] bg-white">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 ${viewMode === 'grid' ? 'bg-[#172033] text-white' : 'text-slate-500'}`}
                >
                  <FiGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 ${viewMode === 'list' ? 'bg-[#172033] text-white' : 'text-slate-500'}`}
                >
                  <FiList size={16} />
                </button>
              </div>
            </div>

            <div className="relative">
              {filteredGalleries.length === 0 ? (
                <div className="rounded-[28px] border border-dashed border-[#d9d0c3] bg-white py-14 text-center shadow-[0_24px_60px_-48px_rgba(15,23,42,0.38)]">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#fcfaf6] ring-1 ring-[#e8dfd3]">
                    <FiImage className="text-slate-400 text-xl" />
                  </div>
                  <h3 className="text-base font-black text-[#172033]">No galleries found</h3>
                  <p className="text-xs text-slate-500 mt-1 mb-4">Try adjusting your filters.</p>
                  <button 
                    onClick={() => { setSearchTerm(''); setActiveCategory('all'); setSelectedYear('all'); }}
                    className="rounded-xl border border-[#d9d0c3] bg-[#fcfaf6] px-4 py-2 text-xs font-semibold text-[#172033]"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
                  {filteredGalleries.map((gallery, index) => (
                    <ModernGalleryCard 
                      key={gallery.id || index} 
                      gallery={gallery} 
                      onView={handleViewGallery}
                      onFavorite={handleFavorite}
                      onShare={handleShare}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>


        </div>

        <div className="relative overflow-hidden rounded-[30px] border border-[#1f2a40] bg-[#172033] p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.82)]">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-[#f2c357]/10 blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-4">
            
            <div className="shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white">
                <FiImage className="text-[#172033] text-xl" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="mb-1 text-lg font-black text-white">
                Preserving School History.
              </h3>
              <p className="text-xs leading-relaxed text-white/70">
                Every photo tells a story. Explore decades of academic excellence, achievements, and memories.
              </p>
            </div>
          </div>
        </div>
      </div>

      {selectedGallery && (
        <ModernGalleryDetailModal
          gallery={selectedGallery}
          onClose={() => setSelectedGallery(null)}
          onDownload={handleDownload}
          onShare={handleShare}
        />
      )}

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => {
          setShareModalOpen(false);
          setGalleryToShare(null);
        }}
        gallery={galleryToShare}
      />
    </div>
  );
}
