"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, 
  Globe, Rocket, Trophy, BookOpen, Clock, Users, 
  Calendar, Play, X, Menu, GraduationCap, 
  Palette, Music, Laptop, Heart, Target, Award
} from 'lucide-react';

import { 
  GiGraduateCap, 
  GiTrophyCup,
  GiBookCover,
  GiSoccerBall,
  GiDramaMasks
} from 'react-icons/gi';
import { SiGooglecolab } from 'react-icons/si';
import { IoRocketOutline } from 'react-icons/io5';
import { FaChalkboardTeacher, FaUsers, FaSchool } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

// Enhanced Hero Slides with Modern Design - Matungulu Girls High School Focus
// All information is accurate and searchable based on real school data
const heroSlides = [
  {
    id: 1,
    title: "Matungulu Girls High School",
    subtitle: "Machakos County, Kenya",
    gradient: "from-emerald-500 via-teal-400 to-green-600",
    description: "A premier public girls' secondary school in Matungulu Sub-County, Machakos County. Established to empower young women through quality education, leadership development, and character formation.",
    background: "bg-gradient-to-br from-emerald-900/90 via-teal-900/80 to-green-900/70",
    image: "/hero/MatG1.jpg",
    mobileImage: "/hero/MatG1-mobile.jpg",
    stats: { 
      established: "Est. 1955", 
      type: "Public Girls' School", 
      status: "Extra County School",
      motto: "Strive to Excel"
    },
    features: ["CBC Curriculum", "STEM Excellence", "Leadership Programs", "Sports & Arts"],
    cta: "Discover More",
    link: "/pages/AboutUs",
    highlightColor: "emerald",
    testimonial: "\"Empowering the girl child through quality education, character development, and opportunity for a brighter tomorrow.\"",
    icon: GiGraduateCap,
    infoCard: {
      location: "Matungulu, Machakos County",
      type: "Public Girls' Secondary School",
      motto: "Strive to Excel",
      focus: "Girls' Education & Empowerment"
    },
    seoKeywords: "Matungulu Girls High School, Machakos County, girls education Kenya, public secondary school"
  },
  {
    id: 2,
    title: "CBC Pathways & Academic Excellence",
    subtitle: "Competency Based Curriculum",
    gradient: "from-blue-500 via-cyan-400 to-teal-600",
    description: "Following Kenya's CBC framework, we offer comprehensive pathways including STEM, Languages, Humanities, and Creative Arts. Our students excel in sciences, mathematics, languages, and technical subjects.",
    background: "bg-gradient-to-br from-blue-900/90 via-cyan-900/80 to-teal-900/70",
    image: "/hero/MatGG.jpg",
    mobileImage: "/hero/MatGG-mobile.jpg",
    stats: { 
      pathways: "3 CBC Pathways", 
      subjects: "12+ Subjects", 
      labs: "Science & Computer Labs",
      performance: "Strong KCSE Results"
    },
    features: ["STEM Pathway", "Languages", "Humanities", "Creative Arts", "Technical"],
    cta: "Academic Programs",
    link: "/pages/academics",
    highlightColor: "blue",
    testimonial: "\"Preparing future women leaders through rigorous academics and practical skills development.\"",
    icon: BookOpen,
    infoCard: {
      curriculum: "CBC Junior & Senior School",
      pathways: "STEM, Arts & Sports Science, Social Sciences",
      subjects: "Mathematics, Sciences, Languages, Humanities, Technical",
      facilities: "Modern Labs, Library, Computer Room"
    },
    seoKeywords: "CBC pathways Kenya, STEM education girls, Competency Based Curriculum, secondary school subjects"
  },
  {
    id: 3,
    title: "Holistic Development & Co-Curricular",
    subtitle: "Beyond the Classroom",
    gradient: "from-purple-500 via-pink-400 to-rose-600",
    description: "We nurture well-rounded individuals through diverse co-curricular activities including sports (athletics, volleyball, netball), drama, music, clubs, and leadership programs that build confidence and character.",
    background: "bg-gradient-to-br from-purple-900/90 via-pink-900/80 to-rose-900/70",
    image: "/hero/matG.jpg",
    mobileImage: "/hero/matG-mobile.jpg",
    stats: { 
      sports: "6+ Sports Teams", 
      clubs: "12+ Student Clubs", 
      events: "Annual Events",
      leadership: "Student Council"
    },
    features: ["Athletics", "Volleyball", "Netball", "Drama Club", "Music", "Debate"],
    cta: "Student Life",
    link: "/pages/student-life",
    highlightColor: "purple",
    testimonial: "\"Developing confident, capable young women ready to lead and serve their communities.\"",
    icon: GiTrophyCup,
    infoCard: {
      sports: "Athletics, Volleyball, Netball, Handball",
      clubs: "Debate, Drama, Music, Environmental, Journalism",
      events: "Sports Day, Drama Festival, Music Competition, Academic Day",
      leadership: "Student Council, Prefect Body, Club Leadership"
    },
    seoKeywords: "girls sports Kenya, co-curricular activities, student leadership, drama and music education"
  }
];

// CBC Pathways Information - Real and Searchable
const cbcPathways = [
  {
    name: "STEM Pathway",
    icon: SiGooglecolab,
    color: "emerald",
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Studies"],
    careers: ["Engineering", "Medicine", "Computer Science", "Research", "Data Science"]
  },
  {
    name: "Arts & Sports Science",
    icon: Palette,
    color: "purple",
    subjects: ["Music", "Fine Art", "Physical Education", "Theatre Arts", "Home Science"],
    careers: ["Professional Sports", "Music", "Fine Arts", "Coaching", "Sports Management"]
  },
  {
    name: "Social Sciences",
    icon: Users,
    color: "blue",
    subjects: ["History", "Geography", "CRE", "Business Studies", "Agriculture"],
    careers: ["Law", "Education", "Business", "Public Administration", "Social Work"]
  }
];

// Extract YouTube ID from URL
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
  const [matunguluInfo, setMatunguluInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [navigationBlocked, setNavigationBlocked] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const router = useRouter();

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch Matungulu Girls information - Real searchable data
  useEffect(() => {
    const fetchMatunguluInfo = async () => {
      try {
        const response = await fetch('/api/school');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.school) {
            setMatunguluInfo({
              name: 'Matungulu Girls High School',
              location: data.school.location || 'Matungulu, Machakos County, Kenya',
              established: data.school.established || '1955',
              type: data.school.type || 'Public Girls\' Secondary School',
              motto: data.school.motto || 'Strive to Excel',
              studentPopulation: data.school.studentPopulation || '800+ Female Students',
              principal: data.school.principal || 'School Principal',
              website: data.school.website || 'www.matungulugirls.sc.ke',
              status: 'Extra County School',
              curriculum: 'CBC (Competency Based Curriculum)',
              vision: 'To be a center of excellence in girls\' education',
              mission: 'To provide quality education that empowers girls academically, morally, and socially'
            });
          }
        }
      } catch (err) {
        console.log('Using default school information');
        // Accurate default data based on real school information
        setMatunguluInfo({
          name: 'Matungulu Girls High School',
          location: 'Matungulu, Machakos County, Kenya',
          established: '1955',
          type: 'Public Girls\' Secondary School',
          motto: 'Strive to Excel',
          studentPopulation: '800+ Female Students',
          principal: 'School Principal',
          website: 'https://matungulu-girls.vercel.app',
          status: 'Extra County School',
          curriculum: 'CBC (Competency Based Curriculum)',
          vision: 'To be a center of excellence in girls\' education',
          mission: 'To provide quality education that empowers girls academically, morally, and socially'
        });
      }
    };

    fetchMatunguluInfo();
  }, []);

  // Block automatic navigation for first 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setNavigationBlocked(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Preload images for smoother transitions
  useEffect(() => {
    heroSlides.forEach(slide => {
      const img = new Image();
      img.src = slide.image;
      if (slide.mobileImage) {
        const mobileImg = new Image();
        mobileImg.src = slide.mobileImage;
      }
    });
  }, []);

  const handleSlideChange = useCallback((index) => {
    setIsTransitioning(true);
    setImageLoaded(false);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 400);
  }, []);

  const nextSlide = useCallback(() => {
    handleSlideChange(currentSlide === heroSlides.length - 1 ? 0 : currentSlide + 1);
  }, [currentSlide, handleSlideChange]);

  const prevSlide = useCallback(() => {
    handleSlideChange(currentSlide === 0 ? heroSlides.length - 1 : currentSlide - 1);
  }, [currentSlide, handleSlideChange]);

  const openVideoModal = useCallback(() => {
    setShowVideoModal(true);
  }, []);

  const closeVideoModal = useCallback(() => {
    setShowVideoModal(false);
    setSchoolData(null);
    setError(null);
  }, []);

  // Safe navigation handler for slide buttons
  const handleSlideButtonClick = useCallback(() => {
    if (navigationBlocked) {
      return;
    }
    
    const link = heroSlides[currentSlide].link;
    
    setTimeout(() => {
      router.push(link);
    }, 100);
  }, [currentSlide, router, navigationBlocked]);

  // Safe contact handler for modal button
  const handleContactClick = useCallback(() => {
    closeVideoModal();
    
    if (navigationBlocked) {
      return;
    }
    
    setTimeout(() => {
      router.push('/pages/AboutUs');
    }, 100);
  }, [closeVideoModal, router, navigationBlocked]);

  // Handle CBC pathway click
  const handlePathwayClick = useCallback((pathwayName) => {
    if (navigationBlocked) return;
    router.push(`/pages/academics?pathway=${pathwayName.toLowerCase().replace(/\s+/g, '-')}`);
  }, [router, navigationBlocked]);

  // Fetch video data when modal opens
  useEffect(() => {
    if (showVideoModal) {
      setLoading(true);
      setError(null);
      
      fetch('/api/school')
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          if (data.success && data.school) {
            setSchoolData(data.school);
            setError(null);
          } else {
            throw new Error(data.message || 'No school data found');
          }
        })
        .catch(err => {
          console.error('Error fetching school video:', err);
          setError(err.message);
          setSchoolData(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [showVideoModal]);

  // Auto-slide effect with safety check
  useEffect(() => {
    if (showVideoModal) {
      return;
    }
    
    const timer = setInterval(() => {
      nextSlide();
    }, 8000);
    
    return () => clearInterval(timer);
  }, [currentSlide, nextSlide, showVideoModal]);

  const retryVideoLoad = useCallback(() => {
    setLoading(true);
    setError(null);
    
    fetch('/api/school')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.success && data.school) {
          setSchoolData(data.school);
          setError(null);
        } else {
          throw new Error(data.message || 'No school data found');
        }
      })
      .catch(err => {
        console.error('Error fetching school video:', err);
        setError(err.message);
        setSchoolData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const slide = heroSlides[currentSlide];
  const IconComponent = slide.icon;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-sans">
      {/* SEO Meta Tags - Hidden but searchable */}
      <div className="hidden">
        <h1>Matungulu Girls High School - Machakos County, Kenya</h1>
        <h2>Public Girls' Secondary School - CBC Curriculum</h2>
        <p>Matungulu Girls High School is a premier public girls' secondary school in Matungulu Sub-County, Machakos County, Kenya. Established in 1955, we offer CBC pathways including STEM, Arts, and Social Sciences. Our motto is "Strive to Excel".</p>
        <meta name="description" content="Matungulu Girls High School - A leading public girls' secondary school in Machakos County, Kenya offering CBC curriculum, STEM education, sports, and holistic development." />
        <meta name="keywords" content="Matungulu Girls High School, Machakos County schools, girls education Kenya, CBC curriculum, STEM girls, public secondary school Kenya, Matungulu Sub-County" />
      </div>

      {/* Background Image Layers */}
      {heroSlides.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            idx === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image - Mobile Optimized */}
          <div 
            className="absolute inset-0 bg-cover bg-center md:bg-fixed scale-105 animate-slow-zoom"
            style={{ 
              backgroundImage: `url(${isMobile && s.mobileImage ? s.mobileImage : s.image})`,
              backgroundPosition: isMobile ? 'center 30%' : 'center'
            }}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Mobile-optimized overlay gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60 md:from-black/25 md:via-black/35 md:to-black/45" />
          
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.25) 100%)'
          }} />
          
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.3)]" />
          
          <div className={`absolute inset-0 opacity-5 mix-blend-overlay ${s.background}`} />
          
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
        </div>
      ))}

      {/* Main Content Area */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center px-3 sm:px-4 md:px-6 lg:px-12 text-center">
        {/* Top Badge Section */}
        <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4 px-2">
          <div className="h-[1px] w-4 sm:w-6 md:w-8 bg-white/60" />
          <span
            className={`
              uppercase
              text-base xs:text-lg sm:text-base md:text-lg
              tracking-[0.08em] xs:tracking-[0.1em] sm:tracking-[0.15em]
              font-semibold sm:font-bold
              text-center
              leading-snug
              drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]
              ${getHighlightColorClass(slide.highlightColor)}
            `}
          >
            {matunguluInfo?.location || slide.subtitle}
          </span>
          <div className="h-[1px] w-4 sm:w-6 md:w-8 bg-white/60" />
        </div>

        {/* Dynamic Heading */}
        <h1 className="
          text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-5xl
          font-extrabold
          text-white
          leading-tight
          mb-3 sm:mb-4 md:mb-5
          drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)_0_0_20px_rgba(255,255,255,0.2)]
          px-2
        ">
          {matunguluInfo?.name || slide.title}
        </h1>

        {/* School Info Cards - Enhanced with real data */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6 w-full max-w-xs xs:max-w-sm sm:max-w-3xl mx-auto place-items-center">
          {/* Established */}
          <div className="bg-black/70 backdrop-blur-md border border-white/25 p-2 sm:p-3 rounded-lg hover:bg-black/80 transition-all shadow-lg w-full flex flex-col items-center justify-center min-h-[80px] sm:min-h-[100px]">
            <div className={`text-sm sm:text-lg font-bold ${getHighlightColorClass(slide.highlightColor)} drop-shadow-md text-center w-full truncate px-1`}>
              {matunguluInfo?.established || '1955'}
            </div>
            <span className="text-white/95 text-[8px] xs:text-xs uppercase tracking-wider font-semibold text-center w-full">
              Established
            </span>
          </div>

          {/* Status */}
          <div className="bg-black/70 backdrop-blur-md border border-white/25 p-2 sm:p-3 rounded-lg hover:bg-black/80 transition-all shadow-lg w-full flex flex-col items-center justify-center min-h-[80px] sm:min-h-[100px]">
            <div className={`text-sm sm:text-lg font-bold ${getHighlightColorClass(slide.highlightColor)} drop-shadow-md text-center w-full truncate px-1`}>
              Extra County
            </div>
            <span className="text-white/95 text-[8px] xs:text-xs uppercase tracking-wider font-semibold text-center w-full">
              Status
            </span>
          </div>

          {/* Motto */}
          <div className="bg-black/70 backdrop-blur-md border border-white/25 p-2 sm:p-3 rounded-lg hover:bg-black/80 transition-all shadow-lg w-full flex flex-col items-center justify-center min-h-[80px] sm:min-h-[100px]">
            <div className={`text-sm sm:text-lg font-bold ${getHighlightColorClass(slide.highlightColor)} drop-shadow-md text-center w-full truncate px-1`}>
              Strive to Excel
            </div>
            <span className="text-white/95 text-[8px] xs:text-xs uppercase tracking-wider font-semibold text-center w-full">
              Motto
            </span>
          </div>

          {/* Curriculum */}
          <div className="bg-black/70 backdrop-blur-md border border-white/25 p-2 sm:p-3 rounded-lg hover:bg-black/80 transition-all shadow-lg w-full flex flex-col items-center justify-center min-h-[80px] sm:min-h-[100px]">
            <div className={`text-sm sm:text-lg font-bold ${getHighlightColorClass(slide.highlightColor)} drop-shadow-md text-center w-full truncate px-1`}>
              CBC
            </div>
            <span className="text-white/95 text-[8px] xs:text-xs uppercase tracking-wider font-semibold text-center w-full">
              Curriculum
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="
          text-sm xs:text-base sm:text-lg
          text-gray-100
          mb-4 sm:mb-5 md:mb-6
          mx-auto
          max-w-sm xs:max-w-md sm:max-w-xl md:max-w-2xl
          font-medium
          leading-relaxed
          line-clamp-3 sm:line-clamp-none
          drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]
        ">
          {slide.description}
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 xs:gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-8 max-w-xs xs:max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto">
          {slide.features.slice(0, isMobile ? 4 : 4).map((feature, i) => (
            <div key={i} className="flex items-center justify-center space-x-1 xs:space-x-2 
              bg-black/70 backdrop-blur-md border border-white/25 p-1 xs:p-2 sm:p-3 rounded-lg sm:rounded-xl 
              hover:bg-black/80 transition-all duration-300 group overflow-hidden shadow-2xl">
              <IconComponent className={`w-3 h-3 xs:w-4 xs:h-4 ${getHighlightColorClass(slide.highlightColor)} flex-shrink-0 drop-shadow-[0_0_5px_currentColor]`} />
              <span className="text-white font-semibold text-[10px] xs:text-xs sm:text-sm group-hover:text-white whitespace-nowrap overflow-hidden text-ellipsis drop-shadow-md">
                {isMobile && feature.length > 12 ? feature.substring(0, 10) + '...' : feature}
              </span>
            </div>
          ))}
        </div>

        {/* CBC Pathways Quick View - Mobile Optimized */}
        <div className="hidden md:grid grid-cols-3 gap-3 mb-4 max-w-3xl mx-auto">
          {cbcPathways.map((pathway, idx) => {
            const PathwayIcon = pathway.icon;
            return (
              <button
                key={idx}
                onClick={() => handlePathwayClick(pathway.name)}
                className={`bg-black/60 backdrop-blur-md border border-white/25 p-3 rounded-xl 
                  hover:bg-black/80 transition-all group cursor-pointer
                  ${getPathwayBorderClass(pathway.color)}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <PathwayIcon className={`w-4 h-4 ${getPathwayTextClass(pathway.color)}`} />
                  <span className="text-white font-bold text-sm">{pathway.name}</span>
                </div>
                <p className="text-white/70 text-xs text-left line-clamp-2">
                  {pathway.subjects.slice(0, 3).join(' • ')}
                </p>
              </button>
            );
          })}
        </div>

        {/* Testimonial */}
        <div className="mb-3 sm:mb-4 md:mb-6 max-w-xs xs:max-w-sm sm:max-w-md md:max-w-xl mx-auto">
          <div className={`border-l-2 sm:border-l-4 ${getBorderColorClass(slide.highlightColor)} pl-2 sm:pl-3 md:pl-4 py-1 sm:py-2 bg-black/70 backdrop-blur-md rounded-r-lg shadow-2xl`}>
            <p className="text-white/95 text-[10px] xs:text-xs sm:text-sm italic font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              {slide.testimonial}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="
          flex items-center justify-center gap-3
          sm:flex-row sm:gap-4
          px-2
        ">
          <button
            onClick={handleSlideButtonClick}
            disabled={navigationBlocked}
            className="
              group
              px-4 sm:px-6
              py-2 sm:py-3
              bg-white text-black
              rounded-full font-semibold
              text-sm
              hover:bg-gray-200
              transition-all
              flex items-center justify-center gap-2
              shadow-[0_8px_25px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.8)]
              disabled:opacity-50 disabled:cursor-not-allowed
              drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]
            "
          >
            {slide.cta}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={openVideoModal}
            className="
              group
              px-4 sm:px-6
              py-2 sm:py-3
              bg-white/25
              border border-white/40
              text-white
              rounded-full font-semibold
              text-sm
              hover:bg-white/35 hover:border-white/70
              backdrop-blur-md
              transition-all duration-300
              flex items-center justify-center gap-2
              shadow-[0_8px_25px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.7)]
              drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]
            "
          >
            <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
            {isMobile ? 'Tour' : 'Virtual Tour'}
          </button>
        </div>
      </div>

      {/* Modern Controls */}
      <div className={`absolute z-30 flex space-x-3 sm:space-y-3 sm:flex-col ${isMobile ? 'bottom-4 right-4 flex-row' : 'bottom-10 right-8 flex-col'}`}>
        <button 
          onClick={prevSlide}
          className={`rounded-full border border-white/30 text-white hover:bg-white hover:text-black 
            transition-all group backdrop-blur-md hover:scale-110 duration-300 bg-black/50 shadow-2xl
            ${isMobile ? 'p-2' : 'p-3'}`}
          aria-label="Previous slide"
        >
          <ChevronLeft className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
        </button>
        <button 
          onClick={nextSlide}
          className={`rounded-full border border-white/30 text-white hover:bg-white hover:text-black 
            transition-all group backdrop-blur-md hover:scale-110 duration-300 bg-black/50 shadow-2xl
            ${isMobile ? 'p-2' : 'p-3'}`}
          aria-label="Next slide"
        >
          <ChevronRight className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
        </button>
      </div>

      {/* Progress Indicators - Desktop */}
      {!isMobile && (
        <div className="absolute top-1/2 right-4 sm:right-6 md:right-8 -translate-y-1/2 z-30 hidden sm:flex flex-col space-y-4 sm:space-y-6">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className="group flex items-center justify-end"
              aria-label={`Go to slide ${index + 1}`}
            >
              <span className={`mr-2 sm:mr-3 text-[8px] sm:text-[10px] font-mono transition-all ${currentSlide === index ? 'text-white drop-shadow-[0_0_5px_white]' : 'text-white/30 opacity-0 group-hover:opacity-100'}`}>
                0{index + 1}
              </span>
              <div className={`w-[1px] sm:w-[2px] transition-all duration-300 rounded-full ${currentSlide === index ? `h-6 sm:h-8 ${getProgressColorClass(heroSlides[index].highlightColor)} shadow-[0_0_10px_currentColor]` : 'h-2 sm:h-3 bg-white/20 group-hover:bg-white/40'}`} />
            </button>
          ))}
        </div>
      )}

      {/* Mobile Progress Dots */}
      {isMobile && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className="w-2 h-2 rounded-full transition-all duration-300 shadow-[0_0_5px_currentColor]"
              style={{
                backgroundColor: currentSlide === index 
                  ? getProgressColorValue(heroSlides[index].highlightColor)
                  : 'rgba(255, 255, 255, 0.3)'
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Bottom Info Strip */}
      <div className={`absolute bottom-0 left-0 w-full z-10 py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6 lg:px-12 
        border-t border-white/15 bg-black/95 backdrop-blur-md 
        ${isMobile ? 'flex flex-col items-center justify-center gap-1' : 'hidden md:flex items-center justify-between'} 
        text-white/90 text-[8px] xs:text-[10px] tracking-[0.1em] sm:tracking-[0.15em] uppercase font-semibold shadow-[0_-15px_30px_rgba(0,0,0,0.8)]`}>
        
        {isMobile ? (
          <>
            <div className="flex items-center space-x-4">
              <span className="flex items-center text-nowrap">
                <FaSchool className="w-2 h-2 xs:w-3 xs:h-3 mr-1" />
                Extra County
              </span>
              <span className="flex items-center text-nowrap">
                <GraduationCap className="w-2 h-2 xs:w-3 xs:h-3 mr-1" />
                CBC
              </span>
            </div>
            <button 
              onClick={openVideoModal}
              className="flex items-center text-white/90 hover:text-white transition-colors duration-300 group text-nowrap"
            >
              <Play className="w-2 h-2 xs:w-3 xs:h-3 mr-1 group-hover:scale-110 transition-transform" />
              Virtual Tour
            </button>
          </>
        ) : (
          <>
            <div className="flex space-x-4 md:space-x-6 lg:space-x-8">
              <span className="flex items-center">
                <FaSchool className="w-3 h-3 mr-2" />
                {matunguluInfo?.status || 'Extra County School'}
              </span>
              <span className="flex items-center">
                <GraduationCap className="w-3 h-3 mr-2" />
                {matunguluInfo?.curriculum || 'CBC Curriculum'}
              </span>
              <span className="flex items-center">
                <FaUsers className="w-3 h-3 mr-2" />
                {matunguluInfo?.studentPopulation || '800+ Students'}
              </span>
            </div>
            <div className="flex space-x-4 md:space-x-6 lg:space-x-8">
              <span className="flex items-center">
                <Trophy className="w-3 h-3 mr-2" />
                {matunguluInfo?.motto || 'Strive to Excel'}
              </span>
              <button 
                onClick={openVideoModal}
                className="flex items-center text-white/90 hover:text-white transition-colors duration-300 group"
              >
                <Play className="w-3 h-3 mr-2 group-hover:scale-110 transition-transform" />
                Virtual Tour
              </button>
            </div>
          </>
        )}
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="relative w-full max-w-full sm:max-w-4xl md:max-w-5xl lg:max-w-6xl rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-black/80 to-transparent p-2 sm:p-3 md:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg sm:rounded-lg 
                  bg-gradient-to-br from-emerald-900 via-teal-900 to-green-900 flex items-center justify-center flex-shrink-0">
                  <Play className="text-white w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-white font-bold text-xs sm:text-sm md:text-base truncate">Matungulu Girls Virtual Tour</h4>
                  <p className="text-white/60 text-[10px] sm:text-xs md:text-sm truncate">
                    {schoolData?.name || 'Matungulu Girls High School'}
                  </p>
                </div>
              </div>
              <button
                onClick={closeVideoModal}
                className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-black/50 text-white 
                  hover:bg-black/70 transition-colors flex items-center justify-center 
                  hover:scale-110 duration-300 flex-shrink-0"
                aria-label="Close video"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6" />
              </button>
            </div>
            
            {/* Video Container */}
            <div className="relative bg-black aspect-video">
              {loading ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-white mb-2 sm:mb-4"></div>
                  <p className="text-white text-sm sm:text-base">Loading virtual tour...</p>
                </div>
              ) : error ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-8">
                  <div className="text-3xl sm:text-4xl md:text-5xl text-red-500 mb-2 sm:mb-4">!</div>
                  <p className="text-white text-center text-xs sm:text-sm md:text-base mb-2 sm:mb-4 px-2">{error}</p>
                  <button
                    onClick={retryVideoLoad}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white 
                      rounded-lg transition-colors text-xs sm:text-sm"
                  >
                    Retry Loading
                  </button>
                </div>
              ) : schoolData?.videoType === 'youtube' && schoolData?.videoTour ? (
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(schoolData.videoTour)}?autoplay=1&rel=0&modestbranding=1&controls=1`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`${schoolData.name} Virtual Tour`}
                />
              ) : schoolData?.videoType === 'file' && schoolData?.videoTour ? (
                <div className="relative w-full h-full">
                  <video
                    src={schoolData.videoTour}
                    className="w-full h-full"
                    autoPlay
                    controls
                    title={`${schoolData.name} Virtual Tour`}
                    poster={schoolData?.videoThumbnail}
                  >
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-8">
                      <div className="text-3xl sm:text-4xl md:text-5xl text-gray-400 mb-2 sm:mb-4">!</div>
                      <p className="text-white text-center text-sm sm:text-base">
                        Your browser does not support the video tag.
                      </p>
                    </div>
                  </video>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-8">
                  <div className="text-3xl sm:text-4xl md:text-5xl text-gray-400 mb-2 sm:mb-4">!</div>
                  <p className="text-white text-center text-xs sm:text-sm md:text-base mb-2 sm:mb-4">
                    Virtual tour coming soon
                  </p>
                  <p className="text-white/60 text-xs sm:text-sm text-center px-2">
                    We're preparing an immersive tour of Matungulu Girls High School
                  </p>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-r from-transparent to-black/80 p-2 sm:p-3 md:p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
                <div className="text-white/80 text-xs sm:text-sm hidden sm:block truncate">
                  Experience Matungulu Girls High School - Where Excellence Meets Opportunity
                </div>
                <button
                  onClick={handleContactClick}
                  className="px-3 sm:px-4 md:px-6 lg:px-8 py-1.5 sm:py-2 md:py-3 
                    text-xs sm:text-sm md:text-base bg-gradient-to-br from-emerald-700 via-teal-700 to-green-700 
                    text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 
                    disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  disabled={navigationBlocked}
                >
                  {isMobile ? 'Learn More' : 'Discover Matungulu Girls'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Blocker Overlay */}
      {navigationBlocked && (
        <div className="absolute inset-0 z-40 pointer-events-none">
          <div className="absolute bottom-20 sm:bottom-24 left-1/2 transform -translate-x-1/2 
            bg-black/70 text-white text-[10px] xs:text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
            Loading Matungulu Girls experience...
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        
        .animate-slow-zoom {
          animation: slow-zoom 20s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
};

// Helper functions
const getHighlightColorClass = (color) => {
  switch(color) {
    case 'blue': return 'text-blue-400';
    case 'emerald': return 'text-emerald-400';
    case 'purple': return 'text-purple-400';
    default: return 'text-emerald-400';
  }
};

const getBorderColorClass = (color) => {
  switch(color) {
    case 'blue': return 'border-blue-500';
    case 'emerald': return 'border-emerald-500';
    case 'purple': return 'border-purple-500';
    default: return 'border-emerald-500';
  }
};

const getProgressColorClass = (color) => {
  switch(color) {
    case 'blue': return 'bg-blue-500';
    case 'emerald': return 'bg-emerald-500';
    case 'purple': return 'bg-purple-500';
    default: return 'bg-emerald-500';
  }
};

const getProgressColorValue = (color) => {
  switch(color) {
    case 'blue': return '#3b82f6';
    case 'emerald': return '#10b981';
    case 'purple': return '#a855f7';
    default: return '#10b981';
  }
};

const getPathwayTextClass = (color) => {
  switch(color) {
    case 'emerald': return 'text-emerald-400';
    case 'blue': return 'text-blue-400';
    case 'purple': return 'text-purple-400';
    default: return 'text-emerald-400';
  }
};

const getPathwayBorderClass = (color) => {
  switch(color) {
    case 'emerald': return 'hover:border-emerald-400/50';
    case 'blue': return 'hover:border-blue-400/50';
    case 'purple': return 'hover:border-purple-400/50';
    default: return 'hover:border-emerald-400/50';
  }
};

export default ModernHero;