"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  FiAward, 
  FiBook, 
  FiHeart, 
  FiMapPin, 
  FiUsers, 
  FiCalendar,
  FiShield,
  FiStar,
  FiTrendingUp,
  FiGlobe,
  FiMail,
  FiPhone,
  FiArrowRight,
  FiChevronRight,
  FiChevronLeft,
  FiTarget,
  FiEye,
  FiBookOpen,
  FiLoader,
  FiCheckCircle,
  FiExternalLink,
  FiLayers,
  FiCpu,
  FiActivity,
  FiPenTool,
  FiDroplet
} from 'react-icons/fi';
import { 
  IoSparkles, 
  IoFlaskOutline, 
  IoAccessibilityOutline, 
  IoNewspaperOutline 
} from 'react-icons/io5';

const ModernSchoolLayout = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [schoolData, setSchoolData] = useState(null);
  const [uniImages, setUniImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expandedCards, setExpandedCards] = useState({});
  
  // School images for carousel
  const schoolImages = [
    { src: "/hero/MatG1.jpg", alt: "Matungulu Girls Campus" },
    { src: "/hero/MatG.jpg", alt: "School Building" },
    { src: "/hero/MatG1.jpg", alt: "Students" },
  ];

  // Fetch school data
  useEffect(() => {
    fetch('/api/school')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.school) setSchoolData(data.school);
      })
      .catch(err => console.error('Error fetching school data:', err))
      .finally(() => setLoading(false));
  }, []);

  // Fetch university logos
  useEffect(() => {
    fetch('/api/unis')
      .then(res => res.json())
      .then(data => {
        const imgs = data.images || [];
        for (let i = imgs.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [imgs[i], imgs[j]] = [imgs[j], imgs[i]];
        }
        setUniImages(imgs);
      })
      .catch(() => setUniImages([]))
      .finally(() => setImagesLoading(false));
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % schoolImages.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [schoolImages.length]);

  const nextImage = () => setCurrentImageIndex(prev => (prev + 1) % schoolImages.length);
  const prevImage = () => setCurrentImageIndex(prev => (prev - 1 + schoolImages.length) % schoolImages.length);
  
  const toggleReadMore = (id) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExplorePathways = () => {
    router.push("/pages/admissions");
  };

  const schoolName = schoolData?.name || 'Matungulu Girls Senior School';
  const motto = schoolData?.motto || 'Strive to Excel';
  const vision = schoolData?.vision || 'To be a center of excellence in nurturing holistic, God-fearing, and academically empowered young women for global leadership.';
  const mission = schoolData?.mission || 'To provide quality education that fosters academic excellence, moral integrity, and personal growth in a supportive Christian environment.';
  const description = schoolData?.description;
  const studentCount = schoolData?.studentCount || 1200;
  const contactEmail = schoolData?.admissionContactEmail || 'info@matungulugirls.ac.ke';
  const contactPhone = schoolData?.admissionContactPhone || '+254 720 123 456';

  // Double images for seamless scrolling
  const scrollImages = [...uniImages, ...uniImages];

  const colorMap = {
    emerald: { bg: 'bg-emerald-600', light: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
    blue: { bg: 'bg-blue-600', light: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  };

  const whyChooseUs = [
    {
      id: 1,
      color: 'emerald',
      title: "Academic Excellence",
      shortDescription: "Consistently ranked among top-performing girls' schools in Machakos County.",
      description: "Consistently ranked among top-performing girls' schools in Machakos County with impressive KCSE results and university placements. Our students achieve mean scores above 8.0 with over 80% qualifying for direct university entry.",
      metrics: "Top Performer",
      icon: <FiAward size={20} />,
      image: { src: "/hero/MatG1.jpg", alt: "Academic Excellence" }
    },
    {
      id: 2,
      color: 'emerald',
      title: "Holistic Development",
      shortDescription: "Balancing academic rigor with spiritual growth and co-curricular activities.",
      description: "Balancing academic rigor with spiritual growth, sports, music, drama, and leadership programs for well-rounded individuals. We offer over 15 clubs and societies for talent development.",
      metrics: "Complete Education",
      icon: <FiUsers size={20} />,
    },
    {
      id: 3,
      color: 'emerald',
      title: "National School Status",
      shortDescription: "Elevated to National School status in April 2026.",
      description: "In recognition of consistent excellence, the Ministry of Education conferred Category One (C1) National School status during our 60th-anniversary celebrations in April 2026.",
      metrics: "National School",
      icon: <FiShield size={20} />,
    },
    {
      id: 4,
      color: 'emerald',
      title: "Modern Facilities",
      shortDescription: "Well-equipped laboratories, computer labs, and library.",
      description: "Well-equipped science laboratories, computer labs, library, and serene learning environment in Matungulu's beautiful landscape with modern boarding facilities.",
      metrics: "Premier Infrastructure",
      icon: <FiGlobe size={20} />,
    }
  ];

  const schoolFeatures = [
    {
      title: "Academic Excellence",
      gradient: "from-emerald-600 to-emerald-500",
      description: "Matungulu Girls maintains outstanding academic performance with consistent high KCSE results. Our dedicated faculty ensures students excel in all subjects.",
      highlight: "Academic Distinction",
      details: ["Mean Score 8.14", "84% University", "Merit Awards", "Science Excellence"],
      metrics: ["8.14 Mean", "254 Uni", "15 A-"],
      icon: <FiAward />,
      isPremium: false
    },
    {
      title: "Experienced Faculty",
      gradient: "from-emerald-600 to-emerald-500",
      description: "Our team comprises qualified educators with specialized training in girl-child education and personalized mentorship.",
      highlight: "Qualified Educators",
      details: ["TSC Certified", "Subject Specialists", "Mentorship", "Training"],
      metrics: ["45 Teachers", "18+ Years", "100% TSC"],
      icon: <FiUsers />,
      isPremium: false
    },
    {
      title: "Modern Learning Environment",
      gradient: "from-emerald-600 to-emerald-500",
      description: "Our campus features well-equipped science laboratories, computer labs, and digital resources in scenic Matungulu.",
      highlight: "Advanced Facilities",
      details: ["3 Science Labs", "2 Computer Labs", "Library", "Sports Fields"],
      metrics: ["3 Labs", "2 Comp Labs", "8,000 Books"],
      icon: <FiMapPin />,
      isPremium: false
    },
    {
      title: "Co-curricular Activities",
      gradient: "from-emerald-600 to-emerald-500",
      description: "We offer diverse extracurricular activities including sports, music, drama, clubs, and leadership programs.",
      highlight: "15+ Activities",
      details: ["Athletics", "Ball Games", "Music & Drama", "Journalism"],
      metrics: ["8 Sports", "15 Clubs", "Events"],
      icon: <FiStar />,
      isPremium: false
    },
    {
      title: "Spiritual & Moral Formation",
      gradient: "from-emerald-600 to-emerald-500",
      description: "As a Christian institution, we emphasize spiritual growth, moral values, and character development.",
      highlight: "Values Education",
      details: ["Christian Teachings", "Character Building", "Community Service", "Retreats"],
      metrics: ["Weekly Mass", "Retreats", "Outreach"],
      icon: <FiHeart />,
      isPremium: false
    },
    {
      title: "University & Career Preparation",
      gradient: "from-emerald-700 to-emerald-600",
      description: "We provide comprehensive career guidance and university linkage programs for smooth transition to higher education.",
      highlight: "University Pathways",
      details: ["Career Counseling", "University Tours", "Alumni Network", "Scholarships"],
      metrics: ["15+ Partners", "Career Fairs", "Success"],
      icon: <FiTrendingUp />,
      isPremium: true
    }
  ];

  const achievements = [
    {
      year: "2026",
      title: "National School Status",
      description: "Elevated to Category One (C1) National School status by Ministry of Education",
      icon: <FiAward className="w-5 h-5" />
    },
    {
      year: "2025",
      title: "Record KCSE Performance",
      description: "Mean score of 8.14 (B plain), 84% university transition rate, 1 A (plain) and 15 A- grades",
      icon: <FiTrendingUp className="w-5 h-5" />
    },
    {
      year: "2025",
      title: "Top County Ranking",
      description: "Best-performing girls' school in category, second-best public school in Machakos County",
      icon: <FiStar className="w-5 h-5" />
    },
    {
      year: "2024",
      title: "Most Improved School",
      description: "Recognized as most improved secondary school in Machakos County",
      icon: <FiTrendingUp className="w-5 h-5" />
    },
    {
      year: "2024",
      title: "National Science Fair",
      description: "Won National Science and Engineering Fair, top position nationally",
      icon: <FiAward className="w-5 h-5" />
    }
  ];

  return (
    <div className="bg-white overflow-hidden">
      
      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-gradient-to-br from-white via-emerald-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column - Text Content */}
    
            {/* Right Column - Image Carousel */}
            <div className="lg:col-span-7">
              <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl group">
                {schoolImages.map((image, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      idx === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                    }`}
                  >
                    <Image 
                      src={image.src} 
                      alt={image.alt} 
                      fill
                      className="object-cover"
                      priority={idx === 0}
                    />
                  </div>
                ))}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Navigation Arrows */}
                <button 
                  onClick={prevImage} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/30 z-10" 
                  aria-label="Previous"
                >
                  <FiChevronLeft size={20} />
                </button>
                <button 
                  onClick={nextImage} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/30 z-10" 
                  aria-label="Next"
                >
                  <FiChevronRight size={20} />
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {schoolImages.map((_, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentImageIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
                      }`} 
                    />
                  ))}
                </div>

                {/* Overlay Text */}
                <div className="absolute bottom-12 left-4 right-4 sm:left-5 sm:right-auto z-10">
                  <div className="backdrop-blur-xl bg-white/10 border border-white/20 px-4 py-3 rounded-xl max-w-xs">
                    <p className="text-white font-black text-sm sm:text-base tracking-tight leading-snug">
                      🏆{schoolName}
                    </p>
                    <p className="text-white/60 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mt-0.5">
                      {motto}
                    </p>
                  </div>
                </div>
              </div>
            </div>
             <div className="lg:col-span-5 space-y-6 sm:space-y-7">
  
  {/* Status Badge */}
  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-200 w-fit">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
    </span>
    <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-emerald-700 uppercase">
      Now a National School (2026)
    </span>
  </div>

  {/* Heading */}
  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
    {loading ? (
      <span className="inline-flex items-center gap-2">
        <FiLoader className="w-5 h-5 animate-spin text-emerald-500" /> Loading...
      </span>
    ) : (
      <>
        {schoolName.split(' ').slice(0, -2).join(' ')}{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
          {schoolName.split(' ').slice(-2).join(' ')}
        </span>
      </>
    )}
  </h1>

  {/* Description (FIXED DARKER TEXT ✅) */}
  <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl font-medium">
    {description ||
      "Located in the heart of Matungulu, Machakos County, we are dedicated to nurturing young women into confident, compassionate, and accomplished leaders through academic excellence and character formation."}
  </p>

  {/* Contact Pills */}


  {/* Stats Grid (MORE RESPONSIVE ✅) */}

  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
    {([
      { label: "Students", value: `${studentCount}+`, icon: <FiUsers className="w-4 h-4" /> },
      { label: "KCSE Mean", value: "8.14", icon: <FiBookOpen className="w-4 h-4" /> },
      { label: "Uni Transition", value: "84%", icon: <FiTrendingUp className="w-4 h-4" /> },
      { label: "Motto", value: motto, icon: <FiTarget className="w-4 h-4" /> },
    ]).map((stat, idx) => (
      <div
        key={idx}
        className="relative p-4 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[90px]"
      >
        <span className="absolute top-2 right-2 text-sm opacity-30">
          {stat.icon}
        </span>

        <p
          className={`font-bold text-emerald-600 leading-tight ${
            stat.label === "Motto"
              ? "text-xs sm:text-sm"
              : "text-lg sm:text-xl md:text-2xl"
          }`}
        >
          {stat.value}
        </p>

        <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-500 mt-1">
          {stat.label}
        </p>
      </div>
    ))}
  </div>

<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

  {/* Location Card */}
  <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-start gap-3">
    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-50">
      <FiMapPin className="text-emerald-600" size={18} />
    </div>
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
        Location
      </p>
      <p className="text-sm font-semibold text-gray-900">
        Matungulu Constituency, Machakos County
      </p>
    </div>
  </div>

  {/* Phone Card */}
  <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-start gap-3">
    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50">
      <FiPhone className="text-blue-600" size={18} />
    </div>
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
        Phone
      </p>
      <p className="text-sm font-semibold text-gray-900">
        {contactPhone || "Add phone number"}
      </p>
    </div>
  </div>

  {/* Email Card */}
  <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-start gap-3">
    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-purple-50">
      <FiMail className="text-purple-600" size={18} />
    </div>
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
        Email
      </p>
      <p className="text-sm font-semibold text-gray-900 break-all">
        matungulugirls@gmail.com
      </p>
    </div>
  </div>

</div>

  {/* CTA Buttons */}
  <div className="flex flex-nowrap gap-3 pt-2 w-full">
    <button
      onClick={handleExplorePathways}
      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold text-sm transition-all active:scale-[0.98] shadow-lg shadow-emerald-600/20"
    >
      Admission <FiArrowRight size={16} />
    </button>

    <button
      onClick={() => router.push("/pages/AboutUs")}
      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-800 rounded-xl font-semibold text-sm transition-all border border-gray-300"
    >
      Discover More
    </button>
  </div>
</div>
          </div>
        </div>
      </section>

      {/* ===== VISION / MISSION / MOTTO STRIP ===== */}
      <section className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {([
              { label: 'Our Motto', value: motto, icon: <FiTarget className="w-5 h-5" /> },
              { label: 'Our Vision', value: vision, icon: <FiEye className="w-5 h-5" /> },
              { label: 'Our Mission', value: mission, icon: <FiBookOpen className="w-5 h-5" /> },
            ]).map((item, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-emerald-200 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">
                    {item.label}
                  </p>
                  <p className="text-white text-sm sm:text-base font-medium leading-relaxed">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ACHIEVEMENTS TIMELINE ===== */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 mb-3">
              Our Journey
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight mb-3">
              Recent Achievements
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              Milestones that showcase our commitment to excellence (2019–2026)
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 sm:left-1/2 transform sm:-translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-emerald-200 via-emerald-300 to-emerald-200"></div>
            
      <div className="space-y-10">
  {achievements.map((item, idx) => (
    <div
      key={idx}
      className={`relative flex flex-col sm:flex-row items-start gap-6 sm:gap-10 ${
        idx % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
      }`}
    >
      {/* Timeline Dot */}
      <div className="absolute left-6 sm:left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-500 border-4 border-white shadow-xl flex items-center justify-center z-10">
        <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
      </div>

      {/* Content */}
      <div
        className={`ml-14 sm:ml-0 ${
          idx % 2 === 0 ? "sm:pr-14 sm:text-right" : "sm:pl-14"
        } sm:w-1/2`}
      >
        <div
          className={`group bg-white/90 backdrop-blur-lg p-6 rounded-2xl border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
            idx % 2 === 0 ? "sm:mr-auto" : "sm:ml-auto"
          }`}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md ${
                idx % 2 === 0 ? "order-first" : "sm:order-last"
              }`}
            >
              {item.icon}
            </div>

            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full tracking-wide">
              {item.year}
            </span>
          </div>

          {/* Title */}
          <h4 className="font-bold text-gray-900 text-base mb-1.5 tracking-tight">
            {item.title}
          </h4>

          {/* Description (DARKER TEXT ✅) */}
          <p className="text-gray-700 text-sm leading-relaxed font-medium">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  ))}
</div>
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-22">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 mb-3">
              Why Choose Us
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight mb-3">
              The Matungulu Advantage
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              Discover what makes Matungulu Girls the premier choice for your daughter's education
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {whyChooseUs.map((item) => {
              const c = colorMap[item.color];
              return (
                <div key={item.id} className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                  {item.image && (
                    <div className="relative h-40 sm:h-48 overflow-hidden">
                      <Image 
                        src={item.image.src} 
                        alt={item.image.alt} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${c.bg} text-white`}>
                        {item.metrics}
                      </span>
                    </div>
                  )}

                  <div className="p-5 sm:p-6">
                    <div className="flex items-start gap-3 mb-3">
                      {!item.image && (
                        <div className={`w-10 h-10 rounded-xl ${c.light} ${c.text} flex items-center justify-center flex-shrink-0`}>
                          {item.icon}
                        </div>
                      )}
                      <h4 className="font-bold text-gray-900 text-base sm:text-lg leading-snug pt-1">
                        {item.title}
                      </h4>
                    </div>

                    <p className="text-gray-500 text-sm leading-relaxed mb-3">
                      {expandedCards[item.id] ? item.description : item.shortDescription}
                    </p>

                    {item.description !== item.shortDescription && (
                      <button 
                        onClick={() => toggleReadMore(item.id)}
                        className={`inline-flex items-center gap-1.5 ${c.text} text-xs font-semibold hover:underline transition-colors`}
                      >
                        {expandedCards[item.id] ? 'Read Less' : 'Read More'}
                        <FiChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${expandedCards[item.id] ? 'rotate-90' : ''}`} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    {/* CBC Pathways & Subjects Section */}
    <section className="relative max-w-7xl bg-gradient-to-br from-slate-50 to-teal-50/30 rounded-2xl md:rounded-3xl border border-slate-200/60 p-5 md:p-10 overflow-hidden">
      {/* Logo watermark */}
      <img src="/hero/MatG1.jpg" alt="" className="absolute right-4 bottom-4 w-28 md:w-40 opacity-[0.03] pointer-events-none select-none" />
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-teal-100 rounded-full mb-2 justify-center w-full">
  <FiBookOpen className="text-teal-800 text-lg sm:text-xl" />
  <span className="text-base sm:text-lg font-extrabold uppercase tracking-wider text-teal-700">CBC Framework</span>
</div>
<h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
    CBC <span className="text-teal-800">Learning Tracks</span> & Subjects
  </h3>
  <p className="text-slate-700 text-lg sm:text-xl mt-2 max-w-2xl mx-auto font-medium">
    The Competency Based Curriculum organizes learning around three main pathways, each tailored to different student strengths and career goals at <span className="text-emerald-700 font-bold">Matungulu</span> Girls.
  </p>
  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm mt-4">
    <IoSparkles className="text-teal-500" />
    <span className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">7 Core Competencies</span>
  </div>
</div>

        {/* CBC Pathways — Numbered Timeline Layout */}
        <div className="space-y-5 mb-8">
          {([
            {
              pathway: 'STEM Pathway',
              icon: IoFlaskOutline,
              color: 'from-blue-600 to-cyan-500',
              accent: 'blue',
              description: 'Science, Technology, Engineering & Mathematics',
              subjects: ['Mathematics', 'Integrated Science', 'Computer Science', 'Pre-Technical Studies', 'Health Education'],
              careers: 'Software Engineer, Medical Doctor, Civil Engineer, Data Scientist, Pharmacist, Architect, Cybersecurity Analyst, Pilot, Agricultural Researcher, Biotechnologist, Quantitative Analyst, Telecommunications Expert, Environmental Scientist, AI Specialist, Mechanical Technician'
            },
            {
              pathway: 'Arts & Sports Pathway',
              icon: IoAccessibilityOutline,
              color: 'from-purple-600 to-pink-500',
              accent: 'purple',
              description: 'Creative Arts, Performing Arts & Athletic Excellence',
              subjects: ['Visual Arts', 'Performing Arts', 'Physical Education', 'Music', 'Creative Design'],
              careers: 'Professional Athlete, Graphic Designer, Music Producer, Film Director, Interior Decorator, Sports Physiotherapist, Fashion Designer, Choreographer, Fine Artist, Photojournalist, Sports Agent, Animator, Theatre Manager, Fitness Consultant, Content Creator'
            },
            {
              pathway: 'Social Sciences Pathway',
              icon: IoNewspaperOutline,
              color: 'from-amber-600 to-orange-500',
              accent: 'amber',
              description: 'Humanities, Languages & Civic Education',
              subjects: ['Social Studies', 'Religious Education', 'Business Studies', 'Languages', 'Life Skills'],
              careers: 'Advocate of the High Court, Diplomat, Economist, Clinical Psychologist, Human Resource Manager, Journalist, International Relations Officer, Sociologist, Public Relations Specialist, Social Worker, Political Scientist, Archaeologist, Translator/Linguist, Historian, Urban Planner'
            }
          ]).map((path, idx) => {
            const PathIcon = path.icon;
            const isDark = idx === 1;
            return (
              <div key={idx} className={`flex flex-col md:flex-row rounded-2xl overflow-hidden border transition-all hover:shadow-lg ${
                isDark ? 'bg-slate-900 border-slate-700/50' : 'bg-white border-slate-200'
              }`}>
                {/* Left number strip */}
                <div className={`flex md:flex-col items-center justify-center gap-2 px-4 py-4 md:px-6 md:py-0 md:min-w-[70px] bg-gradient-to-b ${path.color}`}>
                  <span className="text-3xl md:text-4xl font-black text-white/95">0{idx + 1}</span>
                </div>
                
                {/* Content */}
                <div className="flex-1 p-5 md:p-7 space-y-5">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}>
                        <PathIcon className={`text-xl ${isDark ? 'text-white' : 'text-slate-700'}`} />
                    </div>
                    <div>
                      <h4 className={`font-bold text-base md:text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{path.pathway}</h4>
                      <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>{path.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {path.subjects.map((subj, i) => (
                      <span key={i} className={`px-2.5 py-1 rounded-md text-[11px] md:text-xs font-semibold border ${
                        isDark ? 'bg-white/5 text-slate-300 border-white/10' : 'bg-slate-50 text-slate-700 border-slate-100'
                      }`}>
                        {subj}
                      </span>
                    ))}
                  </div>
                  
                  <div className={`pt-4 border-t ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>Potential Career Outcomes</p>
                    <p className={`text-xs md:text-sm font-medium leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {path.careers}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CBC Core Subjects Row */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <FiLayers className="text-white text-sm" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">CBC Core Subjects (Mandatory for All Pathways)</h4>
              <p className="text-[10px] text-slate-900">Every student takes these foundational subjects</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {([
              { name: 'English', icon: FiBook },
              { name: 'Kiswahili', icon: FiGlobe },
              { name: 'Mathematics', icon: FiCpu },
              { name: 'Integrated Science', icon: FiActivity },
              { name: 'Social Studies', icon: FiUsers },
              { name: 'Religious Education', icon: FiHeart },
              { name: 'Creative Arts', icon: FiPenTool },
              { name: 'Agriculture', icon: FiDroplet },
              { name: 'Life Skills', icon: FiStar },
              { name: 'Physical Education', icon: FiTarget }
            ]).map((subj, i) => {
              const SubjIcon = subj.icon;
              return (
                <div key={i} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <SubjIcon className="text-teal-800 text-sm shrink-0" />
                  <span className="text-[10px] md:text-xs font-semibold text-slate-700 truncate">{subj.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>

      {/* ===== EDUCATIONAL PILLARS - BENTO GRID ===== */}
<section className="bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
    
    {/* Header */}
    <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
      <span className="inline-block text-sm font-extrabold uppercase tracking-[0.2em] text-emerald-700 mb-3">
        Our Foundation
      </span>

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
        Educational Pillars
      </h2>

      <p className="text-gray-700 text-base sm:text-lg font-medium">
        Building academic excellence, strong character, and future-ready skills
      </p>
    </div>

    {/* Grid */}
    <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
      {schoolFeatures.map((feature, index) => {
        const spans = [
          "md:col-span-3",
          "md:col-span-3",
          "md:col-span-2",
          "md:col-span-2",
          "md:col-span-2",
          "md:col-span-6",
        ];

        const isDark = feature.isPremium;

        return (
          <div
            key={index}
            className={`${spans[index] || "md:col-span-2"} relative overflow-hidden ${
              isDark
                ? "bg-gradient-to-br from-emerald-900 to-teal-900 text-white"
                : "bg-white text-gray-900"
            } border ${
              isDark ? "border-emerald-800" : "border-gray-200"
            } rounded-2xl p-6 group hover:border-emerald-400 transition-all duration-300 shadow-sm hover:shadow-lg`}
          >
            {/* Background glow */}
            <div
              className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-[0.05] group-hover:opacity-15 transition-opacity rounded-bl-full`}
            ></div>

            <div className="relative z-10 flex flex-col h-full">
              
              {/* Icon */}
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-md mb-4`}
              >
                {feature.icon &&
                  React.cloneElement(feature.icon, {
                    className: "w-6 h-6",
                  })}
              </div>

              {/* Content */}
              <div className="mb-4">
                <span
                  className={`text-[10px] font-extrabold ${
                    isDark ? "text-emerald-300" : "text-emerald-700"
                  } uppercase tracking-widest mb-1 block`}
                >
                  {feature.highlight}
                </span>

                <h4 className="text-lg sm:text-xl font-extrabold tracking-tight leading-snug mb-2">
                  {feature.title}
                </h4>

                {/* ✅ DARKER + BIGGER DESCRIPTION */}
                <p
                  className={`${
                    isDark ? "text-white/90" : "text-gray-800"
                  } text-sm sm:text-base font-medium leading-relaxed line-clamp-3`}
                >
                  {feature.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-auto pt-3">
                {feature.details.map((detail, dIdx) => (
                  <span
                    key={dIdx}
                    className={`px-3 py-1 ${
                      isDark
                        ? "bg-emerald-800 text-emerald-100"
                        : "bg-gray-100 text-gray-700"
                    } border ${
                      isDark ? "border-emerald-700" : "border-gray-200"
                    } rounded-full text-[10px] font-semibold uppercase`}
                  >
                    {detail}
                  </span>
                ))}
              </div>


              {/* Metrics */}
              <div
                className={`mt-5 flex items-center justify-between border-t ${
                  isDark ? "border-emerald-800" : "border-gray-200"
                } pt-3`}
              >
                {feature.metrics.map((metric, mIdx) => (
                  <div key={mIdx} className="text-center">
                    <p
                      className={`text-sm font-extrabold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {metric.split(" ")[0]}
                    </p>
                    <p
                      className={`text-[10px] ${
                        isDark ? "text-emerald-300" : "text-gray-600"
                      } font-semibold uppercase tracking-wide`}
                    >
                      {metric.split(" ").slice(1).join(" ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</section>

      {/* ===== UNIVERSITY PARTNERS ===== */}
      <section className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 block mb-2">
              Our Partners
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900">
              University{" "}
              <span className="bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                Collaborations
              </span>
            </h3>
            <p className="mt-4 text-gray-600 text-sm sm:text-base max-w-3xl mx-auto">
              We bridge the gap between secondary education and the professional world through 
              strong alliances with top-tier universities.
            </p>
          </div>

          {imagesLoading ? (
            <div className="text-center text-gray-400 py-8">
              <FiLoader className="w-8 h-8 animate-spin mx-auto mb-2" />
              Loading university partners...
            </div>
          ) : uniImages.length > 0 ? (
            <div className="relative overflow-hidden">
              <div
                className="flex gap-8 animate-marquee"
                style={{
                  animation: 'marquee 120s linear infinite',
                  width: 'max-content',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = 'paused')}
                onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = 'running')}
              >
                {scrollImages.map((img, idx) => (
                  <div key={idx} className="relative w-32 h-20 flex-shrink-0 bg-white rounded-xl shadow-sm p-2 hover:shadow-md transition-shadow">
                    <Image
                      src={img}
                      alt={`University logo ${idx}`}
                      fill
                      className="object-contain p-1"
                      sizes="128px"
                      onError={(e) => {
                        const parent = e.currentTarget.parentElement;
                        if (parent) parent.style.display = 'none';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              No university logos found
            </div>
          )}
        </div>
      </section>

   
      {/* Marquee Animation Style */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 120s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ModernSchoolLayout;