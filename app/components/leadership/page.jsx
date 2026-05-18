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
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Improved helper function for image URLs with better error handling
const getImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') {
    return null;
  }
  
  const trimmedPath = imagePath.trim();
  if (!trimmedPath) {
    return null;
  }
  
  // Handle Cloudinary URLs
  if (trimmedPath.includes('cloudinary.com')) {
    return trimmedPath;
  }
  
  // Handle absolute URLs
  if (trimmedPath.startsWith('http://') || trimmedPath.startsWith('https://')) {
    return trimmedPath;
  }
  
  // Handle relative paths (starting with /)
  if (trimmedPath.startsWith('/')) {
    return trimmedPath;
  }
  
  // Handle data URLs (base64 images)
  if (trimmedPath.startsWith('data:image')) {
    return trimmedPath;
  }
  
  // Handle relative paths without leading slash
  return `/${trimmedPath}`;
};

// Component for optimized image with fallback
const OptimizedImage = ({ src, alt, className, priority = false, onError }) => {
  const [imgError, setImgError] = useState(false);
  const imageUrl = getImageUrl(src);
  
  if (!imageUrl || imgError) {
    // Generate avatar fallback
    const initials = alt?.split(' ').map(n => n[0]).join('') || 'ST';
    return (
      <div className={`${className} bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center`}>
        <span className="text-white text-xl font-bold">{initials}</span>
      </div>
    );
  }
  
  // Check if it's a data URL (base64)
  if (imageUrl.startsWith('data:image')) {
    return (
      <img
        src={imageUrl}
        alt={alt}
        className={className}
        onError={(e) => {
          setImgError(true);
          if (onError) onError(e);
        }}
      />
    );
  }
  
  // Use Next.js Image for optimization
  return (
    <Image
      src={imageUrl}
      alt={alt}
      fill
      className={`${className} object-cover object-top`}
      priority={priority}
      onError={() => setImgError(true)}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
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

          // Find Principal with better matching
          const foundPrincipal = allStaff.find(s => 
            s.id === 1 ||
            s.role === 'Principal' ||
            s.role?.toLowerCase() === 'principal' ||
            s.position?.toLowerCase().includes('principal') ||
            (s.position && (
              s.position.toLowerCase().includes('chief principal') || 
              s.position.toLowerCase().includes('principal')
            ) && !s.position.toLowerCase().includes('deputy'))
          );

          const selectedPrincipal = foundPrincipal || allStaff[0];
          setPrincipal(selectedPrincipal);
          setFeaturedStaff(selectedPrincipal);

          // Find all deputies
          const allDeputies = allStaff.filter(s => 
            (s.role?.toLowerCase().includes('deputy') || 
             s.position?.toLowerCase().includes('deputy')) &&
            s.id !== selectedPrincipal.id
          );

          // Academics Deputy
          const foundAcademicsDeputy = allDeputies.find(s => 
            s.position?.toLowerCase().includes('academics') ||
            s.role?.toLowerCase().includes('academics')
          );
          setAcademicsDeputy(foundAcademicsDeputy || null);

          // Administration Deputy
          const foundAdminDeputy = allDeputies.find(s => 
            s.position?.toLowerCase().includes('admin') || 
            s.position?.toLowerCase().includes('administration') ||
            s.role?.toLowerCase().includes('admin')
          );
          setAdminDeputy(foundAdminDeputy || null);

          // Find ALL Teachers
          const allTeachers = allStaff.filter(s => 
            (s.role?.toLowerCase().includes('teacher') || 
             s.position?.toLowerCase().includes('teacher')) &&
            s.id !== selectedPrincipal.id &&
            !allDeputies.includes(s)
          );
          setTeachers(allTeachers);

          // Find Support Staff
          const allSupportStaff = allStaff.filter(s => 
            s.id !== selectedPrincipal.id &&
            !allDeputies.includes(s) &&
            !allTeachers.includes(s)
          );
          setSupportStaff(allSupportStaff);

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

  const router = useRouter();
  
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
        const mainCard = document.querySelector('#featured-staff-card');
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
        const mainCard = document.querySelector('#featured-staff-card');
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
      icon: <FiUser className="w-3 h-3 text-emerald-600" />,
      label: 'STAFF'
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
        label: positionLower.includes('academic') ? 'ACADEMICS' : 'ADMIN'
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

  const getLeadershipCardMeta = (staffMember) => {
    const roleLower = staffMember?.role?.toLowerCase() || '';
    const positionLower = staffMember?.position?.toLowerCase() || '';

    if (
      roleLower.includes('principal') ||
      positionLower.includes('chief principal') ||
      (positionLower.includes('principal') && !positionLower.includes('deputy'))
    ) {
      return {
        accent: 'from-emerald-950 via-emerald-800 to-teal-700',
        badge: 'border-white/20 bg-emerald-950/45 text-white',
        chip: 'border-emerald-200 bg-emerald-50 text-emerald-800',
        label: 'Principal'
      };
    }

    if (roleLower.includes('deputy') || positionLower.includes('deputy')) {
      return {
        accent: 'from-teal-950 via-teal-800 to-emerald-700',
        badge: 'border-white/20 bg-teal-950/45 text-white',
        chip: 'border-teal-200 bg-teal-50 text-teal-800',
        label: positionLower.includes('academic') ? 'Deputy Principal - Academics' : 'Deputy Principal - Administration'
      };
    }

    if (roleLower.includes('teacher') || positionLower.includes('teacher')) {
      return {
        accent: 'from-emerald-900 via-green-700 to-teal-600',
        badge: 'border-white/20 bg-emerald-900/45 text-white',
        chip: 'border-green-200 bg-green-50 text-green-800',
        label: 'Teacher'
      };
    }

    return {
      accent: 'from-slate-900 via-slate-700 to-slate-600',
      badge: 'border-white/20 bg-slate-900/45 text-white',
      chip: 'border-slate-200 bg-slate-50 text-slate-700',
      label: staffMember?.position || staffMember?.role || 'Staff Member'
    };
  };

  // ========== TABLE LOGIC ==========
  
  // Combine all staff for table view
  const allStaffForTable = [...(principal ? [principal] : []), ...(academicsDeputy ? [academicsDeputy] : []), ...(adminDeputy ? [adminDeputy] : []), ...teachers, ...supportStaff];
  const teacherIdsForTable = new Set((teachers || []).map(t => t?.id).filter(Boolean));
  const supportIdsForTable = new Set((supportStaff || []).map(s => s?.id).filter(Boolean));
  const getHierarchyRankForTable = (member) => {
    if (!member) return 99;
    if (member.id === principal?.id) return 0;
    if (member.id === academicsDeputy?.id || member.id === adminDeputy?.id) return 1;
    if (teacherIdsForTable.has(member.id)) return 2;
    if (supportIdsForTable.has(member.id)) return 3;
    return 4;
  };
  
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
    else if (teacherIdsForTable.has(member.id)) roleCategory = 'teacher';
    else if (supportIdsForTable.has(member.id)) roleCategory = 'support';
    else roleCategory = 'support';
    
    const matchesRole = filterRole === 'all' || roleCategory === filterRole;
    
    return matchesSearch && matchesRole;
  });
  
  // Sort staff
  const sortedStaff = [...filteredStaff].sort((a, b) => {
    const rankDiff = getHierarchyRankForTable(a) - getHierarchyRankForTable(b);
    if (rankDiff !== 0) return rankDiff;

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
    if (teacherIdsForTable.has(member.id)) return 'hover:bg-emerald-50/20';
    return 'hover:bg-slate-50';
  };

  // Image component for consistent rendering
  const StaffImage = ({ staffMember, className, priority = false }) => {
    const [error, setError] = useState(false);
    const imageUrl = getImageUrl(staffMember?.image);
    
    if (!imageUrl || error) {
      const initials = staffMember?.name?.split(' ').map(n => n[0]).join('') || 'ST';
      const isPrincipal = staffMember?.id === principal?.id;
      return (
        <div className={`${className} bg-gradient-to-br from-emerald-700 to-teal-800 flex items-center justify-center`}>
          {isPrincipal ? (
            <Crown className="w-1/2 h-1/2 text-yellow-300" />
          ) : (
            <span className="text-white text-2xl font-bold">{initials.substring(0, 2)}</span>
          )}
        </div>
      );
    }
    
    return (
      <div className={`${className} relative overflow-hidden`}>
        <img
          src={imageUrl}
          alt={staffMember?.name || 'Staff member'}
          className="w-full h-full object-cover object-top"
          onError={() => setError(true)}
          loading={priority ? 'eager' : 'lazy'}
        />
      </div>
    );
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
            <p className="text-[8px] font-bold text-emerald-400 uppercase tracking-wider">"Committed to Excellence"</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-red-50 to-orange-50 px-4">
        <div className="text-center max-w-md mx-auto p-6 sm:p-8 bg-white rounded-2xl shadow-xl border border-red-100">
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
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4">
        <div className="text-center p-8">
          <Users className="w-16 h-16 text-emerald-600 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Staff Data Available</h3>
          <p className="text-slate-600">Please check back later.</p>
        </div>
      </div>
    );
  }

  const leadershipTeam = [principal, academicsDeputy, adminDeputy].filter(Boolean);
  const featuredMeta = getLeadershipCardMeta(featuredStaff);
  const featuredRoleBadge = getRoleBadge(featuredStaff?.role, featuredStaff?.position);
  const featuredExpertise = featuredStaff?.expertise?.slice(0, 6) || [];
  const featuredResponsibilities = featuredStaff?.responsibilities?.slice(0, 5) || [];
  const featuredAchievements = featuredStaff?.achievements?.slice(0, 4) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-teal-50 font-sans">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-slate-900 pt-12 sm:pt-16 pb-16 sm:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:40px_40px]" />
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-teal-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4 sm:mb-6">
            <Sparkles className="w-3 h-3 sm:w-4 text-emerald-300" />
            <span className="text-white text-[10px] sm:text-xs font-bold tracking-wider uppercase">School Leadership</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 tracking-tight leading-tight">
            Meet Our <br className="hidden sm:inline" /> Leadership
          </h1>
          
          <p className="text-xs sm:text-base md:text-lg text-emerald-100 max-w-xl sm:max-w-3xl mx-auto font-light leading-relaxed px-4">
            Clear, visible profiles for the administrators guiding Matungulu Girls Senior School with excellence, care, and accountability.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-6">
        <div className="flex gap-2 bg-white rounded-xl p-1 shadow-lg max-w-fit mx-auto">
          <button
            onClick={() => setActiveTab('featured')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${
              activeTab === 'featured'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-600 hover:text-emerald-600'
            }`}
          >
            Leadership View
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${
              activeTab === 'table'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-600 hover:text-emerald-600'
            }`}
          >
            Directory View
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20">
        {activeTab === 'featured' ? (
          /* Featured Card View - Responsive Layout */
          <div className="space-y-6 xl:space-y-0 xl:grid xl:grid-cols-[minmax(0,1fr)_22rem] 2xl:grid-cols-[minmax(0,1fr)_24rem] xl:gap-6 xl:items-start">
            
            {/* Featured Hero Card */}
            <div id="featured-staff-card" className="w-full min-w-0">
              <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
                
                {/* Responsive Grid Layout inside card */}
                <div className="flex flex-col 2xl:grid 2xl:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.1fr)]">
                  
                  {/* Image Section */}
                  <div className="relative min-h-[380px] sm:min-h-[440px] lg:min-h-[500px] 2xl:min-h-full bg-gradient-to-br from-emerald-900 to-teal-800">
                    <StaffImage 
                      staffMember={featuredStaff}
                      className="absolute inset-0 w-full h-full"
                      priority={true}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#041114] via-[#041114]/40 to-transparent" />
                    <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/35 to-transparent" />

                    {/* Badges */}
                    <div className="absolute left-4 sm:left-5 top-4 sm:top-5 right-4 sm:right-5 z-20 flex flex-wrap items-center gap-2">
                      <span className={`inline-flex max-w-full items-center gap-2 rounded-full border px-2 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.18em] backdrop-blur-sm ${featuredMeta.badge}`}>
                        {featuredRoleBadge.icon}
                        <span className="hidden min-w-0 truncate sm:inline">{featuredStaff?.position || featuredStaff?.role || 'Staff Member'}</span>
                        <span className="min-w-0 truncate sm:hidden">{featuredStaff?.position || 'Staff'}</span>
                      </span>
                      {viewMode === 'other' && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                          <FiCheck className="text-[10px] sm:text-[11px]" />
                          <span className="hidden sm:inline">Currently Viewing</span>
                          <span className="sm:hidden">Viewing</span>
                        </span>
                      )}
                    </div>

                    {/* Bottom Info */}
                    <div className="absolute inset-x-0 bottom-0 z-20 p-4 sm:p-5 lg:p-7">
                      <div className="rounded-3xl border border-white/15 bg-white/10 p-4 sm:p-5 text-white backdrop-blur-md">
                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200">Leadership Profile</p>
                        <h2 className="mt-2 sm:mt-3 text-xl sm:text-2xl lg:text-3xl font-black leading-tight break-words">{featuredStaff?.name}</h2>
                        <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-white/80">
                          {(featuredStaff?.department || featuredStaff?.subject) && (
                            <span className="inline-flex min-w-0 items-center gap-1.5">
                              <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-300" />
                              <span className="hidden min-w-0 truncate sm:inline">{featuredStaff?.department || featuredStaff?.subject}</span>
                            </span>
                          )}
                          {featuredStaff?.qualification && (
                            <span className="inline-flex min-w-0 items-center gap-1.5">
                              <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-300" />
                              <span className="hidden min-w-0 truncate sm:inline">{featuredStaff?.qualification}</span>
                            </span>
                          )}
                        </div>

                        {viewMode === 'other' && principal && (
                          <button
                            onClick={returnToPrincipal}
                            className="mt-4 sm:mt-5 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-white transition-all hover:bg-white/20"
                          >
                            <FiArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                            Back to Principal
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="min-w-0 bg-[linear-gradient(180deg,#ffffff_0%,#f7fffb_100%)] p-4 sm:p-5 lg:p-7 xl:p-8">
                    
                    {/* Stats Grid - Responsive columns */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                      <div className="min-w-0 rounded-2xl border border-emerald-100 bg-white p-3 sm:p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">Role</p>
                        <p className="mt-1 sm:mt-2 text-xs sm:text-sm font-black leading-5 text-slate-900 break-words">
                          {featuredMeta.label}
                        </p>
                      </div>

                      <div className="min-w-0 rounded-2xl border border-emerald-100 bg-white p-3 sm:p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">Department</p>
                        <p className="mt-1 sm:mt-2 text-xs sm:text-sm font-black leading-5 text-slate-900 break-words">
                          {featuredStaff?.department || featuredStaff?.subject || 'School Leadership'}
                        </p>
                      </div>
                    </div>

                    {/* Profile Details - Responsive layout */}
                    <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
                      
                      {/* Profile Summary */}
                      <div className="rounded-[20px] sm:rounded-[24px] border border-slate-200 bg-white p-4 sm:p-5">
                        <h4 className="mb-2 sm:mb-3 flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-[0.16em] text-emerald-700">
                          <FiUser className="text-emerald-600 w-3 h-3 sm:w-4 sm:h-4" />  Bio
                        </h4>
                        <p className="text-xs sm:text-sm leading-6 sm:leading-7 text-slate-600">
                          {featuredStaff?.bio || `${featuredStaff?.name} is a dedicated member of our school's ${featuredStaff?.role || 'team'} with a passion for education and student development.`}
                        </p>
                      </div>

                      {/* Quote */}
                      {featuredStaff?.quote && (
                        <div className="rounded-[20px] sm:rounded-[24px] border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 sm:p-5">
                          <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">Signature Note</p>
                          <p className="mt-2 sm:mt-3 text-sm sm:text-base font-medium italic leading-6 sm:leading-7 text-slate-700">"{featuredStaff.quote}"</p>
                        </div>
                      )}

                      {/* Expertise & Responsibilities - Responsive grid */}
                      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2 2xl:grid-cols-1">
                        
                        {/* Areas of Expertise */}
                        <div className="rounded-[20px] sm:rounded-[24px] border border-slate-200 bg-white p-4 sm:p-5">
                          <h4 className="mb-2 sm:mb-3 flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-[0.16em] text-emerald-700">
                            <Target className="w-3 h-3 sm:w-4 sm:h-4" /> Areas of Expertise
                          </h4>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {featuredExpertise.length > 0 ? featuredExpertise.map((skill, idx) => (
                              <span key={idx} className={`rounded-full border px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold ${featuredMeta.chip}`}>
                                {skill}
                              </span>
                            )) : (
                              <span className="text-xs sm:text-sm text-slate-500">Leadership, mentoring, school development, and student success.</span>
                            )}
                          </div>
                        </div>

                        {/* Key Responsibilities */}
                        <div className="rounded-[20px] sm:rounded-[24px] border border-slate-200 bg-white p-4 sm:p-5">
                          <h4 className="mb-2 sm:mb-3 flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-[0.16em] text-emerald-700">
                            <FiBriefcase /> Key Responsibilities
                          </h4>
                          <ul className="space-y-2 sm:space-y-3">
                            {featuredResponsibilities.length > 0 ? featuredResponsibilities.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-slate-700">
                                <span className="mt-1.5 sm:mt-2 h-1.5 w-1.5 sm:h-2 sm:w-2 shrink-0 rounded-full bg-emerald-600" />
                                <span className="leading-5 sm:leading-6">{item}</span>
                              </li>
                            )) : (
                              <li className="text-xs sm:text-sm italic text-slate-500">Leading school improvement, academic excellence, and student wellbeing.</li>
                            )}
                          </ul>
                        </div>

                        {/* Notable Achievements */}
                        <div className="lg:col-span-2 2xl:col-span-1 rounded-[20px] sm:rounded-[24px] border border-slate-200 bg-white p-4 sm:p-5">
                          <h4 className="mb-2 sm:mb-3 flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-[0.16em] text-emerald-700">
                            <Trophy className="w-3 h-3 sm:w-4 sm:h-4" /> Notable Achievements
                          </h4>
                          <ul className="space-y-2 sm:space-y-3">
                            {featuredAchievements.length > 0 ? featuredAchievements.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-slate-700">
                                <Medal className="mt-0.5 h-3 w-3 sm:h-4 sm:w-4 shrink-0 text-emerald-600" />
                                <span className="leading-5 sm:leading-6">{item}</span>
                              </li>
                            )) : (
                              <li className="text-xs sm:text-sm italic text-slate-500">Contributing to educational excellence and school leadership.</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:sticky xl:top-24 xl:block xl:space-y-4">
              
              {/* PRINCIPAL CARD */}
              {principal && (
                <button
                  key={principal.id}
                  onClick={() => handleStaffClick(principal)}
                  className={`w-full group relative bg-white rounded-xl p-4 shadow-lg border-2 transition-all duration-300 text-left ${
                    featuredStaff?.id === principal.id 
                      ? 'border-emerald-700 bg-gradient-to-r from-emerald-50 to-white shadow-xl ring-4 ring-emerald-100'
                      : 'border-emerald-100 hover:border-emerald-300 hover:shadow-xl'
                  }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-700 to-teal-800">
                      <StaffImage 
                        staffMember={principal}
                        className="w-full h-full"
                      />
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
                        <span className="px-2 py-1 bg-gradient-to-r from-emerald-900 to-teal-800 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                          <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-300" /> PRINCIPAL
                        </span>
                        {featuredStaff?.id === principal.id && (
                          <span className="flex items-center gap-1 text-emerald-700 text-[10px] sm:text-xs font-bold">
                            <FiCheck className="text-[10px] sm:text-xs" /> Viewing
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors text-sm sm:text-base truncate">
                        {principal.name}
                      </h3>
                      <p className="text-slate-500 text-[11px] sm:text-xs mt-0.5 sm:mt-1 truncate">
                        {principal.position || 'Chief Principal'}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] sm:text-xs text-emerald-700 mt-1.5 sm:mt-2 font-bold">
                        View Profile <FiChevronRight className="group-hover:translate-x-0.5 transition-transform w-2.5 h-2.5 sm:w-3 sm:h-3" />
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
                      ? 'border-teal-600 bg-gradient-to-r from-teal-50 to-white shadow-xl ring-4 ring-teal-100'
                      : 'border-emerald-100 hover:border-teal-300 hover:shadow-xl'
                  }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-teal-700 to-emerald-700">
                      <StaffImage 
                        staffMember={academicsDeputy}
                        className="w-full h-full"
                      />
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
                        <span className="px-2 py-1 bg-gradient-to-r from-teal-700 to-emerald-700 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                          <Medal className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-200" /> ACADEMICS
                        </span>
                        {featuredStaff?.id === academicsDeputy.id && (
                          <span className="flex items-center gap-1 text-teal-600 text-[10px] sm:text-xs font-bold">
                            <FiCheck className="text-[10px] sm:text-xs" /> Viewing
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors text-sm sm:text-base truncate">
                        {academicsDeputy.name}
                      </h3>
                      <p className="text-slate-500 text-[11px] sm:text-xs mt-0.5 sm:mt-1 truncate">
                        {academicsDeputy.position || 'Deputy Principal (Academics)'}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] sm:text-xs text-teal-600 mt-1.5 sm:mt-2 font-bold">
                        View Profile <FiChevronRight className="group-hover:translate-x-0.5 transition-transform w-2.5 h-2.5 sm:w-3 sm:h-3" />
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
                      ? 'border-teal-600 bg-gradient-to-r from-teal-50 to-white shadow-xl ring-4 ring-teal-100'
                      : 'border-emerald-100 hover:border-teal-300 hover:shadow-xl'
                  }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-teal-700 to-emerald-700">
                      <StaffImage 
                        staffMember={adminDeputy}
                        className="w-full h-full"
                      />
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
                        <span className="px-2 py-1 bg-gradient-to-r from-teal-700 to-emerald-700 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                          <Medal className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-200" /> ADMIN
                        </span>
                        {featuredStaff?.id === adminDeputy.id && (
                          <span className="flex items-center gap-1 text-teal-600 text-[10px] sm:text-xs font-bold">
                            <FiCheck className="text-[10px] sm:text-xs" /> Viewing
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors text-sm sm:text-base truncate">
                        {adminDeputy.name}
                      </h3>
                      <p className="text-slate-500 text-[11px] sm:text-xs mt-0.5 sm:mt-1 truncate">
                        {adminDeputy.position || 'Deputy Principal (Administration)'}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] sm:text-xs text-teal-600 mt-1.5 sm:mt-2 font-bold">
                        View Profile <FiChevronRight className="group-hover:translate-x-0.5 transition-transform w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </div>
                    </div>
                  </div>
                </button>
              )}

              {/* Leadership Snapshot */}
              <div className="w-full rounded-2xl bg-gradient-to-br from-emerald-900 to-teal-800 p-5 text-white shadow-xl sm:col-span-2 sm:p-6 xl:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 sm:p-3 bg-white/20 rounded-xl">
                    <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-200" />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider opacity-90">Leadership Snapshot</p>
                    <p className="text-xl sm:text-2xl font-black">{leadershipTeam.length} Profiles</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="opacity-90">Principal</span>
                    <span className="font-bold">{principal ? 1 : 0}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="opacity-90">Deputy Principals</span>
                    <span className="font-bold">{[academicsDeputy, adminDeputy].filter(Boolean).length}</span>
                  </div>
                  <p className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-[11px] font-medium leading-5 text-white/75">
                    Leadership profiles are managed from the Staff module and published here automatically.
                  </p>
                </div>
                
                <button 
                  onClick={() => router.push('/pages/SchoolTeam')}
                  className="w-full py-2.5 sm:py-3 bg-white/20 hover:bg-white/30 rounded-xl font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
                >
                  View Leadership Directory
                  <FiChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Modern Table View for All Staff - Fully Responsive */
          <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
            
            {/* Table Header with Search and Filters */}
            <div className="p-4 sm:p-6 border-b border-emerald-100 bg-gradient-to-r from-emerald-50/50 to-white">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-emerald-800 flex items-center gap-2">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                    Complete Staff Directory
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    {sortedStaff.length} staff members • Page {currentPage} of {totalPages || 1}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  {/* Search Bar */}
                  <div className="relative flex-1 sm:flex-none">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search staff..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pl-9 pr-4 py-2 border border-emerald-200 rounded-xl text-xs sm:text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Role Filter */}
                  <div className="relative flex-1 sm:flex-none">
                    <select
                      value={filterRole}
                      onChange={(e) => {
                        setFilterRole(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pl-4 pr-8 py-2 border border-emerald-200 rounded-xl text-xs sm:text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-auto"
                    >
                      <option value="all">All Roles</option>
                      <option value="principal">Principal</option>
                      <option value="deputy">Deputy Principals</option>
                      <option value="teacher">Teaching Staff</option>
                      <option value="support">Support Staff</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Staff Table - Horizontal scroll on mobile */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[768px] lg:min-w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider cursor-pointer hover:text-emerald-700" onClick={() => handleSort('name')}>
                      <div className="flex items-center gap-1">
                        Staff Member
                        {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </div>
                    </th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider cursor-pointer hover:text-emerald-700" onClick={() => handleSort('position')}>
                      <div className="flex items-center gap-1">
                        Position
                        {sortField === 'position' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </div>
                    </th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider cursor-pointer hover:text-emerald-700" onClick={() => handleSort('department')}>
                      <div className="flex items-center gap-1">
                        Department
                        {sortField === 'department' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </div>
                    </th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider cursor-pointer hover:text-emerald-700" onClick={() => handleSort('contact')}>
                      <div className="flex items-center gap-1">
                        Contact
                        {sortField === 'contact' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </div>
                    </th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider">Role</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-center text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider">Action</th>
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
                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-100 flex-shrink-0">
                              <StaffImage 
                                staffMember={member}
                                className="w-full h-full"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">{member.name}</p>
                              {member.qualification && (
                                <p className="text-[10px] sm:text-xs text-slate-500 truncate hidden sm:block">{member.qualification}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        
                        {/* Position Column */}
                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                          <p className="text-[11px] sm:text-sm text-slate-700 font-medium truncate max-w-[120px] sm:max-w-none">
                            {member.position || member.role || 'Staff Member'}
                          </p>
                        </td>
                        
                        {/* Department/Subject Column */}
                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                          <p className="text-[11px] sm:text-sm text-slate-600 truncate max-w-[100px] sm:max-w-none">
                            {member.department || member.subject || '—'}
                          </p>
                        </td>

                        {/* Contact Column */}
                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                          <div className="space-y-0.5 text-[11px] sm:text-sm text-slate-600">
                            {member.email ? (
                              <p className="truncate max-w-[150px] sm:max-w-[220px]}">{member.email}</p>
                            ) : null}
                            {member.phone ? (
                              <p className="truncate max-w-[150px] sm:max-w-[220px]">{formatPhone(member.phone)}</p>
                            ) : null}
                            {!member.email && !member.phone ? (
                              <p className="text-slate-400">—</p>
                            ) : null}
                          </div>
                        </td>
                   
                        
                        {/* Role Badge Column */}
                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                          <span className={`inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-bold whitespace-nowrap ${roleBadge.bg} ${roleBadge.text}`}>
                            {roleBadge.icon}
                            <span className="hidden sm:inline">{roleBadge.label}</span>
                            <span className="sm:hidden">{roleBadge.label?.substring(0, 3)}</span>
                          </span>
                        </td>
                        
                        {/* Action Column */}
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-center">
                          <button 
                            className="text-emerald-600 hover:text-emerald-700 text-[10px] sm:text-xs font-semibold flex items-center gap-0.5 sm:gap-1 mx-auto whitespace-nowrap"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStaffClick(member);
                              setActiveTab('featured');
                            }}
                          >
                            <span className="hidden sm:inline">View</span>
                            Profile
                            <FiChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
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
              <div className="text-center py-8 sm:py-12">
                <Users className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-3 sm:mb-4" />
                <p className="text-slate-500 font-medium text-sm sm:text-base">No staff members found</p>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">Try adjusting your search or filter</p>
              </div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-3 sm:px-4 py-3 sm:py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 order-2 sm:order-1"
                >
                  <FiChevronRight className="w-3 h-3 sm:w-4 sm:h-4 rotate-180" />
                  Previous
                </button>
                
                <div className="flex gap-1 order-1 sm:order-2">
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
                        className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg text-[11px] sm:text-sm font-medium transition-colors ${
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
                  className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 order-3"
                >
                  Next
                  <FiChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            )}
            
            {/* Table Footer Stats */}
            <div className="px-3 sm:px-4 py-2 sm:py-3 bg-slate-50/80 border-t border-slate-100 text-[10px] sm:text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
              <span>Showing {paginatedStaff.length} of {sortedStaff.length} staff members</span>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-center">
                <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-600"></span> Principal</span>
                <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-teal-500"></span> Deputy</span>
                <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400"></span> Teacher</span>
                <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-slate-400"></span> Support</span>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Hint */}
        {isMobile && activeTab === 'featured' && (
          <div className="mt-6 text-center text-xs sm:text-sm text-slate-500">
            Tap a leadership card to view the full profile
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernStaffLeadership;