'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import Head from 'next/head';
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiStar,
  FiCalendar,
  FiArrowLeft,
  FiShare2,
  FiPrinter,
  FiAward,
  FiBriefcase,
  FiCheckCircle,
  FiX,
} from 'react-icons/fi';
import { FaUserTie, FaWhatsapp, FaFacebook, FaInstagram } from 'react-icons/fa';

export default function StaffProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const schoolDescription =
    'Matungulu Girls Senior School provides exceptional education through trained professionals dedicated to holistic student development and academic excellence.';

  const transformStaffData = (apiData) => {
    if (!apiData) return null;

    const expertise = Array.isArray(apiData.expertise) ? apiData.expertise : [];
    const responsibilities = Array.isArray(apiData.responsibilities) ? apiData.responsibilities : [];
    const achievements = Array.isArray(apiData.achievements) ? apiData.achievements : [];

    const skills = expertise.slice(0, 4).map((skill, index) => ({
      name: skill || `Skill ${index + 1}`,
      level: 75 + index * 5,
    }));

    const getImageUrl = (imagePath) => {
      if (!imagePath || typeof imagePath !== 'string') return '/male.png';
      if (imagePath.includes('cloudinary.com')) return imagePath;
      if (imagePath.startsWith('/')) return imagePath;
      if (imagePath.startsWith('http')) return imagePath;
      if (imagePath.startsWith('data:image')) return imagePath;
      return imagePath;
    };

    return {
      id: apiData.id || 'unknown',
      name: apiData.name || 'Professional Educator',
      position: apiData.position || 'Dedicated Teacher',
      department: apiData.department || 'Academic Department',
      email: apiData.email || '',
      phone: apiData.phone || '',
      image: getImageUrl(apiData.image),
      bio:
        apiData.bio ||
        'A committed educator at Matungulu Girls Senior School with a passion for student success and educational excellence.',
      expertise,
      responsibilities,
      achievements,
      quote:
        apiData.quote ||
        'Education is the most powerful weapon which you can use to change the world.',
      joinDate: apiData.joinDate ? new Date(apiData.joinDate).getFullYear().toString() : '2020',
      officeHours: 'Monday - Friday: 8:00 AM - 4:00 PM',
      location: apiData.department ? `${apiData.department} Department` : 'Main Academic Building',
      skills:
        skills.length > 0
          ? skills
          : [
              { name: 'Pedagogy', level: 92 },
              { name: 'Curriculum', level: 85 },
              { name: 'Mentorship', level: 88 },
              { name: 'Tech Skills', level: 80 },
            ],
    };
  };

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/staff/${id}`);
        if (!response.ok) {
          throw new Error(`Staff member not available (${response.status})`);
        }

        const data = await response.json();
        if (data.success && data.staff) {
          setStaff(transformStaffData(data.staff));
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

  const SeoHead = () => {
    if (!staff) return null;

    const fullName = staff.name;
    const position = staff.position;
    const department = staff.department;
    const schoolName = 'Matungulu Girls Senior School';
    const firstName = fullName.split(' ')[0];
    const lastName = fullName.split(' ').slice(1).join(' ');
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
      'teacher at Matungulu Girls',
      'Matungulu GirlsHigh School staff',
      'Matungulu Girlsteachers',
      'MatG teachers',
      ...(staff.expertise || []),
    ]
      .filter(Boolean)
      .join(', ');

    const description =
      staff.bio ||
      `Meet ${fullName}, ${position} in the ${department} at ${schoolName}. Experienced educator specializing in ${
        staff.expertise?.slice(0, 3).join(', ') || 'education'
      }. View full profile, qualifications, and contact information.`;

    const profileUrl = `https://kinyui-senior.vercel.app/pages/SchoolTeam/${id}`;
    const imageUrl = staff.image?.startsWith('http')
      ? staff.image
      : `https://kinyui-senior.vercel.app${staff.image}`;

    return (
      <Head>
        <title>{`${fullName} - ${position} at Matungulu Girls Senior School`}</title>
        <meta name="title" content={`${fullName} - ${position} | Matungulu Girls Senior School Faculty`} />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={schoolName} />
        <link rel="canonical" href={profileUrl} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={profileUrl} />
        <meta property="og:title" content={`${fullName} - ${position} at ${schoolName}`} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content={schoolName} />
        <meta property="og:locale" content="en_KE" />
        <meta property="profile:first_name" content={firstName} />
        <meta property="profile:last_name" content={lastName} />
        <meta property="profile:username" content={id} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${fullName} - ${position} at ${schoolName}`} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
        <meta name="twitter:site" content="@MatunguluGirlsHS" />
        <meta name="twitter:creator" content={schoolName} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: fullName,
              givenName: firstName,
              familyName: lastName,
              jobTitle: position,
              worksFor: {
                '@type': 'EducationalOrganization',
                name: schoolName,
                alternateName: ['Matungulu GirlsHigh School', 'SA Matungulu Girls', 'Katz School'],
                description: schoolDescription,
                url: 'https://kinyui-senior.vercel.app',
                address: {
                  '@type': 'PostalAddress',
                  addressLocality: 'Matungulu',
                  addressRegion: 'Machakos County',
                  addressCountry: 'KE',
                },
              },
              description,
              url: profileUrl,
              image: imageUrl,
              email: staff.email,
              telephone: staff.phone,
              knowsAbout: staff.expertise,
              hasOccupation: {
                '@type': 'Occupation',
                name: position,
                occupationalCategory: 'Education',
                responsibilities: staff.responsibilities,
              },
              alumniOf: staff.achievements,
              memberOf: {
                '@type': 'OrganizationRole',
                member: {
                  '@type': 'EducationalOrganization',
                  name: `${department} Department`,
                },
                startDate: staff.joinDate,
              },
              sameAs: [profileUrl, 'https://kinyui-senior.vercel.app/pages/SchoolTeam'],
            }),
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
        link: `https://wa.me/?text=${encodeURIComponent(shareText + profileUrl)}`,
      },
      {
        name: 'Facebook',
        icon: <FaFacebook size={20} />,
        color: '#1877F2',
        link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`,
      },
      {
        name: 'Instagram',
        icon: <FaInstagram size={20} />,
        color: '#E4405F',
        action: handleCopy,
      },
    ];

    return (
      <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowShareModal(false)} />
        <div className="relative w-full overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-md sm:rounded-2xl">
          <div className="bg-[#1a1a2e] px-6 pb-5 pt-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">Share Profile</span>
              <button
                onClick={() => setShowShareModal(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/60"
              >
                <FiX size={14} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 overflow-hidden rounded-xl bg-white/10 ring-2 ring-white/10">
                <Image src={staff.image || '/male.png'} alt={staff.name} width={44} height={44} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-white">{staff.name}</h3>
                <p className="text-[11px] font-medium text-white/40">{staff.position} • {staff.department}</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-5">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Share via</p>
            <div className="flex items-center gap-3">
              {channels.map((channel) => (
                <a
                  key={channel.name}
                  href={channel.link || '#'}
                  target={channel.link ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  onClick={channel.action}
                  className="flex flex-1 cursor-pointer flex-col items-center gap-2 rounded-xl border border-slate-100 py-3"
                >
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-full text-white shadow-md"
                    style={{ backgroundColor: channel.color }}
                  >
                    {channel.icon}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500">{channel.name}</span>
                </a>
              ))}

              <button
                onClick={handleCopy}
                className="flex flex-1 cursor-pointer flex-col items-center gap-2 rounded-xl border border-slate-100 py-3"
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-full shadow-md ${copied ? 'bg-emerald-500 text-white' : 'bg-[#1a1a2e] text-white'}`}>
                  <FiShare2 size={18} />
                </div>
                <span className="text-[10px] font-semibold text-slate-500">{copied ? 'Copied!' : 'Copy'}</span>
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
          <h1 className="absolute inset-0 flex items-center justify-center text-2xl font-black text-[#1a1a2e]/80">
            Matungulu Girls Senior school
          </h1>
        </div>
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.25em]">Loading The Staff Profile</p>
      </div>
    );
  }

  if (error || !staff) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-4">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-100 bg-red-50">
            <FaUserTie className="text-xl text-red-500" />
          </div>
          <h2 className="mb-2 text-lg font-black text-slate-900">Profile Unavailable</h2>
          <p className="mb-6 text-sm text-slate-500">We couldn&apos;t load this staff member&apos;s profile.</p>
          <button
            onClick={() => router.push('/pages/SchoolTeam')}
            className="w-full rounded-lg bg-[#1a1a2e] px-6 py-2.5 text-sm font-bold text-white"
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
      <div className="min-h-screen bg-[#f4efe7] font-sans text-slate-900">
        <div className="sticky top-0 z-40 border-b border-[#d8d0c4] bg-[#f7f2ea]/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <button
              onClick={() => router.push('/pages/SchoolTeam')}
              className="flex items-center gap-2 rounded-full border border-[#d8d0c4] bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-700"
            >
              <FiArrowLeft size={15} />
              <span className="hidden sm:inline">Staff Directory</span>
            </button>

            <div className="hidden items-center gap-3 sm:flex">
              <Image src="/MatG.jpg" alt="Logo" width={28} height={28} className="rounded-full object-cover" />
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Faculty Profile</p>
                <p className="text-sm font-black text-[#172033]">Matungulu Girls Senior School</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowShareModal(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d8d0c4] bg-white text-slate-600"
              >
                <FiShare2 size={15} />
              </button>
              <button
                onClick={() => window.print()}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d8d0c4] bg-[#172033] text-white"
              >
                <FiPrinter size={15} />
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto w-[85%] px-4 py-6 sm:px-6 sm:py-8">       
<section className="px-6 py-8 text-center sm:py-10 lg:px-8">
  <div className="mx-auto w-full">
    {/* The Title */}
    <h2 className="text-lg font-black tracking-tight text-black sm:text-5xl mb-8">
      A Legacy of Excellence
    </h2>
    
    {/* The Description */}
    <p className="text-md  text-start leading-relaxed text-slate-700">
      At Matungulu Girls Senior School, our commitment to quality education 
      is a sacred promise to every student who walks through our gates. 
      We believe that educating a girl is educating a nation. By integrating 
      rigorous academic standards with strong moral values and modern learning 
      resources, we provide a nurturing environment where our girls don't 
      just study—they thrive. Our mission is to transform young learners into 
      confident, innovative, and principled global leaders who are ready to 
      excel in the competitive world of tomorrow.
    </p>
  </div>
</section>
          <section className="overflow-hidden rounded-[34px] border border-[#d9d0c3] bg-white shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
            <div className="grid lg:grid-cols-[360px_minmax(0,1fr)]">
              <div className="relative border-b border-[#d9d0c3] bg-[#3e4b66] p-5 text-white lg:border-b-0 lg:border-r lg:p-6">
                <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_top_left,rgba(215,167,61,0.3),transparent_32%)]" />
                <div className="relative">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-white/75">
                      Staff Profile
                    </span>
                    <span className="rounded-full bg-[#f2c357] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#172033]">
                      Since {staff.joinDate}
                    </span>
                  </div>

                  <div className="overflow-hidden rounded-[28px] border border-white/12 bg-white/8">
                    <div className="relative aspect-[4/5]">
                      <Image src={staff.image || '/male.png'} alt={staff.name} fill className="object-cover" priority />
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="rounded-[24px] border border-white/12 bg-white/8 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/45">Department</p>
                      <p className="mt-2 text-lg font-black text-white">{staff.department}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#fcfaf6] p-5 sm:p-7 lg:p-8">
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_280px]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#172033] px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-white">
                        {staff.position}
                      </span>
                      <span className="rounded-full border border-[#d9d0c3] bg-[#f6efe2] px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-slate-600">
                        Profile Detail
                      </span>
                    </div>

                    <h1 className="mt-4 max-w-3xl text-3xl font-black leading-[0.95] tracking-tight text-[#172033] sm:text-5xl lg:text-6xl">
                      {staff.name}
                    </h1>

                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600">{staff.bio}</p>

                    {staff.quote && (
                      <div className="mt-6 max-w-2xl rounded-[28px] border border-[#d9d0c3] bg-white p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Guiding Note</p>
                        <p className="mt-3 text-lg font-medium italic leading-relaxed text-slate-700">&ldquo;{staff.quote}&rdquo;</p>
                      </div>
                    )}
                  </div>

                  <aside className="rounded-[30px] border border-[#d9d0c3] bg-white p-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Quick File</p>
                    <div className="mt-5 space-y-4">
                      <div className="flex gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef3f8] text-[#172033]">
                          <FiMapPin size={16} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Location</p>
                          <p className="mt-1 text-sm font-bold text-slate-800">{staff.location}</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef3f8] text-[#172033]">
                          <FiCalendar size={16} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Office Hours</p>
                          <p className="mt-1 text-sm font-bold text-slate-800">{staff.officeHours}</p>
                        </div>
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            </div>
          </section>





          <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
            <div className="space-y-6">
              {staff.responsibilities?.length > 0 && (
                <div className="rounded-[30px] border border-[#d9d0c3] bg-white p-5 shadow-[0_24px_60px_-50px_rgba(15,23,42,0.45)] sm:p-6">
                  <div className="mb-6 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Practice</p>
                      <h2 className="mt-2 text-2xl font-black text-[#172033]">Key Responsibilities</h2>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#172033] text-white">
                      <FiBriefcase size={18} />
                    </div>
                  </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                    {staff.responsibilities.map((item, i) => (
                      
                      <span
                        key={i}
                        className="rounded-full border border-[#d9d0c3] bg-[#f6efe2] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate-700"
                      >
                <FiCheckCircle size={15} />

                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {staff.achievements?.length > 0 && (
                <div className="rounded-[30px] border border-[#d9d0c3] bg-[#172033] p-5 text-white shadow-[0_24px_70px_-50px_rgba(15,23,42,0.75)] sm:p-6">
                  <div className="mb-6 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/40">Recognition</p>
                      <h2 className="mt-2 text-2xl font-black text-white">Highlights & Achievements</h2>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f2c357] text-[#172033]">
                      <FiAward size={18} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {staff.achievements.map((item, i) => (
                      <div key={i} className="rounded-[24px] border border-white/10 bg-white/6 p-4">
                        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f2c357]">Achievement {String(i + 1).padStart(2, '0')}</p>
                        <p className="mt-2 text-sm font-medium leading-relaxed text-white/88">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {staff.expertise?.length > 0 && (
                <div className="rounded-[30px] border border-[#d9d0c3] bg-white p-5 shadow-[0_24px_60px_-50px_rgba(15,23,42,0.45)] sm:p-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Capability Map</p>
                  <h2 className="mt-2 text-2xl font-black text-[#172033]">Expertise Areas</h2>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {staff.expertise.map((item, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-[#d9d0c3] bg-[#f6efe2] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

          
              <div className="rounded-[30px] border border-[#d9d0c3] bg-white p-5 shadow-[0_24px_60px_-50px_rgba(15,23,42,0.35)] sm:p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Profile Summary</p>
                <h2 className="mt-2 text-2xl font-black text-[#172033]">At a Glance</h2>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[
                    { label: 'Joined', value: staff.joinDate, icon: FiCalendar },
                    { label: 'Expertise', value: staff.expertise?.length || 0, icon: FiStar },
                    { label: 'Roles', value: staff.responsibilities?.length || 0, icon: FiBriefcase },
                    { label: 'Awards', value: staff.achievements?.length || 0, icon: FiAward },
                  ].map((item, i) => (
                    <div key={i} className="rounded-[24px] border border-[#e8dfd3] bg-[#fcfaf6] p-4">
                      <item.icon size={16} className="text-[#172033]" />
                      <p className="mt-4 text-2xl font-black text-[#172033]">{item.value}</p>
                      <p className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <footer className="mt-6 rounded-[30px] border border-[#d9d0c3] bg-[#fffdfa] px-5 py-6 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Image src="/MatG.jpg" alt="Logo" width={34} height={34} className="rounded-full object-cover" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Matungulu Girls Senior School</p>
                  <p className="text-sm font-bold text-slate-700">Staff profile archive and faculty directory</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                <span>Strive to Excel</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>&copy; {new Date().getFullYear()}</span>
              </div>
            </div>
          </footer>
        </div>
      </div>

      <ShareModal />
      </>
  );
}
