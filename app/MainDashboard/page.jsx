'use client';
import { useState, useEffect } from 'react';
import { FaFeatherAlt, FaBookOpen, FaStar, FaGraduationCap } from 'react-icons/fa';

import { 
  FiHome, 
  FiUsers, 
  FiBook, 
  FiCalendar,
  FiFileText,
  FiLogOut,
  FiMenu,
  FiUser,
  FiMail,
  FiDollarSign,
  FiUserPlus,
  FiImage,
  FiShield,
  FiMessageCircle,
  FiInfo,
  FiTrendingUp,
  FiAward,
  FiClipboard,
  FiMonitor,
  FiSmartphone,
  FiArrowLeft,
  FiArchive,
  FiMessageSquare,
} from 'react-icons/fi';
import { 
  IoStatsChart,
  IoPeopleCircle,
  IoNewspaper,
  IoSparkles,
  IoSchoolOutline,
} from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'sonner'; // Changed to sonner

// Import components
import AdminSidebar from '../components/sidebar/page';
import DashboardOverview from '../components/dashbaord/page';
import AssignmentsManager from '../components/AssignmentsManager/page';
import NewsEventsManager from '../components/eventsandnews/page';
import StaffManager from '../components/staff/page';
import SubscriberManager from '../components/subscriber/page';
import EmailManager from '../components/email/page';
import GalleryManager from '../components/gallery/page';
import AdminManager from '../components/adminsandprofile/page';
import GuidanceCounselingTab from '../components/guidance/page';
import SchoolInfoTab from '../components/schoolinfo/page';
import ApplicationsManager from '../components/applications/page';
import Resources from '../components/resources/page';
import Careers from "../components/career/page";
import Student from "../components/student/page";
import Fees from "../components/fees/page";
import SchoolDocs from "../components/schooldocuments/page";
import SMSManager from "../components/sms/page";
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [realStats, setRealStats] = useState({
    totalStaff: 0,
    totalSubscribers: 0,
    upcomingEvents: 0,
    totalNews: 0,
    activeAssignments: 0,
    galleryItems: 0,
    guidanceSessions: 0,
    totalApplications: 0,
    pendingApplications: 0,
    Resources: 0,
    Careers: 0,
    totalStudent: 0,

    totalFees: 0,
  });

  const router = useRouter();

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      if (mobile) {
        setShowMobileWarning(true);
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Generate device fingerprint
  const generateDeviceFingerprint = () => {
    const fingerprint = {
      userAgent: navigator.userAgent,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
        pixelRatio: window.devicePixelRatio
      },
      language: navigator.language || navigator.userLanguage,
      platform: navigator.platform,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      languages: navigator.languages
    };

    return {
      raw: fingerprint,
      hash: hashFingerprint(fingerprint)
    };
  };

  // Hash fingerprint
  const hashFingerprint = (fingerprint) => {
    const str = JSON.stringify(fingerprint);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  };

  // Device Token Validation Functions
  class DeviceTokenManager {
    static KEYS = {
      DEVICE_TOKEN: 'device_token',
      DEVICE_FINGERPRINT: 'device_fingerprint',
      LOGIN_COUNT: 'login_count',
      LAST_LOGIN: 'last_login'
    };

    // Validate both admin token and device token
    static validateTokens() {
      try {
        // Check admin token
        const adminToken = localStorage.getItem('admin_token');
        if (!adminToken) {
          console.log('❌ Admin token not found');
          return { valid: false, reason: 'no_admin_token' };
        }

        // Check device token
        const deviceToken = localStorage.getItem(this.KEYS.DEVICE_TOKEN);
        if (!deviceToken) {
          console.log('❌ Device token not found');
          return { valid: false, reason: 'no_device_token' };
        }

        // Validate admin token format
        const adminParts = adminToken.split('.');
        if (adminParts.length !== 3) {
          console.log('❌ Invalid admin token format');
          return { valid: false, reason: 'invalid_admin_token_format' };
        }

        // Validate device token
        const deviceValid = this.validateDeviceToken(deviceToken);
        if (!deviceValid.valid) {
          console.log('❌ Device token invalid:', deviceValid.reason);
          return { 
            valid: false, 
            reason: `device_${deviceValid.reason}`,
            details: deviceValid 
          };
        }

        // Generate current device fingerprint
        const currentFingerprint = generateDeviceFingerprint();
        const storedFingerprint = localStorage.getItem(this.KEYS.DEVICE_FINGERPRINT);
        
        if (storedFingerprint !== currentFingerprint.hash) {
          console.log('❌ Device fingerprint mismatch');
          return { valid: false, reason: 'device_fingerprint_mismatch' };
        }

        const loginCount = parseInt(localStorage.getItem(this.KEYS.LOGIN_COUNT) || '0');
        if (loginCount >= 50) {
          console.log('⚠️ High login count detected:', loginCount);
        }

        console.log('✅ Both tokens are valid');
        return { 
          valid: true, 
          adminToken: adminToken,
          deviceToken: deviceToken,
          loginCount: loginCount,
          deviceInfo: deviceValid.payload
        };

      } catch (error) {
        console.error('❌ Token validation error:', error);
        return { valid: false, reason: 'validation_error', error: error.message };
      }
    }

    // Validate device token
    static validateDeviceToken(token) {
      try {
        const payloadStr = decodeURIComponent(escape(atob(token)));
        const payload = JSON.parse(payloadStr);
        
        if (payload.exp * 1000 <= Date.now()) {
          return { valid: false, reason: 'expired', payload };
        }
        
        const createdAt = new Date(payload.createdAt || payload.iat * 1000);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        
        if (createdAt < thirtyDaysAgo) {
          return { valid: false, reason: 'age_expired', payload };
        }
        
        return { valid: true, payload };
      } catch (error) {
        return { valid: false, reason: 'invalid_format', error: error.message };
      }
    }

    // Clear all tokens
    static clearAllTokens() {
      try {
        const adminKeys = ['admin_token', 'admin_user'];
        adminKeys.forEach(key => localStorage.removeItem(key));
        
        Object.values(this.KEYS).forEach(key => localStorage.removeItem(key));
        
        console.log('✅ All tokens cleared');
        return true;
      } catch (error) {
        console.error('❌ Error clearing tokens:', error);
        return false;
      }
    }
  }

  // Mobile Warning Modal Component
  const MobileWarningModal = () => (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-[100] flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700 shadow-2xl overflow-hidden animate-scale-in">
        <div className="p-6 sm:p-8 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">


              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FiSmartphone className="text-xl text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Mobile Access Detected</h3>
                <p className="text-gray-400 text-sm">Limited Space</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-blue-900/30 rounded-xl border border-blue-800/50">
            <FiMonitor className="text-blue-400 text-lg" />
            <p className="text-blue-300 text-sm">
              <span className="font-semibold">Recommendation:</span> Use a desktop for the best experience
            </p>
          </div>
        </div>
        
        <div className="p-6 sm:p-8">
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <FiSmartphone className="text-red-400 text-xs" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Limited Features</h4>
                <p className="text-gray-400 text-sm">
                  Some admin features are optimized for desktop and may not work properly on mobile.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <FiMonitor className="text-green-400 text-xs" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Desktop Recommended</h4>
                <p className="text-gray-400 text-sm">
                  For full functionality, data management, and better navigation.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <IoSparkles className="text-yellow-400 text-xs" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Go Back</h4>
                <p className="text-gray-400 text-sm">
                  Return to the previous page to review or change your settings and Navigate it with the Desktop or Laptop.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 mb-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-gray-400 text-xs mb-1">Screen Width</p>
                <p className="text-white font-bold">{window.innerWidth}px</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Device Type</p>
                <p className="text-white font-bold">Mobile Phone</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-gray-900/50 border-t border-gray-800 space-y-4">
          <div className="flex justify-center">
            <button
              onClick={() => router.back()}
              className="group flex items-center gap-2 px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-full border border-gray-700 transition-all  shadow-lg"
            >
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-bold">Go Back</span>
            </button>
          </div>

          <p className="text-gray-500 text-[10px] sm:text-xs text-center max-w-xs mx-auto leading-relaxed">
            For optimal experience, use a device with screen width greater than 768px
          </p>
        </div>
      </div>
    </div>
  );






