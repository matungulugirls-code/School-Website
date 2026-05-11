'use client';

import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FiArrowLeft,
  FiBookOpen,
  FiCalendar,
  FiChevronRight,
  FiExternalLink,
  FiGlobe,
  FiGrid,
  FiImage,
  FiLayers,
  FiMapPin,
  FiMonitor,
  FiSearch,
  FiShield,
  FiUserCheck,
  FiUsers,
  FiX,
  FiStar,
  FiTrendingUp,
  FiClock,
  FiAward,
  FiBriefcase,
  FiHome,
  FiMail,
  FiPhone,
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiLinkedin,
  FiGithub,
  FiCodepen,
  FiDribbble,
  FiBehance,
  FiFigma,
  FiSlack,
  FiDiscord,
  FiTwitch,
  FiTiktok,
  FiSnapchat,
  FiPinterest,
  FiReddit,
  FiMedium,
  FiBookmark,
  FiShare2,
  FiThumbsUp,
  FiMessageCircle,
  FiSend,
  FiMoreVertical,
  FiCopy,
  FiDownload,
  FiCloud,
  FiCloudLightning,
  FiCloudRain,
  FiCloudSnow,
  FiSun,
  FiMoon,
  FiWind,
  FiCompass,
  FiAnchor,
  FiArchive,
  FiBarChart,
  FiBattery,
  FiBell,
  FiBluetooth,
  FiBox,
  FiBriefcase as FiBriefcaseIcon,
  FiCamera,
  FiCast,
  FiHeart,
  FiChrome,
  FiCircle,
  FiClipboard,
  FiClock as FiClockIcon,
  FiCoffee,
  FiCompass as FiCompassIcon,
  FiAlertTriangle,
} from 'react-icons/fi';
import { 
  FaGraduationCap, 
  FaHome, 
  FaSchool, 
  FaBook, 
  FaChalkboardTeacher, 
  FaUsers as FaUsersIcon,
  FaRobot,
  FaBrain,
  FaMicrochip,
  FaRocket,
  FaGem,
  FaCrown,
  FaMedal,
  FaTrophy,
  FaUniversity,
  FaLandmark,
  FaTree,
  FaSeedling,
  FaHandsHelping,
  FaChild,
  FaApple,
  FaAndroid,
  FaWindows,
  FaLinux,
  FaCode,
  FaDatabase,
  FaCloud,
  FaLock,
  FaShieldAlt,
  FaDragon,
  FaFeather,
  FaFire,
  FaWater,
  FaEarth,
  FaWind as FaWindIcon,
  FaSun as FaSunIcon,
  FaMoon as FaMoonIcon,
  FaStar,
  FaInfinity,
  FaPeace,
  FaDove,
  FaOwl,
  FaWolf,
  FaEagle,
} from 'react-icons/fa';
import { normalizeSchoolImages } from './image-upload-field';

// ============= ENHANCED ICONS CONFIGURATION =============
const ICONS = {
  CLUB: FiUsers,
  SOCIETY: FaGraduationCap,
  STUDENT_COUNCIL: FiUserCheck,
  COMPUTER_LAB: FiMonitor,
  BOARDING: FaHome,
  SECURITY: FiShield,
  DEPARTMENT: FiLayers,
  SPORTS: FiAward,
  ARTS: FiHeart,
  SCIENCE: FiBookOpen,
  TECHNOLOGY: FiMonitor,
  LEADERSHIP: FiStar,
};

// ============= SIMPLE THEME CONFIGURATIONS (NO BORDERS/SHADOWS) =============
const TYPE_THEMES = {
  CLUB: { 
    bg: 'bg-purple-50', 
    text: 'text-purple-700', 
    iconBg: 'bg-purple-600',
  },
  SOCIETY: { 
    bg: 'bg-indigo-50', 
    text: 'text-indigo-700', 
    iconBg: 'bg-indigo-600',
  },
  STUDENT_COUNCIL: { 
    bg: 'bg-fuchsia-50', 
    text: 'text-fuchsia-700', 
    iconBg: 'bg-fuchsia-600',
  },
  COMPUTER_LAB: { 
    bg: 'bg-sky-50', 
    text: 'text-sky-700', 
    iconBg: 'bg-sky-600',
  },
  BOARDING: { 
    bg: 'bg-amber-50', 
    text: 'text-amber-700', 
    iconBg: 'bg-amber-600',
  },
  SECURITY: { 
    bg: 'bg-rose-50', 
    text: 'text-rose-700', 
    iconBg: 'bg-rose-600',
  },
  DEPARTMENT: { 
    bg: 'bg-cyan-50', 
    text: 'text-cyan-700', 
    iconBg: 'bg-cyan-600',
  },
};

// ============= MATUNGULU GIRLS SCHOOL INFORMATION =============
const KATWANYAA_INFO = {
  name: 'Matungulu Girls Senior School',
  shortName: 'MatG',
  motto: 'Committed to Excellence',
  vision: 'To nurture confident, disciplined, and high-achieving young women through modern education.',
  mission: 'To provide a supportive school environment where academics, leadership, and talent grow together.',
  location: 'Machakos County, Kenya',
  email: 'office@matungulugirls.ac.ke',
  phone: '+254 700 000 000',
  website: 'www.matungulugirls.ac.ke',
  colors: ['Emerald Green', 'Gold', 'Deep Slate'],
  mascot: 'MatG Scholars',
  achievements: [
    'Strong KCSE and internal assessment performance',
    'Growing academic and co-curricular programs',
    'Expanding digital learning support',
    'Student-centered leadership culture',
  ],
  description: `Matungulu Girls Senior School is a modern learning community focused on academic strength, student welfare, and visible growth across school life. 
    The school hub brings together departments, clubs, facilities, and programs in one organized experience so families and students can quickly understand what is active inside the school.`
};

// ============= UTILITY FUNCTIONS =============
const getTypeLabel = (type) => {
  const labels = {
    CLUB: 'Club', SOCIETY: 'Society', STUDENT_COUNCIL: 'Student Council',
    COMPUTER_LAB: 'Computer Lab', BOARDING: 'Boarding', SECURITY: 'Security',
    DEPARTMENT: 'Department', SPORTS: 'Sports', ARTS: 'Arts', SCIENCE: 'Science',
    TECHNOLOGY: 'Technology', LEADERSHIP: 'Leadership'
  };
  return labels[type] || 'School Hub';
};

const getDepartmentCategoryLabel = (category) => {
  const labels = {
    CBC: 'CBC Department', EIGHT_FOUR_FOUR: '8-4-4 Department',
    TEACHING: 'Teaching Department', SUPPORT: 'Support Department'
  };
  return labels[category] || 'Department';
};

const buildDepartmentItem = (dept) => ({
  ...dept,
  type: 'DEPARTMENT',
  title: dept.name,
  shortDescription: dept.description,
  description: dept.description,
  contactName: dept.headName,
  details: [
    { title: 'Category', content: getDepartmentCategoryLabel(dept.category) },
    { title: 'Staffing', content: `${Number(dept.staffCount) || 0} staff members` },
  ].filter((item) => item.content),
});

const getSocialLinks = (item) => {
  let social = item?.socialMedia || {};
  if (typeof social === 'string') {
    try { social = JSON.parse(social); } catch { social = {}; }
  }
  if (!social || typeof social !== 'object' || Array.isArray(social)) return [];
  return Object.entries(social).filter(([, value]) => typeof value === 'string' && value.trim()).map(([label, href]) => ({ label, href: href.trim() }));
};

// ============= SIMPLE COMPONENTS (NO BORDERS/SHADOWS) =============

// Simple Info Pill Component
const InfoPill = ({ icon: Icon, children, variant = "default" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    primary: "bg-emerald-100 text-emerald-700",
    secondary: "bg-indigo-100 text-indigo-700",
  };
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-2 text-xs font-medium ${variants[variant]}`}>
      <Icon className="text-sm" />
      {children}
    </span>
  );
};

// Simple Spinner Component
const Spinner = ({ size = "md", color = "gray" }) => {
  const sizeClasses = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-6 h-6" };
  const colorClasses = { gray: "border-gray-600", white: "border-white" };
  return (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 ${colorClasses[color]} border-t-transparent`} />
  );
};

