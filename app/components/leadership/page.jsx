'use client';
import { useState, useEffect } from 'react';
import { 
  FiMail, 
  FiPhone, 
  FiAward,
  FiBookOpen,
  FiBriefcase,
  FiUsers,
  FiStar,
  FiChevronRight,
  FiMapPin,
  FiCalendar,
  FiShield,
  FiUser,
  FiCheck,
  FiMenu,
  FiX,
  FiArrowLeft,
  FiHeart,
  FiClock,
  FiGlobe,
  FiLinkedin,
  FiTwitter,
  FiTrendingUp,
  FiSearch,
  FiFilter,
  FiDownload
} from 'react-icons/fi';
import { 
  Loader2,
  GraduationCap,
  Target,
  Trophy,
  Users,
  BookOpen,
  Crown,
  Medal,
  Building2,
  Layers,
  Sparkles,
  Shield,
  ChevronDown
} from "lucide-react";

// Helper function for image URLs
const getImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') {
    return null;
  }
  
  const trimmedPath = imagePath.trim();
  if (!trimmedPath) {
    return null;
  }
  
  if (trimmedPath.includes('cloudinary.com')) {
    return trimmedPath;
  }
  
  if (trimmedPath.startsWith('/') || trimmedPath.startsWith('http')) {
    return trimmedPath;
  }
  
  if (trimmedPath.startsWith('data:image')) {
    return trimmedPath;
  }
  
  return trimmedPath;
};