const LoadingSpinner = () => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState(0);
  
  const loadingMessages = [
    "Loading your Student Portal...",
    "Fetching your academic dashboard...",
    "Preparing your personalized resources...",
    "Syncing your progress and results..."
  ];

  useEffect(() => {
    const textInterval = setInterval(() => {
      setLoadingText((prev) => (prev + 1) % loadingMessages.length);
    }, 400);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 30);

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-rose-50 via-white to-emerald-50 z-50 flex items-center justify-center overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Soft gradient orbs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-rose-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-r from-emerald-300/20 to-teal-300/20 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-300/10 via-rose-300/10 to-emerald-300/10 rounded-full blur-3xl animate-spin-slow"></div>
        
        {/* Floating icons */}
        <div className="absolute inset-0 opacity-40">
          {[...Array(8)].map((_, i) => {
            let IconComponent;
            if (i % 4 === 0) IconComponent = FaFeatherAlt;
            else if (i % 4 === 1) IconComponent = FaBookOpen;
            else if (i % 4 === 2) IconComponent = FaStar;
            else IconComponent = FaGraduationCap;
            return (
              <div
                key={i}
                className="absolute text-2xl text-emerald-400 opacity-70"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float-petal ${8 + Math.random() * 6}s ease-in-out infinite`,
                  animationDelay: `${i * 0.5}s`,
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
              >
                <IconComponent />
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md px-6">
        
        {/* Logo Section */}
        <div className="relative mb-8">
          {/* Outer rotating ring */}
          <div className="absolute -inset-4 border-2 border-dashed border-rose-300/50 rounded-full animate-spin-slow"></div>
          
          {/* Pulsing ring */}
          <div className="absolute -inset-2 border border-emerald-300/40 rounded-full animate-pulse"></div>
          
          {/* Logo Container */}
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-rose-500 via-pink-500 to-emerald-500 p-0.5 shadow-2xl">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white/20"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              
              {/* Animated spinner inside logo */}
              <svg className="w-16 h-16" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                  className="opacity-20"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="url(#spinnerGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="220"
                  strokeDashoffset={220 - (220 * progress) / 100}
                  className="transition-all duration-300"
                  transform="rotate(-90 50 50)"
                />
                <defs>
                  <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="50%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Center dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-gradient-to-r from-rose-400 to-emerald-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* School Name */}
        <div className="text-center mb-3">
          <h2 className="text-xl md:text-2xl font-serif font-black tracking-wide text-gray-800">
            MATUNGULU GIRLS'
          </h2>
          <p className="text-gray-600 text-[10px] md:text-xs tracking-[0.3em] font-medium mt-1">
            SENIOR SCHOOL
          </p>
        </div>

        {/* Motto */}
        <div className="text-center mb-6">
          <p className="text-base md:text-lg font-serif italic tracking-wide text-gray-700">
            "Strive to Excel"
          </p>
        </div>

        {/* Loading Message */}
        <div className="h-8 flex items-center justify-center mb-4">
          <p className="text-gray-600 text-sm md:text-base font-medium tracking-wide">
            {loadingMessages[loadingText]}
            <span className="inline-flex ml-1">
              <span className="animate-bounce" style={{ animationDelay: '0s' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
            </span>
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-48 md:w-64 h-0.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-rose-400 via-pink-400 to-emerald-400 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          </div>
        </div>

        {/* Decorative dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 bg-gradient-to-r from-rose-400 to-emerald-400 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>

        {/* Bottom decorative elements */}
        <div className="absolute bottom-8 flex items-center gap-6">
          {[FaGraduationCap, FaBookOpen, FaStar, FaFeatherAlt].map((Icon, i) => (
            <span 
              key={i}
              className="text-emerald-400 text-lg opacity-60"
              style={{ 
                animation: `float-icon ${3 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`
              }}
            >
              <Icon />
            </span>
          ))}
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes float-petal {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg); 
            opacity: 0.3; 
          }
          25% { 
            transform: translateY(-20px) translateX(10px) rotate(90deg); 
            opacity: 0.6; 
          }
          50% { 
            transform: translateY(-40px) translateX(-5px) rotate(180deg); 
            opacity: 0.4; 
          }
          75% { 
            transform: translateY(-20px) translateX(-15px) rotate(270deg); 
            opacity: 0.6; 
          }
        }
        
        @keyframes float-icon {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 30s linear infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-bounce {
          animation: bounce 0.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};


  // Fetch student count
  const fetchStudentCount = async () => {
    try {
      const response = await fetch('/api/studentupload?action=stats');
      if (!response.ok) {
        console.error('Failed to fetch student stats');
        return 0;
      }
      
      const data = await response.json();
      
      if (data.success) {
        if (data.data?.stats?.totalStudents) {
          return data.data.stats.totalStudents;
        } else if (data.stats?.totalStudents) {
          return data.stats.totalStudents;
        } else if (data.totalStudents) {
          return data.totalStudents;
        }
      }
      
      const allStudentsRes = await fetch('/api/studentupload');
      if (allStudentsRes.ok) {
        const allStudentsData = await allStudentsRes.json();
        if (allStudentsData.success) {
          const students = allStudentsData.data?.students || allStudentsData.students || [];
          return students.length;
        }
      }
      
      return 0;
    } catch (error) {
      console.error('Error fetching student count:', error);
      return 0;
    }
  };

  // Fetch real counts from all APIs
  const fetchRealCounts = async () => {
    try {
      const studentCount = await fetchStudentCount();
      
      const [
        staffRes,
        subscribersRes,
        eventsRes,
        newsRes,
        assignmentsRes,
        galleryRes,
        guidanceRes,
        admissionsRes,
        resourcesRes,
        careersRes,
        studentRes,
        feesRes,
        schooldocumentsRes,
        smsRes
      ] = await Promise.allSettled([
        fetch('/api/SchoolTeam'),
        fetch('/api/subscriber'),
        fetch('/api/events'),
        fetch('/api/news'),
        fetch('/api/assignment'),
        fetch('/api/gallery'),
        fetch('/api/guidance'),
        fetch('/api/sms'),
        fetch('/api/applyadmission'),
        fetch('/api/resources'),
        fetch('/api/career'),
        fetch('/api/studentupload'),
        fetch('/api/feebalances'),
        fetch('/api/schooldocuments')
      ]);

      const staff = staffRes.status === 'fulfilled' ? await staffRes.value.json() : { staff: [] };
      const subscribers = subscribersRes.status === 'fulfilled' ? await subscribersRes.value.json() : { subscribers: [] };
      const events = eventsRes.status === 'fulfilled' ? await eventsRes.value.json() : { events: [] };
      const news = newsRes.status === 'fulfilled' ? await newsRes.value.json() : { news: [] };
      const assignments = assignmentsRes.status === 'fulfilled' ? await assignmentsRes.value.json() : { assignments: [] };
      const gallery = galleryRes.status === 'fulfilled' ? await galleryRes.value.json() : { galleries: [] };
      const guidance = guidanceRes.status === 'fulfilled' ? await guidanceRes.value.json() : { events: [] };
      const admissions = admissionsRes.status === 'fulfilled' ? await admissionsRes.value.json() : { applications: [] };
      const resources = resourcesRes.status === 'fulfilled' ? await resourcesRes.value.json() : { resources: [] };
      const careers = careersRes.status === 'fulfilled' ? await careersRes.value.json() : { careers: [] };
      const student = studentRes.status === 'fulfilled' ? await studentRes.value.json() : { students: [] };
      const fees = feesRes.status === 'fulfilled' ? await feesRes.value.json() : { feebalances: [] };
      const schoolDocs = schooldocumentsRes.status === 'fulfilled' ? await schooldocumentsRes.value.json() : { documents: [] };
      const sms = smsRes.status === 'fulfilled' ? await smsRes.value.json() : { sms: [] };

      
      const upcomingEvents = events.events?.filter(e => new Date(e.eventDate) >= new Date()).length || 0;
      const activeAssignments = assignments.assignments?.filter(a => a.status === 'assigned').length || 0;
      const admissionsData = admissions.applications || [];
      const pendingApps = admissionsData.filter(app => app.status === 'PENDING').length || 0;

      setRealStats({
        totalStaff: staff.staff?.length || 0,
        totalSubscribers: subscribers.subscribers?.length || 0,
        upcomingEvents,
        totalNews: news.news?.length || 0,
        activeAssignments,
        galleryItems: gallery.galleries?.length || 0,
        guidanceSessions: guidance.events?.length || 0,
        totalApplications: admissionsData.length || 0,
        pendingApplications: pendingApps,
        Resources: resources.resources?.length || 0,
        sms: sms.sms?.length || 0,
        Careers: careers.careers?.length || 0,
        totalStudent: student.students?.length || 0,
        totalFees: fees.feebalances?.length || 0,
        schooldocuments: schoolDocs.documents?.length || 0
      });

    } catch (error) {
      console.error('Error fetching real counts:', error);
    }
  };

useEffect(() => {
  const initializeDashboard = async () => {
    setLoading(true);
    
    try {
      console.log('🔍 Starting dashboard initialization...');
      
      const possibleUserKeys = ['admin_user', 'user', 'currentUser', 'auth_user'];
      const possibleAdminTokenKeys = ['admin_token', 'token', 'auth_token', 'jwt_token'];
      const deviceTokenKeys = ['device_token', 'deviceToken'];
      const deviceFingerprintKeys = ['device_fingerprint', 'deviceFingerprint'];
      
      let userData = null;
      let adminToken = null;
      let deviceToken = null;
      let deviceFingerprint = null;
      
      // Find user data
      for (const key of possibleUserKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          console.log(`✅ Found user data in key: ${key}`);
          userData = data;
          break;
        }
      }
      
      // Find admin token
      for (const key of possibleAdminTokenKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          console.log(`✅ Found admin token in key: ${key}`);
          adminToken = data;
          break;
        }
      }
      
      // Find device token (optional for dashboard)
      for (const key of deviceTokenKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          console.log(`✅ Found device token in key: ${key}`);
          deviceToken = data;
          break;
        }
      }
      
      // Find device fingerprint (optional for dashboard)
      for (const key of deviceFingerprintKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          console.log(`✅ Found device fingerprint in key: ${key}`);
          deviceFingerprint = data;
          break;
        }
      }
      
      // ==============================================
      // 1. CHECK ADMIN TOKEN (PRIMARY - REQUIRED)
      // ==============================================
      if (!adminToken) {
        console.log('❌ No admin token found');
        toast.error('Authentication required. Please login again.');
        
        // Clear only authentication data
        possibleUserKeys.forEach(key => localStorage.removeItem(key));
        possibleAdminTokenKeys.forEach(key => localStorage.removeItem(key));
        window.location.href = '/pages/adminLogin';
        return;
      }
      
      // Parse and validate admin token (12-hour expiry)
      let adminTokenPayload = null;
      try {
        const tokenParts = adminToken.split('.');
        if (tokenParts.length !== 3) {
          throw new Error('Invalid JWT format');
        }
        
        // Decode the payload (middle part of JWT)
        adminTokenPayload = JSON.parse(atob(tokenParts[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        
        console.log('🔑 Admin token details:', {
          expiresAt: new Date(adminTokenPayload.exp * 1000).toLocaleString(),
          issuedAt: new Date(adminTokenPayload.iat * 1000).toLocaleString(),
          expiresInHours: ((adminTokenPayload.exp - currentTime) / 3600).toFixed(2),
          userRole: adminTokenPayload.role,
          userId: adminTokenPayload.userId
        });
        
        if (adminTokenPayload.exp < currentTime) {
          console.log('❌ Admin token expired');
          toast.error('Session expired. Please login again.');
          
          // Clear only authentication data
          possibleUserKeys.forEach(key => localStorage.removeItem(key));
          possibleAdminTokenKeys.forEach(key => localStorage.removeItem(key));
          window.location.href = '/pages/adminLogin';
          return;
        }
        
        console.log('✅ Admin token is valid (12-hour expiry)');
      } catch (tokenError) {
        console.log('⚠️ Admin token validation error:', tokenError.message);
        toast.error('Invalid authentication. Please login again.');
        
        // Clear only authentication data
        possibleUserKeys.forEach(key => localStorage.removeItem(key));
        possibleAdminTokenKeys.forEach(key => localStorage.removeItem(key));
        window.location.href = '/pages/adminLogin';
        return;
      }
      
      // ==============================================
      // 2. CHECK USER DATA (REQUIRED)
      // ==============================================
      if (!userData) {
        console.log('❌ No user data found in localStorage');
        toast.error('Please login to access the dashboard');
        window.location.href = '/pages/adminLogin';
        return;
      }
      
      // Parse user data
      let user;
      try {
        user = JSON.parse(userData);
        console.log('📋 Parsed user data:', {
          name: user.name,
          email: user.email,
          role: user.role
        });
      } catch (parseError) {
        console.log('❌ Error parsing user data:', parseError);
        toast.error('Invalid user data. Please login again.');
        window.location.href = '/pages/adminLogin';
        return;
      }
      
      // ==============================================
      // 3. VERIFY USER ROLE (REQUIRED)
      // ==============================================
      const userRole = user.role;
      const validRoles = ['ADMIN', 'SUPER_ADMIN', 'administrator', 'TEACHER', 'PRINCIPAL'];
      
      if (!userRole || !validRoles.includes(userRole.toUpperCase())) {
        console.log('❌ User does not have valid role:', userRole);
        toast.error('Unauthorized access. Please login with admin credentials.');
        
        possibleUserKeys.forEach(key => localStorage.removeItem(key));
        possibleAdminTokenKeys.forEach(key => localStorage.removeItem(key));
        window.location.href = '/pages/adminLogin';
        return;
      }
      
      console.log('✅ User role verified:', userRole);
      
      // ==============================================
      // 4. CHECK DEVICE TOKEN (OPTIONAL - FOR INFO ONLY)
      // ==============================================
      // Device token is only for login verification, not required for dashboard access
      if (deviceToken) {
        try {
          // Decode device token (could be JWT or base64)
          let devicePayload;
          if (deviceToken.includes('.')) {
            // JWT format
            const deviceParts = deviceToken.split('.');
            if (deviceParts.length === 3) {
              devicePayload = JSON.parse(atob(deviceParts[1]));
            }
          } else {
            // Base64 format
            try {
              const decodedStr = atob(deviceToken);
              devicePayload = JSON.parse(decodedStr);
            } catch (e) {
              // Try URL-safe base64
              try {
                const urlSafeToken = deviceToken.replace(/-/g, '+').replace(/_/g, '/');
                const decodedStr = atob(urlSafeToken);
                devicePayload = JSON.parse(decodedStr);
              } catch (e2) {
                console.log('⚠️ Could not decode device token');
                devicePayload = null;
              }
            }
          }
          
          if (devicePayload) {
            console.log('📱 Device token info (optional):', {
              loginCount: devicePayload.loginCount,
              expiresAt: devicePayload.exp ? new Date(devicePayload.exp * 1000).toLocaleString() : 'N/A',
              valid: devicePayload.exp ? (devicePayload.exp * 1000 > Date.now()) : 'Unknown'
            });
          }
          
          // Check device fingerprint if available
          if (deviceFingerprint) {
            const currentFingerprint = generateDeviceFingerprint();
            if (deviceFingerprint !== currentFingerprint.hash) {
              console.log('⚠️ Device fingerprint changed - will be caught on next login');
              // Don't redirect - admin token is still valid
            } else {
              console.log('✅ Device fingerprint matches');
            }
          }
          
        } catch (deviceError) {
          console.log('⚠️ Device token check error (non-critical):', deviceError.message);
          // Continue - device token is not required for dashboard access
        }
      } else {
        console.log('ℹ️ No device token found - not required for dashboard access');
      }
      
      // ==============================================
      // 5. STORE DASHBOARD ACCESS TIMESTAMP
      // ==============================================
      localStorage.setItem('last_dashboard_access', new Date().toISOString());
      
      // ==============================================
      // 6. SUCCESS - SET USER STATE
      // ==============================================
      console.log('✅ User authenticated successfully:', user.name);
      console.log('✅ Admin token validated (12-hour expiry)');
      
      const loginCount = parseInt(localStorage.getItem('login_count') || '0');
      console.log('📱 Security audit:', {
        user: user.name,
        role: user.role,
        adminTokenExpiry: new Date(adminTokenPayload.exp * 1000).toLocaleString(),
        deviceLoginCount: loginCount,
        lastLogin: localStorage.getItem('last_login'),
        dashboardAccess: new Date().toISOString()
      });
      
      setUser(user);
      
      // ==============================================
      // 7. FETCH DASHBOARD STATISTICS
      // ==============================================
      console.log('📊 Fetching dashboard statistics...');
      await fetchRealCounts();
      
      toast.success(`Welcome back, ${user.name}!`);
      
    } catch (error) {
      console.error('❌ Error initializing dashboard:', error);
      toast.error('Failed to load dashboard. Please try again.');
      
      // Clear only authentication data on error
      const possibleUserKeys = ['admin_user', 'user', 'currentUser', 'auth_user'];
      const possibleAdminTokenKeys = ['admin_token', 'token', 'auth_token', 'jwt_token'];
      
      possibleUserKeys.forEach(key => localStorage.removeItem(key));
      possibleAdminTokenKeys.forEach(key => localStorage.removeItem(key));
      
      window.location.href = '/pages/adminLogin';
      
    } finally {
      setLoading(false);
    }
  };

  initializeDashboard();
}, []);

  // Refresh counts when tab changes
  useEffect(() => {
    if (!loading) {
      fetchRealCounts();
    }
  }, [activeTab]);

const handleLogout = () => {
  toast.loading('Logging out...');
  
  setTimeout(() => {
    try {
      // Save device tokens before clearing session
      const deviceToken = localStorage.getItem('device_token') || 
                         localStorage.getItem('deviceToken');
      const deviceFingerprint = localStorage.getItem('device_fingerprint') || 
                               localStorage.getItem('deviceFingerprint');
      const loginCount = localStorage.getItem('login_count');
      
      // Clear only session data
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      localStorage.removeItem('last_login');
      localStorage.removeItem('last_dashboard_access');
      
      // Restore device tokens (if they existed)
      if (deviceToken) {
        localStorage.setItem('device_token', deviceToken);
      }
      if (deviceFingerprint) {
        localStorage.setItem('device_fingerprint', deviceFingerprint);
      }
      if (loginCount) {
        localStorage.setItem('login_count', loginCount);
      }
      
      toast.success('Logged out. Your device is still recognized.');
      
      setTimeout(() => {
        window.location.href = '/pages/adminLogin';
      }, 500);
      
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
    }
  }, 500);
};


  const renderContent = () => {
    if (loading) return null;

    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'school-info':
        return <SchoolInfoTab />;
      case 'schooldocuments':
        return <SchoolDocs />;
      case 'guidance-counseling':
        return <GuidanceCounselingTab />;
      case 'staff':
        return <StaffManager />;
      case 'assignments':
        return <AssignmentsManager />;
      case 'admissions':
        return <ApplicationsManager />;
      case 'resources':
        return <Resources />; 
      case 'newsevents':
        return <NewsEventsManager />;
      case 'gallery':
        return <GalleryManager />;
      case 'careers':
        return <Careers />; 
        case 'sms':      
          return <SMSManager />;

      case 'subscribers':
        return <SubscriberManager />;
      case 'email':
        return <EmailManager />;
      case 'student':
        return <Student />;  
      case 'fees':
        return <Fees />;
      case 'admins-profile':
        return <AdminManager user={user} />;
      default:
        return <DashboardOverview />;
    }
  };

  // Navigation items without counts
  const navigationItems = [
    { 
      id: 'overview', 
      label: 'Dashboard Overview', 
      icon: FiHome,
      badge: 'primary'
    },
    { 
      id: 'school-info', 
      label: 'School Information', 
      icon: FiInfo,
      badge: 'info'
    },
    { 
      id: 'guidance-counseling', 
      label: 'Guidance Counseling', 
      icon: FiMessageCircle,
      badge: 'purple'
    },
    {
      id: 'schooldocuments',
      label: 'School Documents',
      icon: FiArchive, 
      badge: 'indigo'
    },
    { 
      id: 'staff', 
      label: 'Staff & BOM', 
      icon: IoPeopleCircle,
      badge: 'orange'
    },
    { 
      id: 'assignments', 
      label: 'Assignments', 
      icon: FiBook,
      badge: 'red'
    },
    { 
      id: 'admissions',
      label: 'Admission Applications', 
      icon: FiClipboard,
      badge: 'purple'
    },
    { 
      id: 'resources', 
      label: 'Resources',
      icon: FiFileText,
      badge: 'cyan' 
    },
    {
      id: 'student',
      label: 'Student Records',
      icon: FiInfo,
      badge: 'cyan'
    },
    {
      id: 'fees',
      label: 'Fee Balances',
      icon: FiDollarSign,
      badge: 'yellow'
    },
    {
      id: 'careers',
      label: 'Careers',
      icon: FiCalendar,
      badge: 'lime'
    },
    { 
      id: 'sms',
      label: 'SMS Management',
      icon: FiMessageSquare,
      badge: 'orange'
    },
    { 
      id: 'newsevents', 
      label: 'News & Events', 
      icon: IoNewspaper,
      badge: 'yellow'
    },
    { 
      id: 'gallery', 
      label: 'Media Gallery', 
      icon: FiImage,
      badge: 'pink'
    },
    { 
      id: 'subscribers', 
      label: 'Subscribers', 
      icon: FiUserPlus,
      badge: 'teal'
    },
    { 
      id: 'email', 
      label: 'Email Campaigns', 
      icon: FiMail,
      badge: 'indigo'
    },
    { 
      id: 'admins-profile', 
      label: 'Admins & Profile', 
      icon: FiShield,
      badge: 'gray'
    },
  ];

  const CompactSchoolHeader = () => {
    return (
      <div className="group cursor-default py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="h-10 w-1 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full shadow-sm " />

          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl font-black text-gray-900 tracking-tight leading-none uppercase italic">
              Matungulu Girls <span className="text-blue-600 group-hover:text-indigo-600 transition-colors">High</span>
            </h1>
            
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">
                  School
              </span>
              <div className="h-[1px] w-4 bg-gray-200" />
              <p className="text-[10px] md:text-xs font-bold text-gray-500 italic">
                "Strive to Excel"
              </p>
            </div>
          </div>

          <IoSparkles className="hidden md:block text-yellow-400 text-sm opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500" />
        </div>
      </div>
    );
  };

  // Show loading screen
  if (loading) {
    return <LoadingSpinner />;
  }

  // If no user but loading is false, it means we're redirecting
  if (!user) {
    return null;
  }

  return (
    < >
  <div className="w-full h-full">
    
      {/* Add Sonner Toaster */}
      <Toaster 
        position="top-right"
        expand={false}
        richColors
        closeButton
      />
      
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 overflow-hidden">
      {showMobileWarning && <MobileWarningModal />}
        
        {/* Sidebar */}
        <AdminSidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          tabs={navigationItems}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          {/* Top Header */}
          <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 z-30">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-3 rounded-2xl hover:bg-gray-100 transition-all duration-200"
                >
                  <FiMenu className="text-xl text-gray-600" />
                </button>
                
                <div className="flex items-center gap-4">
                  <div className="hidden lg:flex w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl items-center justify-center shadow-lg">
                    <FiAward className="text-xl text-white" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Quick Stats - Hidden on small screens */}
                <div className="hidden md:flex items-center gap-6">
                  <CompactSchoolHeader/>
                </div>

                {/* User Menu */}
                <div className="flex items-center gap-3">
                  <div className="hidden lg:flex flex-col items-end justify-center">
                    <span className="text-sm font-bold text-slate-900 tracking-tight leading-none mb-1">
                      {user?.name?.split(' ')[0]}
                    </span>

                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-100 shadow-sm">
                      <IoSparkles className="text-amber-500 text-[10px] animate-pulse" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700">
                        {user?.role?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg cursor-pointer hover:opacity-90 transition-opacity duration-200">
                      {user?.name?.charAt(0) || 'A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto bg-transparent [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="h-full">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
      </div>
    </>
  );
}

// Add CSS animations
const styles = `
  @keyframes scale-in {
    0% {
      opacity: 0;
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-scale-in {
    animation: scale-in 0.3s ease-out forwards;
  }
`;

// Add styles to head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}