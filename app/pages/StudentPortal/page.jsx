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
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-4 py-4 sm:px-6 xl:px-8">
        <button
          onClick={onMenuToggle}
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 transition hover:bg-slate-100 lg:hidden"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <FaTimes className="h-4 w-4" /> : <FaBars className="h-4 w-4" />}
        </button>

        <div className="hidden min-w-0 items-center gap-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 lg:flex">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/10">
            {view.icon}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">Current Zone</p>
            <p className="truncate text-base font-black text-slate-950">{view.label}</p>
          </div>
        </div>

        <div className="relative flex-1">
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search your workspace"
            className="w-full rounded-[1.4rem] border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-900 transition hover:bg-slate-100"
          >
            <FiRefreshCw className="h-4 w-4 text-blue-600" />
            Refresh
          </button>
          <div className="flex items-center gap-3 rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white">
              {getInitials(student?.fullName)}
            </div>
            <div>
              <p className="text-sm font-black text-slate-950">{student?.fullName || 'Student'}</p>
              <p className="text-xs font-medium text-slate-600">
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
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1 bg-gradient-to-r from-blue-500 via-emerald-400 to-amber-400" />
          <div className="bg-slate-950 p-6 text-white sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2">
              <FiCommand className="h-3 w-3 text-emerald-300 sm:h-4 sm:w-4" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-200 sm:text-[11px]">
                Student Portal
              </span>
            </div>

            <h1 className="mt-4 max-w-3xl text-2xl font-black leading-tight tracking-tight text-white sm:mt-5 sm:text-3xl md:text-4xl lg:text-5xl">
              Welcome back, {student?.fullName?.split(' ')[0] || 'Student'}.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Your academics, learning files, guidance updates, and finance records are ready in one secure Matungulu Girls workspace.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('results')}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-slate-100"
              >
                Open Results
                <FaArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onNavigate('resources')}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/15"
              >
                Enter Learning Vault
                <FiArrowUpRight className="h-4 w-4 text-emerald-300" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-500">Need To Know</p>
            <div className="mt-5 space-y-3">
              {needToKnow.map((item, index) => (
                <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-bold text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-500">Live Session</p>
            <h3 className="mt-4 text-2xl font-black text-slate-950">Secure access is active</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Your session stays protected for about 2 hours. Refresh pulls the latest results, resources, and fee records.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {workspaceStats.map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                {stat.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">Live</span>
            </div>
            <p className="mt-6 text-3xl font-black text-slate-950">{stat.value}</p>
            <p className="mt-2 text-sm font-bold text-slate-600">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-500">Quick Actions</p>
              <h2 className="mt-3 text-3xl font-black text-slate-950">Open a module</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {quickModules.map((module) => (
              <button
                key={module.id}
                onClick={() => onNavigate(module.id)}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white text-left transition hover:-translate-y-1 hover:bg-slate-50 hover:shadow-sm"
              >
                <div className={`bg-gradient-to-br ${module.tone} p-5 text-white`}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                    {module.icon}
                  </div>
                  <h3 className="mt-4 text-xl font-black">{module.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/85">{module.blurb}</p>
                </div>
                <div className="flex items-center justify-between px-5 py-4 text-sm font-black text-slate-950">
                  Launch module
                  <FiArrowUpRight className="h-4 w-4 text-blue-600 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-500">Portal Rhythm</p>
            <div className="mt-5 grid gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <FiClock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-black text-slate-950">Session Window</p>
                    <p className="text-xs text-slate-500">Secure sign-in stays active for about 2 hours.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <FiBell className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-black text-slate-950">Refresh Often</p>
                    <p className="text-xs text-slate-500">Pull the latest assignments, results, and finance updates from one button.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <FaShieldAlt className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-black text-slate-950">Protected Records</p>
                    <p className="text-xs text-slate-500">Academic and fee tools stay tied to your student account.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-500">Today</p>
            <h3 className="mt-4 text-2xl font-black text-slate-950">Start where it matters</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Check your newest assignments, open recent results, or confirm the latest finance statement before moving on.
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
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Toaster position="top-right" expand richColors theme="light" />
      <main className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 xl:px-8">
        <nav className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6">
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
              <p className="text-lg font-black tracking-tight text-slate-950">Matungulu Girls</p>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Student Portal</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/pages/contact')}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-700 hover:bg-slate-100"
          >
            Help Desk
          </button>
        </nav>

        <section className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-slate-600">
              <FaStar className="h-3.5 w-3.5 text-amber-500" />
              Secure Student Portal
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl xl:text-6xl">
              Matungulu Girls student access.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Sign in to view academic results, class resources, guidance updates, and fee statements from your protected student account.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={onOpenLogin}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-black text-white hover:bg-slate-800"
              >
                Access Portal
                <FaArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => router.push('/pages/School Policies')}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-black text-slate-700 hover:bg-slate-50"
              >
                View Policies
                <FiArrowUpRight className="h-4 w-4 text-blue-600" />
              </button>
            </div>
          </div>

      <div className="grid md:grid-cols-2 gap-3 grid-cols-2 lg:gap-6">
  {features.map((feature) => (
    <div key={feature.title} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className={`bg-gradient-to-br ${feature.tone} p-3 sm:p-5 text-white`}>
        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-white/15">
          {feature.icon}
        </div>
        <h3 className="mt-3 sm:mt-4 text-sm sm:text-xl font-black text-white line-clamp-2 sm:line-clamp-none">
          {feature.title}
        </h3>
        <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-5 sm:leading-7 text-white/70 line-clamp-3 sm:line-clamp-none">
          {feature.text}
        </p>
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
  const [passwordSetup, setPasswordSetup] = useState({ token: null, student: null });
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
          localStorage.setItem('student_data', JSON.stringify(data.student));
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

  const handleStudentLogin = async (credentialsOrName, legacyAdmissionNumber) => {
    setLoginLoading(true);
    setLoginError(null);
    setRequiresContact(false);

    try {
      const credentials = typeof credentialsOrName === 'object'
        ? credentialsOrName
        : { fullName: credentialsOrName, admissionNumber: legacyAdmissionNumber };

      const payload = credentials.action
        ? credentials
        : {
            action: credentials.password ? 'login' : 'verify-first-access',
            fullName: credentials.fullName,
            admissionNumber: credentials.admissionNumber,
            password: credentials.password,
            newPassword: credentials.newPassword,
          };

      const response = await fetch('/api/studentlogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success && data.requiresPasswordSetup && data.setupToken) {
        setPasswordSetup({ token: data.setupToken, student: data.student });
        setLoginError(null);
        toast.info('Create a portal password to continue');
        return;
      }

      if (data.success && data.token) {
        localStorage.setItem('student_token', data.token);
        localStorage.setItem('student_data', JSON.stringify(data.student));
        setStudent(data.student);
        setToken(data.token);
        setPasswordSetup({ token: null, student: null });
        setShowLoginModal(false);
        toast.success('Login successful!', {
          description: `Welcome ${data.student.fullName}`,
        });
      } else {
        setLoginError(data.error);
        setRequiresContact(data.requiresContact || false);
        if (data.requiresContact) {
          toast.error('Student record not found', {
            description: 'Please contact your class teacher or school administrator',
          });
        } else if (data.requiresPasswordSetup) {
          toast.error(data.error || 'Use first-time setup to create your password');
        } else if (data.requiresPassword) {
          toast.error(data.error || 'Enter your portal password');
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

  const handlePasswordSetup = async (setupPayload) => {
    setLoginLoading(true);
    setLoginError(null);
    setRequiresContact(false);

    try {
      const response = await fetch('/api/studentlogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'setup-password',
          setupToken: setupPayload.setupToken || passwordSetup.token,
          newPassword: setupPayload.newPassword,
          confirmPassword: setupPayload.confirmPassword,
        }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        localStorage.setItem('student_token', data.token);
        localStorage.setItem('student_data', JSON.stringify(data.student));
        setStudent(data.student);
        setToken(data.token);
        setPasswordSetup({ token: null, student: null });
        setShowLoginModal(false);
        toast.success('Password created!', {
          description: `Welcome ${data.student.fullName}`,
        });
      } else {
        setLoginError(data.error || 'Password setup failed. Please try again.');
        setRequiresContact(data.requiresContact || false);
        toast.error(data.error || 'Password setup failed');
        if (data.requiresReauth || data.requiresPassword) {
          setPasswordSetup({ token: null, student: null });
        }
      }
    } catch (error) {
      console.error('Password setup error:', error);
      setLoginError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handlePasswordResetRequest = async (resetPayload) => {
    setLoginLoading(true);
    setLoginError(null);
    setRequiresContact(false);

    try {
      const response = await fetch('/api/student-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resetPayload),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Could not send password request');
      }

      toast.success('Password link sent', {
        description: data.message || 'Check the registered parent email for the secure link.',
      });
    } catch (error) {
      setLoginError(error.message || 'Could not send password request.');
      toast.error(error.message || 'Could not send password request.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
    setLoginError(null);
    setRequiresContact(false);
    setPasswordSetup({ token: null, student: null });
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/studentlogin', { method: 'DELETE' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('student_token');
      localStorage.removeItem('student_data');
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
          onClose={handleLoginModalClose}
          onLogin={handleStudentLogin}
          onSetupPassword={handlePasswordSetup}
          onPasswordResetRequest={handlePasswordResetRequest}
          isLoading={loginLoading}
          error={loginError}
          requiresContact={requiresContact}
          passwordSetupToken={passwordSetup.token}
          passwordSetupStudent={passwordSetup.student}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Toaster position="top-right" expand richColors theme="light" />
      <StudentLoginModal
        isOpen={showLoginModal}
        onClose={handleLoginModalClose}
        onLogin={handleStudentLogin}
        onSetupPassword={handlePasswordSetup}
        onPasswordResetRequest={handlePasswordResetRequest}
        isLoading={loginLoading}
        error={loginError}
        requiresContact={requiresContact}
        passwordSetupToken={passwordSetup.token}
        passwordSetupStudent={passwordSetup.student}
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

          <footer className="border-t border-slate-200 bg-white/95 px-4 py-5 backdrop-blur-xl sm:px-6 xl:px-8">
            <div className="mx-auto flex max-w-[1600px] flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-black text-slate-950">© {new Date().getFullYear()} Matungulu Girls Senior School</p>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  Student Portal Workspace · Secure school access
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                <button onClick={() => router.push('/pages/School Policies')} className="transition hover:text-slate-950">
                  Privacy
                </button>
                <button onClick={() => router.push('/pages/School Policies')} className="transition hover:text-slate-950">
                  Terms
                </button>
                <button onClick={() => router.push('/pages/contact')} className="transition hover:text-slate-950">
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
