'use client';
import { useState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import { 
  FiUser, 
  FiCalendar, 
  FiFileText, 
  FiCheckCircle,
  FiClock,
  FiAward,
  FiUsers,
  FiBook,
  FiCheck,
  FiHome,
  FiMail,
  FiPhone,
  FiMapPin,
  FiDownload,
  FiStar,
  FiHelpCircle,
  FiPlay,
  FiShare2,
  FiChevronDown,
  FiBarChart2,
  FiHeart,
  FiTarget,
  FiGlobe,
  FiBookOpen,
  FiCpu,
  FiMusic,
  FiActivity,
  FiZap,
  FiTrendingUp,
  FiEye,
  FiLayers,
  FiPlus,
  FiX,
  FiFilter,
  FiSearch,
  FiRotateCw,
  FiRefreshCw, 
  FiEdit3,
  FiTrash2,
  FiMessageCircle,
  FiAlertTriangle,
  FiSave,
  FiImage,
  FiUpload,
  FiVideo,
  FiDollarSign,
  FiFile,
  FiClipboard,
  FiCreditCard,
  FiInfo,
  FiGrid,
  FiFolder,
  FiList,
  FiSettings,
  FiPieChart,
  FiTool,
  FiSmartphone,
  FiCode,
  FiShield,
  FiTarget as FiTargetIcon,
  FiBookmark,
  FiCalendar as FiCalendarIcon,
  FiBriefcase,
  FiGlobe as FiGlobeIcon,
  FiMic,
  FiCamera,
  FiMonitor,
  FiTrendingUp as FiTrendingUpIcon,
  FiTool as FiToolIcon,
  FiPenTool,
  FiDatabase,
  FiCloud,
  FiLock,
  FiShoppingBag,
  FiDroplet,
  FiTruck,
  FiScissors,
  FiCoffee,
  FiChef,
  FiMusic as FiMusicIcon,
  FiChevronRight,
   FiChevronLeft 
} from 'react-icons/fi';
import {  FiChevronUp, FiArrowRight } from 'react-icons/fi';
import { format } from 'date-fns';

import { 
  IoSchoolOutline,
  IoDocumentsOutline,
  IoSpeedometerOutline,
  IoPeopleOutline,
  IoLibraryOutline,
  IoStatsChartOutline,
  IoRocketOutline,
  IoBookOutline,
  IoCalculatorOutline,
  IoSparkles,
  IoAccessibilityOutline,
  IoBuildOutline,
  IoAnalyticsOutline,
  IoBulbOutline,
  IoCheckmarkCircleOutline,
  IoCalendarOutline,
  IoDocumentTextOutline,
  IoReceiptOutline,
  IoShirtOutline,
  IoVideocamOutline,
  IoCloudDownloadOutline,
  IoEyeOutline,
  IoMedkitOutline,
  IoConstructOutline,
  IoCarOutline,
  IoRestaurantOutline,
  IoFlaskOutline,
  IoCodeSlashOutline,
  IoBusinessOutline,
  IoNewspaperOutline,
  IoLanguageOutline
} from 'react-icons/io5';
import { IoCheckmarkCircle, IoArrowForward, IoFlash } from 'react-icons/io5';

const formatDateWithOrdinal = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  
  // Safety check for invalid dates
  if (isNaN(date.getTime())) return '';

  const n = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();

  // Your preserved ordinal logic, condensed for refinement
  const getOrdinal = (num) => {
    const lastTwo = num % 100;
    if (lastTwo >= 11 && lastTwo <= 13) return num + 'th';
    
    switch (num % 10) {
      case 1:  return num + 'st';
      case 2:  return num + 'nd';
      case 3:  return num + 'rd';
      default: return num + 'th';
    }
  };

  return `${getOrdinal(n)} ${month} ${year}`;
};

// Result: formatDateWithOrdinal("2026-01-23") -> "23rd Jan 2026"


import { useRouter } from 'next/navigation';
import { CircularProgress } from '@mui/material';

// Modern Modal Component - Mobile Responsive