// Modern Loading Spinner (simplified)
const ModernLoadingSpinner = ({ message = "Loading amazing content..." }) => (
  <div className="flex flex-col items-center justify-center py-20">
    <Spinner size="lg" color="gray" />
    <p className="mt-6 text-sm font-medium text-gray-600">{message}</p>
    <div className="flex gap-1 mt-3">
      {[0, 1, 2].map(i => (
        <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-800 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  </div>
);

// Simple Refresh Button
const RefreshButton = ({ refreshing, onClick }) => (
  <button
    onClick={onClick}
    disabled={refreshing}
    className="inline-flex items-center justify-center gap-2 bg-blue-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 active:scale-95 disabled:opacity-60"
  >
    {refreshing ? (
      <>
        <Spinner size="sm" color="white" />
        <span>Updating...</span>
      </>
    ) : (
      <>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Refresh
      </>
    )}
  </button>
);

// Gallery Modal Component (simplified, no borders/shadows)
const GalleryModal = ({ item, onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => { setSelectedIndex(0); }, [item?.id, item?.type]);
  if (!item) return null;

  const images = normalizeSchoolImages(item);
  const selectedImage = images[selectedIndex]?.url;
  const Icon = ICONS[item.type] || FiLayers;
  const theme = TYPE_THEMES[item.type] || TYPE_THEMES.DEPARTMENT;
  const socialLinks = getSocialLinks(item);

  const handlePrev = () => {
    setIsAnimating(true);
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleNext = () => {
    setIsAnimating(true);
    setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white bg-opacity-95 p-4" onClick={onClose}>
      <div className="relative flex h-full w-full max-w-7xl flex-col overflow-hidden bg-white" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button onClick={onClose} className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center bg-gray-200 text-gray-600 hover:bg-gray-300">
          <FiX className="text-lg" />
        </button>

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1.4fr_0.9fr]">
          {/* Image Gallery Section */}
          <div className="relative bg-gray-50">
            <div className="relative h-[400px] sm:h-[500px]">
              <img 
                src={selectedImage} 
                alt={item.title} 
                className={`h-full w-full object-contain transition-all duration-300 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}
              />
              {!selectedImage && (
                <div className={`flex h-full w-full items-center justify-center bg-gray-100`}>
                  <Icon className="text-6xl text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center bg-gray-200 text-gray-700 hover:bg-gray-300">
                  <FiChevronRight className="rotate-180 text-xl" />
                </button>
                <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center bg-gray-200 text-gray-700 hover:bg-gray-300">
                  <FiChevronRight className="text-xl" />
                </button>
              </>
            )}
            
            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 bg-opacity-80 px-4 py-1.5 text-xs font-medium text-white">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>

          {/* Info Section */}
          <div className="flex min-h-0 flex-col bg-white">
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-medium uppercase tracking-wider ${theme.bg} ${theme.text}`}>
                  <Icon className="text-xs" /> {getTypeLabel(item.type)}
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                  <FiShare2 />
                </button>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900">{item.title}</h2>
              {item.description && (
                <p className="mt-2 text-sm font-medium leading-6 text-gray-600">{item.description}</p>
              )}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5 space-y-4">
              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gray-50">
                  <p className="text-lg font-bold text-gray-900">{images.length}</p>
                  <p className="text-xs font-medium text-gray-500">Photos</p>
                </div>
                <div className="text-center p-3 bg-gray-50">
                  <p className="text-lg font-bold text-gray-900">{item.details?.length || 0}</p>
                  <p className="text-xs font-medium text-gray-500">Details</p>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-2">All Photos</p>
                  <div className="grid grid-cols-4 gap-2">
                    {images.slice(0, 8).map((image, index) => (
                      <button
                        key={image.url}
                        onClick={() => setSelectedIndex(index)}
                        className={`relative aspect-square overflow-hidden ${
                          selectedIndex === index ? 'ring-2 ring-emerald-500' : ''
                        }`}
                      >
                        <img src={image.url} alt={image.altText || `${item.title} ${index + 1}`} className="h-full w-full object-cover" />
                        {index === 7 && images.length > 8 && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 text-white text-xs font-medium">
                            +{images.length - 8}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Location & Info */}
              {(item.location || item.established || item.website) && (
                <div className="flex flex-wrap gap-2">
                  {item.location && <InfoPill icon={FiMapPin}>{item.location}</InfoPill>}
                  {item.established && <InfoPill icon={FiCalendar}>{item.established}</InfoPill>}
                  {item.website && (
                    <a href={item.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-200">
                      <FiGlobe /> Website <FiExternalLink className="text-[10px]" />
                    </a>
                  )}
                </div>
              )}

              {/* Contact Info */}
              {item.contactName && (
                <div className="bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-2">Contact Person</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${theme.iconBg} flex items-center justify-center text-white`}>
                      <FiUserCheck />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.contactName}</p>
                      {item.contactEmail && <p className="text-xs text-gray-500">{item.contactEmail}</p>}
                      {item.contactPhone && <p className="text-xs text-gray-500">{item.contactPhone}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="bg-white p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-2">Connect With Us</p>
                  <div className="flex flex-wrap gap-2">
                    {socialLinks.map((link) => (
                      <a key={`${link.label}-${link.href}`} href={link.href} target="_blank" rel="noopener noreferrer" className={`px-3 py-1.5 text-xs font-medium capitalize ${theme.bg} ${theme.text}`}>
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Details Sections */}
              {Array.isArray(item.details) && item.details.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Additional Information</p>
                  {item.details.map((detail, index) => (
                    <div key={`${detail?.title || 'detail'}-${index}`} className="bg-white p-4">
                      <p className="text-sm font-medium text-gray-900">{detail?.title || `Detail ${index + 1}`}</p>
                      {detail?.content && <p className="mt-2 text-sm font-medium leading-6 text-gray-600">{detail.content}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Footer */}
            <div className="bg-gray-50 p-4 flex gap-2">
              <button onClick={onClose} className="flex-1 bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800">
                Close
              </button>
              <button className="bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100">
                <FiExternalLink /> Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hub Card Component (no borders/shadows)
const HubCard = ({ item, onView }) => {
  const images = normalizeSchoolImages(item);
  const image = images[0]?.url;
  const Icon = ICONS[item.type] || FiLayers;
  const theme = TYPE_THEMES[item.type] || TYPE_THEMES.DEPARTMENT;
  const detailCount = Array.isArray(item.details) ? item.details.length : 0;

  return (
    <button
      onClick={onView}
      className="group w-full overflow-hidden rounded-[28px] border border-slate-200 bg-white text-left shadow-[0_18px_50px_-32px_rgba(15,23,42,0.32)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_24px_60px_-28px_rgba(15,23,42,0.38)]"
    >
      <div className="relative h-40 w-full bg-slate-100">
        {image ? (
          <>
            <img src={image} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07111b]/58 via-transparent to-transparent" />
          </>
        ) : (
          <div className={`flex h-full w-full items-center justify-center ${theme.bg}`}>
            <Icon className="text-3xl text-gray-600" />
          </div>
        )}
        
        <div className="absolute left-3 top-3">
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${theme.bg} ${theme.text}`}>
            <Icon className="text-xs" /> {getTypeLabel(item.type)}
          </span>
        </div>
        
        <div className="absolute bottom-3 right-3 rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-black text-slate-800 backdrop-blur-sm">
          {images.length} photos
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-base font-black leading-tight text-gray-900 line-clamp-1">
          {item.title}
        </h3>
        
        {item.shortDescription && (
          <p className="mt-2 text-sm leading-6 text-gray-600 line-clamp-2">
            {item.shortDescription}
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          {detailCount > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
              <FiLayers className="text-xs" /> {detailCount} details
            </span>
          )}
          {item.location && (
            <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
              <FiMapPin className="text-xs" /> {item.location.length > 20 ? item.location.slice(0, 20) + '...' : item.location}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-end border-t border-slate-100 pt-3">
          <span className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-500">Explore</span>
          <span className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#0f5b4c] text-white">
            <FiChevronRight className="text-xs" />
          </span>
        </div>
      </div>
    </button>
  );
};

// Main Component
export default function PublicSchoolHubPage({
  title = "School Hub",
  eyebrow = "Matungulu Girls School Hub",
  description = "Explore school life at Matungulu Girls Senior School through departments, clubs, facilities, student activities, and public learning spaces.",
  singleType,
  sections,
  departments = false,
  emptyText = 'No information available yet.',
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [active, setActive] = useState(null);

  const load = async (isRefresh = false) => {
    try {
      setError('');
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      if (departments) {
        const res = await fetch('/api/staff/departments?grouped=1');
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || `Failed to load departments (${res.status})`);
        setItems((data.departments || []).map(buildDepartmentItem));
      } else if (Array.isArray(sections) && sections.length > 0) {
        const responses = await Promise.all(sections.map((section) => fetch(`/api/schoolhub?type=${section.type}`)));
        const payloads = await Promise.all(responses.map((res) => res.json()));
        const failed = responses.findIndex((res, index) => !res.ok || !payloads[index].success);
        if (failed >= 0) throw new Error(payloads[failed].error || `Failed to load ${sections[failed].title}`);
        const merged = payloads.flatMap((data, index) =>
          Array.isArray(data.items) ? data.items.map((item) => ({ ...item, sectionTitle: sections[index].title })) : []
        );
        setItems(merged);
      } else {
        const res = await fetch(`/api/schoolhub?type=${singleType || 'CLUB'}`);
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || `Failed to load ${title} (${res.status})`);
        setItems(Array.isArray(data.items) ? data.items : []);
      }
    } catch (e) {
      setItems([]);
      setError(e?.message || `Failed to load ${title}.`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(false); }, []);

  const visibleItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      [item.title, item.shortDescription, item.description, item.contactName, item.location, item.established, item.sectionTitle]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))
    );
  }, [items, search]);

  const renderedSections = useMemo(() => {
    if (Array.isArray(sections) && sections.length > 0) {
      return sections.map((section) => ({
        ...section,
        items: visibleItems.filter((item) => item.type === section.type),
      }));
    }
    if (departments) {
      return [
        { title: '📚 CBC Departments', type: 'DEPARTMENT', icon: FiLayers, items: visibleItems.filter((item) => item.category === 'CBC') },
        { title: '📖 8-4-4 Departments', type: 'DEPARTMENT', icon: FiBookOpen, items: visibleItems.filter((item) => item.category === 'EIGHT_FOUR_FOUR') },
        { title: '👨‍🏫 Teaching Departments', type: 'DEPARTMENT', icon: FiBookOpen, items: visibleItems.filter((item) => item.category === 'TEACHING') },
        { title: '🤝 Support Departments', type: 'DEPARTMENT', icon: FiShield, items: visibleItems.filter((item) => item.category === 'SUPPORT') },
      ];
    }
    return [{ title, type: singleType || 'CLUB', items: visibleItems }];
  }, [departments, sections, singleType, title, visibleItems]);

  const totalImages = items.reduce((sum, item) => sum + normalizeSchoolImages(item).length, 0);
  const heroType = singleType || sections?.[0]?.type || 'DEPARTMENT';
  const HeroIcon = ICONS[heroType] || FiGrid;
  const activeSectionCount = renderedSections.filter((section) => section.items.length > 0).length;

  // Features data
  const features = [
    { icon: FaGraduationCap, title: "Academic Excellence", description: "Consistently top-performing in national examinations with a 98% pass rate.", bg: "bg-emerald-100", text: "text-emerald-700" },
    { icon: FaRobot, title: "STEM Innovation", description: "State-of-the-art computer labs and robotics club for future innovators.", bg: "bg-blue-100", text: "text-blue-700" },
    { icon: FiHeart, title: "Holistic Development", description: "Over 25 clubs and societies for talents and skill development.", bg: "bg-rose-100", text: "text-rose-700" },
    { icon: FaShieldAlt, title: "Safe Environment", description: "24/7 security, CCTV surveillance, and trained counselors for student welfare.", bg: "bg-purple-100", text: "text-purple-700" },
    { icon: FaTree, title: "Green Campus", description: "Eco-friendly initiatives, gardening projects, and environmental awareness.", bg: "bg-green-100", text: "text-green-700" },
    { icon: FaHandsHelping, title: "Community Focus", description: "Strong ties with local community and outreach programs.", bg: "bg-orange-100", text: "text-orange-700" },
  ];

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_18%,#f3f7f5_100%)] text-gray-900">
      <GalleryModal item={active} onClose={() => setActive(null)} />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="relative mb-12 overflow-hidden rounded-[34px] border border-emerald-100 bg-[linear-gradient(135deg,#0d3b34_0%,#105346_46%,#d1a84c_130%)] px-5 py-6 text-white shadow-[0_35px_90px_-45px_rgba(13,59,52,0.72)] sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_24%)]" />
          <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-[#f5d37e]/20 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_320px] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-white/85 backdrop-blur-sm">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-[#f6d27a]">
                  <HeroIcon className="text-sm" />
                </span>
                {eyebrow}
              </div>

              <h1 className="mt-5 max-w-4xl text-3xl font-black leading-[1.02] text-white sm:text-4xl lg:text-6xl">
                Discover {title} across Matungulu Girls.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                {description || KATWANYAA_INFO.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {[
                  { label: 'Published Items', value: visibleItems.length },
                  { label: 'Active Sections', value: activeSectionCount },
                  { label: 'Images', value: totalImages },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/12 bg-white/10 px-4 py-3 backdrop-blur-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/55">{stat.label}</p>
                    <p className="mt-1 text-2xl font-black text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/12 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/55">Browse Hub</p>
              <div className="mt-4 flex flex-col gap-3">
                <RefreshButton refreshing={refreshing} onClick={() => load(true)} />
                <div className="relative w-full group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiSearch className="text-white/55 transition-colors group-focus-within:text-white" />
                  </div>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={`Search ${title.toLowerCase()}...`}
                    className="w-full rounded-2xl border border-white/15 bg-white/90 py-3 pl-11 pr-4 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-white focus:ring-4 focus:ring-white/10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 shadow-sm">
            <span className="flex items-center gap-2"><FiAlertTriangle /> {error}</span>
            <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
              <FiX />
            </button>
          </div>
        )}

        {loading ? (
          <ModernLoadingSpinner message={`Loading amazing ${title.toLowerCase()} content...`} />
        ) : visibleItems.length === 0 ? (
          <div className="rounded-[30px] border border-slate-200 bg-white p-12 text-center shadow-[0_25px_70px_-45px_rgba(15,23,42,0.3)]">
            <div className="mb-4 inline-flex rounded-2xl bg-slate-100 p-4">
              <FiLayers className="text-4xl text-gray-400" />
            </div>
            <h2 className="text-xl font-black text-gray-700">{emptyText}</h2>
            <p className="mt-2 text-sm text-gray-500">Check back soon for fresh updates from the school hub.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {renderedSections.map((section) => {
              if (!section.items.length) return null;
              const SectionIcon = section.icon || ICONS[section.type] || FiLayers;
              return (
                <section key={section.title}>
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0f5b4c] text-white shadow-lg shadow-emerald-900/20">
                      <SectionIcon className="text-base" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black tracking-tight text-gray-900">{section.title}</h2>
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#0f5b4c]">
                        {section.items.length} {section.items.length === 1 ? 'item' : 'items'} available
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {section.items.map((item) => (
                      <HubCard key={`${item.type}-${item.id}`} item={item} onView={() => setActive(item)} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
        
      </main>
      
      {/* Custom Animation Styles */}
      <style jsx global>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce {
          animation: bounce 0.8s infinite ease-in-out;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
