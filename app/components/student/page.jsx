'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Toaster, toast as sooner } from 'sonner';
import { CircularProgress, Modal, Box } from '@mui/material';
import * as XLSX from 'xlsx';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip as RechartsTooltip, Legend,
  ResponsiveContainer, LineChart, Line, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  RadialBarChart, RadialBar
} from 'recharts';

import { IoSparkles } from 'react-icons/io5';

import { 
  FiAlertCircle,
  FiTrash2,
  FiXCircle,
  FiUpload,
  FiUser,
  FiX,
  FiBook,
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiEdit,
  FiPieChart,
  FiBarChart2,
  FiTrendingUp,
  FiTarget,
  FiSave,
  FiFilter,
  FiSearch,
  FiRefreshCw,
  FiList,
  FiChevronUp,
  FiChevronDown,
  FiSettings,
  FiDownload,
  FiEye,
  FiArrowLeft,
  FiArrowRight,
  FiInfo,
  FiFile,
  FiUsers,
  FiPercent,
  FiAward,
  FiTrendingUp as FiTrendingUpIcon,
  FiTrendingDown as FiTrendingDownIcon,
  FiHome,
  FiUserPlus,
  FiPercent as FiPercentIcon,
  FiGlobe,
  FiBookOpen,
  FiHeart,
  FiCpu,
  FiPlay,
  FiAward as FiAwardIcon,
  FiMessageCircle,
  FiImage,
  FiTrendingDown,
  FiActivity,
  FiDollarSign,
  FiCreditCard,
  FiShield,
  FiLock,
  FiUnlock,
  FiBell,
  FiPrinter,
  FiFileText,
  FiCheck,
  FiArchive,
  FiRepeat,
  FiMoreVertical,
  FiExternalLink,
  FiCopy,
  FiTag,
  FiCodesandbox,
  FiStar,
  FiBook as FiBookIcon,
  FiTarget as FiTargetIcon,
  FiPlus,
  FiCheckCircle,
  FiLayers, 
  FiDatabase,
  FiRefreshCw as FiRefreshCwIcon,
} from 'react-icons/fi';


import { IoSchool } from 'react-icons/io5';
import { IoDocumentText } from 'react-icons/io5';
import { IoPeopleCircle, IoNewspaper, IoClose, IoStatsChart } from 'react-icons/io5';

const normalizeLocalMobilePhone = (value = '') => {
  const digits = String(value || '').replace(/\D/g, '');
  if (!digits) return '';
  if (/^07\d{8}$/.test(digits)) return digits;
  if (/^7\d{8}$/.test(digits)) return `0${digits}`;
  if (/^2547\d{8}$/.test(digits)) return `0${digits.slice(3)}`;
  return String(value || '').trim();
};

const ACADEMIC_LEVELS = ['Grade 10', 'Grade 11', 'Grade 12', 'Form 3', 'Form 4', 'Form 1', 'Form 2'];
const STUDENT_TEMPLATE_HEADERS = [
  'Admission Number',
  'Student Name',
  'Class/Grade',
  'Stream',
  'Parent Phone',
  'Student Phone',
  'WhatsApp Phone',
  'Uploaded Category',
  'Email'
];

// Helper function for form colors
// Add these functions right after the existing getFormColor function:

// Helper function for form colors
function getFormColor(form) {
  switch (form) {
    case 'Grade 10': return 'from-sky-600 to-teal-700';
    case 'Grade 11': return 'from-indigo-600 to-teal-700';
    case 'Grade 12': return 'from-violet-600 to-emerald-700';
    case 'Form 1': return 'from-teal-600 to-teal-800';
    case 'Form 2': return 'from-emerald-500 to-emerald-700';
    case 'Form 3': return 'from-amber-500 to-amber-700';
    case 'Form 4': return 'from-emerald-600 to-emerald-800';
    default: return 'from-gray-400 to-gray-600';
  }
}

// Helper function for form badge colors (NEW - ADD THIS)
function getFormBadgeColor(form) {
  switch (form) {
    case 'Grade 10': return 'bg-gradient-to-r from-sky-600 to-teal-700 text-white';
    case 'Grade 11': return 'bg-gradient-to-r from-indigo-600 to-teal-700 text-white';
    case 'Grade 12': return 'bg-gradient-to-r from-violet-600 to-emerald-700 text-white';
    case 'Form 1': return 'bg-gradient-to-r from-teal-600 to-teal-800 text-white';
    case 'Form 2': return 'bg-gradient-to-r from-emerald-500 to-emerald-700 text-white';
    case 'Form 3': return 'bg-gradient-to-r from-amber-500 to-amber-700 text-white';
    case 'Form 4': return 'bg-gradient-to-r from-emerald-600 to-emerald-800 text-white';
    default: return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
  }
}

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Custom Toaster with increased size
const CustomToaster = () => (
  <Toaster
    position="top-right"
    richColors
    expand={true}
    toastOptions={{
      style: {
        fontSize: '1.1rem',
        padding: '20px',
        margin: '10px',
        width: '140%',
        minHeight: '80px',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
      },
      className: 'custom-toast'
    }}
  />
);

// Modern Loading Spinner

const Spinner = ({
  size = 20,
  color = "primary",
  variant = "indeterminate",
  value = 0,
}) => {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress
        size={size}
        color={color}
        variant={variant}
        value={variant === "determinate" ? value : undefined}
        thickness={4}
      />
    </Box>
  );
};