const ModernStaffLeadership = () => {
  const [staff, setStaff] = useState([]);
  const [principal, setPrincipal] = useState(null);
  const [featuredStaff, setFeaturedStaff] = useState(null);
  const [academicsDeputy, setAcademicsDeputy] = useState(null);
  const [adminDeputy, setAdminDeputy] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [supportStaff, setSupportStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState('principal');
  const [activeTab, setActiveTab] = useState('featured');
  
  // Table state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch staff data from API
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/staff');
        const data = await response.json();

        if (data.success && Array.isArray(data.staff)) {
          const allStaff = data.staff;
          setStaff(allStaff);

          // ========== CORRECTED HIERARCHY LOGIC ==========

          // 1. Find Principal - EXACT MATCH only
          const foundPrincipal = allStaff.find(s => 
            s.id === 1 ||
            s.role === 'Principal' ||
            s.role?.toLowerCase() === 'principal' ||
            (s.position && (
              s.position.toLowerCase().includes('chief principal') || 
              s.position.toLowerCase().includes('principal')
            ) && !s.position.toLowerCase().includes('deputy'))
          );

          const selectedPrincipal = foundPrincipal || allStaff[0];
          setPrincipal(selectedPrincipal);
          setFeaturedStaff(selectedPrincipal);

          // 2. Find all deputies
          const allDeputies = allStaff.filter(s => 
            (s.role?.toLowerCase().includes('deputy') || 
             s.position?.toLowerCase().includes('deputy')) &&
            s.id !== selectedPrincipal.id
          );

          // 3. Academics Deputy
          const foundAcademicsDeputy = allDeputies.find(s => 
            s.position?.toLowerCase().includes('academics')
          );
          setAcademicsDeputy(foundAcademicsDeputy || null);

          // 4. Administration Deputy
          const foundAdminDeputy = allDeputies.find(s => 
            s.position?.toLowerCase().includes('admin') || 
            s.position?.toLowerCase().includes('administration')
          );
          setAdminDeputy(foundAdminDeputy || null);

          // 5. Find ALL Teachers
          const allTeachers = allStaff.filter(s => 
            (s.role?.toLowerCase().includes('teacher') || 
             s.position?.toLowerCase().includes('teacher')) &&
            s.id !== selectedPrincipal.id &&
            !allDeputies.includes(s)
          );
          setTeachers(allTeachers);

          // 6. Find Support Staff
          const allSupportStaff = allStaff.filter(s => 
            s.id !== selectedPrincipal.id &&
            !allDeputies.includes(s) &&
            !allTeachers.includes(s)
          );
          setSupportStaff(allSupportStaff);

          console.log('✅ Staff loaded:', {
            principal: selectedPrincipal?.name,
            academicsDeputy: foundAcademicsDeputy?.name,
            adminDeputy: foundAdminDeputy?.name,
            teachers: allTeachers.length,
            supportStaff: allSupportStaff.length
          });

        } else {
          throw new Error('Format error: Expected successful staff array');
        }
      } catch (err) {
        console.error('Fetch Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  // Handle staff click
  const handleStaffClick = (staffMember) => {
    if (principal?.id === staffMember.id) {
      setViewMode('principal');
    } else {
      setViewMode('other');
    }
    setFeaturedStaff(staffMember);
    
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setTimeout(() => {
        const mainCard = document.querySelector('.lg\\:col-span-8');
        if (mainCard) {
          const rect = mainCard.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          window.scrollTo({ top: rect.top + scrollTop - 80, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  // Return to principal view
  const returnToPrincipal = () => {
    setFeaturedStaff(principal);
    setViewMode('principal');
    
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setTimeout(() => {
        const mainCard = document.querySelector('.lg\\:col-span-8');
        if (mainCard) {
          const rect = mainCard.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          window.scrollTo({ top: rect.top + scrollTop - 80, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  // Format phone number
  const formatPhone = (phone) => {
    if (!phone) return 'N/A';
    return phone;
  };

  // Get role badge
  const getRoleBadge = (role, position) => {
    if (!role && !position) return { 
      bg: 'bg-emerald-100', 
      text: 'text-emerald-800', 
      border: 'border-emerald-200',
      icon: <FiUser className="w-3 h-3 text-emerald-600" />
    };
    
    const roleLower = role?.toLowerCase() || '';
    const positionLower = position?.toLowerCase() || '';
    
    if (roleLower.includes('principal') || positionLower.includes('chief principal') || positionLower.includes('principal')) {
      return { 
        bg: 'bg-gradient-to-r from-emerald-900 to-teal-800', 
        text: 'text-white', 
        border: 'border-emerald-700',
        icon: <Crown className="w-3 h-3 text-yellow-300" />,
        label: 'PRINCIPAL'
      };
    }
    if (roleLower.includes('deputy') || positionLower.includes('deputy')) {
      return { 
        bg: 'bg-gradient-to-r from-teal-700 to-emerald-700', 
        text: 'text-white', 
        border: 'border-teal-600',
        icon: <Medal className="w-3 h-3 text-yellow-200" />,
        label: 'DEPUTY'
      };
    }
    if (roleLower.includes('teacher') || positionLower.includes('teacher')) {
      return { 
        bg: 'bg-gradient-to-r from-emerald-600 to-teal-600', 
        text: 'text-white', 
        border: 'border-emerald-500',
        icon: <BookOpen className="w-3 h-3 text-white" />,
        label: 'TEACHER'
      };
    }
    return { 
      bg: 'bg-gradient-to-r from-slate-600 to-slate-700', 
      text: 'text-white', 
      border: 'border-slate-500',
      icon: <Users className="w-3 h-3 text-white" />,
      label: 'STAFF'
    };
  };

  // ========== TABLE LOGIC ==========
  
  // Combine all staff for table view
  const allStaffForTable = [...(principal ? [principal] : []), ...(academicsDeputy ? [academicsDeputy] : []), ...(adminDeputy ? [adminDeputy] : []), ...teachers, ...supportStaff];
  
  // Filter staff based on search and role filter
  const filteredStaff = allStaffForTable.filter(member => {
    const matchesSearch = searchTerm === '' || 
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let roleCategory = 'other';
    if (member.id === principal?.id) roleCategory = 'principal';
    else if (member.id === academicsDeputy?.id || member.id === adminDeputy?.id) roleCategory = 'deputy';
    else if (teachers.includes(member)) roleCategory = 'teacher';
    else roleCategory = 'support';
    
    const matchesRole = filterRole === 'all' || roleCategory === filterRole;
    
    return matchesSearch && matchesRole;
  });
  
  // Sort staff
  const sortedStaff = [...filteredStaff].sort((a, b) => {
    let aVal = '', bVal = '';
    
    switch(sortField) {
      case 'name':
        aVal = a.name || '';
        bVal = b.name || '';
        break;
      case 'position':
        aVal = a.position || a.role || '';
        bVal = b.position || b.role || '';
        break;
      case 'department':
        aVal = a.department || a.subject || '';
        bVal = b.department || b.subject || '';
        break;
      case 'contact':
        aVal = a.phone || a.email || '';
        bVal = b.phone || b.email || '';
        break;
      default:
        aVal = a.name || '';
        bVal = b.name || '';
    }
    
    if (sortDirection === 'asc') {
      return aVal.localeCompare(bVal);
    } else {
      return bVal.localeCompare(aVal);
    }
  });
  
  // Pagination
  const totalPages = Math.ceil(sortedStaff.length / itemsPerPage);
  const paginatedStaff = sortedStaff.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Get role class for table row styling
  const getRoleRowClass = (member) => {
    if (member.id === principal?.id) return 'border-l-4 border-l-emerald-600 bg-emerald-50/30';
    if (member.id === academicsDeputy?.id || member.id === adminDeputy?.id) return 'border-l-4 border-l-teal-500 bg-teal-50/30';
    if (teachers.includes(member)) return 'hover:bg-emerald-50/20';
    return 'hover:bg-slate-50';
  };

  // Loading spinner
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-emerald-900/5 to-transparent px-4">
        <div className="text-center space-y-4 w-full max-w-[280px] mx-auto">
          <div className="relative flex justify-center">
            <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-20 animate-ping scale-75"></div>
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-emerald-100"></div>
              <div className="absolute inset-0 rounded-full border-2 border-t-emerald-600 border-r-emerald-600 border-b-transparent border-l-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FiHeart className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-black text-emerald-900">Matungulu Girls</h3>
            <p className="text-xs font-bold text-emerald-700 animate-pulse">Loading Staff Directory</p>
            <p className="text-[10px] font-medium text-emerald-600/70">Meet our dedicated team...</p>
            <p className="text-[8px] font-bold text-emerald-400 uppercase tracking-wider">"Strive to Excel"</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-red-50 to-orange-50">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-red-100">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-700 mb-2">Error Loading Data</h3>
          <p className="text-slate-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-emerald-700 to-teal-700 text-white font-bold rounded-xl hover:from-emerald-800 hover:to-teal-800 transition-all shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!featuredStaff || !principal) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
        <div className="text-center p-8">
          <Users className="w-16 h-16 text-emerald-600 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Staff Data Available</h3>
          <p className="text-slate-600">Please check back later.</p>
        </div>
      </div>
    );
  }

  const leadershipTeam = [principal, academicsDeputy, adminDeputy].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-teal-50 font-sans">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-slate-900 pt-16 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:40px_40px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4 sm:mb-6">
            <Sparkles className="w-3 h-3 sm:w-4 text-emerald-300" />
            <span className="text-white text-[10px] sm:text-xs font-bold tracking-wider uppercase">Our Dedicated Team</span>
          </div>
          
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 tracking-tight leading-tight">
            School Leadership <br className="sm:hidden" /> & Staff
          </h1>
          
          <p className="text-xs sm:text-base md:text-lg text-emerald-100 max-w-xl sm:max-w-3xl mx-auto font-light leading-relaxed px-4">
            Meet the passionate educators and administrators committed to excellence at Matungulu Girls Senior School
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-20">
        {/* Tabs */}
        <div className="flex justify-center mb-6 px-4">
          <div className="inline-flex p-1 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-emerald-100 w-full max-w-[320px] sm:max-w-none sm:w-auto">
            <button
              onClick={() => setActiveTab('featured')}
              className={`flex-1 sm:flex-none px-3 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'featured'
                  ? 'bg-gradient-to-r from-emerald-800 to-teal-700 text-white shadow-md'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <Crown className="w-3.5 h-3.5 sm:w-4" />
              Leadership
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 sm:flex-none px-3 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-emerald-800 to-teal-700 text-white shadow-md'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <Users className="w-3.5 sm:w-4 h-4" />
              All Staff
            </button>
          </div>
        </div>

        {activeTab === 'featured' ? (
          <>
            {/* Featured Card View - Same as before */}
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 items-start">
              
              {/* Featured Hero Card */}
              <div id="featured-staff-card" className="lg:col-span-8 w-full mx-auto flex flex-col bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden">
                
                {/* Image Section */}
                <div className="relative h-[60vh] sm:h-[65vh] lg:h-[70vh] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-teal-900/20 z-10"></div>
                  
                  {getImageUrl(featuredStaff?.image) ? (
                    <img
                      src={getImageUrl(featuredStaff.image)}
                      alt={featuredStaff?.name}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(featuredStaff?.name || 'Staff')}&background=2d6a4f&color=fff&bold=true&size=256`;
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 to-teal-800 flex items-center justify-center">
                      <GraduationCap className="w-24 h-24 text-white/30" />
                    </div>
                  )}
                  
                  {/* Floating Role Badge */}
                  <div className="absolute top-6 left-6 z-20">
                    <div className="px-4 py-2 bg-emerald-900/90 backdrop-blur-sm rounded-full border border-emerald-600">
                      <span className="text-white text-sm font-bold flex items-center gap-2">
                        {getRoleBadge(featuredStaff?.role, featuredStaff?.position).icon}
                        {featuredStaff?.position || featuredStaff?.role || 'Staff Member'}
                        {viewMode === 'other' && ' (Viewing)'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Overlay Content */}
                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-8 lg:p-10 bg-gradient-to-t from-black/90 via-black/30 to-transparent">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-2">
                      {featuredStaff?.name}
                    </h2>
                    
                    <div className="flex flex-wrap items-center gap-3 text-white/80">
                      {featuredStaff?.department && (
                        <span className="flex items-center gap-1.5 text-sm">
                          <Building2 className="w-4 h-4 text-emerald-400" />
                          {featuredStaff.department}
                        </span>
                      )}
                      {featuredStaff?.phone && (
                        <>
                          <span className="w-1 h-1 bg-emerald-400 rounded-full"></span>
                          <a href={`tel:${featuredStaff.phone}`} className="flex items-center gap-1.5 text-sm hover:text-white">
                            <FiPhone className="w-4 h-4 text-emerald-400" />
                            {formatPhone(featuredStaff.phone)}
                          </a>
                        </>
                      )}
                    </div>

                    {/* Back to Principal Button */}
                    {viewMode === 'other' && principal && (
                      <button
                        onClick={returnToPrincipal}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-white text-sm hover:bg-white/30 transition-all w-fit border border-white/30"
                      >
                        <FiArrowLeft className="w-4 h-4" />
                        Back to Principal
                      </button>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-grow p-6 md:p-8 bg-white">
                  <div className="grid lg:grid-cols-5 gap-6">
                    
                    {/* Left Column - Bio */}
                    <div className="lg:col-span-3 space-y-6">
                      <div>
                        <h4 className="text-sm font-black text-emerald-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <FiUser className="text-emerald-600" /> Professional Biography
                        </h4>
                        <p className="text-slate-600 leading-relaxed">
                          {featuredStaff?.bio || `${featuredStaff?.name} is a dedicated member of our school's ${featuredStaff?.role || 'team'} with a passion for education and student development.`}
                        </p>
                      </div>

                      {featuredStaff?.quote && (
                        <div className="relative p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-700 rounded-r-xl">
                          <p className="text-slate-700 italic font-medium">"{featuredStaff.quote}"</p>
                        </div>
                      )}

                      {featuredStaff?.expertise && featuredStaff.expertise.length > 0 && (
                        <div>
                          <h4 className="text-sm font-black text-emerald-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Target className="w-4 h-4" /> Areas of Expertise
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {featuredStaff.expertise.slice(0, 4).map((skill, idx) => (
                              <span key={idx} className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 text-xs font-bold rounded-lg">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column - Details */}
                    <div className="lg:col-span-2 space-y-6">
                      {featuredStaff?.responsibilities && featuredStaff.responsibilities.length > 0 && (
                        <div>
                          <h4 className="text-sm font-black text-emerald-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <FiBriefcase /> Key Responsibilities
                          </h4>
                          <ul className="space-y-2">
                            {featuredStaff.responsibilities.slice(0, 5).map((item, i) => (
                              <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                                <div className="w-1.5 h-1.5 mt-2 rounded-full bg-emerald-600 flex-shrink-0"></div>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Achievements */}
                      <div className="pt-4 border-t border-emerald-100">
                        <h4 className="text-sm font-black text-emerald-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Trophy className="w-4 h-4" /> Notable Achievements
                        </h4>
                        <ul className="space-y-2">
                          {(featuredStaff?.achievements && featuredStaff.achievements.length > 0) ? (
                            featuredStaff.achievements.slice(0, 3).map((item, i) => (
                              <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                                <Medal className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-sm text-slate-500 italic">Contributing to educational excellence</li>
                          )}
                        </ul>
                      </div>

                      {/* Contact Card */}
                      <div className="bg-gradient-to-br from-emerald-900 to-teal-800 rounded-xl p-5 text-white">
                        <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                          <FiMail className="text-emerald-300" /> Contact Information
                        </h4>
                        <div className="space-y-3">
                          {featuredStaff?.email && (
                            <a href={`mailto:${featuredStaff.email}`} className="flex items-center gap-2 text-sm hover:text-emerald-300 transition-colors">
                              <FiMail className="w-4 h-4 text-emerald-300" />
                              <span className="truncate">{featuredStaff.email}</span>
                            </a>
                          )}
                          {featuredStaff?.phone && (
                            <a href={`tel:${featuredStaff.phone}`} className="flex items-center gap-2 text-sm hover:text-emerald-300 transition-colors">
                              <FiPhone className="w-4 h-4 text-emerald-300" />
                              <span>{formatPhone(featuredStaff.phone)}</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Cards */}
              <div className="lg:col-span-4 space-y-4 mt-4 lg:mt-0">
                
                {/* PRINCIPAL CARD */}
                {principal && (
                  <button
                    key={principal.id}
                    onClick={() => handleStaffClick(principal)}
                    className={`w-full group relative bg-white rounded-xl p-4 shadow-lg border-2 transition-all duration-300 text-left ${
                      featuredStaff?.id === principal.id 
                        ? 'border-emerald-700 bg-gradient-to-r from-emerald-50 to-white scale-[1.02]' 
                        : 'border-emerald-100 hover:border-emerald-300 hover:shadow-xl'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden">
                        {principal.image ? (
                          <img
                            src={getImageUrl(principal.image)}
                            alt={principal.name}
                            className="w-full h-full object-cover object-top"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(principal.name)}&background=2d6a4f&color=fff&bold=true&size=64`;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-emerald-900 to-teal-800 flex items-center justify-center">
                            <Crown className="w-8 h-8 text-yellow-300" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-1">
                          <span className="px-2 py-1 bg-gradient-to-r from-emerald-900 to-teal-800 text-white text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                            <Crown className="w-3 h-3 text-yellow-300" /> PRINCIPAL
                          </span>
                          {featuredStaff?.id === principal.id && (
                            <span className="flex items-center gap-1 text-emerald-700 text-xs font-bold">
                              <FiCheck className="text-xs" /> Viewing
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {principal.name}
                        </h3>
                        <p className="text-slate-500 text-xs mt-1 line-clamp-1">
                          {principal.position || 'Chief Principal'}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-emerald-700 mt-2 font-bold">
                          View Profile <FiChevronRight className="group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </button>
                )}

                {/* ACADEMICS DEPUTY CARD */}
                {academicsDeputy && (
                  <button
                    key={academicsDeputy.id}
                    onClick={() => handleStaffClick(academicsDeputy)}
                    className={`w-full group relative bg-white rounded-xl p-4 shadow-lg border-2 transition-all duration-300 text-left ${
                      featuredStaff?.id === academicsDeputy.id 
                        ? 'border-teal-600 bg-gradient-to-r from-teal-50 to-white scale-[1.02]' 
                        : 'border-emerald-100 hover:border-teal-300 hover:shadow-xl'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden">
                        {academicsDeputy.image ? (
                          <img
                            src={getImageUrl(academicsDeputy.image)}
                            alt={academicsDeputy.name}
                            className="w-full h-full object-cover object-top"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(academicsDeputy.name)}&background=0d9488&color=fff&bold=true&size=64`;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-teal-700 to-emerald-700 flex items-center justify-center">
                            <Medal className="w-8 h-8 text-yellow-200" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-1">
                          <span className="px-2 py-1 bg-gradient-to-r from-teal-700 to-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                            <Medal className="w-3 h-3 text-yellow-200" /> ACADEMICS DEPUTY
                          </span>
                          {featuredStaff?.id === academicsDeputy.id && (
                            <span className="flex items-center gap-1 text-teal-600 text-xs font-bold">
                              <FiCheck className="text-xs" /> Viewing
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                          {academicsDeputy.name}
                        </h3>
                        <p className="text-slate-500 text-xs mt-1 line-clamp-1">
                          {academicsDeputy.position || 'Deputy Principal (Academics)'}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-teal-600 mt-2 font-bold">
                          View Profile <FiChevronRight className="group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </button>
                )}

                {/* ADMIN DEPUTY CARD */}
                {adminDeputy && (
                  <button
                    key={adminDeputy.id}
                    onClick={() => handleStaffClick(adminDeputy)}
                    className={`w-full group relative bg-white rounded-xl p-4 shadow-lg border-2 transition-all duration-300 text-left ${
                      featuredStaff?.id === adminDeputy.id 
                        ? 'border-teal-600 bg-gradient-to-r from-teal-50 to-white scale-[1.02]' 
                        : 'border-emerald-100 hover:border-teal-300 hover:shadow-xl'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden">
                        {adminDeputy.image ? (
                          <img
                            src={getImageUrl(adminDeputy.image)}
                            alt={adminDeputy.name}
                            className="w-full h-full object-cover object-top"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(adminDeputy.name)}&background=0d9488&color=fff&bold=true&size=64`;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-teal-700 to-emerald-700 flex items-center justify-center">
                            <Medal className="w-8 h-8 text-yellow-200" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-1">
                          <span className="px-2 py-1 bg-gradient-to-r from-teal-700 to-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                            <Medal className="w-3 h-3 text-yellow-200" /> ADMIN DEPUTY
                          </span>
                          {featuredStaff?.id === adminDeputy.id && (
                            <span className="flex items-center gap-1 text-teal-600 text-xs font-bold">
                              <FiCheck className="text-xs" /> Viewing
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                          {adminDeputy.name}
                        </h3>
                        <p className="text-slate-500 text-xs mt-1 line-clamp-1">
                          {adminDeputy.position || 'Deputy Principal (Administration)'}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-teal-600 mt-2 font-bold">
                          View Profile <FiChevronRight className="group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </button>
                )}

                {/* Stats Card */}
                <div className="bg-gradient-to-br from-emerald-900 to-teal-800 rounded-xl p-6 text-white shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider opacity-90">Staff Overview</p>
                      <p className="text-2xl font-black">{staff.length} Team Members</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm opacity-90">Leadership</span>
                      <span className="font-bold">
                        {[principal, academicsDeputy, adminDeputy].filter(Boolean).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm opacity-90">Teaching Staff</span>
                      <span className="font-bold">{teachers.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm opacity-90">Support Staff</span>
                      <span className="font-bold">{supportStaff.length}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setActiveTab('all')}
                    className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    View All Staff
                    <FiChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ========== MODERN TABLE VIEW FOR ALL STAFF ========== */
          <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
            
            {/* Table Header with Search and Filters */}
            <div className="p-4 sm:p-6 border-b border-emerald-100 bg-gradient-to-r from-emerald-50/50 to-white">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-black text-emerald-800 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Complete Staff Directory
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {sortedStaff.length} staff members • Page {currentPage} of {totalPages || 1}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  {/* Search Bar */}
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by name, position, department..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pl-9 pr-4 py-2 border border-emerald-200 rounded-xl text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Role Filter */}
                  <div className="relative">
                    <select
                      value={filterRole}
                      onChange={(e) => {
                        setFilterRole(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pl-4 pr-8 py-2 border border-emerald-200 rounded-xl text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="all">All Roles</option>
                      <option value="principal">Principal</option>
                      <option value="deputy">Deputy Principals</option>
                      <option value="teacher">Teaching Staff</option>
                      <option value="support">Support Staff</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Staff Table - Responsive with horizontal scroll on mobile */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider cursor-pointer hover:text-emerald-700" onClick={() => handleSort('name')}>
                      <div className="flex items-center gap-1">
                        Staff Member
                        {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider cursor-pointer hover:text-emerald-700" onClick={() => handleSort('position')}>
                      <div className="flex items-center gap-1">
                        Position
                        {sortField === 'position' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider cursor-pointer hover:text-emerald-700" onClick={() => handleSort('department')}>
                      <div className="flex items-center gap-1">
                        Department / Subject
                        {sortField === 'department' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider cursor-pointer hover:text-emerald-700" onClick={() => handleSort('contact')}>
                      <div className="flex items-center gap-1">
                        Contact
                        {sortField === 'contact' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Role</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedStaff.map((member) => {
                    const roleBadge = getRoleBadge(member.role, member.position);
                    const isPrincipal = member.id === principal?.id;
                    const isDeputy = member.id === academicsDeputy?.id || member.id === adminDeputy?.id;
                    
                    return (
                      <tr 
                        key={member.id} 
                        className={`${getRoleRowClass(member)} transition-colors cursor-pointer hover:bg-emerald-50/40`}
                        onClick={() => {
                          handleStaffClick(member);
                          setActiveTab('featured');
                        }}
                      >
                        {/* Name Column with Avatar */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-100 flex-shrink-0">
                              {member.image ? (
                                <img
                                  src={getImageUrl(member.image)}
                                  alt={member.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=2d6a4f&color=fff&bold=true&size=64`;
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  {isPrincipal ? <Crown className="w-5 h-5 text-emerald-600" /> : <FiUser className="w-5 h-5 text-emerald-500" />}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{member.name}</p>
                              {member.qualification && (
                                <p className="text-xs text-slate-500">{member.qualification}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        
                        {/* Position Column */}
                        <td className="px-4 py-3">
                          <p className="text-sm text-slate-700 font-medium">
                            {member.position || member.role || 'Staff Member'}
                          </p>
                        </td>
                        
                        {/* Department/Subject Column */}
                        <td className="px-4 py-3">
                          <p className="text-sm text-slate-600">
                            {member.department || member.subject || '—'}
                          </p>
                        </td>
                        
                        {/* Contact Column */}
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            {member.email && (
                              <a href={`mailto:${member.email}`} className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                <FiMail className="w-3 h-3" />
                                <span className="truncate max-w-[150px]">{member.email}</span>
                              </a>
                            )}
                            {member.phone && (
                              <a href={`tel:${member.phone}`} className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                <FiPhone className="w-3 h-3" />
                                <span>{formatPhone(member.phone)}</span>
                              </a>
                            )}
                          </div>
                        </td>
                        
                        {/* Role Badge Column */}
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${roleBadge.bg} ${roleBadge.text}`}>
                            {roleBadge.icon}
                            {roleBadge.label}
                          </span>
                        </td>
                        
                        {/* Action Column */}
                        <td className="px-4 py-3 text-center">
                          <button 
                            className="text-emerald-600 hover:text-emerald-700 text-xs font-semibold flex items-center gap-1 mx-auto"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStaffClick(member);
                              setActiveTab('featured');
                            }}
                          >
                            View Profile
                            <FiChevronRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Empty State */}
            {sortedStaff.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No staff members found</p>
                <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filter</p>
              </div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <FiChevronRight className="w-4 h-4 rotate-180" />
                  Previous
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                            : 'text-slate-600 hover:bg-emerald-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  Next
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
            
            {/* Table Footer Stats */}
            <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
              <span>Showing {paginatedStaff.length} of {sortedStaff.length} staff members</span>
              <span className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-600"></span> Principal</span>
                <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-500"></span> Deputy</span>
                <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Teacher</span>
                <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400"></span> Support</span>
              </span>
            </div>
          </div>
        )}

        {/* Mobile Hint */}
        {isMobile && activeTab === 'featured' && (
          <div className="mt-6 text-center text-sm text-slate-500">
            Tap on any staff card to view their profile
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernStaffLeadership;