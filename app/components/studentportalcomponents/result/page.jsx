'use client';

import { 
  useState, useMemo, useEffect, useCallback 
} from 'react';
import {
  FiAward, FiBook, FiTrendingUp, FiTrendingDown,
  FiDownload, FiRefreshCw, FiAlertTriangle, FiFilter,
  FiFile, FiImage, FiFileText, FiExternalLink,
  FiGrid, FiList, FiChevronRight, FiChevronUp,
  FiChevronDown, FiSearch, FiEye, FiEdit,
  FiTrash2, FiPlus, FiX, FiCheckCircle,
  FiInfo, FiCalendar, FiUser, FiClock,
  FiBarChart2, FiPercent, FiActivity,
  FiChevronLeft, FiChevronRight as FiChevronRightIcon, FiDownloadCloud, FiArrowRight  
} from 'react-icons/fi';

import {
  IoSchool, IoDocumentText, IoStatsChart,
  IoAnalytics, IoSparkles, IoClose,
  IoFilter as IoFilterIcon, IoLeaf, IoFlower, IoShield, IoGlobe
} from 'react-icons/io5';
import {
  CircularProgress,
  Modal,
  Box
} from '@mui/material';

// ==================== MATUNGULU GIRLS HERO HEADER ====================
function MatunguluHeroHeader({ student, onRefresh, isRefreshing }) {
  const currentYear = new Date().getFullYear();
  const foundingYear = 1955;
  const yearsOfExcellence = currentYear - foundingYear;

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl">
      {/* Main Header Container */}
   <div className="relative bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-900 rounded-2xl sm:rounded-3xl shadow-2xl">
  
  {/* Decorative Background Elements */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl"></div>
    
    {/* Leaf/Flower decorative patterns */}
    <div className="absolute top-6 right-6 opacity-10">
      <IoLeaf className="text-5xl text-emerald-300" />
    </div>
    <div className="absolute bottom-6 left-6 opacity-10">
      <IoFlower className="text-5xl text-teal-300" />
    </div>
  </div>

  {/* Content Container - REDUCED PADDING */}
  <div className="relative z-10 px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
    
    {/* Top Row - School Name and Badge - REDUCED MARGIN */}
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4 sm:mb-5">
      <div className="space-y-1.5 sm:space-y-2">
        {/* School Badge - SMALLER */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
          <IoShield className="text-emerald-300 text-xs sm:text-sm" />
          <span className="text-[9px] sm:text-[11px] font-bold text-emerald-100 uppercase tracking-wider">
            National C1 Girls' Boarding School
          </span>
        </div>
        
        {/* School Name - SMALLER TEXT */}
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight">
            Matungulu Girls
            <span className="block sm:inline-block sm:ml-2 text-emerald-300">
              Senior School
            </span>
          </h1>
        </div>
        
        {/* Motto - SMALLER */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-px bg-emerald-400/50"></div>
          <p className="text-emerald-200 text-[10px] sm:text-xs italic font-medium">
            "Committed to Excellence"
          </p>
          <div className="w-6 h-px bg-emerald-400/50"></div>
        </div>
      </div>

      {/* Student Info Card - COMPACT */}
      {student && (
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 sm:p-3 border border-white/20 shadow-lg">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <span className="text-white font-black text-xs sm:text-sm">
                {student?.fullName?.charAt(0) || 'S'}
              </span>
            </div>
            <div>
              <p className="text-white text-[10px] sm:text-xs font-medium opacity-80">Welcome back,</p>
              <p className="text-white font-bold text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[180px]">
                {student?.fullName || 'Student'}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-emerald-200 text-[8px] sm:text-[10px] font-semibold">
                  {student?.form || 'Form'} • {student?.stream || 'Stream'}
                </span>
                <span className="w-0.5 h-0.5 rounded-full bg-emerald-300"></span>
                <span className="text-emerald-200 text-[8px] sm:text-[10px]">
                  ADM: {student?.admissionNumber || '----'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Middle Row - Stats Grid - COMPACT */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-5">
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/10">
        <p className="text-emerald-300 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">Founded</p>
        <p className="text-white text-base sm:text-lg md:text-xl font-black">{foundingYear}</p>
        <p className="text-white/60 text-[8px] sm:text-[9px] mt-0.5">{yearsOfExcellence}+ Years</p>
      </div>
      
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/10">
        <p className="text-emerald-300 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">Students</p>
        <p className="text-white text-base sm:text-lg md:text-xl font-black">1,500+</p>
        <p className="text-white/60 text-[8px] sm:text-[9px] mt-0.5">Current Enrollment</p>
      </div>
      
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/10">
        <p className="text-emerald-300 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">Subjects</p>
        <p className="text-white text-base sm:text-lg md:text-xl font-black">12+</p>
        <p className="text-white/60 text-[8px] sm:text-[9px] mt-0.5">Core & Electives</p>
      </div>
      
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/10">
        <p className="text-emerald-300 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">Location</p>
        <p className="text-white text-xs sm:text-sm md:text-base font-black">Machakos</p>
        <p className="text-white/60 text-[8px] sm:text-[9px] mt-0.5">Matungulu</p>
      </div>
    </div>

    {/* Bottom Row - Quick Actions - COMPACT */}
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white font-semibold text-xs sm:text-sm transition-all duration-200 disabled:opacity-50"
      >
        <FiRefreshCw className={`text-emerald-300 text-xs sm:text-sm ${isRefreshing ? 'animate-spin' : ''}`} />
        <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
      </button>
      
      <a
        href="https://maps.app.goo.gl/WqjeNfi78asowHx7A"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white font-semibold text-xs sm:text-sm transition-all duration-200"
      >
        <IoGlobe className="text-emerald-300 text-xs sm:text-sm" />
        <span>Map</span>
        <FiExternalLink className="text-emerald-300 text-[10px] sm:text-xs" />
      </a>
    </div>
  </div>
</div>
    </div>
  );
}

// ==================== LOADING SPINNER ====================
function ResultsLoadingSpinner({ message = "Loading academic results...", size = "medium" }) {
  const sizes = {
    small: { outer: 48, inner: 24 },
    medium: { outer: 64, inner: 32 },
    large: { outer: 80, inner: 40 }
  };

  const { outer, inner } = sizes[size];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/20 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="relative">
            <CircularProgress 
              size={outer} 
              thickness={5}
              className="text-emerald-600"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full" style={{ width: inner, height: inner }}></div>
            </div>
          </div>
          <div className="absolute -inset-6 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full blur-xl opacity-30"></div>
        </div>
        
        <div className="mt-8 space-y-3">
          <span className="block text-lg font-semibold text-gray-800">
            {message}
          </span>
          <div className="flex justify-center space-x-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Grade Calculation Helper
const calculateGrade = (score) => {
  const numericScore = parseFloat(score) || 0;
  if (numericScore >= 80) return 'A';
  if (numericScore >= 70) return 'A-';
  if (numericScore >= 60) return 'B+';
  if (numericScore >= 55) return 'B';
  if (numericScore >= 50) return 'B-';
  if (numericScore >= 45) return 'C+';
  if (numericScore >= 40) return 'C';
  if (numericScore >= 35) return 'C-';
  if (numericScore >= 30) return 'D+';
  if (numericScore >= 25) return 'D';
  return 'E';
};

// Grade Status Helper
const getGradeStatus = (grade) => {
  const g = grade?.toUpperCase();
  if (['A'].includes(g)) return { 
    color: 'text-emerald-600',
    bgColor: 'from-emerald-500 to-emerald-700',
    lightBg: 'bg-emerald-50',
    remark: 'Excellent! Outstanding performance.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    iconColor: 'text-emerald-500'
  };
  if (['A-'].includes(g)) return { 
    color: 'text-teal-600',
    bgColor: 'from-teal-500 to-teal-700',
    lightBg: 'bg-teal-50',
    remark: 'Very Good. Excellent understanding.',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    iconColor: 'text-teal-500'
  };
  if (['B+'].includes(g)) return { 
    color: 'text-blue-600',
    bgColor: 'from-blue-500 to-blue-700',
    lightBg: 'bg-blue-50',
    remark: 'Good work. Solid grasp of concepts.',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    iconColor: 'text-blue-500'
  };
  if (['B'].includes(g)) return { 
    color: 'text-cyan-600',
    bgColor: 'from-cyan-500 to-cyan-700',
    lightBg: 'bg-cyan-50',
    remark: 'Satisfactory. Good effort shown.',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    iconColor: 'text-cyan-500'
  };
  if (['B-'].includes(g)) return { 
    color: 'text-amber-600',
    bgColor: 'from-amber-500 to-amber-700',
    lightBg: 'bg-amber-50',
    remark: 'Fair. Basic understanding achieved.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    iconColor: 'text-amber-500'
  };
  if (['C+'].includes(g)) return { 
    color: 'text-orange-600',
    bgColor: 'from-orange-500 to-orange-700',
    lightBg: 'bg-orange-50',
    remark: 'Below average. Needs more practice.',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
    iconColor: 'text-orange-500'
  };
  return { 
    color: 'text-rose-600',
    bgColor: 'from-rose-500 to-rose-700',
    lightBg: 'bg-rose-50',
    remark: 'Weak. Requires additional support.',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    iconColor: 'text-rose-500'
  };
};

// Subject Details Modal Component
function SubjectDetailsModal({ result, onClose }) {
  if (!result) return null;

  const subjects = result.subjects || [];
  
  const overallStatus = getGradeStatus(result.overallGrade);
  const totalScore = result.totalScore || subjects.reduce((sum, s) => sum + (parseFloat(s.score) || 0), 0);
  const averageScore = result.averageScore || (subjects.length > 0 ? totalScore / subjects.length : 0);
  const subjectCount = subjects.length;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border-2 border-gray-300 shadow-2xl">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-3 sm:p-4 md:p-6 text-white">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
              <div className="p-2 md:p-3 bg-white/20 rounded-2xl flex-shrink-0 mt-1">
                <FiBook className="text-lg sm:text-xl md:text-2xl" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg md:text-2xl font-bold truncate">Subject Performance Details</h2>
                <p className="text-emerald-100 opacity-90 text-xs sm:text-sm mt-1 truncate">
                  Adm: {result.admissionNumber} • {result.term} {result.academicYear} • {result.form}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-white/20 rounded-2xl hover:bg-white/30 transition-colors flex-shrink-0 ml-2"
            >
              <IoClose className="text-lg sm:text-xl" />
            </button>
          </div>
        </div>

        <div className="max-h-[calc(90vh-70px)] overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-3 sm:p-4 md:p-6 border-2 border-emerald-200">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
              <div className="text-center p-2 sm:p-3 bg-white rounded-lg border border-emerald-200">
                <div className="text-xs font-semibold text-emerald-700 truncate">Avg Score</div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-1 truncate">{averageScore.toFixed(2)}%</div>
              </div>
              <div className="text-center p-2 sm:p-3 bg-white rounded-lg border border-emerald-200">
                <div className="text-xs font-semibold text-emerald-700 truncate">Total Score</div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-1 truncate">{totalScore}</div>
              </div>
              <div className="text-center p-2 sm:p-3 bg-white rounded-lg border border-emerald-200">
                <div className="text-xs font-semibold text-emerald-700 truncate">Grade</div>
                <div className={`text-lg sm:text-xl md:text-2xl font-bold mt-1 truncate ${overallStatus.color}`}>
                  {result.overallGrade || 'N/A'}
                </div>
              </div>
              <div className="text-center p-2 sm:p-3 bg-white rounded-lg border border-emerald-200">
                <div className="text-xs font-semibold text-emerald-700 truncate">Subjects</div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-1 truncate">{subjectCount}</div>
              </div>
              <div className="col-span-2 sm:col-span-3 md:col-span-1 text-center p-2 sm:p-3 bg-white rounded-lg border border-emerald-200">
                <div className="text-xs font-semibold text-emerald-700 truncate">Form</div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-1 truncate">{result.form}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-white px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">Subject Performance</h3>
              <p className="text-gray-600 text-xs sm:text-sm truncate">Scores, grades, and comments per subject</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase truncate">Subject</th>
                    <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase truncate">Score</th>
                    <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase truncate">Grade</th>
                    <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase truncate">Points</th>
                    <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase truncate hidden sm:table-cell">Teacher's Comment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {subjects.map((subject, index) => {
                    const score = parseFloat(subject.score) || 0;
                    const grade = subject.grade || calculateGrade(score);
                    const points = subject.points || 0;
                    const status = getGradeStatus(grade);

                    return (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-2 sm:px-3 md:px-4 py-2">
                          <div className="font-medium text-gray-900 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">{subject.subject}</div>
                        </td>
                        <td className="px-2 sm:px-3 md:px-4 py-2">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <div className="w-12 sm:w-16 md:w-20 bg-gray-200 rounded-full h-1.5 sm:h-2">
                              <div 
                                className={`h-full rounded-full ${status.color.replace('text-', 'bg-')}`}
                                style={{ width: `${Math.min(score, 100)}%` }}
                              />
                            </div>
                            <span className={`font-bold text-xs sm:text-sm min-w-8 sm:min-w-10 ${status.color}`}>{score}%</span>
                          </div>
                        </td>
                        <td className="px-2 sm:px-3 md:px-4 py-2">
                          <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-bold ${status.badgeColor}`}>
                            {grade}
                          </span>
                        </td>
                        <td className="px-2 sm:px-3 md:px-4 py-2">
                          <span className="font-bold text-gray-900 text-xs sm:text-sm">{points}</span>
                        </td>
                        <td className="px-2 sm:px-3 md:px-4 py-2 hidden sm:table-cell">
                          <span className="text-xs text-gray-600 italic truncate max-w-[150px] md:max-w-none block">{subject.comment || 'No comment'}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3 sm:p-4 md:p-6 border-2 border-gray-300">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">Performance Analysis</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-700 text-sm sm:text-base mb-1 sm:mb-2">Highest Subject</h4>
                {subjects.length > 0 ? (
                  (() => {
                    const highest = subjects.reduce((max, s) => 
                      parseFloat(s.score) > parseFloat(max.score) ? s : max, subjects[0]);
                    const status = getGradeStatus(highest.grade);
                    return (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-xs sm:text-sm truncate">{highest.subject}</span>
                          <span className={`font-bold text-xs sm:text-sm ${status.color}`}>{highest.score}%</span>
                        </div>
                        <div className="text-xs text-gray-600 truncate">{highest.comment}</div>
                      </div>
                    );
                  })()
                ) : (
                  <span className="text-gray-500 text-xs sm:text-sm">No data</span>
                )}
              </div>
              
              <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-700 text-sm sm:text-base mb-1 sm:mb-2">Lowest Subject</h4>
                {subjects.length > 0 ? (
                  (() => {
                    const lowest = subjects.reduce((min, s) => 
                      parseFloat(s.score) < parseFloat(min.score) ? s : min, subjects[0]);
                    const status = getGradeStatus(lowest.grade);
                    return (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-xs sm:text-sm truncate">{lowest.subject}</span>
                          <span className={`font-bold text-xs sm:text-sm ${status.color}`}>{lowest.score}%</span>
                        </div>
                        <div className="text-xs text-gray-600 truncate">{lowest.comment}</div>
                      </div>
                    );
                  })()
                ) : (
                  <span className="text-gray-500 text-xs sm:text-sm">No data</span>
                )}
              </div>
              
              <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 sm:col-span-2 md:col-span-1">
                <h4 className="font-semibold text-gray-700 text-sm sm:text-base mb-1 sm:mb-2">Overall</h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-xs sm:text-sm">Grade:</span>
                    <span className={`font-bold text-xs sm:text-sm ${overallStatus.color}`}>{result.overallGrade}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-xs sm:text-sm">Average:</span>
                    <span className="font-bold text-gray-900 text-xs sm:text-sm">{averageScore.toFixed(2)}%</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1 sm:mt-2 truncate">{overallStatus.remark}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function for PDF display
const getDisplayablePdfUrl = (url) => {
  if (!url) return url;
  
  if (url.includes('cloudinary.com') && url.includes('/raw/upload/')) {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    if (pathname.toLowerCase().endsWith('.pdf')) {
      if (url.includes('?')) {
        return `${url}&fl_attachment`;
      } else {
        return `${url}?fl_attachment`;
      }
    }
  }
  
  return url;
};

// Document Card Component
function DocumentCard({ document, type = 'additional' }) {
  const getIcon = () => {
    const iconBase = "text-lg sm:text-xl md:text-2xl";
    
    const fileName = document.name || document.filename || '';
    const fileExtension = fileName.split('.').pop().toLowerCase();
    
    if (fileExtension === 'pdf' || type === 'exam') {
      return <FiFileText className={`${iconBase} text-rose-500`} />;
    } else if (fileExtension === 'docx' || fileExtension === 'doc') {
      return <FiFileText className={`${iconBase} text-blue-500`} />;
    } else if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png' || fileExtension === 'gif') {
      return <FiImage className={`${iconBase} text-emerald-500`} />;
    }
    return <FiFile className={`${iconBase} text-amber-500`} />;
  };

  const formatSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  const getFileType = () => {
    const fileName = document.name || document.filename || '';
    const fileExtension = fileName.split('.').pop().toLowerCase();
    
    if (fileExtension === 'pdf') return 'PDF Document';
    if (fileExtension === 'docx' || fileExtension === 'doc') return 'Word Document';
    if (fileExtension === 'jpg' || fileExtension === 'jpeg') return 'JPEG Image';
    if (fileExtension === 'png') return 'PNG Image';
    if (fileExtension === 'xlsx' || fileExtension === 'xls') return 'Excel Spreadsheet';
    return 'Document';
  };

  const displayUrl = getDisplayablePdfUrl(document.pdf || document.filepath);
  const fileName = document.name || document.filename || '';
  const fileExtension = fileName.split('.').pop().toLowerCase();
  const isPdf = fileExtension === 'pdf';

  return (
    <div className="group relative bg-white rounded-2xl p-3 sm:p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      
      <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h5 className="font-bold text-gray-800 text-sm sm:text-base leading-tight truncate pr-1">
              {fileName}
            </h5>
            {document.year && (
              <span className="flex-shrink-0 text-[10px] xs:text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full ml-1">
                {document.year}
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1 sm:mt-2">
            <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full bg-slate-100 text-slate-600 text-[9px] xs:text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate">
              {type === 'exam' ? `Form ${document.form}` : document.term || 'General'}
            </span>
            
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[9px] xs:text-[10px] sm:text-xs font-medium">
              {getFileType()}
            </span>
            
            {document.uploadDate && (
              <span className="inline-flex items-center text-gray-400 text-[9px] xs:text-[10px] sm:text-xs font-medium">
                <FiCalendar className="mr-0.5 text-xs" />
                {formatDate(document.uploadDate)}
              </span>
            )}
            <span className="inline-flex items-center text-gray-400 text-[9px] xs:text-[10px] sm:text-xs font-medium truncate">
              <FiDownloadCloud className="mr-0.5 sm:mr-1 text-xs" />
              {formatSize(document.size || document.filesize)}
            </span>
          </div>
        </div>
      </div>

      {document.description && (
        <div className="mt-2 sm:mt-3">
          <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
            {document.description}
          </p>
        </div>
      )}

      <div className="mt-3 sm:mt-4">
        {isPdf ? (
          <button
            onClick={() => {
              const pdfWindow = window.open();
              if (pdfWindow) {
                pdfWindow.location.href = displayUrl;
              }
            }}
            className="flex items-center justify-center gap-1 sm:gap-2 w-full py-2 px-3 sm:py-2.5 sm:px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 shadow-md hover:shadow-rose-500/25 active:scale-[0.98]"
          >
            <FiEye className="text-xs sm:text-sm" />
            <span>View PDF</span>
          </button>
        ) : (
          <a
            href={displayUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={!isPdf}
            className="flex items-center justify-center gap-1 sm:gap-2 w-full py-2 px-3 sm:py-2.5 sm:px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 shadow-md hover:shadow-emerald-500/25 active:scale-[0.98]"
          >
            <FiDownload className="text-xs sm:text-sm" />
            <span>Download File</span>
          </a>
        )}
      </div>
    </div>
  );
}

// Zeraki click handler
const handleZerakiClick = (e) => {
  e.preventDefault();
  window.location.href = "zeraki://";
  const fallback = setTimeout(() => {
    window.location.href = "https://zeraki.app/login"; 
  }, 1500);
  window.onblur = () => clearTimeout(fallback);
};

// ==================== MAIN COMPONENT ====================
export default function ModernResultsView({ 
  student, 
  studentResults, 
  resultsLoading, 
  resultsError, 
  onRefreshResults 
}) {
  // State for school documents only
  const [documentData, setDocumentData] = useState(null);
  const [documentLoading, setDocumentLoading] = useState(true);
  const [documentError, setDocumentError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // States for results
  const [selectedTerm, setSelectedTerm] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [selectedResult, setSelectedResult] = useState(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Fetch school document data
  const fetchDocumentData = useCallback(async () => {
    try {
      setDocumentLoading(true);
      setDocumentError(null);
      
      console.log('📥 Fetching school documents independently...');
      const response = await fetch('/api/schooldocuments');
      
      if (!response.ok) {
        console.warn('⚠️ School documents API not available, using empty structure');
        setDocumentData({
          form1ResultsPdf: null,
          form2ResultsPdf: null,
          form3ResultsPdf: null,
          form4ResultsPdf: null,
          kcseResultsPdf: null,
          mockExamsResultsPdf: null,
          additionalDocuments: []
        });
        return;
      }
      
      const data = await response.json();
      
      if (data && data.document) {
        setDocumentData(data.document);
        console.log('✅ School documents loaded successfully');
      } else {
        setDocumentData({
          form1ResultsPdf: null,
          form2ResultsPdf: null,
          form3ResultsPdf: null,
          form4ResultsPdf: null,
          kcseResultsPdf: null,
          mockExamsResultsPdf: null,
          additionalDocuments: []
        });
      }
    } catch (error) {
      console.error('❌ Error in school documents fetch:', error);
      setDocumentData({
        form1ResultsPdf: null,
        form2ResultsPdf: null,
        form3ResultsPdf: null,
        form4ResultsPdf: null,
        kcseResultsPdf: null,
        mockExamsResultsPdf: null,
        additionalDocuments: []
      });
    } finally {
      setDocumentLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocumentData();
  }, [fetchDocumentData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefreshResults();
    await fetchDocumentData();
    setIsRefreshing(false);
  };

  // Process exam results from documentData
  const prioritizedExamResults = useMemo(() => {
    if (!documentData) return [];
    
    const results = [];
    const studentForm = student?.form?.replace('Form ', '') || '4';
    
    const examFields = [
      { key: 'form1ResultsPdf', form: '1', name: 'Form 1 Results' },
      { key: 'form2ResultsPdf', form: '2', name: 'Form 2 Results' },
      { key: 'form3ResultsPdf', form: '3', name: 'Form 3 Results' },
      { key: 'form4ResultsPdf', form: '4', name: 'Form 4 Results' },
      { key: 'mockExamsResultsPdf', form: '4', name: 'Mock Exams Results' },
      { key: 'kcseResultsPdf', form: '4', name: 'KCSE Results' }
    ];
    
    examFields.forEach(({ key, form, name }) => {
      const pdfUrl = documentData[key];
      if (pdfUrl && typeof pdfUrl === 'string' && pdfUrl.trim() !== '') {
        const formKey = key.replace('Pdf', '');
        results.push({
          name: documentData[`${formKey}Name`] || name,
          pdf: pdfUrl,
          form: form,
          type: 'exam',
          priority: form === studentForm ? 0 : parseInt(form) || 99,
          description: documentData[`${formKey}Description`] || '',
          year: documentData[`${formKey}Year`] || '',
          term: documentData[`${formKey}Term`] || '',
          size: documentData[`${formKey}Size`] || documentData[`${formKey}PdfSize`] || 0,
          uploadDate: documentData[`${formKey}UploadDate`] || ''
        });
      }
    });
    
    return results.sort((a, b) => a.priority - b.priority);
  }, [documentData, student]);

  // Process additional documents
  const additionalResultsFiles = useMemo(() => {
    if (!documentData || !documentData.additionalDocuments) return [];
    
    const additionalDocs = Array.isArray(documentData.additionalDocuments) 
      ? documentData.additionalDocuments 
      : [];
    
    const resultsOnly = additionalDocs.filter(doc => {
      if (!doc) return false;
      
      const filename = (doc.filename || '').toLowerCase();
      const description = (doc.description || '').toLowerCase();
      
      return (
        filename.includes('result') ||
        filename.includes('exam') ||
        filename.includes('test') ||
        filename.includes('mark') ||
        description.includes('result') ||
        description.includes('exam') ||
        description.includes('test') ||
        description.includes('mark') ||
        description.includes('score') ||
        description.includes('grade')
      );
    });
    
    return resultsOnly
      .sort((a, b) => {
        if (a.year && b.year && a.year !== b.year) {
          return parseInt(b.year) - parseInt(a.year);
        }
        const dateA = a.uploadedAt ? new Date(a.uploadedAt) : 0;
        const dateB = b.uploadedAt ? new Date(b.uploadedAt) : 0;
        return dateB - dateA;
      })
      .map(doc => ({
        filename: doc.filename || '',
        filepath: doc.filepath || '',
        filetype: doc.filetype || '',
        description: doc.description || '',
        year: doc.year || '',
        term: doc.term || '',
        filesize: doc.filesize || 0,
        uploadedAt: doc.uploadedAt || ''
      }));
  }, [documentData]);

  if (resultsLoading) {
    return <ResultsLoadingSpinner />;
  }

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6 p-2 sm:p-3 md:p-6">
      
      {/* MATUNGULU GIRLS HERO HEADER */}
      <MatunguluHeroHeader 
        student={student}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* ZERAKI SECTION */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl border-2 border-emerald-200 p-4 sm:p-6 md:p-8 shadow-lg">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <div className="flex-shrink-0 bg-gradient-to-br from-emerald-600 to-teal-700 p-4 rounded-2xl shadow-xl">
            <IoSchool className="text-white text-4xl md:text-5xl" />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 mb-2">
              Zeraki Learning Platform
            </h2>
            <p className="text-gray-700 text-sm md:text-base mb-3 max-w-2xl">
              Track your academic performance, access past papers, and get personalised learning recommendations. 
              Zeraki helps you stay ahead with real-time progress reports and interactive study tools.
            </p>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 mb-4 inline-block">
              <p className="text-xs sm:text-sm font-medium text-gray-800">
                <span className="font-bold text-emerald-700">How to log in:</span> Use your school credentials 
                (admission number and default password). First-time users, click "Forgot Password" to set up your account.
              </p>
            </div>

            <a
              href="https://zeraki.app"
              onClick={handleZerakiClick}
              className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 bg-white text-gray-700 font-medium text-sm sm:text-base rounded-full border border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-300 hover:scale-101 active:scale-98 transition-all duration-300 cursor-pointer"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                <img 
                  src="/zeraki.jpg" 
                  alt="Zeraki Login" 
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <span>Open Zeraki</span>
              <FiExternalLink className="text-gray-400 text-sm sm:text-base" />
            </a>
          </div>
        </div>
      </div>

      {/* SCHOOL DOCUMENTS SECTION */}
      <div className="mt-6 pt-6 border-t-2 border-gray-300">
        <div className="mb-2 sm:mb-3 md:mb-4">
          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <IoDocumentText className="text-emerald-600 text-lg sm:text-xl" />
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
              School Exam Results Documents
            </h3>
          </div>
          <p className="text-gray-600 text-xs sm:text-sm">
            Access class exam results, mock exams, and KCSE results from school administration.
            {documentLoading && ' (Loading documents...)'}
          </p>
        </div>

        {documentLoading ? (
          <div className="text-center py-6 sm:py-8">
            <CircularProgress size={20} className="text-emerald-600" />
            <p className="text-gray-600 text-xs sm:text-sm mt-2">Loading exam documents...</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* Exam Results */}
            {prioritizedExamResults.length > 0 && (
              <div>
                <h4 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-1.5 sm:mb-2 md:mb-3">
                  Class Exam Results
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5 md:gap-3">
                  {prioritizedExamResults.map((result, index) => (
                    <DocumentCard key={index} document={result} type="exam" />
                  ))}
                </div>
              </div>
            )}

            {/* Additional Results Files */}
            {additionalResultsFiles.length > 0 && (
              <div>
                <h4 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-1.5 sm:mb-2 md:mb-3">
                  Additional Exam Reports
                </h4>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-2 sm:mb-3">
                  Supplementary results, test scores, and performance reports.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5 md:gap-3">
                  {additionalResultsFiles.map((file, index) => (
                    <DocumentCard key={index} document={file} type="exam" />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State for Documents */}
            {!documentLoading && prioritizedExamResults.length === 0 && additionalResultsFiles.length === 0 && (
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-gray-300 p-4 sm:p-6 text-center">
                <FiAward className="text-gray-300 text-2xl sm:text-3xl mx-auto mb-2 sm:mb-3" />
                <h4 className="text-sm sm:text-base font-bold text-gray-800 mb-1 sm:mb-2">No exam results documents</h4>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Class exam results and reports will appear here when uploaded by school administration.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Subject Details Modal */}
      {selectedResult && (
        <SubjectDetailsModal
          result={selectedResult}
          onClose={() => setSelectedResult(null)}
        />
      )}

      <style jsx global>{`
        @media (max-width: 768px) {
          .-webkit-scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          
          .-webkit-scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        }
        
        @media (min-width: 768px) {
          .md\\:scrollbar-default::-webkit-scrollbar {
            display: block;
          }
          
          .md\\:scrollbar-default {
            -ms-overflow-style: auto;
            scrollbar-width: auto;
          }
        }
      `}</style>
    </div>
  );
}