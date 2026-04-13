'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import Head from 'next/head'; // IMPORTANT: Add this import
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiStar, 
  FiBook, 
  FiTarget, 
  FiUsers,
  FiCalendar,
  FiArrowLeft,
  FiShare2,
  FiPrinter,
  FiAward,
  FiBriefcase,
  FiTool,
  FiCheckCircle,
  FiActivity,
  FiGlobe,
  FiHome,
  FiX,
} from 'react-icons/fi';
import { SiGmail } from 'react-icons/si';
import { FaGraduationCap, FaChalkboardTeacher, FaUserTie, FaWhatsapp, FaFacebook, FaInstagram } from 'react-icons/fa';

export default function StaffProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  // School description
  const schoolDescription = "Matungulu Girls Senior School provides exceptional education through trained professionals dedicated to holistic student development and academic excellence.";

  // In the transformStaffData function, update the image handling:
  const transformStaffData = (apiData) => {
    if (!apiData) return null;
    
    // Ensure arrays exist
    const expertise = Array.isArray(apiData.expertise) ? apiData.expertise : [];
    const responsibilities = Array.isArray(apiData.responsibilities) ? apiData.responsibilities : [];
    const achievements = Array.isArray(apiData.achievements) ? apiData.achievements : [];
    
    // Generate skills safely
    const skills = expertise.slice(0, 4).map((skill, index) => ({
      name: skill || `Skill ${index + 1}`,
      level: 75 + (index * 5)
    }));

    // FIXED: Proper image URL handling
    const getImageUrl = (imagePath) => {
      if (!imagePath || typeof imagePath !== 'string') {
        return '/male.png'; // Default fallback
      }
      
      // Handle Cloudinary URLs
      if (imagePath.includes('cloudinary.com')) {
        return imagePath;
      }
      
      // Handle local paths that already start with /
      if (imagePath.startsWith('/')) {
        return imagePath;
      }
      
      // Handle external URLs
      if (imagePath.startsWith('http')) {
        return imagePath;
      }
      
      // Handle base64 images
      if (imagePath.startsWith('data:image')) {
        return imagePath;
      }
      
      // If it's just a filename, return as is (Next.js will handle it from public folder)
      return imagePath;
    };

    return {
      id: apiData.id || 'unknown',
      name: apiData.name || 'Professional Educator',
      position: apiData.position || 'Dedicated Teacher',
      department: apiData.department || 'Academic Department',
      email: apiData.email || '',
      phone: apiData.phone || '',
      image: getImageUrl(apiData.image), // Use the helper function
      bio: apiData.bio || `A committed educator at Matungulu Girls Senior School with a passion for student success and educational excellence.`,
      expertise: expertise,
      responsibilities: responsibilities,
      achievements: achievements,
      quote: apiData.quote || 'Education is the most powerful weapon which you can use to change the world.',
      joinDate: apiData.joinDate
        ? new Date(apiData.joinDate).getFullYear().toString() 
        : '2020',
      officeHours: 'Monday - Friday: 8:00 AM - 4:00 PM',
      location: apiData.department ? `${apiData.department} Department` : 'Main Academic Building',
      skills: skills.length > 0 ? skills : [
        { name: 'Pedagogy', level: 92 },
        { name: 'Curriculum', level: 85 },
        { name: 'Mentorship', level: 88 },
        { name: 'Tech Skills', level: 80 }
      ]
    };
  };

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/SchoolTeam/${id}`);
        
        if (!response.ok) {
          throw new Error(`Staff member not available (${response.status})`);
        }
        
        const data = await response.json();
        
        if (data.success && data.staff) {
          const transformedData = transformStaffData(data.staff);
          setStaff(transformedData);
        } else {
          throw new Error('Unable to load staff information');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchStaffData();
  }, [id]);

  // ================ FIXED SEO HEAD COMPONENT ================
  // This now properly uses Next.js Head component for all metadata
  const SeoHead = () => {
    if (!staff) return null;
    
    const fullName = staff.name;
    const position = staff.position;
    const department = staff.department;
    const schoolName = "Matungulu Girls Senior School";
    
    // Create multiple name variations for better searchability
    const firstName = fullName.split(' ')[0];
    const lastName = fullName.split(' ').slice(1).join(' ');
    
    // Keywords for better SEO - including variations of the teacher's name and school
    const keywords = [
      fullName,
      `${firstName} ${lastName}`,
      `${lastName} ${firstName}`,
      position,
      department,
      `${fullName} ${schoolName}`,
      `${fullName} teacher`,
      `${fullName} profile`,
      `${department} teacher`,
      `${schoolName} staff`,
      `${schoolName} teachers`,
      `${schoolName} faculty`,
      `teacher at Matungulu Girls`,
      `Matungulu GirlsHigh School staff`,
      ` Matungulu Girlsteachers`,
      `MatG teachers`,
      ...staff.expertise || []
    ].filter(Boolean).join(', ');
    
    // Create a rich description
    const description = staff.bio || 
      `Meet ${fullName}, ${position} in the ${department} at ${schoolName}. ` +
      `Experienced educator specializing in ${staff.expertise?.slice(0, 3).join(', ') || 'education'}. ` +
      `View full profile, qualifications, and contact information.`;
    
    const profileUrl = `https://kinyui-senior.vercel.app/pages/SchoolTeam/${id}`;
    const imageUrl = staff.image?.startsWith('http') ? staff.image : `https://kinyui-senior.vercel.app${staff.image}`;
    
    return (
      <Head>
        {/* Basic Meta Tags */}
        <title>{`${fullName} - ${position} at Matungulu Girls Senior School`}</title>
        <meta name="title" content={`${fullName} - ${position} | Matungulu Girls Senior School Faculty`} />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={schoolName} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={profileUrl} />
        
        {/* Open Graph / Facebook / WhatsApp */}
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={profileUrl} />
        <meta property="og:title" content={`${fullName} - ${position} at ${schoolName}`} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content={schoolName} />
        <meta property="og:locale" content="en_KE" />
        
        {/* Profile-specific Open Graph tags */}
        <meta property="profile:first_name" content={firstName} />
        <meta property="profile:last_name" content={lastName} />
        <meta property="profile:username" content={id} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${fullName} - ${position} at ${schoolName}`} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
        <meta name="twitter:site" content="@Matungulu GirlsHS" />
        <meta name="twitter:creator" content={schoolName} />
        
        {/* Robots - Allow indexing */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
        
        {/* JSON-LD Structured Data for Google Rich Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": fullName,
              "givenName": firstName,
              "familyName": lastName,
              "jobTitle": position,
              "worksFor": {
                "@type": "EducationalOrganization",
                "name": schoolName,
                "alternateName": ["Matungulu GirlsHigh School", "SA Matungulu Girls", "Katz School"],
                "description": schoolDescription,
                "url": "https://kinyui-senior.vercel.app",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Matungulu",
                  "addressRegion": "Machakos County",
                  "addressCountry": "KE"
                }
              },
              "description": description,
              "url": profileUrl,
              "image": imageUrl,
              "email": staff.email,
              "telephone": staff.phone,
              "knowsAbout": staff.expertise,
              "hasOccupation": {
                "@type": "Occupation",
                "name": position,
                "occupationalCategory": "Education",
                "responsibilities": staff.responsibilities
              },
              "alumniOf": staff.achievements,
              "memberOf": {
                "@type": "OrganizationRole",
                "member": {
                  "@type": "EducationalOrganization",
                  "name": `${department} Department`
                },
                "startDate": staff.joinDate
              },
              "sameAs": [
                profileUrl,
                `https://kinyui-senior.vercel.app/pages/SchoolTeam`
              ]
            })
          }}
        />
        
        {/* Additional Schema for Breadcrumbs */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://kinyui-senior.vercel.app"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Staff Directory",
                  "item": "https://kinyui-senior.vercel.app/pages/SchoolTeam"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": fullName,
                  "item": profileUrl
                }
              ]
            })
          }}
        />
      </Head>
    );
  };

  const ShareModal = () => {
    const [copied, setCopied] = useState(false);
    if (!showShareModal || !staff) return null;
  
    const profileUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `Check out ${staff.name}'s profile - ${staff.position} at Matungulu Girls Senior School `;
    
    const handleCopy = async () => {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
  
    const channels = [
      { 
        name: 'WhatsApp', 
        icon: <FaWhatsapp size={20} />, 
        color: '#25D366',
        link: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + profileUrl)}` 
      },
      { 
        name: 'Facebook', 
        icon: <FaFacebook size={20} />, 
        color: '#1877F2',
        link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}` 
      },
      { 
        name: 'Instagram', 
        icon: <FaInstagram size={20} />, 
        color: '#E4405F',
        action: handleCopy 
      },
    ];
  
    return (
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowShareModal(false)} />
        
        {/* Modal — slides up on mobile, centered on desktop */}
        <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl">
          
          {/* Profile preview strip */}
          <div className="bg-[#1a1a2e] px-6 pt-6 pb-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[9px] font-semibold text-white/30 uppercase tracking-[0.2em]">Share Profile</span>
              <button 
                onClick={() => setShowShareModal(false)} 
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-all"
              >
                <FiX size={14} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-white/10 ring-2 ring-white/10 shrink-0">
                <Image
                  src={staff.image || '/male.png'}
                  alt={staff.name}
                  width={44}
                  height={44}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-white truncate">{staff.name}</h3>
                <p className="text-[11px] text-white/40 font-medium">{staff.position} &bull; {staff.department}</p>
              </div>
            </div>
          </div>

          {/* Share channels — horizontal row */}
          <div className="px-6 py-5">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Share via</p>
            <div className="flex items-center gap-3">
              {channels.map((ch) => (
                <a
                  key={ch.name}
                  href={ch.link || '#'}
                  target={ch.link ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  onClick={ch.action}
                  className="group flex-1 flex flex-col items-center gap-2 py-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div 
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: ch.color }}
                  >
                    {ch.icon}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 group-hover:text-slate-700 transition-colors">{ch.name}</span>
                </a>
              ))}
              
              {/* Copy link as a channel */}
              <button
                onClick={handleCopy}
                className="group flex-1 flex flex-col items-center gap-2 py-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all cursor-pointer"
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-all ${
                  copied ? 'bg-emerald-500 text-white' : 'bg-[#1a1a2e] text-white'
                }`}>
                  {copied ? <FiCheckCircle size={18} /> : <FiShare2 size={18} />}
                </div>
                <span className="text-[10px] font-semibold text-slate-500 group-hover:text-slate-700 transition-colors">
                  {copied ? 'Copied!' : 'Copy'}
                </span>
              </button>
            </div>
          </div>

          {/* URL row */}
          <div className="px-6 pb-6">
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-1.5 border border-slate-100">
              <div className="flex-1 min-w-0 px-3">
                <p className="text-[11px] font-medium text-slate-400 truncate">{profileUrl}</p>
              </div>
              <button
                onClick={handleCopy}
                className={`shrink-0 px-4 py-2 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all ${
                  copied 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-[#1a1a2e] text-white hover:bg-[#2d2d44]'
                }`}
              >
                {copied ? 'Copied' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="relative mb-10">
          <div className="w-16 h-16 border-[3px] border-slate-200 border-t-[#1a1a2e] rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Image src="/seo/kinyui.png" alt="Logo" width={28} height={28} className="opacity-60" />
          </div>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Loading Profile</p>
      </div>
    );
  }
  
  if (error || !staff) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-red-100">
            <FaUserTie className="text-xl text-red-500" />
          </div>
          <h2 className="text-lg font-black text-slate-900 mb-2">Profile Unavailable</h2>
          <p className="text-sm text-slate-500 mb-6">
            We couldn&apos;t load this staff member&apos;s profile.
          </p>
          <button 
            onClick={() => router.push('/pages/SchoolTeam')}
            className="bg-[#1a1a2e] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-[#2d2d44] transition-colors w-full"
          >
            Return to Staff Directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SeoHead />
      <div className="min-h-screen bg-white font-sans">

        {/* ── Sticky Top Bar ── */}
        <div className="bg-white border-b border-slate-100 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <button
              onClick={() => router.push('/pages/SchoolTeam')}
              className="flex items-center gap-2 text-slate-600 hover:text-[#1a1a2e] transition-colors"
            >
              <FiArrowLeft size={18} />
              <span className="text-sm font-bold hidden sm:inline">Staff Directory</span>
            </button>

            <div className="flex items-center gap-2">
              <Image src="/seo/kinyui.png" alt="Logo" width={24} height={24} />
              <span className="text-sm font-black text-[#1a1a2e] hidden sm:inline">Matungulu Girls Senior School</span>
            </div>

            <div className="flex gap-1.5">
              <button 
                onClick={() => setShowShareModal(true)}
                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#1a1a2e] hover:border-slate-300 transition-all"
              >
                <FiShare2 size={15} />
              </button>
              <button 
                onClick={() => window.print()}
                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#1a1a2e] hover:border-slate-300 transition-all"
              >
                <FiPrinter size={15} />
              </button>
            </div>
          </div>
        </div>
        
        {/* ── Hero Section: Full-width dark banner ── */}
        <div className="relative bg-[#1a1a2e] overflow-hidden">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16 relative z-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 sm:gap-8">
              {/* Profile Image */}
              <div className="relative shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-36 lg:h-36 rounded-2xl border-[3px] border-white/20 overflow-hidden bg-white/10 shadow-2xl">
                  <Image
                    src={staff.image || '/male.png'}
                    alt={staff.name}
                    width={144}
                    height={144}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                <div className="absolute -bottom-1 -right-1">
                  <span className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-[#1a1a2e]"></span>
                  </span>
                </div>
              </div>

              {/* Name & Meta */}
              <div className="text-center sm:text-left flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                  <span className="px-2.5 py-0.5 bg-white/10 border border-white/10 rounded text-[10px] font-black text-white/70 uppercase tracking-widest">
                    {staff.department}
                  </span>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-400/20 rounded text-[10px] font-black text-emerald-300 uppercase tracking-widest">
                    Since {staff.joinDate}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                  {staff.name}
                </h1>
                <p className="text-sm sm:text-base text-blue-300/80 font-semibold mt-1">{staff.position}</p>
                
                {/* Quick contact row */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4">
                  {staff.email && (
                    <a href={`mailto:${staff.email}`} className="flex items-center gap-1.5 text-white/50 hover:text-white text-xs transition-colors">
                      <FiMail size={13} />
                      <span className="hidden md:inline">{staff.email}</span>
                      <span className="md:hidden">Email</span>
                    </a>
                  )}
                  {staff.phone && (
                    <a href={`tel:${staff.phone}`} className="flex items-center gap-1.5 text-white/50 hover:text-white text-xs transition-colors">
                      <FiPhone size={13} />
                      <span className="hidden md:inline">{staff.phone}</span>
                      <span className="md:hidden">Call</span>
                    </a>
                  )}
                  <span className="flex items-center gap-1.5 text-white/40 text-xs">
                    <FiMapPin size={13} />
                    <span className="hidden md:inline">{staff.location}</span>
                    <span className="md:hidden">{staff.department}</span>
                  </span>
                </div>
              </div>

              {/* Action buttons - desktop */}
              <div className="hidden lg:flex gap-2 shrink-0">
                {staff.email && (
                  <a href={`mailto:${staff.email}`} className="px-4 py-2.5 bg-white text-[#1a1a2e] rounded-lg text-xs font-black uppercase tracking-wider hover:bg-blue-50 transition-colors flex items-center gap-2">
                    <FiMail size={14} /> Contact
                  </a>
                )}
                <button onClick={() => setShowShareModal(true)} className="px-4 py-2.5 bg-white/10 text-white border border-white/10 rounded-lg text-xs font-black uppercase tracking-wider hover:bg-white/20 transition-colors flex items-center gap-2">
                  <FiShare2 size={14} /> Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats Strip ── */}
        <div className="border-b border-slate-100 bg-slate-50/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-4 divide-x divide-slate-200">
              {[
                { icon: FiCalendar, label: 'Joined', value: staff.joinDate, color: 'text-blue-600' },
                { icon: FiStar, label: 'Expertise', value: staff.expertise?.length || 0, color: 'text-purple-600' },
                { icon: FiBriefcase, label: 'Roles', value: staff.responsibilities?.length || 0, color: 'text-emerald-600' },
                { icon: FiAward, label: 'Awards', value: staff.achievements?.length || 0, color: 'text-amber-600' },
              ].map((stat, i) => (
                <div key={i} className="py-4 sm:py-5 flex flex-col items-center text-center">
                  <stat.icon className={`${stat.color} mb-1`} size={16} />
                  <p className="text-lg sm:text-xl font-black text-slate-900">{stat.value}</p>
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main Content ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

            {/* ── Left Sidebar (1 col) ── */}
            <div className="lg:col-span-1 space-y-6">

              {/* Quote */}
              {staff.quote && (
                <div className="relative bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <span className="absolute -top-3 left-4 text-4xl text-[#1a1a2e]/10 font-serif leading-none">&ldquo;</span>
                  <p className="text-sm text-slate-600 italic leading-relaxed pt-2">
                    {staff.quote}
                  </p>
                </div>
              )}

              {/* Areas of Expertise */}
              {staff.expertise?.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                    <div className="w-5 h-0.5 bg-blue-500 rounded-full" />
                    Expertise
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {staff.expertise.map((item, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Professional Skills */}
              {staff.skills && staff.skills.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                    <div className="w-5 h-0.5 bg-purple-500 rounded-full" />
                    Skills
                  </h3>
                  <div className="space-y-2">
                    {staff.skills.slice(0, 4).map((skill, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-700 flex-1">{skill.name}</span>
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-500 rounded-full transition-all duration-700"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Office Info Card */}
              <div className="bg-[#1a1a2e] rounded-xl p-5 text-white/80">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">Office Details</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <FiMapPin size={14} className="text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-white/40 uppercase">Location</p>
                      <p className="text-xs font-semibold text-white/90">{staff.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FiCalendar size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-white/40 uppercase">Office Hours</p>
                      <p className="text-xs font-semibold text-white/90">{staff.officeHours}</p>
                    </div>
                  </div>
                  {staff.email && (
                    <div className="flex items-start gap-3">
                      <FiMail size={14} className="text-amber-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-white/40 uppercase">Email</p>
                        <a href={`mailto:${staff.email}`} className="text-xs font-semibold text-white/90 hover:text-white break-all">{staff.email}</a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Right Content (2 cols) ── */}
            <div className="lg:col-span-2 space-y-8">

              {/* Bio Section */}
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <div className="w-5 h-0.5 bg-slate-400 rounded-full" />
                  About
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {staff.bio}
                </p>
              </div>

              {/* Responsibilities */}
              {staff.responsibilities?.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <div className="w-5 h-0.5 bg-emerald-500 rounded-full" />
                    Key Responsibilities
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {staff.responsibilities.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group">
                        <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 shrink-0 mt-0.5 group-hover:bg-emerald-200 transition-colors">
                          <FiCheckCircle size={12} />
                        </div>
                        <span className="text-xs sm:text-sm text-slate-700 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements */}
              {staff.achievements?.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <div className="w-5 h-0.5 bg-amber-500 rounded-full" />
                    Notable Achievements
                  </h3>
                  <div className="space-y-2.5">
                    {staff.achievements.map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 sm:p-4 bg-white border border-slate-100 rounded-xl hover:border-amber-200 hover:shadow-sm transition-all group">
                        <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center border border-amber-100 group-hover:bg-amber-100 transition-colors shrink-0">
                          <FiAward size={14} className="text-amber-600" />
                        </div>
                        <span className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="border-t border-slate-100 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <Image src="/seo/kinyui.png" alt="Logo" width={28} height={28} className="opacity-50" />
                <span className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">
                  Matungulu Girls Senior School
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-slate-300">
                <span>Soaring to Excellence</span>
                <span className="w-1 h-1 rounded-full bg-slate-200" />
                <span>Staff Directory</span>
                <span className="w-1 h-1 rounded-full bg-slate-200" />
                <span>&copy; {new Date().getFullYear()}</span>
              </div>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="mt-2 px-5 py-1.5 rounded-full border border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:bg-[#1a1a2e] hover:text-white hover:border-[#1a1a2e] transition-all"
              >
                Back to Top
              </button>
            </div>
          </div>
        </footer>
      </div>
  
      {/* Share Modal */}
      <ShareModal />
    </>
  );
}