const CareerSearchPage = () => {
  const [globalSearch, setGlobalSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedDept, setExpandedDept] = useState(null);
  const deptsPerPage = 3; // Show 3 departments per page
  
  // Enhanced Senior School departments with more career paths
  const highSchoolDepartments = [
    {
      department: 'MATHEMATICS',
      icon: IoCalculatorOutline,
      color: 'from-purple-600 to-pink-500',
      description: 'Master logical thinking, problem-solving, and analytical skills',
      subjects: ['Pure Mathematics', 'Applied Mathematics', 'Statistics', 'Business Mathematics'],
      careerPaths: [
        {
          title: 'Finance & Banking',
          description: 'Excel in financial analysis, investment, and economic planning',
          examples: 'Accountants, Financial Analysts, Bankers, Actuaries, Investment Bankers'
        },
        {
          title: 'Data Science & Analytics',
          description: 'Transform data into valuable insights and predictive models',
          examples: 'Data Scientists, Statisticians, Market Researchers, Business Analysts'
        },
        {
          title: 'Engineering & Architecture',
          description: 'Apply mathematical principles to design and construction',
          examples: 'Structural Engineers, Architects, Quantity Surveyors, Civil Engineers'
        },
        {
          title: 'Education & Research',
          description: 'Share mathematical knowledge and conduct advanced research',
          examples: 'Mathematics Teachers, University Lecturers, Researchers, Curriculum Developers'
        },
        {
          title: 'Technology & Computing',
          description: 'Develop algorithms and computational solutions',
          examples: 'Software Engineers, Cryptographers, AI Specialists, Game Developers'
        },
        {
          title: 'Actuarial Science',
          description: 'Assess financial risks using mathematics and statistics',
          examples: 'Actuaries, Risk Analysts, Insurance Underwriters, Pension Consultants'
        }
      ]
    },
    {
      department: 'SCIENCES',
      icon: IoFlaskOutline,
      color: 'from-blue-600 to-cyan-500',
      description: 'Explore the world through scientific inquiry and discovery',
      subjects: ['Biology', 'Chemistry', 'Physics', 'Agriculture', 'Physical Education'],
      careerPaths: [
        {
          title: 'Medical & Health Sciences',
          description: 'Pursue careers in healthcare and medical research',
          examples: 'Doctors, Nurses, Pharmacists, Dentists, Medical Researchers, Physiotherapists'
        },
        {
          title: 'Engineering & Technology',
          description: 'Design and build innovative solutions for the future',
          examples: 'Civil Engineers, Electrical Engineers, Mechanical Engineers, Architects, Chemical Engineers'
        },
        {
          title: 'Environmental Sciences',
          description: 'Protect and preserve our natural environment',
          examples: 'Environmental Scientists, Conservationists, Wildlife Biologists, Forest Rangers'
        },
        {
          title: 'Research & Development',
          description: 'Advance scientific knowledge through research',
          examples: 'Research Scientists, Laboratory Technicians, Biotechnologists, Quality Controllers'
        },
        {
          title: 'Agricultural Sciences',
          description: 'Improve food production and sustainable farming',
          examples: 'Agricultural Officers, Food Scientists, Horticulturists, Animal Scientists'
        },
        {
          title: 'Sports Science',
          description: 'Enhance athletic performance and physical health',
          examples: 'Sports Coaches, Physiotherapists, Fitness Trainers, Sports Psychologists'
        }
      ]
    },
    {
      department: 'LANGUAGES',
      icon: IoLanguageOutline,
      color: 'from-green-600 to-emerald-500',
      description: 'Develop communication skills and cultural understanding',
      subjects: ['English', 'Kiswahili', 'French', 'German', 'Arabic'],
      careerPaths: [
        {
          title: 'Communication & Media',
          description: 'Excel in writing, broadcasting, and media production',
          examples: 'Journalists, Editors, Translators, Content Writers, Broadcasters'
        },
        {
          title: 'International Relations',
          description: 'Bridge cultural gaps in global contexts',
          examples: 'Diplomats, UN Officers, International Business Consultants, Foreign Service Officers'
        },
        {
          title: 'Education & Publishing',
          description: 'Teach languages and contribute to literary works',
          examples: 'Language Teachers, Publishers, Literary Critics, Curriculum Developers'
        },
        {
          title: 'Tourism & Hospitality',
          description: 'Connect with people from around the world',
          examples: 'Tour Guides, Hotel Managers, Flight Attendants, Travel Agents'
        },
        {
          title: 'Law & Advocacy',
          description: 'Use language skills in legal and advocacy work',
          examples: 'Lawyers, Legal Translators, Human Rights Officers, Policy Analysts'
        },
        {
          title: 'Creative Writing',
          description: 'Express ideas through various literary forms',
          examples: 'Authors, Scriptwriters, Copywriters, Poets, Content Creators'
        }
      ]
    },
    {
      department: 'HUMANITIES',
      icon: IoNewspaperOutline,
      color: 'from-amber-600 to-orange-500',
      description: 'Understand human society, culture, and behavior',
      subjects: ['History', 'Geography', 'CRE/IRE/HRE', 'Life Skills', 'Government'],
      careerPaths: [
        {
          title: 'Law & Governance',
          description: 'Shape legal systems and public policy',
          examples: 'Lawyers, Judges, Policy Analysts, Human Rights Officers, Political Scientists'
        },
        {
          title: 'Social Services',
          description: 'Support communities and individuals in need',
          examples: 'Social Workers, Counselors, Community Developers, Humanitarian Workers'
        },
        {
          title: 'Cultural Heritage',
          description: 'Preserve and promote cultural identity',
          examples: 'Museum Curators, Historians, Cultural Officers, Anthropologists'
        },
        {
          title: 'Urban Planning',
          description: 'Design sustainable communities and cities',
          examples: 'Urban Planners, Environmental Consultants, GIS Specialists, Surveyors'
        },
        {
          title: 'Religious Studies',
          description: 'Guide spiritual development and religious education',
          examples: 'Clergy, Religious Educators, Chaplains, Interfaith Coordinators'
        },
        {
          title: 'Public Administration',
          description: 'Manage public resources and government services',
          examples: 'Administrative Officers, Public Relations Officers, Policy Makers'
        }
      ]
    },
    {
      department: 'TECHNICAL STUDIES',
      icon: IoConstructOutline,
      color: 'from-red-600 to-rose-500',
      description: 'Develop practical skills for immediate employment',
      subjects: ['Computer Studies', 'Business Studies', 'Home Science', 'Art & Design', 'Music'],
      careerPaths: [
        {
          title: 'Information Technology',
          description: 'Drive digital transformation and innovation',
          examples: 'Software Developers, Network Administrators, Cybersecurity Experts, Database Managers'
        },
        {
          title: 'Business & Entrepreneurship',
          description: 'Start and manage successful enterprises',
          examples: 'Business Owners, Marketing Managers, Financial Analysts, Sales Executives'
        },
        {
          title: 'Hospitality & Home Economics',
          description: 'Excel in food, nutrition, and hospitality services',
          examples: 'Chefs, Nutritionists, Hotel Managers, Fashion Designers, Caterers'
        },
        {
          title: 'Creative Arts & Design',
          description: 'Express creativity through various media',
          examples: 'Graphic Designers, Artists, Multimedia Specialists, Animators, Musicians'
        },
        {
          title: 'Technical Trades',
          description: 'Master hands-on technical skills',
          examples: 'Electricians, Plumbers, Mechanics, Carpenters, Technicians'
        },
        {
          title: 'Media Production',
          description: 'Create audio-visual content and productions',
          examples: 'Film Directors, Sound Engineers, Photographers, Video Editors'
        }
      ]
    },
    {
      department: 'COMMERCIAL STUDIES',
      icon: IoBusinessOutline,
      color: 'from-indigo-600 to-blue-500',
      description: 'Master business principles and commercial operations',
      subjects: ['Commerce', 'Accounting', 'Economics', 'Entrepreneurship', 'Office Practice'],
      careerPaths: [
        {
          title: 'Accounting & Auditing',
          description: 'Manage financial records and ensure compliance',
          examples: 'Accountants, Auditors, Tax Consultants, Financial Controllers'
        },
        {
          title: 'Marketing & Advertising',
          description: 'Promote products and build brand awareness',
          examples: 'Marketing Managers, Advertising Executives, Brand Managers, Digital Marketers'
        },
        {
          title: 'Banking & Finance',
          description: 'Manage monetary transactions and investments',
          examples: 'Bankers, Financial Planners, Loan Officers, Investment Analysts'
        },
        {
          title: 'Office Administration',
          description: 'Ensure smooth office operations and management',
          examples: 'Office Administrators, Secretaries, Receptionists, Office Managers'
        },
        {
          title: 'Supply Chain',
          description: 'Manage logistics and procurement processes',
          examples: 'Procurement Officers, Logistics Managers, Supply Chain Analysts'
        },
        {
          title: 'Customer Service',
          description: 'Build customer relationships and satisfaction',
          examples: 'Customer Care Representatives, Client Relations Managers, Call Center Agents'
        }
      ]
    }
  ];
  
  // Get unique departments for filter
  const departments = [
    { value: "all", label: "All Departments" },
    ...highSchoolDepartments.map(dept => ({
      value: dept.department.toLowerCase(),
      label: dept.department
    }))
  ];
  
  // Filter departments based on search
  const filteredDepartments = highSchoolDepartments.filter((dept) => {
    const matchesSearch = 
      globalSearch === "" ||
      dept.department.toLowerCase().includes(globalSearch.toLowerCase()) ||
      dept.description.toLowerCase().includes(globalSearch.toLowerCase()) ||
      dept.subjects.some(subject => 
        subject.toLowerCase().includes(globalSearch.toLowerCase())
      ) ||
      dept.careerPaths.some(career => 
        career.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
        career.description.toLowerCase().includes(globalSearch.toLowerCase()) ||
        career.examples.toLowerCase().includes(globalSearch.toLowerCase())
      );
    
    const matchesDepartment = 
      selectedDepartment === "all" || 
      dept.department.toLowerCase() === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });
  
  // Pagination for departments
  const totalPages = Math.ceil(filteredDepartments.length / deptsPerPage);
  const indexOfLastDept = currentPage * deptsPerPage;
  const indexOfFirstDept = indexOfLastDept - deptsPerPage;
  const currentDepartments = filteredDepartments.slice(indexOfFirstDept, indexOfLastDept);
  
  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Reset filters
  const resetFilters = () => {
    setGlobalSearch("");
    setSelectedDepartment("all");
    setCurrentPage(1);
    setExpandedDept(null);
  };
  
  // Toggle department expansion
  const toggleDepartment = (deptIndex) => {
    setExpandedDept(expandedDept === deptIndex ? null : deptIndex);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-0 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-xl md:text-3xl font-extrabold text-slate-900 uppercase tracking-tighter leading-none mb-3">
            Career <span className="text-[#1a1a2e]">Explorer</span>
          </h1>
          <p className="text-slate-700 font-semibold text-xs md:text-sm uppercase tracking-[0.2em] mb-6">
            Browse careers by Senior School department
          </p>

          {/* SEARCH & FILTER BAR */}
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              {/* Search Input */}
              <div className="md:col-span-2 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiSearch className="text-slate-900" size={18} />
                </div>
                <input 
                  type="text"
                  placeholder="Search careers or subjects..."
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  value={globalSearch}
                  onChange={(e) => {
                    setGlobalSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              
              {/* Department Filter */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiFilter className="text-slate-900" size={16} />
                </div>
                <select
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none appearance-none"
                  value={selectedDepartment}
                  onChange={(e) => {
                    setSelectedDepartment(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  {departments.map((dept) => (
                    <option key={dept.value} value={dept.value}>
                      {dept.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FiChevronDown className="text-slate-900" />
                </div>
              </div>
            </div>
            
            {/* Results Stats & Reset */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
              <div className="text-center sm:text-left">
                <h3 className="text-base font-black text-slate-900">
                  {filteredDepartments.length} {filteredDepartments.length === 1 ? 'Department' : 'Departments'} Found
                </h3>
                <p className="text-slate-700 text-xs">
                  {selectedDepartment !== "all" && `in ${departments.find(d => d.value === selectedDepartment)?.label}`}
                  {globalSearch && ` matching "${globalSearch}"`}
                </p>
              </div>
              
              {(globalSearch || selectedDepartment !== "all") && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium text-xs"
                >
                  <FiRotateCw />
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* DEPARTMENTS GRID */}
        {currentDepartments.length > 0 ? (
          <>
            <div className="space-y-4 mb-8">
              {currentDepartments.map((dept, deptIndex) => {
                const isExpanded = expandedDept === deptIndex;
                const DepartmentIcon = dept.icon;
                
                return (
                  <div key={dept.department} className="bg-white rounded-xl border border-slate-200 shadow-sm">
                    {/* Department Header - Clickable to expand */}
                    <button
                      onClick={() => toggleDepartment(deptIndex)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${dept.color} bg-opacity-10`}>
                          <DepartmentIcon className={`text-xl ${
                            dept.color.includes('blue') ? 'text-blue-600' : 
                            dept.color.includes('purple') ? 'text-purple-600' :
                            dept.color.includes('green') ? 'text-green-600' :
                            dept.color.includes('amber') ? 'text-amber-600' :
                            'text-red-600'
                          }`} />
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                            {dept.department}
                          </h3>
                          <p className="text-slate-700 text-xs font-medium">
                            {dept.careerPaths.length} career paths • {dept.subjects.length} subjects
                          </p>
                        </div>
                      </div>
                      
                  <div className="flex items-center gap-3">
<div className="flex items-center gap-1 text-blue-700">
  <span className="text-[10px] md:text-xs font-black uppercase">
     Careers
  </span>
</div>

  {/* Interactive Toggle Circle */}
  <div className={`
    w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300
    ${isExpanded ? 'bg-slate-900 text-white shadow-lg rotate-180' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}
  `}>
    <FiChevronDown size={16} strokeWidth={3} />
  </div>
</div>
                    </button>

                    {/* Department Description (Always visible) */}
                    <div className="px-5 pb-4">
                      <p className="text-slate-600 text-sm font-medium">
                        {dept.description}
                      </p>
                      
                      {/* Subjects */}
                      <div className="mt-3">
                        <div className="flex items-center gap-2 mb-2">
                          <FiBook className="text-slate-900 text-sm" />
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Subjects
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {dept.subjects.map((subject, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-slate-50 text-slate-700 rounded-lg text-xs font-medium">
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Collapsible Career Paths */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 px-5 py-4">
                        <div className="flex items-center gap-2 mb-4">
                          <FiBriefcase className="text-slate-900" />
                          <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                            Career Paths
                          </h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {dept.careerPaths.map((career, careerIndex) => (
                            <div key={careerIndex} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                              <h5 className="font-bold text-slate-900 text-sm mb-2">{career.title}</h5>
                              <p className="text-slate-600 text-xs mb-3 leading-relaxed">{career.description}</p>
                              <div className="text-xs text-slate-700 font-medium">
                                <span className="font-bold text-slate-700">Examples:</span> {career.examples}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
                <div className="text-slate-700 text-xs font-medium">
                  Showing {indexOfFirstDept + 1}-{Math.min(indexOfLastDept, filteredDepartments.length)} of {filteredDepartments.length} departments
                </div>
                
                <div className="flex items-center gap-1">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg border ${
                      currentPage === 1 
                        ? 'border-slate-200 text-slate-300 cursor-not-allowed' 
                        : 'border-slate-300 text-slate-700'
                    }`}
                  >
                    <FiChevronLeft />
                  </button>
                  
                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      // Show first, last, and pages around current
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                              currentPage === pageNumber
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-700 bg-white border border-slate-300'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return <span key={pageNumber} className="px-1 text-slate-900">...</span>;
                      }
                      return null;
                    })}
                  </div>
                  
                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg border ${
                      currentPage === totalPages 
                        ? 'border-slate-200 text-slate-300 cursor-not-allowed' 
                        : 'border-slate-300 text-slate-700'
                    }`}
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* NO RESULTS STATE */
          <div className="py-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
            <FiBriefcase className="mx-auto text-slate-300 mb-3" size={36} />
            <h3 className="text-lg font-black text-slate-900 mb-2">
              No departments found
            </h3>
            <p className="text-slate-700 font-medium text-sm mb-4 max-w-md mx-auto">
              {globalSearch 
                ? `No departments or careers found matching "${globalSearch}"${selectedDepartment !== "all" ? ` in ${departments.find(d => d.value === selectedDepartment)?.label}` : ''}`
                : `No departments available in ${departments.find(d => d.value === selectedDepartment)?.label}`
              }
            </p>
            <button 
              onClick={resetFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm"
            >
              Show All Departments
            </button>
          </div>
        )}

        {/* STATS FOOTER */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl font-black text-slate-900 mb-1">
                {highSchoolDepartments.length}
              </div>
              <div className="text-slate-700 text-xs font-medium">
                Academic Departments
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-black text-slate-900 mb-1">
                {highSchoolDepartments.reduce((sum, dept) => sum + dept.careerPaths.length, 0)}
              </div>
              <div className="text-slate-700 text-xs font-medium">
                Total Career Paths
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-black text-slate-900 mb-1">
                {[...new Set(highSchoolDepartments.flatMap(dept => dept.subjects))].length}
              </div>
              <div className="text-slate-700 text-xs font-medium">
                Subjects Offered
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-black text-slate-900 mb-1">
                100%
              </div>
              <div className="text-slate-700 text-xs font-medium">
                KCSE Aligned
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ModernEducationSystemCard = ({ system, icon: Icon, color, description, features, structure, advantages }) => {
  return (
    <div className="group relative bg-white md:rounded-2xl border-y md:border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      
      {/* Compact Header with gradient accent */}
      <div className={`relative p-5 md:p-7 bg-gradient-to-r ${color} overflow-hidden`}>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-[60px] rounded-full -mr-20 -mt-20" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h3 className="text-lg md:text-xl font-black text-white tracking-tight uppercase leading-none">
              {system.name}
            </h3>
            <p className="text-white/70 text-[9px] md:text-[10px] font-bold tracking-[0.15em] mt-1.5 uppercase">
              {system.fullName}
            </p>
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white/15 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center">
            <Icon className="text-white text-lg md:text-xl" />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 md:p-7 space-y-6">
        
        {/* Description */}
        <p className="text-slate-700 text-xs md:text-sm leading-relaxed">
          {description}
        </p>

        {/* Academic Path — inline row */}
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-900 mb-3">Academic Path</p>
          <div className="flex gap-2">
            {structure.map((stage, idx) => (
              <div key={idx} className="flex-1 text-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-lg md:text-xl font-black text-slate-900 leading-none tabular-nums">
                  {stage.years}
                </div>
                <div className="text-[8px] md:text-[9px] font-bold text-slate-900 uppercase tracking-wider mt-1">
                  {stage.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features — compact 2-col grid */}
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-900 mb-3">Key Pillars</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${color} mt-1.5 shrink-0`} />
                <div>
                  <h5 className="text-xs font-bold text-slate-900 leading-tight">{feature.title}</h5>
                  <p className="text-[10px] text-slate-900 leading-snug">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advantages */}
        <div className="pt-5 border-t border-slate-100">
          <div className="flex flex-wrap gap-1.5">
            {advantages.map((advantage, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg text-[8px] md:text-[9px] font-bold uppercase tracking-wider border border-slate-100">
                {advantage}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
const AdmissionPathCard = ({ path, onApply, index }) => {
  const isEven = index % 2 === 0;
  const PathIcon = path.icon;

  return (
    <div className={`group relative overflow-hidden rounded-2xl md:rounded-3xl border transition-all duration-300 hover:shadow-lg ${
      isEven 
        ? 'bg-white border-slate-200' 
        : 'bg-slate-900 border-slate-700/50'
    }`}>
      {/* Top accent */}
      <div className={`h-1 w-full bg-gradient-to-r ${path.color}`} />
      
      <div className="p-5 md:p-7 space-y-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              isEven 
                ? 'bg-teal-50 border border-teal-100' 
                : 'bg-white/10 border border-white/10'
            }`}>
              <PathIcon className={`text-lg ${isEven ? 'text-teal-800' : 'text-teal-500'}`} />
            </div>
            <div>
              <h3 className={`text-base md:text-lg font-extrabold tracking-tight leading-tight ${isEven ? 'text-slate-900' : 'text-white'}`}>
                {path.title}
              </h3>
              <span className={`text-[9px] font-bold uppercase tracking-wider ${isEven ? 'text-slate-900' : 'text-slate-900'}`}>
                {path.deadline === 'Rolling Admission' ? 'Open Enrollment' : 'Intake Period'}
              </span>
            </div>
          </div>
          <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shrink-0 ${
            isEven 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
              : 'bg-teal-500/15 text-teal-500 border border-teal-500/20'
          }`}>
            {path.deadline === 'Rolling Admission' ? 'Open' : 'Limited'}
          </span>
        </div>

        {/* Description */}
        <p className={`text-sm leading-relaxed ${isEven ? 'text-slate-700' : 'text-slate-900'}`}>
          {path.description}
        </p>

        {/* Features list — vertical with check marks */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {path.features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <IoCheckmarkCircle className={`text-xs shrink-0 ${isEven ? 'text-teal-500' : 'text-teal-400'}`} />
              <span className={`text-[11px] font-semibold ${isEven ? 'text-slate-600' : 'text-slate-300'}`}>{feature}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between pt-4 border-t ${isEven ? 'border-slate-100' : 'border-white/10'}`}>
          <div className="flex items-center gap-2">
            <IoCalendarOutline className={`text-sm ${isEven ? 'text-slate-900' : 'text-slate-700'}`} />
            <div>
              <span className={`text-[8px] uppercase font-bold tracking-wider block ${isEven ? 'text-slate-900' : 'text-slate-700'}`}>Deadline</span>
              <span className={`text-xs font-bold ${isEven ? 'text-slate-800' : 'text-white'}`}>{path.deadline}</span>
            </div>
          </div>
          <button
            onClick={onApply}
            className={`text-[10px] font-bold px-4 py-2 rounded-lg uppercase tracking-wide transition-colors ${
              isEven 
                ? 'bg-slate-900 text-white hover:bg-slate-800' 
                : 'bg-white text-slate-900 hover:bg-slate-100'
            }`}
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};
const FeatureCard = ({ feature, onLearnMore }) => {
  const FeatureIcon = feature.icon;
  
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/70 overflow-hidden transition-all duration-300">
      {/* Icon Header */}
      <div className={`p-4 md:p-5 bg-gradient-to-r ${feature.color} bg-opacity-10`}>
        <div className="flex items-center justify-between">
          <div className="p-2 md:p-2.5 bg-white rounded-xl shadow-xs">
            <FeatureIcon className={`text-xl ${feature.color.split('from-')[1].split('to-')[0].replace('-500', '-600')}`} />
          </div>
          <span className="text-xs font-semibold px-2 py-1 md:px-3 md:py-1 bg-white/90 rounded-full text-gray-700">
            {feature.badge}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        <h3 className="font-bold text-gray-900 text-lg mb-3">{feature.title}</h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {feature.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50/70 rounded-lg p-3 text-center">
            <div className="font-bold text-gray-900">{feature.stats.students}</div>
            <div className="text-xs text-gray-500">Students</div>
          </div>
          <div className="bg-gray-50/70 rounded-lg p-3 text-center">
            <div className="font-bold text-gray-900">{feature.stats.success}</div>
            <div className="text-xs text-gray-500">Success Rate</div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2 mb-4">
          {feature.features.map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
              <IoCheckmarkCircleOutline className="text-green-500 flex-shrink-0" />
              <span>{feat}</span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={onLearnMore}
          className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-semibold transition-all duration-200"
        >
          Explore Feature
        </button>
      </div>
    </div>
  );
};

const StatCard = ({ stat }) => {
  const StatIcon = stat.icon;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-100 p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow duration-300 group">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className={`flex items-center justify-center h-10 w-10 md:h-11 md:w-11 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-sm group-hover:scale-105 transition-transform`}>
            <StatIcon className="text-lg md:text-xl" />
          </div>
          <span className="text-[9px] md:text-[10px] font-medium text-slate-900 uppercase tracking-wider">
            {stat.sublabel}
          </span>
        </div>

        <div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight tabular-nums">
            {stat.number}
          </h3>
          <span className="text-xs font-medium text-slate-700 mt-0.5 block">
            {stat.label}
          </span>
        </div>
        
        {/* Subtle accent bar */}
        <div className="h-0.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full w-3/5 bg-gradient-to-r ${stat.color} rounded-full`} />
        </div>
      </div>
    </div>
  );
};

// Add these functions after your imports and before any component definitions
const getSubjectIcon = (subjectName) => {
  const subjectMap = {
    'Biology': FiActivity,
    'Chemistry': FiZap,
    'Physics': FiZap,
    'Mathematics': FiCpu,
    'English': FiBook,
    'Kiswahili': FiGlobe,
    'Geography': FiGlobe,
    'Geogrpahy': FiGlobe, // Added for typo in API
    'History': FiBook,
    'CRE': FiHeart,
    'HRE': FiHeart,
    'IRe': FiHeart,
    'Technical skills': FiActivity,
    'Technica skills': FiActivity, // Added for typo in API
    'Agriculture': FiActivity,
    'Business Studies': FiBarChart2,
    'Business studies': FiBarChart2, // Added for consistency
    'Home science': FiHome,
    'Computer studies': FiCpu,
    'CBC': FiBookOpen
  };
  
  return subjectMap[subjectName] || FiBook;
};

const getDepartmentIcon = (deptName) => {
  const deptMap = {
    'CBC': FiBookOpen,
    'Humanities': FiBook,
    'Humannisties': FiBook, // Added for typo in API
    'Mathematics': FiCpu,
    'Physical sciences': FiZap,
    'Physical Sciences': FiZap, // Added for API
    'Languages': FiGlobe,
    'Technical skills': FiActivity,
    'Teachnicals': FiActivity, // Added for typo in API
    'Computer': FiCpu,
    'ADministration': FiSettings, // Added for typo in API
    'Administration': FiSettings
  };
  
  return deptMap[deptName] || FiBook;
};

// Subject Card Component
const SubjectCard = ({ subject, index }) => {
  const SubjectIcon = getSubjectIcon(subject);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/70 p-4 transition-all duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-sm">
          <SubjectIcon className="text-white text-lg" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{subject}</h4>
        </div>
      </div>
    </div>
  );
};


const ModernFeeCard = ({ 
  feeType, total, distribution = [], pdfPath, 
  year, term, icon: Icon, variant = "dark", badge 
}) => {
  const isDark = variant === "dark";

  return (
    <div className={`
      relative transition-all duration-500 shadow-2xl
      /* Mobile: Full Screen / Desktop: Rounded Card */
      rounded-none md:rounded-[3rem] 
      border-x-0 md:border
      ${isDark ? 'bg-[#1a1a2e] border-white/5 text-white' : 'bg-white border-slate-100 text-slate-900'}
    `}>
      
      {/* Top Header - Adjusted for Mobile Spacing */}
      <div className="p-6 md:p-12 border-b border-white/5">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl border ${
              isDark ? 'bg-white/5 border-white/10 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'
            }`}>
              <Icon className="text-xl md:text-2xl" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xl md:text-3xl font-black uppercase tracking-tighter truncate leading-none">
                {feeType}
              </h3>
              <p className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mt-2 ${isDark ? 'text-white/40' : 'text-slate-900'}`}>
                Session {year} • {term}
              </p>
            </div>
          </div>
          {badge && (
            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
              isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-600 text-white'
            }`}>
              {badge}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <p className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-40`}>
            Total Payable Amount
          </p>
          <div className={`text-2xl md:text-3xl font-black tracking-tighter tabular-nums ${isDark ? 'text-blue-400' : 'text-slate-900'}`}>
            KSh {total?.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Breakdown Section - Mapped from Distribution JSON */}
      <div className="p-6 md:p-12">
        <h4 className={`text-[10px] md:text-lg font-black uppercase tracking-[0.3em] mb-6 opacity-30`}>
          Detailed Breakdown
        </h4>
        
        <div className="space-y-1">
          {distribution.map((item, idx) => (
            <div 
              key={idx} 
              className={`flex justify-between items-center py-4 border-b last:border-0 ${isDark ? 'border-white/5' : 'border-slate-50'}`}
            >
              <div className="flex flex-col min-w-0 pr-4">
                <span className="font-black text-[13px] md:text-base uppercase tracking-tight truncate">
                  {item.name}
                </span>
                {item.description && (
                  <span className={`text-[10px] font-bold truncate opacity-40`}>
                    {item.description}
                  </span>
                )}
              </div>
              <span className="font-black text-sm md:text-lg tabular-nums shrink-0">
                {item.amount?.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Footer Download Link */}
   <div className="mt-10 pt-8 border-t border-white/5 flex justify-center md:justify-start">
  <a 
    href={pdfPath} 
    target="_blank" 
    rel="noopener noreferrer"
    className={`
      /* Width Logic: Full on mobile, Auto-width on desktop */
      w-full md:w-max md:min-w-[240px] 
      
      flex items-center justify-center gap-3 
      px-8 py-4 md:py-5 
      rounded-xl md:rounded-2xl 
      font-black text-[10px] md:text-[11px] 
      uppercase tracking-[0.2em] 
      transition-all active:scale-95 shadow-xl
      ${isDark ? 'bg-white text-slate-900 hover:bg-blue-50' : 'bg-slate-900 text-white hover:bg-slate-800'}
    `}
  >
    <IoCloudDownloadOutline size={20} className="shrink-0" />
    <span className="truncate">Download PDF Structure</span>
  </a>
</div>
      </div>
    </div>
  );
};
// Video Tour Component


const VideoTourSection = ({ videoTour, videoType, videoThumbnail }) => {
  // State to manage overlay visibility
  const [isPlaying, setIsPlaying] = useState(false);

  if (!videoTour) return null;

  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = videoType === 'youtube' ? getYouTubeId(videoTour) : null;

  // Handler to hide overlay when playing
  const handlePlay = () => setIsPlaying(true);

  return (
    <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-2xl md:rounded-3xl border border-slate-100/80 shadow-2xl overflow-hidden transition-all duration-300">
      
      {/* Header Section */}
      <div className="relative p-4 md:p-8 bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -mr-32 -mt-32"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-white/20 backdrop-blur-xl rounded-xl md:rounded-2xl border border-white/30 shadow-inner">
              <IoVideocamOutline className="text-white text-xl md:text-3xl" />
            </div>
            <div>
              <h3 className="text-xl md:text-3xl font-extrabold tracking-tight">Virtual School Tour</h3>
              <p className="text-blue-100/90 text-sm md:text-base font-medium mt-1">Experience our campus in immersive detail</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ultra HD 4K</span>
          </div>
        </div>
      </div>

      {/* Video Container */}
      <div className="p-4 md:p-10">
        <div className="relative mx-auto" style={{ maxWidth: '900px' }}>
          
          <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-200/50 bg-black group">
            
            {/* Play Button Overlay - Now conditional on !isPlaying */}
            {!isPlaying && (
              <div 
                className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer group-hover:bg-black/20 transition-all duration-500"
                onClick={handlePlay}
              >
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-blue-600/90 backdrop-blur-md border-4 border-white/30 flex items-center justify-center shadow-2xl transform group-110 transition-transform">
                  <FiPlay className="text-white text-xl md:text-2xl ml-1.5" />
                </div>
                
                {/* Background Thumbnail */}
                {videoThumbnail && (
                  <div className="absolute inset-0 -z-10 bg-cover bg-center transition-transform duration-700 group-105" 
                       style={{ backgroundImage: `url(${videoThumbnail})` }} />
                )}
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            )}
            
            {/* Video Player Interface */}
            <div className="relative aspect-video w-full">
              {videoType === 'youtube' && videoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=${isPlaying ? 1 : 0}`}
                  className="absolute inset-0 w-full h-full"
                  title="Virtual school Tour"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <video
                  onPlay={handlePlay}
                  onPause={() => setIsPlaying(false)}
                  controls
                  className="absolute inset-0 w-full h-full"
                  poster={videoThumbnail || ''}
                  preload="metadata"
                >
                  <source src={videoTour} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-2">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-blue-50 rounded-lg"><FiClock className="text-blue-600 font-bold" /></div>
                <span className="text-sm font-bold text-slate-700">3:45 Duration</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-cyan-50 rounded-lg"><FiEye className="text-cyan-600 font-bold" /></div>
                <span className="text-sm font-bold text-slate-700">Premium Quality</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-slate-100/50 p-2 rounded-2xl pr-4">
              <div className="flex -space-x-2.5">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-slate-300 to-slate-400 shadow-sm"></div>
                ))}
              </div>
              <span className="text-xs font-black text-slate-600 uppercase tracking-tight">1.2k+ Views</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="p-6 md:p-8 border-t border-slate-100 bg-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-slate-600 font-medium text-center sm:text-left">
            Want a more detailed view? <span className="font-extrabold text-indigo-600">Open the Interactive Map</span>
          </p>
          <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl text-sm font-bold transition-all shadow-lg active:scale-95">
            <FiMapPin className="text-lg" />
            <span>Launch School Map</span>
          </button>
        </div>
      </div>
    </div>
  );
};



// Vision & Mission Section - Redesigned
const VisionMissionSection = ({ vision, mission, motto, videoTour, videoType, videoThumbnail }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-12 md:space-y-16">
      
      {/* Vision & Mission Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        
        {/* Vision */}
        <div className="md:col-span-7">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] md:text-xs font-black text-emerald-600 uppercase tracking-[0.3em]">
                Our Vision
              </span>
              <div className="flex-1 h-px bg-emerald-100" />
            </div>
            
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              The <span className="text-emerald-600">Future</span> We Build
            </h3>
            
            <p className="text-slate-900 text-sm md:text-base lg:text-md  max-w-xl">
              {vision || "To be a premier center of academic excellence in Machakos, nurturing globally competitive leaders through integrity, innovation, and holistic development."}
            </p>
            
            <div className="pt-4">
              <div className="flex items-center gap-2 text-emerald-600">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span className="text-[10px] font-black uppercase tracking-wider">Est. 1976 • Excellence Since</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="md:col-span-5">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] md:text-xs font-black text-emerald-600 uppercase tracking-[0.3em]">
                Our Mission
              </span>
              <div className="flex-1 h-px bg-emerald-100" />
            </div>
            
            <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              What Drives Us
            </h3>
            
            <p className="text-slate-900 text-sm md:text-base lg:text-md">
              {mission || "Providing quality education through modern infrastructure, fostering discipline, innovation, and self-reliance in every student who walks through our gates."}
            </p>
            
            <div className="pt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-black text-emerald-600">400+</div>
                <div className="text-[10px] font-black text-slate-900 uppercase tracking-wider">Students</div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-600">98%</div>
                <div className="text-[10px] font-black text-slate-900 uppercase tracking-wider">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Tour Section - Full Width */}
      {videoTour && (
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] md:text-xs font-black text-emerald-600 uppercase tracking-[0.3em]">
              Virtual Experience
            </span>
            <div className="flex-1 h-px bg-emerald-100" />
          </div>
          
          <VideoTourSection 
            videoTour={videoTour}
            videoType={videoType}
            videoThumbnail={videoThumbnail}
          />
        </div>
      )}

      {/* Motto - Separated with elegance */}
      <div className="relative pt-8 md:pt-12 mt-8 md:mt-12 border-t border-emerald-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
              <FiAward className="text-emerald-600 text-xl" />
            </div>
            
            <div>
              <span className="text-[8px] md:text-[9px] font-black text-slate-900 uppercase tracking-[0.2em] block mb-1">
                The Spirit of Kinyui
              </span>
           <h3 className="group flex items-center gap-2 text-lg md:text-xl font-black text-slate-900 tracking-tight">
  <span>School Motto</span>
  <FiArrowRight className="text-indigo-600 transition-transform duration-300 group-hover:translate-x-1" />
</h3>
            </div>
          </div>

          <div className="md:text-right">
            <p className="text-xl md:text-2xl lg:text-3xl font-black italic text-emerald-700 tracking-tight">
              "{motto || "Strive for Excellence"}"
            </p>
            <div className="flex items-center justify-end gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-emerald-600" />
              <span className="text-[9px] font-black text-slate-900 uppercase tracking-wider">
                Matungulu GirlsSenior School
              </span>
            </div>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute -top-3 right-0 text-emerald-200/30 text-6xl font-black select-none">
          "
        </div>
      </div>
    </div>
  );
};


// NEW: Academic Results Section Component
const AcademicResultsSection = ({ documentData }) => {
  const resultsData = [
    {
      name: 'KCSE Results',
      pdf: documentData?.kcseResultsPdf,
      pdfName: documentData?.kcsePdfName,
      description: documentData?.kcseDescription,
      year: documentData?.kcseYear,
      term: documentData?.kcseTerm,
      icon: FiTrendingUp,
      accent: 'text-indigo-400',
      bg: 'bg-indigo-400/10'
    }
  ];

  const availableResults = resultsData.filter(result => result.pdf);
  if (availableResults.length === 0) return null;

  return (
    /* Responsive Wrapper: Full width (rounded-none) on mobile, Elegant Card on desktop */
    <div className="bg-white rounded-none md:rounded-[2.5rem] border-x-0 md:border border-slate-100 shadow-2xl overflow-hidden">
      
      {/* Header Section - Edge-to-edge look */}
      <div className="relative p-6 md:p-12 bg-[#1a1a2e] text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[80px] md:blur-[100px] rounded-full -mr-32 -mt-32" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shrink-0">
              <IoStatsChartOutline className="text-blue-400 text-2xl md:text-3xl" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg md:text-3xl font-black uppercase tracking-tighter">Academic KCSE <span className="text-blue-400">Reports</span></h3>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mt-1">Official Performance Archives</p>
            </div>
          </div>
          <div className="flex items-center self-start md:self-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
            <FiAward className="text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Verified Data</span>
          </div>
        </div>
      </div>

      {/* Main Grid - Results Cards */}
      <div className="p-4 md:p-12 bg-slate-50/30">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {availableResults.map((result, index) => (
            <div 
              key={index}
              className="group bg-white border border-slate-200 rounded-2xl md:rounded-[2rem] p-6 transition-all hover:shadow-xl"
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`p-4 rounded-2xl ${result.bg} ${result.accent} shrink-0`}>
                  <result.icon size={22} className="md:size-6" />
                </div>
                <div className="text-right">
                  <span className="block text-xl font-black text-slate-900 leading-none">{result.year}</span>
                  <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">{result.term || 'Annual'}</span>
                </div>
              </div>
              
              <h4 className="font-black text-slate-900 text-[13px] md:text-sm uppercase tracking-tight mb-2 truncate">
                {result.name}
              </h4>
              
              {result.description && (
                <p className="text-slate-900 text-[10px] font-bold leading-relaxed mb-6 line-clamp-2 min-h-[30px]">
                  {result.description}
                </p>
              )}
              
              <a 
                href={result.pdf}
                download={result.pdfName}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95"
              >
                <IoCloudDownloadOutline size={16} />
                <span>Get Report</span>
              </a>
            </div>
          ))}
        </div>

        {/* Additional Documents - Horizontal Bento */}
        {documentData?.additionalDocuments && documentData.additionalDocuments.length > 0 && (
          <div className="mt-10 md:mt-16 pt-10 border-t border-slate-200">
            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-6 px-1">
              Resources & Support Docs
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {documentData.additionalDocuments.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-4 md:p-6 bg-white rounded-2xl border border-slate-200 group transition-all">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-blue-50 transition-colors shrink-0">
                      <IoDocumentTextOutline className="text-slate-700 group-hover:text-blue-500" />
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-black text-slate-900 text-[11px] uppercase tracking-wide truncate">
                        {doc.description || doc.filename}
                      </h5>
                      <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest mt-1">
                        {doc.year} • {doc.term || 'General'}
                      </p>
                    </div>
                  </div>
                  <a 
                    href={doc.filepath}
                    download={doc.filename}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-slate-900 text-white rounded-xl active:scale-90"
                  >
                    <FiDownload size={14} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



const ModernUniformRequirementsSection = ({ 
  admissionFeeDistribution, 
  admissionFeePdf, 
  admissionFeePdfName,
  admissionFeeDescription,
  admissionFeeYear,
  admissionFeeTerm
}) => {
  const uniformItems = admissionFeeDistribution || [];
  const totalCost = uniformItems.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <div className="bg-white rounded-lg md:rounded-2xl border border-slate-200 overflow-hidden">
      
      {/* Header Section */}
      <div className="p-6 md:p-8 bg-slate-900 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <IoShirtOutline className="text-emerald-400 text-2xl md:text-3xl" />
            <div>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                Admission <span className="text-emerald-400">Breakdown</span>
              </h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-slate-900">
                <span>{admissionFeeYear || '2026'} • {admissionFeeTerm || 'Full Session'}</span>
                {admissionFeeDescription && (
                  <>
                    <span>•</span>
                    <span className="italic">{admissionFeeDescription}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {admissionFeePdf && (
            <a 
              href={admissionFeePdf}
              download={admissionFeePdfName}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <IoCloudDownloadOutline className="text-lg" />
              <span>Download PDF</span>
            </a>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 md:p-8 bg-slate-50">
        {uniformItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {uniformItems.map((item, index) => (
                <div 
                  key={item.id || index}
                  className="bg-white border border-slate-200 rounded-lg p-5"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-slate-900">
                      {item.name}
                    </h4>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      item.optional ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {item.optional ? 'Optional' : 'Required'}
                    </div>
                  </div>
                  
                  {item.description && (
                    <p className="text-sm text-slate-700 mb-4">
                      {item.description}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <span className="text-sm text-slate-700">Amount</span>
                    <span className="text-lg font-bold text-slate-900">
                      KSh {parseInt(item.amount || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Summary */}
            <div className="mt-6 p-6 bg-white border border-slate-200 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <FiDollarSign className="text-emerald-600 text-xl" />
                  <div>
                    <span className="text-sm text-slate-700 block">Total Admission Cost</span>
                    <span className="text-2xl font-bold text-slate-900">
                      KSh {totalCost.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="text-slate-700 block">Mandatory</span>
                    <span className="font-semibold text-slate-900">{uniformItems.filter(i => !i.optional).length} items</span>
                  </div>
                  <div>
                    <span className="text-slate-700 block">Optional</span>
                    <span className="font-semibold text-emerald-600">{uniformItems.filter(i => i.optional).length} items</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <FiAlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-lg font-semibold text-slate-900 mb-1">No Items Available</h4>
            <p className="text-sm text-slate-700">The admission breakdown is being updated.</p>
          </div>
        )}
      </div>
    </div>
  );
};
const ModernFAQItem = ({ faq, index, openFaq, setOpenFaq }) => {
  const isOpen = openFaq === index;

  return (
    <div className="relative">
      <div
        className={`relative bg-white rounded-2xl overflow-hidden border ${
          isOpen
            ? 'border-emerald-200 shadow-lg shadow-emerald-900/5'
            : 'border-slate-200 shadow-md'
        }`}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />

        <button
          onClick={() => setOpenFaq(isOpen ? null : index)}
          className="w-full px-6 md:px-8 py-5 md:py-6 text-left relative"
        >
          <div className="flex items-start gap-4 md:gap-6">
            <div
              className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center font-black text-sm md:text-base shrink-0 ${
                isOpen
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white'
                  : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              {String(index + 1).padStart(2, '0')}
            </div>

            <div className="flex-1 pt-1">
              <h3
                className={`font-black tracking-tight text-sm md:text-lg pr-8 ${
                  isOpen ? 'text-emerald-600' : 'text-slate-900'
                }`}
              >
                {faq.question}
              </h3>
            </div>

            <div
              className={`absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 ${
                isOpen
                  ? 'border-emerald-200 bg-emerald-50'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <FiChevronDown
                className={`text-sm md:text-base ${
                  isOpen ? 'text-emerald-600 rotate-180' : 'text-slate-900'
                }`}
              />
            </div>
          </div>
        </button>

        {isOpen && (
          <div>
            <div className="px-6 md:px-8 pb-6 md:pb-8">
              <div className="pl-[48px] md:pl-[64px]">
                <div className="h-px bg-gradient-to-r from-emerald-200 via-teal-200 to-transparent" />

                <div className="mt-5">
                  <p className="text-slate-600 font-medium leading-relaxed text-sm md:text-base">
                    {faq.answer}
                  </p>

                  <div className="flex items-center gap-3 mt-5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider">
                        Official Policy
                      </span>
                    </div>
                    <div className="w-px h-3 bg-slate-200" />
                    <span className="text-[8px] font-black text-slate-900 uppercase tracking-wider">
                      Updated {new Date().getFullYear()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default function ComprehensiveAdmissions() {
  const [activeTab, setActiveTab] = useState('overview');
  const [openFaq, setOpenFaq] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [schoolData, setSchoolData] = useState(null);
  const [documentData, setDocumentData] = useState(null);

  const router = useRouter();

  // Data for Career Departments
 

  // Data for Education Systems
  const educationSystems = [
    {
      system: {
        name: '8-4-4 SYSTEM',
        fullName: '8 Years Primary, 4 Years Secondary, 4 Years University'
      },
      icon: IoSchoolOutline,
      color: 'from-indigo-600 to-purple-500',
      description: 'The 8-4-4 system focuses on providing students with practical skills alongside academic knowledge. It emphasizes technical subjects and prepares students for both higher education and immediate employment opportunities.',
      structure: [
        { years: '8', name: 'Primary' },
        { years: '4', name: 'Secondary' },
        { years: '4', name: 'University' }
      ],
      features: [
        {
          title: 'Technical Emphasis',
          description: 'Strong focus on technical and vocational subjects'
        },
        {
          title: 'National Exams',
          description: 'KCPE at primary level and KCSE at secondary level'
        },
        {
          title: 'University Pathway',
          description: 'Direct progression to university education'
        },
        {
          title: 'Practical Skills',
          description: 'Emphasis on hands-on learning and real-world application'
        }
      ],
      advantages: [
        'Proven track record with decades of implementation',
        'Clear progression path to higher education',
        'Strong emphasis on technical and practical skills',
        'Nationally recognized certification (KCSE)',
        'Well-established university entry system'
      ]
    },
    {
      system: {
        name: 'CBC',
        fullName: 'Competency Based Curriculum'
      },
      icon: FiBookOpen,
      color: 'from-teal-800 to-green-500',
      description: 'The CBC system focuses on developing seven core competencies: communication, collaboration, critical thinking, creativity, citizenship, digital literacy, and learning to learn. It emphasizes practical skills and values over rote memorization.',
      structure: [
        { years: '2', name: 'Pre-Primary' },
        { years: '6', name: 'Primary' },
        { years: '6', name: 'Junior & Senior School' }
      ],
      features: [
        {
          title: 'Competency Based',
          description: 'Focus on skills and competencies rather than content'
        },
        {
          title: 'Continuous Assessment',
          description: 'Regular assessment throughout the learning process'
        },
        {
          title: 'Parental Involvement',
          description: 'Strong emphasis on parent-teacher collaboration'
        },
        {
          title: 'Digital Integration',
          description: 'Incorporation of technology in learning'
        }
      ],
      advantages: [
        'Develops practical life skills',
        'Encourages creativity and innovation',
        'Personalized learning paths',
        'Strong focus on values and citizenship',
        'Better preparation for the modern workforce'
      ]
    }
  ];

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // Fetch school data
        const schoolResponse = await fetch('/api/school');
        if (schoolResponse.ok) {
          const schoolData = await schoolResponse.json();
          if (schoolData.success) {
            setSchoolData(schoolData.school);
          }
        }

        // Fetch document data
        const documentsResponse = await fetch('/api/schooldocuments');
        if (documentsResponse.ok) {
          const documentsData = await documentsResponse.json();
          if (documentsData.success && documentsData.document) {
            setDocumentData(documentsData.document);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Dynamic stats from API data
  const dynamicStats = [
    { 
      icon: IoPeopleOutline, 
      number: schoolData?.studentCount ? schoolData.studentCount.toString() : '1,200+', 
      label: 'Total Students', 
      sublabel: 'Currently Enrolled',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      icon: FiTrendingUp, 
      number: schoolData?.admissionCapacity ? schoolData.admissionCapacity.toString() : '300', 
      label: 'Admission Capacity', 
      sublabel: 'Annual Intake',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: IoSparkles, 
      number: schoolData?.staffCount ? `${schoolData.staffCount}:1` : '20:1', 
      label: 'Student-Teacher', 
      sublabel: 'Personalized Ratio',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      icon: FiAward, 
      number: '98%', 
      label: 'Success Rate', 
      sublabel: 'Academic Excellence',
      color: 'from-orange-500 to-red-500'
    },
  ];

  // Admission paths - Updated based on your school's focus
  const admissionPaths = [
    {
      title: 'Grade 9 & Form 1 Entry ',
      icon: FiBookOpen,
      description: 'Join our Form 1 program with comprehensive academic curriculum and extracurricular activities',
      features: ['Academic Excellence', 'Extra-curricular Activities', 'Digital Literacy', 'Talent Development'],
      deadline: schoolData?.admissionCloseDate ? new Date(schoolData.admissionCloseDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'May 30, 2024',
      color: 'from-blue-500 to-cyan-500',
      type: 'grade7'
    },
    {
      title: 'Transfer Students',
      icon: FiArrowRight,
      description: 'Seamless transfer from other schools with credit recognition and orientation support',
      features: ['Credit Transfer', 'Placement Assessment', 'Records Review', 'Orientation Program'],
      deadline: 'Rolling Admission',
      color: 'from-purple-500 to-pink-500',
      type: 'transfer'
    }
  ];

  // Academic Features
  const innovativeFeatures = [
    {
      icon: IoRocketOutline,
      title: 'Academic Excellence',
      description: 'Comprehensive curriculum with focus on core subjects and practical skills development',
      features: ['Quality Teaching', 'Regular Assessments', 'Exam Preparation', 'Academic Support'],
      badge: 'Advanced',
      color: 'from-blue-500 to-cyan-500',
      stats: { students: '500+', success: '95%' }
    },
    {
      icon: IoAccessibilityOutline,
      title: 'Holistic Development',
      description: 'Focus on academic, social, emotional, and physical growth through various programs',
      features: ['Sports Programs', 'Clubs & Societies', 'Leadership Training', 'Character Building'],
      badge: 'Comprehensive',
      color: 'from-purple-500 to-pink-500',
      stats: { students: '100%', success: '98%' }
    },
    {
      icon: IoBuildOutline,
      title: 'Practical Skills',
      description: 'Emphasis on practical competencies and real-world application of knowledge',
      features: ['Laboratory Work', 'Field Trips', 'Project Work', 'Skill Development'],
      badge: 'Practical',
      color: 'from-green-500 to-emerald-500',
      stats: { students: '300+', success: '90%' }
    }
  ];

  // Updated tabs based on your academic page design
  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiBook },
    { id: 'academics', label: 'Academics', icon: FiBookOpen },
    { id: 'career-paths', label: 'Career compass', icon: FiBriefcase },
    { id: 'requirements', label: 'Requirements', icon: FiFileText },
    { id: 'results', label: 'Results', icon: IoStatsChartOutline }, // New Results tab
    { id: 'faq', label: 'FAQ', icon: FiHelpCircle },
  ];

  // Process steps for transfer
  const transferProcess = [
    {
      step: 1,
      title: 'Application Submission',
      description: 'Submit transfer documents and academic records for evaluation',
      duration: '2-3 days',
      requirements: ['Current school report', 'Birth certificate', 'Transfer letter']
    },
    {
      step: 2,
      title: 'Assessment & Placement',
      description: 'Academic assessment for proper grade placement and subject allocation',
      duration: '1 week',
      requirements: ['Placement tests', 'Subject evaluation', 'Skill assessment']
    },
    {
      step: 3,
      title: 'Credit Evaluation',
      description: 'Review and transfer of completed coursework and competencies',
      duration: '3-5 days',
      requirements: ['Transcript analysis', 'Credit approval', 'CBC competency mapping']
    },
    {
      step: 4,
      title: 'Admission & Orientation',
      description: 'Final admission and comprehensive student orientation program',
      duration: '1 week',
      requirements: ['Parent meeting', 'Student orientation', 'Resource distribution']
    }
  ];

  // Facilities Data from your academic page
  const facilitiesData = [
    {
      icon: FiCpu,
      title: 'Computer Labs',
      description: 'Modern computer labs with high-speed internet and latest software',
      features: ['Programming', 'Digital Literacy', 'Research', 'Online Learning']
    },
    {
      icon: FiActivity,
      title: 'Science Labs',
      description: 'Fully equipped laboratories for Physics, Chemistry and Biology',
      features: ['Experiments', 'Research', 'Practical Skills', 'Innovation']
    },
    {
      icon: IoLibraryOutline,
      title: 'Library',
      description: 'Digital and physical library with extensive resources',
      features: ['E-Books', 'Study Spaces', 'Research', 'Quiet Zones']
    },
    {
      icon: FiSmartphone,
      title: 'Smart Classrooms',
      description: 'Technology-enabled classrooms for interactive learning',
      features: ['Projectors', 'Digital Boards', 'Online Resources', 'Collaboration']
    }
  ];

  // FAQ Data updated with admission-specific questions
  const faqs = [
    {
      question: 'What are the admission requirements?',
      answer: schoolData?.admissionRequirements || 'Admission requires completion of primary education, KCPE results, birth certificate, and medical records. Transfer students need additional documents including previous school reports and transfer letter.'
    },
    {
      question: 'What is the fee structure and payment options?',
      answer: 'We offer both day and boarding options with transparent fee structures. Fees can be paid annually, per term, or in installments. We accept bank transfers, MPesa, and cash payments at the finance office.'
    },
    {
      question: 'Are there scholarships or financial aid available?',
      answer: 'Yes, we offer merit-based scholarships for academic excellence, talent scholarships in sports and arts, and need-based financial aid. Contact our admissions office for eligibility criteria and application details.'
    },
    {
      question: 'What curriculum do you follow?',
      answer: 'We follow the national curriculum with both CBC and 8-4-4 systems. We also integrate digital literacy and practical skills development across all subjects.'
    }
  ];

  const handleApply = (path) => {
    setShowApplicationForm(true);
  };

  const handleLearnMore = (feature) => {
    toast.success(`Learn more about ${feature.title}`);
  };

  const refreshData = () => {
    setLoading(true);
    const fetchSchoolData = async () => {
      try {
        const response = await fetch('/api/school');
        const data = await response.json();
        if (data.success) {
          setSchoolData(data.school);
          toast.success('Data refreshed successfully!');
        }
      } catch (error) {
        toast.error('Failed to refresh data');
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolData();
  };

  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 p-0 md:p-6">
      <Toaster position="top-right" richColors />
      
      <div className="max-w-7xl mx-auto space-y-5 px-3 md:px-0">

        {/* Modern Split Header with School Branding */}
<header className="relative rounded-none md:rounded-2xl overflow-hidden shadow-sm border-b md:border border-slate-200/60 mb-6">
  <div className="flex flex-col md:flex-row">
    
    {/* Left Panel - Dark Branded Section */}
    <div className="relative bg-slate-900 p-5 sm:p-6 md:p-8 md:w-[55%] overflow-hidden">
      {/* Logo Watermark Background */}
      <img src="/kinyui.png" alt="" className="absolute right-0 bottom-0 w-40 md:w-56 opacity-[0.04] pointer-events-none select-none translate-x-8 translate-y-8" />
      {/* Decorative Gradient Orb */}
      <div className="absolute -top-20 -left-20 w-52 h-52 bg-teal-500/15 blur-[80px] rounded-full" />
      
      <div className="relative z-10">
        {/* School Identity Row */}
        <div className="flex items-center gap-3 mb-5">
          <img src="/kinyui.png" alt="School Logo" className="w-10 h-10 md:w-11 md:h-11 rounded-xl object-contain bg-white/10 p-1 border border-white/10" />
          <div className="flex flex-col min-w-0">
            <h2 className="text-sm md:text-base font-bold text-white leading-tight truncate">
              {schoolData?.name || 'Matungulu GirlsSenior School'}
            </h2>
            <p className="text-[10px] md:text-xs text-slate-900 font-medium mt-0.5">
              Commited to Excellence
            </p>
          </div>
        </div>

        {/* Title Block */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-none mb-3">
          Admissions <span className="text-amber-800">Portal</span>
        </h1>
<p className="text-white text-xs md:text-sm leading-relaxed max-w-md mb-5">
  Begin your academic journey. Explore programs, check requirements, and apply online. 
  Our smart admissions portal brings everything together in one place, allowing you to access information, submit applications, and track Our admissions from any device.
</p>

        {/* Action Row */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[9px] md:text-[10px] font-bold px-3 py-1.5 rounded-full bg-teal-500/15 text-teal-500 border border-teal-500/20 uppercase">
            {schoolData?.academicYear || new Date().getFullYear()} Session
          </span>
          <button
            onClick={refreshData}
            disabled={loading}
            className="flex items-center justify-center gap-2 h-8 px-3 rounded-lg
                       transition-all font-semibold text-[11px]
                       bg-white/10 hover:bg-white/15 text-white border border-white/10
                       active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <CircularProgress size={10} thickness={6} sx={{ color: '#fff' }} />
                <span>fetching data...</span>
              </>
            ) : (
              <>
                <FiRefreshCw className="text-xs" />
                <span>Refresh</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>

    {/* Right Panel - Admission Highlights */}
    <div className="relative bg-white p-5 sm:p-6 md:p-8 md:w-[45%] flex flex-col justify-center">
      {/* Logo Watermark */}
      <img src="/kinyui.png" alt="" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 md:w-44 opacity-[0.03] pointer-events-none select-none" />
      
      <div className="relative z-10 space-y-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-900 mb-1">Why Apply Here</p>
        
<div className="space-y-4 md:space-y-5">
  {/* Holistic Curriculum - Replaced Nationally Ranked */}
  <div className="flex items-start gap-4 p-1">
    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0 mt-0.5">
      <FiAward className="text-teal-800 text-base" />
    </div>
    <div className="min-w-0">
      <h4 className="text-sm md:text-base font-bold text-slate-900 leading-tight">
        Holistic Learning Approach
      </h4>
      <p className="text-xs md:text-sm text-slate-700 leading-relaxed mt-1">
        A well-rounded CBC-aligned curriculum that balances core academics with creative and critical thinking.
      </p>
    </div>
  </div>

  {/* Personalized Mentoring */}
  <div className="flex items-start gap-4 p-1">
    <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center shrink-0 mt-0.5">
      <FiUsers className="text-cyan-600 text-base" />
    </div>
    <div className="min-w-0">
      <h4 className="text-sm md:text-base font-bold text-slate-900 leading-tight">
        Personalized Mentoring
      </h4>
      <p className="text-xs md:text-sm text-slate-700 leading-relaxed mt-1">
        Dedicated teachers and small class sizes ensure every student receives the individual attention they deserve.
      </p>
    </div>
  </div>

  {/* Dual Curriculum Tracks */}
  <div className="flex items-start gap-4 p-1">
    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
      <FiBookOpen className="text-indigo-600 text-base" />
    </div>
    <div className="min-w-0">
      <h4 className="text-sm md:text-base font-bold text-slate-900 leading-tight">
        Diverse Academic Tracks
      </h4>
      <p className="text-xs md:text-sm text-slate-700 leading-relaxed mt-1">
        Expertly managed pathways for both 8-4-4 and CBC, tailored to the unique strengths of every learner.
      </p>
    </div>
  </div>
</div>
      </div>
    </div>
  </div>
  
  {/* Bottom Accent Line */}
  <div className="h-[3px] bg-gradient-to-r from-teal-500 via-cyan-500 to-indigo-500" />
</header>

        {/* Admissions Overview Strip */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-4 md:p-5 mb-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center">
                <FiInfo className="text-teal-800 text-sm" />
              </div>
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">About Admissions</span>
            </div>
<p className="text-slate-900 text-xs md:text-sm lg:text-base leading-relaxed md:leading-loose">
  Explore our academic programs, review entry requirements, download fee structures, and track your application from one easy-to-use portal. Navigate the tabs below to access each section, with all essential information available anytime in one place.
</p>
          </div>
        </div>

{schoolData && (() => {
  // Logic to check status against current date (2026)
  const today = new Date();
  const openDate = new Date(schoolData.admissionOpenDate);
  const closeDate = new Date(schoolData.admissionCloseDate);
  const isOpen = today >= openDate && today <= closeDate;

return (
  <div className={`rounded-xl md:rounded-2xl p-5 md:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border transition-all duration-500 ${
    isOpen 
      ? 'bg-white border-emerald-200' 
      : 'bg-stone-50 border-stone-200'
  }`}>
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
      
      {/* Status Section */}
      <div className="flex items-start sm:items-center gap-4">
        <div className={`p-3 rounded-xl shrink-0 ${
          isOpen ? 'bg-emerald-50 border border-emerald-200' : 'bg-stone-100 border border-stone-200'
        }`}>
          <IoCalendarOutline className={`w-5 h-5 md:w-6 md:h-6 ${isOpen ? 'text-emerald-600' : 'text-stone-400'}`} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-stone-300'}`} />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isOpen ? 'text-emerald-600' : 'text-stone-400'}`}>
              {isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
          <h3 className="font-bold text-base md:text-lg text-stone-900 leading-tight">
            {isOpen ? 'Admissions Now Open' : 'Admissions Closed'}
          </h3>
          <p className="text-xs text-stone-900 mt-0.5">
            {isOpen 
              ? 'Applications are being accepted for the upcoming academic year.' 
              : 'The application window has ended for this period.'}
          </p>
        </div>
      </div>

      {/* Date Grid */}
      <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100">
        <div className="px-3 border-r border-stone-200">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-stone-400 mb-0.5">Opens</p>
          <p className="font-bold text-sm text-stone-900">{formatDate(schoolData.admissionOpenDate)}</p>
        </div>
        <div className="px-3">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-stone-400 mb-0.5">Deadline</p>
          <p className="font-bold text-sm text-stone-900">{formatDate(schoolData.admissionCloseDate)}</p>
        </div>
      </div>

      {/* Action Button - Only strategic Apply Now */}
      <button
        disabled={!isOpen}
        onClick={() => router.push('/pages/apply-for-admissions')}
        className={`w-auto px-7 py-3 rounded-xl font-bold text-sm shadow-sm transition-all active:scale-95 ${
          isOpen 
            ? 'bg-stone-900 text-white hover:bg-stone-800' 
            : 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
        }`}
      >
        {isOpen ? 'Apply Now' : 'Closed'}
      </button>
    </div>
  </div>
);
})()}

        {/* Navigation Tabs - Segment Style */}
        <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-stone-200/60 overflow-hidden mb-5">
          <div className="flex overflow-x-auto scrollbar-hide p-1.5">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 font-semibold transition-all whitespace-nowrap rounded-lg text-sm ${
                    activeTab === tab.id
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <TabIcon className="text-base" />
                  <span className="text-xs md:text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-stone-200/60 p-4 md:p-6">
    {activeTab === 'overview' && (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10 md:space-y-24">
    
    {/* 1. Hero / Introduction Section */}
    <div className="relative pt-4 pb-2 text-center px-4 overflow-hidden">
      {/* Logo watermark */}
      <img src="/kinyui.png" alt="" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-44 md:w-56 opacity-[0.03] pointer-events-none select-none" />
      
      <div className="relative z-10">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 mb-4 md:mb-6">
        <FiBookOpen className="text-teal-800 text-xs" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-700">
          Admissions {new Date().getFullYear()}
        </span>
      </div>
      
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-stone-900 mb-3 tracking-tight leading-[1.15] text-balance">
        Discover{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-800 to-cyan-600">
          {schoolData?.name || "Matungulu Girls"}
        </span>
      </h2>
      
      <p className="text-dark mx-auto text-sm sm:text-base md:text-md px-2 text-balance max-w-4xl">
        {schoolData?.description || "A premier learning institution that blends academic rigor with character formation, preparing young women to lead with purpose and integrity."}
      </p>
      </div>
    </div>

    {/* 2. Vision/Mission Section */}
    <div className="px-2 md:px-4">
      <VisionMissionSection 
        vision={schoolData?.vision}
        mission={schoolData?.mission}
        motto={schoolData?.motto}
      />
    </div>

    {/* 3. Admission Paths - Mobile Optimized Grid */}
{/* 3. Admission Paths - Full Bleed on Mobile */}
<section className="relative overflow-hidden py-12 md:py-16 bg-stone-50 rounded-none md:rounded-3xl md:mx-4 px-0 md:px-8">
  {/* Logo Watermark */}
  <img src="/kinyui.png" alt="" className="absolute right-4 bottom-4 w-28 md:w-40 opacity-[0.03] pointer-events-none select-none" />
  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-teal-200/20 blur-3xl rounded-full" />
  
  <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-0">
    <div className="mb-8 text-center md:text-left">
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200 rounded-full mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-700">Admissions {new Date().getFullYear()}</span>
      </div>
      <h3 className="text-xl md:text-2xl font-extrabold text-stone-900 tracking-tight mb-3 leading-tight">
        Choose Your Entry Track
      </h3>
      <p className="text-stone-500 text-sm md:text-base max-w-2xl mx-auto md:mx-0 font-medium leading-relaxed">
        Whether joining as a fresh Form 1 student or transferring from another school, we have a clear path ready for you.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
      {admissionPaths.map((path, index) => (
        <AdmissionPathCard
          key={path.title}
          path={path}
          index={index}
          onApply={() => router.push('/pages/apply-for-admissions')}
        />
      ))}
    </div>
  </div>
</section>
{/* 4. School Highlights — Magazine Grid */}
<div className="py-10 md:py-14 px-0 md:px-4 max-w-5xl mx-auto">
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 px-4 md:px-0">
    <div className="flex-1">
      <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-teal-50 rounded-full mb-3 border border-teal-100">
        <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
        <span className="text-[9px] font-semibold uppercase tracking-wider text-teal-700">What Sets Us Apart</span>
      </div>
      <h2 className="text-xl md:text-2xl font-extrabold text-stone-900 tracking-tight leading-tight">
        The Matungulu Girls Advantage
      </h2>
      <p className="text-stone-700 text-xs md:text-sm mt-1 max-w-md">
        Three pillars that define the student experience at our institution.
      </p>
    </div>
  </div>

  {/* Magazine-style staggered grid */}
  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 md:px-0">
    
  {/* Large feature card — spans 7 cols */}
<div className="md:col-span-7 group relative bg-slate-900 rounded-2xl md:rounded-3xl overflow-hidden p-6 md:p-8 min-h-[220px] flex flex-col justify-end">
  <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 blur-[60px] rounded-full -mr-16 -mt-16" />
  <img src="/kinyui.png" alt="" className="absolute right-4 bottom-4 w-24 md:w-32 opacity-[0.04] pointer-events-none select-none" />
  <div className="relative z-10">
    <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/20 flex items-center justify-center mb-4">
      <IoBulbOutline className="text-teal-500 text-lg" />
    </div>

    <h4 className="text-base md:text-lg font-bold text-white mb-2">
      A School on the Rise
    </h4>

    <p className="text-slate-100 text-xs md:text-sm leading-relaxed max-w-md">
      Matungulu Girls' Senior School is steadily building a strong academic foundation, with consistent improvement in performance and a clear focus on excellence. Through dedicated teaching, structured learning, and student support, we are working towards achieving and surpassing a projected mean score of 5 and beyond. Our journey is defined by progress, discipline, and a shared commitment to unlocking every student’s potential.
    </p>

    <div className="flex items-center gap-3 mt-4">
      <span className="text-[9px] font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-md border border-teal-500/20">
        Improving Every Year
      </span>
      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
        Future-Focused
      </span>
    </div>
  </div>
</div>
    {/* Right column — 2 stacked cards */}
    <div className="md:col-span-5 flex flex-col gap-4">
      
      {/* Card 2 - Educators */}
      <div className="group flex-1 bg-white rounded-2xl border border-slate-200 p-5 md:p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-50 border border-cyan-100 flex items-center justify-center shrink-0">
            <FiUsers className="text-cyan-600 text-sm" />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded">TSC Certified</span>
        </div>
        <h4 className="text-sm font-bold text-stone-900 mb-1.5">Dedicated Teaching Faculty</h4>
        <p className="text-stone-500 text-xs leading-relaxed">
          Every educator brings years of classroom and mentoring experience. Small class ratios allow one-on-one guidance, ensuring no student falls through the cracks.
        </p>
      </div>

      {/* Card 3 - Infrastructure */}
      <div className="group flex-1 bg-gradient-to-br from-indigo-50 to-white rounded-2xl border border-indigo-100 p-5 md:p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-100 border border-indigo-200 flex items-center justify-center shrink-0">
            <FiCpu className="text-indigo-600 text-sm" />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">Modern Campus</span>
        </div>
        <h4 className="text-sm font-bold text-stone-900 mb-1.5">Future-Ready Learning Spaces</h4>
        <p className="text-stone-500 text-xs leading-relaxed">
          Fully equipped science labs, high-speed computer rooms, a digital library, and smart classrooms — every facility is built to inspire curiosity and hands-on discovery.
        </p>
      </div>

    </div>
  </div>
</div>
  </div>
)}

{activeTab === 'academics' && (
  <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-10 md:space-y-20">
    
    {/* Section 1: Hero Header - Mobile Optimized */}
    <div className="relative pt-2">
      <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8 border-b border-slate-100 pb-8 md:pb-12 px-2">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 rounded-lg mb-4 md:mb-6">
            <FiBookOpen className="text-indigo-200 text-xs" />
            <span className="text-[9px] md:text-[10px] text-white font-extrabold uppercase tracking-[0.2em]">Academic Excellence</span>
          </div>
          <h2 className="text-xl md:text-3xl font-extrabold text-slate-900 tracking-tighter leading-[1.1] mb-4">
            Academic <span className="text-indigo-600">Programs</span>
          </h2>
       <p className="text-slate-900 text-md md:text-md font-medium ">
  Matungulu GirlsSenior School offers a future-ready, holistic curriculum 
  specifically designed to cultivate critical thinking, academic excellence, 
  and global leadership. We empower our students to navigate the complexities 
  of the modern world with integrity, innovation, and a commitment to excellence.
</p>
        </div>

        {/* Download Button - Fixed width for mobile */}
        {documentData?.curriculumPDF && (
          <a 
            href={documentData.curriculumPDF}
            download={documentData.curriculumPdfName}
            target="_blank"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-4 px-6 py-4 bg-[#1a1a2e] text-white rounded-2xl active:scale-95 transition-all shadow-xl"
          >
            <FiDownload className="text-xl text-blue-400" />
            <div className="text-left">
              <div className="font-bold text-xs md:text-sm tracking-tight">Download Curriculum</div>
              {documentData.curriculumYear && (
                <div className="text-[10px] opacity-60">
                  {documentData.curriculumYear} • {documentData.curriculumTerm || 'Full Year'}
                </div>
              )}
            </div>
          </a>
        )}
      </div>
    </div>

    {/* Section 2: Education Systems */}
    <section className="px-2">
      <div className="flex flex-col mb-6 md:mb-12">
        <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-1">Paths to Success</h3>
        <h4 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Education Systems</h4>
      </div>
      
      {/* Grid: 1 column on mobile, 2 on large */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
        {educationSystems.map((system, index) => (
          <ModernEducationSystemCard key={index} {...system} />
        ))}
      </div>
    </section>

    {/* Section 3 & 4: Subject Tiles & Departments (Unified Visuals) */}
    {[
{
  title: "Subjects Offered",
  desc: "Our school provides a wide range of subjects, encompassing both core and elective disciplines. The curriculum is designed to give students a strong foundation in essential academic areas while also allowing them to explore diverse interests and talents. Each subject is carefully structured to promote critical thinking, creativity, and practical skills, preparing students for higher education, career paths, and lifelong learning.",
  count: schoolData?.subjects?.length,
  data: schoolData?.subjects,
  iconColor: "text-blue-600",
  bgColor: "bg-blue-50"
},
{
  title: "Departments",
  desc: "Our school is structured into distinct departments, each responsible for specific academic and administrative functions. These departments work together to provide a holistic educational experience, ensure smooth operations, and support the growth and development of both students and staff. They cover areas from curriculum planning and classroom instruction to student services, administration, and extracurricular programs, making sure every aspect of school life is efficiently managed and aligned with our educational goals.",
  count: schoolData?.departments?.length,
  data: schoolData?.departments,
  iconColor: "text-purple-600",
  bgColor: "bg-purple-50"
}    ].map((sect, i) => (
      <section key={i} className="relative bg-slate-50 rounded-[2rem] p-6 md:p-12 mx-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">{sect.title}</h3>
            <p className="text-slate-700 text-xs font-medium">{sect.desc}</p>
          </div>
          <div className="px-3 py-1.5 bg-white self-start rounded-full shadow-sm border border-slate-200 text-[10px] font-black text-slate-600 uppercase">
            {sect.count || 0} Subjects
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {sect.data?.map((item, idx) => {
            const Icon = i === 0 ? getSubjectIcon(item) : getDepartmentIcon(item);
            return (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                <div className={`w-10 h-10 mb-3 rounded-xl ${sect.bgColor} flex items-center justify-center shrink-0`}>
                  <Icon className={`${sect.iconColor} text-lg`} />
                </div>
                <h4 className="font-bold text-slate-800 text-[11px] leading-tight uppercase tracking-tight">{item}</h4>
              </div>
            );
          })}
        </div>
      </section>
    ))}

{/* Section 5: Stats & Calendar - Refined Responsive Dates */}
{schoolData?.openDate && (
  <div className="relative overflow-hidden bg-[#1a1a2e] md:rounded-[3rem] p-8 md:p-16 w-full">
    {/* Decorative Glow */}
    <div className="absolute top-0 right-0 w-48 md:w-96 h-48 md:h-96 bg-blue-500/10 blur-[60px] md:blur-[100px] rounded-full -mr-24 -mt-24" />
    
    <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8 md:gap-12">
      <div className="text-center lg:text-left max-w-sm">
        <h3 className="text-white text-lg md:text-xl font-black tracking-tight mb-3 uppercase">
          Academic <span className="text-emerald-500">Calendar</span>
        </h3>
        <p className="text-slate-900 text-xs md:text-md font-medium leading-relaxed">
          Mark your journey. Stay ahead of the curve with our key enrollment dates.
        </p>
      </div>


<div className="grid grid-cols-2 gap-3 md:gap-8 w-full lg:w-auto">
        
  {/* Year Opens Card */}
  <div className="bg-white/5 backdrop-blur-xl p-4 md:p-8 rounded-2xl border border-white/10 text-center min-w-0 flex flex-col justify-center">
    <div className="text-blue-400 font-black text-[8px] md:text-[10px] uppercase tracking-[0.2em] mb-2 md:mb-3">
      Year Opens
    </div>
    <div className="text-white font-black tracking-tighter tabular-nums leading-tight">
      {/* On mobile, we use a slightly smaller, tighter font size 
         to ensure the "Ordinal Jan Year" format fits on one line.
      */}
      <span className="block md:hidden text-md whitespace-nowrap">
        {formatDateWithOrdinal(schoolData.openDate)}
      </span>
      {/* Desktop View */}
      <span className="hidden md:block text-xl ">
        {formatDateWithOrdinal(schoolData.openDate)}
      </span>
    </div>
  </div>

  {/* Year Closes Card */}
  <div className="bg-white/5 backdrop-blur-xl p-4 md:p-8 rounded-2xl border border-white/10 text-center min-w-0 flex flex-col justify-center">
    <div className="text-rose-400 font-black text-[8px] md:text-[10px] uppercase tracking-[0.2em] mb-2 md:mb-3">
      Year Closes
    </div>
    <div className="text-white font-black tracking-tighter tabular-nums leading-tight">
      {/* Mobile View */}
      <span className="block md:hidden text-md whitespace-nowrap">
        {formatDateWithOrdinal(schoolData.closeDate)}
      </span>
      {/* Desktop View */}
      <span className="hidden md:block text-xl ">
        {formatDateWithOrdinal(schoolData.closeDate)}
      </span>
    </div>
  </div>

</div>
    </div>
  </div>
)}
  </div>
)}

{activeTab === 'career-paths' && (
  <div className="space-y-10 md:space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
    {/* Hero Section */}
    <div className="relative text-center px-4 overflow-hidden">
      {/* Logo watermark behind hero */}
      <img src="/kinyui.png" alt="" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 md:w-64 opacity-[0.03] pointer-events-none select-none" />
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-lg mb-6">
          <FiBriefcase className="text-teal-800 text-xs" />
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700">Career Readiness</span>
        </div>
        <h2 className="text-xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
          Career <span className="text-teal-800">Compass</span> and CBC <span className="text-teal-800">Pathways</span>
        </h2>
        <p className="text-black text-sm md:text-md max-w-2xl mx-auto leading-relaxed">
          Map your ambitions to real-world careers. See how each subject you study today connects to the profession you'll build tomorrow.
        </p>
      </div>
    </div>

    {/* CBC Pathways & Subjects Section */}
    <section className="relative bg-gradient-to-br from-slate-50 to-teal-50/30 rounded-2xl md:rounded-3xl border border-slate-200/60 p-5 md:p-10 overflow-hidden">
      {/* Logo watermark */}
      <img src="/kinyui.png" alt="" className="absolute right-4 bottom-4 w-28 md:w-40 opacity-[0.03] pointer-events-none select-none" />
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-teal-100 rounded-full mb-2">
              <FiBookOpen className="text-teal-800 text-xs" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-teal-700">CBC Framework</span>
            </div>
            <h3 className="text-lg md:text-2xl font-extrabold text-slate-900 tracking-tight">
              CBC <span className="text-teal-800">Learning Tracks</span> & Subjects
            </h3>
            <p className="text-slate-700 text-xs md:text-sm mt-1 max-w-xl">
              The Competency Based Curriculum organizes learning around three main pathways, each tailored to different student strengths and career goals.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-slate-200 shadow-sm self-start">
            <IoSparkles className="text-teal-500" />
            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">7 Core Competencies</span>
          </div>
        </div>

      {/* CBC Pathways — Numbered Timeline Layout */}
<div className="space-y-5 mb-8">
  {[
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
  ].map((path, idx) => {
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
            {[
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
            ].map((subj, i) => {
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

    {/* Career Guidance Banner - Full Width on Mobile */}
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 md:rounded-[2.5rem] p-8 md:p-12 text-white w-full">
      {/* Logo watermark */}
      <img src="/kinyui.png" alt="" className="absolute right-6 bottom-6 w-32 md:w-48 opacity-[0.04] pointer-events-none select-none" />
      <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-teal-500/10 blur-[60px] md:blur-[100px] rounded-full -mr-32 -mt-32" />
      
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-teal-500/20 backdrop-blur-md border border-teal-400/20 rounded-2xl flex items-center justify-center">
              <FiTarget className="text-teal-500 text-xl" />
            </div>
            <h3 className="text-xl md:text-2xl font-extrabold uppercase tracking-tight">Professional Development</h3>
          </div>
          <p className="text-slate-300/80 text-sm md:text-base leading-relaxed font-medium">
            From personalized career mapping and university placement guidance to hands-on industry visits — 
            we equip every student with the clarity and confidence to pursue their chosen profession.
          </p>
        </div>
        <button 
          onClick={() => router.push('/pages/contact')}
          className="flex items-center justify-center gap-2 md:gap-3 w-full lg:w-auto px-5 md:px-10 py-3.5 md:py-5 rounded-xl md:rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-sm font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-[10px] md:text-[11px] transition-transform active:scale-95"
        >
          <span className="whitespace-nowrap">Schedule Consultation</span>
          <div className="flex-shrink-0 flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full bg-slate-900 text-white">
            <FiArrowRight className="text-[10px] md:text-[12px]" />
          </div>
        </button>
      </div>
    </div>

    {/* Render the CareerSearchPage component */}
    <CareerSearchPage />
  </div>
)}

          {activeTab === 'requirements' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 md:space-y-12">
              
              {/* Hero Header */}
              <div className="text-center mb-8 md:mb-12 px-2 md:px-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-lg mb-6">
                  <FiFileText className="text-teal-800 text-xs" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700">Admission Checklist</span>
                </div>
                <h2 className="text-lg sm:text-xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-4 px-2">
                  Application <span className="text-teal-800">Requirements</span>
                </h2>
                <p className="text-slate-700 text-base md:text-lg max-w-3xl mx-auto leading-relaxed px-2">
                  Everything you need to prepare for a successful application journey.
                </p>
              </div>

              {/* Uniform Requirements - Modern Card with API Data */}
              <ModernUniformRequirementsSection 
                admissionFeeDistribution={documentData?.admissionFeeDistribution}
                admissionFeePdf={documentData?.admissionFeePdf}
                admissionFeePdfName={documentData?.admissionFeePdfName}
                admissionFeeDescription={documentData?.admissionFeeDescription}
                admissionFeeYear={documentData?.admissionFeeYear}
                admissionFeeTerm={documentData?.admissionFeeTerm}
              />

   {/* Required Documents - Modern Grid */}
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl p-6 md:p-10 overflow-hidden">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-slate-900 rounded-2xl shadow-xl shadow-slate-200">
              <IoDocumentTextOutline className="text-white text-xl md:text-2xl" />
            </div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter">
              Required Documents
            </h3>
          </div>
          <p className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] ml-1">
            Essential paperwork for admission processing
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
          <IoCheckmarkCircleOutline className="text-lg" />
          <span className="text-[10px] font-black uppercase tracking-widest">Mandatory Set</span>
        </div>
      </div>

  {/* Document Cards Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
  {(schoolData?.admissionDocumentsRequired?.length > 0 ? schoolData.admissionDocumentsRequired : [
    "Original KCPE  or KPSEA or KJSEA Certificate",
    "Birth Certificate",
    "Passport Size Photos (4)",
    "Medical Report",
    "Transfer Letter (if applicable)",
    "Previous School Reports"
  ]).map((doc, index) => (
    <div 
      key={index}
      className="relative bg-white border-2 border-slate-100 rounded-[1rem] p-4 sm:p-6 shadow-sm"
    >
      <div className="flex items-center gap-4">
        {/* Icon & Counter */}
        <div className="relative shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
            <IoDocumentTextOutline className="text-emerald-600 text-xl" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black border-4 border-white">
            {index + 1}
          </div>
        </div>
        
        {/* Content */}
        <div className="min-w-0 flex-1">
          <h4 className="font-black text-slate-900 text-sm leading-tight uppercase tracking-tight break-words">
            {doc}
          </h4>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider">
              Required
            </span>
            {index === 0 && (
              <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase tracking-wider">
                Original
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

      {/* Important Notes - Full-Screen Mobile Strategy */}
      <div className="mt-8 md:mt-12 p-6 md:p-12 bg-[#1a1a2e] rounded-none md:rounded-[2.5rem] relative overflow-hidden border-y border-white/5 md:border shadow-2xl">
        <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-amber-500/10 blur-[60px] md:blur-[80px] rounded-full -mr-24 -mt-24 md:-mr-32 md:-mt-32"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-2.5 bg-amber-500 rounded-xl shadow-lg shadow-amber-500/20">
              <FiAlertTriangle className="text-slate-900 text-lg md:text-xl" />
            </div>
            <h4 className="text-[10px] md:text-[11px] font-black text-white uppercase tracking-[0.3em] md:tracking-[0.4em]">
              Important <span className="text-amber-500">Submission</span> Notes
            </h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 md:gap-y-5">
            {[
              "All documents must be original or certified copies",
              "Documents should be submitted in a clear plastic folder",
              "Incomplete applications will not be processed",
              "Submit copies along with originals for verification"
            ].map((note, i) => (
              <div key={i} className="flex items-start gap-4 group">
                <div className="relative mt-1.5 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-amber-500 z-10 relative" />
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-amber-500 animate-ping opacity-20" />
                </div>
                
                <p className="text-[12px] md:text-[13px] font-bold text-slate-900 leading-relaxed transition-colors group-hover:text-white">
                  {note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

{/* Transfer Process - Modern Timeline Optimized for All Screens */}
<div className="bg-[#1a1a2e] rounded-none md:rounded-[3rem] p-6 md:p-12 text-white relative overflow-hidden">
  {/* Decorative Background Glow */}
  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -mr-32 -mt-32 invisible md:visible" />

  <div className="relative z-10">
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 md:mb-16 gap-4">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
            <FiArrowRight className="text-white text-xl" />
          </div>
          <h3 className="text-xl md:text-xl font-black uppercase tracking-tighter">
            Transfer <span className="text-blue-400">Process</span>
          </h3>
        </div>
        <p className="text-slate-900 text-sm md:text-base font-medium">Seamless transition with 4-step verification</p>
      </div>
      
      {/* Time Badge - Styled for mobile */}
      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
        <FiClock className="text-yellow-400 text-sm" />
        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-300">2-3 Weeks Total</span>
      </div>
    </div>

    {/* Steps Grid: Stacked on mobile, Grid on Tablet/Desktop */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
      {transferProcess.map((step, index) => (
        <div 
          key={index}
          className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 transition-all duration-500 hover:bg-white/[0.07]"
        >
          {/* Step Number Badge */}
          <div className="absolute -top-3 -left-3 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-xl shadow-blue-900/40 z-20">
            {step.step}
          </div>
          
          <div className="relative z-10 space-y-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  {step.title}
                </h4>
              </div>
              <div className="flex items-center gap-1.5 text-yellow-500/80 text-[10px] font-black uppercase tracking-widest">
                <FiClock className="text-xs" />
                {step.duration}
              </div>
            </div>
            
            <p className="text-slate-900 text-xs md:text-sm font-bold leading-relaxed">
              {step.description}
            </p>
            
            {/* Requirements List */}
            <div className="pt-4 border-t border-white/5 space-y-3">
              <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em]">Checklist</span>
              <ul className="space-y-2.5">
                {step.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-[11px] md:text-xs text-slate-300 font-medium">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500/50 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Desktop Connector Line */}
          {index < transferProcess.length - 1 && (
            <div className="hidden lg:block absolute -right-3 top-1/2 w-6 h-[1px] bg-white/10 z-0" />
          )}
        </div>
      ))}
    </div>

    {/* CTA Footer - Bento Style */}
    <div className="mt-12 md:mt-16 p-6 md:p-8 bg-white/[0.03] border border-white/5 rounded-2xl md:rounded-[2rem]">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-5">
          <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
            <IoCheckmarkCircleOutline className="text-emerald-400 text-3xl" />
          </div>
          <div>
            <h4 className="text-xl font-black text-white">Ready to Join Us?</h4>
            <p className="text-slate-900 text-sm font-medium">Complete all steps for official admission approval</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
         
            </div>
          )}

{activeTab === 'results' && (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6 md:space-y-12">
    
    {/* Hero Header - Adjusted for Mobile */}
    <div className="text-center mb-6 md:mb-12 pt-4 md:pt-0">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-50 border border-violet-200 rounded-lg mb-4 md:mb-6">
        <FiTrendingUp className="text-violet-600 text-xs" />
        <span className="text-[9px] md:text-[10px] font-extrabold uppercase tracking-widest text-violet-700">Academic Performance</span>
      </div>
      
      <h2 className="text-xl md:text-3xl font-extrabold text-slate-900 tracking-tighter mb-4 px-4 leading-tight">
        Examination <span className="text-violet-600">Results</span>
      </h2>
      
      <p className="text-slate-700 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed px-6">
        Access past examination results, performance reports, and academic archives.
      </p>
    </div>

    {/* Academic Results Section - This will now occupy full width on mobile inside its component */}
    <div className="-mx-4 md:mx-0">
       <AcademicResultsSection documentData={documentData} />
    </div>

    {/* Results Archive Notice - Full bleed on mobile */}
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-y md:border border-blue-200/60 rounded-none md:rounded-3xl p-6 md:p-8 -mx-4 md:mx-0">
      <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
        <div className="p-3 bg-white rounded-2xl shadow-sm shadow-blue-200/50">
          <FiInfo className="text-blue-500 text-xl md:text-2xl" />
        </div>
        <div className="space-y-2">
          <h4 className="font-black text-blue-900 text-sm md:text-lg uppercase tracking-tight">
            Results Archive Information
          </h4>
          <p className="text-blue-700/80 text-xs md:text-base font-medium leading-relaxed">
            All examination results are available for download in PDF format. Results are typically uploaded 
            within <span className="text-blue-900 font-bold">2 weeks</span> after official release. For any missing results or technical issues, please contact 
            the academic office.
          </p>
        </div>
      </div>
    </div>
  </div>
)}

          {/* FAQ Tab - Modern & Responsive */}
          {activeTab === 'faq' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 md:space-y-10">
              
              {/* Hero Header */}
              <div className="text-center mb-8 md:mb-10 px-2 md:px-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg mb-6">
                  <FiHelpCircle className="text-slate-600 text-xs" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">Quick Answers</span>
                </div>
                <h2 className="text-xl sm:text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight mb-4 px-2">
                  Frequently Asked <span className="text-[#1a1a2e]">Questions</span>
                </h2>
                <p className="text-slate-700 text-base md:text-lg max-w-3xl mx-auto leading-relaxed px-2">
                  Clear answers to common queries about admissions, curriculum, fees, and school policies.
                </p>
              </div>

              {/* FAQ Items - Clean & Responsive */}
              <div className="space-y-3 md:space-y-4 px-2 md:px-0">
                {faqs.map((faq, index) => (
                  <ModernFAQItem
                    key={index}
                    faq={faq}
                    index={index}
                    openFaq={openFaq}
                    setOpenFaq={setOpenFaq}
                  />
                ))}
              </div>

    
            </div>
          )}
        </div>

        {/* CTA Section with School Logo Watermark */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl md:rounded-[24px] p-6 md:p-12 text-center shadow-2xl">
          
          {/* School Logo Watermark */}
          <img src="/kinyui.png" alt="" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 md:w-64 opacity-[0.04] pointer-events-none select-none" />
          {/* Decorative Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-2xl bg-teal-500/8 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
            
            {/* Badge */}
            <div className="mb-4 md:mb-5 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <span className="flex h-1.5 w-1.5 rounded-full bg-teal-400"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-200">
                Enrollment Open {new Date().getFullYear()}
              </span>
            </div>

            <h2 className="text-xl md:text-3xl font-black text-white mb-4 tracking-tight leading-tight text-balance">
              Start Your <span className="text-teal-400">Journey With Us</span>
            </h2>
            
            <p className="text-slate-900 mb-6 md:mb-8 text-sm md:text-base leading-relaxed max-w-lg mx-auto text-balance">
              Have questions about enrollment, fees, or student life? Our admissions team is ready to guide you through every step.
            </p>

            {/* Contact Action */}
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto">
              <button
                onClick={() => router.push('/pages/contact')}
                className="flex-shrink-0 px-4 py-2.5 sm:px-5 sm:py-3 md:px-7 md:py-3.5 
                           bg-teal-500 hover:bg-teal-400 text-white rounded-xl font-bold text-xs sm:text-sm 
                           tracking-wide flex items-center justify-center gap-2 
                           active:scale-95 transition-all shadow-lg shadow-teal-500/20"
              >
                Contact Admissions 
                <FiArrowRight size={14} />
              </button>
            </div>

            <p className="mt-4 md:mt-6 text-[10px] uppercase tracking-widest text-slate-700 font-bold opacity-60">
              Application takes few minutes
            </p>
          </div>
        </div>
      </div>
    </div>
 );
};