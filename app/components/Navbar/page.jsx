'use client';
import { useState, useEffect, useRef } from 'react';
import { 
  FiMenu, 
  FiX, 
  FiHome, 
  FiInfo, 
  FiBook, 
  FiUserPlus,
  FiCalendar,
  FiImage,
  FiMail,
  FiUsers,
  FiFileText,
  FiChevronDown,
  FiBriefcase,
  FiChevronRight,
  FiLock,
  FiDollarSign,
  FiGrid,
  FiBookOpen,
  FiAward,
  FiHeart
} from 'react-icons/fi';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function ModernNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAcademicDropdownOpen, setIsAcademicDropdownOpen] = useState(false);
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isMobileResourcesDropdownOpen, setIsMobileResourcesDropdownOpen] = useState(false);
  
  const academicDropdownRef = useRef(null);
  const resourcesDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);
  const mobileResourcesDropdownRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
        setIsMobileDropdownOpen(false);
        setIsMobileResourcesDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (academicDropdownRef.current && !academicDropdownRef.current.contains(event.target)) {
        setIsAcademicDropdownOpen(false);
      }
      if (resourcesDropdownRef.current && !resourcesDropdownRef.current.contains(event.target)) {
        setIsResourcesDropdownOpen(false);
      }
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target)) {
        setIsMobileDropdownOpen(false);
      }
      if (mobileResourcesDropdownRef.current && !mobileResourcesDropdownRef.current.contains(event.target)) {
        setIsMobileResourcesDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Main navigation - UPDATED NAMES for Matungulu Girls
  const mainNavigation = [
    { 
      name: 'Home', 
      href: '/', 
      icon: FiHome,
      exact: true
    },
    { 
      name: 'Discover Us', 
      href: '/pages/AboutUs',
      icon: FiInfo
    },
    { 
      name: 'Help Center', 
      href: '/pages/contact', 
      icon: FiMail 
    },
     { 
      name: 'Curriculum', 
      href: '/pages/admissions',
      icon: FiUserPlus
    },
    { 
      name: 'Academics', 
      href: '/pages/academics',
      icon: FiBook,
      hasDropdown: true
    },
    { 
      name: 'Gallery', 
      href: '/pages/gallery', 
      icon: FiImage 
    },
    { 
      name: 'Activities', 
      href: '/pages/eventsandnews', 
      icon: FiCalendar 
    },
  ];

  // Academic dropdown items - WITH DESCRIPTIONS (like Kinyui)
  const academicDropdownItems = [
    {
      name: 'Student Portal',
      href: '/pages/StudentPortal',
      icon: FiFileText,
      description: 'Access your academic records & results'
    },
    {
      name: 'Guidance & Counselling',
      href: '/pages/Guidance-and-Councelling',
      icon: FiUsers,
      description: 'Student support & wellness services'
    },
      {
      name: 'School Achievements',
      href: '/pages/Achievements',
      icon: FiAward,
      description: 'Celebrating our students\' successes & milestones'
    },
    {
      name: 'School Magazine',
      href: '/pages/School Magazine',
      icon: FiBookOpen,
      description: 'School publications & newsletters'
    },
    {
      name: 'Apply Now',
      href: '/pages/apply-for-admissions',
      icon: FiUserPlus,
      description: 'Start your application process'
    },
    {
      name: 'School Rules',
      href: '/pages/School Policies',
      icon: FiAward,
      description: 'Policies & student regulations'
    }
  ];

  // Resources dropdown items - WITH DESCRIPTIONS (matching Kinyui style)
  const resourcesDropdownItems = [
    {
      name: 'Admin Login',
      href: '/pages/adminLogin',
      icon: FiLock,
      description: 'Secure portal for administrators',
      isHighlighted: true
    },
    {
      name: 'Careers',
      href: '/pages/careers',
      icon: FiBriefcase,
      description: 'Job opportunities at Matungulu Girls'
    },
    {
      name: 'Staff Directory',
      href: '/pages/SchoolTeam',
      icon: FiUsers,
      description: 'Find staff contacts & departments'
    },
    {
      name: 'Alumni page',
      href: 'https://www.facebook.com/groups/53636547389',
      icon: FiHeart,
      description: 'Connect with fellow alumnae'
    }
  ];

  // Function to check if a link is active
  const isActiveLink = (href, exact = false) => {
    if (!pathname) return false;
    if (href === '/') {
      return pathname === '/';
    }
    if (exact) {
      return pathname === href;
    }
    return pathname && pathname.startsWith(href);
  };

  // Navigation handlers
  const handleLogoClick = () => {
    window.location.href = '/';
  };

  const handleLogoKeyDown = (e) => {
    if (e.key === 'Enter') {
      window.location.href = '/';
    }
  };

  return (
    <>
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-gradient-to-br from-emerald-900 to-teal-900 backdrop-blur-lg shadow-xl border-b border-white/10' 
            : 'bg-gradient-to-br from-emerald-900 to-teal-900 shadow-lg'
        }`}
      >
        <div className="w-full px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between min-h-[4.5rem] sm:min-h-[5.2rem]">
            
            {/* Logo Section */}
            <div 
              className="flex items-center gap-2 xs:gap-3 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={handleLogoClick}
              role="button"
              tabIndex={0}
              onKeyDown={handleLogoKeyDown}
            >
              <div className="relative w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 
                bg-white/10 rounded-lg xs:rounded-xl flex items-center justify-center 
                shadow-lg border border-white/20 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                <Image
                  src="/MatG.jpg"
                  alt="Matungulu Girls Senior School Logo"
                  width={48}
                  height={48}
                  className="relative z-10 cursor-pointer filter drop-shadow-sm group-hover:scale-100 transition-transform duration-300 w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14"
                  priority
                  sizes="(max-width: 480px) 48px, (max-width: 640px) 56px, 64px"
                />
              </div>
              <div className="sm:block">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white whitespace-nowrap tracking-tight">
                  MatG 
                </h1>
                <p className="text-xs sm:text-sm text-emerald-100/90 font-medium tracking-wide whitespace-nowrap">
                  Strive to Excel
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-center flex-1 mx-8 min-w-0">
              <div className="flex items-center justify-between w-full max-w-7xl gap-0.5">
                {mainNavigation.map((item) => {
                  const isActive = isActiveLink(item.href, item.exact);
                  
                  if (item.hasDropdown) {
                    return (
                      <div 
                        key={item.name} 
                        className="relative"
                        ref={academicDropdownRef}
                        onMouseEnter={() => setIsAcademicDropdownOpen(true)}
                        onMouseLeave={() => setIsAcademicDropdownOpen(false)}
                      >
                        <button
                          className={`group flex items-center gap-0.5 xs:gap-1 font-bold transition-all text-[0.85rem] xs:text-[0.9rem] tracking-wide whitespace-nowrap px-1.5 xs:px-2 py-2 relative ${
                            isActive || isAcademicDropdownOpen
                              ? 'text-white' 
                              : 'text-white/90 hover:text-emerald-100'
                          }`}
                          aria-expanded={isAcademicDropdownOpen}
                          aria-haspopup="true"
                        >
                          <item.icon className="text-xs flex-shrink-0" />
                          <span className="truncate">{item.name}</span>
                          <FiChevronDown className={`text-xs transition-transform duration-200 ${
                            isAcademicDropdownOpen ? 'rotate-180' : ''
                          }`} />
                          
                          {(isActive || isAcademicDropdownOpen) && (
                            <span className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-emerald-300 rounded-full"></span>
                          )}
                        </button>

                        {/* Academic Dropdown - With descriptions like Kinyui */}
                        {isAcademicDropdownOpen && (
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3">
                              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                                <FiBook className="text-white" />
                                Academic Resources
                              </h3>
                              <p className="text-emerald-100 text-xs mt-0.5">Everything you need for your academic journey</p>
                            </div>
                            
                            <div className="p-2">
                              {academicDropdownItems.map((dropdownItem) => (
                                <a
                                  key={dropdownItem.name}
                                  href={dropdownItem.href}
                                  className={`group flex items-start gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                                    isActiveLink(dropdownItem.href)
                                      ? 'bg-emerald-50'
                                      : 'hover:bg-gray-50'
                                  }`}
                                  onClick={() => setIsAcademicDropdownOpen(false)}
                                >
                                  <div className={`p-2 rounded-lg ${
                                    isActiveLink(dropdownItem.href)
                                      ? 'bg-emerald-100 text-emerald-700'
                                      : 'bg-gray-100 text-gray-600 group-hover:bg-emerald-100 group-hover:text-emerald-700'
                                  } transition-colors`}>
                                    <dropdownItem.icon className="text-sm" />
                                  </div>
                                  <div className="flex-1">
                                    <div className={`font-semibold text-sm ${
                                      isActiveLink(dropdownItem.href)
                                        ? 'text-emerald-800'
                                        : 'text-gray-800 group-hover:text-emerald-800'
                                    }`}>
                                      {dropdownItem.name}
                                    </div>
                                    {dropdownItem.description && (
                                      <p className="text-xs text-gray-500 mt-0.5">{dropdownItem.description}</p>
                                    )}
                                  </div>
                                  <FiChevronRight className={`text-xs mt-2 transition-all ${
                                    isActiveLink(dropdownItem.href)
                                      ? 'text-emerald-600 opacity-100'
                                      : 'text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-emerald-600'
                                  }`} />
                                </a>
                              ))}
                            </div>
                            
                            <div className="border-t border-gray-100 bg-gray-50 px-4 py-2">
                              <a 
                                href="https://analytics.zeraki.app/" 
                                className="flex items-center justify-between group py-1.5"
                                onClick={() => setIsAcademicDropdownOpen(false)}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5">
                                    <img 
                                      src="/zeraki.jpg" 
                                      alt="Zeraki Analytics" 
                                      className="w-full h-full object-cover rounded"
                                    />
                                  </div>
                                  <span className="text-xs font-medium text-gray-600 group-hover:text-emerald-700">Zeraki Analytics</span>
                                </div>
                                <span className="text-xs text-gray-400 group-hover:text-emerald-600">External →</span>
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center gap-0.5 xs:gap-1 font-bold transition-all text-[0.85rem] xs:text-[0.9rem] tracking-wide whitespace-nowrap px-1.5 xs:px-2 py-2 relative ${
                        isActive 
                          ? 'text-emerald-100' 
                          : 'text-white/80 hover:text-emerald-100'
                      }`}
                    >
                      <item.icon className="text-xs flex-shrink-0" />
                      <span className="truncate">{item.name}</span>
                      
                      {isActive && (
                        <span className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-5 h-0.5 bg-emerald-300 rounded-full"></span>
                      )}
                      
                      <span className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-emerald-300/50 rounded-full group-hover:w-5 transition-all duration-300"></span>
                    </a>
                  );
                })}
                
                <div 
                  className="relative"
                  ref={resourcesDropdownRef}
                  onMouseEnter={() => setIsResourcesDropdownOpen(true)}
                  onMouseLeave={() => setIsResourcesDropdownOpen(false)}
                >
                  <button
                    className={`group flex items-center gap-0.5 xs:gap-1 font-bold transition-all text-[0.85rem] xs:text-[0.9rem] tracking-wide whitespace-nowrap px-1.5 xs:px-2 py-2 relative ${
                      isResourcesDropdownOpen || 
                      isActiveLink('/pages/careers') ||
                      isActiveLink('/pages/adminLogin') ||
                      isActiveLink('/pages/SchoolTeam') ||
                      isActiveLink('/pages/alumni')
                        ? 'text-emerald-100' 
                        : 'text-white/80 hover:text-emerald-100'
                    }`}
                    aria-expanded={isResourcesDropdownOpen}
                    aria-haspopup="true"
                  >
                    <FiGrid className="text-xs flex-shrink-0" />
                    <span className="truncate">School Hub </span>
                    <FiChevronDown className={`text-xs transition-transform duration-200 ${
                      isResourcesDropdownOpen ? 'rotate-180' : ''
                    }`} />
                    
                    {(isResourcesDropdownOpen || 
                      isActiveLink('/pages/adminLogin') ||
                      isActiveLink('/pages/careers') ||
                      isActiveLink('/pages/SchoolTeam') ||
                      isActiveLink('/pages/alumni')) && (
                      <span className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-emerald-300 rounded-full"></span>
                    )}
                  </button>

                  {/* Resources Dropdown - With descriptions */}
                  {isResourcesDropdownOpen && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-3">
                        <h3 className="font-bold text-white text-sm flex items-center gap-2">
                          <FiGrid className="text-teal-200" />
                          Resources & Information
                        </h3>
                        <p className="text-teal-100 text-xs mt-0.5">Essential links for staff & administrators</p>
                      </div>
                      
                      <div className="p-2">
                        {resourcesDropdownItems.map((dropdownItem) => (
                          <a
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className={`group flex items-start gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                              isActiveLink(dropdownItem.href)
                                ? dropdownItem.isHighlighted
                                  ? 'bg-emerald-50'
                                  : 'bg-teal-50'
                                : dropdownItem.isHighlighted
                                  ? 'hover:bg-emerald-50'
                                  : 'hover:bg-gray-50'
                            }`}
                            onClick={() => setIsResourcesDropdownOpen(false)}
                          >
                            <div className={`p-2 rounded-lg ${
                              isActiveLink(dropdownItem.href)
                                ? dropdownItem.isHighlighted
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-teal-100 text-teal-700'
                                : dropdownItem.isHighlighted
                                  ? 'bg-gray-100 text-emerald-600 group-hover:bg-emerald-100 group-hover:text-emerald-700'
                                  : 'bg-gray-100 text-gray-600 group-hover:bg-teal-100 group-hover:text-teal-700'
                            } transition-colors`}>
                              <dropdownItem.icon className="text-sm" />
                            </div>
                            <div className="flex-1">
                              <div className={`font-semibold text-sm ${
                                isActiveLink(dropdownItem.href)
                                  ? dropdownItem.isHighlighted
                                    ? 'text-emerald-800'
                                    : 'text-teal-800'
                                  : dropdownItem.isHighlighted
                                    ? 'text-gray-800 group-hover:text-emerald-800'
                                    : 'text-gray-800 group-hover:text-teal-800'
                              }`}>
                                {dropdownItem.name}
                                {dropdownItem.isHighlighted && (
                                  <span className="ml-2 text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">Secure</span>
                                )}
                              </div>
                              {dropdownItem.description && (
                                <p className="text-xs text-gray-500 mt-0.5">{dropdownItem.description}</p>
                              )}
                            </div>
                            <FiChevronRight className={`text-xs mt-2 transition-all ${
                              isActiveLink(dropdownItem.href)
                                ? dropdownItem.isHighlighted
                                  ? 'text-emerald-600 opacity-100'
                                  : 'text-teal-600 opacity-100'
                                : 'text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-teal-600'
                            }`} />
                          </a>
                        ))}
                      </div>
                      
                      <div className="border-t border-gray-100 bg-gray-50 px-4 py-2">
                        <p className="text-[10px] text-gray-400 text-center">
                          Secure access for authorized personnel only
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <a
                  href="/pages/School Fees"
                  className={`group flex items-center gap-0.5 xs:gap-1 font-bold transition-all text-[0.85rem] xs:text-[0.9rem] tracking-wide whitespace-nowrap px-1.5 xs:px-2 py-2 relative ${
                    isActiveLink('/pages/School Fees')
                      ? 'text-emerald-100'
                      : 'text-white/80 hover:text-emerald-100'
                  }`}
                >
                  <FiDollarSign className="text-xs flex-shrink-0" />
                  <span className="truncate">School Fees</span>

                  {isActiveLink('/pages/School Fees') && (
                    <span className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-5 h-0.5 bg-emerald-300 rounded-full"></span>
                  )}

                  <span className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-emerald-300/50 rounded-full group-hover:w-5 transition-all duration-300"></span>
                </a>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2.5 xs:p-3 rounded-lg xs:rounded-xl text-white 
                bg-white/10 hover:bg-white/20 transition-all active:scale-95 ml-auto"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <FiX className="text-xl xs:text-2xl sm:text-3xl" />
              ) : (
                <FiMenu className="text-xl xs:text-2xl sm:text-3xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-gradient-to-b from-emerald-800 to-teal-800 border-t border-white/10">
            <div className="px-3 xs:px-4 sm:px-6 py-6 xs:py-8 max-w-2xl mx-auto">
              <div className="space-y-1.5 xs:space-y-2 mb-6 xs:mb-8">
                {mainNavigation.map((item) => {
                  const isActive = isActiveLink(item.href, item.exact);
                  
                  if (item.hasDropdown) {
                    return (
                      <div key={item.name} className="space-y-1.5 xs:space-y-2" ref={mobileDropdownRef}>
                        <button
                          onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                          className={`w-full flex items-center justify-between p-3 xs:p-4 rounded-lg xs:rounded-xl text-left ${
                            isActive || isMobileDropdownOpen
                              ? 'bg-white/10 text-emerald-200'
                              : 'text-white/90 hover:bg-white/5'
                          }`}
                          aria-expanded={isMobileDropdownOpen}
                        >
                          <div className="flex items-center gap-2 xs:gap-3">
                            <item.icon className="text-lg xs:text-xl" />
                            <span className="font-bold text-base xs:text-lg tracking-wide">{item.name}</span>
                          </div>
                          <FiChevronDown className={`text-lg xs:text-xl transition-transform duration-200 ${
                            isMobileDropdownOpen ? 'rotate-180' : ''
                          }`} />
                        </button>
                        
                        {isMobileDropdownOpen && (
                          <div className="ml-6 xs:ml-8 space-y-1.5 xs:space-y-2 pl-3 xs:pl-4 border-l-2 border-white/20">
                            {academicDropdownItems.map((dropdownItem) => (
                              <a
                                key={dropdownItem.name}
                                href={dropdownItem.href}
                                className={`flex items-center gap-2 xs:gap-3 p-2.5 xs:p-3 rounded-lg ${
                                  isActiveLink(dropdownItem.href)
                                    ? 'bg-white/10 text-emerald-200'
                                    : 'text-white/80 hover:bg-white/5'
                                }`}
                                onClick={() => {
                                  setIsOpen(false);
                                  setIsMobileDropdownOpen(false);
                                }}
                              >
                                <dropdownItem.icon className="text-base xs:text-lg" />
                                <div>
                                  <span className="font-medium text-sm xs:text-base">{dropdownItem.name}</span>
                                  {dropdownItem.description && (
                                    <p className="text-xs text-white/60 mt-0.5">{dropdownItem.description}</p>
                                  )}
                                </div>
                              </a>
                            ))}
                            
                            <a
                              href="https://analytics.zeraki.app/"
                              className="flex items-center gap-2 xs:gap-3 p-2.5 xs:p-3 rounded-lg text-white/80 hover:bg-white/5"
                              onClick={() => {
                                setIsOpen(false);
                                setIsMobileDropdownOpen(false);
                              }}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <div className="w-5 h-5 xs:w-6 xs:h-6 flex-shrink-0">
                                <img 
                                  src="/zeraki.jpg" 
                                  alt="Zeraki Analytics" 
                                  className="w-full h-full object-cover rounded-md border border-white/30"
                                />
                              </div>
                              <span className="font-medium text-sm xs:text-base">Zeraki Analytics</span>
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-2 xs:gap-3 p-3 xs:p-4 rounded-lg xs:rounded-xl ${
                        isActive
                          ? 'bg-white/10 text-emerald-200'
                          : 'text-white/90 hover:bg-white/5'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="text-lg xs:text-xl" />
                      <span className="font-bold text-base xs:text-lg tracking-wide">{item.name}</span>
                    </a>
                  );
                })}

                {/* Mobile Resources Dropdown */}
                <div className="space-y-1.5 xs:space-y-2" ref={mobileResourcesDropdownRef}>
                  <button
                    onClick={() => setIsMobileResourcesDropdownOpen(!isMobileResourcesDropdownOpen)}
                    className={`w-full flex items-center justify-between p-3 xs:p-4 rounded-lg xs:rounded-xl text-left ${
                      isMobileResourcesDropdownOpen ||
                      isActiveLink('/pages/SchoolTeam') ||
                      isActiveLink('/pages/careers') ||
                      isActiveLink('/pages/adminLogin') ||
                      isActiveLink('/pages/alumni')
                        ? 'bg-white/10 text-emerald-200'
                        : 'text-white/90 hover:bg-white/5'
                    }`}
                    aria-expanded={isMobileResourcesDropdownOpen}
                  >
                    <div className="flex items-center gap-2 xs:gap-3">
                      <FiGrid className="text-lg xs:text-xl" />
                      <span className="font-bold text-base xs:text-lg tracking-wide">Resources</span>
                    </div>
                    <FiChevronDown className={`text-lg xs:text-xl transition-transform duration-200 ${
                      isMobileResourcesDropdownOpen ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {isMobileResourcesDropdownOpen && (
                    <div className="ml-6 xs:ml-8 space-y-1.5 xs:space-y-2 pl-3 xs:pl-4 border-l-2 border-white/20">
                      {resourcesDropdownItems.map((dropdownItem) => (
                        <a
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          className={`flex items-center gap-2 xs:gap-3 p-2.5 xs:p-3 rounded-lg ${
                            isActiveLink(dropdownItem.href)
                              ? dropdownItem.isHighlighted
                                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-200'
                                : 'bg-white/10 text-emerald-200'
                              : dropdownItem.isHighlighted
                                ? 'text-white hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-teal-500/20'
                                : 'text-white/80 hover:bg-white/5'
                          }`}
                          onClick={() => {
                            setIsOpen(false);
                            setIsMobileResourcesDropdownOpen(false);
                          }}
                        >
                          <dropdownItem.icon className="text-base xs:text-lg" />
                          <div>
                            <span className={`font-medium text-sm xs:text-base ${
                              dropdownItem.isHighlighted ? 'font-bold' : ''
                            }`}>
                              {dropdownItem.name}
                            </span>
                            {dropdownItem.description && (
                              <p className="text-xs text-white/60 mt-0.5">{dropdownItem.description}</p>
                            )}
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* School Fees Mobile Link */}
                <a
                  href="/pages/School Fees"
                  className={`flex items-center gap-2 xs:gap-3 p-3 xs:p-4 rounded-lg xs:rounded-xl ${
                    isActiveLink('/pages/School Fees')
                      ? 'bg-white/10 text-emerald-200'
                      : 'text-white/90 hover:bg-white/5'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <FiDollarSign className="text-lg xs:text-xl" />
                  <span className="font-bold text-base xs:text-lg tracking-wide">School Fees</span>
                </a>
              </div>

              {/* Mobile Footer */}
              <div className="mt-6 xs:mt-8 pt-4 xs:pt-6 border-t border-white/20 text-center">
                <p className="text-white/70 text-xs xs:text-sm font-medium">
                  The Champions🏆....Our slogan
                </p>
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="h-[4.5rem] xs:h-20 sm:h-22 lg:h-24 transition-all duration-300"></div>
    </>
  );
}