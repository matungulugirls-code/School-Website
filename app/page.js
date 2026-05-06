'use client';
import { useEffect, useState, useCallback } from 'react';
import { 
  FiArrowRight, 
  FiStar, 
  FiUsers, 
  FiPlay,
  FiCalendar,
  FiMapPin,
  FiBook,
  FiActivity,
  FiShare2,
  FiMail,
  FiUser,
  FiBookOpen,
  FiHome,
  FiPhone,
  FiClock,
  FiTrendingUp,
  FiTarget,
  FiCheckCircle,
  FiGlobe,
  FiHeart,
  FiShield,
  FiCheck,
  FiAward,
  FiMap,
  FiBookmark,
  FiBarChart2,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
  FiExternalLink,
  FiLoader,
  FiAlertCircle,
  FiPhoneCall 
} from 'react-icons/fi';
import { GiFlowerEmblem, GiSparkles, GiBookCover, GiEagleHead } from 'react-icons/gi';
import { FaBook, FaRegStar } from 'react-icons/fa';
import { 
  IoRocketOutline, 
  IoPeopleOutline,
  IoLibraryOutline,
  IoBusinessOutline,
  IoSparkles,
  IoSchoolOutline,
  IoStatsChart,
  IoMedalOutline,
  IoClose,
  IoHeartOutline,
  IoBulbOutline,
  IoStarOutline,
  IoRibbonOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoLocationOutline,
  IoArrowForward,
  IoBookOutline,
  IoDesktopOutline
} from 'react-icons/io5';
import { FaCalendarAlt, FaWhatsapp, FaChalkboardTeacher } from 'react-icons/fa';
import { 
  GiGraduateCap, 
  GiModernCity,
  GiTreeGrowth,
  GiBrain,
  GiTeacher,
  GiLightBulb,
  GiAchievement,
  GiStoneBridge,
  GiBookPile,
  GiBurningBook,
  GiRingingBell,
  GiTrophyCup,
  GiChemicalDrop,
  GiAbstract066,
  GiCircuitry
} from 'react-icons/gi';
import { BsArrowRightCircle, BsLightningCharge } from 'react-icons/bs';
import { TbUsersGroup } from 'react-icons/tb';
import { Trophy, Sparkles, GraduationCap, Target, Globe, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';

// External Components
import ChatBot from './components/chat/page';
import EnhancedEventsSection from './components/events/page';
import ModernLeadershipSection from './components/leadership/page';
import Hero from "./components/Hero/page";
import Why from "./components/why/page";

// Modern Loading Screen for Matungulu Girls Senior School
const MatunguluGirlsLoadingScreen = () => {
  const [textIndex, setTextIndex] = useState(0);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const schoolName = "MATUNGULU GIRLS' SENIOR";
  const motto = "Committed to Excellence";
  const established = "EST. 1955 | NATIONAL SCHOOL";
  const tagline = "Empowering Young Women • Shaping Future Leaders";

  const loadingMessages = [
    "Preparing Excellence",
    "Cultivating Leaders",
    "Inspiring Minds",
    "Building Character"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const glowInterval = setInterval(() => {
      setGlowIntensity((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(glowInterval);
  }, []);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 30);
    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-rose-50 via-white to-emerald-50 z-50 flex items-center justify-center overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-rose-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-r from-emerald-300/20 to-teal-300/20 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-300/10 via-rose-300/10 to-emerald-300/10 rounded-full blur-3xl animate-spin-slow"></div>
        
        {/* Removed floating petal/flower shapes for cleaner loading animation */}

        {/* Elegant Light Beams */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-rose-400 to-transparent animate-beam"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-beam animation-delay-1000"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-3xl px-6">
        
        {/* Logo Section */}
        <div className="relative mb-8 md:mb-12">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-rose-400 via-emerald-400 to-purple-400 rounded-full blur-2xl transition-all duration-300"
            style={{ 
              opacity: 0.2 + (glowIntensity / 100) * 0.2,
              transform: `scale(${1 + (glowIntensity / 100) * 0.15})`
            }}
          ></div>
          
          <div className="relative w-28 h-28 md:w-36 md:h-36">
            <div className="absolute -inset-3 border-2 border-dashed border-rose-300/50 rounded-full animate-spin-slow"></div>
            <div className="absolute -inset-1.5 border border-emerald-300/40 rounded-full animate-pulse"></div>
            
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-rose-500 via-pink-500 to-emerald-500 p-0.5 shadow-2xl">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white/20 pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                <img 
                  src="/MatG.jpg" 
                  alt="Matungulu Girls Senior School Logo" 
                  className="w-[85%] h-[85%] object-cover rounded-full relative z-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* School Name */}
        <div className="text-center mb-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-black tracking-wide text-gray-800">
            {schoolName.split("'")[0]}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-emerald-600">'</span>
            {schoolName.split("'")[1]}
          </h1>
          
          <div className="flex items-center justify-center gap-3 my-3">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-rose-300"></div>
            <div className="w-1.5 h-1.5 bg-gradient-to-r from-rose-400 to-emerald-400 rounded-full rotate-45"></div>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-emerald-300"></div>
          </div>
          
          <p className="text-gray-600 text-[10px] md:text-xs tracking-[0.3em] font-medium">
            {established}
          </p>
        </div>

        {/* Motto */}
        <div className="text-center mb-6">
          <p className="text-xl md:text-2xl lg:text-3xl font-serif italic tracking-wide text-gray-700">
            "{motto}"
          </p>
        </div>

        {/* Tagline */}
        <div className="text-center mb-8">
          <p className="text-xs md:text-sm text-gray-500 tracking-wider">
            {tagline}
          </p>
        </div>

        {/* Loading Indicator */}
        <div className="flex flex-col items-center gap-4 w-64">
          <div className="h-8 flex items-center justify-center">
            <p className="text-gray-600 text-sm md:text-base font-medium tracking-wide">
              {loadingMessages[textIndex]}
              <span className="inline-flex ml-1">
                <span className="animate-bounce" style={{ animationDelay: '0s' }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
              </span>
            </p>
          </div>

          <div className="relative w-full h-0.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-rose-400 via-pink-400 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mt-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="relative"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-rose-400 to-emerald-400 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative Bottom Elements */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <div className="flex items-center gap-6">
            {/* Eagle, Flower, Book, Sparkles as colored icons */}
            <span
              className="text-gray-400 text-sm opacity-60"
              style={{ animation: `float-icon 3s ease-in-out infinite`, animationDelay: `0s`, color: '#6366f1' }}
            >
              <GiEagleHead />
            </span>
            <span
              className="text-gray-400 text-sm opacity-60"
              style={{ animation: `float-icon 4s ease-in-out infinite`, animationDelay: `0.3s`, color: '#f472b6' }}
            >
              <GiFlowerEmblem />
            </span>
            <span
              className="text-gray-400 text-sm opacity-60"
              style={{ animation: `float-icon 5s ease-in-out infinite`, animationDelay: `0.6s`, color: '#fbbf24' }}
            >
              <FaBook />
            </span>
            <span
              className="text-gray-400 text-sm opacity-60"
              style={{ animation: `float-icon 6s ease-in-out infinite`, animationDelay: `0.9s`, color: '#10b981' }}
            >
              <GiSparkles />
            </span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes float-petal {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg); 
            opacity: 0.3; 
          }
          25% { 
            transform: translateY(-20px) translateX(10px) rotate(90deg); 
            opacity: 0.6; 
          }
          50% { 
            transform: translateY(-40px) translateX(-5px) rotate(180deg); 
            opacity: 0.4; 
          }
          75% { 
            transform: translateY(-20px) translateX(-15px) rotate(270deg); 
            opacity: 0.6; 
          }
        }
        
        @keyframes float-icon {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes beam {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 30s linear infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animate-beam {
          animation: beam 4s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-bounce {
          animation: bounce 0.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default function ModernHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiData, setApiData] = useState({
    events: [],
    news: [],
    staff: [],
    schoolInfo: null,
    guidanceEvents: []
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [schoolData, setSchoolData] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [navigationBlocked, setNavigationBlocked] = useState(true);

  const router = useRouter();

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'School',
    name: 'Matungulu Girls Senior School',
    image: 'https://matungulu-girls.vercel.app/MatG.jpg',
    description: 'A secondary school committed to academic excellence, integrity, and holistic student development.',
    address: {
      '@type': 'PostalAddress',
      'streetAddress': 'P.O. Box 32, 90131 Tala',
      'addressLocality': 'Machakos',
      'addressRegion': 'Machakos County',
      'addressCountry': 'KE'
    },
    url: 'https://matungulu-girls.vercel.app',
    telephone: '0734610130',
    sameAs: [
      'https://facebook.com/matungulugirls',
      'https://twitter.com/matungulugirls',
      'https://instagram.com/matungulugirls',
    ],
    foundingDate: '1955',
    numberOfStudents: '1200',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Educational Programs',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Course',
            name: 'KCSE Curriculum (Form 1-4)'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Course',
            name: 'Extra-Curricular & Sports'
          }
        }
      ]
    }
  };

  // Block automatic navigation on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setNavigationBlocked(false);
    }, 4000);
    
    return () => clearTimeout(timer);
  }, []);

  // Enhanced Hero Slides with Modern Design
  const heroSlides = [
    {
      title: "Academic Excellence",
      subtitle: "Redefined Through Innovation",
      gradient: "from-rose-500 via-pink-400 to-emerald-600",
      description: "At Matungulu Girls Senior School, we're pioneering a new era of education. With a 94% KCSE success rate and state-of-the-art STEM facilities, we're not just teaching—we're inspiring the next generation of leaders and innovators.",
      background: "bg-gradient-to-br from-rose-900/90 via-pink-900/80 to-emerald-900/70",
      image: "/student.jpg",
      stats: { 
        students: "1200+ Active Learners", 
        excellence: "94% KCSE Success", 
        years: "70+ Years Excellence" 
      },
      features: ["Modern STEM Labs", "Digital Library", "Expert Faculty", "Research Programs"],
      cta: "Explore Our Programs",
      highlightColor: "rose",
      testimonial: "\"The academic rigor combined with innovative teaching transformed my child's approach to learning.\" - Parent of 2023 Graduate",
      icon: GiGraduateCap
    },
    {
      title: "Holistic Development",
      subtitle: "Nurturing Complete Individuals",
      gradient: "from-emerald-500 via-teal-400 to-rose-600",
      description: "Beyond academics, we cultivate well-rounded individuals through 15+ clubs, competitive sports teams, and comprehensive life skills training. Our balanced approach ensures students develop essential competencies for lifelong success.",
      background: "bg-gradient-to-br from-emerald-900/90 via-teal-900/80 to-rose-900/70",
      image: "/im.jpg",
      stats: { 
        teams: "10+ Sports Teams", 
        clubs: "15+ Clubs", 
        success: "National Awards" 
      },
      features: ["Sports Excellence", "Creative Arts", "Leadership Training", "Community Service"],
      cta: "View Our Facilities",
      highlightColor: "emerald",
      testimonial: "\"The extracurricular programs helped my child discover their passion for drama and develop crucial leadership skills.\" - Current Parent",
      icon: GiTrophyCup
    },
    {
      title: "Future-Ready Education",
      subtitle: "Preparing for the Digital Age",
      gradient: "from-pink-500 via-rose-400 to-emerald-600",
      description: "Experience cutting-edge education with our technology-enhanced smart classrooms, advanced computer labs, and comprehensive digital literacy programs. We prepare students for careers in an increasingly technological world.",
      background: "bg-gradient-to-br from-pink-900/90 via-rose-900/80 to-emerald-900/70",
      image: "/im2.jpeg",
      stats: { 
        labs: "3 Modern Labs", 
        tech: "Digital Classrooms", 
        innovation: "STEM Programs" 
      },
      features: ["Computer Studies", "Science Innovation", "Career Guidance", "Coding Classes"],
      cta: "Apply Now",
      highlightColor: "pink",
      testimonial: "\"The advanced computer labs gave me skills that directly contributed to securing my university scholarship in Computer Science.\" - 2022 Alumni",
      icon: IoRocketOutline
    }
  ];

  // API Data Fetching
  useEffect(() => {
    const fetchAllData = () => {
      try {
        setIsLoading(true);
        
        const endpoints = [
          { key: 'events', url: '/api/events' },
          { key: 'school', url: '/api/school' }
        ];

        Promise.allSettled(
          endpoints.map(endpoint => 
            fetch(endpoint.url)
              .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
              })
              .then(data => ({ key: endpoint.key, data }))
              .catch(() => ({ 
                key: endpoint.key, 
                data: null
              }))
          )
        ).then(results => {
          const fetchedData = {
            events: [],
            staff: [],
            schoolInfo: null
          };

          results.forEach(result => {
            if (result.status === 'fulfilled') {
              const { key, data } = result.value;
              if (data) {
                switch (key) {
                  case 'events':
                    fetchedData.events = data.events || [];
                    break;
                  case 'staff':
                    fetchedData.staff = data.staff || [];
                    break;
                  case 'school':
                    fetchedData.schoolInfo = data.school || data;
                    break;
                }
              }
            }
          });

          setApiData(fetchedData);
        }).catch(error => {
          console.error('Error fetching data:', error);
          setApiData({
            events: [],
            staff: [],
            schoolInfo: null
          });
        }).finally(() => {
          setTimeout(() => setIsLoading(false), 2000);
        });

      } catch (error) {
        console.error('Error in fetchAllData:', error);
        setApiData({
          events: [],
          staff: [],
          schoolInfo: null
        });
        setTimeout(() => setIsLoading(false), 2000);
      }
    };

    fetchAllData();
  }, []);

  // Auto-slide for hero carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        setIsAnimating(false);
      }, 500);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      setIsAnimating(false);
    }, 500);
  };

  const prevSlide = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
      setIsAnimating(false);
    }, 500);
  };

  // School Video API Service
  const fetchSchoolVideo = useCallback(() => {
    setVideoLoading(true);
    setVideoError(null);
    
    fetch('/api/school')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        if (data.success && data.school) {
          setSchoolData(data.school);
          setVideoError(null);
        } else {
          throw new Error(data.message || 'No school data found');
        }
      })
      .catch(err => {
        console.error('Error fetching school video:', err);
        setVideoError(err.message);
        setSchoolData(null);
      })
      .finally(() => {
        setVideoLoading(false);
      });
  }, []);

  useEffect(() => {
    if (showVideoModal) {
      fetchSchoolVideo();
    }
  }, [showVideoModal, fetchSchoolVideo]);

  // Extract YouTube ID
  const extractYouTubeId = (url) => {
    if (!url) return null;
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };

  // Navigation handlers
  const handleAcademicsClick = useCallback(() => {
    if (navigationBlocked) return;
    router.push('/pages/academics');
  }, [router, navigationBlocked]);

  const handleWatchTour = useCallback(() => {
    setShowVideoModal(true);
  }, []);

  const closeVideoModal = useCallback(() => {
    setShowVideoModal(false);
    setSchoolData(null);
    setVideoError(null);
  }, []);

  const handleEventClick = useCallback(() => {
    if (navigationBlocked) return;
    router.push('/pages/eventsandnews');
  }, [router, navigationBlocked]);

  const handleStaffClick = useCallback(() => {
    if (navigationBlocked) return;
    router.push('/pages/SchoolTeam');
  }, [router, navigationBlocked]);

  const handleAdmissionsClick = useCallback(() => {
    if (navigationBlocked) return;
    router.push('/pages/admissions');
  }, [router, navigationBlocked]);

  const handleContactClick = useCallback(() => {
    if (navigationBlocked) return;
    closeVideoModal();
    setTimeout(() => {
      router.push('/pages/AboutUs');
    }, 100);
  }, [router, closeVideoModal, navigationBlocked]);

  // Show loading screen
  if (isLoading) {
    return <MatunguluGirlsLoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Inject JSON-LD structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero />

      <section className="py-8 md:py-16 bg-white">
        <ModernLeadershipSection />
      </section>

      {/* Modern Achievements & Stats Section */}
      <section className="py-8 md:py-16 bg-white">
        <Why />
      </section>

      <EnhancedEventsSection 
        events={apiData.events}
        onViewAll={handleEventClick}
        schoolInfo={apiData.schoolInfo}
      />

      {showVideoModal && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-black/80 to-transparent p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-rose-500 to-emerald-500 flex items-center justify-center">
                  <FiPlay className="text-white" />
                </div>
                <div>
                  <h4 className="text-white font-bold">Virtual Tour</h4>
                  <p className="text-white/60 text-sm">
                    {schoolData?.name || 'Matungulu Girls Senior School'}
                  </p>
                </div>
              </div>
              <button
                onClick={closeVideoModal}
                className="w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors flex items-center justify-center"
                aria-label="Close video"
              >
                <IoClose className="w-6 h-6" />
              </button>
            </div>
            
            {/* Video Container */}
            <div className="relative bg-black aspect-video">
              {videoLoading ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                  <p className="text-white">Loading video tour...</p>
                </div>
              ) : videoError ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-8">
                  <FiAlertCircle className="text-5xl text-red-500 mb-4" />
                  <p className="text-white text-center mb-4">{videoError}</p>
                  <button
                    onClick={fetchSchoolVideo}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors"
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
                    <div className="w-full h-full flex flex-col items-center justify-center p-8">
                      <FiAlertCircle className="text-5xl text-gray-400 mb-4" />
                      <p className="text-white text-center">
                        Your browser does not support the video tag.
                      </p>
                    </div>
                  </video>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8">
                  <FiAlertCircle className="text-5xl text-gray-400 mb-4" />
                  <p className="text-white text-center mb-4">No video tour available</p>
                  <p className="text-white/60 text-sm text-center">
                    Please check back later for our virtual tour
                  </p>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-r from-transparent to-black/80 p-4">
              <div className="flex items-center justify-between">
                <div className="text-white/80 text-sm">
                  {schoolData?.description?.substring(0, 100) + '...' || 'Experience our School from anywhere'}
                </div>
                <button
                  onClick={handleContactClick}
                  className="px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base bg-gradient-to-r from-rose-600 to-emerald-600 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={navigationBlocked}
                >
                  Get To Know Us More
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-light {
          0%, 100% { transform: translateY(0px); opacity: 0.2; }
          50% { transform: translateY(-10px); opacity: 0.4; }
        }
        
        @keyframes scroll {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(10px); opacity: 0; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes gradient-loading {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
          background-size: 200% auto;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-light {
          animation: float-light 4s ease-in-out infinite;
        }
        
        .animate-scroll {
          animation: scroll 1.5s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-gradient-loading {
          animation: gradient-loading 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
}
