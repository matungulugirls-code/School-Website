'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  FiArchive,
  FiAward,
  FiBarChart2,
  FiCalendar,
  FiCopy,
  FiDownload,
  FiExternalLink,
  FiEye,
  FiFileText,
  FiFilter,
  FiFolder,
  FiGrid,
  FiList,
  FiRefreshCw,
  FiSearch,
  FiShare2,
  FiTarget,
  FiTrendingUp,
  FiX,
} from 'react-icons/fi';
import { IoClose, IoSchoolOutline, IoSparkles } from 'react-icons/io5';
import { Box, CircularProgress, Stack } from '@mui/material';
import { Toaster, toast } from 'sonner';

// defaultStats removed – now using API only

const sourceOptions = [
  { id: 'school-documents', name: 'Official Upload', icon: FiAward, gradient: 'from-emerald-500 to-teal-500' },
];

const sourceStyles = {
  'school-documents': {
    label: 'Official Upload',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: 'bg-emerald-100 text-emerald-700',
    gradient: 'from-emerald-500 to-teal-500',
  },
  fallback: {
    label: 'KCSE Results',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: 'bg-emerald-100 text-emerald-700',
    gradient: 'from-slate-500 to-slate-700',
  },
};

const getSourceStyle = (source) => sourceStyles[source] || sourceStyles.fallback;

const formatScore = (value) => {
  const score = Number(value);
  return Number.isFinite(score) ? score.toFixed(2) : '-';
};

const formatDate = (dateValue) => {
  if (!dateValue) return 'Recently updated';

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 'Recently updated';

  return date.toLocaleDateString('en-KE', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatFileSize = (size) => {
  const fileSize = Number(size);
  if (!Number.isFinite(fileSize) || fileSize <= 0) return 'Document';
  if (fileSize < 1024 * 1024) return `${(fileSize / 1024).toFixed(1)} KB`;
  return `${(fileSize / (1024 * 1024)).toFixed(1)} MB`;
};

const getAbsoluteUrl = (url) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (typeof window === 'undefined') return url;
  return `${window.location.origin}${url}`;
};

const isPdfDocument = (document) => {
  const target = `${document?.name || ''} ${document?.url || ''}`.toLowerCase();
  return target.includes('.pdf');
};

const MetricCard = ({ icon: Icon, label, value, note, gradient }) => (
  <div className="group relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70">
    <div className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${gradient} opacity-0 transition-opacity group-hover:opacity-100`} />
    <div className="mb-4 flex items-center gap-4">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg shadow-slate-300/40`}>
        <Icon size={20} />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
    </div>
    <p className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{value}</p>
    <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">{note}</p>
  </div>
);

