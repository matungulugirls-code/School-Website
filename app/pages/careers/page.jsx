'use client';

import { useEffect, useMemo, useState } from 'react';
import { Toaster, toast } from 'sonner';
import {
  FiArrowRight,
  FiAward,
  FiBookmark,
  FiBriefcase,
  FiCheckCircle,
  FiCopy,
  FiFilter,
  FiGrid,
  FiHeart,
  FiInfo,
  FiList,
  FiMail,
  FiMapPin,
  FiPhone,
  FiRefreshCw,
  FiSearch,
  FiSend,
  FiShield,
  FiStar,
  FiTrendingUp,
  FiUsers,
  FiX,
  FiZap,
} from 'react-icons/fi';
import { FaGraduationCap, FaLeaf, FaWhatsapp } from 'react-icons/fa';
import { IoSchoolOutline, IoSparkles } from 'react-icons/io5';
import { CircularProgress, Box, Stack } from '@mui/material';

const categoryConfig = {
  all: { name: 'All Openings', icon: FiGrid, tone: 'from-[#0f5b4c] to-[#0b2f28]' },
  teaching: { name: 'Teaching', icon: FaGraduationCap, tone: 'from-[#0f5b4c] to-[#0b2f28]' },
  administrative: { name: 'Administration', icon: FiBriefcase, tone: 'from-[#214d89] to-[#132746]' },
  support: { name: 'Support Staff', icon: FiUsers, tone: 'from-[#7a3d55] to-[#4a2031]' },
  technical: { name: 'Technical', icon: FiZap, tone: 'from-[#8a611b] to-[#4e3208]' },
  medical: { name: 'Medical', icon: FiShield, tone: 'from-[#18605f] to-[#103737]' },
  maintenance: { name: 'Maintenance', icon: FiTrendingUp, tone: 'from-[#5f6b20] to-[#30390f]' },
};

const jobTypeConfig = {
  'full-time': { label: 'Full Time', accent: 'bg-[#0f5b4c]', soft: 'bg-[#0f5b4c]/10 text-[#0f5b4c]' },
  'part-time': { label: 'Part Time', accent: 'bg-[#214d89]', soft: 'bg-[#214d89]/10 text-[#214d89]' },
  contract: { label: 'Contract', accent: 'bg-[#7a3d55]', soft: 'bg-[#7a3d55]/10 text-[#7a3d55]' },
  internship: { label: 'Internship', accent: 'bg-[#8a611b]', soft: 'bg-[#8a611b]/10 text-[#8a611b]' },
};

const statsBase = [
  {
    label: 'Open Roles',
    sublabel: 'Live vacancies right now',
    icon: FiBriefcase,
    gradient: 'from-[#0f5b4c] to-[#0b2f28]',
  },
  {
    label: 'Departments',
    sublabel: 'Academic and operational teams',
    icon: FiUsers,
    gradient: 'from-[#214d89] to-[#132746]',
  },
  {
    label: 'School Focus',
    sublabel: 'Girls-centered professional impact',
    icon: FiHeart,
    gradient: 'from-[#7a3d55] to-[#4a2031]',
  },
  {
    label: 'Application Routes',
    sublabel: 'Email, phone, and direct contacts',
    icon: FiSend,
    gradient: 'from-[#8a611b] to-[#4e3208]',
  },
];

function formatDeadline(dateString) {
  if (!dateString) return 'Open until filled';

  try {
    const target = new Date(dateString);
    const today = new Date();
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));

    if (diff < 0) return 'Closed';
    if (diff === 0) return 'Closes today';
    if (diff === 1) return 'Closes tomorrow';
    if (diff < 7) return `${diff} days left`;

    return target.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Open';
  }
}

function getCategoryMeta(category) {
  return categoryConfig[category?.toLowerCase()] || {
    name: category || 'School Opportunity',
    icon: FiBriefcase,
    tone: 'from-[#0f5b4c] to-[#0b2f28]',
  };
}

function getJobTypeMeta(type) {
  return jobTypeConfig[type?.toLowerCase()] || jobTypeConfig['full-time'];
}

