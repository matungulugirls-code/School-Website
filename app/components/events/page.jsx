'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  FiCalendar, FiClock, FiMapPin, FiShare2, FiArrowRight,
  FiBookOpen, FiUser, FiHeart, FiChevronRight, FiX,
  FiCheckCircle, FiRefreshCw, FiExternalLink, FiAward,
  FiBriefcase, FiGlobe, FiStar, FiTrendingUp
} from 'react-icons/fi';
import { FaFacebookF, FaTwitter, FaWhatsapp, FaGraduationCap, FaChalkboardTeacher, FaMicrophoneAlt } from 'react-icons/fa';
import { IoNewspaperOutline, IoSchoolOutline } from 'react-icons/io5';
import { GiBookshelf, GiTeacher, GiTrophyCup, GiDramaMasks } from 'react-icons/gi';

const CATEGORY_STYLES = {
  academic:       { accent: 'bg-blue-500',    light: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-200', icon: FaGraduationCap },
  sports:         { accent: 'bg-emerald-500', light: 'bg-emerald-50',  text: 'text-emerald-600',  border: 'border-emerald-200', icon: GiTrophyCup },
  cultural:       { accent: 'bg-purple-500',  light: 'bg-purple-50',   text: 'text-purple-600',   border: 'border-purple-200', icon: GiDramaMasks },
  science:        { accent: 'bg-cyan-500',    light: 'bg-cyan-50',     text: 'text-cyan-600',     border: 'border-cyan-200', icon: GiBookshelf },
  training:       { accent: 'bg-amber-500',   light: 'bg-amber-50',    text: 'text-amber-600',    border: 'border-amber-200', icon: FiBriefcase },
  guidance:       { accent: 'bg-teal-500',    light: 'bg-teal-50',     text: 'text-teal-600',     border: 'border-teal-200', icon: FaMicrophoneAlt },
  achievement:    { accent: 'bg-green-500',   light: 'bg-green-50',    text: 'text-green-600',    border: 'border-green-200', icon: FiAward },
  infrastructure: { accent: 'bg-orange-500',  light: 'bg-orange-50',   text: 'text-orange-600',   border: 'border-orange-200', icon: IoSchoolOutline },
};

const getColors = (cat) => CATEGORY_STYLES[cat?.toLowerCase()] || CATEGORY_STYLES.academic;

const fmtDate = (str) => {
  try {
    const d = new Date(str);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    return {
      day: d.getDate(), month: months[d.getMonth()], weekday: days[d.getDay()],
      full: `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`,
      time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      iso: d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
    };
  } catch {
    return { day: '--', month: '---', weekday: '---', full: 'Date unavailable', time: '', iso: '' };
  }
};

// ─── Image with fallback ────────────────────────────────────

const FallbackImage = ({ src, alt, className, fallbackIcon }) => {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={`${className} bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center`}>
        {fallbackIcon || <FiCalendar className="text-white/30 w-10 h-10 sm:w-14 sm:h-14" />}
      </div>
    );
  }
  return <img src={src} alt={alt} className={`${className} object-cover`} onError={() => setFailed(true)} />;
};

// ─── Main Component ─────────────────────────────────────────

