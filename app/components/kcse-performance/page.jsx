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
      className={`rounded-[1.65rem] border p-5 ${
        dark
          ? 'border-white/10 bg-white/10 text-white'
          : 'border-slate-200 bg-white text-slate-950 shadow-[0_20px_60px_-48px_rgba(15,23,42,0.45)]'
      }`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
            dark ? 'bg-white/10 text-emerald-200' : 'bg-emerald-50 text-emerald-700'
          }`}
        >
          <Icon size={18} />
        </div>
        <span className={`text-[10px] font-black uppercase tracking-[0.18em] ${dark ? 'text-emerald-100/70' : 'text-slate-400'}`}>
          KCSE
        </span>
      </div>
      <p className={`text-xs font-black uppercase tracking-[0.16em] ${dark ? 'text-emerald-100/75' : 'text-slate-500'}`}>
        {label}
      </p>
      <p className="mt-2 text-3xl font-black tracking-tight">{value}</p>
      {note && <p className={`mt-2 text-sm leading-6 ${dark ? 'text-white/68' : 'text-slate-500'}`}>{note}</p>}
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
        <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center">
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

      <section className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 sm:pt-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#0b2f27] text-white shadow-[0_35px_90px_-65px_rgba(15,23,42,0.75)]">
          <div className="absolute inset-0">
            <Image
              src="/Matungulu/9.jpeg"
              alt="Matungulu Girls students celebrating academic excellence"
              fill
              priority
              className="object-cover opacity-30"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,43,36,0.96),rgba(6,43,36,0.82),rgba(6,43,36,0.5))]" />
          </div>

          <div className="relative grid gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-100">
                <IoSchoolOutline className="text-sm" />
                KCSE Performance
              </div>

              <h1 className="mt-5 max-w-3xl text-3xl font-black leading-none tracking-tight text-white sm:text-4xl lg:text-6xl">
                KCSE results, progress and academic targets.
              </h1>

              <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-white/76 sm:text-base">
                A clear performance desk for the latest official KCSE document, school mean score,
                previous mean and the next academic target.
              </p>

              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/15 p-5 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-100">
                    <IoSparkles />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-100/75">School Slogan</p>
                    <blockquote className="mt-2 text-xl font-black leading-tight text-white sm:text-2xl">
                      &quot;{stats.slogan || defaultStats.slogan}&quot;
                    </blockquote>
                    <p className="mt-2 text-sm leading-6 text-white/65">
                      {stats.sloganDescription || defaultStats.sloganDescription}
                    </p>
                    <p className="mt-3 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200">
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

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[0.82fr_1.18fr]">
        <aside className="space-y-5">
          <div className="rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-48px_rgba(15,23,42,0.45)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">Performance Summary</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Academic movement</h2>
              </div>
              <button
                onClick={() => fetchPerformance(true)}
                disabled={refreshing}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-60"
                aria-label="Refresh KCSE performance"
              >
                <FiRefreshCw className={refreshing ? 'animate-spin' : ''} />
              </button>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-emerald-600" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Mean {formatScore(meanScore)}</span>
              <span>Target {formatScore(targetMean)}</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
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

        <section className="rounded-[1.8rem] border border-slate-200 bg-white p-4 shadow-[0_22px_70px_-50px_rgba(15,23,42,0.5)] sm:p-5">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">Official Document</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                {document?.year ? `${document.year} KCSE results` : 'KCSE results document'}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {document?.description || document?.name || 'The latest available KCSE PDF is displayed below.'}
              </p>
            </div>

            {pdfUrl && (
              <div className="flex flex-wrap gap-2">
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-700 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <FiExternalLink size={14} />
                  Open
                </a>
                <a
                  href={pdfUrl}
                  download={document?.name || 'kcse-results.pdf'}
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-white transition-colors hover:bg-emerald-800"
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
            <div className="overflow-hidden rounded-[1.4rem] border border-slate-200 bg-slate-100">
              <iframe
                src={pdfViewerUrl}
                title="KCSE results PDF preview"
                className="h-[72vh] min-h-[520px] w-full bg-white"
              />
            </div>
          ) : (
            <div className="flex min-h-[520px] items-center justify-center rounded-[1.4rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                  <FiFileText size={22} />
                </div>
                <h3 className="mt-4 text-lg font-black text-slate-900">No KCSE PDF uploaded yet</h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Upload a KCSE results document from the school documents dashboard and it will appear here automatically.
                </p>
              </div>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