function LoadingView() {
  return (
    <Box className="min-h-[75vh] flex items-center justify-center px-4">
      <Stack spacing={2.5} alignItems="center" className="w-full max-w-md rounded-[2rem] border border-[#11281f12] bg-[#fffaf0] p-10 shadow-[0_28px_80px_rgba(17,40,31,0.12)]">
        <Box className="relative flex items-center justify-center">
          <CircularProgress variant="determinate" value={100} size={56} thickness={4.5} sx={{ color: '#e2e8f0' }} />
          <CircularProgress
            variant="indeterminate"
            disableShrink
            size={56}
            thickness={4.5}
            sx={{
              color: '#0f5b4c',
              animationDuration: '900ms',
              position: 'absolute',
              '& .MuiCircularProgress-circle': { strokeLinecap: 'round' },
            }}
          />
          <Box className="absolute">
            <IoSparkles className="text-[#d4b15f] text-lg" />
          </Box>
        </Box>
        <div className="text-center">
          <p className="text-sm font-extrabold uppercase tracking-[0.3em] text-[#0f5b4c]">Careers Desk</p>
          <h2 className="mt-3 text-3xl font-black text-[#11281f]">Loading school opportunities</h2>
          <p className="mt-3 text-sm leading-7 text-[#5f665e]">
            Pulling current Matungulu Girls Senior School vacancies from the careers feed.
          </p>
        </div>
      </Stack>
    </Box>
  );
}

