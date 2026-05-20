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
  FiPrinter,
  FiShare2,
  FiRefreshCw
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
  IoTimeOutline
} from 'react-icons/io5';
import { MdOutlineAdUnits } from 'react-icons/md';
import { FaWhatsapp, FaLeaf, FaUniversity, FaPhone, FaEnvelope } from 'react-icons/fa';
import { CircularProgress, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';

const FeesHero = ({ stats, activeTabLabel, onRefresh }) => {
  return (
    <section className="relative overflow-hidden rounded-lg border border-[#d6e9df] bg-[#0d2f25] p-6 text-white sm:p-8 lg:p-10">
      <div className="absolute -right-20 -top-16 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl" />
      <div className="absolute -bottom-20 left-0 h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_45%)]" />

      <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-200">
            <IoSparkles className="text-sm" />
            Fees & Finance Desk
          </div>

       <div className="mt-5 max-w-3xl">
  <p className="text-[11px] font-black uppercase tracking-[0.26em] text-emerald-300/80">
    Matungulu Girls School
  </p>
  <h1 className="mt-3 text-3xl font-black leading-none tracking-tight text-white sm:text-4xl lg:text-5xl">
    School Fees,
    <span className="block bg-gradient-to-r from-emerald-200 to-teal-300 bg-clip-text text-transparent">
      broken down simply and transparently.
    </span>
  </h1>
  <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
    View {activeTabLabel.toLowerCase()} fees, download the official fee structure,
    and understand exactly what each payment covers — all in one clear, easy-to-navigate layout.
  </p>
</div>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200">Fee Items</p>
              <p className="mt-1 text-2xl font-black text-white">{stats.totalItems}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200">Annual Total</p>
              <p className="mt-1 text-2xl font-black text-white">KSh {stats.totalAmount}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200">Updated</p>
              <p className="mt-1 text-2xl font-black text-white">{stats.lastUpdated}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-200">
                Quick Snapshot
              </p>
              <h2 className="mt-2 text-xl font-black text-white sm:text-2xl">
                Finance status at a glance
              </h2>
            </div>
            <button
              onClick={onRefresh}
              disabled={stats.refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-white transition-all hover:bg-white/20 disabled:opacity-70"
            >
              <FiRefreshCw className={stats.refreshing ? 'animate-spin' : ''} />
              {stats.refreshing ? 'Refreshing' : 'Refresh'}
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-black/15 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200">Categories</p>
              <p className="mt-2 text-2xl font-black text-white">{stats.categories}</p>
            </div>
            <div className="rounded-2xl bg-black/15 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200">PDF Ready</p>
              <p className="mt-2 text-2xl font-black text-white">{stats.pdfAvailable ? 'Yes' : 'No'}</p>
            </div>
            <div className="rounded-2xl bg-black/15 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200">Section</p>
              <p className="mt-2 text-base font-black text-white">{activeTabLabel}</p>
            </div>
            <div className="rounded-2xl bg-black/15 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200">Tip</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-white/80">Tap any item for details and notices.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeeLedgerItem = ({ item, onInfo }) => {
  const flags = [
    item.optional ? { label: 'Optional', tone: 'bg-amber-50 text-amber-700 border-amber-200' } : null,
    item.admissionOnly ? { label: 'One-time', tone: 'bg-violet-50 text-violet-700 border-violet-200' } : null,
    item.boardingOnly ? { label: 'Boarders', tone: 'bg-teal-50 text-teal-700 border-teal-200' } : null,
  ].filter(Boolean);

  return (
    <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-[0_12px_40px_-35px_rgba(15,23,42,0.35)] transition-all hover:border-emerald-200 hover:shadow-[0_20px_60px_-42px_rgba(5,150,105,0.35)] sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eef8f2] text-emerald-700">
              <IoPricetagOutline className="text-lg" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Fee Line</p>
              <h3 className="mt-1 text-lg font-black tracking-tight text-slate-950">{item.name}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {item.description || 'This item appears in the current fee structure for the selected section.'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <div className="rounded-2xl bg-[#0f3529] px-4 py-3 text-white">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200">Amount</p>
            <p className="mt-1 text-2xl font-black">KSh {item.amount?.toLocaleString()}</p>
          </div>
          <button
            onClick={() => onInfo(item)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-700 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <FiInfo size={14} />
            More Info
          </button>
        </div>
      </div>

      {flags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          {flags.map((flag) => (
            <span key={flag.label} className={`rounded-full border px-3 py-1 text-[11px] font-bold ${flag.tone}`}>
              {flag.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const FeesDocumentCard = ({ title, pdfUrl, fileName, fileSize, description, onDownload, onView }) => {
  return (
    <div className="rounded-[1.6rem] border border-[#dbe7dc] bg-[#f6fbf7] p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
          <IoDocumentTextOutline className="text-xl" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">Document Centre</p>
          <h4 className="mt-1 text-base font-black text-slate-900">{title}</h4>
          {description && (
            <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <FiFileText size={12} />
              {fileName || 'PDF Document'}
            </span>
            {fileSize && (
              <span className="inline-flex items-center gap-1">
                <FiClock size={12} />
                {fileSize < 1024 ? fileSize + ' B' : (fileSize / 1024).toFixed(1) + ' KB'}
              </span>
            )}
          </div>

          <div className="mt-5 flex gap-2">
            <button
              onClick={() => onView(pdfUrl)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-emerald-700 transition-colors hover:bg-emerald-50"
            >
              <IoEyeOutline size={14} />
              Preview
            </button>
            <button
              onClick={() => onDownload(pdfUrl, fileName)}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-700 text-white transition-colors hover:bg-emerald-800"
            >
              <FiDownload size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InsightCard = ({ icon: Icon, label, value, sublabel, tone = 'bg-white' }) => {
  return (
    <div className={`rounded-[1.4rem] border border-slate-200 p-4 ${tone}`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <Icon size={16} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Insight</span>
      </div>
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-black text-slate-900">{value}</p>
      <p className="mt-1 text-xs leading-6 text-slate-500">{sublabel}</p>
    </div>
  );
};

const PaymentInstructionsCard = ({ onContact }) => {
  const acceptedMethods = [
    'Postal Money Order',
    "Banker's Cheque payable to Matungulu Girls' Secondary School",
    'Bank Deposit to the school accounts listed below',
    'M-karo platform',
  ];

  const bankAccounts = [
    { bank: 'KCB Tala', account: '1107262992' },
    { bank: 'Equity Bank Tala', account: '0900261636074' },
  ];

  const mpesaSteps = [
    'Go to M-Pesa menu.',
    'Select Pay Bill.',
    'Enter Business Number: 522533',
    'Enter the Account Number as 7984032#ADMN0.',
    'Replace ADMN0 with the actual Admission Number, without spaces.',
    'Example: 7984032#11111',
    'Enter Amount.',
    'Enter your M-Pesa PIN, press OK, and Confirm.',
  ];

  return (
    <div className="rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_-45px_rgba(15,23,42,0.35)] sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">Payment Instructions</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            Official school fee payment guide
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Use only the accepted payment methods below and confirm the admission number before sending funds.
          </p>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <IoWalletOutline size={22} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-[1.4rem] border border-emerald-100 bg-[#f6fbf7] p-5">
          <div className="flex items-center gap-2">
            <FiCheckCircle className="text-emerald-700" />
            <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">Accepted Payment Methods</p>
          </div>
          <div className="mt-4 space-y-3">
            {acceptedMethods.map((method) => (
              <div key={method} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                <p className="text-sm font-semibold leading-6 text-slate-700">{method}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-rose-100 bg-rose-50 p-5">
          <div className="flex items-center gap-2">
            <FiX className="text-rose-700" />
            <p className="text-xs font-black uppercase tracking-[0.14em] text-rose-700">Not Accepted</p>
          </div>
          <div className="mt-4 space-y-3">
            {['Personal Cheques', 'Cash'].map((method) => (
              <div key={method} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-600" />
                <p className="text-sm font-semibold leading-6 text-slate-700">{method}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {bankAccounts.map((account) => (
          <div key={account.account} className="rounded-[1.4rem] border border-slate-200 bg-[#fbfcfa] p-5">
            <div className="flex items-start gap-3">
              <FaUniversity className="mt-1 text-emerald-600" />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">{account.bank}</p>
                <p className="mt-1 text-lg font-black text-slate-950">Account No. {account.account}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-[1.4rem] border border-slate-200 bg-[#102d24] p-5 text-white">
        <div className="flex items-center gap-2">
          <IoCardOutline className="text-emerald-200" />
          <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-200">How To Pay Through M-KARO via M-Pesa - Lipa na KCB</p>
        </div>
        <ol className="mt-4 space-y-3">
          {mpesaSteps.map((step, index) => (
            <li key={step} className="flex gap-3 text-sm leading-6 text-white/82">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-black text-emerald-100">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-bold leading-7 text-white">
            Make sure the admission number is correct. For clarification, call the school.
          </p>
        </div>
      </div>

      <button
        onClick={onContact}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-emerald-800"
      >
        <FaPhone size={15} />
        Contact School
      </button>
    </div>
  );
};

// Main Component
export default function ModernFeesPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [documentData, setDocumentData] = useState(null);
  const [selectedFeeItem, setSelectedFeeItem] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [activeTab, setActiveTab] = useState('boarding');
  const [searchTerm, setSearchTerm] = useState('');

  // Tabs configuration
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
    window.open(url, '_blank');
  };

  // Handle refresh
  const refreshData = () => {
    fetchDocuments(true);
  };

  // Calculate unique categories
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
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-7xl mx-auto">
          <div className="min-h-[70vh] flex items-center justify-center">
            <Stack spacing={2} alignItems="center">
              <div className="relative flex items-center justify-center">
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={48}
                  thickness={4.5}
                  sx={{ color: '#f1f5f9' }}
                />
                <CircularProgress
                  variant="indeterminate"
                  disableShrink
                  size={48}
                  thickness={4.5}
                  sx={{
                    color: '#059669',
                    animationDuration: '1000ms',
                    position: 'absolute',
                  }}
                />
              </div>
              <div className="text-center">
                <p className="text-slate-600 font-medium text-sm">Loading fee structure...</p>
                <p className="text-slate-400 text-xs uppercase tracking-widest mt-1 font-bold">
                  Matungulu Girls
                </p>
              </div>
            </Stack>
          </div>
        </div>
      </div>
    );
  }

  const pdfInfo = getCurrentPDFInfo();
  const totalAmount = getCurrentTotal();
  const currentTabLabel = tabs.find((tab) => tab.id === activeTab)?.name || 'Fees';

  // Banner stats
  const bannerStats = {
    totalItems: filteredItems.length,
    totalAmount: totalAmount.toLocaleString(),
    categories: getUniqueCategories(),
    pdfAvailable: Boolean(pdfInfo?.url),
    lastUpdated: getLastUpdated(),
    refreshing: refreshing
  };

  return (
    <div className="min-h-screen bg-[#f6f7f3]">
      <Toaster position="top-right" richColors />

      <div className="w-full md:w-[90%] mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        <FeesHero stats={bannerStats} activeTabLabel={currentTabLabel} onRefresh={refreshData} />
      </div>

      <div className="max-w-7xl mx-auto  py-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-md border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.35)] sm:p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-700">Browse Sections</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
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
                      className={`flex items-center justify-between rounded-[1.2rem] border px-4 py-4 text-left transition-all ${
                        isActive
                          ? 'border-emerald-200 bg-[#eef8f2] shadow-[0_14px_35px_-30px_rgba(5,150,105,0.45)]'
                          : 'border-slate-200 bg-[#fbfcfa] hover:border-emerald-100 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${isActive ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">{tab.name}</p>
                          <p className="text-xs text-slate-500">Open fee breakdown</p>
                        </div>
                      </div>
                      <FiArrowRight className={`transition-transform ${isActive ? 'text-emerald-700 translate-x-1' : 'text-slate-400'}`} />
                    </button>
                  );
                })}
              </div>

            
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <InsightCard
                icon={IoWalletOutline}
                label="Current Total"
                value={`KSh ${totalAmount.toLocaleString()}`}
                sublabel={`Combined estimated annual amount for ${currentTabLabel.toLowerCase()}.`}
                tone="bg-white"
              />
              <InsightCard
                icon={IoStatsChartOutline}
                label="Visible Items"
                value={filteredItems.length}
                sublabel="Matches your current tab and search filter."
                tone="bg-[#fbfcfa]"
              />
              <InsightCard
                icon={IoReceiptOutline}
                label="Fee Notes"
                value={pdfInfo?.url ? 'PDF Ready' : 'No PDF'}
                sublabel="Downloadable fee document appears below when available."
                tone="bg-white"
              />
              <InsightCard
                icon={IoTimeOutline}
                label="Last Update"
                value={bannerStats.lastUpdated}
                sublabel="Based on the latest document update timestamp."
                tone="bg-[#fbfcfa]"
              />
            </div>

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
              <div className="rounded-[1.6rem] border border-dashed border-slate-300 bg-white p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <IoDocumentTextOutline className="text-xl" />
                </div>
                <p className="mt-4 text-sm font-bold text-slate-700">No PDF available yet</p>
                <p className="mt-1 text-xs leading-6 text-slate-500">The downloadable fee document for this section has not been uploaded.</p>
              </div>
            )}

            <div className="rounded-md bg-[#102d24] p-6 text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-200">What To Know</p>
              <div className="mt-4 space-y-4 text-sm leading-7 text-white/78">
                <p>Review the correct section before making payment so charges match the learner&apos;s status.</p>
                <p>Use the downloadable fee structure for office reference, parent sharing, or record keeping.</p>
                <p>For clarifications on balances, deadlines, or fee items, contact the bursar or school finance office.</p>
              </div>
            </div>

          </aside>




          <section className="space-y-5">
            <PaymentInstructionsCard onContact={() => router.push("/pages/contact")} />

            <div className="rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_-45px_rgba(15,23,42,0.35)] sm:p-6">
     <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">



                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">Fee Ledger</p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                    {currentTabLabel} fee breakdown
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    A redesigned list of all available charges for the selected section, arranged for easier reading and quick review.
                  </p>
                </div>
                <div className="rounded-2xl bg-[#f4f8f4] px-4 py-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Annual Estimate</p>
                  <p className="mt-1 text-2xl font-black text-slate-950">KSh {totalAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="mt-5">
                <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab} fees...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-2xl border font-semibold border-slate-200 bg-[#f8faf8] py-3 pl-11 pr-11 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-slate-100 p-1.5 transition-colors hover:bg-slate-200"
                    >
                      <FiX size={14} className="text-slate-500" />
                    </button>
                  )}
                </div>
              </div>

              


            <div className="space-y-4">
              {filteredItems.length === 0 ? (
                <div className="rounded-[1.8rem] border border-dashed border-slate-300 bg-white p-10 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                    <FiDollarSign className="text-slate-400 text-xl" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">No fee items found</h3>
                  <p className="mt-2 text-sm text-slate-500">Try adjusting your search or switch to another fee section.</p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-5 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-emerald-700"
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                filteredItems.map((item, index) => (
                  <FeeLedgerItem
                    key={item.id || index}
                    item={item}
                    onInfo={(item) => {
                      setSelectedFeeItem(item);
                      setShowInfoModal(true);
                    }}
                  />
                ))
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Info Modal */}
      {showInfoModal && selectedFeeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">Fee Detail</p>
                <h3 className="mt-1 text-lg font-black text-slate-900">{selectedFeeItem.name}</h3>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="rounded-xl bg-slate-100 p-2 transition-colors hover:bg-slate-200"
              >
                <IoClose size={16} className="text-slate-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-[1.3rem] border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-sm leading-7 text-slate-700">{selectedFeeItem.description || 'No description available'}</p>
              </div>

              <div className="flex items-center justify-between rounded-[1.3rem] border border-slate-100 bg-slate-50 p-4">
                <span className="text-sm font-medium text-slate-600">Amount</span>
                <span className="text-xl font-black text-emerald-700">
                  KSh {selectedFeeItem.amount?.toLocaleString()}
                </span>
              </div>

              {selectedFeeItem.optional && (
                <div className="rounded-[1.1rem] border border-amber-200 bg-amber-50 p-3">
                  <p className="text-sm font-medium text-amber-700">This fee is optional</p>
                </div>
              )}
              {selectedFeeItem.admissionOnly && (
                <div className="rounded-[1.1rem] border border-purple-200 bg-purple-50 p-3">
                  <p className="text-sm font-medium text-purple-700">One-time payment (admission only)</p>
                </div>
              )}
              {selectedFeeItem.boardingOnly && (
                <div className="rounded-[1.1rem] border border-teal-200 bg-teal-50 p-3">
                  <p className="text-sm font-medium text-teal-700">Applicable to boarders only</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowInfoModal(false)}
              className="mt-6 w-full rounded-2xl bg-emerald-700 py-3 text-sm font-black text-white transition-colors hover:bg-emerald-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