const DocumentCard = ({ document, viewMode, onOpen, onShare }) => {
  const style = getSourceStyle(document.source);

  if (viewMode === 'list') {
    return (
      <div
        onClick={() => onOpen(document)}
        className="group cursor-pointer rounded-[24px] border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-emerald-100 hover:shadow-md"
      >
        <div className="flex gap-4">
          <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${style.gradient} text-white shadow-lg`}>
            <FiFileText size={28} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-widest ${style.badge}`}>
                {style.label}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{formatDate(document.uploadDate)}</span>
            </div>

            <h3 className="line-clamp-2 text-base font-black leading-snug text-slate-950">{document.title || document.name}</h3>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{document.description || 'KCSE performance document.'}</p>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-slate-500">
                <span className="flex items-center gap-1">
                  <FiCalendar size={12} />
                  {document.year || 'Archive'}
                </span>
                <span className="flex items-center gap-1">
                  <FiFileText size={12} />
                  {formatFileSize(document.size)}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onShare(document);
                  }}
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
                  aria-label={`Copy link for ${document.title || document.name}`}
                >
                  <FiShare2 size={15} />
                </button>
                <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-700 transition-transform group-hover:translate-x-1">
                  View <FiExternalLink size={12} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onOpen(document)}
      className="group relative cursor-pointer"
    >
      <div className="overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70">
        <div className={`relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br ${style.gradient}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.18)_1px,transparent_0)] [background-size:28px_28px]" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />

          <div className="relative flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/20 bg-white/15 text-white backdrop-blur-sm transition-transform duration-500 group-hover:scale-105">
            <FiFileText size={42} />
          </div>

          <div className="absolute left-4 top-4 flex flex-col gap-2">
            <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm ${style.badge}`}>
              {style.label}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-slate-900/90 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-sm">
              <IoSparkles className="text-amber-300" />
              {document.year || 'KCSE'}
            </span>
          </div>

          <div className="absolute right-4 top-4 flex gap-2">
            <button
              onClick={(event) => {
                event.stopPropagation();
                onShare(document);
              }}
              className="rounded-xl border border-white/20 bg-white/90 p-2.5 text-slate-700 shadow-sm backdrop-blur-md transition-colors hover:bg-white"
              aria-label={`Copy link for ${document.title || document.name}`}
            >
              <FiShare2 size={16} />
            </button>
            <a
              href={document.url}
              onClick={(event) => event.stopPropagation()}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/20 bg-white/90 p-2.5 text-slate-700 shadow-sm backdrop-blur-md transition-colors hover:bg-white"
              aria-label={`Open ${document.title || document.name}`}
            >
              <FiExternalLink size={16} />
            </a>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white">
              {formatFileSize(document.size)}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white">
              {formatDate(document.uploadDate)}
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <h3 className="line-clamp-2 text-lg font-black leading-tight text-slate-950 sm:text-xl">
            {document.title || document.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
            {document.description || 'KCSE performance document.'}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-2">
              <div className={`rounded-lg p-1.5 ${style.icon}`}>
                <FiCalendar size={12} />
              </div>
              <span className="truncate text-[11px] font-bold uppercase tracking-tight text-slate-700">
                {document.year || 'Archive'}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-2">
              <div className={`rounded-lg p-1.5 ${style.icon}`}>
                <FiFileText size={12} />
              </div>
              <span className="truncate text-[11px] font-bold uppercase tracking-tight text-slate-700">
                {isPdfDocument(document) ? 'PDF' : 'Document'}
              </span>
            </div>
          </div>

          <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3 text-sm font-semibold text-white transition-colors group-hover:bg-emerald-700">
            <FiEye size={15} />
            Preview Document
          </button>
        </div>
      </div>
    </div>
  );
};

