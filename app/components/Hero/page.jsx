"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, ChevronRight, ArrowRight, 
  Trophy, BookOpen, Clock, 
  Play, X, MapPin, Sparkles, GraduationCap, Users, School, Award
} from 'lucide-react';
import { GiGraduateCap } from 'react-icons/gi';
import { useRouter } from 'next/navigation';

const heroSlides = [
  {
    title: "Matungulu",
    titleAccent: "Girls",
    subtitle: "Matungulu, Machakos County",
    description: "A premier public girls' boarding Senior school in Matungulu sub-county, Machakos County. Established in 1955, the school serves the Eastern Region with excellence in STEM, Social Sciences, and Arts & Sports pathways under the CBC curriculum.",
    image: "/hero/MatG1.jpg",
    tags: ["Public School", "Girls' Boarding", "CBC Curriculum", "National School"],
    cta: "Admissions",
    link: "/pages/admissions",
    accent: "slate",
  },
  {
    title: "Academic",
    titleAccent: "Excellence",
    subtitle: "KCSE Performance",
    description: "Consistently ranked among top schools in Machakos County. In 2025, the school achieved a mean score of 8.14 (B plain) with 84% university transition rate. Specialized pathways including Pure Sciences, Humanities, and Creative Arts with career guidance programs.",
    image: "/Matungulu/9.jpeg",
    tags: ["8.14 Mean Score", "84% Uni Transition", "STEM Focus", "Career Guidance"],
    cta: "Academics",
    link: "/pages/academics",
    accent: "slate",
  },
  {
    title: "Holistic",
    titleAccent: "Development",
    subtitle: "Beyond the Classroom",
    description: "A center for holistic education with strong co-curricular programs including sports, music, drama, and leadership clubs. National Science Fair winners and a beacon for girls' empowerment in Kenya.",
    image: "/Matungulu/29.jpeg",
    tags: ["Science Fair Winner", "Sports & Arts", "Leadership", "Empowerment"],
    cta: "Student Life",
    link: "/pages/student-life",
    accent: "slate",
  }
];

const accentColors = {
  slate: { 
    text: "text-slate-300", 
    bg: "bg-slate-600", 
    border: "border-slate-600/40", 
    glow: "shadow-slate-600/20", 
    ring: "ring-slate-600/30", 
    gradient: "from-slate-700 to-slate-600" 
  },
};

const extractYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url?.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const ModernHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [schoolData, setSchoolData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [navigationBlocked, setNavigationBlocked] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [progress, setProgress] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setNavigationBlocked(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showVideoModal) return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + (100 / 80);
      });
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

  const openVideoModal = useCallback(() => setShowVideoModal(true), []);
  const closeVideoModal = useCallback(() => {
    setShowVideoModal(false);
    setSchoolData(null);
    setError(null);
  }, []);

  const handleSlideButtonClick = useCallback(() => {
    if (navigationBlocked) return;
    const link = heroSlides[currentSlide].link;
    setTimeout(() => router.push(link), 100);
  }, [currentSlide, router, navigationBlocked]);

  const handleContactClick = useCallback(() => {
    closeVideoModal();
    if (navigationBlocked) return;
    setTimeout(() => router.push('/pages/AboutUs'), 100);
  }, [closeVideoModal, router, navigationBlocked]);

  useEffect(() => {
    if (showVideoModal) {
      setLoading(true);
      setError(null);
      fetch('/api/school')
        .then(response => {
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          return response.json();
        })
        .then(data => {
          if (data.success && data.school) { setSchoolData(data.school); setError(null); }
          else throw new Error(data.message || 'No school data found');
        })
        .catch(err => { console.error('Error fetching school video:', err); setError(err.message); setSchoolData(null); })
        .finally(() => setLoading(false));
    }
  }, [showVideoModal]);

  useEffect(() => {
    if (showVideoModal) return;
    const timer = setInterval(() => nextSlide(), 8000);
    return () => clearInterval(timer);
  }, [currentSlide, nextSlide, showVideoModal]);

  const retryVideoLoad = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch('/api/school')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        if (data.success && data.school) { setSchoolData(data.school); setError(null); }
        else throw new Error(data.message || 'No school data found');
      })
      .catch(err => { console.error('Error fetching school video:', err); setError(err.message); setSchoolData(null); })
      .finally(() => setLoading(false));
  }, []);

  const slide = heroSlides[currentSlide];
  const colors = accentColors[slide.accent];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-950 font-sans">
      {/* Background Images */}
      {heroSlides.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-all duration-[1200ms] ease-in-out ${
            idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
          }`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${s.image})` }}
          />
        </div>
      ))}

      {/* Overlay with adjusted padding for content */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />

      {/* Decorative grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 md:w-1.5 ${colors.bg} z-30 transition-colors duration-700`} />

      {/* Slide number badge */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10 z-30 flex items-center gap-3">
        <span className={`text-5xl md:text-7xl font-black ${colors.text} opacity-20 leading-none select-none transition-colors duration-700`}>
          0{currentSlide + 1}
        </span>
        <div className="flex flex-col gap-1">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => handleSlideChange(i)}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === currentSlide ? `w-8 ${colors.bg}` : 'w-3 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Content — with 20% padding from both left and right */}
      <div className={`relative z-20 h-full flex flex-col justify-center px-[10%] md:px-[20%] transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        
        {/* Subtitle tag */}
        <div className="flex items-center gap-2 mb-4 md:mb-5">
          <MapPin className={`w-3.5 h-3.5 ${colors.text}`} />
          <span className={`text-xs md:text-sm uppercase tracking-[0.2em] font-semibold ${colors.text}`}>{slide.subtitle}</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-4 md:mb-6">
          {slide.title}
          <span className={`${colors.text} inline-block ml-2`}>
            {slide.titleAccent}
          </span>
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl leading-relaxed mb-5 md:mb-7">
          {isMobile ? slide.description.substring(0, 200) + '...' : slide.description}
        </p>

        {/* Tags row */}
        <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
          {slide.tags.map((tag, i) => (
            <span
              key={i}
              className={`px-3 py-1.5 text-[10px] sm:text-xs font-medium uppercase tracking-wider 
                rounded-full border ${colors.border} text-white/80 bg-white/5 backdrop-blur-sm
                transition-all duration-300 hover:bg-white/10`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={handleSlideButtonClick}
            disabled={navigationBlocked}
            className={`group relative px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r ${colors.gradient} 
              text-white rounded-lg font-bold text-sm sm:text-base
              hover:shadow-lg ${colors.glow} hover:shadow-xl
              transition-all duration-300
              flex items-center gap-2
              disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {slide.cta}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={openVideoModal}
            className="group flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5
              border border-white/20 text-white rounded-lg font-semibold text-sm sm:text-base
              hover:bg-white/10 hover:border-white/40
              backdrop-blur-sm transition-all duration-300"
          >
            <span className="relative flex items-center justify-center w-6 h-6 rounded-full bg-white/15 group-hover:bg-white/25 transition-colors">
              <Play className="w-3 h-3 ml-0.5" />
            </span>
            {isMobile ? 'Tour' : 'Virtual Tour'}
          </button>
        </div>
      </div>

      {/* Right-side info card with school details */}
      {!isMobile && (
        <div className={`absolute right-14 lg:right-24 top-1/2 -translate-y-1/2 z-20 w-72 lg:w-80 
          transition-all duration-700 ${isTransitioning ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'}`}>
          <div className="bg-white/[0.07] backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}>
                <GiGraduateCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-base">Matungulu Girls</p>
                <p className="text-gray-400 text-xs">Senior School</p>
              </div>
            </div>
            
            <div className="h-px bg-white/10" />
            
            {/* School Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <School className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-400 text-xs">Category:</span>
                <span className={`text-xs font-semibold ${colors.text}`}>National School</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-400 text-xs">Enrollment:</span>
                <span className="text-white text-xs">Girls' Boarding</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-400 text-xs">Location:</span>
                <span className="text-white text-xs">Matungulu, Machakos</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-400 text-xs">Established:</span>
                <span className="text-white text-xs">1955</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-400 text-xs">Curriculum:</span>
                <span className="text-white text-xs">CBC Pathways</span>
              </div>
            </div>
            
            <div className="h-px bg-white/10" />
            
            {/* Quick Facts */}
            <div className="bg-white/5 rounded-xl p-3 space-y-2">
              <p className="text-white/70 text-xs font-semibold">Key Achievements:</p>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <span className="text-gray-400">KCSE Mean 2025:</span>
                <span className="text-white">8.14 (B plain)</span>
                <span className="text-gray-400">Uni Transition:</span>
                <span className="text-white">84%</span>
                <span className="text-gray-400">Status:</span>
                <span className="text-white">National School</span>
              </div>
            </div>
            
            <button
              onClick={openVideoModal}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 
                text-white text-xs font-semibold transition-colors duration-300 border border-white/5"
            >
              <Play className="w-3.5 h-3.5" />
              Watch School Tour
            </button>
          </div>
        </div>
      )}

      {/* Navigation arrows */}
      <div className={`absolute z-30 flex gap-2 ${isMobile ? 'bottom-20 right-5' : 'bottom-8 right-8'}`}>
        <button 
          onClick={prevSlide}
          className="w-10 h-10 md:w-12 md:h-12 rounded-xl border border-white/15 text-white 
            hover:bg-white hover:text-black transition-all duration-300 
            backdrop-blur-sm bg-white/5 flex items-center justify-center"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        <button 
          onClick={nextSlide}
          className="w-10 h-10 md:w-12 md:h-12 rounded-xl border border-white/15 text-white 
            hover:bg-white hover:text-black transition-all duration-300 
            backdrop-blur-sm bg-white/5 flex items-center justify-center"
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>

      {/* Bottom progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-1 bg-white/5">
        <div 
          className={`h-full ${colors.bg} transition-all duration-100 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Bottom info strip */}
      <div className={`absolute bottom-1 left-0 right-0 z-20 py-2.5 px-[10%] md:px-[20%]
        flex items-center ${isMobile ? 'justify-center' : 'justify-between'}
        text-white/50 text-[10px] md:text-xs uppercase tracking-[0.15em] font-medium`}>
        {isMobile ? (
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" /> Matungulu</span>
            <span className="flex items-center gap-1"><Trophy className="w-2.5 h-2.5" /> National School</span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5"><School className="w-3 h-3" /> Matungulu Girls Senior School</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Matungulu, Machakos</span>
              <span className="flex items-center gap-1.5"><Users className="w-3 h-3" /> Girls' Boarding</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5"><BookOpen className="w-3 h-3" /> CBC Curriculum</span>
              <span className="text-white/30">
                {String(currentSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
              </span>
            </div>
          </>
        )}
      </div>

   {/* ===== MODERN CINEMATIC VIDEO MODAL ===== */}
{showVideoModal && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
    {/* Animated Backdrop */}
    <div 
      className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-500" 
      onClick={closeVideoModal}
    />

    <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-in zoom-in-95 duration-300">
      <div className="relative aspect-video rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-[0_0_100px_-20px_rgba(16,185,129,0.3)] bg-black border border-white/10">
        
        {/* Top Navigation Bar (Floating Glass) */}
        <div className="absolute top-4 sm:top-6 left-4 right-4 sm:left-6 sm:right-6 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3 backdrop-blur-md bg-black/20 border border-white/10 p-2 pr-5 rounded-2xl">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg`}>
              <FiPlay className="text-white fill-current w-4 h-4" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs sm:text-sm tracking-tight">Virtual Campus Tour</h4>
              <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest leading-none mt-1">
                Live Experience
              </p>
            </div>
          </div>

          <button
            onClick={closeVideoModal}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/10 transition-all flex items-center justify-center group"
          >
            <FiX className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Video Player Core */}
        <div className="relative w-full h-full">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
                <div className="absolute inset-0 rounded-full border-t-2 border-emerald-500 animate-spin" />
              </div>
              <p className="text-emerald-500/70 text-[10px] font-bold uppercase tracking-[0.2em] mt-6">Initializing Stream</p>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 p-8 text-center">
              <div className="w-16 h-16 rounded-3xl bg-red-500/10 flex items-center justify-center mb-6">
                <FiX className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-white font-bold mb-2">Connection Interrupted</h3>
              <p className="text-slate-400 text-sm max-w-xs mb-6">{error}</p>
              <button
                onClick={retryVideoLoad}
                className={`px-8 py-3 bg-gradient-to-r ${colors.gradient} text-white rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-lg hover:shadow-emerald-500/20 transition-all`}
              >
                Reconnect
              </button>
            </div>
          ) : schoolData?.videoType === 'youtube' && schoolData?.videoTour ? (
            <iframe
              src={`https://www.youtube.com/embed/${extractYouTubeId(schoolData.videoTour)}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3&showinfo=0`}
              className="w-full h-full scale-[1.01]" // Tiny scale hides edge artifacts
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={schoolData?.videoTour}
              className="w-full h-full object-cover"
              autoPlay
              controls
              poster={schoolData?.videoThumbnail}
            />
          )}
        </div>

        {/* Bottom Interactive Layer */}
        <div className="absolute bottom-6 left-6 right-6 z-30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                   <div className={`w-full h-full bg-gradient-to-br ${colors.gradient} opacity-50`} />
                </div>
              ))}
            </div>
            <p className="text-white/70 text-[11px] font-medium">
              Join <span className="text-white font-bold">1.2k+</span> viewers exploring our campus
            </p>
          </div>

          <button
            onClick={handleContactClick}
            disabled={navigationBlocked}
            className={`group relative overflow-hidden px-8 py-3.5 rounded-2xl bg-white text-slate-900 font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-50`}
          >
            <span className="relative z-10 flex items-center gap-2">
              {isMobile ? 'Apply Now' : 'Schedule Physical Visit'}
              <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>

        {/* Cinematic Vignette Overlay (Non-interactive) */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]" />
      </div>
    </div>
  </div>
)}

      {navigationBlocked && (
        <div className="absolute inset-0 z-40 pointer-events-none">
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 
            bg-black/60 text-white/70 text-[10px] px-3 py-1.5 rounded-full backdrop-blur-sm">
            Loading...
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernHero;