'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FiMail, 
  FiPhone, 
  FiSearch, 
  FiFilter, 
  FiGrid, 
  FiList, 
  FiChevronDown, 
  FiChevronRight, 
  FiBriefcase,
  FiCalendar, 
  FiUser,
  FiX,
  FiArrowLeft,
  FiArrowRight,
  FiMapPin,
  FiAward,
  FiStar,
  FiBook,
  FiTarget,
  FiUsers,
  FiBookOpen,
  FiRefreshCw,
  FiSettings,
  FiHeart,
  FiCpu,
  FiGlobe,
  FiActivity,
  FiLayers,
  FiShield
} from 'react-icons/fi';
import { toast } from 'sonner';
import { SiGmail } from 'react-icons/si';

// ==========================================
// 1. ENHANCED CONFIGURATION WITH HIERARCHY
// ==========================================

const HIERARCHY_ICONS = {
  leadership: FiShield,
  teaching: FiBookOpen,
  support: FiSettings,
};

const DEPT_ICONS = {
  administration: FiShield,
  sciences: FiActivity,
  mathematics: FiTarget,
  languages: FiGlobe,
  humanities: FiBook,
  guidance: FiHeart,
  sports: FiAward,
  technical: FiCpu,
  support: FiSettings,
};

const STAFF_HIERARCHY = [
  {
    level: 'leadership',
    label: 'School Leadership',
    color: 'blue',
    positions: ['Principal', 'Deputy Principal']
  },
  {
    level: 'teaching',
    label: 'Teaching Staff',
    color: 'emerald',
    positions: ['Teacher', 'Subject Teacher', 'Class Teacher', 'Assistant Teacher', 'Senior Teacher', 'Head of Department']
  },
  {
    level: 'support',
    label: 'Support Staff',
    color: 'orange',
    positions: ['Librarian', 'Laboratory Technician', 'Accountant', 'Secretary', 'Support Staff']
  }
];

const DEPARTMENTS = [
  { id: 'administration', label: 'Administration', color: 'blue', hierarchy: 'leadership' },
  { id: 'sciences', label: 'Sciences', color: 'emerald', hierarchy: 'teaching' },
  { id: 'mathematics', label: 'Mathematics', color: 'orange', hierarchy: 'teaching' },
  { id: 'languages', label: 'Languages', color: 'violet', hierarchy: 'teaching' },
  { id: 'humanities', label: 'Humanities', color: 'amber', hierarchy: 'teaching' },
  { id: 'guidance', label: 'Guidance & Counseling', color: 'pink', hierarchy: 'support' },
  { id: 'sports', label: 'Sports & Athletics', color: 'teal', hierarchy: 'teaching' },
  { id: 'technical', label: 'Technical & IT', color: 'cyan', hierarchy: 'support' },
  { id: 'support', label: 'Support Staff', color: 'slate', hierarchy: 'support' }
];

const ITEMS_PER_PAGE = 12;

// ==========================================
// 2. ENHANCED UTILITY FUNCTIONS WITH HIERARCHY
// ==========================================

const generateSlug = (name, id) => {
  const cleanName = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  return `${cleanName}-${id}`;
};

const getBadgeColorStyles = (colorName) => {
  const map = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    violet: 'bg-violet-50 text-violet-700 border-violet-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    pink: 'bg-pink-50 text-pink-700 border-pink-200',
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    slate: 'bg-slate-50 text-slate-700 border-slate-200',
  };
  return map[colorName] || map.slate;
};

const getImageSrc = (staff) => {
  if (staff?.image) {
    if (staff.image.startsWith('/')) {
      return `${process.env.NEXT_PUBLIC_SITE_URL || ''}${staff.image}`;
    }
    if (staff.image.startsWith('http')) return staff.image;
  }
  return '/images/default-staff.jpg';
};

const getStaffHierarchy = (position) => {
  if (!position) return 'teaching';
  
  const positionLower = position.toLowerCase();
  if ((positionLower.includes('principal') || positionLower.includes('deputy principal')) &&
      !positionLower.includes('senior') && !positionLower.includes('head')) {
    return 'leadership';
  } else if (positionLower.includes('teacher') || positionLower.includes('lecturer') || positionLower.includes('tutor') ||
             positionLower.includes('senior') || positionLower.includes('head')) {
    return 'teaching';
  } else {
    return 'support';
  }
};

const sortStaffByHierarchy = (staff) => {
  const hierarchyOrder = { leadership: 1, teaching: 2, support: 3 };
  
  return [...staff].sort((a, b) => {
    const aHierarchy = getStaffHierarchy(a.position);
    const bHierarchy = getStaffHierarchy(b.position);
    
    if (hierarchyOrder[aHierarchy] !== hierarchyOrder[bHierarchy]) {
      return hierarchyOrder[aHierarchy] - hierarchyOrder[bHierarchy];
    }
    
    if (aHierarchy === 'leadership' && bHierarchy === 'leadership') {
      const aIsPrincipal = a.position?.toLowerCase().includes('principal') && !a.position?.toLowerCase().includes('deputy');
      const bIsPrincipal = b.position?.toLowerCase().includes('principal') && !b.position?.toLowerCase().includes('deputy');
      
      if (aIsPrincipal && !bIsPrincipal) return -1;
      if (!aIsPrincipal && bIsPrincipal) return 1;
      
      return (a.name || '').localeCompare(b.name || '');
    }
    
    return (a.name || '').localeCompare(b.name || '');
  });
};

// ==========================================
// 3. SUB-COMPONENTS
// ==========================================

const Badge = ({ children, color = 'slate', className = '', icon }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${getBadgeColorStyles(color)} ${className}`}>
    {icon && <span className="mr-1">{icon}</span>}
    {children}
  </span>
);

const StaffSkeleton = ({ viewMode }) => {
  if (viewMode === 'list') {
    return (
      <div className="flex gap-4 p-4 bg-white border border-slate-100 rounded-xl animate-pulse">
        <div className="w-14 h-14 bg-slate-100 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-100 rounded w-1/3" />
          <div className="h-3 bg-slate-100 rounded w-1/4" />
          <div className="h-3 bg-slate-100 rounded w-full" />
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white border border-slate-100 rounded-xl overflow-hidden animate-pulse">
      <div className="w-full aspect-[4/3] bg-slate-100" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-slate-100 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
      </div>
    </div>
  );
};

const StatsPill = ({ icon: Icon, value, label }) => (
  <div className="rounded-2xl border border-white/12 bg-white/6 px-4 py-3 backdrop-blur-sm sm:px-5">
    <div className="flex items-center gap-2">
      {Icon && (
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-[#f8c95f]">
          <Icon size={14} />
        </div>
      )}
      <div>
        <span className="block text-lg font-black text-white sm:text-xl">{value}</span>
        <span className="block text-[9px] font-semibold uppercase tracking-[0.24em] text-white/45">{label}</span>
      </div>
    </div>
  </div>
);

const HierarchySection = ({ title, iconKey, staff, viewMode, isFirst = false, onContactClick }) => {
  if (!staff?.length) return null;
  const Icon = HIERARCHY_ICONS[iconKey] || FiUsers;

  return (
    <section className={isFirst ? "" : "mt-10"}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-[#1a1a2e] flex items-center justify-center">
          <Icon size={14} className="text-white" />
        </div>
        <h2 className="text-sm font-black text-[#1a1a2e] uppercase tracking-[0.15em]">
          {title}
        </h2>
        <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
          {staff.length}
        </span>
        <div className="flex-1 h-px bg-slate-100 ml-2" />
      </div>
      
      <div className={
        viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" 
          : "flex flex-col gap-3"
      }>
        {staff.map((member) => (
          <div key={member.id}>
            {viewMode === 'grid' 
              ? <StaffCard staff={member} onContactClick={onContactClick} /> 
              : <StaffListCard staff={member} onContactClick={onContactClick} />
            }
          </div>
        ))}
      </div>
    </section>
  );
};

// StaffCard Component — horizontal modern card
const StaffCard = ({ staff, onContactClick }) => {
  const deptConfig = DEPARTMENTS.find(d => d.id === staff.departmentId);
  const hierarchy = getStaffHierarchy(staff.position);
  const DeptIcon = DEPT_ICONS[deptConfig?.id] || FiLayers;
  
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_18px_50px_-30px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-[#1a1a2e]/15 hover:shadow-[0_28px_70px_-34px_rgba(15,23,42,0.45)]">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-[#1a1a2e] via-[#214760] to-[#d7a73d]" />

      {/* Image */}
      <div className="relative mx-4 mt-4 aspect-[4/4.3] overflow-hidden rounded-[24px] border border-white/60 bg-slate-100 shadow-sm">
        <Image
          src={getImageSrc(staff)}
          alt={staff.name}
          fill
          className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          priority={hierarchy === 'leadership'}
          onError={(e) => { e.target.src = '/images/default-staff.jpg'; }}
        />

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#07111b]/70 to-transparent" />

        {hierarchy === 'leadership' && (
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-[#1a1a2e]/90 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            <FiShield size={10} /> Leadership
          </div>
        )}

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
          <div className="min-w-0 rounded-2xl bg-white/92 px-3 py-2 shadow-sm backdrop-blur-sm">
            <p className="truncate text-[12px] font-black text-slate-900">{staff.name}</p>
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              {staff.position}
            </p>
          </div>
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border bg-white/90 shadow-sm backdrop-blur-sm ${getBadgeColorStyles(deptConfig?.color).split(' ')[2]}`}>
            <DeptIcon size={15} className={getBadgeColorStyles(deptConfig?.color).split(' ')[1]} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold ${getBadgeColorStyles(deptConfig?.color)}`}>
            <DeptIcon size={10} />
            {staff.department}
          </span>
          {staff.email && (
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
              <FiMail size={10} />
              Available
            </span>
          )}
        </div>

        <p className="mb-4 text-[11px] font-medium leading-relaxed text-slate-500 line-clamp-3">
          {staff.quote || staff.bio}
        </p>

        {staff.expertise && staff.expertise.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {staff.expertise.slice(0, 2).map((tag, idx) => (
              <span key={idx} className="rounded-full bg-[#f5f7fb] px-2.5 py-1 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200/70">
                {tag}
              </span>
            ))}
            {staff.expertise.length > 2 && (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-400 ring-1 ring-slate-200/70">
                +{staff.expertise.length - 2}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto flex gap-2 border-t border-slate-100 pt-3">
          <button
            onClick={() => onContactClick(staff)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-[11px] font-semibold text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <FiMail size={11} /> Contact
          </button>
          
          <Link
            href={`/pages/SchoolTeam/${staff.id}/${generateSlug(staff.name, staff.id)}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#1a1a2e] py-2.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#2d2d44]"
          >
            <FiChevronRight size={11} /> View
          </Link>
        </div>
      </div>
    </div>
  );
};