const DocumentPreviewModal = ({ document, onClose, onShare }) => {
  if (!document) return null;

  const canEmbedPdf = isPdfDocument(document);
  const viewerUrl = canEmbedPdf ? `${document.url}#toolbar=1&navpanes=0&view=FitH` : document.url;
  const style = getSourceStyle(document.source);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-0 backdrop-blur-sm sm:p-4">
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl sm:h-[92vh] sm:max-w-5xl sm:rounded-[36px]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-[200] rounded-full border border-white/20 bg-black/20 p-2 text-white backdrop-blur-md transition-transform active:scale-95 hover:bg-black/40"
          aria-label="Close KCSE preview"
        >
          <IoClose size={21} />
        </button>
        <div className={`relative overflow-hidden bg-gradient-to-r ${style.gradient} px-4 py-5 text-white sm:px-6`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.12)_1px,transparent_0)] [background-size:30px_30px]" />

          <div className="relative z-10 pr-12">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-sm">
                {style.label}
              </span>
              <span className="rounded-full bg-black/15 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white/90">
                {formatDate(document.uploadDate)}
              </span>
            </div>
            <h2 className="max-w-3xl text-2xl font-black leading-tight tracking-tight sm:text-3xl">
              {document.title || document.name}
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-white/78">
              {document.description || 'KCSE performance document.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-white px-4 py-3 sm:px-6">
          <div className="flex min-w-0 flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
            <span className="rounded-full bg-slate-100 px-3 py-1">{document.name || 'KCSE document'}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">{formatFileSize(document.size)}</span>
            {document.year && <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{document.year}</span>}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onShare(document)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate-700 transition-colors hover:bg-slate-100"
            >
              <FiCopy size={14} />
              <span className="hidden sm:inline">Copy</span>
            </button>
            <a
              href={document.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate-700 transition-colors hover:bg-slate-100"
            >
              <FiExternalLink size={14} />
              <span className="hidden sm:inline">Open</span>
            </a>
            <a
              href={document.url}
              download={document.name || 'kcse-results.pdf'}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-white transition-colors hover:bg-emerald-800"
            >
              <FiDownload size={14} />
              <span className="hidden sm:inline">Save</span>
            </a>
          </div>
        </div>

        <div className="min-h-0 flex-1 bg-slate-100 p-2 sm:p-4">
          {canEmbedPdf ? (
            <iframe
              src={viewerUrl}
              title={`${document.title || document.name} preview`}
              className="h-full min-h-[62vh] w-full rounded-2xl border border-slate-200 bg-white"
            />
          ) : (
            <div className="flex h-full min-h-[62vh] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
              <div>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                  <FiFileText size={28} />
                </div>
                <h3 className="mt-4 text-lg font-black text-slate-950">Preview is not available</h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Open or download this document to view it on your device.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function KcsePerformancePage() {
  // Stats from /api/school-stats
  const [schoolStats, setSchoolStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  // Documents from /api/kcse-performance
  const [documents, setDocuments] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(true);

  const [activeSource, setActiveSource] = useState('school-documents');
  const [selectedYear, setSelectedYear] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch school stats from dedicated endpoint
  const fetchSchoolStats = async () => {
    setStatsLoading(true);
    try {
      const response = await fetch('/api/school-stats', { cache: 'no-store' });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load school statistics');
      }

      setSchoolStats(data.stats || null);
    } catch (error) {
      console.error(error);
      toast.error('Could not load school performance stats');
      setSchoolStats(null);
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch KCSE documents from existing endpoint
  const fetchDocuments = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    setDocumentsLoading(true);

    try {
      const response = await fetch('/api/kcse-performance', { cache: 'no-store' });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Unable to load KCSE documents');
      }

      setDocuments(Array.isArray(data.documents) ? data.documents : []);

      if (showRefresh) toast.success('KCSE documents refreshed');
    } catch (error) {
      console.error(error);
      toast.error('Could not load KCSE documents');
      setDocuments([]);
    } finally {
      setDocumentsLoading(false);
      if (showRefresh) setRefreshing(false);
    }
  };

  // Combined refresh
  const refreshAll = async () => {
    setRefreshing(true);
    await Promise.all([fetchSchoolStats(), fetchDocuments()]);
    setRefreshing(false);
    toast.success('Performance data updated');
  };

  useEffect(() => {
    fetchSchoolStats();
    fetchDocuments();
  }, []);

  // Derive values from school stats (API data only, no fallback defaults)
  const meanScore = schoolStats?.meanScore ? Number(schoolStats.meanScore) : 0;
  const previousMean = schoolStats?.lastYearMean ? Number(schoolStats.lastYearMean) : 0;
  const targetMean = schoolStats?.targetMean ? Number(schoolStats.targetMean) : 0;
  const movement = previousMean > 0 ? meanScore - previousMean : 0;

  const progress = useMemo(() => {
    if (!targetMean) return 0;
    return Math.min(100, Math.max(0, Math.round((meanScore / targetMean) * 100)));
  }, [meanScore, targetMean]);

  const years = useMemo(() => {
    const yearSet = new Set();
    documents.forEach((document) => {
      if (document.year) yearSet.add(String(document.year));
    });
    return Array.from(yearSet).sort((a, b) => Number(b) - Number(a));
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return documents
      .filter((document) => {
        const matchesYear = selectedYear === 'all' || String(document.year) === selectedYear;
        const matchesSearch =
          !search ||
          [document.title, document.name, document.description, document.year]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(search));

        return matchesYear && matchesSearch;
      })
      .sort((a, b) => new Date(b.uploadDate || 0) - new Date(a.uploadDate || 0));
  }, [documents, searchTerm, selectedYear]);

  const latestDocument = documents[0] || null;
  const documentCount = documents.length;

  // Metrics based on real API data (or "N/A" if missing)
  const metricCards = [
    {
      icon: FiBarChart2,
      label: 'Mean Score',
      value: meanScore > 0 ? formatScore(meanScore) : 'N/A',
      note: previousMean > 0 && meanScore > 0 ? `${movement >= 0 ? '+' : ''}${movement.toFixed(2)} from previous mean.` : 'No data available',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: FiTarget,
      label: 'Target Mean',
      value: targetMean > 0 ? formatScore(targetMean) : 'N/A',
      note: targetMean > 0 ? `${progress}% of the academic target reached.` : 'Target not set',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: FiAward,
      label: 'KCSE Files',
      value: String(documentCount),
      note: documentCount === 0 ? 'No KCSE documents uploaded yet.' : documentCount === 1 ? '1 official KCSE document.' : `${documentCount} official KCSE documents.`,
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: FiCalendar,
      label: 'Latest Year',
      value: latestDocument?.year ? String(latestDocument.year) : 'N/A',
      note: latestDocument ? formatDate(latestDocument.uploadDate) : 'No documents available',
      gradient: 'from-amber-500 to-orange-500',
    },
  ];

  const shareDocument = async (document) => {
    const url = getAbsoluteUrl(document.url);

    try {
      await navigator.clipboard.writeText(url);
      toast.success('KCSE document link copied');
    } catch (error) {
      console.error(error);
      toast.error('Could not copy the document link');
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setActiveSource('school-documents');
    setSelectedYear('all');
  };

  // Show loading until both stats and documents are fetched
  const isLoading = statsLoading || documentsLoading;

  if (isLoading) {
    return (
      <Box className="flex min-h-[70vh] items-center justify-center bg-transparent p-4">
        <Stack spacing={2} alignItems="center" className="w-full">
          <Box className="relative flex items-center justify-center">
            <CircularProgress variant="determinate" value={100} size={52} thickness={4.5} sx={{ color: '#f1f5f9' }} />
            <CircularProgress
              variant="indeterminate"
              disableShrink
              size={52}
              thickness={4.5}
              sx={{
                color: '#047857',
                animationDuration: '1000ms',
                position: 'absolute',
                '& .MuiCircularProgress-circle': { strokeLinecap: 'round' },
              }}
            />
            <Box className="absolute">
              <IoSparkles className="animate-pulse text-sm text-emerald-600" />
            </Box>
          </Box>
          <div className="px-4 text-center">
            <p className="text-sm font-semibold italic tracking-tight text-slate-900 sm:text-base">Loading KCSE performance...</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Matungulu Girls Senior School</p>
          </div>
        </Stack>
      </Box>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/25 to-purple-50/20 p-4 text-slate-950 md:p-6">
      <Toaster position="top-right" richColors />

      <div className="mx-auto w-full space-y-6 md:w-[85%]">
        <section className="relative mx-auto overflow-hidden rounded-2xl shadow-2xl md:w-[90%] md:rounded-xl lg:w-[85%] xl:w-[80%]">
          <img
            src="/Matungulu/9.jpeg"
            alt="Matungulu Girls Senior School academic performance"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(6,78,59,0.96),rgba(15,91,76,0.9),rgba(15,23,42,0.72))]" />
          <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:40px_40px]" />

          <div className="relative z-10 p-6 sm:p-10">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500">
                  <span className="text-[8px] font-black text-white">MG</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white">Matungulu Girls</span>
              </div>

              <div className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/65">Live KCSE Desk</span>
              </div>
            </div>

            <div className="mt-8 max-w-4xl space-y-5">
              <div>
                <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                  KCSE Performance
                  <span className="block text-emerald-200 sm:inline"> Gallery</span>
                </h1>
                <div className="mb-5 mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-emerald-300 to-teal-300" />
                <p className="max-w-2xl text-sm font-medium leading-relaxed text-white sm:text-base">
                  Browse official KCSE documents, public result archives, mean score movement and current academic targets in one performance gallery.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={refreshAll}
                  disabled={refreshing}
                  className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-white px-6 py-3 text-sm font-black text-[#0f5b4c] shadow-lg transition-all duration-300 active:scale-95 disabled:opacity-50"
                >
                  {refreshing ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0f5b4c]/20 border-t-[#0f5b4c]" />
                      <span>Updating KCSE...</span>
                    </>
                  ) : (
                    <>
                      <FiRefreshCw className="text-sm transition-transform duration-500 group-hover:rotate-180" />
                      <span>Refresh KCSE</span>
                    </>
                  )}
                </button>

                <div className="flex rounded-xl border border-white/20 bg-white/10 p-1 backdrop-blur-md">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all duration-200 ${
                      viewMode === 'grid'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <FiGrid size={16} />
                    <span className="hidden sm:inline">Grid View</span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all duration-200 ${
                      viewMode === 'list'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <FiList size={16} />
                    <span className="hidden sm:inline">List View</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
          {metricCards.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </section>

        <section className="flex flex-col gap-8 lg:flex-row">
          <div className="min-w-0 flex-1 space-y-5 sm:space-y-8">
            <div className="flex flex-col justify-between gap-3 px-1 sm:flex-row sm:items-end sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="shrink-0 rounded-2xl bg-emerald-900 p-3 shadow-lg">
                  <FiFileText className="text-xl text-white sm:text-2xl" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">KCSE Documents</h2>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-xs">
                    {filteredDocuments.length} files shown - {documents.length} total
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200/60 bg-white/80 p-2 shadow-lg shadow-slate-200/40 backdrop-blur-md sm:p-3">
              <div className="flex flex-col items-center gap-2 sm:gap-3 md:flex-row">
                <div className="group relative w-full flex-1">
                  <div className="relative flex items-center rounded-2xl border border-slate-200 bg-white shadow-sm transition-all focus-within:border-slate-900 focus-within:ring-2 focus-within:ring-slate-900/5">
                    <div className="flex items-center justify-center pl-4 pr-3">
                      <FiSearch className="text-slate-400 transition-colors group-focus-within:text-slate-900" size={16} />
                    </div>
                    <input
                      type="text"
                      placeholder="Search KCSE documents by title, year, source..."
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      className="w-full bg-transparent py-4 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    />
                    {searchTerm && (
                      <button onClick={() => setSearchTerm('')} className="pr-2" aria-label="Clear KCSE search">
                        <div className="rounded-xl bg-slate-100 p-2 text-slate-900">
                          <FiX className="h-3.5 w-3.5" />
                        </div>
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex w-full items-center gap-2 border-t border-slate-100 pt-2 md:w-auto md:border-l md:border-t-0 md:pl-3 md:pt-0">
                  <div className="relative min-w-0 flex-1 md:flex-none">
                    <select
                      value={selectedYear}
                      onChange={(event) => setSelectedYear(event.target.value)}
                      className="w-full appearance-none rounded-2xl border-none bg-slate-50 px-4 py-3 text-xs font-medium text-slate-600 transition-all focus:ring-2 focus:ring-emerald-500/20 md:w-32"
                    >
                      <option value="all">All Years</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={resetFilters}
                    className="flex shrink-0 items-center justify-center gap-1.5 rounded-2xl bg-emerald-700 p-3 text-xs font-bold text-white shadow-md shadow-emerald-100 transition-all hover:bg-emerald-800 active:scale-95 md:px-6"
                  >
                    <FiFilter className="h-3.5 w-3.5" />
                    <span className="hidden md:inline">Reset</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="-mx-2 flex gap-2 overflow-x-auto px-2 pb-2">
              {years.length > 0 && (
                <>
                  <button
                    onClick={() => setSelectedYear('all')}
                    className={`flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold transition-all sm:px-5 sm:py-2.5 sm:text-sm ${
                      selectedYear === 'all'
                        ? 'border-emerald-700 bg-emerald-700 text-white shadow-md shadow-emerald-100'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <FiCalendar className={selectedYear === 'all' ? 'text-white' : 'text-slate-400'} />
                    <span>All Years</span>
                  </button>
                  {years.map((year) => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={`flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold transition-all sm:px-5 sm:py-2.5 sm:text-sm ${
                        selectedYear === year
                          ? 'border-emerald-700 bg-emerald-700 text-white shadow-md shadow-emerald-100'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      <FiCalendar className={selectedYear === year ? 'text-white' : 'text-slate-400'} />
                      <span>{year}</span>
                    </button>
                  ))}
                </>
              )}
            </div>

            {filteredDocuments.length === 0 ? (
              <div className="rounded-[32px] border-2 border-dashed border-slate-200 bg-slate-50 py-12 text-center sm:py-16">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                  <FiFileText className="text-2xl text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No KCSE documents found</h3>
                <p className="mt-1 text-sm text-slate-500">Please check back later or contact the school administration.</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3' : 'space-y-4'}>
                {filteredDocuments.map((document) => (
                  <DocumentCard
                    key={document.id || document.url}
                    document={document}
                    viewMode={viewMode}
                    onOpen={setSelectedDocument}
                    onShare={shareDocument}
                  />
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-6 lg:w-[380px]">
            <div className="space-y-6 lg:sticky lg:top-24">
              <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-50 p-2">
                    <FiTrendingUp className="text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Performance Progress</h4>
                    <p className="text-xs text-slate-500">Mean score versus target</p>
                  </div>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-emerald-600" style={{ width: `${progress}%` }} />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>Mean {formatScore(meanScore)}</span>
                  <span>Target {formatScore(targetMean)}</span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-emerald-50 p-3">
                    <p className="text-[9px] font-black uppercase tracking-widest text-emerald-700">Previous</p>
                    <p className="mt-1 text-lg font-black text-slate-950">{formatScore(previousMean)}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Movement</p>
                    <p className="mt-1 text-lg font-black text-slate-950">
                      {movement >= 0 ? '+' : ''}
                      {movement.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/25 p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 p-2 shadow-md">
                    <IoSchoolOutline className="text-lg text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Academic Slogan</h4>
                    <p className="text-[10px] font-black uppercase tracking-wider text-emerald-600">KCSE Focus</p>
                  </div>
                </div>

                <blockquote className="text-xl font-black leading-tight text-slate-950">
                  &quot;{schoolStats?.slogan || 'KCSE Performance Data'}&quot;
                </blockquote>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                  {schoolStats?.sloganDescription || 'Performance metrics from official school documents'}
                </p>
                <p className="mt-4 border-t border-emerald-100 pt-3 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">
                  {schoolStats?.sloganAuthor || 'Matungulu Girls Senior School'}
                </p>
              </div>

              <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-xl bg-purple-50 p-2">
                    <FiCalendar className="text-purple-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">KCSE Years</h4>
                    <p className="text-xs text-slate-500">Browse archive years</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setSelectedYear('all')}
                    className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-colors ${
                      selectedYear === 'all' ? 'border-emerald-100 bg-emerald-50/60' : 'border-slate-100 bg-slate-50 hover:bg-emerald-50/30'
                    }`}
                  >
                    <span className="text-sm font-medium text-slate-700">All Years</span>
                    <span className="text-xs font-bold text-emerald-700">{documents.length}</span>
                  </button>
                  {years.slice(0, 5).map((year) => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-colors ${
                        selectedYear === year ? 'border-emerald-100 bg-emerald-50/60' : 'border-slate-100 bg-slate-50 hover:bg-emerald-50/30'
                      }`}
                    >
                      <span className="text-sm font-medium text-slate-700">{year}</span>
                      <span className="text-xs font-bold text-emerald-700">
                        {documents.filter((document) => String(document.year) === year).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>

      {selectedDocument && (
        <DocumentPreviewModal
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
          onShare={shareDocument}
        />
      )}
    </main>
  );
}