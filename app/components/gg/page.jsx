// app/pages/gallery/ClientGallery.jsx - Refined to match Events/News vibe
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
  FiSave, FiUpload, FiMapPin, FiAlertTriangle, FiMail, FiPhone, FiFolder, FiLock, FiMessageCircle 
} from 'react-icons/fi';
import { FaWhatsapp, FaFacebookF, FaTwitter, FaTelegram, FaEnvelope } from 'react-icons/fa';
import { 
  IoClose, IoMenu, IoSparkles, IoNewspaperOutline,
  IoCalendarClearOutline, IoRibbonOutline, IoPeopleCircle,
  IoStatsChart, IoShareSocialOutline, IoLocationOutline,
  IoTimeOutline, IoPersonOutline, IoShareOutline
} from 'react-icons/io5';
import { CircularProgress, Box, Typography, Stack } from '@mui/material';
import Head from 'next/head';

// ==================== MODERN MODAL (Glass Morphism) ====================
const ModernModal = ({ children, open, onClose, maxWidth = '800px', blur = true }) => {
  if (!open) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${blur ? 'backdrop-blur-md' : 'bg-black/50'}`}>
      <div 
        className="relative bg-white/95 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border border-white/40"
        style={{ 
          width: '90%',
          maxWidth: maxWidth,
          maxHeight: '90vh',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)'
        }}
      >
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={onClose}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white cursor-pointer border border-gray-200 shadow-sm"
          >
            <FiX className="text-gray-600 w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ==================== GLASS CARD COMPONENT ====================
const GlassCard = ({ children, className = '', hover = true }) => (
  <div className={`
    bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 
    shadow-lg shadow-black/5 transition-all duration-300
    ${hover ? 'hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1' : ''}
    ${className}
  `}>
    {children}
  </div>
);

// ==================== MODERN SHARE MODAL (Matches Events/News) ====================
const ModernShareModal = ({ gallery, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!gallery) return null;

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/pages/gallery`
    : '';

  const socialPlatforms = [
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      color: 'bg-[#25D366]',
      hoverColor: 'hover:bg-[#128C7E]',
      action: () => {
        const text = `${gallery.title}\n\n📸 Gallery:\n${gallery.description?.substring(0, 100)}...\n\n${shareUrl}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      }
    },
    {
      name: 'Facebook',
      icon: FaFacebookF,
      color: 'bg-[#1877F2]',
      hoverColor: 'hover:bg-[#0d65d9]',
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
      }
    },
    {
      name: 'Twitter',
      icon: FaTwitter,
      color: 'bg-[#1DA1F2]',
      hoverColor: 'hover:bg-[#0c85d0]',
      action: () => {
        const text = `${gallery.title} - Check out this school gallery!`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
      }
    },
    {
      name: 'Telegram',
      icon: FaTelegram,
      color: 'bg-[#0088cc]',
      hoverColor: 'hover:bg-[#0077b5]',
      action: () => {
        const text = `${gallery.title}\n\n${gallery.description?.substring(0, 100)}...`;
        window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`, '_blank');
      }
    },
    {
      name: 'Email',
      icon: FaEnvelope,
      color: 'bg-slate-600',
      hoverColor: 'hover:bg-slate-700',
      action: () => {
        const subject = `${gallery.title} - School Gallery`;
        const body = `${gallery.description}\n\n${shareUrl}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      }
    }
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <ModernModal open={true} onClose={onClose} maxWidth="480px">
      {/* Dark Header - Matches Events/News style */}
      <div className="bg-[#2D1B14] p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-amber-500/10 blur-3xl rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-20 sm:w-24 h-20 sm:h-24 bg-rose-500/5 blur-2xl rounded-full -ml-12 -mb-12" />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 border border-white/10 shadow-2xl">
            <IoShareSocialOutline className="text-xl sm:text-2xl text-amber-200" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight italic">
            Share Gallery
          </h2>
          <p className="text-amber-100/50 text-[10px] sm:text-xs mt-1 uppercase tracking-[0.15em] sm:tracking-[0.2em] font-medium">
            Spread the word
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-6 md:p-8 bg-white">
        {/* Gallery Preview */}
        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100 mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl overflow-hidden bg-slate-200 shrink-0">
            {gallery.files?.[0] ? (
              <img src={gallery.files[0]} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600">
                <FiImage className="text-white text-sm" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h4 className="font-black text-slate-900 text-xs sm:text-sm truncate uppercase">{gallery.title}</h4>
            <p className="text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {gallery.files?.length || 0} Assets • Ready to Share
            </p>
          </div>
        </div>

        {/* Social Platforms Grid */}
        <div className="grid grid-cols-3 sm:flex sm:flex-wrap justify-center gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-8 md:mb-10">
          {socialPlatforms.map((platform, index) => {
            const Icon = platform.icon;
            return (
              <button
                key={index}
                onClick={platform.action}
                className="flex flex-col items-center gap-1.5 sm:gap-2 md:gap-2.5 group transition-transform active:scale-90"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-14 md:h-14 rounded-2xl sm:rounded-[20px] flex items-center justify-center text-white shadow-lg transition-all duration-300 ${platform.color} ${platform.hoverColor} group-hover:shadow-xl group-hover:-translate-y-1`}>
                  <Icon className="text-xl sm:text-2xl" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-500">
                  {platform.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Link Section */}
        <div className="space-y-2 sm:space-y-3">
          <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
            Page Link
          </label>
          
          <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0">
            <div className="w-full p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100 text-[10px] sm:text-xs font-medium text-slate-400 truncate sm:pr-28">
              {shareUrl}
            </div>
            
            <button
              onClick={copyToClipboard}
              className={`sm:absolute right-1.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
                copied 
                ? 'bg-emerald-500 text-white shadow-emerald-200' 
                : 'bg-[#2D1B14] text-white hover:bg-[#3d2a22] shadow-lg shadow-stone-200'
              }`}
            >
              {copied ? 'Copied!' : <><FiCopy className="text-xs sm:text-sm" /> Copy</>}
            </button>
          </div>
        </div>
      </div>
    </ModernModal>
  );
};

