'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  FiAward,
  FiBarChart2,
  FiCalendar,
  FiDownload,
  FiExternalLink,
  FiFileText,
  FiRefreshCw,
  FiTarget,
  FiTrendingUp,
} from 'react-icons/fi';
import { IoSchoolOutline, IoSparkles } from 'react-icons/io5';
import { CircularProgress, Stack } from '@mui/material';
import { Toaster, toast } from 'sonner';

const defaultStats = {
  meanScore: 8.14,
  lastYearMean: 7.85,
  targetMean: 8.5,
  slogan: 'Committed to Excellence',
  sloganDescription: 'Every learner, every subject, every term moving with purpose.',
  sloganAuthor: 'Matungulu Girls Senior School',
};

const formatScore = (value) => {
  const score = Number(value);
  return Number.isFinite(score) ? score.toFixed(2) : '-';
};

const formatDate = (dateValue) => {
  if (!dateValue) return 'Recently updated';
  try {
    return new Date(dateValue).toLocaleDateString('en-KE', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Recently updated';
  }
};

const formatFileSize = (size) => {
  if (!size) return 'PDF document';
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const StatPanel = ({ icon: Icon, label, value, note, tone = 'light' }) => {
  const dark = tone === 'dark';

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 ${
        dark
          ? 'border-white/10 bg-white/[0.08] text-white backdrop-blur-md'
          : 'border-slate-200 bg-white text-slate-950 shadow-[0_18px_55px_-46px_rgba(15,23,42,0.45)]'
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            dark ? 'bg-white/10 text-emerald-200' : 'bg-emerald-50 text-emerald-700'
          }`}
        >
          <Icon size={17} />
        </div>
        <span className={`text-[9px] font-black uppercase tracking-[0.18em] ${dark ? 'text-emerald-100/70' : 'text-slate-400'}`}>
          KCSE
        </span>
      </div>
      <p className={`text-[11px] font-black uppercase tracking-[0.14em] ${dark ? 'text-emerald-100/75' : 'text-slate-500'}`}>
        {label}
      </p>
      <p className="mt-1.5 text-2xl font-black tracking-tight sm:text-3xl">{value}</p>
      {note && <p className={`mt-1.5 text-xs leading-5 ${dark ? 'text-white/62' : 'text-slate-500'}`}>{note}</p>}
    </div>
  );
};

export default function KcsePerformancePage() {
  const [payload, setPayload] = useState({ stats: defaultStats, document: null });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPerformance = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);

    try {
      const [documentsResponse, statsResponse] = await Promise.all([
        fetch('/api/schooldocuments', { cache: 'no-store' }),
        fetch('/api/school-stats', { cache: 'no-store' }),
      ]);

      const [documentsData, statsData] = await Promise.all([
        documentsResponse.json(),
        statsResponse.json(),
      ]);

      if (!documentsResponse.ok || !documentsData.success) {
        throw new Error(documentsData.error || 'Unable to load school documents');
      }

      if (!statsResponse.ok || !statsData.success) {
        throw new Error(statsData.error || 'Unable to load school stats');
      }

      const schoolDocument = documentsData.document || {};
      const kcseDocument = schoolDocument.kcseResultsPdf
        ? {
            url: schoolDocument.kcseResultsPdf,
            name: schoolDocument.kcsePdfName || 'KCSE results.pdf',
            size: schoolDocument.kcsePdfSize,
            uploadDate: schoolDocument.kcseUploadDate,
            description: schoolDocument.kcseDescription,
            year: schoolDocument.kcseYear,
            term: schoolDocument.kcseTerm,
            source: 'school-documents',
          }
        : null;

      setPayload({
        stats: { ...defaultStats, ...(statsData.stats || {}) },
        document: kcseDocument,
      });

      if (showRefresh) toast.success('KCSE performance refreshed');
    } catch (error) {
      console.error(error);
      toast.error('Could not load KCSE performance data');
      setPayload((current) => ({ ...current, stats: current.stats || defaultStats }));
    } finally {
      setLoading(false);
      if (showRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPerformance();
  }, []);

  const stats = payload.stats || defaultStats;
  const document = payload.document;
  const meanScore = Number(stats.meanScore) || defaultStats.meanScore;
  const previousMean = Number(stats.lastYearMean) || defaultStats.lastYearMean;
  const targetMean = Number(stats.targetMean) || defaultStats.targetMean;
  const movement = meanScore - previousMean;

  const progress = useMemo(() => {
    if (!targetMean) return 0;
    return Math.min(100, Math.max(0, Math.round((meanScore / targetMean) * 100)));
  }, [meanScore, targetMean]);

  const pdfUrl = document?.url || '';
  const pdfViewerUrl = pdfUrl ? `${pdfUrl}#toolbar=1&navpanes=0&view=FitH` : '';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7faf8] px-4 py-16">
        <div className="mx-auto flex min-h-[60vh] w-full items-center justify-center md:w-[85%]">
          <Stack spacing={2} alignItems="center">
            <CircularProgress size={48} thickness={4.5} sx={{ color: '#047857' }} />
            <div className="text-center">
              <p className="text-sm font-bold text-slate-700">Loading KCSE performance...</p>
              <p className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Matungulu Girls</p>
            </div>
          </Stack>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7faf8] text-slate-950">
      <Toaster position="top-right" richColors />

      <section className="mx-auto w-full px-4 pt-4 sm:px-6 sm:pt-6 md:w-[85%]">
        <div className="relative overflow-hidden rounded-[1.6rem] bg-[#0b2f27] text-white shadow-[0_26px_75px_-60px_rgba(15,23,42,0.75)] sm:rounded-[1.9rem]">
          <div className="absolute inset-0">
            <Image
              src="/Matungulu/9.jpeg"
              alt="Matungulu Girls students celebrating academic excellence"
              fill
              priority
              className="object-cover opacity-16"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,43,36,0.98),rgba(6,43,36,0.9),rgba(6,43,36,0.75))]" />
          </div>

          <div className="relative grid gap-5 px-4 py-5 sm:px-6 sm:py-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-7">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-100">
                <IoSchoolOutline className="text-sm" />
                KCSE Performance
              </div>

              <h1 className="mt-3 max-w-3xl text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
                KCSE results, progress and academic targets.
              </h1>

              <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-white/70">
                A clear performance desk for the latest official KCSE document, school mean score,
                previous mean and the next academic target.
              </p>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/12 p-4 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-100">
                    <IoSparkles />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-100/75">School Slogan</p>
                    <blockquote className="mt-1.5 text-lg font-black leading-tight text-white sm:text-xl">
                      &quot;{stats.slogan || defaultStats.slogan}&quot;
                    </blockquote>
                    <p className="mt-1.5 text-xs leading-5 text-white/62 sm:text-sm">
                      {stats.sloganDescription || defaultStats.sloganDescription}
                    </p>
                    <p className="mt-2 text-[9px] font-black uppercase tracking-[0.16em] text-emerald-200">
                      {stats.sloganAuthor || defaultStats.sloganAuthor}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <StatPanel
                icon={FiBarChart2}
                label="Mean Score"
                value={formatScore(meanScore)}
                note="Current published school mean."
                tone="dark"
              />
              <StatPanel
                icon={FiTarget}
                label="Target Mean"
                value={formatScore(targetMean)}
                note={`${progress}% of the target already reached.`}
                tone="dark"
              />
              <StatPanel
                icon={FiTrendingUp}
                label="Previous Mean"
                value={formatScore(previousMean)}
                note={`${movement >= 0 ? '+' : ''}${movement.toFixed(2)} movement from previous mean.`}
                tone="dark"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full gap-5 px-4 py-5 sm:px-6 sm:py-7 md:w-[85%] lg:grid-cols-[0.78fr_1.22fr]">
        <aside className="space-y-4">
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-[0_18px_55px_-48px_rgba(15,23,42,0.45)] sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">Performance Summary</p>
                <h2 className="mt-1.5 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">Academic movement</h2>
              </div>
              <button
                onClick={() => fetchPerformance(true)}
                disabled={refreshing}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-60"
                aria-label="Refresh KCSE performance"
              >
                <FiRefreshCw className={refreshing ? 'animate-spin' : ''} />
              </button>
            </div>

            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-emerald-600" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Mean {formatScore(meanScore)}</span>
              <span>Target {formatScore(targetMean)}</span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <StatPanel
              icon={FiAward}
              label="University Transition"
              value="84%"
              note="Recorded in the public achievements profile for the 2025 KCSE class."
            />
            <StatPanel
              icon={FiFileText}
              label="Top Grades"
              value="1 A, 15 A-"
              note="Top-grade performance highlighted in the school achievement record."
            />
            <StatPanel
              icon={FiCalendar}
              label="Document Update"
              value={formatDate(document?.uploadDate || stats.updatedAt)}
              note={document?.source === 'local-fallback' ? 'Loaded from the local KCSE results folder.' : 'Loaded from school documents.'}
            />
          </div>
        </aside>

        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-[0_22px_70px_-54px_rgba(15,23,42,0.5)] sm:p-5">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">Official Document</p>
              <h2 className="mt-1.5 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                {document?.year ? `${document.year} KCSE results` : 'KCSE results document'}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {document?.description || document?.name || 'The latest available KCSE PDF is displayed below.'}
              </p>
            </div>

            {pdfUrl && (
              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-700 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <FiExternalLink size={14} />
                  Open
                </a>
                <a
                  href={pdfUrl}
                  download={document?.name || 'kcse-results.pdf'}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-white transition-colors hover:bg-emerald-800"
                >
                  <FiDownload size={14} />
                  Download
                </a>
              </div>
            )}
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{document?.name || 'KCSE PDF'}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">{formatFileSize(document?.size)}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">{formatDate(document?.uploadDate)}</span>
          </div>

          {pdfViewerUrl ? (
            <div className="overflow-hidden rounded-[1.2rem] border border-slate-200 bg-slate-100">
              <iframe
                src={pdfViewerUrl}
                title="KCSE results PDF preview"
                className="h-[62vh] min-h-[420px] w-full bg-white sm:min-h-[480px]"
              />
            </div>
          ) : (
            <div className="flex min-h-[360px] items-center justify-center rounded-[1.2rem] border border-dashed border-slate-300 bg-slate-50 p-6 text-center sm:min-h-[420px]">
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                  <FiFileText size={22} />
                </div>
                <h3 className="mt-4 text-lg font-black text-slate-900">No KCSE PDF uploaded yet</h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  KCSE results documents will be available here soon. Check back later for updates.
                </p>
              </div>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
