"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, ChevronRight, ArrowRight, 
  Trophy, BookOpen, MapPin, 
  Play, X, School, Users, Award, Calendar, Star, Sparkles
} from 'lucide-react';
import { GiGraduateCap, GiTrophyCup } from 'react-icons/gi';
import { useRouter } from 'next/navigation';

// ============================================================
// FRESH, DISTINCT COLOR PALETTE – CORAL/teal ACCENT
// ============================================================
const accentColors = {
  primary: {
    text: "text-teal-400",
    bg: "bg-gradient-to-r from-emerald-600 to-teal-500",
    border: "border-emerald-500/40",
    glow: "shadow-emerald-500/20",
    ring: "ring-emerald-500/30",
    gradient: "from-emerald-600 to-teal-500",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
};



// ============================================================
// SLIDE DATA – FOCUSED ON GENERAL SCHOOL INFO
// ============================================================
const heroSlides = [
  {
    title: "Matungulu",
    titleAccent: "Girls",
    subtitle: "Excellence in the Heart of Machakos",
    description: "A premier public girls' boarding Senior school in Matungulu sub-county, Machakos County. Established in 1955, we empower young women through a holistic education rooted in academic excellence, character formation, and leadership.",
    image: "/hero/MatG1.jpg",
    mobileImage: "/hero/MatG1_mobile.jpg",
    tags: ["Public School", "Girls' Boarding", "National School", "CBC Curriculum"],
    cta: "Apply Now",
    link: "/pages/admissions",
  },
  {
    title: "Academic",
    titleAccent: "Prowess",
    subtitle: "KCSE 2025 & Beyond",
    description: "Ranked among the top schools in Machakos County, we achieved a mean score of 8.14 (B plain) with 84% university transition rate. Our STEM, Humanities, and Creative Arts pathways prepare students for global success.",
    image: "/Matungulu/9.jpeg",
    tags: ["Mean 8.14", "84% Uni Transition", "STEM Focus", "Career Guidance"],
    cta: "Explore Academics",
    link: "/pages/Admission",
  },
  {
    title: "Holistic",
    titleAccent: "Growth",
    subtitle: "Beyond the Classroom",
    description: "National Science Fair winners, award‑winning sports teams, vibrant music and drama clubs, and leadership programs. We nurture confident, compassionate, and accomplished young women.",
    image: "/Matungulu/29.jpeg",
    tags: ["Science Fair Winner", "Sports & Arts", "Leadership", "Empowerment"],
    cta: "Our History",
    link: "/pages/About Us",
  }
];

// Helper: extract YouTube ID
const extractYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url?.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function ModernHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [schoolData, setSchoolData] = useState(null);
  const [schoolStats, setSchoolStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [navigationBlocked, setNavigationBlocked] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState({});

  const router = useRouter();

  // Detect mobile and handle resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch school stats from API
  useEffect(() => {
    const fetchSchoolStats = async () => {
      try {
        const response = await fetch('/api/school-stats');
        const result = await response.json();
        
        if (result.success && result.stats) {
          setSchoolStats(result.stats);
        } else {
          // Fallback stats if API returns nothing
          setSchoolStats({
            meanScore: 8.14,
            lastYearMean: 7.85,
            targetMean: 8.50,
            studentCount: 1400,
            established: 1955,
            category: "National School",
            motto: "Strive to Excel"
          });
        }
      } catch (error) {
        console.error('Error fetching school stats:', error);
        // Fallback stats on error
        setSchoolStats({
          meanScore: 8.14,
          lastYearMean: 7.85,
          targetMean: 8.50,
          studentCount: 1400,
          established: 1955,
          category: "National School",
          motto: "Strive to Excel"
        });
      } finally {
        setStatsLoading(false);
      }
    };

    fetchSchoolStats();
  }, []);

  // Preload images and block navigation for 2 sec
  useEffect(() => {
    const timer = setTimeout(() => setNavigationBlocked(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Progress bar for slide auto‑transition
  useEffect(() => {
    if (showVideoModal) return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 100 : prev + 100 / 80));
    }, 100);
    return () => clearInterval(interval);
  }, [currentSlide, showVideoModal]);

  const handleSlideChange = useCallback((index) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 500);
  }, []);

  const nextSlide = useCallback(() => {
    handleSlideChange(currentSlide === heroSlides.length - 1 ? 0 : currentSlide + 1);
  }, [currentSlide, handleSlideChange]);

  const prevSlide = useCallback(() => {
    handleSlideChange(currentSlide === 0 ? heroSlides.length - 1 : currentSlide - 1);
  }, [currentSlide, handleSlideChange]);

  useEffect(() => {
    if (showVideoModal) return;
    const timer = setInterval(() => nextSlide(), 8000);
    return () => clearInterval(timer);
  }, [currentSlide, nextSlide, showVideoModal]);

  const openVideoModal = () => setShowVideoModal(true);
  const closeVideoModal = () => {
    setShowVideoModal(false);
    setSchoolData(null);
    setError(null);
  };

  const handleSlideButtonClick = () => {
    if (navigationBlocked) return;
    router.push(heroSlides[currentSlide].link);
  };

  const handleContactClick = () => {
    closeVideoModal();
    if (navigationBlocked) return;
    router.push('/pages/AboutUs');
  };

  // Fetch school video data when modal opens
  useEffect(() => {
    if (showVideoModal) {
      setLoading(true);
      setError(null);
      fetch('/school')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.school) {
            setSchoolData(data.school);
          } else throw new Error('No video data found');
        })
        .catch(err => {
          console.error(err);
          setError(err.message);
        })
        .finally(() => setLoading(false));
    }
  }, [showVideoModal]);

  const retryVideoLoad = () => {
    setLoading(true);
    setError(null);
    fetch('/school')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.school) setSchoolData(data.school);
        else throw new Error('No video data');
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  const slide = heroSlides[currentSlide];
  const colors = accentColors.primary;

  // Helper to format stats with fallback values
  const getStatValue = (key, fallback) => {
    if (!statsLoading && schoolStats && schoolStats[key]) {
      return schoolStats[key];
    }
    return fallback;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 font-sans">
      {/* ========== BACKGROUND IMAGES – RESPONSIVE WITH OBJECT-FIT ========== */}
      {heroSlides.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-all duration-[1200ms] ease-out ${
            idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
          }`}
        >
          <img
            src={s.image}
            alt={s.title}
            className="w-full h-full object-cover object-center md:object-center"
            style={{
              objectPosition: isMobile ? 'center 30%' : 'center',
            }}
            onLoad={() => setImagesLoaded(prev => ({ ...prev, [idx]: true }))}
          />
        </div>
      ))}

      {/* Overlay – softer gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

      {/* Decorative abstract shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      {/* Left accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-500 to-teal-500 z-30" />

      {/* ========== MAIN CONTENT ========== */}
      <div className={`relative z-20 h-full flex flex-col justify-center px-6 sm:px-10 md:px-20 transition-all duration-500 ${
        isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
      }`}>
        
        {/* Top badge with location */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 w-fit mb-6">
          <MapPin className="w-3.5 h-3.5 text-teal-400" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-white/90">
            {slide.subtitle}
          </span>
        </div>

        {/* Title with prominent accent color */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
          <span className="text-white">{slide.title} </span>
          <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
            {slide.titleAccent}
          </span>
        </h1>

        {/* Description */}
        <p className="text-sm font-semibold sm:text-lg text-white max-w-2xl mt-6 leading-relaxed">
          {isMobile && slide.description.length > 200 
            ? slide.description.substring(0, 200) + '...' 
            : slide.description}
        </p>

        {/* Tags row */}
        <div className="flex flex-wrap gap-3 mt-8">
          {slide.tags.map((tag, i) => (
            <span
              key={i}
              className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-full 
                bg-white/5 border border-white/10 text-white/80 backdrop-blur-sm
                hover:bg-white/10 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

{/* Action buttons Container */}
<div className="mt-10 max-w-xl">
  
  {/* 1. Dynamic Stats Grid - Moved ABOVE the buttons so it doesn't push them apart */}
  {currentSlide === 1 && !statsLoading && schoolStats && (
    <div className="grid grid-cols-2 gap-3 text-white mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10">
        <p className="text-[10px] uppercase tracking-wider text-white/50">Mean Score</p>
        <p className="text-base font-black text-white">
          {schoolStats.meanScore?.toFixed(2)} <span className="text-[10px] font-normal text-emerald-400">(B)</span>
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10">
        <p className="text-[10px] uppercase tracking-wider text-white/50">Transition</p>
        <p className="text-base font-black text-white">
          {schoolStats.transitionRate || "84%"}
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10">
        <p className="text-[10px] uppercase tracking-wider text-white/50">Last Year</p>
        <p className="text-base font-black text-white">
          {schoolStats.lastYearMean?.toFixed(2)}
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10">
        <p className="text-[10px] uppercase tracking-wider text-white/50">Target</p>
        <p className="text-base font-black text-white">
          {schoolStats.targetMean?.toFixed(2)}
        </p>
      </div>
    </div>
  )}

  {/* 2. The Actual Buttons - Now they stay side-by-side */}
  <div className="flex flex-row items-center gap-4">
    <button
      onClick={handleSlideButtonClick}
      disabled={navigationBlocked}
      className="group relative px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 
        text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20
        hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300
        flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
    >
      {slide.cta}
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </button>

    <button
      onClick={openVideoModal}
      className="group flex items-center gap-2 px-6 py-3 rounded-xl border border-white/30 
        text-white font-semibold text-sm backdrop-blur-sm bg-white/5
        hover:bg-white/10 hover:border-white/50 transition-all whitespace-nowrap"
    >
      <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
      {isMobile ? 'Tour' : 'Watch Tour'}
    </button>
  </div>
</div>

{/* Floating stats card (desktop only) – shows key metrics from API */}
{!isMobile && (
  <div
  className="absolute 
  right-4 sm:right-6 md:right-10 lg:right-16 xl:right-[10%]
  top-1/2 -translate-y-1/2
  w-[85vw] sm:w-[24rem] md:w-[26rem] lg:w-[28rem] xl:w-[30rem]
  max-w-[92vw]
  bg-transparent
  p-4 sm:p-5 md:p-6
  space-y-3 sm:space-y-4
  rounded-2xl"
>
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center">
        <GiGraduateCap className="w-6 h-6 text-white" />
      </div>

      <div>
        <h3 className="text-white font-black text-2xl">Matungulu Girls</h3>
        <p className="text-white font-semibold text-md">Senior School</p>
      </div>
    </div>

    {statsLoading ? (
      <div className="space-y-3">
        <div className="h-12 bg-white/10 rounded-lg animate-pulse" />
        <div className="h-12 bg-white/10 rounded-lg animate-pulse" />
        <div className="h-12 bg-white/10 rounded-lg animate-pulse" />
      </div>
    ) : (
      <>
        <div className="space-y-4 text-base">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <span className="text-white font-semibold text-md">Established</span>
            <span className="text-white font-bold text-md">
              {getStatValue('established', 1955)}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <span className="text-white font-semibold text-md">Category</span>
            <span className="text-white font-bold text-lg">
              {getStatValue('category', 'National School')}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <span className="text-white font-semibold text-md">Enrollment</span>
            <span className="text-white font-bold text-md">
              {getStatValue('studentCount', 1400)}+ Girls
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <span className="text-white font-semibold text-md">Motto</span>
            <span className="text-white font-bold italic text-base">
              "{getStatValue('motto', 'Strive to Excel')}"
            </span>
          </div>

          <div className="flex justify-between items-center">
          <span className="text-white font-semibold text-md">
            KCSE {date.getFullYear() - 1} Mean
          </span>            <span className="text-white font-black text-md">
              {getStatValue('meanScore', 8.14).toFixed(2)} (B plain)
            </span>
          </div>
        </div>

        {/* Performance indicators */}
        {(schoolStats?.lastYearMean || schoolStats?.targetMean) && (
          <div className="mt-5 pt-4 border-t border-white/10">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-white font-medium">Last Year</span>
              <span className="text-white font-bold">
                {schoolStats?.lastYearMean?.toFixed(2) || '7.85'}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-white font-medium">Target</span>
              <span className="text-white font-black">
                {schoolStats?.targetMean?.toFixed(2) || '8.50'}
              </span>
            </div>
          </div>
        )}
      </>
    )}

    <button
      onClick={openVideoModal}
      className="w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-xl 
      bg-white/10 hover:bg-white/20 transition-colors text-white text-sm font-black uppercase tracking-wider"
    >
      <Play className="w-4 h-4" /> Take a Tour
    </button>
  </div>
)}
      </div>

      {/* ========== SLIDE CONTROLS ========== */}
      <div className={`absolute z-30 flex gap-3 ${isMobile ? 'bottom-24 right-5' : 'bottom-8 right-8'}`}>
        <button
          onClick={prevSlide}
          className="w-10 h-10 rounded-full border border-white/20 text-white backdrop-blur-sm bg-white/5 hover:bg-white/20 transition-all flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="w-10 h-10 rounded-full border border-white/20 text-white backdrop-blur-sm bg-white/5 hover:bg-white/20 transition-all flex items-center justify-center"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-1 bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Bottom info strip */}
      <div className="absolute bottom-3 left-0 right-0 z-20 px-6 sm:px-10 md:px-20">
        <div className="flex items-center justify-between text-white/40 text-[10px] font-medium uppercase tracking-wider">
          <div className="flex gap-6">
            <span className="flex items-center gap-1"><School className="w-3 h-3" /> Matungulu Girls</span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Machakos County</span>
          </div>
          <div className="flex gap-4">
            <span className="hidden sm:flex items-center gap-1"><Trophy className="w-3 h-3" /> National School</span>
            <span>{String(currentSlide + 1).padStart(2, '0')}/{String(heroSlides.length).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-in fade-in duration-300">
          <div className="relative w-full max-w-5xl mx-auto animate-in zoom-in-95 duration-300">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black">
              {/* Modal Header */}
              <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center">
                <div className="flex items-center gap-3 bg-black/50 backdrop-blur-md rounded-full pl-3 pr-5 py-1.5 border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-white" />
                  </div>
                  <span className="text-white text-sm font-semibold">School Tour</span>
                </div>
                <button
                  onClick={closeVideoModal}
                  className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Player */}
              {loading ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div className="w-12 h-12 border-3 border-white/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
                  <p className="text-white/70 text-sm">Loading tour...</p>
                </div>
              ) : error ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                    <X className="w-8 h-8 text-red-400" />
                  </div>
                  <p className="text-white mb-4">{error}</p>
                  <button
                    onClick={retryVideoLoad}
                    className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-full text-sm font-semibold"
                  >
                    Retry
                  </button>
                </div>
              ) : schoolData?.videoType === 'youtube' && schoolData?.videoTour ? (
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(schoolData.videoTour)}?autoplay=1&rel=0&modestbranding=1`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : schoolData?.videoType === 'file' && schoolData?.videoTour ? (
                <video
                  src={schoolData.videoTour}
                  className="w-full h-full object-cover"
                  autoPlay
                  controls
                  poster={schoolData?.videoThumbnail}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <Play className="w-16 h-16 text-white/30 mb-4" />
                  <p className="text-white/60">No tour video available yet</p>
                </div>
              )}

              {/* Modal Footer */}
              <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-4">
                <button
                  onClick={handleContactClick}
                  className="w-full sm:w-auto ml-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all"
                >
                  Learn More About Matungulu
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation blocker overlay */}
      {navigationBlocked && (
        <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center">
          <div className="bg-black/50 backdrop-blur-sm text-white/90 text-xs px-4 py-2 rounded-full">
            Loading experience...
          </div>
        </div>
      )}
    </div>
  );
}