// ==================== MODERN STAT CARD ====================
const ModernStatCard = ({ stat }) => {
  const Icon = stat.icon;
  
  return (
    <div className="group relative overflow-hidden bg-white hover:bg-slate-50 transition-all duration-300 border border-slate-200/60 p-5 rounded-[2rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
      <div className="flex items-center gap-4 mb-4">
        <div className={`flex-shrink-0 p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg shadow-purple-500/20`}>
          <Icon className="text-xl" />
        </div>
        <div className="flex flex-col">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {stat.label}
          </p>
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-sm font-semibold text-slate-700 leading-snug">
          {stat.sublabel}
        </p>
      </div>
      <div className={`absolute -bottom-6 -right-6 w-24 h-24 blur-3xl opacity-10 rounded-full bg-gradient-to-br ${stat.gradient}`} />
    </div>
  );
};

// ==================== MODERN GALLERY CARD ====================
const ModernGalleryCard = ({ gallery, onView, onFavorite, viewMode = 'grid', onShare }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getCategoryStyle = (category) => {
    const styles = {
      GENERAL: { gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
      CLASSROOMS: { gradient: 'from-emerald-500 to-green-500', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
      TEACHING: { gradient: 'from-purple-500 to-pink-500', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
      LABORATORIES: { gradient: 'from-indigo-500 to-purple-500', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
      SPORTS_DAY: { gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
      GRADUATION: { gradient: 'from-rose-500 to-red-500', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', iconBg: 'bg-rose-100', iconColor: 'text-rose-600' }
    };
    return styles[category] || styles.GENERAL;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } catch { return 'Recently added'; }
  };

  const getImageAltText = (gallery, index = 0) => {
    const schoolName = "Matungulu Girls Senior School";
    const category = gallery.category?.replace(/_/g, ' ') || 'School';
    const year = gallery.year || new Date().getFullYear();
    const title = gallery.title || 'Gallery';
    return `${schoolName} - ${title} - ${category} - ${year} - Photo ${index + 1}`;
  };

  if (viewMode === 'grid') {
    const theme = getCategoryStyle(gallery.category);
    
    return (
      <div 
        onClick={() => onView(gallery)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group cursor-pointer"
        itemScope
        itemType="https://schema.org/ImageGallery"
      >
        <div className="relative bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          {/* Image Container */}
          <div className="relative h-52 w-full shrink-0 bg-gradient-to-br from-slate-100 to-slate-200">
            {gallery.files && gallery.files[0] ? (
              <>
                <img
                  src={gallery.files[0]}
                  alt={getImageAltText(gallery, 0)}
                  title={getImageAltText(gallery, 0)}
                  loading="lazy"
                  className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  itemProp="image"
                />
                <meta itemProp="caption" content={gallery.description || `Photos from ${gallery.title} at Matungulu Girls Senior School`} />
                <meta itemProp="datePublished" content={gallery.date} />
                <meta itemProp="contentLocation" content="Matungulu Girls Senior School, Matungulu, Machakos County, Kenya" />
              </>
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}>
                <FiImage className="text-white text-4xl opacity-50" />
              </div>
            )}
            
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${theme.bg} ${theme.text} ${theme.border}`}>
                {gallery.category.replace(/_/g, ' ')}
              </span>
              {gallery.year && (
                <span className="px-3 py-1 bg-slate-900/90 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                  <IoSparkles className="text-amber-400" /> {gallery.year}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); onShare(gallery); }}
                className="p-2.5 rounded-xl backdrop-blur-md border shadow-sm bg-white/90 border-white/10 text-slate-700 hover:bg-white"
                aria-label={`Share ${gallery.title} gallery`}
              >
                <FiShare2 size={16} />
              </button>
              
              <button
                onClick={(e) => { e.stopPropagation(); onFavorite(gallery); setIsFavorite(!isFavorite); }}
                className={`p-2.5 rounded-xl backdrop-blur-md border shadow-sm ${isFavorite ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white/90 border-white/10 text-slate-700 hover:bg-white'}`}
                aria-label={`Favorite ${gallery.title} gallery`}
              >
                <FiBookmark className={`${isFavorite ? 'fill-current' : ''} w-3.5 h-3.5`} />
              </button>
            </div>

            {/* File Count Overlay */}
            <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4">
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                <span itemProp="numberOfItems">{gallery.files?.length || 0}</span> files
              </span>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-4 sm:p-6" itemProp="description">
            <h3 className="text-base sm:text-xl font-bold text-slate-900 mb-2 line-clamp-2 leading-tight" itemProp="name">
              {gallery.title}
            </h3>
            
            <p className="text-slate-500 text-xs sm:text-sm mb-4 sm:mb-6 line-clamp-2 leading-relaxed" itemProp="abstract">
              {gallery.description || `${gallery.title} - ${gallery.category?.replace(/_/g, ' ')} gallery at Matungulu Girls Senior School.`}
            </p>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="flex items-center gap-1.5 sm:gap-2.5 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100/50">
                <div className={`p-1 sm:p-1.5 rounded-lg ${theme.iconBg}`}>
                  <FiCalendar className={`${theme.iconColor}`} size={12} />
                </div>
                <span className="text-[9px] sm:text-[11px] font-bold text-slate-700 uppercase tracking-tight">
                  <time dateTime={gallery.date}>{formatDate(gallery.date)}</time>
                </span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2.5 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100/50">
                <div className={`p-1 sm:p-1.5 rounded-lg ${theme.iconBg}`}>
                  <FiImage className={`${theme.iconColor}`} size={12} />
                </div>
                <span className="text-[9px] sm:text-[11px] font-bold text-slate-700 uppercase tracking-tight truncate">
                  <span itemProp="numberOfItems">{gallery.files?.length || 0}</span> items
                </span>
              </div>

              <div className="col-span-2 flex items-center gap-1.5 sm:gap-2.5 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100/50">
                <div className={`p-1 sm:p-1.5 rounded-lg ${theme.iconBg}`}>
                  <FiFolder className={`${theme.iconColor}`} size={12} />
                </div>
                <span className="text-[9px] sm:text-[11px] font-bold text-slate-700 uppercase tracking-tight truncate">
                  <span itemProp="keywords">{gallery.category.replace(/_/g, ' ')}</span>
                </span>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse`} />
                <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span itemProp="creativeWorkStatus">Active Collection</span>
                </span>
              </div>
              
              <div className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest border bg-emerald-50 text-emerald-700 border-emerald-200`}>
                <span itemProp="dateCreated">{gallery.year || '2024'}</span>
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full py-2.5 sm:py-3 bg-slate-900 text-white rounded-xl sm:rounded-2xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 active:scale-[0.98] transition-transform hover:shadow-lg group-hover:bg-purple-600">
              <FiEye size={14} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>View Gallery</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List View
  const theme = getCategoryStyle(gallery.category);
  return (
    <div 
      onClick={() => onView(gallery)}
      className="relative bg-white rounded-[24px] border border-slate-100 p-4 shadow-sm cursor-pointer transition-colors active:bg-slate-50 group"
      itemScope
      itemType="https://schema.org/ImageGallery"
    >
      <div className="flex gap-3 sm:gap-5">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 shadow-sm">
          {gallery.files && gallery.files[0] ? (
            <img src={gallery.files[0]} alt={getImageAltText(gallery, 0)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${theme.gradient}`} />
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className={`px-1.5 sm:px-2.5 py-0.5 rounded-lg text-[8px] sm:text-[10px] font-black uppercase tracking-widest border ${theme.bg} ${theme.text} ${theme.border}`}>
                  {gallery.category.replace(/_/g, ' ')}
                </span>
                <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  {formatDate(gallery.date)}
                </span>
              </div>
              
              <div className="flex items-center gap-0.5 sm:gap-1">
                <button onClick={(e) => { e.stopPropagation(); onShare(gallery); }} className="p-1 sm:p-1.5 rounded-lg text-slate-300 hover:text-slate-500">
                  <FiShare2 size={12} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onFavorite(gallery); setIsFavorite(!isFavorite); }} className={`p-1 sm:p-1.5 rounded-lg ${isFavorite ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-slate-500'}`}>
                  <FiBookmark className={isFavorite ? 'fill-current' : ''} size={12} />
                </button>
              </div>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2 mb-1 sm:mb-2" itemProp="name">
              {gallery.title}
            </h3>
            <p className="text-slate-500 text-xs line-clamp-2 mb-2 sm:mb-3" itemProp="abstract">
              {gallery.description || 'School gallery collection.'}
            </p>
          </div>

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 sm:gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-0.5 sm:gap-1">
                <FiImage className="text-slate-400 w-3 h-3" />
                <span className="font-semibold text-[10px] sm:text-xs">{gallery.files?.length || 0} files</span>
              </div>
              <div className="flex items-center gap-0.5 sm:gap-1">
                <FiCalendar className="text-slate-400 w-3 h-3" />
                <span className="text-[10px] sm:text-xs">{gallery.year || new Date().getFullYear()}</span>
              </div>
            </div>
            <div className="flex items-center gap-0.5 sm:gap-1 text-purple-600 font-bold text-[9px] sm:text-[11px] uppercase tracking-wider group-hover:translate-x-1 transition-transform">
              View <FiArrowRight size={12} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== MODERN GALLERY DETAIL MODAL ====================
const ModernGalleryDetailModal = ({ gallery, onClose, onShare }) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [downloading, setDownloading] = useState(false);

  if (!gallery) return null;

  const getCategoryStyle = (category) => {
    const styles = {
      GENERAL: { gradient: 'from-blue-500 to-cyan-500', icon: FiGlobe },
      CLASSROOMS: { gradient: 'from-emerald-500 to-green-500', icon: FiBookOpen },
      TEACHING: { gradient: 'from-purple-500 to-pink-500', icon: FiBook },
      LABORATORIES: { gradient: 'from-indigo-500 to-purple-500', icon: FiTarget },
      SPORTS_DAY: { gradient: 'from-amber-500 to-orange-500', icon: FiAward },
      GRADUATION: { gradient: 'from-rose-500 to-red-500', icon: FiAward }
    };
    return styles[category] || { gradient: 'from-slate-500 to-slate-600', icon: FiImage };
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

  const getImageAltText = (gallery, index) => {
    const schoolName = "Matungulu Girls Senior School";
    const category = gallery.category?.replace(/_/g, ' ') || 'School';
    const year = gallery.year || new Date().getFullYear();
    const title = gallery.title || 'Gallery';
    return `${schoolName} - ${title} - ${category} - ${year} - Image ${index + 1}`;
  };

  const downloadAllFiles = async () => {
    if (!gallery.files || gallery.files.length === 0) {
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
          const response = await fetch(fileUrl);
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = fileName;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
          downloadedCount++;
          if (i < files.length - 1) await new Promise(resolve => setTimeout(resolve, 700));
        } catch (error) {
          console.error(`Failed to download ${fileName}:`, error);
        }
      }
      
      toast.dismiss(toastId);
      toast.success(`Successfully downloaded ${downloadedCount}/${files.length} files!`, { duration: 5000 });
      if (downloadedCount < files.length) {
        toast.info(`${files.length - downloadedCount} files may need to be downloaded manually`, { duration: 7000 });
      }
    } catch (error) {
      console.error('Error in download process:', error);
      toast.dismiss(toastId);
      toast.error('Download failed. Please try downloading files individually.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-slate-900/90 backdrop-blur-sm">
      <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-3xl bg-white sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 z-50 p-2 bg-black/20 backdrop-blur-md text-white rounded-full border border-white/20 transition-all active:scale-90"
        >
          <IoClose size={20} />
        </button>

        {/* Hero Image */}
        <div className="relative h-[30vh] sm:h-[350px] w-full shrink-0">
          {gallery.files && gallery.files[selectedIndex] ? (
            <img
              src={gallery.files[selectedIndex]}
              alt={getImageAltText(gallery, selectedIndex)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-r ${categoryStyle.gradient}`} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />
          
          {/* Badges */}
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex gap-2">
            <span className="px-3 py-1 sm:px-4 sm:py-1.5 bg-white shadow-xl rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-900">
              {gallery.category.replace(/_/g, ' ')}
            </span>
            <span className="px-3 py-1 sm:px-4 sm:py-1.5 bg-slate-900 text-white rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest flex items-center gap-1">
              <IoSparkles className="text-amber-400 text-xs sm:text-sm" /> {gallery.year}
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 bg-white">
          <div className="max-w-2xl mx-auto space-y-5 sm:space-y-8">
            
            {/* Title Section */}
            <section className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r ${categoryStyle.gradient}`}>
                  <CategoryIcon className="text-white text-lg sm:text-2xl" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight">
                    {gallery.title}
                  </h2>
                  <p className="text-slate-600 text-sm sm:text-base md:text-lg">{gallery.category.replace(/_/g, ' ')} Collection</p>
                </div>
              </div>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-y-2 sm:gap-y-3 gap-x-3 sm:gap-x-6 text-xs sm:text-sm font-semibold text-slate-500">
                <div className="flex items-center gap-1 sm:gap-2">
                  <IoCalendarClearOutline className="text-blue-500 text-sm sm:text-lg" />
                  {new Date(gallery.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <IoPersonOutline className="text-emerald-500 text-sm sm:text-lg" />
                  {gallery.files?.length || 0} files
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <IoLocationOutline className="text-rose-500 text-sm sm:text-lg" />
                  Matungulu Girls, Machakos
                </div>
              </div>
            </section>

            {/* Tabs */}
            <div className="border-b border-slate-200">
              <div className="flex gap-4 sm:gap-8">
                {['preview', 'files', 'info'].map((tab) => (
                  <button
                    key={tab}
                    className={`pb-2 sm:pb-3 font-bold text-xs sm:text-sm border-b-2 transition-colors ${
                      activeTab === tab 
                        ? 'border-purple-500 text-purple-600' 
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'preview' && <FiEye className="inline mr-1 sm:mr-2 text-sm" />}
                    {tab === 'files' && <FiImage className="inline mr-1 sm:mr-2 text-sm" />}
                    {tab === 'info' && <FiInfo className="inline mr-1 sm:mr-2 text-sm" />}
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {tab === 'files' && ` (${gallery.files?.length || 0})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'preview' && (
              <section className="space-y-3 sm:space-y-4">
                <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-400">Gallery Preview</h3>
                {gallery.files && gallery.files.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-6 max-h-[50vh] overflow-y-auto pr-1">
                    {gallery.files.map((file, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedIndex(index)}
                        className={`aspect-square rounded-lg sm:rounded-xl overflow-hidden cursor-pointer border-2 ${
                          selectedIndex === index ? 'border-purple-500' : 'border-transparent'
                        }`}
                      >
                        {isVideoFile(file) ? (
                          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                            <FiVideo className="text-white text-lg sm:text-xl" />
                          </div>
                        ) : (
                          <img src={file} alt={getImageAltText(gallery, index)} className="w-full h-full object-cover" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-slate-700 leading-snug sm:leading-relaxed text-sm sm:text-base md:text-lg break-words">
                  {gallery.description || 'No description available.'}
                </div>
              </section>
            )}

            {activeTab === 'files' && (
              <section className="space-y-3 sm:space-y-4">
                <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-400">All Files</h3>
                <div className="space-y-2 sm:space-y-3">
                  {gallery.files?.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 sm:gap-4 p-2 sm:p-4 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-100">
                      <div className="p-1.5 sm:p-2 bg-white rounded-lg">
                        {isVideoFile(file) ? <FiVideo className="text-purple-600 text-sm sm:text-base" /> : <FiImage className="text-emerald-600 text-sm sm:text-base" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-slate-900 truncate">{file.split('/').pop()}</p>
                        <p className="text-[10px] sm:text-xs text-slate-500">{isVideoFile(file) ? 'Video File' : 'Image File'}</p>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <button onClick={() => { setSelectedIndex(index); setActiveTab('preview'); }} className="px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-purple-600 hover:bg-purple-50 rounded-lg">View</button>
                        <button onClick={async () => {
                          const link = document.createElement('a');
                          link.href = file;
                          link.download = file.split('/').pop() || `file_${index + 1}`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          toast.success('Download started');
                        }} className="px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg">Download</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'info' && (
              <section className="space-y-4 sm:space-y-6">
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-400">Gallery Information</h3>
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <div className="p-2 sm:p-4 bg-slate-50 rounded-lg sm:rounded-xl border border-slate-100">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-0.5 sm:mb-1">Category</h4>
                      <p className="text-slate-700 text-xs sm:text-sm">{gallery.category.replace(/_/g, ' ')}</p>
                    </div>
                    <div className="p-2 sm:p-4 bg-slate-50 rounded-lg sm:rounded-xl border border-slate-100">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-0.5 sm:mb-1">Year</h4>
                      <p className="text-slate-700 text-xs sm:text-sm">{gallery.year}</p>
                    </div>
                    <div className="p-2 sm:p-4 bg-slate-50 rounded-lg sm:rounded-xl border border-slate-100">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-0.5 sm:mb-1">Total Files</h4>
                      <p className="text-slate-700 text-xs sm:text-sm">{gallery.files?.length || 0}</p>
                    </div>
                    <div className="p-2 sm:p-4 bg-slate-50 rounded-lg sm:rounded-xl border border-slate-100">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-0.5 sm:mb-1">Date Added</h4>
                      <p className="text-slate-700 text-xs sm:text-sm">{new Date(gallery.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-400">File Types</h3>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500"></div>
                      <span className="text-xs sm:text-sm text-slate-600">Images: {gallery.files?.filter(f => isImageFile(f)).length || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-purple-500"></div>
                      <span className="text-xs sm:text-sm text-slate-600">Videos: {gallery.files?.filter(f => isVideoFile(f)).length || 0}</span>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="shrink-0 p-3 sm:p-4 md:p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100/50">
          <div className="max-w-2xl mx-auto flex items-center gap-3 sm:gap-4">
            <button
              onClick={downloadAllFiles}
              disabled={!gallery.files || gallery.files.length === 0 || downloading}
              className={`flex-[2.5] relative group h-12 sm:h-16 bg-[#2D1B14] overflow-hidden rounded-2xl sm:rounded-[24px] shadow-lg shadow-stone-200 active:scale-[0.98] transition-all duration-300 ${(!gallery.files || gallery.files.length === 0 || downloading) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="relative flex items-center justify-center gap-2 sm:gap-3 px-4 text-white">
                <div className="p-1.5 sm:p-2 bg-white/10 rounded-lg sm:rounded-xl">
                  <FiDownload className="text-base sm:text-xl text-amber-300" />
                </div>
                <span className="text-[10px] sm:text-sm font-black uppercase tracking-[0.15em] truncate">
                  {downloading ? 'Downloading...' : 'Download All'}
                </span>
              </div>
            </button>

            <button
              onClick={() => onShare(gallery)}
              className="flex-1 h-12 sm:h-16 bg-amber-50 border-2 border-amber-100 text-[#2D1B14] rounded-2xl sm:rounded-[24px] font-black active:scale-95 transition-all duration-300 shadow-sm flex items-center justify-center gap-2 group hover:bg-amber-100"
            >
              <IoShareOutline className="text-lg sm:text-xl group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline text-xs uppercase tracking-widest font-black">Share</span>
            </button>

            <button onClick={onClose} className="sm:hidden flex items-center justify-center w-12 h-12 bg-slate-100 rounded-2xl text-slate-500 active:bg-slate-200">
              <IoClose size={22} />
            </button>
          </div>
          <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mt-4 sm:hidden opacity-50" />
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
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
    { id: 'all', name: 'All Galleries', icon: FiGlobe, gradient: 'from-slate-500 to-slate-600' },
    { id: 'GENERAL', name: 'General', icon: FiGlobe, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'CLASSROOMS', name: 'Classrooms', icon: FiBookOpen, gradient: 'from-emerald-500 to-green-500' },
    { id: 'TEACHING', name: 'Teaching', icon: FiBook, gradient: 'from-purple-500 to-pink-500' },
    { id: 'LABORATORIES', name: 'Laboratories', icon: FiTarget, gradient: 'from-indigo-500 to-purple-500' },
    { id: 'SPORTS_DAY', name: 'Sports Day', icon: FiAward, gradient: 'from-amber-500 to-orange-500' },
    { id: 'GRADUATION', name: 'Graduation', icon: FiAward, gradient: 'from-rose-500 to-red-500' }
  ];

  const [stats, setStats] = useState([
    { icon: FiImage, number: '0', label: 'Media Files', sublabel: 'Total files', gradient: 'from-blue-500 to-cyan-500' },
    { icon: FiFolder, number: '0', label: 'Galleries', sublabel: 'Collections', gradient: 'from-emerald-500 to-green-500' },
    { icon: FiGrid, number: '0', label: 'Categories', sublabel: 'Available', gradient: 'from-purple-500 to-pink-500' },
    { icon: FiCalendar, number: new Date().getFullYear().toString(), label: 'Latest', sublabel: 'This year', gradient: 'from-amber-500 to-orange-500' }
  ]);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const response = await fetch('/api/gallery');
        const data = await response.json();
        if (data.success && data.galleries) {
          setGalleries(data.galleries);
          const uniqueCategories = [...new Set(data.galleries.map(g => g?.category).filter(Boolean))];
          const totalFiles = data.galleries.reduce((acc, gallery) => acc + (gallery?.files?.length || 0), 0);
          setStats([
            { icon: FiImage, number: totalFiles.toString(), label: 'Media Files', sublabel: 'Total files', gradient: 'from-blue-500 to-cyan-500' },
            { icon: FiFolder, number: data.galleries.length.toString(), label: 'Galleries', sublabel: 'Collections', gradient: 'from-emerald-500 to-green-500' },
            { icon: FiGrid, number: uniqueCategories.length.toString(), label: 'Categories', sublabel: 'Available', gradient: 'from-purple-500 to-pink-500' },
            { icon: FiCalendar, number: new Date().getFullYear().toString(), label: 'Latest', sublabel: 'This year', gradient: 'from-amber-500 to-orange-500' }
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
    galleries.forEach(gallery => { if (gallery?.createdAt) yearSet.add(new Date(gallery.createdAt).getFullYear()); });
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [galleries]);

  const filteredGalleries = useMemo(() => {
    let filtered = transformedGalleries.filter(gallery => {
      const matchesCategory = activeCategory === 'all' || gallery.category === activeCategory;
      const matchesYear = selectedYear === 'all' || gallery.year.toString() === selectedYear;
      const matchesSearch = searchTerm === '' || 
        gallery.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (gallery.description && gallery.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        gallery.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesYear && matchesSearch;
    });
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    return filtered;
  }, [activeCategory, searchTerm, selectedYear, transformedGalleries]);

  const handleFavorite = (gallery) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(gallery.id)) { newFavorites.delete(gallery.id); toast.success('Removed from favorites'); }
    else { newFavorites.add(gallery.id); toast.success('Added to favorites'); }
    setFavorites(newFavorites);
  };

  const handleShare = (gallery) => { setGalleryToShare(gallery); setShareModalOpen(true); };

  const refreshData = async () => { setRefreshing(true); setTimeout(() => { window.location.reload(); toast.success('Gallery refreshed!'); }, 1000); };

  const gallerySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Matungulu Girls Senior School Gallery",
    "description": "Official photo and video gallery of Matungulu Girls Senior School in Matungulu, Machakos County, Kenya",
    "url": "https://kinyui-senior.vercel.app/pages/gallery",
    "isPartOf": { "@type": "School", "name": "Matungulu Girls Senior School" },
    "about": { "@type": "EducationalOrganization", "name": "Matungulu Girls Senior School", "address": { "@type": "PostalAddress", "addressLocality": "Matungulu", "addressRegion": "Machakos County", "addressCountry": "KE" } }
  };

  if (loading) {
    return (
      <Box className="min-h-[70vh] flex items-center justify-center p-4 bg-transparent">
        <Stack spacing={2} alignItems="center" className="w-full transition-all duration-500">
          <Box className="relative flex items-center justify-center scale-90 sm:scale-110">
            <CircularProgress variant="determinate" value={100} size={48} thickness={4.5} sx={{ color: '#f1f5f9' }} />
            <CircularProgress variant="indeterminate" disableShrink size={48} thickness={4.5} sx={{ color: '#0f172a', animationDuration: '1000ms', position: 'absolute', '& .MuiCircularProgress-circle': { strokeLinecap: 'round' } }} />
            <Box className="absolute"><IoSparkles className="text-purple-600 text-sm animate-pulse" /></Box>
          </Box>
          <div className="text-center px-4">
            <p className="text-slate-900 font-medium text-sm sm:text-base tracking-tight italic">Loading school galleries...</p>
            <p className="text-slate-400 text-[10px] sm:text-xs uppercase tracking-widest mt-1 font-bold">Matungulu Girls Senior School</p>
          </div>
        </Stack>
      </Box>
    );
  }

  return (
    <>
      <Head><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }} /></Head>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 p-4 md:p-6">
        <Toaster position="top-right" richColors />
        <div className="md:w-[85%] w-full  mx-auto space-y-6">
{/* ========== MODERN HERO BANNER - Matungulu Girls Gallery ========== */}
<div className="relative mx-auto overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl w-full md:w-[90%] lg:w-[85%] xl:w-[80%]">
  <div className="relative bg-gradient-to-br from-[#064e3b] via-[#0f5b4c] to-[#115e59] p-6 sm:p-10 overflow-hidden">
    
    {/* Animated Background Elements */}
    <div className="absolute top-0 left-1/4 w-64 h-64 bg-emerald-400/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
    <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-teal-400/15 rounded-full blur-[120px] animate-pulse animation-delay-2000 pointer-events-none" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />
    
    {/* Subtle Grid Pattern */}
    <div className="absolute inset-0 opacity-[0.03]" style={{ 
      backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
      backgroundSize: '40px 40px'
    }} />
    
    {/* Shine Effect Overlay */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full" style={{ transform: 'skewX(-20deg)' }} />
    
    <div className="relative z-10">
      <div className="flex flex-col gap-6">
        
        {/* Top Section with Logo Integration */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 w-fit">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <span className="text-[8px] font-black text-white">MG</span>
            </div>
            <span className="text-white/80 font-bold text-[10px] uppercase tracking-[0.15em]">Matungulu Girls</span>
          </div>
          
          {/* Quick Stats Badge */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-white/60">📸</span>
                </div>
              ))}
            </div>
            <span className="text-white/50 text-[9px] font-bold uppercase tracking-wider">Moments Archive</span>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="space-y-5">
          {/* Title with Gradient */}
          <div className="max-w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
              <span className="text-white">Matungulu Girls</span>
              <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-300 to-emerald-400">
                {" "}Visual Chronicles
              </span>
            </h1>
            
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full mt-4 mb-5" />
            
            <p className="text-emerald-50/80 text-sm sm:text-base font-medium leading-relaxed max-w-2xl">
              Explore our rich collection of moments — from classrooms and labs to sports days, 
              graduations, and everyday school life at Matungulu Girls Senior School.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            {/* Primary Refresh Button */}
            <button 
              onClick={refreshData} 
              disabled={refreshing} 
              className="group relative overflow-hidden flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-[#0f5b4c] font-black text-sm shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 disabled:opacity-50"
            >
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-emerald-100 to-transparent" />
              {refreshing ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0f5b4c]/20 border-t-[#0f5b4c] rounded-full animate-spin" />
                  <span>Updating Gallery...</span>
                </>
              ) : (
                <>
                  <FiRotateCw className="text-sm group-hover:rotate-180 transition-transform duration-500" />
                  <span>Refresh Gallery</span>
                </>
              )}
            </button>
            
            {/* View Toggle - Modern Design */}
            <div className="flex bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/20">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-bold text-xs ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <FiGrid size={16} />
                <span className="hidden sm:inline">Grid View</span>
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-bold text-xs ${
                  viewMode === 'list' 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <FiList size={16} />
                <span className="hidden sm:inline">List View</span>
              </button>
            </div>
            
            {/* Stats Badge */}
            <div className="flex items-center gap-2 ml-auto">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] font-bold text-white/60 uppercase tracking-wider">Live Gallery</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Bottom Line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
      </div>
    </div>
  </div>
</div>

{/* Add this to your global CSS or component for animation delay */}
<style jsx>{`
  .animation-delay-2000 {
    animation-delay: 2s;
  }
`}</style>

          {/* ========== STATS CARDS ========== */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-10">
            {stats.map((stat, index) => <ModernStatCard key={index} stat={stat} />)}
          </div>

          {/* ========== MAIN CONTENT LAYOUT ========== */}
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Column: Galleries Feed */}
            <div className="flex-1 min-w-0 space-y-4 sm:space-y-8">
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 px-1">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-purple-900 rounded-xl sm:rounded-2xl shadow-lg shrink-0"><FiImage className="text-white text-lg sm:text-2xl" /></div>
                  <div><h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">School Galleries</h2><p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">{filteredGalleries.length} Galleries • {stats[0].number} Images</p></div>
                </div>
              </div>

              {/* Search & Filter Bar - Glass Morphism */}
              <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 p-2 sm:p-3 rounded-2xl sm:rounded-[28px] shadow-lg shadow-slate-200/40">
                <div className="flex flex-col md:flex-row items-center gap-2 sm:gap-3">
                  <div className="relative w-full flex-1 group">
                    <div className="relative flex items-center bg-white border border-slate-200 rounded-xl sm:rounded-2xl shadow-sm transition-all focus-within:border-slate-900 focus-within:ring-2 focus-within:ring-slate-900/5">
                      <div className="pl-3 sm:pl-4 pr-2 sm:pr-3 flex items-center justify-center pointer-events-none"><FiSearch className="text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} /></div>
                      <input type="text" placeholder="Search galleries by title, description, or category..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full py-3 sm:py-4 bg-transparent text-slate-900 placeholder:text-slate-400 font-medium sm:font-semibold text-sm focus:outline-none" />
                      {searchTerm && (<button onClick={() => setSearchTerm('')} className="pr-2 flex items-center gap-1 sm:gap-2"><div className="p-1.5 sm:p-2 bg-slate-100 text-slate-900 rounded-lg sm:rounded-xl"><FiX className="w-3.5 h-3.5" /></div></button>)}
                    </div>
                  </div>
                  <div className="flex items-center w-full md:w-auto gap-2 sm:gap-3 border-t border-slate-100 md:border-t-0 md:border-l md:border-slate-100 pt-2 sm:pt-3 md:pt-0 md:pl-3">
                    <div className="relative flex-1 md:flex-none min-w-0">
                      <select value={activeCategory} onChange={(e) => setActiveCategory(e.target.value)} className="w-full md:w-40 appearance-none px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 md:bg-transparent border-none rounded-xl sm:rounded-2xl md:rounded-full font-medium text-slate-600 text-xs sm:text-sm cursor-pointer focus:ring-2 focus:ring-purple-500/20 transition-all">
                        {categoryOptions.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                      </select>
                      <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg></div>
                    </div>
                    <div className="relative flex-1 md:flex-none min-w-0">
                      <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="w-full md:w-32 appearance-none px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 md:bg-transparent border-none rounded-xl sm:rounded-2xl md:rounded-full font-medium text-slate-600 text-xs sm:text-sm cursor-pointer focus:ring-2 focus:ring-purple-500/20 transition-all">
                        <option value="all">All Years</option>{years.map(year => <option key={year} value={year}>{year}</option>)}
                      </select>
                      <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg></div>
                    </div>
                    <button onClick={() => { setSearchTerm(''); setActiveCategory('all'); setSelectedYear('all'); }} className="p-2.5 sm:p-3 md:px-6 md:py-3 bg-purple-600 text-white rounded-xl sm:rounded-2xl md:rounded-full font-bold text-xs sm:text-sm shadow-md shadow-purple-200 hover:bg-purple-700 active:scale-95 transition-all flex items-center justify-center gap-1.5 flex-shrink-0"><FiFilter className="w-3.5 h-3.5" /><span className="hidden md:inline">Reset</span><span className="md:hidden text-[10px] font-bold">Clear</span></button>
                  </div>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-2 px-2">
                {categoryOptions.map((category) => {
                  const Icon = category.icon;
                  const isActive = activeCategory === category.id;
                  return (<button key={category.id} onClick={() => setActiveCategory(category.id)} className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full whitespace-nowrap text-[11px] sm:text-sm font-bold transition-all border ${isActive ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-100" : "bg-white border-slate-200 text-slate-600"}`}><Icon className={`${isActive ? "text-white" : "text-slate-400"} text-xs sm:text-base`} /><span>{category.name}</span></button>);
                })}
              </div>

              {/* Galleries Grid/List */}
              <div className="relative">
                {filteredGalleries.length === 0 ? (
                  <div className="bg-slate-50 rounded-[24px] sm:rounded-[32px] border-2 border-dashed border-slate-200 py-8 sm:py-16 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm"><FiImage className="text-slate-300 text-xl sm:text-2xl" /></div>
                    <h3 className="text-lg font-bold text-slate-900">No galleries found</h3>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1 mb-4">Try adjusting your filters or search terms.</p>
                    <button onClick={() => { setSearchTerm(''); setActiveCategory('all'); setSelectedYear('all'); }} className="px-4 sm:px-6 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-full font-bold text-slate-700 hover:bg-slate-50 transition-all text-xs sm:text-sm">Reset Filters</button>
                  </div>
                ) : (
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6' : 'space-y-3 sm:space-y-4'}>
                    {filteredGalleries.map((gallery, index) => (<ModernGalleryCard key={gallery.id || index} gallery={gallery} onView={setSelectedGallery} onFavorite={handleFavorite} onShare={handleShare} viewMode={viewMode} />))}
                  </div>
                )}
              </div>
            </div>

         {/* Right Column: Sidebar */}
<div className="lg:w-[380px] space-y-6">
  <div className="lg:sticky lg:top-24 space-y-6">

    {/* Year Info Banner */}
    <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-emerald-50 rounded-xl">
          <FiCalendar className="text-emerald-600" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900">Gallery Years</h4>
          <p className="text-xs text-slate-500">Browse by year</p>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-emerald-50/30 rounded-xl border border-emerald-100">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span className="text-sm font-medium text-slate-700">All Years</span>
          </div>
          <span className="text-xs font-bold text-emerald-600">{transformedGalleries.length}</span>
        </div>
        {years.slice(0, 3).map(year => (
          <div key={year} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-emerald-50/20 transition-colors duration-200">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-medium text-slate-700">{year}</span>
            </div>
            <span className="text-xs font-bold text-emerald-600">{transformedGalleries.filter(g => g.year === year).length}</span>
          </div>
        ))}
      </div>
    </div>

    {/* About Our Gallery - Matungulu Girls Description */}
    <div className="bg-gradient-to-br from-white to-emerald-50/20 rounded-[32px] p-6 border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-md">
          <FiCamera className="text-white text-lg" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900">About Our Gallery</h4>
          <p className="text-[10px] font-black uppercase tracking-wider text-emerald-600">Matungulu Girls</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <p className="text-slate-700 text-sm leading-relaxed font-medium">
          Welcome to the official <span className="font-black text-emerald-700">Matungulu Girls Senior School</span> photo gallery. 
          A visual journey through our school's vibrant life in Matungulu, Machakos County.
        </p>
        
        <div className="relative pl-3 border-l-2 border-emerald-300">
          <p className="text-slate-600 text-sm leading-relaxed italic">
            "From spirited sports days and proud graduation ceremonies to everyday classroom 
            moments and hands-on laboratory sessions — these photos capture the heart of what 
            makes Matungulu Girls special."
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="flex items-center gap-2 p-2 bg-emerald-50/50 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Academic Excellence</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-teal-50/50 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-teal-500"></div>
            <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">Discipline</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-emerald-50/50 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Community</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-teal-50/50 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-teal-500"></div>
            <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">Excellence</span>
          </div>
        </div>
        
        <p className="text-slate-600 text-sm leading-relaxed pt-2 border-t border-emerald-100 mt-2">
          Browse through our collections, download your favourite memories, and share them with 
          family and friends. <span className="font-bold text-emerald-700">Every image tells a story.</span>
        </p>
        
        {/* Decorative Quote Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-[8px] font-black text-emerald-600">MG</span>
            </div>
            <span className="text-[9px] font-black text-emerald-600/60 uppercase tracking-wider">Est. 2024</span>
          </div>
          <div className="text-[9px] font-bold text-emerald-500">Committed to Excellence</div>
        </div>
      </div>
    </div>
  </div>
</div>
          </div>

        </div>

        {/* Modals */}
        {selectedGallery && !shareModalOpen && (<ModernGalleryDetailModal gallery={selectedGallery} onClose={() => setSelectedGallery(null)} onShare={handleShare} />)}
        {shareModalOpen && galleryToShare && (<ModernShareModal gallery={galleryToShare} onClose={() => { setShareModalOpen(false); setGalleryToShare(null); }} />)}
      </div>
    </>
  );
}