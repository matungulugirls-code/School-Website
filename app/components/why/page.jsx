"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  FiCheckCircle,  // ← ADD THIS (missing)
  FiExternalLink,
  FiLayers,
  FiCpu,
  FiActivity,
  FiPenTool,
  FiDroplet,
  FiX,            // ← ADD THIS (missing)
} from "react-icons/fi";
import {
  IoSparkles,
  IoFlaskOutline,
  IoAccessibilityOutline,
  IoNewspaperOutline,
} from "react-icons/io5";

const ModernSchoolLayout = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [schoolData, setSchoolData] = useState(null);
  const [uniImages, setUniImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expandedCards, setExpandedCards] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPathway, setSelectedPathway] = useState(null);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [achievementModalOpen, setAchievementModalOpen] = useState(false);

  // Add these state variables
const [achievementsData, setAchievementsData] = useState(null);
const [schoolStatsData, setSchoolStatsData] = useState(null);
const [achievementsLoading, setAchievementsLoading] = useState(true);
const [statsLoading, setStatsLoading] = useState(false);
  // School images for carousel
  const schoolImages = [
    { src: "/Matungulu/29.jpeg", alt: "Matungulu Girls Campus" },
    { src: "/Matungulu/2.jpeg", alt: "Matungulu Girls" },
    { src: "/Matungulu/30.jpeg", alt: "Matungulu Girls Senior School" },
   { src: "/Matungulu/3.jpeg", alt: "Matungulu Girls Senior School" },
    { src: "/Matungulu/4.jpeg", alt: "Matungulu Girls Senior School" },
    { src: "/Matungulu/5.jpeg", alt: "Matungulu Girls Senior School" },
    { src: "/Matungulu/6.jpeg", alt: "Matungulu Girls Senior School" },
    { src: "/Matungulu/7.jpeg", alt: "Matungulu Girls Senior School" },
    { src: "/Matungulu/8.jpeg", alt: "Matungulu Girls Senior School" },
    { src: "/Matungulu/9.jpeg", alt: "Matungulu Girls Senior School" },
    { src: "/Matungulu/10.jpeg", alt: "Matungulu Girls Senior School" },
    { src: "/Matungulu/11.jpeg", alt: "Matungulu Girls Senior School" },
    { src: "/Matungulu/12.jpeg", alt: "Matungulu Girls Senior School" },
    { src: "/Matungulu/13.jpeg", alt: "Matungulu Girls Senior School" },
    { src: "/Matungulu/14.jpeg", alt: "Matungulu Girls Senior School" },
    { src: "/Matungulu/15.jpeg", alt: "Matungulu Girls Senior School" },
    { src: "/Matungulu/16.jpeg", alt: "Matungulu Girls Senior School" },
    { src: "/Matungulu/17.jpeg", alt: "Matungulu Girls Senior School" },
    { src: "/Matungulu/18.jpeg", alt: "Matungulu Girls Senior School" },
    { src: "/Matungulu/19.jpeg", alt: "Matungulu Girls Senior School" },


  ];

  // Fetch school data
  useEffect(() => {
    fetch("/api/school")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.school) setSchoolData(data.school);
      })
      .catch((err) => console.error("Error fetching school data:", err))
      .finally(() => setLoading(false));
  }, []);

  // Fetch university logos
  useEffect(() => {
    fetch("/api/unis")
      .then((res) => res.json())
      .then((data) => {
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
      setCurrentImageIndex((prev) => (prev + 1) % schoolImages.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [schoolImages.length]);

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % schoolImages.length);
  const prevImage = () =>
    setCurrentImageIndex(
      (prev) => (prev - 1 + schoolImages.length) % schoolImages.length
    );

  const toggleReadMore = (id) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExplorePathways = () => {
    router.push("/pages/admissions");
  };

  const openModal = (pathway) => {
    setSelectedPathway(pathway);
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPathway(null);
    document.body.style.overflow = "auto";
  };

  const schoolName = schoolData?.name || "Matungulu Girls Senior School";
  const motto = schoolData?.motto || "Committed to Excellence";
  const vision =
    schoolData?.vision ||
    "To be a center of excellence in nurturing holistic, God-fearing, and academically empowered young women for global leadership.";
  const mission =
    schoolData?.mission ||
    "To provide quality education that fosters academic excellence, moral integrity, and personal growth in a supportive Christian environment.";
  const description = schoolData?.description;
  const studentCount = schoolData?.studentCount || 1200;
  const contactEmail = schoolData?.admissionContactEmail || "matungulugirls@gmial.com";
  const contactPhone = schoolData?.admissionContactPhone || "0734610130";

  // Double images for seamless scrolling
  const scrollImages = [...uniImages, ...uniImages];




  const openAchievementModal = (achievement) => {
  setSelectedAchievement(achievement);
  setAchievementModalOpen(true);
  document.body.style.overflow = "hidden";
};

const closeAchievementModal = () => {
  setAchievementModalOpen(false);
  setSelectedAchievement(null);
  document.body.style.overflow = "auto";
};




// Fetch achievements and school stats
useEffect(() => {
  const fetchAchievementsAndStats = async () => {
    try {
      // Fetch achievements
      const achievementsRes = await fetch('/api/achievements');
      const achievementsResult = await achievementsRes.json();
      
      if (achievementsResult.success) {
        setAchievementsData(achievementsResult);
      } else {
        console.warn('Failed to fetch achievements from API');
        setAchievementsData(null);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
      setAchievementsData(null);
    } finally {
      setAchievementsLoading(false);
    }

    try {
      // Fetch school stats
      const statsRes = await fetch('/api/school-stats');
      const statsResult = await statsRes.json();
      
      if (statsResult.success && statsResult.stats) {
        setSchoolStatsData(statsResult.stats);
      } else {
        console.warn('No school stats found, using fallback');
        setSchoolStatsData(null);
      }
    } catch (error) {
      console.error('Error fetching school stats:', error);
      setSchoolStatsData(null);
    } finally {
      setStatsLoading(false);
    }
  };

  fetchAchievementsAndStats();
}, []);





// Helper function to get achievements from the API response
const getAchievements = () => {
  const apiAchievements = Array.isArray(achievementsData?.allAchievements)
    ? achievementsData.allAchievements
    : Object.values(achievementsData?.achievements || {}).flat().filter(Boolean);

  return apiAchievements
    .map((achievement) => {
      const firstImage = Array.isArray(achievement.images) ? achievement.images[0] : null;
      const imageUrl = typeof firstImage === 'string' ? firstImage : firstImage?.url;
      const highlights = Array.isArray(achievement.recipients)
        ? achievement.recipients
            .map((recipient) => {
              if (typeof recipient === 'string') return recipient;
              return recipient?.name || recipient?.fullName || recipient?.title || '';
            })
            .filter(Boolean)
        : [];

      return {
        ...achievement,
        year: achievement.year?.toString() || '',
        title: achievement.title || '',
        shortDescription: achievement.description ? `${achievement.description.substring(0, 100)}...` : '',
        description: achievement.description || '',
        impact: achievement.awardingBody || 'Achievement',
        stats: `${achievement.category || 'Achievement'} | ${achievement.year || ''}`,
        icon: getCategoryIcon(achievement.category),
        image: imageUrl || "/hero/MatG1.jpg",
        highlights
      };
    })
    .sort((a, b) => Number(b.year || 0) - Number(a.year || 0))
    .slice(0, 5);
};



// Helper to get category icon
const getCategoryIcon = (category) => {
  const icons = {
    'Academic': <FiAward className="w-5 h-5" />,
    'Sports': <FiAward className="w-5 h-5" />,
    'Arts': <FiAward className="w-5 h-5" />,
    'Leadership': <FiStar className="w-5 h-5" />,
    'Other': <FiAward className="w-5 h-5" />
  };
  return icons[category] || <FiAward className="w-5 h-5" />;
};

// Helper function to get school stats (API data or fallback)
const getSchoolStats = () => {
  if (schoolStatsData) {
    return {
      meanScore: schoolStatsData.meanScore || 8.14,
      lastYearMean: schoolStatsData.lastYearMean || 7.85,
      targetMean: schoolStatsData.targetMean || 8.50,
      slogan: schoolStatsData.slogan || motto,
      sloganDescription: schoolStatsData.sloganDescription || '',
      sloganAuthor: schoolStatsData.sloganAuthor || ''
    };
  }
  
  // Fallback stats
  return {
    meanScore: 8.14,
    lastYearMean: 7.85,
    targetMean: 8.50,
    slogan: motto,
    sloganDescription: '',
    sloganAuthor: ''
  };
};




  const colorMap = {
    emerald: {
      bg: "bg-emerald-600",
      light: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-200",
    },
    blue: {
      bg: "bg-blue-600",
      light: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-200",
    },
  };

  const whyChooseUs = [
    {
      id: 1,
      color: "emerald",
      title: "Academic Excellence",
      shortDescription:
        "Consistently ranked among top-performing girls' schools in Machakos County.",
      description:
        "Consistently ranked among top-performing girls' schools in Machakos County with impressive KCSE results and university placements. Our students achieve mean scores above 8.0 with over 80% qualifying for direct university entry.",
      metrics: "Top Performer",
      icon: <FiAward size={20} />,
      image: "/Matungulu/7.jpeg",
    },
    {
      id: 2,
      color: "emerald",
      title: "Holistic Development",
      shortDescription:
        "Balancing academic rigor with spiritual growth and co-curricular activities.",
      description:
        "Balancing academic rigor with spiritual growth, sports, music, drama, and leadership programs for well-rounded individuals. We offer over 15 clubs and societies for talent development.",
      metrics: "Complete Education",
      icon: <FiUsers size={20} />,
      image: "/Matungulu/22.jpeg",
    },
    {
      id: 3,
      color: "emerald",
      title: "National School Status",
      shortDescription:
        "Elevated to National School status in April 2026.",
      description:
        "In recognition of consistent excellence, the Ministry of Education conferred Category One (C1) National School status during our 60th-anniversary celebrations in April 2026.",
      metrics: "National School",
      icon: <FiShield size={20} />,
      image: "/Matungulu/21.jpeg",
    },
    {
      id: 4,
      color: "emerald",
      title: "Modern Facilities",
      shortDescription: "Well-equipped laboratories, computer labs, and library.",
      description:
        "Well-equipped science laboratories, computer labs, library, and serene learning environment in Matungulu's beautiful landscape with modern boarding facilities.",
      metrics: "Premier Infrastructure",
      icon: <FiGlobe size={20} />,
      image: "/Matungulu/30.jpeg",
    },
  ];

  const schoolFeatures = [
  {
  title: "Academic Excellence",
  gradient: "from-emerald-600 to-emerald-500",
  description:
    "Matungulu Girls fosters a culture of academic excellence through holistic learning, critical thinking, and consistent student growth across all disciplines.",
  highlight: "Excellence in Learning",
  details: ["Holistic Education", "Critical Thinking", "Student Growth", "Strong Academic Culture"],
  metrics: ["8.0+ Mean", "80%+ Uni", "90% Pass"],
  icon: <FiAward />,
  isPremium: false,
},
    {
      title: "Experienced Faculty",
      gradient: "from-emerald-600 to-emerald-500",
      description:
        "Our team comprises qualified educators with specialized training in girl-child education and personalized mentorship.",
      highlight: "Qualified Educators",
      details: ["TSC Certified", "Subject Specialists", "Mentorship", "Training"],
      metrics: ["45 Teachers", "18+ Years", "100% TSC"],
      icon: <FiUsers />,
      isPremium: false,
    },
    {
      title: "Modern Learning Environment",
      gradient: "from-emerald-600 to-emerald-500",
      description:
        "Our School features well-equipped science laboratories, computer labs, and digital resources in scenic Matungulu.",
      highlight: "Advanced Facilities",
      details: ["3 Science Labs", "2 Computer Labs", "Library", "Sports Fields"],
      metrics: ["3 Labs", "2 Comp Labs", "8,000 Books"],
      icon: <FiMapPin />,
      isPremium: false,
    },
    {
      title: "Co-curricular Activities",
      gradient: "from-emerald-600 to-emerald-500",
      description:
        "We offer diverse extracurricular activities including sports, music, drama, clubs, and leadership programs.",
      highlight: "15+ Activities",
      details: ["Athletics", "Ball Games", "Music & Drama", "Journalism"],
      metrics: ["8 Sports", "15 Clubs", "Events"],
      icon: <FiStar />,
      isPremium: false,
    },
    {
      title: "Spiritual & Moral Formation",
      gradient: "from-emerald-600 to-emerald-500",
      description:
        "As a Christian institution, we emphasize spiritual growth, moral values, and character development.",
      highlight: "Values Education",
      details: ["Christian Teachings", "Character Building", "Community Service", "Retreats"],
      metrics: ["Weekly Mass", "Retreats", "Outreach"],
      icon: <FiHeart />,
      isPremium: false,
    },
    {
      title: "University & Career Preparation",
      gradient: "from-emerald-700 to-emerald-600",
      description:
        "We provide comprehensive career guidance and university linkage programs for smooth transition to higher education.",
      highlight: "University Pathways",
      details: ["Career Counseling", "University Tours", "Alumni Network", "Scholarships"],
      metrics: ["15+ Partners", "Career Fairs", "Success"],
      icon: <FiTrendingUp />,
      isPremium: true,
    },
  ];

  // CBC Pathways Data
  const pathways = [
 {
  id: "stem",
  name: "STEM Pathway",
  icon: IoFlaskOutline,
  color: "from-blue-600 to-cyan-500",
  description: "Science, Technology, Engineering & Mathematics",
  subjects: ["Maths", "Integrated Science", "Computer Science", "Pre-Tech", "Health Ed"],
  careers: [
    "Medical Doctor",
    "Surgeon",
    "Pediatrician",
    "Cardiologist",
    "Neurologist",
    "Pharmacist",
    "Clinical Pharmacologist",
    "Nursing Officer",
    "Registered Nurse (RN)",
    "Nurse Anesthetist",
    "Dentist",
    "Orthodontist",
    "Veterinarian",
    "Radiologist",
    "Medical Lab Scientist",
    "Laboratory Technician",
    "Public Health Officer",
    "Epidemiologist",
    "Physiotherapist",
    "Occupational Therapist",
    "Speech Therapist",
    "Nutritionist / Dietitian",
    "Optometrist",
    "Audiologist",

    // Engineering
    "Civil Engineer",
    "Structural Engineer",
    "Mechanical Engineer",
    "Electrical Engineer",
    "Electronic Engineer",
    "Chemical Engineer",
    "Biomedical Engineer",
    "Aerospace Engineer",
    "Automotive Engineer",
    "Petroleum Engineer",
    "Mining Engineer",
    "Geotechnical Engineer",
    "Environmental Engineer",
    "Agricultural Engineer",
    "Food Process Engineer",
    "Textile Engineer",
    "Marine Engineer",
    "Robotics Engineer",
    "Mechatronics Engineer",
    "Instrumentation Engineer",

    // Technology & Computing
    "Software Engineer",
    "Web Developer",
    "Mobile App Developer",
    "Game Developer",
    "Data Scientist",
    "Data Analyst",
    "Database Administrator",
    "Cybersecurity Expert",
    "Network Engineer",
    "Cloud Architect",
    "DevOps Engineer",
    "AI / Machine Learning Engineer",
    "IT Project Manager",
    "Systems Analyst",
    "IT Support Specialist",
    "Embedded Systems Engineer",
    "UI/UX Designer (Tech-focused)",
    "Blockchain Developer",

    // Physical & Natural Sciences
    "Physicist",
    "Astronomer",
    "Astrophysicist",
    "Chemist",
    "Analytical Chemist",
    "Industrial Chemist",
    "Biochemist",
    "Molecular Biologist",
    "Microbiologist",
    "Geneticist",
    "Biotechnologist",
    "Geologist",
    "Seismologist",
    "Volcanologist",
    "Meteorologist",
    "Oceanographer",
    "Environmental Scientist",
    "Forensic Scientist",
    "Materials Scientist",
    "Nanotechnologist",

    // Mathematics & Data
    "Mathematician",
    "Statistician",
    "Actuary",
    "Quantitative Analyst",
    "Operations Researcher",
    "Econometrician",
    "Cryptographer",
    "Data Engineer",

    // Architecture & Design
    "Architect",
    "Landscape Architect",
    "Urban Planner",
    "Interior Designer (Tech/Arch background)",
    "Quantity Surveyor",
    "Construction Manager",

    // Agriculture & Environment
    "Agricultural Scientist",
    "Agronomist",
    "Crop Scientist",
    "Soil Scientist",
    "Horticulturist",
    "Fisheries Scientist",
    "Forestry Scientist",
    "Wildlife Biologist",
    "Conservation Scientist",
    "Climate Change Analyst",

    // Transport & Aviation
    "Pilot (Commercial/Aviation)",
    "Aircraft Maintenance Engineer",
    "Air Traffic Controller",
    "Drone Operator / Engineer",
    "Locomotive Engineer",
    "Marine Navigator",

    // Emerging & Interdisciplinary STEM
    "Bioinformatician",
    "Clinical Research Associate",
    "Genomic Counselor",
    "Renewable Energy Engineer",
    "Solar Energy Technician",
    "Wind Energy Engineer",
    "Nuclear Engineer",
    "Space Scientist",
    "Remote Sensing Specialist",
    "GIS Analyst",
    "Patent Examiner (STEM field)",
    "Science Communicator / Writer",
    "STEM Educator / Teacher"
  ],
},
 {
  id: "arts",
  name: "Arts & Sports",
  icon: IoAccessibilityOutline,
  color: "from-purple-600 to-pink-500",
  description: "Creative Arts, Performing Arts & Athletic Excellence",
  subjects: ["Visual Arts", "Music", "PE", "Creative Design", "Performing Arts"],
  careers: [
    // Visual Arts & Design
    "Graphic Designer",
    "Fashion Designer",
    "Interior Designer",
    "Fine Artist",
    "Sculptor",
    "UI/UX Designer",
    "Industrial Designer",
    "Architectural Illustrator",
    "Art Director",
    "Concept Artist",
    "Illustrator",
    "Calligrapher",
    "Textile Designer",
    "Jewelry Designer",
    "Curator",
    "Art Gallery Manager",
    "Art Restorer",
    "Ceramist",
    "Landscape Designer",
    "Exhibition Designer",

    // Performing Arts & Music
    "Music Producer",
    "Film Director",
    "Actor",
    "Dancer",
    "Choreographer",
    "Voice Actor",
    "Singer / Vocalist",
    "Orchestra Conductor",
    "Composer",
    "Sound Engineer",
    "Music Therapist",
    "Theatre Manager",
    "Scriptwriter",
    "Stage Manager",
    "Lighting Designer",
    "Costume Designer",
    "Makeup Artist (Film/Theatre)",
    "Talent Agent",
    "Cinematographer",
    "Film Editor",

    // Sports, Fitness & Athletics
    "Professional Athlete",
    "Sports Coach",
    "Fitness Trainer",
    "Sports Psychologist",
    "Athletic Trainer",
    "Sports Physiotherapist",
    "Referee / Umpire",
    "Sports Statistician",
    "Gym Manager",
    "Sports Scout",
    "Kinesiologist",
    "Sports Nutritionist",
    "Yoga Instructor",
    "Personal Trainer",
    "Physical Education Teacher",
    "Outdoor Education Guide",
    "Sports Agent",
    "Recreation Director",
    "Stunt Coordinator",

    // Media, Journalism & Digital Arts
    "Sports Journalist",
    "Photojournalist",
    "Animator",
    "Game Designer",
    "VFX Artist",
    "Digital Content Creator",
    "Video Editor",
    "Creative Director",
    "Advertising Manager",
    "Event Manager",
    "Public Relations Specialist",
    "Social Media Manager",
    "Podcast Producer",
    "Multimedia Artist",
    "Brand Identity Developer",
    "Copywriter",
    "Arts Administrator",
    "Broadcasting Presenter",
    "Sports Commentator",
    "Tourism & Cultural Officer"
  ],
},
 {
  id: "social",
  name: "Social Sciences",
  icon: IoNewspaperOutline,
  color: "from-amber-600 to-orange-500",
  description: "Humanities, Languages & Civic Education",
  subjects: ["Social Studies", "Religious Ed", "Business", "Languages", "Life Skills"],
  careers: [
    // ========== LAW & GOVERNANCE ==========
    "Advocate / Lawyer",
    "Judge / Magistrate",
    "Prosecutor",
    "Legal Researcher",
    "Paralegal",
    "Legal Secretary",
    "Diplomat",
    "Foreign Service Officer",
    "Intelligence Officer",
    "Immigration Officer",
    "Customs Officer",
    "Probation Officer",
    "Correctional Officer",
    "Parliamentary Clerk",
    "Legislative Aide",
    "Policy Analyst",
    "Government Administrator",
    "Cabinet Secretary (Advisor role)",
    "Ombudsman",
    "Election Officer",

    // ========== BUSINESS & FINANCE ==========
    "Accountant (CPA)",
    "Auditor",
    "Financial Analyst",
    "Investment Banker",
    "Stockbroker",
    "Credit Analyst",
    "Loan Officer",
    "Insurance Underwriter",
    "Actuary (Business side)",
    "Tax Consultant",
    "Payroll Manager",
    "Budget Analyst",
    "Treasury Manager",
    "Risk Manager",
    "Compliance Officer",
    "Forensic Accountant",
    "Business Development Manager",
    "Entrepreneur",
    "Small Business Owner",
    "Franchise Manager",
    "Retail Manager",
    "Supply Chain Manager",
    "Logistics Coordinator",
    "Procurement Officer",
    "Warehouse Manager",
    "E-commerce Manager",
    "Digital Marketer",
    "SEO Specialist",
    "Brand Manager",
    "Advertising Executive",
    "Marketing Research Analyst",
    "Sales Manager",
    "Real Estate Agent",
    "Property Manager",
    "Valuer",

    // ========== HUMAN RESOURCES ==========
    "HR Manager",
    "Recruitment Specialist",
    "Talent Acquisition Officer",
    "Training & Development Officer",
    "Performance Manager",
    "Compensation Analyst",
    "Employee Relations Specialist",
    "HR Generalist",
    "Payroll Administrator",
    "Organizational Psychologist",
    "Labor Relations Officer",
    "Union Representative",
    "Career Counselor",

    // ========== PSYCHOLOGY & COUNSELING ==========
    "Psychologist (Clinical)",
    "Counseling Psychologist",
    "Educational Psychologist",
    "Industrial Psychologist",
    "Sports Psychologist",
    "Forensic Psychologist",
    "Child Psychologist",
    "School Counselor",
    "Guidance Counselor",
    "Marriage & Family Therapist",
    "Addiction Counselor",
    "Trauma Counselor",
    "Rehabilitation Counselor",
    "Crisis Hotline Operator",
    "Mental Health Technician",

    // ========== SOCIOLOGY & SOCIAL WORK ==========
    "Sociologist",
    "Social Worker",
    "Community Development Officer",
    "NGO Program Officer",
    "Humanitarian Aid Worker",
    "Case Manager",
    "Child Protection Officer",
    "Gender Equality Officer",
    "Disability Rights Advocate",
    "Elderly Care Coordinator",
    "Homeless Shelter Manager",
    "Refugee Resettlement Officer",
    "Poverty Alleviation Specialist",
    "Rural Development Officer",
    "Urban Community Organizer",

    // ========== CRIMINOLOGY & SECURITY ==========
    "Criminologist",
    "Police Officer",
    "Detective / Investigator",
    "Crime Scene Analyst",
    "Forensic Psychologist (Criminal)",
    "Correctional Counselor",
    "Juvenile Justice Officer",
    "Private Investigator",
    "Security Manager",
    "Loss Prevention Officer",
    "Cybercrime Analyst (Policy side)",
    "Victim Advocate",
    "Court Liaison",

    // ========== ECONOMICS & DEVELOPMENT ==========
    "Economist",
    "Development Economist",
    "Agricultural Economist",
    "Environmental Economist",
    "Health Economist",
    "Labor Economist",
    "Monetary Policy Analyst",
    "Central Bank Officer",
    "Trade Analyst",
    "International Trade Specialist",
    "WTO Affairs Officer",
    "Economic Researcher",
    "Statistician (Social stats)",
    "Demographer",
    "Population Analyst",
    "Project Planner",
    "Monitoring & Evaluation Officer",
    "Impact Assessment Specialist",

    // ========== JOURNALISM & MEDIA ==========
    "Journalist",
    "News Reporter",
    "Investigative Journalist",
    "Broadcast Journalist",
    "News Anchor",
    "Radio Presenter",
    "TV Producer",
    "Editor",
    "Copywriter",
    "Content Creator",
    "Social Media Manager",
    "Digital Content Strategist",
    "Public Relations Officer (PRO)",
    "Corporate Communications Manager",
    "Press Secretary",
    "Media Relations Specialist",
    "Communications Officer",
    "Blogger",
    "Podcaster",
    "Documentary Filmmaker",

    // ========== LANGUAGES & TRANSLATION ==========
    "Translator",
    "Interpreter (Simultaneous)",
    "Court Interpreter",
    "Medical Interpreter",
    "Localization Specialist",
    "Language Teacher",
    "Linguist",
    "Lexicographer (Dictionary maker)",
    "Proofreader",
    "Editor (Publications)",
    "Technical Writer",
    "Grant Writer",
    "Speechwriter",
    "Copy Editor",

    // ========== ARCHIVES & LIBRARY ==========
    "Archivist",
    "Librarian",
    "Digital Archivist",
    "Records Manager",
    "Museum Curator",
    "Heritage Manager",
    "Conservator",
    "Documentation Officer",
    "Information Officer",
    "Knowledge Manager",

    // ========== EDUCATION & TRAINING ==========
    "Teacher (Primary/Secondary)",
    "Lecturer (University)",
    "Curriculum Developer",
    "Education Officer",
    "School Administrator",
    "Principal",
    "Education Inspector",
    "Special Needs Educator",
    "Adult Education Trainer",
    "Vocational Trainer",
    "E-learning Designer",
    "Educational Consultant",
    "Tuition Center Owner",

    // ========== POLITICAL SCIENCE & PUBLIC POLICY ==========
    "Political Scientist",
    "Public Policy Analyst",
    "Legislative Analyst",
    "Campaign Manager",
    "Political Consultant",
    "Lobbyist",
    "Public Affairs Officer",
    "City Planner",
    "Regional Planner",
    "Transportation Planner",
    "Environmental Policy Advisor",
    "Health Policy Analyst",
    "Education Policy Researcher",
    "Housing Policy Specialist",

    // ========== GEOGRAPHY & URBAN PLANNING ==========
    "Urban Planner",
    "Regional Planner",
    "Transportation Planner",
    "Land Use Planner",
    "Geographer (Human)",
    "Cartographer (Social mapping)",
    "GIS Analyst (Social applications)",
    "Community Planner",
    "Housing Officer",
    "Zoning Inspector",
    "Real Estate Developer (Planning side)",

    // ========== RELIGIOUS & ETHICAL STUDIES ==========
    "Religious Leader (Pastor/Imam/Priest/Rabbi)",
    "Theologian",
    "Ethicist",
    "Chaplain (Hospital/Military/Prison)",
    "Religious Education Teacher",
    "Missionary",
    "Interfaith Coordinator",
    "Nonprofit Director (Faith-based)",
    "Ethics Committee Member",

    // ========== TOURISM & HOSPITALITY (Social side) ==========
    "Tour Guide",
    "Travel Agent",
    "Tour Operator",
    "Hotel Manager",
    "Event Planner",
    "Conference Organizer",
    "Cultural Officer",
    "Ecotourism Coordinator",
    "Heritage Site Manager",
    "Museum Guide",
    "Guest Relations Officer",

    // ========== INTERNATIONAL RELATIONS ==========
    "International Relations Officer",
    "UN Program Officer",
    "NGO Country Director",
    "Peace Corps Volunteer (Coordinator)",
    "Conflict Resolution Specialist",
    "Mediation Expert",
    "Human Rights Officer",
    "Refugee Protection Officer",
    "International Development Consultant",
    "Global Health Policy Advisor",
  ],
},
  ];

  const timelineAchievements = getAchievements();

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
                      idx === currentImageIndex
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-105"
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
                        idx === currentImageIndex
                          ? "w-6 bg-white"
                          : "w-1.5 bg-white/40 hover:bg-white/70"
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
                    <FiLoader className="w-5 h-5 animate-spin text-emerald-500" />{" "}
                    Loading...
                  </span>
                ) : (
                  <>
                    {schoolName.split(" ").slice(0, -2).join(" ")}{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                      {schoolName.split(" ").slice(-2).join(" ")}
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
  {(() => {
    const stats = getSchoolStats();
    const statItems = [
      {
        label: "Students",
        value: `${studentCount}+`,
        icon: <FiUsers className="w-4 h-4" />,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        label: "KCSE Mean",
        value: stats.meanScore?.toFixed(2) || "8.14",
        icon: <FiBookOpen className="w-4 h-4" />,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        trend: stats.lastYearMean ? (
          <span className={`text-[10px] font-bold ml-1 ${
            (stats.meanScore || 0) > (stats.lastYearMean || 0) 
              ? 'text-green-600' 
              : 'text-red-600'
          }`}>
            {(stats.meanScore || 0) > (stats.lastYearMean || 0) ? '↑' : '↓'}
          </span>
        ) : null,
      },
      {
        label: "Target Mean",
        value: stats.targetMean?.toFixed(2) || "8.50",
        icon: <FiTarget className="w-4 h-4" />,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        progress: stats.meanScore && stats.targetMean ? (
          <span className="text-[10px] font-bold ml-1 text-amber-600">
            {((stats.meanScore / stats.targetMean) * 100).toFixed(0)}%
          </span>
        ) : null,
      },
      {
        label: "Slogan",
        value: stats.slogan || motto,
        icon: <FiStar className="w-4 h-4" />,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
      },
    ];

    return statItems.map((stat, idx) => (
      <div
        key={idx}
        className="relative p-4 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[90px] group"
      >
        {/* Background Accent */}
        <div className={`absolute top-0 right-0 w-16 h-16 ${stat.bgColor} rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0`} />
        
        {/* Icon */}
        <span className={`absolute top-2 right-2 text-sm opacity-30 group-hover:opacity-100 transition-opacity duration-300 ${stat.color}`}>
          {stat.icon}
        </span>

        {/* Value with optional trend/progress */}
        <div className="relative z-10">
          <p
            className={`font-bold ${stat.color} leading-tight flex items-center ${
              stat.label === "Slogan"
                ? "text-xs sm:text-sm"
                : "text-lg sm:text-xl md:text-2xl"
            }`}
          >
            {stat.value}
            {stat.trend}
            {stat.progress}
          </p>
        </div>

        {/* Label */}
        <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-500 mt-1 relative z-10">
          {stat.label}
        </p>

        {/* Hover Indicator */}
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    ));
  })()}
</div>

            
<div className="flex flex-col md:flex-row gap-3">
  {/* Phone Card */}
  <div className="bg-white border border-gray-200 rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all flex items-center sm:items-start gap-3">
    <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-blue-50 shrink-0">
      <FiPhone className="text-blue-600 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
    </div>
    <div className="min-w-0">
      <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-gray-500">
        Phone
      </p>
      <p className="text-[11px] sm:text-xs font-semibold text-gray-900 truncate">
        {contactPhone || "Add phone number"}
      </p>
    </div>
  </div>

  {/* Email Card */}
  <div className="bg-white border border-gray-200 rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all flex items-center sm:items-start gap-3">
    <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-purple-50 shrink-0">
      <FiMail className="text-purple-600 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
    </div>
    <div className="min-w-0">
      <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-gray-500">
        Email
      </p>
      <p className="text-[11px] sm:text-xs font-semibold text-gray-900 break-all">
        matungulugirls@gmial.com
      </p>
    </div>
  </div>
</div>
                {/* Phone Card */}
              

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

{/* ===== VISION / MISSION / MOTTO SECTION (Compact Institutional Layout) ===== */}
<section className="relative bg-white py-8 sm:py-10 overflow-hidden">
  {/* Decorative Background Element */}
  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50" />
  
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      
      {/* Left Side: Section Header */}
      <div className="lg:col-span-4 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
          <IoSparkles className="text-emerald-600 w-3 h-3" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-700">Core Foundations</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
          Nurturing Excellence <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
            Through Purpose
          </span>
        </h2>
     <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-sm">
  Guiding principles for the {new Date().getFullYear()} academic landscape. For us at Matungulu Girls Senior School, the champions — our slogan.
</p>
      </div>

      {/* Right Side: Interactive Cards (Reduced Height) */}
      <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            label: "Our Motto",
            value: motto,
            icon: <FiTarget />,
            gradient: "from-emerald-600 to-teal-600",
            shadow: "shadow-emerald-200/50",
            bg: "bg-emerald-50",
            border: "border-emerald-100",
            text: "text-emerald-700"
          },
          {
            label: "Our Vision",
            value: vision,
            icon: <FiEye />,
            gradient: "from-blue-600 to-indigo-600",
            shadow: "shadow-blue-200/50",
            bg: "bg-blue-50",
            border: "border-blue-100",
            text: "text-blue-700"
          },
          {
            label: "Our Mission",
            value: mission,
            icon: <FiBookOpen />,
            gradient: "from-teal-600 to-emerald-600",
            shadow: "shadow-teal-200/50",
            bg: "bg-teal-50",
            border: "border-teal-100",
            text: "text-teal-700",
            span: "md:col-span-2" 
          },
        ].map((item, idx) => (
          <div 
            key={idx} 
            className={`group relative p-[1px] rounded-[1.5rem] bg-gradient-to-b from-slate-200 to-white shadow-lg transition-all duration-200 ${item.span || ""}`}
          >
            <div className="relative h-full bg-white rounded-[1.45rem] p-5 border border-white overflow-hidden">
              {/* Corner Accent - Scaled Down */}
              <div className={`absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br ${item.gradient} opacity-5 group-hover:opacity-15 transition-opacity rounded-full`} />
              
              <div className="flex items-start gap-4">
                {/* Scaled Down Icon Container */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-md ${item.shadow} group-hover:scale-110 transition-transform duration-300`}>
                  {React.cloneElement(item.icon, { size: 18 })}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-emerald-600 transition-colors">
                      {item.label}
                    </h3>
                    <div className={`px-2 py-0.5 rounded-full ${item.bg} ${item.border} ${item.text} text-[8px] font-bold uppercase`}>
                      Official
                    </div>
                  </div>
                  <p className="text-slate-800 text-md font-bold leading-snug tracking-tight italic">
                    "{item.value}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>



{/* ===== PERFORMANCE METRICS SECTION ===== */}
{!statsLoading && schoolStatsData && (
  <section className="bg-[#f8fafc] py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-[32px] p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600/80">Academic Intelligence</p>
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
              <div className="p-2 bg-emerald-50 rounded-xl">
                <FiTrendingUp className="text-emerald-600" size={20} />
              </div>
              Performance Metrics
            </h3>
          </div>
          <div className="hidden md:block px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Live Statistics</p>
          </div>
        </div>
        
        {/* The Grid: Forced 2-column layout on mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Last Year Mean Card */}
          {schoolStatsData.lastYearMean && (
            <div className="group relative rounded-2xl bg-slate-50/50 border border-slate-100 p-5 transition-all hover:bg-white hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-200">
              <p className="text-[11px] font-black uppercase tracking-wider text-blue-600 mb-2">Previous Year</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-slate-800">{schoolStatsData.lastYearMean.toFixed(2)}</span>
                <span className="text-[10px] font-bold text-slate-400">MEAN</span>
              </div>
            </div>
          )}
          
          {/* Current Mean Card - High Focus */}
          {schoolStatsData.meanScore && (
            <div className="group relative col-span-2 lg:col-span-1 rounded-2xl bg-emerald-50 border-2 border-emerald-100 p-5 transition-all hover:shadow-xl hover:shadow-emerald-500/10">
              <p className="text-[11px] font-black uppercase tracking-wider text-emerald-700 mb-2">Current Standard</p>
              <div className="flex items-center justify-between">
                <span className="text-4xl sm:text-5xl font-black text-emerald-600 tracking-tighter">
                  {schoolStatsData.meanScore.toFixed(2)}
                </span>
                {schoolStatsData.lastYearMean && (
                  <div className={`flex items-center gap-0.5 text-[11px] font-black px-2 py-1 rounded-lg ${
                    schoolStatsData.meanScore > schoolStatsData.lastYearMean 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {schoolStatsData.meanScore > schoolStatsData.lastYearMean ? '↑' : '↓'}
                    {Math.abs(schoolStatsData.meanScore - schoolStatsData.lastYearMean).toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Target Mean Card */}
          {schoolStatsData.targetMean && (
            <div className="group relative col-span-2 lg:col-span-1 rounded-2xl bg-slate-50/50 border border-slate-100 p-5 transition-all hover:bg-white hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-200">
               <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-wider text-amber-600 mb-1">Strategic Goal</p>
                    <span className="text-3xl font-black text-slate-800">{schoolStatsData.targetMean.toFixed(2)}</span>
                  </div>
                  <div className="bg-amber-100 px-2 py-1 rounded-md">
                     <p className="text-xs font-black text-amber-700 leading-none">
                        {((schoolStatsData.meanScore / schoolStatsData.targetMean) * 100).toFixed(0)}%
                     </p>
                  </div>
               </div>
               {/* Minimalist Progress Bar */}
               <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 transition-all duration-1000 ease-out" 
                    style={{ width: `${(schoolStatsData.meanScore / schoolStatsData.targetMean) * 100}%` }}
                  />
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </section>
)}

{/* ===== ACHIEVEMENTS TIMELINE: MODERNIZED ===== */}
<section className="bg-[#fcfcfd] py-20 overflow-hidden">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    {/* Header: Centered & Minimalist */}
    <div className="text-center max-w-3xl mx-auto mb-16">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-4">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">Chronicle of Success</span>
      </div>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
        Milestones of <span className="text-emerald-600">Excellence</span>
      </h2>
      <p className="text-slate-500 text-base sm:text-lg font-medium leading-relaxed">
        A legacy built on innovation and character, charting our progress from 2019 to the present.
      </p>
    </div>

    {achievementsLoading ? (
      <div className="flex flex-col items-center justify-center py-20">
        <FiLoader className="w-10 h-10 animate-spin text-emerald-600 mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing Data...</p>
      </div>
    ) : (
      <div className="relative">
        {/* Timeline Path: Thin & Sophisticated */}
        <div className="absolute left-4 sm:left-1/2 transform sm:-translate-x-1/2 h-full w-px bg-slate-200"></div>

        {timelineAchievements.length > 0 ? (
        <div className="space-y-12">
          {timelineAchievements.map((item, idx) => (
            <div
              key={idx}
              className={`relative flex items-center justify-between w-full mb-8 ${
                idx % 2 === 0 ? "sm:flex-row-reverse" : "sm:flex-row"
              }`}
            >
              {/* Spacer for Desktop */}
              <div className="hidden sm:block w-[45%]" />

              {/* Timeline Indicator */}
              <div className="absolute left-4 sm:left-1/2 transform -translate-x-1/2 z-20">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                </div>
              </div>

              {/* Card Content */}
              <div className="w-full sm:w-[45%] pl-12 sm:pl-0 group">
                <div className="relative p-6 sm:p-8 rounded-[28px] bg-white border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1">
                  
                  {/* Floating Year Tag */}
                  <div className={`absolute top-0 -translate-y-1/2 flex items-center gap-2 ${
                    idx % 2 === 0 ? "sm:right-8" : "sm:left-8"
                  }`}>
                    <span className="px-4 py-1 rounded-full bg-[#172033] text-white text-[11px] font-black tracking-widest uppercase shadow-lg">
                      {item.year}
                    </span>
                  </div>

                  <div className={`flex flex-col ${idx % 2 === 0 ? "sm:items-start" : "sm:items-end"} text-left ${idx % 2 === 0 ? "sm:text-left" : "sm:text-right"}`}>
                    {/* Icon Plate */}
                    <div className="mb-4 p-3 rounded-2xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                      {item.icon || <FiAward size={20} />}
                    </div>

                    <h4 className="text-xl font-black text-slate-900 mb-2 leading-tight">
                      {item.title}
                    </h4>

                    <p className="text-slate-500 text-sm leading-relaxed font-medium mb-5 line-clamp-3">
                      {item.shortDescription || (item.description && item.description.substring(0, 120) + '...')}
                    </p>

                    <button
                      onClick={() => openAchievementModal(item)}
                      className="group/btn inline-flex items-center gap-2 text-emerald-600 text-xs font-black uppercase tracking-widest hover:text-emerald-700 transition-colors"
                    >
                      View Intelligence
                      <FiArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-slate-200 bg-white p-10 text-center">
            <FiAward className="mx-auto mb-3 h-8 w-8 text-slate-300" />
            <h3 className="text-lg font-black text-slate-900">No achievement records yet</h3>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Add achievements in the dashboard to publish them here automatically.
            </p>
          </div>
        )}
      </div>
    )}
  </div>
</section>

      {/* ===== WHY CHOOSE US ===== */}
<section className="bg-white py-20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    {/* Header with your signature tracking */}
    <div className="text-center max-w-3xl mx-auto mb-16">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-4">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-700">The Institution of Choice</span>
      </div>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
        The Matungulu Girls Slogan—<span className="text-emerald-600">The Champions</span>
      </h2>
      <p className="text-slate-500 text-base sm:text-lg font-medium">
        Discover what makes Matungulu Girls the premier choice for your daughter's future.
      </p>
    </div>

    {/* Modernized Grid: 2 columns on mobile, 4 on desktop */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {whyChooseUs.map((item) => {
        const c = colorMap[item.color];
        return (
          <div
            key={item.id}
            className="group relative flex flex-col h-full bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.02)] transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2"
          >
            {/* 1. Image Layer with Metric Plate */}
            {item.image && (
              <div className="relative h-44 sm:h-52 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/80 via-transparent to-transparent" />
                
                {/* Floating Metric Tag */}
                <div className="absolute top-4 left-4">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl backdrop-blur-md shadow-lg ${c.bg} text-white border border-white/20`}>
                    {item.metrics}
                  </span>
                </div>
              </div>
            )}

            {/* 2. Content Area */}
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-start gap-4 mb-4">
                {!item.image && (
                  <div className={`w-12 h-12 rounded-2xl ${c.light} ${c.text} flex items-center justify-center flex-shrink-0 shadow-inner`}>
                    {item.icon}
                  </div>
                )}
                <h4 className="font-black text-slate-900 text-lg leading-tight tracking-tight group-hover:text-emerald-600 transition-colors">
                  {item.title}
                </h4>
              </div>

              <p className="text-slate-500 text-sm leading-relaxed font-medium mb-6 line-clamp-3">
                {expandedCards[item.id] ? item.description : item.shortDescription}
              </p>

              {/* 3. Action Layer (Bottom) */}
              <div className="mt-auto">
                {item.description !== item.shortDescription && (
                  <button
                    onClick={() => openAchievementModal(item)}
                    className="group/btn inline-flex items-center gap-2 text-[#172033] text-[11px] font-black uppercase tracking-widest hover:text-emerald-600 transition-colors"
                  >
                    Explore Detail
                    <div className="p-1.5 rounded-full bg-slate-50 group-hover/btn:bg-emerald-50 transition-colors">
                      <FiArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                    </div>
                  </button>
                )}
              </div>
            </div>

            {/* Subtle inner border for glass effect */}
            <div className="absolute inset-0 border border-white/10 rounded-[32px] pointer-events-none" />
          </div>
        );
      })}
    </div>
  </div>
</section>

      {/* CBC Pathways & Subjects Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative rounded-3xl border p-6 md:p-12 overflow-hidden shadow-sm">
          {/* Logo watermark */}
          <img
            src="/hero/MatG1.jpg"
            alt=""
            className="absolute right-4 bottom-4 w-28 md:w-40 opacity-[0.03] pointer-events-none select-none"
          />

          {/* Header Section */}
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100 rounded-full mb-4">
              <FiBookOpen className="text-teal-800 text-lg" />
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-teal-700">
                CBC Framework
              </span>
            </div>

            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              CBC <span className="text-teal-800">Learning Tracks</span> &
              Subjects
            </h3>

            <p className="text-slate-700 text-lg font-medium leading-relaxed">
              The Competency Based Curriculum organizes learning around three
              main pathways, each tailored to different student strengths and
              career goals at{" "}
              <span className="text-emerald-700 font-bold">Matungulu</span>{" "}
              Girls.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm mt-6">
              <IoSparkles className="text-teal-500" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                7+ Core Competencies
              </span>
            </div>
          </div>

          {/* CBC Pathways — Grid Layout (Prevents Overlap) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {pathways.map((path, idx) => {
              const PathIcon = path.icon;
              const isDark = idx === 1; // Middle card style

              return (
                <div
                  key={idx}
                  className={`group relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl ${
                    isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"
                  }`}
                >
                  {/* Top Color Bar */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${path.color}`} />

                  <div className="p-6 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`p-3 rounded-xl ${
                          isDark ? "bg-white/10" : "bg-slate-100"
                        }`}
                      >
                        <PathIcon
                          className={`text-2xl ${
                            isDark ? "text-white" : "text-slate-700"
                          }`}
                        />
                      </div>
                      <span
                        className={`text-2xl font-black opacity-10 ${
                          isDark ? "text-white" : "text-slate-900"
                        }`}
                      >
                        0{idx + 1}
                      </span>
                    </div>

                    <h4
                      className={`font-bold text-xl mb-1 ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {path.name}
                    </h4>
                    <p
                      className={`text-sm font-medium mb-6 ${
                        isDark ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {path.description}
                    </p>

                    {/* Subjects Tags - Only showing first 3 as preview */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {path.subjects.slice(0, 3).map((subj, i) => (
                        <span
                          key={i}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${
                            isDark
                              ? "bg-white/5 text-slate-300 border-white/10"
                              : "bg-slate-50 text-slate-600 border-slate-100"
                          }`}
                        >
                          {subj}
                        </span>
                      ))}
                      {path.subjects.length > 3 && (
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${
                            isDark
                              ? "bg-white/5 text-slate-300 border-white/10"
                              : "bg-slate-50 text-slate-600 border-slate-100"
                          }`}
                        >
                          +{path.subjects.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Careers Section - Preview with 4 careers + Read More button */}
                    <div
                      className={`mt-auto pt-4 border-t ${
                        isDark ? "border-white/10" : "border-slate-100"
                      }`}
                    >
                      <p
                        className={`text-[10px] font-black uppercase tracking-widest mb-3 ${
                          isDark ? "text-emerald-400" : "text-emerald-600"
                        }`}
                      >
                        Popular Careers
                      </p>
                      <div className="grid grid-cols-2 gap-y-1 gap-x-2 mb-3">
                        {path.careers.slice(0, 4).map((career, cIdx) => (
                          <div key={cIdx} className="flex items-center gap-1.5">
                            <div
                              className={`w-1 h-1 rounded-full shrink-0 ${
                                isDark ? "bg-slate-500" : "bg-slate-400"
                              }`}
                            />
                            <span
                              className={`text-[11px] leading-tight font-semibold truncate ${
                                isDark ? "text-slate-300" : "text-slate-700"
                              }`}
                            >
                              {career}
                            </span>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => openModal(path)}
                        className={`inline-flex items-center gap-1 text-xs font-bold mt-1 transition-colors ${
                          isDark
                            ? "text-emerald-400 hover:text-emerald-300"
                            : "text-emerald-600 hover:text-emerald-700"
                        }`}
                      >
                        Read More Careers
                        <FiArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CBC Core Subjects Row */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                <FiLayers className="text-white text-xl" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg">
                  Mandatory Core Subjects
                </h4>
                <p className="text-sm sm:text-base font-medium leading-relaxed line-clamp-3">
                  Foundational learning required for every student regardless of
                  pathway
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {[
                 { name: "Mathematics", icon: FiCpu },
                { name: "English", icon: FiBook },
                { name: "Kiswahili", icon: FiGlobe },
                { name: "Integrated Science", icon: FiActivity },
                { name: "Social Studies", icon: FiUsers },
                { name: "Religious Education", icon: FiHeart },
                { name: "Creative Arts", icon: FiPenTool },
                { name: "Agriculture", icon: FiDroplet },
                { name: "Life Skills", icon: FiStar },
                { name: "Physical Education", icon: FiTarget },
              ].map((subj, i) => {
                const SubjIcon = subj.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-white transition-colors"
                  >
                    <SubjIcon className="text-teal-700 text-base shrink-0" />
                    <span className="text-xs font-bold text-slate-700">
                      {subj.name}
                    </span>
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
              Building academic excellence, strong character, and future-ready
              skills
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
<section className="bg-gray-50 border-t border-gray-200 py-16 sm:py-20 overflow-hidden">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    {/* Header with modernized text */}
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/50 border border-emerald-200 mb-4">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
          Global Pathways
        </span>
      </div>
      
      <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
        Academic <br className="sm:hidden" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800">
          Success Partners.. Universities
        </span>
      </h3>
      
      <p className="mt-6 text-slate-500 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
        Empowering our graduates through strategic transitions. We collaborate with world-class institutions to ensure every Matungulu girl is prepared for the rigors of global higher education.
      </p>
    </div>

    {imagesLoading ? (
      <div className="flex flex-col items-center justify-center py-12">
        <FiLoader className="w-10 h-10 animate-spin text-emerald-600 mb-4" />
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Synchronizing Partners...</span>
      </div>
    ) : uniImages.length > 0 ? (
      <div className="relative group">
        {/* Modern Gradient Overlays for Marquee Edges */}
        <div className="absolute inset-y-0 left-0 w-20 sm:w-40 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 sm:w-40 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

        <div className="relative overflow-hidden py-4">
          <div
            className="flex gap-6 sm:gap-10 animate-marquee whitespace-nowrap"
            style={{
              animation: "marquee 120s linear infinite",  /* ← Speed reduced by half (60s → 120s) */
              width: "max-content",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")}
            onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")}
          >
            {scrollImages.map((img, idx) => (
              <div
                key={idx}
                className="relative w-36 h-20 sm:w-44 sm:h-24 flex-shrink-0 bg-white/40 backdrop-blur-sm rounded-2xl border border-white shadow-sm flex items-center justify-center p-4 group/logo transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-white"
              >
                {/* Logo - FULL COLOR (no grayscale) */}
                <div className="relative w-full h-full">
                  <Image
                    src={img}
                    alt={`Partner University ${idx}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 144px, 176px"
                    onError={(e) => {
                      const parent = e.currentTarget.parentElement?.parentElement;
                      if (parent) parent.style.display = "none";
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ) : (
      <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-3xl">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Network Under Maintenance</p>
      </div>
    )}
  </div>
</section>

{/* ===== ACHIEVEMENT DETAIL MODAL ===== */}
{achievementModalOpen && selectedAchievement && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm transition-all duration-300"
    onClick={closeAchievementModal}
  >
    <div
      className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Modal Header with Gradient */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-700 p-4 sm:p-6 text-white shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              {/* Ensure icon scales if it's an SVG */}
              <div className="scale-75 sm:scale-100">
                {selectedAchievement.icon}
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="w-fit text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase">
                  {selectedAchievement.year}
                </span>
                <h3 className="text-lg sm:text-xl font-bold truncate pr-2">
                  {selectedAchievement.title}
                </h3>
              </div>
            </div>
          </div>
          <button
            onClick={closeAchievementModal}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors shrink-0"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Modal Body with Scroll */}
      <div className="overflow-y-auto flex-1">
        {/* Hero Image - Responsive Height */}
        {selectedAchievement.image && (
          <div className="relative h-40 sm:h-56 w-full">
            <Image
              src={selectedAchievement.image}
              alt={selectedAchievement.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        <div className="p-4 sm:p-6">
          {/* Stats Badges - Improved Wrap/Overlap */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
              <FiAward className="text-emerald-600 w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-[10px] sm:text-xs font-bold text-emerald-700">
                {selectedAchievement.stats}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100">
              <FiTrendingUp className="text-blue-600 w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-[10px] sm:text-xs font-bold text-blue-700">
                {selectedAchievement.impact}
              </span>
            </div>
          </div>

          {/* Deep Explanation */}
          <h4 className="text-md sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
            <FiBookOpen className="text-emerald-600 w-4 h-4 sm:w-5 sm:h-5" />
            Full Story
          </h4>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-6">
            {selectedAchievement.description}
          </p>

          {/* Key Highlights Section */}
          {selectedAchievement.highlights && selectedAchievement.highlights.length > 0 && (
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <h5 className="font-bold text-emerald-800 text-xs sm:text-sm mb-3 flex items-center gap-2">
                <FiCheckCircle className="w-4 h-4" />
                Key Highlights
              </h5>
              <ul className="space-y-2.5">
                {selectedAchievement.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                    <span className="text-emerald-600 mt-0.5 font-bold">✓</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Modal Footer */}
      <div className="p-3 sm:p-4 border-t border-gray-100 bg-gray-50 shrink-0">
        <p className="text-[10px] sm:text-xs text-gray-500 text-center italic">
          Matungulu Girls Senior School — Celebrating Excellence Since 1966
        </p>
      </div>
    </div>
  </div>
)}

{/* ===== CAREERS MODAL ===== */}
{modalOpen && selectedPathway && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm transition-all duration-300"
    onClick={closeModal}
  >
    <div
      className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[85vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Modal Header */}
      <div className={`bg-gradient-to-r ${selectedPathway.color} p-4 sm:p-6 text-white shrink-0`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              {React.createElement(selectedPathway.icon, {
                className: "w-5 h-5 sm:w-6 sm:h-6",
              })}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-bold truncate">
                {selectedPathway.name}
              </h3>
              <p className="text-white/80 text-[11px] sm:text-sm line-clamp-1 sm:line-clamp-none">
                {selectedPathway.description}
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors shrink-0"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Modal Body with Scroll */}
      <div className="p-4 sm:p-6 overflow-y-auto flex-1">
        {/* Subjects Section */}
        <div className="mb-6">
          <h4 className="font-bold text-gray-900 text-md sm:text-lg mb-3 flex items-center gap-2">
            <FiBook className="text-emerald-600 w-4 h-4 sm:w-5 sm:h-5" />
            Core Subjects
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedPathway.subjects.map((subject, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] sm:text-sm font-semibold border border-emerald-100/50"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>

        {/* Careers Section */}
        <div>
          <h4 className="font-bold text-gray-900 text-md sm:text-lg mb-3 flex items-center gap-2">
            <FiTrendingUp className="text-emerald-600 w-4 h-4 sm:w-5 sm:h-5" />
            Common <span className="text-emerald-800">Career Paths</span>
          </h4>
          {/* Force 2 columns on small tablets, 1 column on tiny phones */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-1.5 sm:gap-2">
            {selectedPathway.careers.map((career, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2 rounded-lg bg-gray-50/50 sm:hover:bg-gray-50 transition-colors border border-transparent sm:hover:border-gray-100"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-gray-700 text-[12px] sm:text-sm font-medium">
                  {career}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Modal Footer */}
      <div className="p-3 sm:p-4 border-t border-gray-100 bg-gray-50 shrink-0">
        <p className="text-[10px] sm:text-xs text-gray-500 text-center leading-tight">
          These career pathways are aligned with Matungulu Girls' CBC
          curriculum and university preparation programs.
        </p>
      </div>
    </div>
  </div>
)}

      {/* Marquee Animation Style */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 120s linear infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoom-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-in {
          animation-duration: 0.2s;
          animation-fill-mode: both;
        }
        .fade-in {
          animation-name: fade-in;
        }
        .zoom-in {
          animation-name: zoom-in;
        }
      `}</style>
    </div>
  );
};

export default ModernSchoolLayout;
