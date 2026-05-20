'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  FiActivity,
  FiAward,
  FiBook,
  FiBookOpen,
  FiBriefcase,
  FiCalendar,
  FiChevronDown,
  FiChevronRight,
  FiDollarSign,
  FiExternalLink,
  FiFileText,
  FiGrid,
  FiHeart,
  FiHome,
  FiImage,
  FiInfo,
  FiLayers,
  FiLock,
  FiMail,
  FiMenu,
  FiPhone,
  FiShield,
  FiTrendingUp,
  FiUsers,
  FiX,
} from 'react-icons/fi';

const primaryLinks = [
  { name: 'Home', href: '/', icon: FiHome, exact: true },
  { name: 'About', href: '/pages/AboutUs', icon: FiInfo },
  { name: 'Admissions', href: '/pages/admissions', icon: FiBookOpen },
  { name: 'Gallery', href: '/pages/gallery', icon: FiImage },
  { name: 'KCSE Performance', href: '/pages/KCSE-Performance', icon: FiTrendingUp },
  { name: 'Events & News', href: '/pages/eventsandnews', icon: FiCalendar },
];

const utilityLinks = [
  { name: 'Student Portal', href: '/pages/StudentPortal', icon: FiFileText },
  { name: 'School Fees', href: '/pages/School Fees', icon: FiDollarSign },
  { name: 'Contact', href: '/pages/contact', icon: FiPhone },
  { name: 'Admin Login', href: '/pages/adminLogin', icon: FiLock, secure: true },
];

const academicLinks = [
  {
    name: 'Staff Directory',
    href: '/pages/SchoolTeam',
    icon: FiUsers,
    description: 'Leadership profiles and department groups',
  },
  {
    name: 'Departments',
    href: '/pages/Departments',
    icon: FiLayers,
    description: 'CBC, 8-4-4, teaching and support departments',
  },
  {
    name: 'Guidance & Counselling',
    href: '/pages/Guidance-and-Councelling',
    icon: FiHeart,
    description: 'Student wellness and counselling services',
  },
  {
    name: 'Achievements',
    href: '/pages/Achievements',
    icon: FiAward,
    description: 'Academic, arts, sports and leadership milestones',
  },
  {
    name: 'School Magazine',
    href: '/pages/School Magazine',
    icon: FiBookOpen,
    description: 'School publications and newsletters',
  },
  {
    name: 'School Rules',
    href: '/pages/School Policies',
    icon: FiShield,
    description: 'Policies, rules and student expectations',
  },
  {
    name: 'Zeraki Analytics',
    href: 'https://analytics.zeraki.app/',
    icon: FiExternalLink,
    description: 'External analytics platform',
    external: true,
  },
];

const schoolHubLinks = [
  {
    name: 'Clubs',
    href: '/pages/Clubs',
    icon: FiUsers,
    description: 'Co-curricular clubs and student interests',
  },
  {
    name: 'Societies & Student Council',
    href: '/pages/Societies',
    icon: FiHeart,
    description: 'Societies, service groups and student leadership',
  },
  {
    name: 'Boarding & Computer Lab',
    href: '/pages/Boarding',
    icon: FiHome,
    description: 'Boarding life, ICT spaces and digital learning',
  },
  {
    name: 'Farm',
    href: '/pages/Farm',
    icon: FiActivity,
    description: 'Farm projects and practical learning',
  },
  {
    name: 'Security',
    href: '/pages/Security',
    icon: FiShield,
    description: 'Safety measures and security information',
  },
  {
    name: 'Careers',
    href: '/pages/careers',
    icon: FiBriefcase,
    description: 'Opportunities at Matungulu Girls',
  },
  {
    name: 'Alumni',
    href: 'https://www.facebook.com/groups/53636547389',
    icon: FiExternalLink,
    description: 'Connect with fellow alumnae',
    external: true,
  },
];

const navGroups = [
  { id: 'academics', label: 'Academics', icon: FiBook, links: academicLinks },
  { id: 'schoolHub', label: 'School Hub', icon: FiGrid, links: schoolHubLinks },
];

const normalizeHref = (href) => {
  if (!href || !href.startsWith('/')) return '';
  return href.split('#')[0].split('?')[0];
};

