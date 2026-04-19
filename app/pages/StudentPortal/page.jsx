'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Toaster, toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import StudentLoginModal from '../../components/studentloginmodel/page';
import NavigationSidebar from '../../components/studentportalcomponents/aside/page.jsx';
import ResultsView from '../../components/studentportalcomponents/result/page.jsx';
import ResourcesAssignmentsView from '../../components/studentportalcomponents/ass/page.jsx';
import GuidanceEventsView from '../../components/studentportalcomponents/session/page';
import LoadingScreen from '../../components/studentportalcomponents/loading/page';
import FeesView from '../../components/studentportalcomponents/feebalance/page';
import {
  FaArrowRight,
  FaBars,
  FaBook,
  FaChartLine,
  FaComments,
  FaDollarSign,
  FaShieldAlt,
  FaStar,
  FaTimes,
  FaUserGraduate,
} from 'react-icons/fa';
import {
  FiArrowUpRight,
  FiBell,
  FiBookOpen,
  FiCalendar,
  FiClock,
  FiCommand,
  FiCompass,
  FiCreditCard,
  FiGrid,
  FiHome,
  FiLayers,
  FiRefreshCw,
  FiSearch,
  FiTrendingUp,
  FiUser,
} from 'react-icons/fi';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

const portalViews = {
  home: { label: 'Workspace', icon: <FiHome className="h-4 w-4" /> },
  results: { label: 'Results', icon: <FiTrendingUp className="h-4 w-4" /> },
  resources: { label: 'Resources', icon: <FiBookOpen className="h-4 w-4" /> },
  guidance: { label: 'Guidance', icon: <FiCompass className="h-4 w-4" /> },
  fees: { label: 'Fees', icon: <FiCreditCard className="h-4 w-4" /> },
};

function getInitials(name) {
  if (!name) return 'MG';
  return name
    .split(' ')
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join('');
}

