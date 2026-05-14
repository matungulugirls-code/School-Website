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
    <aside className="flex h-full flex-col rounded-r-3xl border-r border-slate-200 bg-white shadow-xl">
      {/* Header Section - Fixed at top */}
      <div className="flex-shrink-0 border-b border-slate-100 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.4rem] bg-gradient-to-br from-teal-700 to-emerald-700 shadow-lg">
              <FiGrid className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-lg font-black tracking-tight text-slate-800">Student Hub</p>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-teal-700">
                Matungulu Girls
              </p>
            </div>
          </div>
          <button
            onClick={onMenuClose}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Student Profile Card */}
        <div className="mt-6 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-teal-700 to-emerald-700 text-lg font-black text-white shadow-md">
              {getInitials(student?.fullName)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-black text-slate-800">{student?.fullName || 'Student Name'}</p>
              <p className="mt-1 text-xs font-medium text-slate-500">
                {student?.form || 'Form'} · {student?.stream || 'Stream'}
              </p>
              <p className="mt-1 text-[11px] font-bold text-teal-700">
                ADM {student?.admissionNumber || '----'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Navigation Section */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6">
        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-teal-700">Navigation Hub</p>
          <div className="mt-4 space-y-2">
            {navItems.map((item) => {
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${
                    active
                      ? 'bg-gradient-to-r from-teal-700 to-emerald-700 text-white shadow-md shadow-teal-200'
                      : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
                    active 
                      ? 'bg-white/20 text-white' 
                      : 'bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-teal-700'
                  }`}>
                    {item.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black">{item.label}</p>
                    <p className={`text-xs font-medium ${active ? 'text-white/80' : 'text-slate-400'}`}>
                      {item.helper}
                    </p>
                  </div>
                  <FiArrowUpRight className={`h-4 w-4 transition ${active ? 'text-white' : 'text-slate-300 group-hover:text-teal-700'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Information Cards */}
        <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-teal-700">Need To Know</p>
          <div className="mt-4 space-y-3">
            <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <FiShield className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800">Secure Session</p>
                  <p className="text-xs text-slate-500">Protected student access remains active</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
                  <FiCreditCard className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800">Finance Snapshot</p>
                  <p className="text-xs text-slate-500">{statusText}</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
                  <FiUser className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800">Quick Identity</p>
                  <p className="text-xs text-slate-500">
                    {student?.form || 'Form'} · {student?.stream || 'Stream'} · {student?.admissionNumber || 'Admission'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* External Link */}
        <a
          href="https://analytics.zeraki.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex items-center justify-between rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-4 text-slate-700 transition-all hover:border-teal-200 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100">
              <FiTrendingUp className="h-4 w-4 text-teal-700" />
            </div>
            <div>
              <p className="text-sm font-black">Zeraki Analytics</p>
              <p className="text-xs text-slate-400">Open external learning analytics</p>
            </div>
          </div>
          <FiArrowUpRight className="h-4 w-4 text-teal-700" />
        </a>
      </div>

      {/* Footer Buttons - Sticky/Fixed at bottom */}
      <div className="flex-shrink-0 border-t border-slate-100 p-5 sm:p-6 bg-white sticky bottom-0">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onRefresh}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-600 transition-all hover:bg-slate-50 hover:border-teal-200"
          >
            <FiRefreshCw className="h-4 w-4 text-teal-700" />
            Refresh
          </button>
          <button
            onClick={onLogout}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-700 px-4 py-3 text-sm font-black text-white shadow-md shadow-teal-200 transition-all hover:shadow-lg"
          >
            <FiLogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
