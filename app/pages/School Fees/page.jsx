'use client';

import { useState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import {
  FiDownload,
  FiFileText,
  FiCalendar,
  FiClock,
  FiUser,
  FiArrowRight,
  FiSearch,
  FiX,
  FiInfo,
  FiDollarSign,
  FiCreditCard,
  FiHome,
  FiBookOpen,
  FiTruck,
  FiHeart,
  FiAward,
  FiCheckCircle,
  FiExternalLink,
  FiPrinter,
  FiShare2,
  FiRefreshCw,
  FiAlertTriangle,
  FiShield,
  FiLock,
} from 'react-icons/fi';
import {
  IoSparkles,
  IoClose,
  IoDocumentTextOutline,
  IoEyeOutline,
  IoWalletOutline,
  IoCardOutline,
  IoCashOutline,
  IoReceiptOutline,
  IoSchoolOutline,
  IoBusinessOutline,
  IoBedOutline,
  IoMedkitOutline,
  IoLibraryOutline,
  IoPricetagOutline,
  IoCheckmarkCircleOutline,
  IoCalculatorOutline,
  IoStatsChartOutline,
  IoPeopleOutline,
  IoTimeOutline,
  IoWarningOutline,
} from 'react-icons/io5';
import { MdOutlineAdUnits } from 'react-icons/md';
import { FaWhatsapp, FaLeaf, FaUniversity, FaPhone, FaEnvelope, FaShieldAlt } from 'react-icons/fa';
import { CircularProgress, Box, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';

// Hero Section Component - Reduced height on large screens
const FeesHero = ({ stats, activeTabLabel, onRefresh, refreshing }) => {
  return (
    <section className="relative mx-auto overflow-hidden rounded-2xl shadow-2xl md:w-[90%] md:rounded-xl lg:w-[90%] xl:w-[90%]">
      <img
        src="/Matungulu/9.jpeg"
        alt="Matungulu Girls Senior School fee structure"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(6,78,59,0.96),rgba(15,91,76,0.9),rgba(15,23,42,0.72))]" />
      <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:40px_40px]" />

      <div className="relative z-10 px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-5 lg:py-4 xl:py-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500">
              <span className="text-[8px] font-black text-white">MG</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white">Matungulu Girls</span>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-white/65">Fees & Finance Desk</span>
          </div>
        </div>

        <div className="mt-4 max-w-4xl space-y-3 sm:mt-5 md:mt-4 lg:mt-3">
          <div>
            <h1 className="text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
              School Fees
              <span className="block text-emerald-200 sm:inline"> Structure</span>
            </h1>
            <div className="mb-3 mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-emerald-300 to-teal-300 sm:mb-4 sm:mt-4" />
            <p className="max-w-2xl text-xs font-medium leading-relaxed text-white sm:text-sm md:text-base">
              View {activeTabLabel.toLowerCase()} fees, download the official fee structure,
              and understand exactly what each payment covers — all in one clear, easy-to-navigate layout.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 sm:gap-3 sm:pt-2">
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-white px-4 py-2 text-xs font-black text-[#0f5b4c] shadow-lg transition-all duration-300 active:scale-95 disabled:opacity-50 sm:px-5 sm:py-2.5 sm:text-sm"
            >
              {refreshing ? (
                <>
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-[#0f5b4c]/20 border-t-[#0f5b4c] sm:h-4 sm:w-4" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <FiRefreshCw className="text-xs transition-transform duration-500 group-hover:rotate-180 sm:text-sm" />
                  <span>Refresh Fees</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Metric Card Component - Matching KCSE Performance style
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

// Fee Ledger Item Component - Styled like DocumentCard
const FeeLedgerItem = ({ item, onInfo }) => {
  const flags = [
    item.optional ? { label: 'Optional', tone: 'bg-amber-50 text-amber-700 border-amber-200' } : null,
    item.admissionOnly ? { label: 'One-time', tone: 'bg-violet-50 text-violet-700 border-violet-200' } : null,
    item.boardingOnly ? { label: 'Boarders', tone: 'bg-teal-50 text-teal-700 border-teal-200' } : null,
  ].filter(Boolean);

  const style = {
    gradient: 'from-emerald-500 to-teal-500',
    icon: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <div
      onClick={() => onInfo(item)}
      className="group cursor-pointer rounded-[24px] border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-emerald-100 hover:shadow-md"
    >
      <div className="flex gap-4">
        <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${style.gradient} text-white shadow-lg`}>
          <IoPricetagOutline size={28} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-700">
              Fee Line
            </span>
            {flags.slice(0, 2).map((flag) => (
              <span key={flag.label} className={`rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-widest ${flag.tone}`}>
                {flag.label}
              </span>
            ))}
          </div>

          <h3 className="line-clamp-2 text-base font-black leading-snug text-slate-950">{item.name}</h3>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
            {item.description || 'This item appears in the current fee structure.'}
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-slate-500">
              <span className="flex items-center gap-1">
                <FiDollarSign size={12} />
                KSh {item.amount?.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <FiCalendar size={12} />
                Annual
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-700 transition-transform group-hover:translate-x-1">
                View Details <FiArrowRight size={12} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// PDF Document Card - Styled like DocumentCard
const FeesDocumentCard = ({ title, pdfUrl, fileName, fileSize, description, onDownload, onView }) => {
  const style = {
    gradient: 'from-emerald-500 to-teal-500',
    label: 'Official Upload',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  const formatFileSize = (size) => {
    const fileSizeNum = Number(size);
    if (!Number.isFinite(fileSizeNum) || fileSizeNum <= 0) return 'Document';
    if (fileSizeNum < 1024 * 1024) return `${(fileSizeNum / 1024).toFixed(1)} KB`;
    return `${(fileSizeNum / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="group cursor-pointer rounded-[24px] border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-emerald-100 hover:shadow-md">
      <div className="flex gap-4">
        <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${style.gradient} text-white shadow-lg`}>
          <FiFileText size={28} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-widest ${style.badge}`}>
              {style.label}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">PDF Document</span>
          </div>

          <h3 className="line-clamp-2 text-base font-black leading-snug text-slate-950">{title}</h3>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{description || 'Official fee structure document.'}</p>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-slate-500">
              <span className="flex items-center gap-1">
                <FiFileText size={12} />
                {fileName || 'Fee Structure'}
              </span>
              <span className="flex items-center gap-1">
                <FiClock size={12} />
                {formatFileSize(fileSize)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onView(pdfUrl);
                }}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
                aria-label={`Preview ${title}`}
              >
                <IoEyeOutline size={15} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(pdfUrl, fileName);
                }}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
                aria-label={`Download ${title}`}
              >
                <FiDownload size={15} />
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
};

// Insight Card Component
const InsightCard = ({ icon: Icon, label, value, sublabel, gradient = 'from-emerald-500 to-teal-500' }) => {
  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70">
      <div className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${gradient} opacity-0 transition-opacity group-hover:opacity-100`} />
      <div className="mb-4 flex items-center gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg shadow-slate-300/40`}>
          <Icon size={20} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
      </div>
      <p className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{value}</p>
      <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">{sublabel}</p>
    </div>
  );
};

// Payment Instructions Card with Precautions
const PaymentInstructionsCard = ({ onContact }) => {
  const bankAccounts = [
    { bank: 'KCB Tala', account: '1107262992' },
    { bank: 'Equity Bank Tala', account: '0900261636074' },
  ];

  const precautions = [
    { icon: FiShield, text: 'Always verify the admission number before making any payment.', color: 'text-emerald-600' },
    { icon: FiLock, text: 'Do not send fees to personal bank accounts or mobile numbers.', color: 'text-blue-600' },
    { icon: FiAlertTriangle, text: 'Report any suspicious payment requests to the school finance office immediately.', color: 'text-amber-600' },
    { icon: FaShieldAlt, text: 'Only use the official payment methods listed below.', color: 'text-purple-600' },
  ];

  return (
    <div className="rounded-[28px] border border-slate-200/60 bg-white/80 p-6 shadow-lg shadow-slate-200/40 backdrop-blur-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-2">
              <IoWalletOutline className="text-emerald-700" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">Payment Instructions</p>
          </div>
          <h3 className="mt-3 text-xl font-black tracking-tight text-slate-950">Official school fee payment guide</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Use only the accepted payment methods below and confirm the admission number before sending funds.
          </p>
        </div>
      </div>

      {/* Precautions Section */}
      <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <IoWarningOutline className="text-amber-600 text-sm" />
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-amber-700">Important Precautions</p>
        </div>
        <div className="space-y-2">
          {precautions.map((precaution, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <precaution.icon className={`${precaution.color} text-xs mt-0.5 shrink-0`} />
              <p className="text-xs leading-5 text-slate-700">{precaution.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
        <div className="grid gap-4">
          {bankAccounts.map((account) => (
            <div key={account.account} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <FaUniversity className="mt-1 text-emerald-600" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">{account.bank}</p>
                  <p className="mt-1 text-lg font-black text-slate-950">Account No. {account.account}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-[#102d24] p-5 text-white">
          <div className="flex items-center gap-2">
            <IoCardOutline className="text-emerald-200" />
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-200">M-Pesa Pay Bill (M-KARO)</p>
          </div>
          <div className="mt-3 space-y-2">
            <p className="text-sm leading-6 text-white/82">
              <span className="font-bold">Business Number:</span> 522533
            </p>
            <p className="text-sm leading-6 text-white/82">
              <span className="font-bold">Account Number:</span> 7984032#ADMN0 (Replace ADMN0 with Admission Number)
            </p>
          </div>
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-xs leading-6 text-white/75">
              <span className="font-bold text-emerald-200">Example:</span> 7984032#11111
            </p>
          </div>
        </div>
      </div>

      {/* Additional Security Note */}
      <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3">
        <div className="flex items-center gap-2">
          <FiCheckCircle className="text-emerald-600 text-sm" />
          <p className="text-xs font-medium text-emerald-800">
            Always request an official receipt after making any payment.
          </p>
        </div>
      </div>

      <button
        onClick={onContact}
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-6 py-3 text-sm font-black text-white transition-colors hover:bg-emerald-800"
      >
        <FaPhone size={15} />
        Contact School for Clarification
      </button>
    </div>
  );
};

// PDF Preview Modal - Styled like DocumentPreviewModal
const PdfPreviewModal = ({ pdf, onClose, onDownload }) => {
  if (!pdf) return null;

  const style = {
    gradient: 'from-emerald-500 to-teal-500',
    label: 'Official Upload',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-0 backdrop-blur-sm sm:p-4">
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl sm:h-[92vh] sm:max-w-5xl sm:rounded-[36px]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-[200] rounded-full border border-white/20 bg-black/20 p-2 text-white backdrop-blur-md transition-transform active:scale-95 hover:bg-black/40"
          aria-label="Close PDF preview"
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
                Fee Document
              </span>
            </div>
            <h2 className="max-w-3xl text-2xl font-black leading-tight tracking-tight sm:text-3xl">
              {pdf.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-white/78">
              Official fee structure document for Matungulu Girls Senior School.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-white px-4 py-3 sm:px-6">
          <div className="flex min-w-0 flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
            <span className="rounded-full bg-slate-100 px-3 py-1">{pdf.fileName || 'Fee Structure.pdf'}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={pdf.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate-700 transition-colors hover:bg-slate-100"
            >
              <FiExternalLink size={14} />
              <span className="hidden sm:inline">Open</span>
            </a>
            <button
              onClick={() => onDownload(pdf.url, pdf.fileName)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-white transition-colors hover:bg-emerald-800"
            >
              <FiDownload size={14} />
              <span className="hidden sm:inline">Save</span>
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 bg-slate-100 p-2 sm:p-4">
          <iframe
            src={`${pdf.url}#toolbar=1&navpanes=0&view=FitH`}
            title={`${pdf.title} preview`}
            className="h-full min-h-[62vh] w-full rounded-2xl border border-slate-200 bg-white"
          />
        </div>
      </div>
    </div>
  );
};

// Info Modal for Fee Items
const InfoModal = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-[32px] bg-white shadow-2xl">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-4 text-white">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/80">Fee Detail</p>
            <button
              onClick={onClose}
              className="rounded-full border border-white/20 bg-black/20 p-1.5 transition-transform active:scale-95"
            >
              <IoClose size={16} />
            </button>
          </div>
          <h3 className="mt-2 text-xl font-black">{item.name}</h3>
        </div>

        <div className="p-5 space-y-4">
          <div className="rounded-2xl bg-emerald-50 p-4">
            <p className="text-sm leading-7 text-slate-700">{item.description || 'No description available for this fee item.'}</p>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <span className="text-sm font-medium text-slate-600">Amount (Annual)</span>
            <span className="text-2xl font-black text-emerald-700">KSh {item.amount?.toLocaleString()}</span>
          </div>

          {item.optional && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs font-bold text-amber-700">⚠️ Optional Fee</p>
              <p className="text-xs text-amber-600 mt-1">This fee is optional and may be paid separately.</p>
            </div>
          )}
          {item.admissionOnly && (
            <div className="rounded-xl border border-purple-200 bg-purple-50 p-3">
              <p className="text-xs font-bold text-purple-700">🎓 One-time Payment</p>
              <p className="text-xs text-purple-600 mt-1">Applicable only during admission.</p>
            </div>
          )}
          {item.boardingOnly && (
            <div className="rounded-xl border border-teal-200 bg-teal-50 p-3">
              <p className="text-xs font-bold text-teal-700">🏠 Boarders Only</p>
              <p className="text-xs text-teal-600 mt-1">This fee applies to boarding students only.</p>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 p-4">
          <button
            onClick={onClose}
            className="w-full rounded-2xl bg-emerald-700 py-3 text-sm font-black text-white transition-colors hover:bg-emerald-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function SchoolFeesPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [documentData, setDocumentData] = useState(null);
  const [selectedFeeItem, setSelectedFeeItem] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [activeTab, setActiveTab] = useState('boarding');
  const [searchTerm, setSearchTerm] = useState('');

  // Tabs configuration - Boarding and Admission Letter
  const tabs = [
    { id: 'boarding', name: 'Boarders', icon: IoBedOutline },
    { id: 'admission', name: 'Admission', icon: MdOutlineAdUnits }
  ];

  const router = useRouter();

  // Fetch document data
  const fetchDocuments = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    
    try {
      const response = await fetch('/api/schooldocuments');
      const data = await response.json();
      
      if (data.success) {
        setDocumentData(data.document);
        if (showRefresh) toast.success('Fees data refreshed!');
      } else {
        throw new Error(data.error || 'Failed to load fees data');
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load fees information');
    } finally {
      if (showRefresh) setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Get current fee items based on active tab
  const getCurrentFeeItems = () => {
    if (!documentData) return [];
    
    switch(activeTab) {
      case 'boarding':
        return documentData.feesBoardingDistributionJson || [];
      case 'admission':
        return documentData.admissionFeeDistribution || [];
      default:
        return [];
    }
  };

  // Get total amount for current tab
  const getCurrentTotal = () => {
    const items = getCurrentFeeItems();
    return items.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  // Get PDF info for current tab
  const getCurrentPDFInfo = () => {
    if (!documentData) return null;
    
    switch(activeTab) {
      case 'boarding':
        return {
          url: documentData.feesBoardingDistributionPdf,
          name: documentData.feesBoardingPdfName,
          size: documentData.feesBoardingPdfSize,
          date: documentData.feesBoardingPdfUploadDate,
          description: documentData.feesBoardingDescription
        };
      case 'admission':
        return {
          url: documentData.admissionFeePdf,
          name: documentData.admissionFeePdfName,
          size: documentData.admissionFeePdfSize,
          date: documentData.admissionFeePdfUploadDate,
          description: documentData.admissionFeeDescription
        };
      default:
        return null;
    }
  };

  // Filter fee items based on search
  const filteredItems = getCurrentFeeItems().filter(item => {
    return searchTerm === '' || 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Handle PDF download
  const handleDownloadPDF = (url, fileName) => {
    if (!url) {
      toast.error('PDF not available');
      return;
    }
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'fee-structure.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Download started');
  };

  // Handle PDF view
  const handleViewPDF = (url) => {
    if (!url) {
      toast.error('PDF not available');
      return;
    }
    setPdfPreview({
      url,
      title: `${currentTabLabel} Fee Structure`,
      fileName: pdfInfo?.name || 'fee-structure.pdf'
    });
  };

  // Handle refresh
  const refreshData = () => {
    fetchDocuments(true);
  };

  // Get unique categories count
  const getUniqueCategories = () => {
    const items = getCurrentFeeItems();
    const categories = new Set(items.map(item => {
      if (item.name?.includes('Tuition')) return 'Tuition';
      if (item.name?.includes('Boarding')) return 'Boarding';
      if (item.name?.includes('Uniform')) return 'Uniform';
      if (item.name?.includes('Books')) return 'Books';
      if (item.name?.includes('Medical')) return 'Medical';
      return 'Other';
    }));
    return categories.size;
  };

  // Format last updated date
  const getLastUpdated = () => {
    if (!documentData?.updatedAt) return 'Today';
    try {
      const date = new Date(documentData.updatedAt);
      const diff = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
      if (diff === 0) return 'Today';
      if (diff === 1) return 'Yesterday';
      if (diff < 7) return `${diff} days ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return 'Today';
    }
  };

  // Loading state
  if (loading) {
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
            <p className="text-sm font-semibold italic tracking-tight text-slate-900 sm:text-base">Loading fee structure...</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Matungulu Girls Senior School</p>
          </div>
        </Stack>
      </Box>
    );
  }

  const pdfInfo = getCurrentPDFInfo();
  const totalAmount = getCurrentTotal();
  const currentTabLabel = tabs.find((tab) => tab.id === activeTab)?.name || 'Fees';

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/25 to-purple-50/20 p-3 text-slate-950 sm:p-4 md:p-6">
      <Toaster position="top-right" richColors />

      <div className="mx-auto w-full space-y-5 sm:space-y-6 md:w-[90%]">
        <FeesHero 
          stats={{ totalItems: filteredItems.length, totalAmount, lastUpdated: getLastUpdated() }} 
          activeTabLabel={currentTabLabel} 
          onRefresh={refreshData}
          refreshing={refreshing}
        />

        {/* Payment Instructions - Top Section */}
        <PaymentInstructionsCard onContact={() => router.push("/pages/contact")} />

        <section className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <div className="min-w-0 flex-1 space-y-4 sm:space-y-6">
            <div className="flex flex-col justify-between gap-3 px-1 sm:flex-row sm:items-end sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="shrink-0 rounded-2xl bg-emerald-900 p-2 shadow-lg sm:p-3">
                  <IoDocumentTextOutline className="text-lg text-white sm:text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl md:text-2xl">Fee Structure Document</h2>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:text-[10px]">
                    {currentTabLabel} - Download PDF
                  </p>
                </div>
              </div>
            </div>

            {/* Tab Switcher - Boarding and Admission Letter */}
            <div className="flex gap-2 border-b border-slate-200 pb-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSearchTerm('');
                    }}
                    className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition-all sm:px-4 sm:py-2 sm:text-sm ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-md shadow-emerald-100'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-200'
                    }`}
                  >
                    <Icon size={14} className="sm:text-base" />
                    {tab.name}
                  </button>
                );
              })}
            </div>

            {/* Download Fee Structure PDF */}
            <div className="rounded-[28px] border-2 border-emerald-200 bg-emerald-50 p-6 sm:p-8">
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg sm:h-16 sm:w-16">
                  <FiFileText className="text-2xl sm:text-3xl" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-emerald-900 sm:text-xl">Fee Structure PDF</h3>
                  <p className="mt-1 text-sm text-emerald-700">
                    Download the complete {currentTabLabel.toLowerCase()} fee structure document with all itemized charges and payment details.
                  </p>
                  {pdfInfo?.url && (
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                      <button
                        onClick={() => handleDownloadPDF(pdfInfo.url, pdfInfo.name)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg sm:px-5 sm:py-3"
                      >
                        <FiDownload className="text-base" />
                        Download PDF
                      </button>
                      <button
                        onClick={() => handleViewPDF(pdfInfo.url)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-emerald-200 bg-white px-4 py-2.5 text-sm font-bold text-emerald-700 hover:bg-emerald-50 transition-all sm:px-5 sm:py-3"
                      >
                        <FiExternalLink className="text-base" />
                        View PDF
                      </button>
                    </div>
                  )}
                  {!pdfInfo?.url && (
                    <p className="mt-3 text-xs font-semibold text-emerald-600">
                      PDF document will be available soon. Check back later.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5 lg:w-[360px] xl:w-[380px]">
            <div className="space-y-5 lg:sticky lg:top-24">
              {/* PDF Document Card */}
              {pdfInfo?.url ? (
                <FeesDocumentCard
                  title={`${currentTabLabel} Fee Structure`}
                  pdfUrl={pdfInfo.url}
                  fileName={pdfInfo.name}
                  fileSize={pdfInfo.size}
                  description={pdfInfo.description}
                  onDownload={handleDownloadPDF}
                  onView={handleViewPDF}
                />
              ) : (
                <div className="rounded-[28px] border-2 border-dashed border-slate-200 bg-slate-50 p-5 text-center sm:p-6">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm sm:h-14 sm:w-14 md:h-16 md:w-16">
                    <FiFileText className="text-xl text-slate-300 sm:text-2xl" />
                  </div>
                  <h3 className="mt-3 text-base font-bold text-slate-900 sm:text-lg">No PDF available</h3>
                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">The downloadable fee document for this section has not been uploaded.</p>
                </div>
              )}

              {/* Insight Cards */}
              {/* Info Box */}
              <div className="rounded-[28px] border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/25 p-5 shadow-sm sm:p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 p-2 shadow-md">
                    <IoSchoolOutline className="text-base text-white sm:text-lg" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Important Notes</h4>
                    <p className="text-[9px] font-black uppercase tracking-wider text-emerald-600 sm:text-[10px]">Fee Guidelines</p>
                  </div>
                </div>

                <ul className="space-y-2 text-xs leading-6 text-slate-600 sm:text-sm">
                  <li className="flex gap-2">
                    <FiCheckCircle className="mt-0.5 text-emerald-600 shrink-0 text-xs" />
                    <span>Review the correct section before making payment.</span>
                  </li>
                  <li className="flex gap-2">
                    <FiCheckCircle className="mt-0.5 text-emerald-600 shrink-0 text-xs" />
                    <span>Use the downloadable fee structure for reference.</span>
                  </li>
                  <li className="flex gap-2">
                    <FiCheckCircle className="mt-0.5 text-emerald-600 shrink-0 text-xs" />
                    <span>Contact bursar for clarifications on balances.</span>
                  </li>
                  <li className="flex gap-2">
                    <FiCheckCircle className="mt-0.5 text-emerald-600 shrink-0 text-xs" />
                    <span>Keep all payment receipts for future reference.</span>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </section>
      </div>

      {/* Modals */}
      {showInfoModal && selectedFeeItem && (
        <InfoModal
          item={selectedFeeItem}
          onClose={() => {
            setShowInfoModal(false);
            setSelectedFeeItem(null);
          }}
        />
      )}

      {pdfPreview && (
        <PdfPreviewModal
          pdf={pdfPreview}
          onClose={() => setPdfPreview(null)}
          onDownload={handleDownloadPDF}
        />
      )}
    </main>
  );
}