// Delete Confirmation Modal
function ModernDeleteModal({ 
  onClose, 
  onConfirm, 
  loading, 
  title = "Confirm Deletion",
  description = "This action cannot be undone",
  itemName = "",
  type = "student"
}) {
  const [confirmText, setConfirmText] = useState('')

  const getConfirmPhrase = () => {
    if (type === "batch") return "DELETE UPLOAD BATCH";
    if (type === "student") return "DELETE STUDENT";
    return "DELETE";
  }

  const handleConfirm = () => {
    const phrase = getConfirmPhrase();
    if (confirmText === phrase) {
      onConfirm()
    } else {
      sooner.error(`Please type "${phrase}" exactly to confirm deletion`)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden">
        <div className="relative bg-slate-950 p-6 text-white">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-amber-400 to-rose-500" />
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
              <FiAlertCircle className="text-white text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="text-red-100 opacity-90 text-sm mt-1">{description}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-6 space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-red-200">
              <FiTrash2 className="text-red-600 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Delete {itemName ? `"${itemName}"` : `this ${type}`}?
            </h3>
            <p className="text-gray-600 text-sm">
              This will permanently delete the record and cannot be recovered.
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-700">
              Type <span className="font-mono text-red-600 bg-red-50 px-3 py-1 rounded-lg text-xs border border-red-200">{getConfirmPhrase()}</span> to confirm:
            </label>
            <input 
              type="text" 
              value={confirmText} 
              onChange={(e) => setConfirmText(e.target.value)} 
              placeholder={`Type "${getConfirmPhrase()}" here`}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 text-base"
              autoFocus
            />
          </div>

          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border-2 border-red-200">
            <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">
              <FiAlertCircle className="text-red-600 text-sm" />
              What will happen:
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              {type === "batch" ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span>All students from this upload batch will be deleted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span>Upload record will be removed from history</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span>Student record will be permanently deleted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span>All associated data will be removed</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-4 border-t border-slate-200 bg-white">
          <button 
            onClick={onClose} 
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl transition-all duration-300 font-bold text-base disabled:opacity-50"
          >
            <FiXCircle className="text-base" /> Cancel
          </button>
          <button 
            onClick={handleConfirm} 
            disabled={loading || confirmText !== getConfirmPhrase()}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 via-red-700 to-orange-600 text-white px-4 py-3 rounded-xl transition-all duration-300 font-bold text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <CircularProgress size={14} className="text-white" />
                Deleting...
              </>
            ) : (
              <>
                <FiTrash2 className="text-base" /> Delete Forever
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// File Upload Component
function ModernFileUpload({ onFileSelect, file, onRemove, dragActive, onDrag }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const validExtensions = ['.csv', '.xlsx', '.xls', '.pdf'];
    
    if (selectedFile) {
      const ext = selectedFile.name.toLowerCase();
      if (validExtensions.some(valid => ext.endsWith(valid))) {
        onFileSelect(selectedFile);
        sooner.success('File selected successfully');
      } else {
        sooner.error('Please upload a PDF, Excel, or CSV file');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  const handleDragEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      onDrag(true);
    } else if (e.type === 'dragleave') {
      if (e.currentTarget.contains(e.relatedTarget)) return;
      onDrag(false);
    }
  };

  const fileExtension = file?.name?.split('.').pop()?.toUpperCase();

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border bg-white p-1 shadow-xl transition-all duration-300 ${
        dragActive
          ? 'border-teal-500 ring-4 ring-teal-100'
          : 'border-slate-200 hover:border-teal-300'
      }`}
      onDragEnter={handleDragEvent}
      onDragLeave={handleDragEvent}
      onDragOver={handleDragEvent}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDrag(false);
        const files = e.dataTransfer.files;
        if (files && files[0]) {
          handleFileChange({ target: { files } });
        }
      }}
    >
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className={`relative w-full rounded-[1.35rem] border-2 border-dashed px-5 py-8 text-left transition-all duration-300 sm:px-8 ${
          dragActive
            ? 'border-teal-500 bg-teal-50'
            : 'border-slate-200 bg-gradient-to-br from-slate-50 via-white to-emerald-50/50 hover:border-teal-400'
        }`}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-lg ${
              dragActive ? 'bg-teal-700 text-white' : 'bg-slate-900 text-white'
            }`}>
              {file ? <IoDocumentText className="h-6 w-6" /> : <FiUpload className="h-6 w-6" />}
            </div>

            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-700">
                Student contact register
              </p>
              <h3 className="mt-2 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                {dragActive ? 'Drop the file here' : file ? 'Student file selected' : 'Upload student contact file'}
              </h3>
              <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500">
                Upload PDF, Excel, CSV, or spreadsheet files with names, admission numbers, classes, and phone contacts.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {['.xlsx', '.xls', '.csv', '.pdf'].map((type) => (
                  <span key={type} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-black uppercase text-slate-600 shadow-sm">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {file && (
              <div className="min-w-0 rounded-2xl border border-teal-100 bg-white px-4 py-3 shadow-sm">
                <p className="max-w-[260px] truncate text-sm font-black text-slate-900">{file.name}</p>
                <p className="mt-1 text-xs font-bold text-slate-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB {fileExtension ? `- ${fileExtension}` : ''}
                </p>
              </div>
            )}
            <span className="inline-flex items-center justify-center rounded-2xl bg-teal-700 px-5 py-3 text-sm font-black text-white shadow-lg transition-colors group-hover:bg-teal-800">
              {file ? 'Replace File' : 'Choose File'}
            </span>
          </div>
        </div>
      </button>

      {file && onRemove && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
          className="absolute right-4 top-4 rounded-xl bg-white p-2 text-slate-500 shadow-md transition hover:text-red-600"
          aria-label="Remove selected file"
        >
          <FiX className="h-4 w-4" />
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls,.pdf"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

// Student Detail Modal
// Student Detail Modal
function StudentDetailModal({ student, onClose, onEdit, onDelete }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = (id, name) => {
    // Close the detail modal first, then trigger the delete
    onDelete(id, name);
    setShowDeleteModal(false);
    onClose(); // Close the detail modal
  };

  const handleDeleteClose = () => {
    setShowDeleteModal(false);
  };

  if (!student) return null;

  return (
    <>
      <Modal open={true} onClose={onClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90vw',
            maxWidth: '800px',
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: 24,
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div className="relative bg-slate-950 p-6 text-white">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-emerald-400 to-amber-400" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-2xl border border-white/10">
                  <FiUser className="text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Student Details</h2>
                  <p className="text-emerald-100 opacity-90">
                    Complete student information
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-xl transition"
              >
                <FiX className="text-xl" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-slate-50 p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
            {/* Profile Section */}
            <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-700 flex items-center justify-center">
              <FiUser className="text-white text-3xl" />
            </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {student.fullName || [student.firstName, student.middleName, student.lastName].filter(Boolean).join(' ')}
                </h3>
                <p className="text-gray-600">Admission #{student.admissionNumber}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className={`px-3 py-1 rounded-lg text-sm font-bold text-white bg-gradient-to-r ${getFormColor(student.gradeLevel || student.form)}`}>
                    {student.gradeLevel || student.form}
                  </span>
                  {student.stream && (
                    <span className="px-3 py-1 rounded-lg text-sm font-bold bg-teal-100 text-teal-800">
                      {student.stream}
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                    student.status === 'active' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {student.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Academic Info */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiBook className="text-teal-700" />
                  Academic Information
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Class / Grade</span>
                    <span className="font-semibold">{student.gradeLevel || student.form}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Class Name</span>
                    <span className="font-semibold">{student.className || student.stream || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Uploaded Category</span>
                    <span className="font-semibold">{student.uploadedCategory || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Record Info */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiDatabase className="text-teal-700" />
                  Record Information
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className="font-semibold">{student.status || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Updated</span>
                    <span className="font-semibold">{formatDate(student.updatedAt || student.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Admission Date</span>
                    <span className="font-semibold">{formatDate(student.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm md:col-span-2">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiPhone className="text-teal-700" />
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600 mb-1">Email Address</p>
                    <p className="font-semibold">{student.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Parent Phone</p>
                    <p className="font-semibold">{student.parentPhone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Student Phone</p>
                    <p className="font-semibold">{student.studentPhone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">WhatsApp Delivery Phone</p>
                    <p className="font-semibold">{student.whatsappPhone || student.parentPhone || student.studentPhone || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

   
          </div>
        </Box>
      </Modal>

      {showDeleteModal && (
        <ModernDeleteModal
          onClose={handleDeleteClose}
          onConfirm={() => handleDeleteConfirm(student.id, `${student.firstName} ${student.lastName}`)}
          loading={false}
          type="student"
          itemName={`${student.firstName} ${student.lastName}`}
        />
      )}
    </>
  );
}
// Student Edit Modal
function StudentEditModal({ student, onClose, onSave, loading }) {
  const [formData, setFormData] = useState({
    firstName: student?.firstName || '',
    middleName: student?.middleName || '',
    lastName: student?.lastName || '',
    admissionNumber: student?.admissionNumber || '',
    form: student?.gradeLevel || student?.form || ACADEMIC_LEVELS[0],
    stream: student?.stream || '',
    className: student?.className || '',
    email: student?.email || '',
    parentPhone: student?.parentPhone || '',
    studentPhone: student?.studentPhone || '',
    whatsappPhone: student?.whatsappPhone || '',
    uploadedCategory: student?.uploadedCategory || '',
    status: student?.status || 'active'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullName = [formData.firstName, formData.middleName, formData.lastName].filter(Boolean).join(' ').trim();
    const className = formData.className?.trim() || [formData.form, formData.stream].filter(Boolean).join(' ');
    await onSave(student.id, {
      ...formData,
      fullName,
      gradeLevel: formData.form,
      className,
      whatsappPhone: formData.whatsappPhone || formData.parentPhone || formData.studentPhone
    });
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90vw',
          maxWidth: '800px',
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: 24,
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div className="relative bg-slate-950 p-6 text-white">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-emerald-400 to-amber-400" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-2xl border border-white/10">
                <FiEdit className="text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Edit Student</h2>
                <p className="text-emerald-100 opacity-90">Update student information</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition"
            >
              <FiX className="text-xl" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-slate-50 p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    value={formData.middleName}
                    onChange={(e) => setFormData({...formData, middleName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>
            </div>

            {/* Academic Info */}
            <div className="bg-gray-50 p-6 rounded-2xl">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Academic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Admission Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.admissionNumber}
                    onChange={(e) => setFormData({...formData, admissionNumber: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Class / Grade *
                  </label>
                  <select
                    required
                    value={formData.form}
                    onChange={(e) => setFormData({...formData, form: e.target.value, className: formData.className || e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-600"
                  >
                    {ACADEMIC_LEVELS.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Stream
                  </label>
                  <select
                    value={formData.stream}
                    onChange={(e) => setFormData({...formData, stream: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-600"
                  >
                    <option value="">Select Stream</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="Science">Science</option>
                    <option value="Arts">Arts</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Class Name
                  </label>
                  <input
                    type="text"
                    value={formData.className}
                    onChange={(e) => setFormData({...formData, className: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-600"
                    placeholder="Grade 10 A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-600"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="graduated">Graduated</option>
                    <option value="transferred">Transferred</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Uploaded Category
                  </label>
                  <input
                    type="text"
                    value={formData.uploadedCategory}
                    onChange={(e) => setFormData({...formData, uploadedCategory: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-600"
                    placeholder="2026 Grade 10"
                  />
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 p-6 rounded-2xl">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address (optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Parent / Guardian Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({...formData, parentPhone: normalizeLocalMobilePhone(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-600"
                    placeholder="07XXXXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Student Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.studentPhone}
                    onChange={(e) => setFormData({...formData, studentPhone: normalizeLocalMobilePhone(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-600"
                    placeholder="07XXXXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    WhatsApp Delivery Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsappPhone}
                    onChange={(e) => setFormData({...formData, whatsappPhone: normalizeLocalMobilePhone(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-600"
                    placeholder="07XXXXXXXX"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-gradient-to-r from-teal-700 to-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-lg transition-all"
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} className="text-white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
}

// Student Statistics Card
function StudentStatisticsCard({ title, value, icon: Icon, color, trend = 0, prefix = '', suffix = '' }) {
  const formatValue = (val) => {
    if (typeof val === 'number') {
      return prefix + val.toLocaleString() + suffix;
    }
    return prefix + val + suffix;
  };

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${color}`}>
          <Icon className="text-white text-2xl" />
        </div>
      </div>
      <h4 className="text-3xl font-bold text-gray-900 mb-2">{formatValue(value)}</h4>
      <p className="text-gray-600 text-sm font-semibold">{title}</p>
      
      {/* Performance bar */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Performance</span>
          <span className={`font-bold ${
            trend > 0 ? 'text-green-600' : 
            trend < 0 ? 'text-red-600' : 'text-gray-600'
          }`}>
            {trend > 0 ? 'Growing' : trend < 0 ? 'Declining' : 'Stable'}
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              trend > 0 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
              trend < 0 ? 'bg-gradient-to-r from-red-500 to-orange-500' :
              'bg-gradient-to-r from-gray-400 to-gray-500'
            }`}
            style={{ width: `${Math.min(Math.abs(trend) * 3, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// Students Chart Component
function StudentsChart({ 
  data, 
  type = 'pie', 
  title, 
  colors = [
    '#0D9488', '#10B981', '#F59E0B', '#22C55E', '#EF4444', 
    '#059669', '#EC4899', '#14B8A6', '#F97316', '#047857'
  ],
  height = 400
}) {
  const chartColors = colors.slice(0, data.length);

  const renderChart = () => {
    switch (type) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={120}
                innerRadius={60}
                fill="#0D9488"
                dataKey="value"
                paddingAngle={5}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={chartColors[index % chartColors.length]}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <RechartsTooltip 
                formatter={(value, name, props) => {
                  const total = data.reduce((sum, item) => sum + item.value, 0);
                  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                  return [`${value} students (${percentage}%)`, 'Count'];
                }}
                contentStyle={{
                  borderRadius: '12px',
                  padding: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb'
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => <span style={{ color: '#374151', fontWeight: 600 }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart 
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#E5E7EB" 
                vertical={false}
              />
              <XAxis 
                dataKey="name" 
                stroke="#6B7280"
                tick={{ fill: '#4B5563', fontSize: 12 }}
                axisLine={{ stroke: '#D1D5DB' }}
              />
              <YAxis 
                stroke="#6B7280"
                tick={{ fill: '#4B5563', fontSize: 12 }}
                axisLine={{ stroke: '#D1D5DB' }}
                label={{ 
                  value: 'Students', 
                  angle: -90, 
                  position: 'insideLeft',
                  offset: -10,
                  style: { fill: '#6B7280', fontSize: 12 }
                }}
              />
              <RechartsTooltip 
                formatter={(value) => [`${value} students`, 'Count']}
                labelFormatter={(label) => `Category: ${label}`}
                contentStyle={{
                  borderRadius: '12px',
                  padding: '12px',
                  backgroundColor: 'rgba(255, 255,255, 0.95)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb'
                }}
              />
              <Legend 
                verticalAlign="top"
                height={36}
                formatter={(value) => <span style={{ color: '#374151', fontWeight: 600 }}>{value}</span>}
              />
              <Bar 
                dataKey="value" 
                name="Count"
                radius={[8, 8, 0, 0]}
                fill={chartColors[0]}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={chartColors[index % chartColors.length]}
                    stroke="#fff"
                    strokeWidth={1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      
      default:
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={120}
                fill="#0D9488"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <RechartsTooltip 
                formatter={(value) => [value, 'Students']}
                labelFormatter={(label) => `Category: ${label}`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-60 h-60 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-full blur-3xl opacity-60" />
      
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-800 via-teal-700 to-emerald-600 flex items-center justify-center shadow-2xl ring-4 ring-teal-100">
              {type === 'pie' && <FiPieChart className="text-white text-xl" />}
              {type === 'bar' && <FiBarChart2 className="text-white text-xl" />}
              {type === 'radial' && <FiTrendingUp className="text-white text-xl" />}
              {type === 'radar' && <FiTarget className="text-white text-xl" />}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h3>
              <p className="text-gray-600 text-sm">Visual distribution analysis</p>
            </div>
          </div>
        </div>

        <div className="h-96">
          {data && data.length > 0 ? (
            renderChart()
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <FiBarChart2 className="text-gray-300 text-6xl mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No data available for chart</p>
              </div>
            </div>
          )}
        </div>

        {data && data.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl">
                <div className="text-2xl font-bold text-teal-700">
                  {data.reduce((sum, d) => sum + d.value, 0).toLocaleString()}
                </div>
                <div className="text-sm font-semibold text-teal-900">Total Students</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl">
                <div className="text-2xl font-bold text-emerald-700">
                  {Math.max(...data.map(d => d.value)).toLocaleString()}
                </div>
                <div className="text-sm font-semibold text-emerald-900">Highest</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl">
                <div className="text-2xl font-bold text-amber-700">
                  {Math.min(...data.map(d => d.value)).toLocaleString()}
                </div>
                <div className="text-sm font-semibold text-amber-900">Lowest</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl">
                <div className="text-2xl font-bold text-emerald-700">
                  {data.length}
                </div>
                <div className="text-sm font-semibold text-emerald-900">Categories</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Statistics Summary Card Component
function StatisticsSummaryCard({ stats, demographics, onRefresh }) {
  const [timeAgo, setTimeAgo] = useState('');
  
  useEffect(() => {
    if (stats.globalStats?.updatedAt) {
      const updateTime = new Date(stats.globalStats.updatedAt);
      const now = new Date();
      const diffMs = now - updateTime;
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) {
        setTimeAgo('Just now');
      } else if (diffMins < 60) {
        setTimeAgo(`${diffMins} minutes ago`);
      } else if (diffMins < 1440) {
        const hours = Math.floor(diffMins / 60);
        setTimeAgo(`${hours} hours ago`);
      } else {
        const days = Math.floor(diffMins / 1440);
        setTimeAgo(`${days} days ago`);
      }
    }
  }, [stats.globalStats?.updatedAt]);
  
  const calculatePercentage = (value, total) => {
    if (total === 0) return '0%';
    return `${((value / total) * 100).toFixed(1)}%`;
  };
  
  const formDistribution = demographics.formDistribution || [];
  const totalStudents = stats.totalStudents || 0;
  const activeStudents = demographics.statusDistribution?.find(s => s.name === 'Active')?.value || 0;
  const streamCount = Object.keys(stats.streamStats || {}).length;
  const contactGroupCount = (demographics.ageGroups || []).length;
  
  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-300 shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-teal-100 to-teal-200 rounded-2xl">
            <FiBarChart2 className="text-teal-800 text-2xl" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Statistics Overview</h3>
            <p className="text-gray-600 text-sm">
              Real-time student analytics {timeAgo && `• Updated ${timeAgo}`}
            </p>
          </div>
        </div>
        <button
          onClick={onRefresh}
          className="px-5 py-3 bg-gradient-to-r from-teal-700 to-emerald-700 text-white rounded-xl font-bold flex items-center gap-3 text-sm hover:shadow-xl transition-all duration-300"
        >
          <FiRefreshCw className="text-sm" />
          Refresh Stats
        </button>
      </div>
      
      {/* Total Students Card */}
      <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-teal-700 font-bold text-sm mb-2">TOTAL STUDENTS</p>
            <h4 className="text-4xl font-bold text-gray-900">
              {totalStudents.toLocaleString()}
            </h4>
          </div>
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg">
            <FiUsers className="text-teal-700 text-3xl" />
          </div>
        </div>
      </div>
      
      {/* Form Distribution Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {formDistribution.map((form, index) => (
          <div key={index} className="bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-teal-300 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-gray-900">{form.name}</span>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: form.color }} />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {form.value.toLocaleString()}
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: totalStudents > 0 ? `${(form.value / totalStudents) * 100}%` : '0%',
                  backgroundColor: form.color
                }}
              />
            </div>
            <div className="text-right text-sm text-gray-600 mt-1">
              {calculatePercentage(form.value, totalStudents)}
            </div>
          </div>
        ))}
      </div>
      
      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl hover:shadow-lg transition-all duration-300">
          <div className="text-2xl font-bold text-emerald-700">
            {activeStudents.toLocaleString()}
          </div>
          <div className="text-sm font-semibold text-emerald-900">Active Students</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl hover:shadow-lg transition-all duration-300">
          <div className="text-2xl font-bold text-teal-700">
            {formDistribution.length.toLocaleString()}
          </div>
          <div className="text-sm font-semibold text-teal-900">Classes</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl hover:shadow-lg transition-all duration-300">
          <div className="text-2xl font-bold text-amber-700">
            {streamCount.toLocaleString()}
          </div>
          <div className="text-sm font-semibold text-amber-900">Streams</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-lg transition-all duration-300">
          <div className="text-2xl font-bold text-gray-700">
            {contactGroupCount.toLocaleString()}
          </div>
          <div className="text-sm font-semibold text-gray-900">Contact Groups</div>
        </div>
      </div>
      
      {/* Validation Status */}
      {stats.globalStats && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-bold">Data Consistency Check</span>
            <span className={`px-3 py-1 rounded-lg font-bold text-sm ${
              stats.totalStudents === (stats.globalStats.form1 + stats.globalStats.form2 + 
                stats.globalStats.form3 + stats.globalStats.form4 + (stats.globalStats.grade10 || 0) +
                (stats.globalStats.grade11 || 0) + (stats.globalStats.grade12 || 0))
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {stats.totalStudents === (stats.globalStats.form1 + stats.globalStats.form2 + 
                stats.globalStats.form3 + stats.globalStats.form4 + (stats.globalStats.grade10 || 0) +
                (stats.globalStats.grade11 || 0) + (stats.globalStats.grade12 || 0))
                ? '✓ Consistent'
                : '⚠ Inconsistent'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Enhanced Filter Component
function EnhancedFilterPanel({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  showAdvanced = false,
  onToggleAdvanced 
}) {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setLocalFilters({ ...localFilters, [key]: value });
    onFilterChange(key, value);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      search: '',
      form: '',
      stream: '',
      status: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    setLocalFilters(clearedFilters);
    onClearFilters();
  };

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-xl mb-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
          <FiFilter className="text-teal-700" />
          Advanced Filters
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleAdvanced}
            className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-teal-700 transition-colors"
          >
            {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          </button>
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 text-sm font-bold text-red-600 hover:text-red-800 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Search Students
          </label>
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              value={localFilters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Name, admission, phone..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-all duration-300 text-base"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Class / Grade
          </label>
          <select
            value={localFilters.form}
            onChange={(e) => handleFilterChange('form', e.target.value)}
            className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-all duration-300 text-base"
          >
            <option value="">All Classes</option>
            {ACADEMIC_LEVELS.map(form => (
              <option key={form} value={form}>{form}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Stream
          </label>
          <select
            value={localFilters.stream}
            onChange={(e) => handleFilterChange('stream', e.target.value)}
            className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-all duration-300 text-base"
          >
            <option value="">All Streams</option>
            {['A', 'B', 'C', 'D', 'E', 'East', 'West', 'North', 'South', 'Science', 'Arts', 'Commercial'].map(stream => (
              <option key={stream} value={stream}>{stream}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Status
          </label>
          <select
            value={localFilters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-all duration-300 text-base"
          >
            <option value="">All Status</option>
            {['active', 'inactive', 'graduated', 'transferred'].map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {showAdvanced && (
        <div className="mt-8 pt-8 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={localFilters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-all duration-300 text-base"
            >
              <option value="createdAt">Date Created</option>
              <option value="admissionNumber">Admission Number</option>
              <option value="firstName">First Name</option>
              <option value="lastName">Last Name</option>
              <option value="form">Class / Grade</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

// Upload Strategy Modal Component
function UploadStrategyModal({ open, onClose, onConfirm, loading }) {
  const [uploadType, setUploadType] = useState('new');
  const [selectedForms, setSelectedForms] = useState([]);
  const [targetForm, setTargetForm] = useState('');

  const handleFormToggle = (form) => {
    if (selectedForms.includes(form)) {
      setSelectedForms(selectedForms.filter(f => f !== form));
    } else {
      setSelectedForms([...selectedForms, form]);
    }
  };

  const handleConfirm = () => {
    if (uploadType === 'new' && selectedForms.length === 0) {
      sooner.error('Please select at least one class or grade for new upload');
      return;
    }
    
    if (uploadType === 'update' && !targetForm) {
      sooner.error('Please select a target class or grade for update');
      return;
    }
    
    onConfirm({
      uploadType,
      selectedForms,
      targetForm
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: {
            xs: '98vw',
            sm: '95vw',
            md: '650px',
            lg: '650px'
          },
          maxWidth: '650px',
          maxHeight: {
            xs: '85vh',
            sm: '90vh',
          },
          bgcolor: 'background.paper',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: 24,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div className="relative bg-slate-950 p-4 sm:p-6 text-white">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-emerald-400 to-amber-400" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 bg-white/10 rounded-2xl border border-white/10">
                <FiUpload className="text-lg sm:text-xl" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">Upload Strategy</h2>
                <p className="text-emerald-100 opacity-90 text-sm sm:text-base">
                  Choose how you want to upload students
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition"
            >
              <FiX className="text-lg sm:text-xl" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50">
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Upload Type Selection */}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Select Upload Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div
                  onClick={() => setUploadType('new')}
                  className={`p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                    uploadType === 'new'
                      ? 'border-teal-600 bg-teal-50 shadow-lg'
                      : 'border-gray-300 hover:border-teal-300'
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`p-1.5 sm:p-2 rounded-lg ${uploadType === 'new' ? 'bg-teal-100' : 'bg-gray-100'}`}>
                      <FiPlus className={`text-sm sm:text-lg ${uploadType === 'new' ? 'text-teal-700' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base">New Upload</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Add new students to selected classes</p>
                    </div>
                  </div>
                  {uploadType === 'new' && (
                    <div className="mt-2 text-xs sm:text-sm text-teal-700">
                      <FiCheckCircle className="inline mr-1" />
                      Prevents duplicates by admission number
                    </div>
                  )}
                </div>

                <div
                  onClick={() => setUploadType('update')}
                  className={`p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                    uploadType === 'update'
                      ? 'border-teal-600 bg-teal-50 shadow-lg'
                      : 'border-gray-300 hover:border-teal-300'
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`p-1.5 sm:p-2 rounded-lg ${uploadType === 'update' ? 'bg-teal-100' : 'bg-gray-100'}`}>
                      <FiDatabase className={`text-sm sm:text-lg ${uploadType === 'update' ? 'text-teal-700' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base">Update Upload</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Update an existing class with new data</p>
                    </div>
                  </div>
                  {uploadType === 'update' && (
                    <div className="mt-2 text-xs sm:text-sm text-teal-700">
                      <FiCheckCircle className="inline mr-1" />
                      Replaces entire form batch safely
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form Selection */}
            {uploadType === 'new' && (
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                  Select Classes to Upload <span className="text-xs sm:text-sm text-gray-500">(Choose one or more)</span>
                </h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {ACADEMIC_LEVELS.map((form) => (
                    <div
                      key={form}
                      onClick={() => handleFormToggle(form)}
                      className={`p-2 sm:p-3 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                        selectedForms.includes(form)
                          ? `border-teal-600 bg-gradient-to-r ${getFormColor(form)} text-white shadow-lg`
                          : 'border-gray-300 hover:border-teal-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm sm:text-base">{form}</span>
                        {selectedForms.includes(form) && (
                          <FiCheckCircle className="text-white text-sm sm:text-base" />
                        )}
                      </div>
                      <div className={`text-xs mt-0.5 sm:mt-1 ${selectedForms.includes(form) ? 'text-emerald-100' : 'text-gray-500'}`}>
                        Students will be added to {form}
                      </div>
                    </div>
                  ))}
                </div>
                {selectedForms.length > 0 && (
                  <div className="mt-2 text-xs sm:text-sm text-gray-600">
                    <FiInfo className="inline mr-1" />
                    Only students in selected classes will be processed
                  </div>
                )}
              </div>
            )}

            {uploadType === 'update' && (
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Select Class to Update</h3>
                <div className="space-y-2 sm:space-y-3">
                  {ACADEMIC_LEVELS.map((form) => (
                    <div
                      key={form}
                      onClick={() => setTargetForm(form)}
                      className={`p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                        targetForm === form
                          ? `border-teal-600 bg-gradient-to-r ${getFormColor(form)} text-white shadow-lg`
                          : 'border-gray-300 hover:border-teal-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className={`p-1.5 sm:p-2 rounded-lg ${targetForm === form ? 'bg-white/20' : 'bg-gray-100'}`}>
                            <IoSchool className={`text-sm sm:text-base ${targetForm === form ? 'text-white' : 'text-gray-500'}`} />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm sm:text-base">{form}</h4>
                            <p className={`text-xs sm:text-sm ${targetForm === form ? 'text-emerald-100' : 'text-gray-500'}`}>
                              Update students in {form}
                            </p>
                          </div>
                        </div>
                        {targetForm === form && <FiCheckCircle className="text-white text-sm sm:text-base" />}
                      </div>
                    </div>
                  ))}
                </div>
                {targetForm && (
                  <div className="mt-3 p-2 sm:p-3 bg-teal-50 rounded-lg border border-teal-200">
                    <div className="flex items-start gap-2">
                      <FiInfo className="text-teal-700 mt-0.5 text-sm sm:text-base" />
                      <div>
                        <p className="text-xs sm:text-sm text-teal-900 font-bold">Update Strategy:</p>
                        <ul className="text-xs text-teal-800 mt-1 space-y-0.5 sm:space-y-1">
                          <li>• Matches students by admission number</li>
                          <li>• Updates existing records</li>
                          <li>• Creates new students if not exists</li>
                          <li>• Marks missing students as inactive</li>
                          <li>• Preserves relational integrity</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Fixed Bottom Buttons */}
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 sm:p-6">
            <button
              onClick={onClose}
              className="flex-1 py-2 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading || (uploadType === 'new' && selectedForms.length === 0) || (uploadType === 'update' && !targetForm)}
              className="flex-1 py-2 sm:py-3 bg-gradient-to-r from-teal-700 to-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-lg transition-all text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <CircularProgress size={16} className="text-white" />
                  <span className="text-sm sm:text-base">Processing...</span>
                </>
              ) : (
                <>
                  <FiCheckCircle className="text-sm sm:text-base" />
                  <span className="text-sm sm:text-base">Continue to File Upload</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}

// Duplicate Validation Modal
function DuplicateValidationModal({ open, onClose, duplicates, onProceed, loading, uploadType, targetForm, totalRows = 0 }) {
  const [action, setAction] = useState('skip');

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: {
            xs: '98vw',
            sm: '95vw',
            md: '850px',
            lg: '850px'
          },
          maxWidth: '850px',
          maxHeight: {
            xs: '85vh',
            sm: '90vh',
          },
          bgcolor: 'background.paper',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: 24,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div className="relative bg-slate-950 p-4 sm:p-6 text-white">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 via-orange-400 to-red-500" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 bg-white/10 rounded-2xl border border-white/10">
                <FiAlertCircle className="text-lg sm:text-xl" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">Duplicate Detection</h2>
                <p className="text-amber-100 opacity-90 text-sm sm:text-base">
                  Found {duplicates.length} duplicate admission numbers
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition"
            >
              <FiX className="text-lg sm:text-xl" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50">
          <div className="p-4 sm:p-6">
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-amber-500 rounded-full"></div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  {uploadType === 'update' 
                    ? `Updating ${targetForm}: ${duplicates.length} existing students will be updated`
                    : `${duplicates.length} admission numbers already exist in the database`
                  }
                </h3>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                <p className="text-amber-800 text-xs sm:text-sm">
                  <strong>Note:</strong> Admission numbers must be unique. The system uses admission number as the primary identifier.
                </p>
              </div>
            </div>

            {/* Duplicate List */}
            <div className="mb-4 sm:mb-6">
              <h4 className="font-bold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Duplicate Admission Numbers:</h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-4 py-2 text-left text-xs sm:text-sm font-bold text-gray-700">Row #</th>
                        <th className="px-3 sm:px-4 py-2 text-left text-xs sm:text-sm font-bold text-gray-700">Admission</th>
                        <th className="px-3 sm:px-4 py-2 text-left text-xs sm:text-sm font-bold text-gray-700">Name</th>
                        <th className="px-3 sm:px-4 py-2 text-left text-xs sm:text-sm font-bold text-gray-700">Form</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {duplicates.slice(0, 50).map((dup, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600">{dup.row}</td>
                          <td className="px-3 sm:px-4 py-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800">
                              {dup.admissionNumber}
                            </span>
                          </td>
                          <td className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-900">{dup.name}</td>
                          <td className="px-3 sm:px-4 py-2">
                            <span className={`px-2 py-1 rounded-md text-xs font-bold ${getFormColor(dup.form)} text-white`}>
                              {dup.form}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {duplicates.length > 50 && (
                  <div className="px-4 py-2 text-xs sm:text-sm text-gray-500 text-center border-t border-gray-200 bg-gray-50">
                    ... and {duplicates.length - 50} more duplicates
                  </div>
                )}
              </div>
            </div>

            {/* Action Selection */}
            {uploadType === 'new' && (
              <div className="mb-4 sm:mb-6">
                <h4 className="font-bold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">How should we handle duplicates?</h4>
                <div className="space-y-2 sm:space-y-3">
                  <div
                    onClick={() => setAction('skip')}
                    className={`p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      action === 'skip'
                        ? 'border-teal-600 bg-teal-50'
                        : 'border-gray-300 hover:border-teal-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`p-1.5 sm:p-2 rounded-lg ${action === 'skip' ? 'bg-teal-100' : 'bg-gray-100'}`}>
                        <FiCheckCircle className={`text-sm sm:text-base ${action === 'skip' ? 'text-teal-700' : 'text-gray-500'}`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm sm:text-base">Skip Duplicates</h4>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Keep existing records, skip duplicates in upload file
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setAction('replace')}
                    className={`p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      action === 'replace'
                        ? 'border-teal-600 bg-teal-50'
                        : 'border-gray-300 hover:border-teal-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`p-1.5 sm:p-2 rounded-lg ${action === 'replace' ? 'bg-teal-100' : 'bg-gray-100'}`}>
                        <FiDatabase className={`text-sm sm:text-base ${action === 'replace' ? 'text-teal-700' : 'text-gray-500'}`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm sm:text-base">Replace Existing</h4>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Update existing records with new data from upload file
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="bg-gray-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
              <h4 className="font-bold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">Summary:</h4>
              <ul className="text-xs sm:text-sm text-gray-700 space-y-0.5 sm:space-y-1">
                {uploadType === 'new' ? (
                  <>
                    <li className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-600 rounded-full"></div>
                      <span>Total students in file: {totalRows || duplicates.length}</span>
                    </li>
                    <li className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-500 rounded-full"></div>
                      <span>Duplicate admission numbers: {duplicates.length}</span>
                    </li>
                    <li className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
                      <span>New students to add: {Math.max((totalRows || 0) - duplicates.length, 0)}</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-600 rounded-full"></div>
                      <span>Rows in file: {totalRows || duplicates.length}</span>
                    </li>
                    <li className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-600 rounded-full"></div>
                      <span>Updating form: {targetForm}</span>
                    </li>
                    <li className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-500 rounded-full"></div>
                      <span>Students to update: {duplicates.length}</span>
                    </li>
                    <li className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-600 rounded-full"></div>
                      <span>Existing students not in file will be marked inactive</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Buttons */}
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 sm:p-6">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all disabled:opacity-50 text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={() => onProceed(action)}
              disabled={loading}
              className="flex-1 py-2 sm:py-3 bg-gradient-to-r from-teal-700 to-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <CircularProgress size={16} className="text-white" />
                  <span className="text-sm sm:text-base">Processing...</span>
                </>
              ) : uploadType === 'update' ? (
                <>
                  <FiCheckCircle className="text-sm sm:text-base" />
                  <span className="text-sm sm:text-base">Update Form</span>
                </>
              ) : (
                <>
                  <FiCheckCircle className="text-sm sm:text-base" />
                  <span className="text-sm sm:text-base">{action === 'skip' ? 'Skip Duplicates' : 'Replace Existing'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}

// Main Component
export default function ModernStudentBulkUpload() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [view, setView] = useState('upload');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ type: '', id: '', name: '' });
  const [showStrategyModal, setShowStrategyModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [uploadStrategy, setUploadStrategy] = useState(null);
  const [duplicates, setDuplicates] = useState([]);
  const [duplicateSummary, setDuplicateSummary] = useState({ totalRows: 0 });
  const [validationLoading, setValidationLoading] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null); // <-- ADD THIS

  
  const [filters, setFilters] = useState({
    search: '',
    form: '',
    stream: '',
    status: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const [stats, setStats] = useState({
    totalStudents: 0,
    formStats: {},
    streamStats: {},
    ageStats: {},
    globalStats: { totalStudents: 0, form1: 0, form2: 0, form3: 0, form4: 0, grade10: 0, grade11: 0, grade12: 0 },
    validation: { isValid: true }
  });

  const [demographics, setDemographics] = useState({
    ageGroups: [],
    formDistribution: [],
    streamDistribution: [],
    statusDistribution: []
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1
  });

  const fileInputRef = useRef(null);

  // Helper function to process API responses
  const processApiResponse = (data) => {
    if (data.data && data.data.stats) {
      return data.data.stats;
    } else if (data.stats) {
      return data.stats;
    } else if (data.data) {
      return data.data;
    } else {
      return data;
    }
  };

  const describeStudentUploadError = (payloadOrMessage, suggestion = '') => {
    const message = typeof payloadOrMessage === 'string'
      ? payloadOrMessage
      : payloadOrMessage?.error || payloadOrMessage?.message || 'Upload failed';

    if (message.includes('Invalid file type')) {
      return 'Upload a PDF, Excel, or CSV file that matches the current student contact template.';
    }
    if (message.includes('No readable student rows') || message.includes('empty')) {
      return 'The file looks empty or unreadable. Confirm the first row contains student data and the sheet is not blank.';
    }
    if (message.includes('Missing required columns')) {
      return `${message}. Use the current template so admission number, student name, class or grade, and phone contacts are present.`;
    }
    if (message.includes('took too long') || message.includes('timed out')) {
      return 'The student upload is taking longer than expected. Please retry, keep this page open, and use the current template for large files.';
    }
    if (message.includes('interrupted') || message.includes('network') || message.includes('connection')) {
      return 'The student upload was interrupted before it finished saving. Check your connection and retry while keeping this page open.';
    }
    if (message.includes('must match the selected update form') || message.includes('not in the selected upload forms')) {
      return message;
    }
    if (message.includes('duplicate')) {
      return 'Duplicate admission numbers were found. Review the duplicate list before continuing.';
    }
    if (message.includes('Invalid form selection') || message.includes('Please select')) {
      return message;
    }

    return suggestion ? `${message} ${suggestion}`.trim() : message;
  };



// Helper function for protected operations only
const getAuthTokensForProtectedOps = () => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    throw new Error('Cannot access localStorage on server side');
  }
  
  const adminToken = localStorage.getItem('admin_token');
  const deviceToken = localStorage.getItem('device_token');
  
  if (!adminToken || !deviceToken) {
    throw new Error('Authentication required for this action. Please login.');
  }
  
  return { adminToken, deviceToken };
};

// Helper function for protected operations
const getAuthHeaders = (isProtected = false) => {
  if (isProtected) {
    try {
      const { adminToken, deviceToken } = getAuthTokensForProtectedOps();
      return {
        'Authorization': `Bearer ${adminToken}`,
        'x-device-token': deviceToken,
        'Content-Type': 'application/json'
      };
    } catch (error) {
      console.error('Auth error:', error);
      throw error;
    }
  }
  return {
    'Content-Type': 'application/json'
  };
};

  // Enhanced loadStats function
  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/studentupload?action=stats');
      const result = await res.json();
      
      if (result.success) {
        const apiStats = processApiResponse(result) || {
          totalStudents: 0,
          form1: 0,
          form2: 0,
          form3: 0,
          form4: 0,
          grade10: 0,
          grade11: 0,
          grade12: 0,
          updatedAt: new Date()
        };
        
        const studentsRes = await fetch('/api/studentupload?limit=1000');
        const studentsData = await studentsRes.json();
        
        if (studentsData.success) {
          const allStudents = studentsData.data?.students || studentsData.students || [];
          const totalStudents = apiStats.totalStudents || allStudents.length;
          
          const streamDistribution = {};
          const statusDistribution = {};
          
          allStudents.forEach(student => {
            const stream = student.stream || 'Unassigned';
            streamDistribution[stream] = (streamDistribution[stream] || 0) + 1;
            
            const status = student.status || 'active';
            statusDistribution[status] = (statusDistribution[status] || 0) + 1;
          });
          
          const contactDistribution = {
            'WhatsApp ready': allStudents.filter(student => student.whatsappPhone || student.parentPhone || student.studentPhone).length,
            'Parent phone': allStudents.filter(student => student.parentPhone).length,
            'Student phone': allStudents.filter(student => student.studentPhone).length,
            'Optional email': allStudents.filter(student => student.email).length
          };
          
          const formDistribution = {
            'Grade 10': apiStats.grade10 || 0,
            'Grade 11': apiStats.grade11 || 0,
            'Grade 12': apiStats.grade12 || 0,
            'Form 1': apiStats.form1 || 0,
            'Form 2': apiStats.form2 || 0,
            'Form 3': apiStats.form3 || 0,
            'Form 4': apiStats.form4 || 0
          };
          
          const formChartData = Object.entries(formDistribution).map(([name, value]) => ({
            name,
            value,
            color: 
              name === 'Grade 10' ? '#0284C7' :
              name === 'Grade 11' ? '#4F46E5' :
              name === 'Grade 12' ? '#7C3AED' :
              name === 'Form 1' ? '#0D9488' :
              name === 'Form 2' ? '#10B981' :
              name === 'Form 3' ? '#F59E0B' :
              '#047857'
          }));
          
          const streamChartData = Object.entries(streamDistribution)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([name, value], index) => ({
              name: name.length > 10 ? name.substring(0, 10) + '...' : name,
              fullName: name,
              value,
              color: [
                '#0D9488', '#10B981', '#F59E0B', '#22C55E', '#EF4444',
                '#059669', '#EC4899', '#14B8A6', '#F97316', '#047857'
              ][index % 10]
            }));
          
          const contactChartData = Object.entries(contactDistribution)
            .filter(([_, value]) => value > 0)
            .map(([name, value], index) => ({
              name,
              value,
              color: ['#0D9488', '#10B981', '#F59E0B', '#047857', '#EF4444'][index % 5]
            }));
          
          const statusChartData = [
            { name: 'Active', value: statusDistribution.active || 0, color: '#10B981' },
            { name: 'Inactive', value: statusDistribution.inactive || 0, color: '#EF4444' },
            { name: 'Graduated', value: statusDistribution.graduated || 0, color: '#047857' },
            { name: 'Transferred', value: statusDistribution.transferred || 0, color: '#F59E0B' }
          ];
          
          setStats({
            totalStudents: totalStudents,
            globalStats: apiStats,
            formStats: formDistribution,
            streamStats: streamDistribution,
            statusStats: statusDistribution,
            ageStats: contactDistribution,
            validation: {
              isValid: totalStudents === ((apiStats.form1 || 0) + (apiStats.form2 || 0) + 
                (apiStats.form3 || 0) + (apiStats.form4 || 0) + (apiStats.grade10 || 0) +
                (apiStats.grade11 || 0) + (apiStats.grade12 || 0))
            }
          });
          
          setDemographics({
            formDistribution: formChartData,
            streamDistribution: streamChartData,
            ageGroups: contactChartData,
            statusDistribution: statusChartData
          });
          
        } else {
          sooner.error('Failed to load student data for demographics');
        }
      } else {
        sooner.error('Failed to load statistics');
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
      sooner.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };
const handleAuthError = (error) => {
  console.error('Authentication error:', error);
  sooner.error('Session expired. Please login again.');
  
  // Optional: Clear tokens and redirect to login
  localStorage.removeItem('admin_token');
  localStorage.removeItem('device_token');
  
  // Optional: Redirect to login page or show login modal
  // window.location.href = '/login';
  
  // Optional: Show login modal instead of redirect
  // setShowLoginModal(true);
};

  const refreshStatistics = async () => {
    try {
      const res = await fetch('/api/studentupload?action=stats');
      const result = await res.json();
      
      if (result.success) {
        const apiStats = processApiResponse(result);
        
        if (apiStats) {
          setStats(prev => ({
            ...prev,
            globalStats: apiStats,
            totalStudents: apiStats.totalStudents || prev.totalStudents
          }));
          
          const formChartData = [
            { name: 'Form 1', value: apiStats.form1 || 0, color: '#0D9488' },
            { name: 'Form 2', value: apiStats.form2 || 0, color: '#10B981' },
            { name: 'Form 3', value: apiStats.form3 || 0, color: '#F59E0B' },
            { name: 'Form 4', value: apiStats.form4 || 0, color: '#047857' }
          ];
          
          setDemographics(prev => ({
            ...prev,
            formDistribution: formChartData
          }));
          
          sooner.success('Statistics updated successfully!');
        }
      }
    } catch (error) {
      console.error('Failed to refresh statistics:', error);
      sooner.error('Failed to refresh statistics');
    }
  };

  const loadStudents = async (page = 1) => {
    setLoading(true);
    try {
      let url = `/api/studentupload?page=${page}&limit=${pagination.limit}&includeStats=false`;
      
      if (filters.search) url += `&search=${encodeURIComponent(filters.search)}`;
      if (filters.form) url += `&form=${encodeURIComponent(filters.form)}`;
      if (filters.stream) url += `&stream=${encodeURIComponent(filters.stream)}`;
      if (filters.status) url += `&status=${encodeURIComponent(filters.status)}`;
      if (filters.sortBy) url += `&sortBy=${encodeURIComponent(filters.sortBy)}`;
      if (filters.sortOrder) url += `&sortOrder=${encodeURIComponent(filters.sortOrder)}`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Failed to load students');
      
      if (data.success) {
        setStudents(data.data?.students || data.students || []);
        setPagination(data.data?.pagination || data.pagination || {
          page: page,
          limit: pagination.limit,
          total: 0,
          pages: 1
        });
      } else {
        sooner.error(data.message || 'Failed to load students');
      }
    } catch (error) {
      console.error('Failed to load students:', error);
      sooner.error(error.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

const loadUploadHistory = async (page = 1) => {
  setHistoryLoading(true);
  try {
    // Add status=completed to the API call
    const res = await fetch(`/api/studentupload?action=uploads&page=${page}&limit=30`);
    const data = await res.json();
    if (data.success) {
      setUploadHistory(data.uploads || []);
    } else {
      sooner.error('Failed to load upload history');
    }
  } catch (error) {
    console.error('Failed to load history:', error);
    sooner.error('Failed to load upload history');
  } finally {
    setHistoryLoading(false);
  }
};

  // Auto-refresh for demographics view
  useEffect(() => {
    let intervalId;
    
    if (view === 'demographics') {
      intervalId = setInterval(() => {
        refreshStatistics();
      }, 30000);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [view]);

  // Initial load
  useEffect(() => {
    loadStats();
    loadStudents();
    loadUploadHistory();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      form: '',
      stream: '',
      status: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    loadStudents(1);
  };

  const handleSort = (field) => {
    const newSortOrder = filters.sortBy === field && filters.sortOrder === 'desc' ? 'asc' : 'desc';
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: newSortOrder
    }));
    loadStudents(pagination.page);
  };

  const handleDrag = useCallback((active) => {
    setDragActive(active);
  }, []);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setResult(null);
  };

const checkDuplicates = async () => {
  if (!file || !uploadStrategy) {
    sooner.error('Please select a file and upload strategy first');
    return;
  }

  setValidationLoading(true);
  try {
    // GET auth tokens for protected operation
    let authHeaders = {};
    try {
      const tokens = getAuthTokensForProtectedOps();
      authHeaders = {
        'Authorization': `Bearer ${tokens.adminToken}`,
        'x-device-token': tokens.deviceToken
      };
    } catch (authError) {
      sooner.error(authError.message);
      setValidationLoading(false);
      return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('checkDuplicates', 'true');
    
    if (uploadStrategy.uploadType === 'new') {
      formData.append('uploadType', 'new');
      formData.append('forms', JSON.stringify(uploadStrategy.selectedForms));
    } else {
      formData.append('uploadType', 'update');
      formData.append('targetForm', uploadStrategy.targetForm);
    }

    const response = await fetch('/api/studentupload', {
      method: 'POST',
      headers: authHeaders,
      body: formData
    });

    if (response.status === 401 || response.status === 403) {
      throw new Error('Authentication failed. Please login again.');
    }

    const data = await response.json();
    
    if (data.success) {
      setDuplicateSummary({ totalRows: data.totalRows || 0 });
      if (data.duplicates && data.duplicates.length > 0) {
        setDuplicates(data.duplicates);
        setShowValidationModal(true);
      } else {
        // No duplicates, proceed with upload
        proceedWithUpload('skip');
      }
    } else {
      sooner.error(describeStudentUploadError(data, data.suggestion));
    }
  } catch (error) {
    console.error('Validation error:', error);
    
    if (error.message.includes('Authentication') || error.message.includes('login')) {
      sooner.error('Authentication failed. Please login again to continue.');
    } else {
      sooner.error(describeStudentUploadError(error.message));
    }
  } finally {
    setValidationLoading(false);
  }
};

const proceedWithUpload = async (duplicateAction = 'skip') => {
  setUploading(true);
  setShowValidationModal(false);
  
  // GET auth tokens for protected upload operation
  let authHeaders = {};
  try {
    const tokens = getAuthTokensForProtectedOps();
    authHeaders = {
      'Authorization': `Bearer ${tokens.adminToken}`,
      'x-device-token': tokens.deviceToken
    };
  } catch (authError) {
    sooner.error(authError.message);
    setUploading(false);
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('uploadType', uploadStrategy.uploadType);
  
  if (uploadStrategy.uploadType === 'new') {
    formData.append('forms', JSON.stringify(uploadStrategy.selectedForms));
    formData.append('duplicateAction', duplicateAction);
  } else {
    formData.append('targetForm', uploadStrategy.targetForm);
  }

  try {
    const response = await fetch('/api/studentupload', {
      method: 'POST',
      headers: authHeaders,
      body: formData
    });

    if (response.status === 401 || response.status === 403) {
      throw new Error('Authentication failed. Please login again.');
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(describeStudentUploadError(data, data.suggestion));
    }
    
    setResult(data);
    
    if (data.success) {
      let successMessage = '';
      if (uploadStrategy.uploadType === 'new') {
        successMessage = `✅ New upload successful! ${data.processingStats?.validRows || 0} students processed.`;
      } else {
        successMessage = `✅ Update successful! Form ${uploadStrategy.targetForm} updated: ${data.processingStats?.updatedRows || 0} updated, ${data.processingStats?.createdRows || 0} created.`;
      }

      if ((data.processingStats?.skippedRows || 0) > 0) {
        successMessage += ` ${data.processingStats.skippedRows} row(s) were skipped.`;
      }
      if ((data.processingStats?.errorRows || 0) > 0) {
        successMessage += ` ${data.processingStats.errorRows} row(s) need review.`;
      }
      
      sooner.success(successMessage);
      
      if (data.errors && data.errors.length > 0) {
        data.errors.slice(0, 3).forEach(error => {
          sooner.error(error, { duration: 5000 });
        });
        if (data.errors.length > 3) {
          sooner.error(`... and ${data.errors.length - 3} more errors`, { duration: 5000 });
        }
      }
      
      await Promise.all([loadStudents(1), loadUploadHistory(1), loadStats()]);
      setFile(null);
      setUploadStrategy(null);
      setDuplicateSummary({ totalRows: 0 });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else {
      sooner.error(describeStudentUploadError(data, data.suggestion));
    }
  } catch (error) {
    console.error('Upload error:', error);
    
    // Handle specific authentication errors
    if (error.message.includes('Authentication') || error.message.includes('login')) {
      sooner.error('Authentication failed. Please login again to continue.');
      // Optionally redirect to login or show login modal
    } else {
      sooner.error(describeStudentUploadError(error.message));
    }
  } finally {
    setUploading(false);
  }
};


  const handleDeleteBatch = async (batchId, batchName) => {
    setDeleteTarget({ type: 'batch', id: batchId, name: batchName });
    setShowDeleteModal(true);
  };

  const handleDeleteStudent = async (studentId, studentName) => {
    setDeleteTarget({ type: 'student', id: studentId, name: studentName });
    setShowDeleteModal(true);
  };

const confirmDelete = async () => {
  try {
    // GET auth headers for protected operation
    const authHeaders = getAuthHeaders(true);
    
    let url;
    
    if (deleteTarget.type === 'batch') {
      url = `/api/studentupload?batchId=${deleteTarget.id}`;
    } else {
      // For student deletion, use the dynamic route with the student ID
      url = `/api/studentupload/${deleteTarget.id}`;
    }

    const res = await fetch(url, { 
      method: 'DELETE',
      headers: {
        ...authHeaders
      }
    });
    
    if (res.status === 401 || res.status === 403) {
      throw new Error('Authentication failed');
    }
    
    const data = await res.json();
    
    if (data.success) {
      sooner.success(data.message || 'Deleted successfully');
      await Promise.all([loadStudents(pagination.page), loadUploadHistory(1), loadStats()]);
      if (deleteTarget.type === 'student') {
        setSelectedStudent(null);
      }
    } else {
      sooner.error(data.message || 'Failed to delete');
    }
  } catch (error) {
    console.error('Delete failed:', error);
    if (error.message.includes('Authentication')) {
      handleAuthError(error);
    } else {
      sooner.error('Failed to delete');
    }
  } finally {
    setShowDeleteModal(false);
    setDeleteTarget({ type: '', id: '', name: '' });
  }
};

const updateStudent = async (studentId, studentData) => {
  setLoading(true);
  try {
    // GET auth headers for protected operation
    const authHeaders = getAuthHeaders(true);
    
    const res = await fetch(`/api/studentupload`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...authHeaders
      },
      body: JSON.stringify({ id: studentId, ...studentData })
    });
    
    if (res.status === 401 || res.status === 403) {
      throw new Error('Authentication failed');
    }
    
    const data = await res.json();
    
    if (data.success) {
      sooner.success('Student updated successfully');
      await loadStudents(pagination.page);
      setEditingStudent(null);
    } else {
      sooner.error(data.message || 'Failed to update student');
    }
  } catch (error) {
    console.error('Update failed:', error);
    if (error.message.includes('Authentication')) {
      handleAuthError(error);
    } else {
      sooner.error('Failed to update student');
    }
  } finally {
    setLoading(false);
  }
};

 const downloadCSVTemplate = () => {
    const sampleRows = [
      STUDENT_TEMPLATE_HEADERS,
      ['ADM001', 'Jane Wanjiku Mwangi', 'Grade 10', 'A', '0793472960', '', '0793472960', '2026 Grade 10', '']
    ];
    const csvContent = sampleRows
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_contact_upload_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

const downloadExcelTemplate = () => {
  const worksheetData = [
    STUDENT_TEMPLATE_HEADERS,
    ['ADM001', 'Jane Wanjiku Mwangi', 'Grade 10', 'A', '0793472960', '', '0793472960', '2026 Grade 10', '']
  ];
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Student Contacts');
  XLSX.writeFile(wb, 'student_contact_upload_template.xlsx');
};


  const exportStudentsToCSV = () => {
    if (students.length === 0) {
      sooner.error('No students to export');
      return;
    }

    const headers = ['Admission Number', 'Student Name', 'Class/Grade', 'Class Name', 'Stream', 'Status', 'Parent Phone', 'Student Phone', 'WhatsApp Phone', 'Uploaded Category', 'Email'];
    const data = students.map(student => [
      student.admissionNumber,
      student.fullName || [student.firstName, student.middleName, student.lastName].filter(Boolean).join(' '),
      student.gradeLevel || student.form,
      student.className || '',
      student.stream || '',
      student.status,
      student.parentPhone || '',
      student.studentPhone || '',
      student.whatsappPhone || '',
      student.uploadedCategory || '',
      student.email || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const date = new Date().toISOString().split('T')[0];
    a.download = `students_export_${date}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    sooner.success(`Exported ${students.length} students to CSV`);
  };

  const exportStudentsToExcel = () => {
    if (!students || students.length === 0) {
      sooner.error('No students to export');
      return;
    }

    const worksheetData = [
      ['Admission Number', 'Student Name', 'Class/Grade', 'Class Name', 'Stream', 'Status', 'Parent Phone', 'Student Phone', 'WhatsApp Phone', 'Uploaded Category', 'Email'],
      ...students.map(student => [
        student.admissionNumber,
        student.fullName || [student.firstName, student.middleName, student.lastName].filter(Boolean).join(' '),
        student.gradeLevel || student.form,
        student.className || '',
        student.stream || '',
        student.status,
        student.parentPhone || '',
        student.studentPhone || '',
        student.whatsappPhone || '',
        student.uploadedCategory || '',
        student.email || ''
      ])
    ];

    try {
      const ws = XLSX.utils.aoa_to_sheet(worksheetData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Students');
      XLSX.writeFile(wb, `students_export_${new Date().toISOString().split('T')[0]}.xlsx`);
      sooner.success(`Exported ${students.length} students to Excel`);
    } catch (err) {
      console.error('Excel export failed', err);
      sooner.error('Failed to export to Excel');
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      loadStudents(1);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      loadStudents(newPage);
    }
  };

  // Handle upload strategy confirmation
  const handleStrategyConfirm = (strategy) => {
    setUploadStrategy(strategy);
    setShowStrategyModal(false);
    sooner.success(`Strategy set: ${strategy.uploadType === 'new' ? 'New Upload' : 'Update Upload'} ${strategy.uploadType === 'new' ? `for ${strategy.selectedForms.join(', ')}` : `for ${strategy.targetForm}`}`);
  };

  // Handle file upload with strategy
  const handleUploadWithStrategy = () => {
    if (!uploadStrategy) {
      setShowStrategyModal(true);
      return;
    }
    
    if (!file) {
      sooner.error('Please select a file first');
      return;
    }
    
    // Check for duplicates before upload
    checkDuplicates();
  };

  if (loading && students.length === 0 && view !== 'upload' && view !== 'demographics' && view !== 'students') {
    return <Spinner  />;
  }

  return (
    <div className="p-6 space-y-6">
      <CustomToaster />

      {/* Welcome Section */}
      <div className="relative bg-gradient-to-r from-teal-700 via-emerald-700 to-teal-900 rounded-2xl p-8 text-white overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-2xl">
              <IoSparkles className="text-2xl text-yellow-300" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Student Bulk Upload & Analytics</h1>
              <p className="text-emerald-100 text-lg mt-2 max-w-2xl">
                Comprehensive student management with structured upload strategy, 
                duplicate prevention, and real-time analytics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={() => {
                setLoading(true);
                loadStats();
              }}
              disabled={loading}
              className="bg-white text-teal-700 px-6 py-3 rounded-xl font-bold text-base flex items-center gap-2 shadow-lg disabled:opacity-60 hover:shadow-xl transition-all duration-300"
            >
              {loading ? (
                <CircularProgress size={16} color="inherit" thickness={6} />
              ) : (
                <FiRefreshCwIcon className="text-base" />
              )}
              {loading ? 'Syncing...' : 'Refresh Stats'}
            </button>

            <button
              onClick={exportStudentsToCSV}
              disabled={students.length === 0 || loading}
              className="text-white/80 hover:text-white px-6 py-3 rounded-xl font-bold text-base border border-white/20 flex items-center gap-2 disabled:opacity-50 hover:bg-white/10 transition-all duration-300"
            >
              <FiDownload className="text-base" />
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl p-3 border-2 border-gray-200 shadow-2xl">
        <div className="flex flex-wrap items-center gap-2 p-2">
          <button
            onClick={() => setView('upload')}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-3 text-base transition-all duration-300 ${
              view === 'upload'
                ? 'bg-gradient-to-r from-teal-700 to-emerald-800 text-white shadow-xl'
                : 'text-gray-700 hover:text-teal-700'
            }`}
          >
            <FiUpload className="text-sm" />
            Bulk Upload
          </button>
          <button
            onClick={() => {
              setView('students');
              loadStudents(1);
            }}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-3 text-base transition-all duration-300 ${
              view === 'students'
                ? 'bg-gradient-to-r from-teal-700 to-emerald-800 text-white shadow-xl'
                : 'text-gray-700 hover:text-teal-700'
            }`}
          >
            <FiUsers className="text-sm" />
            Students ({stats.totalStudents || 0})
          </button>
          <button
            onClick={() => {
              setView('demographics');
              loadStats();
            }}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-3 text-base transition-all duration-300 ${
              view === 'demographics'
                ? 'bg-gradient-to-r from-teal-700 to-emerald-800 text-white shadow-xl'
                : 'text-gray-700 hover:text-teal-700'
            }`}
          >
            <FiPieChart className="text-sm" />
            Demographics
          </button>
          <button
            onClick={() => {
              setView('history');
              loadUploadHistory(1);
            }}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-3 text-base transition-all duration-300 ${
              view === 'history'
                ? 'bg-gradient-to-r from-teal-700 to-emerald-800 text-white shadow-xl'
                : 'text-gray-700 hover:text-teal-700'
            }`}
          >
            <FiClock className="text-sm" />
            Upload History
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {view === 'upload' && (
          <div className="space-y-6">
            {/* Statistics Cards Row - Modern Version */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StudentStatisticsCard
                title="Total Students"
                value={stats.totalStudents}
                icon={FiUsers}
                color="from-emerald-600 to-emerald-800"
                trend={8.5}
              />
              <StudentStatisticsCard
                title="Form 1 Students"
                value={stats.globalStats?.form1 || 0}
                icon={IoSchool}
                color="from-teal-600 to-teal-800"
                trend={5.2}
              />
              <StudentStatisticsCard
                title="Active Students"
                value={demographics.statusDistribution?.find(s => s.name === 'Active')?.value || 0}
                icon={FiAward}
                color="from-emerald-500 to-emerald-700"
                trend={12.3}
              />
              <StudentStatisticsCard
                title="Streams Tracked"
                value={Object.keys(stats.streamStats || {}).length}
                icon={FiLayers}
                color="from-emerald-600 to-green-700"
                trend={2.1}
              />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Upload Strategy Info */}
                <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-6 border-2 border-emerald-300">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-emerald-900 flex items-center gap-3">
                      <FiLayers className="text-emerald-700 text-2xl" />
                      Upload Strategy
                    </h3>
                    {uploadStrategy && (
                      <span className="px-4 py-2 bg-teal-700 text-white rounded-lg font-bold text-sm">
                        {uploadStrategy.uploadType === 'new' 
                          ? `New Upload for ${uploadStrategy.selectedForms.join(', ')}`
                          : `Update Upload for ${uploadStrategy.targetForm}`
                        }
                      </span>
                    )}
                  </div>
                  
                  {!uploadStrategy ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FiUpload className="text-teal-700 text-2xl" />
                      </div>
                      <p className="text-teal-800 font-bold text-lg mb-4">
                        No upload strategy selected
                      </p>
                      <button
                        onClick={() => setShowStrategyModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-teal-700 to-emerald-800 text-white rounded-xl font-bold flex items-center gap-3 mx-auto hover:shadow-xl transition-all duration-300"
                      >
                        <FiSettings className="text-base" />
                        Select Upload Strategy
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl p-4 border border-emerald-200">
                          <h4 className="font-bold text-gray-900 mb-2">Upload Type</h4>
                          <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-lg ${
                              uploadStrategy.uploadType === 'new' 
                                ? 'bg-teal-100 text-teal-800' 
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {uploadStrategy.uploadType === 'new' ? <FiPlus /> : <FiDatabase />}
                            </div>
                            <span className="font-bold text-gray-900">
                              {uploadStrategy.uploadType === 'new' ? 'New Upload' : 'Update Upload'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-xl p-4 border border-emerald-200">
                          <h4 className="font-bold text-gray-900 mb-2">Target Classes</h4>
                          <div className="flex flex-wrap gap-2">
                            {uploadStrategy.uploadType === 'new' 
                              ? uploadStrategy.selectedForms.map(form => (
                                  <span key={form} className={`px-3 py-1 rounded-lg text-sm font-bold text-white bg-gradient-to-r ${getFormColor(form)}`}>
                                    {form}
                                  </span>
                                ))
                              : (
                                <span className={`px-3 py-1 rounded-lg text-sm font-bold text-white bg-gradient-to-r ${getFormColor(uploadStrategy.targetForm)}`}>
                                  {uploadStrategy.targetForm}
                                </span>
                              )
                            }
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl p-4 border border-emerald-200">
                        <h4 className="font-bold text-gray-900 mb-2">Strategy Details</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {uploadStrategy.uploadType === 'new' ? (
                            <>
                              <li className="flex items-center gap-2">
                                <FiCheckCircle className="text-green-500" />
                                <span>Admission number is unique identifier</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <FiCheckCircle className="text-green-500" />
                                <span>Prevents duplicate admission numbers</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <FiCheckCircle className="text-green-500" />
                                <span>Only processes selected classes</span>
                              </li>
                            </>
                          ) : (
                            <>
                              <li className="flex items-center gap-2">
                                <FiCheckCircle className="text-green-500" />
                                <span>Updates the selected class safely</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <FiCheckCircle className="text-green-500" />
                                <span>Matches students by admission number</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <FiCheckCircle className="text-green-500" />
                                <span>Preserves relational integrity</span>
                              </li>
                            </>
                          )}
                        </ul>
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowStrategyModal(true)}
                          className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:border-teal-600 hover:text-teal-700 transition-all duration-300"
                        >
                          Change Strategy
                        </button>
                        <button
                          onClick={() => setUploadStrategy(null)}
                          className="px-4 py-2 border-2 border-red-300 text-red-700 rounded-lg font-bold hover:border-red-500 hover:text-red-800 transition-all duration-300"
                        >
                          Clear Strategy
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* File Upload Section */}
                <ModernFileUpload
                  onFileSelect={handleFileSelect}
                  file={file}
                  onRemove={() => setFile(null)}
                  dragActive={dragActive}
                  onDrag={handleDrag}
                />

                {file && (
                  <div className="bg-white rounded-2xl p-6 border-2 border-gray-300 shadow-2xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                        <div className="p-4 bg-gradient-to-r from-teal-100 to-teal-200 rounded-2xl">
                          {file.name.endsWith('.csv') ? (
                            <FiFile className="text-teal-800 text-3xl" />
                          ) : (
                            <IoDocumentText className="text-green-700 text-3xl" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg truncate max-w-[200px] md:max-w-none">{file.name}</p>
                          <div className="flex flex-col md:flex-row md:items-center gap-6 mt-2">
                            <span className="text-gray-600 font-semibold text-base">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                            <span className="px-3 py-1.5 bg-gray-100 rounded-lg font-bold text-gray-700 text-sm">
                              {file.name.split('.').pop().toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                 <div className="flex items-center gap-3">
  <button
    onClick={() => setFile(null)}
    className="p-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
  >
    <FiX className="text-lg" />
  </button>
  <button
    onClick={handleUploadWithStrategy}
    disabled={uploading || validationLoading || !uploadStrategy}
    className="px-5 py-3 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white rounded-xl font-bold flex items-center gap-2.5 text-sm shadow-lg disabled:opacity-70 hover:shadow-xl transition-all duration-300"
  >
                    {uploading ? (
                      <>
        <CircularProgress size={16} className="text-white"   style={{ color: 'white' }}
/>
        <span className="text-white/90">Processing file...</span>
      </>
    ) : validationLoading ? (
      <>
        <CircularProgress size={16} className="text-white"    style={{ color: 'white' }}
/>
        <span className="text-white/90">Checking file...</span>
      </>
    ) : (
      <>
        <FiUpload className="text-sm" />
        <span>Upload Now</span>
      </>
    )}
  </button>
</div>
                    </div>
                  </div>
                )}

                {file && (
                  <div className="mt-4 rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900">
                    Large uploads with 800+ rows now use longer server processing windows and chunked database saves. Keep this page open until you see the final success or review message.
                  </div>
                )}

                {result?.success && (
                  <div className="rounded-3xl border border-emerald-200 bg-white p-5 shadow-xl">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                          <FiCheckCircle className="text-xl" />
                        </div>
                        <div>
                          <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">Last Upload Completed</p>
                          <h3 className="mt-1 text-xl font-black text-slate-950">{result.message || 'Student upload finished successfully'}</h3>
                          <p className="mt-2 text-sm font-medium text-slate-600">
                            Batch {result.batch?.id || result.data?.uploadId || 'saved'} · {result.uploadedBy ? `Uploaded by ${result.uploadedBy}` : 'Records refreshed'}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[420px]">
                        {[
                          ['Processed', result.processingStats?.validRows || result.data?.processed || 0],
                          ['Skipped', result.processingStats?.skippedRows || result.data?.skipped || 0],
                          ['Issues', result.processingStats?.errorRows || result.errors?.length || 0],
                          ['Restored', result.processingStats?.restoredAccounts || 0]
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">{label}</p>
                            <p className="mt-1 text-xl font-black text-slate-950">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-8">
                {/* Templates Section */}
                <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Download Templates</h3>
                  <div className="space-y-4">
                    <button
                      onClick={downloadExcelTemplate}
                      className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                      <IoDocumentText className="text-green-600 text-2xl" />
                      <span className="font-bold text-gray-900 text-base">Excel Template</span>
                    </button>
                    <button
                      onClick={downloadCSVTemplate}
                      className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                      <FiFile className="text-teal-700 text-2xl" />
                      <span className="font-bold text-gray-900 text-base">CSV Template</span>
                    </button>
                  </div>
                </div>

                {/* Guidelines Section */}
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl border-2 border-teal-300 p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-teal-900 mb-6">Upload Guidelines</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-teal-800 font-bold text-base">1</span>
                      </div>
                      <span className="text-teal-800 font-semibold text-base">Select upload strategy first (New or Update)</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-teal-800 font-bold text-base">2</span>
                      </div>
                      <span className="text-teal-800 font-semibold text-base">Admission numbers must be unique (4-10 digits)</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-teal-800 font-bold text-base">3</span>
                      </div>
                      <span className="text-teal-800 font-semibold text-base">For updates, only students in selected form will be processed</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-teal-800 font-bold text-base">4</span>
                      </div>
                      <span className="text-teal-800 font-semibold text-base">System checks for duplicates before uploading and keeps row-level errors easy to review</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-teal-800 font-bold text-base">5</span>
                      </div>
                      <span className="text-teal-800 font-semibold text-base">Large files can take longer, so keep this page open until upload finishes</span>
                    </li>
                  </ul>
                </div>

                {/* Quick Stats */}
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border-2 border-emerald-300 p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-emerald-900 mb-6">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-800 font-bold">Total Forms</span>
                      <span className="text-2xl font-bold text-emerald-700">4</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-800 font-bold">Unique Identifier</span>
                      <span className="font-bold text-emerald-700">Admission #</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-800 font-bold">Max File Size</span>
                      <span className="font-bold text-emerald-700">10 MB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-800 font-bold">Supported Formats</span>
                      <span className="font-bold text-emerald-700">PDF, Excel, CSV</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'students' && (
          <div className="space-y-8">
            {showFilters && (
              <EnhancedFilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                showAdvanced={showFilters}
                onToggleAdvanced={() => setShowFilters(!showFilters)}
              />
            )}

            <div className="bg-white rounded-2xl p-6 border-2 border-gray-300 shadow-2xl">
              <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                <div className="flex-1 w-full lg:w-auto">
                  <div className="relative max-w-full lg:max-w-lg">
                    <FiSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      onKeyDown={handleSearch}
                      placeholder="Search students by name, admission number, phone, or category"
                      className="w-full pl-14 pr-4 py-4 bg-white border-2 border-gray-400 rounded-2xl focus:ring-4 focus:ring-teal-600 focus:border-teal-700 transition-all duration-300 text-base"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto mt-4 lg:mt-0">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex-1 lg:flex-none px-6 py-4 bg-white border-2 border-gray-400 rounded-2xl text-gray-700 font-bold flex items-center justify-center gap-3 text-base hover:border-teal-600 hover:text-teal-700 transition-all duration-300"
                  >
                    <FiFilter />
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </button>

                  <div className="hidden lg:flex items-center gap-3 px-4 py-4 bg-gradient-to-r from-slate-100 to-white border border-slate-200 rounded-2xl text-slate-700">
                    <FiList className="text-teal-700" />
                    <div className="leading-tight">
                      <p className="text-sm font-bold">Modern List View</p>
                      <p className="text-xs text-slate-500">Clean student rows with faster scanning</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSearch({ type: 'click' })}
                    disabled={loading}
                    className="flex-1 lg:flex-none px-6 py-4 bg-gradient-to-r from-teal-700 to-emerald-800 text-white rounded-2xl font-bold flex items-center justify-center gap-3 text-base shadow-xl disabled:opacity-50 hover:shadow-2xl transition-all duration-300"
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={18} className="text-white" />
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <FiSearch />
                        <span>Search</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {loading && students.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                <div className="px-6 py-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-3">
                      <div className="h-6 w-48 rounded-full bg-slate-200 animate-pulse"></div>
                      <div className="h-4 w-72 max-w-full rounded-full bg-slate-100 animate-pulse"></div>
                    </div>
                    <div className="inline-flex items-center gap-3 self-start rounded-2xl bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800">
                      <CircularProgress size={18} className="text-teal-700" />
                      <span>Loading student records...</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6 space-y-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="rounded-3xl border border-slate-100 bg-gradient-to-r from-white to-slate-50 px-4 py-5 shadow-sm"
                    >
                      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,2.5fr)_minmax(0,1.1fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-center">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-slate-200 animate-pulse"></div>
                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="h-4 w-48 rounded-full bg-slate-200 animate-pulse"></div>
                            <div className="h-3 w-32 rounded-full bg-slate-100 animate-pulse"></div>
                          </div>
                        </div>
                        <div className="h-9 w-28 rounded-2xl bg-slate-100 animate-pulse"></div>
                        <div className="h-4 w-36 rounded-full bg-slate-100 animate-pulse"></div>
                        <div className="h-4 w-24 rounded-full bg-slate-100 animate-pulse"></div>
                        <div className="h-4 w-28 rounded-full bg-slate-100 animate-pulse"></div>
                        <div className="flex gap-2 lg:justify-end">
                          <div className="h-10 w-20 rounded-2xl bg-slate-200 animate-pulse"></div>
                          <div className="h-10 w-20 rounded-2xl bg-slate-100 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {students.length > 0 && (
                  <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl transition-all duration-300">
                    <div className="px-6 py-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-emerald-50/40">
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-2xl bg-gradient-to-br from-teal-700 to-emerald-700 shadow-lg">
                            <FiList className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-slate-900">
                              Student Records ({pagination.total})
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                              A cleaner list view for scanning students, class placement, and record status.
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                          <div className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-lg">
                            Page {pagination.page} of {pagination.pages}
                          </div>
                          <button
                            onClick={() => loadStudents(pagination.page)}
                            disabled={loading}
                            className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-teal-700 to-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50"
                          >
                            {loading ? (
                              <CircularProgress size={16} className="text-white" />
                            ) : (
                              <FiRefreshCw className="h-4 w-4 transition-transform duration-500 group-hover:rotate-180" />
                            )}
                            {loading ? 'Refreshing...' : 'Refresh'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {loading && students.length > 0 && (
                      <div className="border-b border-slate-100 bg-teal-50/70 px-6 py-3 text-sm font-medium text-teal-800">
                        Updating the student list. Your records will refresh in place when the search finishes.
                      </div>
                    )}

                    <div className="hidden lg:grid grid-cols-[minmax(0,2.5fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] gap-4 border-b border-slate-100 bg-slate-50 px-6 py-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      <button
                        onClick={() => handleSort('firstName')}
                        className="flex items-center gap-2 text-left transition-colors hover:text-teal-700"
                      >
                        <span>Student</span>
                        {filters.sortBy === 'firstName' ? (
                          filters.sortOrder === 'asc' ? (
                            <FiChevronUp className="h-3 w-3 text-teal-600" />
                          ) : (
                            <FiChevronDown className="h-3 w-3 text-teal-600" />
                          )
                        ) : (
                          <FiChevronDown className="h-3 w-3 opacity-30" />
                        )}
                      </button>
                      <button
                        onClick={() => handleSort('form')}
                        className="flex items-center gap-2 text-left transition-colors hover:text-teal-700"
                      >
                        <span>Class</span>
                        {filters.sortBy === 'form' ? (
                          filters.sortOrder === 'asc' ? (
                            <FiChevronUp className="h-3 w-3 text-teal-600" />
                          ) : (
                            <FiChevronDown className="h-3 w-3 text-teal-600" />
                          )
                        ) : (
                          <FiChevronDown className="h-3 w-3 opacity-30" />
                        )}
                      </button>
                      <div>Contact</div>
                      <button
                        onClick={() => handleSort('status')}
                        className="flex items-center gap-2 text-left transition-colors hover:text-teal-700"
                      >
                        <span>Status</span>
                        {filters.sortBy === 'status' ? (
                          filters.sortOrder === 'asc' ? (
                            <FiChevronUp className="h-3 w-3 text-teal-600" />
                          ) : (
                            <FiChevronDown className="h-3 w-3 text-teal-600" />
                          )
                        ) : (
                          <FiChevronDown className="h-3 w-3 opacity-30" />
                        )}
                      </button>
                      <div>Updated</div>
                      <div className="text-right">Actions</div>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {students.map((student) => {
                        const fullName = [student.firstName, student.middleName, student.lastName]
                          .filter(Boolean)
                          .join(' ');
                        const isActive = (student.status || '').toLowerCase() === 'active';
                        const contactLine = student.whatsappPhone || student.parentPhone || student.studentPhone || student.email || 'No contact details recorded';

                        return (
                          <div
                            key={student.id}
                            className="px-4 py-5 transition-colors duration-300 hover:bg-emerald-50/40 sm:px-6"
                          >
                            <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,2.5fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-center">
                              <div className="min-w-0">
                                <div className="flex items-start gap-4">
                                  <div className="relative shrink-0">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-700 shadow-lg">
                                      <FiUser className="h-5 w-5 text-white" />
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <h4 className="truncate text-base font-bold text-slate-900">
                                        {student.fullName || fullName}
                                      </h4>
                                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                                        #{student.admissionNumber}
                                      </span>
                                    </div>
                                    <p className="mt-1 truncate text-sm text-slate-500">
                                      {contactLine}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 lg:hidden">
                                  Class
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold ${getFormBadgeColor(student.gradeLevel || student.form)}`}>
                                    {student.gradeLevel || student.form || 'Not assigned'}
                                  </span>
                                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                                    {student.className || student.stream || 'No stream'}
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 lg:hidden">
                                  Contact
                                </p>
                                <div className="space-y-1">
                                  <p className="text-sm font-semibold text-slate-800">
                                    {student.whatsappPhone || student.parentPhone || student.studentPhone || 'Not provided'}
                                  </p>
                                  {(student.uploadedCategory || student.email) && (
                                    <p className="truncate text-xs text-slate-500">
                                      {student.uploadedCategory || student.email}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-2">
                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 lg:hidden">
                                  Status
                                </p>
                                <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                                  <span className={`h-2.5 w-2.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                  <span>{student.status || 'Unknown'}</span>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 lg:hidden">
                                  Updated
                                </p>
                                <div className="text-sm font-semibold text-slate-800">
                                  {formatDate(student.updatedAt || student.createdAt)}
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2 lg:justify-end">
                                <button
                                  onClick={() => setSelectedStudent(student)}
                                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-50 to-teal-100 px-4 py-2.5 text-sm font-semibold text-teal-800 shadow-sm transition-all duration-300 hover:from-teal-100 hover:to-teal-200 hover:text-teal-900"
                                >
                                  <FiEye className="h-3.5 w-3.5" />
                                  View
                                </button>
                                <button
                                  onClick={() => setEditingStudent(student)}
                                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-50 to-emerald-100 px-4 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition-all duration-300 hover:from-emerald-100 hover:to-emerald-200 hover:text-emerald-800"
                                >
                                  <FiEdit className="h-3.5 w-3.5" />
                                  Edit
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {students.length === 0 && !loading && (
                  <div className="text-center py-20 bg-white rounded-2xl border-2 border-gray-300 shadow-xl">
                    <FiUsers className="text-6xl text-gray-300 mx-auto mb-6" />
                    <p className="text-gray-600 text-xl font-bold mb-4">No students found</p>
                    {(filters.search || filters.form || filters.stream) && (
                      <button
                        onClick={handleClearFilters}
                        className="text-teal-700 font-bold text-lg hover:text-teal-900 transition-colors"
                      >
                        Clear filters to see all students
                      </button>
                    )}
                  </div>
                )}

                {students.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t-2 border-gray-300">
                    <div className="text-gray-700 font-bold text-base">
                      Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} students
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="p-3 rounded-xl border-2 border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:border-teal-600 hover:text-teal-700 transition-colors"
                      >
                        <FiArrowLeft className="text-base" />
                      </button>
                      {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                        let pageNum;
                        if (pagination.pages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.page >= pagination.pages - 2) {
                          pageNum = pagination.pages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-12 h-12 rounded-xl font-bold text-sm transition-all duration-300 ${
                              pagination.page === pageNum
                                ? 'bg-gradient-to-r from-teal-700 to-emerald-800 text-white shadow-2xl'
                                : 'border-2 border-gray-400 hover:border-teal-600 hover:text-teal-700'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.pages}
                        className="p-3 rounded-xl border-2 border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:border-teal-600 hover:text-teal-700 transition-colors"
                      >
                        <FiArrowRight className="text-base" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {view === 'demographics' && (
          <div className="space-y-8">
            {/* Statistics Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StudentStatisticsCard
                title="Total Students"
                value={stats.totalStudents}
                icon={FiUsers}
                color="from-emerald-600 to-emerald-800"
                trend={8.5}
              />
              <StudentStatisticsCard
                title="Active Students"
                value={demographics.statusDistribution?.find(s => s.name === 'Active')?.value || 0}
                icon={FiAward}
                color="from-emerald-500 to-emerald-700"
                trend={12.3}
              />
              <StudentStatisticsCard
                title="Classes Tracked"
                value={(demographics.formDistribution || []).filter(item => item.value > 0).length}
                icon={IoSchool}
                color="from-teal-600 to-teal-800"
                trend={5.2}
              />
              <StudentStatisticsCard
                title="Streams Tracked"
                value={Object.keys(stats.streamStats || {}).length}
                icon={FiLayers}
                color="from-amber-500 to-amber-700"
                trend={7.8}
              />
            </div>
            
            {/* Statistics Summary Card */}
            <StatisticsSummaryCard 
              stats={stats}
              demographics={demographics}
              onRefresh={refreshStatistics}
            />
            
            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <StudentsChart
                data={demographics.formDistribution}
                type="pie"
                title="Class Distribution"
                colors={['#0284C7', '#4F46E5', '#7C3AED', '#0D9488', '#10B981', '#F59E0B', '#047857']}
                height={400}
              />
              <StudentsChart
                data={demographics.statusDistribution}
                type="bar"
                title="Status Distribution"
                colors={['#10B981', '#EF4444', '#047857', '#F59E0B']}
                height={400}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <StudentsChart
                data={demographics.streamDistribution}
                type="bar"
                title="Stream Distribution"
                height={400}
              />
              <StudentsChart
                data={demographics.ageGroups}
                type="pie"
                title="Contact Coverage"
                colors={['#0D9488', '#10B981', '#F59E0B', '#047857']}
                height={400}
              />
            </div>
            
            {/* Detailed Statistics Table */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-300 shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Detailed Statistics Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Count</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Percentage</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {demographics.formDistribution.map((form, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: form.color }} />
                            <span className="font-bold text-gray-900">{form.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-900">{form.value.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-700">
                            {stats.totalStudents > 0 ? `${((form.value / stats.totalStudents) * 100).toFixed(1)}%` : '0%'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {index % 2 === 0 ? (
                              <FiTrendingUp className="text-green-500" />
                            ) : (
                              <FiTrendingDown className="text-red-500" />
                            )}
                            <span className={`font-bold ${index % 2 === 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {index % 2 === 0 ? '+2.5%' : '-1.2%'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {view === 'history' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Upload History</h3>
                <p className="text-gray-600 mt-2 text-base">Track all your bulk upload activities</p>
              </div>
              <button
                onClick={() => loadUploadHistory(1)}
                disabled={historyLoading}
                className="px-6 py-4 bg-gradient-to-r from-teal-700 to-emerald-800 text-white rounded-2xl font-bold flex items-center justify-center gap-3 text-base shadow-xl disabled:opacity-50 hover:shadow-2xl transition-all duration-300"
              >
                {historyLoading ? (
                  <>
                    <CircularProgress size={18} className="text-white" />
                    <span>Refreshing...</span>
                  </>
                ) : (
                  <>
                    <FiRefreshCw />
                    <span>Refresh History</span>
                  </>
                )}
              </button>
            </div>

            {uploadHistory.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border-2 border-gray-300 shadow-xl">
                <FiClock className="text-6xl text-gray-300 mx-auto mb-6" />
                <p className="text-gray-600 text-xl font-bold mb-4">No upload history found</p>
                <p className="text-gray-500 text-base">Upload your first file to see history here</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border-2 border-gray-300 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[768px]">
                    <thead className="bg-gradient-to-r from-gray-100 to-white">
                      <tr>
                        <th className="px-8 py-6 text-left text-base font-bold text-gray-700 uppercase tracking-wider">
                          Upload Details
                        </th>
                        <th className="px-8 py-6 text-left text-base font-bold text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-8 py-6 text-left text-base font-bold text-gray-700 uppercase tracking-wider">
                          Statistics
                        </th>
                        <th className="px-8 py-6 text-left text-base font-bold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-gray-200">
                      {uploadHistory.map(upload => (
                        <tr key={upload.id} className="bg-white hover:bg-gray-50 transition-colors">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="p-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-2xl">
                                <FiFile className="text-teal-800 text-xl" />
                              </div>
                              <div>
                                <div className="font-bold text-gray-900 text-base truncate max-w-[250px] lg:max-w-md">
                                  {upload.fileName}
                                </div>
                                <div className="text-gray-600 mt-2 font-semibold text-sm">
                                  {new Date(upload.uploadDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                                {upload.metadata && (
                                  <div className="mt-2">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                      upload.metadata.uploadType === 'new' 
                                        ? 'bg-teal-100 text-teal-800' 
                                        : 'bg-emerald-100 text-emerald-800'
                                    }`}>
                                      {upload.metadata.uploadType === 'new' ? 'New Upload' : 'Update Upload'}
                                    </span>
                                    {upload.metadata.selectedForms && (
                                      <span className="ml-2 px-2 py-1 rounded text-xs font-bold bg-gray-100 text-gray-700">
                                        {upload.metadata.selectedForms.length} classes
                                      </span>
                                    )}
                                    {upload.metadata.targetForm && (
                                      <span className="ml-2 px-2 py-1 rounded text-xs font-bold bg-gray-100 text-gray-700">
                                        {upload.metadata.targetForm}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-5 py-2.5 rounded-xl text-sm font-bold ${
                              upload.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : upload.status === 'processing'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {upload.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="space-y-2">
                              <div className="flex flex-col md:flex-row md:items-center gap-6">
                                <span className="text-emerald-700 font-bold text-sm">{upload.validRows || 0} valid</span>
                                <span className="text-amber-700 font-bold text-sm">{upload.skippedRows || 0} skipped</span>
                                <span className="text-red-700 font-bold text-sm">{upload.errorRows || 0} errors</span>
                              </div>
                              <div className="text-gray-600 font-semibold text-sm">
                                Total: {upload.totalRows || 0} rows processed
                              </div>
                              {upload.metadata && (upload.metadata.updatedRows || upload.metadata.createdRows || upload.metadata.deactivatedRows) && (
                                <div className="text-gray-500 text-xs">
                                  {upload.metadata.updatedRows > 0 && `Updated: ${upload.metadata.updatedRows} `}
                                  {upload.metadata.createdRows > 0 && `Created: ${upload.metadata.createdRows} `}
                                  {upload.metadata.deactivatedRows > 0 && `Deactivated: ${upload.metadata.deactivatedRows}`}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <button
                              onClick={() => handleDeleteBatch(upload.id, upload.fileName)}
                              className="px-5 py-2.5 bg-red-50 text-red-700 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onEdit={() => {
            setEditingStudent(selectedStudent);
            setSelectedStudent(null);
          }}
          onDelete={(id, name) => handleDeleteStudent(id, name)}
        />
      )}

      {editingStudent && (
        <StudentEditModal
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onSave={updateStudent}
          loading={loading}
        />
      )}

      {showDeleteModal && (
        <ModernDeleteModal
          onClose={() => {
            setShowDeleteModal(false);
            setDeleteTarget({ type: '', id: '', name: '' });
          }}
          onConfirm={confirmDelete}
          loading={loading}
          type={deleteTarget.type}
          itemName={deleteTarget.name}
        />
      )}

      <UploadStrategyModal
        open={showStrategyModal}
        onClose={() => setShowStrategyModal(false)}
        onConfirm={handleStrategyConfirm}
        loading={loading}
      />

      <DuplicateValidationModal
        open={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        duplicates={duplicates}
        onProceed={proceedWithUpload}
        loading={uploading}
        uploadType={uploadStrategy?.uploadType}
        targetForm={uploadStrategy?.targetForm}
        totalRows={duplicateSummary.totalRows}
      />
    </div>
  );
}