// StaffListCard Component
const StaffListCard = ({ staff, onContactClick }) => {
  const deptConfig = DEPARTMENTS.find(d => d.id === staff.departmentId);
  const hierarchy = getStaffHierarchy(staff.position);
  const DeptIcon = DEPT_ICONS[deptConfig?.id] || FiLayers;
  
  return (
    <div className="flex flex-col items-center gap-4 rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-[0_16px_45px_-34px_rgba(15,23,42,0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1a1a2e]/15 hover:shadow-[0_24px_60px_-36px_rgba(15,23,42,0.8)] sm:flex-row">
      <div className="relative shrink-0">
        <div className="absolute inset-0 rounded-[22px] bg-gradient-to-br from-[#1a1a2e] via-[#34556d] to-[#d7a73d] blur-md opacity-20" />
        <div className="relative h-16 w-16 overflow-hidden rounded-[22px] border border-white bg-slate-50 ring-2 ring-slate-100">
          <Image
            src={getImageSrc(staff)}
            alt={staff.name}
            fill
            className="object-cover"
            sizes="64px"
            onError={(e) => { e.target.src = '/images/default-staff.jpg'; }}
          />
        </div>
        {hierarchy === 'leadership' && (
          <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#1a1a2e]">
            <FiShield size={8} className="text-white" />
          </div>
        )}
      </div>

      <div className="flex-1 text-center sm:text-left min-w-0">
        <div className="mb-1 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          <h3 className="text-sm font-black text-slate-900">
            <Link href={`/pages/SchoolTeam/${staff.id}/${generateSlug(staff.name, staff.id)}`} className="hover:text-[#1a1a2e] transition-colors">
              {staff.name}
            </Link>
          </h3>
          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${getBadgeColorStyles(deptConfig?.color)}`}>
            <DeptIcon size={9} />
            {staff.department}
          </span>
        </div>
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1a1a2e]/55">{staff.position}</p>
        <p className="text-[11px] font-medium leading-relaxed text-slate-500 line-clamp-2">{staff.bio}</p>
      </div>

      <div className="flex w-full shrink-0 gap-2 sm:w-auto">
        <button
          onClick={() => onContactClick(staff)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[11px] font-semibold text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 sm:flex-none"
        >
          <FiMail size={11} /> Contact
        </button>
        <Link
          href={`/pages/SchoolTeam/${staff.id}/${generateSlug(staff.name, staff.id)}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#1a1a2e] px-3.5 py-2.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#2d2d44] sm:flex-none"
        >
          <FiChevronRight size={11} /> View
        </Link>
      </div>
    </div>
  );
};