function StudentPortalHeader({
  student,
  currentView,
  onMenuToggle,
  isMenuOpen,
  onRefresh,
  searchTerm,
  setSearchTerm,
}) {
  const view = portalViews[currentView] || portalViews.home;

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#071611]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-4 py-4 sm:px-6 xl:px-8">
        <button
          onClick={onMenuToggle}
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white transition hover:bg-white/[0.1] lg:hidden"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <FaTimes className="h-4 w-4" /> : <FaBars className="h-4 w-4" />}
        </button>

        <div className="hidden min-w-0 items-center gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.05] px-4 py-3 lg:flex">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f5b4c,#cba14d)] text-white shadow-[0_14px_28px_rgba(15,91,76,0.35)]">
            {view.icon}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-white/45">Current Zone</p>
            <p className="truncate text-base font-black text-white">{view.label}</p>
          </div>
        </div>

        <div className="relative flex-1">
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search your workspace"
            className="w-full rounded-[1.4rem] border border-white/10 bg-white/[0.05] py-3 pl-11 pr-4 text-sm font-medium text-white outline-none placeholder:text-white/35 focus:border-[#d6b25e]/45"
          />
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-bold text-white transition hover:bg-white/[0.08]"
          >
            <FiRefreshCw className="h-4 w-4 text-[#d6b25e]" />
            Refresh
          </button>
          <div className="flex items-center gap-3 rounded-[1.4rem] border border-white/10 bg-white/[0.05] px-4 py-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f5b4c,#0c3028)] text-sm font-black text-white">
              {getInitials(student?.fullName)}
            </div>
            <div>
              <p className="text-sm font-black text-white">{student?.fullName || 'Student'}</p>
              <p className="text-xs font-medium text-white/55">
                {student?.form || 'Form'} · {student?.stream || 'Stream'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function PortalWorkspaceHome({
  student,
  feeBalance,
  feeLoading,
  assignments,
  resources,
  studentResults,
  onNavigate,
}) {
  const quickModules = [
    {
      id: 'results',
      title: 'Academic Results',
      blurb: 'Open exam reports, track academic movement, and review performance documents.',
      icon: <FaChartLine className="h-5 w-5" />,
      tone: 'from-[#0f5b4c] to-[#0b2f28]',
    },
    {
      id: 'resources',
      title: 'Learning Vault',
      blurb: 'Assignments, revision files, notes, and downloadable classroom resources in one hub.',
      icon: <FaBook className="h-5 w-5" />,
      tone: 'from-[#1b4f8a] to-[#0c2748]',
    },
    {
      id: 'guidance',
      title: 'Guidance & Events',
      blurb: 'Keep up with support services, school updates, and important student moments.',
      icon: <FaComments className="h-5 w-5" />,
      tone: 'from-[#7f3f59] to-[#481f30]',
    },
    {
      id: 'fees',
      title: 'Finance Desk',
      blurb: 'Monitor fee balance and move straight into the finance panel when needed.',
      icon: <FaDollarSign className="h-5 w-5" />,
      tone: 'from-[#89601e] to-[#4c330d]',
    },
  ];

  const workspaceStats = [
    {
      label: 'Admission No',
      value: student?.admissionNumber || 'N/A',
      icon: <FiUser className="h-5 w-5" />,
    },
    {
      label: 'Current Form',
      value: student?.form || 'N/A',
      icon: <FaUserGraduate className="h-5 w-5" />,
    },
    {
      label: 'Stream',
      value: student?.stream || 'N/A',
      icon: <FiLayers className="h-5 w-5" />,
    },
    {
      label: 'Academic Year',
      value: new Date().getFullYear().toString(),
      icon: <FiCalendar className="h-5 w-5" />,
    },
  ];

  const needToKnow = [
    `Assignments available: ${assignments.length}`,
    `Resources available: ${resources.length}`,
    `Results entries: ${studentResults.length}`,
    feeLoading
      ? 'Fee balance is loading'
      : `Finance status: ${feeBalance?.balance ? `KES ${Number(feeBalance.balance).toLocaleString()}` : 'Open finance desk'}`,
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a1f19] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.25)] sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,178,94,0.22),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(15,91,76,0.36),transparent_36%)]" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.28em] text-white/70">
              <FiCommand className="h-4 w-4 text-[#d6b25e]" />
              Student Workspace
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[0.95] text-white sm:text-5xl xl:text-6xl">
              A premium command center for learning, finance, and student life.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/68 sm:text-base">
              Welcome back, {student?.fullName?.split(' ')[0] || 'Student'}. This portal is now organized like a focused digital workspace so you can move faster through academics, updates, and school essentials.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('results')}
                className="inline-flex items-center gap-2 rounded-full bg-[#d6b25e] px-5 py-3 text-sm font-black text-[#11241d]"
              >
                Open Results
                <FaArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onNavigate('resources')}
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-5 py-3 text-sm font-black text-white"
              >
                Enter Learning Vault
                <FiArrowUpRight className="h-4 w-4 text-[#d6b25e]" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <div className="rounded-[2rem] border border-white/10 bg-[#0c1815] p-6">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-white/45">Need To Know</p>
            <div className="mt-5 space-y-3">
              {needToKnow.map((item, index) => (
                <div key={index} className="rounded-[1.3rem] border border-white/8 bg-white/[0.04] px-4 py-4 text-sm font-semibold text-white/82">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,#123b31,#081712)] p-6 text-white">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-white/55">Live Session</p>
            <h3 className="mt-4 text-2xl font-black">Secure student access is active</h3>
            <p className="mt-3 text-sm leading-7 text-white/68">
              Use the navigation hub to jump between modules. Refresh anytime to pull the latest portal data without leaving this workspace.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {workspaceStats.map((stat) => (
          <div key={stat.label} className="rounded-[1.7rem] border border-white/10 bg-white/[0.05] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.16)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f5b4c,#d6b25e)] text-white">
                {stat.icon}
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-white/35">Live</span>
            </div>
            <p className="mt-6 text-3xl font-black text-white">{stat.value}</p>
            <p className="mt-2 text-sm font-semibold text-white/55">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-white/10 bg-[#0c1815] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-white/45">Quick Actions</p>
              <h2 className="mt-3 text-3xl font-black text-white">Open a module instantly</h2>
            </div>
            <div className="hidden rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white/45 lg:block">
              Bento Actions
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {quickModules.map((module) => (
              <button
                key={module.id}
                onClick={() => onNavigate(module.id)}
                className="group overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.04] text-left transition hover:-translate-y-1 hover:bg-white/[0.06]"
              >
                <div className={`bg-gradient-to-br ${module.tone} p-5 text-white`}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                    {module.icon}
                  </div>
                  <h3 className="mt-4 text-xl font-black">{module.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/72">{module.blurb}</p>
                </div>
                <div className="flex items-center justify-between px-5 py-4 text-sm font-black text-white">
                  Launch module
                  <FiArrowUpRight className="h-4 w-4 text-[#d6b25e] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,#173228,#0b1714)] p-6">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-white/45">Portal Rhythm</p>
            <div className="mt-5 grid gap-3">
              <div className="rounded-[1.3rem] border border-white/8 bg-white/[0.04] p-4">
                <div className="flex items-center gap-3">
                  <FiClock className="h-5 w-5 text-[#d6b25e]" />
                  <div>
                    <p className="text-sm font-black text-white">Session Window</p>
                    <p className="text-xs text-white/58">Secure sign-in stays active for about 2 hours.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[1.3rem] border border-white/8 bg-white/[0.04] p-4">
                <div className="flex items-center gap-3">
                  <FiBell className="h-5 w-5 text-[#d6b25e]" />
                  <div>
                    <p className="text-sm font-black text-white">Refresh Often</p>
                    <p className="text-xs text-white/58">Pull the latest assignments, results, and finance updates from one button.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[1.3rem] border border-white/8 bg-white/[0.04] p-4">
                <div className="flex items-center gap-3">
                  <FaShieldAlt className="h-5 w-5 text-[#d6b25e]" />
                  <div>
                    <p className="text-sm font-black text-white">Student Safe Space</p>
                    <p className="text-xs text-white/58">Academic records and fee tools remain tied to the existing protected flow.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#0c1815] p-6">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-white/45">Workspace Lens</p>
            <h3 className="mt-4 text-2xl font-black text-white">Designed for momentum</h3>
            <p className="mt-3 text-sm leading-7 text-white/68">
              This home screen is intentionally faster to scan, more tactile on mobile, and more app-like across desktop so the portal feels like a living workspace rather than a static website.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function GuestPortalLanding({ onOpenLogin, router }) {
  const features = [
    {
      title: 'Academic Vault',
      text: 'Assignments, revision files, and subject resources in one secure workspace.',
      icon: <FaBook className="h-5 w-5 text-white" />,
      tone: 'from-[#0f5b4c] to-[#0b2f28]',
    },
    {
      title: 'Results Desk',
      text: 'View performance records, class result documents, and exam updates.',
      icon: <FaChartLine className="h-5 w-5 text-white" />,
      tone: 'from-[#1b4f8a] to-[#0c2748]',
    },
    {
      title: 'Finance Access',
      text: 'Check fee balance and move through the finance workflow with less friction.',
      icon: <FaDollarSign className="h-5 w-5 text-white" />,
      tone: 'from-[#89601e] to-[#4c330d]',
    },
    {
      title: 'Student Support',
      text: 'Guidance, events, announcements, and support tools built into the workspace.',
      icon: <FaComments className="h-5 w-5 text-white" />,
      tone: 'from-[#7f3f59] to-[#481f30]',
    },
  ];

  return (
    <div className="min-h-screen bg-[#061510] text-white">
      <Toaster position="top-right" expand richColors theme="light" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,178,94,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(15,91,76,0.22),transparent_32%)]" />
      <main className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 xl:px-8">
        <nav className="flex items-center justify-between rounded-[2rem] border border-white/10 bg-white/[0.04] px-4 py-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <Image
              src="/MatG.jpg"
              alt="Matungulu Girls Senior School"
              width={48}
              height={48}
              className="rounded-2xl"
              priority
            />
            <div>
              <p className="text-lg font-black tracking-tight text-white">Matungulu Girls</p>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-white/45">Student Portal</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/pages/contact')}
            className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-black text-white"
          >
            Help Desk
          </button>
        </nav>

        <section className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.28em] text-white/70">
              <FaStar className="h-3.5 w-3.5 text-[#d6b25e]" />
              Secure Student Workspace
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.92] text-white sm:text-6xl xl:text-7xl">
              A complete digital workspace for student academics and school life.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-white/68 sm:text-lg">
              The portal has been rebuilt as a modern app-like environment for results, resources, guidance, and finance while keeping the same secure school data flow underneath.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={onOpenLogin}
                className="inline-flex items-center gap-2 rounded-full bg-[#d6b25e] px-6 py-4 text-sm font-black text-[#11241d]"
              >
                Access Portal
                <FaArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => router.push('/pagesSchool Policies')}
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-6 py-4 text-sm font-black text-white"
              >
                View Policies
                <FiArrowUpRight className="h-4 w-4 text-[#d6b25e]" />
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.04]">
                <div className={`bg-gradient-to-br ${feature.tone} p-5`}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                    {feature.icon}
                  </div>
                  <h3 className="mt-4 text-xl font-black text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/70">{feature.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function ModernStudentPortalPage() {
  const [student, setStudent] = useState(null);
  const [token, setToken] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [requiresContact, setRequiresContact] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [resources, setResources] = useState([]);
  const [studentResults, setStudentResults] = useState([]);
  const [feeBalance, setFeeBalance] = useState(null);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [feeLoading, setFeeLoading] = useState(false);
  const [assignmentsError, setAssignmentsError] = useState(null);
  const [resourcesError, setResourcesError] = useState(null);
  const [resultsError, setResultsError] = useState(null);
  const [feeError, setFeeError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedToken = localStorage.getItem('student_token');
        if (!savedToken) {
          setShowLoginModal(true);
          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/studentlogin', {
          headers: { Authorization: `Bearer ${savedToken}` },
        });
        const data = await response.json();

        if (data.success && data.authenticated) {
          setStudent(data.student);
          setToken(savedToken);
          setShowLoginModal(false);

          const logoutTimer = setTimeout(() => {
            toast.success('Your 2-hour session has expired. Please log in again.');
            handleLogout();
          }, 2 * 60 * 60 * 1000);

          return () => clearTimeout(logoutTimer);
        }

        handleLogout();
      } catch (error) {
        console.error('Auth check failed:', error);
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (student && token) {
      fetchAllData();
    }
  }, [student, token]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchAssignments = async () => {
    setAssignmentsLoading(true);
    setAssignmentsError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/assignment?limit=100`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache',
        },
      });
      const data = await response.json();
      if (data.success) setAssignments(data.assignments || []);
      else throw new Error(data.error || 'Failed to fetch assignments');
    } catch (error) {
      setAssignmentsError(error.message);
      toast.error('Failed to load assignments');
    } finally {
      setAssignmentsLoading(false);
    }
  };

  const fetchResources = async () => {
    setResourcesLoading(true);
    setResourcesError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/resources?limit=100`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache',
        },
      });
      const data = await response.json();
      if (data.success) setResources(data.resources || []);
      else throw new Error(data.error || 'Failed to fetch resources');
    } catch (error) {
      setResourcesError(error.message);
      toast.error('Failed to load resources');
    } finally {
      setResourcesLoading(false);
    }
  };

  const fetchStudentResults = async () => {
    if (!student?.admissionNumber) return;
    setResultsLoading(true);
    setResultsError(null);
    try {
      const response = await fetch(
        `/api/results?action=student-results&admissionNumber=${encodeURIComponent(student.admissionNumber)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache',
          },
        }
      );
      const data = await response.json();
      if (data.success) setStudentResults(data.results || []);
      else throw new Error(data.error || 'Failed to fetch results');
    } catch (error) {
      setResultsError(error.message);
    } finally {
      setResultsLoading(false);
    }
  };

  const fetchFeeBalance = async () => {
    if (!student?.admissionNumber) return;
    setFeeLoading(true);
    setFeeError(null);
    try {
      const response = await fetch(`/api/feebalances/${student.admissionNumber}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache',
        },
      });
      const data = await response.json();
      if (data.success) setFeeBalance(data.data);
      else throw new Error(data.error || 'Failed to fetch fee balance');
    } catch (error) {
      setFeeError(error.message);
      toast.error('Could not load fee balance');
    } finally {
      setFeeLoading(false);
    }
  };

  const fetchAllData = useCallback(async () => {
    if (!token) return;
    try {
      await Promise.all([
        fetchAssignments(),
        fetchResources(),
        fetchStudentResults(),
        fetchFeeBalance(),
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load some data');
    }
  }, [token, student]);

  const handleStudentLogin = async (fullName, admissionNumber) => {
    setLoginLoading(true);
    setLoginError(null);
    setRequiresContact(false);

    try {
      const response = await fetch('/api/studentlogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, admissionNumber }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('student_token', data.token);
        setStudent(data.student);
        setToken(data.token);
        setShowLoginModal(false);
        toast.success('Login successful!', {
          description: `Welcome ${data.student.fullName}`,
        });
        fetchAllData();
      } else {
        setLoginError(data.error);
        setRequiresContact(data.requiresContact || false);
        if (data.requiresContact) {
          toast.error('Student record not found', {
            description: 'Please contact your class teacher or school administrator',
          });
        } else {
          toast.error(data.error || 'Login failed');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/studentlogin', { method: 'DELETE' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('student_token');
      setStudent(null);
      setToken(null);
      setShowLoginModal(true);
      setAssignments([]);
      setResources([]);
      setStudentResults([]);
      setFeeBalance(null);
      toast.success('You have been logged out');
    }
  };

  const handleRefresh = () => {
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    fetchAllData();
    toast.success('Refreshing data...');
  };

  const handleDownload = (item) => {
    toast.success(`Downloading ${item.title || 'file'}...`);
  };

  const handleViewDetails = (item) => {
    toast.success(`Viewing details for ${item.title}`);
  };

  const toggleMenu = () => setIsMenuOpen((value) => !value);
  const closeMenuOnMobile = () => {
    if (window.innerWidth < 1024) setIsMenuOpen(false);
  };
  const handleViewChange = (view) => {
    setCurrentView(view);
    closeMenuOnMobile();
  };

  const filteredAssignments = useMemo(() => {
    if (!searchTerm) return assignments;
    return assignments.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [assignments, searchTerm]);

  const filteredResources = useMemo(() => {
    if (!searchTerm) return resources;
    return resources.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [resources, searchTerm]);

  if (isLoading) return <LoadingScreen />;

  if (!student || !token) {
    return (
      <>
        <GuestPortalLanding onOpenLogin={() => setShowLoginModal(true)} router={router} />
        <StudentLoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleStudentLogin}
          isLoading={loginLoading}
          error={loginError}
          requiresContact={requiresContact}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#061510] text-white">
      <Toaster position="top-right" expand richColors theme="light" />
      <StudentLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleStudentLogin}
        isLoading={loginLoading}
        error={loginError}
        requiresContact={requiresContact}
      />

      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={toggleMenu}
        />
      )}

      <div className="relative flex min-h-screen">
        <div
          className={`fixed inset-y-0 left-0 z-50 w-[88vw] max-w-[360px] transition-transform duration-300 lg:sticky lg:top-0 lg:w-[330px] lg:max-w-none ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <NavigationSidebar
            student={student}
            feeBalance={feeBalance}
            feeLoading={feeLoading}
            feeError={feeError}
            onLogout={handleLogout}
            currentView={currentView}
            setCurrentView={handleViewChange}
            onRefresh={handleRefresh}
            onMenuClose={closeMenuOnMobile}
          />
        </div>

        <div className="flex min-h-screen flex-1 flex-col">
          <StudentPortalHeader
            student={student}
            currentView={currentView}
            onMenuToggle={toggleMenu}
            isMenuOpen={isMenuOpen}
            onRefresh={handleRefresh}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-5 sm:px-6 xl:px-8">
            {currentView === 'home' && (
              <PortalWorkspaceHome
                student={student}
                feeBalance={feeBalance}
                feeLoading={feeLoading}
                assignments={assignments}
                resources={resources}
                studentResults={studentResults}
                onNavigate={handleViewChange}
              />
            )}

            {currentView === 'results' && (
              <ResultsView
                student={student}
                studentResults={studentResults}
                resultsLoading={resultsLoading}
                resultsError={resultsError}
                onRefreshResults={fetchStudentResults}
              />
            )}

            {currentView === 'resources' && (
              <ResourcesAssignmentsView
                student={student}
                assignments={filteredAssignments}
                resources={filteredResources}
                assignmentsLoading={assignmentsLoading}
                resourcesLoading={resourcesLoading}
                onDownload={handleDownload}
                onViewDetails={handleViewDetails}
              />
            )}

            {currentView === 'guidance' && <GuidanceEventsView />}

            {currentView === 'fees' && <FeesView student={student} token={token} />}
          </main>

          <footer className="border-t border-white/10 bg-[#081712]/85 px-4 py-5 backdrop-blur-xl sm:px-6 xl:px-8">
            <div className="mx-auto flex max-w-[1600px] flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-black text-white">© {new Date().getFullYear()} Matungulu Girls Senior School</p>
                <p className="mt-1 text-xs font-medium text-white/45">
                  Student Portal Workspace · Secure school data integrations preserved
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                <button onClick={() => router.push('/pagesSchool Policies')} className="transition hover:text-white">
                  Privacy
                </button>
                <button onClick={() => router.push('/pagesSchool Policies')} className="transition hover:text-white">
                  Terms
                </button>
                <button onClick={() => router.push('/pages/contact')} className="transition hover:text-white">
                  Help Desk
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
