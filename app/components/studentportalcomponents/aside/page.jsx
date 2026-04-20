'use client';

import { useMemo } from 'react';
import {
  FiArrowUpRight,
  FiBookOpen,
  FiCompass,
  FiCreditCard,
  FiGrid,
  FiHome,
  FiLayers,
  FiLogOut,
  FiRefreshCw,
  FiShield,
  FiTrendingUp,
  FiUser,
  FiX,
} from 'react-icons/fi';

const navItems = [
  { id: 'home', label: 'Workspace', helper: 'Overview and shortcuts', icon: <FiHome className="h-4 w-4" /> },
  { id: 'results', label: 'Results', helper: 'Academic records', icon: <FiTrendingUp className="h-4 w-4" /> },
  { id: 'resources', label: 'Resources', helper: 'Assignments and files', icon: <FiBookOpen className="h-4 w-4" /> },
  { id: 'guidance', label: 'Guidance', helper: 'Support and events', icon: <FiCompass className="h-4 w-4" /> },
  { id: 'fees', label: 'Fees', helper: 'Finance panel', icon: <FiCreditCard className="h-4 w-4" /> },
];

function getInitials(name) {
  if (!name) return 'MG';
  return name
    .split(' ')
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join('');
}

export default function NavigationSidebar({
  student,
  feeBalance,
  feeLoading,
  feeError,
  onLogout,
  currentView,
  setCurrentView,
  onRefresh,
  onMenuClose,
}) {
  const statusText = useMemo(() => {
    if (feeLoading) return 'Fee balance loading';
    if (feeError) return 'Finance data needs refresh';
    if (feeBalance?.balance !== undefined && feeBalance?.balance !== null) {
      return `KES ${Number(feeBalance.balance).toLocaleString()}`;
    }
    return 'Open finance desk';
  }, [feeBalance, feeLoading, feeError]);

  return (
    <aside className="flex h-full flex-col border-r border-white/10 bg-[#081712]/96 text-white backdrop-blur-2xl">
      <div className="border-b border-white/10 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.4rem] bg-[linear-gradient(135deg,#0f5b4c,#d6b25e)] shadow-[0_18px_38px_rgba(15,91,76,0.3)]">
              <FiGrid className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-lg font-black tracking-tight text-white">Student Hub</p>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-white/45">
                Matungulu Girls
              </p>
            </div>
          </div>
          <button
            onClick={onMenuClose}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white transition hover:bg-white/[0.1] lg:hidden"
            aria-label="Close sidebar"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 rounded-[1.8rem] border border-white/10 bg-white/[0.05] p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.3rem] bg-[linear-gradient(135deg,#0f5b4c,#0b2f28)] text-lg font-black text-white">
              {getInitials(student?.fullName)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-black text-white">{student?.fullName || 'Student Name'}</p>
              <p className="mt-1 text-xs font-medium text-white/55">
                {student?.form || 'Form'} · {student?.stream || 'Stream'}
              </p>
              <p className="mt-1 text-[11px] font-bold text-[#d6b25e]">
                ADM {student?.admissionNumber || '----'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 sm:p-6">
        <div className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(160deg,rgba(15,91,76,0.2),rgba(255,255,255,0.02))] p-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-white/45">Navigation Hub</p>
          <div className="mt-4 space-y-2">
            {navItems.map((item) => {
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`group flex w-full items-center gap-3 rounded-[1.35rem] px-4 py-4 text-left transition ${
                    active
                      ? 'bg-[linear-gradient(135deg,#103f34,#0b231d)] text-white shadow-[0_16px_34px_rgba(0,0,0,0.22)]'
                      : 'bg-white/[0.03] text-white/75 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                    active ? 'bg-[#d6b25e] text-[#11241d]' : 'bg-white/[0.06] text-white/70'
                  }`}>
                    {item.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black">{item.label}</p>
                    <p className="text-xs font-medium text-inherit opacity-65">{item.helper}</p>
                  </div>
                  <FiArrowUpRight className={`h-4 w-4 transition ${active ? 'text-[#d6b25e]' : 'text-white/30 group-hover:text-white/70'}`} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-white/45">Need To Know</p>
          <div className="mt-4 space-y-3">
            <div className="rounded-[1.25rem] border border-[#0f5b4c]/30 bg-gradient-to-br from-[#0f5b4c]/20 to-[#0b2f28]/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f5b4c]/40 text-lg">
                  🛡️
                </div>
                <div>
                  <p className="text-sm font-black text-white">Secure Session</p>
                  <p className="text-xs text-white/75">Protected student access remains active under the existing login flow.</p>
                </div>
              </div>
            </div>
            <div className="rounded-[1.25rem] border border-[#214d89]/30 bg-gradient-to-br from-[#214d89]/20 to-[#132746]/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#214d89]/40 text-lg">
                  💳
                </div>
                <div>
                  <p className="text-sm font-black text-white">Finance Snapshot</p>
                  <p className="text-xs text-white/75">{statusText}</p>
                </div>
              </div>
            </div>
            <div className="rounded-[1.25rem] border border-[#7a3d55]/30 bg-gradient-to-br from-[#7a3d55]/20 to-[#4a2031]/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7a3d55]/40 text-lg">
                  📋
                </div>
                <div>
                  <p className="text-sm font-black text-white">Quick Identity</p>
                  <p className="text-xs text-white/75">{student?.form || 'Form'} · {student?.stream || 'Stream'} · {student?.admissionNumber || 'Admission'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <a
          href="https://analytics.zeraki.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex items-center justify-between rounded-[1.6rem] border border-white/10 bg-[linear-gradient(145deg,#10261f,#0a1714)] px-4 py-4 text-white transition hover:bg-[linear-gradient(145deg,#143228,#0d1d18)]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.06]">
              <FiTrendingUp className="h-4 w-4 text-[#d6b25e]" />
            </div>
            <div>
              <p className="text-sm font-black">Zeraki Analytics</p>
              <p className="text-xs text-white/55">Open external learning analytics</p>
            </div>
          </div>
          <FiArrowUpRight className="h-4 w-4 text-[#d6b25e]" />
        </a>
      </div>

      <div className="border-t border-white/10 p-5 sm:p-6">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onRefresh}
            className="inline-flex items-center justify-center gap-2 rounded-[1.2rem] border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-black text-white transition hover:bg-white/[0.08]"
          >
            <FiRefreshCw className="h-4 w-4 text-[#d6b25e]" />
            Refresh
          </button>
          <button
            onClick={onLogout}
            className="inline-flex items-center justify-center gap-2 rounded-[1.2rem] bg-[#d6b25e] px-4 py-3 text-sm font-black text-[#11241d]"
          >
            <FiLogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