// ==========================================
// 4. MAIN COMPONENT
// ==========================================

export default function StaffDirectory() {
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState('all');
  
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);

  // Consultation Modal States
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [consultForm, setConsultForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    subject: '',
    inquiryType: 'general',
    contactMethod: 'email',
    studentGrade: '',
    staffId: '',
    staffName: '',
    staffEmail: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Handle Contact Click
  const handleContactClick = (staff) => {
    setSelectedStaff(staff);
    setConsultForm({
      ...consultForm,
      staffId: staff.id,
      staffName: staff.name,
      staffEmail: staff.email,
      subject: `Inquiry for ${staff.name}`
    });
    setShowConsultModal(true);
  };

  // Handle Consultation Submit
  const handleConsultSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        name: consultForm.name,
        email: consultForm.email,
        phone: consultForm.phone,
        message: consultForm.message,
        subject: consultForm.subject || `Consultation with ${selectedStaff.name}`,
        studentDetails: consultForm.studentGrade,
        contactMethod: consultForm.contactMethod,
        teacherId: selectedStaff.id,
        teacherName: selectedStaff.name,
        teacherEmail: selectedStaff.email,
        teacherPosition: selectedStaff.position
      };

      const response = await fetch('/api/teacher-consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(`Consultation request sent! Reference: ${data.referenceNumber}`);
        setShowConsultModal(false);
        setConsultForm({
          name: '',
          email: '',
          phone: '',
          message: '',
          subject: '',
          inquiryType: 'general',
          contactMethod: 'email',
          studentGrade: '',
          staffId: '',
          staffName: '',
          staffEmail: ''
        });
      } else {
        throw new Error(data.error || 'Failed to send consultation request');
      }
    } catch (error) {
      console.error('Error sending consultation:', error);
      toast.error(error.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const fetchStaffData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/staff');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch staff data: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.staff) {
        const mappedStaff = data.staff.map(staff => ({
          id: staff.id,
          name: staff.name,
          role: staff.role,
          position: staff.position,
          department: staff.department,
          departmentId: staff.department.toLowerCase().replace(/\s+/g, '-'),
          email: staff.email,
          phone: staff.phone,
          image: staff.image,
          expertise: staff.expertise || [],
          bio: staff.bio,
          responsibilities: staff.responsibilities || [],
          achievements: staff.achievements || [],
          location: 'Matungulu Girls Senior School',
          joinDate: '2020'
        }));
        
        const sortedStaff = sortStaffByHierarchy(mappedStaff);
        setStaffData(sortedStaff);
      } else {
        throw new Error('Invalid data format from API');
      }
    } catch (err) {
      console.error('Error fetching staff data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  const filteredStaff = useMemo(() => {
    return staffData.filter(staff => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        staff.name.toLowerCase().includes(searchLower) ||
        staff.role.toLowerCase().includes(searchLower) ||
        staff.position.toLowerCase().includes(searchLower) ||
        (staff.bio && staff.bio.toLowerCase().includes(searchLower)) ||
        staff.expertise.some(exp => exp.toLowerCase().includes(searchLower));

      const matchesDept = selectedDepts.length === 0 || selectedDepts.includes(staff.departmentId);

      const staffHierarchy = getStaffHierarchy(staff.position);
      const matchesHierarchy = selectedHierarchy === 'all' || selectedHierarchy === staffHierarchy;

      return matchesSearch && matchesDept && matchesHierarchy;
    });
  }, [staffData, searchQuery, selectedDepts, selectedHierarchy]);

  const staffByHierarchy = useMemo(() => {
    const leadership = filteredStaff.filter(staff => getStaffHierarchy(staff.position) === 'leadership');
    const teaching = filteredStaff.filter(staff => getStaffHierarchy(staff.position) === 'teaching');
    const support = filteredStaff.filter(staff => getStaffHierarchy(staff.position) === 'support');
    
    const sortedLeadership = [...leadership].sort((a, b) => {
      const aIsPrincipal = a.position?.toLowerCase().includes('principal') && !a.position?.toLowerCase().includes('deputy');
      const bIsPrincipal = b.position?.toLowerCase().includes('principal') && !b.position?.toLowerCase().includes('deputy');
      
      if (aIsPrincipal && !bIsPrincipal) return -1;
      if (!aIsPrincipal && bIsPrincipal) return 1;
      
      return (a.name || '').localeCompare(b.name || '');
    });
    
    return {
      leadership: sortedLeadership,
      teaching: [...teaching].sort((a, b) => (a.name || '').localeCompare(b.name || '')),
      support: [...support].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    };
  }, [filteredStaff]);

  const totalPages = Math.ceil(filteredStaff.length / ITEMS_PER_PAGE);
  const paginatedStaff = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredStaff.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredStaff, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDepts, selectedHierarchy]);

  const toggleDept = (id) => {
    setSelectedDepts(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedDepts([]);
    setSelectedHierarchy('all');
  };

  const getDeptCount = (id) => staffData.filter(s => s.departmentId === id).length;

  const departmentStats = useMemo(() => [
    { icon: FiShield, value: staffByHierarchy.leadership.length, label: 'Leadership', color: 'blue' },
    { icon: FiBookOpen, value: staffByHierarchy.teaching.length, label: 'Teachers', color: 'emerald' },
    { icon: FiSettings, value: staffByHierarchy.support.length, label: 'Support', color: 'orange' },
    { icon: FiLayers, value: DEPARTMENTS.length, label: 'Depts', color: 'violet' }
  ], [staffByHierarchy]);

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-sm w-full">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100">
            <FiUser className="text-xl text-red-500" />
          </div>
          <h2 className="text-lg font-black text-slate-900 mb-2">Error Loading Directory</h2>
          <p className="text-sm text-slate-500 mb-5">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[#1a1a2e] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-[#2d2d44] transition-colors w-full"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      
      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1a1a2e] via-[#244863] to-[#d7a73d] p-[1px] shadow-sm">
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white">
                <Image src="/MatG.jpg" alt="Logo" width={28} height={28} className="rounded-xl object-cover" />
              </div>
            </div>
            <div>
              <span className="text-sm font-black tracking-tight text-[#1a1a2e]">
                Matungulu Girls
              </span>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Staff Directory</p>
            </div>
          </Link>

          <div className="flex flex-1 flex-col gap-3 lg:max-w-3xl lg:flex-row lg:items-center lg:justify-end">
            <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80 text-center lg:max-w-xs">
              <div className="px-3 py-2">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Profiles</p>
                <p className="text-sm font-black text-slate-900">{staffData.length}</p>
              </div>
              <div className="border-x border-slate-200 px-3 py-2">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Views</p>
                <p className="text-sm font-black text-slate-900">{viewMode === 'grid' ? 'Grid' : 'List'}</p>
              </div>
              <div className="px-3 py-2">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Focus</p>
                <p className="text-sm font-black text-slate-900">{selectedHierarchy === 'all' ? 'All' : selectedHierarchy}</p>
              </div>
            </div>

            <div className="relative w-full lg:max-w-md">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, role, expertise..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm shadow-sm outline-none transition-all focus:border-[#1a1a2e] focus:ring-4 focus:ring-[#1a1a2e]/5"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <FiX size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchStaffData}
                disabled={loading}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600 transition-all hover:border-[#1a1a2e] hover:text-[#1a1a2e] disabled:opacity-50"
              >
                <FiRefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                <span>{loading ? 'Loading...' : 'Refresh'}</span>
              </button>
              
              <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`rounded-lg p-2 transition-all ${viewMode === 'grid' ? 'bg-[#1a1a2e] text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <FiGrid size={14} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`rounded-lg p-2 transition-all ${viewMode === 'list' ? 'bg-[#1a1a2e] text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <FiList size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden bg-[#0f1724]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(215,167,61,0.24),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.22),_transparent_30%),linear-gradient(135deg,_rgba(255,255,255,0.05),_transparent_48%)]" />
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.25) 1px, transparent 1px)', backgroundSize: '34px 34px' }} />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-end">
            <div>
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.34em] text-[#f8c95f]/80">Matungulu Girls Senior School</p>
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Meet the women and mentors shaping the next generation.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/68 sm:text-base">
                Explore the people behind leadership, teaching, and student support across the school. Each profile highlights the expertise and care that keeps the community moving.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-semibold text-white/85 backdrop-blur-sm">
                  Structured by leadership, teaching, and support
                </div>
                <div className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-semibold text-white/85 backdrop-blur-sm">
                  Quick contact and profile access
                </div>
              </div>
            </div>

            {!loading ? (
              <div className="rounded-[28px] border border-white/12 bg-white/7 p-4 shadow-2xl backdrop-blur-md sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/40">Directory Snapshot</p>
                    <p className="mt-1 text-lg font-black text-white">Staff overview</p>
                  </div>
                  <div className="rounded-2xl bg-[#f8c95f] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#1a1a2e]">
                    {staffData.length} Total
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {departmentStats.map((stat, i) => (
                    <StatsPill key={i} icon={stat.icon} value={stat.value} label={stat.label} />
                  ))}
                </div>

                <p className="mt-4 text-xs leading-relaxed text-white/45">
                  {`${staffData.length} dedicated professionals shaping the future`}
                </p>
              </div>
            ) : (
              <p className="max-w-md text-sm text-white/50">
                Discovering our talented educators...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Top Filter Bar ── */}
      <div className="sticky top-[92px] z-20 border-b border-slate-100 bg-slate-50/88 backdrop-blur-sm lg:top-[73px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          {/* Hierarchy Tabs */}
          <div className="flex items-center gap-1.5 py-3 overflow-x-auto scrollbar-hide -mx-1 px-1">
            {[
              { key: 'all', label: 'All Staff', Icon: FiUsers, count: staffData.length },
              { key: 'leadership', label: 'Leadership', Icon: FiShield, count: staffByHierarchy.leadership?.length || 0 },
              { key: 'teaching', label: 'Teaching', Icon: FiBookOpen, count: staffByHierarchy.teaching?.length || 0 },
              { key: 'support', label: 'Support', Icon: FiSettings, count: staffByHierarchy.support?.length || 0 },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setSelectedHierarchy(item.key)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-semibold transition-all ${
                  selectedHierarchy === item.key
                    ? 'bg-[#1a1a2e] text-white shadow-sm'
                    : 'text-slate-500 hover:bg-white hover:text-slate-700 hover:shadow-sm'
                }`}
              >
                <item.Icon size={13} />
                <span className="whitespace-nowrap">{item.label}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                  selectedHierarchy === item.key ? 'bg-white/15' : 'bg-slate-200/60'
                }`}>
                  {item.count}
                </span>
              </button>
            ))}

            {/* Divider */}
            <div className="w-px h-6 bg-slate-200 mx-2 flex-shrink-0" />

            {/* Department Pills */}
            {DEPARTMENTS.map((dept) => {
              const DIcon = DEPT_ICONS[dept.id] || FiLayers;
              return (
                <button
                  key={dept.id}
                  onClick={() => toggleDept(dept.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-semibold transition-all border ${
                    selectedDepts.includes(dept.id)
                      ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                      : 'border-transparent text-slate-500 hover:bg-white hover:text-slate-700 hover:shadow-sm'
                  }`}
                >
                  <DIcon size={12} />
                  <span className="whitespace-nowrap">{dept.label}</span>
                  <span className="text-[9px] font-bold text-slate-400">{getDeptCount(dept.id)}</span>
                </button>
              );
            })}

            {/* Clear Filters */}
            {(selectedDepts.length > 0 || searchQuery || selectedHierarchy !== 'all') && (
              <>
                <div className="w-px h-5 bg-slate-200 mx-1 flex-shrink-0" />
                <button
                  onClick={clearAllFilters}
                  className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-black text-red-500 hover:bg-red-50 transition-colors uppercase tracking-wider"
                >
                  <FiX size={12} /> Clear
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {/* ── Main Content ── */}
          <main className="w-full">
            
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
              <div>
                <p className="text-sm text-slate-500">
                  {loading ? 'Loading...' : (
                    <>
                      Showing <span className="font-bold text-slate-900">{filteredStaff.length}</span> staff members
                      {filteredStaff.length !== staffData.length && (
                        <span className="text-blue-600 font-semibold"> (filtered from {staffData.length})</span>
                      )}
                    </>
                  )}
                </p>
              </div>

              <div className="relative w-full sm:w-52">
                <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                <select className="appearance-none w-full bg-white border border-slate-200 pl-8 pr-8 py-2 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-[#1a1a2e] cursor-pointer">
                  <option value="hierarchy">Hierarchy View</option>
                  <option value="alphabetical">Alphabetical (A-Z)</option>
                  <option value="department">By Department</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
              </div>
            </div>

            {/* Consultation Modal */}
            {showConsultModal && selectedStaff && (
              <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[200]"
                onClick={() => setShowConsultModal(false)}
              >
                <div 
                  className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="bg-[#1a1a2e] p-5 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                          <FiMail size={18} />
                        </div>
                        <div>
                          <h2 className="text-lg font-black">Contact {selectedStaff.name}</h2>
                          <p className="text-white/50 text-xs">{selectedStaff.position} &bull; {selectedStaff.department}</p>
                        </div>
                      </div>
                      <button onClick={() => setShowConsultModal(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <FiX size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleConsultSubmit} className="p-5 overflow-y-auto max-h-[calc(90vh-100px)] space-y-4">
                    {/* Staff Card */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#1a1a2e] rounded-lg flex items-center justify-center text-white font-black text-sm">
                        {selectedStaff.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{selectedStaff.name}</p>
                        <p className="text-[10px] text-slate-500">{selectedStaff.position} &bull; {selectedStaff.department}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={consultForm.name}
                          onChange={(e) => setConsultForm({...consultForm, name: e.target.value})}
                          className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1a1a2e] focus:ring-1 focus:ring-[#1a1a2e]/10"
                          placeholder="Full name"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Email *</label>
                        <input
                          type="email"
                          required
                          value={consultForm.email}
                          onChange={(e) => setConsultForm({...consultForm, email: e.target.value})}
                          className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1a1a2e] focus:ring-1 focus:ring-[#1a1a2e]/10"
                          placeholder="your@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Phone *</label>
                        <input
                          type="tel"
                          required
                          value={consultForm.phone}
                          onChange={(e) => setConsultForm({...consultForm, phone: e.target.value})}
                          className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1a1a2e] focus:ring-1 focus:ring-[#1a1a2e]/10"
                          placeholder="+254700000000"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Inquiry Type</label>
                        <select
                          value={consultForm.inquiryType}
                          onChange={(e) => setConsultForm({...consultForm, inquiryType: e.target.value})}
                          className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1a1a2e]"
                        >
                          <option value="general">General Inquiry</option>
                          <option value="academic">Academic Consultation</option>
                          <option value="guidance">Guidance & Counseling</option>
                          <option value="complaint">Feedback / Complaint</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Student Details (optional)</label>
                      <input
                        type="text"
                        value={consultForm.studentGrade}
                        onChange={(e) => setConsultForm({...consultForm, studentGrade: e.target.value})}
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1a1a2e] focus:ring-1 focus:ring-[#1a1a2e]/10"
                        placeholder="Student name, grade, class"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Subject *</label>
                      <input
                        type="text"
                        required
                        value={consultForm.subject}
                        onChange={(e) => setConsultForm({...consultForm, subject: e.target.value})}
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1a1a2e] focus:ring-1 focus:ring-[#1a1a2e]/10"
                        placeholder="Subject of inquiry"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Message *</label>
                      <textarea
                        required
                        rows={3}
                        value={consultForm.message}
                        onChange={(e) => setConsultForm({...consultForm, message: e.target.value})}
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1a1a2e] focus:ring-1 focus:ring-[#1a1a2e]/10 resize-none"
                        placeholder="Your message..."
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Preferred Contact</label>
                      <div className="flex gap-4">
                        {['email', 'phone', 'whatsapp'].map(method => (
                          <label key={method} className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="contactMethod"
                              value={method}
                              checked={consultForm.contactMethod === method}
                              onChange={(e) => setConsultForm({...consultForm, contactMethod: e.target.value})}
                              className="w-3.5 h-3.5 text-[#1a1a2e]"
                            />
                            <span className="text-xs font-semibold text-slate-600 capitalize">{method}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowConsultModal(false)}
                        className="flex-1 py-2.5 bg-slate-50 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-100 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 py-2.5 bg-[#1a1a2e] text-white rounded-lg font-bold text-sm hover:bg-[#2d2d44] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <FiMail size={14} /> Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Content */}
            {loading ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
                {[...Array(6)].map((_, i) => (
                  <StaffSkeleton key={i} viewMode={viewMode} />
                ))}
              </div>
            ) : filteredStaff.length > 0 ? (
              <>
                {selectedHierarchy === 'all' ? (
                  <div className="space-y-6">
                    <HierarchySection title="School Leadership" iconKey="leadership" staff={staffByHierarchy.leadership} viewMode={viewMode} isFirst={true} onContactClick={handleContactClick} />
                    <HierarchySection title="Teaching Staff" iconKey="teaching" staff={staffByHierarchy.teaching} viewMode={viewMode} onContactClick={handleContactClick} />
                    <HierarchySection title="Support Staff" iconKey="support" staff={staffByHierarchy.support} viewMode={viewMode} onContactClick={handleContactClick} />
                  </div>
                ) : viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {paginatedStaff.map((staff) => (
                      <StaffCard key={staff.id} staff={staff} onContactClick={handleContactClick} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {paginatedStaff.map((staff) => (
                      <StaffListCard key={staff.id} staff={staff} onContactClick={handleContactClick} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && selectedHierarchy !== 'all' && (
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 pt-5">
                    <p className="text-xs text-slate-400">
                      Page <span className="font-bold text-slate-900">{currentPage}</span> of <span className="font-bold text-slate-900">{totalPages}</span>
                      <span className="text-blue-600 ml-2">&bull; {filteredStaff.length} total</span>
                    </p>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 disabled:opacity-40 flex items-center gap-1 hover:border-slate-300 transition-colors"
                      >
                        <FiArrowLeft size={12} /> <span className="hidden sm:inline">Prev</span>
                      </button>
                      
                      {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                        let pageNum = i + 1;
                        if (totalPages > 3 && currentPage > 2) pageNum = currentPage - 1 + i;
                        if (pageNum > totalPages) return null;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                              currentPage === pageNum ? 'bg-[#1a1a2e] text-white' : 'text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 disabled:opacity-40 flex items-center gap-1 hover:border-slate-300 transition-colors"
                      >
                        <span className="hidden sm:inline">Next</span> <FiArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <FiSearch className="text-xl text-slate-300" />
                </div>
                <h3 className="text-base font-black text-slate-900 mb-1">No staff found</h3>
                <p className="text-sm text-slate-400 max-w-sm mb-5">Try adjusting your search or filters.</p>
                <button
                  onClick={clearAllFilters}
                  className="px-5 py-2 bg-[#1a1a2e] text-white rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-[#2d2d44] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </main>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-100 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <Image src="/seo/MatG.png" alt="Logo" width={24} height={24} className="opacity-40" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Matungulu Girls Senior School</span>
            </div>
            <p className="text-[10px] text-slate-300">Strive to Excel &bull; Staff Directory &bull; &copy; {new Date().getFullYear()}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
