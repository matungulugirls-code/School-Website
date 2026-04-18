'use client';
import { useState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import { 
  FiCalendar, 
  FiClock, 
  FiMapPin, 
  FiUsers, 
  FiArrowRight,
  FiShare2,
  FiSearch,
  FiHeart,
  FiX,
  FiLink,
  FiPlus,
  FiFilter,
  FiRotateCw,
  FiEye,
  FiBookmark,
  FiChevronRight,
  FiChevronLeft,
  FiGrid,
  FiList,
  FiDownload,
  FiExternalLink,
  FiVideo,
  FiMusic,
  FiAward,
  FiTrendingUp,
  FiZap,
  FiGlobe,
  FiMessageCircle,
  FiCopy,
  FiRefreshCw,
  FiBell
} from 'react-icons/fi';
import { 
  IoNewspaperOutline,
  IoCalendarClearOutline,
  IoSparkles,
  IoRibbonOutline,
  IoPeopleCircle,
  IoStatsChart,
  IoShareSocialOutline,
  IoClose,
  IoLocationOutline,
  IoTimeOutline,
  IoPersonOutline,
  IoShareOutline,
  IoSchoolOutline
} from 'react-icons/io5';
import { CircularProgress, Stack } from '@mui/material';
import { FaFacebookF, FaTwitter, FaWhatsapp, FaTelegram, FaEnvelope, FaLeaf } from 'react-icons/fa';

// Modern Modal Component with Glass Morphism
const ModernModal = ({ children, open, onClose, maxWidth = '800px', blur = true }) => {
  if (!open) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${blur ? 'backdrop-blur-md bg-[#172033]/40' : 'bg-black/50'}`}>
      <div 
        className="relative overflow-hidden rounded-[32px] border border-[#d9d0c3] bg-[#fcfaf6] shadow-2xl animate-in zoom-in-95 duration-300"
        style={{ 
          width: '90%',
          maxWidth: maxWidth,
          maxHeight: '90vh',
          background: 'linear-gradient(135deg, rgba(252,250,246,0.98) 0%, rgba(244,239,231,0.96) 100%)'
        }}
      >
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d9d0c3] bg-white/90 text-[#172033] shadow-sm backdrop-blur-sm"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Modern Event Card with Enhanced Design
const ModernEventCard = ({ event, onView, onShare, onCalendar, onBookmark, viewMode = 'grid', isBookmarked: initialBookmarked }) => {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked || false);

  const getCategoryStyle = (category) => {
    const styles = {
      academic: { 
        gradient: 'from-blue-500 to-cyan-500', 
        bg: 'bg-blue-50', 
        text: 'text-blue-700',
        border: 'border-blue-200',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      cultural: { 
        gradient: 'from-purple-500 to-pink-500', 
        bg: 'bg-purple-50', 
        text: 'text-purple-700',
        border: 'border-purple-200',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600'
      },
      sports: { 
        gradient: 'from-emerald-500 to-green-500', 
        bg: 'bg-emerald-50', 
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600'
      },
      workshop: { 
        gradient: 'from-orange-500 to-amber-500', 
        bg: 'bg-orange-50', 
        text: 'text-orange-700',
        border: 'border-orange-200',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600'
      }
    };
    return styles[category] || styles.academic;
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
      return 'TBD';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'All Day';
    return timeString;
  };

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    const newState = !isBookmarked;
    setIsBookmarked(newState);
    onBookmark?.(event, newState);
  };

  const theme = getCategoryStyle(event.category);

  if (viewMode === 'grid') {
    return (
      <div 
        onClick={() => onView(event)}
        className="group relative cursor-pointer overflow-hidden rounded-[28px] border border-[#d9d0c3] bg-white shadow-[0_28px_70px_-52px_rgba(15,23,42,0.5)] transition-all duration-300 hover:-translate-y-1 sm:rounded-[30px] md:rounded-[34px]"
      >
        <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(135deg,#172033_0%,#2d4258_62%,#f2c357_160%)]" />

        <div className="relative px-4 pt-4 sm:px-5 sm:pt-5">
          <div className="relative h-40 overflow-hidden rounded-[24px] border border-white/60 shadow-lg sm:h-48 md:h-52">
          <img
            src={event.image || '/default-event.jpg'}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/78 via-[#172033]/14 to-transparent" />
          
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-col gap-1.5 sm:gap-2">
            <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-sm border ${theme.bg} ${theme.text} ${theme.border}`}>
              {event.category || 'Event'}
            </span>
            {event.featured && (
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-[#172033]/90 backdrop-blur-md text-white rounded-full text-[7px] sm:text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                <IoSparkles className="text-[#f2c357] text-[10px] sm:text-[12px]" /> Featured
              </span>
            )}
          </div>

          <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
            <button
              onClick={handleBookmarkClick}
              className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl backdrop-blur-md border shadow-sm transition-all ${
                isBookmarked 
                  ? 'bg-[#172033] border-[#172033] text-white' 
                  : 'bg-white/90 border-white/10 text-[#172033]'
              }`}
            >
              <FiBookmark className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3 sm:p-4">
            <div className="rounded-[18px] bg-white/95 px-3 py-2 shadow-sm backdrop-blur-sm sm:px-4 sm:py-3">
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-400">Date</p>
              <p className="mt-1 text-xs font-black text-[#172033] sm:text-sm">{formatDate(event.date)}</p>
            </div>
            <div className="rounded-[18px] border border-white/20 bg-[#172033]/78 px-3 py-2 text-white backdrop-blur-sm sm:px-4 sm:py-3">
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/45">Venue</p>
              <p className="mt-1 max-w-[110px] truncate text-xs font-black sm:max-w-[160px] sm:text-sm">{event.location || 'Main Campus Hall'}</p>
            </div>
          </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-1">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${theme.iconBg}`}>
                <FiCalendar className={`${theme.iconColor} h-4 w-4`} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Event Brief</p>
                <p className="text-xs font-bold text-slate-500">{event.time || 'Time to be confirmed'}</p>
              </div>
            </div>
          </div>

          <h3 className="mb-2 line-clamp-2 text-base font-black leading-tight tracking-tight text-[#172033] sm:text-lg md:text-[1.35rem]">
            {event.title}
          </h3>
          
          <p className="mb-5 line-clamp-3 text-xs leading-relaxed text-slate-500 sm:mb-6 sm:text-sm md:text-sm">
            {event.description || 'Join us for this upcoming school event.'}
          </p>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="flex items-center gap-1.5 rounded-lg border border-[#e8dfd3] bg-[#fcfaf6] p-1.5 sm:gap-2 sm:rounded-2xl sm:p-2">
              <div className={`p-1 sm:p-1.5 rounded-lg sm:rounded-lg ${theme.iconBg}`}>
                <FiCalendar className={`${theme.iconColor} w-3 h-3 sm:w-4 sm:h-4`} />
              </div>
              <span className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-slate-700 uppercase tracking-tight whitespace-nowrap">
                {formatDate(event.date)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 rounded-lg border border-[#e8dfd3] bg-[#fcfaf6] p-1.5 sm:gap-2 sm:rounded-2xl sm:p-2">
              <div className={`p-1 sm:p-1.5 rounded-lg sm:rounded-lg ${theme.iconBg}`}>
                <FiClock className={`${theme.iconColor} w-3 h-3 sm:w-4 sm:h-4`} />
              </div>
              <span className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-slate-700 uppercase tracking-tight whitespace-nowrap">
                {event.time || 'TBD'}
              </span>
            </div>

            <div className="col-span-2 flex items-center gap-1.5 rounded-lg border border-[#e8dfd3] bg-[#fcfaf6] p-1.5 sm:gap-2 sm:rounded-2xl sm:p-2">
              <div className={`p-1 sm:p-1.5 rounded-lg sm:rounded-lg ${theme.iconBg} flex-shrink-0`}>
                <FiMapPin className={`${theme.iconColor} w-3 h-3 sm:w-4 sm:h-4`} />
              </div>
              <span className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-slate-700 uppercase tracking-tight truncate">
                {event.location || 'Main Campus Hall'}
              </span>
            </div>
          </div>

          <button className="flex w-full items-center justify-center gap-1.5 rounded-[18px] bg-[#172033] px-3 py-3 text-xs font-black uppercase tracking-[0.16em] text-white transition-all active:scale-95 sm:px-4 sm:text-sm md:text-sm">
            View details
          </button>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div 
      onClick={() => onView(event)}
      className="group relative cursor-pointer overflow-hidden rounded-[24px] border border-[#d9d0c3] bg-white transition-all duration-300 hover:shadow-xl sm:rounded-[28px]"
    >
      <div className="flex items-start gap-3 p-3 sm:gap-5 sm:p-5">
        <div className="relative h-20 w-20 overflow-hidden rounded-[18px] sm:h-28 sm:w-28 sm:rounded-[22px] flex-shrink-0">
          <img
            src={event.image || '/default-event.jpg'}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          {event.featured && (
            <div className="absolute top-1 right-1">
              <IoSparkles className="text-amber-500 w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1 sm:mb-2 gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-1 sm:mb-2 flex-wrap">
                <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[7px] sm:text-xs font-bold text-white bg-gradient-to-r ${theme.gradient}`}>
                  {event.category || 'Event'}
                </span>
                {event.featured && (
                  <span className="rounded-full bg-[#f6efe2] px-1.5 py-0.5 text-[7px] font-bold text-[#9a5b1f] sm:px-2 sm:text-xs">
                    Featured
                  </span>
                )}
              </div>
              <h3 className="line-clamp-2 text-sm font-black text-[#172033] transition-colors group-hover:text-[#214760] sm:text-lg">
                {event.title}
              </h3>
            </div>
            <button
              onClick={handleBookmarkClick}
              className={`p-1 rounded-lg transition-colors sm:p-1.5 ${isBookmarked ? 'bg-[#172033] text-white' : 'text-slate-300 hover:text-slate-500'}`}
            >
              <FiBookmark className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>

          <p className="text-gray-600 text-[11px] sm:text-sm mb-2 sm:mb-3 line-clamp-2">
            {event.description || 'Join us for an exciting event!'}
          </p>

          <div className="flex items-center gap-2 text-[10px] text-gray-700 flex-wrap sm:gap-4 sm:text-sm">
            <div className="flex items-center gap-0.5 whitespace-nowrap sm:gap-1">
              <FiCalendar className="h-3 w-3 text-[#172033] sm:h-4 sm:w-4" />
              <span className="font-medium">{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-0.5 whitespace-nowrap sm:gap-1">
              <FiClock className="h-3 w-3 text-[#9a5b1f] sm:h-4 sm:w-4" />
              <span className="font-medium">{formatTime(event.time)}</span>
            </div>
            <div className="flex items-center gap-0.5 truncate sm:gap-1">
              <FiMapPin className="h-3 w-3 text-[#214760] sm:h-4 sm:w-4" />
              <span className="font-medium truncate max-w-[80px] sm:max-w-[120px]">{event.location || 'TBD'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern News Card
const ModernNewsCard = ({ news, onView, onShare, onBookmark, viewMode = 'grid', isBookmarked: initialBookmarked }) => {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked || false);

  const getCategoryStyle = (category) => {
    const styles = {
      announcement: { 
        gradient: 'from-blue-500 to-cyan-500', 
        bg: 'bg-blue-50', 
        text: 'text-blue-700',
        border: 'border-blue-200',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      achievement: { 
        gradient: 'from-emerald-500 to-green-500', 
        bg: 'bg-emerald-50', 
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600'
      },
      infrastructure: { 
        gradient: 'from-purple-500 to-pink-500', 
        bg: 'bg-purple-50', 
        text: 'text-purple-700',
        border: 'border-purple-200',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600'
      },
      general: { 
        gradient: 'from-orange-500 to-amber-500', 
        bg: 'bg-orange-50', 
        text: 'text-orange-700',
        border: 'border-orange-200',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600'
      }
    };
    return styles[category?.toLowerCase()] || styles.announcement;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Recently';
    }
  };

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    const newState = !isBookmarked;
    setIsBookmarked(newState);
    onBookmark?.(news, newState);
  };

  const theme = getCategoryStyle(news.category);

  if (viewMode === 'grid') {
    return (
      <div 
        onClick={() => onView(news)}
        className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[28px] border border-[#d9d0c3] bg-white shadow-[0_28px_70px_-52px_rgba(15,23,42,0.48)] transition-all duration-300 hover:-translate-y-1 sm:rounded-[30px] md:rounded-[34px]"
      >
        <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(135deg,#efe4d0_0%,#ffffff_42%,#dce6ef_100%)]" />
        <div className="relative px-4 pt-4 sm:px-5 sm:pt-5">
        <div className="relative h-36 overflow-hidden rounded-[24px] border border-white shadow-lg sm:h-44 md:h-48 w-full shrink-0">
          <img
            src={news.image || '/default-news.jpg'}
            alt={news.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
            <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest border shadow-sm ${theme.bg} ${theme.text} ${theme.border}`}>
              {news.category || 'News'}
            </span>
          </div>

          <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
            <button
              onClick={handleBookmarkClick}
              className="rounded-lg border border-white/20 bg-white/90 p-1.5 text-[#172033] shadow-sm transition-all hover:bg-white sm:rounded-xl sm:p-2"
            >
              <FiBookmark className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isBookmarked ? 'fill-[#172033] text-[#172033]' : ''}`} />
            </button>
          </div>

          <div className="absolute bottom-0 inset-x-0 h-10 sm:h-12 bg-gradient-to-t from-black/40 to-transparent flex items-end p-2 sm:p-4">
            <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-white uppercase tracking-widest">
              {formatDate(news.date)}
            </span>
          </div>
        </div>
        </div>

        <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-1">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f6efe2] text-[#172033]">
                <IoNewspaperOutline className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">School Desk</p>
                <p className="text-xs font-bold text-slate-500">{news.author || 'School Admin'}</p>
              </div>
            </div>
          </div>

          <h3 className="mb-2 line-clamp-2 text-base font-black leading-tight tracking-tight text-[#172033] sm:mb-3 sm:text-lg md:text-xl">
            {news.title}
          </h3>
          
          <p className="text-slate-500 text-xs sm:text-sm mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3 leading-relaxed">
            {news.excerpt || 'Explore the latest updates from our school community.'}
          </p>

          <div className="flex items-center justify-between mt-auto pt-3 sm:pt-4 border-t border-slate-50 gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <div className="h-5 w-5 flex-shrink-0 rounded-full border border-[#d9d0c3] bg-[#172033] text-white shadow-sm sm:h-7 sm:w-7 flex items-center justify-center">
                <span className="text-[8px] sm:text-[10px] font-black">{news.author?.charAt(0) || 'A'}</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] sm:text-[11px] font-bold text-slate-900 leading-none mb-0.5 truncate">
                  {news.author || 'School Admin'}
                </span>
                <span className="text-[8px] text-slate-400 font-medium">Contributor</span>
              </div>
            </div>

            <div className="flex flex-shrink-0 items-center gap-0.5 rounded-lg border border-[#e8dfd3] bg-[#fcfaf6] px-2 py-0.5 sm:gap-1 sm:px-3 sm:py-1">
              <FiHeart className="h-3 w-3 text-[#9a5b1f] sm:h-4 sm:w-4" />
              <span className="text-[9px] sm:text-[11px] font-bold text-slate-600">{news.likes || 0}</span>
            </div>
          </div>

          <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-[18px] border border-[#d9d0c3] bg-[#fcfaf6] py-3 text-xs font-black uppercase tracking-[0.16em] text-[#172033] transition-colors active:bg-[#f6efe2] sm:mt-5 sm:text-sm">
            Read Full Story
            <FiArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div 
      onClick={() => onView(news)}
      className="relative cursor-pointer rounded-[24px] border border-[#d9d0c3] bg-white p-3 shadow-sm transition-colors active:bg-[#fcfaf6] sm:rounded-[26px] sm:p-4"
    >
      <div className="flex gap-3 sm:gap-5">
        
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg sm:rounded-2xl overflow-hidden shrink-0 shadow-sm">
          <img
            src={news.image || '/default-news.jpg'}
            alt={news.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5 sm:mb-2 gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-lg text-[7px] sm:text-[10px] font-black uppercase tracking-widest border ${theme.bg} ${theme.text} ${theme.border}`}>
                  {news.category || 'News'}
                </span>
                <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  {formatDate(news.date)}
                </span>
              </div>
              
              <button
                onClick={handleBookmarkClick}
                className={`p-1 sm:p-1.5 rounded-lg transition-colors ${isBookmarked ? 'text-amber-500' : 'text-slate-300 hover:text-slate-500'}`}
              >
                <FiBookmark className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2 mb-1.5 sm:mb-2">
              {news.title}
            </h3>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-900 flex items-center justify-center border border-white shadow-sm shrink-0">
                <span className="text-[8px] text-white font-black leading-none">
                  {news.author?.charAt(0) || 'S'}
                </span>
              </div>
              <span className="text-[9px] sm:text-[11px] font-bold text-slate-600 truncate max-w-[80px] sm:max-w-[100px]">
                {news.author || 'School Admin'}
              </span>
            </div>
            
            <div className="flex items-center gap-0.5 sm:gap-1 text-blue-600 font-bold text-[9px] sm:text-[11px] uppercase tracking-wider flex-shrink-0">
              Read More
              <FiArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern Share Modal
const ModernShareModal = ({ item, type = 'event', onClose }) => {
  const [copied, setCopied] = useState(false);
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const previewImage = item?.image || (type === 'event' ? '/default-event.jpg' : '/default-news.jpg');
  const previewMeta = type === 'event'
    ? `${item?.time || 'Time TBA'} • ${item?.location || 'Matungulu Girls Senior School'}`
    : `${item?.author || 'School Admin'} • ${item?.category || 'News'}`;

  const socialPlatforms = [
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      color: 'bg-green-500',
      action: () => {
        const text = `${item.title}\n\n${type === 'event' ? 'Event Details:' : 'News:'}\n${item.excerpt || item.description}\n\n${pageUrl}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      }
    },
    {
      name: 'Facebook',
      icon: FaFacebookF,
      color: 'bg-blue-600',
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`, '_blank');
      }
    },
    {
      name: 'Twitter',
      icon: FaTwitter,
      color: 'bg-sky-500',
      action: () => {
        const text = `${item.title} - Check out this ${type}!`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(pageUrl)}`, '_blank');
      }
    },
    {
      name: 'Telegram',
      icon: FaTelegram,
      color: 'bg-blue-500',
      action: () => {
        const text = `${item.title}\n\n${item.excerpt || item.description}`;
        window.open(`https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(text)}`, '_blank');
      }
    },
    {
      name: 'Email',
      icon: FaEnvelope,
      color: 'bg-gray-600',
      action: () => {
        const subject = `${item.title} - ${type === 'event' ? 'Event' : 'News'}`;
        const body = `${item.excerpt || item.description}\n\n${pageUrl}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      }
    }
  ];

  const getPlatformColor = (color) => {
    if (color === 'bg-green-500') return '#25D366';
    if (color === 'bg-blue-600') return '#1877F2';
    if (color === 'bg-sky-500') return '#1DA1F2';
    if (color === 'bg-blue-500') return '#229ED9';
    return '#4B5563';
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-md sm:rounded-2xl">
        <div className="bg-[#1a1a2e] px-6 pb-5 pt-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">
              Share {type === 'event' ? 'Event' : 'Content'}
            </span>
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/60"
            >
              <FiX size={14} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 overflow-hidden rounded-xl bg-white/10 ring-2 ring-white/10">
              <img src={previewImage} alt={item.title} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-white">{item.title}</h3>
              <p className="text-[11px] font-medium text-white/40">{previewMeta}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Share via</p>
          <div className="grid grid-cols-3 gap-3">
            {socialPlatforms.map((platform, index) => {
              const Icon = platform.icon;
              return (
                <button
                  key={index}
                  onClick={platform.action}
                  className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-slate-100 py-3"
                >
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-full text-white shadow-md"
                    style={{ backgroundColor: getPlatformColor(platform.color) }}
                  >
                    <Icon className="text-xl" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500">
                    {platform.name}
                  </span>
                </button>
              );
            })}

            <button
              onClick={copyToClipboard}
              className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-slate-100 py-3"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-full shadow-md ${copied ? 'bg-emerald-500 text-white' : 'bg-[#1a1a2e] text-white'}`}>
                <FiCopy size={18} />
              </div>
              <span className="text-[10px] font-semibold text-slate-500">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Direct Link</p>
            <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2">
              <div className="min-w-0 flex-1 px-2">
                <p className="truncate text-[11px] font-medium text-slate-500">{pageUrl}</p>
              </div>
              <button
                onClick={copyToClipboard}
                className={`rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] transition-all ${
                  copied ? 'bg-emerald-500 text-white' : 'bg-[#1a1a2e] text-white'
                }`}
              >
                {copied ? 'Done' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern Detail Modal
const ModernDetailModal = ({ item, type = 'event', onClose, onAddToCalendar, onShare }) => {
  if (!item) return null;

  const formatFullDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch { return dateString || 'Date not set'; }
  };

  const getCategoryStyle = (category) => {
    const styles = {
      academic: 'from-blue-500 to-cyan-500',
      cultural: 'from-purple-500 to-pink-500',
      sports: 'from-emerald-500 to-green-500',
      workshop: 'from-orange-500 to-amber-500',
      announcement: 'from-blue-500 to-cyan-500',
      achievement: 'from-emerald-500 to-green-500',
      infrastructure: 'from-purple-500 to-pink-500',
      general: 'from-orange-500 to-amber-500'
    };
    return styles[category?.toLowerCase()] || 'from-slate-500 to-slate-600';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#172033]/85 p-0 backdrop-blur-sm sm:p-4">
      <div className="relative flex h-full w-full flex-col overflow-hidden border border-[#d9d0c3] bg-[#fcfaf6] shadow-2xl sm:h-auto sm:max-h-[90vh] sm:max-w-3xl sm:rounded-[40px]">
        
          <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 rounded-full border border-white/20 bg-black/20 p-2 text-white backdrop-blur-md transition-all active:scale-90 sm:top-5 sm:right-5"
        >
          <IoClose size={20} />
        </button>

        <div className="relative h-[30vh] sm:h-[350px] w-full shrink-0">
          <img
            src={item.image || (type === 'event' ? '/default-event.jpg' : '/default-news.jpg')}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fcfaf6] via-[#172033]/15 to-black/20" />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#172033]/55 to-transparent" />
          
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex gap-2">
            <span className={`px-3 py-1 sm:px-4 sm:py-1.5 bg-white shadow-xl rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-900`}>
              {item.category || type}
            </span>
            {item.featured && (
              <span className="rounded-full bg-[#172033] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white sm:px-4 sm:py-1.5 sm:text-xs flex items-center gap-1">
                <IoSparkles className="h-3 w-3 text-[#f2c357] sm:h-4 sm:w-4" /> 
                <span className="hidden sm:inline">Featured</span>
                <span className="sm:hidden">★</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#fcfaf6] p-4 sm:p-6 md:p-10">
          <div className="mx-auto max-w-2xl space-y-6 sm:space-y-8">
            
            <section className="space-y-3 sm:space-y-4">
              <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight">
                {item.title}
              </h2>
              
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-y-2 sm:gap-y-3 gap-x-6 text-xs sm:text-sm font-semibold text-slate-500">
                <div className="flex items-center gap-2">
                  <IoCalendarClearOutline className="text-[#172033] text-base sm:text-lg" />
                  {formatFullDate(item.date)}
                </div>
                {type === 'event' && item.location && (
                  <div className="flex items-center gap-2">
                    <IoLocationOutline className="text-[#9a5b1f] text-base sm:text-lg" />
                    {item.location}
                  </div>
                )}
                {type === 'news' && (
                  <div className="flex items-center gap-2">
                    <IoPersonOutline className="text-[#172033] text-base sm:text-lg" />
                    By {item.author || 'School Admin'}
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-3 sm:space-y-4">
              <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-400">
                About this {type}
              </h3>
              <div className="rounded-[28px] border border-[#e8dfd3] bg-white p-5 text-sm leading-relaxed text-slate-700 sm:p-6 sm:text-base md:text-lg">
                {item.description || item.excerpt || 'No description available.'}
              </div>
              
              {type === 'news' && item.fullContent && (
                <div className="mt-3 whitespace-pre-line rounded-[28px] border border-[#e8dfd3] bg-white p-5 text-xs italic text-slate-600 sm:mt-4 sm:p-6 sm:text-sm md:text-base">
                  {item.fullContent}
                </div>
              )}
            </section>

            {type === 'event' && (
              <section className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-4">
                <div className="rounded-2xl border border-[#e8dfd3] bg-white p-3 sm:rounded-3xl sm:p-4">
                  <IoTimeOutline className="mb-1 h-4 w-4 text-[#172033] sm:mb-2 sm:h-5 sm:w-5" />
                  <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 mb-0.5 sm:mb-1">Time</p>
                  <p className="font-bold text-slate-900 text-xs sm:text-sm md:text-base truncate">{item.time || 'All Day'}</p>
                </div>
                <div className="rounded-2xl border border-[#e8dfd3] bg-white p-3 sm:rounded-3xl sm:p-4">
                  <IoPersonOutline className="mb-1 h-4 w-4 text-[#172033] sm:mb-2 sm:h-5 sm:w-5" />
                  <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 mb-0.5 sm:mb-1">Attendees</p>
                  <p className="font-bold text-slate-900 text-xs sm:text-sm md:text-base truncate">{item.attendees || 'Open'}</p>
                </div>
                {item.speaker && (
                  <div className="col-span-2 rounded-2xl border border-[#e8dfd3] bg-white p-3 sm:col-span-1 sm:rounded-3xl sm:p-4">
                    <IoSparkles className="mb-1 h-4 w-4 text-[#f2c357] sm:mb-2 sm:h-5 sm:w-5" />
                    <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 mb-0.5 sm:mb-1">Speaker</p>
                    <p className="font-bold text-slate-900 text-xs sm:text-sm md:text-base truncate">{item.speaker}</p>
                  </div>
                )}
              </section>
            )}
          </div>
        </div>

        <div className="shrink-0 border-t border-[#e8dfd3] bg-white/80 p-4 backdrop-blur-md sm:p-6">
          <div className="max-w-2xl mx-auto flex flex-row items-center gap-2 sm:gap-3">
            {type === 'event' ? (
              <button
                onClick={onAddToCalendar}
                className="flex-[2] min-w-0 h-11 sm:h-14 rounded-xl bg-[#172033] text-white sm:rounded-2xl font-black text-[11px] sm:text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all uppercase tracking-[0.14em]"
              >
                <IoCalendarClearOutline size={16} className="shrink-0 sm:size-[20px]" />
                <span className="truncate">Add to Calendar</span>
              </button>
            ) : (
              <button
                className="flex-[2] min-w-0 h-11 sm:h-14 rounded-xl bg-[#172033] text-white sm:rounded-2xl font-black text-[11px] sm:text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all uppercase tracking-[0.14em]"
                onClick={onClose}
              >
                <IoNewspaperOutline size={16} className="shrink-0 sm:size-[20px]" />
                <span className="truncate">Close</span>
              </button>
            )}
            
            <button
              onClick={onShare}
              className="flex-1 min-w-0 h-11 sm:h-14 rounded-xl border-2 border-[#d9d0c3] bg-[#fcfaf6] text-[#172033] sm:rounded-2xl font-black text-[11px] sm:text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all uppercase tracking-[0.14em]"
            >
              <IoShareOutline size={16} className="shrink-0 sm:size-[20px]" />
              <span className="truncate">Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern Pagination Component
const ModernPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 3) {
        start = 2;
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
        end = totalPages - 1;
      }
      
      if (start > 2) pages.push('...');
      
      for (let i = start; i <= end; i++) pages.push(i);
      
      if (end < totalPages - 1) pages.push('...');
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="mt-8 flex items-center justify-center gap-2 border-t border-[#e8dfd3] pt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-xl border border-[#d9d0c3] bg-white p-2 transition-colors hover:bg-[#fcfaf6] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FiChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold transition-all ${
              page === '...'
                ? 'text-gray-500'
                : currentPage === page
                ? 'bg-[#172033] text-white shadow-lg'
                : 'text-gray-700 hover:bg-[#fcfaf6]'
            }`}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-xl border border-[#d9d0c3] bg-white p-2 transition-colors hover:bg-[#fcfaf6] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FiChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

// Main Component
export default function ModernEventsNewsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [eventsData, setEventsData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [bookmarkedEvents, setBookmarkedEvents] = useState(new Set());
  const [bookmarkedNews, setBookmarkedNews] = useState(new Set());
  const itemsPerPage = 9;

  const categories = [
    { id: 'all', name: 'All Events', icon: IoCalendarClearOutline, color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    { id: 'academic', name: 'Academic', icon: IoNewspaperOutline, color: 'bg-gradient-to-r from-blue-500 to-purple-500' },
    { id: 'cultural', name: 'Cultural', icon: FiMusic, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { id: 'sports', name: 'Sports', icon: FiTrendingUp, color: 'bg-gradient-to-r from-emerald-500 to-green-500' },
    { id: 'workshop', name: 'Workshops', icon: FiZap, color: 'bg-gradient-to-r from-orange-500 to-amber-500' }
  ];

  // Load bookmarks from localStorage
  useEffect(() => {
    const savedEventBookmarks = localStorage.getItem('bookmarkedEvents');
    const savedNewsBookmarks = localStorage.getItem('bookmarkedNews');
    
    if (savedEventBookmarks) {
      setBookmarkedEvents(new Set(JSON.parse(savedEventBookmarks)));
    }
    if (savedNewsBookmarks) {
      setBookmarkedNews(new Set(JSON.parse(savedNewsBookmarks)));
    }
  }, []);

  // Save bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem('bookmarkedEvents', JSON.stringify([...bookmarkedEvents]));
  }, [bookmarkedEvents]);

  useEffect(() => {
    localStorage.setItem('bookmarkedNews', JSON.stringify([...bookmarkedNews]));
  }, [bookmarkedNews]);

  const fetchEvents = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      if (data.success) {
        setEventsData(data.events || []);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
      setEventsData([]);
    } finally {
      if (showRefresh) setRefreshing(false);
    }
  };

  const fetchNews = async (showRefresh = false) => {
    try {
      const response = await fetch('/api/news');
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setNewsData(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Failed to load news');
      setNewsData([]);
    }
  };

  const fetchData = async (showRefresh = false) => {
    if (!showRefresh) setLoading(true);
    try {
      await Promise.all([fetchEvents(showRefresh), fetchNews(showRefresh)]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      if (!showRefresh) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredEvents = eventsData.filter(event => {
    const matchesSearch = searchTerm === '' || 
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeTab === 'all' || event.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  const filteredNews = newsData.filter(news => {
    return searchTerm === '' || 
      news.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCalendar = (event) => {
    try {
      const startDate = new Date(event.date);
      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
      window.open(googleCalendarUrl, '_blank');
      toast.success('Added to Google Calendar');
    } catch (error) {
      toast.error('Failed to add to calendar');
    }
  };

  const handleBookmarkEvent = (event, isBookmarked) => {
    const newBookmarked = new Set(bookmarkedEvents);
    if (isBookmarked) {
      newBookmarked.add(event.id);
      toast.success('Bookmarked event');
    } else {
      newBookmarked.delete(event.id);
      toast.success('Removed from bookmarks');
    }
    setBookmarkedEvents(newBookmarked);
  };

  const handleBookmarkNews = (news, isBookmarked) => {
    const newBookmarked = new Set(bookmarkedNews);
    if (isBookmarked) {
      newBookmarked.add(news.id);
      toast.success('Bookmarked news');
    } else {
      newBookmarked.delete(news.id);
      toast.success('Removed from bookmarks');
    }
    setBookmarkedNews(newBookmarked);
  };

  const refreshData = () => {
    fetchData(true);
  };

  const stats = [
    { 
      icon: IoCalendarClearOutline, 
      number: eventsData.length.toString() + '+', 
      label: 'Upcoming Events', 
      sublabel: 'This month',
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: IoNewspaperOutline, 
      number: newsData.length.toString() + '+', 
      label: 'News Articles', 
      sublabel: 'Latest updates',
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      icon: IoRibbonOutline, 
      number: (eventsData.filter(e => e.featured).length + newsData.filter(n => n.featured).length).toString(), 
      label: 'Featured', 
      sublabel: 'Highlights',
      gradient: 'from-amber-500 to-orange-500'
    },
    { 
      icon: IoPeopleCircle, 
      number: '100%', 
      label: 'Engagement', 
      sublabel: 'Community',
      gradient: 'from-emerald-500 to-green-500'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4efe7] p-4">
        <div className="max-w-7xl mx-auto">
          <div className="min-h-[70vh] flex items-center justify-center">
            <Stack spacing={2} alignItems="center">
              <div className="relative flex items-center justify-center scale-90 sm:scale-110">
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={48}
                  thickness={4.5}
                    sx={{ color: '#e8dfd3' }}
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
                <div className="absolute">
                  <IoSparkles className="text-[#f2c357] text-sm animate-pulse" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-[#172033] font-medium text-sm sm:text-base tracking-tight italic">
                  Loading events & news...
                </p>
                <p className="text-slate-400 text-[10px] sm:text-xs uppercase tracking-widest mt-1 font-bold">
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
    <div className="min-h-screen bg-[#f4efe7] p-4 md:p-6">
      <Toaster position="top-right" richColors />
      
      <div className="w-full md:w-[85%] mx-auto space-y-6">
        
{/* Modern Hero Header - Staff/Team aligned theme */}
<div className="relative mb-8 overflow-hidden rounded-lg border border-[#d9d0c3] bg-[#172033] text-white shadow-[0_30px_80px_-50px_rgba(15,23,42,0.82)]">
  {/* Background Glows */}
  <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-[#f2c357]/10 blur-3xl" />
  <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
  <div className="absolute inset-y-0 right-[36%] w-px bg-white/10 hidden lg:block" />
  
  <div className="relative z-10 grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
    <div className="p-6 md:p-10">
      <div className="flex flex-col justify-between gap-6 h-full">
      <div>
        {/* School Branding */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-1 rounded-full bg-[#f2c357] shadow-[0_0_15px_rgba(242,195,87,0.5)]" />
          <div>
            <h2 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-[#f2c357]">
              Matungulu Girls Senior School
            </h2>
            <p className="text-[8px] sm:text-[10px] italic font-medium text-white/45 tracking-widest uppercase">
              "Strive to Excel"
            </p>
          </div>
        </div>
        
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-white/10 bg-white/10 p-2 backdrop-blur-md">
            <IoSchoolOutline className="text-xl text-[#f2c357] sm:text-2xl md:text-3xl" />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight">
            School <span className="bg-gradient-to-r from-[#f2c357] to-[#fff3c4] bg-clip-text text-transparent">Events & News</span>
          </h1>
        </div>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-white/72 sm:text-base">
     Stay connected with the moments that define our School MatG. From the excitement of game day and the brilliance of our seasonal concerts to the essential updates that keep our families informed, this is your home for everything happening on and off campus. Explore our latest headlines and mark your calendars for the milestones ahead.        </p>
      </div>


      </div>
    </div>

    <div className="border-t border-white/10 p-6 md:p-10 lg:border-t-0">
      <div className="flex h-full flex-col justify-between">
         {/* Refresh & View Toggle Group */}
<div className="flex flex-nowrap items-center gap-2 sm:gap-3 w-auto">
  {/* Refresh Button - Moderate & Proportional */}
  <button
    onClick={refreshData}
    disabled={refreshing}
    className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 font-bold text-[10px] tracking-widest text-white backdrop-blur-xl transition-all hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-70 sm:px-5 sm:text-xs"
  >
    {refreshing ? (
      <>
        <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>REFRESHING...</span>
      </>
    ) : (
      <>
        <FiRefreshCw className="text-sm sm:text-base" />
        <span>REFRESH UPDATES</span>
      </>
    )}
  </button>

  {/* View Toggle - Compact & Matching Height */}
  <div className="flex h-12 items-center rounded-xl border border-white/20 bg-white/10 p-1 backdrop-blur-xl">
    <button
      onClick={() => setViewMode('grid')}
      className={`h-8 w-8 sm:w-10 flex items-center justify-center rounded-lg transition-all ${
        viewMode === 'grid' 
          ? 'bg-[#f2c357] text-[#172033] shadow-lg shadow-[#172033]/30' 
          : 'text-white/55 hover:text-white'
      }`}
    >
      <FiGrid size={12} className="sm:size-[16px]" />
    </button>
    <button
      onClick={() => setViewMode('list')}
      className={`h-8 w-8 sm:w-10 flex items-center justify-center rounded-lg transition-all ${
        viewMode === 'list' 
          ? 'bg-[#f2c357] text-[#172033] shadow-lg shadow-[#172033]/30' 
          : 'text-white/55 hover:text-white'
      }`}
    >
      <FiList size={12} className="sm:size-[16px]" />
    </button>
  </div>
</div>


        {/* Additional Info */}
        <div className="mt-5 text-xs sm:text-sm text-white/60">
          <span className="inline-flex items-center gap-1">
            <IoSparkles className="text-[#f2c357]" size={14} />
            Click on any event or news item for detailed information
          </span>
        </div>
      </div>
    </div>
  </div>
</div>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 mb-10">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-[#d9d0c3] bg-white p-4 shadow-[0_20px_50px_-42px_rgba(15,23,42,0.4)] md:rounded-[32px] md:p-6"
              >
                <div className="flex items-start justify-between mb-4 md:mb-8">
                  <div className="rounded-xl bg-[#fcfaf6] p-2 text-[#172033] ring-1 ring-[#e8dfd3] md:rounded-2xl md:p-3">
                    <Icon className="text-lg md:text-2xl" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
                    {stat.label}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <h3 className="text-xl md:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
                      {stat.number}
                    </h3>
                  </div>
                  <p className="text-[10px] md:text-sm font-medium text-slate-500 leading-tight line-clamp-1 md:line-clamp-none">
                    {stat.sublabel}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search & Filters */}
        <div className="relative mb-6 sm:mb-8">
          <div className="rounded-2xl border border-[#d9d0c3] bg-white/90 p-2 shadow-lg shadow-slate-200/20 backdrop-blur-md sm:rounded-[28px] md:rounded-full sm:p-3">
            <div className="flex flex-col md:flex-row items-center gap-2 sm:gap-3">
              
              <div className="relative w-full flex-1 group">
                <div className="relative flex items-center rounded-xl border border-[#d9d0c3] bg-[#fcfaf6] shadow-sm transition-all focus-within:border-[#172033] focus-within:ring-2 focus-within:ring-[#172033]/10 sm:rounded-2xl sm:focus-within:ring-4">
                  <div className="pl-3 sm:pl-4 md:pl-5 pr-2 sm:pr-3 flex items-center justify-center pointer-events-none">
                    <FiSearch className="text-slate-400 transition-colors group-focus-within:text-[#172033]" size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search events, news, or resources..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full py-3 sm:py-4 bg-transparent text-slate-900 placeholder:text-slate-400 font-medium sm:font-semibold text-sm focus:outline-none placeholder:text-xs sm:placeholder:text-sm"
                  />
                  <div className="pr-2 flex items-center gap-1 sm:gap-2">
                    {searchTerm ? (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="rounded-lg bg-white p-1.5 text-[#172033] ring-1 ring-[#e8dfd3] transition-transform active:scale-90 sm:rounded-xl sm:p-2"
                      >
                        <FiX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex w-full items-center gap-2 border-t border-[#efe7da] pt-2 sm:gap-3 sm:pt-3 md:w-auto md:border-l md:border-t-0 md:border-[#efe7da] md:pl-3 md:pt-0">
                
                <div className="w-full md:w-auto">
  {/* Mobile dropdown */}
  <div className="relative md:hidden">
    <select 
      value={activeTab}
      onChange={(e) => {
        setActiveTab(e.target.value);
        setCurrentPage(1);
      }}
      className="
        w-full
        appearance-none 
        px-4 
        py-4 
        bg-white 
        border-2 border-[#d9d0c3] 
        rounded-xl 
        font-medium 
        text-slate-700 text-base
        cursor-pointer 
        focus:outline-none focus:ring-2 focus:ring-[#172033]/10 focus:border-[#172033]
        transition-all
        shadow-sm
      "
      style={{
        minHeight: '56px', /* Extra large touch target */
        fontSize: '16px', /* Prevents zoom on iOS */
        WebkitTapHighlightColor: 'transparent'
      }}
    >
      {categories.map((category) => (
        <option key={category.id} value={category.id} className={`py-3 bg-${category.color} font-medium`}>
          {category.name}
        </option>
      ))}
    </select>
    
    {/* Custom dropdown arrow */}
    <div className="absolute right-4 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-[#f6efe2] pointer-events-none">
      <svg 
        className="h-4 w-4 text-[#172033]" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        strokeWidth="2.5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>

  {/* Desktop dropdown - unchanged */}
  <div className="hidden md:block relative">
    <select 
      value={activeTab}
      onChange={(e) => {
        setActiveTab(e.target.value);
        setCurrentPage(1);
      }}
      className="
        w-40
        appearance-none 
        px-5 
        py-3 
        bg-transparent 
        border-none 
        rounded-full 
        font-semibold 
        text-slate-600 text-sm 
        cursor-pointer 
        focus:ring-2 focus:ring-[#172033]/10 
        transition-all
      "
    >
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
    
    {/* Desktop arrow */}
    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</div>

                <button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveTab('all');
                    setCurrentPage(1);
                  }}
                  className="flex flex-shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#172033] p-2.5 text-xs font-black uppercase tracking-[0.14em] text-white shadow-md shadow-[#172033]/20 transition-all active:scale-95 sm:gap-2 sm:rounded-2xl sm:p-3 sm:text-sm md:rounded-full md:px-6 md:py-3"
                >
                  <FiFilter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden md:inline">Reset</span>
                  <span className="md:hidden text-[10px] font-bold">Clear</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">

               {/* Right Column: News */}
          <div className="lg:w-[380px] space-y-6">
            <div className="lg:sticky lg:top-24 space-y-6">
              
              <div className="rounded-[32px] border border-[#d9d0c3] bg-white p-6 shadow-[0_20px_50px_-42px_rgba(15,23,42,0.35)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f6efe2]">
                    <IoNewspaperOutline className="text-[#172033] text-xl" />
                  </div>
                  <h2 className="text-xl font-black text-[#172033]">Latest News</h2>
                </div>

                <div className="space-y-5">
                  {filteredNews?.slice(0, 4).map((news, index) => (
                    <ModernNewsCard 
                      key={news.id || index} 
                      news={news} 
                      onView={setSelectedNews}
                      onBookmark={handleBookmarkNews}
                      viewMode="list"
                      isBookmarked={bookmarkedNews.has(news.id)}
                    />
                  ))}
                </div>

                <div className="mt-6 rounded-[24px] border border-[#e8dfd3] bg-[#fcfaf6] p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Editor&apos;s Note</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Important notices, celebrations, and campus milestones all live here in one easier-to-scan panel.
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[32px] bg-[#172033] p-6 text-white">
                <div className="absolute top-0 right-0 h-24 w-24 bg-[#f2c357]/15 blur-[50px]" />
                <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#f2c357]">Stats At A Glance</h4>
                <div className="grid grid-cols-2 gap-4 relative z-10">
                  <div>
                    <p className="text-2xl font-bold">{eventsData?.length || 0}</p>
                    <p className="text-[10px] uppercase font-bold text-white/45">Events</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{newsData?.length || 0}</p>
                    <p className="text-[10px] uppercase font-bold text-white/45">Articles</p>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-slate-800">
                    <p className="text-sm font-bold text-[#f2c357]">
                      {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-white/45">Last Updated</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Left Column: Events */}
          <div className="flex-1 min-w-0 space-y-4 sm:space-y-8">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 px-1">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="shrink-0 rounded-xl bg-[#172033] p-2 shadow-lg sm:rounded-2xl sm:p-3">
                  <IoCalendarClearOutline className="text-white text-lg sm:text-2xl" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-none sm:leading-normal">
                    Upcoming Events
                  </h2>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider sm:tracking-widest mt-0.5 sm:mt-1">
                    {filteredEvents?.length || 0} Events Found
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-2 px-2">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = activeTab === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => { setActiveTab(category.id); setCurrentPage(1); }}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full whitespace-nowrap text-[11px] sm:text-sm font-bold transition-all border ${
                      isActive 
                        ? "bg-[#172033] border-[#172033] text-white shadow-md shadow-[#172033]/20" 
                        : "bg-white border-[#d9d0c3] text-slate-600"
                    }`}
                  >
                    {Icon && <Icon className={`${isActive ? "text-white" : "text-slate-400"} text-xs sm:text-base`} />}
                    {category.name}
                  </button>
                );
              })}
            </div>

            <div className="relative">
              {!paginatedEvents || paginatedEvents.length === 0 ? (
                <div className="bg-slate-50 rounded-[24px] sm:rounded-[32px] border-2 border-dashed border-slate-200 py-8 sm:py-16 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#fcfaf6] shadow-sm ring-1 ring-[#e8dfd3] sm:h-16 sm:w-16">
                    <IoCalendarClearOutline className="text-slate-300 text-xl sm:text-2xl" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">No events found</h3>
                  <p className="text-slate-500 text-xs mt-1 mb-4">Try adjusting filters.</p>
                  <button 
                    onClick={() => { setSearchTerm(''); setActiveTab('all'); }}
                    className="rounded-full border border-[#d9d0c3] bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#172033]"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6' : 'space-y-3 sm:space-y-4'}>
                  {paginatedEvents.map((event, index) => (
                    <ModernEventCard 
                      key={event.id || index} 
                      event={event} 
                      onView={setSelectedEvent}
                      onBookmark={handleBookmarkEvent}
                      viewMode={viewMode}
                      isBookmarked={bookmarkedEvents.has(event.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="pt-2 sm:pt-4">
                <ModernPagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={handlePageChange} 
                />
              </div>
            )}
          </div>

     
        </div>

        {/* Footer Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-[#172033] p-5 shadow-xl md:p-8">
          <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-[#f2c357]/10 blur-[80px]" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-white/5 blur-[80px]" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="shrink-0">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg md:h-16 md:w-16">
                <FiMessageCircle className="text-[#172033] text-2xl md:text-3xl" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">
                Stay Connected.
              </h3>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto md:mx-0">
                The hub for school updates. Sync schedules, collaborate, and stay on track.
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
                {([
                  { label: 'Sharing', icon: FiShare2, color: 'text-[#f2c357]', bg: 'bg-[#f2c357]/10' },
                  { label: 'Sync', icon: FiCalendar, color: 'text-white', bg: 'bg-white/10' },
                  { label: 'Save', icon: FiBookmark, color: 'text-[#f2c357]', bg: 'bg-[#f2c357]/10' },
                  { label: 'Alerts', icon: FiBell, color: 'text-white', bg: 'bg-white/10' }
                ]).map((feature, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10"
                  >
                    <div className={`p-1.5 rounded-md ${feature.bg} ${feature.color} shrink-0`}>
                      <feature.icon size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 truncate">
                      {feature.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedEvent && !showShareModal && (
        <ModernDetailModal
          item={selectedEvent}
          type="event"
          onClose={() => setSelectedEvent(null)}
          onAddToCalendar={() => handleAddToCalendar(selectedEvent)}
          onShare={() => setShowShareModal(true)}
        />
      )}

      {selectedNews && !showShareModal && (
        <ModernDetailModal
          item={selectedNews}
          type="news"
          onClose={() => setSelectedNews(null)}
          onAddToCalendar={() => {}}
          onShare={() => setShowShareModal(true)}
        />
      )}


      {showShareModal && (selectedEvent || selectedNews) && (
        <ModernShareModal
          item={selectedEvent || selectedNews}
          type={selectedEvent ? 'event' : 'news'}
          onClose={() => {
            setShowShareModal(false);
            setSelectedEvent(null);
            setSelectedNews(null);
          }}
        />
      )}
    </div>
  );
}