function StatPanel({ stat, value }) {
  const Icon = stat.icon;

  return (
    <div className="w-full rounded-[1.8rem] border border-white/10 bg-white/[0.06] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.14)] backdrop-blur-xl transition-all duration-200 hover:border-white/20 sm:p-5">
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} text-white sm:h-12 sm:w-12 sm:rounded-2xl`}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <span className="text-[8px] font-extrabold uppercase tracking-[0.24em] text-white/35 sm:text-[10px] sm:tracking-[0.28em]">
          Live
        </span>
      </div>
      <p className="mt-4 text-2xl font-black text-white sm:mt-6 sm:text-3xl">
        {value}
      </p>
      <p className="mt-1 text-xs font-bold text-white/82 sm:mt-2 sm:text-sm">
        {stat.label}
      </p>
      <p className="mt-1 text-[11px] leading-5 text-white/45 sm:text-xs sm:leading-6">
        {stat.sublabel}
      </p>
    </div>
  );
}

function OpportunityCard({ job, viewMode, bookmarked, onBookmark, onView, onShareWhatsApp }) {
  const category = getCategoryMeta(job?.category);
  const type = getJobTypeMeta(job?.jobType);
  const CategoryIcon = category.icon;
  const deadlineText = formatDeadline(job?.applicationDeadline);

  if (viewMode === 'list') {
    return (
      <article
        onClick={() => onView(job)}
        className="group grid cursor-pointer gap-5 rounded-[2rem] border border-[#11281f12] bg-[#fffaf0] p-5 shadow-[0_24px_60px_rgba(17,40,31,0.08)] transition md:grid-cols-[120px_minmax(0,1fr)]"
      >
        <div className={`flex h-28 items-center justify-center rounded-[1.5rem] bg-gradient-to-br ${category.tone} text-white`}>
          <CategoryIcon className="h-9 w-9" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.25em] ${type.soft}`}>
                  {type.label}
                </span>
                <span className="rounded-full border border-[#11281f12] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#5f665e]">
                  {category.name}
                </span>
              </div>
              <h3 className="mt-3 text-2xl font-black text-[#11281f]">{job?.jobTitle || 'School Opportunity'}</h3>
              <p className="mt-2 text-sm font-semibold text-[#5f665e]">{job?.department || 'Matungulu Girls Senior School'}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShareWhatsApp(job);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0f5b4c]/20 bg-[#0f5b4c]/10 text-[#0f5b4c]"
              >
                <FaWhatsapp className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBookmark(job);
                }}
                className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                  bookmarked ? 'border-[#d4b15f]/30 bg-[#d4b15f]/10 text-[#8a611b]' : 'border-[#11281f12] bg-white text-[#5f665e]'
                }`}
              >
                <FiBookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          <p className="mt-4 line-clamp-2 text-sm leading-7 text-[#5f665e]">
            {job?.jobDescription || 'Join the Matungulu Girls Senior School team and help shape a strong, girls-centered learning environment.'}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.25rem] border border-[#11281f12] bg-white px-4 py-3">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#5f665e]">Deadline</p>
              <p className="mt-1 text-sm font-black text-[#11281f]">{deadlineText}</p>
            </div>
            <div className="rounded-[1.25rem] border border-[#11281f12] bg-white px-4 py-3">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#5f665e]">Positions</p>
              <p className="mt-1 text-sm font-black text-[#11281f]">{job?.positionsAvailable || 1}</p>
            </div>
            <div className="rounded-[1.25rem] border border-[#11281f12] bg-white px-4 py-3">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#5f665e]">Experience</p>
              <p className="mt-1 text-sm font-black text-[#11281f]">{job?.experience || 'Flexible'}</p>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      onClick={() => onView(job)}
      className="group relative cursor-pointer overflow-hidden rounded-[2rem] border border-[#11281f12] bg-[#fffaf0] shadow-[0_24px_60px_rgba(17,40,31,0.08)] transition"
    >
      <div className={`h-2 bg-gradient-to-r ${category.tone}`} />
      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div className={`flex h-14 w-14 items-center justify-center rounded-[1.3rem] bg-gradient-to-br ${category.tone} text-white`}>
            <CategoryIcon className="h-6 w-6" />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShareWhatsApp(job);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0f5b4c]/20 bg-[#0f5b4c]/10 text-[#0f5b4c]"
            >
              <FaWhatsapp className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBookmark(job);
              }}
              className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                bookmarked ? 'border-[#d4b15f]/30 bg-[#d4b15f]/10 text-[#8a611b]' : 'border-[#11281f12] bg-white text-[#5f665e]'
              }`}
            >
              <FiBookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.25em] ${type.soft}`}>
            {type.label}
          </span>
          <span className="rounded-full border border-[#11281f12] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#5f665e]">
            {category.name}
          </span>
        </div>

        <h3 className="mt-4 text-2xl font-black leading-tight text-[#11281f]">
          {job?.jobTitle || 'School Opportunity'}
        </h3>
        <p className="mt-2 text-sm font-semibold text-[#5f665e]">{job?.department || 'Matungulu Girls Senior School'}</p>
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-[#5f665e]">
          {job?.jobDescription || 'Join the Matungulu Girls Senior School team and help shape a strong, girls-centered learning environment.'}
        </p>

        <div className="mt-5 grid gap-3">
          <div className="flex items-center justify-between rounded-[1.25rem] border border-[#11281f12] bg-white px-4 py-3">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#5f665e]">Deadline</span>
            <span className="text-sm font-black text-[#11281f]">{deadlineText}</span>
          </div>
          <div className="flex items-center justify-between rounded-[1.25rem] border border-[#11281f12] bg-white px-4 py-3">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#5f665e]">Positions</span>
            <span className="text-sm font-black text-[#11281f]">{job?.positionsAvailable || 1}</span>
          </div>
          <div className="flex items-center justify-between rounded-[1.25rem] border border-[#11281f12] bg-white px-4 py-3">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#5f665e]">Experience</span>
            <span className="text-sm font-black text-[#11281f]">{job?.experience || 'Flexible'}</span>
          </div>
        </div>

        <div className="mt-6 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-[#0f5b4c]">
          View details
          <FiArrowRight className="h-4 w-4" />
        </div>
      </div>
    </article>
  );
}

function InfoCard({ icon: Icon, title, text, tone = 'default' }) {
  const tones = {
    default: 'bg-white/[0.05] border-white/10 text-white',
    gold: 'bg-[#d4b15f]/10 border-[#d4b15f]/20 text-white',
  };

  return (
    <div className={`w-full rounded-2xl border p-4 transition-all duration-200 hover:border-white/20 hover:shadow-lg sm:rounded-[1.7rem] sm:p-5 ${tones[tone]}`}>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 sm:h-12 sm:w-12 sm:rounded-2xl">
        <Icon className="h-4 w-4 text-[#d4b15f] sm:h-5 sm:w-5" />
      </div>
      <h3 className="mt-3 text-base font-black sm:mt-4 sm:text-lg">
        {title}
      </h3>
      <p className="mt-1 text-xs leading-6 text-white/65 sm:mt-2 sm:text-sm sm:leading-7">
        {text}
      </p>
    </div>
  );
}

function EmptyState({ onClear }) {
  return (
    <div className="rounded-[2rem] border border-[#11281f12] bg-[#fffaf0] px-6 py-20 text-center shadow-[0_24px_60px_rgba(17,40,31,0.08)]">
      <FiBriefcase className="mx-auto h-14 w-14 text-[#0f5b4c]" />
      <h3 className="mt-6 text-3xl font-black text-[#11281f]">No roles match this search</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#5f665e]">
        Try another category or keyword to reopen current Matungulu Girls Senior School opportunities.
      </p>
      <button
        onClick={onClear}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0f5b4c] px-5 py-3 text-sm font-black text-white"
      >
        Clear Filters
        <FiArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function JobDetailModal({ job, onClose, onApply, onCopyEmail }) {
  if (!job) return null;

  const category = getCategoryMeta(job?.category);
  const type = getJobTypeMeta(job?.jobType);
  const CategoryIcon = category.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#04100d]/82 p-4 backdrop-blur-md">
      <div className="relative max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[2.2rem] border border-white/10 bg-[#fffaf0] shadow-[0_40px_110px_rgba(0,0,0,0.38)]">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-[#11281f12] bg-white text-[#11281f]"
        >
          <FiX className="h-5 w-5" />
        </button>

        <div className={`h-3 bg-gradient-to-r ${category.tone}`} />

        <div className="max-h-[calc(92vh-12px)] overflow-y-auto p-6 sm:p-8">
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="flex items-start gap-4">
                <div className={`flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-gradient-to-br ${category.tone} text-white`}>
                  <CategoryIcon className="h-7 w-7" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-2">
                    <span className={`rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.25em] ${type.soft}`}>
                      {type.label}
                    </span>
                    <span className="rounded-full border border-[#11281f12] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#5f665e]">
                      {category.name}
                    </span>
                  </div>
                  <h2 className="mt-4 text-3xl font-black leading-tight text-[#11281f] sm:text-4xl">
                    {job?.jobTitle || 'School Opportunity'}
                  </h2>
                  <p className="mt-2 text-base font-semibold text-[#5f665e]">
                    {job?.department || 'Matungulu Girls Senior School'}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.35rem] border border-[#11281f12] bg-white px-4 py-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#5f665e]">Application Deadline</p>
                  <p className="mt-2 text-base font-black text-[#11281f]">{formatDeadline(job?.applicationDeadline)}</p>
                </div>
                <div className="rounded-[1.35rem] border border-[#11281f12] bg-white px-4 py-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#5f665e]">Positions Available</p>
                  <p className="mt-2 text-base font-black text-[#11281f]">{job?.positionsAvailable || 1}</p>
                </div>
                <div className="rounded-[1.35rem] border border-[#11281f12] bg-white px-4 py-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#5f665e]">Experience Level</p>
                  <p className="mt-2 text-base font-black text-[#11281f]">{job?.experience || 'Flexible'}</p>
                </div>
                <div className="rounded-[1.35rem] border border-[#11281f12] bg-white px-4 py-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#5f665e]">Institution</p>
                  <p className="mt-2 text-base font-black text-[#11281f]">Matungulu Girls Senior School</p>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                <section>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#0f5b4c]">Role Overview</p>
                  <p className="mt-3 text-sm leading-8 text-[#5f665e]">
                    {job?.jobDescription || 'Join the Matungulu Girls Senior School team and help strengthen academic excellence, student support, and professional service delivery.'}
                  </p>
                </section>

                {job?.requirements && (
                  <section>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#0f5b4c]">Requirements</p>
                    <p className="mt-3 text-sm leading-8 text-[#5f665e]">{job.requirements}</p>
                  </section>
                )}

                {job?.qualifications && (
                  <section>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#0f5b4c]">Qualifications</p>
                    <p className="mt-3 text-sm leading-8 text-[#5f665e]">{job.qualifications}</p>
                  </section>
                )}
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-[1.8rem] bg-[linear-gradient(145deg,#0f5b4c,#0b2f28)] p-6 text-white shadow-[0_24px_70px_rgba(15,91,76,0.22)]">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-white/58">Need To Know</p>
                <div className="mt-5 space-y-3">
                  <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.06] p-4">
                    <div className="flex items-start gap-3">
                      <FiStar className="mt-1 h-4 w-4 text-[#f6dd9b]" />
                      <p className="text-sm leading-7 text-white/75">
                        Roles here support a girls-centered school culture focused on discipline, growth, and excellence.
                      </p>
                    </div>
                  </div>
                  <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.06] p-4">
                    <div className="flex items-start gap-3">
                      <FiInfo className="mt-1 h-4 w-4 text-[#f6dd9b]" />
                      <p className="text-sm leading-7 text-white/75">
                        Include relevant credentials, experience, and the exact position title in your application.
                      </p>
                    </div>
                  </div>
                  <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.06] p-4">
                    <div className="flex items-start gap-3">
                      <FiCheckCircle className="mt-1 h-4 w-4 text-[#f6dd9b]" />
                      <p className="text-sm leading-7 text-white/75">
                        Strong applicants should demonstrate professionalism, learner support, and alignment with school values.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.8rem] border border-[#11281f12] bg-white p-6">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#0f5b4c]">Application Details</p>
                <div className="mt-5 space-y-4">
                  <a
                    href={`mailto:${job?.contactEmail || 'careers@matungulugirls.sc.ke'}?subject=Job Application: ${job?.jobTitle || 'Matungulu Girls Role'}`}
                    className="flex items-start gap-3 rounded-[1.2rem] border border-[#11281f12] bg-[#fffaf0] p-4"
                  >
                    <FiMail className="mt-1 h-4 w-4 text-[#0f5b4c]" />
                    <div>
                      <p className="text-sm font-black text-[#11281f]">Email Applications</p>
                      <p className="mt-1 text-sm text-[#5f665e]">{job?.contactEmail || 'careers@matungulugirls.sc.ke'}</p>
                    </div>
                  </a>

                  <a
                    href={`tel:${job?.contactPhone || '+254712345678'}`}
                    className="flex items-start gap-3 rounded-[1.2rem] border border-[#11281f12] bg-[#fffaf0] p-4"
                  >
                    <FiPhone className="mt-1 h-4 w-4 text-[#0f5b4c]" />
                    <div>
                      <p className="text-sm font-black text-[#11281f]">Phone Contact</p>
                      <p className="mt-1 text-sm text-[#5f665e]">{job?.contactPhone || '+254 712 345 678'}</p>
                    </div>
                  </a>

                  <button
                    onClick={() => onCopyEmail(job?.contactEmail || 'careers@matungulugirls.sc.ke')}
                    className="flex w-full items-start gap-3 rounded-[1.2rem] border border-[#11281f12] bg-[#fffaf0] p-4 text-left"
                  >
                    <FiCopy className="mt-1 h-4 w-4 text-[#0f5b4c]" />
                    <div>
                      <p className="text-sm font-black text-[#11281f]">Copy Application Email</p>
                      <p className="mt-1 text-sm text-[#5f665e]">Copy the official contact address for quick use.</p>
                    </div>
                  </button>
                </div>

                <button
                  onClick={() => onApply(job)}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0f5b4c] px-5 py-4 text-sm font-black text-white"
                >
                  Apply for This Role
                  <FiArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CareersPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [bookmarkedJobs, setBookmarkedJobs] = useState(new Set());

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('career_bookmarks') || '[]');
    setBookmarkedJobs(new Set(saved));
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/career');
        const data = await response.json();

        if (data.success && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        } else {
          setJobs([]);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast.error('Failed to load job listings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    let filtered = [...jobs];

    if (activeTab !== 'all') {
      filtered = filtered.filter(
        (job) => job?.category?.toLowerCase() === activeTab.toLowerCase()
      );
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job?.jobTitle?.toLowerCase().includes(query) ||
          job?.department?.toLowerCase().includes(query) ||
          job?.jobDescription?.toLowerCase().includes(query) ||
          job?.requirements?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [jobs, activeTab, search]);

  const categories = useMemo(() => {
    const dynamicCategories = [...new Set(jobs.map((job) => job?.category?.toLowerCase()).filter(Boolean))];
    return ['all', ...dynamicCategories];
  }, [jobs]);

  const stats = useMemo(() => {
    const departmentCount = new Set(jobs.map((job) => job?.department).filter(Boolean)).size;
    return [
      { ...statsBase[0], value: jobs.length.toString() },
      { ...statsBase[1], value: departmentCount ? departmentCount.toString() : '1' },
      { ...statsBase[2], value: 'Girls First' },
      { ...statsBase[3], value: '3+' },
    ];
  }, [jobs]);

  const refreshData = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/career');
      const data = await response.json();

      if (data.success && Array.isArray(data.jobs)) {
        setJobs(data.jobs);
        toast.success(`Refreshed! ${data.jobs.length} opportunities loaded`);
      } else {
        toast.error('No career opportunities returned');
      }
    } catch (error) {
      console.error('Error refreshing jobs:', error);
      toast.error('Failed to refresh job listings');
    } finally {
      setRefreshing(false);
    }
  };

  const handleBookmark = (job) => {
    const updated = new Set(bookmarkedJobs);
    if (updated.has(job.id)) {
      updated.delete(job.id);
      toast.success('Removed from saved opportunities');
    } else {
      updated.add(job.id);
      toast.success('Saved opportunity');
    }
    setBookmarkedJobs(updated);
    localStorage.setItem('career_bookmarks', JSON.stringify([...updated]));
  };

  const handleShare = async (job) => {
    const title = `${job?.jobTitle || 'Career Opportunity'} - Matungulu Girls Senior School`;
    const text = `Check out this school opportunity at Matungulu Girls Senior School: ${job?.jobTitle || 'Career Role'}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: window.location.href });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const handleShareAllJobs = () => {
    const text = `Check out current opportunities at Matungulu Girls Senior School. ${filteredJobs.length} role(s) currently available.`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + window.location.href)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShareWhatsApp = (job) => {
    const text = `Job Opening: ${job?.jobTitle || 'School Role'} at Matungulu Girls Senior School. ${job?.jobType || 'Full-time'} position in ${job?.department || 'various departments'}.`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + window.location.href)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleApply = (job) => {
    toast.success(`Application process for ${job?.jobTitle || 'this role'} is ready through the listed contact details.`);
  };

  const copyEmail = async (email) => {
    try {
      await navigator.clipboard.writeText(email);
      toast.success('Application email copied');
    } catch {
      toast.error('Could not copy email');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setActiveTab('all');
  };

  if (loading) {
    return <LoadingView />;
  }

  return (
    <div className="min-h-screen bg-[#061510] text-white">
      <Toaster position="top-right" richColors />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,177,95,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(15,91,76,0.32),transparent_38%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-18">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.28em] text-white/70">
              <IoSparkles className="h-4 w-4 text-[#d4b15f]" />
              Careers at Matungulu Girls
            </div>
            <h1 className="mt-5 text-4xl font-black leading-[0.95] text-white sm:text-6xl">
              A premium careers desk for school jobs and real opportunities.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-8 text-white/68 sm:text-base">
              Explore Matungulu Girls Senior School openings through a more modern recruitment workspace built for teachers, administrators, support teams, and professionals ready to contribute to a girls-centered institution.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  const section = document.getElementById('careers-openings');
                  if (section) section.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 rounded-full bg-[#d4b15f] px-5 py-3 text-sm font-black text-[#11241d]"
              >
                View Open Roles
                <FiArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={handleShareAllJobs}
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-5 py-3 text-sm font-black text-white"
              >
                <FaWhatsapp className="h-4 w-4 text-[#d4b15f]" />
                Share Openings
              </button>
            </div>
          </div>

          <div className="grid gap-4">
            <InfoCard
              icon={IoSchoolOutline}
              title="School-specific recruitment"
              text="This page is tailored for Matungulu Girls Senior School vacancies, with more emphasis on school culture, learner support, and professional fit."
              tone="gold"
            />
   <div className="grid gap-4 grid-cols-1">
  <InfoCard
    icon={FiMapPin}
    title="Location"
    text="Matungulu Sub County, Machakos County, Kenya."
  />
  <InfoCard
    icon={FiMail}
    title="HR Contact"
    text="careers@matungulugirls.sc.ke for role-related submissions and inquiries."
  />
</div>
          </div>
        </div>
      </section>

   <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {stats.map((stat) => (
      <StatPanel key={stat.label} stat={stat} value={stat.value} />
    ))}
  </div>
</section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-20 sm:px-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.16)] backdrop-blur-xl">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-white/45">Need To Know</p>
            <div className="mt-5 space-y-3">
              <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.04] p-4">
                <div className="flex items-start gap-3">
                  <FiStar className="mt-1 h-4 w-4 text-[#d4b15f]" />
                  <p className="text-sm leading-7 text-white/68">
                    Roles here support a girls’ school environment focused on discipline, growth, mentorship, and academic excellence.
                  </p>
                </div>
              </div>
              <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.04] p-4">
                <div className="flex items-start gap-3">
                  <FiSend className="mt-1 h-4 w-4 text-[#d4b15f]" />
                  <p className="text-sm leading-7 text-white/68">
                    Applications should clearly state the exact position title and include relevant academic or professional documents.
                  </p>
                </div>
              </div>
              <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.04] p-4">
                <div className="flex items-start gap-3">
                  <FiAward className="mt-1 h-4 w-4 text-[#d4b15f]" />
                  <p className="text-sm leading-7 text-white/68">
                    Strong applicants will usually show professionalism, educational impact, and alignment with school values.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-[linear-gradient(145deg,#0f5b4c,#0b2f28)] p-6 text-white shadow-[0_24px_70px_rgba(15,91,76,0.22)]">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-white/55">School Contact</p>
            <div className="mt-5 space-y-4">
              <div className="flex items-start gap-3">
                <FiMapPin className="mt-1 h-4 w-4 text-[#f6dd9b]" />
                <div>
                  <p className="text-sm font-black">School Location

</p>
                  <p className="mt-1 text-sm text-white/70">Matungulu Sub County, Machakos, Kenya</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiMail className="mt-1 h-4 w-4 text-[#f6dd9b]" />
                <div>
                  <p className="text-sm font-black">Careers Email</p>
                  <p className="mt-1 text-sm text-white/70">careers@matungulugirls.sc.ke</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiPhone className="mt-1 h-4 w-4 text-[#f6dd9b]" />
                <div>
                  <p className="text-sm font-black">Phone Contact</p>
                  <p className="mt-1 text-sm text-white/70">+254 712 345 678</p>
                </div>
              </div>
            </div>
            <div className="mt-6 rounded-[1.3rem] border border-white/10 bg-white/[0.06] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/55">School Motto</p>
              <p className="mt-2 text-sm font-black text-white">Prayer, Discipline and Hardwork</p>
            </div>
          </div>
        </aside>

        <main id="careers-openings" className="space-y-6">
          <div className="rounded-[2rem] border border-[#11281f12] bg-[#fffaf0] p-4 shadow-[0_24px_60px_rgba(17,40,31,0.08)] sm:p-6">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
                <div className="relative">
                  <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5f665e]" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search school roles, departments, or requirements"
                    className="w-full rounded-[1.35rem] border border-[#11281f12] bg-white px-12 py-4 text-sm font-semibold text-[#11281f] outline-none transition focus:border-[#0f5b4c]"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={clearFilters}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-[1.35rem] border border-[#11281f12] bg-white px-4 py-4 text-sm font-black text-[#11281f]"
                  >
                    <FiFilter className="h-4 w-4 text-[#0f5b4c]" />
                    Reset
                  </button>
                  <button
                    onClick={refreshData}
                    disabled={refreshing}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-[1.35rem] bg-[#0f5b4c] px-4 py-4 text-sm font-black text-white disabled:opacity-60"
                  >
                    {refreshing ? <CircularProgress size={16} thickness={5} sx={{ color: 'white' }} /> : <FiRefreshCw className="h-4 w-4" />}
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-black transition ${
                    viewMode === 'grid' ? 'bg-[#0f5b4c] text-white' : 'border border-[#11281f12] bg-white text-[#11281f]'
                  }`}
                >
                  <FiGrid className="h-4 w-4" />
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-black transition ${
                    viewMode === 'list' ? 'bg-[#0f5b4c] text-white' : 'border border-[#11281f12] bg-white text-[#11281f]'
                  }`}
                >
                  <FiList className="h-4 w-4" />
                  Ledger
                </button>
              </div>
            </div>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
              {categories.map((categoryId) => {
                const config = getCategoryMeta(categoryId);
                const Icon = config.icon;
                const active = activeTab === categoryId;

                return (
                  <button
                    key={categoryId}
                    onClick={() => setActiveTab(categoryId)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-3 text-sm font-black transition ${
                      active
                        ? 'bg-[#11281f] text-white shadow-[0_14px_28px_rgba(17,40,31,0.18)]'
                        : 'border border-[#11281f12] bg-white text-[#11281f]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {config.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-white/45">Recruitment Board</p>
              <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                Current school openings
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-black text-white">
              <FiBriefcase className="h-4 w-4 text-[#d4b15f]" />
              {filteredJobs.length} role{filteredJobs.length === 1 ? '' : 's'} available
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <EmptyState onClear={clearFilters} />
          ) : (
            <div className={viewMode === 'grid' ? 'grid gap-5 md:grid-cols-2' : 'space-y-5'}>
              {filteredJobs.map((job, index) => (
                <OpportunityCard
                  key={job.id || index}
                  job={job}
                  viewMode={viewMode}
                  bookmarked={bookmarkedJobs.has(job.id)}
                  onBookmark={handleBookmark}
                  onView={setSelectedJob}
                  onShareWhatsApp={handleShareWhatsApp}
                />
              ))}
            </div>
          )}

          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,#0f5b4c,#0b2f28)] p-6 shadow-[0_24px_70px_rgba(15,91,76,0.22)] sm:p-8">
            <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-white/58">Why Join Us</p>
                <h3 className="mt-4 text-3xl font-black text-white">Build your career inside a school community that shapes young women.</h3>
                <p className="mt-4 text-sm leading-8 text-white/72">
                  Matungulu Girls Senior School opportunities are not just jobs. They are openings to serve learners, strengthen systems, mentor girls, and help sustain a school culture built on purpose and excellence.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.06] p-4">
                  <FiTrendingUp className="h-5 w-5 text-[#f6dd9b]" />
                  <p className="mt-3 text-sm font-black text-white">Professional Growth</p>
                </div>
                <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.06] p-4">
                  <FiUsers className="h-5 w-5 text-[#f6dd9b]" />
                  <p className="mt-3 text-sm font-black text-white">Supportive Teams</p>
                </div>
                <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.06] p-4">
                  <FaGraduationCap className="h-5 w-5 text-[#f6dd9b]" />
                  <p className="mt-3 text-sm font-black text-white">Education Impact</p>
                </div>
                <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.06] p-4">
                  <FaLeaf className="h-5 w-5 text-[#f6dd9b]" />
                  <p className="mt-3 text-sm font-black text-white">Values-led Culture</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </section>

      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={handleApply}
          onCopyEmail={copyEmail}
        />
      )}
    </div>
  );
}