const ModernEventsNewsSection = () => {
  const [tab, setTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);
  const [activeEvent, setActiveEvent] = useState(0);
  const [activeNews, setActiveNews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareModal, setShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch data from API only
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [evRes, nwRes] = await Promise.all([
          fetch('/api/events').then(r => r.json()),
          fetch('/api/news').then(r => r.json()),
        ]);
        if (!mounted) return;
        if (evRes.success && Array.isArray(evRes.events)) {
          setEvents(evRes.events.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4));
        }
        if (nwRes.success && Array.isArray(nwRes.data)) {
          setNews(nwRes.data.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4));
        }
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const featured = tab === 'events' ? events[activeEvent] : news[activeNews];
  const list = tab === 'events' ? events : news;
  const activeIdx = tab === 'events' ? activeEvent : activeNews;
  const setActiveIdx = tab === 'events' ? setActiveEvent : setActiveNews;
  const SHARE_URL = typeof window !== 'undefined' ? `${window.location.origin}/pages/eventsandnews` : 'https://matungulu-girls.vercel.app/eventsandnews';

  const shareLinks = (title) => ({
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`Check out "${title}" from Matungulu Girls: ${SHARE_URL}`)}`,
    twitter:  `https://twitter.com/intent/tweet?text=${encodeURIComponent(`📚 ${title} - Matungulu Girls High School`)}&url=${encodeURIComponent(SHARE_URL)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL)}`,
    email:    `mailto:?subject=${encodeURIComponent(`Matungulu Girls: ${title}`)}&body=${encodeURIComponent(`Read more about "${title}"\n\n${SHARE_URL}`)}`,
  });

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(SHARE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [SHARE_URL]);

  if (loading) {
    return (
      <section className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-[500px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center mb-10">
            <div className="h-7 w-48 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-lg animate-pulse mx-auto mb-3" />
            <div className="h-5 w-64 bg-gray-200 rounded-md animate-pulse mx-auto" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 rounded-2xl overflow-hidden bg-white shadow-xl">
              <div className="h-56 sm:h-72 bg-gradient-to-r from-gray-200 to-gray-100 animate-pulse" />
              <div className="p-5 sm:p-7 space-y-4">
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
            <div className="space-y-4">
              {[0, 1, 2].map(i => (
                <div key={i} className="bg-white rounded-xl shadow-md p-4 flex gap-3">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-r from-gray-200 to-gray-100 animate-pulse flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                    <div className="h-5 w-full bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error && events.length === 0 && news.length === 0) {
    return (
      <section className="bg-gray-50 min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center bg-white rounded-2xl border border-gray-100 shadow-lg p-8 sm:p-12">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-50 flex items-center justify-center">
            <FiX className="w-7 h-7 text-red-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">Content Unavailable</h2>
          <p className="text-gray-500 text-sm sm:text-base mb-6 leading-relaxed">
            We couldn&apos;t load the latest updates. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-bold text-sm rounded-xl hover:bg-black transition-colors active:scale-[0.97]"
          >
            <FiRefreshCw className="w-4 h-4" /> Refresh
          </button>
          <p className="mt-6 text-xs text-gray-400 flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            {error}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">

        {/* Header with Matungulu Branding */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-full border border-emerald-200 shadow-sm mb-4">
            <span className="text-lg">🏫</span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-emerald-700">Matungulu Girls High School</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight mb-2 sm:mb-3">
            Eagles' <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Updates</span>
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
            Celebrating excellence, empowerment, and achievement at Matungulu Girls
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8 sm:mb-10">
          <div className="inline-flex p-1 bg-white rounded-xl border border-gray-200 shadow-md">
            {[
              { key: 'events', label: 'Upcoming Events', count: events.length, icon: <FiCalendar className="w-3.5 h-3.5" /> },
              { key: 'news', label: 'Latest News', count: news.length, icon: <IoNewspaperOutline className="w-3.5 h-3.5" /> },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  tab === t.key
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
                <span className={`ml-0.5 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  tab === t.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}>{t.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">

          {/* Featured Card */}
          <div className="lg:col-span-2">
            {featured ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                {/* Image */}
                <div className="relative aspect-[16/9] sm:aspect-[2/1] overflow-hidden">
                  <FallbackImage
                    src={featured.image}
                    alt={featured.title}
                    className="absolute inset-0 w-full h-full transition-transform duration-700 hover:scale-105"
                    fallbackIcon={
                      tab === 'events'
                        ? <FiCalendar className="text-white/30 w-12 h-12" />
                        : <IoNewspaperOutline className="text-white/30 w-12 h-12" />
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Category badge with icon */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className={`px-3 py-1 ${getColors(featured.category).accent} text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1`}>
                      {React.createElement(getColors(featured.category).icon, { className: "w-3 h-3" })}
                      {featured.category}
                    </span>
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-white leading-tight mb-2">
                      {featured.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-white/80 text-xs sm:text-sm">
                      {tab === 'events' ? (
                        <>
                          <span className="flex items-center gap-1"><FiCalendar className="w-3 h-3" /> {fmtDate(featured.date).full}</span>
                          <span className="hidden sm:block w-1 h-1 bg-white/40 rounded-full" />
                          <span className="flex items-center gap-1"><FiClock className="w-3 h-3" /> {featured.time || fmtDate(featured.date).time}</span>
                          <span className="hidden sm:block w-1 h-1 bg-white/40 rounded-full" />
                          <span className="flex items-center gap-1"><FiMapPin className="w-3 h-3" /> {featured.location}</span>
                        </>
                      ) : (
                        <>
                          <span className="flex items-center gap-1"><FiUser className="w-3 h-3" /> {featured.author || 'School Admin'}</span>
                          <span className="hidden sm:block w-1 h-1 bg-white/40 rounded-full" />
                          <span className="flex items-center gap-1"><FiCalendar className="w-3 h-3" /> {fmtDate(featured.date).full}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-6 lg:p-7">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-5 sm:gap-6">
                    {/* Description */}
                    <div className="md:col-span-3">
                      <h4 className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-2 sm:mb-3 flex items-center gap-1.5">
                        <FiBookOpen className="text-emerald-500 w-3.5 h-3.5" />
                        {tab === 'events' ? 'Event Details' : 'Article Summary'}
                      </h4>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        {tab === 'events'
                          ? (featured.description || 'No description available.')
                          : (featured.excerpt || featured.fullContent || 'No content available.')}
                      </p>

                      {tab === 'events' && featured.speaker && (
                        <div className="mt-4 p-3 sm:p-4 bg-emerald-50/60 border-l-4 border-emerald-500 rounded-r-xl">
                          <p className="text-gray-700 text-sm"><span className="font-bold">Guest Speaker:</span> {featured.speaker}</p>
                        </div>
                      )}
                    </div>

                    {/* Info sidebar */}
                    <div className="md:col-span-2">
                      <h4 className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-2 sm:mb-3 flex items-center gap-1.5">
                        <FiClock className="text-teal-500 w-3.5 h-3.5" />
                        {tab === 'events' ? 'Quick Info' : 'Article Info'}
                      </h4>

                      <div className="space-y-2.5">
                        {tab === 'events' ? (
                          <>
                            <InfoRow label="Date" value={fmtDate(featured.date).full} />
                            <InfoRow label="Time" value={featured.time || fmtDate(featured.date).time} />
                            <InfoRow label="Location" value={featured.location} />
                            {featured.type && <InfoRow label="Type" value={featured.type} />}
                            {featured.speaker && <InfoRow label="Speaker(s)" value={featured.speaker} />}
                          </>
                        ) : (
                          <>
                            <InfoRow label="Published" value={fmtDate(featured.date).full} />
                            <InfoRow label="Author" value={featured.author || 'School Admin'} />
                            <InfoRow label="Category" value={featured.category} />
                          </>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="mt-5 pt-4 border-t border-gray-100 flex flex-row flex-wrap items-center gap-2 sm:gap-3">
                        {tab === 'events' ? (
                          <>
                            <button
                              onClick={() => {
                                const dt = fmtDate(featured.date);
                                window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(featured.title)}&dates=${dt.iso}/${dt.iso}&details=${encodeURIComponent(featured.description || '')}&location=${encodeURIComponent(featured.location || '')}`, '_blank');
                              }}
                              className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:shadow-lg transition-all active:scale-[0.97]"
                            >
                              <FiCalendar className="w-3.5 h-3.5" /> Add to Cal
                            </button>
                            <button
                              onClick={() => setShareModal(true)}
                              className="flex-1 min-w-[100px] flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs sm:text-sm font-bold hover:bg-gray-50 transition-colors active:scale-[0.97]"
                            >
                              <FiShare2 className="w-3.5 h-3.5" /> Share
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-3 flex-1 flex-wrap">
                              <button className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors text-sm">
                                <FiHeart className="w-4 h-4" /> <span className="font-bold">{featured.likes || 0}</span>
                              </button>
                              <button onClick={() => setShareModal(true)} className="flex items-center gap-1 text-gray-400 hover:text-emerald-500 transition-colors text-sm">
                                <FiShare2 className="w-4 h-4" /> <span className="font-bold">Share</span>
                              </button>
                            </div>
                            <button
                              onClick={() => window.location.href = '/pages/eventsandnews'}
                              className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:shadow-lg transition-all"
                            >
                              Read Full <FiArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyFeatured type={tab} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-3 sm:space-y-4">
            {list.length > 0 ? (
              <>
                {list.map((item, idx) => {
                  const c = getColors(item.category);
                  const selected = activeIdx === idx;
                  return (
                    <button
                      key={item.id || idx}
                      onClick={() => setActiveIdx(idx)}
                      className={`w-full text-left group bg-white rounded-xl border-2 p-3 sm:p-4 transition-all duration-200 ${
                        selected
                          ? 'border-emerald-500 shadow-xl shadow-emerald-500/10'
                          : 'border-transparent hover:border-gray-200 shadow-md hover:shadow-lg'
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Thumbnail */}
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <FallbackImage
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full"
                            fallbackIcon={<FiCalendar className="text-white/40 w-5 h-5" />}
                          />
                          {selected && (
                            <div className="absolute inset-0 bg-emerald-500/30 flex items-center justify-center">
                              <FiCheckCircle className="text-white w-4 h-4 drop-shadow" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Category + date */}
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 ${c.accent} text-white text-[8px] sm:text-[9px] font-bold uppercase tracking-wider rounded flex items-center gap-1`}>
                              {React.createElement(c.icon, { className: "w-2 h-2" })}
                              {item.category}
                            </span>
                            <span className="text-gray-400 text-[10px] sm:text-xs">{fmtDate(item.date).month} {fmtDate(item.date).day}</span>
                          </div>

                          {/* Title */}
                          <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-2 group-hover:text-emerald-600 transition-colors">
                            {item.title}
                          </h3>

                          {/* Meta */}
                          <p className="text-gray-400 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                            {tab === 'events' ? (
                              <><FiMapPin className="w-2.5 h-2.5" /> {item.location || 'TBD'}</>
                            ) : (
                              <><FiUser className="w-2.5 h-2.5" /> {item.author || 'Admin'}</>
                            )}
                          </p>
                        </div>

                        <FiChevronRight className={`w-4 h-4 flex-shrink-0 mt-1 transition-all ${
                          selected ? 'text-emerald-500' : 'text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5'
                        }`} />
                      </div>
                    </button>
                  );
                })}

                {/* Stats card */}
                <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-800 rounded-xl p-4 sm:p-5 text-white shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
                      <GiTeacher className="text-white text-sm" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">Matungulu Girls</p>
                      <p className="text-lg font-black">{events.length + news.length} Updates</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-100">📅 Upcoming Events</span>
                      <span className="font-bold text-white">{events.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-100">📰 News Articles</span>
                      <span className="font-bold text-white">{news.length}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/20">
                    <p className="text-[10px] text-emerald-200 text-center">"Strive to Excel"</p>
                  </div>
                </div>
              </>
            ) : (
              <SidebarSkeleton />
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {shareModal && featured && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setShareModal(false)}>
          <div className="bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl p-5 sm:p-6 shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                Share {tab === 'events' ? 'Event' : 'Article'}
              </h3>
              <button onClick={() => setShareModal(false)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-5">
              {[
                { key: 'whatsapp', icon: FaWhatsapp, bg: 'bg-green-50 text-green-600 hover:bg-green-100' },
                { key: 'twitter', icon: FaTwitter, bg: 'bg-sky-50 text-sky-600 hover:bg-sky-100' },
                { key: 'facebook', icon: FaFacebookF, bg: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
                { key: 'email', icon: FiShare2, bg: 'bg-gray-50 text-gray-600 hover:bg-gray-100' },
              ].map(s => {
                const Icon = s.icon;
                const links = shareLinks(featured.title);
                return (
                  <button
                    key={s.key}
                    onClick={() => {
                      if (s.key === 'email') window.location.href = links[s.key];
                      else window.open(links[s.key], '_blank');
                    }}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors ${s.bg}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] font-bold capitalize">{s.key}</span>
                  </button>
                );
              })}
            </div>

            {/* Copy link */}
            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
              <p className="flex-1 text-xs text-gray-500 font-mono truncate">
                {SHARE_URL}
              </p>
              <button
                onClick={handleCopy}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all active:scale-[0.95] ${
                  copied ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-900 text-white hover:bg-black'
                }`}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// ─── Sub-components ─────────────────────────────────────────

const InfoRow = ({ label, value }) => (
  <div className="flex items-start gap-2 text-sm">
    <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
    <span className="text-gray-600"><span className="font-bold text-gray-800">{label}:</span> {value}</span>
  </div>
);

const EmptyFeatured = ({ type }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-xl flex flex-col items-center justify-center py-20 px-6 text-center">
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-100 to-teal-100 flex items-center justify-center mb-5">
      {type === 'events' ? <FiCalendar className="w-7 h-7 text-emerald-600" /> : <IoNewspaperOutline className="w-7 h-7 text-emerald-600" />}
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-1">No {type === 'events' ? 'Events' : 'News'} Yet</h3>
    <p className="text-gray-500 text-sm">Check back soon for updates from Matungulu Girls</p>
  </div>
);

const SidebarSkeleton = () => (
  <div className="space-y-3">
    {[0, 1, 2].map(i => (
      <div key={i} className="bg-white rounded-xl shadow-md p-4 flex gap-3">
        <div className="w-14 h-14 rounded-lg bg-gradient-to-r from-gray-200 to-gray-100 animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

export default ModernEventsNewsSection;