export default function ModernNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const isActiveLink = (href, exact = false) => {
    const normalizedHref = normalizeHref(href);
    if (!pathname || !normalizedHref) return false;
    if (normalizedHref === '/') return pathname === '/';
    return exact ? pathname === normalizedHref : pathname.startsWith(normalizedHref);
  };

  const isGroupActive = (links) => links.some((link) => isActiveLink(link.href));

  const closeAll = () => {
    setIsOpen(false);
    setActiveDropdown(null);
  };

  const NavLink = ({ item, compact = false }) => {
    const Icon = item.icon;
    const active = isActiveLink(item.href, item.exact);
    const externalProps = item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {};

    return (
      <a
        href={item.href}
        onClick={closeAll}
        className={`group inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-extrabold transition-all ${
          active
            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
            : compact
              ? 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'
              : 'border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-50'
        }`}
        {...externalProps}
      >
        <Icon className="shrink-0 text-sm" />
        <span className="whitespace-nowrap">{item.name}</span>
        {item.external && <FiExternalLink className="text-[11px] opacity-60" />}
      </a>
    );
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          isScrolled ? 'shadow-xl shadow-slate-950/10' : 'shadow-lg shadow-slate-950/5'
        }`}
      >
        <div className="hidden border-b border-white/10 bg-[#0b3b35] text-white lg:block">
          <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-6">
            <div className="flex items-center gap-5 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-100/80">
              <span>Matungulu Girls Senior School</span>
              <span className="h-1 w-1 rounded-full bg-emerald-300" />
              <span>Committed to Excellence</span>
            </div>

            <div className="flex items-center gap-2">
              {utilityLinks.map((item) => (
                <NavLink key={item.name} item={item} compact />
              ))}
            </div>
          </div>
        </div>

        <div className="border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
          <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
            <a href="/" onClick={closeAll} className="flex min-w-0 items-center gap-3">
              <div className="h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-amber-400 p-[1px] shadow-lg">
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white">
                  <Image
                    src="/MatG.jpg"
                    alt="Matungulu Girls Senior School Logo"
                    width={34}
                    height={34}
                    className="rounded-xl object-cover"
                    priority
                  />
                </div>
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-black tracking-tight text-slate-950 sm:text-lg">
                  MatG
                </p>
                <p className="truncate text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 sm:text-[11px]">
                  Matungulu Girls
                </p>
              </div>
            </a>

            <div className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex">
              {primaryLinks.map((item) => (
                <NavLink key={item.name} item={item} />
              ))}

              {navGroups.map((group) => {
                const Icon = group.icon;
                const open = activeDropdown === group.id;
                const active = isGroupActive(group.links);

                return (
                  <div
                    key={group.id}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(group.id)}
                  >
                    <button
                      onClick={() => setActiveDropdown(open ? null : group.id)}
                      className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-extrabold transition-all ${
                        open || active
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                          : 'border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-50'
                      }`}
                      aria-expanded={open}
                      aria-haspopup="true"
                    >
                      <Icon className="text-sm" />
                      <span>{group.label}</span>
                      <FiChevronDown className={`text-xs transition-transform ${open ? 'rotate-180' : ''}`} />
                    </button>

                    {open && (
                      <div
                        className="absolute left-1/2 top-full z-50 mt-3 w-[540px] -translate-x-1/2 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl shadow-slate-950/15"
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        <div className="bg-gradient-to-br from-[#0f5b4c] to-[#0d3f39] px-5 py-4 text-white">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                              <Icon />
                            </div>
                            <div>
                              <h3 className="text-sm font-black uppercase tracking-[0.18em]">
                                {group.label}
                              </h3>
                              <p className="mt-1 text-xs font-semibold text-white/60">
                                Organized links for quick navigation
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 p-3">
                          {group.links.map((item) => {
                            const LinkIcon = item.icon;
                            const itemActive = isActiveLink(item.href);
                            const externalProps = item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {};

                            return (
                              <a
                                key={item.name}
                                href={item.href}
                                onClick={closeAll}
                                className={`group/link flex items-start gap-3 rounded-2xl p-3 transition-all ${
                                  itemActive ? 'bg-emerald-50' : 'hover:bg-slate-50'
                                }`}
                                {...externalProps}
                              >
                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                                  itemActive
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-slate-100 text-slate-600 group-hover/link:bg-emerald-100 group-hover/link:text-emerald-700'
                                }`}>
                                  <LinkIcon />
                                </div>
                                <div className="min-w-0">
                                  <p className={`text-sm font-black ${itemActive ? 'text-emerald-900' : 'text-slate-900'}`}>
                                    {item.name}
                                  </p>
                                  <p className="mt-0.5 line-clamp-2 text-xs font-semibold leading-5 text-slate-500">
                                    {item.description}
                                  </p>
                                </div>
                                <FiChevronRight className="ml-auto mt-3 shrink-0 text-xs text-slate-300 opacity-0 transition group-hover/link:opacity-100" />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <a
              href="/pages/StudentPortal"
              className="hidden rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white shadow-lg transition hover:bg-slate-800 xl:inline-flex"
            >
              Portal
            </a>

            <button
              onClick={() => setIsOpen((value) => !value)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-950 shadow-sm lg:hidden"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="max-h-[calc(100vh-72px)] overflow-y-auto border-b border-slate-200 bg-white shadow-2xl lg:hidden">
            <div className="space-y-5 px-4 py-5 sm:px-6">
              <div className="grid grid-cols-2 gap-2">
                {utilityLinks.map((item) => (
                  <NavLink key={item.name} item={item} />
                ))}
              </div>

              <MobileSection title="Main Navigation" links={primaryLinks} isActiveLink={isActiveLink} onClose={closeAll} />
              <MobileSection title="Academics" links={academicLinks} isActiveLink={isActiveLink} onClose={closeAll} />
              <MobileSection title="School Hub" links={schoolHubLinks} isActiveLink={isActiveLink} onClose={closeAll} />

              <div className="rounded-[24px] bg-gradient-to-br from-[#0f5b4c] to-[#0d3f39] p-4 text-center text-white">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-100/80">
                  The Champions
                </p>
                <p className="mt-1 text-sm font-semibold text-white/65">
                  Committed to Excellence
                </p>
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="h-[72px] lg:h-[112px]" />
    </>
  );
}

function MobileSection({ title, links, isActiveLink, onClose }) {
  return (
    <section>
      <div className="mb-2 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <h2 className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
          {title}
        </h2>
      </div>
      <div className="space-y-2">
        {links.map((item) => {
          const Icon = item.icon;
          const active = isActiveLink(item.href, item.exact);
          const externalProps = item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {};

          return (
            <a
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-2xl border p-3 transition-all ${
                active
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                  : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
              }`}
              {...externalProps}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
              }`}>
                <Icon />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black">{item.name}</p>
                {item.description && (
                  <p className="mt-0.5 line-clamp-1 text-xs font-semibold text-slate-500">
                    {item.description}
                  </p>
                )}
              </div>
              {item.external ? <FiExternalLink className="text-xs text-slate-400" /> : <FiChevronRight className="text-xs text-slate-400" />}
            </a>
          );
        })}
      </div>
    </section>
  );
}
